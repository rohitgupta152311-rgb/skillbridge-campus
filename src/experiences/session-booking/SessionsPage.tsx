import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, Filter, Video, PhoneCall, MessageSquare } from 'lucide-react';
import { Card, Avatar, Badge, Button, EmptyState, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getSessionsByUser, getUserById, updateSession, addNotification, getOrCreateConversation } from '../../infrastructure/local-storage/data-service';
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
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [activeCall, setActiveCall] = useState<{
    session: any;
    partner: any;
    mode: 'video' | 'voice';
  } | null>(null);

  const handleOpenMessage = async (partnerId: string) => {
    if (!user) return;
    try {
      const conv = await apiClient.startConversation(partnerId);
      if (conv && conv.id) {
        navigate(`/messages/${conv.id}`);
        return;
      }
    } catch {
      // fallback
    }
    const conv = getOrCreateConversation(user.id, partnerId);
    navigate(`/messages/${conv.id}`);
  };

  const handleStartTutoringCall = (session: any, partner: any, mode: 'video' | 'voice') => {
    setActiveCall({ session, partner, mode });
  };

  const sessions = useMemo(() => {
    if (!user) return [];
    return getSessionsByUser(user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user]);

  const filtered = useMemo(() => {
    if (filter === 'upcoming') return sessions.filter(s => s.status === 'accepted' && new Date(s.date) >= new Date());
    if (filter === 'pending') return sessions.filter(s => s.status === 'pending');
    if (filter === 'completed') return sessions.filter(s => s.status === 'completed');
    return sessions;
  }, [sessions, filter]);

  const isMentor = user?.role === 'mentor';

  const handleAccept = (sessionId: string) => {
    const session = updateSession(sessionId, { status: 'accepted' });
    if (session) {
      addNotification({ userId: session.menteeId, type: 'session_accepted', title: 'Session Accepted', message: `Your ${session.topic} session has been accepted!`, relatedId: sessionId });
      addToast({ type: 'success', title: 'Session accepted' });
    }
  };

  const handleReject = (sessionId: string) => {
    const session = updateSession(sessionId, { status: 'rejected' });
    if (session) {
      addNotification({ userId: session.menteeId, type: 'session_rejected', title: 'Session Declined', message: `Your ${session.topic} session request was declined.`, relatedId: sessionId });
      addToast({ type: 'info', title: 'Session declined' });
    }
  };

  const handleCancel = () => {
    if (!cancelModal || !user) return;
    updateSession(cancelModal, { status: 'cancelled', cancelledBy: user.id, cancellationReason: cancelReason });
    addToast({ type: 'info', title: 'Session cancelled' });
    setCancelModal(null);
    setCancelReason('');
  };

  const handleComplete = (sessionId: string) => {
    updateSession(sessionId, { status: 'completed' });
    addToast({ type: 'success', title: 'Session marked as completed' });
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Sessions</h1>
          <p className="text-slate-500 mt-1">Manage your tutoring sessions.</p>
        </div>
        {!isMentor && <Button onClick={() => navigate('/discover')} size="sm">Find Mentors</Button>}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'pending', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-violet-100 text-violet-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${sessions.filter(s => f === 'upcoming' ? s.status === 'accepted' && new Date(s.date) >= new Date() : f === 'pending' ? s.status === 'pending' : s.status === 'completed').length})`}
          </button>
        ))}
      </div>

      {/* Session List */}
      {filtered.length === 0 ? (
        <EmptyState title="No sessions found" description={filter === 'all' ? 'Book your first tutoring session!' : `No ${filter} sessions.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map(session => {
            const other = getUserById(isMentor ? session.menteeId : session.mentorId);
            const sc = statusConfig[session.status];
            const isUpcoming = session.status === 'accepted' && new Date(session.date) >= new Date();
            const canReview = !isMentor && session.status === 'completed';
            return (
              <Card key={session.id}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar name={other?.fullName || 'User'} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{session.topic}</p>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                      <Badge variant={session.sessionType === 'online' ? 'info' : 'success'}>{session.sessionType}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{isMentor ? 'Student' : 'Mentor'}: {other?.fullName}</p>
                    {session.description && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{session.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-medium text-slate-900">{formatDate(session.date)}</p>
                    <p className="text-xs text-slate-500">{formatTime(session.startTime)} · {session.duration}min</p>
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

                  {isMentor && session.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleAccept(session.id)} leftIcon={<CheckCircle className="w-4 h-4" />}>Accept</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(session.id)} leftIcon={<XCircle className="w-4 h-4" />}>Decline</Button>
                    </>
                  )}
                  {isUpcoming && (
                    <>
                      {isMentor && <Button size="sm" variant="secondary" onClick={() => handleComplete(session.id)}>Mark Completed</Button>}
                      <Button size="sm" variant="ghost" onClick={() => setCancelModal(session.id)}>Cancel</Button>
                    </>
                  )}
                  {canReview && <Button size="sm" variant="outline" onClick={() => navigate(`/review/${session.id}`)}>Leave Review</Button>}
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
          <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="Reason for cancellation (optional)..." rows={3}
            value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setCancelModal(null)}>Keep Session</Button>
            <Button variant="danger" onClick={handleCancel}>Cancel Session</Button>
          </div>
        </div>
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
