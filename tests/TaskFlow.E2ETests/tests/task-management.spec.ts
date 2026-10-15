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
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: 'Task to Update',
      description: 'This task will be updated during testing',
      priority: 'Low',
      category: 'Development',
    });

    await tasksPage.clickEditOnTask('Task to Update');
    await taskFormPage.updateTask({
      title: 'Updated Task Title',
      priority: 'High',
    });

    await expect(tasksPage.getTaskCardByTitle('Updated Task Title')).toBeVisible();
    const priority = await tasksPage.getTaskPriority('Updated Task Title');
    expect(priority).toContain('High');
  });

  test('should delete a task', async ({ page }) => {
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: 'Task to Delete',
      description: 'This task will be deleted during testing',
    });

    await expect(tasksPage.getTaskCardByTitle('Task to Delete')).toBeVisible();

    page.on('dialog', dialog => dialog.accept());
    await tasksPage.clickDeleteOnTask('Task to Delete');

    await page.waitForTimeout(500);
    const isVisible = await tasksPage.isTaskVisible('Task to Delete');
    expect(isVisible).toBe(false);
  });

  test('should change task status from Open to In Progress', async ({ page }) => {
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: 'Task to Start',
      description: 'This task will be started during testing',
    });

    let status = await tasksPage.getTaskStatus('Task to Start');
    expect(status).toContain('Open');

    await tasksPage.clickStatusActionOnTask('Task to Start');
    await page.waitForLoadState('networkidle');

    status = await tasksPage.getTaskStatus('Task to Start');
    expect(status).toContain('In Progress');
  });

  test('should change task status from In Progress to Completed', async ({ page }) => {
    await tasksPage.clickNewTask();
    await taskFormPage.createTask({
      title: 'Task to Complete',
      description: 'This task will be completed during testing',
    });

    await tasksPage.clickStatusActionOnTask('Task to Complete');
    await page.waitForLoadState('networkidle');

    let status = await tasksPage.getTaskStatus('Task to Complete');
    expect(status).toContain('In Progress');

    await tasksPage.clickStatusActionOnTask('Task to Complete');
    await page.waitForLoadState('networkidle');

    status = await tasksPage.getTaskStatus('Task to Complete');
    expect(status).toContain('Completed');
  });
});
