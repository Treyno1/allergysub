-- Create sync_log table to track synchronization history
CREATE TABLE sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'success',
  details jsonb
);

-- Enable RLS
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view sync logs
CREATE POLICY "Sync logs are viewable by everyone" 
  ON sync_log FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to create sync logs
CREATE POLICY "Authenticated users can create sync logs" 
  ON sync_log FOR INSERT 
  TO authenticated 
  WITH CHECK (true);