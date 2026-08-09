/* ==================================================================
   OOCH — Shared data layer
   ------------------------------------------------------------------
   One source of truth for the storefront and the admin console.
   Both load this file. Anything the admin changes is written to
   localStorage and broadcast to every open tab, so deleting a product
   in the console makes it disappear from the live site instantly.

   No build step. No framework. Works in every browser that has
   localStorage, which is all of them since 2010.
================================================================== */
(function (global) {
'use strict';

/* ★2026-08-09 BUMPED v4 -> v5 for the design merge. The catalogue changed shape:
   colour keys are now 'sky-blue' not 'sky', and products carry a `photo` prefix
   for the per-colourway photography. A cached v4 catalogue would be accepted by
   load() and would suppress the new one — the photos simply would not appear,
   with nothing to indicate why. Bumping forces every device to re-seed from the
   new catalogue. It DOES discard catalogue edits made in a browser before this
   deploy; those were edits to the catalogue being replaced. */
var KEY = 'ooch.store.v5';
var CHANNEL = 'ooch.sync';

/* ---------- seeded random so the demo data never jumps around ---- */
function rng(seed) {
  var s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ================= COLOURWAYS ================= */
var COLOURS = {
  'baby-blue':  { name: 'Baby blue',  note: 'soft & sweet',        hex: '#D4DDED' },
  'sky-blue':   { name: 'Sky blue',   note: 'bright & fresh',      hex: '#B3CCEB' },
  'cornflower': { name: 'Cornflower', note: 'cool & calm',         hex: '#8DA0C2' },
  'denim-blue': { name: 'Denim blue', note: 'classic & timeless',  hex: '#5875A4' },
  'navy-blue':  { name: 'Navy blue',  note: 'deep & effortless',   hex: '#293046' },
  'white':      { name: 'White',      note: 'clean & classic',     hex: '#F2F2EF' },
  'sand':       { name: 'Sand',       note: 'warm & neutral',      hex: '#E4D6C1' }
};

/* ================= GARMENT ART =================
   Flat vector stand-ins for photography. Every product renders from
   one of these, tinted with the selected colourway. Replaced with
   real shots when the shoot happens. */
var ART = {
hoodie:function(c,a){return s('<path d="M33 16 L20 25 L9 46l14 8 4-9v46h46V45l4 9 14-8-11-21-12-9-6 10a10 10 0 0 1-18 0z" fill="'+c+'"/><path d="M39 16q11 11 22 0" fill="none" stroke="'+sh(c)+'" stroke-width="2.5"/><path d="M50 55v22" stroke="'+sh(c)+'" stroke-width="2" fill="none"/>',a);},
crew:function(c,a){return s('<path d="M34 15 L14 25 L6 44l13 7 5-9v49h52V42l5 9 13-7-8-19-20-10-6 9a9 9 0 0 1-16 0z" fill="'+c+'"/><path d="M38 15q12 10 24 0" fill="none" stroke="'+sh(c)+'" stroke-width="2.5"/>',a);},
zip:function(c,a){return s('<path d="M33 16 L20 25 L9 46l14 8 4-9v46h46V45l4 9 14-8-11-21-12-9-6 10a10 10 0 0 1-18 0z" fill="'+c+'"/><path d="M50 20v71" stroke="'+sh(c)+'" stroke-width="2.5"/><circle cx="50" cy="34" r="2.6" fill="'+sh(c)+'"/>',a);},
tee:function(c,a){return s('<path d="M34 16 L14 26 L6 44l13 7 5-9v45h52V42l5 9 13-7-8-18-20-10-5 9a9 9 0 0 1-16 0z" fill="'+c+'"/>',a);},
longsleeve:function(c,a){return s('<path d="M34 16 L12 26 L2 60l13 5 6-16v42h58V55l6 16 13-5-10-34-22-10-5 9a9 9 0 0 1-16 0z" fill="'+c+'"/>',a);},
crop:function(c,a){return s('<path d="M34 18 L14 28 L6 46l13 7 5-9v27h52V44l5 9 13-7-8-18-20-10-5 9a9 9 0 0 1-16 0z" fill="'+c+'"/>',a);},
tank:function(c,a){return s('<path d="M36 16q6 12 14 12t14-12l10 6-4 14v52H30V36l-4-14z" fill="'+c+'"/>',a);},
pants:function(c,a){return s('<path d="M28 12h44l5 88H55L50 52 45 100H23z" fill="'+c+'"/><rect x="28" y="12" width="44" height="7" fill="'+sh(c)+'"/>',a);},
shorts:function(c,a){return s('<path d="M28 22h44l4 46H55l-5-24-5 24H24z" fill="'+c+'"/><rect x="28" y="22" width="44" height="7" fill="'+sh(c)+'"/>',a);},
swimshort:function(c,a){return s('<path d="M26 26h48l4 40H54l-4-18-4 18H22z" fill="'+c+'"/><rect x="26" y="26" width="48" height="6" fill="'+sh(c)+'"/><path d="M50 32v6" stroke="'+sh(c)+'" stroke-width="2"/>',a);},
boardshort:function(c,a){return s('<path d="M25 24h50l5 54H55l-5-26-5 26H20z" fill="'+c+'"/><rect x="25" y="24" width="50" height="6" fill="'+sh(c)+'"/><path d="M50 30v8" stroke="'+sh(c)+'" stroke-width="2"/>',a);},
bikinitop:function(c,a){return s('<path d="M22 44q12-16 28-4 16-12 28 4-6 18-22 18-6 0-6-6 0 6-6 6-16 0-22-18z" fill="'+c+'"/><path d="M22 44 12 30M78 44 88 30" stroke="'+c+'" stroke-width="3.5" fill="none" stroke-linecap="round"/>',a);},
bikinibottom:function(c,a){return s('<path d="M24 42h52q-4 26-26 34Q28 68 24 42z" fill="'+c+'"/><rect x="24" y="42" width="52" height="5" rx="2.5" fill="'+sh(c)+'"/>',a);},
onepiece:function(c,a){return s('<path d="M30 20q20-8 40 0 4 22-4 34 6 14 2 26-18 8-36 0-4-12 2-26-8-12-4-34z" fill="'+c+'"/><path d="M38 20q12 10 24 0" fill="none" stroke="'+sh(c)+'" stroke-width="2.5"/>',a);},
rashie:function(c,a){return s('<path d="M34 16 L12 26 L2 60l13 5 6-16v42h58V55l6 16 13-5-10-34-22-10-5 9a9 9 0 0 1-16 0z" fill="'+c+'"/><path d="M22 66h56" stroke="'+sh(c)+'" stroke-width="3"/>',a);},
bucket:function(c,a){return s('<path d="M30 34q20-14 40 0v22H30z" fill="'+c+'"/><path d="M16 56h68l-6 16H22z" fill="'+c+'"/><path d="M16 56h68" stroke="'+sh(c)+'" stroke-width="2.5"/>',a);},
cap:function(c,a){return s('<path d="M26 56q0-30 24-30t24 30z" fill="'+c+'"/><path d="M74 56h16q-2 10-16 10z" fill="'+sh(c)+'"/><circle cx="50" cy="27" r="3.5" fill="'+sh(c)+'"/>',a);},
beanie:function(c,a){return s('<path d="M28 58q0-30 22-30t22 30z" fill="'+c+'"/><rect x="24" y="56" width="52" height="14" rx="6" fill="'+sh(c)+'"/>',a);},
straw:function(c,a){return s('<path d="M34 42q16-14 32 0v18H34z" fill="'+c+'"/><ellipse cx="50" cy="62" rx="38" ry="11" fill="'+c+'"/><ellipse cx="50" cy="60" rx="38" ry="11" fill="'+sh(c)+'" opacity=".35"/>',a);},
headband:function(c,a){return s('<path d="M14 62q36-42 72 0" fill="none" stroke="'+c+'" stroke-width="13" stroke-linecap="round"/><path d="M38 42 24 32v18zM62 42l14-10v18z" fill="'+c+'"/><circle cx="50" cy="42" r="7" fill="'+c+'"/>',a);},
twist:function(c,a){return s('<path d="M14 62q18-24 36-24t36 24" fill="none" stroke="'+c+'" stroke-width="12" stroke-linecap="round"/><path d="M32 46q18 14 36 0" fill="none" stroke="'+sh(c)+'" stroke-width="4"/>',a);},
tote:function(c,a){return s('<path d="M24 40h52l-5 52H29z" fill="'+c+'"/><path d="M36 40V28a14 14 0 0 1 28 0v12" fill="none" stroke="'+c+'" stroke-width="4"/>',a);},
towel:function(c,a){return s('<rect x="24" y="18" width="52" height="74" rx="5" fill="'+c+'"/><path d="M24 34h52M24 78h52" stroke="'+sh(c)+'" stroke-width="3"/>',a);},
socks:function(c,a){return s('<path d="M34 20h16v40l16 12v14H40l-14-12V38z" fill="'+c+'"/><rect x="34" y="20" width="16" height="8" fill="'+sh(c)+'"/>',a);},
scrunchie:function(c,a){return s('<ellipse cx="50" cy="52" rx="30" ry="20" fill="none" stroke="'+c+'" stroke-width="14"/><ellipse cx="50" cy="52" rx="30" ry="20" fill="none" stroke="'+sh(c)+'" stroke-width="3" stroke-dasharray="7 7"/>',a);},
bottle:function(c,a){return s('<rect x="38" y="26" width="24" height="66" rx="10" fill="'+c+'"/><rect x="43" y="14" width="14" height="14" rx="4" fill="'+sh(c)+'"/><rect x="38" y="52" width="24" height="9" fill="'+sh(c)+'"/>',a);},
sunnies:function(c,a){return s('<rect x="14" y="42" width="30" height="22" rx="9" fill="'+c+'"/><rect x="56" y="42" width="30" height="22" rx="9" fill="'+c+'"/><path d="M44 50h12" stroke="'+c+'" stroke-width="5"/>',a);}
};
function s(inner, alt) {
  return '<svg viewBox="0 0 100 110" role="img" aria-label="' +
    (alt || '').replace(/"/g, '') + '">' + inner + '</svg>';
}
function sh(hex) { /* darker shade for seams and detail */
  var n = parseInt(hex.slice(1), 16);
  var r = Math.max(0, (n >> 16) - 38), g = Math.max(0, ((n >> 8) & 255) - 34), b = Math.max(0, (n & 255) - 28);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

/* ================= CATEGORIES ================= */
var CATEGORIES = [
  { id:'tops',    name:'Tees & tops',      blurb:'Everyday weight, everyday blues.' },
  { id:'hoodies', name:'Hoodies & sweats', blurb:'The signature. Oversized on purpose.' },
  { id:'bottoms', name:'Bottoms',          blurb:'Wide, soft, and cut to move.' },
  { id:'swim',    name:'Swim',             blurb:'For long days and salt water.' },
  { id:'access',  name:'Accessories',      blurb:'The little things that finish it.' },
  { id:'hats',    name:'Hats',             blurb:'Sun on, sun off.' }
];

/* ================= PRODUCTS =================
   cost = landed unit cost in EUR (factory + freight + duty)
   eur  = base retail excluding tax                          */
var CATALOGUE = [
  /* ================================================================
     THE REAL RANGE — shot, cut and colour-matched.
     `photo` is a filename prefix in assets/; the colourway key is
     appended to it, e.g. hoodie- + sky-blue -> assets/hoodie-sky-blue.webp
  ================================================================= */
  { id:'hoodie', cat:'hoodies', name:'Cloud hoodie', eur:68, cost:15.0, photo:'hoodie-', art:'hoodie',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['XS','S','M','L','XL','XXL'], hs:'611020', fibre:'80% Cotton, 20% Polyester',
    origin:'China', hero:true, signature:true, real:true,
    views:[['sig-front','Front'],['sig-back','Back'],['sig-hood','Hood'],['sig-fabric','Fabric'],['sig-logo','Logo']],
    models:[['sig-model-1','Worn, front'],['sig-model-2','Worn, back'],['sig-model-3','Worn with the pant']] },

  { id:'tee', cat:'tops', name:'Everyday tee', eur:32, cost:6.5, photo:'tee-', art:'tee',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['XS','S','M','L','XL','XXL'], hs:'610910', fibre:'100% Cotton',
    origin:'China', hero:true, real:true },

  { id:'pant', cat:'bottoms', name:'Wide leg track pant', eur:58, cost:13.0, photo:'pant-', art:'pants',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['XS','S','M','L','XL'], hs:'610462', fibre:'65% Cotton, 35% Polyester',
    origin:'China', hero:true, real:true },

  { id:'skort', cat:'bottoms', name:'Mini skort', eur:45, cost:10.0, photo:'skort-', art:'shorts',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['XS','S','M','L','XL'], hs:'610453', fibre:'65% Cotton, 35% Polyester',
    origin:'China', hero:true, real:true, desc:'Mini skort with a satin bow at the waist.' },

  { id:'tote', cat:'access', name:'Mini tote', eur:22, cost:4.0, photo:'tote-', art:'tote',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['One size'], hs:'420222', fibre:'100% Cotton canvas',
    origin:'China', hero:true, real:true },

  { id:'bikini', cat:'swim', name:'Ooch bikini', eur:48, cost:11.0, photo:'bikini-front-', art:'bikinitop',
    cols:['sky-blue','white'], sizes:['XS','S','M','L','XL'], hs:'611241',
    fibre:'80% Polyamide, 20% Elastane', origin:'China', hero:true, real:true,
    views:[['bikini-front-sky-blue','Front'],['bikini-back-sky-blue','Back']] },

  { id:'band-twist', cat:'access', name:'Twist headband', eur:12, cost:1.5, photo:'band-twist-', art:'twist',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China', real:true },

  { id:'band-bow', cat:'access', name:'Bow headband', eur:12, cost:1.8, photo:'band-bow-', art:'headband',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China', hero:true, real:true },

  { id:'band-skinny', cat:'access', name:'Skinny headband', eur:9, cost:1.2, photo:'band-skinny-', art:'headband',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China', real:true },

  { id:'band-wide', cat:'access', name:'Wide headband', eur:12, cost:1.6, photo:'band-wide-', art:'headband',
    cols:['baby-blue','sky-blue','cornflower','denim-blue','navy-blue'],
    sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China', real:true },

  /* ================================================================
     NOT YET SHOT — vector placeholders so the shop looks full and the
     analytics have something to drill into. Marked `real:false`, and
     the admin labels them "Placeholder art" so nobody confuses them
     for finished products. Delete the lot when the range is settled.
  ================================================================= */
  { id:'crew', cat:'hoodies', name:'Everyday crew', eur:58, cost:13.0, art:'crew',
    cols:['baby-blue','sky-blue','navy-blue','white'], sizes:['XS','S','M','L','XL'],
    hs:'611030', fibre:'80% Cotton, 20% Polyester', origin:'China' },
  { id:'zip', cat:'hoodies', name:'Cloud zip-through', eur:76, cost:17.5, art:'zip',
    cols:['baby-blue','navy-blue','denim-blue'], sizes:['XS','S','M','L','XL','XXL'],
    hs:'611020', fibre:'80% Cotton, 20% Polyester', origin:'China' },
  { id:'longsleeve', cat:'tops', name:'Long sleeve top', eur:42, cost:9.0, art:'longsleeve',
    cols:['baby-blue','navy-blue','white'], sizes:['XS','S','M','L','XL'],
    hs:'610910', fibre:'100% Cotton', origin:'China' },
  { id:'crop', cat:'tops', name:'Crop top', eur:34, cost:6.0, art:'crop',
    cols:['baby-blue','sky-blue','white'], sizes:['XS','S','M','L'],
    hs:'610910', fibre:'100% Cotton', origin:'China' },
  { id:'flowy', cat:'tops', name:'Flowy top', eur:44, cost:9.5, art:'tank',
    cols:['baby-blue','sky-blue','sand','white'], sizes:['XS','S','M','L','XL'],
    hs:'610990', fibre:'100% Viscose', origin:'China' },
  { id:'short', cat:'bottoms', name:'Relaxed short', eur:40, cost:8.0, art:'shorts',
    cols:['baby-blue','navy-blue','denim-blue'], sizes:['XS','S','M','L','XL'],
    hs:'610462', fibre:'65% Cotton, 35% Polyester', origin:'China' },
  { id:'dresspant', cat:'bottoms', name:'Dress pant', eur:74, cost:16.0, art:'pants',
    cols:['navy-blue','denim-blue'], sizes:['XS','S','M','L','XL'],
    hs:'610463', fibre:'70% Polyester, 30% Viscose', origin:'China' },
  { id:'swimshort', cat:'swim', name:'Coast swim short', eur:52, cost:12.0, art:'swimshort',
    cols:['navy-blue','denim-blue','sky-blue','sand'], sizes:['S','M','L','XL','XXL'],
    hs:'620411', fibre:'100% Polyester', origin:'China' },
  { id:'rashie', cat:'swim', name:'Long sleeve rash top', eur:56, cost:13.0, art:'rashie',
    cols:['navy-blue','denim-blue','baby-blue'], sizes:['XS','S','M','L','XL'],
    hs:'611241', fibre:'85% Polyester, 15% Elastane', origin:'China' },
  { id:'bucket', cat:'hats', name:'Bucket hat', eur:32, cost:5.5, art:'bucket',
    cols:['baby-blue','sky-blue','navy-blue','sand'], sizes:['S/M','L/XL'],
    hs:'650500', fibre:'100% Cotton', origin:'China' },
  { id:'cap', cat:'hats', name:'Six panel cap', eur:30, cost:5.0, art:'cap',
    cols:['baby-blue','navy-blue','white'], sizes:['One size'],
    hs:'650500', fibre:'100% Cotton', origin:'China' },
  { id:'beanie', cat:'hats', name:'Ribbed beanie', eur:28, cost:4.5, art:'beanie',
    cols:['navy-blue','denim-blue','baby-blue'], sizes:['One size'],
    hs:'650500', fibre:'100% Acrylic', origin:'China' },
  { id:'towel', cat:'access', name:'Beach towel', eur:38, cost:7.0, art:'towel',
    cols:['baby-blue','sky-blue','navy-blue'], sizes:['One size'],
    hs:'630260', fibre:'100% Cotton', origin:'China' },
  { id:'socks', cat:'access', name:'Crew socks', eur:14, cost:1.6, art:'socks',
    cols:['baby-blue','navy-blue','white'], sizes:['S/M','L/XL'],
    hs:'611595', fibre:'80% Cotton, 20% Nylon', origin:'China' }
];


/* ================= MARKETS ================= */
var MARKETS = {
  AU: { code:'AU', name:'Australia',     cur:'AUD', locale:'en-AU', rate:1.66, tax:0.10, taxName:'GST', incl:true,  sizeSys:'AU',
        duty:'Duty free under the China–Australia agreement', ship:'2–4 days from our Sydney hub', ceiling:1000,
        pay:['Card','Apple Pay','Google Pay','Afterpay','Zip','PayPal'],
        legal:'Returns within 30 days. Your rights under the Australian Consumer Law are not affected.', live:true },
  NZ: { code:'NZ', name:'New Zealand',   cur:'NZD', locale:'en-NZ', rate:1.81, tax:0.15, taxName:'GST', incl:true,  sizeSys:'AU',
        duty:'Duty free under the New Zealand–China agreement', ship:'4–7 days from our Sydney hub', ceiling:1000,
        pay:['Card','Apple Pay','Google Pay','Afterpay','PayPal'],
        legal:'Returns within 30 days. Your rights under the Consumer Guarantees Act are not affected.', live:true },
  GB: { code:'GB', name:'United Kingdom',cur:'GBP', locale:'en-GB', rate:0.86, tax:0.20, taxName:'VAT', incl:true,  sizeSys:'UK',
        duty:'Duty included in the price', ship:'3–5 days', ceiling:135,
        pay:['Card','Apple Pay','Klarna','Clearpay','PayPal'],
        legal:'Returns within 30 days. Statutory rights are not affected.', live:false },
  FR: { code:'FR', name:'France',        cur:'EUR', locale:'fr-FR', rate:1.00, tax:0.20, taxName:'TVA', incl:true,  sizeSys:'EU',
        duty:'Aucun droit de douane', ship:'2–3 jours', ceiling:null,
        pay:['Carte Bancaire','Apple Pay','Klarna','PayPal','SEPA'],
        legal:'Retours sous 30 jours. Droit de rétractation de 14 jours garanti.', live:false },
  US: { code:'US', name:'United States', cur:'USD', locale:'en-US', rate:1.09, tax:0.00, taxName:'Sales tax', incl:false, sizeSys:'US',
        duty:'Duty included in the price', ship:'2 days from our US warehouse', ceiling:null,
        pay:['Card','Apple Pay','Shop Pay','Affirm','Klarna','PayPal'],
        legal:'Returns within 30 days. Sales tax added at checkout where applicable.', live:false }
};

/* ================= HOMEPAGE SECTIONS ================= */
var SECTIONS = [
  { id:'sec-hero',    type:'hero',     name:'Hero — Find your ooch',     visible:true, data:{ kicker:'Find your', word:'ooch', line:"Once it's gone it's gone. New drops every month." } },
  { id:'sec-ticker',  type:'ticker',   name:'Scrolling ticker',          visible:true, data:{ text:"Once it's gone it's gone · New drops every month · Made for salt water · " } },
  { id:'sec-market',  type:'market',   name:'Country strip',             visible:true, data:{ title:'Shopping from', sub:'Prices, sizes and delivery all change to suit where you are.' } },
  { id:'sec-drop',    type:'drop',     name:'The drop',                  visible:true, data:{ title:'The drop', sub:'This month only. When it sells out, that is it.' } },
  { id:'sec-sig',     type:'signature',name:'Signature cloud hoodie',    visible:true, data:{ title:'The Cloud hoodie', sub:'The one everything else is built around.' } },
  { id:'sec-shades',  type:'shades',   name:'Five shades of blue',       visible:true, data:{ title:'Five shades of blue', sub:'Every piece, in every colour we make.' } },
  { id:'sec-cats',    type:'cats',     name:'Shop by category',          visible:true, data:{ title:'Everything else', sub:'' } },
  { id:'sec-quiz',    type:'quiz',     name:'Style quiz',                visible:true, data:{ title:"What's your style?", sub:"Don't know? Take the quiz." } },
  { id:'sec-promise', type:'promise',  name:'No surprises at the door',  visible:true, data:{ title:'No surprises at the door', sub:'' } },
  { id:'sec-news',    type:'news',     name:'Newsletter signup',         visible:false,data:{ title:'Know before everyone else', sub:'Drop dates, first dibs, nothing else.' } }
];

/* ================= PROMOS ================= */
var PROMOS = [
  { id:'pr1', name:'Free shipping over A$120', kind:'Banner', from:'2026-08-01', to:'2026-08-31', markets:['AU'], live:true, text:'Free shipping on orders over A$120' },
  { id:'pr2', name:'Summer drop 15%',          kind:'Code · OOCHSUMMER', from:'2026-08-15', to:'2026-08-25', markets:['AU','NZ'], live:false, text:'' }
];


/* ================= DROPS ================= */
var DROPS = [
  { id:'d1', name:'Summer swim drop', at:'2026-09-05T09:00', markets:['AU','NZ'],
    products:['sw01','sw02','sw03','sm01','sm02'], status:'scheduled' },
  { id:'d2', name:'Headband range',   at:'2026-08-22T09:00', markets:['AU','NZ'],
    products:['ac01','ac02','ac03'], status:'scheduled' },
  { id:'d3', name:'Launch drop',      at:'2026-08-01T09:00', markets:['AU','NZ'],
    products:['hd01','tp01','bt01','ht01'], status:'live' }
];

/* ================= PAGES ================= */
var PAGES = [
  { id:'g1', name:'Delivery & duties',  slug:'delivery',  live:true,  where:'All countries',
    body:'Every price includes tax and any import duty. Nothing to pay when your parcel arrives.' },
  { id:'g2', name:'Returns & exchanges',slug:'returns',   live:true,  where:'All countries',
    body:'30 days from delivery. Unworn, tags on. We pay return shipping in Australia and New Zealand.' },
  { id:'g3', name:'Size guide',         slug:'sizes',     live:true,  where:'All countries',
    body:'Sizes are shown in your local system automatically. Measurements in cm and inches.' },
  { id:'g4', name:'Privacy policy',     slug:'privacy',   live:true,  where:'All countries', body:'' },
  { id:'g5', name:'Cookie policy',      slug:'cookies',   live:true,  where:'All countries', body:'' },
  { id:'g6', name:'Terms of sale',      slug:'terms',     live:true,  where:'All countries', body:'' },
  { id:'g7', name:'Impressum',          slug:'impressum', live:false, where:'Germany — required by law', body:'' },
  { id:'g8', name:'Do Not Sell My Info',slug:'dnsmi',     live:false, where:'United States', body:'' }
];

/* ================= TEAM ================= */
var TEAM = [
  { id:'t1', name:'Garrath', role:'Owner',       can:'Everything, including settings, payments and countries' },
  { id:'t2', name:'Sophie',  role:'Editor',      can:'Products, photos, content, promotions, drops' },
  { id:'t3', name:'Amelie',  role:'Editor',      can:'Products, photos, content, promotions, drops' },
  { id:'t4', name:'Lea',     role:'Contributor', can:'Create drafts only — cannot publish' }
];

/* ================= EMAIL & SMS ================= */
var FLOWS = [
  { id:'f1', name:'Drop announcement', when:'The moment a drop goes live',   live:true,  kind:'Marketing' },
  { id:'f2', name:'Abandoned bag',     when:'2 hours after someone leaves',  live:true,  kind:'Marketing' },
  { id:'f3', name:'Order confirmation',when:'Immediately',                   live:true,  kind:'Transactional' },
  { id:'f4', name:'On its way',        when:'When it leaves the warehouse',  live:true,  kind:'Transactional' },
  { id:'f5', name:'Back in stock',     when:'When stock returns',            live:false, kind:'Marketing' },
  { id:'f6', name:'First order thanks',when:'3 days after a first delivery', live:false, kind:'Marketing' }
];

/* ================= STYLE QUIZ ================= */
var QUIZ = {
  title: "What's your style?",
  sub: "Don't know? Take the quiz.",
  /* Every result opens with this line, always. */
  resultLine: 'We think this is for you',
  questions: [
    { id:'priority', text:'What do you put first?', answers:[
        { value:'comfort', label:'Comfort', sub:'Soft, easy, all day' },
        { value:'style',   label:'Style',   sub:'Put together, always' } ] },
    { id:'season', text:'What do you like better?', answers:[
        { value:'winter', label:'Winter', sub:'Layers and long sleeves' },
        { value:'summer', label:'Summer', sub:'Light and bare arms' } ] }
  ],
  results: [
    { id:'comfort-winter', when:'Comfort · Winter', name:'Cosy season',
      blurb:'Hoodies you live in and tracksuit pants that go everywhere. Warm, soft, zero effort.',
      picks:[['hoodie','sky-blue'],['hoodie','navy-blue'],['pant','sky-blue'],['pant','navy-blue']] },
    { id:'comfort-summer', when:'Comfort · Summer', name:'Easy and loose',
      blurb:'Nothing clinging, nothing fussy. Loose tees with roomy shorts, skirts and skorts.',
      picks:[['tee','baby-blue'],['tee','cornflower'],['short',null],['skort','baby-blue']] },
    { id:'style-summer', when:'Style · Summer', name:'Summer statement',
      blurb:'Crop tops and flowy one-off tops, with mini shorts, skirts and skorts to match.',
      picks:[['crop',null],['flowy',null],['skort','navy-blue'],['band-bow','baby-blue']] },
    { id:'style-winter', when:'Style · Winter', name:'Sharp and layered',
      blurb:'Pretty long sleeve tops under a proper jacket, finished with dress pants.',
      picks:[['longsleeve',null],['dresspant',null],['longsleeve','navy-blue'],['crew','navy-blue']] }
  ]
};

/* ================= SIZE CONVERSION ================= */
var SIZE_MAP = {
  XS:{AU:6,UK:6,US:2,EU:34}, S:{AU:8,UK:8,US:4,EU:36}, M:{AU:10,UK:10,US:6,EU:38},
  L:{AU:12,UK:12,US:8,EU:40}, XL:{AU:14,UK:14,US:10,EU:42}, XXL:{AU:16,UK:16,US:12,EU:44}
};

/* ================= SALES HISTORY =================
   380 days of orders, generated deterministically so the analytics
   are consistent between reloads and between the two apps. */
var TODAY = new Date('2026-08-09T00:00:00Z').getTime();

function buildHistory(products) {
  var r = rng(20260809);
  var out = [];
  var today = new Date(TODAY);
  var live = ['AU', 'NZ'];
  for (var d = 379; d >= 0; d--) {
    var day = new Date(today.getTime() - d * 86400000);
    var dow = day.getUTCDay();
    var month = day.getUTCMonth();
    /* growth curve + weekend lift + southern summer lift */
    var growth = 0.35 + 1.65 * Math.pow((380 - d) / 380, 1.7);
    var weekend = (dow === 0 || dow === 6) ? 1.28 : 1;
    var season = 1 + 0.42 * Math.cos(((month - 0) / 12) * Math.PI * 2);
    var dropSpike = (day.getUTCDate() <= 2 && d > 2) ? 2.4 : 1;
    var base = 16 * growth * weekend * season * dropSpike;
    var n = Math.max(0, Math.round(base + (r() - 0.5) * base * 0.5));
    for (var i = 0; i < n; i++) {
      var mk = r() < 0.68 ? live[0] : live[1];
      var p = products[Math.floor(r() * products.length)];
      var qty = r() < 0.78 ? 1 : (r() < 0.85 ? 2 : 3);
      var col = p.cols[Math.floor(r() * p.cols.length)];
      var sz = p.sizes[Math.floor(r() * p.sizes.length)];
      var disc = r() < 0.14 ? (r() < 0.5 ? 0.10 : 0.20) : 0;
      var returned = r() < (p.cat.indexOf('swim') === 0 ? 0.16 : 0.08);
      out.push({
        t: day.getTime(), mk: mk, pid: p.id, qty: qty, col: col, sz: sz,
        disc: disc, ret: returned,
        chan: r() < 0.52 ? 'Instagram' : (r() < 0.72 ? 'TikTok' : (r() < 0.88 ? 'Direct' : 'Search')),
        dev: r() < 0.79 ? 'Phone' : (r() < 0.93 ? 'Desktop' : 'Tablet'),
        newCust: r() < 0.62
      });
    }
  }
  return out;
}

/* ================= STOCK ================= */
function buildStock(products) {
  var r = rng(7781);
  var stock = {};
  products.forEach(function (p) {
    stock[p.id] = {};
    p.cols.forEach(function (c) {
      p.sizes.forEach(function (sz) {
        var curve = { XS:0.10, S:0.18, M:0.28, L:0.26, XL:0.13, XXL:0.05 }[sz];
        if (curve == null) curve = 1 / p.sizes.length;
        stock[p.id][c + '|' + sz] = Math.max(0, Math.round(130 * curve / p.cols.length * (0.4 + r() * 1.2)));
      });
    });
  });
  return stock;
}

/* ================= DEFAULT STATE ================= */
function seed() {
  var products = CATALOGUE.map(function (p) {
    return Object.assign({}, p, {
      visible: true,
      status: 'published',
      real: !!p.real,
      alt: p.name + ' in ooch blue',
      desc: 'Soft, considered and made to be worn constantly. Cut a little oversized.',
      care: 'Machine wash cold. Dry flat.',
      gpsr: true,
      overrides: {}
    });
  });
  return {
    v: 5,
    products: products,
    categories: CATEGORIES.map(function (c) { return Object.assign({ visible: true }, c); }),
    sections: JSON.parse(JSON.stringify(SECTIONS)),
    promos: JSON.parse(JSON.stringify(PROMOS)),
    drops: JSON.parse(JSON.stringify(DROPS)),
    pages: JSON.parse(JSON.stringify(PAGES)),
    team: JSON.parse(JSON.stringify(TEAM)),
    flows: JSON.parse(JSON.stringify(FLOWS)),
    quiz: JSON.parse(JSON.stringify(QUIZ)),
    markets: JSON.parse(JSON.stringify(MARKETS)),
    stock: buildStock(products),
    history: buildHistory(products),
    settings: {
      brand: 'ooch',
      domain: 'www.ooch.com',
      tagline: "Once it's gone it's gone.",
      baseCurrency: 'EUR',
      market: 'AU',
      fixedMonthly: 9800,   /* EUR — marketing, platform, people */
      payFeePct: 0.019,
      pickPackEur: 2.20,
      shipEur: 6.40,
      packagingEur: 0.85
    }
  };
}

/* ================= STORE ================= */
var listeners = [];
var state = load();

/* ★★ CUSTOM COLOURS (2026-08-09).
   COLOURS above is the seven-swatch brand palette. Products reference it by key
   (p.cols = ['baby','navy',...]) and — the part that constrains the design — so
   do state.stock, state.history and every order row. A colour key is a JOIN KEY
   across the whole store, not merely a swatch.
   So custom colours live in state.palette and are MERGED INTO COLOURS on load.
   Every existing lookup (O.COLOURS[key], ~15 call sites across both pages) then
   resolves a custom colour with no change at all, and stock and orders keep
   working because keys never change meaning.
   state.palette is created lazily and the store version is deliberately NOT
   bumped: load() only accepts v === 4, so raising it would discard every
   catalogue the girls have already built. */
var uploadedPhotos = {};   /* productId::colourKey -> /uploads/x.jpg, from the server */

function syncPalette() {
  var p = state && state.palette;
  if (!p) return;
  for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) COLOURS[k] = p[k];
}
syncPalette();

var bc = null;
try { bc = new BroadcastChannel(CHANNEL); } catch (e) { bc = null; }
if (bc) bc.onmessage = function (e) { if (e.data === 'changed') { state = load(); syncPalette(); emit(true); } };
global.addEventListener('storage', function (e) { if (e.key === KEY) { state = load(); syncPalette(); emit(true); } });

function load() {
  try {
    var raw = global.localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === 5) return parsed;
    }
  } catch (e) { /* private mode, quota, corrupt — fall through */ }
  return seed();
}
function save() {
  try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  if (bc) { try { bc.postMessage('changed'); } catch (e) {} }
}
function emit(remote) { listeners.forEach(function (fn) { try { fn(state, remote); } catch (e) {} }); }

var OOCH = {
  COLOURS: COLOURS,
  ART: ART,
  SIZE_MAP: SIZE_MAP,

  get state() { return state; },
  on: function (fn) { listeners.push(fn); return fn; },
  commit: function () { save(); emit(false); },

  /* ---- colours ----
     addColour returns the KEY, which is what products, stock and orders store.
     Keys are generated and never reused, so renaming or recolouring a swatch
     later cannot silently re-point historical stock or orders at a different
     colour. */
  addColour: function (name, hex) {
    if (!state.palette) state.palette = {};
    var key = 'c' + Math.random().toString(36).slice(2, 8);
    while (COLOURS[key] || state.palette[key]) key = 'c' + Math.random().toString(36).slice(2, 8);
    state.palette[key] = { name: name || 'New colour', hex: hex || '#8FC5E8' };
    syncPalette();
    return key;
  },
  /* Editing a BUILT-IN swatch writes an override into the store's own palette
     rather than mutating the shared brand constant — otherwise one product's
     edit would silently repaint every other product using that colour. */
  setColour: function (key, name, hex) {
    if (!state.palette) state.palette = {};
    var cur = state.palette[key] || COLOURS[key] || {};
    state.palette[key] = { name: name != null ? name : (cur.name || 'Colour'),
                           hex:  hex  != null ? hex  : (cur.hex  || '#8FC5E8') };
    syncPalette();
    return key;
  },
  /* Re-read from storage and tell everyone. Used by ooch-sync.js when it
     adopts a newer catalogue from the server: `state` is behind a getter with
     no setter, so this is the honest way to swap it without reloading the page
     under someone's hands. Emits as REMOTE, because from this page's point of
     view the change did come from elsewhere. */
  reload: function () { state = load(); syncPalette(); emit(true); },
  colourKeys: function () { return Object.keys(COLOURS); },
  isCustom: function (key) { return !!(state.palette && state.palette[key]); },
  reset: function () { state = seed(); save(); emit(false); },

  /* ---- catalogue ---- */
  liveProducts: function () {
    var cats = {};
    state.categories.forEach(function (c) { cats[c.id] = c.visible; });
    return state.products.filter(function (p) {
      return p.visible && p.status === 'published' && cats[p.cat] !== false;
    });
  },
  product: function (id) {
    for (var i = 0; i < state.products.length; i++) if (state.products[i].id === id) return state.products[i];
    return null;
  },
  category: function (id) {
    for (var i = 0; i < state.categories.length; i++) if (state.categories[i].id === id) return state.categories[i];
    return null;
  },
  section: function (id) {
    for (var i = 0; i < state.sections.length; i++) if (state.sections[i].id === id) return state.sections[i];
    return null;
  },
  removeProduct: function (id) {
    state.products = state.products.filter(function (p) { return p.id !== id; });
    this.commit();
  },
  removeCategory: function (id) {
    state.categories = state.categories.filter(function (c) { return c.id !== id; });
    state.products = state.products.filter(function (p) { return p.cat !== id; });
    this.commit();
  },
  removeSection: function (id) {
    state.sections = state.sections.filter(function (s) { return s.id !== id; });
    this.commit();
  },
  removePromo: function (id) {
    state.promos = state.promos.filter(function (p) { return p.id !== id; });
    this.commit();
  },
  moveSection: function (id, dir) {
    var i = state.sections.findIndex(function (s) { return s.id === id; });
    var j = i + dir;
    if (i < 0 || j < 0 || j >= state.sections.length) return;
    var tmp = state.sections[i]; state.sections[i] = state.sections[j]; state.sections[j] = tmp;
    this.commit();
  },

  /* ---- stock ---- */
  stockOf: function (pid) {
    var s = state.stock[pid] || {}, total = 0;
    for (var k in s) total += s[k];
    return total;
  },


  /* ---- orders: the last N real order rows, built from history ---- */
  orders: function (limit) {
    var st = state, out = [], names = ['Mia','Ruby','Charlotte','Aroha','Zoe','Isla','Hunter','Ella',
      'Noah','Aria','Jack','Poppy','Kai','Sienna','Leo','Maia','Finn','Tess'];
    var surn = ['T.','K.','D.','W.','M.','R.','B.','S.','H.','N.'];
    var hist = st.history.slice(-(limit || 60) * 2).reverse();
    for (var i = 0; i < hist.length && out.length < (limit || 60); i++) {
      var o = hist[i], p = null;
      for (var j = 0; j < st.products.length; j++) if (state.products[j].id === o.pid) { p = state.products[j]; break; }
      if (!p) continue;
      var m = st.markets[o.mk];
      var unit = this.priceOf(p, o.mk);
      var age = Math.floor((TODAY + 86400000 - o.t) / 86400000);
      out.push({
        ref: '#' + (4200 - out.length),
        who: names[(i * 7) % names.length] + ' ' + surn[(i * 3) % surn.length],
        mk: o.mk, market: m.name,
        items: o.qty, product: p.name, col: o.col, sz: o.sz, pid: p.id,
        total: unit * o.qty, totalTxt: this.fmt(unit * o.qty, o.mk),
        status: o.ret ? 'Returned' : (age < 1 ? 'Packing' : age < 3 ? 'Shipped' : 'Delivered'),
        returned: !!o.ret,
        chan: o.chan, dev: o.dev, newCust: o.newCust,
        when: age < 1 ? 'Today' : age === 1 ? 'Yesterday' : age + ' days ago'
      });
    }
    return out;
  },

  customerStats: function (days) {
    var a = this.analyse({ days: days || 30 });
    return {
      orders: a.cur.orders,
      newRate: a.cur.newRate,
      newCount: Math.round(a.cur.orders * a.cur.newRate),
      repeatCount: a.cur.orders - Math.round(a.cur.orders * a.cur.newRate),
      aov: a.cur.aov,
      returnRate: a.cur.returnRate
    };
  },

  /* ---- generic list removal, used by every admin table ---- */
  removeFrom: function (listName, id) {
    if (!state[listName]) return;
    state[listName] = state[listName].filter(function (x) { return x.id !== id; });
    this.commit();
  },
  findIn: function (listName, id) {
    var l = state[listName] || [];
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  },

  /* ---- photography ----
     Returns the image path for a product in a colourway, or null when
     the piece has not been shot yet and should fall back to vector art. */
  photoOf: function (p, col) {
    if (!p) return null;
    var key = col || (p.cols && p.cols[0]);
    /* ★2026-08-09 MERGE POINT. Two photo systems meet here and the order
       matters. The girls' photography is per-COLOURWAY by filename convention
       (photo prefix + colour key), which is what makes clicking a swatch change
       the picture — the thing they like most about the site. An admin upload
       must therefore also be per-colourway, or one uploaded photo would show
       for every colour and silently kill the switching.
       Uploads win over the stock shot for the SAME colourway only; every other
       colour keeps its original photograph. */
    var up = uploadedPhotos[p.id + '::' + key];
    if (up) return up;
    if (!p.photo) return null;
    return 'assets/' + p.photo + key + '.webp';
  },
  /* Set by ooch-sync.js from /api/photos. Kept out of `state` on purpose: it is
     server-owned, shared by every device, and must not be overwritten when a
     stale catalogue is adopted. */
  setUploadedPhotos: function (map) { uploadedPhotos = map || {}; },
  uploadedPhotos: function () { return uploadedPhotos; },

  /* ---- money ---- */
  market: function () { return state.markets[state.settings.market] || state.markets.AU; },
  setMarket: function (code) { if (state.markets[code]) { state.settings.market = code; this.commit(); } },
  priceOf: function (p, mkCode) {
    var m = state.markets[mkCode || state.settings.market];
    if (p.overrides && p.overrides[m.code] != null) return p.overrides[m.code];
    var v = p.eur * m.rate;
    if (m.incl) v *= (1 + m.tax);
    return Math.floor(v) + 0.95;
  },
  fmt: function (v, mkCode) {
    var m = state.markets[mkCode || state.settings.market];
    try {
      return new Intl.NumberFormat(m.locale, { style: 'currency', currency: m.cur }).format(v);
    } catch (e) { return m.cur + ' ' + v.toFixed(2); }
  },
  fmtEur: function (v) {
    try { return new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(v); }
    catch (e) { return '€' + Math.round(v); }
  },
  sizeLabel: function (sz, mkCode) {
    var m = state.markets[mkCode || state.settings.market];
    var row = SIZE_MAP[sz];
    if (!row || !row[m.sizeSys]) return sz;
    return sz + ' · ' + m.sizeSys + row[m.sizeSys];
  },

  /* ---- analytics ---------------------------------------------
     Every figure the admin shows is computed here so the storefront
     and the console can never disagree about a number.            */
  analyse: function (opts) {
    opts = opts || {};
    var days = opts.days || 30;
    var end = TODAY;
    var start = end - days * 86400000;
    var prevStart = start - days * 86400000;
    var st = state, cfg = st.settings;
    var byId = {}; st.products.forEach(function (p) { byId[p.id] = p; });

    function blank() {
      return { rev:0, gross:0, disc:0, refund:0, units:0, orders:0, cogs:0, dutyFreight:0,
               fees:0, fulfil:0, returns:0, newC:0, chan:{}, dev:{}, mk:{}, cat:{}, prod:{}, variant:{}, days:{} };
    }
    var cur = blank(), prev = blank();

    st.history.forEach(function (o) {
      var p = byId[o.pid];
      if (!p) return;                                   /* deleted product */
      if (opts.mk && o.mk !== opts.mk) return;
      if (opts.cat && p.cat !== opts.cat) return;
      if (opts.pid && o.pid !== opts.pid) return;
      var bucket = (o.t > start && o.t <= end) ? cur : ((o.t > prevStart && o.t <= start) ? prev : null);
      if (!bucket) return;

      var m = st.markets[o.mk];
      var unitEur = p.eur;
      var gross = unitEur * o.qty;
      var discount = gross * o.disc;
      var net = gross - discount;
      var refund = o.ret ? net : 0;
      var kept = net - refund;

      bucket.gross += gross;
      bucket.disc += discount;
      bucket.refund += refund;
      bucket.rev += kept;
      bucket.units += o.ret ? 0 : o.qty;
      bucket.orders += 1;
      if (o.ret) bucket.returns += 1;
      if (o.newCust) bucket.newC += 1;

      var cogs = o.ret ? 0 : p.cost * o.qty;
      bucket.cogs += cogs;
      bucket.fees += kept * cfg.payFeePct;
      bucket.fulfil += o.ret ? (cfg.pickPackEur + cfg.shipEur) * 2 : (cfg.pickPackEur + cfg.shipEur + cfg.packagingEur);

      bucket.chan[o.chan] = (bucket.chan[o.chan] || 0) + kept;
      bucket.dev[o.dev] = (bucket.dev[o.dev] || 0) + kept;
      bucket.mk[o.mk] = bucket.mk[o.mk] || { rev:0, units:0, orders:0, cogs:0 };
      bucket.mk[o.mk].rev += kept; bucket.mk[o.mk].units += o.ret?0:o.qty;
      bucket.mk[o.mk].orders += 1; bucket.mk[o.mk].cogs += cogs;
      bucket.cat[p.cat] = bucket.cat[p.cat] || { rev:0, units:0, cogs:0, orders:0 };
      bucket.cat[p.cat].rev += kept; bucket.cat[p.cat].units += o.ret?0:o.qty;
      bucket.cat[p.cat].cogs += cogs; bucket.cat[p.cat].orders += 1;
      bucket.prod[p.id] = bucket.prod[p.id] || { rev:0, units:0, cogs:0, orders:0, ret:0 };
      bucket.prod[p.id].rev += kept; bucket.prod[p.id].units += o.ret?0:o.qty;
      bucket.prod[p.id].cogs += cogs; bucket.prod[p.id].orders += 1;
      if (o.ret) bucket.prod[p.id].ret += 1;
      var vk = p.id + '|' + o.col + '|' + o.sz;
      bucket.variant[vk] = bucket.variant[vk] || { rev:0, units:0, col:o.col, sz:o.sz, pid:p.id };
      bucket.variant[vk].rev += kept; bucket.variant[vk].units += o.ret?0:o.qty;

      if (bucket === cur) {
        var dk = new Date(o.t).toISOString().slice(0, 10);
        bucket.days[dk] = (bucket.days[dk] || 0) + kept;
      }
    });

    function pl(b, dayCount) {
      var grossProfit = b.rev - b.cogs;
      var contribution = grossProfit - b.fees - b.fulfil;
      var fixed = state.settings.fixedMonthly * (dayCount / 30);
      return {
        gross: b.gross, disc: b.disc, refund: b.refund, rev: b.rev,
        cogs: b.cogs, grossProfit: grossProfit,
        grossMargin: b.rev ? grossProfit / b.rev : 0,
        fees: b.fees, fulfil: b.fulfil,
        contribution: contribution,
        contributionMargin: b.rev ? contribution / b.rev : 0,
        fixed: fixed, ebitda: contribution - fixed,
        units: b.units, orders: b.orders,
        aov: b.orders ? b.rev / b.orders : 0,
        upt: b.orders ? b.units / b.orders : 0,
        returnRate: b.orders ? b.returns / b.orders : 0,
        newRate: b.orders ? b.newC / b.orders : 0
      };
    }

    var c = pl(cur, days), p0 = pl(prev, days);
    function delta(a, b) { return b ? (a - b) / b : 0; }

    return {
      days: days, cur: c, prev: p0,
      change: {
        rev: delta(c.rev, p0.rev), orders: delta(c.orders, p0.orders),
        aov: delta(c.aov, p0.aov), units: delta(c.units, p0.units),
        contribution: delta(c.contribution, p0.contribution),
        grossMargin: c.grossMargin - p0.grossMargin
      },
      raw: cur,
      series: (function () {
        var out = [], labels = [];
        for (var i = days - 1; i >= 0; i--) {
          var d = new Date(end - i * 86400000).toISOString().slice(0, 10);
          out.push(Math.round(cur.days[d] || 0));
          labels.push(d);
        }
        return { values: out, labels: labels };
      })()
    };
  },

  /* sell-through: what proportion of the buy has sold */
  sellThrough: function (pid, days) {
    var a = this.analyse({ days: days || 90, pid: pid });
    var sold = a.cur.units;
    var left = this.stockOf(pid);
    var bought = sold + left;
    return bought ? sold / bought : 0;
  }
};

global.OOCH = OOCH;
})(window);
