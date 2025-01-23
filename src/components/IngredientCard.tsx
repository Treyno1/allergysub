import React, { useState } from 'react';
import { Heart, Check, X, ChevronDown, ChevronUp, Scale, BookOpen, Info, Image as ImageIcon } from 'lucide-react';
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
  const [expandedRecipes, setExpandedRecipes] = useState<{ [key: string]: boolean }>({});
  const CategoryIcon = categoryInfo[ingredient.category]?.icon || null;
  const [key, setKey] = useState(0);

  const toggleRecipeSection = (substituteId: string) => {
    setExpandedRecipes(prev => ({
      ...prev,
      [substituteId]: !prev[substituteId]
    }));
  };

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
            const hasNotes = substitute.notes && substitute.notes !== 'No additional notes available.';
            const hasQuantityConversion = substitute.quantity_conversion && 
              substitute.quantity_conversion !== '1:1 ratio - Use the same amount as the original ingredient';
            
            return (
              <div key={`${substitute.id}-${key}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                {/* Substitute Header with Image Placeholder */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">{substitute.name}</h4>
                      <p className="text-sm text-gray-500">
                        Alternative for {ingredient.name}
                      </p>
                    </div>
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
                        setKey(prev => prev + 1);
                      }}
                      size="sm"
                    />
                  </div>
                </div>

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
                  <div className="mt-4 space-y-6">
                    {/* Notes Section - Only show if meaningful notes exist */}
                    {hasNotes && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          Notes
                        </h5>
                        <p className="text-sm text-gray-600">{substitute.notes}</p>
                      </div>
                    )}

                    {/* Quantity Conversion Section - Only show if specific conversion exists */}
                    {hasQuantityConversion && (
                      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 hover:scale-[1.02] transition-transform">
                        <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <Scale className="w-5 h-5 text-blue-600" />
                          Quantity Conversion
                        </h5>
                        <p className="text-sm font-medium text-blue-800">
                          {substitute.quantity_conversion}
                        </p>
                      </div>
                    )}

                    {/* Recipe Ideas Section - Collapsible */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <button
                        onClick={() => toggleRecipeSection(substitute.id)}
                        className="w-full flex items-center justify-between"
                      >
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-500" />
                          Recipe Ideas
                        </h5>
                        {expandedRecipes[substitute.id] ? (
                          <ChevronUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                      
                      {expandedRecipes[substitute.id] && (
                        <div className="mt-4">
                          {/* Best For */}
                          {substitute.bestFor.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Best Used In:</h6>
                              <ul className="space-y-2">
                                {substitute.bestFor.map((use, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Not Recommended For */}
                          {substitute.notRecommendedFor.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Not Recommended For:</h6>
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

                          {/* Recipe Recommendations Component */}
                          <RecipeRecommendations 
                            substitute={substitute}
                            ingredientName={ingredient.name}
                          />
                        </div>
                      )}
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