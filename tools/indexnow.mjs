#!/usr/bin/env node
/**
 * Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver).
 * Google ignores IndexNow — this is for the other engines, and for Bing-backed
 * surfaces (DuckDuckGo, ChatGPT search).
 *
 * Usage: node tools/indexnow.mjs
 * Exits non-zero if the key file is not live yet, so it is safe to retry.
 */
const HOST = 'booleanbros.com';
const KEY = '7a970339f3fcd9e8f5a517509f372283';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;

const res = await fetch(KEY_LOCATION, { headers: { 'cache-control': 'no-cache' } });
const body = (await res.text()).trim();
if (res.status !== 200 || body !== KEY) {
  console.error(`key file not live yet: HTTP ${res.status}, body ${JSON.stringify(body.slice(0, 40))}`);
  process.exit(1);
}

const xml = await (await fetch(SITEMAP)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) {
  console.error('no URLs found in sitemap');
  process.exit(1);
}

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});
console.log(`submitted ${urlList.length} urls -> HTTP ${r.status}`);
if (r.status !== 200 && r.status !== 202) {
  console.error((await r.text()).slice(0, 400));
  process.exit(1);
}
