import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/frontend/i);
    await expect(page.getByRole('heading', { name: /taskflow/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new task/i })).toBeVisible();
  });

  test('should create and display a new task', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /new task/i }).click();
    
    await expect(page.getByRole('heading', { name: /create new task/i })).toBeVisible();
    
    await page.locator('#title').fill('E2E Smoke Test Task');
    await page.locator('#description').fill('This is a test task created by Playwright E2E tests');
    await page.locator('#priority').selectOption('2');
    await page.locator('#assignedTo').fill('Test User');
    await page.locator('#category').fill('Testing');
    
    await page.locator('button[type="submit"]').click();
    
    await expect(page.getByText('E2E Smoke Test Task')).toBeVisible({ timeout: 5000 });
  });

  test('should filter tasks by priority', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Low Priority Task Filter');
    await page.locator('#description').fill('Task with low priority for testing filters');
    await page.locator('#priority').selectOption('0');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Low Priority Task Filter')).toBeVisible({ timeout: 3000 });
    
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('High Priority Task Filter');
    await page.locator('#description').fill('Task with high priority for testing filters');
    await page.locator('#priority').selectOption('2');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('High Priority Task Filter')).toBeVisible({ timeout: 3000 });
    
    await page.locator('#filterPriority').selectOption('2');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText('High Priority Task Filter')).toBeVisible();
    const lowTask = page.getByText('Low Priority Task Filter');
    await expect(lowTask).toHaveCount(0);
  });

  test('should cancel task creation', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(page.getByRole('heading', { name: /create new task/i })).toBeVisible();
    
    await page.getByRole('button', { name: /cancel/i }).click();
    
    await expect(page.getByRole('heading', { name: /create new task/i })).not.toBeVisible();
  });
});
