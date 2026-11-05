import { useState, useMemo } from 'react';
import { Users, Flag, Shield, BarChart3, CheckCircle, XCircle, AlertTriangle, Eye, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card, Avatar, Badge, Button, Modal, EmptyState } from '../../shared/components';
import { getUsers, getSessions, getReviews, getReports, getConversations, updateUser, updateReport } from '../../infrastructure/local-storage/data-service';
import { formatDate, averageOf } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import type { User, UserReport } from '../../foundation/types';

export function AdminDashboard() {
  const users = useMemo(() => getUsers(), []);
  const sessions = useMemo(() => getSessions(), []);
  const reviews = useMemo(() => getReviews(), []);
  const reports = useMemo(() => getReports(), []);
  const conversations = useMemo(() => getConversations(), []);

  const mentorCount = users.filter(u => u.role === 'mentor').length;
  const menteeCount = users.filter(u => u.role === 'mentee').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const avgRating = reviews.length > 0 ? averageOf(reviews.map(r => r.overallRating)) : 0;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  // Chart data: Sessions by Subject Category
  const topicDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach(s => {
      counts[s.topic] = (counts[s.topic] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [sessions]);

  const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  const stats = [
    { icon: Users, label: 'Total Users', value: users.length - 1, color: 'text-violet-600 bg-violet-50' },
    { icon: Shield, label: 'Mentors', value: mentorCount, color: 'text-blue-600 bg-blue-50' },
    { icon: BarChart3, label: 'Sessions', value: completedSessions, color: 'text-emerald-600 bg-emerald-50' },
    { icon: AlertTriangle, label: 'Reports', value: pendingReports, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform analytics, safety monitoring, and administrative governance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" /> Tutoring Demand by Subject
            </h3>
            <span className="text-xs text-slate-400">Total Bookings</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" /> Subject Mix Breakdown
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="count">
                  {topicDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="font-semibold text-slate-900 mb-3">Platform Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Mentees</span><span className="font-medium">{menteeCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Mentors</span><span className="font-medium">{mentorCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Completed Sessions</span><span className="font-medium">{completedSessions}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Average Rating</span><span className="font-medium">{avgRating.toFixed(1)} / 5</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Active Conversations</span><span className="font-medium">{conversations.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Reviews</span><span className="font-medium">{reviews.length}</span></div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-semibold text-slate-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {sessions.slice(-5).reverse().map(s => {
              const mentor = users.find(u => u.id === s.mentorId);
              const mentee = users.find(u => u.id === s.menteeId);
              return (
                <div key={s.id} className="flex items-center gap-3 text-sm">
                  <Badge variant={s.status === 'completed' ? 'success' : s.status === 'pending' ? 'warning' : 'info'}>{s.status}</Badge>
                  <span className="text-slate-700 truncate">{mentee?.fullName} ↔ {mentor?.fullName}: {s.topic}</span>
                  <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{formatDate(s.date)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { addToast } = useToastStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState<'all' | 'mentor' | 'mentee'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users = useMemo(() => getUsers().filter(u => u.role !== 'admin'), [refreshKey]);
  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  const handleToggleSuspend = (userId: string, suspend: boolean) => {
    updateUser(userId, { isSuspended: suspend });
    addToast({ type: suspend ? 'warning' : 'success', title: suspend ? 'User suspended' : 'User reinstated' });
    setRefreshKey(k => k + 1);
    setSelectedUser(null);
  };

  const handleVerify = (userId: string) => {
    updateUser(userId, { isVerified: true });
    addToast({ type: 'success', title: 'User verified' });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage registered users.</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'mentor', 'mentee'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-violet-100 text-violet-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}s ({f === 'all' ? users.length : users.filter(u => u.role === f).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Department</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{u.fullName}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={u.role === 'mentor' ? 'violet' : 'info'}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {u.isVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
                      {u.isSuspended && <Badge variant="error">Suspended</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(u.joinedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!u.isVerified && <Button size="sm" variant="outline" onClick={() => handleVerify(u.id)}>Verify</Button>}
                      <Button size="sm" variant="ghost" onClick={() => setSelectedUser(u)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedUser.fullName} size="lg" />
              <div>
                <p className="font-semibold text-slate-900">{selectedUser.fullName}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Role:</span> <span className="font-medium capitalize">{selectedUser.role}</span></div>
              <div><span className="text-slate-500">Dept:</span> <span className="font-medium">{selectedUser.department}</span></div>
              <div><span className="text-slate-500">Year:</span> <span className="font-medium">{selectedUser.year}</span></div>
              <div><span className="text-slate-500">Joined:</span> <span className="font-medium">{formatDate(selectedUser.joinedAt)}</span></div>
            </div>
            {selectedUser.bio && <p className="text-sm text-slate-600">{selectedUser.bio}</p>}
            <div className="flex gap-3 pt-2 border-t border-slate-200">
              <Button variant={selectedUser.isSuspended ? 'primary' : 'danger'} onClick={() => handleToggleSuspend(selectedUser.id, !selectedUser.isSuspended)}>
                {selectedUser.isSuspended ? 'Reinstate User' : 'Suspend User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function AdminReportsPage() {
  const { addToast } = useToastStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const reports = useMemo(() => getReports(), [refreshKey]);
  const users = useMemo(() => getUsers(), []);

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    updateReport(reportId, { status, resolvedAt: new Date().toISOString(), resolvedBy: 'admin-1' });
    addToast({ type: 'success', title: `Report ${status}` });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Safety Governance</h1>
        <p className="text-slate-500 mt-1">Review flagged accounts and content to maintain campus safety.</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState title="No active reports" description="All user reports have been resolved or dismissed. Great job keeping the community safe!" icon={<Flag className="w-8 h-8" />} />
      ) : (
        <div className="space-y-3">
          {reports.map(report => {
            const reporter = users.find(u => u.id === report.reporterId);
            const reported = users.find(u => u.id === report.reportedUserId);
            return (
              <Card key={report.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{report.reason}</p>
                      <p className="text-xs text-slate-500 mt-1">Reported by {reporter?.fullName} → {reported?.fullName}</p>
                      <p className="text-sm text-slate-600 mt-2">{report.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(report.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : 'default'}>{report.status}</Badge>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                    <Button size="sm" onClick={() => handleResolve(report.id, 'resolved')} leftIcon={<CheckCircle className="w-4 h-4" />}>Resolve</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleResolve(report.id, 'dismissed')} leftIcon={<XCircle className="w-4 h-4" />}>Dismiss</Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
