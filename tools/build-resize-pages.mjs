#!/usr/bin/env node
/**
 * Generates /resize/<slug>/ from resize/index.html (the master).
 * Run: node tools/build-resize-pages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTER = join(ROOT, 'resize/index.html');
const ORIGIN = 'https://booleanbros.com';

const PAGES = [
  {
    slug: '600x600',
    w: 600,
    h: 600,
    label: '600×600',
    title: 'Resize an Image to 600×600 — Free, Private, In Your Browser',
    description:
      'Crop and resize any photo to exactly 600 by 600 pixels in your browser. Free, batch, no upload — for avatars, marketplace listings and profile pictures.',
    h1: 'Resize to<br>600 × 600',
    lede: 'Six hundred square is the most common profile and listing size there is. Pick a photo, choose fit or fill, download — the pixels never leave your device.',
    fit: 'fill',
    content: `    <section class="copy">
      <h2>Why 600×600</h2>
      <p>600×600 is the size most marketplaces, forums and profile systems ask for. It is large enough to
        look sharp on a retina phone screen and small enough that every platform accepts it without
        re-compressing your photo into mush.</p>
      <p>This page preloads the square preset and switches the mode to <strong>fill</strong>, which is
        usually what you want: the frame is completely covered and the overflow is cropped from the
        centre. If your subject is off-centre, switch to <em>fit</em> and the whole photo is kept, with
        bars on two sides.</p>

      <h2>Getting a clean square</h2>
      <ul>
        <li>Crop tight before you upload if the subject sits near an edge — fill crops from the centre.</li>
        <li>Portrait photos lose the top and bottom; landscape photos lose the sides.</li>
        <li>Export as JPEG for photos, PNG only when you need transparency.</li>
        <li>Re-encoding strips EXIF, so GPS and camera details do not travel with the upload.</li>
      </ul>
    </section>
`,
  },
  {
    slug: '1080x1080',
    w: 1080,
    h: 1080,
    label: '1080×1080',
    title: 'Resize an Image to 1080×1080 for Instagram — Free, No Upload',
    description:
      'Make a 1080 by 1080 pixel square for Instagram posts and carousels. Free in-browser resizer — crop or fit, batch, and nothing is uploaded.',
    h1: 'Resize to<br>1080 × 1080',
    lede: 'The square Instagram post size. One preset, fill mode, and your photo is ready to upload — processed in the browser, not on a server.',
    fit: 'fill',
    content: `    <section class="copy">
      <h2>The square post size</h2>
      <p>Instagram displays square posts at 1080×1080. Uploading something larger just means Instagram
        re-compresses it for you; uploading something smaller means it gets upscaled and looks soft. Doing
        the resize yourself is the only way to control what the final file looks like.</p>
      <p>This page opens with 1080×1080 selected and <strong>fill</strong> mode on, so a landscape or
        portrait photo is cropped to a centred square at full quality.</p>

      <h2>Before you post</h2>
      <ul>
        <li>Keep the subject inside the middle square — the edges are what gets cropped.</li>
        <li>JPEG at these dimensions is typically 200–600 KB, which uploads instantly.</li>
        <li>Metadata is dropped on re-encode; posting a photo from home will not leak its GPS tag.</li>
        <li>For a portrait post, resize to 1080×1350 instead — same width, taller frame.</li>
      </ul>
    </section>
`,
  },
  {
    slug: '2x2-inch',
    w: 600,
    h: 600,
    label: '2×2 inch',
    title: '2×2 Inch Photo (600×600 at 300 DPI) — Free Passport Photo Resizer',
    description:
      'Make a 2 by 2 inch photo: 600×600 pixels at 300 DPI. Free in-browser resizer for passport, visa and ID photos — nothing is uploaded.',
    h1: 'Make a<br>2 × 2 inch photo',
    lede: 'Two inches square at 300 DPI is 600×600 pixels. That is the size most US passport, visa and ID forms ask for — and the maths most people get wrong.',
    fit: 'fill',
    content: `    <section class="copy">
      <h2>The arithmetic</h2>
      <p>Print sizes are inches; digital files are pixels. The bridge is DPI — dots per inch. At the
        300 DPI that photo printing assumes:</p>
      <ul>
        <li><strong>2 × 2 inches</strong> → 600 × 600 px</li>
        <li>1 × 1 inch → 300 × 300 px</li>
        <li>2 × 2 inches at 600 DPI → 1200 × 1200 px</li>
      </ul>
      <p>If a form asks for "2×2 inches, 300 DPI" you need 600×600 pixels and nothing else. This page
        preloads exactly that, in <strong>fill</strong> mode so the frame is fully covered.</p>

      <h2>What this tool does and does not do</h2>
      <p>It resizes and crops your photo to the right pixel dimensions, and strips the metadata. It does
        not check background colour, head position, or the specific framing rules of a given passport
        office — those are set by the authority you are applying to, and they vary by country.</p>
      <ul>
        <li>Use a photo with even lighting and a plain background where possible.</li>
        <li>Crop before uploading so the head sits where the form expects it.</li>
        <li>Export as JPEG; most portals reject PNG for photo uploads.</li>
        <li>Re-encoding removes GPS — worth doing for any ID document.</li>
      </ul>
    </section>
`,
  },
];

const master = readFileSync(MASTER, 'utf8');

function replaceOnce(html, from, to, label) {
  const found = typeof from === 'string' ? html.includes(from) : from.test(html);
  if (!found) throw new Error(`anchor not found: ${label}`);
  return html.replace(from, to);
}

function build(page) {
  const url = `${ORIGIN}/resize/${page.slug}/`;
  let html = master;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`, 'title');
  html = replaceOnce(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${page.description}">`, 'description');
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical');
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${page.title.split(' — ')[0]}">`, 'og:title');
  html = replaceOnce(html, /"url": "https:\/\/booleanbros.com\/resize\/"/, `"url": "${url}"`, 'ld url');
  html = replaceOnce(html, /<h1>Resize to<br>exact pixels<\/h1>/, `<h1>${page.h1}</h1>`, 'h1');
  html = replaceOnce(html, /<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${page.lede}</p>`, 'lede');
  html = replaceOnce(html, /    <section class="copy">[\s\S]*?<\/section>\n/, page.content, 'content');
  html = replaceOnce(html, "var state = { w: 0, h: 0, lock: true, fit: 'fit', fmt: 'image/jpeg' };",
    `var state = { w: ${page.w}, h: ${page.h}, lock: true, fit: '${page.fit}', fmt: 'image/jpeg' };`, 'state');

  // size nav: mark the current page
  html = html.split(' aria-current="page"').join('');
  html = replaceOnce(html, `<a href="/resize/${page.slug}/">${page.label} →</a>`, `<a href="/resize/${page.slug}/" aria-current="page">${page.label} →</a>`, 'nav current');

  return html;
}

for (const page of PAGES) {
  const dir = join(ROOT, 'resize', page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), build(page));
  console.log(`wrote resize/${page.slug}/index.html (${page.w}×${page.h})`);
}
console.log(`${PAGES.length} resize pages generated`);
