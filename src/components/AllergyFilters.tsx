import React, { useState, useEffect } from 'react';
import { DietaryRestriction } from '../types';

// Define the allergy filter types based on actual dietary restrictions
const ALLERGY_FILTERS = [
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'nut-free', label: 'Nut-Free' },
  { id: 'soy-free', label: 'Soy-Free' },
  { id: 'corn-free', label: 'Corn-Free' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' }
] as const;

interface AllergyFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

export default function AllergyFilters({ onFilterChange }: AllergyFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
    const saved = localStorage.getItem('allergyFilters');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('allergyFilters', JSON.stringify(selectedFilters));
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="flex flex-wrap justify-center gap-2">
        {ALLERGY_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => toggleFilter(id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
              selectedFilters.includes(id)
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {selectedFilters.length > 0 && (
        <button
          onClick={clearAllFilters}
          className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
} 