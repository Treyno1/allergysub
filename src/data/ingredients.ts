import { Ingredient } from '../types';
import { transformCSVToIngredients } from '../utils/dataTransform';
import { dairyIngredients } from './ingredients/dairy';
import { eggIngredients } from './ingredients/eggs';
import { grainIngredients } from './ingredients/grains';
import { nutIngredients } from './ingredients/nuts';
import { meatIngredients } from './ingredients/meat';
import { fishIngredients } from './ingredients/fish';
import { sweetenerIngredients } from './ingredients/sweeteners';
import { caffeineIngredients } from './ingredients/caffeine';
import { thickenerIngredients } from './ingredients/thickeners';
import { herbIngredients } from './ingredients/herbs';
import { vegetableIngredients } from './ingredients/vegetables';
import { fruitIngredients } from './ingredients/fruit';

const rawData = [
  ...dairyIngredients,
  ...eggIngredients,
  ...grainIngredients,
  ...nutIngredients,
  ...meatIngredients,
  ...fishIngredients,
  ...sweetenerIngredients,
  ...caffeineIngredients,
  ...thickenerIngredients,
  ...herbIngredients,
  ...vegetableIngredients,
  ...fruitIngredients
];

export const ingredients: Ingredient[] = transformCSVToIngredients(rawData);