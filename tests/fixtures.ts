import { test as base, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

type Fixtures = { todoPage: TodoPage };

/**
 * Starts each test already signed in. We seed sessionStorage directly rather than
 * clicking through the login form, so todo tests stay fast and independent of the
 * login UI (which has its own tests in auth.spec.ts).
 */
export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem('user', 'tester'));
    await page.goto('/dashboard.html');
    await use(new TodoPage(page));
  },
});

export { expect };
