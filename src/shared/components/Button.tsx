import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-[#151e4e] text-white hover:bg-[#0f1638] shadow-sm font-semibold active:scale-[0.98] transition-all',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 font-semibold shadow-xs',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium',
  ghost: 'text-slate-600 hover:bg-slate-100/80 font-medium',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 font-semibold shadow-xs',
  accent: 'bg-amber-500 text-white hover:bg-amber-600 font-bold shadow-sm',
};

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl',
  md: 'px-4 py-2 text-xs sm:text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm sm:text-base rounded-xl font-bold',
};

export function Button({
  variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon,
  children, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#151e4e]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
