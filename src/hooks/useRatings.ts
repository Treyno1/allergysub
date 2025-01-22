import { useState, useEffect } from 'react';
import { Rating } from '../types';

export function useRatings(substituteId: string) {
  const [ratings, setRatings] = useState<Rating[]>([]);

  // Load ratings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`ratings-${substituteId}`);
    if (stored) {
      setRatings(JSON.parse(stored));
    }
  }, [substituteId]);

  // Save ratings to localStorage
  useEffect(() => {
    localStorage.setItem(`ratings-${substituteId}`, JSON.stringify(ratings));
  }, [substituteId, ratings]);

  const addRating = (rating: number) => {
    const newRating: Rating = {
      id: Date.now().toString(),
      rating,
      timestamp: Date.now()
    };
    setRatings(prev => [...prev, newRating]);
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / ratings.length) * 2) / 2; // Round to nearest 0.5
  };

  return {
    ratings,
    addRating,
    averageRating: getAverageRating()
  };
}