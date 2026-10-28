# booleanbros.com

Static site for Boolean Bros LLC. Served by GitHub Pages from `main` with a
custom domain (`CNAME`), so **pushing to main deploys** (~50 s).

## Layout

```
index.html              studio homepage
privacy_policy/         privacy policy (linked from both app stores)
shrink/                 free in-browser image compressor (no build step, no deps)
  index.html            the compressor + 100 KB landing page
  20kb|50kb|200kb/      size-specific landing pages (generated)
  whatsapp|email|heic/  use-case pages (generated)
  vendor/               heic-to (LGPL-3.0), loaded lazily for HEIC only
404.html                branded not-found page
assets/apps/            card art, 720×1280
assets/site.css         compiled Tailwind (committed — Pages does not build)
src/tailwind.css        source styles; edit this, not site.css
tools/                  build + ops scripts (not indexed)
```

## Building

The only build step is CSS. After editing HTML classes or `src/tailwind.css`:

```bash
./tools/build-css.sh      # npx tailwindcss → assets/site.css (14 KB minified)
```

Tool sub-pages are generated from the master compressor page:

```bash
node tools/build-shrink-pages.mjs
```

Both outputs are committed on purpose: GitHub Pages serves the repo as-is.

## Notes

- Only third-party script on the site is the GoatCounter snippet: cookieless, aggregate counts, no personal data, no cookie banner needed. Fonts are self-hosted (no Google Fonts).
- `robots.txt` disallows `/tools/` and `/shrink/vendor/`; `sitemap.xml` lists the public pages.
- **Analytics:** every page carries the GoatCounter snippet. After regenerating pages (`build-app-pages.mjs`, `build-notes.mjs`, `build-shrink-pages.mjs`, `build-resize-pages.mjs`) or re-exporting the BST web demo, run `node tools/add-analytics.mjs` and then `node tools/add-analytics.mjs --check`. The generators embed the tag themselves; the script covers hand-written pages and the exported demo bundle.
- IndexNow key file at the repo root submits new URLs to Bing/Yandex via `tools/indexnow.mjs`.
