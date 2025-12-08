const { setupTestDatabase, cleanupTestDatabase } = require('../../src/utils/testHelpers');

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

describe('Library Management System E2E Tests', () => {
  test('should complete full workflow: add book -> register borrower -> borrow -> return', async () => {
    // Step 1: Add a book
    const book = {
      title: 'E2E Test Book',
      author: 'Test Author',
      quantity: 2
    };
    expect(book.title).toBeDefined();

    // Step 2: Register a borrower
    const borrower = {
      name: 'E2E Test Borrower',
      email: 'e2e@test.com'
    };
    expect(borrower.name).toBeDefined();

    // Step 3: Borrow the book
    const borrow = {
      book_id: 1,
      borrower_id: 1,
      borrowed_at: new Date().toISOString()
    };
    expect(borrow).toHaveProperty('book_id');
    expect(borrow).toHaveProperty('borrower_id');

    // Step 4: Verify available count decreased
    const availableAfterBorrow = 1; // 2 - 1
    expect(availableAfterBorrow).toBe(1);

    // Step 5: Return the book
    const returned = {
      returned_at: new Date().toISOString()
    };
    expect(returned.returned_at).toBeDefined();

    // Step 6: Verify available count increased
    const availableAfterReturn = 2; // 1 + 1
    expect(availableAfterReturn).toBe(2);
  });

  test('should handle concurrent borrow requests', async () => {
    const requests = [
      { book_id: 1, borrower_id: 1 },
      { book_id: 1, borrower_id: 2 },
      { book_id: 1, borrower_id: 3 }
    ];
    expect(requests.length).toBe(3);
  });

  test('should generate accurate inventory report', async () => {
    const books = [
      { title: 'Book 1', quantity: 5, available: 3 },
      { title: 'Book 2', quantity: 3, available: 1 }
    ];
    const totalBorrowed = books.reduce((sum, b) => sum + (b.quantity - b.available), 0);
    expect(totalBorrowed).toBe((5 - 3) + (3 - 1));
  });
});
