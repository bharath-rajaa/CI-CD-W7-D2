import { test, expect } from './fixtures';

test.describe('task list', () => {
  test('@smoke adding a task shows it with an updated counter', async ({ todoPage }) => {
    await todoPage.add('Buy milk');

    await expect(todoPage.items).toHaveCount(1);
    await expect(todoPage.items.first()).toContainText('Buy milk');
    await expect(todoPage.itemsLeft).toHaveText('1 item left');
  });

  test('@regression completing a task updates the counter and styling', async ({ todoPage }) => {
    await todoPage.add('Write report');
    await todoPage.add('Review PR');

    await todoPage.toggle('Write report');

    await expect(todoPage.itemsLeft).toHaveText('1 item left');
    await expect(todoPage.itemByTitle('Write report')).toHaveClass(/done/);
  });

  test('@regression deleting a task removes it', async ({ todoPage }) => {
    await todoPage.add('Temporary task');
    await todoPage.remove('Temporary task');

    await expect(todoPage.items).toHaveCount(0);
    await expect(todoPage.itemsLeft).toHaveText('0 items left');
  });

  test('@regression clear completed removes only finished tasks', async ({ todoPage }) => {
    await todoPage.add('Done task');
    await todoPage.add('Open task');
    await todoPage.toggle('Done task');

    await todoPage.clearCompleted();

    await expect(todoPage.items).toHaveCount(1);
    await expect(todoPage.items.first()).toContainText('Open task');
  });

  test('@regression tasks persist across a page reload', async ({ todoPage, page }) => {
    await todoPage.add('Survives reload');
    await page.reload();

    await expect(todoPage.items).toHaveCount(1);
    await expect(todoPage.items.first()).toContainText('Survives reload');
  });
});
