import { useState, useMemo } from 'react';
import { Ingredient } from '../types';

export function useIngredientFilter(ingredients: Ingredient[]) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter ingredients based on search query
  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) return ingredients;

    const query = searchQuery.toLowerCase().trim();
    
    return ingredients.filter(ingredient => {
      // Check ingredient name
      if (ingredient.name.toLowerCase().includes(query)) return true;

      // Check substitutes
      return ingredient.substitutes.some(substitute => 
        // Check substitute name
        substitute.name.toLowerCase().includes(query) ||
        // Check usage tags
        substitute.usage.some(tag => tag.toLowerCase().includes(query)) ||
        // Check dietary restrictions
        substitute.safeFor.dietaryRestrictions.some(diet => 
          diet.toLowerCase().includes(query)
        ) ||
        // Check notes
        (substitute.notes && substitute.notes.toLowerCase().includes(query))
      );
    });
  }, [ingredients, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredIngredients
  };
}