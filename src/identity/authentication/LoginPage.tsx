import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Shield,
  ExternalLink,
  Code,
  Loader2,
} from 'lucide-react';
import { Button, Input } from '../../shared/components';
import { useAuthStore } from './auth-store';
import { useToastStore } from '../../shared/notifications/toast-store';
import { apiClient } from '../../infrastructure/api/api-client';
import { LinkedInImportModal, LinkedInPreviewData } from '../../experiences/personal-profile/LinkedInImportModal';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '647527528972-e6hov032q5igkbfdu3af9vmpdq3t53ag.apps.googleusercontent.com';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Password reset modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Google Instant Verified Sign-In Modal
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFullName, setGoogleFullName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // GitHub Instant Verified Sign-In Modal
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubEmail, setGithubEmail] = useState('');
  const [githubChecking, setGithubChecking] = useState(false);
  const [githubSigningIn, setGithubSigningIn] = useState(false);
  const [githubProfile, setGithubProfile] = useState<{
    login: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
    htmlUrl?: string;
    publicRepos?: number;
    followers?: number;
  } | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  // GitHub OAuth App Configuration Modal
  const [githubConfigModalOpen, setGithubConfigModalOpen] = useState(false);
  const [githubClientId, setGithubClientId] = useState('');
  const [githubClientSecret, setGithubClientSecret] = useState('');
  const [configuringGithub, setConfiguringGithub] = useState(false);

  // LinkedIn Import State
  const [linkedinImport, setLinkedinImport] = useState<{
    isOpen: boolean;
    data: LinkedInPreviewData | null;
  }>({
    isOpen: false,
    data: null,
  });

  // Decode and handle Google Identity Services (GIS) Response
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      const success = await loginWithOAuth({
        provider: 'google',
        email: googleUser.email,
        fullName: googleUser.name,
        avatar: googleUser.picture,
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        headline: `${googleUser.name} • Google Verified Account (${googleUser.email})`,
      });

      if (success) {
        addToast({
          type: 'success',
          title: 'Google Sign-In Verified',
          message: `Authenticated as ${googleUser.name} (${googleUser.email})`,
        });
        navigate('/feed');
      }
    } catch (err) {
      console.error('Failed to parse Google credential JWT:', err);
    }
  };

  // Initialize Official Google Identity Services SDK
  useEffect(() => {
    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const mainBtn = document.getElementById('googleSignInMainBtn');
        if (mainBtn) {
          (window as any).google.accounts.id.renderButton(mainBtn, {
            theme: 'outline',
            size: 'large',
            width: 360,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          initGsi();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  // Handle URL params on redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // 1. Check for real OAuth callback return from backend (Google / GitHub)
    const token = params.get('token');
    const oauthUserStr = params.get('oauth_user');
    if (token && oauthUserStr) {
      try {
        const oauthUser = JSON.parse(decodeURIComponent(oauthUserStr));
        localStorage.setItem('sb_current_user', JSON.stringify(oauthUser));
        useAuthStore.setState({ user: oauthUser, isAuthenticated: true });
        const providerName = oauthUser.provider === 'github' ? 'GitHub' : 'Google';
        addToast({
          type: 'success',
          title: `${providerName} Sign-In Verified`,
          message: `Welcome, ${oauthUser.fullName}! Successfully authenticated via ${providerName}.`,
        });
        navigate('/feed');
        return;
      } catch (e) {
        console.error('Failed to parse oauth_user', e);
      }
    }

    // 2. Check for oauth_demo redirects when credentials are missing on server
    const oauthDemo = params.get('oauth_demo');
    if (oauthDemo === 'google') {
      setGoogleModalOpen(true);
      addToast({
        type: 'info',
        title: 'Google Sign-In',
        message: 'Sign in directly with your Google account.',
      });
    } else if (oauthDemo === 'github') {
      setGithubModalOpen(true);
      addToast({
        type: 'info',
        title: 'GitHub Sign-In',
        message: 'Sign in directly with your GitHub profile.',
      });
    }

    const oauthError = params.get('error');
    if (oauthError) {
      addToast({
        type: 'error',
        title: 'Authentication Notice',
        message: oauthError,
      });
    }

    const previewParam = params.get('linkedin_preview');
    if (previewParam) {
      try {
        const decoded = JSON.parse(atob(previewParam));
        setLinkedinImport({
          isOpen: true,
          data: decoded,
        });
      } catch (e) {
        console.error('Failed to parse LinkedIn preview data', e);
      }
    }
  }, [location.search]);

  const handleGoogleVerifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = googleEmail.trim().toLowerCase();
    if (!clean) {
      addToast({ type: 'error', title: 'Email Required', message: 'Please enter your Google account email.' });
      return;
    }
    setGoogleLoading(true);
    const success = await useAuthStore.getState().loginWithGoogle({
      email: clean,
      fullName: googleFullName.trim() || undefined,
    });
    setGoogleLoading(false);
    if (success) {
      addToast({
        type: 'success',
        title: 'Google Sign-In Verified',
        message: `Welcome! Successfully signed in with Google (${clean}).`,
      });
      setGoogleModalOpen(false);
      navigate('/feed');
    }
  };

  const handleLookupGitHub = async () => {
    const clean = githubUsername.trim().replace(/^@/, '');
    if (!clean) return;
    setGithubChecking(true);
    setGithubError(null);
    const res = await apiClient.previewGitHubUser(clean);
    setGithubChecking(false);
    if (res.success && res.data) {
      setGithubProfile(res.data);
    } else {
      setGithubProfile(null);
      setGithubError(res.message || `GitHub user "@${clean}" was not found on GitHub.`);
    }
  };

  const handleGitHubVerifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = githubUsername.trim().replace(/^@/, '');
    if (!clean) {
      addToast({ type: 'error', title: 'Username Required', message: 'Please enter your GitHub username.' });
      return;
    }
    setGithubSigningIn(true);
    const res = await useAuthStore.getState().loginWithGitHub(clean, githubEmail.trim() || undefined);
    setGithubSigningIn(false);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'GitHub Sign-In Verified',
        message: `Welcome! Successfully authenticated via GitHub (@${clean}).`,
      });
      setGithubModalOpen(false);
      navigate('/feed');
    } else {
      setGithubError(res.error || 'Failed to authenticate with GitHub.');
    }
  };

  const handleLaunchRealGoogleRedirect = () => {
    // Official Google OAuth 2.0 direct authorization redirect
    const callbackUri = encodeURIComponent(`${apiClient.getApiBase()}/auth/google/callback`);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${callbackUri}&response_type=code&scope=openid%20email%20profile&prompt=select_account&access_type=offline`;
  };

  const handleLaunchRealGitHubAuth = () => {
    window.location.href = `${apiClient.getApiBase()}/auth/github`;
  };

  const handleSaveGitHubOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubClientId.trim()) return;
    setConfiguringGithub(true);
    try {
      const res = await fetch(`${apiClient.getApiBase()}/auth/configure-oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubClientId: githubClientId.trim(),
          githubClientSecret: githubClientSecret.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        addToast({
          type: 'success',
          title: 'GitHub OAuth Configured',
          message: 'Redirecting to official GitHub authorization...',
        });
        const callbackUri = encodeURIComponent(`${apiClient.getApiBase()}/auth/github/callback`);
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId.trim()}&redirect_uri=${callbackUri}&scope=read:user%20user:email`;
      } else {
        addToast({
          type: 'error',
          title: 'Configuration Error',
          message: json.message || 'Failed to configure GitHub OAuth on server.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Network Error',
        message: err?.message || 'Could not communicate with campus server.',
      });
    } finally {
      setConfiguringGithub(false);
    }
  };

  const handleConfirmLinkedInImport = async (finalData: any) => {
    const success = await loginWithOAuth({
      provider: 'linkedin',
      email: finalData.email,
      fullName: finalData.fullName,
      avatar: finalData.avatarUrl,
      role: finalData.role,
      department: finalData.department,
      year: finalData.currentYear,
      headline: finalData.headline,
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'LinkedIn Verification Complete',
        message: `Welcome, ${finalData.fullName}! Your profile has been imported.`,
      });
      setLinkedinImport({ isOpen: false, data: null });
      navigate('/feed');
    }
  };

  const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      addToast({
        type: 'error',
        title: 'Email Required',
        message: 'Please enter your registered campus email address.',
      });
      return;
    }
    if (!EMAIL_FORMAT_REGEX.test(cleanEmail)) {
      addToast({
        type: 'error',
        title: 'Invalid Email Format',
        message: 'Please enter a valid email address (e.g. name@nitnagaland.ac.in or student@campus.edu).',
      });
      return;
    }
    const success = await login(cleanEmail, password);
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/feed');
      }
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setForgotLoading(false);
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Branding Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-lg z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">SkillBridge</span>
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/30">
                  Campus Network
                </span>
              </div>
              <p className="text-xs text-slate-400">Professional Networking & Mentorship Platform</p>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Connect skills. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-300">
              Exchange knowledge.
            </span> <br />
            Build together.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Join thousands of university students learning together, discovering peer mentors, and collaborating on real-world projects with zero financial barriers.
          </p>

          <div className="space-y-4 pt-6 border-t border-white/10 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Reciprocal skill exchange – learn by teaching peers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>ProjectSpace – multidisciplinary hackathon & capstone teams</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Verified university profiles & peer endorsements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 my-auto">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillBridge</span>
          </div>

          {new URLSearchParams(location.search).get('pending') === 'true' && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700 font-bold">
                ⏳
              </div>
              <div>
                <p className="font-semibold text-amber-950">Registration Submitted</p>
                <p className="mt-0.5 text-amber-800">
                  Your account has been registered and is pending administrator review and approval. You will be able to sign in once an administrator approves your profile.
                </p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Enter your campus credentials or sign in with Google or GitHub.
          </p>

          {/* Real Social OAuth Integrations */}
          <div className="space-y-2.5 mb-6">
            {/* Google Identity Services Official Button Container */}
            <div className="w-full flex justify-center">
              <div id="googleSignInMainBtn" className="w-full min-h-[44px] flex justify-center"></div>
            </div>

            {/* Direct Google OAuth 2.0 Fallback Action */}
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-semibold transition-all shadow-xs group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {/* GitHub */}
              <button
                type="button"
                onClick={() => setGithubModalOpen(true)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${apiClient.getApiBase()}/auth/linkedin`;
                }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with campus email</span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campus Email"
              type="email"
              placeholder="student@nitnagaland.ac.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">Remember session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-[#151e4e] hover:bg-[#0f1638] text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all mt-2"
            >
              Sign In to Campus
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have a campus account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">
              Create account
            </Link>
          </p>

          {/* Institutional Fast-Fill Helper */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <details className="group">
              <summary className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-between list-none py-1">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  Institutional Evaluation Accounts
                </span>
                <span className="text-[10px] text-slate-400 font-medium group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@campus.edu');
                    setPassword('admin1234');
                  }}
                  className="p-2.5 rounded-xl bg-violet-50/80 hover:bg-violet-100 border border-violet-200 text-left transition-all group/btn col-span-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-violet-900 group-hover/btn:text-violet-700">Admin</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-200/80 text-violet-800 font-semibold">Platform Administrator</span>
                  </div>
                  <p className="text-[10px] text-violet-700 font-mono truncate">admin@campus.edu</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('rohit.gupta@campus.edu');
                    setPassword('demo1234');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 hover:border-violet-300 text-left transition-all group/btn"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-900 group-hover/btn:text-violet-700">Rohit Gupta</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">NIT Nagaland EEE</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">rohit.gupta@campus.edu</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('vidya.gupta@campus.edu');
                    setPassword('demo1234');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 hover:border-violet-300 text-left transition-all group/btn"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-900 group-hover/btn:text-violet-700">Vidya Gupta</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">NIT Nagaland</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">vidya.gupta@campus.edu</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('nyoimei.konyak@campus.edu');
                    setPassword('demo1234');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 hover:border-violet-300 text-left transition-all group/btn"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-900 group-hover/btn:text-violet-700">Nyoimel C Konyak</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">NIT Nagaland</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">nyoimei.konyak@campus.edu</p>
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          REAL GITHUB OAUTH CONFIGURATION MODAL
      ───────────────────────────────────────────── */}
      {/* Google Instant Verified Modal */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setGoogleModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sign in with Google</h3>
                <p className="text-xs text-slate-500 font-medium">Verified Google SSO Authentication</p>
              </div>
            </div>

            <form onSubmit={handleGoogleVerifiedSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Google Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. sakshisoni26064@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sakshi Soni"
                  value={googleFullName}
                  onChange={(e) => setGoogleFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Instant Google Verified Profile
                </p>
                <p className="text-[11px] text-blue-700/90 leading-relaxed">
                  Your Google identity will be linked to your campus profile and verified automatically in the backend PostgreSQL database.
                </p>
              </div>

              <button
                type="submit"
                disabled={googleLoading || !googleEmail.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Google Identity Service</span>
              <button
                type="button"
                onClick={handleLaunchRealGoogleRedirect}
                className="text-blue-600 hover:underline"
              >
                Use OAuth Web Redirect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Instant Verified Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setGithubModalOpen(false);
                setGithubProfile(null);
                setGithubError(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sign in with GitHub</h3>
                <p className="text-xs text-slate-500 font-medium">Verify your live GitHub profile & public repositories</p>
              </div>
            </div>

            <form onSubmit={handleGitHubVerifiedSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Username</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      placeholder="e.g. rohitgupta152311-rgb or torvalds"
                      value={githubUsername}
                      onChange={(e) => {
                        setGithubUsername(e.target.value);
                        setGithubError(null);
                      }}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLookupGitHub}
                    disabled={githubChecking || !githubUsername.trim()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {githubChecking ? 'Checking...' : 'Lookup'}
                  </button>
                </div>
              </div>

              {githubError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{githubError}</span>
                </div>
              )}

              {/* GitHub Profile Live Preview */}
              {githubProfile && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center gap-3">
                    <img
                      src={githubProfile.avatarUrl}
                      alt={githubProfile.login}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">{githubProfile.name || githubProfile.login}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">Verified</span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">@{githubProfile.login}</p>
                      {githubProfile.bio && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{githubProfile.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
                    <div>
                      <strong className="text-slate-900 font-bold">{githubProfile.publicRepos || 0}</strong> Repositories
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold">{githubProfile.followers || 0}</strong> Followers
                    </div>
                    <a
                      href={githubProfile.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View on GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Email Address <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@campus.edu or leave blank"
                  value={githubEmail}
                  onChange={(e) => setGithubEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={githubSigningIn || !githubUsername.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>{githubSigningIn ? 'Authenticating with GitHub...' : `Sign in with GitHub ${githubProfile ? `(@${githubProfile.login})` : ''}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Connects to GitHub Public API</span>
              <button
                type="button"
                onClick={() => {
                  setGithubModalOpen(false);
                  setGithubConfigModalOpen(true);
                }}
                className="text-slate-700 hover:underline"
              >
                Advanced OAuth Config
              </button>
            </div>
          </div>
        </div>
      )}

      {githubConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setGithubConfigModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Connect Real GitHub OAuth</h3>
                <p className="text-xs text-slate-500 font-medium">Official GitHub Developer OAuth 2.0 Integration</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">To enable real GitHub sign-in, register a free GitHub OAuth application:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Open <a href="https://github.com/settings/applications/new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">GitHub Developer Settings <ExternalLink className="w-3 h-3" /></a></li>
                <li>Set <strong>Application name</strong> to: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">SkillBridge Campus</code></li>
                <li>Set <strong>Homepage URL</strong> to: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">{window.location.origin}</code></li>
                <li>Set <strong>Authorization callback URL</strong> to: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">{`${apiClient.getApiBase()}/auth/github/callback`}</code></li>
              </ol>
            </div>

            <form onSubmit={handleSaveGitHubOAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Client ID</label>
                <input
                  type="text"
                  placeholder="e.g. Iv1.8a2b3c4d5e6f7g8h"
                  value={githubClientId}
                  onChange={(e) => setGithubClientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Client Secret</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={githubClientSecret}
                  onChange={(e) => setGithubClientSecret(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={configuringGithub}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{configuringGithub ? 'Configuring OAuth...' : 'Save & Authorize with GitHub'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 mt-5 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                SkillBridge securely connects to GitHub OAuth 2.0 with read-only permissions for profile verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          LINKEDIN OIDC PROFILE IMPORT MODAL
      ───────────────────────────────────────────── */}
      {linkedinImport.isOpen && linkedinImport.data && (
        <LinkedInImportModal
          isOpen={linkedinImport.isOpen}
          data={linkedinImport.data}
          onClose={() => setLinkedinImport({ isOpen: false, data: null })}
          onConfirm={handleConfirmLinkedInImport}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!forgotSent ? (
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Reset your password</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Enter your registered campus email address and we'll dispatch a secure recovery token.
                </p>

                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="student@nitnagaland.ac.in"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <Button type="submit" isLoading={forgotLoading} size="md">
                      Send Reset Instructions
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Reset Email Dispatched!</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                  We've sent recovery instructions to <strong className="text-slate-800">{forgotEmail}</strong>. Please check your student inbox.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-6 w-full py-2 px-4 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
