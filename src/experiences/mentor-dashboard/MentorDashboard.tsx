import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, Users, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { Card, Avatar, Badge, Button, StarRating, EmptyState } from '../../shared/components';
import { getSessionsByUser, getReviewsByMentor, getExpertiseByMentor, getAvailabilityByMentor, getUserById } from '../../infrastructure/local-storage/data-service';
import { formatDate, formatTime, averageOf } from '../../foundation/helpers';

export function MentorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const sessions = useMemo(() => user ? getSessionsByUser(user.id) : [], [user]);
  const reviews = useMemo(() => user ? getReviewsByMentor(user.id) : [], [user]);
  const expertise = useMemo(() => user ? getExpertiseByMentor(user.id) : [], [user]);
  const availability = useMemo(() => user ? getAvailabilityByMentor(user.id) : [], [user]);

  const upcomingSessions = sessions.filter(s => s.status === 'accepted' && new Date(s.date) >= new Date());
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const avgRating = reviews.length > 0 ? averageOf(reviews.map(r => r.overallRating)) : 0;
  const uniqueMentees = new Set(sessions.map(s => s.menteeId)).size;

  // Chart data: weekly teaching metrics derived truthfully from real reviews
  const performanceData = useMemo(() => [
    { metric: 'Overall', score: avgRating ? Number(avgRating.toFixed(1)) : 0 },
    { metric: 'Teaching', score: reviews.length > 0 ? Number(averageOf(reviews.map(r => r.teachingQuality)).toFixed(1)) : 0 },
    { metric: 'Communication', score: reviews.length > 0 ? Number(averageOf(reviews.map(r => r.communication)).toFixed(1)) : 0 },
    { metric: 'Knowledge', score: reviews.length > 0 ? Number(averageOf(reviews.map(r => r.subjectKnowledge)).toFixed(1)) : 0 },
  ], [avgRating, reviews]);

  const activityData = useMemo(() => {
    const now = new Date();
    const periods = [
      { label: 'W-3', daysAgoStart: 28, daysAgoEnd: 21 },
      { label: 'W-2', daysAgoStart: 21, daysAgoEnd: 14 },
      { label: 'W-1', daysAgoStart: 14, daysAgoEnd: 7 },
      { label: 'This Wk', daysAgoStart: 7, daysAgoEnd: 0 },
    ];
    return periods.map(p => {
      const start = new Date(now.getTime() - p.daysAgoStart * 86400000);
      const end = new Date(now.getTime() - p.daysAgoEnd * 86400000);
      const count = sessions.filter(s => {
        const d = new Date(s.date);
        return d >= start && d <= end;
      }).length;
      return {
        period: p.label,
        sessions: count,
        hours: Number((count * 1.0).toFixed(1)),
      };
    });
  }, [sessions]);

  if (!user) return null;

  const statCards = [
    { icon: Calendar, label: 'Upcoming', value: upcomingSessions.length, color: 'text-violet-600 bg-violet-50' },
    { icon: CheckCircle, label: 'Completed', value: completedCount, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Star, label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : 'N/A', color: 'text-amber-600 bg-amber-50' },
    { icon: Users, label: 'Students Helped', value: uniqueMentees, color: 'text-blue-600 bg-blue-50' },
  ];

  // Profile completeness
  const profileSteps = [
    { label: 'Basic Info', done: true },
    { label: 'Expertise Added', done: expertise.length > 0 },
    { label: 'Availability Set', done: availability.length > 0 },
    { label: 'First Session', done: completedCount > 0 },
    { label: 'First Review', done: reviews.length > 0 },
  ];
  const completionPct = Math.round((profileSteps.filter(s => s.done).length / profileSteps.length) * 100);

  const displayName = (typeof user?.fullName === 'string' && user.fullName.trim())
    ? user.fullName
    : (typeof user?.email === 'string' && user.email.trim())
      ? user.email
      : 'Mentor';
  const firstName = displayName.split(' ')[0] || 'Mentor';

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName}! 🎓</h1>
        <p className="text-slate-500 mt-1">Here's your mentoring activity overview and analytics.</p>
      </div>

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

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" /> Session Activity Trends
            </h3>
            <span className="text-xs text-slate-400">Past 5 Weeks</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Teaching Competency Scores
            </h3>
            <span className="text-xs text-slate-400">Scale: 1 – 5</span>
          </div>
          {reviews.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Star className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No Review Telemetry Yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Ratings and competency bars update automatically as mentees submit verified reviews.</p>
            </div>
          ) : (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Requests */}
          {pendingSessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Session Requests</h2>
                <Badge variant="warning">{pendingSessions.length} pending</Badge>
              </div>
              <div className="space-y-3">
                {pendingSessions.map(session => {
                  const mentee = getUserById(session.menteeId);
                  return (
                    <Card key={session.id} hover onClick={() => navigate('/mentor/sessions')}>
                      <div className="flex items-center gap-4">
                        <Avatar name={mentee?.fullName || 'Unknown'} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{session.topic}</p>
                          <p className="text-sm text-slate-500">{mentee?.fullName} · {mentee?.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{formatDate(session.date)}</p>
                          <p className="text-xs text-slate-500">{formatTime(session.startTime)}</p>
                        </div>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/mentor/sessions')} rightIcon={<ArrowRight className="w-4 h-4" />}>All Sessions</Button>
            </div>
            {upcomingSessions.length === 0 ? (
              <Card><EmptyState title="No upcoming sessions" description="Waiting for session requests from students." /></Card>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map(session => {
                  const mentee = getUserById(session.menteeId);
                  return (
                    <Card key={session.id}>
                      <div className="flex items-center gap-4">
                        <Avatar name={mentee?.fullName || 'Unknown'} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{session.topic}</p>
                          <p className="text-sm text-slate-500">{mentee?.fullName}</p>
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
          </div>

          {/* Recent Reviews */}
          {reviews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Recent Feedback</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/mentor/reviews')} rightIcon={<ArrowRight className="w-4 h-4" />}>All Reviews</Button>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 2).map(review => {
                  const mentee = getUserById(review.menteeId);
                  return (
                    <Card key={review.id}>
                      <div className="flex items-start gap-3">
                        <Avatar name={mentee?.fullName || 'Student'} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-900">{mentee?.fullName}</span>
                            <StarRating rating={review.overallRating} size="sm" />
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{review.review}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Profile Completion */}
          <h2 className="text-lg font-semibold text-slate-900">Profile Completion</h2>
          <Card>
            <div className="text-center mb-4">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7c3aed" strokeWidth="3"
                    strokeDasharray={`${completionPct}, 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">{completionPct}%</span>
              </div>
            </div>
            <div className="space-y-2">
              {profileSteps.map(step => (
                <div key={step.label} className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`w-4 h-4 ${step.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={step.done ? 'text-slate-700' : 'text-slate-400'}>{step.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Expertise */}
          <h2 className="text-lg font-semibold text-slate-900">Your Expertise</h2>
          <Card>
            {expertise.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Add your areas of expertise</p>
            ) : (
              <div className="space-y-3">
                {expertise.map(e => (
                  <div key={e.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{e.topic}</p>
                      <p className="text-xs text-slate-500">{e.yearsOfExperience}yr exp</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-5 rounded-sm ${i <= e.proficiencyLevel ? 'bg-violet-500' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Availability */}
          <h2 className="text-lg font-semibold text-slate-900">Available Slots</h2>
          <Card>
            {availability.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Set your availability</p>
            ) : (
              <div className="space-y-2">
                {availability.slice(0, 5).map(slot => (
                  <div key={slot.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 capitalize">{slot.dayOfWeek}</span>
                    <span className="text-slate-500">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                  </div>
                ))}
                {availability.length > 5 && <p className="text-xs text-slate-400 text-center">+{availability.length - 5} more</p>}
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/mentor/availability')}>
              Manage Availability
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
