import { TimeSlot, DayOfWeek, TutoringSession } from '../../foundation/types';
import { isTimeSlotOverlapping } from '../../foundation/helpers';

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  conflictingSession?: TutoringSession;
  slotMatch?: TimeSlot;
  reason?: string;
}

/**
 * Checks if a mentor is available for a requested session window,
 * cross-referencing defined availability schedule and confirmed/pending sessions.
 */
export function checkMentorAvailability(
  mentorAvailability: TimeSlot[],
  existingSessions: TutoringSession[],
  targetDate: string,
  startTime: string,
  durationMinutes: number
): AvailabilityCheckResult {
  const dateObj = new Date(targetDate);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;

  // Calculate requested end time
  const [startH, startM] = startTime.split(':').map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = startTotal + durationMinutes;
  const endH = Math.floor(endTotal / 60) % 24;
  const endM = endTotal % 60;
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  // Check matching slot in recurring schedule
  const matchingSlot = mentorAvailability.find(slot => {
    if (slot.dayOfWeek !== dayOfWeek) return false;
    return slot.startTime <= startTime && slot.endTime >= endTime;
  });

  // Check for conflicts with accepted or pending sessions on that date
  const conflictingSession = existingSessions.find(sess => {
    if (sess.date !== targetDate) return false;
    if (sess.status === 'cancelled' || sess.status === 'rejected') return false;

    const [sH, sM] = sess.startTime.split(':').map(Number);
    const sStart = sH * 60 + sM;
    const sEnd = sStart + sess.duration;
    const sessEndTime = `${String(Math.floor(sEnd / 60) % 24).padStart(2, '0')}:${String(sEnd % 60).padStart(2, '0')}`;

    return isTimeSlotOverlapping(startTime, endTime, sess.startTime, sessEndTime);
  });

  if (conflictingSession) {
    return {
      isAvailable: false,
      conflictingSession,
      reason: `Slot overlaps with an existing session (${conflictingSession.topic} at ${conflictingSession.startTime})`,
    };
  }

  if (!matchingSlot && mentorAvailability.length > 0) {
    return {
      isAvailable: true,
      reason: `Requested time is outside regular working slots for ${dayOfWeek}, but no conflicting session exists.`,
    };
  }

  return {
    isAvailable: true,
    slotMatch: matchingSlot,
    reason: 'Mentor is fully available at this time.',
  };
}

/**
 * Generates available 30/60 minute bookable slot recommendations for a given day.
 */
export function generateBookableSlots(
  daySlots: TimeSlot[],
  existingSessions: TutoringSession[],
  targetDate: string,
  slotDurationMinutes: number = 60
): string[] {
  const availableSlots: string[] = [];

  for (const slot of daySlots) {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const slotStartTotal = startH * 60 + startM;
    const slotEndTotal = endH * 60 + endM;

    for (let current = slotStartTotal; current + slotDurationMinutes <= slotEndTotal; current += 30) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      const res = checkMentorAvailability(daySlots, existingSessions, targetDate, timeStr, slotDurationMinutes);
      if (res.isAvailable && !res.conflictingSession) {
        availableSlots.push(timeStr);
      }
    }
  }

  return Array.from(new Set(availableSlots)).sort();
}
