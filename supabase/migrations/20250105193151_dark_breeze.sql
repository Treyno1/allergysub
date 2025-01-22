/*
  # Initial Schema Setup for AllergySwap

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `created_at` (timestamp)
      
    - `substitutes`
      - `id` (uuid, primary key) 
      - `ingredient_id` (uuid, foreign key)
      - `name` (text)
      - `usage` (text[])
      - `notes` (text)
      - `safe_for` (text[])
      - `best_for` (text[])
      - `not_recommended_for` (text[])
      - `preparation_steps` (text[])
      - `created_at` (timestamp)

    - `ratings`
      - `id` (uuid, primary key)
      - `substitute_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `ingredient_id` (uuid, foreign key)
      - `substitute_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create ingredients table
CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create substitutes table
CREATE TABLE substitutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  name text NOT NULL,
  usage text[] DEFAULT '{}',
  notes text,
  safe_for text[] DEFAULT '{}',
  best_for text[] DEFAULT '{}',
  not_recommended_for text[] DEFAULT '{}',
  preparation_steps text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  substitute_id uuid REFERENCES substitutes(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  substitute_id uuid REFERENCES substitutes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, ingredient_id, substitute_id)
);

-- Enable Row Level Security
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE substitutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Ingredients are viewable by everyone" 
  ON ingredients FOR SELECT 
  USING (true);

CREATE POLICY "Substitutes are viewable by everyone" 
  ON substitutes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create ratings" 
  ON ratings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all ratings" 
  ON ratings FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own ratings" 
  ON ratings FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
  ON ratings FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites" 
  ON favorites FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);