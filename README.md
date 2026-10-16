# TaskFlow

A task management system with ASP.NET Core API and React frontend.

[![CI Pipeline](https://github.com/PedroAugusto-sys/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/PedroAugusto-sys/taskflow/actions/workflows/ci.yml)

## Features

- Create, read, update, and delete tasks
- Task status management (Open, InProgress, UnderReview, Completed, Cancelled)
- Priority levels (Low, Medium, High, Critical)
- Filter tasks by status and priority
- Assign tasks to team members
- Organize by category
- Real-time validation with FluentValidation
- RESTful API with Swagger documentation
- Responsive React UI

## Tech Stack

**Backend:**
- ASP.NET Core 8.0
- Entity Framework Core 8.0.11
- SQLite
- FluentValidation 11.3.0
- Swagger/OpenAPI

**Frontend:**
- React 19.2.8
- TypeScript 6.0.2
- Vite 8.3.0
- Tailwind CSS 3.4.19
- Axios

**Testing:**
- xUnit (unit tests)
- ASP.NET Core integration tests
- Playwright 1.64.1 (E2E tests)

## Architecture

TaskFlow follows a clean architecture pattern with the API handling business logic and data persistence through EF Core with SQLite. The frontend is a single-page application that communicates with the API via REST endpoints. The project includes validators for request DTOs, a service layer for business logic, and comprehensive test coverage across unit, integration, and E2E tests.

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 20+
- npm

### Run API

```bash
cd src/TaskFlow.Api
dotnet restore
dotnet run
```

API runs on `http://localhost:5000` (HTTP) and `https://localhost:5001` (HTTPS)

Swagger UI available at `https://localhost:5001/swagger`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Running Tests

### Unit Tests (31 tests)

```bash
dotnet test tests/TaskFlow.Tests/TaskFlow.Tests.csproj
```

### Integration Tests (17 tests)

```bash
dotnet test tests/TaskFlow.IntegrationTests/TaskFlow.IntegrationTests.csproj
```

### E2E Tests with Playwright (14 tests)

Install Playwright browsers first:

```bash
cd tests/TaskFlow.E2ETests
npx playwright install chromium
```

Start the API, then run E2E tests:

```bash
# Terminal 1: Start API
cd src/TaskFlow.Api
dotnet run

# Terminal 2: Run E2E tests
cd tests/TaskFlow.E2ETests
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

### Run All Tests

```bash
dotnet test
```

## Project Structure

```
taskflow/
├── src/
│   └── TaskFlow.Api/           # ASP.NET Core API
│       ├── Data/               # EF Core DbContext
│       ├── DTOs/               # Data transfer objects
│       ├── Models/             # Domain models
│       ├── Services/           # Business logic
│       └── Validators/         # FluentValidation validators
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API client
│   │   └── types/              # TypeScript types
│   └── package.json
├── tests/
│   ├── TaskFlow.Tests/         # Unit tests
│   ├── TaskFlow.IntegrationTests/  # Integration tests
│   └── TaskFlow.E2ETests/      # Playwright E2E tests
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline
├── TaskFlow.sln                # Solution file
└── docker-compose.yml          # Docker setup
```

## CI/CD

The project uses GitHub Actions for continuous integration. On every push and PR to main, the pipeline:

- Builds and tests the .NET API (unit + integration tests)
- Builds the React frontend
- Runs E2E tests with Playwright
- Collects code coverage reports

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

## Author

Pedro Augusto Santos Andrade · [GitHub](https://github.com/PedroAugusto-sys) · [pedrodevx.netlify.app](https://pedrodevx.netlify.app)
