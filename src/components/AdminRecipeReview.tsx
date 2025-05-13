import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface PendingRecipe {
  id: string;
  recipe_name: string;
  instructions: string;
  ingredients: {
    quantity: number;
    unit: string;
    name: string;
    substituteFor: string;
  }[];
  image_url: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminRecipeReview() {
  const [pendingRecipes, setPendingRecipes] = useState<PendingRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPendingRecipes(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error fetching pending recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = async (recipeId: string, action: 'approve' | 'reject') => {
    try {
      setIsProcessing(recipeId);
      setError(null);

      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          status: action,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', recipeId);

      if (updateError) throw updateError;

      // Update local state
      setPendingRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      // Show success message
      alert(`Recipe ${action}d successfully!`);
    } catch (err) {
      const error = err as Error;
      setError(`Failed to ${action} recipe: ${error.message}`);
      console.error(`Error ${action}ing recipe:`, error);
    } finally {
      setIsProcessing(null);
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

  if (loading) {
    return <div className="p-6 text-center">Loading pending recipes...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (pendingRecipes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No pending recipes to review
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Recipe Review Panel</h2>
      
      <div className="space-y-4">
        {pendingRecipes.map(recipe => {
          const isExpanded = expandedRecipes.has(recipe.id);
          
          return (
            <div
              key={recipe.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{recipe.recipe_name}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRecipeExpansion(recipe.id)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleRecipeAction(recipe.id, 'approve')}
                    disabled={isProcessing === recipe.id}
                    className={cn(
                      "p-2 rounded-full",
                      isProcessing === recipe.id
                        ? "bg-gray-100 text-gray-400"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    )}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleRecipeAction(recipe.id, 'reject')}
                    disabled={isProcessing === recipe.id}
                    className={cn(
                      "p-2 rounded-full",
                      isProcessing === recipe.id
                        ? "bg-gray-100 text-gray-400"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t">
                  {recipe.image_url && (
                    <div className="mb-4">
                      <img
                        src={recipe.image_url}
                        alt={recipe.recipe_name}
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Ingredients:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {ing.quantity} {ing.unit} {ing.name}
                            {ing.substituteFor !== 'Custom' && (
                              <span className="text-green-600 ml-2">
                                (Substitutes for: {ing.substituteFor})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Instructions:</h4>
                      <p className="whitespace-pre-wrap">{recipe.instructions}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 