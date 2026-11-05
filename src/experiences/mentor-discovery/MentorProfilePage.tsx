import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageSquare, MapPin, Globe, Clock, BookOpen, Award } from 'lucide-react';
import { Avatar, Badge, Button, Card, StarRating, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { buildMentorProfile } from '../../domain/matching-engine';
import { getUserById, getReviewsByMentor, getSessionsByUser, getOrCreateConversation } from '../../infrastructure/local-storage/data-service';
import { formatDate, formatTime, getDayName, getRatingColor, averageOf } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';

export function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [showBooking, setShowBooking] = useState(false);

  const mentor = useMemo(() => {
    if (!mentorId) return null;
    const u = getUserById(mentorId);
    if (!u || u.role !== 'mentor') return null;
    return buildMentorProfile(u);
  }, [mentorId]);

  const reviews = useMemo(() => mentorId ? getReviewsByMentor(mentorId) : [], [mentorId]);
  const ratingDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { dist[r.overallRating] = (dist[r.overallRating] || 0) + 1; });
    return dist;
  }, [reviews]);

  if (!mentor) return <EmptyState title="Mentor not found" description="This mentor profile doesn't exist." action={<Button onClick={() => navigate('/discover')}>Back to Discovery</Button>} />;

  const handleMessage = () => {
    if (!user) return navigate('/login');
    const conv = getOrCreateConversation(user.id, mentor.id);
    navigate(`/messages/${conv.id}`);
  };

  const handleBookSession = () => {
    if (!user) return navigate('/login');
    navigate(`/book/${mentor.id}`);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Profile Header */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={mentor.fullName} size="xl" showStatus status={mentor.onlineStatus} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{mentor.fullName}</h1>
              {mentor.isVerified && <Badge variant="success">Verified</Badge>}
            </div>
            <p className="text-slate-500">{mentor.department} · {mentor.year}</p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{mentor.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {mentor.languages.map(l => (
                <span key={l} className="flex items-center gap-1 text-xs text-slate-500"><Globe className="w-3 h-3" />{l}</span>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleBookSession} leftIcon={<Calendar className="w-4 h-4" />}>Book Session</Button>
              <Button variant="outline" onClick={handleMessage} leftIcon={<MessageSquare className="w-4 h-4" />}>Message</Button>
            </div>
          </div>
          <div className="flex sm:flex-col gap-4 sm:gap-3 text-center">
            <div className="px-4 py-2 rounded-xl bg-violet-50">
              <p className="text-2xl font-bold text-violet-700">{mentor.averageRating || '—'}</p>
              <p className="text-xs text-violet-600">Rating</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-blue-50">
              <p className="text-2xl font-bold text-blue-700">{mentor.completedSessions}</p>
              <p className="text-xs text-blue-600">Sessions</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-700">{mentor.totalReviews}</p>
              <p className="text-xs text-emerald-600">Reviews</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Expertise */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-violet-600" /> Expertise</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mentor.expertise.map(e => (
                <div key={e.id} className="p-3 rounded-lg border border-slate-100 hover:border-violet-200 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900">{e.topic}</span>
                    <Badge variant={e.category === 'technical' ? 'info' : 'violet'}>{e.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{e.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <div key={i} className={`w-6 h-1.5 rounded-full ${i <= e.proficiencyLevel ? 'bg-violet-500' : 'bg-slate-200'}`} />)}</div>
                    <span className="text-xs text-slate-400">{e.yearsOfExperience}yr</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {/* Rating Distribution */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl mb-4">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${getRatingColor(mentor.averageRating)}`}>{mentor.averageRating}</p>
                    <StarRating rating={mentor.averageRating} size="sm" />
                    <p className="text-xs text-slate-500 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(n => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-3">{n}</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${reviews.length > 0 ? (ratingDist[n] / reviews.length) * 100 : 0}%` }} /></div>
                        <span className="text-xs text-slate-400 w-5">{ratingDist[n]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {reviews.map(review => {
                  const mentee = getUserById(review.menteeId);
                  return (
                    <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar name={mentee?.fullName || 'Student'} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{mentee?.fullName}</p>
                          <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <StarRating rating={review.overallRating} size="sm" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.review}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        <span>Teaching: {review.teachingQuality}/5</span>
                        <span>Communication: {review.communication}/5</span>
                        <span>Knowledge: {review.subjectKnowledge}/5</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Availability */}
        <div>
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Availability</h2>
            {mentor.availability.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No availability set.</p>
            ) : (
              <div className="space-y-2">
                {mentor.availability.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <span className="text-sm font-medium text-slate-700 capitalize">{getDayName(slot.dayOfWeek)}</span>
                    <span className="text-sm text-slate-500">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button className="w-full mt-4" onClick={handleBookSession}>Request a Session</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
