import type { DietaryRestriction } from '../types';

export const SAFE_FOR_ICONS = {
  'vegan': '🌱',
  'vegetarian': '🥕',
  'gluten-free': '🌾',
  'dairy-free': '🥛',
  'nut-free': '🥜',
  'soy-free': '🫘',
  'egg-free': '🥚',
  'caffeine-free': '☕',
  'corn-free': '🌽',
  'fish-free': '🐟',
  'nightshade-free': '🍅'
} as const;

export const formatDietaryRestriction = (restriction: DietaryRestriction): string => {
  return restriction.toLowerCase();
};

export const getDietaryIcon = (restriction: DietaryRestriction): string => {
  const formattedRestriction = formatDietaryRestriction(restriction);
  return SAFE_FOR_ICONS[formattedRestriction as keyof typeof SAFE_FOR_ICONS] || '❓';
}; 