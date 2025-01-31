import React, { useState } from 'react';
import { Heart, Check, X, ChevronDown, ChevronUp, Scale, BookOpen, Info, Image as ImageIcon } from 'lucide-react';
import { Ingredient, Substitute } from '../types';
import StarRating from './StarRating';
import CommentSection from './CommentSection';
import RecipeRecommendations from './RecipeRecommendations';
import { categoryInfo } from '../data/categories';
import { useRatings } from '../hooks/useRatings';
import { logComponentInit, logImageFallback, logImageHandling, logDietaryRestrictions, logExpandCollapse, logError } from '../utils/logging';

// Helper function to create a data URL for the placeholder
const createPlaceholderDataUrl = (category: string): string => {
  const text = category ? `${category} Alternative` : 'No Image';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect width="96" height="96" fill="#e2e8f0"/>
    <text x="48" y="48" font-family="Arial" font-size="10" fill="#64748b" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Helper function to get category-specific placeholder
const getCategoryPlaceholder = (category: string): { src: string; alt: string } => {
  return {
    src: createPlaceholderDataUrl(category),
    alt: category ? `${category} alternative placeholder` : 'Placeholder image'
  };
};

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
  const [imageLoadError, setImageLoadError] = useState<{ [key: string]: boolean }>({});
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Component initialization logging
  React.useEffect(() => {
    logComponentInit('IngredientCard', {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      category: ingredient.category,
      substituteCount: ingredient.substitutes.length
    });
  }, []);

  const formatQuantityConversion = (conversion: string | undefined, substituteName: string, originalName: string) => {
    if (!conversion || conversion === '1:1 ratio - Use the same amount as the original ingredient') {
      const measure = ingredient.category === 'beverages' ? 'cup' : 
                     ingredient.category === 'condiments' ? 'teaspoon' :
                     ingredient.category === 'grains' ? 'cup' : 'cup';
      return `1 ${measure} of ${originalName} = 1 ${measure} of ${substituteName}`;
    }
    return conversion;
  };

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
            const placeholder = getCategoryPlaceholder(ingredient.category);
            const isImageLoading = imageLoading[substitute.id];
            const hasImageError = imageLoadError[substitute.id];
            
            // Log dietary restrictions
            React.useEffect(() => {
              if (substitute.safeFor?.dietaryRestrictions) {
                logDietaryRestrictions('IngredientCard', {
                  substituteId: substitute.id,
                  substituteName: substitute.name,
                  restrictions: substitute.safeFor.dietaryRestrictions
                });
              }
            }, [substitute.id, substitute.safeFor?.dietaryRestrictions]);

            return (
              <div key={`${substitute.id}-${key}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                {/* Substitute Header with Image */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <div className="relative w-full h-full">
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img 
                          key={`${substitute.id}-${hasImageError ? 'placeholder' : 'image'}`}
                          src={hasImageError || !substitute.imageUrl ? placeholder.src : substitute.imageUrl}
                          alt={substitute.altText || `Image of ${substitute.name}`}
                          className={`w-full h-full object-cover transition-opacity duration-200 ${
                            isImageLoading ? 'opacity-0' : 'opacity-100'
                          }`}
                          onLoad={() => {
                            logImageHandling('IngredientCard', 'loaded', {
                              imageUrl: substitute.imageUrl,
                              substituteName: substitute.name,
                              substituteId: substitute.id
                            });
                            setImageLoading(prev => ({ ...prev, [substitute.id]: false }));
                            setImageLoadError(prev => ({ ...prev, [substitute.id]: false }));
                          }}
                          onError={() => {
                            logImageFallback('IngredientCard', substitute.imageUrl, substitute.name, 'error');
                            setImageLoading(prev => ({ ...prev, [substitute.id]: false }));
                            setImageLoadError(prev => ({ ...prev, [substitute.id]: true }));
                          }}
                          onLoadStart={() => {
                            logImageHandling('IngredientCard', 'loading', {
                              imageUrl: substitute.imageUrl,
                              substituteName: substitute.name,
                              substituteId: substitute.id
                            });
                            if (!hasImageError && substitute.imageUrl) {
                              setImageLoading(prev => ({ ...prev, [substitute.id]: true }));
                            }
                          }}
                          loading="lazy"
                        />
                      </div>
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
                  onClick={() => {
                    const newState = expandedSubstitute === substitute.id ? null : substitute.id;
                    logExpandCollapse('IngredientCard', {
                      section: 'substitute-details',
                      isExpanded: newState === substitute.id,
                      itemId: substitute.id,
                      itemName: substitute.name
                    });
                    setExpandedSubstitute(newState);
                  }}
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
                    {/* Tasting Notes Section - Only show if meaningful notes exist */}
                    {hasNotes && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          Tasting Notes
                        </h5>
                        <p className="text-sm text-gray-600">{substitute.notes}</p>
                      </div>
                    )}

                    {/* Quantity Conversion Section */}
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 hover:scale-[1.02] transition-transform">
                      <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-blue-600" />
                        Quantity Conversion
                      </h5>
                      <p className="text-sm font-medium text-blue-800">
                        {formatQuantityConversion(substitute.quantity_conversion, substitute.name, ingredient.name)}
                      </p>
                    </div>

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
                          {/* Usage Examples */}
                          {substitute.usage.length > 0 && (
                            <div className="mb-4">
                              <ul className="space-y-2">
                                {substitute.usage.map((use, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

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