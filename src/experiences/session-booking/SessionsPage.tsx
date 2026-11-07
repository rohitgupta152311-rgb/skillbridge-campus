import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, Filter, Video, PhoneCall, MessageSquare, Download, Star } from 'lucide-react';
import { Card, Avatar, Badge, Button, EmptyState, Modal, Input } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getUserById } from '../../infrastructure/local-storage/data-service';
import { formatDate, formatTime } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import { apiClient } from '../../infrastructure/api/api-client';
import { TutoringCallModal } from './TutoringCallModal';
import type { SessionStatus } from '../../foundation/types';

const statusConfig: Record<SessionStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'error' },
  completed: { label: 'Completed', variant: 'info' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function SessionsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'pending' | 'completed'>('all');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [rescheduleModal, setRescheduleModal] = useState<{
    sessionId: string;
    date: string;
    startTime: string;
  } | null>(null);

  const [reviewModal, setReviewModal] = useState<{
    sessionId: string;
    rating: number;
    comment: string;
  } | null>(null);

  const [activeCall, setActiveCall] = useState<{
    session: any;
    partner: any;
    mode: 'video' | 'voice';
  } | null>(null);

  useEffect(() => {
    loadSessions();
  }, [user]);

  async function loadSessions() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient.getUserSessions();
      setSessions(data || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenMessage = async (partnerId: string) => {
    if (!user) return;
    try {
      const conv = await apiClient.startConversation(partnerId);
      if (conv && conv.id) {
        navigate(`/messages/${conv.id}`);
        return;
      }
    } catch {
      // ignore
    }
    navigate('/messages');
  };

  const handleStartTutoringCall = (session: any, partner: any, mode: 'video' | 'voice') => {
    setActiveCall({ session, partner, mode });
  };

  const filtered = useMemo(() => {
    if (filter === 'upcoming') return sessions.filter(s => (s.status === 'accepted' || s.status === 'ACCEPTED') && new Date(s.date) >= new Date());
    if (filter === 'pending') return sessions.filter(s => s.status.toLowerCase() === 'pending');
    if (filter === 'completed') return sessions.filter(s => s.status.toLowerCase() === 'completed');
    return sessions;
  }, [sessions, filter]);

  const isMentor = user?.role === 'mentor';

  const handleAccept = async (sessionId: string) => {
    try {
      await apiClient.updateSessionStatus(sessionId, 'ACCEPTED');
      addToast({ type: 'success', title: 'Session accepted' });
      await loadSessions();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to accept session', message: err.message });
    }
  };

  const handleReject = async (sessionId: string) => {
    try {
      await apiClient.updateSessionStatus(sessionId, 'REJECTED');
      addToast({ type: 'info', title: 'Session declined' });
      await loadSessions();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to decline session', message: err.message });
    }
  };

  const handleCancel = async () => {
    if (!cancelModal || !user) return;
    try {
      await apiClient.updateSessionStatus(cancelModal, 'CANCELLED', cancelReason);
      addToast({ type: 'info', title: 'Session cancelled' });
      setCancelModal(null);
      setCancelReason('');
      await loadSessions();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to cancel session', message: err.message });
    }
  };

  const handleComplete = async (sessionId: string) => {
    try {
      await apiClient.updateSessionStatus(sessionId, 'COMPLETED');
      addToast({ type: 'success', title: 'Session marked as completed' });
      await loadSessions();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to mark session complete', message: err.message });
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleModal) return;
    try {
      await apiClient.rescheduleSession(
        rescheduleModal.sessionId,
        rescheduleModal.date,
        rescheduleModal.startTime
      );
      addToast({ type: 'success', title: 'Session rescheduled successfully!' });
      setRescheduleModal(null);
      await loadSessions();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Conflict preventing reschedule',
        message: err.message || 'Mentor is unavailable or slot is occupied.',
      });
    }
  };

  const handleConfirmReview = async () => {
    if (!reviewModal) return;
    try {
      await apiClient.submitReview(reviewModal.sessionId, reviewModal.rating, reviewModal.comment);
      addToast({ type: 'success', title: 'Review submitted!' });
      setReviewModal(null);
      await loadSessions();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Could not submit review', message: err.message });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Sessions &amp; Tutoring</h1>
          <p className="text-slate-500 mt-1">Manage scheduled peer learning sessions, calendar invites, and live tutoring.</p>
        </div>
        {!isMentor && (
          <Button onClick={() => navigate('/discover')} size="sm" className="bg-slate-900 text-white font-bold">
            Find Mentors
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'pending', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({sessions.filter(s => {
              const st = (s.status || '').toLowerCase();
              if (f === 'all') return true;
              if (f === 'upcoming') return st === 'accepted' && new Date(s.date) >= new Date();
              if (f === 'pending') return st === 'pending';
              if (f === 'completed') return st === 'completed';
              return false;
            }).length})
          </button>
        ))}
      </div>

      {/* Session List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No sessions found"
          description={filter === 'all' ? 'Book your first peer tutoring session from the directory!' : `No ${filter} sessions.`}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(session => {
            const other = getUserById(isMentor ? session.menteeId : session.mentorId);
            const statusKey = (session.status || 'pending').toLowerCase() as SessionStatus;
            const sc = statusConfig[statusKey] || statusConfig.pending;
            const isUpcoming = (statusKey === 'accepted') && new Date(session.date) >= new Date();
            const canReview = !isMentor && statusKey === 'completed';

            return (
              <Card key={session.id}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar name={other?.fullName || 'Campus Peer'} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{session.topic}</p>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                      <Badge variant={(session.sessionType || '').toLowerCase() === 'online' ? 'info' : 'success'}>
                        {session.sessionType || 'Online'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isMentor ? 'Student' : 'Mentor'}: <span className="font-semibold text-slate-700">{other?.fullName || 'Campus Member'}</span>
                    </p>
                    {session.description && <p className="text-xs text-slate-600 mt-1 line-clamp-1">{session.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-bold text-slate-900">{formatDate(session.date)}</p>
                    <p className="text-[11px] text-slate-500">{formatTime(session.startTime)} &bull; {session.duration}m</p>
                  </div>
                </div>

                {/* Actions & Live Tutoring Channels */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  {/* Video Call */}
                  <Button
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-xs"
                    onClick={() => handleStartTutoringCall(session, other, 'video')}
                    leftIcon={<Video className="w-3.5 h-3.5" />}
                  >
                    Video Call
                  </Button>

                  {/* Voice Call */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl gap-1.5"
                    onClick={() => handleStartTutoringCall(session, other, 'voice')}
                    leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
                  >
                    Voice Call
                  </Button>

                  {/* Message */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl gap-1.5"
                    onClick={() => other?.id && handleOpenMessage(other.id)}
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                  >
                    Message
                  </Button>

                  {/* ICS Download */}
                  <a
                    href={apiClient.getSessionIcsUrl(session.id)}
                    download={`session-${session.id}.ics`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                    title="Download iCalendar invite (.ics)"
                  >
                    <Calendar className="w-3.5 h-3.5 text-violet-600" />
                    <span>.ICS Invite</span>
                  </a>

                  {isMentor && statusKey === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleAccept(session.id)} leftIcon={<CheckCircle className="w-4 h-4" />}>
                        Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(session.id)} leftIcon={<XCircle className="w-4 h-4" />}>
                        Decline
                      </Button>
                    </>
                  )}

                  {isUpcoming && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRescheduleModal({ sessionId: session.id, date: session.date, startTime: session.startTime })}
                        className="text-xs font-semibold border-slate-300"
                      >
                        Reschedule
                      </Button>
                      {isMentor && (
                        <Button size="sm" variant="secondary" onClick={() => handleComplete(session.id)}>
                          Mark Completed
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setCancelModal(session.id)} className="text-xs text-rose-600 hover:bg-rose-50">
                        Cancel
                      </Button>
                    </>
                  )}

                  {canReview && (
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl gap-1"
                      onClick={() => setReviewModal({ sessionId: session.id, rating: 5, comment: '' })}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Leave Review</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Session">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to cancel this session? This action cannot be undone.</p>
          <textarea
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs focus:ring-2 focus:ring-violet-500"
            placeholder="Reason for cancellation (e.g. Lab conflict)..."
            rows={3}
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setCancelModal(null)}>Keep Session</Button>
            <Button variant="danger" onClick={handleCancel}>Cancel Session</Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={!!rescheduleModal} onClose={() => setRescheduleModal(null)} title="Reschedule Session">
        {rescheduleModal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Pick a new date and time for this tutoring session.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Date</label>
                <Input
                  type="date"
                  value={rescheduleModal.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Start Time</label>
                <Input
                  type="time"
                  value={rescheduleModal.startTime}
                  onChange={e => setRescheduleModal({ ...rescheduleModal, startTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setRescheduleModal(null)}>Dismiss</Button>
              <Button size="sm" className="bg-slate-900 text-white font-bold" onClick={handleConfirmReschedule}>
                Confirm Reschedule
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title="Rate Your Tutoring Session">
        {reviewModal && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${
                      reviewModal.rating >= star
                        ? 'bg-amber-100 border-amber-300 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Review &amp; Feedback</label>
              <textarea
                rows={3}
                placeholder="What did you learn? How was your peer's explanation?"
                value={reviewModal.comment}
                onChange={e => setReviewModal({ ...reviewModal, comment: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setReviewModal(null)}>Cancel</Button>
              <Button size="sm" className="bg-emerald-600 text-white font-bold" onClick={handleConfirmReview}>
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Live Tutoring Video & Voice Call Modal */}
      {activeCall && (
        <TutoringCallModal
          isOpen={!!activeCall}
          onClose={() => setActiveCall(null)}
          partner={activeCall.partner || { id: 'partner', fullName: 'Tutoring Peer' }}
          topic={activeCall.session?.topic || 'Tutoring Session'}
          initialMode={activeCall.mode}
          sessionId={activeCall.session?.id}
          onCompleteSession={(id) => handleComplete(id)}
        />
      )}
    </div>
  );
}
