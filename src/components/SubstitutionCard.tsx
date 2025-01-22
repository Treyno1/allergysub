import React, { useState } from 'react';
import { Substitution } from '../data/substitutions';
import { Beaker, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import StarRating from './StarRating';

interface SubstitutionCardProps {
  substitution: Substitution;
}

export default function SubstitutionCard({ substitution }: SubstitutionCardProps) {
  const [expandedAlternative, setExpandedAlternative] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  const toggleExpand = (index: number) => {
    setExpandedAlternative(expandedAlternative === index ? null : index);
  };

  const handleRate = (index: number, rating: number) => {
    setRatings(prev => ({ ...prev, [index]: rating }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Beaker className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{substitution.original}</h3>
        </div>
        
        <div className="space-y-4">
          {substitution.alternatives.map((alt, index) => (
            <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{alt.name}</h4>
                <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {alt.ratio}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{alt.notes}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {alt.allergenFree.map((allergen) => (
                  <span
                    key={allergen}
                    className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full"
                  >
                    {allergen}-free
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => toggleExpand(index)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {expandedAlternative === index ? (
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
                    rating={ratings[index] || 0}
                    onRate={(rating) => handleRate(index, rating)}
                    size="sm"
                  />
                </div>
              </div>

              {expandedAlternative === index && (
                <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                  {/* Usage Instructions */}
                  {alt.usageInstructions && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Usage Instructions</h5>
                      <ul className="space-y-2">
                        {alt.usageInstructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Best For */}
                  {alt.bestFor && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Best Used In</h5>
                      <ul className="space-y-2">
                        {alt.bestFor.map((use, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Not Recommended For */}
                  {alt.notRecommendedFor && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Not Recommended For</h5>
                      <ul className="space-y-2">
                        {alt.notRecommendedFor.map((use, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <X className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Preparation Steps */}
                  {alt.preparationSteps && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Preparation Steps</h5>
                      <ol className="space-y-2">
                        {alt.preparationSteps.map((step, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}