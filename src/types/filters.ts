export type FilterType = 'alternative';

export interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
}

export interface FilterState {
  selectedFilters: FilterOption[];
  availableFilters: Record<FilterType, FilterOption[]>;
  filterCounts: Record<string, number>;
}