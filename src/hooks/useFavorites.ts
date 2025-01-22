import { useState, useEffect } from 'react';
import { Ingredient, Substitute } from '../types';

export interface FavoriteItem {
  ingredientId: string;
  ingredientName: string;
  substituteId: string;
  substituteName: string;
  timestamp: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (ingredient: Ingredient, substitute: Substitute) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(
        f => f.ingredientId === ingredient.id && f.substituteId === substitute.id
      );

      if (existingIndex >= 0) {
        return prev.filter((_, i) => i !== existingIndex);
      }

      return [...prev, {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        substituteId: substitute.id,
        substituteName: substitute.name,
        timestamp: Date.now()
      }];
    });
  };

  const isFavorite = (ingredientId: string, substituteId: string) => {
    return favorites.some(
      f => f.ingredientId === ingredientId && f.substituteId === substituteId
    );
  };

  const removeFavorite = (ingredientId: string, substituteId: string) => {
    setFavorites(prev => 
      prev.filter(f => 
        !(f.ingredientId === ingredientId && f.substituteId === substituteId)
      )
    );
  };

  return {
    favorites,
    isOpen,
    setIsOpen,
    toggleFavorite,
    isFavorite,
    removeFavorite
  };
}