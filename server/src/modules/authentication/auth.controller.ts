import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../database/prisma.js';
import { env } from '../../configuration/env.js';
import { AppError } from '../../middleware/error-handler.js';
import { AuthenticatedUser } from '../../middleware/authentication.js';
import { LinkedInService, OAuthImportProfile } from '../../integrations/linkedin/linkedin.service.js';
import { GoogleService } from '../../integrations/google/google.service.js';
import { GitHubService } from '../../integrations/github/github.service.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['MENTEE', 'MENTOR', 'FACULTY', 'ALUMNI']).default('MENTEE'),
  department: z.string().min(2),
  currentYear: z.string().default('1st Year'),
  university: z.string().default('Campus University'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const confirmImportSchema = z.object({
  provider: z.enum(['linkedin', 'google', 'github']),
  providerAccountId: z.string(),
  email: z.string().email(),
  fullName: z.string().min(2),
  avatarUrl: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  department: z.string().default('Computer Science'),
  currentYear: z.string().default('3rd Year'),
  university: z.string().default('State Technological University'),
  role: z.enum(['MENTEE', 'MENTOR', 'FACULTY', 'ALUMNI']).default('MENTEE'),
  preserveManualEdits: z.boolean().default(true),
});

export function signToken(user: AuthenticatedUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        isVerified: false,
        profile: {
          create: {
            fullName: data.fullName,
            department: data.department,
            currentYear: data.currentYear,
            university: data.university,
            headline: `${data.role === 'MENTOR' ? 'Student Mentor & ' : ''}${data.department} Student at ${data.university}`,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (user.isSuspended) {
      throw new AppError('This account has been suspended by campus administration.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            createdAt: true,
          },
        },
        profile: {
          include: {
            educations: true,
            experiences: true,
            projects: true,
            certifications: true,
          },
        },
        userSkills: {
          include: {
            skill: true,
            endorsements: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

// ─────────────────────────────────────────────
// LINKEDIN AUTOMATIC PROFILE IMPORT & OAUTH
// ─────────────────────────────────────────────

export async function handleLinkedInCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  const error = req.query.error as string;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (error || !code) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error || 'Authorization denied')}`);
  }

  try {
    // 1. Exchange code for access token
    const { accessToken } = await LinkedInService.exchangeCodeForToken(code);

    // 2. Fetch OIDC user info
    const userInfo = await LinkedInService.fetchUserInfo(accessToken);

    // 3. Map into StudyBridge format
    const profileImport = LinkedInService.mapToStudyBridgeProfile(userInfo);

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'linkedin',
          providerAccountId: userInfo.sub,
        },
      },
      include: { user: { include: { profile: true } } },
    });

    if (existingAccount) {
      // User has logged in before with LinkedIn -> sign in directly
      const token = signToken({
        id: existingAccount.user.id,
        email: existingAccount.user.email,
        role: existingAccount.user.role,
      });

      return res.redirect(`${frontendUrl}/login?token=${token}&oauth_status=success`);
    }

    // New or unlinked LinkedIn user -> redirect to confirmation preview with token/payload
    const encodedPayload = Buffer.from(JSON.stringify(profileImport)).toString('base64');
    return res.redirect(`${frontendUrl}/login?linkedin_preview=${encodedPayload}`);
  } catch (err: any) {
    console.error('LinkedIn OAuth Callback Error:', err);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message || 'LinkedIn OAuth Failed')}`);
  }
}

/**
 * Mobile / Web unified OAuth code exchange
 */
export async function exchangeOAuthCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { provider, code, redirectUri } = req.body;

    if (!provider || !code) {
      throw new AppError('Provider and authorization code are required.', 400);
    }

    let profileData: OAuthImportProfile;

    if (provider === 'linkedin') {
      const { accessToken } = await LinkedInService.exchangeCodeForToken(code, redirectUri);
      const userInfo = await LinkedInService.fetchUserInfo(accessToken);
      profileData = LinkedInService.mapToStudyBridgeProfile(userInfo);
    } else if (provider === 'google') {
      const { accessToken } = await GoogleService.exchangeCodeForToken(code, redirectUri);
      const userInfo = await GoogleService.fetchUserInfo(accessToken);
      profileData = {
        provider: 'google',
        providerAccountId: userInfo.sub,
        fullName: userInfo.name,
        email: userInfo.email,
        avatarUrl: userInfo.picture,
        headline: `${userInfo.name}'s Academic Profile`,
        verifiedEmail: Boolean(userInfo.email_verified),
        rawProfile: userInfo as any,
      };
    } else if (provider === 'github') {
      const { accessToken } = await GitHubService.exchangeCodeForToken(code, redirectUri);
      const userInfo = await GitHubService.fetchUserInfo(accessToken);
      profileData = {
        provider: 'github',
        providerAccountId: String(userInfo.id),
        fullName: userInfo.name || userInfo.login,
        email: userInfo.email || `${userInfo.login}@users.noreply.github.com`,
        avatarUrl: userInfo.avatar_url,
        headline: userInfo.bio || `Developer on GitHub (@${userInfo.login})`,
        verifiedEmail: true,
        rawProfile: userInfo as any,
      };
    } else {
      throw new AppError(`Unsupported provider: ${provider}`, 400);
    }

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profileData.provider,
          providerAccountId: profileData.providerAccountId,
        },
      },
      include: { user: { include: { profile: true } } },
    });

    if (existingAccount) {
      const token = signToken({
        id: existingAccount.user.id,
        email: existingAccount.user.email,
        role: existingAccount.user.role,
      });

      return res.json({
        success: true,
        isNewUser: false,
        token,
        user: existingAccount.user,
      });
    }

    // Check if user with this email already exists -> link automatically
    const existingUser = await prisma.user.findUnique({
      where: { email: profileData.email },
      include: { profile: true },
    });

    if (existingUser) {
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          provider: profileData.provider,
          providerAccountId: profileData.providerAccountId,
        },
      });

      const token = signToken({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });

      return res.json({
        success: true,
        isNewUser: false,
        message: 'Account linked successfully to existing campus profile.',
        token,
        user: existingUser,
      });
    }

    // New user -> return preview payload for review
    return res.json({
      success: true,
      isNewUser: true,
      preview: profileData,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Confirm and finalize LinkedIn / OAuth profile import
 */
export async function confirmOAuthImport(req: Request, res: Response, next: NextFunction) {
  try {
    const data = confirmImportSchema.parse(req.body);

    // Verify if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      },
      include: { user: { include: { profile: true } } },
    });

    if (existingAccount) {
      const token = signToken({
        id: existingAccount.user.id,
        email: existingAccount.user.email,
        role: existingAccount.user.role,
      });
      return res.json({
        success: true,
        token,
        user: existingAccount.user,
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          role: data.role,
          isVerified: true,
          profile: {
            create: {
              fullName: data.fullName,
              avatarUrl: data.avatarUrl || null,
              headline: data.headline || `${data.department} Student at ${data.university}`,
              university: data.university,
              department: data.department,
              currentYear: data.currentYear,
              linkedinUrl: data.linkedinUrl || null,
            },
          },
        },
        include: { profile: true },
      });
    } else if (user.profile) {
      // If user exists and didn't opt to lock manual edits, update avatar and headline
      if (!data.preserveManualEdits) {
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            fullName: data.fullName,
            avatarUrl: data.avatarUrl || user.profile.avatarUrl,
            headline: data.headline || user.profile.headline,
            linkedinUrl: data.linkedinUrl || user.profile.linkedinUrl,
          },
        });
      }
    }

    // Link account
    await prisma.account.create({
      data: {
        userId: user.id,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: 'Profile created and synchronized successfully via LinkedIn OIDC.',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// ─────────────────────────────────────────────
// ACCOUNT LINKING & SESSIONS
// ─────────────────────────────────────────────

export async function getLinkedAccounts(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        provider: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    return next(error);
  }
}

export async function unlinkAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { provider } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { accounts: true },
    });

    if (!user) throw new AppError('User not found', 404);

    // Prevent unlinking if user has no password and this is their only OAuth account
    if (!user.passwordHash && user.accounts.length <= 1) {
      throw new AppError('Cannot unlink your only login method. Please set a password first.', 400);
    }

    await prisma.account.deleteMany({
      where: {
        userId: req.user.id,
        provider,
      },
    });

    return res.json({
      success: true,
      message: `${provider} account unlinked successfully.`,
    });
  } catch (error) {
    return next(error);
  }
}

