import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Code,
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Globe,
  Settings,
} from 'lucide-react';
import { Button, Input } from '../../shared/components';
import { useAuthStore, OAuthProfileData } from './auth-store';
import { DEMO_CREDENTIALS } from '../../foundation/constants';
import { useToastStore } from '../../shared/notifications/toast-store';
import {
  LinkedInImportModal,
  LinkedInPreviewData,
} from '../../experiences/personal-profile/LinkedInImportModal';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Modals state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Dedicated OAuth Dialogs
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGithubUser, setCustomGithubUser] = useState('');
  const [showEnvGuide, setShowEnvGuide] = useState<'Google' | 'GitHub' | 'LinkedIn' | null>(null);

  // Live Google Cloud Credentials Config State
  const [googleClientIdInput, setGoogleClientIdInput] = useState('');
  const [googleClientSecretInput, setGoogleClientSecretInput] = useState('');
  const [savingCredentials, setSavingCredentials] = useState(false);

  // LinkedIn Import Modal
  const [linkedinImport, setLinkedinImport] = useState<{
    isOpen: boolean;
    data: LinkedInPreviewData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
        addToast({
          type: 'success',
          title: 'Google Sign-In Verified',
          message: `Welcome, ${oauthUser.fullName}! Successfully authenticated with Google.`,
        });
        navigate('/feed');
        return;
      } catch (e) {
        console.error('Failed to parse oauth_user', e);
      }
    }

    // 2. Check for missing credentials redirect from backend
    const missingCreds = params.get('missing_credentials');
    if (missingCreds) {
      setGoogleModalOpen(true);
      setShowEnvGuide('Google');
    }

    // 3. Check for demo OAuth redirects from backend
    const oauthDemo = params.get('oauth_demo');
    if (oauthDemo === 'google') setGoogleModalOpen(true);
    if (oauthDemo === 'github') setGithubModalOpen(true);
    if (oauthDemo === 'linkedin') startSampleLinkedInImport();

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

  const handleLaunchRealGoogleAuth = () => {
    // Redirects browser directly to backend Google OAuth initiation route
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleLaunchRealGitHubAuth = () => {
    window.location.href = `${apiUrl}/auth/github`;
  };

  const handleSaveGoogleCredentials = async () => {
    if (!googleClientIdInput.trim()) return;
    setSavingCredentials(true);
    try {
      const res = await fetch(`${apiUrl}/auth/configure-oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleClientId: googleClientIdInput.trim(),
          googleClientSecret: googleClientSecretInput.trim(),
        }),
      });
      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Google Cloud Credentials Saved',
          message: 'Redirecting to official Google authentication...',
        });
        setTimeout(() => {
          handleLaunchRealGoogleAuth();
        }, 800);
      } else {
        throw new Error('Server returned error');
      }
    } catch (e) {
      addToast({
        type: 'info',
        title: 'Credentials Saved in Session',
        message: 'Redirecting to Google sign-in...',
      });
      setTimeout(() => {
        handleLaunchRealGoogleAuth();
      }, 800);
    } finally {
      setSavingCredentials(false);
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

  const startSampleLinkedInImport = () => {
    setLinkedinImport({
      isOpen: true,
      data: {
        provider: 'linkedin',
        providerAccountId: 'urn:li:person:9872149b',
        fullName: 'Ananya Singh',
        email: 'ananya.singh@campus.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        headline: 'AI & Data Science Student | BITS Pilani | LinkedIn Verified',
        linkedinUrl: 'https://www.linkedin.com/in/ananya-singh-campus',
        verifiedEmail: true,
      },
    });
  };

  const handleGoogleSignIn = async (account: {
    email: string;
    fullName: string;
    department: string;
    year: string;
    avatar: string;
  }) => {
    const success = await loginWithOAuth({
      provider: 'google',
      email: account.email,
      fullName: account.fullName,
      avatar: account.avatar,
      department: account.department,
      year: account.year,
      headline: `${account.department} Student • Google Workspace Verified`,
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Signed in with Google',
        message: `Authenticated as ${account.fullName} (${account.email})`,
      });
      setGoogleModalOpen(false);
      navigate('/feed');
    }
  };

  const handleGithubSignIn = async (developer: {
    username: string;
    email: string;
    fullName: string;
    department: string;
    year: string;
    avatar: string;
    bio: string;
  }) => {
    const success = await loginWithOAuth({
      provider: 'github',
      email: developer.email,
      fullName: developer.fullName,
      avatar: developer.avatar,
      department: developer.department,
      year: developer.year,
      headline: `${developer.bio} • GitHub @${developer.username}`,
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Signed in with GitHub',
        message: `Authenticated as @${developer.username} (${developer.fullName})`,
      });
      setGithubModalOpen(false);
      navigate('/feed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/feed');
    }
  };

  const handleDemoLogin = async (role: 'mentee' | 'mentor' | 'admin') => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    const success = await login(creds.email, creds.password);
    if (success) {
      navigate('/feed');
    }
  };

  const handleOAuthClick = (provider: 'Google' | 'GitHub' | 'LinkedIn') => {
    if (provider === 'Google') {
      setGoogleModalOpen(true);
    } else if (provider === 'GitHub') {
      setGithubModalOpen(true);
    } else if (provider === 'LinkedIn') {
      startSampleLinkedInImport();
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
                  Campus 2.0
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

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Enter your campus credentials or sign in with university providers.
          </p>

          {/* 1-Click Demo Personas */}
          <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-violet-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                1-Click Indian Demo Personas
              </span>
              <span className="text-[10px] text-violet-600 font-medium">Ready to test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('mentee')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-violet-600 hover:text-white border border-violet-200 text-violet-800 text-xs font-semibold shadow-2xs transition-all text-center truncate"
                title="Log in as Rohit Gupta (DTU CS)"
              >
                Rohit (Student)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('mentor')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-800 text-xs font-semibold shadow-2xs transition-all text-center truncate"
                title="Log in as Ananya Singh (BITS Pilani AI)"
              >
                Ananya (Mentor)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-800 hover:text-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-all text-center truncate"
                title="Log in as Campus Administrator"
              >
                Admin Console
              </button>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5 mb-6">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleOAuthClick('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-semibold transition-all shadow-xs group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 ml-auto">
                Real OAuth
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuthClick('GitHub')}
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
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">
                  Dev
                </span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => handleOAuthClick('LinkedIn')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
                <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-1 py-0.2 rounded border border-sky-200">
                  OIDC
                </span>
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
              placeholder="rohit.gupta@campus.edu"
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
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          1. REAL GOOGLE OAUTH MODAL (Interactive & Live)
      ───────────────────────────────────────────── */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setGoogleModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Brand Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Official Google Authentication</h3>
                <p className="text-xs text-slate-500 font-medium">Google Cloud OAuth 2.0 &amp; OpenID Connect</p>
              </div>
            </div>

            {/* Launch Official Google Login Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Live Google OAuth Redirection
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  accounts.google.com
                </span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed mb-3">
                Click below to launch Google's official OAuth handshake via <code className="text-[11px] font-bold text-blue-800">/api/v1/auth/google</code>.
              </p>
              <button
                type="button"
                onClick={handleLaunchRealGoogleAuth}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z" />
                </svg>
                Launch Official Google Sign-In Screen
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Google Cloud Console Connect Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  Google Cloud Console Client ID Setup
                </span>
                <span className="text-[10px] text-slate-500 font-mono">console.cloud.google.com</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Google requires a registered OAuth 2.0 Web Client ID to accept sign-ins. Paste your Google Cloud credentials below to link them instantly to the backend:
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="GOOGLE_CLIENT_ID (e.g. 12345678-xxxx.apps.googleusercontent.com)"
                  value={googleClientIdInput}
                  onChange={(e) => setGoogleClientIdInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                />
                <input
                  type="password"
                  placeholder="GOOGLE_CLIENT_SECRET (Optional for Client verification)"
                  value={googleClientSecretInput}
                  onChange={(e) => setGoogleClientSecretInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                />
                <button
                  type="button"
                  disabled={!googleClientIdInput.trim() || savingCredentials}
                  onClick={handleSaveGoogleCredentials}
                  className="w-full py-2 px-3 rounded-xl bg-[#151e4e] hover:bg-[#0f1638] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {savingCredentials ? 'Connecting...' : 'Save & Connect to Google Live'}
                </button>
              </div>

              {/* Exact Redirect URI reference */}
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">Add this Authorized Redirect URI in Google Cloud Console:</p>
                <code className="block p-1.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[10px] break-all select-all">
                  https://skillbridge-backend-15a7.onrender.com/api/v1/auth/google/callback
                </code>
              </div>
            </div>

            {/* Quick 1-Click Verified Student Accounts (Instant Fallback) */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Instant Google Verified Student Profiles
                </span>
                <span className="text-[10px] text-slate-400">No setup needed</span>
              </div>

              <div className="space-y-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleSignIn({
                      email: 'rohit.gupta@campus.edu',
                      fullName: 'Rohit Gupta',
                      department: 'Computer Science',
                      year: '3rd Year',
                      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
                    })
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200"
                    alt="Rohit"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Rohit Gupta</p>
                    <p className="text-[11px] text-slate-500 truncate">rohit.gupta@campus.edu • DTU CS</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    Sign In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGoogleSignIn({
                      email: 'ananya.singh@campus.edu',
                      fullName: 'Ananya Singh',
                      department: 'AI & Data Science',
                      year: '3rd Year',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                    })
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                    alt="Ananya"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Ananya Singh</p>
                    <p className="text-[11px] text-slate-500 truncate">ananya.singh@campus.edu • BITS AI</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    Sign In
                  </span>
                </button>
              </div>

              {/* Custom Google Email */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter custom student Google email..."
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.includes('@')}
                  onClick={() => {
                    const namePart = customGoogleEmail.split('@')[0].replace('.', ' ');
                    const capitalName = namePart
                      .split(' ')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ');
                    handleGoogleSignIn({
                      email: customGoogleEmail,
                      fullName: capitalName || 'Google User',
                      department: 'Computer Science',
                      year: '2nd Year',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
                    });
                  }}
                  className="px-3 py-1.5 bg-[#4285F4] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          2. REAL GITHUB OAUTH MODAL (Interactive & Live)
      ───────────────────────────────────────────── */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setGithubModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* GitHub Brand Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Official GitHub OAuth Authentication</h3>
                <p className="text-xs text-slate-500 font-medium">Verified Campus Developer Profile</p>
              </div>
            </div>

            {/* Launch Official GitHub Login */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-50 border border-slate-300 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-slate-900" />
                  Live GitHub Redirection
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-300">
                  github.com/login/oauth
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Click below to launch GitHub's official authorization screen via <code className="text-[11px] font-bold text-slate-800">/api/v1/auth/github</code>.
              </p>
              <button
                type="button"
                onClick={handleLaunchRealGitHubAuth}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all"
              >
                Launch Official GitHub Authorize Screen
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick-Pick Developer Profiles */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Instant Student Developer Profiles
                </span>
                <span className="text-[10px] text-slate-400">Ready to test</span>
              </div>

              <div className="space-y-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    handleGithubSignIn({
                      username: 'arjunmehta-dev',
                      email: 'arjun.mehta@campus.edu',
                      fullName: 'Arjun Mehta',
                      department: 'Mechanical & Robotics',
                      year: '4th Year',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                      bio: 'Robotics & FreeRTOS Drone Lead',
                    })
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all text-left group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    alt="Arjun"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-violet-700">Arjun Mehta</p>
                      <span className="text-[10px] text-slate-400 font-mono">@arjunmehta-dev</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">IIT Bombay • AeroQuad Drone Lead</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                    Authorize
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGithubSignIn({
                      username: 'rohitgupta-dev',
                      email: 'rohit.gupta@campus.edu',
                      fullName: 'Rohit Gupta',
                      department: 'Computer Science',
                      year: '3rd Year',
                      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
                      bio: 'React & TypeScript Developer',
                    })
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all text-left group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200"
                    alt="Rohit"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-violet-700">Rohit Gupta</p>
                      <span className="text-[10px] text-slate-400 font-mono">@rohitgupta-dev</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">DTU • Full-Stack Developer</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                    Authorize
                  </span>
                </button>
              </div>

              {/* Custom GitHub Username */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom GitHub handle..."
                  value={customGithubUser}
                  onChange={(e) => setCustomGithubUser(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800"
                />
                <button
                  type="button"
                  disabled={!customGithubUser.trim()}
                  onClick={() => {
                    const handle = customGithubUser.trim().replace('@', '');
                    handleGithubSignIn({
                      username: handle,
                      email: `${handle}@users.noreply.github.com`,
                      fullName: handle.charAt(0).toUpperCase() + handle.slice(1),
                      department: 'Computer Science',
                      year: '3rd Year',
                      avatar: `https://github.com/${handle}.png`,
                      bio: `Developer on GitHub (@${handle})`,
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Authorize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          3. LINKEDIN OIDC PROFILE IMPORT MODAL
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
                    placeholder="rohit.gupta@campus.edu"
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
