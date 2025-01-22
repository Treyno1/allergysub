import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Substitute } from '../types';

interface RecipeRecommendationsProps {
  substitute: Substitute;
  ingredientName: string;
}

export default function RecipeRecommendations({ substitute, ingredientName }: RecipeRecommendationsProps) {
  const getRecipeSuggestions = () => {
    const suggestions = [];
    
    substitute.usage.forEach(usage => {
      if (usage.toLowerCase().includes('baking')) {
        suggestions.push(`Try ${substitute.name} in your favorite ${usage} recipes`);
      }
    });

    if (substitute.safeFor.dietaryRestrictions.includes('vegan')) {
      suggestions.push(`Perfect for vegan ${ingredientName.toLowerCase()} alternatives`);
    }

    if (suggestions.length === 0) {
      suggestions.push(`Use ${substitute.name} as a 1:1 replacement in your favorite ${ingredientName.toLowerCase()} recipes`);
    }

    return suggestions;
  };

  const suggestions = getRecipeSuggestions();

  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
        <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        Recipe Ideas
      </h5>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-gray-600">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}