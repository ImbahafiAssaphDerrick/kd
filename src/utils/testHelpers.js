const mysql = require('mysql2/promise');

/**
 * Minimal test helper for integration/e2e tests.
 * - Parses DB_HOST which may be "host" or "host:port"
 * - Defaults to 127.0.0.1:3306 (IPv4) to avoid ::1 socket issues
 * - Exposes: getTestConnection(), setupTestDatabase(), cleanupTestDatabase()
 */

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'library_test';

function parseHostPort(value) {
  if (!value) return { host: DEFAULT_HOST, port: DEFAULT_PORT };
  if (value.includes(':')) {
    const [h, p] = value.split(':');
    return { host: h || DEFAULT_HOST, port: Number(p) || DEFAULT_PORT };
  }
  return { host: value, port: DEFAULT_PORT };
}

async function getTestConnection() {
  const hostEnv = process.env.DB_HOST || `${DEFAULT_HOST}:${DEFAULT_PORT}`;
  const env = parseHostPort(hostEnv);
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : env.port;

  return mysql.createConnection({
    host: env.host,
    port,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });
}

async function setupTestDatabase() {
  // Connect to server (no database) to create DB and tables
  const conn = await getTestConnection();
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await conn.query(`USE \`${DB_NAME}\`;`);

    // Create tables used by the app/tests (idempotent)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(13) UNIQUE,
        quantity INT DEFAULT 1,
        available INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS borrowers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS borrow_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        borrower_id INT NOT NULL,
        borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        returned_at TIMESTAMP NULL,
        due_date DATE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
      );
    `);
  } finally {
    await conn.end();
  }
}

async function cleanupTestDatabase() {
  const conn = await getTestConnection();
  try {
    await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
  } finally {
    await conn.end();
  }
}

module.exports = {
  getTestConnection,
  setupTestDatabase,
  cleanupTestDatabase
};
