import React from 'react';
import { Category } from '../types';
import { categoryInfo } from '../data/categories';
import { logComponentInit, logCategorySelection } from '../utils/logging';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
}

export default function CategoryFilter({ selectedCategories, onCategoryToggle }: CategoryFilterProps) {
  // Component initialization logging
  React.useEffect(() => {
    logComponentInit('CategoryFilter', {
      initialCategories: selectedCategories,
      totalCategories: Object.keys(categoryInfo).length
    });
  }, []);

  const handleCategoryToggle = (category: Category) => {
    const isSelected = !selectedCategories.includes(category);
    logCategorySelection('CategoryFilter', {
      category,
      isSelected,
      totalSelected: selectedCategories.length + (isSelected ? 1 : -1),
      categoryLabel: categoryInfo[category].label
    });
    onCategoryToggle(category);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(categoryInfo).map(([value, { label, icon: Icon }]) => (
        <button
          key={value}
          onClick={() => handleCategoryToggle(value as Category)}
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