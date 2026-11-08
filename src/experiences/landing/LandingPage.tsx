import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Rocket,
  Sparkles,
  Smartphone,
  Download,
  Star,
  CheckCircle2,
  ArrowLeftRight,
} from 'lucide-react';
import { Avatar, Button, DownloadAppModal } from '../../shared/components';

export function LandingPage() {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'eee' | 'cse' | 'ece'>('all');

  const allMentors = [
    {
      id: 'rohit',
      name: 'Rohit Gupta',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '3rd Year',
      teaches: 'Power Electronics & IoT',
      seeks: 'Full-Stack Web & Python',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
      rating: 4.9,
    },
    {
      id: 'vidya',
      name: 'Vidya Gupta',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '2nd Year',
      teaches: 'Power Electronics & MATLAB',
      seeks: 'React & Web Architecture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
      rating: 4.9,
    },
    {
      id: 'nyoimei',
      name: 'Nyoimei C Konyak',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '2nd Year',
      teaches: 'Embedded Systems & 8051',
      seeks: 'Python & Backend APIs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
      rating: 4.8,
    },
    {
      id: 'salini',
      name: 'Devrapalli Salini',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '2nd Year',
      teaches: 'Solar PV & Energy Systems',
      seeks: 'Dashboard UI Development',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
      rating: 4.7,
    },
    {
      id: 'kasturika',
      name: 'Kasturika Narzary',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '2nd Year',
      teaches: 'VLSI Digital Design & Verilog',
      seeks: 'Data Structures & Algorithms',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
      rating: 4.9,
    },
    {
      id: 'betimansa',
      name: 'Betimansa S Chang',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      branchKey: 'eee',
      year: '2nd Year',
      teaches: 'EV Battery Management & IoT',
      seeks: 'Cloud APIs & Database Design',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
      rating: 4.8,
    },
  ];

  const filteredMentors = selectedBranch === 'all'
    ? allMentors
    : allMentors.filter(m => m.branchKey === selectedBranch);

  const pillars = [
    {
      icon: ArrowLeftRight,
      title: 'Reciprocal Skill Barter',
      tagline: 'ZERO-CASH COLLABORATIVE LEARNING',
      accentColor: 'border-t-blue-600',
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200/80',
      iconBg: 'bg-blue-50 text-blue-600',
      desc: 'Trade technical proficiencies in structured 1-on-1 exchanges. Student A mentors on Circuit Analysis and MATLAB; Student B mentors on Web Development.',
      link: '/exchange',
      cta: 'Explore Exchanges >',
    },
    {
      icon: Rocket,
      title: 'Capstone & ProjectSpace Hub',
      tagline: 'MULTIDISCIPLINARY ENGINEERING TEAMS',
      accentColor: 'border-t-indigo-600',
      tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/80',
      iconBg: 'bg-indigo-50 text-indigo-600',
      desc: 'Assemble balanced multidisciplinary teams for hackathons, IEEE symposiums, and final-year capstone engineering projects across departments.',
      link: '/projects',
      cta: 'Browse Active Projects >',
    },
    {
      icon: ShieldCheck,
      title: 'Institutional Academic Governance',
      tagline: 'SUPERVISED SAFETY & INTEGRITY',
      accentColor: 'border-t-emerald-600',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      iconBg: 'bg-emerald-50 text-emerald-600',
      desc: 'Supervised by institutional administration with campus email verification, verified academic badges, and Dean of Student Affairs moderation.',
      link: '/login',
      cta: 'Access Governance Portal >',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ── 1. STICKY NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                SkillBridge
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Campus Peer-to-Peer Exchange
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Platform Features</a>
            <a href="#cohort" className="hover:text-blue-600 transition-colors">Featured Cohort</a>
            <a href="#algorithm" className="hover:text-blue-600 transition-colors">Matchmaking Engine</a>
            <a href="#departments" className="hover:text-blue-600 transition-colors">Campus Partners</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-300 bg-blue-50/80 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-all shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Download App</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-2.5 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4.5 py-2 rounded-full shadow-xs transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. HERO SECTION & DEPARTMENT BANNER ── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-slate-50/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] border-b border-slate-200/80">
        {/* Soft Blue-Indigo Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Reciprocal Peer Learning Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-heading">
            <span className="text-slate-900">Learn from peers.</span>{' '}
            <span className="text-blue-600">Share what you know.</span>
          </h1>

          {/* Hero Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Campus learning shouldn't depend on expensive courses or one-way tutoring. SkillBridge connects students to swap knowledge directly: if you know circuit design, teach it in exchange for help with web development. No money involved—just peers helping peers succeed.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/explore')}
              className="bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find a mentor</span>
            </button>
            <button
              onClick={() => navigate('/exchange')}
              className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xs hover:shadow transition-all flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Share a skill</span>
            </button>
          </div>

          {/* Mobile Quick Link */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-medium text-slate-600 hover:text-blue-700 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Available on mobile &bull; Download Android APK (v3.0.0)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Department Sub-Banner */}
      <section id="departments" className="py-7 bg-slate-100/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1.5">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            BUILT FOR CAMPUS ENGINEERING &amp; TECHNOLOGY DEPARTMENTS
          </p>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Connect directly with verified students across Electrical, Computer Science, Electronics, and Mechanical branches.
          </p>
        </div>
      </section>

      {/* ── 3. COMMUNITY PEER PROFILES SECTION ── */}
      <section id="cohort" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Student Cohort
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
                Community Peer Profiles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Explore verified student profiles from the NIT Nagaland cohort actively participating in reciprocal peer skill barter and capstone collaboration.
              </p>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="self-start md:self-auto inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>Explore Full Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Branch Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedBranch('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                selectedBranch === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Branches ({allMentors.length})
            </button>
            <button
              onClick={() => setSelectedBranch('eee')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                selectedBranch === 'eee'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Electrical &amp; Electronics (NIT Nagaland)
            </button>
          </div>

          {/* Responsive 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top: Avatar, Name, Rating */}
                  <div className="flex items-start gap-3.5">
                    <Avatar name={mentor.name} src={mentor.avatar} size="lg" className="ring-2 ring-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                          {mentor.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                          <Star className="w-3 h-3 fill-current text-amber-500" />
                          <span>{mentor.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-blue-700 font-semibold truncate mt-0.5">
                        {mentor.university}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {mentor.dept} &bull; {mentor.year}
                      </p>
                    </div>
                  </div>

                  {/* Skills: OFFERS & WANTS */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                        OFFERS
                      </span>
                      <span className="text-slate-800 font-medium text-xs truncate">
                        {mentor.teaches}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-2 py-0.5 rounded-md shrink-0">
                        WANTS
                      </span>
                      <span className="text-slate-700 font-medium text-xs truncate">
                        {mentor.seeks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Verified Dot & Connect */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Verified Mentor</span>
                  </div>
                  <button
                    onClick={() => navigate('/feed')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-all"
                  >
                    <span>Connect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY SKILLBRIDGE WORKS ON CAMPUS SECTION ── */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-1 text-blue-700 font-bold text-xs uppercase tracking-wider">
              Campus-Calibrated Model
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Why SkillBridge Works on Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Unlike commercial tutoring platforms that commoditize learning, SkillBridge fosters an authentic culture of mutual reciprocity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 border border-slate-200 border-t-4 ${pillar.accentColor} hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pillar.iconBg}`}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border inline-block ${pillar.tagColor}`}>
                    {pillar.tagline}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => navigate(pillar.link)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{pillar.cta}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. COMPATIBILITY SCORING (MATCHMAKING ENGINE) ── */}
      <section id="algorithm" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Breakdown */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Compatibility Scoring
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug font-heading">
                Mathematical 5-Factor Peer Compatibility Scoring
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SkillBridge calculates reciprocal affinity using a multi-factor formula calibrated for university timetables and curriculum needs:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { factor: 'Domain Expertise Coverage', weight: '35%', pct: 35, desc: 'Exact overlap between skills offered and skills wanted.' },
                  { factor: 'Schedule Compatibility', weight: '25%', pct: 25, desc: 'Intersection across weekly academic availability slots.' },
                  { factor: 'Two-Way Reciprocal Match', weight: '20%', pct: 20, desc: 'Balanced mutual learning equilibrium without cash.' },
                  { factor: 'Peer Reputation & Rating', weight: '10%', pct: 10, desc: 'Peer review ratings, badges, and session completions.' },
                  { factor: 'Academic Department Alignment', weight: '10%', pct: 10, desc: 'Shared courses, department context, and university relevance.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.factor}</span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                        {item.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">{item.desc}</p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        style={{ width: `${item.pct * 2.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Verification Card */}
            <div className="lg:col-span-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  SAMPLE ALGORITHMIC VERIFICATION
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-xs animate-pulse">
                  Score: 98 / 100
                </span>
              </div>

              {/* Matched Student Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative items-center">
                {/* Vidya Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar name="Vidya Gupta" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces" size="sm" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Vidya Gupta</p>
                      <p className="text-[10px] text-slate-500">NIT Nagaland &bull; 2nd Year EEE</p>
                    </div>
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <p className="text-emerald-700 font-semibold">Offers: Power Electronics</p>
                    <p className="text-indigo-700 font-semibold">Wants: Embedded Systems</p>
                  </div>
                </div>

                {/* Circular Swap Icon */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-blue-600 text-white items-center justify-center shadow-md border-2 border-white">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>

                {/* Nyoimei Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar name="Nyoimei C Konyak" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces" size="sm" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Nyoimei C Konyak</p>
                      <p className="text-[10px] text-slate-500">NIT Nagaland &bull; 2nd Year EEE</p>
                    </div>
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <p className="text-emerald-700 font-semibold">Offers: Embedded Systems</p>
                    <p className="text-indigo-700 font-semibold">Wants: Power Electronics</p>
                  </div>
                </div>
              </div>

              {/* Equilibrium Callout & CTA */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/70 text-xs text-blue-900 leading-relaxed font-medium">
                ⚡ <span className="font-bold">Intra-Department Equilibrium:</span> Both NIT Nagaland EEE 2nd Year students swap complementary core engineering subjects with zero cash fees.
              </div>

              <button
                onClick={() => navigate('/exchange')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Skill Exchange Engine &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. OFFICIAL ANDROID RELEASE SECTION ── */}
      <section className="py-18 bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#1e1b4b] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-3.5 py-1.5 rounded-full border border-blue-500/30">
                OFFICIAL ANDROID RELEASE &bull; V3.0.0
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                Learn, Chat &amp; Tutor on the Go
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                SkillBridge Mobile brings real-time peer messaging via Socket.IO, 1-on-1 video &amp; voice tutoring, and reciprocal barter matching directly to your smartphone.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Android App (.APK)</span>
                </button>
                <Link
                  to="/download"
                  className="px-5 py-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Installation Guide &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Android Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl space-y-4 max-w-sm w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">SkillBridge for Android</h3>
                    <p className="text-[11px] text-slate-400">Package: com.skillbridge.campus</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time Socket.IO peer notifications</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-on-1 WebRTC Video &amp; Voice tutoring</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Campus peer directory &amp; skill barter</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get APK Package (38 MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. ACADEMIC REGISTRATION CTA & FOOTER ── */}
      {/* Visual Separation: distinct light container so it does not blend with the dark Android section above */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-3.5 py-1.5 rounded-full border border-blue-500/30">
              OPEN FOR ACADEMIC REGISTRATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              Connect With Your Campus Peers Today
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Trade engineering skills, find capstone collaborators, and learn from seniors who have aced your exact course curriculum.
            </p>

            {/* Fixed Contrast Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-slate-900 font-semibold hover:bg-blue-50 text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-all"
              >
                Register with Student ID
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border border-slate-700 text-white hover:bg-slate-800 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all"
              >
                Sign In to Existing Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="py-12 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">SkillBridge Platform</p>
              <p className="text-[11px] text-slate-400">Campus Peer-to-Peer Exchange</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
            <Link to="/explore" className="hover:text-blue-600 transition-colors">Directory</Link>
            <Link to="/exchange" className="hover:text-blue-600 transition-colors">Skill Exchange</Link>
            <Link to="/projects" className="hover:text-blue-600 transition-colors">ProjectSpace</Link>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="hover:text-blue-700 font-semibold text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>
            <Link to="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/login" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors">Faculty &amp; Staff Access</Link>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; 2026 SkillBridge. Supervised Academic Peer Mentorship.
          </p>
        </div>
      </footer>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
}
