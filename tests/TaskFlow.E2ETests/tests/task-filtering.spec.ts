import { test, expect } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';
import { TaskFormPage } from '../pages/TaskFormPage';

test.describe('Task Filtering - BDD Style', () => {
  let tasksPage: TasksPage;
  let taskFormPage: TaskFormPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    taskFormPage = new TaskFormPage(page);
    await tasksPage.goto();
  });

  test('Scenario: Filter tasks by status', async ({ page }) => {
    await test.step('Given I have tasks with different statuses', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Open Task',
        description: 'This is an open task for filtering test',
      });

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Task to Progress',
        description: 'This task will be in progress',
      });
      await tasksPage.clickStatusActionOnTask('Task to Progress');
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I filter by "In Progress" status', async () => {
      await tasksPage.filterByStatus('In Progress');
    });

    await test.step('Then I should only see tasks with "In Progress" status', async () => {
      await expect(tasksPage.getTaskCardByTitle('Task to Progress')).toBeVisible();
      const isOpenTaskVisible = await tasksPage.isTaskVisible('Open Task');
      expect(isOpenTaskVisible).toBe(false);
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

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'High Priority Task',
        description: 'This is a high priority task for testing filters',
        priority: 'High',
      });
    });

    await test.step('When I filter by "High" priority', async () => {
      await tasksPage.filterByPriority('High');
    });

    await test.step('Then I should only see tasks with "High" priority', async () => {
      await expect(tasksPage.getTaskCardByTitle('High Priority Task')).toBeVisible();
      const isLowPriorityVisible = await tasksPage.isTaskVisible('Low Priority Task');
      expect(isLowPriorityVisible).toBe(false);
    });
  });

  test('Scenario: Clear all filters', async ({ page }) => {
    await test.step('Given I have applied filters', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Test Task',
        description: 'This is a test task for clear filters',
        priority: 'Medium',
      });

      await tasksPage.filterByPriority('High');
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I click Clear Filters', async () => {
      await tasksPage.clearFilters();
    });

    await test.step('Then I should see all tasks again', async () => {
      await expect(tasksPage.getTaskCardByTitle('Test Task')).toBeVisible();
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

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: 'Open Low Priority',
        description: 'Open task with low priority',
        priority: 'Low',
      });
    });

    await test.step('When I filter by "Open" status and "High" priority', async () => {
      await tasksPage.filterByStatus('Open');
      await tasksPage.filterByPriority('High');
    });

    await test.step('Then I should only see open tasks with high priority', async () => {
      await expect(tasksPage.getTaskCardByTitle('Open High Priority')).toBeVisible();
      const isLowPriorityVisible = await tasksPage.isTaskVisible('Open Low Priority');
      expect(isLowPriorityVisible).toBe(false);
    });
  });
});
