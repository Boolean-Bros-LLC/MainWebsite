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
  {
    slug: 'whatsapp',
    kb: 500,
    label: 'WhatsApp',
    title: 'Compress Photos for WhatsApp — Free, On-Device, No Upload',
    description:
      'Make photos small enough to send on WhatsApp without handing over a 6 MB original. Free in-browser compressor — pick a size, convert, send. Nothing uploaded.',
    h1: 'Compress a photo<br>for WhatsApp',
    lede: 'WhatsApp re-encodes every photo you send, so the file that arrives is already smaller and softer than the one you started with. Shrink it yourself first and you decide what it looks like.',
    content: `    <section class="copy">
      <h2>What WhatsApp does to your photos</h2>
      <p>When you send a photo as a photo, WhatsApp re-encodes it and sends that copy — the original
        never leaves your phone in its original form. What arrives is smaller, softer, and out of your
        control. Sending the same file as a <strong>document</strong> keeps the original bytes intact,
        but then you are transferring however many megabytes the camera produced.</p>
      <p>Compressing first is the middle path: you pick the size, so the photo reaches the other end
        looking the way you intended, and it goes out fast even on a weak connection.</p>

      <h2>Which size to pick</h2>
      <ul>
        <li><strong>200 KB</strong> — chat, memes, quick shares. Fine on a phone screen.</li>
        <li><strong>500 KB</strong> — the default here. Sharp on any phone, still small enough to send
          instantly over mobile data.</li>
        <li><strong>1 MB</strong> — photos that will be forwarded, printed, or looked at on a laptop.</li>
        <li><strong>Group chats</strong> — go smaller. One large photo lands on everyone's phone and
          their data plan.</li>
      </ul>

      <h2>Before you hit send</h2>
      <p>Re-encoding strips EXIF, which means GPS coordinates, capture time and camera details are not
        in the file you forward. Worth knowing when a photo is going to a group rather than one person.</p>
      <p>If you need the original resolution preserved, send as a document — but compress it to your
        target size first, and the download still stays quick.</p>
    </section>
`,
  },
  {
    slug: 'email',
    kb: 200,
    label: 'Email',
    title: 'Compress Photos for Email — Free, In Your Browser',
    description:
      'Shrink photos before you attach them. Gmail caps messages at 25 MB and Outlook at 20 MB — get a phone photo down to 200 KB in seconds, entirely on your device.',
    h1: 'Compress photos<br>for email',
    lede: 'Photos straight off a phone are 3–6 MB each. Four of them can blow past an attachment limit. Compress once and send twenty.',
    content: `    <section class="copy">
      <h2>The limits you are actually up against</h2>
      <ul>
        <li><strong>Gmail</strong> — 25 MB per message. That counts the encoded message, so attachments
          should stay well under it; roughly 20 MB is the practical ceiling.</li>
        <li><strong>Outlook / Microsoft 365</strong> — 20 MB by default, and administrators can lower it.</li>
        <li><strong>Corporate and university mail</strong> — frequently 10 MB, sometimes 5 MB.</li>
        <li><strong>One modern phone photo</strong> — 3–6 MB at 12 megapixels.</li>
      </ul>
      <p>So a reply-all with four holiday photos is already over the line at most companies, and the
        bounce message arrives after you have stopped paying attention.</p>

      <h2>What 200 KB looks like</h2>
      <p>On a laptop or phone screen, a 200 KB photo is indistinguishable from the 5 MB original for
        almost any subject. It is not a print file — if someone is going to print it at A4, send 1 MB
        instead. For "here are the photos from Saturday", 200 KB is more than enough.</p>

      <h2>Two things worth doing</h2>
      <p>First, batch it: drop the whole set in and the tool processes them one after another, so you
        only pay attention once. Second, notice that re-encoding removes EXIF — recipients get the
        picture without your GPS coordinates, capture time and camera serial number attached.</p>
      <p>For sets that are genuinely large, no amount of compression beats a shared folder link.
        Compression is for the attachments you actually need to attach.</p>
    </section>
`,
  },
  {
    slug: 'heic',
    kb: 1024,
    label: 'HEIC → JPG',
    toolLabel: 'heic → jpg converter',
    title: 'HEIC to JPG Converter — Free, Private, In Your Browser',
    description:
      'Convert iPhone HEIC photos to JPG in your browser. No upload, no account, no watermark. The decoder runs locally, so your photos never leave your device.',
    h1: 'Convert HEIC<br>to JPG',
    lede: 'iPhones save photos as HEIC and most browsers cannot open them. This page decodes them on your device and hands back a normal JPG — nothing uploaded, nothing stored.',
    content: `    <section class="copy">
      <h2>Why HEIC files will not open</h2>
      <p>HEIC is a container for HEVC-compressed images — the same codec family as H.265 video. It
        stores the same picture in roughly half the bytes of JPEG, which is why Apple adopted it. The
        catch is licensing and support: Safari on Apple platforms can decode it, Chrome and Firefox
        generally cannot, and Windows needs an extension purchased from the Store.</p>
      <p>So the file is fine. The browser just has no codec for it.</p>

      <h2>How the conversion works here</h2>
      <p>This page downloads a HEIC decoder — the libheif library compiled to WebAssembly, about three
        megabytes — the first time you actually give it a HEIC file. It runs inside your browser, on
        your machine. Your photo is decoded locally, re-encoded as JPEG, and then compressed to your
        target size if it is over.</p>
      <p>The download happens once and is cached; on every later visit, conversion is instant. If you
        never touch a HEIC file, you never download the decoder.</p>

      <h2>What you get</h2>
      <ul>
        <li>A standard <strong>.jpg</strong> that opens anywhere — no watermark, no account, no queue.</li>
        <li>Metadata gone: re-encoding drops EXIF, so GPS location and camera details are not carried
          over.</li>
        <li>Batch friendly: drop a folder's worth of HEIC files and convert them in one pass.</li>
        <li>Default target is 1 MB, which keeps a 12-megapixel photo at full resolution in almost
          every case. Lower it if you need a smaller file.</li>
      </ul>
      <p>If a file fails to decode, it is either corrupt or uses a profile the decoder does not know.
        Re-exporting it on the phone usually fixes it.</p>
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
  html = html.replace('"name": "Image Shrinker — Web"', `"name": ${JSON.stringify(page.title.split(' — ')[0])}`);

  // Visible copy.
  html = replaceOnce(html, /<h1>Compress an image<br>to 100 KB<\/h1>/, `<h1>${page.h1}</h1>`, 'h1');
  if (page.toolLabel) {
    html = replaceOnce(
      html,
      '<span class="dot"></span> compressor',
      `<span class="dot"></span> ${page.toolLabel}`,
      'tool label'
    );
  }  html = replaceOnce(
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
    new RegExp(`<button class="chip" data-kb="${page.kb}">([^<]*)</button>`),
    `<button class="chip" data-kb="${page.kb}" aria-pressed="true">$1</button>`,
    'chip pressed target'
  );

  // Mark the current page in whichever nav it belongs to (strip the master's marker first).
  html = html.split(' aria-current="page"').join('');
  const selfPath = `/shrink/${page.slug}/`;
  html = replaceOnce(html, `<a href="${selfPath}">`, `<a href="${selfPath}" aria-current="page">`, 'nav current');

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
