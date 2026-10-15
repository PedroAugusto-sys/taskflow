import { type Page, type Locator } from '@playwright/test';

export class TaskFormPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly statusSelect: Locator;
  readonly assignedToInput: Locator;
  readonly categoryInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly formTitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('#title');
    this.descriptionInput = page.locator('#description');
    this.prioritySelect = page.locator('#priority');
    this.statusSelect = page.locator('#status');
    this.assignedToInput = page.locator('#assignedTo');
    this.categoryInput = page.locator('#category');
    this.submitButton = page.getByRole('button', { name: /(create task|update task)/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.formTitle = page.getByRole('heading', { name: /(create new task|edit task)/i });
    this.errorMessage = page.locator('[role="alert"]');
  }

  async isFormVisible(): Promise<boolean> {
    return await this.formTitle.isVisible();
  }

  async fillTaskForm(data: {
    title: string;
    description: string;
    priority?: string;
    status?: string;
    assignedTo?: string;
    category?: string;
  }) {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);

    if (data.priority) {
      await this.prioritySelect.selectOption({ label: data.priority });
    }

    if (data.status && await this.statusSelect.isVisible()) {
      await this.statusSelect.selectOption({ label: data.status });
    }

    if (data.assignedTo) {
      await this.assignedToInput.fill(data.assignedTo);
    }

    if (data.category) {
      await this.categoryInput.fill(data.category);
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async createTask(data: {
    title: string;
    description: string;
    priority?: string;
    assignedTo?: string;
    category?: string;
  }) {
    await this.fillTaskForm(data);
    await this.submitForm();
    await this.page.waitForLoadState('networkidle');
  }

  async updateTask(data: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string;
    category?: string;
  }) {
    if (data.title) await this.titleInput.fill(data.title);
    if (data.description) await this.descriptionInput.fill(data.description);
    if (data.priority) await this.prioritySelect.selectOption({ label: data.priority });
    if (data.status && await this.statusSelect.isVisible()) {
      await this.statusSelect.selectOption({ label: data.status });
    }
    if (data.assignedTo) await this.assignedToInput.fill(data.assignedTo);
    if (data.category) await this.categoryInput.fill(data.category);

    await this.submitForm();
    await this.page.waitForLoadState('networkidle');
  }
}
