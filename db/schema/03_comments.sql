-- Comments

DROP TABLE IF EXISTS comments
CASCADE;

CREATE TABLE comments
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,

  comment TEXT,
  upvote BOOLEAN NOT NULL DEFAULT false,
  downvote BOOLEAN NOT NULL DEFAULT false,
  date_created TIMESTAMP NOT NULL
);
