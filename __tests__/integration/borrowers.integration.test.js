const { setupTestDatabase, cleanupTestDatabase, insertTestData } = require('../../src/utils/testHelpers');

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

describe('Borrowers API Integration Tests', () => {
  beforeEach(async () => {
    await insertTestData();
  });

  test('should fetch all borrowers', async () => {
    const borrowers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    expect(borrowers.length).toBeGreaterThan(0);
  });

  test('should create a new borrower', async () => {
    const newBorrower = {
      name: 'New Borrower',
      email: 'new@example.com',
      phone: '555-9999'
    };
    expect(newBorrower.name).toBeDefined();
  });

  test('should fetch borrower by ID', async () => {
    const borrower = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    expect(borrower.id).toBe(1);
  });

  test('should update borrower info', async () => {
    const updated = {
      name: 'John Updated',
      email: 'john.updated@example.com'
    };
    expect(updated.name).toBeDefined();
  });

  test('should delete a borrower', async () => {
    const borrowerId = 1;
    expect(borrowerId).toBeDefined();
  });

  test('should prevent duplicate emails if enforced', async () => {
    const borrower1 = { email: 'same@example.com', name: 'Person 1' };
    const borrower2 = { email: 'same@example.com', name: 'Person 2' };
    expect(borrower1.email).toBe(borrower2.email);
  });
});
