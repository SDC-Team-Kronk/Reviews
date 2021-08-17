const { Client } = require('pg');
const config = require('./config');

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('Successful Connection');
  })
  .catch((err) => {
    console.error('error from client.connect: ', err);
  });

const getReviews = async (productId, sortString, count) => {
  let sortField;
  let query = `SELECT * FROM reviews WHERE (product_id = $1) ORDER BY $2 ASC LIMIT $3;`;
  let values;
  if (sortString === 'relevant') {
    sortField = 'helpfulness';
    const sortField2 = 'date';
    query = `SELECT * FROM reviews WHERE (product_id = $1) ORDER BY $2 ASC, $3 ASC LIMIT $4;`;
    values = [productId, sortField, sortField2, count];
  } else if (sortString === 'newest') {
    sortField = 'date';
  } else if (sortString === 'helpful') {
    sortField = 'helpfulness';
  }
  if (!values) {
    values = [productId, sortField, count];
  }
  try {
    const reviewList = await client.query(query, values);
    return reviewList;
  } catch (err) {
    throw err;
  }
};

const getMetaData = async (productId) => {
  const query = `SELECT rating FROM reviews WHERE (product_id = $1);`;
  const value = [productId];
  try {
    const metaData = await client.query(query, value);
    return metaData;
  } catch (err) {
    throw err;
  }
};

const report = async (reviewId) => {
  const query = `UPDATE reviews SET reported = true WHERE (id = $1);`;
  const value = [reviewId];
  try {
    const reported = await client.query(query, value);
    return reported;
  } catch (err) {
    throw err;
  }
};

const postReview = async (productId, data) => {
  const date = new Date().getTime();
  const query = `INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, false, $7, $8, null, 0);`;
  const values = [productId, data.rating, date, data.summary, data.body, data.recommend, data.name, data.email];
  try {
    const posted = await client.query(query, values);
    return posted;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getReviews,
  getMetaData,
  report,
  postReview,
};
