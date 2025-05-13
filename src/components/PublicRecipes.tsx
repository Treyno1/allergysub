import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface Recipe {
  id: string;
  recipe_name: string;
  instructions: string;
  ingredients: {
    quantity: number;
    unit: string;
    name: string;
    substituteFor: string | null;
  }[];
  image_url: string | null;
  created_at: string;
  status: 'approved';
}

export default function PublicRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApprovedRecipes();
  }, []);

  const fetchApprovedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching approved recipes...");

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log("Approved recipes response:", data);
      console.log(`Found ${data?.length || 0} approved recipes`);

      // Debug: Show the status values of all recipes to check for case issues
      const { data: allRecipes, error: allRecipesError } = await supabase
        .from('recipes')
        .select('id, recipe_name, status')
        .order('created_at', { ascending: false });
        
      if (allRecipesError) {
        console.error("Error fetching all recipes:", allRecipesError);
      } else {
        console.log("All recipes (for debugging):", allRecipes);
        // Group by status to see what values are actually in the database
        const statusCounts: Record<string, number> = allRecipes.reduce((acc: Record<string, number>, recipe) => {
          const status = recipe.status || 'null';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        console.log("Recipe status counts:", statusCounts);
      }

      setRecipes(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error fetching approved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipeExpansion = (recipeId: string) => {
    setExpandedRecipes(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => 
    recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some(ing => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ing.substituteFor && ing.substituteFor.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Allergy-Friendly Recipes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover delicious recipes that use safe substitutes for common allergens and ingredients.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recipes by name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Loading delicious recipes...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
          <p className="mb-2 font-medium">Oops! Something went wrong</p>
          <p>{error}</p>
          <button 
            onClick={fetchApprovedRecipes}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          {searchQuery ? (
            <>
              <p className="text-lg text-gray-700 mb-2">No recipes found matching "{searchQuery}"</p>
              <p className="text-gray-500">Try searching for a different ingredient or recipe name.</p>
            </>
          ) : (
            <p className="text-lg text-gray-700">No approved recipes to display yet.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Recipe Image (if available) */}
              {recipe.image_url && (
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={recipe.image_url}
                    alt={recipe.recipe_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Recipe Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.recipe_name}</h3>
                
                {/* Ingredients Preview */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {recipe.ingredients.length} {recipe.ingredients.length === 1 ? 'Ingredient' : 'Ingredients'}
                    </span>
                    {recipe.ingredients.some(ing => ing.substituteFor) && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                        Contains Substitutes
                      </span>
                    )}
                  </div>
                  
                  <ul className="text-sm text-gray-600">
                    {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-medium">{ing.name}</span>
                        {ing.substituteFor && (
                          <span className="ml-1 text-green-600">
                            (Substitutes for: {ing.substituteFor})
                          </span>
                        )}
                      </li>
                    ))}
                    {recipe.ingredients.length > 3 && !expandedRecipes.has(recipe.id) && (
                      <li className="text-blue-500 font-medium cursor-pointer" onClick={() => toggleRecipeExpansion(recipe.id)}>
                        + {recipe.ingredients.length - 3} more ingredients
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Toggle Expand Button */}
                <button
                  onClick={() => toggleRecipeExpansion(recipe.id)}
                  className="flex items-center justify-center w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                >
                  {expandedRecipes.has(recipe.id) ? (
                    <>Hide Details <ChevronUp className="w-4 h-4 ml-1" /></>
                  ) : (
                    <>View Details <ChevronDown className="w-4 h-4 ml-1" /></>
                  )}
                </button>
                
                {/* Expanded Content */}
                {expandedRecipes.has(recipe.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Full Ingredients List */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Ingredients</h4>
                      <ul className="space-y-2">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex text-gray-700">
                            <span className="font-medium mr-2">•</span>
                            <div>
                              <span>
                                {ing.quantity} {ing.unit} {ing.name}
                              </span>
                              {ing.substituteFor && (
                                <p className="text-sm text-green-600 mt-1">
                                  This substitutes for {ing.substituteFor}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Instructions */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Instructions</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {recipe.instructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 