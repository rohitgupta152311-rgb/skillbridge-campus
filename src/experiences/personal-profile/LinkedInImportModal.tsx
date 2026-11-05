import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Lock,
  X,
} from 'lucide-react';
import { Button, Input, Select, Avatar } from '../../shared/components';
import { DEPARTMENTS } from '../../foundation/constants';
import { UserRole } from '../../foundation/types';

export interface LinkedInPreviewData {
  provider: 'linkedin' | 'google' | 'github';
  providerAccountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  linkedinUrl?: string;
  verifiedEmail?: boolean;
}

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LinkedInPreviewData;
  onConfirm: (finalData: {
    provider: 'linkedin' | 'google' | 'github';
    providerAccountId: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    headline?: string;
    linkedinUrl?: string;
    department: string;
    currentYear: string;
    university: string;
    role: UserRole;
    preserveManualEdits: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function LinkedInImportModal({
  isOpen,
  onClose,
  data,
  onConfirm,
  isLoading = false,
}: LinkedInImportModalProps) {
  const [fullName, setFullName] = useState(data.fullName || '');
  const [headline, setHeadline] = useState(
    data.headline || `${data.fullName}'s Professional Profile`
  );
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState('3rd Year');
  const [university, setUniversity] = useState('State Technological University');
  const [role, setRole] = useState<UserRole>('mentee');
  const [preserveManualEdits, setPreserveManualEdits] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm({
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      fullName,
      email: data.email,
      avatarUrl: data.avatarUrl,
      headline,
      linkedinUrl: data.linkedinUrl,
      department,
      currentYear: year,
      university,
      role,
      preserveManualEdits,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">LinkedIn Profile Imported</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                OIDC Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Review and confirm your official LinkedIn profile information.
            </p>
          </div>
        </div>

        {/* LinkedIn Policy Disclosure Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official OpenID Connect Integration</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Per LinkedIn Developer policies, SkillBridge requests minimum necessary permissions (<strong>openid, profile, email</strong>). Basic login does not expose university departments or grades; please specify your campus details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imported Identity Card */}
          <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 flex items-center gap-4">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-200 shadow-sm"
              />
            ) : (
              <Avatar name={fullName} size="lg" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 truncate">{fullName}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  Imported
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{data.email}</p>
              {data.linkedinUrl && (
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-violet-600 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <ExternalLink className="w-3 h-3" /> View Linked Profile
                </a>
              )}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-3">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Professional Headline"
              value={headline}
              placeholder="e.g. CS Student | AI Researcher"
              onChange={(e) => setHeadline(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              />
              <Select
                label="Academic Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni'].map(
                  (y) => ({ value: y, label: y })
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Primary Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('mentee')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === 'mentee'
                      ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm">🎓 Mentee</div>
                  <div className="text-[10px] text-slate-500">I want to find mentors</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === 'mentor'
                      ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm">👨‍🏫 Mentor</div>
                  <div className="text-[10px] text-slate-500">I want to guide peers</div>
                </button>
              </div>
            </div>

            {/* Consent Policy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={preserveManualEdits}
                  onChange={(e) => setPreserveManualEdits(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  <strong>Preserve manual profile updates.</strong> Do not automatically overwrite my future profile edits with LinkedIn data during subsequent logins without my explicit consent.
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-4 border-t border-slate-100 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} size="md">
              Save & Complete Campus Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
