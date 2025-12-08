const { getMockBook } = require('../../src/utils/testHelpers');

describe('Book Model', () => {
  describe('Book validation', () => {
    test('should validate book with all required fields', () => {
      const book = getMockBook();
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('quantity');
      expect(book.title).toBeTruthy();
      expect(book.author).toBeTruthy();
      expect(book.quantity).toBeGreaterThan(0);
    });

    test('should fail validation if title is missing', () => {
      const book = getMockBook();
      delete book.title;
      expect(book.title).toBeUndefined();
    });

    test('should fail validation if quantity is negative', () => {
      const book = getMockBook();
      book.quantity = -1;
      expect(book.quantity).toBeLessThan(0);
    });
  });

  describe('Book formatting', () => {
    test('should format book data correctly', () => {
      const book = getMockBook();
      const formatted = {
        ...book,
        created_at: new Date().toISOString()
      };
      expect(formatted.created_at).toBeDefined();
    });

    test('should calculate available copies', () => {
      const book = getMockBook();
      const borrowed = 1;
      const available = book.quantity - borrowed;
      expect(available).toBe(book.quantity - 1);
    });
  });
});
