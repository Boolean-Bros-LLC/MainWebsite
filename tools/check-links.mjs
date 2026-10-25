#!/usr/bin/env node
/**
 * Link checker for the static site.
 *   node tools/check-links.mjs [--external]
 *
 * Always checks internal links against the files in this repo. With --external it also
 * requests every outbound URL (store listings, GitHub, Boolean Build) and reports non-2xx.
 *
 * Internal checks run in CI on every push; the external pass runs weekly, because store
 * listings disappear and repositories get renamed.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { relative, sep, posix } from 'node:path';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkExternal = process.argv.includes('--external');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pages = walk(ROOT);
const internal = new Set();
const external = new Set();
const attrRe = /(?:href|src)="([^"]+)"/g;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(attrRe)) {
    const url = m[1].trim();
    if (/['+`${}]/.test(url)) continue; // JS template fragments, not URLs
    if (!url || url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('blob:')) continue;
    if (url.startsWith('http')) external.add(url.split('#')[0]);
    else if (url.startsWith('/')) internal.add(url.split('#')[0].split('?')[0]);
    else {
      // Relative links resolve against the page's own directory, not the site root.
      // Treating them as root-relative flagged every "./favicon.png" in a nested page.
      const clean = url.split('#')[0].split('?')[0];
      const pageDir = '/' + relative(ROOT, dirname(page)).split(sep).join('/');
      internal.add(posix.normalize(posix.join(pageDir, clean)));
    }
  }
}

const missing = [];
for (const path of internal) {
  if (path === '/') continue;
  const candidates = [
    join(ROOT, path),
    join(ROOT, path, 'index.html'),
    join(ROOT, path + '.html'),
  ];
  const ok = candidates.some((c) => existsSync(c) && statSync(c).isFile());
  if (!ok && !path.endsWith('/')) {
    const withSlash = join(ROOT, path, 'index.html');
    if (!existsSync(withSlash)) missing.push(path);
  } else if (!ok) {
    missing.push(path);
  }
}

console.log(`pages: ${pages.length}  internal links: ${internal.size}  external links: ${external.size}`);
if (missing.length) {
  console.error(`\nBROKEN internal links (${missing.length}):`);
  for (const m of missing) console.error(`  ${m}`);
} else {
  console.log('internal links: all resolve');
}

let externalFailures = 0;
if (checkExternal) {
  const urls = [...external].sort();
  console.log(`\nchecking ${urls.length} external URLs…`);
  for (const url of urls) {
    let status = 0;
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000) });
        status = res.status;
        if (res.ok || (status >= 300 && status < 400)) break;
      } catch {
        status = status || -1;
      }
    }
    const bad = !(status >= 200 && status < 400);
    if (bad) externalFailures++;
    console.log(`  ${bad ? 'FAIL' : 'ok  '} ${String(status).padEnd(4)} ${url}`);
  }
}

const failed = missing.length + externalFailures;
if (failed) {
  console.error(`\n${failed} problem(s) found`);
  process.exit(1);
}
console.log('\nno problems found');
