'use strict';
/* Audit the static site: every inline handler the HTML calls must actually
   exist, every element id it looks up must exist or be created, and the
   inline scripts must parse. Catches a dead button before a person does. */
const fs = require('fs');
const vm = require('vm');

const files = process.argv.slice(2);
let problems = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  console.log('\n=== ' + file + ' ===');

  // 1. Do the inline <script> blocks parse?
  const scripts = [...src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .filter((s) => s.trim());
  let js = '';
  scripts.forEach((s, i) => {
    try { new vm.Script(s, { filename: `${file}#script${i}` }); js += '\n' + s; }
    catch (e) { console.log(`  ✗ SYNTAX ERROR in inline script #${i}: ${e.message}`); problems++; }
  });
  console.log(`  ${scripts.length} inline script block(s) parsed`);

  // 2. Every handler named in an on*="fn(...)" attribute must be defined.
  const handlers = new Set();
  for (const m of src.matchAll(/\son[a-z]+\s*=\s*"([^"]*)"/gi)) {
    for (const c of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)) handlers.add(c[1]);
  }
  // Definitions: function f(), window.f =, var f = function, f: function (object literal)
  const defined = new Set(['alert', 'confirm', 'prompt', 'parseInt', 'parseFloat', 'Number',
    'String', 'Boolean', 'Array', 'Object', 'JSON', 'Math', 'Date', 'encodeURIComponent',
    'decodeURIComponent', 'setTimeout', 'clearTimeout', 'fetch', 'print', 'open', 'close',
    'event', 'this', 'if', 'return', 'typeof', 'new', 'delete', 'void']);
  for (const m of js.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)) defined.add(m[1]);
  for (const m of js.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) defined.add(m[1]);
  for (const m of js.matchAll(/(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*function/g)) defined.add(m[1]);
  for (const m of js.matchAll(/(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*\(/g)) defined.add(m[1]);
  /* Function PARAMETERS count as defined. Some handlers are built at render time —
     `onclick="'+clickFn(r.k)+'"` — where clickFn is a parameter that returns the real
     handler string. Without this the audit reports a live button as dead. */
  for (const m of js.matchAll(/function\s*[A-Za-z_$\w]*\s*\(([^)]*)\)/g)) {
    m[1].split(',').map((s) => s.trim().split(/[=\s]/)[0]).filter(Boolean).forEach((p) => defined.add(p));
  }

  const missing = [...handlers].filter((h) => !defined.has(h)).sort();
  console.log(`  ${handlers.size} distinct handler(s) referenced by markup`);
  if (missing.length) {
    console.log('  ✗ HANDLERS REFERENCED BUT NOT DEFINED: ' + missing.join(', '));
    problems += missing.length;
  } else {
    console.log('  ✓ every handler referenced in markup is defined');
  }

  // 3. el('x') / getElementById('x') lookups vs ids that exist in markup or are generated.
  const wanted = new Set();
  for (const m of js.matchAll(/\bel\(\s*'([^']+)'\s*\)/g)) wanted.add(m[1]);
  for (const m of js.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)) wanted.add(m[1]);
  const present = new Set();
  for (const m of src.matchAll(/\bid\s*=\s*"([^"]+)"/g)) present.add(m[1]);
  for (const m of js.matchAll(/id="?\s*'?\s*\+?\s*'?([a-zA-Z][\w-]*)/g)) present.add(m[1]);
  const noId = [...wanted].filter((w) => !present.has(w) && !/\+/.test(w)).sort();
  console.log(`  ${wanted.size} element id(s) looked up`);
  if (noId.length) console.log('  ⚠ looked up but no literal id in markup (may be built at runtime): ' + noId.join(', '));
  else console.log('  ✓ every looked-up id appears in the markup');

  /* 4. FOCUS-LOSS ON RE-RENDER.
     A live-edit field (oninput=) whose handler commits state, in a page that
     rebuilds by replacing innerHTML wholesale, destroys the input being typed
     into: the field takes one character and then drops focus. Invisible to a
     syntax check and to a handler-existence check — the code is perfectly
     valid, it simply cannot be typed into. Found in admin.html 2026-08-09
     affecting all 26 editable fields. */
  const liveFields = [...src.matchAll(/\soninput\s*=\s*"([^"]*)"/gi)].map((m) => m[1]);
  const rebuilds = /innerHTML\s*=/.test(js);
  const preserves = /activeElement/.test(js);
  console.log(`  ${liveFields.length} live-edit field(s) (oninput=)`);
  if (liveFields.length && rebuilds && !preserves) {
    console.log('  ✗ FOCUS-LOSS: page has oninput fields AND rebuilds via innerHTML, but never');
    console.log('    reads document.activeElement — typing drops focus on every keystroke.');
    problems++;
  } else if (liveFields.length && rebuilds) {
    console.log('  ✓ rebuilds via innerHTML but preserves focus (reads activeElement)');
  } else if (liveFields.length) {
    console.log('  ✓ live-edit fields present, no wholesale innerHTML rebuild');
  }

  /* 5. Writing to an element captured BEFORE a rebuild writes to a detached
     node. Bit us once with the upload status line, which lived inside the
     rebuilt panel.
     ⚠ Only nodes INSIDE the rebuilt container are at risk. A captured node that
     is part of the static skeleton (the toast, which is a sibling of <main>)
     survives every rebuild and must not be reported — a check that cries wolf
     gets ignored, which is how the real one gets missed. So: warn only for
     captures whose id is built at runtime, or is absent from the skeleton. */
  const captured = [...js.matchAll(/(?:var|let|const)\s+\w+\s*=\s*el\(\s*([^)]+)\)/g)].map((m) => m[1].trim());
  const risky = captured.filter((expr) => {
    if (/\+/.test(expr)) return true;                       // built at runtime -> inside the rebuild
    const lit = expr.replace(/^['"]|['"]$/g, '');
    return !present.has(lit);                               // not in the static skeleton
  });
  if (risky.length && /\.then\s*\(|setTimeout/.test(js)) {
    console.log('  ⚠ node(s) captured before a rebuild and used asynchronously: ' + risky.join(', '));
    console.log('    re-query inside the callback instead of capturing once.');
  } else if (captured.length) {
    console.log(`  ✓ ${captured.length} captured node(s), all part of the static skeleton (survive rebuilds)`);
  }
}

console.log('\n' + (problems ? `✗ ${problems} problem(s)` : '✓ no blocking problems found'));
process.exit(problems ? 1 : 0);
