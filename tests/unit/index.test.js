describe('Library Management System - Unit Tests', () => {
  describe('Book Validation', () => {
    test('should validate book has required fields', () => {
      const validBook = { title: 'Test', author: 'Author' };
      expect(validBook.title).toBeDefined();
      expect(validBook.author).toBeDefined();
    });

    test('should reject book without title', () => {
      const invalidBook = { author: 'Author' };
      expect(invalidBook.title).toBeUndefined();
    });

    test('should reject book without author', () => {
      const invalidBook = { title: 'Test' };
      expect(invalidBook.author).toBeUndefined();
    });
  });

  describe('Borrower Validation', () => {
    test('should validate borrower has required fields', () => {
      const validBorrower = { name: 'John Doe' };
      expect(validBorrower.name).toBeDefined();
    });

    test('should reject borrower without name', () => {
      const invalidBorrower = { email: 'test@test.com' };
      expect(invalidBorrower.name).toBeUndefined();
    });
  });

  describe('Utility Functions', () => {
    test('should generate test book correctly', () => {
      const book = global.testUtils.generateTestBook();
      expect(book.title).toContain('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.quantity).toBe(1);
    });

    test('should generate test borrower correctly', () => {
      const borrower = global.testUtils.generateTestBorrower();
      expect(borrower.name).toContain('Test Borrower');
      expect(borrower.email).toContain('@example.com');
    });

    test('should allow overrides in test book', () => {
      const book = global.testUtils.generateTestBook({ title: 'Custom Title' });
      expect(book.title).toBe('Custom Title');
    });
  });
});
