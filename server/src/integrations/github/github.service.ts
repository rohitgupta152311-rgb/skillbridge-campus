import { env } from '../../configuration/env.js';

export interface GitHubUserInfo {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  email: string | null;
  html_url: string;
}

export class GitHubService {
  static getAuthorizationUrl(state: string, redirectUri?: string): string {
    const callback = redirectUri || env.GITHUB_CALLBACK_URL;
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID || '',
      redirect_uri: callback,
      scope: 'read:user user:email',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string, redirectUri?: string): Promise<{ accessToken: string }> {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      throw new Error('GitHub OAuth credentials are not configured.');
    }

    const callback = redirectUri || env.GITHUB_CALLBACK_URL;
    const body = {
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: callback,
    };

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub token exchange failed: ${res.status} ${err}`);
    }

    const json = (await res.json()) as any;
    if (json.error) {
      throw new Error(`GitHub token exchange error: ${json.error_description || json.error}`);
    }

    return { accessToken: json.access_token };
  }

  static async fetchUserInfo(accessToken: string): Promise<GitHubUserInfo> {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'SkillBridge-Campus',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch GitHub profile: ${res.status} ${err}`);
    }

    const user = (await res.json()) as GitHubUserInfo;

    // If email is private, fetch primary email
    if (!user.email) {
      try {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'SkillBridge-Campus',
          },
        });
        if (emailsRes.ok) {
          const emails = (await emailsRes.json()) as any;
          const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
          if (primary) {
            user.email = primary.email;
          }
        }
      } catch {
        // Fallback to synthetic if unretrievable
        user.email = `${user.login}@users.noreply.github.com`;
      }
    }

    return user;
  }
}
