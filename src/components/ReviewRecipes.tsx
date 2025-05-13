import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { adminSupabase } from '../lib/adminSupabase';
import { Check, X, ChevronDown, ChevronUp, Filter, Search, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from './ui/use-toast';

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
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewRecipes() {
  const toast = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [statusFilter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRecipes(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: `Failed to load recipes: ${error.message}`,
        status: "error",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = async (recipeId: string, action: 'approve' | 'reject') => {
    try {
      setIsProcessing(recipeId);
      setError(null);

      // Convert action verb to proper status adjective form
      const statusValue = action === 'approve' ? 'approved' : 'rejected';
      
      console.log(`Updating recipe ${recipeId} status to: "${statusValue}" (using admin client)`);

      // Use adminSupabase instead of regular supabase for this operation
      const { data, error: updateError } = await adminSupabase
        .from('recipes')
        .update({
          status: statusValue
        })
        .eq('id', recipeId)
        .select();  // Return the updated record

      if (updateError) throw updateError;

      console.log("Database update response:", data);
      
      // Double-check that the update worked by fetching the record directly
      const { data: verificationData, error: verificationError } = await supabase
        .from('recipes')
        .select('id, recipe_name, status')
        .eq('id', recipeId)
        .single();
        
      if (verificationError) {
        console.error("Verification query error:", verificationError);
      } else {
        console.log("Verification of updated record:", verificationData);
        if (verificationData.status !== statusValue) {
          console.error(`⚠️ Status mismatch! Expected "${statusValue}" but database shows "${verificationData.status}"`);
        }
      }

      // Update local state
      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, status: statusValue as 'pending' | 'approved' | 'rejected' } 
            : recipe
        )
      );
      
      // Show success message with toast
      toast({
        title: `Recipe ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Recipe "${recipes.find(r => r.id === recipeId)?.recipe_name}" has been ${action}d.`,
        status: "success",
        duration: 5000
      });
    } catch (err) {
      const error = err as Error;
      setError(`Failed to ${action} recipe: ${error.message}`);
      console.error(`Error ${action}ing recipe:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} recipe: ${error.message}`,
        status: "error",
        duration: 5000
      });
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

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => 
    recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some(ing => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ing.substituteFor && ing.substituteFor.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Recipe Review Dashboard</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md shadow-sm border overflow-hidden">
            <button
              onClick={() => setStatusFilter('pending')}
              className={cn(
                "px-3 py-2 text-sm font-medium",
                statusFilter === 'pending' ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
              )}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={cn(
                "px-3 py-2 text-sm font-medium",
                statusFilter === 'approved' ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
              )}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={cn(
                "px-3 py-2 text-sm font-medium",
                statusFilter === 'rejected' ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
              )}
            >
              Rejected
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                "px-3 py-2 text-sm font-medium",
                statusFilter === 'all' ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
              )}
            >
              All
            </button>
          </div>
          
          <button 
            onClick={fetchRecipes}
            className="p-2 rounded-md border hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-md w-full"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-md border border-red-200">
          <p>Error: {error}</p>
          <button 
            onClick={fetchRecipes}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-md border">
          {searchQuery ? 
            `No recipes found matching "${searchQuery}"` : 
            `No ${statusFilter !== 'all' ? statusFilter : ''} recipes to display`
          }
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipes.map(recipe => {
            const isExpanded = expandedRecipes.has(recipe.id);
            
            return (
              <div
                key={recipe.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{recipe.recipe_name}</h3>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        getStatusClass(recipe.status)
                      )}>
                        {recipe.status}
                      </span>
                    </div>
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
                    
                    {recipe.status !== 'approved' && (
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
                    )}
                    
                    {recipe.status !== 'rejected' && (
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
                    )}
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
                              {ing.substituteFor && (
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
      )}
    </div>
  );
} 