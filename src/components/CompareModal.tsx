import React from 'react';
import { X } from 'lucide-react';
import { Substitute } from '../types';

interface CompareModalProps {
  substitutes: [Substitute, Substitute];
  onClose: () => void;
}

export default function CompareModal({ substitutes, onClose }: CompareModalProps) {
  const [sub1, sub2] = substitutes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Compare Substitutes</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[sub1, sub2].map((sub, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">{sub.name}</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Usage Ratio</h4>
                  <p>{sub.ratio}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Safe For</h4>
                  <div className="flex flex-wrap gap-2">
                    {sub.safeFor.allergens.map(allergen => (
                      <span key={allergen} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {allergen}-free
                      </span>
                    ))}
                    {sub.safeFor.dietaryRestrictions.map(diet => (
                      <span key={diet} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Best Used In</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {sub.bestFor.map((use, i) => (
                      <li key={i} className="text-sm text-gray-600">{use}</li>
                    ))}
                  </ul>
                </div>

                {sub.nutritionalNotes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Nutritional Notes</h4>
                    <p className="text-sm text-gray-600">{sub.nutritionalNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}