#!/usr/bin/env node
/**
 * Regression selection: maps files changed since a base ref to Playwright tags.
 *
 * Usage:
 *   node scripts/select-regression.mjs [base-ref]          # print the command
 *   node scripts/select-regression.mjs --run [base-ref]    # print and execute it
 *
 * Rules live in scripts/test-map.json. Unmapped files escalate to the
 * "unknownFileTags" set, so a new file never silently skips tests.
 */
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const run = args.includes('--run');
const base = args.find(a => !a.startsWith('--')) ?? 'origin/main';
const map = JSON.parse(readFileSync(new URL('./test-map.json', import.meta.url), 'utf8'));

let changed = [];
try {
  changed = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' })
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
} catch {
  console.error(`Could not diff against "${base}". Falling back to smoke tests only.`);
}

const tags = new Set(map.alwaysTags);            // smoke always runs
for (const file of changed) {
  const rule = map.rules.find(r => file === r.path || file.startsWith(r.path));
  const ruleTags = rule ? rule.tags : map.unknownFileTags;
  ruleTags.forEach(t => tags.add(t));
}

const pattern = [...tags].join('|');
const command = `npx playwright test --grep "${pattern}"`;

console.log(`Changed files (${changed.length}):`);
changed.forEach(f => console.log(`  - ${f}`));
console.log(`\nSelected tags: ${[...tags].join(', ')}`);
console.log(`Command: ${command}\n`);

if (run) {
  const result = spawnSync(command, { shell: true, stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
