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

var KEY = 'ooch.store.v4';
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
  baby:  { name: 'Baby blue',  hex: '#BFDFF5' },
  sky:   { name: 'Sky blue',   hex: '#8FC5E8' },
  corn:  { name: 'Cornflower', hex: '#6E93D6' },
  denim: { name: 'Denim blue', hex: '#43679E' },
  navy:  { name: 'Navy blue',  hex: '#22335A' },
  white: { name: 'Optic white',hex: '#F7FAFC' },
  sand:  { name: 'Sand',       hex: '#E4D6C1' }
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
  { id: 'swim-w',  name: 'Swim — Women',   blurb: 'Built for long days and salt water.' },
  { id: 'swim-m',  name: 'Swim — Men',     blurb: 'Quick dry, no fuss, holds its shape.' },
  { id: 'hoodies', name: 'Hoodies & sweats', blurb: 'The signature. Oversized on purpose.' },
  { id: 'tops',    name: 'Tees & tops',    blurb: 'Everyday weight, everyday blues.' },
  { id: 'bottoms', name: 'Bottoms',        blurb: 'Wide, soft, and cut to move.' },
  { id: 'hats',    name: 'Hats',           blurb: 'Sun on, sun off.' },
  { id: 'access',  name: 'Accessories',    blurb: 'The little things that finish it.' }
];

/* ================= PRODUCTS =================
   cost = landed unit cost in EUR (factory + freight + duty)
   eur  = base retail excluding tax                          */
