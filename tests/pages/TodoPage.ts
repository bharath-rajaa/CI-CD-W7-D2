import type { Locator, Page } from '@playwright/test';

/** Page object for the task dashboard. Prefers role, label and test-id locators. */
export class TodoPage {
  readonly input: Locator;
  readonly items: Locator;
  readonly itemsLeft: Locator;

  constructor(private readonly page: Page) {
    this.input = page.getByLabel('New task');
    this.items = page.getByTestId('todo-item');
    this.itemsLeft = page.locator('#items-left');
  }

  async add(title: string) {
    await this.input.fill(title);
    await this.input.press('Enter');
  }

  itemByTitle(title: string): Locator {
    return this.items.filter({ hasText: title });
  }

  async toggle(title: string) {
    await this.itemByTitle(title).getByRole('checkbox').check();
  }

  async remove(title: string) {
    await this.itemByTitle(title).getByRole('button', { name: `Delete ${title}` }).click();
  }

  async clearCompleted() {
    await this.page.getByRole('button', { name: 'Clear completed' }).click();
  }
}
