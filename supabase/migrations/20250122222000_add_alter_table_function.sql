-- Create function to add column to table
CREATE OR REPLACE FUNCTION public.alter_table_add_column(
  table_name text,
  column_name text,
  column_type text
) RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %s', table_name, column_name, column_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service_role
GRANT EXECUTE ON FUNCTION public.alter_table_add_column(text, text, text) TO service_role;

-- Add comment to function
COMMENT ON FUNCTION public.alter_table_add_column IS 'Adds a column to a table if it does not exist';

-- Log migration
INSERT INTO public.sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_alter_table_function',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added alter_table_add_column function'
  )
); 