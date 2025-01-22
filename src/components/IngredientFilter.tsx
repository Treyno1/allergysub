import React from 'react';
import { Check } from 'lucide-react';
import Tag from './ui/Tag';

interface IngredientFilterProps {
  selectedIngredients: string[];
  ingredientCounts: Record<string, number>;
  onIngredientToggle: (ingredient: string) => void;
}

export default function IngredientFilter({
  selectedIngredients,
  ingredientCounts,
  onIngredientToggle
}: IngredientFilterProps) {
  const ingredients = Object.keys(ingredientCounts).sort();

  return (
    <div className="flex flex-wrap gap-2">
      {ingredients.map(ingredient => (
        <button
          key={ingredient}
          onClick={() => onIngredientToggle(ingredient)}
          className="focus:outline-none"
        >
          <Tag
            type="ingredient"
            selected={selectedIngredients.includes(ingredient)}
            className="flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            {selectedIngredients.includes(ingredient) && (
              <Check className="w-3 h-3" />
            )}
            <span>{ingredient}</span>
            <span className="ml-1 text-xs opacity-75">
              ({ingredientCounts[ingredient]})
            </span>
          </Tag>
        </button>
      ))}
    </div>
  );
}