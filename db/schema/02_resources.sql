-- Resources Table

DROP TABLE IF EXISTS resources
CASCADE;

CREATE TABLE resources
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  link VARCHAR(255) NOT NULL,
  bitly_link VARCHAR(255) NOT NULL,
  cover_photo_url VARCHAR(255),
  description TEXT,
  tag VARCHAR(32),
  date_created TIMESTAMP NOT NULL,

  total_upvotes INTEGER NOT NULL DEFAULT 0,
  total_downvotes INTEGER NOT NULL DEFAULT 0
);
