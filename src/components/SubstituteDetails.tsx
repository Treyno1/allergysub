import React from 'react';
import { Check, X } from 'lucide-react';
import { Substitute } from '../types';
import StarRating from './StarRating';

interface SubstituteDetailsProps {
  substitute: Substitute;
}

export default function SubstituteDetails({ substitute }: SubstituteDetailsProps) {
  const handleRate = (rating: number) => {
    // In a real app, this would be connected to a backend
    console.log(`Rating ${substitute.name}: ${rating} stars`);
  };

  return (
    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">Rate this substitute:</span>
        <StarRating
          rating={0}
          onRate={handleRate}
          size="sm"
        />
      </div>

      {/* Usage Instructions */}
      <div>
        <h5 className="font-medium text-gray-900 mb-2">Usage</h5>
        <ul className="space-y-2">
          {substitute.usage.map((instruction, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best For */}
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
  );
}