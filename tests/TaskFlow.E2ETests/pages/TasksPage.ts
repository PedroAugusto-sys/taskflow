import { type Page, type Locator } from '@playwright/test';

export class TasksPage {
  readonly page: Page;
  readonly newTaskButton: Locator;
  readonly taskCards: Locator;
  readonly filterStatusSelect: Locator;
  readonly filterPrioritySelect: Locator;
  readonly clearFiltersButton: Locator;
  readonly noTasksMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTaskButton = page.getByRole('button', { name: /new task/i });
    this.taskCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    this.filterStatusSelect = page.locator('#filterStatus');
    this.filterPrioritySelect = page.locator('#filterPriority');
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i });
    this.noTasksMessage = page.getByText(/no tasks found/i);
    this.loadingSpinner = page.getByRole('status', { name: /loading/i });
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickNewTask() {
    await this.newTaskButton.click();
  }

  async getTaskCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    return await this.taskCards.count();
  }

  getTaskCardByTitle(title: string): Locator {
    return this.page.locator(`[class*="bg-white rounded-lg shadow-md"]:has-text("${title}")`);
  }

  async clickEditOnTask(title: string) {
    const taskCard = await this.getTaskCardByTitle(title);
    await taskCard.getByRole('button', { name: /edit/i }).click();
  }

  async clickDeleteOnTask(title: string) {
    const taskCard = await this.getTaskCardByTitle(title);
    await taskCard.getByRole('button', { name: /delete/i }).click();
  }

  async clickStatusActionOnTask(title: string) {
    const taskCard = await this.getTaskCardByTitle(title);
    await taskCard.getByRole('button', { name: /(start|complete)/i }).first().click();
  }

  async filterByStatus(status: string) {
    await this.filterStatusSelect.selectOption({ label: status });
    await this.page.waitForLoadState('networkidle');
  }

  async filterByPriority(priority: string) {
    await this.filterPrioritySelect.selectOption({ label: priority });
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isNoTasksMessageVisible(): Promise<boolean> {
    return await this.noTasksMessage.isVisible();
  }

  async isTaskVisible(title: string): Promise<boolean> {
    const taskCard = await this.getTaskCardByTitle(title);
    return await taskCard.isVisible();
  }

  async getTaskStatus(title: string): Promise<string> {
    const taskCard = await this.getTaskCardByTitle(title);
    const statusBadges = await taskCard.locator('span[class*="px-2 py-1 rounded"]').all();
    if (statusBadges.length > 1) {
      return await statusBadges[1].textContent() || '';
    }
    return '';
  }

  async getTaskPriority(title: string): Promise<string> {
    const taskCard = await this.getTaskCardByTitle(title);
    const priorityBadge = await taskCard.locator('span[class*="px-2 py-1 rounded"]').first();
    return await priorityBadge.textContent() || '';
  }
}
