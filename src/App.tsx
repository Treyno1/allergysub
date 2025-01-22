import { useState, useEffect } from 'react';
import { Home, Heart } from 'lucide-react';
import { Category } from './types';
import SearchBar from './components/SearchBar';
import CategorySelector from './components/CategorySelector';
import IngredientCard from './components/IngredientCard';
import FavoritesMenu from './components/FavoritesMenu';
import { useIngredientFilter } from './hooks/useIngredientFilter';
import { useFavorites } from './hooks/useFavorites';
import { useSupabaseData } from './hooks/useSupabaseData';

function App() {
  console.log('App component rendering');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { ingredients, loading, error } = useSupabaseData();
  
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

  // Filter ingredients by selected category
  const displayedIngredients = selectedCategory
    ? filteredIngredients.filter(i => i.category === selectedCategory)
    : filteredIngredients;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-red-600 text-xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search ingredients, substitutes, or filter by dietary needs..."
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-2">Loading ingredients...</p>
            </div>
          ) : displayedIngredients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No alternatives found
              </p>
              <p className="text-gray-400">
                Try searching for different ingredients or uses
              </p>
            </div>
          ) : (
            displayedIngredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onFavoriteToggle={toggleFavorite}
                isFavorite={isFavorite}
              />
            ))
          )}
        </div>
      </main>

      {/* Favorites Menu */}
      <FavoritesMenu
        isOpen={isFavoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onRemove={removeFavorite}
      />
    </div>
  );
}

export default App;