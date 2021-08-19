DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reviews_photos;

CREATE TABLE reviews(
  id serial primary key,
  product_id int not null,
  rating smallint,
  date bigint,
  summary varchar(1000),
  body varchar(1000) not null,
  recommend boolean,
  reported boolean,
  reviewer_name varchar(100),
  reviewer_email varchar(100),
  response varchar(1000),
  helpfulness int
);

CREATE TABLE reviews_photos(
  id serial primary key,
  review_id int not null,
  url varchar(1000)
);

COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM 'reviews.csv' DELIMITER ',' CSV HEADER;

COPY reviews_photos(id, review_id, url) FROM 'reviews_photos.csv' DELIMITER ',' CSV HEADER;

ALTER SEQUENCE reviews_id_seq RESTART WITH 5774953;

ALTER SEQUENCE reviews_photos_id_seq RESTART WITH 2742541;

CREATE INDEX idx_reviews_product_id ON reviews(product_id);

CREATE INDEX idx_reviews_review_id ON reviews(id);