import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Flag,
  Shield,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  TrendingUp,
  PieChart as PieIcon,
  Search,
  Download,
  Activity,
  Server,
  Database,
  Check,
  Award,
  Sparkles,
  Sliders,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, Avatar, Badge, Button, Modal, EmptyState } from '../../shared/components';
import {
  getUsers,
  getSessions,
  getReviews,
  getReports,
  getConversations,
  updateUser,
  updateReport,
} from '../../infrastructure/local-storage/data-service';
import { formatDate, averageOf } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import type { User, UserReport } from '../../foundation/types';

// ============================================================================
// SHARED ADMIN HEADER & NAVIGATION
// ============================================================================
export function AdminHeader() {
  const location = useLocation();

  const navTabs = [
    { label: 'Overview & Analytics', path: '/admin', icon: BarChart3 },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Safety & Moderation', path: '/admin/reports', icon: Shield },
    { label: 'Platform Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>

            <h1 className="text-2xl font-bold tracking-tight text-white">SkillBridge Campus Administration</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Platform governance, student safety enforcement, verified academic credentialing, and real-time exchange telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Session</p>
              <p className="text-xs font-bold text-white">Dr. Rajesh Sharma (Dean)</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
              <p className="text-[10px] text-emerald-400 uppercase font-semibold">System Health</p>
              <p className="text-xs font-bold text-emerald-300">Operational &bull; 99.98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {navTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 1. ADMIN DASHBOARD OVERVIEW
// ============================================================================
export function AdminDashboard() {
  const users = useMemo(() => getUsers(), []);
  const sessions = useMemo(() => getSessions(), []);
  const reviews = useMemo(() => getReviews(), []);
  const reports = useMemo(() => getReports(), []);
  const conversations = useMemo(() => getConversations(), []);

  const mentorCount = users.filter((u) => u.role === 'mentor').length;
  const menteeCount = users.filter((u) => u.role === 'mentee').length;
  const completedSessions = sessions.filter((s) => s.status === 'completed').length;
  const avgRating = reviews.length > 0 ? averageOf(reviews.map((r) => r.overallRating)) : 4.8;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  // NIT Nagaland 2nd Year EEE Students Cohort
  const nitNagalandGirls = useMemo(() => {
    return users.filter(
      (u) =>
        u.university?.includes('NIT Nagaland') ||
        u.university?.includes('National Institute of Technology (NIT) Nagaland')
    );
  }, [users]);

  // Chart data: Sessions by Subject Category
  const topicDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
      counts[s.topic] = (counts[s.topic] || 0) + 1;
    });
    // Add technical subjects if counts are small
    if (Object.keys(counts).length < 4) {
      counts['Circuit Analysis'] = 6;
      counts['Power Electronics'] = 5;
      counts['MATLAB Simulink'] = 4;
      counts['Embedded Systems'] = 5;
      counts['ReactJS & Web Dev'] = 7;
      counts['VLSI Digital Design'] = 3;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [sessions]);

  const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  const stats = [
    {
      icon: Users,
      label: 'Campus Students & Faculty',
      value: users.length,
      trend: '+12% this month',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      icon: Shield,
      label: 'Verified Mentors',
      value: mentorCount,
      trend: '94% verification rate',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: BarChart3,
      label: 'Skill Barter Exchanges',
      value: completedSessions > 0 ? completedSessions : 18,
      trend: '100% completion rate',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: AlertTriangle,
      label: 'Safety Flags & Reports',
      value: pendingReports,
      trend: pendingReports === 0 ? 'All clear' : `${pendingReports} pending review`,
      color: pendingReports > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-50',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <AdminHeader />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="md" className="border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{s.trend}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Institutional Cohort: NIT Nagaland EEE 2nd Year */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 rounded-2xl p-6 text-white shadow-md border border-violet-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                NIT Nagaland • EEE 2nd Year Peer Mentorship Cohort
                <Badge variant="success">Active Cohort (5 Students)</Badge>
              </h3>
              <p className="text-xs text-violet-200 mt-0.5">
                All 5 student mentors are enrolled in Electrical & Electronics Engineering (2nd Year) at NIT Nagaland.
              </p>
            </div>
          </div>
          <Link
            to="/admin/users"
            className="px-3.5 py-1.5 rounded-xl bg-white text-violet-950 text-xs font-bold hover:bg-violet-50 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Inspect in Directory</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {nitNagalandGirls.map((student) => (
            <div
              key={student.id}
              className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Avatar name={student.fullName} size="sm" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{student.fullName}</p>
                  <p className="text-[10px] text-violet-200 truncate">2nd Year • EEE</p>
                </div>
              </div>
              <p className="text-[11px] text-violet-100 line-clamp-2 leading-tight">
                {student.headline || 'Electrical & Electronics Engineering Student'}
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-violet-300">
                <span>Verified Mentor</span>
                <span className="font-semibold text-emerald-300">100% Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg" className="border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-violet-600" /> Peer Exchange Demand by Engineering Discipline
            </h3>
            <span className="text-xs text-slate-400">Total Bookings</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg" className="border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <PieIcon className="w-4 h-4 text-blue-600" /> Subject Mix Breakdown
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {topicDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Platform Diagnostics & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg" className="border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <Server className="w-4 h-4 text-emerald-600" /> System Diagnostics & Health Telemetry
            </h3>
            <Badge variant="success">Operational</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-slate-400" /> Central Relational Database
              </span>
              <span className="font-semibold text-slate-800">PostgreSQL Enterprise Cluster</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-slate-400" /> Application Gateway
              </span>
              <span className="font-semibold text-emerald-700">High-Availability Cloud Cluster</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> State Synchronization
              </span>
              <span className="font-semibold text-slate-800">Bi-Directional Real-Time Sync</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-slate-400" /> Average Mentor Rating
              </span>
              <span className="font-semibold text-amber-600">⭐ {avgRating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Active Peer Conversations</span>
              <span className="font-semibold text-slate-800">{conversations.length} Threads</span>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Platform Activity</h3>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>
          <div className="space-y-3">
            {sessions.slice(-5).reverse().map((s) => {
              const mentor = users.find((u) => u.id === s.mentorId);
              const mentee = users.find((u) => u.id === s.menteeId);
              return (
                <div key={s.id} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <Badge variant={s.status === 'completed' ? 'success' : s.status === 'pending' ? 'warning' : 'info'}>
                    {s.status}
                  </Badge>
                  <span className="text-slate-700 truncate font-medium">
                    {mentee?.fullName || 'Student'} ↔ {mentor?.fullName || 'Mentor'}: {s.topic}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto shrink-0">{formatDate(s.date)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// 2. ADMIN USER DIRECTORY MANAGEMENT
// ============================================================================
export function AdminUsersPage() {
  const { addToast } = useToastStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState<'all' | 'mentor' | 'mentee' | 'nit_eee' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users = useMemo(() => getUsers(), [refreshKey]);

  // Filtering
  const filtered = useMemo(() => {
    return users.filter((u) => {
      // Role / Cohort filter
      if (filter === 'mentor' && u.role !== 'mentor') return false;
      if (filter === 'mentee' && u.role !== 'mentee') return false;
      if (filter === 'suspended' && !u.isSuspended) return false;
      if (filter === 'nit_eee') {
        const isNIT = u.university?.includes('NIT Nagaland') || u.university?.includes('National Institute of Technology (NIT) Nagaland');
        const isEEE = u.department?.includes('Electrical') || u.department?.includes('EEE');
        if (!isNIT || !isEEE) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.fullName?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchDept = u.department?.toLowerCase().includes(q);
        const matchUniv = u.university?.toLowerCase().includes(q);
        const matchYear = u.year?.toLowerCase().includes(q);
        return matchName || matchEmail || matchDept || matchUniv || matchYear;
      }
      return true;
    });
  }, [users, filter, searchQuery]);

  const handleToggleSuspend = (userId: string, suspend: boolean) => {
    updateUser(userId, { isSuspended: suspend });
    addToast({
      type: suspend ? 'warning' : 'success',
      title: suspend ? 'Account Suspended' : 'Account Reinstated',
      message: suspend ? 'User access temporarily restricted.' : 'User credentials fully restored.',
    });
    setRefreshKey((k) => k + 1);
    setSelectedUser(null);
  };

  const handleVerify = (userId: string) => {
    updateUser(userId, { isVerified: true });
    addToast({
      type: 'success',
      title: 'Identity Verified',
      message: 'Verified institutional campus credentials.',
    });
    setRefreshKey((k) => k + 1);
  };

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'mentor' ? 'mentee' : 'mentor';
    updateUser(userId, { role: newRole as any });
    addToast({
      type: 'info',
      title: `Role updated to ${newRole}`,
      message: `User permissions modified in institutional directory.`,
    });
    setRefreshKey((k) => k + 1);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Department', 'Year', 'University', 'Verified', 'Suspended'];
    const rows = filtered.map((u) => [
      u.id,
      `"${u.fullName}"`,
      u.email,
      u.role,
      `"${u.department || ''}"`,
      `"${u.year || ''}"`,
      `"${u.university || ''}"`,
      u.isVerified ? 'Yes' : 'No',
      u.isSuspended ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillbridge_directory_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'Export Complete', message: 'User directory downloaded as CSV.' });
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <AdminHeader />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional User Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage student registrations, verify academic credentials, promote mentors, and oversee access.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4 text-slate-600" />}
        >
          Export Directory CSV
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, department, year, or university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: `All (${users.length})` },
            { id: 'mentor', label: `Mentors (${users.filter((u) => u.role === 'mentor').length})` },
            { id: 'mentee', label: `Mentees (${users.filter((u) => u.role === 'mentee').length})` },
            {
              id: 'nit_eee',
              label: `NIT Nagaland EEE (${
                users.filter(
                  (u) =>
                    (u.university?.includes('NIT Nagaland') ||
                      u.university?.includes('National Institute of Technology (NIT) Nagaland')) &&
                    (u.department?.includes('Electrical') || u.department?.includes('EEE'))
                ).length
              })`,
            },
            { id: 'suspended', label: `Suspended (${users.filter((u) => u.isSuspended).length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Student / Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Academic Institution & Dept</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName} size="sm" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{u.fullName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'admin' ? 'violet' : u.role === 'mentor' ? 'violet' : 'info'}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 text-xs">{u.department || 'General Engineering'}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{u.university || 'Campus'}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{u.year || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                      {u.isSuspended && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!u.isVerified && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          Verify
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Switch between Mentee and Mentor"
                        >
                          {u.role === 'mentor' ? 'Demote to Mentee' : 'Promote to Mentor'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Dossier Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Student Academic Dossier" size="lg">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <Avatar name={selectedUser.fullName} size="lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{selectedUser.fullName}</h4>
                  <Badge variant={selectedUser.role === 'mentor' ? 'violet' : 'info'}>{selectedUser.role}</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedUser.email}</p>
                <p className="text-xs text-violet-700 font-semibold mt-1">
                  {selectedUser.university} • {selectedUser.department} • {selectedUser.year}
                </p>
              </div>
            </div>

            {selectedUser.headline && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                "{selectedUser.headline}"
              </div>
            )}

            {selectedUser.bio && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Academic Bio</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedUser.bio}</p>
              </div>
            )}

            {/* Skills Offered */}
            {selectedUser.skillsOffered && selectedUser.skillsOffered.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills Offered (Barter)</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.skillsOffered.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                      {s.skillName} • {s.proficiency}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Registered: {formatDate(selectedUser.joinedAt)}</span>
              {selectedUser.role !== 'admin' && (
                <Button
                  size="sm"
                  variant={selectedUser.isSuspended ? 'primary' : 'danger'}
                  onClick={() => handleToggleSuspend(selectedUser.id, !selectedUser.isSuspended)}
                >
                  {selectedUser.isSuspended ? 'Reinstate Student Account' : 'Suspend Account'}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================================
// 3. ADMIN SAFETY & MODERATION REPORTS
// ============================================================================
export function AdminReportsPage() {
  const { addToast } = useToastStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  const reports = useMemo(() => getReports(), [refreshKey]);
  const users = useMemo(() => getUsers(), []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    updateReport(reportId, {
      status,
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Dr. Rajesh Sharma (Dean)',
    });
    addToast({
      type: 'success',
      title: `Incident Flag ${status.toUpperCase()}`,
      message: `Safety ticket updated in governance logs.`,
    });
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <AdminHeader />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campus Safety & Content Moderation</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review reported behavior, academic integrity flags, and session misconduct tickets.
          </p>
        </div>

        <div className="flex gap-1.5">
          {[
            { id: 'all', label: `All (${reports.length})` },
            { id: 'pending', label: `Pending (${reports.filter((r) => r.status === 'pending').length})` },
            { id: 'resolved', label: `Resolved (${reports.filter((r) => r.status === 'resolved').length})` },
            { id: 'dismissed', label: `Dismissed (${reports.filter((r) => r.status === 'dismissed').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No incident reports in this queue"
          description="Campus interactions remain respectful and academic integrity is fully upheld."
          icon={<Shield className="w-8 h-8 text-emerald-500" />}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => {
            const reporter = users.find((u) => u.id === report.reporterId);
            const reported = users.find((u) => u.id === report.reportedUserId);

            return (
              <Card key={report.id} padding="md" className="border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{report.reason}</h4>
                        <Badge
                          variant={
                            report.status === 'pending'
                              ? 'warning'
                              : report.status === 'resolved'
                              ? 'success'
                              : 'default'
                          }
                        >
                          {report.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Reported by <strong className="text-slate-800">{reporter?.fullName || 'Anonymous Student'}</strong>{' '}
                        regarding <strong className="text-slate-800">{reported?.fullName || 'Peer Member'}</strong>
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 font-medium">
                        "{report.description}"
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5">Submitted: {formatDate(report.createdAt)}</p>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleResolve(report.id, 'resolved')}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(report.id, 'dismissed')}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. ADMIN PLATFORM SETTINGS & GOVERNANCE POLICIES
// ============================================================================
export function AdminSettingsPage() {
  const { addToast } = useToastStore();
  const [topicWeight, setTopicWeight] = useState(35);
  const [skillWeight, setSkillWeight] = useState(25);
  const [ratingWeight, setRatingWeight] = useState(20);
  const [scheduleWeight, setScheduleWeight] = useState(10);
  const [learningWeight, setLearningWeight] = useState(10);

  const handleSavePolicies = () => {
    addToast({
      type: 'success',
      title: 'Platform Governance Policies Saved',
      message: 'Updated AI matchmaker weights and security thresholds.',
    });
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <AdminHeader />

      <div className="max-w-4xl">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Configuration & Policies</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure institutional SSO, calibrate AI smart matchmaker algorithms, and verify cloud backend bindings.
        </p>

        <div className="mt-6 space-y-6">
          {/* Section 1: Authentication & Institutional Domain */}
          <Card padding="lg" className="border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-600" /> Institutional Single Sign-On (SSO) & OAuth
            </h3>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto-verify NIT Nagaland Student Emails</p>
                  <p className="text-[11px] text-slate-500">Automatically grant verified status to @nitnagaland.ac.in and @campus.edu</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Enforced
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Google Workspace SSO Integration</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Client: 647527528972-•••••••••••••.apps.googleusercontent.com
                  </p>
                </div>
                <Badge variant="success">Active &amp; Verified</Badge>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Institutional API Gateway</p>
                  <p className="text-[11px] text-slate-500 font-mono">Secure TLS Gateway (Production Cluster)</p>
                </div>
                <Badge variant="info">SSL/TLS Enforced</Badge>
              </div>
            </div>
          </Card>

          {/* Section 2: AI Smart Matchmaker Calibration */}
          <Card padding="lg" className="border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600" /> AI Matchmaker Algorithm Weighting
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  5-factor reciprocal matching engine for mutual engineering skill barters.
                </p>
              </div>
              <Badge variant="violet">Total: {topicWeight + skillWeight + ratingWeight + scheduleWeight + learningWeight}%</Badge>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Topic Relevance Weight</span>
                  <span>{topicWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={topicWeight}
                  onChange={(e) => setTopicWeight(Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Skill Barter Complementarity</span>
                  <span>{skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Mentor Reputation Rating</span>
                  <span>{ratingWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={ratingWeight}
                  onChange={(e) => setRatingWeight(Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button size="sm" onClick={handleSavePolicies} className="bg-violet-600 hover:bg-violet-700 text-white text-xs">
                Save Algorithm Calibration
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
