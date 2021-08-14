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

const getReviews = (productId, sortString, count) => {
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

  return client.query(query, values, (error) => {
    if (error) {
      throw error;
    }
  });
};

const getMetaData = (productId) => {
  const query = `SELECT rating FROM reviews WHERE (product_id = $1);`;
  const value = [productId];
  return client.query(query, value, (error) => {
    if (error) {
      throw error;
    }
  });
};

const report = (reviewId) => {
  const query = `UPDATE reviews SET reported = true WHERE (id = $1);`;
  const value = [reviewId];
  return client.query(query, value, (error) => {
    if (error) {
      throw error;
    }
  });
};

const postReview = (productId, data) => {
  const date = new Date().getTime();
  const query = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8, null, 0);`;
  const values = [productId, data.rating, date, data.summary, data.body, data.recommend, data.name, data.email];
  return client.query(query, values, (error) => {
    if (error) {
      throw error;
    }
  });
};

module.exports = {
  getReviews,
  getMetaData,
  report,
  postReview,
};
