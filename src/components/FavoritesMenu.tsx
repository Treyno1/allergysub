import React from 'react';
import { X, Heart, ChevronRight, Trash2 } from 'lucide-react';
import { FavoriteItem } from '../hooks/useFavorites';

interface FavoritesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onRemove: (ingredientId: string, substituteId: string) => void;
}

export default function FavoritesMenu({
  isOpen,
  onClose,
  favorites,
  onRemove
}: FavoritesMenuProps) {
  return (
    <div
      className={`
        fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        z-50
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-lg font-semibold text-gray-900">Saved Items</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No saved items yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click the heart icon on any substitute to save it
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={`${favorite.ingredientId}-${favorite.substituteId}`}
                className="bg-gray-50 rounded-lg p-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {favorite.substituteName}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      Alternative for
                      <ChevronRight className="w-3 h-3" />
                      {favorite.ingredientName}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(favorite.ingredientId, favorite.substituteId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}