import { useState, useMemo } from 'react';
import { Ingredient } from '../types';
import { FilterOption, FilterType } from '../types/filters';

export function useFilters(ingredients: Ingredient[]) {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);

  const { availableFilters, filterCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    const alternativeSet = new Set<string>();

    ingredients.forEach(ingredient => {
      const alternativeId = normalizeAlternativeTag(ingredient.name);
      alternativeSet.add(ingredient.name);
      counts[alternativeId] = (counts[alternativeId] || 0) + ingredient.substitutes.length;
    });

    const alternativeFilters = Array.from(alternativeSet)
      .sort()
      .map(name => ({
        id: normalizeAlternativeTag(name),
        label: name,
        type: 'alternative' as FilterType
      }));

    return {
      availableFilters: {
        alternative: alternativeFilters
      },
      filterCounts: counts
    };
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    if (selectedFilters.length === 0) return ingredients;

    return ingredients.filter(ingredient => {
      return selectedFilters.some(filter => 
        filter.id === normalizeAlternativeTag(ingredient.name)
      );
    });
  }, [ingredients, selectedFilters]);

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilters(prev => {
      const exists = prev.some(f => f.id === filter.id);
      if (exists) {
        return prev.filter(f => f.id !== filter.id);
      }
      return [...prev, filter];
    });
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return {
    selectedFilters,
    availableFilters,
    filterCounts,
    filteredIngredients,
    handleFilterChange,
    clearFilters
  };
}

function normalizeAlternativeTag(ingredientName: string): string {
  return `alternative-for-${ingredientName.toLowerCase().replace(/\s+/g, '-')}`;
}