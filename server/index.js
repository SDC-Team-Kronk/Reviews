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

app.get('/reviews/:productId/list', async (req, res) => {
  const { productId } = req.params;
  const { sort, count } = req.query;
  let reviews;
  try {
    reviews = await getReviews(productId, sort, count);
    const reviewsFormatted = {
      results: [],
    };
    for (let i = 0; i < reviews.rows.length; i += 1) {
      const milli = reviews.rows[i].date * 1000;
      const dateObj = new Date(milli);
      const humanDateFormat = dateObj.toLocaleString();
      reviews.rows[i].date = humanDateFormat;
      reviewsFormatted.results.push(reviews.rows[i]);
    }
    console.log(reviewsFormatted);
    res.send(reviewsFormatted);
  } catch (err) {
    res.status(400).send(`Error from review list get handler: ${err}`);
  }
});

app.get('/reviews/:productId/meta', async (req, res) => {
  let meta;
  try {
    meta = await getMetaData(req.params.productId);
    const metaFormatted = {
      ratings: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
    for (let i = 0; i < meta.rows.length; i += 1) {
      const x = meta.rows[i].rating;
      metaFormatted.ratings[x] += 1;
    }
    res.send(metaFormatted);
  } catch (err) {
    res.status(400).send(`Error from meta get handler: ${err}`);
  }
});

app.put('/reviews/report/:reviewId', async (req, res) => {
  let reported;
  try {
    reported = await report(req.params.reviewId);
    res.send(reported);
  } catch (err) {
    res.status(400).send(`Error from report put handler: ${err}`);
  }
});

app.post('/reviews/:productId', async (req, res) => {
  let posted;
  try {
    posted = await postReview(req.params.productId, req.body);
    res.send(posted);
  } catch (err) {
    res.status(400).send(`Error from review post handler: ${err}`);
  }
});

app.listen(port, () => {
  console.log('Listening on port ', port);
});
