import { useState, useEffect } from 'react';
import { Home, Heart, BookOpen, Settings, Book } from 'lucide-react';
import { Category, Ingredient, DietaryRestriction } from './types';
import SearchBar from './components/SearchBar';
import CategorySelector from './components/CategorySelector';
import IngredientCard from './components/IngredientCard';
import FavoritesMenu from './components/FavoritesMenu';
import RecipeSubmission from './components/RecipeSubmission';
import ReviewRecipes from './components/ReviewRecipes';
import PublicRecipes from './components/PublicRecipes';
import AdminAuth from './components/AdminAuth';
import AllergyFilters from './components/AllergyFilters';
import { useIngredientFilter } from './hooks/useIngredientFilter';
import { useFavorites } from './hooks/useFavorites';
import { useSupabaseData } from './hooks/useSupabaseData';
import { ToastProvider } from './components/ui/use-toast';

function App() {
  console.log('App component rendering');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showRecipeSubmission, setShowRecipeSubmission] = useState(false);
  const [showReviewRecipes, setShowReviewRecipes] = useState(false);
  const [showPublicRecipes, setShowPublicRecipes] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const { ingredients, loading, error } = useSupabaseData();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Check for admin button visibility preference in localStorage
  useEffect(() => {
    const adminButtonVisible = localStorage.getItem('showAdminButton');
    if (adminButtonVisible === 'true') {
      setShowAdminButton(true);
    }

    // Simpler key combination to show admin button (Shift + A + B + C)
    let keysPressed = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);
      
      // Check if all required keys are pressed (Shift + A + B + C)
      const isShiftPressed = e.shiftKey;
      const isAPressed = keysPressed.has('A') || keysPressed.has('a');
      const isBPressed = keysPressed.has('B') || keysPressed.has('b');
      const isCPressed = keysPressed.has('C') || keysPressed.has('c');
      
      if (isShiftPressed && isAPressed && isBPressed && isCPressed) {
        setShowAdminButton(true);
        localStorage.setItem('showAdminButton', 'true');
        console.log('Admin button revealed!');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Callback function to update admin authentication state
  const handleAdminAuth = (isAuthenticated: boolean) => {
    setIsAdminAuthenticated(isAuthenticated);
    
    // If logging out, also hide the admin button
    if (!isAuthenticated) {
      setShowAdminButton(false);
      localStorage.removeItem('showAdminButton');
    }
  };
  
  useEffect(() => {
    console.log('Ingredients loaded:', ingredients);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [ingredients, loading, error]);

  const {
    searchQuery,
    setSearchQuery,
    filteredIngredients
  } = useIngredientFilter(ingredients);

  const {
    favorites,
    isOpen: isFavoritesOpen,
    setIsOpen: setFavoritesOpen,
    toggleFavorite,
    isFavorite,
    removeFavorite
  } = useFavorites();

  // Function to handle view switching
  const handleViewChange = (view: 'ingredients' | 'submit' | 'review' | 'recipes') => {
    setShowRecipeSubmission(view === 'submit');
    setShowReviewRecipes(view === 'review');
    setShowPublicRecipes(view === 'recipes');
  };

  // Filter ingredients by selected category and dietary filters
  const categoryFiltered = selectedCategory
    ? filteredIngredients.filter(i => i.category === selectedCategory)
    : filteredIngredients;

  const displayedIngredients = selectedFilters.length > 0
    ? categoryFiltered.filter(ingredient =>
        selectedFilters.every(filter =>
          ingredient.substitutes.some(sub => 
            sub.safeFor?.dietaryRestrictions?.includes(filter as DietaryRestriction)
          )
        )
      )
    : categoryFiltered;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-red-600 text-xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Home className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-semibold text-gray-900">AllergySub</h1>
                </div>
                <p className="text-sm text-gray-500 mt-1">Find safe and delicious substitutes for common allergens and ingredients</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleViewChange(showPublicRecipes ? 'ingredients' : 'recipes')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${showPublicRecipes ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'} focus:outline-none`}
                >
                  <Book className={`w-5 h-5 ${showPublicRecipes ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="hidden sm:inline">
                    {showPublicRecipes ? 'Browse Ingredients' : 'Recipes'}
                  </span>
                </button>
                <button
                  onClick={() => handleViewChange(showRecipeSubmission ? 'ingredients' : 'submit')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${showRecipeSubmission ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'} focus:outline-none`}
                >
                  <BookOpen className={`w-5 h-5 ${showRecipeSubmission ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="hidden sm:inline">
                    {showRecipeSubmission ? 'Browse Ingredients' : 'Submit Recipe'}
                  </span>
                </button>
                {showAdminButton && (
                  <button
                    onClick={() => handleViewChange(showReviewRecipes ? 'ingredients' : 'review')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${showReviewRecipes ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'} focus:outline-none`}
                  >
                    <Settings className={`w-5 h-5 ${showReviewRecipes ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="hidden sm:inline">
                      {showReviewRecipes ? 'Browse Ingredients' : 'Admin'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setFavoritesOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  <span className="hidden sm:inline">Saved Items</span>
                  {favorites.length > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showRecipeSubmission ? (
            <RecipeSubmission />
          ) : showReviewRecipes ? (
            <AdminAuth onAuthStatusChange={handleAdminAuth}>
              <ReviewRecipes />
            </AdminAuth>
          ) : showPublicRecipes ? (
            <PublicRecipes />
          ) : (
            <>
              {/* Category Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
                  Click below to find alternatives for:
                </h2>
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>

              {/* Allergy Filters */}
              <AllergyFilters onFilterChange={setSelectedFilters} />

              {/* Search Bar */}
              <div className="mb-8">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search for ingredients..."
                />
              </div>

              {/* Ingredient Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedIngredients.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    isFavorite={isFavorite}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Favorites Menu */}
        <FavoritesMenu
          isOpen={isFavoritesOpen}
          onClose={() => setFavoritesOpen(false)}
          favorites={favorites}
          onRemove={removeFavorite}
        />
      </div>
    </ToastProvider>
  );
}

export default App;