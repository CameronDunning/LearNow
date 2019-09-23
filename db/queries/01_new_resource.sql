-- Inputs:
-- new resource OBJ
-- categories ARR

-- Commands:
-- Check which categories don't already exist

SELECT name
FROM categories
WHERE name in ($1, $2, ...)

-- This returns an OBJECT of all the categories that already exist
-- Compare this to the array of all the categories and find which ones are new

-- Insert the resource, get the resource ID so it can be linked to the categories

INSERT INTO resources
  (user_id, title, link, description)
VALUES
  ($1,  )
RETURNING
id;

-- This returns the ID of the new resource, we'll combine that and all the categories below

-- Create new categories based on the OBJECT of new categories

INSERT INTO categories
  (name)
VALUES
  ($1),
  ($2),
  (...);

-- Combine categories and resource ID:

INSERT INTO category_resource
  (resource_id, category_id)
VALUES
  ($1, $2),
  ($1, $3),
  (...);




