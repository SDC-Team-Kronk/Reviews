const { Client } = require('pg');
const config = require('./config');

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('Successful Connection');
  })
  .catch((err) => {
    console.error('error from client.connect(): ', err);
  });

const getReviews = async (productId, sortString, count) => {
  let sortField;
  let query = `SELECT * FROM reviews WHERE (product_id = ${productId}) ORDER BY ${sortField} ASC LIMIT ${count};`;
  if (sortString === 'relevant') {
    sortField = 'helpfulness';
    const sortField2 = 'date';
    query = `SELECT * FROM reviews WHERE (product_id = ${productId}) ORDER BY ${sortField} ASC, ${sortField2} ASC LIMIT ${count};`;
  } else if (sortString === 'newest') {
    sortField = 'date';
  } else if (sortString === 'helpful') {
    sortField = 'helpfulness';
  }
  const reviews = await client.query(query, (error) => {
    if (error) {
      throw error;
    }
  });
  return reviews;
};

const getMetaData = async (productId) => {
  const query = `SELECT rating FROM reviews WHERE (product_id = ${productId});`;
  const metaData = await client.query(query, (error) => {
    if (error) {
      throw error;
    }
  });
  return metaData;
};

const report = async (reviewId) => {
  const query = `UPDATE reviews SET reported = true WHERE (id = ${Number(reviewId)});`;
  const reported = await client.query(query, (error) => {
    if (error) {
      throw error;
    }
  });
  return reported;
};

const postReview = async (productId, data) => {
  const date = new Date().getTime();
  const query = `INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (((SELECT id FROM reviews ORDER BY id DESC LIMIT 1) + 1), ${productId}, ${data.rating}, ${date}, ${data.summary}, ${data.body}, ${data.recommend}, false, ${data.name}, ${data.email}, null, 0);`;
  const posted = await client.query(query, (error) => {
    if (error) {
      throw error;
    }
  });
  return posted;
};

module.exports = {
  getReviews,
  getMetaData,
  report,
  postReview,
};
