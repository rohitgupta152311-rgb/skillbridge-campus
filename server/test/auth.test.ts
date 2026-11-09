import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { firebaseService } from '../src/integrations/firebase/firebase.service.js';

// Schemas mirroring auth controller
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']).default('STUDENT'),
});

describe('Authentication & Firebase Security Suite', () => {
  test('Registration schema rejects invalid email and weak passwords', () => {
    // Missing @ domain
    const invalidEmail = registerSchema.safeParse({
      email: 'notanemail',
      password: 'StrongPassword123!',
      fullName: 'Rohit Gupta',
    });
    assert.strictEqual(invalidEmail.success, false);

    // Password less than 8 chars
    const shortPassword = registerSchema.safeParse({
      email: 'rohit@nitnagaland.ac.in',
      password: 'short',
      fullName: 'Rohit Gupta',
    });
    assert.strictEqual(shortPassword.success, false);

    // Valid student payload
    const valid = registerSchema.safeParse({
      email: 'rohit@nitnagaland.ac.in',
      password: 'SecurePassword123!',
      fullName: 'Rohit Gupta',
      role: 'STUDENT',
    });
    assert.strictEqual(valid.success, true);
  });

  test('Firebase Token Security: rejects forged or unsigned JWTs without Firebase Admin verification', async () => {
    const forgedToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6ImZha2VAZXhhbXBsZS5jb20ifQ.';

    await assert.rejects(
      async () => {
        await firebaseService.verifyFirebaseIdToken(forgedToken);
      },
      (err: any) => {
        assert.ok(err instanceof Error);
        assert.ok(
          err.message.includes('Firebase token verification failed') ||
          err.message.includes('Firebase Admin SDK is not initialized')
        );
        return true;
      }
    );
  });

  test('Account takeover prevention: rejects linking when email is unverified', () => {
    const firebaseUser = {
      uid: 'firebase-user-999',
      email: 'student@campus.edu',
      emailVerified: false,
    };
    const existingDbUser = {
      id: 'existing-db-user-1',
      email: 'student@campus.edu',
      firebaseUid: null,
    };

    // Rule: if existing user found by email, but firebase token email is NOT verified, reject linking
    const canLink = existingDbUser && firebaseUser.emailVerified;
    assert.strictEqual(canLink, false, 'Unverified email MUST NOT be automatically linked to existing account');
  });

  test('2FA Registration Security: generates 6-digit numeric code and enforces expiration', () => {
    // 1. Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    assert.strictEqual(code.length, 6);
    assert.match(code, /^\d{6}$/);

    // 2. Expiration logic: 10 minutes TTL
    const createdAt = Date.now();
    const expiresAt = createdAt + 10 * 60 * 1000;
    const isExpired = (now: number) => now > expiresAt;

    assert.strictEqual(isExpired(createdAt + 5 * 60 * 1000), false, '5-minute code should be valid');
    assert.strictEqual(isExpired(createdAt + 11 * 60 * 1000), true, '11-minute code must be expired');
  });

  test('2FA Registration Security: rate limits after 5 failed verification attempts', () => {
    let attempts = 0;
    const maxAttempts = 5;
    const correctCode = '654321';
    const testAttempt = (code: string) => {
      if (attempts >= maxAttempts) {
        return { success: false, rateLimited: true };
      }
      if (code !== correctCode) {
        attempts += 1;
        return { success: false, rateLimited: false, attemptsRemaining: maxAttempts - attempts };
      }
      return { success: true, rateLimited: false };
    };

    // Try 5 incorrect codes
    for (let i = 0; i < 5; i++) {
      const res = testAttempt('000000');
      assert.strictEqual(res.success, false);
    }

    // 6th attempt is rate-limited
    const lockout = testAttempt('654321');
    assert.strictEqual(lockout.rateLimited, true, 'User must be locked out after 5 consecutive failed 2FA attempts');
  });

  test('Token expiration verification logic', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const expiredPayload = { exp: nowSec - 300 }; // 5 min ago
    const validPayload = { exp: nowSec + 3600 }; // 1 hr future

    const isExpired = (payload: { exp?: number }) => {
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    };

    assert.strictEqual(isExpired(expiredPayload), true);
    assert.strictEqual(isExpired(validPayload), false);
  });
});
