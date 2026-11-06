import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass, Search, Users, Sparkles, Rocket, Building2,
  Filter, Code, Brain, Cpu, Layers, Award, Briefcase,
  ChevronRight, ArrowLeftRight, CheckCircle2, MessageSquare,
  Calendar, Star, ExternalLink, ShieldCheck
} from 'lucide-react';
import { Card, Button, Badge, Avatar } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  getUsers, getProjects, getCommunities, calculateSkillExchangeMatches
} from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';

const EXPLORE_CATEGORIES = [
  { id: 'all', label: 'All Domains', icon: Compass },
  { id: 'web', label: 'Web Development', icon: Code },
  { id: 'ai', label: 'AI & Machine Learning', icon: Brain },
  { id: 'iot', label: 'IoT & Robotics', icon: Cpu },
  { id: 'vlsi', label: 'Electronics & VLSI', icon: Layers },
  { id: 'cp', label: 'Competitive Programming', icon: Award },
  { id: 'startup', label: 'Entrepreneurship & Startups', icon: Briefcase },
  { id: 'design', label: 'Design & Creativity', icon: Sparkles },
];

const CAMPUS_EVENTS = [
  {
    id: 'ev-1',
    title: 'Smart India Hackathon (SIH) Internal Campus Sprint',
    date: 'Nov 12, 2026',
    time: '10:00 AM - 6:00 PM IST',
    mode: 'Hybrid &bull; Campus Innovation Lab',
    attendees: 140,
    tags: ['Hackathon', 'Interdisciplinary', 'Venture'],
  },
  {
    id: 'ev-2',
    title: 'Hands-on ROS2 & Drone Telemetry Workshop',
    date: 'Nov 15, 2026',
    time: '3:00 PM - 5:30 PM IST',
    mode: 'Online &bull; Google Meet',
    attendees: 85,
    tags: ['Robotics', 'Firmware', 'ROS2'],
  },
  {
    id: 'ev-3',
    title: 'Campus Open Source Sprint (GSoC Prep)',
    date: 'Nov 18, 2026',
    time: '2:00 PM - 5:00 PM IST',
    mode: 'CS Seminar Hall',
    attendees: 110,
    tags: ['OpenSource', 'Git', 'Contributions'],
  },
];

