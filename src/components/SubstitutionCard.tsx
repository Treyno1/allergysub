import React, { useState } from 'react';
import { Substitute } from '../types';
import { Beaker, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import StarRating from './StarRating';

interface SubstitutionCardProps {
  substitute: Substitute;
  ingredientName: string;
}

export default function SubstitutionCard({ substitute, ingredientName }: SubstitutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRate = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Beaker className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{ingredientName}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{substitute.name}</h4>
            </div>
            <p className="text-gray-600 text-sm mb-2">{substitute.notes}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {substitute.safeFor.dietaryRestrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full"
                >
                  {restriction}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={toggleExpand}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show usage details
                  </>
                )}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rate:</span>
                <StarRating
                  rating={rating}
                  onRate={handleRate}
                  size="sm"
                />
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                {/* Usage Instructions */}
                {substitute.usage && substitute.usage.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Usage Instructions</h5>
                    <ul className="space-y-2">
                      {substitute.usage.map((instruction, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Best For */}
                {substitute.bestFor && substitute.bestFor.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Best Used In</h5>
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
                {substitute.notRecommendedFor && substitute.notRecommendedFor.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Not Recommended For</h5>
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

                {/* Preparation Steps */}
                {substitute.preparationSteps && substitute.preparationSteps.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Preparation Steps</h5>
                    <ol className="space-y-2">
                      {substitute.preparationSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="font-medium text-gray-700 flex-shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}