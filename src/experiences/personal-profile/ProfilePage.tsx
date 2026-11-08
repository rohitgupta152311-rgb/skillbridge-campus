import { apiClient } from '../../infrastructure/api/api-client';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon, Mail, Building2, BookOpen, Globe, Save,
  Award, ThumbsUp, ExternalLink, Calendar, CheckCircle, Plus,
  Edit3, Shield, Rocket, ArrowLeftRight, Star, Sparkles, X,
  CheckCircle2, Clock, Camera, Upload, Trash2, Check, RefreshCw, Image
} from 'lucide-react';
import { Card, Button, Input, Textarea, Avatar, Badge, StarRating, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  updateUser, getSkills, endorseSkill, getReviewsByMentor, getProjects
} from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import { DEPARTMENTS } from '../../foundation/constants';
import { formatDate } from '../../foundation/helpers';
import { SkillExchangeEntry, ReputationBadge } from '../../foundation/types';
import { LinkedInImportModal, LinkedInPreviewData } from './LinkedInImportModal';

const PRESET_AVATARS = [
  { label: 'Engineering', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&fit=crop&q=80' },
  { label: 'Computer Science', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&fit=crop&q=80' },
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&fit=crop&q=80' },
  { label: 'Mathematics', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&fit=crop&q=80' },
  { label: 'Robotics', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&fit=crop&q=80' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&fit=crop&q=80' },
];

const DEFAULT_BADGES: ReputationBadge[] = [
  {
    id: 'b1',
    badgeType: 'knowledge_sharer',
    title: 'Knowledge Sharer',
    description: 'Shared 10+ hours of peer tutoring in technical disciplines.',
    tier: 'gold',
    earnedAt: '2026-02-15T00:00:00Z',
    points: 250,
  },
  {
    id: 'b2',
    badgeType: 'project_builder',
    title: 'Project Builder',
    description: 'Architected and led active campus project initiatives.',
    tier: 'gold',
    earnedAt: '2026-03-01T00:00:00Z',
    points: 300,
  },
  {
    id: 'b3',
    badgeType: 'fast_learner',
    title: 'Fast Learner',
    description: 'Completed 5 reciprocal skill exchanges with 100% completion.',
    tier: 'silver',
    earnedAt: '2026-02-28T00:00:00Z',
    points: 150,
  },
  {
    id: 'b4',
    badgeType: 'reliable_collaborator',
    title: 'Reliable Collaborator',
    description: 'Maintained 5.0 punctuality and peer ratings on team milestones.',
    tier: 'silver',
    earnedAt: '2026-01-20T00:00:00Z',
    points: 200,
  },
];

export function ProfilePage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [editing, setEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Skill Add Modal state
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [skillMatrixType, setSkillMatrixType] = useState<'offered' | 'wanted'>('offered');
  const [newSkillForm, setNewSkillForm] = useState({
    skillName: '',
    proficiency: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    yearsExperience: 1,
    preferredFormats: ['1-on-1 Sessions', 'Code Review'],
  });

  // LinkedIn Import state
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Dedicated Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarTab, setAvatarTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Dedicated Inline About State
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(user?.bio || '');
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const skills = useMemo(() => getSkills(), [refreshKey]);
  const mentorReviews = useMemo(() => user?.role === 'mentor' ? getReviewsByMentor(user.id) : [], [user, refreshKey]);

  // Projects user is part of
  const myProjects = useMemo(() => {
    if (!user) return [];
    const all = getProjects();
    return all.filter(p => p.ownerId === user.id || p.currentMembers.some(m => m.userId === user.id));
  }, [user, refreshKey]);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    department: user?.department || '',
    year: user?.year || '',
    university: user?.university || 'State Technological University',
    portfolioUrl: user?.portfolioUrl || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    languages: user?.languages || ['English'],
    avatar: user?.avatar || '',
  });

  if (!user) return null;

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        headline: user.headline || '',
        bio: user.bio || '',
        department: user.department || '',
        year: user.year || '',
        university: user.university || 'NIT Nagaland',
        portfolioUrl: user.portfolioUrl || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        languages: user.languages || ['English'],
        avatar: user.avatar || '',
      });
      setAboutText(user.bio || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  // Client-side image compression for mobile & desktop uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 512;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarPreview(dataUrl);
          setForm(f => ({ ...f, avatar: dataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async (forcedUrl?: string) => {
    const finalUrl = forcedUrl !== undefined ? forcedUrl : avatarPreview;
    setIsSavingAvatar(true);
    try {
      useAuthStore.getState().updateUser({ avatar: finalUrl });
      setForm(f => ({ ...f, avatar: finalUrl }));
      await apiClient.updateProfile({ avatar: finalUrl });
      setIsAvatarModalOpen(false);
      setRefreshKey(k => k + 1);
      addToast({
        type: 'success',
        title: finalUrl ? 'Profile picture updated successfully!' : 'Profile picture removed.',
      });
    } catch {
      addToast({ type: 'error', title: 'Failed to update profile picture' });
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    try {
      const trimmed = aboutText.trim();
      useAuthStore.getState().updateUser({ bio: trimmed });
      setForm(f => ({ ...f, bio: trimmed }));
      await apiClient.updateProfile({ bio: trimmed });
      setIsEditingAbout(false);
      setRefreshKey(k => k + 1);
      addToast({ type: 'success', title: 'About section updated successfully!' });
    } catch {
      addToast({ type: 'error', title: 'Failed to update about section' });
    } finally {
      setIsSavingAbout(false);
    }
  };

  const userBadges = (user.badges && user.badges.length > 0) ? user.badges : DEFAULT_BADGES;

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      addToast({ type: 'error', title: 'Full name cannot be empty' });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      headline: form.headline.trim(),
      bio: form.bio.trim(),
      department: form.department,
      year: form.year,
      university: form.university,
      portfolioUrl: form.portfolioUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      languages: form.languages,
      avatar: form.avatar,
    };

    useAuthStore.getState().updateUser(payload);
    const updated = await apiClient.updateProfile(payload);
    if (updated) {
      useAuthStore.setState({ user: { ...user, ...updated } });
    }

    setEditing(false);
    setRefreshKey(k => k + 1);
    addToast({ type: 'success', title: 'Profile details saved successfully!' });
  };

  const handleEndorse = (skillId: string) => {
    endorseSkill(skillId, user);
    setRefreshKey(k => k + 1);
    addToast({ type: 'success', title: 'Skill endorsement updated!' });
  };

  const handleOpenAddSkill = (type: 'offered' | 'wanted') => {
    setSkillMatrixType(type);
    setNewSkillForm({
      skillName: '',
      proficiency: 'intermediate',
      yearsExperience: 1,
      preferredFormats: ['1-on-1 Sessions', 'Code Review'],
    });
    setIsAddSkillOpen(true);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.skillName.trim() || !user) return;

    const newEntry: SkillExchangeEntry = {
      skillName: newSkillForm.skillName.trim(),
      category: 'Technical',
      proficiency: newSkillForm.proficiency,
      yearsExperience: newSkillForm.yearsExperience,
      preferredTeachingFormats: newSkillForm.preferredFormats,
    };

    let updatedUser;
    if (skillMatrixType === 'offered') {
      const offered = [...(user.skillsOffered || []), newEntry];
      updatedUser = updateUser(user.id, { skillsOffered: offered });
    } else {
      const wanted = [...(user.skillsWanted || []), newEntry];
      updatedUser = updateUser(user.id, { skillsWanted: wanted });
    }

    if (updatedUser) {
      localStorage.setItem('sb_current_user', JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });
    }

    addToast({
      type: 'success',
      title: skillMatrixType === 'offered' ? 'Teaching skill added!' : 'Learning goal added!',
    });

    setIsAddSkillOpen(false);
    setRefreshKey(k => k + 1);
  };

  const isLinkedInConnected = Boolean(user.accounts?.some(a => a.provider?.toLowerCase() === 'linkedin'));

  const handleInitiateLinkedInConnect = async () => {
    try {
      const providers = await apiClient.getAuthProviders();
      if (!providers.linkedinConfigured) {
        addToast({
          type: 'warning',
          title: 'LinkedIn OAuth Not Configured',
          message: 'LinkedIn OAuth credentials are not configured on the backend server. You can enter your LinkedIn profile link manually in the edit section below.',
        });
        return;
      }
      window.location.href = `${apiClient.getApiBase()}/auth/linkedin`;
    } catch {
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to authentication service.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in px-4 sm:px-6">
      {/* ── PROFILE COVER & HEADER CARD ── */}
      <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm">
        {/* Cover Photo */}
        <div className="h-44 bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 relative">
          <div className="absolute inset-0 bg-white/5 opacity-50" />
        </div>

        {/* Profile Intro Area */}
        <div className="p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-20 mb-4">
            <div className="relative group self-start sm:self-auto">
              <Avatar
                name={user.fullName}
                src={form.avatar || user.avatar}
                size="xl"
                showStatus
                status={user.onlineStatus}
                className="ring-4 ring-white shadow-lg !w-24 !h-24 sm:!w-28 sm:!h-28 !text-2xl cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(form.avatar || user.avatar || '');
                  setIsAvatarModalOpen(true);
                }}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-md border-2 border-white transition-transform hover:scale-110 flex items-center justify-center"
                title="Change Profile Picture"
                aria-label="Change Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAvatarPreview(form.avatar || user.avatar || '');
                  setIsAvatarModalOpen(true);
                }}
                className="text-xs text-violet-700 border-violet-200 hover:bg-violet-50 font-semibold"
                leftIcon={<Camera className="w-3.5 h-3.5" />}
              >
                Change Photo
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleInitiateLinkedInConnect}
                className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 font-semibold"
              >
                {isLinkedInConnected ? 'Resync LinkedIn Profile' : 'Connect LinkedIn'}
              </Button>

              <Button
                variant={editing ? 'primary' : 'outline'}
                size="sm"
                onClick={editing ? handleSave : () => setEditing(true)}
                leftIcon={editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              >
                {editing ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                  title="Change Name & Details"
                  aria-label="Change Name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {user.isVerified && (
                <Badge variant="success" size="sm" className="gap-1">
                  <Shield className="w-3 h-3" /> Verified Campus Identity
                </Badge>
              )}
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                Peer Contributor & Mentor
              </span>
            </div>

            <p className="text-sm font-medium text-slate-700">
              {user.headline || `${user.department} Student at ${user.university || 'State Technological University'}`}
            </p>

            <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span>{user.university || 'State Technological University'}</span>
              <span>•</span>
              <span>{user.department}</span>
              <span>•</span>
              <span>{user.year}</span>
            </p>

            {/* Social & Portfolio Links */}
            <div className="flex gap-3 pt-2">
              {user.portfolioUrl && (
                <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-violet-600 hover:underline">
                  <Globe className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-slate-700 hover:text-black">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> GitHub
                </a>
              )}
              {user.linkedinUrl ? (
                <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  <span>LinkedIn ({isLinkedInConnected ? 'OAuth Connected' : 'Profile Link'})</span>
                </a>
              ) : (
                <span className="text-xs flex items-center gap-1 text-slate-400">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  <span>LinkedIn: Not connected</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── EDIT FORM (When in edit mode) ── */}
      {editing ? (
        <Card padding="lg" className="border border-slate-200 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            />
            <Input
              label="Professional Headline"
              value={form.headline}
              placeholder="e.g. Junior CS Student | Full-Stack Developer"
              onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
            />
          </div>

          <Textarea
            label="About / Bio"
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Introduce your academic background, research interests, and project experience..."
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
              <select
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic Year</label>
              <select
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white"
              >
                {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni', 'Faculty'].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <Input
              label="University"
              value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Portfolio URL"
              value={form.portfolioUrl}
              onChange={e => setForm(f => ({ ...f, portfolioUrl: e.target.value }))}
            />
            <Input
              label="GitHub Profile URL"
              value={form.githubUrl}
              onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
            />
            <Input
              label="LinkedIn Profile URL"
              value={form.linkedinUrl}
              onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Avatar Image URL"
              value={form.avatar}
              placeholder="https://... or upload below"
              onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const base64 = reader.result as string;
                    try {
                      const uploadedUrl = await apiClient.uploadAvatar(base64);
                      setForm(f => ({ ...f, avatar: uploadedUrl }));
                    } catch {
                      setForm(f => ({ ...f, avatar: base64 }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </div>
        </Card>
      ) : (
        /* ── PROFILE ABOUT SECTION ── */
        <Card padding="lg" className="border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">About Me</h2>
              <span className="text-[11px] text-slate-400 font-medium">&bull; Academic &amp; Peer Bio</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold text-violet-700 border-violet-200 hover:bg-violet-50"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={() => {
                setAboutText(user.bio || form.bio || '');
                setIsEditingAbout(!isEditingAbout);
              }}
            >
              {isEditingAbout ? 'Cancel' : (user.bio ? 'Edit About' : 'Add About')}
            </Button>
          </div>

          {isEditingAbout ? (
            <div className="space-y-3 pt-1 animate-fade-in">
              <Textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                placeholder="Introduce your academic background, research interests, technical skills, and project goals..."
                className="text-sm"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">{aboutText.length} characters</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingAbout(false);
                      setAboutText(user.bio || form.bio || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAbout}
                    disabled={isSavingAbout}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    {isSavingAbout ? 'Saving...' : 'Save About'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {user.bio ? (
                user.bio
              ) : (
                <span className="text-slate-400 italic">
                  No about bio added yet. Click &quot;Add About&quot; above to introduce yourself to peers and mentors!
                </span>
              )}
            </p>
          )}
        </Card>
      )}

      {/* ── DUAL SKILL MATRICES (Skills I Teach & Skills I Want) ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Column 1: Skills I Can Teach */}
        <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Skills I Can Teach
              </h2>
              <p className="text-xs text-slate-500">Your expertise available for peer exchange & mentoring</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => handleOpenAddSkill('offered')}
            >
              Add Skill
            </Button>
          </div>

          <div className="space-y-2.5">
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              user.skillsOffered.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{skill.skillName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                        {skill.proficiency}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {skill.yearsExperience ? `${skill.yearsExperience} yr(s) exp • ` : ''}
                      Formats: {(skill.preferredTeachingFormats || ['1-on-1 Sessions']).join(', ')}
                    </p>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs">Offering</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet. Click "+ Add Skill" to start offering knowledge.</p>
            )}
          </div>
        </Card>

        {/* Column 2: Skills I Want to Learn */}
        <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                Skills I Want to Learn
              </h2>
              <p className="text-xs text-slate-500">Topics you want to master through peer exchange</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => handleOpenAddSkill('wanted')}
            >
              Add Goal
            </Button>
          </div>

          <div className="space-y-2.5">
            {user.skillsWanted && user.skillsWanted.length > 0 ? (
              user.skillsWanted.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{skill.skillName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-violet-100 text-violet-800">
                        Target: {skill.proficiency}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Formats: {(skill.preferredTeachingFormats || ['1-on-1 Sessions', 'Project Collaboration']).join(', ')}
                    </p>
                  </div>
                  <span className="text-violet-700 font-bold text-xs">Seeking</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No learning goals listed yet. Click "+ Add Goal" to connect with mentors.</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── REPUTATION BADGES & CREDIBILITY ── */}
      <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Verified Campus Reputation Badges
            </h2>
            <p className="text-xs text-slate-500">Earned through active peer tutoring, project contributions, and reliability</p>
          </div>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
            {userBadges.reduce((sum, b) => sum + (b.points || 100), 0)} Total Rep Points
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:border-violet-200 transition-all space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {badge.badgeType === 'knowledge_sharer' ? '💡' :
                   badge.badgeType === 'project_builder' ? '🚀' :
                   badge.badgeType === 'fast_learner' ? '⚡' : '🤝'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  badge.tier === 'gold' ? 'bg-amber-100 text-amber-900' :
                  badge.tier === 'silver' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-900'
                }`}>
                  {badge.tier} Tier
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900">{badge.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>+{badge.points || 100} pts</span>
                <span>{formatDate(badge.earnedAt || badge.dateEarned || new Date().toISOString())}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── PROJECTSPACE INITIATIVES & CONTRIBUTIONS ── */}
      <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-violet-600" />
              ProjectSpace Initiatives & Contributions
            </h2>
            <p className="text-xs text-slate-500">Collaborative systems, hackathon builds, and campus research projects</p>
          </div>
          <Link to="/projects">
            <Button variant="outline" size="sm" className="text-xs">
              Explore ProjectSpace
            </Button>
          </Link>
        </div>

        {myProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {myProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:border-violet-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm">{project.category}</Badge>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {project.status === 'recruiting' ? 'Recruiting' : 'In Progress'}
                  </span>
                </div>

                <div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-bold text-sm text-slate-900 hover:text-violet-600 transition-colors block"
                  >
                    {project.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Role: <strong className="text-slate-800 font-semibold">{project.ownerId === user.id ? 'Creator / Lead' : 'Contributor'}</strong>
                  </span>
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-semibold text-violet-600 hover:underline"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Rocket className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No active projects yet</p>
            <p className="text-[11px] text-slate-500">Launch an initiative or apply to join an existing campus team.</p>
            <Link to="/projects">
              <Button variant="primary" size="sm" className="mt-2 text-xs">
                Browse Campus Projects
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* ── PEER ENDORSEMENTS ── */}
      <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Skills & Peer Endorsements</h2>
          <p className="text-xs text-slate-500">Endorsements from classmates, mentors, and project teammates.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-violet-200 bg-slate-50/50 transition-colors"
            >
              <div>
                <span className="font-semibold text-sm text-slate-900">{skill.name}</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {skill.endorsementsCount} {skill.endorsementsCount === 1 ? 'endorsement' : 'endorsements'}
                  {skill.endorsers && skill.endorsers.length > 0 && (
                    <span> • Endorsed by {skill.endorsers[0].name}</span>
                  )}
                </p>
              </div>

              <Button
                size="sm"
                variant={skill.isEndorsedByMe ? 'primary' : 'outline'}
                className={`text-xs !py-1 !px-2.5 ${skill.isEndorsedByMe ? '!bg-violet-600' : ''}`}
                leftIcon={<ThumbsUp className="w-3 h-3" />}
                onClick={() => handleEndorse(skill.id)}
              >
                {skill.isEndorsedByMe ? 'Endorsed' : 'Endorse'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* ── MENTORSHIP REVIEWS SECTION (If mentor) ── */}
      {user.role === 'mentor' && mentorReviews.length > 0 && (
        <Card padding="lg" className="border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Verified Peer Reviews & Ratings</h2>
            <span className="text-xs font-semibold text-slate-500">{mentorReviews.length} verified reviews</span>
          </div>

          <div className="space-y-3">
            {mentorReviews.map(r => (
              <div key={r.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <StarRating rating={r.overallRating} size="sm" />
                  <span className="text-[11px] text-slate-400">{formatDate(r.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 italic">"{r.review}"</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── ADD SKILL MODAL ── */}
      <Modal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        title={skillMatrixType === 'offered' ? 'Add Skill You Can Teach' : 'Add Skill You Want to Learn'}
        size="md"
      >
        <form onSubmit={handleAddSkillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill or Topic Name
            </label>
            <input
              type="text"
              placeholder="e.g. ReactJS, PyTorch, ESP32, Docker"
              value={newSkillForm.skillName}
              onChange={e => setNewSkillForm({ ...newSkillForm, skillName: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:border-violet-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {skillMatrixType === 'offered' ? 'Your Current Proficiency' : 'Target Proficiency'}
              </label>
              <select
                value={newSkillForm.proficiency}
                onChange={e => setNewSkillForm({ ...newSkillForm, proficiency: e.target.value as any })}
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {skillMatrixType === 'offered' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newSkillForm.yearsExperience}
                  onChange={e => setNewSkillForm({ ...newSkillForm, yearsExperience: Number(e.target.value) })}
                  className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save to Skill Matrix
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── LINKEDIN IMPORT MODAL (Only when verified OAuth payload present) ── */}
      {isLinkedInModalOpen && isLinkedInConnected && (
        <LinkedInImportModal
          isOpen={isLinkedInModalOpen}
          onClose={() => setIsLinkedInModalOpen(false)}
          data={{
            provider: 'linkedin',
            providerAccountId: user.accounts?.find(a => a.provider === 'linkedin')?.id || 'li_verified',
            fullName: user.fullName,
            email: user.email,
            avatarUrl: user.avatar,
            headline: user.headline || '',
            linkedinUrl: user.linkedinUrl || '',
            verifiedEmail: true,
          }}
        onConfirm={async (finalData) => {
          updateUser(user.id, {
            fullName: finalData.fullName,
            headline: finalData.headline,
            linkedinUrl: finalData.linkedinUrl,
            department: finalData.department,
            year: finalData.currentYear,
            university: finalData.university,
          });
          const updated = {
            ...user,
            fullName: finalData.fullName,
            headline: finalData.headline,
            linkedinUrl: finalData.linkedinUrl,
            department: finalData.department,
            year: finalData.currentYear,
            university: finalData.university,
          };
          localStorage.setItem('sb_current_user', JSON.stringify(updated));
          useAuthStore.setState({ user: updated });
          setIsLinkedInModalOpen(false);
          setRefreshKey(k => k + 1);
          addToast({ type: 'success', title: 'LinkedIn credentials and profile verified!' });
        }}
      />
      )}

      {/* ── UPDATE PROFILE PICTURE MODAL ── */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Update Profile Picture"
        size="md"
      >
        <div className="space-y-5">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Avatar
              name={user.fullName}
              src={avatarPreview}
              size="xl"
              className="ring-4 ring-violet-200 shadow-md !w-24 !h-24 !text-2xl"
            />
            <p className="text-xs font-semibold text-slate-700">Preview</p>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setAvatarTab('upload')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                avatarTab === 'upload' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setAvatarTab('preset')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                avatarTab === 'preset' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setAvatarTab('url')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                avatarTab === 'url' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Upload Tab */}
          {avatarTab === 'upload' && (
            <div className="space-y-3">
              <label
                htmlFor="avatar-file-input"
                className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-violet-50/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Click to upload photo from your device</p>
                  <p className="text-[11px] text-slate-500">Supports PNG, JPG, WebP (auto-optimized)</p>
                </div>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          )}

          {/* Preset Avatars Tab */}
          {avatarTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Choose a high-resolution institutional avatar:</p>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatarPreview === preset.url;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAvatarPreview(preset.url)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-full object-cover shadow-xs" />
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* URL Tab */}
          {avatarTab === 'url' && (
            <div className="space-y-3">
              <Input
                label="Direct Image URL"
                placeholder="https://example.com/photo.jpg"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  setAvatarPreview(e.target.value);
                }}
              />
              <p className="text-[11px] text-slate-400">Paste any public web image or GitHub avatar link.</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {avatarPreview ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAvatarPreview('');
                  handleSaveAvatar('');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove Picture
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAvatarModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveAvatar()}
                disabled={isSavingAvatar}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                {isSavingAvatar ? 'Saving...' : 'Apply Picture'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
