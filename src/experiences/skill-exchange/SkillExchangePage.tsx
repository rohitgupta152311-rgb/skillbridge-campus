import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeftRight,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { Card, Button, Badge, Avatar } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  calculateSkillExchangeMatches,
  scheduleExchangeSessions,
  updateUser,
} from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import { TwoWayMatch, SkillExchangeEntry } from '../../foundation/types';

export function SkillExchangePage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'mutual' | 'teach_me' | 'i_can_help'>('mutual');
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>('match-mentee-1-mentor-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Schedule Exchange Modal State
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    match: TwoWayMatch | null;
  }>({
    isOpen: false,
    match: null,
  });

  const [myTeachSkill, setMyTeachSkill] = useState('');
  const [myTeachDate, setMyTeachDate] = useState('2026-11-10');
  const [myTeachTime, setMyTeachTime] = useState('16:00');
  const [partnerTeachSkill, setPartnerTeachSkill] = useState('');
  const [partnerTeachDate, setPartnerTeachDate] = useState('2026-11-12');
  const [partnerTeachTime, setPartnerTeachTime] = useState('17:00');
  const [scheduling, setScheduling] = useState(false);

  // Add Skill Modal
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState<'teach' | 'learn'>('teach');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('advanced');

  // Compute matches
  const { mutualMatches, canTeachMe, iCanHelp } = useMemo(() => {
    if (!user) return { mutualMatches: [], canTeachMe: [], iCanHelp: [] };
    return calculateSkillExchangeMatches(user.id);
  }, [user]);

  const currentList = useMemo(() => {
    let list: TwoWayMatch[] = [];
    if (activeTab === 'mutual') list = mutualMatches;
    else if (activeTab === 'teach_me') list = canTeachMe;
    else list = iCanHelp;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (m) =>
        m.partnerName.toLowerCase().includes(q) ||
        m.partnerDepartment.toLowerCase().includes(q) ||
        m.iCanTeachThem.some((s) => s.toLowerCase().includes(q)) ||
        m.theyCanTeachMe.some((s) => s.toLowerCase().includes(q))
    );
  }, [activeTab, mutualMatches, canTeachMe, iCanHelp, searchQuery]);

  const openScheduleModal = (match: TwoWayMatch) => {
    setScheduleModal({ isOpen: true, match });
    setMyTeachSkill(match.iCanTeachThem[0] || 'Technical Mentorship');
    setPartnerTeachSkill(match.theyCanTeachMe[0] || 'Skill Exchange');
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !scheduleModal.match) return;

    setScheduling(true);
    await new Promise((r) => setTimeout(r, 600));

    scheduleExchangeSessions({
      currentUserId: user.id,
      partnerId: scheduleModal.match.partnerId,
      myTeachSkill,
      myTeachDate,
      myTeachTime,
      partnerTeachSkill,
      partnerTeachDate,
      partnerTeachTime,
    });

    setScheduling(false);
    setScheduleModal({ isOpen: false, match: null });

    addToast({
      title: 'Reciprocal Learning Exchange Scheduled! 🔄',
      message: `You booked sessions to teach ${myTeachSkill} and learn ${partnerTeachSkill}. Added to your calendar.`,
      type: 'success',
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSkillName.trim()) return;

    const newEntry: SkillExchangeEntry = {
      id: `skill-${Date.now()}`,
      userId: user.id,
      skillName: newSkillName.trim(),
      proficiency: newSkillProficiency,
      intention: newSkillType,
    };

    if (newSkillType === 'teach') {
      const updated = [...(user.skillsOffered || []), newEntry];
      updateUser(user.id, { skillsOffered: updated });
      useAuthStore.getState().user!.skillsOffered = updated;
    } else {
      const updated = [...(user.skillsWanted || []), newEntry];
      updateUser(user.id, { skillsWanted: updated });
      useAuthStore.getState().user!.skillsWanted = updated;
    }

    setNewSkillName('');
    setAddSkillModal(false);
    addToast({
      title: 'Skill Matrix Updated',
      message: `Added ${newSkillName} to ${newSkillType === 'teach' ? 'Skills You Teach' : 'Skills You Want to Learn'}.`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in p-4 lg:p-6">
      {/* ── HERO HEADER: PHILOSOPHY ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] p-6 lg:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-violet-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Two-Way Skill Exchange Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            "Everyone has something to teach and something to learn."
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6">
            SkillBridge automatically matches you with complementary campus peers. Exchange your technical skills, collaborate on shared passions, and learn together without paying or waiting for formal mentors.
          </p>

          {/* Quick Skill Matrix Pill Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>You Teach: <strong>{user?.skillsOffered?.map(s => s.skillName).join(', ') || 'ReactJS, TypeScript'}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>You Want: <strong>{user?.skillsWanted?.map(s => s.skillName).join(', ') || 'Python, Machine Learning'}</strong></span>
            </div>
            <button
              onClick={() => setAddSkillModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-violet-900 text-xs font-bold hover:bg-violet-50 transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Manage Skills
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH & SECTION SWITCHER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('mutual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mutual'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mutual Learning Matches ({mutualMatches.length})</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">96% Top</span>
          </button>

          <button
            onClick={() => setActiveTab('teach_me')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'teach_me'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>People Who Can Teach Me ({canTeachMe.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('i_can_help')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'i_can_help'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>People I Can Help ({iCanHelp.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter matches by skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* ── LIVE RECIPROCAL EXCHANGE SPOTLIGHT (SIGNATURE ANIMATION) ── */}
      {activeTab === 'mutual' && mutualMatches.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white border border-violet-500/30 shadow-xl mb-6 animate-fade-in">
          {/* Header banner */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Live Reciprocal Exchange Spotlight
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ⚡ Highest Campus Compatibility
            </span>
          </div>

          {/* The Interactive 3-way visual connection */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Student A (You) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2.5 backdrop-blur-xs">
              <Avatar name={user?.fullName || 'You'} src={user?.avatar} size="lg" className="mx-auto ring-2 ring-violet-400" />
              <div>
                <h4 className="font-bold text-sm text-white">{user?.fullName} (You)</h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">{user?.headline || 'Full-Stack Developer'}</p>
                <p className="text-[10px] text-violet-400 mt-0.5">{user?.department}</p>
              </div>
              <div className="pt-2.5 border-t border-white/10">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">You Offer To Teach</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {mutualMatches[0].iCanTeachThem.map(s => (
                    <span key={s} className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Animated Connector */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-4 space-y-3">
              <div className="relative w-full flex items-center justify-center">
                <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-violet-400 to-indigo-400" />
                <div className="absolute w-12 h-12 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center shadow-lg shadow-violet-500/50 hover:scale-110 transition-transform cursor-pointer">
                  <ArrowLeftRight className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>
              <div className="pt-2">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-violet-300">
                  {mutualMatches[0].matchScore}%
                </span>
                <p className="text-[10px] font-bold text-violet-200 tracking-wider uppercase mt-0.5">Reciprocal Match</p>
              </div>
              <p className="text-[10px] text-slate-300 max-w-[200px] leading-tight">
                Zero financial cost. 2x learning velocity through mutual peer exchange.
              </p>
            </div>

            {/* Student B (Partner) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2.5 backdrop-blur-xs">
              <Avatar name={mutualMatches[0].partnerName} src={mutualMatches[0].partnerAvatar} size="lg" className="mx-auto ring-2 ring-indigo-400" />
              <div>
                <h4 className="font-bold text-sm text-white">{mutualMatches[0].partnerName}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">{mutualMatches[0].partnerHeadline}</p>
                <p className="text-[10px] text-indigo-400 mt-0.5">{mutualMatches[0].partnerDepartment}</p>
              </div>
              <div className="pt-2.5 border-t border-white/10">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1.5">They Teach You</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {mutualMatches[0].theyCanTeachMe.map(s => (
                    <span key={s} className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Matching free timetable days: <strong>{mutualMatches[0].sharedDays.join(' & ')}</strong></span>
            </div>
            <Button
              size="sm"
              onClick={() => openScheduleModal(mutualMatches[0])}
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-2 shadow-lg shadow-violet-600/30 rounded-xl"
            >
              Connect & Exchange Skills →
            </Button>
          </div>
        </div>
      )}

      {/* ── MATCHES LIST ── */}
      <div className="space-y-4">
        {currentList.length === 0 ? (
          <Card padding="lg" className="text-center py-12 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matches found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adding more skills to your profile or broaden your search criteria.
            </p>
          </Card>
        ) : (
          currentList.map((match) => {
            const isExpanded = expandedBreakdown === match.id;
            return (
              <Card
                key={match.id}
                padding="none"
                className="overflow-hidden border border-slate-200/90 shadow-xs hover:border-violet-300 transition-all"
              >
                {/* Match Ribbon */}
                <div
                  className={`px-5 py-2.5 flex items-center justify-between ${
                    match.isMutual
                      ? 'bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 border-b border-indigo-100'
                      : 'bg-slate-50 border-b border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        match.matchScore >= 90
                          ? 'bg-violet-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {match.isMutual ? `Perfect Skill Exchange – ${match.matchScore}%` : `Match Score – ${match.matchScore}%`}
                    </span>
                    {match.isMutual && (
                      <span className="hidden sm:inline-block text-[11px] font-bold text-violet-800">
                        ⚡ Reciprocal Exchange (+10 pts bonus)
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-500">
                    {match.availabilityNotice}
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* User Profile Meta */}
                    <div className="flex items-center gap-3.5">
                      <Avatar name={match.partnerName} src={match.partnerAvatar} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900">{match.partnerName}</h2>
                          <ShieldCheck className="w-4 h-4 text-violet-600" />
                        </div>
                        <p className="text-xs text-slate-600">{match.partnerHeadline}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {match.partnerUniversity} • {match.partnerDepartment}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate('/messages')}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      <Button
                        size="sm"
                        onClick={() => openScheduleModal(match)}
                        className="flex items-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{match.isMutual ? 'Schedule Mutual Exchange' : 'Book Session'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Complementary Skills Exchange Grid */}
                  <div className="grid sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    {/* What You Teach Them */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>You Can Teach Them:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.iCanTeachThem.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-900 text-xs font-semibold border border-emerald-200/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* What They Teach You */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                        <span>They Can Teach You:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.theyCanTeachMe.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-indigo-100/70 text-indigo-900 text-xs font-semibold border border-indigo-200/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Match Rationale */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {match.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transparent Algorithm Breakdown Accordion */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        setExpandedBreakdown(isExpanded ? null : match.id)
                      }
                      className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Transparent Matchmaking Algorithm Breakdown</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-2.5 font-mono animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">1. Complementary Skill Compatibility (40%):</span>
                          <span className="text-emerald-400 font-bold">
                            {match.breakdown.skillCompatibility}/40 pts
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">2. Schedule Overlap (25%):</span>
                          <span className="text-emerald-400 font-bold">
                            {match.breakdown.scheduleOverlap}/25 pts ({match.sharedDays.join(' & ') || 'Weekdays'})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">3. Skill Proficiency (15%):</span>
                          <span className="text-emerald-400 font-bold">
                            {match.breakdown.proficiencyScore}/15 pts
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">4. Learning Preferences (10%):</span>
                          <span className="text-emerald-400 font-bold">
                            {match.breakdown.preferencesScore}/10 pts
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">5. Reputation & Reliability (10%):</span>
                          <span className="text-emerald-400 font-bold">
                            {match.breakdown.reputationScore}/10 pts
                          </span>
                        </div>
                        {match.breakdown.mutualBonus > 0 && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                            <span className="text-amber-400 font-bold">★ Reciprocal Mutual Exchange Bonus:</span>
                            <span className="text-amber-400 font-bold">+{match.breakdown.mutualBonus} pts</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-sm font-bold text-white">
                          <span>Final Weighted Match Score:</span>
                          <span className="text-violet-400">{match.matchScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ── SCHEDULE MUTUAL EXCHANGE MODAL ── */}
      {scheduleModal.isOpen && scheduleModal.match && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setScheduleModal({ isOpen: false, match: null })}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Schedule Two-Way Skill Exchange
                </h3>
                <p className="text-xs text-slate-500">
                  Setting up reciprocal learning sessions with <strong>{scheduleModal.match.partnerName}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              {/* Session 1: You Teach */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Session 1: You Teach
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">60 mins • Online</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skill You Will Teach:
                  </label>
                  <input
                    type="text"
                    value={myTeachSkill}
                    onChange={(e) => setMyTeachSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={myTeachDate}
                      onChange={(e) => setMyTeachDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={myTeachTime}
                      onChange={(e) => setMyTeachTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Session 2: They Teach */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Session 2: They Teach You
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-700">60 mins • Online</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skill They Will Teach:
                  </label>
                  <input
                    type="text"
                    value={partnerTeachSkill}
                    onChange={(e) => setPartnerTeachSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={partnerTeachDate}
                      onChange={(e) => setPartnerTeachDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={partnerTeachTime}
                      onChange={(e) => setPartnerTeachTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModal({ isOpen: false, match: null })}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <Button type="submit" isLoading={scheduling} size="md">
                  Confirm Both Exchange Sessions
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MANAGE SKILLS MODAL ── */}
      {addSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setAddSkillModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add to Your Skill Matrix</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add skills you can teach or skills you are seeking to learn to improve match recommendations.
            </p>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Embedded C, PyTorch"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intention</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSkillType('teach')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      newSkillType === 'teach'
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💡 I Can Teach This
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSkillType('learn')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      newSkillType === 'learn'
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🎯 I Want to Learn
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="beginner">Beginner (Getting started)</option>
                  <option value="intermediate">Intermediate (Built projects)</option>
                  <option value="advanced">Advanced (High confidence)</option>
                  <option value="expert">Expert (Can mentor others)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSkillModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <Button type="submit" size="md">Add Skill</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
