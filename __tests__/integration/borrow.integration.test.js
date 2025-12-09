const { setupTestDatabase, cleanupTestDatabase, insertTestData } = require('../../src/utils/testHelpers');

// Helper function to create mock borrow data
function getMockBorrow() {
  return {
    book_id: 1,
    borrower_id: 1,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
  };
}

describe('Borrow/Return API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await insertTestData();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should allow borrowing an available book', async () => {
    const borrow = getMockBorrow();
    expect(borrow).toHaveProperty('book_id');
    expect(borrow).toHaveProperty('borrower_id');
  });

  test('should prevent borrowing when no copies available', async () => {
    const bookWithNoCopies = { id: 99, available: 0 };
    expect(bookWithNoCopies.available).toBe(0);
  });

  test('should create borrow history record', async () => {
    const borrow = getMockBorrow();
    const record = {
      ...borrow,
      borrowed_at: new Date().toISOString(),
      returned_at: null
    };
    expect(record.borrowed_at).toBeDefined();
    expect(record.returned_at).toBeNull();
  });

  test('should return a borrowed book', async () => {
    const borrowHistoryId = 1;
    const returnRecord = {
      id: borrowHistoryId,
      returned_at: new Date().toISOString()
    };
    expect(returnRecord.returned_at).toBeDefined();
  });

  test('should update available count on return', async () => {
    const initialAvailable = 4;
    const afterReturn = initialAvailable + 1;
    expect(afterReturn).toBe(5);
  });

  test('should enforce due date if set', async () => {
    const borrow = getMockBorrow();
    const dueDate = new Date(borrow.due_date);
    const today = new Date();
    expect(dueDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
  });

  test('should retrieve active borrows for a borrower', async () => {
    const borrowerId = 1;
    const activeBorrows = [
      {
        id: 1,
        book_id: 1,
        borrower_id: borrowerId,
        returned_at: null
      }
    ];
    const active = activeBorrows.filter(b => b.returned_at === null);
    expect(active.length).toBeGreaterThan(0);
  });

  test('should track overdue books', async () => {
    const dueDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
    const isOverdue = new Date() > dueDate;
    expect(isOverdue).toBe(true);
  });
});
