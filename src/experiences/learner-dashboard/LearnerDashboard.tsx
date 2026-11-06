import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, Search, BookOpen, Clock, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { Card, Avatar, Badge, Button, StarRating, EmptyState } from '../../shared/components';
import { getSessionsByUser, getConversationsByUser, getUserById, getOrCreateConversation } from '../../infrastructure/local-storage/data-service';
import { computeMatchScores, getAllMentorProfiles } from '../../domain/matching-engine';
import { formatDate, formatTime, getMatchScoreLabel } from '../../foundation/helpers';
import type { MentorProfile } from '../../foundation/types';

export function LearnerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const sessions = useMemo(() => user ? getSessionsByUser(user.id) : [], [user]);
  const conversations = useMemo(() => user ? getConversationsByUser(user.id) : [], [user]);
  const upcomingSessions = sessions.filter(s => s.status === 'accepted' && new Date(s.date) >= new Date()).slice(0, 3);
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const pendingCount = sessions.filter(s => s.status === 'pending').length;

  // Top recommended mentors
  const recommended = useMemo(() => {
    const matches = computeMatchScores({ topic: 'ReactJS' }, user?.id);
    const profiles = getAllMentorProfiles();
    return matches.slice(0, 4).map(m => {
      const profile = profiles.find(p => p.id === m.mentorId)!;
      return { ...profile, matchScore: m.matchScore, matchReasons: m.reasons };
    }).filter(Boolean) as (MentorProfile & { matchScore: number; matchReasons: string[] })[];
  }, [user]);

  if (!user) return null;

  const statCards = [
    { icon: Calendar, label: 'Upcoming', value: upcomingSessions.length, color: 'text-violet-600 bg-violet-50' },
    { icon: BookOpen, label: 'Completed', value: completedCount, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Clock, label: 'Pending', value: pendingCount, color: 'text-amber-600 bg-amber-50' },
    { icon: MessageSquare, label: 'Conversations', value: conversations.length, color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/sessions')} rightIcon={<ArrowRight className="w-4 h-4" />}>View All</Button>
          </div>
          {upcomingSessions.length === 0 ? (
            <Card><EmptyState title="No upcoming sessions" description="Find a mentor and book your first session!" action={<Button size="sm" onClick={() => navigate('/discover')}>Find Mentors</Button>} /></Card>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map(session => {
                const mentor = getUserById(session.mentorId);
                return (
                  <Card key={session.id} hover onClick={() => navigate('/sessions')}>
                    <div className="flex items-center gap-4">
                      <Avatar name={mentor?.fullName || 'Unknown'} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{session.topic}</p>
                        <p className="text-sm text-slate-500">with {mentor?.fullName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{formatDate(session.date)}</p>
                        <p className="text-xs text-slate-500">{formatTime(session.startTime)} · {session.duration}min</p>
                      </div>
                      <Badge variant={session.sessionType === 'online' ? 'info' : 'success'}>{session.sessionType}</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Recommended Mentors */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Recommended Mentors</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/discover')} rightIcon={<ArrowRight className="w-4 h-4" />}>Discover</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recommended.map(mentor => {
              const scoreInfo = getMatchScoreLabel(mentor.matchScore);
              return (
                <Card key={mentor.id} hover onClick={() => navigate(`/discover/${mentor.id}`)}>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={mentor.fullName} size="md" showStatus status={mentor.onlineStatus} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{mentor.fullName}</p>
                      <p className="text-xs text-slate-500">{mentor.department} · {mentor.year}</p>
                    </div>
                    <span className={`text-sm font-bold ${scoreInfo.color}`}>{mentor.matchScore}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {mentor.expertise.slice(0, 3).map(e => <Badge key={e.id} variant="violet">{e.topic}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1"><StarRating rating={mentor.averageRating} size="sm" /> {mentor.averageRating || 'New'}</span>
                    <span>{mentor.completedSessions} sessions</span>
                  </div>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 font-semibold"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        const conv = getOrCreateConversation(user?.id || 'user-vidya', mentor.id);
                        navigate(`/messages/${conv.id}`);
                      }}
                    >
                      Start Messaging
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <Card>
            <div className="space-y-2">
              {[
                { icon: Search, label: 'Find a Mentor', path: '/discover', color: 'text-violet-600' },
                { icon: Calendar, label: 'My Sessions', path: '/sessions', color: 'text-blue-600' },
                { icon: MessageSquare, label: 'Start Messaging', path: '/messages', color: 'text-emerald-600' },
                { icon: TrendingUp, label: 'Smart Matching', path: '/match', color: 'text-amber-600' },
              ].map(action => (
                <button key={action.path} onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
                </button>
              ))}
            </div>
          </Card>

          {/* Learning Progress */}
          <h2 className="text-lg font-semibold text-slate-900">Learning Progress</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Sessions Completed</span>
                  <span className="font-medium text-slate-900">{completedCount}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.min(100, completedCount * 10)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Mentors Connected</span>
                  <span className="font-medium text-slate-900">{conversations.length}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, conversations.length * 20)}%` }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
