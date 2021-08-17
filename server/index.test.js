const index = require('./index');
const axios = require('axios');
const { Pool } = require('pg');
const config = require('../db/config');

test('get reviews pulls a list of no more than 5 reviews of the correct product in the correct order', () => {
  axios.get('localhost:3030/reviews/1/list?sort=relevant&count=5')
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        expect(data.results[i].product_id).toBe(1);
      }
      expect(data.results.length).toBeLessThanOrEqual(5);
      expect(data.results[0].date.getTime()).toBeGreaterThanOrEqual(data.results[1].date.getTime());
    })
    .catch((err) => {
      console.error('Error from review list test: ', err);
    });
});

test('get metadata pulls an obj with properties 1-5 with non-negative values', () => {
  axios.get('localhost:3030/reviews/1/meta')
    .then((data) => {
      for (let key in data.ratings) {
        expect(data.ratings[key]).toBeGreaterThanOrEqual(0);
      }
    })
    .catch((err) => {
      console.error('Error from get meta test: ', err);
    })
})

describe('testing database put and post', () => {
  let pool;
  beforeAll(() => {
    pool = new Pool(config);
  });
  afterAll(async () => {
    await pool.end();
  });
  it('should change reported to true', async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await axios.put('localhost:3030/reviews/report/157');
      const { rows } = await client.query('SELECT reported FROM reviews WHERE (id = 157)');
      expect(rows[0].reported).toBe(true);
      await client.query('ROLLBACK');
    } catch (err) {
      console.error('Error from report test: ', err);
    } finally {
      client.release();
    }
  })
  it('should post a review', async () => {
    const client = await pool.connect();
    const body = {
      rating: 5,
      summary: 'many jello makes light bulb',
      body: 'goomblebops',
      recommend: true,
      name: 'farfignoogen',
      email: 'hand@foot.knee'
    }
    try {
      await client.query('BEGIN');
      await axios.post('localhost:3030/reviews/1', body)
      const { rows } = await client.query('SELECT body FROM reviews ORDER BY id DESC LIMIT 1');
      expect(rows[0].body).toBe('goomblebops');
      await client.query('ROLLBACK');
    } catch (err) {
      console.error('Error from post test: ', err);
    } finally {
      client.release();
    }
  })
})