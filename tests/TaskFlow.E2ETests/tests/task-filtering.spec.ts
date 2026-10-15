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
    const timestamp = Date.now();
    
    await test.step('Given I have tasks with different statuses', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Open Task ${timestamp}`,
        description: 'This is an open task for filtering test',
      });
      await page.waitForTimeout(800);

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Task to Progress ${timestamp}`,
        description: 'This task will be in progress',
      });
      await page.waitForTimeout(800);
      
      await tasksPage.clickStatusActionOnTask(`Task to Progress ${timestamp}`);
      await page.waitForTimeout(1000);
    });

    await test.step('When I filter by "In Progress" status', async () => {
      await tasksPage.filterByStatus('In Progress');
    });

    await test.step('Then I should only see tasks with "In Progress" status', async () => {
      await expect(tasksPage.getTaskCardByTitle(`Task to Progress ${timestamp}`).first()).toBeVisible();
      const isOpenTaskVisible = await tasksPage.isTaskVisible(`Open Task ${timestamp}`);
      expect(isOpenTaskVisible).toBe(false);
    });
  });

  test('Scenario: Filter tasks by priority', async ({ page }) => {
    const timestamp = Date.now();
    
    await test.step('Given I have tasks with different priorities', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Low Priority Task ${timestamp}`,
        description: 'This is a low priority task for testing filters',
        priority: 'Low',
      });
      await page.waitForTimeout(800);

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `High Priority Task ${timestamp}`,
        description: 'This is a high priority task for testing filters',
        priority: 'High',
      });
      await page.waitForTimeout(800);
    });

    await test.step('When I filter by "High" priority', async () => {
      await tasksPage.filterByPriority('High');
    });

    await test.step('Then I should only see tasks with "High" priority', async () => {
      await expect(tasksPage.getTaskCardByTitle(`High Priority Task ${timestamp}`).first()).toBeVisible();
      const isLowPriorityVisible = await tasksPage.isTaskVisible(`Low Priority Task ${timestamp}`);
      expect(isLowPriorityVisible).toBe(false);
    });
  });

  test('Scenario: Clear all filters', async ({ page }) => {
    const timestamp = Date.now();
    
    await test.step('Given I have applied filters', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Test Task ${timestamp}`,
        description: 'This is a test task for clear filters',
        priority: 'Medium',
      });
      await page.waitForTimeout(800);

      await tasksPage.filterByPriority('High');
      await page.waitForTimeout(500);
    });

    await test.step('When I click Clear Filters', async () => {
      await tasksPage.clearFilters();
    });

    await test.step('Then I should see all tasks again', async () => {
      await expect(tasksPage.getTaskCardByTitle(`Test Task ${timestamp}`).first()).toBeVisible();
    });
  });

  test('Scenario: Combine status and priority filters', async ({ page }) => {
    const timestamp = Date.now();
    
    await test.step('Given I have tasks with various statuses and priorities', async () => {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Open High Priority ${timestamp}`,
        description: 'Open task with high priority',
        priority: 'High',
      });
      await page.waitForTimeout(800);

      await tasksPage.clickNewTask();
      await taskFormPage.createTask({
        title: `Open Low Priority ${timestamp}`,
        description: 'Open task with low priority',
        priority: 'Low',
      });
      await page.waitForTimeout(800);
    });

    await test.step('When I filter by "Open" status and "High" priority', async () => {
      await tasksPage.filterByStatus('Open');
      await page.waitForTimeout(500);
      await tasksPage.filterByPriority('High');
      await page.waitForTimeout(500);
    });

    await test.step('Then I should only see open tasks with high priority', async () => {
      await expect(tasksPage.getTaskCardByTitle(`Open High Priority ${timestamp}`).first()).toBeVisible();
      const isLowPriorityVisible = await tasksPage.isTaskVisible(`Open Low Priority ${timestamp}`);
      expect(isLowPriorityVisible).toBe(false);
    });
  });
});
