import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { Card, Button, Textarea, StarRating, Avatar } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getSessionById, getUserById, getReviewBySession, addReview, addNotification } from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';

export function FeedbackPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const session = useMemo(() => sessionId ? getSessionById(sessionId) : null, [sessionId]);
  const existingReview = useMemo(() => sessionId ? getReviewBySession(sessionId) : null, [sessionId]);
  const mentor = useMemo(() => session ? getUserById(session.mentorId) : null, [session]);

  const [ratings, setRatings] = useState({ overall: 0, teaching: 0, communication: 0, knowledge: 0 });
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!session || !user || !mentor) return null;

  if (session.status !== 'completed') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <p className="text-slate-500">Reviews can only be submitted for completed sessions.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center animate-fade-in">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Review Already Submitted</h2>
        <p className="text-slate-500 mb-4">You've already reviewed this session.</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <StarRating rating={existingReview.overallRating} />
          <span className="text-lg font-bold text-slate-900">{existingReview.overallRating}/5</span>
        </div>
        <Card padding="lg" className="text-left">
          <p className="text-sm text-slate-600 italic">"{existingReview.review}"</p>
        </Card>
        <Button variant="outline" onClick={() => navigate('/sessions')} className="mt-6">Back to Sessions</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-500 mb-6">Your feedback helps other students find great mentors.</p>
        <Button onClick={() => navigate('/sessions')}>Back to Sessions</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratings.overall === 0) { addToast({ type: 'error', title: 'Please provide an overall rating' }); return; }
    addReview({ sessionId: session.id, mentorId: session.mentorId, menteeId: user.id, overallRating: ratings.overall, teachingQuality: ratings.teaching || ratings.overall, communication: ratings.communication || ratings.overall, subjectKnowledge: ratings.knowledge || ratings.overall, review });
    addNotification({ userId: session.mentorId, type: 'new_review', title: 'New Review', message: `${user.fullName} left a ${ratings.overall}-star review.`, relatedId: session.id });
    addToast({ type: 'success', title: 'Review submitted!' });
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leave a Review</h1>
        <p className="text-slate-500 mt-1">Share your experience with {mentor.fullName}</p>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={mentor.fullName} size="md" />
          <div>
            <p className="font-semibold text-slate-900">{mentor.fullName}</p>
            <p className="text-sm text-slate-500">{session.topic} · {session.date}</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-6">
            {[
              { key: 'overall', label: 'Overall Rating *' },
              { key: 'teaching', label: 'Teaching Quality' },
              { key: 'communication', label: 'Communication' },
              { key: 'knowledge', label: 'Subject Knowledge' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                <div className="flex items-center gap-3">
                  <StarRating rating={ratings[key as keyof typeof ratings]} size="lg" interactive onChange={v => setRatings(r => ({ ...r, [key]: v }))} />
                  <span className="text-sm text-slate-500">{ratings[key as keyof typeof ratings]}/5</span>
                </div>
              </div>
            ))}
            <Textarea label="Written Review" placeholder="Tell us about your experience. What did you learn? How was the teaching style?" value={review} onChange={e => setReview(e.target.value)} />
            <Button type="submit" className="w-full" size="lg" leftIcon={<Star className="w-5 h-5" />}>Submit Review</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
