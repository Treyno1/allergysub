-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  instructions TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON "recipes"
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "recipes"
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_recipes_table',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added recipes table with RLS policies'
  )
); 