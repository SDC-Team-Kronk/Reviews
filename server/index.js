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

app.get('/reviews/:productId/list?sort=:sortString:asc&count=:count', async (req, res) => {
  const { productId, sortString, count } = req.params;
  let reviews;
  try {
    try {
      reviews = await getReviews(productId, sortString, count)
      res.send(reviews);
    } catch (err) {
      res.status(400).send(`Error from getReviews: ${err}`);
    }
  } catch (err) {
      res.status(400).send(`Error from review list get handler: ${err}`);
  };
});

app.get('/reviews/:productId/meta', async (req, res) => {
  let meta;
  try {
    try {
      meta = await getMetaData(req.params.productId);
      res.send(meta);
    } catch (err) {
      res.status(400).send(`Error from getMetaData: ${err}`);
    }
  } catch (err) {
    res.status(400).send(`Error from meta get handler: ${err}`);
  };
});

app.put('/reviews/report/:reviewId', async (req, res) => {
  let reported;
  try {
    try {
      reported = await report(req.params.reviewId);
      res.send(reported);
    } catch (err) {
      res.status(400).send(`Error from report: ${err}`);
    }
  } catch (err) {
    res.status(400).send(`Error from report put handler: ${err}`);
  };
});

app.post('/reviews/:productId', async (req, res) => {
  let posted;
  try {
    try {
      posted = await postReview(req.params.productId, req.body);
      res.send(posted);
    } catch (err) {
      res.status(400).send(`Error from postReview: ${err}`)
    }
  } catch (err) {
    res.status(400).send(`Error from review post handler: ${err}`);
  };
});

app.listen(port);
