import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Real-Time Messaging & Safety Suite', () => {
  test('Conversation participant authorization check', () => {
    const conversation = {
      id: 'conv-100',
      participants: ['student-alice', 'mentor-bob'],
    };

    const isAuthorized = (userId: string) => conversation.participants.includes(userId);

    assert.strictEqual(isAuthorized('student-alice'), true);
    assert.strictEqual(isAuthorized('mentor-bob'), true);
    assert.strictEqual(isAuthorized('eavesdropper-eve'), false, 'Non-participant MUST be rejected from room');
  });

  test('Message content validation rejects empty or whitespace-only strings', () => {
    const validateMessage = (content: unknown): boolean => {
      if (typeof content !== 'string') return false;
      return content.trim().length > 0;
    };

    assert.strictEqual(validateMessage(''), false);
    assert.strictEqual(validateMessage('   '), false);
    assert.strictEqual(validateMessage(null), false);
    assert.strictEqual(validateMessage(undefined), false);
    assert.strictEqual(validateMessage('Hello, ready for our tutoring session?'), true);
  });

  test('User safety report validation', () => {
    const validateReport = (data: {
      reporterId?: string;
      reportedUserId?: string;
      reason?: string;
    }): { valid: boolean; error?: string } => {
      if (!data.reporterId) return { valid: false, error: 'Reporter ID is required' };
      if (!data.reportedUserId) return { valid: false, error: 'Reported user ID is required' };
      if (data.reporterId === data.reportedUserId) {
        return { valid: false, error: 'Cannot report yourself' };
      }
      if (!data.reason || !data.reason.trim()) {
        return { valid: false, error: 'Reason is required' };
      }
      return { valid: true };
    };

    // Valid report
    const valid = validateReport({
      reporterId: 'user-alice',
      reportedUserId: 'user-bob',
      reason: 'Harassment during tutoring call',
    });
    assert.strictEqual(valid.valid, true);

    // Self reporting rejected
    const selfReport = validateReport({
      reporterId: 'user-alice',
      reportedUserId: 'user-alice',
      reason: 'Testing',
    });
    assert.strictEqual(selfReport.valid, false);
    assert.strictEqual(selfReport.error, 'Cannot report yourself');
  });
});
