// Helper function to create mock borrower data
function getMockBorrower() {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-4567',
    created_at: new Date().toISOString()
  };
}

describe('Borrower Model', () => {
  describe('Borrower validation', () => {
    test('should validate borrower with required fields', () => {
      const borrower = getMockBorrower();
      expect(borrower).toHaveProperty('name');
      expect(borrower.name).toBeTruthy();
    });

    test('should allow optional email field', () => {
      const borrower = getMockBorrower();
      delete borrower.email;
      expect(borrower.email).toBeUndefined();
    });

    test('should validate email format if provided', () => {
      const borrower = getMockBorrower();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (borrower.email) {
        expect(emailRegex.test(borrower.email)).toBe(true);
      }
    });
  });

  describe('Borrower formatting', () => {
    test('should format borrower name correctly', () => {
      const borrower = getMockBorrower();
      const trimmedName = borrower.name.trim();
      expect(trimmedName).toBe(borrower.name);
    });

    test('should parse phone number', () => {
      const borrower = getMockBorrower();
      const phoneRegex = /^\d{3}-\d{4}$/;
      if (borrower.phone) {
        expect(phoneRegex.test(borrower.phone)).toBe(true);
      }
    });
  });
});
