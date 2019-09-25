-- Resources Table Create

DROP TABLE IF EXISTS resources
CASCADE;

CREATE TABLE resources
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255),
  link VARCHAR(255) NOT NULL,
  bitly_link VARCHAR(255),
  cover_photo_url VARCHAR(255),
  description TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT Now(),

  url_title TEXT,
  url_author TEXT,
  url_description TEXT,

  total_upvotes INTEGER NOT NULL DEFAULT 0,
  total_downvotes INTEGER NOT NULL DEFAULT 0
);

GRANT ALL PRIVILEGES ON TABLE resources TO labber;
