# TaskFlow - Task Management System

[![CI Pipeline](https://github.com/pedro-augusto-code/taskflow-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-augusto-code/taskflow-portfolio/actions/workflows/ci.yml)

A full-stack task management system built with **ASP.NET Core 8** and **React + TypeScript**, featuring comprehensive automated testing at all levels.

> **Portfolio Project by Pedro Augusto**  
> QA Automation Engineer | .NET Developer  
> 🌐 [pedrodevx.netlify.app](https://pedrodevx.netlify.app) | 💼 [LinkedIn](https://linkedin.com/in/pedro-augusto) | 🐙 [GitHub](https://github.com/pedro-augusto-code)

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Test Strategy](#test-strategy)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [What I'd Add Next](#what-id-add-next)

---

## ✨ Features

- ✅ **CRUD Operations** - Create, read, update, and delete tasks
- 🎯 **Priority Management** - Low, Medium, High, Critical
- 📊 **Status Tracking** - Open, In Progress, Under Review, Completed, Cancelled
- 🔍 **Filtering** - Filter by status and priority
- 👤 **Assignment** - Assign tasks to team members
- 🏷️ **Categories** - Organize tasks by category
- ⚡ **Real-time Updates** - Responsive UI with instant feedback
- 🔐 **Validation** - Client and server-side validation with FluentValidation
- 📱 **Responsive Design** - Mobile-friendly interface

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
TaskFlow/
├── src/
│   └── TaskFlow.Api/              # ASP.NET Core Web API
│       ├── Models/                # Domain entities
│       ├── DTOs/                  # Data transfer objects
│       ├── Services/              # Business logic layer
│       ├── Validators/            # FluentValidation rules
│       ├── Data/                  # EF Core DbContext
│       └── Program.cs             # Minimal API endpoints
├── frontend/                      # React + TypeScript SPA
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API client layer
│   │   └── types/                 # TypeScript type definitions
├── tests/
│   ├── TaskFlow.Tests/            # Unit tests (xUnit)
│   ├── TaskFlow.IntegrationTests/ # Integration tests (WebApplicationFactory)
│   └── TaskFlow.E2ETests/         # E2E tests (Playwright + Page Object Model)
```

### Key Design Patterns

- **Repository Pattern** - Abstraction over data access via EF Core
- **Service Layer** - Business logic encapsulation
- **DTO Pattern** - Clear API contracts
- **Page Object Model** - Reusable E2E test components
- **Custom Hooks** - React state management encapsulation

---

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core 8** - Web API with Minimal APIs
- **Entity Framework Core 8** - ORM with SQLite
- **FluentValidation** - Server-side validation
- **Swashbuckle** - OpenAPI/Swagger documentation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client

### Testing
- **xUnit** - Unit testing framework
- **FluentAssertions** - Fluent assertion library
- **Moq** - Mocking framework
- **Microsoft.AspNetCore.Mvc.Testing** - Integration testing
- **Playwright** - Cross-browser E2E testing
- **Coverlet** - Code coverage

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **SQLite** - Embedded database

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) (optional)

### Option 1: Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/pedro-augusto-code/taskflow-portfolio.git
cd taskflow-portfolio

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# API: http://localhost:5020
# Swagger: http://localhost:5020
```

### Option 2: Run Locally

#### Backend (API)

```bash
# Navigate to API directory
cd src/TaskFlow.Api

# Restore dependencies
dotnet restore

# Run the API
dotnet run

# API will be available at http://localhost:5020 (or check terminal output)
# Swagger UI at http://localhost:5020
```

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

---

## 🧪 Test Strategy

This project implements the **Test Pyramid** with three distinct testing layers:

### Test Pyramid

```
           /\
          /  \
         /E2E \ ← 14 tests (UI workflows, BDD)
        /------\
       /  API  \ ← 14 tests (HTTP endpoints)
      /--------\
     /   UNIT   \ ← 32 tests (business logic)
    /___________\
```

### 1. Unit Tests (32 tests)

**Location:** `tests/TaskFlow.Tests/`

**Focus:** Business logic, validation rules, service layer

**Technologies:** xUnit, FluentAssertions, Moq, InMemory Database

**Coverage:** 99.4% line coverage, 89.2% branch coverage (measured with Coverlet)

```bash
# Run unit tests
dotnet test tests/TaskFlow.Tests/

# Run with coverage
dotnet test tests/TaskFlow.Tests/ --collect:"XPlat Code Coverage"
```

**What they test:**
- ✅ Service methods (create, update, delete, query operations)
- ✅ Validation rules (FluentValidation)
- ✅ Edge cases and error handling
- ✅ Business rule enforcement

### 2. Integration Tests (14 tests)

**Location:** `tests/TaskFlow.IntegrationTests/`

**Focus:** API endpoints, HTTP status codes, request/response contracts

**Technologies:** xUnit, WebApplicationFactory, InMemory Database

```bash
# Run integration tests
dotnet test tests/TaskFlow.IntegrationTests/
```

**What they test:**
- ✅ Full HTTP request/response cycle
- ✅ API routing and parameter binding
- ✅ Status codes (200, 201, 400, 404)
- ✅ JSON serialization/deserialization
- ✅ End-to-end data flow through all layers

### 3. E2E Tests (14 tests)

**Location:** `tests/TaskFlow.E2ETests/`

**Focus:** User workflows with Page Object Model and BDD scenarios

**Technologies:** Playwright (TypeScript), Page Object Model

```bash
# Install Playwright browsers (first time only)
cd tests/TaskFlow.E2ETests
npx playwright install

# Run E2E tests
npm test

# Run with UI (interactive mode)
npm run test:ui

# Run in headed mode
npm run test:headed

# View test report
npm run test:report
```

**What they test:**
- ✅ Task creation with validation (6 tests)
- ✅ Task editing and status changes (4 tests)
- ✅ Filtering by status and priority - BDD-style (4 tests)
- ✅ Page Object Model pattern for maintainability

**BDD-style example:**

```typescript
test('Scenario: Filter tasks by status', async ({ page }) => {
  await test.step('Given I have tasks with different statuses', async () => {
    // Setup
  });
  
  await test.step('When I filter by "In Progress" status', async () => {
    // Action
  });
  
  await test.step('Then I should only see tasks with "In Progress" status', async () => {
    // Assertion
  });
});
```

### Run All Tests

```bash
# Backend tests
dotnet test

# E2E tests (requires backend and frontend running)
cd tests/TaskFlow.E2ETests
npm install
npx playwright install chromium
npm test
```

### CI Pipeline

The GitHub Actions pipeline runs:
1. ✅ Unit tests
2. ✅ Integration tests
3. ✅ E2E tests (Playwright)
4. ✅ Code coverage collection
5. ✅ Test report artifacts

---

## 📚 API Documentation

### Base URL
```
http://localhost:5020/api
```

### Endpoints

#### Get All Tasks
```http
GET /api/tasks?status={status}&priority={priority}
```

#### Get Task by ID
```http
GET /api/tasks/{id}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description with at least 10 characters",
  "priority": 1,
  "assignedTo": "John Doe",
  "category": "Development"
}
```

#### Update Task
```http
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": 1,
  "priority": 2
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
```

### Swagger UI

Full interactive API documentation available at: `http://localhost:5020`

---

## 📸 Screenshots

### Main Dashboard
![Main Dashboard](docs/images/dashboard.png)
*Task list with filtering and status badges*

### Create Task Form
![Create Task](docs/images/create-task.png)
*Form with validation and real-time feedback*

### Test Results
![Test Results](docs/images/test-results.png)
*Comprehensive test suite with coverage report*

---

## 🔮 What I'd Add Next

### Security & Authentication
- [ ] JWT authentication
- [ ] Role-based authorization (Admin, User, Viewer)
- [ ] Rate limiting and API throttling

### Features
- [ ] Task comments and activity log
- [ ] File attachments
- [ ] Due dates and reminders
- [ ] Email notifications
- [ ] Task search with full-text indexing
- [ ] Dashboard analytics (charts and metrics)
- [ ] Bulk operations (multi-select, batch update)

### Technical Improvements
- [ ] Redis caching layer
- [ ] PostgreSQL/SQL Server for production
- [ ] GraphQL API alongside REST
- [ ] Server-side pagination
- [ ] WebSocket for real-time updates
- [ ] Background job processing (Hangfire)
- [ ] API versioning
- [ ] CQRS pattern with MediatR
- [ ] Event sourcing for audit trail

### Testing & Quality
- [ ] Mutation testing (Stryker.NET)
- [ ] Performance testing (k6, JMeter)
- [ ] Accessibility testing (WCAG compliance)
- [ ] Visual regression testing
- [ ] Contract testing (Pact)

### DevOps & Monitoring
- [ ] Kubernetes deployment manifests
- [ ] Helm charts
- [ ] Application Performance Monitoring (APM)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Infrastructure as Code (Terraform)
- [ ] Blue-green deployments

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 About Me

**Pedro Augusto** - QA Automation Engineer & .NET Developer

I'm passionate about quality engineering and building robust, well-tested software. This project showcases my skills in:

- ✅ **QA Automation** - Multi-layer test strategy with BDD
- ✅ **.NET Development** - Clean architecture and SOLID principles
- ✅ **Full-Stack** - React/TypeScript frontend development
- ✅ **DevOps** - CI/CD pipelines and containerization
- ✅ **Testing Tools** - xUnit, Playwright, Selenium, Cypress

### Connect with me:
- 🌐 Portfolio: [pedrodevx.netlify.app](https://pedrodevx.netlify.app)
- 💼 LinkedIn: [linkedin.com/in/pedro-augusto](https://linkedin.com/in/pedro-augusto)
- 🐙 GitHub: [github.com/pedro-augusto-code](https://github.com/pedro-augusto-code)

---

## 🇧🇷 Sobre este Projeto (Portuguese)

### O que é TaskFlow?

TaskFlow é um sistema completo de gerenciamento de tarefas desenvolvido para demonstrar minhas habilidades como **QA Automation Engineer** e **Desenvolvedor .NET**.

### Destaques Técnicos

- **Backend robusto** com ASP.NET Core 8 e Entity Framework
- **Frontend moderno** com React 18 e TypeScript
- **Cobertura de testes em 3 níveis** (unitários, integração, E2E)
- **Page Object Model** para testes E2E organizados
- **BDD-style** scenarios demonstrando experiência com comportamento orientado
- **CI/CD** automatizado com GitHub Actions
- **Docker** para fácil deployment

### Por que este projeto importa?

Este projeto demonstra:
1. **Pensamento em qualidade** - Testes em todas as camadas
2. **Código limpo** - Arquitetura bem estruturada e SOLID
3. **Automação completa** - De testes unitários a E2E
4. **Boas práticas** - Validação, tratamento de erros, design patterns
5. **Entrega profissional** - Documentação completa e CI/CD

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**