export function ExplorePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'projects' | 'communities' | 'events'>('all');

  const allUsers = useMemo(() => getUsers(), []);
  const allProjects = useMemo(() => getProjects(), []);
  const allCommunities = useMemo(() => getCommunities(), []);

  // Filtered People
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      if (u.id === user?.id) return false;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        (u.university && u.university.toLowerCase().includes(q)) ||
        u.skillsOffered?.some(s => s.skillName.toLowerCase().includes(q)) ||
        u.skillsWanted?.some(s => s.skillName.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'web' && u.skillsOffered?.some(s => ['react', 'next.js', 'node', 'web', 'typescript'].some(k => s.skillName.toLowerCase().includes(k)))) ||
        (selectedCategory === 'ai' && u.skillsOffered?.some(s => ['python', 'machine learning', 'pytorch', 'data', 'vision'].some(k => s.skillName.toLowerCase().includes(k)))) ||
        (selectedCategory === 'iot' && u.skillsOffered?.some(s => ['iot', 'esp32', 'embedded', 'lora', 'ros2', 'robotics'].some(k => s.skillName.toLowerCase().includes(k)))) ||
        (selectedCategory === 'vlsi' && u.skillsOffered?.some(s => ['verilog', 'fpga', 'digital electronics', 'vlsi', 'circuit'].some(k => s.skillName.toLowerCase().includes(k)))) ||
        (selectedCategory === 'cp' && u.skillsOffered?.some(s => ['c++', 'data structures', 'algorithms', 'discrete'].some(k => s.skillName.toLowerCase().includes(k)))) ||
        (selectedCategory === 'startup' && (u.department.toLowerCase().includes('business') || u.skillsOffered?.some(s => ['product', 'pitch', 'business'].some(k => s.skillName.toLowerCase().includes(k))))) ||
        (selectedCategory === 'design' && u.skillsOffered?.some(s => ['figma', 'design', 'ui/ux', 'usability'].some(k => s.skillName.toLowerCase().includes(k))));

      return matchesSearch && matchesCategory;
    });
  }, [allUsers, user?.id, searchQuery, selectedCategory]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.requiredSkills.some(s => s.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'web' && (p.category.includes('Web') || p.category.includes('SaaS') || p.requiredSkills.some(s => s.toLowerCase().includes('react')))) ||
        (selectedCategory === 'ai' && (p.category.includes('AI') || p.requiredSkills.some(s => s.toLowerCase().includes('python')))) ||
        (selectedCategory === 'iot' && (p.category.includes('IoT') || p.category.includes('Hardware'))) ||
        (selectedCategory === 'vlsi' && (p.requiredSkills.some(s => s.toLowerCase().includes('verilog') || s.toLowerCase().includes('electronics')))) ||
        (selectedCategory === 'cp' && p.category.includes('Competitive')) ||
        (selectedCategory === 'startup' && p.category.includes('Entrepreneurship')) ||
        (selectedCategory === 'design' && p.requiredSkills.some(s => s.toLowerCase().includes('figma')));

      return matchesSearch && matchesCategory;
    });
  }, [allProjects, searchQuery, selectedCategory]);

  // Filtered Communities
  const filteredCommunities = useMemo(() => {
    return allCommunities.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'web' && c.name.includes('Developers')) ||
        (selectedCategory === 'ai' && c.name.includes('AI')) ||
        (selectedCategory === 'iot' && (c.name.includes('IoT') || c.name.includes('Embedded'))) ||
        (selectedCategory === 'cp' && c.name.includes('Competitive')) ||
        (selectedCategory === 'startup' && c.name.includes('Startup')) ||
        (selectedCategory === 'design' && c.name.includes('Design'));

      return matchesSearch && matchesCategory;
    });
  }, [allCommunities, searchQuery, selectedCategory]);

  const handleConnect = (targetUser: any) => {
    addToast({
      type: 'success',
      title: 'Connection Proposal Sent! 🤝',
      message: `Sent mutual networking & skill exchange request to ${targetUser.fullName}.`,
    });
  };

  const handleJoinCommunity = (comm: any) => {
    addToast({
      type: 'info',
      title: 'Community Joined! 🎉',
      message: `You are now a member of ${comm.name}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 text-white p-8 lg:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Campus Community Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Discover Campus Talent, Projects &amp; Communities.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            "Everyone has something to teach, something to learn, and something valuable to share."
            Explore 45+ verified student peers, join multidisciplinary hackathon teams, and participate in active study circles.
          </p>

          {/* Omni-Search Input */}
          <div className="relative max-w-xl pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-5" />
            <input
              type="text"
              placeholder="Search by student name, skill (Python, React, Verilog), or project..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-violet-500/20 text-sm font-medium shadow-lg"
            />
          </div>
        </div>

        {/* Decorative Grid Effect */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-violet-500/10 to-transparent pointer-events-none" />
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EXPLORE_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── VIEW TABS ── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `All (${filteredUsers.length + filteredProjects.length + filteredCommunities.length})` },
            { id: 'people', label: `Peers (${filteredUsers.length})` },
            { id: 'projects', label: `Projects (${filteredProjects.length})` },
            { id: 'communities', label: `Communities (${filteredCommunities.length})` },
            { id: 'events', label: `Events (${CAMPUS_EVENTS.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing verified campus members across India
        </div>
      </div>

      {/* ── SECTION: PEOPLE / PEERS ── */}
      {(activeTab === 'all' || activeTab === 'people') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Campus Peers &amp; Skill Sharers</h2>
            </div>
            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('people')}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                View all peers <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.slice(0, activeTab === 'all' ? 6 : 45).map(peer => (
              <div
                key={peer.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={peer.fullName} src={peer.avatar} size="lg" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm truncate">{peer.fullName}</span>
                        {peer.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{peer.department}</p>
                      <p className="text-[11px] font-semibold text-violet-600 truncate">{peer.university || 'State University'}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {peer.headline || peer.bio}
                  </p>

                  {/* Skills Section */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <span>Teaches:</span>
                      <div className="flex flex-wrap gap-1">
                        {peer.skillsOffered?.slice(0, 2).map(s => (
                          <span key={s.skillName} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-700">
                      <span>Wants:</span>
                      <div className="flex flex-wrap gap-1">
                        {peer.skillsWanted?.slice(0, 2).map(s => (
                          <span key={s.skillName} className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-800 text-[10px] font-bold">
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1 text-slate-700"
                    onClick={() => navigate('/exchange')}
                  >
                    View Match
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                    onClick={() => handleConnect(peer)}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION: PROJECTS & TEAMS ── */}
      {(activeTab === 'all' || activeTab === 'projects') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Interdisciplinary Campus Projects</h2>
            </div>
            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                View all projects <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredProjects.slice(0, activeTab === 'all' ? 4 : 8).map(proj => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {proj.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Recruiting {proj.openPositions.length} roles
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{proj.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.tagline || proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.requiredSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name={proj.ownerName} src={proj.ownerAvatar} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-800">{proj.ownerName}</p>
                      <p className="text-[10px] text-slate-400">{proj.ownerUniversity || 'Campus Lead'}</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold"
                    onClick={() => navigate('/projects')}
                  >
                    Apply to Team &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION: KNOWLEDGE COMMUNITIES ── */}
      {(activeTab === 'all' || activeTab === 'communities') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Student Learning Communities</h2>
            </div>
            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('communities')}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                View all communities <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCommunities.map(comm => (
              <div
                key={comm.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-center group"
              >
                <div className="space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                    <img src={comm.avatar} alt={comm.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{comm.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{comm.description}</p>
                  <p className="text-[11px] font-semibold text-violet-600">{comm.membersCount} active campus peers</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold text-violet-700 border-violet-200 hover:bg-violet-50"
                  onClick={() => handleJoinCommunity(comm)}
                >
                  Join Community
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION: CAMPUS EVENTS & HACKATHONS ── */}
      {(activeTab === 'all' || activeTab === 'events') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Upcoming Campus Hackathons &amp; Events</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {CAMPUS_EVENTS.map(ev => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                    {ev.date}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{ev.attendees} registered</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{ev.title}</h3>
                <p className="text-xs text-slate-500">{ev.time} &bull; {ev.mode}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {ev.tags.map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 justify-between font-semibold pt-2"
                  onClick={() => addToast({ type: 'success', title: 'RSVP Confirmed!', message: `Registered for ${ev.title}.` })}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  RSVP / Add to Calendar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
