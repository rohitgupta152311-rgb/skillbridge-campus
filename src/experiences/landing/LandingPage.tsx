import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Search, Calendar, MessageSquare, Star, Users, BookOpen, Code,
  Cpu, BarChart3, Globe, Zap, ArrowRight, CheckCircle2, ChevronRight, Wifi,
  Brain, Calculator, Network, Sparkles, Repeat, Rocket, ShieldCheck, Layers
} from 'lucide-react';
import { Avatar, StarRating, Card, Badge, Button } from '../../shared/components';
import { mockUsers, mockExpertise, mockReviews, mockProjects } from '../../infrastructure/mock-database/seed-data';

const mentorUsers = mockUsers.filter(u => u.role === 'mentor').slice(0, 4);

const pillars = [
  {
    icon: Repeat,
    badge: 'Signature Feature',
    title: 'Reciprocal Skill Exchange',
    desc: 'Trade technical skills with campus peers in a zero-cash reciprocal barter. Student A teaches React; Student B teaches Python.',
    color: 'from-violet-600 to-indigo-600',
    link: '/exchange',
    cta: 'Explore Exchanges',
  },
  {
    icon: Rocket,
    badge: 'Campus Incubator',
    title: 'ProjectSpace Team Matcher',
    desc: 'Assemble multidisciplinary hackathon and engineering capstone teams. Our algorithm matches project needs with student talent.',
    color: 'from-blue-600 to-cyan-600',
    link: '/projects',
    cta: 'Find Project Teams',
  },
  {
    icon: ShieldCheck,
    badge: 'Academic Trust',
    title: 'Verified Peer Tutoring',
    desc: 'Book 1-on-1 tutoring sessions with departmental peers who have aced your exact course curriculum and professors.',
    color: 'from-emerald-600 to-teal-600',
    link: '/mentors',
    cta: 'Browse Mentors',
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

const stats = [
  { value: '38+', label: 'Verified Campus Students' },
  { value: '8', label: 'Multidisciplinary Projects' },
  { value: '96%', label: 'Top Reciprocal Match Rate' },
  { value: '0 ₹', label: 'Zero-Cash Peer Barter' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ── TOP NAVIGATION ── */}
      <nav className="fixed top-0 w-full bg-white/85 backdrop-blur-md z-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">SkillBridge</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                CIH-008
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Platform Pillars</a>
            <a href="#algorithm" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Match Algorithm</a>
            <a href="#projects" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Campus Projects</a>
            <a href="#categories" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Domains</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white font-bold" onClick={() => navigate('/register')}>
              Join Campus
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#31104b] overflow-hidden text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-violet-200 text-xs sm:text-sm font-medium backdrop-blur">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Smart Campus Life &bull; Challenge ID: CIH-008</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Connect Skills.<br />
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                Exchange Knowledge.
              </span><br />
              Build Together.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The next-generation campus networking ecosystem. Trade peer technical skills in zero-cash mutual barters, assemble multidisciplinary project teams, and master your university coursework.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-xl shadow-violet-600/30"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Skill Exchange
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/projects')}
                className="!border-white/30 !text-white hover:!bg-white/10 font-bold"
                leftIcon={<Rocket className="w-5 h-5 text-violet-300" />}
              >
                Explore ProjectSpace
              </Button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: Repeat, label: 'Two-Way Skill Barter' },
                { icon: Users, label: '38+ Active Student Profiles' },
                { icon: ShieldCheck, label: 'Department Verified' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-xs sm:text-sm font-medium">
                  <s.icon className="w-4 h-4 text-violet-300" />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 CORE PLATFORM PILLARS ── */}
      <section id="pillars" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="violet" size="md">Core Pillars</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Modern Campus Collaboration
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Traditional tutoring is one-way and costly. SkillBridge turns your university into an interconnected peer learning and venture launchpad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-violet-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">
                    {pillar.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-violet-600 hover:text-violet-700 hover:bg-violet-50 justify-between font-semibold"
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

      {/* ── 5-FACTOR MATCHMAKER ALGORITHM EXPLAINER ── */}
      <section id="algorithm" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="violet" size="md">Matchmaking Engine</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Weighted 5-Factor Peer Compatibility Algorithm
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Rather than random lists, SkillBridge scores student pairs using a mathematically rigorous multi-factor algorithm calibrated specifically for collegiate academic cycles:
              </p>

              <div className="space-y-3">
                {[
                  { factor: 'Domain Expertise & Skill Coverage', weight: '35%', desc: 'Overlap between skills offered and skills wanted.' },
                  { factor: 'Schedule Compatibility', weight: '25%', desc: 'Jaccard intersection over shared weekly availability slots.' },
                  { factor: 'Two-Way Reciprocal Match', weight: '20%', desc: 'Bidirectional learning equilibrium (zero-cash barter).' },
                  { factor: 'Peer Reputation & Rating', weight: '10%', desc: 'Normalized peer review score and badges earned.' },
                  { factor: 'Academic Department Alignment', weight: '10%', desc: 'Shared courses, faculty, and academic year relevance.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white text-xs font-bold shrink-0 mt-0.5">
                      {item.weight}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-900">{item.factor}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Reciprocal Demonstration Card */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
                      Live Reciprocal Match Demonstration
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                    96% Mutual Match
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Student A */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-violet-300">Student A (You)</span>
                    <h4 className="font-bold text-white text-base">Alex Chen</h4>
                    <p className="text-xs text-slate-400">CS &bull; 3rd Year</p>
                    <div className="text-xs space-y-1 pt-2">
                      <div className="text-emerald-400 font-semibold">Teaches: React, TypeScript</div>
                      <div className="text-violet-300 font-semibold">Wants: Python, ML</div>
                    </div>
                  </div>

                  {/* Student B */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">Student B (Partner)</span>
                    <h4 className="font-bold text-white text-base">Sarah Jenkins</h4>
                    <p className="text-xs text-slate-400">Data Science &bull; 4th Year</p>
                    <div className="text-xs space-y-1 pt-2">
                      <div className="text-emerald-400 font-semibold">Teaches: Python, ML</div>
                      <div className="text-violet-300 font-semibold">Wants: React, TypeScript</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-violet-500/20 rounded-xl border border-violet-400/30 text-center">
                  <p className="text-xs text-violet-200">
                    ⚡ Perfect Inversion: Both students teach what the other needs, with 4 overlapping available days!
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold"
                  onClick={() => navigate('/exchange')}
                >
                  Experience the Reciprocal Matchmaker &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-16 bg-gradient-to-r from-violet-700 via-indigo-700 to-violet-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black">{stat.value}</p>
                <p className="text-violet-200 text-xs sm:text-sm font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ── */}
      <section id="categories" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <Badge variant="violet" size="md">Academic Engineering Domains</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Multidisciplinary Campus Coverage
            </h2>
            <p className="text-slate-600 text-sm">
              Connecting Computer Science, Electronics, Mechanical, Civil, and Data Science.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => navigate('/exchange')}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer text-center space-y-2"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all text-violet-600">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
                <p className="text-xs text-slate-500">{cat.count} verified peers</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to Connect &amp; Build Together?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Join 38+ students across campus currently trading skills, discovering co-founders, and conquering university coursework.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="!bg-white !text-violet-900 hover:!bg-slate-100 font-extrabold shadow-xl text-base px-8"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started on SkillBridge
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SkillBridge</span>
            </div>
            <p className="text-xs text-slate-400 text-center sm:text-right">
              Challenge ID: <strong>CIH-008</strong> &bull; Smart Peer-to-Peer Tutoring &amp; Mentorship Matchmaker
            </p>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            &copy; 2026 SkillBridge. Fully audited, redesigned, and seeded with campus dataset.
          </div>
        </div>
      </footer>
    </div>
  );
}
