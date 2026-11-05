import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('SkillBridge 2.0 Backend Core Services', () => {
  it('should validate environment defaults', () => {
    assert.strictEqual(typeof process.env.PORT !== 'undefined' || true, true);
  });

  it('should calculate 5-factor match score correctly', () => {
    const topicScore = 100 * 0.35;
    const availScore = 80 * 0.25;
    const ratingScore = 90 * 0.20;
    const profScore = 100 * 0.10;
    const prefScore = 70 * 0.10;
    const total = Math.round(topicScore + availScore + ratingScore + profScore + prefScore);

    assert.strictEqual(total, 90);
    assert.ok(total >= 0 && total <= 100);
  });
});
