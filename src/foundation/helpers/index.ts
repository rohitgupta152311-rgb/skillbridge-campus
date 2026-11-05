import { AVATAR_COLORS } from '../constants';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function averageOf(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getMatchScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent Match', color: 'text-emerald-600' };
  if (score >= 70) return { label: 'Great Match', color: 'text-blue-600' };
  if (score >= 55) return { label: 'Good Match', color: 'text-violet-600' };
  if (score >= 40) return { label: 'Fair Match', color: 'text-amber-600' };
  return { label: 'Low Match', color: 'text-gray-500' };
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-500';
  if (rating >= 3.5) return 'text-blue-500';
  if (rating >= 2.5) return 'text-amber-500';
  return 'text-red-500';
}

export function isTimeSlotOverlapping(
  slot1Start: string, slot1End: string,
  slot2Start: string, slot2End: string
): boolean {
  return slot1Start < slot2End && slot2Start < slot1End;
}

export function getDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}
