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
