import { Check } from 'lucide-react';
import type { Allergen } from '../types';
import Tag from './ui/Tag';

interface AllergenFilterProps {
  selectedAllergens: Allergen[];
  availableAllergens: Allergen[];
  allergenCounts: Record<Allergen, number>;
  onAllergenToggle: (allergen: Allergen) => void;
}

const allergenOptions: { value: Allergen; label: string }[] = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'corn', label: 'Corn' },
  { value: 'nightshade', label: 'Nightshade' },
  { value: 'citrus', label: 'Citrus' }
];

export default function AllergenFilter({
  selectedAllergens,
  availableAllergens,
  allergenCounts,
  onAllergenToggle
}: AllergenFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {allergenOptions.map(({ value, label }) => {
        const isAvailable = availableAllergens.includes(value);
        const isSelected = selectedAllergens.includes(value);
        const count = allergenCounts[value] || 0;

        return (
          <button
            key={value}
            onClick={() => isAvailable && onAllergenToggle(value)}
            disabled={!isAvailable}
            className={`group focus:outline-none ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Tag
              type="allergen"
              variant={value}
              selected={isSelected}
              className="flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              {isSelected && (
                <Check className="w-3 h-3" />
              )}
              <span>{label}-Free</span>
              <span className="ml-1 text-xs opacity-75">({count})</span>
            </Tag>
          </button>
        );
      })}
    </div>
  );
}