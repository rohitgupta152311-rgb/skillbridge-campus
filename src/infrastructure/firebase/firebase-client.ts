import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_placeholder_for_firebase_auth',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'skillbridge-campus.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skillbridge-campus',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skillbridge-campus.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '647527528972',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:647527528972:web:skillbridge2026',
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseAuth: Auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

export interface FirebaseLoginResult {
  idToken: string;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    providerId: string;
  };
}

export async function signInWithFirebaseGoogle(): Promise<FirebaseLoginResult> {
  const result: UserCredential = await signInWithPopup(firebaseAuth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      providerId: 'google.com',
    },
  };
}

export async function signInWithFirebaseGithub(): Promise<FirebaseLoginResult> {
  const result: UserCredential = await signInWithPopup(firebaseAuth, githubProvider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      providerId: 'github.com',
    },
  };
}
