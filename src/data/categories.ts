import { Category } from '../types';
import { 
  Milk, 
  Egg, 
  Wheat, 
  Nut, 
  Drumstick, 
  Coffee,
  Apple,
  Cookie,
  Beaker,
  Soup
} from 'lucide-react';

export const categoryInfo = {
  'dairy': {
    label: 'Dairy Products',
    icon: Milk
  },
  'eggs': {
    label: 'Eggs & Egg Products',
    icon: Egg
  },
  'proteins': {
    label: 'Proteins',
    icon: Drumstick
  },
  'grains': {
    label: 'Grains & Starches',
    icon: Wheat
  },
  'nuts-seeds': {
    label: 'Nuts & Seeds',
    icon: Nut
  },
  'beverages': {
    label: 'Beverages',
    icon: Coffee
  },
  'produce': {
    label: 'Fruits & Vegetables',
    icon: Apple
  },
  'sweeteners': {
    label: 'Sweeteners',
    icon: Cookie
  },
  'thickeners': {
    label: 'Thickeners & Binders',
    icon: Beaker
  },
  'condiments': {
    label: 'Condiments & Sauces',
    icon: Soup
  }
} as const;