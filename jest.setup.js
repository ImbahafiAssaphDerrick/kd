process.env.NODE_ENV = 'test';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
process.env.DB_NAME = process.env.DB_NAME || 'library_test';
process.env.PORT = process.env.PORT || 3001;

if (process.env.SUPPRESS_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  };
}

// Jest setup file
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  generateTestBook: (overrides = {}) => ({
    title: `Test Book ${Date.now()}`,
    author: 'Test Author',
    isbn: `978${Math.floor(Math.random() * 10000000000)}`,
    quantity: 1,
    ...overrides
  }),
  
  generateTestBorrower: (overrides = {}) => ({
    name: `Test Borrower ${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    phone: '1234567890',
    ...overrides
  })
};

// Cleanup after all tests
afterAll(async () => {
  // Add any global cleanup here
});
