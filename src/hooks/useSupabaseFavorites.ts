import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useSupabaseFavorites() {
  const { user } = useSupabaseAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          ingredients (*),
          substitutes (*)
        `)
        .eq('user_id', user.id);

      if (!error) {
        setFavorites(data || []);
      }
      setLoading(false);
    }

    fetchFavorites();

    const subscription = supabase
      .channel('favorites_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'favorites', filter: `user_id=eq.${user.id}` },
        fetchFavorites
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const toggleFavorite = async (ingredientId: string, substituteId: string) => {
    if (!user) return;

    const existing = favorites.find(f => 
      f.ingredient_id === ingredientId && 
      f.substitute_id === substituteId
    );

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
    } else {
      await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          ingredient_id: ingredientId,
          substitute_id: substituteId
        });
    }
  };

  return { favorites, loading, toggleFavorite };
}