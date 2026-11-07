import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Video, CheckCircle } from 'lucide-react';
import { Card, Button, Input, Textarea, Avatar, Badge } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getUserById, getAvailabilityByMentor, getExpertiseByMentor, addSession, getSessionsByUser, addNotification } from '../../infrastructure/local-storage/data-service';
import { formatTime, getDayName, isTimeSlotOverlapping } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import { apiClient } from '../../infrastructure/api/api-client';
import { ALL_TOPICS } from '../../foundation/constants';
import type { SessionType, DayOfWeek } from '../../foundation/types';

export function SessionBookingPage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const mentor = useMemo(() => mentorId ? getUserById(mentorId) : null, [mentorId]);
  const availability = useMemo(() => mentorId ? getAvailabilityByMentor(mentorId) : [], [mentorId]);
  const expertise = useMemo(() => mentorId ? getExpertiseByMentor(mentorId) : [], [mentorId]);

  const [form, setForm] = useState({ topic: expertise[0]?.topic || '', description: '', date: '', startTime: '', duration: 60, sessionType: 'online' as SessionType, location: '', meetingLink: '' });
  const [booked, setBooked] = useState(false);

  if (!mentor || !user) return null;

  const selectedDayOfWeek = form.date ? new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek : null;
  const daySlots = selectedDayOfWeek ? availability.filter(a => a.dayOfWeek === selectedDayOfWeek) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic || !form.date || !form.startTime) {
      addToast({ type: 'error', title: 'Missing fields', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      await apiClient.bookSession({
        mentorId: mentor.id,
        topic: form.topic,
        description: form.description,
        sessionDate: form.date,
        startTime: form.startTime,
        duration: form.duration,
        sessionType: form.sessionType === 'online' ? 'ONLINE' : 'IN_PERSON',
        location: form.location || undefined,
        meetingLink: form.meetingLink || undefined,
      });

      addNotification({
        userId: mentor.id,
        type: 'session_request',
        title: 'New Session Request',
        message: `${user.fullName} requested a ${form.topic} session on ${form.date}.`,
        relatedId: mentor.id,
      });

      setBooked(true);
      addToast({
        type: 'success',
        title: 'Session requested!',
        message: `Your request has been sent to ${mentor.fullName}.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Could not book session',
        message: err.message || 'Selected time slot may conflict with an existing session.',
      });
    }
  };

  if (booked) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Requested!</h2>
        <p className="text-slate-500 mb-6">Your tutoring session request has been sent to {mentor.fullName}. You'll be notified once they respond.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate('/sessions')}>View My Sessions</Button>
          <Button variant="outline" onClick={() => navigate('/discover')}>Find More Mentors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Book a Session</h1>
        <p className="text-slate-500 mt-1">Schedule a tutoring session with {mentor.fullName}</p>
      </div>

      {/* Mentor info */}
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={mentor.fullName} size="md" />
          <div>
            <p className="font-semibold text-slate-900">{mentor.fullName}</p>
            <p className="text-sm text-slate-500">{mentor.department} · {mentor.year}</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic *</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}>
                <option value="">Select a topic</option>
                {expertise.map(e => <option key={e.id} value={e.topic}>{e.topic}</option>)}
                <optgroup label="Other Topics">
                  {ALL_TOPICS.filter(t => !expertise.some(e => e.topic === t)).map(t => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              </select>
            </div>
            <Textarea label="Description" placeholder="Describe what you'd like to cover in this session..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date *" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
              <Input label="Start Time *" type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>

            {selectedDayOfWeek && daySlots.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-700">
                <p className="font-medium mb-1">Available on {getDayName(selectedDayOfWeek)}:</p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map(s => (
                    <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, startTime: s.startTime }))}
                      className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-xs font-medium transition-colors">
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selectedDayOfWeek && daySlots.length === 0 && (
              <div className="p-3 rounded-lg bg-amber-50 text-sm text-amber-700">
                ⚠️ {mentor.fullName} hasn't set availability for {getDayName(selectedDayOfWeek)}. They may still accept your request.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Session Type</label>
                <div className="flex gap-2">
                  {(['online', 'in-person'] as SessionType[]).map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, sessionType: t }))}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${form.sessionType === t ? 'bg-violet-50 border-violet-300 text-violet-700' : 'border-slate-200 text-slate-500 hover:border-violet-200'}`}>
                      {t === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      {t === 'online' ? 'Online' : 'In-Person'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {form.sessionType === 'in-person' && (
              <Input label="Location" placeholder="e.g., Library Room 204" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} leftIcon={<MapPin className="w-4 h-4" />} />
            )}

            <Button type="submit" className="w-full" size="lg" leftIcon={<Calendar className="w-5 h-5" />}>Request Session</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = (time && typeof time === 'string' && time.includes(':') ? time : '10:00').split(':').map(Number);
  const total = (h || 0) * 60 + (m || 0) + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
