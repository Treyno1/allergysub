import React from 'react';
import { cn } from '../../utils/cn';

interface TagProps {
  type: 'ingredient' | 'allergen' | 'dietary';
  variant?: string;
  selected?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ 
  type, 
  variant,
  selected, 
  children, 
  className 
}: TagProps) {
  const getVariantStyles = () => {
    if (type === 'allergen') {
      switch (variant) {
        case 'dairy':
          return 'bg-blue-50 text-blue-700';
        case 'eggs':
          return 'bg-yellow-50 text-yellow-700';
        case 'nuts':
          return 'bg-amber-50 text-amber-700';
        case 'gluten':
          return 'bg-orange-50 text-orange-700';
        case 'soy':
          return 'bg-emerald-50 text-emerald-700';
        case 'fish':
          return 'bg-cyan-50 text-cyan-700';
        case 'shellfish':
          return 'bg-indigo-50 text-indigo-700';
        case 'corn':
          return 'bg-yellow-50 text-yellow-700';
        case 'nightshade':
          return 'bg-red-50 text-red-700';
        case 'citrus':
          return 'bg-orange-50 text-orange-700';
        default:
          return 'bg-emerald-50 text-emerald-700';
      }
    }
    return type === 'dietary' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium transition-colors',
        selected
          ? 'ring-2 ring-offset-1 ring-emerald-500'
          : 'hover:ring-1 hover:ring-offset-1 hover:ring-gray-300',
        getVariantStyles(),
        className
      )}
    >
      {children}
    </span>
  );
}