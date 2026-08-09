/* ==================================================================
   OOCH — shared catalogue sync
   ------------------------------------------------------------------
   Loaded by BOTH the shop and the admin, after ooch-data.js.

   ★ WHY THIS EXISTS. ooch-data.js keeps the whole catalogue in
   localStorage. That is per-browser, and on iOS it is worse: a page
   added to the Home Screen gets a SEPARATE storage container from
   Safari, so one phone can hold two catalogues that never see each
   other. Text edited in the admin therefore never reached the shop.

   ★ CONFLICT RULE: last write wins, by timestamp. For a demo with two
   or three people that is the intuitive behaviour — whoever typed most
   recently is what everyone sees. It is NOT safe for genuine
   concurrent editing: two people editing different products in the
   same minute will have one silently overwrite the other. Proper
   per-record merging is the thing to build before this shop is real.

   ★ The photo map (/api/photos) stays the authority for images and is
   applied AFTER any adopted state, so a stale catalogue can never
   resurrect a deleted photo or drop a new one.
   ================================================================== */
(function (global) {
  'use strict';
  var O = global.OOCH;
  if (!O) return;

  var TS_KEY = 'ooch.sync.ts';
  var PULL_MS = 8000;
  var PUSH_DEBOUNCE_MS = 900;
  var pushTimer = null, busy = false, lastPushed = 0;

  function localTs() { try { return parseInt(global.localStorage.getItem(TS_KEY), 10) || 0; } catch (e) { return 0; } }
  function setLocalTs(t) { try { global.localStorage.setItem(TS_KEY, String(t)); } catch (e) {} }

  /* Replace the in-memory state wholesale. OOCH exposes `state` through a
     getter with no setter, so the only honest way in is the storage path it
     already trusts: write localStorage, then let it re-read. */
  function adopt(state, ts) {
    try {
      global.localStorage.setItem('ooch.store.v5', JSON.stringify(state));   /* keep in step with KEY in ooch-data.js */
      setLocalTs(ts);
      if (O.reload) O.reload();
      else global.location.reload();      /* older build without reload(): brute force */
    } catch (e) {}
  }

  function pull() {
    if (busy) return;
    fetch('/api/state', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.state || typeof d.ts !== 'number') {
          /* Nothing published yet — this device seeds it, so the first person
             to open the site after deploy does not lose what they have built. */
          if (localTs() === 0) push(true);
          return;
        }
        if (d.ts <= localTs()) return;
        /* ★ THE ONE DANGEROUS MOMENT, made a choice instead of a race.
           A device that has never synced (ts 0) but has its own catalogue is
           about to have it replaced by whatever is on the server. Every open
           page reloads within 20s of a deploy, so without this the first device
           to reach the server would silently overwrite everyone else's work.
           Asked ONCE per device; after the first sync this never appears. */
        if (localTs() === 0) {
          var ok = global.confirm(
            'This device has its own copy of the shop.\n\n' +
            'OK  — use the shared version everyone else sees (this device\'s own changes are replaced).\n' +
            'Cancel — publish THIS device\'s version to everyone instead.'
          );
          if (!ok) { push(true); return; }
        }
        adopt(d.state, d.ts);
      })
      .catch(function () {});
  }

  function push(force) {
    var ts = Date.now();
    if (!force && ts - lastPushed < 200) return;
    lastPushed = ts;
    busy = true;
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ts: ts, state: O.state })
    })
      .then(function (r) {
        if (r.ok) setLocalTs(ts);
        /* 409 means the server already holds newer work — take theirs rather
           than insisting on ours, and the next pull will bring it in. */
        return r.json().catch(function () { return null; });
      })
      .then(function () { busy = false; })
      .catch(function () { busy = false; });
  }

  /* Every local edit schedules a push. Debounced, because the admin commits on
     every keystroke and a request per character would be absurd. */
  O.on(function (state, remote) {
    if (remote) return;                     /* came from another tab, already shared */
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { push(false); }, PUSH_DEBOUNCE_MS);
  });

  /* The uploaded-photo map is server-owned and per (product, colourway). It is
     pushed into the data layer rather than into `state`, so adopting another
     device's catalogue can never drop or resurrect a photo. */
  function pullPhotos() {
    fetch('/api/photos', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) {
        if (!m || !O.setUploadedPhotos) return;
        O.setUploadedPhotos(m);
        if (O.commit) O.commit();          /* re-render with the new photos */
      })
      .catch(function () {});
  }
  pullPhotos();
  setInterval(pullPhotos, PULL_MS);
  global.OOCH_SYNC_PHOTOS = pullPhotos;

  pull();
  setInterval(pull, PULL_MS);
  global.OOCH_SYNC = { pull: pull, push: function () { push(true); } };
})(window);
