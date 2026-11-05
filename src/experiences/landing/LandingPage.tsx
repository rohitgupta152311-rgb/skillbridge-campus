import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Search, Calendar, MessageSquare, Star, Users, BookOpen, Code,
  Cpu, BarChart3, Globe, Zap, ArrowRight, CheckCircle2, ChevronRight, Wifi,
  Brain, Calculator, Network, Sparkles, Repeat, Rocket, ShieldCheck, Layers,
  Music, Laptop, HeartHandshake, Compass, ArrowLeftRight
} from 'lucide-react';
import { Avatar, Card, Badge, Button } from '../../shared/components';
import { mockUsers, mockProjects } from '../../infrastructure/mock-database/seed-data';

const pillars = [
  {
    icon: Repeat,
    badge: 'Signature Feature',
    title: 'Reciprocal Skill Exchange',
    desc: 'Trade technical skills with campus peers in a zero-cash reciprocal barter. Student A teaches React; Student B teaches Python.',
    link: '/exchange',
    cta: 'Explore Exchanges',
  },
  {
    icon: Rocket,
    badge: 'Campus Incubator',
    title: 'ProjectSpace Team Matcher',
    desc: 'Assemble multidisciplinary hackathon and engineering capstone teams. Our algorithm matches project needs with student talent.',
    link: '/projects',
    cta: 'Find Project Teams',
  },
  {
    icon: ShieldCheck,
    badge: 'Academic Trust',
    title: 'Verified Peer Tutoring',
    desc: 'Book 1-on-1 tutoring sessions with departmental peers who have aced your exact course curriculum and professors.',
    link: '/explore',
    cta: 'Browse Peers',
  },
];

