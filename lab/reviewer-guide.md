# Reviewer guide (self-check after you finish your own review)

## Expected verdict: REQUEST CHANGES

Do not approve. The PR adds a security problem, and its tests do not check the feature they claim to cover.

## Blocking findings

1. **Password stored in plaintext (security).** `app/index.html`: `localStorage.setItem('savedCredentials', ... password: p ...)`. Any script on the origin, or anyone with access to the browser profile, can read it. Remember-me must store a session token, not a password. Request a design change, and a test that asserts no password appears in any browser storage.

2. **`test.describe.only` (suite integrity).** `tests/auth.spec.ts`. Only the new group runs, so the other authentication tests are silently skipped. CI's `forbidOnly` flag catches this only in CI, and only if the CI configuration is kept. The rest of the suite is never run in this PR. Ask for removal and rerun the full suite.

3. **Floating assertion (false pass).** `expect(page.locator('#login-error')).toBeVisible();` has no `await`. The assertion can fail after the test has ended, or never be checked at all. Request `await`.

4. **Fixed sleep (determinism).** `page.waitForTimeout(3000)`. It makes the test slow and flaky in both directions. Replace it with a web-first assertion on the URL or the welcome text.

5. **Weak correctness check.** `expect(await page.url().includes('dashboard')).toBeTruthy()` produces a poor failure message and is not web-first. Use `await expect(page).toHaveURL(/dashboard\.html$/)`.

## Non-blocking findings

6. **Dead feature.** `savedCredentials` is written but never read on load. Remember-me does nothing for the user. This is a correctness gap, and it also means the test cannot have verified the feature.
7. **Brittle selectors.** `form > label:nth-child(3) input` and `form > button` depend on DOM structure. Use labels or test-ids.
8. **Test name.** "login works" does not describe a behaviour. Use something like "remember-me keeps the user signed in after reload", with a `@regression` tag.
9. **Literal credentials in test code.** Acceptable for this sample app, but note it, and prefer a shared fixture constant.
10. **Duplicated login logic.** The new test duplicates `LoginPage`. Reuse the page object.
11. **Changed existing test.** `signIn('tester', 'secret123')` shows as modified with no visible change in the diff (probably whitespace or line endings). Ask the author to explain, because unexplained changes to existing tests need a reason.

## Coverage questions
- Does any test verify that remember-me actually keeps the user signed in? No.
- Would any test fail if remember-me were broken? No.
- Does the PR reduce the number of tests that run? Yes, because of `.only`.

## Evidence required before re-review
- Removal of `.only`, and a full `npm test` run with the HTML report attached.
- An `npm run test:changed -- origin/main` output showing which tags were selected for this change (`app/index.html` maps to `@regression`).
- A test showing the password is absent from `localStorage` and `sessionStorage` after sign-in.
- A test showing the session survives a reload when remember-me is ticked, and does not survive when it is not.
- If a trace or screenshot was investigated for the `waitForTimeout` issue, attach it.

## Release risk statement (for the author to revise)
"Remember-me is not yet safe to release. The current implementation stores the user's password in browser storage and the feature is not verified by tests. Release should wait for a token-based design and the tests above."

## Talking points for the lab debrief
- Why does the security finding outrank the test-style findings, even though both are in the same PR?
- AI-generated code often looks complete and passes locally. What specific checks in the PR template catch the problems in this diff?
- Which of the evidence items would convince you to approve, and which would still leave you uneasy?
