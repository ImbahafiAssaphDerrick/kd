const request = require('supertest');
const app = require('../../index');

describe('E2E API Tests', () => {
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Books API', () => {
    test('GET /api/books should return array', async () => {
      const response = await request(app).get('/api/books');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/books should require title and author', async () => {
      const response = await request(app)
        .post('/api/books')
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('Borrowers API', () => {
    test('GET /api/borrowers should return array', async () => {
      const response = await request(app).get('/api/borrowers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/borrowers should require name', async () => {
      const response = await request(app)
        .post('/api/borrowers')
        .send({});
      expect(response.status).toBe(400);
    });
  });
});