const categories = [
  { icon: Code, title: 'Web Development', count: 8 },
  { icon: Brain, title: 'Machine Learning & AI', count: 6 },
  { icon: BarChart3, title: 'Data Structures & Alg.', count: 7 },
  { icon: Cpu, title: 'Digital Electronics & VLSI', count: 5 },
  { icon: Calculator, title: 'Engineering Mathematics', count: 4 },
  { icon: Network, title: 'Computer Networks', count: 4 },
  { icon: Wifi, title: 'IoT & Embedded Systems', count: 5 },
  { icon: Layers, title: 'Robotics & CAD', count: 4 },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF2F9] text-slate-800 font-sans p-3 sm:p-6 lg:p-8">
      {/* ── FLOATING MAIN CONTAINER (Matching SkillSwap Theme) ── */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-soft border border-slate-200/70 overflow-hidden">
        
        {/* ── CLEAN TOP NAVIGATION ── */}
        <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#151e4e] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#151e4e]">SkillBridge</span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-[#151e4e] border border-indigo-100">
                CIH-008
              </span>
            </div>
          </Link>

          {/* Centered links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#benefits" className="hover:text-[#151e4e] transition-colors">Benefits</a>
            <a href="#how-it-works" className="hover:text-[#151e4e] transition-colors">How it works</a>
            <a href="#explore" className="hover:text-[#151e4e] transition-colors">Explore</a>
            <a href="#communities" className="hover:text-[#151e4e] transition-colors">Communities</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-[#151e4e] hover:bg-[#0f1638] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
            >
              Join Campus
            </Button>
          </div>
        </header>

        {/* ── HERO SECTION: SWAP SKILLS, SPARK GROWTH ── */}
        <section className="relative px-6 sm:px-12 lg:px-16 py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#151e4e] text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Smart Campus Peer-to-Peer Community &bull; Challenge CIH-008</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Swap Skills,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#151e4e] via-indigo-600 to-violet-600">
                  Spark Growth
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Connect with students across Indian universities to teach and learn new skills—no money needed, just passion and knowledge.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-[#151e4e] hover:bg-[#0f1638] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-xl shadow-pill-active"
                  onClick={() => navigate('/feed')}
                >
                  JOIN THE COMMUNITY
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl"
                  onClick={() => navigate('/explore')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Talent
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>45+ Verified Indian Student Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Financial Cost (Pure Barter)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Department &amp; University Verified</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Column: Two-Learner Reciprocal Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-tr from-indigo-50 via-amber-50/40 to-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card text-center space-y-6">
                
                {/* Floating Decorative Glow */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />

                {/* Floating Skill Bubbles & Exchange Flow */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  {/* Learner 1 (Creative / Music / UI) */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-lg shadow-amber-500/25">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-amber-500">
                        <Music className="w-7 h-7 sm:w-9 sm:h-9 text-orange-500" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-900">Sneha Patel</p>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Teaches: Design &amp; UI
                      </span>
                    </div>
                  </div>

                  {/* Bidirectional Arrow Indicator */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-[#151e4e] text-white flex items-center justify-center shadow-md animate-pulse">
                      <ArrowLeftRight className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      96% Match
                    </span>
                  </div>

                  {/* Learner 2 (Coding / Python / React) */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 p-1 shadow-lg shadow-indigo-500/25">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-indigo-600">
                        <Code className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-900">Rohit Gupta</p>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Teaches: React &amp; TS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reciprocal Quote Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">Live Barter Connection</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Zero Cost
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Rohit teaches modern ReactJS component architecture; Sneha teaches Figma design systems and user flows.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span>Overlapping: Mon, Wed, Fri</span>
                    <Link to="/exchange" className="font-bold text-[#151e4e] hover:underline">
                      View Barter &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3 CORE PLATFORM PILLARS ── */}
        <section id="benefits" className="px-6 sm:px-12 lg:px-16 py-16 bg-slate-50/60 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#151e4e] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Why SkillBridge Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Three Pillars of Collegiate Peer Collaboration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Unlike commercial tutoring platforms with hourly paywalls, SkillBridge unlocks mutual campus value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-soft hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#151e4e] group-hover:bg-[#151e4e] group-hover:text-white transition-colors">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {pillar.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-[#151e4e] hover:bg-slate-50"
                    onClick={() => navigate(pillar.link)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    {pillar.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ALGORITHM SECTION: 5-FACTOR MATCHING ── */}
        <section id="how-it-works" className="px-6 sm:px-12 lg:px-16 py-16 bg-white border-t border-slate-100">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#151e4e] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Matchmaking Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Mathematical 5-Factor Peer Compatibility Scoring
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SkillBridge calculates reciprocal affinity using a multi-factor formula calibrated for campus academic timetables:
              </p>

              <div className="space-y-2.5">
                {[
                  { factor: 'Domain Expertise Coverage', weight: '35%', desc: 'Overlap between skills offered and skills wanted.' },
                  { factor: 'Schedule Compatibility', weight: '25%', desc: 'Jaccard intersection over shared weekly availability slots.' },
                  { factor: 'Two-Way Reciprocal Match', weight: '20%', desc: 'Mutual learning equilibrium (zero-cash barter).' },
                  { factor: 'Peer Reputation & Rating', weight: '10%', desc: 'Verified peer review score and badges earned.' },
                  { factor: 'Academic Department Alignment', weight: '10%', desc: 'Shared courses, faculty, and academic year relevance.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="px-2 py-0.5 rounded-md bg-[#151e4e] text-white text-[11px] font-bold shrink-0 mt-0.5">
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
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Mathematical Verification
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  Score: 96 / 100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">Rohit Gupta</p>
                  <p className="text-[10px] text-slate-500">DTU &bull; 3rd Year CS</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Offers: React, TypeScript</p>
                  <p className="text-[11px] text-[#151e4e] font-medium">Wants: Python, ML</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">Ananya Singh</p>
                  <p className="text-[10px] text-slate-500">BITS Pilani &bull; 3rd Year AI</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Offers: Python, ML</p>
                  <p className="text-[11px] text-[#151e4e] font-medium">Wants: React, TypeScript</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-[#151e4e] text-center font-medium">
                ⚡ Perfect Inversion: Both students teach what the other needs, with 4 overlapping available days!
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full bg-[#151e4e] hover:bg-[#0f1638] text-white font-bold"
                onClick={() => navigate('/exchange')}
              >
                Launch Skill Exchange Engine &rarr;
              </Button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="px-6 sm:px-12 lg:px-16 py-8 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillBridge</span>
            <span>&bull;</span>
            <span>Swap Skills, Spark Growth</span>
          </div>
          <p>
            Challenge ID: <strong>CIH-008</strong> &bull; Smart Peer-to-Peer Tutoring &amp; Mentorship Matchmaker
          </p>
        </footer>

      </div>
    </div>
  );
}
