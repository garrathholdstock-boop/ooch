'use strict';
/* ==================================================================
   OOCH — upload API
   ------------------------------------------------------------------
   The storefront and admin are static files. This is the smallest
   possible server that lets the admin console put a real photograph
   on a product, because the prototype had no upload path at all:
   admin.html contains no file input, no FileReader, no FormData.

   ★ DELIBERATELY ZERO DEPENDENCIES. Node 18 core only — no express,
   no multer, nothing to audit or keep patched on a box that also runs
   a live trading desk. The client POSTs the File object as the RAW
   request body (fetch(url, {method:'POST', body: file})), so there is
   no multipart parser here and none needed.

   ★ WHAT THIS DOES NOT DO YET: shared product state. Each browser
   still keeps its own catalogue in localStorage. Photos are shared
   the moment they are uploaded (every device loads the same URL), but
   "which products exist" is still per-device. Making that shared is a
   separate, deliberate migration — done carelessly it would overwrite
   whatever the girls have already built in their own browsers.
   ================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 8110;
const HOST = '127.0.0.1';                 // nginx fronts this; never bind public
const UPLOAD_DIR = '/srv/ooch/data/uploads';
const PHOTOS_FILE = '/srv/ooch/data/photos.json';
const MAX_BYTES = 12 * 1024 * 1024;       // 12 MB — a phone photo, comfortably

/* ★ TOTAL QUOTA (2026-08-09). The admin is deliberately open, so this endpoint
   is an unauthenticated write to disk that anyone who finds the URL can use.
   A per-file limit does not bound that: 12 MB x N still fills the volume, and
   THIS BOX ALSO RUNS A LIVE TRADING DESK whose capture.db needs room to write.
   A full disk would take the desk down as collateral damage from a toy shop.
   A ceiling on the whole uploads directory removes that path: the worst case
   becomes "the shop stops accepting photos", a nuisance rather than an
   incident. 2 GB is roughly 6,000 resized photos; the demo currently uses 14 MB. */
const MAX_TOTAL_BYTES = 2 * 1024 * 1024 * 1024;

function uploadsTotal() {
  var total = 0;
  try {
    for (const f of fs.readdirSync(UPLOAD_DIR)) {
      try { total += fs.statSync(path.join(UPLOAD_DIR, f)).size; } catch (e) {}
    }
  } catch (e) {}
  return total;
}

/* ★ THE PHOTO MAP — productId -> /uploads/x.jpg, held on the SERVER.
   Added 2026-08-09 after a photo uploaded on an iPhone showed in the admin and
   not on the shop. The upload itself was fine; the problem was that "which
   photo belongs to which product" lived only in that browser's localStorage.
   On iOS that is worse than it sounds: a page added to the Home Screen gets a
   SEPARATE storage container from Safari, so the same phone can hold two
   different catalogues and neither knows about the other.
   Keeping just this one mapping server-side makes photos appear on every
   device and in every tab, without touching the rest of the catalogue — which
   deliberately stays local while the girls are mid-play, because a shared
   catalogue introduced now would overwrite whatever they have already built. */
/* ★ BUILD ID — the mtimes of the two pages, so any deploy changes the value.
   The pages poll this and reload themselves when it moves. Without it a page
   left open on a phone keeps running whatever JavaScript it loaded hours ago,
   which is exactly how two uploads silently failed on 2026-08-09: the admin
   was still running a version that had no idea the server-side photo map
   existed, so it saved the photo locally and told nobody. A stale page must
   not be something a person has to notice. */
function buildId() {
  try {
    const a = fs.statSync('/srv/ooch/app/admin.html').mtimeMs;
    const b = fs.statSync('/srv/ooch/app/index.html').mtimeMs;
    return String(Math.round(a)) + '-' + String(Math.round(b));
  } catch (e) { return 'unknown'; }
}

function readPhotos() {
  try { return JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf8')) || {}; }
  catch (e) { return {}; }
}
function writePhotos(map) {
  const tmp = PHOTOS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(map, null, 2), { mode: 0o644 });
  fs.renameSync(tmp, PHOTOS_FILE);   // atomic: a torn read is impossible
}

/* ★ Accept RASTER IMAGES ONLY, identified by MAGIC BYTES, never by the
   Content-Type header the client claims. SVG is refused on purpose: it is
   XML, it can carry <script>, and these files are served from the same
   origin as the shop — an uploaded SVG would be stored XSS. A phone camera
   never produces one, so nothing legitimate is lost. */
