import { useState, useMemo } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Card, Button, Badge, EmptyState, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getAvailabilityByMentor, addTimeSlot, removeTimeSlot } from '../../infrastructure/local-storage/data-service';
import { formatTime, getDayName } from '../../foundation/helpers';
import { DAYS_OF_WEEK } from '../../foundation/constants';
import { useToastStore } from '../../shared/notifications/toast-store';
import type { DayOfWeek } from '../../foundation/types';

export function AvailabilityPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 'monday' as DayOfWeek, startTime: '09:00', endTime: '11:00' });

  const availability = useMemo(() => user ? getAvailabilityByMentor(user.id) : [], [user, refreshKey]);

  const groupedByDay = useMemo(() => {
    const groups: Record<string, typeof availability> = {};
    DAYS_OF_WEEK.forEach(d => { groups[d] = availability.filter(a => a.dayOfWeek === d); });
    return groups;
  }, [availability]);

  if (!user) return null;

  const handleAdd = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      addToast({ type: 'error', title: 'Invalid time', message: 'End time must be after start time.' });
      return;
    }
    addTimeSlot({ mentorId: user.id, dayOfWeek: newSlot.dayOfWeek, startTime: newSlot.startTime, endTime: newSlot.endTime, isRecurring: true });
    addToast({ type: 'success', title: 'Time slot added' });
    setShowAdd(false);
    setRefreshKey(k => k + 1);
  };

  const handleRemove = (id: string) => {
    removeTimeSlot(id);
    addToast({ type: 'info', title: 'Time slot removed' });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
          <p className="text-slate-500 mt-1">Set your weekly availability for tutoring sessions.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} leftIcon={<Plus className="w-4 h-4" />}>Add Slot</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS_OF_WEEK.map(day => (
          <Card key={day}>
            <h3 className="font-semibold text-slate-900 capitalize mb-3">{getDayName(day)}</h3>
            {groupedByDay[day].length === 0 ? (
              <p className="text-sm text-slate-400 py-3 text-center">No slots</p>
            ) : (
              <div className="space-y-2">
                {groupedByDay[day].map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-2.5 rounded-lg bg-violet-50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium text-violet-700">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                    </div>
                    <button onClick={() => handleRemove(slot.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Time Slot">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Day</label>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={newSlot.dayOfWeek} onChange={e => setNewSlot(s => ({ ...s, dayOfWeek: e.target.value as DayOfWeek }))}>
              {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
              <input type="time" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={newSlot.startTime} onChange={e => setNewSlot(s => ({ ...s, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
              <input type="time" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={newSlot.endTime} onChange={e => setNewSlot(s => ({ ...s, endTime: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Slot</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
