import { test, expect } from '@playwright/test';

test.describe('Basic E2E Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: /taskflow/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new task/i })).toBeVisible();
  });

  test('should open and close task creation modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(page.getByRole('heading', { name: /create new task/i })).toBeVisible();
    
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('heading', { name: /create new task/i })).not.toBeVisible();
  });

  test('should display filter controls', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('#filterStatus')).toBeVisible();
    await expect(page.locator('#filterPriority')).toBeVisible();
  });
});
