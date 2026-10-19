#!/usr/bin/env node
/**
 * Generates the size-specific compressor pages from shrink/index.html.
 *
 * shrink/index.html is the master (100 KB). Every other page is derived from it so
 * there is exactly one copy of the compressor code.
 *
 *   node tools/build-shrink-pages.mjs
 *
 * Writes shrink/<slug>/index.html for each page in PAGES.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTER = join(ROOT, 'shrink/index.html');
const ORIGIN = 'https://booleanbros.com';

const PAGES = [
  {
    slug: '20kb',
    kb: 20,
    label: '20 KB',
    title: 'Compress Image to 20 KB Online — Free, Private, In Your Browser',
    description:
      'Shrink a photo to 20 KB in your browser. Free, unlimited, nothing uploaded — for strict upload forms that cap photos and ID pictures at 20 KB.',
    h1: 'Compress an image<br>to 20 KB',
    lede: 'Strict upload forms are unforgiving at 20 KB. Pick a photo and the tool steps quality, then pixel dimensions, until the file fits — on your device, never on a server.',
    content: `    <section class="copy">
      <h2>What 20 KB actually gives you</h2>
      <p>A 20 KB JPEG is a small image. In practice that is roughly a 600×800 px photo when the
        scene is simple, and noticeably less when the frame is full of detail — foliage, grain, fine
        text and sharp edges all cost bytes. A 12-megapixel phone photo cannot stay at its original
        dimensions at 20 KB; something has to give.</p>
      <p>That is why this tool searches quality first and only then shrinks dimensions, one step at a
        time, re-encoding each attempt and measuring the real byte count. You get the largest image
        that still fits, rather than an arbitrary downscale.</p>

      <h2>If the form also caps dimensions</h2>
      <p>Most 20 KB caps come with a pixel requirement too — an ID photo at 200×230, a signature at
        140×60, a headshot at 600×800. Set <strong>Max dimension</strong> to match the form before you
        convert. Otherwise the tool may satisfy 20 KB at a size the form then rejects, and you will
        have to do it twice.</p>
      <ul>
        <li>Check the accepted format — it is usually JPEG, occasionally PNG.</li>
        <li>Crop to the requested aspect ratio first; padding out to a ratio wastes your byte budget.</li>
        <li>If the result looks blocky, the form's 20 KB cap is the problem, not the photo — many
          portals accept a slightly larger file than the help text claims, so try 30–50 KB if the
          page lets you.</li>
        <li>For ID and passport-style photos, 20 KB at 200×230 is normal and looks fine on screen.</li>
      </ul>
    </section>
`,
  },
  {
    slug: '50kb',
    kb: 50,
    label: '50 KB',
    title: 'Compress Image to 50 KB Online — Free, Private, In Your Browser',
    description:
      'Compress a photo to 50 KB in your browser. No upload, no account, no limit — the most common cap for forms, scanned signatures and email attachments.',
    h1: 'Compress an image<br>to 50 KB',
    lede: '50 KB is the most common upload cap there is. The tool searches for the highest quality that fits, then steps dimensions down if it has to — locally, in about a second.',
    content: `    <section class="copy">
      <h2>What 50 KB buys you</h2>
      <p>For a typical photograph, 50 KB comfortably holds roughly 900×1200 px. Portraits, product
        shots on clean backgrounds and anything with large areas of flat colour go further; busy
        landscapes and text-heavy scans go less far. The tool measures every attempt instead of
        guessing, so you see the real result before you download it.</p>

      <h2>Scans, signatures and documents</h2>
      <p>A scanned signature or a line drawing compresses very differently from a photo: thin dark
        strokes on white cost far fewer bytes than grain and shading. Keep the scan at its natural
        size and let the tool find the quality level — forcing dimensions down on a document usually
        destroys legibility long before the byte count matters.</p>
      <ul>
        <li>If the text stops being readable at 50 KB, that cap is too aggressive for a document
          scan — check whether the form accepts a larger file.</li>
        <li>Set <strong>Max dimension</strong> to the form's pixel limit if it publishes one; that is
          usually the real constraint, not the KB cap.</li>
        <li>Re-encoding strips EXIF, so GPS coordinates and camera details never travel with the
          upload.</li>
        <li>JPEG is right for photos and scans of photos; choose PNG only for line art where you
          need hard edges.</li>
      </ul>
    </section>
`,
  },
  {
    slug: '200kb',
    kb: 200,
    label: '200 KB',
    title: 'Compress Image to 200 KB Online — Free, Private, In Your Browser',
    description:
      'Shrink photos to 200 KB with no visible quality loss. Free in-browser compressor — batch, unlimited, nothing uploaded or stored anywhere.',
    h1: 'Compress an image<br>to 200 KB',
    lede: '200 KB is the sweet spot: small enough for almost any upload form, large enough that a phone photo still looks sharp. Runs entirely in your browser.',
    content: `    <section class="copy">
      <h2>Why 200 KB is usually enough</h2>
      <p>A modern 12-megapixel phone photo typically lands between 2 MB and 6 MB straight out of the
        camera. Re-encoded well, the same photo is often 200–400 KB with no difference you can see at
        normal viewing size — the original was storing far more precision than the eye resolves.</p>
      <p>So a 200 KB target is usually a mild trim rather than a visible loss. The tool takes the
        highest quality that fits, which for most photos means you keep full resolution and never
        touch the dimensions.</p>

      <h2>Where this target fits</h2>
      <ul>
        <li><strong>Marketplaces and listings</strong> — most cap images between 200 KB and 5 MB.</li>
        <li><strong>Portfolio and application uploads</strong> — 200 KB clears nearly every form.</li>
        <li><strong>Email and messaging</strong> — send a gallery without hitting attachment limits.</li>
        <li><strong>Web and print-at-home</strong> — plenty of resolution for a sharp A4 print.</li>
      </ul>

      <h2>When not to compress</h2>
      <p>If you are archiving originals or printing large, keep the untouched file. Compression is
        for delivery: the copy you send, upload or publish. Keep one original and shrink the copies.</p>
      <p>Re-encoding also drops EXIF, which means GPS location, capture time and camera serial number
        are gone from the output — worth knowing before you post a photo taken at home.</p>
    </section>
`,
  },
];

const master = readFileSync(MASTER, 'utf8');

function replaceOnce(html, from, to, label) {
  const found = typeof from === 'string' ? html.includes(from) : from.test(html);
  if (!found) throw new Error(`template anchor not found: ${label}`);
  return html.replace(from, to);
}

function build(page) {
  const url = `${ORIGIN}/shrink/${page.slug}/`;
  let html = master;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`, 'title');
  html = replaceOnce(
    html,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${page.description}">`,
    'description'
  );
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical');
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  html = replaceOnce(
    html,
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${page.title.replace(/ —.*$/, '')}">`,
    'og:title'
  );
  html = replaceOnce(
    html,
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${page.description}">`,
    'og:description'
  );

  // JSON-LD: point the WebApplication node at this page.
  html = html.replace('"url": "https://booleanbros.com/shrink/"', `"url": "${url}"`);
  html = html.replace('"name": "Image Shrinker — Web"', `"name": "Image Shrinker — ${page.label} preset"`);

  // Visible copy.
  html = replaceOnce(html, /<h1>Compress an image<br>to 100 KB<\/h1>/, `<h1>${page.h1}</h1>`, 'h1');
  html = replaceOnce(
    html,
    /<p class="lede">[\s\S]*?<\/p>/,
    `<p class="lede">${page.lede}</p>`,
    'lede'
  );
  html = replaceOnce(html, /    <section class="copy">[\s\S]*?<\/section>\n/, page.content, 'content section');

  // Default target for this page (also drives the footer before the first file).
  html = replaceOnce(
    html,
    "var state = { targetKB: 100, maxDim: 0, format: 'image/jpeg' };",
    `var state = { targetKB: ${page.kb}, maxDim: 0, format: 'image/jpeg' };`,
    'state default'
  );
  html = replaceOnce(
    html,
    '<button class="chip" data-kb="100" aria-pressed="true">100 KB</button>',
    `<button class="chip" data-kb="100">100 KB</button>`,
    'chip pressed 100'
  );
  html = replaceOnce(
    html,
    `<button class="chip" data-kb="${page.kb}">${page.label}</button>`,
    `<button class="chip" data-kb="${page.kb}" aria-pressed="true">${page.label}</button>`,
    'chip pressed target'
  );

  // Mark the current page in the size nav (strip the master's marker first).
  html = html.split(' aria-current="page"').join('');
  const navTarget =
    page.slug === '20kb' ? '/shrink/20kb/' : page.slug === '50kb' ? '/shrink/50kb/' : '/shrink/200kb/';
  html = replaceOnce(html, `<a href="${navTarget}">${page.label}</a>`, `<a href="${navTarget}" aria-current="page">${page.label}</a>`, 'size nav');

  return html;
}

let written = 0;
for (const page of PAGES) {
  const dir = join(ROOT, 'shrink', page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), build(page));
  console.log(`wrote shrink/${page.slug}/index.html  (${page.kb} KB)`);
  written++;
}
console.log(`${written} page(s) generated from shrink/index.html`);
