import React, { useState } from 'react';
import { Heart, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Ingredient, Substitute } from '../types';
import StarRating from './StarRating';
import CommentSection from './CommentSection';
import RecipeRecommendations from './RecipeRecommendations';
import { categoryInfo } from '../data/categories';
import { useRatings } from '../hooks/useRatings';

interface IngredientCardProps {
  ingredient: Ingredient;
  onFavoriteToggle: (ingredient: Ingredient, substitute: Substitute) => void;
  isFavorite: (ingredientId: string, substituteId: string) => boolean;
}

export default function IngredientCard({
  ingredient,
  onFavoriteToggle,
  isFavorite
}: IngredientCardProps) {
  const [expandedSubstitute, setExpandedSubstitute] = useState<string | null>(null);
  const CategoryIcon = categoryInfo[ingredient.category]?.icon || null;
  const [key, setKey] = useState(0); // For forcing re-render after rating

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {CategoryIcon && (
              <div className="p-2 bg-blue-50 rounded-lg">
                <CategoryIcon className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ingredient.name}</h3>
              <span className="text-sm text-gray-500">{categoryInfo[ingredient.category]?.label || 'Other'}</span>
            </div>
          </div>
        </div>

        {/* Substitutes List */}
        <div className="space-y-6">
          {ingredient.substitutes.map((substitute) => {
            const { averageRating, addRating } = useRatings(substitute.id);
            
            return (
              <div key={`${substitute.id}-${key}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                {/* Substitute Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{substitute.name}</h4>
                    <p className="text-sm text-gray-500">
                      Alternative for {ingredient.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onFavoriteToggle(ingredient, substitute)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(ingredient.id, substitute.id)
                            ? 'text-red-500 fill-current'
                            : ''
                        }`}
                      />
                    </button>
                    <StarRating 
                      rating={averageRating}
                      onRate={(rating) => {
                        addRating(rating);
                        setKey(prev => prev + 1); // Force re-render
                      }}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Rest of the substitute card content */}
                {/* Usage Tags */}
                {substitute.usage.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {substitute.usage.map((usage, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                      >
                        {usage}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dietary Tags */}
                {substitute.safeFor.dietaryRestrictions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {substitute.safeFor.dietaryRestrictions.map((diet) => (
                      <span
                        key={diet}
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedSubstitute(
                    expandedSubstitute === substitute.id ? null : substitute.id
                  )}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {expandedSubstitute === substitute.id ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show more details
                    </>
                  )}
                </button>

                {/* Expanded Details */}
                {expandedSubstitute === substitute.id && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      {/* Notes */}
                      {substitute.notes && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gray-500 rounded-full"></span>
                            Notes
                          </h5>
                          <p className="text-sm text-gray-600">
                            {substitute.notes}
                          </p>
                        </div>
                      )}

                      {/* Best For */}
                      {substitute.bestFor.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                            Best Used In
                          </h5>
                          <ul className="space-y-2">
                            {substitute.bestFor.map((use, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                                <span>{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Not Recommended For */}
                      {substitute.notRecommendedFor.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                            Not Recommended For
                          </h5>
                          <ul className="space-y-2">
                            {substitute.notRecommendedFor.map((use, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <X className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                                <span>{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recipe Recommendations */}
                      <RecipeRecommendations 
                        substitute={substitute}
                        ingredientName={ingredient.name}
                      />
                    </div>

                    {/* Comments Section */}
                    <CommentSection substituteId={substitute.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}