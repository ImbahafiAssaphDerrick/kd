# Library Management System

A full-featured library management system with complete CI/CD pipeline and Kubernetes deployment.

![CI/CD Status](https://github.com/ImbahafiAssaphDerrick/kd/workflows/CI%2FCD%20Pipeline/badge.svg)
![Release](https://img.shields.io/github/v/release/ImbahafiAssaphDerrick/kd)

## Features

- 📚 Book Management (CRUD operations)
- 👥 Borrower Management
- 🔄 Borrow/Return Tracking
- 🐳 Docker Support
- ☸️ Kubernetes Deployment
- 🚀 CI/CD Pipeline
- ✅ Automated Testing
- 📊 Auto-scaling (HPA)

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

### Docker

```bash
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Rolling update (default)
npm run deploy:staging

# Production with rolling update
npm run deploy:production

# Blue-Green deployment
npm run deploy:blue-green

# Rollback
npm run rollback
```

## Resource Requirements

### Application Pods

| Resource | Request | Limit |
|----------|---------|-------|
| CPU | 100m | 500m |
| Memory | 128Mi | 512Mi |

### MySQL

| Resource | Request | Limit |
|----------|---------|-------|
| CPU | 250m | 1000m |
| Memory | 512Mi | 1Gi |

### Auto-scaling

- **Min Replicas**: 2
- **Max Replicas**: 10
- **Scale Up**: CPU > 70% or Memory > 80%
- **Scale Down**: After 5 minutes stabilization

## Deployment Strategies

### Rolling Update (Default)
- Zero downtime deployment
- `maxSurge: 1` - One extra pod during update
- `maxUnavailable: 0` - All pods always running

### Blue-Green
- Two identical environments
- Instant traffic switch
- Easy rollback

## CI/CD Pipeline

1. **CI Pipeline**: Lint, Test, Build
2. **Release Pipeline**: Create release, Push Docker images
3. **CD Pipeline**: Deploy to Kubernetes

## Environment Variables

```env
DB_HOST=mysql-service
DB_USER=root
DB_PASSWORD=password
DB_NAME=library_app
PORT=3000
NODE_ENV=production
```

## API Endpoints

- `GET /api/books` - List books
- `POST /api/books` - Add book
- `GET /api/borrowers` - List borrowers
- `POST /api/borrow` - Borrow book
- `POST /api/return/:id` - Return book
- `GET /health` - Health check

## License

MIT
