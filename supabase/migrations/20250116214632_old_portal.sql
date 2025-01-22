/*
  # Fix RLS policies for data synchronization
  
  1. Updates
    - Modify RLS policies to allow data synchronization
    - Enable public access for initial data load
    - Maintain security while allowing necessary operations
  
  2. Changes
    - Update ingredients table policies
    - Update substitutes table policies
    - Add sync-specific policies
*/

-- Update ingredients table policies
DROP POLICY IF EXISTS "Ingredients are viewable by everyone" ON ingredients;
DROP POLICY IF EXISTS "Allow public insert to ingredients" ON ingredients;

CREATE POLICY "Public read access to ingredients"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to ingredients during sync"
  ON ingredients FOR INSERT
  WITH CHECK (true);

-- Update substitutes table policies
DROP POLICY IF EXISTS "Substitutes are viewable by everyone" ON substitutes;
DROP POLICY IF EXISTS "Allow public insert to substitutes" ON substitutes;

CREATE POLICY "Public read access to substitutes"
  ON substitutes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to substitutes during sync"
  ON substitutes FOR INSERT
  WITH CHECK (true);