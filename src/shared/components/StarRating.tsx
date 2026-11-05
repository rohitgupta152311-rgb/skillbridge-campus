import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4.5 h-4.5', lg: 'w-5.5 h-5.5' };

export function StarRating({ rating, maxRating = 5, size = 'md', interactive, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={clsx('transition-colors', interactive && 'cursor-pointer hover:scale-110', !interactive && 'cursor-default')}
          >
            <Star
              className={clsx(
                sizeMap[size],
                filled ? 'fill-amber-400 text-amber-400' : half ? 'fill-amber-200 text-amber-400' : 'fill-slate-100 text-slate-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
