-- Drop existing recipes table if it exists
DROP TABLE IF EXISTS recipes;

-- Create enhanced recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_name TEXT NOT NULL,
  instructions TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]',
  substitutes JSONB NOT NULL DEFAULT '[]',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Add constraints
  CONSTRAINT recipe_name_not_empty CHECK (char_length(trim(recipe_name)) > 0),
  CONSTRAINT instructions_not_empty CHECK (char_length(trim(instructions)) > 0),
  CONSTRAINT ingredients_is_array CHECK (jsonb_typeof(ingredients) = 'array'),
  CONSTRAINT substitutes_is_array CHECK (jsonb_typeof(substitutes) = 'array')
);

-- Add updated_at trigger
CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Create indexes
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_recipe_name ON recipes(recipe_name);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON recipes
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON recipes
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for recipe owners" ON recipes
  AS PERMISSIVE FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for recipe owners" ON recipes
  AS PERMISSIVE FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'enhance_recipes_table',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Enhanced recipes table with new fields and constraints'
  )
); 