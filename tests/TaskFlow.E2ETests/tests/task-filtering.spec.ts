import { test, expect } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';
import { TaskFormPage } from '../pages/TaskFormPage';
import { resetDatabase, waitForTaskCreated, waitForTaskUpdated, waitForTasksLoaded } from '../helpers/testFixtures';

test.describe('Task Filtering - BDD Style', () => {
  let tasksPage: TasksPage;
  let taskFormPage: TaskFormPage;

  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    tasksPage = new TasksPage(page);
    taskFormPage = new TaskFormPage(page);
    await tasksPage.goto();
    await waitForTasksLoaded(page);
  });

  test('Scenario: Filter tasks by status', async ({ page }) => {
    await test.step('Given I have tasks with different statuses', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Open Task',
        description: 'This is an open task for filtering test',
      });
      await waitForTaskCreated(page, 'Open Task');

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Task In Progress',
        description: 'This task will be in progress',
      });
      await waitForTaskCreated(page, 'Task In Progress');
      
      await tasksPage.clickStatusActionOnTask('Task In Progress');
      await waitForTaskUpdated(page);
    });

    await test.step('When I filter by "In Progress" status', async () => {
      await tasksPage.filterByStatus('In Progress');
    });

    await test.step('Then I should only see tasks with "In Progress" status', async () => {
      await expect(tasksPage.getTaskCardByTitle('Task In Progress')).toBeVisible();
      await expect(tasksPage.getTaskCardByTitle('Open Task')).not.toBeVisible();
    });
  });

  test('Scenario: Filter tasks by priority', async ({ page }) => {
    await test.step('Given I have tasks with different priorities', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Low Priority Task',
        description: 'This is a low priority task for testing filters',
        priority: 'Low',
      });
      await waitForTaskCreated(page, 'Low Priority Task');

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'High Priority Task',
        description: 'This is a high priority task for testing filters',
        priority: 'High',
      });
      await waitForTaskCreated(page, 'High Priority Task');
    });

    await test.step('When I filter by "High" priority', async () => {
      await tasksPage.filterByPriority('High');
    });

    await test.step('Then I should only see tasks with "High" priority', async () => {
      await expect(tasksPage.getTaskCardByTitle('High Priority Task')).toBeVisible();
      await expect(tasksPage.getTaskCardByTitle('Low Priority Task')).not.toBeVisible();
    });
  });

  test('Scenario: Clear all filters', async ({ page }) => {
    await test.step('Given I have applied filters', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Medium Priority Task',
        description: 'This is a test task for clear filters',
        priority: 'Medium',
      });
      await waitForTaskCreated(page, 'Medium Priority Task');

      await tasksPage.filterByPriority('High');
      await waitForTasksLoaded(page);
    });

    await test.step('When I click Clear Filters', async () => {
      await tasksPage.clearFilters();
    });

    await test.step('Then I should see all tasks again', async () => {
      await expect(tasksPage.getTaskCardByTitle('Medium Priority Task')).toBeVisible();
    });
  });

  test('Scenario: Combine status and priority filters', async ({ page }) => {
    await test.step('Given I have tasks with various statuses and priorities', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Open High Priority',
        description: 'Open task with high priority',
        priority: 'High',
      });
      await waitForTaskCreated(page, 'Open High Priority');

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Open Low Priority',
        description: 'Open task with low priority',
        priority: 'Low',
      });
      await waitForTaskCreated(page, 'Open Low Priority');
    });

    await test.step('When I filter by "Open" status and "High" priority', async () => {
      await tasksPage.filterByStatus('Open');
      await tasksPage.filterByPriority('High');
    });

    await test.step('Then I should only see open tasks with high priority', async () => {
      await expect(tasksPage.getTaskCardByTitle('Open High Priority')).toBeVisible();
      await expect(tasksPage.getTaskCardByTitle('Open Low Priority')).not.toBeVisible();
    });
  });
});