var CATALOGUE = [
  /* --- Swim, women --- */
  { id:'sw01', cat:'swim-w', art:'bikinitop',    name:'Reef bikini top',        eur:38, cost:9.5,  cols:['baby','sky','corn','navy','sand'], sizes:['XS','S','M','L','XL'], hs:'611241', fibre:'80% Polyamide, 20% Elastane', origin:'China', hero:true },
  { id:'sw02', cat:'swim-w', art:'bikinibottom', name:'Reef bikini bottom',     eur:34, cost:8.0,  cols:['baby','sky','corn','navy','sand'], sizes:['XS','S','M','L','XL'], hs:'611241', fibre:'80% Polyamide, 20% Elastane', origin:'China' },
  { id:'sw03', cat:'swim-w', art:'onepiece',     name:'Tide one-piece',         eur:72, cost:17.0, cols:['navy','denim','baby','white'],     sizes:['XS','S','M','L','XL'], hs:'611241', fibre:'82% Polyamide, 18% Elastane', origin:'China', hero:true },
  { id:'sw04', cat:'swim-w', art:'bikinitop',    name:'Sunrise triangle top',   eur:36, cost:8.5,  cols:['sky','corn','sand','white'],       sizes:['XS','S','M','L'],      hs:'611241', fibre:'80% Polyamide, 20% Elastane', origin:'China' },
  { id:'sw05', cat:'swim-w', art:'rashie',       name:'Long sleeve rash top',   eur:56, cost:13.0, cols:['navy','denim','baby'],             sizes:['XS','S','M','L','XL'], hs:'611241', fibre:'85% Polyester, 15% Elastane', origin:'China' },
  { id:'sw06', cat:'swim-w', art:'boardshort',   name:'Womens board short',     eur:48, cost:11.0, cols:['navy','sky','sand'],               sizes:['XS','S','M','L','XL'], hs:'620343', fibre:'100% Polyester',              origin:'China' },

  /* --- Swim, men --- */
  { id:'sm01', cat:'swim-m', art:'swimshort',   name:'Coast swim short',       eur:52, cost:12.0, cols:['navy','denim','sky','sand'],       sizes:['S','M','L','XL','XXL'], hs:'620411', fibre:'100% Polyester',           origin:'China', hero:true },
  { id:'sm02', cat:'swim-m', art:'boardshort',  name:'Lagoon board short',     eur:64, cost:15.0, cols:['navy','corn','white'],             sizes:['S','M','L','XL','XXL'], hs:'620343', fibre:'92% Polyester, 8% Elastane', origin:'China' },
  { id:'sm03', cat:'swim-m', art:'swimshort',   name:'Shorebreak short',       eur:46, cost:10.5, cols:['baby','sky','navy'],               sizes:['S','M','L','XL'],       hs:'620411', fibre:'100% Polyester',           origin:'China' },
  { id:'sm04', cat:'swim-m', art:'rashie',      name:'Mens rash guard',        eur:58, cost:13.5, cols:['navy','denim','white'],            sizes:['S','M','L','XL','XXL'], hs:'611241', fibre:'85% Polyester, 15% Elastane', origin:'China' },

  /* --- Hoodies --- */
  { id:'hd01', cat:'hoodies', art:'hoodie', name:'Cloud hoodie',          eur:68, cost:15.0, cols:['baby','sky','corn','denim','navy'], sizes:['XS','S','M','L','XL','XXL'], hs:'611020', fibre:'80% Cotton, 20% Polyester', origin:'China', hero:true, signature:true },
  { id:'hd02', cat:'hoodies', art:'zip',    name:'Cloud zip-through',     eur:76, cost:17.5, cols:['baby','navy','denim'],              sizes:['XS','S','M','L','XL','XXL'], hs:'611020', fibre:'80% Cotton, 20% Polyester', origin:'China' },
  { id:'hd03', cat:'hoodies', art:'crew',   name:'Everyday crew',         eur:58, cost:13.0, cols:['baby','sky','navy','white'],        sizes:['XS','S','M','L','XL'],       hs:'611030', fibre:'80% Cotton, 20% Polyester', origin:'China' },
  { id:'hd04', cat:'hoodies', art:'hoodie', name:'Heavyweight hoodie',    eur:88, cost:21.0, cols:['navy','denim'],                     sizes:['S','M','L','XL','XXL'],      hs:'611020', fibre:'100% Cotton',              origin:'China' },

  /* --- Tops --- */
  { id:'tp01', cat:'tops', art:'tee',        name:'Everyday tee',        eur:32, cost:6.5,  cols:['baby','sky','corn','denim','navy','white'], sizes:['XS','S','M','L','XL','XXL'], hs:'610910', fibre:'100% Cotton', origin:'China', hero:true },
  { id:'tp02', cat:'tops', art:'longsleeve', name:'Long sleeve tee',     eur:42, cost:9.0,  cols:['baby','navy','white'],                     sizes:['XS','S','M','L','XL'],       hs:'610910', fibre:'100% Cotton', origin:'China' },
  { id:'tp03', cat:'tops', art:'crop',       name:'Cropped tee',         eur:30, cost:6.0,  cols:['baby','sky','white'],                      sizes:['XS','S','M','L'],            hs:'610910', fibre:'100% Cotton', origin:'China' },
  { id:'tp04', cat:'tops', art:'tank',       name:'Summer tank',         eur:26, cost:5.5,  cols:['baby','sky','sand','white'],               sizes:['XS','S','M','L','XL'],       hs:'610990', fibre:'100% Cotton', origin:'China' },

  /* --- Bottoms --- */
  { id:'bt01', cat:'bottoms', art:'pants',  name:'Wide leg track pants', eur:58, cost:13.0, cols:['sky','denim','navy'],        sizes:['XS','S','M','L','XL'], hs:'610462', fibre:'65% Cotton, 35% Polyester', origin:'China', hero:true },
  { id:'bt02', cat:'bottoms', art:'shorts', name:'Sweat short',          eur:38, cost:8.0,  cols:['baby','navy','denim'],       sizes:['XS','S','M','L','XL'], hs:'610462', fibre:'65% Cotton, 35% Polyester', origin:'China' },

  /* --- Hats --- */
  { id:'ht01', cat:'hats', art:'bucket', name:'Bucket hat',        eur:32, cost:5.5, cols:['baby','sky','navy','sand'], sizes:['S/M','L/XL'], hs:'650500', fibre:'100% Cotton',  origin:'China', hero:true },
  { id:'ht02', cat:'hats', art:'cap',    name:'Six panel cap',     eur:30, cost:5.0, cols:['baby','navy','white'],      sizes:['One size'],   hs:'650500', fibre:'100% Cotton',  origin:'China' },
  { id:'ht03', cat:'hats', art:'beanie', name:'Ribbed beanie',     eur:28, cost:4.5, cols:['navy','denim','baby'],      sizes:['One size'],   hs:'650500', fibre:'100% Acrylic', origin:'China' },
  { id:'ht04', cat:'hats', art:'straw',  name:'Wide brim straw',   eur:44, cost:8.0, cols:['sand'],                     sizes:['One size'],   hs:'650400', fibre:'100% Paper straw', origin:'China' },

  /* --- Accessories --- */
  { id:'ac01', cat:'access', art:'headband',  name:'Bow headband',     eur:14, cost:1.8, cols:['baby','sky','corn','denim'], sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China' },
  { id:'ac02', cat:'access', art:'twist',     name:'Twist headband',   eur:12, cost:1.5, cols:['baby','navy','sand'],        sizes:['One size'], hs:'650500', fibre:'95% Cotton, 5% Elastane', origin:'China' },
  { id:'ac03', cat:'access', art:'scrunchie', name:'Scrunchie三 set',  eur:12, cost:1.2, cols:['baby','sky','navy'],         sizes:['One size'], hs:'621790', fibre:'100% Cotton',            origin:'China' },
  { id:'ac04', cat:'access', art:'tote',      name:'Canvas tote',      eur:26, cost:4.0, cols:['baby','white','sand'],       sizes:['One size'], hs:'420222', fibre:'100% Cotton canvas',     origin:'China' },
  { id:'ac05', cat:'access', art:'towel',     name:'Beach towel',      eur:38, cost:7.0, cols:['baby','sky','navy'],         sizes:['One size'], hs:'630260', fibre:'100% Cotton',            origin:'China', hero:true },
  { id:'ac06', cat:'access', art:'socks',     name:'Crew socks',       eur:14, cost:1.6, cols:['baby','navy','white'],       sizes:['S/M','L/XL'], hs:'611595', fibre:'80% Cotton, 20% Nylon', origin:'China' },
  { id:'ac07', cat:'access', art:'bottle',    name:'Steel bottle',     eur:34, cost:6.5, cols:['baby','navy','white'],       sizes:['One size'], hs:'961700', fibre:'Stainless steel',        origin:'China' },
  { id:'ac08', cat:'access', art:'sunnies',   name:'Beach sunglasses', eur:36, cost:6.0, cols:['navy','sand','white'],       sizes:['One size'], hs:'900410', fibre:'Acetate frame',          origin:'China' }
];
/* fix a stray character in one name */
CATALOGUE.forEach(function (p) { p.name = p.name.replace('三 ', ' '); });

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
  { id:'sec-shades',  type:'shades',   name:'Five shades of blue',       visible:true, data:{ title:'Seven shades', sub:'Every piece, every colour we make.' } },
  { id:'sec-cats',    type:'cats',     name:'Shop by category',          visible:true, data:{ title:'Everything else', sub:'' } },
  { id:'sec-quiz',    type:'quiz',     name:'Style quiz',                visible:true, data:{ title:"What's your ooch?", sub:'Two questions. We will pick for you.' } },
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
  title: "What's your ooch?",
  questions: [
    { id:'q1', text:'Comfy or dressed up?', answers:['Comfy','Dressed up'] },
    { id:'q2', text:'Beach or everyday?',   answers:['Beach','Everyday'] }
  ],
  results: [
    { id:'r1', when:'Comfy · Beach',      products:['sm01','sw05','ht01','ac05'] },
    { id:'r2', when:'Comfy · Everyday',   products:['hd01','tp01','bt01','ac06'] },
    { id:'r3', when:'Dressed up · Beach', products:['sw03','sw04','ht04','ac08'] },
    { id:'r4', when:'Dressed up · Everyday', products:['hd02','tp03','bt02','ac01'] }
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
      alt: p.name + ' in ooch blue',
      desc: 'Soft, considered and made to be worn constantly. Cut a little oversized.',
      care: 'Machine wash cold. Dry flat.',
      gpsr: true,
      overrides: {}
    });
  });
  return {
    v: 4,
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
var bc = null;
try { bc = new BroadcastChannel(CHANNEL); } catch (e) { bc = null; }
if (bc) bc.onmessage = function (e) { if (e.data === 'changed') { state = load(); emit(true); } };
global.addEventListener('storage', function (e) { if (e.key === KEY) { state = load(); emit(true); } });

function load() {
  try {
    var raw = global.localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === 4) return parsed;
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
