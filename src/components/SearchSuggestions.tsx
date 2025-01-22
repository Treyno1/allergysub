import React from 'react';
import { Tag } from 'lucide-react';

const suggestions = [
  { type: 'ingredient', text: 'Eggs' },
  { type: 'ingredient', text: 'Milk' },
  { type: 'ingredient', text: 'Flour' },
  { type: 'category', text: 'Dairy-Free' },
  { type: 'category', text: 'Gluten-Free' },
  { type: 'category', text: 'Baking' },
];

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  searchQuery: string;
}

export default function SearchSuggestions({ onSuggestionClick, searchQuery }: SearchSuggestionsProps) {
  if (searchQuery) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Tag className="w-4 h-4" />
        <span>Popular searches:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(({ type, text }) => (
          <button
            key={`${type}-${text}`}
            onClick={() => onSuggestionClick(text)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}