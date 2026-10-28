#!/usr/bin/env node
// Inject the GoatCounter snippet into every HTML page (idempotent).
//
//   node tools/add-analytics.mjs          # rewrite files in place
//   node tools/add-analytics.mjs --check  # exit 1 if any page is missing it
//
// GoatCounter: cookieless, no personal data, ~3.5KB. Site code lives in SNIPPET below.
// Run this after any page build (`build-app-pages.mjs`, `build-shrink-pages.mjs`,
// `build-resize-pages.mjs`, `build-notes.mjs`) and after exporting the BST web demo.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SNIPPET = '  <script data-goatcounter="https://booleanbros.goatcounter.com/count" async src="https://booleanbros.goatcounter.com/count.js"></script>\n';
const MARKER = 'data-goatcounter';
const SKIP_DIRS = new Set(['node_modules', '.git', 'vendor', 'dist']);

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (extname(entry.name) === '.html') out.push(full);
  }
  return out;
}

const checkOnly = process.argv.includes('--check');
const files = (await walk(ROOT)).sort();

let injected = 0;
let missing = [];
let skipped = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = relative(ROOT, file);
  if (html.includes(MARKER)) { skipped.push(rel); continue; }
  const idx = html.lastIndexOf('</head>');
  if (idx === -1) { missing.push(rel); continue; }
  if (checkOnly) { missing.push(rel); continue; }
  const next = html.slice(0, idx) + SNIPPET + html.slice(idx);
  await writeFile(file, next);
  injected++;
}

if (checkOnly) {
  if (missing.length) {
    console.error(`✗ ${missing.length} page(s) missing the counter:\n  ${missing.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`✓ all ${files.length} pages carry the counter`);
} else {
  console.log(`injected into ${injected}, already had it ${skipped.length}, no <head> ${missing.length}`);
  if (missing.length) console.log(`  skipped (no </head>): ${missing.join(', ')}`);
}
