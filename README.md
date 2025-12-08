# Library Management System

A comprehensive library management system built with Node.js, Express, and MySQL.

## Features

- **Book Management**: Add, update, and delete books
- **Borrower Management**: Register and manage library borrowers
- **Borrow/Return System**: Track book borrowing and returns with due dates
- **REST API**: Full-featured REST API for all operations
- **Web Interface**: User-friendly Bootstrap-based frontend

## Prerequisites

- Node.js >= 14.0.0
- MySQL 8.0+
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd library
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure database credentials in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
```

5. Initialize the database
```bash
npm run migrate
```

6. Seed the database (optional)
```bash
npm run seed
```

7. Start the application
```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

8. Access the application
   - Web UI: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs

## Usage

### API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Serve frontend application | - |
| GET | `/api/books` | Get all books | - |
| POST | `/api/books` | Add new book | `{title, author, isbn, publishedDate}` |
| PUT | `/api/books/:id` | Update existing book | `{title, author, isbn, publishedDate}` |
| DELETE | `/api/books/:id` | Delete book | - |
| GET | `/api/borrowers` | Get all borrowers | - |
| POST | `/api/borrowers` | Register new borrower | `{name, email, phone}` |
| PUT | `/api/borrowers/:id` | Update borrower info | `{name, email, phone}` |
| DELETE | `/api/borrowers/:id` | Delete borrower | - |
| POST | `/api/borrow` | Borrow a book | `{bookId, borrowerId, dueDate}` |
| POST | `/api/return` | Return a borrowed book | `{bookId, borrowerId}` |
| GET | `/health` | Health check endpoint | - |

### Example API Usage

**Add a new book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "isbn": "9780743273565", "publishedDate": "1925-04-10"}'
```

**Get all borrowers:**
```bash
curl http://localhost:3000/api/borrowers
```

## Development

### Running Locally

1. **Clone the repository:**
```bash
git clone <repository-url>
cd library
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up MySQL database:**
```sql
CREATE DATABASE library_db;
```

4. **Configure environment variables:**
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=library_db
```

5. **Start the application:**
```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

6. **Access the application:**
   - Web UI: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs

### Docker Development

```bash
docker-compose up -d
```

## Project Structure

```
library/
├── index.js                 # Main application server
├── package.json             # Node.js dependencies and scripts
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Development environment setup
├── healthcheck.js          # Docker health check script
├── README.md               # This documentation
├── public/
│   └── index.html          # Bootstrap frontend
├── .github/workflows/
│   └── ci.yml              # GitHub Actions CI/CD pipeline
├── tests/                  # Test files (to be created)
└── docs/                   # Additional documentation
```

## DevOps Implementation

### Phase 1: Plan ✅
- **Scope**: Node.js CRUD application with MySQL backend
- **DevOps Roadmap**: Code → Build → Test → Deploy → Monitor
- **Error Budget**: 99.9% uptime (8.76 hours downtime/year)

### Phase 2: Code ✅
- **Git Strategy**: GitFlow (feature → develop → main branches)
- **Code Quality**: ESLint for code standards
- **Version Control**: Semantic versioning (1.0.0)

### Phase 3: Build ✅
- **CI Pipeline**: GitHub Actions
- **Containerization**: Multi-stage Dockerfile
- **Image Optimization**: Alpine Linux base, minimal dependencies
- **Health Checks**: Built-in monitoring endpoints

## Database Schema

**Books Table:**
```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    published_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Borrowers Table:**
```sql
CREATE TABLE borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Transactions Table:**
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrower_id INT NOT NULL,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    return_date TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id)
);
```

## Docker Setup

### Multi-stage Dockerfile Benefits:
- **Security**: Non-root user execution
- **Size Optimization**: Production dependencies only
- **Health Monitoring**: Built-in health checks
- **Scalability**: Ready for container orchestration

### Commands:
```bash
# Build image
docker build -t library-app .

# Run container
docker run -p 3000:3000 library-app

# Development with database
docker-compose up -d
```

## CI/CD Pipeline

### GitHub Actions Workflow:

1. **Test Stage**:
   - Lint code with ESLint
   - Run unit tests with Jest
   - Test with MySQL service

2. **Build Stage**:
   - Build Docker image
   - Test container health
   - Security scanning (future)

3. **Deploy Stage**:
   - Deploy to staging (main branch)
   - Production deployment (tags)

### Pipeline Triggers:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

## Monitoring & Health Checks

### Health Check Endpoint: `/health`
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Docker Health Check:
- Interval: 30s
- Timeout: 3s
- Retries: 3
- Start period: 5s

### Monitoring Metrics (Planned):
- API response times
- Database connection status
- Memory and CPU usage
- Error rates and logging

## Error Budget Policy

### Service Level Objectives (SLOs):
- **Availability**: 99.9% uptime
- **Response Time**: < 200ms for 95% of requests
- **Error Rate**: < 0.1% of requests

### Error Budget:
- **Monthly Allowance**: 43.8 minutes downtime
- **Incident Response**: < 5 minutes detection
- **Recovery Time**: < 15 minutes for critical issues

### Alerting Thresholds:
- 50% error budget consumed: Warning
- 80% error budget consumed: Critical alert
- 100% error budget consumed: Emergency response

## Testing Strategy

### Test Types:
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Health Checks**: Container and service monitoring
- **Load Testing**: Performance under stress (planned)

### Running Tests:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run lint          # Code quality checks
```

## Deployment Environments

### Development:
- Local machine with Docker Compose
- Hot reloading with nodemon
- Debug logging enabled

### Staging:
- Container deployment
- Production-like environment
- Integration testing

### Production:
- High availability setup
- Monitoring and alerting
- Automated backups

## Performance Optimization

### Backend Optimizations:
- Connection pooling for MySQL
- Async/await for non-blocking operations
- Input validation and sanitization
- Prepared statements for security

### Frontend Optimizations:
- CDN for Bootstrap and Font Awesome
- Minimal JavaScript bundle
- Responsive design for mobile

### Container Optimizations:
- Multi-stage builds
- Alpine Linux base image
- Non-root user execution
- Health check integration

## Contributing

### Git Workflow:
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit with conventional messages: `feat: add new feature`
4. Push and create pull request
5. Code review and merge to develop
6. Deploy to staging for testing
7. Merge to main for production

### Code Standards:
- ESLint configuration enforced
- Conventional commit messages
- 100% test coverage goal
- Documentation updates required

## Next Steps

### Planned Enhancements:
- [ ] Add user authentication
- [ ] Implement note categories/tags
- [ ] Add search functionality
- [ ] Performance monitoring with Prometheus
- [ ] Log aggregation with ELK stack
- [ ] Kubernetes deployment manifests
- [ ] Infrastructure as Code with Terraform

### Security Improvements:
- [ ] HTTPS/TLS configuration
- [ ] Rate limiting
- [ ] Input validation enhancement
- [ ] Security headers implementation
- [ ] Vulnerability scanning in CI

## Support

For issues and questions:
- Create GitHub issue
- Check existing documentation
- Review CI/CD pipeline logs

---

**Built with ❤️ for DevOps learning and demonstration**

Last updated: January 2024
