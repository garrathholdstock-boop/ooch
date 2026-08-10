import React from "react";
import { createRoot } from "react-dom/client";
import Ooch, { applyContent, DEFAULT_CONTENT } from "./Ooch.jsx";
import "./index.css";

/* ==================================================================
   Load the admin's saved content BEFORE the first render.
   ------------------------------------------------------------------
   Rendering first and patching after would show the built-in prices
   and copy for a frame and then visibly swap them. So the fetch is
   awaited and the app mounts once, already correct.

   FAIL-SOFT: if the API is down, slow, or has nothing saved, the site
   renders its built-in content exactly as before. A content server
   that is unreachable must never mean a shop that will not load. The
   timeout is what enforces that — without it a hanging request would
   leave a blank page indefinitely.

   DEFAULT_CONTENT is published on window BEFORE the fetch and before
   mount, so the admin can still read the originals even if the shop
   crashes while rendering. That is what guarantees there is always a
   way back from a bad save.
   ================================================================== */
window.OOCH_DEFAULTS = DEFAULT_CONTENT;

/* ==================================================================
   ERROR BOUNDARY — added 2026-08-10 after an audit.
   ------------------------------------------------------------------
   The site renders straight from editable data, and React 18 unmounts
   the ENTIRE root when a render throws. So one bad value saved in the
   console — a size chart trimmed to three rows, a product left with
   no colours, an emptied gallery — turned the whole shop into a white
   page rather than one broken section.
   Nobody editing a shop should be able to reach a state they cannot
   get out of from the same phone. This catches the throw, explains it
   in plain words, and offers the one button that always works:
   discard the saved content and go back to the original site.
   ================================================================== */
class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error("ooch render failed:", err, info); }
  render() {
    if (!this.state.err) return this.props.children;
    const wrap = {
      minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px",
      background: "#F5FBFF", color: "#22384A",
      font: "16px/1.55 'Nunito',-apple-system,system-ui,sans-serif", textAlign: "center",
    };
    const btn = {
      background: "#1F4460", color: "#fff", border: "none", borderRadius: "999px",
      padding: ".7em 1.4em", fontWeight: 800, fontSize: "16px", cursor: "pointer", marginTop: "18px",
    };
    return (
      <div style={wrap}>
        <div style={{ maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "28px", margin: "0 0 10px" }}>Something in the shop's content isn't right</h1>
          <p style={{ color: "#5B7A96", margin: 0 }}>
            A recent change in the admin left a section the site can't display —
            an empty list, or a field it needs that's now missing.
          </p>
          <p style={{ color: "#5B7A96" }}>
            Nothing is lost. Putting the original content back fixes it straight away,
            and your saved version stays in the admin's History.
          </p>
          <button style={btn} onClick={() => {
            fetch("/api/content", { method: "DELETE" })
              .catch(() => {})
              .then(() => window.location.reload());
          }}>
            Put the original content back
          </button>
          <p style={{ color: "#5B7A96", fontSize: "13px", marginTop: "16px" }}>
            Or open <a href="/admin/" style={{ color: "#1F4460" }}>the admin</a> and undo the last change.
          </p>
        </div>
      </div>
    );
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

function mount() {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Boundary>
        <Ooch />
      </Boundary>
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
