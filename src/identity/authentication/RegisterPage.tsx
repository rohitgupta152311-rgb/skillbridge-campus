import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button, Input, Select } from '../../shared/components';
import { useAuthStore } from './auth-store';
import { DEPARTMENTS } from '../../foundation/constants';
import { UserRole } from '../../foundation/types';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mentee' as UserRole,
    department: DEPARTMENTS[0],
    year: '1st Year',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      e.email = 'Email address is required';
    } else if (!EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
      e.email = 'Please enter a valid campus or university email (e.g. name@nitnagaland.ac.in)';
    }
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const cleanEmail = form.email.trim().toLowerCase();
    const success = await register({
      email: cleanEmail,
      password: form.password,
      fullName: form.fullName.trim(),
      role: form.role,
      department: form.department,
      year: form.year,
    });
    if (success) {
      navigate('/login?pending=true');
    }
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    clearError();
    setErrors((e) => {
      const n = { ...e };
      delete n[field];
      return n;
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
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
              <p className="text-xs text-slate-400">Join the Academic & Career Network</p>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Level up together. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-300">
              From freshers to alumni leaders.
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Whether you want to learn complex algorithms from senior students or give back to the university community as a verified mentor, SkillBridge connects you with the right peers.
          </p>

          <div className="space-y-3 pt-6 border-t border-white/10 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Smart 5-factor AI matching based on course syllabus & schedule</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Real-time chat, 1-on-1 video rooms, and collaborative code sharing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Verified peer skill endorsements on your campus profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 my-auto">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillBridge</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Join the campus mentorship network in under two minutes.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Aarav Sharma"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Campus Email"
              type="email"
              placeholder="student@nitnagaland.ac.in"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Campus Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => update('role', 'mentee')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.role === 'mentee'
                      ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-base mb-1">🎓</div>
                  <div className="text-xs font-bold text-slate-900">Mentee</div>
                  <div className="text-[11px] text-slate-500">I want to find mentors & learn</div>
                </button>

                <button
                  type="button"
                  onClick={() => update('role', 'mentor')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.role === 'mentor'
                      ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-base mb-1">👨‍🏫</div>
                  <div className="text-xs font-bold text-slate-900">Mentor</div>
                  <div className="text-[11px] text-slate-500">I want to mentor & guide peers</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Department"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              />
              <Select
                label="Year of Study"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                options={[
                  '1st Year',
                  '2nd Year',
                  '3rd Year',
                  '4th Year',
                  'Graduate / Master',
                  'Alumni',
                ].map((y) => ({ value: y, label: y }))}
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
