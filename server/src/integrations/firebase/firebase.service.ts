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
   * Verify Firebase ID Token passed from client (Google or GitHub Sign-In).
   * Strict security requirement: Cryptographically verifies signature and claims via Firebase Admin.
   * Unverified tokens or decoding fallbacks are strictly rejected.
   */
  async verifyFirebaseIdToken(idToken: string): Promise<FirebaseVerifiedUser> {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error('Missing or invalid Firebase ID token format.');
    }

    if (!this.isInitialized || !this.app) {
      throw new Error('Firebase Admin SDK is not initialized. Cannot verify token signatures.');
    }

    try {
      const auth = getAuth(this.app);
      // Cryptographically verifies signature, expiration, audience, and project matching
      const decoded = await auth.verifyIdToken(idToken, true);
      const providerId = decoded.firebase?.sign_in_provider || 'google.com';
      const provider: 'google' | 'github' | 'firebase' =
        providerId.includes('github') ? 'github' : providerId.includes('google') ? 'google' : 'firebase';

      return {
        uid: decoded.uid,
        email: decoded.email || `${decoded.uid}@firebase.campus.edu`,
        emailVerified: Boolean(decoded.email_verified),
        fullName: decoded.name || (typeof decoded.email === 'string' && decoded.email.includes('@') ? decoded.email.split('@')[0] : 'Campus Student'),
        avatarUrl: decoded.picture || null,
        provider,
        rawClaims: decoded,
      };
    } catch (err: any) {
      console.error('[Firebase] Cryptographic token verification failed:', err.message);
      throw new Error(`Firebase token verification failed: ${err.message || 'Signature or claims invalid'}`);
    }
  }
}

export const FirebaseService = new FirebaseServiceImpl();
export const firebaseService = FirebaseService;
