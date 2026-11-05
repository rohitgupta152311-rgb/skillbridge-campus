import { env } from '../../configuration/env.js';

export interface LinkedInUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
  locale?: {
    country: string;
    language: string;
  };
}

export interface OAuthImportProfile {
  provider: 'linkedin' | 'google' | 'github';
  providerAccountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  linkedinUrl?: string;
  verifiedEmail: boolean;
  rawProfile: any;
}

export class LinkedInService {
  /**
   * Generates official LinkedIn OpenID Connect Authorization URL
   */
  static getAuthorizationUrl(state: string, redirectUri?: string): string {
    const callback = redirectUri || env.LINKEDIN_CALLBACK_URL;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.LINKEDIN_CLIENT_ID || '',
      redirect_uri: callback,
      state,
      scope: 'openid profile email',
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Securely exchanges authorization code for LinkedIn access token
   */
  static async exchangeCodeForToken(code: string, redirectUri?: string): Promise<{ accessToken: string; expiresIn: number; idToken?: string }> {
    if (!env.LINKEDIN_CLIENT_ID || !env.LINKEDIN_CLIENT_SECRET) {
      throw new Error('LinkedIn OAuth credentials (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET) are not configured.');
    }

    const callback = redirectUri || env.LINKEDIN_CALLBACK_URL;
    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: callback,
      client_id: env.LINKEDIN_CLIENT_ID,
      client_secret: env.LINKEDIN_CLIENT_SECRET,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange LinkedIn authorization code: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as any;
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      idToken: data.id_token,
    };
  }

  /**
   * Fetches userinfo from official LinkedIn OpenID Connect endpoint
   */
  static async fetchUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch LinkedIn user info: ${response.status} ${errorText}`);
    }

    return (await response.json()) as LinkedInUserInfo;
  }

  /**
   * Maps LinkedIn OpenID Connect claims into a standardized StudyBridge profile preview
   */
  static mapToStudyBridgeProfile(userInfo: LinkedInUserInfo): OAuthImportProfile {
    return {
      provider: 'linkedin',
      providerAccountId: userInfo.sub,
      fullName: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
      email: userInfo.email,
      avatarUrl: userInfo.picture,
      headline: `${userInfo.name}'s Professional Profile`,
      linkedinUrl: `https://www.linkedin.com/in/${userInfo.sub.slice(0, 10)}`,
      verifiedEmail: Boolean(userInfo.email_verified),
      rawProfile: userInfo,
    };
  }
}
