#!/usr/bin/env node
/**
 * Turns Playwright's JSON report into a Markdown summary for PR comments or
 * release notes. Writes test-results/summary.md and prints it.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const report = JSON.parse(readFileSync('test-results/results.json', 'utf8'));
const counts = { passed: 0, failed: 0, flaky: 0, skipped: 0 };
const failures = [];

function walk(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const last = test.results.at(-1);
      switch (test.status) {
        case 'expected': counts.passed++; break;
        case 'flaky': counts.flaky++; break;
        case 'skipped': counts.skipped++; break;
        default:
          counts.failed++;
          failures.push({
            title: spec.title,
            file: `${spec.file}:${spec.line}`,
            error: (last?.error?.message ?? 'Unknown error').split('\n')[0],
            retries: test.results.length - 1,
          });
      }
    }
  }
  (suite.suites ?? []).forEach(walk);
}
report.suites.forEach(walk);

const total = Object.values(counts).reduce((a, b) => a + b, 0);
const status = counts.failed === 0 ? '✅ GREEN' : '❌ RED';
const lines = [
  `## Test summary: ${status}`,
  '',
  `| Total | Passed | Failed | Flaky | Skipped |`,
  `|---|---|---|---|---|`,
  `| ${total} | ${counts.passed} | ${counts.failed} | ${counts.flaky} | ${counts.skipped} |`,
];
if (failures.length) {
  lines.push('', '### Failures', '');
  for (const f of failures) lines.push(`- **${f.title}** (${f.file}, retries: ${f.retries}): ${f.error}`);
  lines.push('', 'Open `npm run report` for traces, screenshots and videos.');
}
if (counts.flaky) lines.push('', `> ⚠️ ${counts.flaky} flaky test(s) passed only after retry. Treat as a defect, not a pass.`);

const md = lines.join('\n') + '\n';
mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/summary.md', md);
console.log(md);
process.exitCode = counts.failed ? 1 : 0;
