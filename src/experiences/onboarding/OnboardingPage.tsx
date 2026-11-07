import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeftRight,
  Plus,
  X,
  Clock,
  Shield,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { apiClient } from '../../infrastructure/api/api-client';
import { useToastStore } from '../../shared/notifications/toast-store';
import { Button, Card, Input } from '../../shared/components';
import { DayOfWeek, ProficiencyLevel, SkillExchangeEntry } from '../../foundation/types';

const COMMON_DEPARTMENTS = [
  'Electrical & Electronics Engineering (EEE)',
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Information Technology (IT)',
  'Data Science & Artificial Intelligence',
  'Biotechnology',
];

const COMMON_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate / M.Tech / PhD'];

const SUGGESTED_SKILLS = [
  'Power Electronics',
  'Circuit Analysis',
  'MATLAB & Simulink',
  'Embedded Systems (8051 / ARM)',
  'VLSI & Verilog',
  'Python Programming',
  'React & Frontend Development',
  'Node.js & Backend APIs',
  'Data Structures & Algorithms',
  'Machine Learning & PyTorch',
  'IoT & Arduino / ESP32',
  'SQL & Database Design',
];

const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function OnboardingPage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [step, setStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form states initialized with existing user data
  const [university, setUniversity] = useState(user?.university || 'NIT Nagaland');
  const [department, setDepartment] = useState(user?.department || COMMON_DEPARTMENTS[0]);
  const [year, setYear] = useState(user?.year || '2nd Year');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Skills Offered
  const [skillsOffered, setSkillsOffered] = useState<SkillExchangeEntry[]>(
    user?.skillsOffered || [
      { skillName: 'Circuit Analysis', proficiency: 'intermediate', category: 'Core Engineering' },
    ]
  );
  const [newSkillOfferedName, setNewSkillOfferedName] = useState('');
  const [newSkillOfferedProf, setNewSkillOfferedProf] = useState<ProficiencyLevel>('intermediate');

  // Skills Wanted
  const [skillsWanted, setSkillsWanted] = useState<SkillExchangeEntry[]>(
    user?.skillsWanted || [
      { skillName: 'React & Frontend Development', proficiency: 'beginner', category: 'Software' },
    ]
  );
  const [newSkillWantedName, setNewSkillWantedName] = useState('');
  const [newSkillWantedProf, setNewSkillWantedProf] = useState<ProficiencyLevel>('beginner');

  // Availability & Formats
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>(
    user?.availableDays && user.availableDays.length > 0
      ? user.availableDays
      : ['monday', 'wednesday', 'saturday']
  );
  const [preferredFormat, setPreferredFormat] = useState<'1-on-1' | 'project-based'>('1-on-1');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAddSkillOffered = () => {
    if (!newSkillOfferedName.trim()) return;
    if (skillsOffered.some(s => s.skillName.toLowerCase() === newSkillOfferedName.trim().toLowerCase())) return;
    setSkillsOffered([
      ...skillsOffered,
      { skillName: newSkillOfferedName.trim(), proficiency: newSkillOfferedProf, category: 'Technical' },
    ]);
    setNewSkillOfferedName('');
  };

  const handleRemoveSkillOffered = (name: string) => {
    setSkillsOffered(skillsOffered.filter(s => s.skillName !== name));
  };

  const handleAddSkillWanted = () => {
    if (!newSkillWantedName.trim()) return;
    if (skillsWanted.some(s => s.skillName.toLowerCase() === newSkillWantedName.trim().toLowerCase())) return;
    setSkillsWanted([
      ...skillsWanted,
      { skillName: newSkillWantedName.trim(), proficiency: newSkillWantedProf, category: 'Technical' },
    ]);
    setNewSkillWantedName('');
  };

  const handleRemoveSkillWanted = (name: string) => {
    setSkillsWanted(skillsWanted.filter(s => s.skillName !== name));
  };

  const toggleDay = (day: DayOfWeek) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const saveProgress = async (isFinal = false) => {
    setIsSaving(true);
    try {
      const payload = {
        university,
        department,
        year,
        headline: headline || `${year} ${department} student`,
        bio: bio || `Student at ${university} focused on peer collaborative learning and skill exchange.`,
        skillsOffered,
        skillsWanted,
        availableDays,
      };

      await apiClient.updateProfile(payload);
      updateUser(payload);

      addToast({
        type: 'success',
        title: isFinal ? 'Campus profile completed!' : 'Progress saved successfully!',
        message: isFinal
          ? 'Your profile is ready for peer matching and exchange.'
          : 'You can return and update your profile at any time.',
      });

      if (isFinal) {
        navigate('/feed');
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Could not save profile',
        message: 'Please verify your connection and try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Campus Onboarding &amp; Profile Setup</h1>
              <p className="text-xs text-slate-500">Step {step} of 4 &bull; Tailor your reciprocal peer exchange experience</p>
            </div>
          </div>
          <button
            onClick={() => saveProgress(false)}
            disabled={isSaving}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Progress</span>
          </button>
        </div>

        {/* Stepper Dots */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { s: 1, label: 'Campus Identity' },
            { s: 2, label: 'Skills Offered' },
            { s: 3, label: 'Skills Wanted' },
            { s: 4, label: 'Availability' },
          ].map(item => (
            <div key={item.s} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= item.s ? 'bg-violet-600' : 'bg-slate-200'
                }`}
              />
              <span className={`text-[10px] font-bold block truncate ${
                step === item.s ? 'text-violet-700' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Campus Identity */}
        {step === 1 && (
          <Card className="p-6 space-y-5 bg-white border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-600" />
                <span>1. Verify Your Campus Identity</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your university and department accurately reflect your academic standing.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={university}
                  onChange={e => setUniversity(e.target.value)}
                  placeholder="e.g. National Institute of Technology (NIT) Nagaland"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department / Branch</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {COMMON_DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {COMMON_YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. 2nd Year EEE Student &bull; IoT Enthusiast"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Briefly describe your academic interests, engineering projects, or goals..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                className="bg-slate-900 text-white font-bold text-xs"
              >
                <span>Next: Skills Offered</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: Skills Offered */}
        {step === 2 && (
          <Card className="p-6 space-y-5 bg-white border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>2. What Skills Can You Share / Teach?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add 1 or more subjects, tools, or proficiencies you can help your campus peers with.
              </p>
            </div>

            {/* Current Skills Offered */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Your Active Offerings</label>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map(s => (
                  <span
                    key={s.skillName}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
                  >
                    <span>{s.skillName}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 capitalize">({s.proficiency})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillOffered(s.skillName)}
                      className="text-emerald-500 hover:text-emerald-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skillsOffered.length === 0 && (
                  <p className="text-xs text-amber-600 italic">Please add at least one skill you can offer.</p>
                )}
              </div>
            </div>

            {/* Add Custom Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. Verilog, MATLAB)..."
                value={newSkillOfferedName}
                onChange={e => setNewSkillOfferedName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkillOffered())}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <select
                value={newSkillOfferedProf}
                onChange={e => setNewSkillOfferedProf(e.target.value as ProficiencyLevel)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSkillOffered}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Add Suggestions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!skillsOffered.some(s => s.skillName === skill)) {
                        setSkillsOffered([...skillsOffered, { skillName: skill, proficiency: 'intermediate', category: 'Technical' }]);
                      }
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-xs">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
                disabled={skillsOffered.length === 0}
                className="bg-slate-900 text-white font-bold text-xs"
              >
                <span>Next: Skills Wanted</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: Skills Wanted */}
        {step === 3 && (
          <Card className="p-6 space-y-5 bg-white border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-600" />
                <span>3. What Skills Do You Want to Learn?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Our 5-factor matching algorithm uses your desired skills to find peers who can teach them.
              </p>
            </div>

            {/* Current Skills Wanted */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Your Learning Goals</label>
              <div className="flex flex-wrap gap-2">
                {skillsWanted.map(s => (
                  <span
                    key={s.skillName}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold"
                  >
                    <span>{s.skillName}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillWanted(s.skillName)}
                      className="text-violet-500 hover:text-violet-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skillsWanted.length === 0 && (
                  <p className="text-xs text-amber-600 italic">Please add at least one skill you want to learn.</p>
                )}
              </div>
            </div>

            {/* Add Custom Wanted Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add desired skill (e.g. Full-Stack Web, Cloud APIs)..."
                value={newSkillWantedName}
                onChange={e => setNewSkillWantedName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkillWanted())}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSkillWanted}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Learning Goals
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!skillsWanted.some(s => s.skillName === skill)) {
                        setSkillsWanted([...skillsWanted, { skillName: skill, proficiency: 'beginner', category: 'Technical' }]);
                      }
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-50 hover:text-violet-800 text-slate-700 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-xs">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(4)}
                disabled={skillsWanted.length === 0}
                className="bg-slate-900 text-white font-bold text-xs"
              >
                <span>Next: Availability</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: Availability & Preferences */}
        {step === 4 && (
          <Card className="p-6 space-y-5 bg-white border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>4. Weekly Availability &amp; Session Format</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Help peers schedule sessions when you are free from university lectures and labs.
              </p>
            </div>

            {/* Days Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Days Available for Exchange</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map(d => {
                  const isSelected = availableDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Format */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Preferred Session Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredFormat('1-on-1')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferredFormat === '1-on-1'
                      ? 'border-violet-600 bg-violet-50/50 text-violet-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">1-on-1 Online Peer Barter</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">Google Meet / In-app video tutoring session</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredFormat('project-based')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferredFormat === 'project-based'
                      ? 'border-violet-600 bg-violet-50/50 text-violet-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">In-Person Campus Lab</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">Library or department innovation room</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-xs">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => saveProgress(true)}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>{isSaving ? 'Saving...' : 'Complete Onboarding &amp; Enter Campus'}</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
