import React from 'react';
import { X, Filter as FilterIcon } from 'lucide-react';
import FilterTag from './FilterTag';
import { FilterType, FilterOption } from '../types/filters';

interface FilterBarProps {
  selectedFilters: FilterOption[];
  onFilterChange: (filter: FilterOption) => void;
  onClearFilters: () => void;
  availableFilters: Record<FilterType, FilterOption[]>;
  filterCounts: Record<string, number>;
}

export default function FilterBar({
  selectedFilters,
  onFilterChange,
  onClearFilters,
  availableFilters,
  filterCounts
}: FilterBarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with collapse toggle for mobile */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            {selectedFilters.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {selectedFilters.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedFilters.length > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              {isCollapsed ? (
                <span className="text-sm">Show filters</span>
              ) : (
                <span className="text-sm">Hide filters</span>
              )}
            </button>
          </div>
        </div>

        {/* Selected filters summary */}
        {selectedFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                  bg-gray-100 text-gray-700"
              >
                {filter.label}
                <button
                  onClick={() => onFilterChange(filter)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter sections */}
      <div className={`
        transition-all duration-200 ease-in-out
        ${isCollapsed ? 'h-0' : 'h-auto'}
        md:h-auto
      `}>
        <div className="p-4">
          {/* Alternative Type Filters */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
              Alternative Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableFilters.alternative.map((filter) => (
                <FilterTag
                  key={filter.id}
                  filter={filter}
                  isSelected={selectedFilters.some(f => f.id === filter.id)}
                  count={filterCounts[filter.id] || 0}
                  onClick={() => onFilterChange(filter)}
                  type="alternative"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}