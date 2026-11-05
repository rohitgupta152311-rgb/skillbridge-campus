import { env } from '../../configuration/env.js';

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

export class GoogleService {
  static getAuthorizationUrl(state: string, redirectUri?: string): string {
    const callback = redirectUri || env.GOOGLE_CALLBACK_URL;
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID || '',
      redirect_uri: callback,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
      access_type: 'offline',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string, redirectUri?: string): Promise<{ accessToken: string; idToken?: string }> {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials are not configured.');
    }

    const callback = redirectUri || env.GOOGLE_CALLBACK_URL;
    const body = new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callback,
      grant_type: 'authorization_code',
    });

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google token exchange failed: ${res.status} ${err}`);
    }

    const json = (await res.json()) as any;
    return {
      accessToken: json.access_token,
      idToken: json.id_token,
    };
  }

  static async fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch Google userinfo: ${res.status} ${err}`);
    }

    return (await res.json()) as GoogleUserInfo;
  }
}
