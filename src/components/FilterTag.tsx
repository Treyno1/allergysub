import React from 'react';
import { Check } from 'lucide-react';
import { FilterOption, FilterType } from '../types/filters';

interface FilterTagProps {
  filter: FilterOption;
  isSelected: boolean;
  count: number;
  onClick: () => void;
  type: FilterType;
}

const filterStyles: Record<FilterType, { base: string; selected: string }> = {
  allergen: {
    base: 'bg-red-50 text-red-700 hover:bg-red-100',
    selected: 'bg-red-100 ring-2 ring-red-500 ring-offset-1'
  },
  usage: {
    base: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    selected: 'bg-blue-100 ring-2 ring-blue-500 ring-offset-1'
  },
  dietary: {
    base: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    selected: 'bg-emerald-100 ring-2 ring-emerald-500 ring-offset-1'
  },
  alternative: {
    base: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    selected: 'bg-purple-100 ring-2 ring-purple-500 ring-offset-1'
  }
};

export default function FilterTag({
  filter,
  isSelected,
  count,
  onClick,
  type
}: FilterTagProps) {
  const styles = filterStyles[type];

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
        transition-all duration-200 ease-in-out
        ${styles.base}
        ${isSelected ? styles.selected : 'hover:ring-1 hover:ring-offset-1'}
        ${count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      disabled={count === 0}
    >
      {isSelected && <Check className="w-3.5 h-3.5" />}
      <span>{filter.label}</span>
      <span className="text-xs opacity-75">({count})</span>
    </button>
  );
}