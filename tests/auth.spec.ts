import { test, expect } from './fixtures';
import { LoginPage } from './pages/LoginPage';

test.describe('authentication', () => {
  test('@smoke user can sign in with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn('tester', 'secret123');

    await expect(page).toHaveURL(/dashboard\.html$/);
    await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
  });

  test('@regression invalid password shows an error and stays on sign-in', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn('tester', 'wrong-password');

    await expect(login.error).toHaveText('Invalid username or password');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('@regression visiting the dashboard while signed out redirects to sign-in', async ({ page }) => {
    await page.goto('/dashboard.html');
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('@regression logging out returns the user to sign-in', async ({ todoPage, page }) => {
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/index\.html$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});
