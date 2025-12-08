const mysql = require('mysql2/promise');

/**
 * Create database connection for testing
 */
async function getTestConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
  });
}

/**
 * Setup test database
 */
async function setupTestDatabase() {
  const connection = await getTestConnection();
  try {
    // Clear all tables
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    await connection.execute('TRUNCATE TABLE borrow_history');
    await connection.execute('TRUNCATE TABLE borrowers');
    await connection.execute('TRUNCATE TABLE books');
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
  } finally {
    await connection.end();
  }
}

/**
 * Cleanup test database
 */
async function cleanupTestDatabase() {
  const connection = await getTestConnection();
  try {
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    await connection.execute('DROP TABLE IF EXISTS borrow_history');
    await connection.execute('DROP TABLE IF EXISTS borrowers');
    await connection.execute('DROP TABLE IF EXISTS books');
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
  } finally {
    await connection.end();
  }
}

/**
 * Insert test data
 */
async function insertTestData() {
  const connection = await getTestConnection();
  try {
    // Insert test books
    await connection.execute(
      'INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)',
      ['The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 5, 5]
    );
    await connection.execute(
      'INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)',
      ['To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 3, 3]
    );

    // Insert test borrowers
    await connection.execute(
      'INSERT INTO borrowers (name, email, phone) VALUES (?, ?, ?)',
      ['John Doe', 'john@example.com', '555-1234']
    );
    await connection.execute(
      'INSERT INTO borrowers (name, email, phone) VALUES (?, ?, ?)',
      ['Jane Smith', 'jane@example.com', '555-5678']
    );
  } finally {
    await connection.end();
  }
}

/**
 * Get mock data for tests
 */
function getMockBook() {
  return {
    title: 'Test Book',
    author: 'Test Author',
    isbn: '978-0-0000-0000-0',
    quantity: 2
  };
}

function getMockBorrower() {
  return {
    name: 'Test Borrower',
    email: 'test@example.com',
    phone: '555-0000'
  };
}

function getMockBorrow() {
  return {
    book_id: 1,
    borrower_id: 1,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
}

module.exports = {
  getTestConnection,
  setupTestDatabase,
  cleanupTestDatabase,
  insertTestData,
  getMockBook,
  getMockBorrower,
  getMockBorrow
};
