import React from 'react';
import { Category } from '../types';
import { categoryInfo } from '../data/categories';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
}

export default function CategoryFilter({ selectedCategories, onCategoryToggle }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(categoryInfo).map(([value, { label, icon: Icon }]) => (
        <button
          key={value}
          onClick={() => onCategoryToggle(value as Category)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            transition-colors duration-200 ease-in-out
            flex items-center gap-2
            ${
              selectedCategories.includes(value as Category)
                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}