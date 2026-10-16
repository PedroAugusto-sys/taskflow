# TaskFlow

A modern task management and workflow orchestration platform.

## Features

- Task creation, assignment, and tracking
- Real-time status updates
- Priority management and filtering
- Team collaboration
- RESTful API
- Responsive web interface

## Tech Stack

**Backend:**
- Node.js / Express
- PostgreSQL
- JWT authentication

**Frontend:**
- React
- TypeScript
- Tailwind CSS

**Testing:**
- Jest (unit/integration)
- Playwright (E2E)

## Architecture

TaskFlow follows a client-server architecture with a REST API backend and a React SPA frontend. The API handles authentication, task CRUD operations, and real-time updates, while the frontend provides an interactive interface.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Run API

```bash
cd api
npm install
cp .env.example .env
# Configure database connection in .env
npm run migrate
npm run dev
```

API runs on `http://localhost:3000`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Running Tests

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

## Project Structure

```
taskflow/
├── api/              # Backend API
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   ├── tests/
│   └── package.json
└── README.md
```

## License

MIT