export async function logoutAllDevices(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    // Invalidate all active sessions for this user
    await prisma.session.deleteMany({
      where: { userId: req.user.id },
    });

    return res.json({
      success: true,
      message: 'Successfully signed out from all devices.',
    });
  } catch (error) {
    return next(error);
  }
}

// System version endpoint for mobile OTA & native app store compatibility
export function getSystemVersion(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      platform: 'StudyBridge 3.0 Campus Ecosystem',
      currentVersion: '3.0.0',
      minNativeVersion: '3.0.0',
      latestNativeVersion: '3.0.0',
      otaChannel: 'production',
      runtimeVersion: 'exposdk:52.0.0',
      mandatoryUpdateRequired: false,
      serverTimestamp: new Date().toISOString(),
      features: {
        linkedInAutoImport: true,
        socketMessaging: true,
        smartMatching5Factor: true,
        cloudObjectStorage: true,
      },
    },
  });
}

// OAuth Handlers
export function getOAuthStatus(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      googleConfigured: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      githubConfigured: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
      linkedinConfigured: Boolean(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
      callbackUrls: {
        google: env.GOOGLE_CALLBACK_URL,
        github: env.GITHUB_CALLBACK_URL,
        linkedin: env.LINKEDIN_CALLBACK_URL,
      },
    },
  });
}

export function handleGoogleAuth(req: Request, res: Response) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (!env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID === 'placeholder' || env.GOOGLE_CLIENT_ID.includes('your_google')) {
    return res.redirect(frontendUrl + '/login?oauth_demo=google');
  }

  const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString('base64');
  return res.redirect(GoogleService.getAuthorizationUrl(state));
}

export function handleGitHubAuth(req: Request, res: Response) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (!env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID === 'placeholder' || env.GITHUB_CLIENT_ID.includes('your_github')) {
    return res.redirect(frontendUrl + '/login?oauth_demo=github');
  }

  const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString('base64');
  return res.redirect(GitHubService.getAuthorizationUrl(state));
}

export function handleLinkedInAuth(req: Request, res: Response) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (!env.LINKEDIN_CLIENT_ID || env.LINKEDIN_CLIENT_ID === 'placeholder' || env.LINKEDIN_CLIENT_ID.includes('your_linkedin')) {
    return res.redirect(frontendUrl + '/login?oauth_demo=linkedin');
  }

  const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString('base64');
  return res.redirect(LinkedInService.getAuthorizationUrl(state));
}
