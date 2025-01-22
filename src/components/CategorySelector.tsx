import React, { useState } from 'react';
import { categoryInfo } from '../data/categories';
import { Category } from '../types';
import { Loader2, Home } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
}

const categoryImages: Record<string, string> = {
  'dairy': 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg',
  'eggs': 'https://www.freightwaves.com/uploads/2018/04/Eggsbasket-1.jpg',
  'proteins': 'https://images.pexels.com/photos/9698099/pexels-photo-9698099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'grains': 'https://images.pexels.com/photos/1192053/pexels-photo-1192053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'nuts-seeds': 'https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'beverages': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'produce': 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
  'sweeteners': 'https://images.pexels.com/photos/6422025/pexels-photo-6422025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'thickeners': 'https://images.pexels.com/photos/1047326/pexels-photo-1047326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'condiments': 'https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

// Fallback image in case the main image fails to load
const fallbackImage = 'https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function CategorySelector({ selectedCategory, onCategorySelect }: CategorySelectorProps) {
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (category: Category) => {
    setLoadingImages(prev => ({ ...prev, [category]: false }));
  };

  const handleImageError = (category: Category) => {
    setLoadingImages(prev => ({ ...prev, [category]: false }));
    setFailedImages(prev => ({ ...prev, [category]: true }));
  };

  return (
    <div className="space-y-4">
      {/* Home Button */}
      {selectedCategory && (
        <button
          onClick={() => onCategorySelect(null)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 
            hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Show All Categories</span>
        </button>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(categoryInfo).map(([category, info]) => {
          const Icon = info.icon;
          const imageUrl = failedImages[category] ? fallbackImage : categoryImages[category as Category];
          
          return (
            <button
              key={category}
              onClick={() => onCategorySelect(category as Category)}
              className={`
                relative overflow-hidden rounded-lg aspect-video
                transition-all duration-200 group
                ${selectedCategory === category ? 'ring-2 ring-blue-500 scale-95' : 'hover:scale-105'}
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/80 z-10" />
              <img
                src={imageUrl}
                alt={info.label}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => handleImageLoad(category as Category)}
                onError={() => handleImageError(category as Category)}
              />

              {/* Loading State */}
              {loadingImages[category] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col items-center justify-center p-4 text-white">
                <Icon className="w-8 h-8 mb-2" />
                <h3 className="text-sm font-medium text-center">{info.label}</h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}