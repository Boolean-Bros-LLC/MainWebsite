#!/usr/bin/env bash
# Rebuild the site stylesheet after editing HTML or src/tailwind.css.
# Output is committed, so GitHub Pages needs no build step.
set -euo pipefail
cd "$(dirname "$0")/.."
npx -y tailwindcss@3.4.17 -c tailwind.config.js -i src/tailwind.css -o assets/site.css --minify
ls -lh assets/site.css | awk '{print "site.css", $5}'
