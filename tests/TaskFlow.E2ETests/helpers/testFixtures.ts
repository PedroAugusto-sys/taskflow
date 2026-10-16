import { Page } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5020';

export async function resetDatabase(page: Page) {
  const response = await page.request.post(`${API_BASE_URL}/api/test/reset`);
  if (!response.ok()) {
    throw new Error(`Failed to reset database: ${response.status()}`);
  }
}

export async function waitForTaskCreated(page: Page, title: string) {
  await page.waitForSelector(`text="${title}"`, { state: 'visible' });
}

export async function waitForTaskUpdated(page: Page) {
  await page.waitForResponse(
    (response) => 
      response.url().match(/\/api\/tasks\/\d+/) && 
      (response.request().method() === 'PUT' || response.request().method() === 'PATCH') &&
      response.status() === 200,
    { timeout: 10000 }
  );
}

export async function waitForTaskDeleted(page: Page) {
  await page.waitForResponse(
    (response) => 
      response.url().match(/\/api\/tasks\/\d+/) && 
      response.request().method() === 'DELETE' &&
      response.status() === 204,
    { timeout: 10000 }
  );
}

export async function waitForTasksLoaded(page: Page) {
  await page.waitForResponse(
    (response) => 
      response.url().includes('/api/tasks') && 
      response.request().method() === 'GET' &&
      response.status() === 200,
    { timeout: 10000 }
  );
}
