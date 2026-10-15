import { test, expect } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';
import { TaskFormPage } from '../pages/TaskFormPage';

test.describe('Task Management', () => {
  let tasksPage: TasksPage;
  let taskFormPage: TaskFormPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    taskFormPage = new TaskFormPage(page);
    await tasksPage.goto();
  });

  test('should update an existing task', async ({ page }) => {
    const timestamp = Date.now();
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: `Task to Update ${timestamp}`,
      description: 'This task will be updated during testing',
      priority: 'Low',
      category: 'Development',
    });
    await page.waitForTimeout(800);

    await tasksPage.clickEditOnTask(`Task to Update ${timestamp}`);
    await taskFormPage.updateTask({
      title: `Updated Task ${timestamp}`,
      priority: 'High',
    });
    await page.waitForTimeout(800);

    await expect(tasksPage.getTaskCardByTitle(`Updated Task ${timestamp}`).first()).toBeVisible();
    const priority = await tasksPage.getTaskPriority(`Updated Task ${timestamp}`);
    expect(priority).toContain('High');
  });

  test('should delete a task', async ({ page }) => {
    const timestamp = Date.now();
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: `Task to Delete ${timestamp}`,
      description: 'This task will be deleted during testing',
    });
    await page.waitForTimeout(800);

    await expect(tasksPage.getTaskCardByTitle(`Task to Delete ${timestamp}`).first()).toBeVisible();

    page.on('dialog', dialog => dialog.accept());
    await tasksPage.clickDeleteOnTask(`Task to Delete ${timestamp}`);

    await page.waitForTimeout(1000);
    const isVisible = await tasksPage.isTaskVisible(`Task to Delete ${timestamp}`);
    expect(isVisible).toBe(false);
  });

  test('should change task status from Open to In Progress', async ({ page }) => {
    const timestamp = Date.now();
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: `Task to Start ${timestamp}`,
      description: 'This task will be started during testing',
    });
    await page.waitForTimeout(800);

    let status = await tasksPage.getTaskStatus(`Task to Start ${timestamp}`);
    expect(status).toContain('Open');

    await tasksPage.clickStatusActionOnTask(`Task to Start ${timestamp}`);
    await page.waitForTimeout(1000);

    status = await tasksPage.getTaskStatus(`Task to Start ${timestamp}`);
    expect(status).toContain('In Progress');
  });

  test('should change task status from In Progress to Completed', async ({ page }) => {
    const timestamp = Date.now();
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: `Task to Complete ${timestamp}`,
      description: 'This task will be completed during testing',
    });
    await page.waitForTimeout(800);

    await tasksPage.clickStatusActionOnTask(`Task to Complete ${timestamp}`);
    await page.waitForTimeout(1000);

    let status = await tasksPage.getTaskStatus(`Task to Complete ${timestamp}`);
    expect(status).toContain('In Progress');

    await tasksPage.clickStatusActionOnTask(`Task to Complete ${timestamp}`);
    await page.waitForTimeout(1000);

    status = await tasksPage.getTaskStatus(`Task to Complete ${timestamp}`);
    expect(status).toContain('Completed');
  });
});
