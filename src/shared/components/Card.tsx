import clsx from 'clsx';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ children, className, padding = 'md', hover, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200/80 shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
