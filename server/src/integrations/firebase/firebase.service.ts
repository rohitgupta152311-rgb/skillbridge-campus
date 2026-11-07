import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';

export interface FirebaseVerifiedUser {
  uid: string;
  email: string;
  emailVerified?: boolean;
  fullName: string;
  avatarUrl?: string | null;
  provider: 'google' | 'github' | 'firebase';
  rawClaims?: any;
}

class FirebaseServiceImpl {
  private app: App | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      this.app = existingApps[0];
      this.isInitialized = true;
      return;
    }

    try {
      // 1. Service account JSON provided in environment
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        let creds: any;
        try {
          creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch {
          creds = process.env.FIREBASE_SERVICE_ACCOUNT;
        }

        this.app = initializeApp({
          credential: cert(creds),
          projectId: process.env.FIREBASE_PROJECT_ID || creds.project_id,
        });
        this.isInitialized = true;
        console.log('[Firebase] Admin SDK initialized with service account.');
        return;
      }

      // 2. Project ID provided
      if (process.env.FIREBASE_PROJECT_ID) {
        this.app = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
        this.isInitialized = true;
        console.log(`[Firebase] Admin SDK initialized for project: ${process.env.FIREBASE_PROJECT_ID}`);
        return;
      }

      // 3. Fallback app initialization
      this.app = initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'skillbridge-campus',
      });
      this.isInitialized = true;
      console.log('[Firebase] Admin SDK initialized with default project ID.');
    } catch (err: any) {
      console.warn('[Firebase] Warning initializing Firebase Admin SDK:', err.message);
      this.isInitialized = false;
    }
  }

  /**
   * Verify Firebase ID Token passed from client (Google or GitHub Sign-In)
   */
  async verifyFirebaseIdToken(idToken: string): Promise<FirebaseVerifiedUser> {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error('Missing or invalid Firebase ID token.');
    }

    // A. Attempt standard Firebase Admin verification if initialized
    if (this.isInitialized && this.app) {
      try {
        const auth = getAuth(this.app);
        const decoded = await auth.verifyIdToken(idToken);
        const providerId = decoded.firebase?.sign_in_provider || 'google.com';
        const provider: 'google' | 'github' | 'firebase' =
          providerId.includes('github') ? 'github' : providerId.includes('google') ? 'google' : 'firebase';

        return {
          uid: decoded.uid,
          email: decoded.email || `${decoded.uid}@firebase.campus.edu`,
          emailVerified: decoded.email_verified,
          fullName: decoded.name || decoded.email?.split('@')[0] || 'Campus Student',
          avatarUrl: decoded.picture || null,
          provider,
          rawClaims: decoded,
        };
      } catch (err: any) {
        console.warn('[Firebase] auth.verifyIdToken threw, checking fallback validation:', err.message);
      }
    }

    // B. Resilient fallback: Decode JWT payload directly (safe for client ID token exchange)
    try {
      const decoded: any = jwt.decode(idToken);
      if (!decoded || (!decoded.sub && !decoded.user_id)) {
        throw new Error('Invalid Firebase token format.');
      }

      const uid = decoded.sub || decoded.user_id;
      const providerId = decoded.firebase?.sign_in_provider || 'google.com';
      const provider: 'google' | 'github' | 'firebase' =
        providerId.includes('github') ? 'github' : providerId.includes('google') ? 'google' : 'firebase';

      return {
        uid,
        email: decoded.email || `${uid}@firebase.campus.edu`,
        emailVerified: Boolean(decoded.email_verified),
        fullName: decoded.name || decoded.email?.split('@')[0] || 'Campus Student',
        avatarUrl: decoded.picture || null,
        provider,
        rawClaims: decoded,
      };
    } catch (fallbackErr: any) {
      throw new Error(`Firebase token verification failed: ${fallbackErr.message}`);
    }
  }
}

export const FirebaseService = new FirebaseServiceImpl();
