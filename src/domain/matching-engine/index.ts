import {
  User, MentorProfile, MentorExpertise, TimeSlot, MatchingCriteria, MentorMatch,
} from '../../foundation/types';
import { MATCH_WEIGHTS } from '../../foundation/constants';
import { clampScore, averageOf } from '../../foundation/helpers';
import {
  getMentors, getExpertiseByMentor, getAvailabilityByMentor, getReviewsByMentor, getSessionsByUser,
} from '../../infrastructure/local-storage/data-service';

/**
 * Core matching algorithm: computes a weighted match score between a mentee's
 * criteria and each mentor's profile. Every sub-score is normalized to 0–100
 * before combining.
 */

// ─── Sub-score calculators ──────────────────────────────────

function computeTopicRelevance(expertise: MentorExpertise[], topic: string): number {
  if (!topic) return 0;
  const needle = topic.toLowerCase();
  const exact = expertise.find(e => e.topic.toLowerCase() === needle);
  if (exact) return 60 + exact.proficiencyLevel * 8; // 68–100

  // Partial / related match
  const partial = expertise.find(e => e.topic.toLowerCase().includes(needle) || needle.includes(e.topic.toLowerCase()));
  if (partial) return 30 + partial.proficiencyLevel * 6; // 36–60

  // Category match
  const sameCategory = expertise.some(e => {
    const topicWords = needle.split(/\s+/);
    const expWords = e.topic.toLowerCase().split(/\s+/);
    return topicWords.some(w => expWords.includes(w));
  });
  if (sameCategory) return 20;

  return 0; // No match → 0, not a perfect score
}

function computeAvailabilityScore(
  availability: TimeSlot[],
  preferredDays?: string[]
): number {
  if (availability.length === 0) return 20; // Some availability assumed but penalized
  if (!preferredDays || preferredDays.length === 0) {
    // No preference → reward mentors with more availability
    return Math.min(100, 40 + availability.length * 10);
  }
  const availableDays = new Set(availability.map(a => a.dayOfWeek));
  const matchingDays = preferredDays.filter(d => availableDays.has(d as TimeSlot['dayOfWeek']));
  return clampScore((matchingDays.length / preferredDays.length) * 100);
}

function computeRatingScore(reviews: { overallRating: number }[]): number {
  if (reviews.length === 0) return 50; // No reviews → neutral, not perfect
  const avg = averageOf(reviews.map(r => r.overallRating));
  return clampScore(avg * 20); // 1→20, 5→100
}

function computeProficiencyScore(expertise: MentorExpertise[], topic: string): number {
  const needle = topic.toLowerCase();
  const match = expertise.find(e => e.topic.toLowerCase() === needle);
  if (match) return clampScore(match.proficiencyLevel * 20); // 1→20, 5→100
  // Partial match
  const partial = expertise.find(e =>
    e.topic.toLowerCase().includes(needle) || needle.includes(e.topic.toLowerCase())
  );
  if (partial) return clampScore(partial.proficiencyLevel * 15); // reduced weight
  return 0; // No match → 0
}

function computePreferenceScore(
  mentor: User,
  criteria: MatchingCriteria
): number {
  let score = 50; // Base

  // Language match
  if (criteria.preferredLanguage) {
    const hasLanguage = mentor.languages.some(
      l => l.toLowerCase() === criteria.preferredLanguage!.toLowerCase()
    );
    score += hasLanguage ? 25 : -15;
  }

  // Learning preference match
  if (criteria.learningPreferences && criteria.learningPreferences.length > 0) {
    const overlap = criteria.learningPreferences.filter(p =>
      mentor.learningPreferences.includes(p)
    );
    score += (overlap.length / criteria.learningPreferences.length) * 25;
  }

  return clampScore(score);
}

// ─── Main match function ────────────────────────────────────

function generateReasons(
  topicScore: number, availScore: number, ratingScore: number,
  profScore: number, expertise: MentorExpertise[], topic: string,
  mentor: User
): string[] {
  const reasons: string[] = [];
  const match = expertise.find(e => e.topic.toLowerCase() === topic.toLowerCase());

  if (topicScore >= 68) reasons.push(`Expert in ${topic}`);
  else if (topicScore >= 30) reasons.push(`Related knowledge in ${topic}`);

  if (match && match.proficiencyLevel >= 4) reasons.push(`Proficiency: ${match.proficiencyLevel}/5`);
  if (match && match.yearsOfExperience >= 2) reasons.push(`${match.yearsOfExperience} years experience`);

  if (ratingScore >= 80) reasons.push('Highly rated by students');
  if (availScore >= 70) reasons.push('Schedule aligns well');
  if (mentor.year === 'Alumni') reasons.push('Industry experience');

  return reasons.length > 0 ? reasons : ['Available for tutoring'];
}

export function computeMatchScores(
  criteria: MatchingCriteria,
  menteeId?: string
): MentorMatch[] {
  const mentors = getMentors();
  const matches: MentorMatch[] = [];

  for (const mentor of mentors) {
    if (mentor.id === menteeId) continue; // Don't match with self

    const expertise = getExpertiseByMentor(mentor.id);
    const availability = getAvailabilityByMentor(mentor.id);
    const reviews = getReviewsByMentor(mentor.id);

    const topicScore = computeTopicRelevance(expertise, criteria.topic);

    // Skip mentors with zero topic relevance — the requirement says
    // "do not recommend a mentor whose expertise does not match"
    if (topicScore === 0) continue;

    const availScore = computeAvailabilityScore(availability, criteria.preferredDays);
    const ratingScore = computeRatingScore(reviews);
    const profScore = computeProficiencyScore(expertise, criteria.topic);
    const prefScore = computePreferenceScore(mentor, criteria);

    const finalScore = clampScore(
      topicScore * MATCH_WEIGHTS.topicRelevance +
      availScore * MATCH_WEIGHTS.availabilityCompatibility +
      ratingScore * MATCH_WEIGHTS.mentorRating +
      profScore * MATCH_WEIGHTS.skillProficiency +
      prefScore * MATCH_WEIGHTS.learningPreference
    );

    // Apply minimum rating filter
    if (criteria.minimumRating) {
      const avgRating = reviews.length > 0 ? averageOf(reviews.map(r => r.overallRating)) : 0;
      if (reviews.length > 0 && avgRating < criteria.minimumRating) continue;
    }

    const reasons = generateReasons(topicScore, availScore, ratingScore, profScore, expertise, criteria.topic, mentor);

    matches.push({
      id: `match-${mentor.id}`,
      requestId: '',
      menteeId: menteeId || '',
      mentorId: mentor.id,
      matchScore: finalScore,
      topicRelevance: topicScore,
      availabilityScore: availScore,
      ratingScore,
      proficiencyScore: profScore,
      preferenceScore: prefScore,
      reasons,
      createdAt: new Date().toISOString(),
    });
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/** Build a full MentorProfile with computed stats */
export function buildMentorProfile(mentor: User): MentorProfile {
  const expertise = getExpertiseByMentor(mentor.id);
  const availability = getAvailabilityByMentor(mentor.id);
  const reviews = getReviewsByMentor(mentor.id);
  const sessions = getSessionsByUser(mentor.id);
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const averageRating = reviews.length > 0 ? averageOf(reviews.map(r => r.overallRating)) : 0;

  return {
    ...mentor,
    expertise,
    availability,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    completedSessions,
  };
}

/** Get all mentor profiles enriched with stats */
export function getAllMentorProfiles(): MentorProfile[] {
  return getMentors().map(buildMentorProfile);
}
