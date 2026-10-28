#!/usr/bin/env node
/**
 * Generates /apps/<slug>/ pages from one template + the data below.
 * Run: node tools/build-app-pages.mjs
 * Output is committed; GitHub Pages serves it as-is.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const APPS = [
  {
    slug: 'cognitive-challenge',
    name: 'Cognitive Challenge',
    tag: 'Puzzle',
    tagline: 'Attention training, one round at a time.',
    platform: 'iOS · Android',
    image: 'cognitive-challenge.jpg',
    alt: 'Cognitive Challenge — daily challenge screen',
    about: [
      'Cognitive Challenge is a Stroop-style attention test. The word names one colour while the ink shows another, and your job is to answer the ink — not the word. It sounds trivial until the clock starts.',
      'It is built as a repeatable drill rather than a course: one daily challenge to keep the habit honest, plus practice modes when you want to work on a specific skill. Your results stay on your device.',
    ],
    features: [
      'Daily challenge with a single shared test',
      'Practice modes plus an endless run — three mistakes ends it',
      'One rewarded revive when an endless run ends',
      'Session stats and streaks',
      'No sign-up, no account',
    ],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/cognitive-challenge/id6764170208', icon: 'appstore' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.nzl.stroopchallenge', icon: 'googleplay' },
    ],
  },
  {
    slug: 'neon-circuit',
    name: 'Neon Circuit',
    tag: 'Puzzle',
    tagline: 'A grid puzzle about routing power.',
    platform: 'iOS · Android',
    image: 'neon-circuit.jpg',
    alt: 'Neon Circuit — grid gameplay',
    about: [
      'Neon Circuit is a strategic grid game: connect the board, route power, and keep the circuit readable while the grid fills up.',
      'It rewards planning over speed. Most boards are lost three moves before the last one — the puzzle is noticing that in time.',
    ],
    features: [
      'Grid-based logic puzzles',
      'Progressive difficulty',
      'Clean neon board with readable state',
      'No sign-up, no account',
    ],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/neon-circuit/id6761695293', icon: 'appstore' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.nzl.signaljammer', icon: 'googleplay' },
    ],
  },
  {
    slug: 'byte-sized-tycoon',
    name: 'Byte-Sized Tycoon',
    tag: 'Idle',
    tagline: 'From one miner to an orbital data center.',
    platform: 'iOS · Android',
    image: 'byte-sized-tycoon.jpg',
    alt: 'Byte-Sized Tycoon — terminal-style idle game',
    metaDesc:
      'Byte-Sized Tycoon: from one miner to an orbital data center. Idle progression with real offline earnings, two prestige layers, 20 achievements and an auto-buy daemon.',
    about: [
      'Byte-Sized Tycoon starts with a single miner and a number that goes up. Reinvest the bytes, buy bigger hardware, and climb from Basic Miner through Data Rig, Server Rack, Mainframe Core, AI Training Cluster and Quantum Array to an Orbital Data Center.',
      'Prestige resets the run in exchange for Quantum Bits, which multiply everything you rebuild — and once you have banked a few, an Auto-Buy Daemon keeps the upgrades flowing whether the app is open or not.',
      'Intrusions break up the grind: hostile processes crawl across the screen and you squish them before the timer runs out. Clear the breach and collect a bounty; ignore it and you lose a chunk of your balance.',
    ],
    features: [
      'Idle progression with genuine offline earnings, even while the app is closed',
      'Nine hardware tiers from Basic Miner to Orbital Data Center, with a doubled-output milestone every 25 levels',
      'Two reset layers: breakthroughs for permanent boosts, prestige for Quantum Bits that multiply everything',
      '20 achievements, a lifetime stats page, and an Auto-Buy Daemon that keeps upgrading for you',
      'Free to play, no banner ads — watch a rewarded ad only when you want a boost',
    ],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/byte-sized-tycoon/id6792836682', icon: 'appstore' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.booleanbros.bytesizedtycoon', icon: 'googleplay' },
      { label: 'Play in your browser', href: '/apps/byte-sized-tycoon/play/' },
    ],
  },
  {
    slug: 'hilo-card-club',
    name: 'HiLo Card Club',
    tag: 'Card game',
    tagline: 'Higher or lower, streak by streak.',
    platform: 'iOS · Android',
    image: 'hilo-card-club.jpg',
    alt: 'HiLo Card Club — higher or lower card game',
    about: [
      'One deck, one question per round: is the next card higher or lower? Call it right and the streak grows; call it wrong and the run ends.',
      'Rounds are short by design — a few seconds each, no timers to wait out, no account to create. Push your luck for a bigger payout, or take the safe line and keep the streak alive.',
    ],
    features: [
      'Quick single-question rounds',
      'Streaks and escalating payouts',
      'No sign-up required',
      'Free to play',
    ],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/hilo-card-club/id6815674912', icon: 'appstore' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.booleanbros.hilocards', icon: 'googleplay' },
    ],
  },
  {
    slug: 'image-shrinker',
    category: 'MultimediaApplication',
    name: 'Image Shrinker',
    tag: 'Utility',
    tagline: 'Shrink photos to an exact size — on your device.',
    platform: 'Android · Web',
    image: 'image-shrinker.jpg',
    alt: 'Image Shrinker — compression results screen',
    about: [
      'Pick your photos, choose a target size, tap once. Image Shrinker compresses on-device and gets each file as close to your target as it can — 100 KB for a form upload, 500 KB for a message, whatever the limit is.',
      'Re-encoding drops the hidden data photos carry: GPS location, capture date, camera model. Nothing is uploaded, there is no account, and the app works in airplane mode.',
    ],
    features: [
      'Exact target sizes, measured per photo',
      'Batch jobs you can stop and resume',
      'GPS and EXIF metadata removed',
      'Free with ads; one-time Pro removes them',
    ],
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.booleanbros.imageshrinker', icon: 'googleplay' },
      { label: 'Web version', href: '/shrink/' },
    ],
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function icon(id) {
  return `<svg class="inline-block w-3 h-3 mr-1 -mt-0.5" fill="currentColor" aria-hidden="true"><use href="#icon-${id}"/></svg>`;
}

function page(app, all) {
  const others = all.filter((a) => a.slug !== app.slug);
  const url = `https://booleanbros.com/apps/${app.slug}/`;

  const links = app.links
    .map((l) => {
      const external = l.href.startsWith('http');
      const attrs = external ? `target="_blank" rel="noopener"` : '';
      const ic = l.icon ? icon(l.icon) : '';
      return `        <a href="${l.href}" class="btn btn-lg" ${attrs} aria-label="${esc(l.label)} — ${esc(app.name)}">${ic}${esc(l.label)}</a>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(app.name)} — ${esc(app.tagline)} | Boolean Bros LLC</title>
  <meta name="description" content="${esc(app.metaDesc || `${app.name}: ${app.tagline} ${app.features[0]}.`)}">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%232c2825'/%3E%3Cpath d='M8 22 L16 8 L24 22 Z' fill='%23f0ece4'/%3E%3C/svg%3E">
  <meta name="theme-color" content="#f0ece4">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Boolean Bros LLC">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(app.name)} — Boolean Bros LLC">
  <meta property="og:description" content="${esc(app.tagline)}">
  <meta property="og:image" content="https://booleanbros.com/assets/apps/${app.image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": ${JSON.stringify(app.name)},
    "applicationCategory": ${JSON.stringify(app.category || 'GameApplication')},
    "operatingSystem": ${JSON.stringify(app.platform)},
    "description": ${JSON.stringify(app.tagline)},
    "url": ${JSON.stringify(url)},
    "image": ${JSON.stringify(`https://booleanbros.com/assets/apps/${app.image}`)},
    "author": { "@type": "Organization", "name": "Boolean Bros LLC", "url": "https://booleanbros.com/" }
  }
  </script>
  <script data-goatcounter="https://booleanbros.goatcounter.com/count" async src="/assets/js/goatcounter-count.js"></script>
</head>
<body class="font-sans text-charcoal antialiased">

  <svg xmlns="http://www.w3.org/2000/svg" class="hidden" aria-hidden="true">
    <symbol id="icon-appstore" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></symbol>
    <symbol id="icon-googleplay" viewBox="0 0 24 24"><path d="M3.18 23.76c.3.17.64.24.99.2l12.23-12.23L13.24 8.6 3.18 23.76zm17.47-10.7-3.07-1.78-3.4 3.4 3.4 3.4 3.09-1.79c.88-.51.88-1.72-.02-2.23zM2.01 1.05C1.76 1.32 1.6 1.72 1.6 2.24v19.53c0 .52.16.92.41 1.19l.06.06L13.3 11.79v-.27L2.07.99l-.06.06zm10.46 11.51 3.4-3.4-3.4-3.4-1.16 1.16v4.49l1.16 1.15z"/></symbol>
  </svg>

  <nav class="fixed top-0 inset-x-0 z-50 border-b border-charcoal" style="background-color: rgba(240,236,228,0.96); backdrop-filter: blur(4px);">
    <div class="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
      <a href="/" class="font-mono text-[10px] font-semibold tracking-widest uppercase text-charcoal select-none">Boolean Bros LLC</a>
      <div class="flex items-center gap-7">
        <a href="/#apps" class="nav-link">[APPS]</a>
        <a href="/shrink/" class="nav-link">[FREE TOOL]</a>
        <a href="/notes/" class="nav-link">[NOTES]</a>
        <a href="/#contact" class="nav-link">[CONTACT]</a>
      </div>
    </div>
  </nav>

  <main class="pt-11">
    <div class="max-w-6xl mx-auto px-6 py-12 md:py-16">

      <p class="font-mono text-[9px] tracking-widest uppercase text-charcoal-dim mb-8">
        <a href="/" class="hover:text-charcoal">Home</a> / <a href="/#apps" class="hover:text-charcoal">Apps</a> / ${esc(app.name)}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">

        <div class="md:col-span-7">
          <div class="flex items-center gap-3 mb-4">
            <span class="btn cursor-default" style="padding:0.2rem 0.55rem;font-size:0.6rem;">[${esc(app.tag.toUpperCase())}]</span>
            <span class="font-mono text-[9px] tracking-widest uppercase text-charcoal-dim">${esc(app.platform)}</span>
          </div>

          <h1 class="font-sans uppercase leading-[0.95] tracking-tight font-black text-4xl sm:text-5xl mb-4">${esc(app.name)}</h1>
          <p class="text-charcoal-mid text-base md:text-lg leading-relaxed max-w-xl mb-7">${esc(app.tagline)}</p>

          <div class="flex flex-wrap gap-2.5 mb-10">
${links}
          </div>

          <div class="border-t border-charcoal pt-6">
            <h2 class="font-mono text-[10px] font-semibold tracking-widest uppercase mb-3">About</h2>
${app.about.map((p) => `            <p class="text-charcoal-mid text-sm leading-relaxed mb-3">${esc(p)}</p>`).join('\n')}
          </div>

          <div class="border-t border-charcoal mt-8 pt-6">
            <h2 class="font-mono text-[10px] font-semibold tracking-widest uppercase mb-3">What's in it</h2>
            <ul class="font-mono text-[11px] text-charcoal-mid leading-relaxed space-y-2">
${app.features.map((f) => `              <li>— ${esc(f)}</li>`).join('\n')}
            </ul>
          </div>

          <div class="border-t border-charcoal mt-8 pt-6">
            <h2 class="font-mono text-[10px] font-semibold tracking-widest uppercase mb-3">Privacy</h2>
            <p class="text-charcoal-mid text-sm leading-relaxed">
              No account is required to use ${esc(app.name)}. What the app does and does not collect is written
              out in full in the <a href="/privacy_policy/" class="underline decoration-1 underline-offset-4 hover:no-underline">privacy policy</a>.
            </p>
          </div>
        </div>

        <div class="md:col-span-4 md:self-center max-w-[360px] w-full mx-auto">
          <div class="border border-charcoal overflow-hidden bg-paper-shade">
            <picture class="block"><source type="image/webp" srcset="/assets/apps/${app.image.replace(/\.jpg$/, '.webp')}"><img src="/assets/apps/${app.image}" alt="${esc(app.alt)}" class="w-full h-auto block" width="720" height="1280"></picture>
          </div>
          <p class="font-mono text-[9px] tracking-widest uppercase text-charcoal-dim mt-3 text-center">Actual app screen</p>
        </div>

      </div>

      <div class="border-t border-charcoal mt-14 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span class="font-mono text-[9px] tracking-widest uppercase text-charcoal-dim">More from the studio</span>
          <div class="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px]">
${others.map((o) => `            <a href="/apps/${o.slug}/" class="hover:underline">${esc(o.name)} <span class="text-charcoal-dim">· ${esc(o.tag)}</span> →</a>`).join('\n')}
          </div>
        </div>
      </div>

    </div>
  </main>

  <footer class="border-t border-charcoal mt-8">
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
}

let n = 0;
for (const app of APPS) {
  const dir = join(ROOT, 'apps', app.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(app, APPS));
  console.log(`wrote apps/${app.slug}/index.html`);
  n++;
}
console.log(`${n} app pages generated`);
