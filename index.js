const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost:3307',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'library_app'
};

let db;

// Initialize database connection
async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    
    // Create books table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(13) UNIQUE,
        quantity INT DEFAULT 1,
        available INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create borrowers table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS borrowers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create borrow_history table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS borrow_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        borrower_id INT NOT NULL,
        borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        returned_at TIMESTAMP NULL,
        due_date DATE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database connected and tables created');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== BOOKS ENDPOINTS =====

// GET all books with availability info
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST new book
app.post('/api/books', async (req, res) => {
  const { title, author, isbn, quantity } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)',
      [title, author, isbn || null, quantity || 1, quantity || 1]
    );
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      author,
      isbn,
      quantity: quantity || 1,
      message: 'Book added successfully' 
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT update book
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, quantity } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE books SET title = ?, author = ?, quantity = ? WHERE id = ?',
      [title, author, quantity, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE book
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM books WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// ===== BORROWERS ENDPOINTS =====

// GET all borrowers
app.get('/api/borrowers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM borrowers ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    res.status(500).json({ error: 'Failed to fetch borrowers' });
  }
});

// POST new borrower
app.post('/api/borrowers', async (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO borrowers (name, email, phone) VALUES (?, ?, ?)',
      [name, email || null, phone || null]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      email,
      phone,
      message: 'Borrower added successfully' 
    });
  } catch (error) {
    console.error('Error adding borrower:', error);
    res.status(500).json({ error: 'Failed to add borrower' });
  }
});

// DELETE borrower
app.delete('/api/borrowers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM borrowers WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    
    res.json({ message: 'Borrower deleted successfully' });
  } catch (error) {
    console.error('Error deleting borrower:', error);
    res.status(500).json({ error: 'Failed to delete borrower' });
  }
});

// ===== BORROW/RETURN ENDPOINTS =====

// POST borrow book
app.post('/api/borrow', async (req, res) => {
  const { book_id, borrower_id, due_date } = req.body;
  
  if (!book_id || !borrower_id) {
    return res.status(400).json({ error: 'Book ID and borrower ID are required' });
  }

  try {
    // Check if book is available
    const [books] = await db.execute('SELECT available FROM books WHERE id = ?', [book_id]);
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (books[0].available <= 0) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Add borrow record
    const [result] = await db.execute(
      'INSERT INTO borrow_history (book_id, borrower_id, due_date) VALUES (?, ?, ?)',
      [book_id, borrower_id, due_date || null]
    );

    // Decrease available count
    await db.execute('UPDATE books SET available = available - 1 WHERE id = ?', [book_id]);

    res.status(201).json({ 
      id: result.insertId,
      message: 'Book borrowed successfully' 
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ error: 'Failed to borrow book' });
  }
});

// POST return book
app.post('/api/return/:borrowHistoryId', async (req, res) => {
  const { borrowHistoryId } = req.params;

  try {
    // Get borrow record
    const [records] = await db.execute(
      'SELECT book_id FROM borrow_history WHERE id = ? AND returned_at IS NULL',
      [borrowHistoryId]
    );
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'Borrow record not found or already returned' });
    }

    const book_id = records[0].book_id;

    // Mark as returned
    await db.execute(
      'UPDATE borrow_history SET returned_at = NOW() WHERE id = ?',
      [borrowHistoryId]
    );

    // Increase available count
    await db.execute('UPDATE books SET available = available + 1 WHERE id = ?', [book_id]);

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// GET active borrows for a borrower
app.get('/api/borrowers/:borrowerId/active-borrows', async (req, res) => {
  const { borrowerId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT bh.id, b.title, b.author, bh.borrowed_at, bh.due_date 
       FROM borrow_history bh 
       JOIN books b ON bh.book_id = b.id 
       WHERE bh.borrower_id = ? AND bh.returned_at IS NULL 
       ORDER BY bh.borrowed_at DESC`,
      [borrowerId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching active borrows:', error);
    res.status(500).json({ error: 'Failed to fetch active borrows' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Library Management Server running on port ${PORT}`);
  });
}

// Export the app for tests and only start server when run directly
module.exports = app;

if (require.main === module) {
  startServer();
}
