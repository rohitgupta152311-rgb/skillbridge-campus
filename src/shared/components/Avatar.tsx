import { getInitials, getAvatarColor } from '../../foundation/helpers';
import clsx from 'clsx';

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'available' | 'busy' | 'offline';
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusColors = {
  available: 'bg-emerald-400',
  busy: 'bg-amber-400',
  offline: 'bg-slate-300',
};

export function Avatar({ name, src, size = 'md', className, showStatus, status }: AvatarProps) {
  const safeName = (name && typeof name === 'string') ? name : 'User';
  const initials = getInitials(safeName);
  const color = getAvatarColor(safeName);

  return (
    <div className={clsx('relative inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0', sizes[size], className)}
      style={{ backgroundColor: src ? undefined : color }}
    >
      {src ? (
        <img src={src} alt={safeName} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      {showStatus && status && (
        <span className={clsx('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white', statusColors[status])} />
      )}
    </div>
  );
}
