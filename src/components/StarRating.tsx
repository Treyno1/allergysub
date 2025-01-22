import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function StarRating({ 
  rating, 
  onRate, 
  size = 'md',
  readonly = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          type="button"
          disabled={readonly}
        >
          <Star
            className={`
              ${sizeClasses[size]}
              ${(hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'}
              transition-colors
              ${!readonly && 'hover:text-yellow-400'}
            `}
          />
        </button>
      ))}
    </div>
  );
}