export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          name: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          name: string
          instructions: string
          ingredients: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          instructions: string
          ingredients: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          instructions?: string
          ingredients?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
      substitutes: {
        Row: {
          id: string
          ingredient_id: string
          name: string
          usage: string[]
          notes: string | null
          safe_for: string[]
          best_for: string[]
          not_recommended_for: string[]
          preparation_steps: string[]
          quantity_conversion: string | null
          image_url: string | null
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ingredient_id: string
          name: string
          usage?: string[]
          notes?: string | null
          safe_for?: string[]
          best_for?: string[]
          not_recommended_for?: string[]
          preparation_steps?: string[]
          quantity_conversion?: string | null
          image_url?: string | null
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ingredient_id?: string
          name?: string
          usage?: string[]
          notes?: string | null
          safe_for?: string[]
          best_for?: string[]
          not_recommended_for?: string[]
          preparation_steps?: string[]
          quantity_conversion?: string | null
          image_url?: string | null
          alt_text?: string | null
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          substitute_id: string
          rating: number
          comment: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          substitute_id: string
          rating: number
          comment?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          substitute_id?: string
          rating?: number
          comment?: string | null
          user_id?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          ingredient_id: string
          substitute_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ingredient_id: string
          substitute_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ingredient_id?: string
          substitute_id?: string
          created_at?: string
        }
      }
      sync_log: {
        Row: {
          id: string
          created_at: string
          status: string
          details: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          status: string
          details?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: string
          details?: Json | null
        }
      }
    }
  }
}