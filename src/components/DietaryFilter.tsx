import React from 'react';
import { Check, Leaf, Heart, Wine, Coffee, Cookie } from 'lucide-react';
import { DietaryRestriction } from '../types';
import Tag from './ui/Tag';

interface DietaryFilterProps {
  selectedDiets: DietaryRestriction[];
  availableDiets: DietaryRestriction[];
  dietCounts: Record<DietaryRestriction, number>;
  onDietToggle: (diet: DietaryRestriction) => void;
}

const dietaryOptions: {
  value: DietaryRestriction;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'vegan', label: 'Vegan', icon: <Leaf className="w-3 h-3" /> },
  { value: 'vegetarian', label: 'Vegetarian', icon: <Heart className="w-3 h-3" /> },
  { value: 'alcohol-free', label: 'Alcohol-Free', icon: <Wine className="w-3 h-3" /> },
  { value: 'caffeine-free', label: 'Caffeine-Free', icon: <Coffee className="w-3 h-3" /> },
  { value: 'refined-sugar-free', label: 'Sugar-Free', icon: <Cookie className="w-3 h-3" /> }
];

export default function DietaryFilter({
  selectedDiets,
  availableDiets,
  dietCounts,
  onDietToggle
}: DietaryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {dietaryOptions.map(({ value, label, icon }) => {
        const isAvailable = availableDiets.includes(value);
        const count = dietCounts[value] || 0;

        return (
          <button
            key={value}
            onClick={() => isAvailable && onDietToggle(value)}
            disabled={!isAvailable}
            className={`group focus:outline-none ${!isAvailable && 'opacity-50 cursor-not-allowed'}`}
          >
            <Tag
              type="dietary"
              variant={value}
              className="flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              {selectedDiets.includes(value) ? <Check className="w-3 h-3" /> : icon}
              <span>{label}</span>
              <span className="ml-1 text-xs opacity-75">({count})</span>
            </Tag>
          </button>
        );
      })}
    </div>
  );
}