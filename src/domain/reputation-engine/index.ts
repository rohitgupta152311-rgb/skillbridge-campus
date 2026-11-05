import { SessionReview, TutoringSession } from '../../foundation/types';
import { averageOf } from '../../foundation/helpers';

export interface MentorReputationMetrics {
  averageRating: number;
  totalReviews: number;
  completedSessions: number;
  completionRate: number;
  teachingScore: number;
  communicationScore: number;
  knowledgeScore: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  badges: string[];
  reputationTier: 'Master Mentor' | 'Senior Mentor' | 'Rising Mentor' | 'New Mentor';
}

/**
 * Calculates comprehensive mentor reputation based on actual submitted reviews
 * and completed tutoring sessions.
 */
export function calculateMentorReputation(
  reviews: SessionReview[],
  sessions: TutoringSession[]
): MentorReputationMetrics {
  const completed = sessions.filter(s => s.status === 'completed').length;
  const total = sessions.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round(averageOf(reviews.map(r => r.overallRating)) * 10) / 10
    : 0;

  const teachingScore = totalReviews > 0
    ? Math.round(averageOf(reviews.map(r => r.teachingQuality)) * 10) / 10
    : 0;

  const communicationScore = totalReviews > 0
    ? Math.round(averageOf(reviews.map(r => r.communication)) * 10) / 10
    : 0;

  const knowledgeScore = totalReviews > 0
    ? Math.round(averageOf(reviews.map(r => r.subjectKnowledge)) * 10) / 10
    : 0;

  const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  };

  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.overallRating))) as 1 | 2 | 3 | 4 | 5;
    ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
  });

  // Calculate earned badges
  const badges: string[] = [];
  if (completed >= 5) badges.push('Seasoned Tutor');
  if (averageRating >= 4.8 && totalReviews >= 3) badges.push('Top Rated');
  if (knowledgeScore >= 4.9 && totalReviews >= 2) badges.push('Subject Master');
  if (communicationScore >= 4.8 && totalReviews >= 2) badges.push('Clear Communicator');
  if (completionRate >= 95 && total >= 3) badges.push('Reliable Attendance');

  // Determine reputation tier
  let reputationTier: MentorReputationMetrics['reputationTier'] = 'New Mentor';
  if (completed >= 10 && averageRating >= 4.8) {
    reputationTier = 'Master Mentor';
  } else if (completed >= 5 && averageRating >= 4.5) {
    reputationTier = 'Senior Mentor';
  } else if (completed >= 2) {
    reputationTier = 'Rising Mentor';
  }

  return {
    averageRating,
    totalReviews,
    completedSessions: completed,
    completionRate,
    teachingScore,
    communicationScore,
    knowledgeScore,
    ratingDistribution,
    badges,
    reputationTier,
  };
}
