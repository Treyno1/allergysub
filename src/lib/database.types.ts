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
          created_at?: string
        }
      }
    }
  }
}