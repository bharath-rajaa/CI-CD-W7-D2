# Playwright QA Lab

A small, self-contained Playwright project for practising:

- Playwright HTML reports and trace, screenshot and video artefacts
- Reviewing AI-generated test code for correctness, security, readability, determinism and maintainability
- A pull-request checklist
- Regression selection based on changed files
- Communicating test results and release risks
- A hands-on PR review lab

The system under test is **TaskHub**, a sign-in page and a task list in `app/`. It is a static site with no build step, served by `scripts/serve.mjs`.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run tests

| Command | What it does |
|---|---|
| `npm test` | Full suite |
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:regression` | Only `@regression` tests |
| `npm run test:changed -- origin/main` | Selects tags from files changed since `origin/main` and runs them |
| `npm run summary` | Writes `test-results/summary.md` from the JSON report |
| `npm run report` | Opens the HTML report |

To see failure artefacts, run the intentional failure:

```bash
DEMO_FAIL=1 npx playwright test artefact-demo
npm run report
```

Open a failing test to find the screenshot, the video, and the **trace**. In the trace viewer you can step through actions, inspect the DOM snapshot at each step, and read the network and console logs.

## Folder map

```
app/                 TaskHub sample app (sign-in + tasks)
tests/
  pages/             Page objects (locators and actions in one place)
  fixtures.ts        Custom fixture: starts each test signed in
  auth.spec.ts       Sign-in and redirect tests
  todo.spec.ts       Task list tests
  artefact-demo.spec.ts  Intentional failure for artefact practice
scripts/
  serve.mjs          Static server used by the Playwright webServer
  select-regression.mjs  Changed-file to tag selection
  test-map.json      Rules for regression selection
  summarise-results.mjs  JSON report to Markdown summary
.github/
  workflows/playwright.yml   CI: changed-only on PRs, full suite on main
  pull_request_template.md   PR checklist
docs/
  release-risk-template.md   Template for communicating results and risk
lab/
  sample-pr-0042.diff  Sample PR to review
  review-template.md   Fill this in during the lab
  reviewer-guide.md    Answer key (read after your own review)
```

## Conventions

- **Tags.** Every test title carries `@smoke` (critical path, always run) or `@regression` (broader coverage). Tags make selection and reporting possible.
- **Locators.** Prefer `getByRole`, `getByLabel` and `getByTestId`. Avoid CSS chains and XPath.
- **Assertions.** Use web-first assertions (`toBeVisible`, `toHaveText`, `toHaveURL`) and always `await` them. Avoid `expect(await x.isVisible())`.
- **No fixed sleeps.** `waitForTimeout` is banned in review. Wait for a condition instead.
- **Independence.** Each test sets up its own state. Fixtures seed the signed-in state.
- **No secrets.** The credentials in this sample are public demo values. Real credentials go in environment variables or a secret store.

## Regression selection

`scripts/test-map.json` maps path prefixes to tags. The rules are deliberately conservative:

- `@smoke` always runs.
- A file with no matching rule escalates to `@regression`, so an unknown change never silently skips tests.
- Docs and lab files map to no tags, because they cannot break the app.

Try it:

```bash
git checkout -b try-selection
echo "/* comment */" >> app/dashboard.html
npm run test:changed -- HEAD
```

Undo the change afterwards with `git checkout -- app/dashboard.html`.

## Reading the results

1. Run the suite. Failures are printed in the list reporter.
2. `npm run summary` gives a Markdown table you can paste into a PR or a release note.
3. `npm run report` opens the HTML report. Click a failure to see the error, the screenshot, the video and the trace.
4. Treat a test marked **flaky** as a defect. It passed only after a retry.

## Suggested exercises

1. Run `DEMO_FAIL=1 npx playwright test artefact-demo`. Open the trace and find the exact action that failed and the DOM state at that moment.
2. Add `await page.waitForTimeout(2000)` to a test. Explain why it is a determinism problem even when the test passes.
3. Write a test for an edge case not covered: adding a task with only whitespace should not create an item.
4. Complete `lab/review-template.md` for `lab/sample-pr-0042.diff`. Then check your verdict against `lab/reviewer-guide.md`.
5. Use `docs/release-risk-template.md` to write a release statement after running the suite.
