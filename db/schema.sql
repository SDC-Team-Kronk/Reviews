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

COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/slick/Documents/Work/Immersive/Reviews2/reviews.csv' DELIMITER ',' CSV HEADER;

COPY reviews_photos(id, review_id, url) FROM '/Users/slick/Documents/Work/Immersive/Reviews2/reviews_photos.csv' DELIMITER ',' CSV HEADER;
