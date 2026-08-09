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
}

console.log('\n' + (problems ? `✗ ${problems} problem(s)` : '✓ no blocking problems found'));
process.exit(problems ? 1 : 0);
