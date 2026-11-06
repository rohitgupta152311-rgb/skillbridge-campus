import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, UserPlus, Check, X, Search, Filter, ShieldCheck,
  MessageSquare, Briefcase, GraduationCap, ArrowRight, UserCheck
} from 'lucide-react';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { Card, Avatar, Badge, Button, Input, EmptyState } from '../../shared/components';
import { getConnections, getUsers, sendConnectionRequest, respondConnectionRequest, removeConnection, getOrCreateConversation } from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import { DEPARTMENTS } from '../../foundation/constants';
import { Connection, User } from '../../foundation/types';

export function NetworkPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'network' | 'requests' | 'suggestions'>('network');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const allConnections = useMemo(() => getConnections(), [refreshKey]);
  const allUsers = useMemo(() => getUsers(), [refreshKey]);

  // Active accepted connections
  const myConnections = useMemo(() => {
    if (!user) return [];
    return allConnections.filter(c => 
      c.status === 'ACCEPTED' && (c.senderId === user.id || c.receiverId === user.id)
    );
  }, [allConnections, user]);

  // Pending received invitations
  const pendingRequests = useMemo(() => {
    if (!user) return [];
    return allConnections.filter(c => c.status === 'PENDING' && c.receiverId === user.id);
  }, [allConnections, user]);

  // Pending sent requests
  const pendingSent = useMemo(() => {
    if (!user) return [];
    return allConnections.filter(c => c.status === 'PENDING' && c.senderId === user.id);
  }, [allConnections, user]);

  // Suggested peers (students & mentors not connected yet)
  const suggestions = useMemo(() => {
    if (!user) return [];
    const connectedUserIds = new Set([
      user.id,
      ...allConnections
        .filter(c => c.senderId === user.id || c.receiverId === user.id)
        .map(c => c.senderId === user.id ? c.receiverId : c.senderId)
    ]);

    return allUsers.filter(u => !connectedUserIds.has(u.id) && u.role !== 'admin');
  }, [allUsers, allConnections, user]);

  // Filtered connections list
  const filteredConnections = useMemo(() => {
    return myConnections.filter(c => {
      const other = c.senderId === user?.id ? c.user : allUsers.find(u => u.id === c.senderId);
      if (!other) return false;

      const matchesSearch = other.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        other.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (other.headline || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = !selectedDept || other.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [myConnections, searchQuery, selectedDept, allUsers, user]);

  const handleAcceptRequest = (connectionId: string) => {
    respondConnectionRequest(connectionId, 'ACCEPTED');
    addToast({ type: 'success', title: 'Connection accepted!' });
    setRefreshKey(k => k + 1);
  };

  const handleRejectRequest = (connectionId: string) => {
    respondConnectionRequest(connectionId, 'REJECTED');
    addToast({ type: 'info', title: 'Connection invitation declined' });
    setRefreshKey(k => k + 1);
  };

  const handleSendRequest = (targetUserId: string) => {
    if (!user) return;
    sendConnectionRequest(user.id, targetUserId);
    addToast({ type: 'success', title: 'Connection request sent!' });
    setRefreshKey(k => k + 1);
  };

  const handleRemove = (connectionId: string) => {
    removeConnection(connectionId);
    addToast({ type: 'info', title: 'Connection removed' });
    setRefreshKey(k => k + 1);
  };

  const handleStartChat = (otherUserId: string) => {
    if (!user) return;
    const conv = getOrCreateConversation(user.id, otherUserId);
    navigate(`/messages/${conv.id}`);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-900 to-violet-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="violet" className="!bg-white/10 !text-violet-200 border border-white/20 mb-3">
            Campus Professional Network
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Build Your Campus Network</h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Connect with fellow students, senior mentors, and departmental alumni. Share project opportunities and collaborate across university faculties.
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/messages')}
            leftIcon={<MessageSquare className="w-4 h-4 text-violet-700" />}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-sm"
          >
            Start Messaging with Peers
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        {[
          { key: 'network', label: 'My Network', count: myConnections.length },
          { key: 'requests', label: 'Invitations', count: pendingRequests.length },
          { key: 'suggestions', label: 'Suggested Connections', count: suggestions.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: MY NETWORK ── */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          {/* Search & Department Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search connected peers by name, role, or title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-violet-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {filteredConnections.length === 0 ? (
            <Card>
              <EmptyState
                title="No connections yet"
                description="Explore suggested campus peers and start building your university network."
                action={
                  <Button size="sm" onClick={() => setActiveTab('suggestions')}>
                    Find Suggested Connections
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.map(c => {
                const other = (c.senderId === user.id ? c.user : allUsers.find(u => u.id === c.senderId)) || {
                  id: c.connectedUserId || 'user-unknown',
                  fullName: c.connectedUserName || 'Campus Peer',
                  department: c.connectedUserDepartment || 'Engineering',
                  role: 'mentee' as const,
                  onlineStatus: 'available' as const,
                  isVerified: true,
                  university: 'Campus University',
                  headline: c.connectedUserHeadline || 'Student Collaborator',
                };
                return (
                  <Card key={c.id} padding="md" className="border border-slate-200">
                    <div className="flex items-start gap-3">
                      <Avatar name={other.fullName} size="lg" showStatus status={other.onlineStatus} />
                      <div className="flex-1 min-w-0">
                        <Link to={`/discover/${other.id}`} className="font-semibold text-sm text-slate-900 hover:text-violet-600 truncate block">
                          {other.fullName}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1">{other.headline || `${other.department}`}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{other.university || 'Campus University'}</p>

                        <div className="flex gap-1.5 mt-2">
                          <Badge variant={other.role === 'mentor' ? 'violet' : 'info'} size="sm">
                            {other.role}
                          </Badge>
                          {other.isVerified && (
                            <Badge variant="success" size="sm">Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 text-xs"
                        leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                        onClick={() => handleStartChat(other.id)}
                      >
                        Start Messaging
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-slate-500 hover:text-red-600"
                        onClick={() => handleRemove(c.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: INVITATIONS / REQUESTS ── */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-3 text-base">Received Invitations ({pendingRequests.length})</h3>
            {pendingRequests.length === 0 ? (
              <Card>
                <EmptyState
                  title="No pending invitations"
                  description="When classmates or mentors invite you to connect, they will appear here."
                />
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {pendingRequests.map(r => {
                  const sender = allUsers.find(u => u.id === r.senderId);
                  if (!sender) return null;
                  return (
                    <Card key={r.id} padding="md" className="border border-slate-200">
                      <div className="flex items-start gap-3">
                        <Avatar name={sender.fullName} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900">{sender.fullName}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{sender.headline || sender.department}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{sender.department} • {sender.year}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          onClick={() => handleAcceptRequest(r.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          leftIcon={<X className="w-3.5 h-3.5" />}
                          onClick={() => handleRejectRequest(r.id)}
                        >
                          Ignore
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: SUGGESTIONS ── */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            People you may know based on your department, academic year, and technical skills.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map(peer => (
              <Card key={peer.id} padding="md" className="border border-slate-200 hover:border-violet-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar name={peer.fullName} size="lg" showStatus status={peer.onlineStatus} />
                  <div className="flex-1 min-w-0">
                    <Link to={`/discover/${peer.id}`} className="font-semibold text-sm text-slate-900 hover:text-violet-600 truncate block">
                      {peer.fullName}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">{peer.headline || `${peer.department} Student`}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{peer.department} • {peer.year}</p>

                    <div className="flex gap-1.5 mt-2">
                      <Badge variant={peer.role === 'mentor' ? 'violet' : 'info'} size="sm">
                        {peer.role}
                      </Badge>
                      {peer.isVerified && (
                        <Badge variant="success" size="sm">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 text-xs bg-slate-900 hover:bg-black text-white"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                    onClick={() => handleStartChat(peer.id)}
                  >
                    Start Messaging
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300"
                    leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                    onClick={() => handleSendRequest(peer.id)}
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
