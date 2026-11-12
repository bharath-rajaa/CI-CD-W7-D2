# Hands-on lab: review a sample pull request

## Objective
Review `sample-pr-0042.diff` as a senior tester would and recommend one of:
**Approve**, **Request changes**, or **Approve only with additional evidence**.

## Steps
1. Read the PR description and the diff in `sample-pr-0042.diff`.
2. Complete `review-template.md`. Be specific: cite file and line for each finding.
3. Classify each finding as blocking, non-blocking, or question.
4. Decide the verdict and list the evidence you need before merging.
5. Compare with `reviewer-guide.md` only after you have written your own review.

## Time
About 45 minutes. Stretch goal: write the replacement test for the remember-me feature.

## Optional practical check
Apply the diff on a branch (`git apply lab/sample-pr-0042.diff`) and run:

```bash
npm run test:smoke
npm run test:changed -- HEAD~1   # or the base commit you create
npm run summary
npm run report
```

Verify the claims you made in your review. Do not trust the PR description alone.
