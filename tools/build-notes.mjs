#!/usr/bin/env node
/**
 * Builds /notes/ — the studio shipping log.
 * Run: node tools/build-notes.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const NOTES = [
  {
    date: '2026-10-30',
    title: 'Five builds to find a line of spaces',
    body: [
      'Byte-Sized Tycoon 1.4 spent a full day failing to open. The build quit in under a second, before the splash screen, with a SIGABRT and no JavaScript error in either the system log or the crash report. Five builds went out chasing it: one reverting a layout change, one adding a full-screen error handler, one fixing a genuinely bare string in a tab label, and one teaching that handler to print the component stack.',
      'The cause was whitespace. JSX keeps a text node made only of spaces or tabs if it sits on the same line as a closing tag. Closing tags separated by a run of spaces compile to a View whose children include a string, and React Native throws Text strings must be rendered within a Text component on the first frame. A run of whitespace is stripped only when it contains a newline, which is why the same pattern is harmless one line lower.',
      'That throw fires before any error boundary can mount, so the diagnostic screen built to catch it had nothing to catch. The rule we were missing: whitespace with no newline in it is real text to JSX. The fix is two lines, and a second copy of the pattern was sitting in another view, not yet hit by a build, so it went out in the same commit.',
      'Every build now starts with a grep: a closing tag, a run of spaces, and a closing tag, with no newline between them, has to come back empty across the .tsx files. TypeScript does not see this bug, a source scan that skips whitespace-only text does not see it, and it never reaches a stack trace. Byte-Sized Tycoon 1.4 is on TestFlight with that fix plus the economy and ad changes that were queued behind it.',
    ],
    links: [{ label: 'Byte-Sized Tycoon', href: '/apps/byte-sized-tycoon/' }],
  },
  {
    date: '2026-10-19',
    title: 'A photo compressor that cannot see your photos',
    body: [
      'Image Shrinker now runs in the browser as well as on Android. Pick a target size — 20 KB for a form, 200 KB for email — and the compressor hits it without uploading anything, because there is no server to upload to.',
      'The web version also converts HEIC photos from iPhones to JPG, decoding them locally with a bundled WebAssembly build of libheif. Same rule as the app: the file never leaves the device.',
    ],
    links: [
      { label: 'Open the compressor', href: '/shrink/' },
      { label: 'HEIC to JPG', href: '/shrink/heic/' },
    ],
  },
  {
    date: '2026-10-19',
    title: 'Byte-Sized Tycoon 1.1: fewer ads, by policy',
    body: [
      'App Review rejected 1.1 for showing "multiple consecutive ads". The cause was structural: four different reset actions each fired an interstitial with no coordination, so two resets in quick succession produced two full-screen ads.',
      'Every interstitial now passes through one policy — no ads in the first 90 seconds, at least three minutes apart, never within two minutes of a rewarded video, at most three per session, and never on a player\'s first prestige.',
    ],
    links: [
      { label: 'Byte-Sized Tycoon', href: '/apps/byte-sized-tycoon/' },
      { label: 'How we fixed it ↗', href: 'https://booleanbuild.com/posts/ad-frequency-review.html' },
    ],
  },
  {
    date: '2026-10-18',
    title: 'Surviving the iOS 27 launch requirement',
    body: [
      'A build compiled with the iOS 27 SDK crashes on launch without a scene manifest — EXC_BREAKPOINT inside UIKitCore, before any of our code runs. The fix is UIScene adoption: a scene delegate that owns the window and boots React Native.',
      'We wrote it as an Expo config plugin so a prebuild cannot quietly undo it. The same class of bug had already cost us one rejection.',
    ],
    links: [
      { label: 'Byte-Sized Tycoon', href: '/apps/byte-sized-tycoon/' },
      { label: 'The full write-up ↗', href: 'https://booleanbuild.com/posts/ios-27-uiscene-crash.html' },
    ],
  },
  {
    date: '2026-10-16',
    title: 'Image Shrinker is live on Google Play',
    body: [
      'A photo compressor that runs entirely on the phone: exact target sizes, batch jobs you can stop and resume, and metadata stripped before anything is saved or shared.',
      'Free with ads, with a one-time Pro upgrade that removes them and lifts the daily limit.',
    ],
    links: [{ label: 'Image Shrinker', href: '/apps/image-shrinker/' }],
  },
  {
    date: '2026-09-15',
    title: 'Byte-Sized Tycoon 1.0 ships on both stores',
    body: [
      'One miner, seven tiers of hardware, and an Orbital Data Center at the top. Prestige resets the run for permanent multipliers, and the machines keep earning while the app is closed.',
    ],
    links: [{ label: 'Byte-Sized Tycoon', href: '/apps/byte-sized-tycoon/' }],
  },
];

NOTES.forEach((n) => {
  n.slug = n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const entries = NOTES.map((n) => {
  const links = n.links
    .map((l) => `<a href="${l.href}" class="underline decoration-1 underline-offset-4 hover:no-underline">${esc(l.label)}</a>`)
    .join(' <span class="text-charcoal-dim">·</span> ');
  return `        <article id="${n.slug}" class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 pt-8 pb-8 border-b border-charcoal/25">
          <div class="sm:col-span-3 font-mono text-[10px] tracking-widest uppercase text-charcoal-dim pt-1">${n.date}</div>
          <div class="sm:col-span-9">
            <h2 class="text-base font-bold uppercase tracking-wide mb-2">${esc(n.title)}</h2>
${n.body.map((p) => `            <p class="text-charcoal-mid text-sm leading-relaxed mb-3">${esc(p)}</p>`).join('\n')}
            <div class="font-mono text-[11px] mt-1">${links}</div>
          </div>
        </article>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notes — what we shipped | Boolean Bros LLC</title>
  <meta name="description" content="A shipping log from Boolean Bros LLC: what went live, what broke, and what we changed. Apps, updates and release engineering notes.">
  <link rel="canonical" href="https://booleanbros.com/notes/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%232c2825'/%3E%3Cpath d='M8 22 L16 8 L24 22 Z' fill='%23f0ece4'/%3E%3C/svg%3E">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <meta name="theme-color" content="#f0ece4">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Boolean Bros LLC">
  <meta property="og:url" content="https://booleanbros.com/notes/">
  <meta property="og:title" content="Notes — what we shipped | Boolean Bros LLC">
  <meta property="og:description" content="A shipping log: what went live, what broke, and what we changed.">
  <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="alternate" type="application/rss+xml" title="Boolean Bros — Notes" href="/notes/feed.xml">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Boolean Bros — Notes",
    "url": "https://booleanbros.com/notes/",
    "description": "A shipping log from an independent mobile studio.",
    "publisher": { "@type": "Organization", "name": "Boolean Bros LLC", "url": "https://booleanbros.com/" }
  }
  </script>
  <script data-goatcounter="https://booleanbros.goatcounter.com/count" async src="/assets/js/goatcounter-count.js"></script>
</head>
<body class="font-sans text-charcoal antialiased">

  <nav class="fixed top-0 inset-x-0 z-50 border-b border-charcoal" style="background-color: rgba(240,236,228,0.96); backdrop-filter: blur(4px);">
    <div class="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
      <a href="/" class="font-mono text-[10px] font-semibold tracking-widest uppercase text-charcoal select-none">Boolean Bros LLC</a>
      <div class="flex items-center gap-7">
        <a href="/#apps" class="nav-link">[APPS]</a>
        <a href="/shrink/" class="nav-link">[FREE TOOL]</a>
        <a href="/notes/" class="nav-link" aria-current="page">[NOTES]</a>
        <a href="/#contact" class="nav-link">[CONTACT]</a>
      </div>
    </div>
  </nav>

  <main class="pt-11">
    <div class="max-w-6xl mx-auto px-6 py-12 md:py-16">

      <p class="font-mono text-[9px] tracking-widest uppercase text-charcoal-dim mb-8">
        <a href="/" class="hover:text-charcoal">Home</a> / Notes
      </p>

      <h1 class="font-sans uppercase leading-[0.95] tracking-tight font-black text-4xl sm:text-5xl mb-4">Notes</h1>
      <p class="text-charcoal-mid text-sm md:text-base leading-relaxed max-w-2xl mb-10">
        A shipping log. What went live, what broke, and what we changed — newest first.
        Longer technical write-ups live at
        <a href="https://booleanbuild.com" class="underline decoration-1 underline-offset-4 hover:no-underline">Boolean Build ↗</a>.
      </p>

      <div class="border-t border-charcoal">
${entries}
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
        <a href="/#apps" class="underline decoration-1 underline-offset-4 hover:no-underline">All apps →</a>
        <a href="/shrink/" class="underline decoration-1 underline-offset-4 hover:no-underline">Free image compressor →</a>
        <a href="https://booleanbuild.com" class="underline decoration-1 underline-offset-4 hover:no-underline">Release engineering notes ↗</a>
      </div>

    </div>
  </main>

  <footer class="border-t border-charcoal">
    <div class="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <span class="font-mono text-[9px] text-charcoal-dim tracking-widest uppercase">&copy; 2026 Boolean Bros LLC</span>
      <div class="flex gap-6">
        <a href="/privacy_policy/" class="font-mono text-[9px] text-charcoal-dim hover:text-charcoal tracking-widest uppercase">Privacy</a>
        <a href="/#contact" class="font-mono text-[9px] text-charcoal-dim hover:text-charcoal tracking-widest uppercase">Contact</a>
        <a href="/" class="font-mono text-[9px] text-charcoal-dim hover:text-charcoal tracking-widest uppercase">Home ↑</a>
      </div>
    </div>
  </footer>

</body>
</html>
`;

mkdirSync(join(ROOT, 'notes'), { recursive: true });
writeFileSync(join(ROOT, 'notes', 'index.html'), html);
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Boolean Bros — Notes</title>
    <link>https://booleanbros.com/notes/</link>
    <description>A shipping log from an independent mobile studio.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${NOTES.map((n) => `    <item>
      <title>${esc(n.title)}</title>
      <link>https://booleanbros.com/notes/#${n.slug}</link>
      <guid>https://booleanbros.com/notes/#${n.slug}</guid>
      <pubDate>${new Date(n.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${esc(n.body[0])}</description>
    </item>`).join("\n")}
  </channel>
</rss>
`;
writeFileSync(join(ROOT, "notes", "feed.xml"), feed);
console.log(`wrote notes/index.html (${NOTES.length} entries) + feed.xml`);
