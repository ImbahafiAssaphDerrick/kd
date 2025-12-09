# Library Management System

A full-featured library management system with CI/CD pipeline.

![CI/CD Status](https://github.com/YOUR_USERNAME/library/workflows/CI%2FCD%20Pipeline/badge.svg)
![Release](https://img.shields.io/github/v/release/YOUR_USERNAME/library)
![Docker](https://img.shields.io/docker/v/YOUR_USERNAME/library-management?label=docker)

## Features

- 📚 Book Management (CRUD operations)
- 👥 Borrower Management
- 🔄 Borrow/Return Tracking
- 🐳 Docker Support
- 🚀 CI/CD Pipeline
- ✅ Automated Testing
- 📊 Health Checks

## Quick Start

### Using Docker

```bash
# Pull the latest image
docker pull ghcr.io/YOUR_USERNAME/library:latest

# Run with docker-compose
docker-compose up -d
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Release Process

### Creating a New Release

1. **Using the release script (recommended):**
   ```bash
   npm run release
   ```

2. **Manual release:**
   ```bash
   # Bump version
   npm run version:patch  # or minor, major
   
   # Commit and tag
   git add package.json
   git commit -m "chore: bump version to X.X.X"
   git tag -a vX.X.X -m "Release vX.X.X"
   
   # Push
   git push origin main
   git push origin vX.X.X
   ```

### Version Strategy

- **Patch** (1.0.x): Bug fixes, minor updates
- **Minor** (1.x.0): New features, backwards compatible
- **Major** (x.0.0): Breaking changes

## Docker Images

Images are automatically built and pushed on release:

- **GitHub Container Registry:** `ghcr.io/YOUR_USERNAME/library:latest`
- **Docker Hub:** `YOUR_USERNAME/library-management:latest`

### Available Tags

- `latest` - Latest stable release
- `vX.X.X` - Specific version
- `X.X` - Minor version
- `X` - Major version

## CI/CD Pipeline

### Workflows

1. **CI Pipeline** (`ci.yml`) - Runs on every push
   - Linting
   - Unit tests
   - Integration tests
   - E2E tests
   - Docker build

2. **Release Pipeline** (`release.yml`) - Runs on version tags
   - Create GitHub release
   - Build and push Docker images
   - Generate release notes
   - Send notifications

### Required Secrets

Set these in GitHub repository settings:

```
DOCKERHUB_USERNAME   # Docker Hub username
DOCKERHUB_TOKEN      # Docker Hub access token
SLACK_WEBHOOK_URL    # Slack webhook for notifications (optional)
```

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=library_app
PORT=3000
NODE_ENV=production
```

## API Endpoints

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Borrowers
- `GET /api/borrowers` - List all borrowers
- `POST /api/borrowers` - Create borrower
- `DELETE /api/borrowers/:id` - Delete borrower

### Borrow/Return
- `POST /api/borrow` - Borrow a book
- `POST /api/return/:id` - Return a book
- `GET /api/borrowers/:id/active-borrows` - Get active borrows

### Health
- `GET /health` - Health check

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/YOUR_USERNAME/library/issues
- Slack: [Your Slack Channel]