function sniff(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return { ext: 'jpg', mime: 'image/jpeg' };
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return { ext: 'png', mime: 'image/png' };
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { ext: 'gif', mime: 'image/gif' };
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return { ext: 'webp', mime: 'image/webp' };
  return null;
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/health') {
    let n = 0;
    try { n = fs.readdirSync(UPLOAD_DIR).length; } catch (e) {}
    const used = uploadsTotal();
    return json(res, 200, {
      ok: true, uploads: n, build: buildId(),
      usedMB: Math.round(used / 1048576), capMB: Math.round(MAX_TOTAL_BYTES / 1048576)
    });
  }

  /* List what has been uploaded, newest first — lets the admin offer a
     picker instead of forcing a re-upload of a photo already on the box. */
  if (url.pathname === '/api/uploads' && req.method === 'GET') {
    try {
      const files = fs.readdirSync(UPLOAD_DIR)
        .filter((f) => !f.startsWith('.'))
        .map((f) => ({ f, t: fs.statSync(path.join(UPLOAD_DIR, f)).mtimeMs }))
        .sort((a, b) => b.t - a.t)
        .slice(0, 200)
        .map((x) => '/uploads/' + x.f);
      return json(res, 200, { files });
    } catch (e) {
      return json(res, 500, { error: 'list_failed' });
    }
  }

  /* The whole map, fetched by both the shop and the admin at startup. */
  if (url.pathname === '/api/photos' && req.method === 'GET') {
    return json(res, 200, readPhotos());
  }

  /* Attach or detach a photo. Body: {"id":"sw01","url":"/uploads/x.jpg"} — a
     null/absent url detaches, which is how "Remove photo" reaches every device. */
  if (url.pathname === '/api/photos' && (req.method === 'POST' || req.method === 'PUT')) {
    let body;
    try { body = JSON.parse((await readBody(req, 64 * 1024)).toString('utf8') || '{}'); }
    catch (e) { return json(res, 400, { error: 'bad_json' }); }
    const id = String(body.id || '').trim();
    if (!id || !/^[\w-]{1,64}$/.test(id)) return json(res, 400, { error: 'bad_id' });
    const map = readPhotos();
    if (body.url) {
      /* Only ever store a path we produced: /uploads/<hex>.<ext>. This is the
         field both pages inject straight into an <img src>, so an arbitrary
         string here would be a stored injection point on the shop's origin. */
      if (!/^\/uploads\/[a-f0-9]{16}\.(jpg|png|gif|webp)$/.test(body.url)) {
        return json(res, 400, { error: 'bad_url' });
      }
      map[id] = body.url;
    } else {
      delete map[id];
    }
    try { writePhotos(map); } catch (e) { return json(res, 500, { error: 'write_failed' }); }
    return json(res, 200, { ok: true, photos: map });
  }

  if (url.pathname === '/api/upload' && req.method === 'POST') {
    let buf;
    try {
      buf = await readBody(req, MAX_BYTES);
    } catch (e) {
      return json(res, 413, { error: 'too_large', maxMB: MAX_BYTES / 1024 / 1024 });
    }
    if (!buf || !buf.length) return json(res, 400, { error: 'empty' });

    /* Checked AFTER the body is read but BEFORE anything is written, so a
       request can never leave a partial file behind once the quota is hit. */
    const used = uploadsTotal();
    if (used + buf.length > MAX_TOTAL_BYTES) {
      return json(res, 507, {
        error: 'quota_full',
        detail: 'The photo store is full. Delete some photos, or raise MAX_TOTAL_BYTES.',
        usedMB: Math.round(used / 1048576), capMB: Math.round(MAX_TOTAL_BYTES / 1048576)
      });
    }

    const kind = sniff(buf);
    if (!kind) {
      return json(res, 415, {
        error: 'not_an_image',
        detail: 'Only JPEG, PNG, GIF or WebP. SVG is refused on purpose — it can carry scripts.'
      });
    }

    const name = crypto.randomBytes(8).toString('hex') + '.' + kind.ext;
    const dest = path.join(UPLOAD_DIR, name);
    try {
      /* Write to a temp name then rename: a half-written file can never be
         served, because the rename is atomic within the directory. */
      const tmp = dest + '.part';
      fs.writeFileSync(tmp, buf, { mode: 0o644 });
      fs.renameSync(tmp, dest);
    } catch (e) {
      return json(res, 500, { error: 'write_failed' });
    }
    return json(res, 200, { url: '/uploads/' + name, bytes: buf.length, mime: kind.mime });
  }

  if (url.pathname === '/api/upload' && req.method === 'DELETE') {
    const f = url.searchParams.get('file') || '';
    /* basename() strips any traversal — a request for ../../etc/passwd
       becomes "passwd" and then fails to exist. */
    const safe = path.basename(f);
    if (!safe || safe !== f.replace(/^\/uploads\//, '')) return json(res, 400, { error: 'bad_name' });
    try { fs.unlinkSync(path.join(UPLOAD_DIR, safe)); } catch (e) { return json(res, 404, { error: 'not_found' }); }
    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: 'no_route' });
});

server.listen(PORT, HOST, () => {
  console.log('ooch-api listening on http://' + HOST + ':' + PORT);
});
