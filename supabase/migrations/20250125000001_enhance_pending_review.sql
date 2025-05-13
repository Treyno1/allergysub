-- Add constraints and validation rules to pending_review table
ALTER TABLE pending_review
  -- Ensure ingredient_name is not empty
  ADD CONSTRAINT ingredient_name_not_empty 
    CHECK (char_length(trim(ingredient_name)) > 0),
  
  -- Ensure suggested_substitute is not empty
  ADD CONSTRAINT suggested_substitute_not_empty 
    CHECK (char_length(trim(suggested_substitute)) > 0),
  
  -- Ensure category is not empty
  ADD CONSTRAINT category_not_empty 
    CHECK (char_length(trim(category)) > 0),
  
  -- Ensure description is at least 10 characters
  ADD CONSTRAINT description_min_length 
    CHECK (char_length(trim(description)) >= 10),

  -- Add status validation
  ADD CONSTRAINT valid_status 
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add helpful indexes
CREATE INDEX idx_pending_review_status 
  ON pending_review(status);

CREATE INDEX idx_pending_review_ingredient 
  ON pending_review(ingredient_name);

CREATE INDEX idx_pending_review_created_at 
  ON pending_review(created_at DESC);

-- Add trigger to prevent updates to approved/rejected suggestions
CREATE OR REPLACE FUNCTION prevent_pending_review_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Cannot modify suggestions that have been % already', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_pending_review_updates
  BEFORE UPDATE ON pending_review
  FOR EACH ROW
  EXECUTE FUNCTION prevent_pending_review_updates();

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'enhance_pending_review',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added constraints and indexes to pending_review table'
  )
); 