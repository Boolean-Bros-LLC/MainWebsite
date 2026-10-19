# Vendored: heic-to

- Package: `heic-to@1.6.6` (IIFE build, `dist/iife/heic-to.js`)
- Source: https://github.com/hoppergee/heic-to
- License: LGPL-3.0 (see LICENSE-heic-to.txt). Unmodified build; libheif compiled to
  WebAssembly is bundled inside.
- Why vendored: the site has no build step and must not depend on a third-party CDN for a
  feature that runs on user photos. The file is loaded lazily, only when a HEIC/HEIF file
  is actually selected, so normal visitors never download it.

To upgrade: `npm pack heic-to`, copy `dist/iife/heic-to.js` over this file, update the
version above.
