import React from "react";
import { createRoot } from "react-dom/client";
import Ooch, { applyContent, DEFAULT_CONTENT } from "./Ooch.jsx";
import "./index.css";

/* ==================================================================
   Load the admin's saved content BEFORE the first render.
   ------------------------------------------------------------------
   Rendering first and patching after would show the built-in prices
   and copy for a frame and then visibly swap them — on a slow phone,
   long enough to read. So the fetch is awaited and the app mounts once,
   already correct.

   FAIL-SOFT, deliberately: if the API is down, slow, or has nothing
   saved, the site renders its built-in content exactly as it does
   today. A content server that is unreachable must never mean a shop
   that will not load. The timeout is what enforces that — without it a
   hanging request would leave a blank page indefinitely.

   DEFAULT_CONTENT is published on window for the admin console, which
   opens the shop in a hidden frame to read the originals. That keeps
   "reset to original" honest: the defaults come from the built bundle
   itself, so they cannot drift from what the site actually ships.
   ================================================================== */
window.OOCH_DEFAULTS = DEFAULT_CONTENT;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

function mount() {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Ooch />
    </React.StrictMode>
  );
}

withTimeout(fetch("/api/content", { cache: "no-store" }), 2500)
  .then((r) => (r && r.ok ? r.json() : null))
  .then((doc) => {
    if (doc && doc.content && Object.keys(doc.content).length) applyContent(doc.content);
  })
  .catch(() => { /* offline, no API, or nothing saved — built-in content stands */ })
  .finally(mount);
