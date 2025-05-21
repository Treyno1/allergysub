import React from 'react';
import IngredientCard from './IngredientCard';
import { Ingredient } from '../types';

interface IngredientGridProps {
  ingredients: Ingredient[];
  onFavoriteToggle: (ingredient: Ingredient, substitute: any) => void;
  isFavorite: (ingredientId: string, substituteId: string) => boolean;
}

export default function IngredientGrid({
  ingredients,
  onFavoriteToggle,
  isFavorite
}: IngredientGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ingredients.map(ingredient => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
          />
        ))}
      </div>
    </div>
  );
} 