-- Migration to update substitute image URLs
BEGIN;

-- Create a temporary table to log updates
CREATE TEMP TABLE update_log (
    substitute_name TEXT,
    old_image_url TEXT,
    new_image_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Aquafaba
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f394'
WHERE name = 'Aquafaba'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f394'
INTO TEMP update_log;

-- Update Coconut Flour
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f395'
WHERE name = 'Coconut Flour'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f395'
INTO TEMP update_log;

-- Update TVP
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f396'
WHERE name = 'Textured Vegetable Protein'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f396'
INTO TEMP update_log;

-- Update Tempeh
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f397'
WHERE name = 'Tempeh'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f397'
INTO TEMP update_log;

-- Update Hemp Seeds
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f398'
WHERE name = 'Hemp Seeds'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f398'
INTO TEMP update_log;

-- Update Roasted Chickpeas
UPDATE substitutes
SET image_url = 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f399'
WHERE name = 'Roasted Chickpeas'
  AND (image_url IS NULL OR image_url = '')
RETURNING name, image_url, 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f399'
INTO TEMP update_log;

-- Log the updates to a permanent table
CREATE TABLE IF NOT EXISTS substitute_update_logs (
    id SERIAL PRIMARY KEY,
    substitute_name TEXT,
    old_image_url TEXT,
    new_image_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the logs into the permanent table
INSERT INTO substitute_update_logs (substitute_name, old_image_url, new_image_url, updated_at)
SELECT substitute_name, old_image_url, new_image_url, updated_at
FROM update_log;

-- Drop the temporary table
DROP TABLE update_log;

COMMIT; 