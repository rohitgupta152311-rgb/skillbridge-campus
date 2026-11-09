import { Router } from 'express';
import {
  register,
  login,
  getMe,
  getOAuthStatus,
  handleGoogleAuth,
  handleGitHubAuth,
  handleLinkedInAuth,
  handleLinkedInCallback,
  handleGoogleCallback,
  configureOAuth,
  handleGitHubCallback,
  exchangeOAuthCode,
  confirmOAuthImport,
  getLinkedAccounts,
  unlinkAccount,
  logoutAllDevices,
  getSystemVersion,
  handleFirebaseAuth,
  getFirebaseConfig,
  authenticateWithGoogle,
  authenticateWithGitHub,
  previewGitHubUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from './auth.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const authRouter = Router();

// Standard credentials
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', requireAuth, getMe);

// Firebase Authentication (Google & GitHub Secure Federated Sign-In)
authRouter.post('/firebase', handleFirebaseAuth);
authRouter.post('/firebase-login', handleFirebaseAuth);
authRouter.get('/firebase-config', getFirebaseConfig);

// Direct Google & GitHub Verified Sign-In
authRouter.post('/google-authenticate', authenticateWithGoogle);
authRouter.post('/github-authenticate', authenticateWithGitHub);
authRouter.get('/github-preview/:username', previewGitHubUser);

// Two-Factor Email Authentication (2FA) for Registration
authRouter.post('/send-registration-otp', sendRegistrationOtp);
authRouter.post('/verify-registration-otp', verifyRegistrationOtp);

// OAuth Initiation & Status
authRouter.get('/oauth-status', getOAuthStatus);
authRouter.get('/google', handleGoogleAuth);
authRouter.get('/github', handleGitHubAuth);
authRouter.get('/linkedin', handleLinkedInAuth);

// OAuth Callbacks & Unified Code Exchange
authRouter.get('/linkedin/callback', handleLinkedInCallback);
authRouter.get('/google/callback', handleGoogleCallback);
authRouter.post('/configure-oauth', configureOAuth);
authRouter.get('/github/callback', handleGitHubCallback);
authRouter.post('/oauth/exchange', exchangeOAuthCode);
authRouter.post('/linkedin/confirm-import', confirmOAuthImport);

// Account Linking & Session Management
authRouter.get('/linked-accounts', requireAuth, getLinkedAccounts);
authRouter.delete('/linked-accounts/:provider', requireAuth, unlinkAccount);
authRouter.post('/logout-all', requireAuth, logoutAllDevices);

// System & Version check
authRouter.get('/version', getSystemVersion);
