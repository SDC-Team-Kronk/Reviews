import http from 'k6/http';
import { sleep } from 'k6';

const reviewIds = ['1', '15', '666', '2843', '50515', '890461', '4789123', '420', '69'];

export let options = {
  stages: [
    { target: 50, duration: '1m' },
    { target: 100, duration: '1m' },
    { target: 250, duration: '5m' }
  ]
};

export default function () {
  http.put(`http://localhost:3030/reviews/report/${reviewIds[Math.floor(Math.random() * (8 - 0 + 1)) + 0]}`);
  sleep(1);
}