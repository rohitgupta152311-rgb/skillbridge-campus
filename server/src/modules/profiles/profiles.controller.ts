import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            educations: { orderBy: { startDate: 'desc' } },
            experiences: { orderBy: { startDate: 'desc' } },
            projects: { orderBy: { startDate: 'desc' } },
            certifications: { orderBy: { issueDate: 'desc' } },
          },
        },
        userSkills: {
          include: {
            skill: true,
            endorsements: {
              include: {
                endorser: { include: { profile: true } },
              },
            },
          },
        },
        mentorExpertise: true,
        mentorAvailability: true,
        reviewsReceived: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { mentee: { include: { profile: true } } },
        },
        _count: {
          select: {
            sentConnections: { where: { status: 'ACCEPTED' } },
            receivedConnections: { where: { status: 'ACCEPTED' } },
            followers: true,
            following: true,
            mentorSessions: { where: { status: 'COMPLETED' } },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User profile not found.', 404);
    }

    const totalConnections = user._count.sentConnections + user._count.receivedConnections;

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 10;
    if (user.profile?.fullName) completedFields++;
    if (user.profile?.avatarUrl) completedFields++;
    if (user.profile?.headline) completedFields++;
    if (user.profile?.bio) completedFields++;
    if (user.profile?.department) completedFields++;
    if (user.profile?.currentYear) completedFields++;
    if (user.profile?.educations.length) completedFields++;
    if (user.profile?.experiences.length) completedFields++;
    if (user.profile?.projects.length) completedFields++;
    if (user.userSkills.length) completedFields++;
    const profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);

    return res.json({
      success: true,
      data: {
        ...user,
        totalConnections,
        profileCompletionPercentage,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const userId = req.user.id;
    const data = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        fullName: data.fullName,
        headline: data.headline,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        coverImageUrl: data.coverImageUrl,
        department: data.department,
        currentYear: data.currentYear,
        university: data.university,
        degree: data.degree,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear, 10) : undefined,
        portfolioUrl: data.portfolioUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        languages: data.languages,
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function endorseSkill(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { userSkillId } = req.params;

    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      throw new AppError('User skill not found.', 404);
    }

    if (userSkill.userId === req.user.id) {
      throw new AppError('You cannot endorse your own skill.', 400);
    }

    const existing = await prisma.endorsement.findUnique({
      where: {
        userSkillId_endorserId: {
          userSkillId,
          endorserId: req.user.id,
        },
      },
    });

    if (existing) {
      // Toggle off endorsement
      await prisma.endorsement.delete({ where: { id: existing.id } });
      return res.json({ success: true, message: 'Endorsement removed.', isEndorsed: false });
    }

    await prisma.endorsement.create({
      data: {
        userSkillId,
        endorserId: req.user.id,
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: userSkill.userId,
        type: 'SKILL_ENDORSED',
        title: 'New Skill Endorsement',
        message: 'A peer endorsed your skill on your profile.',
        linkUrl: `/profile`,
      },
    });

    return res.status(201).json({ success: true, message: 'Skill endorsed.', isEndorsed: true });
  } catch (error) {
    return next(error);
  }
}
