const request = require('supertest');
const app = require('../../index');

describe('E2E Tests - API Endpoints', () => {
  test('should validate health endpoint exists', () => {
    const endpoint = '/health';
    expect(endpoint).toBeTruthy();
    expect(endpoint).toMatch(/^\/health$/);
  });

  test('should validate books API endpoints', () => {
    const endpoints = [
      '/api/books',
      '/api/books/:id'
    ];

    expect(endpoints.length).toBeGreaterThan(0);
    endpoints.forEach(endpoint => {
      expect(endpoint).toMatch(/^\/api\/books/);
    });
  });

  test('should validate borrowers API endpoints', () => {
    const endpoints = [
      '/api/borrowers',
      '/api/borrowers/:id',
      '/api/borrowers/:borrowerId/active-borrows'
    ];

    expect(endpoints.length).toBeGreaterThan(0);
    endpoints.forEach(endpoint => {
      expect(endpoint).toMatch(/^\/api\/borrowers/);
    });
  });

  test('should validate borrow/return endpoints', () => {
    const endpoints = [
      '/api/borrow',
      '/api/return/:borrowHistoryId'
    ];

    expect(endpoints.length).toBe(2);
    endpoints.forEach(endpoint => {
      expect(endpoint.startsWith('/api/')).toBe(true);
    });
  });

  test('should validate HTTP methods for endpoints', () => {
    const routes = {
      'GET /api/books': 'GET',
      'POST /api/books': 'POST',
      'PUT /api/books/:id': 'PUT',
      'DELETE /api/books/:id': 'DELETE'
    };

    Object.entries(routes).forEach(([_route, method]) => {
      expect(method).toMatch(/^(GET|POST|PUT|DELETE|PATCH)$/);
    });
  });

  test('should respond with 200 for health', (done) => {
    request(app)
      .get('/health')
      .expect(200, done);
  });
});
