-- Create pending_review table for substitute suggestions
CREATE TABLE IF NOT EXISTS pending_review (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_name TEXT NOT NULL,
  suggested_substitute TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE TRIGGER set_pending_review_updated_at
  BEFORE UPDATE ON pending_review
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Enable RLS
ALTER TABLE pending_review ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users" ON "pending_review"
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for admins" ON "pending_review"
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    'admin@example.com'  -- Replace with actual admin emails
  ));

-- Add comment
COMMENT ON TABLE pending_review IS 'User-suggested substitutes pending admin review';

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_pending_review_table',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added pending_review table for user substitute suggestions'
  )
); 