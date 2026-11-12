## Summary
<!-- What changed and why. Link the ticket. -->

## Type of change
- [ ] Feature
- [ ] Bug fix
- [ ] Test-only change
- [ ] Refactor (no behaviour change)

## Test evidence
- [ ] Smoke suite passes locally (`npm run test:smoke`)
- [ ] Regression subset passes (`npm run test:changed -- origin/main`), output pasted below
- [ ] New or changed behaviour has a test that would fail without this change
- [ ] Failures investigated via the HTML report / trace, and the artefact is linked if relevant
- [ ] No flaky results (no tests marked `flaky` in the summary)

## Test code quality (applies to AI-generated code too)
- [ ] No `waitForTimeout` or other fixed sleeps
- [ ] No `test.only` / `test.describe.only`
- [ ] Every `expect` is awaited
- [ ] Assertions are web-first (`toBeVisible`, `toHaveText`), not `isVisible()` booleans
- [ ] Locators use role, label or test-id; CSS chains and XPath are justified in a comment
- [ ] Tests are independent: no shared state or reliance on execution order
- [ ] Test names describe behaviour and carry a tag (`@smoke` or `@regression`)
- [ ] No real credentials or secrets in code, fixtures or logs

## Security and data
- [ ] No sensitive data written to localStorage, sessionStorage, logs or URLs
- [ ] Auth-related changes have a test covering the negative path

## Risk
- Areas affected:
- Known risks and rollback plan:
- Reviewer focus areas:
