-- CategoryResource Table Create

DROP TABLE IF EXISTS category_resource
CASCADE;

CREATE TABLE category_resource
(
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON TABLE category_resource TO labber;
