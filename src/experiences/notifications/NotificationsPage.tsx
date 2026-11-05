import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Calendar, UserPlus, Star, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getNotificationsByUser, markAllNotificationsRead, markNotificationRead } from '../../infrastructure/local-storage/data-service';
import { formatRelativeTime } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [filter, setFilter] = useState<'all' | 'mentorship' | 'network'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const notifications = useMemo(() => {
    if (!user) return [];
    return getNotificationsByUser(user.id);
  }, [user, refreshKey]);

  const filtered = useMemo(() => {
    if (filter === 'mentorship') {
      return notifications.filter(n => n.type.includes('session') || n.type.includes('review'));
    }
    if (filter === 'network') {
      return notifications.filter(n => n.type.includes('connection') || n.type.includes('skill'));
    }
    return notifications;
  }, [notifications, filter]);

  const handleMarkAllRead = () => {
    if (!user) return;
    markAllNotificationsRead(user.id);
    setRefreshKey(k => k + 1);
    addToast({ type: 'success', title: 'All notifications marked as read' });
  };

  const handleNotificationClick = (id: string, linkUrl?: string) => {
    markNotificationRead(id);
    setRefreshKey(k => k + 1);
    if (linkUrl) {
      navigate(linkUrl);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('session')) return <Calendar className="w-4 h-4 text-violet-600" />;
    if (type.includes('connection')) return <UserPlus className="w-4 h-4 text-blue-600" />;
    if (type.includes('review') || type.includes('skill')) return <Star className="w-4 h-4 text-amber-500" />;
    if (type.includes('message')) return <MessageSquare className="w-4 h-4 text-emerald-600" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">Stay informed about session requests, peer connections, and campus activities.</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<CheckCheck className="w-4 h-4" />}
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'all', label: 'All Notifications' },
          { key: 'mentorship', label: 'Mentorship Sessions' },
          { key: 'network', label: 'Network & Skills' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab.key
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="No notifications" description="You are all caught up!" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <Card
              key={n.id}
              padding="md"
              hover
              onClick={() => handleNotificationClick(n.id, n.linkUrl || (n.type.includes('session') ? '/sessions' : undefined))}
              className={`border transition-all cursor-pointer ${
                n.isRead ? 'border-slate-200 bg-white' : 'border-violet-200 bg-violet-50/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${n.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600 flex-shrink-0 mt-1" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
