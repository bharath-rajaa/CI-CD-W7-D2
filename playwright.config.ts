import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,                 // fail the build if a test.only slipped in
  retries: CI ? 2 : 0,            // retries in CI expose flakiness; locally we want to see failures
  workers: CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  outputDir: 'test-results',

  use: {
    baseURL,
    // Artefacts: keep traces for failures (and first retry in CI) so failures are debuggable.
    trace: CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'node scripts/serve.mjs',
    url: baseURL,
    reuseExistingServer: !CI,
    env: { PORT: String(PORT) },
  },
});
