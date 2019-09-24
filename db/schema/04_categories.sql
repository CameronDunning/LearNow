-- Categories Table Create

DROP TABLE IF EXISTS categories
CASCADE;

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

GRANT ALL PRIVILEGES ON TABLE categories TO labber;
