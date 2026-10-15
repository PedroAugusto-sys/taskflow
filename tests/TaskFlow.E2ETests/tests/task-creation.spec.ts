import { test, expect } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';
import { TaskFormPage } from '../pages/TaskFormPage';

test.describe('Task Creation', () => {
  let tasksPage: TasksPage;
  let taskFormPage: TaskFormPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    taskFormPage = new TaskFormPage(page);
    await tasksPage.goto();
  });

  test('should open the task creation form when clicking New Task button', async ({ page }) => {
    await tasksPage.clickNewTask();
    await expect(taskFormPage.formTitle).toContainText('Create New Task');
    await expect(taskFormPage.titleInput).toBeVisible();
  });

  test('should create a new task with valid data', async ({ page }) => {
    await tasksPage.clickNewTask();
    
    await taskFormPage.createTask({
      title: 'E2E Test Task',
      description: 'This task was created during E2E testing with Playwright',
      priority: 'High',
      assignedTo: 'QA Team',
      category: 'Testing',
    });

    await expect(tasksPage.getTaskCardByTitle('E2E Test Task')).toBeVisible();
    const priority = await tasksPage.getTaskPriority('E2E Test Task');
    expect(priority).toContain('High');
  });

  test('should show validation error when title is too short', async ({ page }) => {
    await tasksPage.clickNewTask();
    
    await taskFormPage.fillTaskForm({
      title: 'AB',
      description: 'Valid description with enough characters',
    });
    
    await taskFormPage.submitForm();
    
    const error = await taskFormPage.getErrorMessage();
    expect(error).toContain('between 3 and 200 characters');
  });

  test('should show validation error when description is too short', async ({ page }) => {
    await tasksPage.clickNewTask();
    
    await taskFormPage.fillTaskForm({
      title: 'Valid Title',
      description: 'Short',
    });
    
    await taskFormPage.submitForm();
    
    const error = await taskFormPage.getErrorMessage();
    expect(error).toContain('between 10 and 2000 characters');
  });

  test('should close form without creating task when clicking Cancel', async ({ page }) => {
    await tasksPage.clickNewTask();
    await expect(taskFormPage.formTitle).toBeVisible();
    
    await taskFormPage.cancel();
    
    await expect(taskFormPage.formTitle).not.toBeVisible();
  });

  test('should create multiple tasks with different priorities', async ({ page }) => {
    const tasks = [
      { title: 'Low Priority Task', description: 'This is a low priority task for testing', priority: 'Low' },
      { title: 'Medium Priority Task', description: 'This is a medium priority task for testing', priority: 'Medium' },
      { title: 'High Priority Task', description: 'This is a high priority task for testing', priority: 'High' },
    ];

    for (const task of tasks) {
      await tasksPage.clickNewTask();
      await taskFormPage.createTask(task);
      await expect(tasksPage.getTaskCardByTitle(task.title)).toBeVisible();
    }

    const taskCount = await tasksPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(3);
  });
});
