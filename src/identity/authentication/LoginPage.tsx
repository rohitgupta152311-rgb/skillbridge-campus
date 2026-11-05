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
} from 'lucide-react';
import { Button, Input } from '../../shared/components';
import { useAuthStore } from './auth-store';
import { DEMO_CREDENTIALS } from '../../foundation/constants';
import {
  LinkedInImportModal,
  LinkedInPreviewData,
} from '../../experiences/personal-profile/LinkedInImportModal';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Modals state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // LinkedIn Import Modal
  const [linkedinImport, setLinkedinImport] = useState<{
    isOpen: boolean;
    data: LinkedInPreviewData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const [oauthModal, setOauthModal] = useState<{
    isOpen: boolean;
    provider: 'Google' | 'GitHub' | 'LinkedIn' | null;
    status: 'checking' | 'not_configured' | 'redirecting';
    message?: string;
  }>({
    isOpen: false,
    provider: null,
    status: 'checking',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
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

  const handleConfirmLinkedInImport = async (finalData: any) => {
    const registered = await useAuthStore.getState().register({
      email: finalData.email,
      password: 'demo1234',
      fullName: finalData.fullName,
      role: finalData.role,
      department: finalData.department,
      year: finalData.currentYear,
    });

    if (registered) {
      const user = useAuthStore.getState().user;
      if (user) {
        user.avatar = finalData.avatarUrl || user.avatar;
        user.headline = finalData.headline;
        user.linkedinUrl = finalData.linkedinUrl;
        localStorage.setItem('sb_current_user', JSON.stringify(user));
      }
      setLinkedinImport({ isOpen: false, data: null });
      navigate('/feed');
    }
  };

  const startSampleLinkedInImport = () => {
    setOauthModal({ isOpen: false, provider: null, status: 'checking' });
    setLinkedinImport({
      isOpen: true,
      data: {
        provider: 'linkedin',
        providerAccountId: 'urn:li:person:9872149b',
        fullName: 'Elena Rostova',
        email: 'elena.rostova@campus.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        headline: 'Computer Science & AI Researcher | LinkedIn OpenID Connect User',
        linkedinUrl: 'https://www.linkedin.com/in/elena-rostova-campus',
        verifiedEmail: true,
      },
    });
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

  const handleOAuthClick = async (provider: 'Google' | 'GitHub' | 'LinkedIn') => {
    setOauthModal({
      isOpen: true,
      provider,
      status: 'checking',
    });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    try {
      // Test if backend endpoint exists and is configured
      const res = await fetch(`${apiUrl}/auth/${provider.toLowerCase()}`);
      if (res.status === 501 || res.status === 404 || res.status === 400) {
        const json = await res.json().catch(() => ({}));
        setOauthModal({
          isOpen: true,
          provider,
          status: 'not_configured',
          message: json.message || `${provider} OAuth credentials have not been configured on the backend server.`,
        });
      } else if (res.ok) {
        const json = await res.json();
        if (json.data?.url) {
          window.location.href = json.data.url;
        } else {
          setOauthModal({
            isOpen: true,
            provider,
            status: 'not_configured',
            message: `OAuth redirect URL not provided by the server.`,
          });
        }
      } else {
        setOauthModal({
          isOpen: true,
          provider,
          status: 'not_configured',
          message: `${provider} OAuth provider returned HTTP ${res.status}. Server credentials required in .env.`,
        });
      }
    } catch (err) {
      // Backend not running or offline
      setOauthModal({
        isOpen: true,
        provider,
        status: 'not_configured',
        message: `Backend server at ${apiUrl} is currently offline or unreachable. SkillBridge is operating in local development mode.`,
      });
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
        {/* Ambient glow effects */}
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
            Connect campus talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-300">
              Accelerate your career.
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Join thousands of university peers, verified seniors, and alumni mentors. Share research, master complex coursework, and get referred to top tech internships.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl font-bold text-violet-300">94.8%</div>
              <p className="text-xs text-slate-400 mt-1">Match satisfaction rate with 5-factor AI matching</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl font-bold text-indigo-300">12,400+</div>
              <p className="text-xs text-slate-400 mt-1">Peer tutoring sessions completed on campus</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted credentials & verified student domain authentication</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillBridge</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Sign in with your university credentials or social accounts.
          </p>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthClick('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-xs"
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
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuthClick('GitHub')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthClick('LinkedIn')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-xs"
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
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
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
              placeholder="alex.student@campus.edu"
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
                  className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600 transition-colors"
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
                    className="w-3.5 h-3.5 rounded text-violet-600 border-slate-300 focus:ring-violet-500"
                  />
                  <span className="text-xs text-slate-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(false);
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1-Click Quick Demo Access
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                No typing needed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('mentee')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/50 text-slate-700 transition-all text-xs font-medium group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🎓</span>
                <span className="font-semibold text-slate-800">Mentee</span>
                <span className="text-[10px] text-slate-400">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('mentor')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/50 text-slate-700 transition-all text-xs font-medium group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">👨‍🏫</span>
                <span className="font-semibold text-slate-800">Mentor</span>
                <span className="text-[10px] text-slate-400">Senior Peer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/50 text-slate-700 transition-all text-xs font-medium group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🛡️</span>
                <span className="font-semibold text-slate-800">Admin</span>
                <span className="text-[10px] text-slate-400">Staff / Safety</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have a campus account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">
              Create account
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#support" className="hover:underline">Campus Helpdesk</a>
          </div>
        </div>
      </div>

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
                    placeholder="student@campus.edu"
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

      {/* OAuth Configuration Guidance Modal (When provider credentials not yet registered) */}
      {oauthModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setOauthModal({ isOpen: false, provider: null, status: 'checking' })}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {oauthModal.provider} OAuth Status
                </h3>
                <p className="text-xs text-slate-500">Render Backend Integration Notice</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">
                {oauthModal.message || `${oauthModal.provider} OAuth requires client credentials in server/.env:`}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                {oauthModal.provider === 'Google' && (
                  <>
                    GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com<br />
                    GOOGLE_CLIENT_SECRET=your_google_secret
                  </>
                )}
                {oauthModal.provider === 'GitHub' && (
                  <>
                    GITHUB_CLIENT_ID=your_github_client_id<br />
                    GITHUB_CLIENT_SECRET=your_github_client_secret
                  </>
                )}
                {oauthModal.provider === 'LinkedIn' && (
                  <>
                    LINKEDIN_CLIENT_ID=your_linkedin_client_id<br />
                    LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                In local development or evaluation mode without cloud OAuth credentials, you can use the 1-Click Demo accounts or standard campus email login.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              {oauthModal.provider === 'LinkedIn' && (
                <button
                  type="button"
                  onClick={startSampleLinkedInImport}
                  className="px-4 py-2 rounded-xl bg-[#0077b5] text-white text-xs font-semibold hover:bg-[#006097] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Review LinkedIn Import (OIDC)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOauthModal({ isOpen: false, provider: null, status: 'checking' });
                  handleDemoLogin('mentee');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
              >
                Log In as Demo Mentee
              </button>
              <button
                type="button"
                onClick={() => setOauthModal({ isOpen: false, provider: null, status: 'checking' })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Profile Import Modal */}
      {linkedinImport.isOpen && linkedinImport.data && (
        <LinkedInImportModal
          isOpen={linkedinImport.isOpen}
          data={linkedinImport.data}
          onClose={() => setLinkedinImport({ isOpen: false, data: null })}
          onConfirm={handleConfirmLinkedInImport}
        />
      )}
    </div>
  );
}
