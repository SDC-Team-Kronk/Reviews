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

app.get('/reviews/:productId/list?sort=:sortString:asc&count=:count}', (req, res) => {
  const { productId, sortString, count } = req.params;

  getReviews(productId, sortString, count)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(`Error from meta get handler: ${err}`);
    });
});

app.get('/reviews/:productId/meta', (req, res) => {
  getMetaData(req.params.productId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(`Error from meta get handler: ${err}`);
    });
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
