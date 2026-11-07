import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

function checkTimeConflict(
  newDate: string,
  newStart: string,
  newDuration: number,
  existingDate: string,
  existingStart: string,
  existingDuration: number
): boolean {
  if (newDate !== existingDate) return false;

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const start1 = toMinutes(newStart);
  const end1 = start1 + newDuration;
  const start2 = toMinutes(existingStart);
  const end2 = start2 + existingDuration;

  // Overlap condition: start1 < end2 && end1 > start2
  return start1 < end2 && end1 > start2;
}

function generateIcsString(session: {
  id: string;
  topic: string;
  sessionDate: Date;
  startTime: string;
  duration: number;
  mentorName: string;
  menteeName: string;
}): string {
  const [h, m] = session.startTime.split(':').map(Number);
  const startUtc = new Date(session.sessionDate);
  startUtc.setHours(h || 10, m || 0, 0, 0);
  const endUtc = new Date(startUtc.getTime() + session.duration * 60000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SkillBridge Campus//Mentorship Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:session-${session.id}@skillbridge.campus`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startUtc)}`,
    `DTEND:${formatIcsDate(endUtc)}`,
    `SUMMARY:SkillBridge Session: ${session.topic}`,
    `DESCRIPTION:Tutoring session between ${session.mentorName} and ${session.menteeName}.`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

describe('Mentorship Journey & Conflict Prevention Suite', () => {
  test('Double booking conflict detection correctly flags overlapping slots on same date', () => {
    // Session 1: 10:00 to 11:00 (60 min)
    // Session 2: 10:30 to 11:30 (overlaps by 30 min)
    const hasOverlap1 = checkTimeConflict(
      '2026-11-15', '10:30', 60,
      '2026-11-15', '10:00', 60
    );
    assert.strictEqual(hasOverlap1, true, 'Overlapping slots on same date must be detected as conflict');

    // Session 3: 11:00 to 12:00 (back-to-back, does NOT overlap)
    const hasOverlap2 = checkTimeConflict(
      '2026-11-15', '11:00', 60,
      '2026-11-15', '10:00', 60
    );
    assert.strictEqual(hasOverlap2, false, 'Back-to-back slot must not be flagged as conflict');

    // Session 4: Same time on different date (does NOT overlap)
    const hasOverlap3 = checkTimeConflict(
      '2026-11-16', '10:00', 60,
      '2026-11-15', '10:00', 60
    );
    assert.strictEqual(hasOverlap3, false, 'Sessions on different dates cannot conflict');
  });

  test('RFC 5545 iCalendar ICS format contains required calendar properties', () => {
    const session = {
      id: 'test-session-123',
      topic: 'Power Electronics & MATLAB',
      sessionDate: new Date('2026-11-20T00:00:00.000Z'),
      startTime: '14:30',
      duration: 60,
      mentorName: 'Rohit Gupta',
      menteeName: 'Vidya Gupta',
    };

    const ics = generateIcsString(session);

    assert.ok(ics.includes('BEGIN:VCALENDAR'), 'Missing VCALENDAR block');
    assert.ok(ics.includes('BEGIN:VEVENT'), 'Missing VEVENT block');
    assert.ok(ics.includes('UID:session-test-session-123@skillbridge.campus'), 'Missing UID');
    assert.ok(ics.includes('SUMMARY:SkillBridge Session: Power Electronics & MATLAB'), 'Missing Summary');
    assert.ok(ics.includes('STATUS:CONFIRMED'), 'Missing Status');
    assert.ok(ics.includes('END:VEVENT'), 'Missing VEVENT end');
    assert.ok(ics.includes('END:VCALENDAR'), 'Missing VCALENDAR end');
  });

  test('Session status authorization rules', () => {
    const session = {
      id: 'sess-1',
      mentorId: 'user-mentor-1',
      menteeId: 'user-mentee-1',
      status: 'PENDING',
    };

    const canAccept = (userId: string) => userId === session.mentorId;
    const canCancel = (userId: string) => userId === session.mentorId || userId === session.menteeId;
    const canDecline = (userId: string) => userId === session.mentorId;

    // Mentor can accept
    assert.strictEqual(canAccept('user-mentor-1'), true);
    // Mentee cannot accept their own request
    assert.strictEqual(canAccept('user-mentee-1'), false);
    // Unrelated user cannot accept
    assert.strictEqual(canAccept('unrelated-user'), false);

    // Both participants can cancel
    assert.strictEqual(canCancel('user-mentor-1'), true);
    assert.strictEqual(canCancel('user-mentee-1'), true);
    assert.strictEqual(canCancel('unrelated-user'), false);
  });
});
