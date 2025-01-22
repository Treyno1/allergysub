import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { FilterOption } from '../types/filters';

interface UsageDropdownProps {
  selectedUsages: FilterOption[];
  availableUsages: FilterOption[];
  usageCounts: Record<string, number>;
  onUsageToggle: (usage: FilterOption) => void;
}

export default function UsageDropdown({
  selectedUsages,
  availableUsages,
  usageCounts,
  onUsageToggle
}: UsageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="text-sm text-gray-700">
          {selectedUsages.length === 0 ? 'Select usage types' : `${selectedUsages.length} selected`}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 max-h-60 overflow-y-auto">
            {availableUsages.map((usage) => (
              <button
                key={usage.id}
                onClick={() => {
                  onUsageToggle(usage);
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-left
                  hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4">
                    {selectedUsages.some(u => u.id === usage.id) && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-gray-700">{usage.label}</span>
                </div>
                <span className="text-xs text-gray-500">
                  ({usageCounts[usage.id] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}