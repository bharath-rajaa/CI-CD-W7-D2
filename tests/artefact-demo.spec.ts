import { test, expect } from './fixtures';

/*
 * Teaching aid: a deliberately failing test so you can inspect the HTML report,
 * trace viewer, screenshot and video artefacts.
 *
 * Run with:   DEMO_FAIL=1 npx playwright test artefact-demo
 * (On Windows PowerShell: $env:DEMO_FAIL="1"; npx playwright test artefact-demo)
 */
test.describe('artefact demo', () => {
  test.skip(!process.env.DEMO_FAIL, 'Set DEMO_FAIL=1 to run the intentional failure');

  test('@demo intentionally wrong expectation produces failure artefacts', async ({ todoPage }) => {
    await todoPage.add('Trace me');
    await expect(todoPage.items.first()).toHaveText('Wrong text on purpose');
  });
});
