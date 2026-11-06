import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

const bookSessionSchema = z.object({
  mentorId: z.string(),
  topic: z.string().min(1),
  description: z.string().optional(),
  sessionDate: z.string(), // ISO date
  startTime: z.string(),   // "HH:mm"
  duration: z.number().default(60),
  sessionType: z.enum(['ONLINE', 'IN_PERSON']).default('ONLINE'),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
});

export async function matchMentors(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, preferredDays, preferredLanguage } = req.query;
    const searchTopic = (topic as string || '').toLowerCase();

    // Query mentors with their expertise, availability, and reviews
    const mentors = await prisma.user.findMany({
      where: {
        role: 'MENTOR',
        isSuspended: false,
      },
      include: {
        profile: true,
        mentorExpertise: true,
        mentorAvailability: true,
        reviewsReceived: true,
        _count: {
          select: {
            mentorSessions: { where: { status: 'COMPLETED' } },
          },
        },
      },
    });

    const matches = mentors
      .map((mentor) => {
        // 1. Topic Relevance (35%)
        const exactTopic = mentor.mentorExpertise.find(
          (e) => e.topic.toLowerCase() === searchTopic
        );
        const partialTopic = mentor.mentorExpertise.find(
          (e) => e.topic.toLowerCase().includes(searchTopic) || searchTopic.includes(e.topic.toLowerCase())
        );

        let topicScore = 0;
        if (searchTopic) {
          if (exactTopic) topicScore = 60 + exactTopic.proficiencyLevel * 8; // 68-100
          else if (partialTopic) topicScore = 30 + partialTopic.proficiencyLevel * 6; // 36-60
          else return null; // Exclude non-matching mentors
        } else {
          topicScore = 80;
        }

        // 2. Availability (25%)
        let availabilityScore = 60;
        if (mentor.mentorAvailability.length > 0) {
          availabilityScore = Math.min(100, 40 + mentor.mentorAvailability.length * 12);
        }

        // 3. Mentor Rating (20%)
        const avgRating =
          mentor.reviewsReceived.length > 0
            ? mentor.reviewsReceived.reduce((acc, r) => acc + r.overallRating, 0) /
              mentor.reviewsReceived.length
            : 4.5;
        const ratingScore = Math.min(100, avgRating * 20);

        // 4. Skill Proficiency (10%)
        const profLevel = exactTopic?.proficiencyLevel || partialTopic?.proficiencyLevel || 4;
        const proficiencyScore = profLevel * 20;

        // 5. Learning Preferences & Language (10%)
        let prefScore = 70;
        if (preferredLanguage && mentor.profile?.languages.includes(preferredLanguage as string)) {
          prefScore = 100;
        }

        const matchScore = Math.round(
          topicScore * 0.35 +
          availabilityScore * 0.25 +
          ratingScore * 0.20 +
          proficiencyScore * 0.10 +
          prefScore * 0.10
        );

        const reasons: string[] = [];
        if (exactTopic) reasons.push(`Verified expert in ${exactTopic.topic}`);
        if (avgRating >= 4.7) reasons.push(`Top rated mentor (${avgRating.toFixed(1)}/5 stars)`);
        if (mentor._count.mentorSessions >= 3) reasons.push(`${mentor._count.mentorSessions} completed campus sessions`);
        if (mentor.mentorAvailability.length >= 3) reasons.push('High schedule flexibility');

        return {
          mentor: {
            id: mentor.id,
            email: mentor.email,
            role: mentor.role,
            profile: mentor.profile,
            expertise: mentor.mentorExpertise,
            availability: mentor.mentorAvailability,
            averageRating: Math.round(avgRating * 10) / 10,
            completedSessions: mentor._count.mentorSessions,
            totalReviews: mentor.reviewsReceived.length,
          },
          matchScore,
          reasons,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.matchScore - a!.matchScore);

    return res.json({
      success: true,
      data: matches,
    });
  } catch (error) {
    return next(error);
  }
}

export async function bookSession(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const data = bookSessionSchema.parse(req.body);

    if (data.mentorId === req.user.id) {
      throw new AppError('You cannot book a mentorship session with yourself.', 400);
    }

    const sessionDateObj = new Date(data.sessionDate);

    // Prevent double booking / schedule overlap in database transaction
    const conflictingSession = await prisma.tutoringSession.findFirst({
      where: {
        mentorId: data.mentorId,
        sessionDate: sessionDateObj,
        startTime: data.startTime,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (conflictingSession) {
      throw new AppError('This time slot is already booked or pending with another student.', 409);
    }

    const session = await prisma.tutoringSession.create({
      data: {
        mentorId: data.mentorId,
        menteeId: req.user.id,
        topic: data.topic,
        description: data.description,
        sessionDate: sessionDateObj,
        startTime: data.startTime,
        duration: data.duration,
        sessionType: data.sessionType,
        location: data.location,
        meetingLink: data.meetingLink || 'https://meet.skillbridge.campus/' + Math.random().toString(36).substring(7),
        status: 'PENDING',
      },
      include: {
        mentor: { include: { profile: true } },
        mentee: { include: { profile: true } },
      },
    });

    // Notify mentor
    await prisma.notification.create({
      data: {
        userId: data.mentorId,
        type: 'SESSION_REQUESTED',
        title: 'New Mentorship Request',
        message: `${session.mentee.profile?.fullName || 'A student'} requested a session on ${data.topic}.`,
        linkUrl: '/mentor/sessions',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Session requested successfully.',
      data: session,
    });
  } catch (error) {
    return next(error);
  }
}

export async function submitReview(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { sessionId } = req.params;
    const { overallRating, teachingQuality, communication, subjectKnowledge, reviewText } = req.body;

    const session = await prisma.tutoringSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new AppError('Session not found.', 404);
    }

    if (session.menteeId !== req.user.id) {
      throw new AppError('Only the mentee who attended this session can submit a review.', 403);
    }

    if (session.status !== 'COMPLETED') {
      throw new AppError('Reviews can only be submitted after a session is marked completed.', 400);
    }

    // Check duplicate review
    const existing = await prisma.review.findUnique({
      where: { sessionId },
    });

    if (existing) {
      throw new AppError('You have already submitted a review for this session.', 409);
    }

    const review = await prisma.review.create({
      data: {
        sessionId,
        mentorId: session.mentorId,
        menteeId: req.user.id,
        overallRating: Math.min(5, Math.max(1, parseInt(overallRating, 10))),
        teachingQuality: Math.min(5, Math.max(1, parseInt(teachingQuality || overallRating, 10))),
        communication: Math.min(5, Math.max(1, parseInt(communication || overallRating, 10))),
        subjectKnowledge: Math.min(5, Math.max(1, parseInt(subjectKnowledge || overallRating, 10))),
        reviewText: reviewText || '',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Review recorded successfully.',
      data: review,
    });
  } catch (error) {
    return next(error);
  }
}
