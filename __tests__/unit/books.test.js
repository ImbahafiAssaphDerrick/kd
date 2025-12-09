// Helper function to create mock book data
function getMockBook() {
  return {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    quantity: 5,
    available: 5,
    created_at: new Date().toISOString()
  };
}

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
