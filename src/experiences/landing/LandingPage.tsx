import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Calendar,
  MessageSquare,
  Star,
  Users,
  BookOpen,
  Code,
  Cpu,
  BarChart3,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Repeat,
  Rocket,
  Layers,
  Sparkles,
  Building2,
  Award,
  Check,
  Clock,
  Compass,
  Smartphone,
  Download,
} from 'lucide-react';
import { Avatar, Button, DownloadAppModal } from '../../shared/components';

export function LandingPage() {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const featuredMentors = [
    {
      id: 'rohit',
      name: 'Rohit Gupta',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
      year: '2nd Year',
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
      year: '2nd Year',
      teaches: 'Solar PV & Energy Systems',
      seeks: 'Dashboard UI Development',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
      rating: 5.0,
    },
    {
      id: 'kasturika',
      name: 'Kasturika Narzary',
      university: 'NIT Nagaland',
      dept: 'Electrical & Electronics Engineering',
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
      year: '2nd Year',
      teaches: 'EV Battery Management & IoT',
      seeks: 'Cloud APIs & Database Design',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
      rating: 4.9,
    },

  ];

  const pillars = [
    {
      icon: Repeat,
      title: 'Reciprocal Skill Barter',
      tagline: 'Zero-Cash Collaborative Learning',
      desc: 'Trade technical proficiencies in structured 1-on-1 exchanges. Student A mentors on Circuit Analysis and MATLAB; Student B mentors on Web Development.',
      link: '/exchange',
      cta: 'Explore Exchanges',
    },
    {
      icon: Rocket,
      title: 'Capstone & ProjectSpace Hub',
      tagline: 'Multidisciplinary Engineering Teams',
      desc: 'Assemble balanced project teams for hackathons, IEEE symposiums, and final-year capstone engineering projects across departments.',
      link: '/projects',
      cta: 'Browse Active Projects',
    },
    {
      icon: ShieldCheck,
      title: 'Institutional Academic Governance',
      tagline: 'Supervised Safety & Integrity',
      desc: 'Supervised by institutional administration with email domain verification, verified academic badges, and Dean of Student Affairs moderation.',
      link: '/login',
      cta: 'Access Governance Portal',
    },
  ];

  const institutions = [
    'National Institute of Technology (NIT) Nagaland',
    'Delhi Technological University (DTU)',
    'Birla Institute of Technology and Science (BITS Pilani)',
    'Indian Institute of Technology (IIT) Delhi',
    'National Institute of Technology (NIT) Trichy',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-violet-100 selection:text-violet-900">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-violet-950 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">SkillBridge</span>

              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Campus Peer-to-Peer Exchange</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Platform Features</a>
            <a href="#cohort" className="hover:text-slate-900 transition-colors">Featured Cohort</a>
            <a href="#algorithm" className="hover:text-slate-900 transition-colors">Matchmaking Engine</a>
            <a href="#institutions" className="hover:text-slate-900 transition-colors">Campus Partners</a>

          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-violet-600" />
              <span>Download App</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reciprocal Peer Learning Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-heading">
            Learn from peers.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-indigo-600 to-slate-900">
              Share what you know.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Campus learning shouldn't depend on expensive courses or one-way tutoring. SkillBridge connects students to swap knowledge directly: if you know circuit design, teach it in exchange for help with web development. No money involved—just peers helping peers succeed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              onClick={() => navigate('/explore')}
            >
              <Search className="w-4 h-4" />
              <span>Find a mentor</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-2xs flex items-center gap-2"
              onClick={() => navigate('/register')}
            >
              <Repeat className="w-4 h-4 text-violet-600" />
              <span>Share a skill</span>
            </Button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>📱 Available on mobile &bull;</span>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="text-violet-600 font-bold hover:text-violet-800 underline inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Android APK (v3.0.0)
            </button>
          </div>
        </div>
      </section>

      {/* ── CAMPUS COMMUNITIES SECTION ── */}
      <section id="institutions" className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Built for Campus Engineering &amp; Technology Departments
          </p>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Connect directly with verified students across Electrical, Computer Science, Electronics, and Mechanical branches.
          </p>
        </div>
      </section>

      {/* ── FEATURED MENTORS COHORT ── */}
      <section id="cohort" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading mt-2">
                Community Peer Profiles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore sample student profiles from the NIT Nagaland cohort participating in reciprocal peer skill exchange.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="self-start sm:self-auto text-xs font-semibold"
            >
              Explore Full Directory
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={mentor.name} src={mentor.avatar} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{mentor.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{mentor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-violet-700 font-semibold truncate mt-0.5">{mentor.university}</p>
                    <p className="text-[10px] text-slate-400 truncate">{mentor.dept} &bull; {mentor.year}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 shrink-0">Offers:</span>
                    <span className="text-slate-700 font-medium truncate">{mentor.teaches}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 shrink-0">Wants:</span>
                    <span className="text-slate-700 font-medium truncate">{mentor.seeks}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Verified Mentor
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/feed')}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-950 p-0"
                  >
                    Connect &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 CORE PILLARS ── */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">

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
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {pillar.tagline}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 px-0"
                    onClick={() => navigate(pillar.link)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    {pillar.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-FACTOR MATCHING ENGINE ── */}
      <section id="algorithm" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug font-heading">
                Mathematical 5-Factor Peer Compatibility Scoring
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SkillBridge calculates reciprocal affinity using a multi-factor formula calibrated for university timetables and curriculum needs:
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { factor: 'Domain Expertise Coverage', weight: '35%', desc: 'Exact overlap between skills offered and skills wanted.' },
                  { factor: 'Schedule Compatibility', weight: '25%', desc: 'Intersection across weekly academic availability slots.' },
                  { factor: 'Two-Way Reciprocal Match', weight: '20%', desc: 'Balanced mutual learning equilibrium without cash.' },
                  { factor: 'Peer Reputation & Rating', weight: '10%', desc: 'Peer review ratings, badges, and session completions.' },
                  { factor: 'Academic Department Alignment', weight: '10%', desc: 'Shared courses, department context, and university relevance.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-bold shrink-0 mt-0.5">
                      {item.weight}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900">{item.factor}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reciprocal Score Card Preview */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sample Algorithmic Verification
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Score: 98 / 100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">Vidya Gupta</p>
                  <p className="text-[10px] text-slate-500">NIT Nagaland &bull; 2nd Year EEE</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Offers: Power Electronics</p>
                  <p className="text-[11px] text-violet-700 font-medium">Wants: Embedded Systems</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">Nyoimei C Konyak</p>
                  <p className="text-[10px] text-slate-500">NIT Nagaland &bull; 2nd Year EEE</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Offers: Embedded Systems</p>
                  <p className="text-[11px] text-violet-700 font-medium">Wants: Power Electronics</p>
                </div>
              </div>

              <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-xs text-violet-900 text-center font-medium">
                ⚡ Intra-Department Equilibrium: Both NIT Nagaland EEE 2nd Year students swap complementary core engineering subjects with zero cash fees.
              </div>

              <Button
                size="md"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold"
                onClick={() => navigate('/exchange')}
              >
                Launch Skill Exchange Engine &rarr;
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ── MOBILE APP SHOWCASE SECTION ── */}
      <section className="py-16 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">
                Official Android Release &bull; v3.0.0
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                Learn, Chat &amp; Tutor on the Go
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                SkillBridge Mobile brings real-time peer messaging via Socket.IO, 1-on-1 video &amp; voice calls, and reciprocal barter matching directly to your smartphone.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="md"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/30"
                  onClick={() => setShowDownloadModal(true)}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Android App (.APK)</span>
                </Button>
                <Link
                  to="/download"
                  className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-violet-400" />
                  <span>View Installation Guide &rarr;</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl space-y-4 max-w-sm w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">SkillBridge for Android</h3>
                    <p className="text-[11px] text-slate-400">Package: com.studybridge.campus</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-time Socket.IO peer notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1-on-1 WebRTC Video &amp; Voice tutoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Campus peer directory &amp; skill barter</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span>Get APK Package (38 MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/80 px-3 py-1 rounded-full border border-violet-800">
            Open for Academic Registration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            Connect With Your Campus Peers Today
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Trade engineering skills, find capstone collaborators, and learn from seniors who have aced your exact course curriculum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all"
              onClick={() => navigate('/register')}
            >
              Register with Student ID
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-white hover:bg-slate-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl"
              onClick={() => navigate('/login')}
            >
              Sign In to Existing Account
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">SkillBridge Platform</p>
              <p className="text-[11px] text-slate-400">SkillBridge Campus Network</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
            <Link to="/explore" className="hover:text-slate-900">Directory</Link>
            <Link to="/exchange" className="hover:text-slate-900">Skill Exchange</Link>
            <Link to="/projects" className="hover:text-slate-900">ProjectSpace</Link>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="hover:text-violet-700 font-semibold text-violet-600 flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>
            <Link to="/login" className="hover:text-slate-900">Sign In</Link>
            <Link to="/login" className="text-violet-700 font-semibold hover:text-violet-900">Faculty & Staff Access</Link>
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
