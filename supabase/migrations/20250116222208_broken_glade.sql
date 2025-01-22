-- First, identify and remove duplicates keeping the most complete record
WITH duplicate_substitutes AS (
  SELECT 
    s.id,
    ROW_NUMBER() OVER (
      PARTITION BY i.name, s.name 
      ORDER BY 
        array_length(s.usage, 1) DESC NULLS LAST,
        array_length(s.best_for, 1) DESC NULLS LAST,
        array_length(s.preparation_steps, 1) DESC NULLS LAST,
        s.created_at DESC
    ) as rn
  FROM substitutes s
  JOIN ingredients i ON i.id = s.ingredient_id
)
DELETE FROM substitutes
WHERE id IN (
  SELECT id 
  FROM duplicate_substitutes 
  WHERE rn > 1
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'unique_ingredient_substitute'
  ) THEN
    ALTER TABLE substitutes 
    ADD CONSTRAINT unique_ingredient_substitute 
    UNIQUE (ingredient_id, name);
  END IF;
END $$;

-- Add index for better query performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_substitutes_ingredient_name 
ON substitutes(ingredient_id, name);

-- Log the cleanup operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'cleanup_duplicates',
    'timestamp', CURRENT_TIMESTAMP,
    'action', 'Removed duplicate substitutes and added constraints'
  )
);