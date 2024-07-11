import request from 'supertest';
import express from 'express';
import errorMiddleware from './errorMiddleware';

const app = express();

app.get('/error', (req, res) => {
  throw new Error('Test error');
});

app.use(errorMiddleware);

describe('Error Middleware', () => {
  it('should handle errors and return 500 status', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});
