/*
  # Fix sync_log table RLS policies
  
  1. Changes
    - Update sync_log table policies to allow public access
    - Enable necessary operations for sync functionality
  
  2. Security
    - Maintain basic security while allowing sync operations
    - Enable public access for essential sync functionality
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Sync logs are viewable by everyone" ON sync_log;
DROP POLICY IF EXISTS "Authenticated users can create sync logs" ON sync_log;

-- Create new policies for sync_log table
CREATE POLICY "Public read access to sync_log"
  ON sync_log FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to sync_log"
  ON sync_log FOR INSERT
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_sync_log_created_at 
  ON sync_log(created_at DESC);