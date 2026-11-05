import { TutoringSession, SessionStatus } from '../../foundation/types';

export interface SessionTransitionResult {
  allowed: boolean;
  newStatus?: SessionStatus;
  errorMessage?: string;
}

/**
 * Validates state machine transitions for tutoring sessions.
 * pending -> accepted | rejected | cancelled
 * accepted -> completed | cancelled
 * completed -> (terminal)
 * rejected -> (terminal)
 * cancelled -> (terminal)
 */
export function validateSessionTransition(
  currentStatus: SessionStatus,
  action: 'accept' | 'reject' | 'cancel' | 'complete',
  actorRole: 'mentor' | 'mentee' | 'admin'
): SessionTransitionResult {
  switch (action) {
    case 'accept':
      if (currentStatus !== 'pending') {
        return { allowed: false, errorMessage: 'Only pending sessions can be accepted.' };
      }
      if (actorRole !== 'mentor' && actorRole !== 'admin') {
        return { allowed: false, errorMessage: 'Only mentors can accept session requests.' };
      }
      return { allowed: true, newStatus: 'accepted' };

    case 'reject':
      if (currentStatus !== 'pending') {
        return { allowed: false, errorMessage: 'Only pending sessions can be rejected.' };
      }
      if (actorRole !== 'mentor' && actorRole !== 'admin') {
        return { allowed: false, errorMessage: 'Only mentors can reject session requests.' };
      }
      return { allowed: true, newStatus: 'rejected' };

    case 'complete':
      if (currentStatus !== 'accepted') {
        return { allowed: false, errorMessage: 'Only accepted sessions can be marked completed.' };
      }
      return { allowed: true, newStatus: 'completed' };

    case 'cancel':
      if (currentStatus !== 'pending' && currentStatus !== 'accepted') {
        return { allowed: false, errorMessage: 'This session cannot be cancelled in its current state.' };
      }
      return { allowed: true, newStatus: 'cancelled' };

    default:
      return { allowed: false, errorMessage: 'Unrecognized action.' };
  }
}

/**
 * Filters sessions into categorized buckets:
 * - Upcoming
 * - Pending approval
 * - Needs review (completed, without review from mentee)
 * - Archived (rejected / cancelled / reviewed)
 */
export function categorizeSessions(sessions: TutoringSession[], userId: string) {
  const now = new Date();

  return {
    upcoming: sessions.filter(s => s.status === 'accepted' && new Date(s.date) >= now),
    pending: sessions.filter(s => s.status === 'pending'),
    completed: sessions.filter(s => s.status === 'completed'),
    cancelled: sessions.filter(s => s.status === 'cancelled' || s.status === 'rejected'),
  };
}
