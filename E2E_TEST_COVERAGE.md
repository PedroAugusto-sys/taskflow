# E2E Test Coverage - TaskFlow

## ✅ Total: 14 Tests Passing

All E2E tests use **Page Object Model** pattern with reusable page classes (`TasksPage`, `TaskFormPage`).

---

## 📝 Task Creation Tests (6 tests)

**File:** `tests/TaskFlow.E2ETests/tests/task-creation.spec.ts`

1. **Create a new task with valid data**
   - Opens the task creation modal
   - Fills all task fields (title, description, priority, assignee, category)
   - Submits the form
   - Verifies the task appears in the task list
   - Verifies priority badge is displayed correctly

2. **Show validation error when title is too short**
   - Opens the task creation modal
   - Enters a title with only 2 characters (min is 3)
   - Attempts to submit
   - Verifies the form stays open (validation failed)

3. **Show validation error when description is too short**
   - Opens the task creation modal
   - Enters a description with less than 10 characters
   - Attempts to submit
   - Verifies the form stays open (validation failed)

4. **Close form without creating task when clicking Cancel**
   - Opens the task creation modal
   - Clicks the Cancel button
   - Verifies the modal closes
   - Verifies no task was created

5. **Create multiple tasks with different priorities**
   - Creates 3 tasks with Low, Medium, and High priorities
   - Verifies each task appears correctly in the task list
   - Verifies the task count increases accordingly

6. **Create task with timestamp uniqueness**
   - Creates tasks with unique timestamps to avoid duplicates
   - Ensures test isolation between runs

---

## 🔧 Task Management Tests (4 tests)

**File:** `tests/TaskFlow.E2ETests/tests/task-management.spec.ts`

1. **Update an existing task**
   - Creates a task with Low priority
   - Opens the edit modal
   - Changes the title and priority to High
   - Submits the changes
   - Verifies the task displays the updated title
   - Verifies the priority badge changed to High

2. **Delete a task**
   - Creates a task
   - Verifies the task is visible
   - Clicks the Delete button
   - Handles the browser confirmation dialog (accepts it)
   - Verifies the task is removed from the list

3. **Change task status from Open to In Progress**
   - Creates a task (default status: Open)
   - Verifies the initial status badge shows "Open"
   - Clicks the "Start" button
   - Verifies the status badge changes to "In Progress"

4. **Change task status from In Progress to Completed**
   - Creates a task
   - Changes status to In Progress
   - Verifies the status is In Progress
   - Clicks the status action button again
   - Verifies the status changes to "Completed"

---

## 🔍 Task Filtering Tests - BDD Style (4 tests)

**File:** `tests/TaskFlow.E2ETests/tests/task-filtering.spec.ts`

All filtering tests use **BDD-style Given/When/Then** structure with `test.step()`.

### 1. **Scenario: Filter tasks by status**

- **Given** I have tasks with different statuses
  - Creates one Open task
  - Creates one task and changes it to In Progress
- **When** I filter by "In Progress" status
  - Selects "In Progress" from the status filter dropdown
- **Then** I should only see tasks with "In Progress" status
  - Verifies the In Progress task is visible
  - Verifies the Open task is hidden

### 2. **Scenario: Filter tasks by priority**

- **Given** I have tasks with different priorities
  - Creates one Low priority task
  - Creates one High priority task
- **When** I filter by "High" priority
  - Selects "High" from the priority filter dropdown
- **Then** I should only see tasks with "High" priority
  - Verifies the High priority task is visible
  - Verifies the Low priority task is hidden

### 3. **Scenario: Clear all filters**

- **Given** I have applied filters
  - Creates a Medium priority task
  - Applies a "High" priority filter (task is hidden)
- **When** I click Clear Filters
  - Clicks the "Clear Filters" button
- **Then** I should see all tasks again
  - Verifies the previously hidden task is now visible

### 4. **Scenario: Combine status and priority filters**

- **Given** I have tasks with various statuses and priorities
  - Creates an Open task with High priority
  - Creates an Open task with Low priority
- **When** I filter by "Open" status and "High" priority
  - Selects "Open" from status filter
  - Selects "High" from priority filter
- **Then** I should only see open tasks with high priority
  - Verifies the Open High priority task is visible
  - Verifies the Open Low priority task is hidden

---

## 🎯 Page Object Model Classes

### TasksPage (`pages/TasksPage.ts`)

Encapsulates interactions with the task list page:
- `clickNewTask()` - Opens the task creation modal
- `getTaskCardByTitle(title)` - Locates a task card by title
- `getTaskPriority(title)` - Gets the priority badge text
- `getTaskStatus(title)` - Gets the status badge text
- `clickEditOnTask(title)` - Opens edit modal for a task
- `clickDeleteOnTask(title)` - Clicks delete button for a task
- `clickStatusActionOnTask(title)` - Clicks status action button (Start/Continue)
- `filterByStatus(status)` - Selects a status filter
- `filterByPriority(priority)` - Selects a priority filter
- `clearFilters()` - Clears all active filters
- `isTaskVisible(title)` - Checks if a task is visible
- `getTaskCount()` - Counts visible tasks

### TaskFormPage (`pages/TaskFormPage.ts`)

Encapsulates interactions with the task form modal:
- `fillTaskForm(data)` - Fills form fields
- `createTask(data)` - Fills form and submits
- `updateTask(data)` - Updates existing task fields
- `submitForm()` - Clicks submit button
- `clickCancel()` - Clicks cancel button
- `formTitle` - Locator for form title
- `errorMessage` - Locator for validation errors

---

## 🚀 Running E2E Tests

```bash
# Prerequisites: Backend must be running on http://localhost:5020
# Frontend must be running on http://localhost:5173

# Run all E2E tests
cd tests/TaskFlow.E2ETests
npm test

# Run specific test file
npm test task-creation.spec.ts
npm test task-management.spec.ts
npm test task-filtering.spec.ts

# Run with UI (interactive mode)
npm run test:ui

# Run in headed mode (see the browser)
npm run test:headed

# View test report
npm run test:report
```

---

## ✅ Test Reliability Features

- **Unique timestamps**: Each test uses `Date.now()` to create unique task names, avoiding conflicts
- **Proper waits**: Uses `page.waitForTimeout()` after mutations to ensure UI updates
- **Dialog handling**: Handles browser confirmation dialogs for delete operations
- **First element selection**: Uses `.first()` when multiple elements match to avoid strict mode violations
- **Explicit timeouts**: Uses `{ timeout: 5000 }` for visibility checks

---

**Last Updated**: 2026-10-15
**Test Pass Rate**: 100% (14/14 passing)
**Framework**: Playwright with TypeScript
