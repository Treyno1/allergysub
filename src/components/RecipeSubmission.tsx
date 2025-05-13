import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../utils/cn';
import ImageUpload from './ImageUpload';
import { useToast } from './ui/use-toast';

// Predefined units
const UNITS = [
  'cup',
  'tablespoon',
  'teaspoon',
  'ml',
  'gram',
  'ounce',
  'pound',
  'piece',
  'whole'
] as const;

interface RecipeFormIngredient {
  quantity: number;
  unit: string;
  name: string;
  substituteFor: string;
}

interface SubstituteData {
  id: string;
  name: string;
  ingredient_id: string;
  ingredient_name: string;
}

export default function RecipeSubmission() {
  const toast = useToast();
  const [recipeName, setRecipeName] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [ingredients, setIngredients] = useState<RecipeFormIngredient[]>([{
    quantity: 1,
    unit: 'cup',
    name: '',
    substituteFor: 'Custom'
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [substitutes, setSubstitutes] = useState<Record<string, string>>({});
  const [isLoadingSubstitutes, setIsLoadingSubstitutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [substituteCount, setSubstituteCount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Check current user and role using whoami RPC function
  useEffect(() => {
    async function checkUserRole() {
      try {
        console.log('🔍 Checking current user and role...');
        const { data, error } = await supabase.rpc('whoami');
        
        if (error) throw error;
        
        console.log('👤 Current user info:', data);
        console.log('🔑 Role:', data.role);
        console.log('🔐 Authenticated:', data.is_authenticated);
        
      } catch (error) {
        const err = error as Error;
        console.error('❌ Error checking user role:', err);
      }
    }
    
    checkUserRole();
  }, []);

  // Load substitutes from database
  useEffect(() => {
    async function fetchSubstitutes() {
      try {
        console.log('🔄 Fetching substitutes from database...');
        setError(null);
        
        // First, get all ingredients with their names
        const { data: ingredientData, error: ingredientError } = await supabase
          .from('ingredients')
          .select('id, name');

        if (ingredientError) throw ingredientError;

        // Create a map of ingredient IDs to names
        const ingredientMap = ingredientData?.reduce((acc, ing) => {
          acc[ing.id] = ing.name;
          return acc;
        }, {} as Record<string, string>) || {};

        // Then get all substitutes
        const { data: substituteData, error: substituteError } = await supabase
          .from('substitutes')
          .select('id, name, ingredient_id');

        if (substituteError) throw substituteError;

        if (!substituteData || substituteData.length === 0) {
          console.log('⚠️ No substitutes found in database');
          return;
        }

        // Transform data into normalized lookup map
        const substituteMap = substituteData.reduce((acc, substitute) => {
          const ingredientName = ingredientMap[substitute.ingredient_id];
          if (ingredientName) {
            // Normalize both the substitute name and the ingredient name
            const normalizedSubName = normalizeText(substitute.name);
            const normalizedIngName = normalizeText(ingredientName);
            
            console.log('📝 Adding substitute:', {
              substitute: normalizedSubName,
              for: normalizedIngName,
              originalName: substitute.name,
              originalIngredient: ingredientName
            });
            
            acc[normalizedSubName] = normalizedIngName;
          }
          return acc;
        }, {} as Record<string, string>);

        const count = Object.keys(substituteMap).length;
        console.log(`✅ Loaded ${count} substitutes:`, substituteMap);
        
        setSubstitutes(substituteMap);
        setSubstituteCount(count);
      } catch (error) {
        const err = error as Error;
        console.error('❌ Error loading substitutes:', err);
        setError('Failed to load substitutes. Please try again later.');
      } finally {
        setIsLoadingSubstitutes(false);
      }
    }

    fetchSubstitutes();
  }, []);

  // Normalize text for consistent matching
  const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  // Handle ingredient name change and check for substitutes
  const handleIngredientChange = (index: number, value: string) => {
    setIngredients(prev => {
      const newIngredients = [...prev];
      const normalizedInput = normalizeText(value);
      
      // Find substitute with normalized comparison
      const substituteFor = substitutes[normalizedInput] || 'Custom';
      
      newIngredients[index] = {
        ...newIngredients[index],
        name: value,
        substituteFor
      };
      
      console.log('🔍 Checking substitute for:', {
        input: value,
        normalized: normalizedInput,
        found: substituteFor,
        availableSubstitutes: substituteCount,
        allSubstitutes: substitutes
      });
      
      return newIngredients;
    });
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setIngredients(prev => {
      const newIngredients = [...prev];
      newIngredients[index] = {
        ...newIngredients[index],
        quantity: numValue
      };
      return newIngredients;
    });
  };

  // Handle unit change
  const handleUnitChange = (index: number, value: string) => {
    setIngredients(prev => {
      const newIngredients = [...prev];
      newIngredients[index] = {
        ...newIngredients[index],
        unit: value
      };
      return newIngredients;
    });
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, {
      quantity: 1,
      unit: 'cup',
      name: '',
      substituteFor: 'Custom'
    }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    console.log("📤 Submitting Recipe:", {
      recipe_name: recipeName.trim(),
      instructions: recipeInstructions.trim(),
      ingredients,
      image_url: imageUrl || null
  });

    try {
      // Validate required fields
      if (!recipeName.trim()) throw new Error('Recipe name is required');
      if (!recipeInstructions.trim()) throw new Error('Instructions are required');

      // Format ingredients array - always ensure it's a valid array
      const validIngredients = ingredients
        .filter(ing => ing.name.trim()) // Remove empty ingredients
        .map(ing => ({
          quantity: Number(ing.quantity) || 0, // Ensure quantity is a number
          unit: ing.unit.trim(),
          name: ing.name.trim(),
          substituteFor: ing.substituteFor === 'Custom' ? null : ing.substituteFor.trim()
        }));

      // Prepare recipe data with explicit null values and guaranteed array
      const recipeData = {
        recipe_name: recipeName.trim(),
        instructions: recipeInstructions.trim(),
        ingredients: validIngredients, // Will be [] if no valid ingredients
        image_url: imageUrl || null, // Explicitly set to null if not provided
        status: 'pending'
      };

      // Log the exact payload being sent
      console.log('📤 Submitting recipe data:', JSON.stringify(recipeData, null, 2));

      // Type check to ensure ingredients is an array
      if (!Array.isArray(recipeData.ingredients)) {
        throw new Error('Invalid ingredients format - expected an array');
      }

      // Submit to Supabase
      const { data, error: submitError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single();

      if (submitError) throw submitError;

      // Show success toast
      toast({
        title: "Recipe Submitted!",
        description: "Your recipe has been successfully submitted for review.",
        duration: 5000
      });

      // Reset form
      setRecipeName('');
      setRecipeInstructions('');
      setIngredients([{
        quantity: 1,
        unit: 'cup',
        name: '',
        substituteFor: 'Custom'
      }]);
      setImageUrl(null);
      setError(null);

    } catch (err) {
      const error = err as Error;
      console.error('❌ Error submitting recipe:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your recipe. Please try again.",
        duration: 5000
      });
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Recipe Submission</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            {isLoadingSubstitutes ? (
              <span className="text-sm text-gray-500">Loading substitutes...</span>
            ) : (
              <span className="text-sm text-gray-500">
                {substituteCount} substitutes available
              </span>
            )}
          </div>
          
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Quantity Input */}
              <input
                type="number"
                min="0"
                step="0.25"
                value={ingredient.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="w-20 px-3 py-2 border rounded-md"
              />

              {/* Unit Dropdown */}
              <select
                value={ingredient.unit}
                onChange={(e) => handleUnitChange(index, e.target.value)}
                className="w-32 px-3 py-2 border rounded-md"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              {/* Ingredient Name Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={isLoadingSubstitutes ? "Loading substitutes..." : "Enter ingredient..."}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md",
                    isLoadingSubstitutes && "bg-gray-50"
                  )}
                  disabled={isLoadingSubstitutes}
                />
                {ingredient.substituteFor !== 'Custom' && (
                  <p className="mt-1 text-sm text-green-600">
                    ✨ Substitute for: {ingredient.substituteFor}
                  </p>
                )}
              </div>

              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddIngredient}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Another Ingredient
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Photo
          </label>
          <ImageUpload
            onImageChange={setImageUrl}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoadingSubstitutes}
          className={cn(
            "w-full px-4 py-2 text-white bg-blue-500 rounded-md",
            "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
} 