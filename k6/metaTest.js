import http from 'k6/http';
import { sleep } from 'k6';

const productIds = ['1', '2', '4', '5', '653044', '653052', '653061', '653085', '661376'];

export let options = {
  stages: [
    { target: 50, duration: '1m' },
    { target: 100, duration: '1m' },
    { target: 250, duration: '5m' }
  ]
};

export default function () {
  http.get(`http://localhost:3030/reviews/${productIds[Math.floor(Math.random() * (8 - 0 + 1)) + 0]}/meta`);
  sleep(1);
}