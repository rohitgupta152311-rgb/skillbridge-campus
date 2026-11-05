import { useMemo } from 'react';
import { Card, Avatar, StarRating, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getReviewsByMentor, getUserById } from '../../infrastructure/local-storage/data-service';
import { formatDate, averageOf, getRatingColor } from '../../foundation/helpers';

export function MentorReviewsPage() {
  const { user } = useAuthStore();
  const reviews = useMemo(() => user ? getReviewsByMentor(user.id) : [], [user]);
  const avgRating = reviews.length > 0 ? averageOf(reviews.map(r => r.overallRating)) : 0;
  const avgTeaching = reviews.length > 0 ? averageOf(reviews.map(r => r.teachingQuality)) : 0;
  const avgComm = reviews.length > 0 ? averageOf(reviews.map(r => r.communication)) : 0;
  const avgKnowledge = reviews.length > 0 ? averageOf(reviews.map(r => r.subjectKnowledge)) : 0;

  const ratingDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { dist[r.overallRating] = (dist[r.overallRating] || 0) + 1; });
    return dist;
  }, [reviews]);

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
        <p className="text-slate-500 mt-1">See what students say about your mentoring.</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Complete tutoring sessions to receive reviews from students." />
      ) : (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className={`text-4xl font-bold ${getRatingColor(avgRating)}`}>{avgRating.toFixed(1)}</p>
              <StarRating rating={avgRating} size="sm" />
              <p className="text-xs text-slate-500 mt-1">{reviews.length} total reviews</p>
            </Card>
            {[{ label: 'Teaching', val: avgTeaching }, { label: 'Communication', val: avgComm }, { label: 'Knowledge', val: avgKnowledge }].map(s => (
              <Card key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{s.val.toFixed(1)}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Distribution */}
          <Card padding="lg">
            <h3 className="font-semibold text-slate-900 mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-6">{n}★</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full"><div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${reviews.length > 0 ? (ratingDist[n] / reviews.length) * 100 : 0}%` }} /></div>
                  <span className="text-sm text-slate-500 w-6">{ratingDist[n]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Review list */}
          <div className="space-y-3">
            {reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => {
              const mentee = getUserById(review.menteeId);
              return (
                <Card key={review.id}>
                  <div className="flex items-start gap-3">
                    <Avatar name={mentee?.fullName || 'Student'} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{mentee?.fullName}</span>
                          <StarRating rating={review.overallRating} size="sm" />
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600">{review.review}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        <span>Teaching: {review.teachingQuality}/5</span>
                        <span>Communication: {review.communication}/5</span>
                        <span>Knowledge: {review.subjectKnowledge}/5</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
