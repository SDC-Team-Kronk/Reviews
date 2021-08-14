const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  getReviews,
  getMetaData,
  report,
  postReview,
} = require('../db/db');

const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get('/reviews/:productId/list?sort=:sortString:asc&count=:count', (req, res) => {
  const { productId, sortString, count } = req.params;
  let reviews;
  try {
    try {
      reviews = getReviews(productId, sortString, count)
    } finally {
      res.send(reviews);
    }
  } catch (err) {
      res.status(400).send(`Error from meta get handler: ${err}`);
  };
});

app.get('/reviews/:productId/meta', async (req, res) => {
  let meta;
  try {
    try {
      meta = getMetaData(req.params.productId);
    } finally {
      res.send(meta);
    }
  } catch (err) {
    res.status(400).send(`Error from meta get handler: ${err}`);
  };
});

app.put('/reviews/report/:reviewId', (req, res) => {
  report(req.params.reviewId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(`Error from report put handler: ${err}`);
    });
});

app.post('/reviews/:productId', (req, res) => {
  postReview(req.params.productId, req.data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(`Error from review post handler: ${err}`);
    });
});

app.listen(port);
