import React, { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   OOCH — draft storefront, v5
   Every product uses real photography, each with a
   five-colour slider. Everything else still vector placeholder.
------------------------------------------------------------------- */

let IMG = {
  "tee-baby-blue": "img/tee-baby-blue.webp",
  "hoodie-baby-blue": "img/hoodie-baby-blue.webp",
  "pant-baby-blue": "img/pant-baby-blue.webp",
  "skort-baby-blue": "img/skort-baby-blue.webp",
  "tote-baby-blue": "img/tote-baby-blue.webp",
  "singlet-front-baby-blue": "img/singlet-front-baby-blue.webp",
  "singlet-back-baby-blue": "img/singlet-back-baby-blue.webp",
  "fold-baby-blue": "img/fold-baby-blue.webp",
  "tee-sky-blue": "img/tee-sky-blue.webp",
  "hoodie-sky-blue": "img/hoodie-sky-blue.webp",
  "pant-sky-blue": "img/pant-sky-blue.webp",
  "skort-sky-blue": "img/skort-sky-blue.webp",
  "tote-sky-blue": "img/tote-sky-blue.webp",
  "singlet-front-sky-blue": "img/singlet-front-sky-blue.webp",
  "singlet-back-sky-blue": "img/singlet-back-sky-blue.webp",
  "fold-sky-blue": "img/fold-sky-blue.webp",
  "tee-cornflower": "img/tee-cornflower.webp",
  "hoodie-cornflower": "img/hoodie-cornflower.webp",
  "pant-cornflower": "img/pant-cornflower.webp",
  "skort-cornflower": "img/skort-cornflower.webp",
  "tote-cornflower": "img/tote-cornflower.webp",
  "singlet-front-cornflower": "img/singlet-front-cornflower.webp",
  "singlet-back-cornflower": "img/singlet-back-cornflower.webp",
  "fold-cornflower": "img/fold-cornflower.webp",
  "tee-denim-blue": "img/tee-denim-blue.webp",
  "hoodie-denim-blue": "img/hoodie-denim-blue.webp",
  "pant-denim-blue": "img/pant-denim-blue.webp",
  "skort-denim-blue": "img/skort-denim-blue.webp",
  "tote-denim-blue": "img/tote-denim-blue.webp",
  "singlet-front-denim-blue": "img/singlet-front-denim-blue.webp",
  "singlet-back-denim-blue": "img/singlet-back-denim-blue.webp",
  "fold-denim-blue": "img/fold-denim-blue.webp",
  "tee-navy-blue": "img/tee-navy-blue.webp",
  "hoodie-navy-blue": "img/hoodie-navy-blue.webp",
  "pant-navy-blue": "img/pant-navy-blue.webp",
  "skort-navy-blue": "img/skort-navy-blue.webp",
  "tote-navy-blue": "img/tote-navy-blue.webp",
  "singlet-front-navy-blue": "img/singlet-front-navy-blue.webp",
  "singlet-back-navy-blue": "img/singlet-back-navy-blue.webp",
  "fold-navy-blue": "img/fold-navy-blue.webp",
  "band-twist-baby-blue": "img/band-twist-baby-blue.webp",
  "band-twist-sky-blue": "img/band-twist-sky-blue.webp",
  "band-twist-cornflower": "img/band-twist-cornflower.webp",
  "band-twist-denim-blue": "img/band-twist-denim-blue.webp",
  "band-twist-navy-blue": "img/band-twist-navy-blue.webp",
  "band-bow-baby-blue": "img/band-bow-baby-blue.webp",
  "band-bow-sky-blue": "img/band-bow-sky-blue.webp",
  "band-bow-cornflower": "img/band-bow-cornflower.webp",
  "band-bow-denim-blue": "img/band-bow-denim-blue.webp",
  "band-bow-navy-blue": "img/band-bow-navy-blue.webp",
  "band-skinny-baby-blue": "img/band-skinny-baby-blue.webp",
  "band-skinny-sky-blue": "img/band-skinny-sky-blue.webp",
  "band-skinny-cornflower": "img/band-skinny-cornflower.webp",
  "band-skinny-denim-blue": "img/band-skinny-denim-blue.webp",
  "band-skinny-navy-blue": "img/band-skinny-navy-blue.webp",
  "band-wide-baby-blue": "img/band-wide-baby-blue.webp",
  "band-wide-sky-blue": "img/band-wide-sky-blue.webp",
  "band-wide-cornflower": "img/band-wide-cornflower.webp",
  "band-wide-denim-blue": "img/band-wide-denim-blue.webp",
  "band-wide-navy-blue": "img/band-wide-navy-blue.webp",
  "bikini-front-sky-blue": "img/bikini-front-sky-blue.webp",
  "bikini-back-sky-blue": "img/bikini-back-sky-blue.webp",
  "bikini-front-white": "img/bikini-front-white.webp",
  "bikini-back-white": "img/bikini-back-white.webp",
  "bk-blue-top-1": "img/bk-blue-top-1.webp",
  "bk-blue-top-2": "img/bk-blue-top-2.webp",
  "bk-blue-btm-1": "img/bk-blue-btm-1.webp",
  "bk-blue-btm-2": "img/bk-blue-btm-2.webp",
  "bk-white-top-1": "img/bk-white-top-1.webp",
  "bk-white-top-2": "img/bk-white-top-2.webp",
  "bk-white-btm-1": "img/bk-white-btm-1.webp",
  "bk-white-btm-2": "img/bk-white-btm-2.webp",
  "bk-fabric": "img/bk-fabric.webp",
  "sig-front": "img/sig-front.webp",
  "sig-back": "img/sig-back.webp",
  "sig-hood": "img/sig-hood.webp",
  "sig-fabric": "img/sig-fabric.webp",
  "sig-logo": "img/sig-logo.webp",
  "sig-model-1": "img/sig-model-1.webp",
  "sig-model-2": "img/sig-model-2.webp",
  "sig-model-3": "img/sig-model-3.webp",
  "summer-front": "img/summer-front.webp",
  "summer-back": "img/summer-back.webp",
  "summer-shorts": "img/summer-shorts.webp",
  "bow-front": "img/bow-front.webp",
  "bow-back": "img/bow-back.webp",
  "bow-shorts": "img/bow-shorts.webp",
  "denim-front": "img/denim-front.webp",
  "denim-back": "img/denim-back.webp",
  "fold-m1": "img/fold-m1.webp",
  "top-front": "img/top-front.webp",
  "top-back": "img/top-back.webp",
  "top-layer": "img/top-layer.webp",
  "pants-front": "img/pants-front.webp",
  "pants-back": "img/pants-back.webp",
  "pants-waist": "img/pants-waist.webp",
  "knit-front": "img/knit-front.webp",
  "knit-back": "img/knit-back.webp",
  "knit-fabric": "img/knit-fabric.webp",
  "knit-m1": "img/knit-m1.webp",
  "knit-m2": "img/knit-m2.webp",
  "net-front": "img/net-front.webp",
  "net-back": "img/net-back.webp",
  "net-fabric": "img/net-fabric.webp",
  "net-m1": "img/net-m1.webp",
  "net-m2": "img/net-m2.webp",
  "relaxed-front": "img/relaxed-front.webp",
  "relaxed-back": "img/relaxed-back.webp",
  "relaxed-fabric": "img/relaxed-fabric.webp",
  "relaxed-m1": "img/relaxed-m1.webp",
  "relaxed-m2": "img/relaxed-m2.webp",
  "tube-front": "img/tube-front.webp",
  "tube-back": "img/tube-back.webp",
  "tube-fabric": "img/tube-fabric.webp",
  "dp-black-front": "img/dp-black-front.webp",
  "dp-black-side": "img/dp-black-side.webp",
  "dp-white-front": "img/dp-white-front.webp",
  "dp-white-side": "img/dp-white-side.webp",
  "dp-fabric": "img/dp-fabric.webp",
  "dp-m1": "img/dp-m1.webp",
  "dp-m2": "img/dp-m2.webp",
  "maxi-front": "img/maxi-front.webp",
  "maxi-back": "img/maxi-back.webp",
  "maxi-m1": "img/maxi-m1.webp",
  "maxi-m2": "img/maxi-m2.webp",
  "maxi-m3": "img/maxi-m3.webp",
  "maxi-d1": "img/maxi-d1.webp",
  "maxi-d2": "img/maxi-d2.webp",
  "sst-blue-front": "img/sst-blue-front.webp",
  "sst-blue-back": "img/sst-blue-back.webp",
  "sst-white-front": "img/sst-white-front.webp",
  "sst-white-back": "img/sst-white-back.webp",
  "summer-d1": "img/summer-d1.webp",
  "summer-d2": "img/summer-d2.webp",
  "summer-d3": "img/summer-d3.webp",
  "summer-d4": "img/summer-d4.webp",
  "summer-d5": "img/summer-d5.webp",
  "bow-d1": "img/bow-d1.webp",
  "bow-d2": "img/bow-d2.webp",
  "bow-d3": "img/bow-d3.webp",
  "bow-d4": "img/bow-d4.webp",
  "bow-d5": "img/bow-d5.webp",
  "bow-d6": "img/bow-d6.webp",
  "denim-d1": "img/denim-d1.webp",
  "denim-d2": "img/denim-d2.webp",
  "denim-d3": "img/denim-d3.webp",
  "denim-d4": "img/denim-d4.webp",
  "fold-d1": "img/fold-d1.webp",
  "fold-d2": "img/fold-d2.webp",
  "fold-d3": "img/fold-d3.webp",
  "fold-d4": "img/fold-d4.webp",
  "top-d1": "img/top-d1.webp",
  "top-d2": "img/top-d2.webp",
  "top-d3": "img/top-d3.webp",
  "top-d4": "img/top-d4.webp",
  "top-d5": "img/top-d5.webp",
  "pants-d1": "img/pants-d1.webp",
  "pants-d2": "img/pants-d2.webp",
  "pants-d3": "img/pants-d3.webp",
  "pants-d4": "img/pants-d4.webp",
  "knit-d1": "img/knit-d1.webp",
  "knit-d2": "img/knit-d2.webp",
  "knit-d3": "img/knit-d3.webp",
  "knit-d4": "img/knit-d4.webp",
  "net-d1": "img/net-d1.webp",
  "net-d2": "img/net-d2.webp",
  "net-d3": "img/net-d3.webp",
  "net-d4": "img/net-d4.webp",
  "net-d5": "img/net-d5.webp",
  "relaxed-d1": "img/relaxed-d1.webp",
  "relaxed-d2": "img/relaxed-d2.webp",
  "relaxed-d3": "img/relaxed-d3.webp",
  "relaxed-d4": "img/relaxed-d4.webp",
  "tube-d1": "img/tube-d1.webp",
  "tube-d2": "img/tube-d2.webp",
  "tube-d3": "img/tube-d3.webp",
  "tube-d4": "img/tube-d4.webp",
  "dp-d1": "img/dp-d1.webp",
  "dp-d2": "img/dp-d2.webp",
  "dp-d3": "img/dp-d3.webp",
  "dp-d4": "img/dp-d4.webp",
  "dp-d5": "img/dp-d5.webp",
  "sst-d1": "img/sst-d1.webp",
  "sst-d2": "img/sst-d2.webp",
  "sst-d3": "img/sst-d3.webp",
  "sst-d4": "img/sst-d4.webp",
  "sst-d5": "img/sst-d5.webp",
  "summer-m1": "img/summer-m1.webp",
  "summer-m2": "img/summer-m2.webp",
  "summer-m3": "img/summer-m3.webp",
  "bow-m1": "img/bow-m1.webp",
  "bow-m2": "img/bow-m2.webp",
  "bow-m3": "img/bow-m3.webp",
  "bow-m4": "img/bow-m4.webp",
  "top-m1": "img/top-m1.webp",
  "top-m2": "img/top-m2.webp",
  "top-m3": "img/top-m3.webp",
  "top-m4": "img/top-m4.webp",
  "pants-m1": "img/pants-m1.webp",
  "pants-m2": "img/pants-m2.webp",
  "pants-m3": "img/pants-m3.webp",
  "pants-m4": "img/pants-m4.webp",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700&family=Great+Vibes&display=swap');

:root{
  --baby:#BFE1F6;
  --powder:#E4F2FC;
  --wash:#F5FBFF;
  --mid:#7EC0E8;
  --deep:#2C6E9B;
  --ink:#1F4460;
  --white:#FFFFFF;
  --shadow:0 10px 30px rgba(44,110,155,.14);
  --shadow-lg:0 18px 50px rgba(44,110,155,.20);
}

.ooch *{box-sizing:border-box;}
/* overflow-x is CLIP, not hidden — 2026-08-10. Setting it to hidden makes this
   element a scroll container, and position:sticky then sticks relative to IT
   rather than to the viewport. Because .ooch wraps the whole page and scrolls
   with the document, the sticky .nav scrolled away with it and the header
   vanished — even though the .nav rule was correct all along. clip still clips
   horizontal overflow but does NOT create a scroll container, so sticky works.
   Do not change it back to hidden.
   NOTE: this whole CSS block lives inside a JS template literal, so never put a
   backtick in a comment here — it ends the string and the build fails. */
.ooch{background:var(--wash);color:var(--ink);font-family:'Nunito',system-ui,sans-serif;font-size:16px;
  overflow-x:clip;-webkit-font-smoothing:antialiased;}
.ooch button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.ooch :focus-visible{outline:3px solid var(--deep);outline-offset:3px;border-radius:6px;}
.ooch h1,.ooch h2,.ooch h3{font-family:'Baloo 2',cursive;font-weight:800;line-height:1.05;margin:0;letter-spacing:-.01em;}
.script{font-family:'Great Vibes',cursive;font-weight:400;}

/* strip + nav */
.strip{background:var(--baby);color:var(--ink);overflow:hidden;padding:9px 0;font-weight:700;font-size:13.5px;}
.strip-inner{display:flex;gap:36px;white-space:nowrap;animation:slide 26s linear infinite;width:max-content;}
@keyframes slide{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.nav{position:sticky;top:0;z-index:40;background:rgba(245,251,255,.88);backdrop-filter:blur(14px);
  display:flex;align-items:center;gap:14px;padding:12px 14px;flex-wrap:wrap;}
.mark{font-family:'Great Vibes',cursive;font-size:42px;color:var(--deep);line-height:1;padding-bottom:6px;}
.navcats{display:flex;gap:6px;margin-left:4px;flex-wrap:wrap;}
.catbtn{padding:8px 14px;border-radius:999px;font-weight:700;font-size:15px;transition:.18s;color:var(--ink);}
.catbtn:hover{background:var(--powder);}
.catbtn[aria-pressed="true"]{background:var(--deep);color:var(--white);}
@media(max-width:520px){.catbtn{font-size:13.5px;padding:7px 11px;}}
.catrow{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:20px;scrollbar-width:none;}
.catrow::-webkit-scrollbar{display:none;}
.catrow .chip{white-space:nowrap;}
.emptycat{background:var(--white);border-radius:32px;box-shadow:var(--shadow);padding:48px 24px;text-align:center;}
.emptycat h3{font-size:clamp(24px,4.4vw,34px);margin-bottom:8px;}
.emptycat p{font-weight:600;color:var(--mid);margin:0 auto 20px;max-width:34ch;line-height:1.45;}
.navright{margin-left:auto;display:flex;align-items:center;gap:8px;}
.icobtn{width:42px;height:42px;border-radius:999px;background:var(--white);box-shadow:var(--shadow);
  display:grid;place-items:center;font-weight:700;transition:transform .18s;position:relative;}
.icobtn:hover{transform:translateY(-2px);}
.count{position:absolute;top:-3px;right:-3px;background:var(--deep);color:var(--white);font-size:11px;
  min-width:19px;height:19px;border-radius:999px;display:grid;place-items:center;padding:0 5px;}
.btn{border-radius:999px;padding:11px 20px;font-weight:700;transition:transform .18s,box-shadow .18s,background .18s;}
.btn:hover{transform:translateY(-2px);}
.btn-solid{background:var(--deep);color:var(--white);box-shadow:var(--shadow);}
.btn-solid:hover{background:var(--ink);}
.btn-soft{background:var(--white);color:var(--deep);box-shadow:var(--shadow);}
.btn-clear{background:rgba(255,255,255,.35);color:var(--ink);}
.btn-clear:hover{background:var(--white);}


/* hero */
.hero{background:var(--baby);position:relative;padding:52px 18px 0;text-align:center;overflow:hidden;}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.5);filter:blur(2px);}
.b1{width:340px;height:340px;top:-90px;left:-90px;}
.b2{width:220px;height:220px;bottom:60px;right:-60px;background:rgba(255,255,255,.38);}
.hero-in{position:relative;z-index:1;}
.findyour{font-family:'Baloo 2',cursive;font-weight:700;font-size:clamp(20px,3.6vw,32px);color:var(--ink);margin:0;}
.oochword{display:block;color:var(--white);font-size:clamp(130px,36vw,440px);line-height:.86;margin:-4px 0 0;
  padding-right:.1em;text-shadow:0 12px 34px rgba(44,110,155,.22);}
.rise{animation:rise .9s cubic-bezier(.2,.85,.25,1) both;}
.rise.d1{animation-delay:.14s;}
@keyframes rise{from{opacity:0;transform:translateY(22px) scale(.97);}to{opacity:1;transform:none;}}
.herosub{max-width:30ch;margin:14px auto 0;font-size:17.5px;line-height:1.45;font-weight:600;}
.herobtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:22px 0 46px;}
.wave{display:block;width:100%;height:auto;margin-bottom:-1px;}

/* sections */
.sect{padding:52px 18px;}
.shead{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;margin-bottom:22px;flex-wrap:wrap;}
.shead h2{font-size:clamp(28px,5vw,44px);}
.shead p{margin:6px 0 0;font-weight:600;color:var(--deep);}
.link{font-weight:700;color:var(--deep);border-bottom:2px solid var(--baby);padding-bottom:2px;}

/* ---------- photo showcase with colour slides ---------- */
.shows{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;}
.show{background:var(--white);border-radius:32px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;}
.stage{position:relative;aspect-ratio:4/5;background:#F2F1EF;}
.stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;
  transition:opacity .45s ease;}
.stage img.on{opacity:1;}
.arrow{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border-radius:999px;
  background:rgba(255,255,255,.92);box-shadow:var(--shadow);display:grid;place-items:center;
  font-size:19px;font-weight:700;color:var(--deep);transition:transform .18s;}
.arrow:hover{transform:translateY(-50%) scale(1.1);}
.arrow.l{left:12px;} .arrow.r{right:12px;}
.heart{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:999px;
  background:rgba(255,255,255,.92);display:grid;place-items:center;box-shadow:var(--shadow);transition:transform .2s;z-index:2;}
.heart:hover{transform:scale(1.12);}
.slidedots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:2;}
.slidedot{width:7px;height:7px;border-radius:999px;background:rgba(31,68,96,.28);}
.slidedot.on{background:var(--deep);width:18px;}
.sinfo{padding:18px 18px 20px;display:flex;flex-direction:column;gap:12px;}
.stitle{display:flex;justify-content:space-between;gap:12px;align-items:baseline;}
.stitle h3{font-size:24px;}
.stitle .price{font-weight:700;color:var(--deep);font-size:18px;}
.cname{font-weight:700;font-size:15px;}
.cname span{color:var(--mid);font-weight:600;}
.swrow{display:flex;gap:10px;flex-wrap:wrap;}
.swbtn{width:34px;height:34px;border-radius:999px;box-shadow:0 0 0 1.5px rgba(31,68,96,.15);transition:transform .16s,box-shadow .16s;}
.swbtn:hover{transform:scale(1.1);}
.swbtn[aria-pressed="true"]{box-shadow:0 0 0 2.5px var(--white),0 0 0 5px var(--deep);}
.sizerow{display:flex;gap:7px;flex-wrap:wrap;}
.szbtn{min-width:50px;height:38px;border-radius:999px;background:var(--powder);color:var(--deep);font-weight:700;font-size:14px;transition:.16s;}
.szbtn[aria-pressed="true"]{background:var(--deep);color:var(--white);}

/* product grid */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:16px;}
.card{border-radius:26px;overflow:hidden;background:var(--white);box-shadow:var(--shadow);
  display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s;}
.card:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);}
.art{aspect-ratio:4/5;display:grid;place-items:center;position:relative;overflow:hidden;}
.art img{width:100%;height:100%;object-fit:cover;}
.art svg.garment{width:76%;height:76%;transition:transform .5s cubic-bezier(.2,.85,.25,1);}
.card:hover .art svg.garment{transform:scale(1.07) rotate(-2deg);}
.badge{position:absolute;top:12px;left:12px;background:var(--white);color:var(--deep);border-radius:999px;
  padding:5px 11px;font-size:12.5px;font-weight:700;box-shadow:var(--shadow);z-index:2;}
.pmeta{padding:13px 14px 15px;display:flex;flex-direction:column;gap:8px;}
.prow{display:flex;justify-content:space-between;gap:10px;align-items:baseline;}
.pname{font-weight:700;font-size:15.5px;}
.price{font-weight:700;color:var(--deep);}
.swatches{display:flex;gap:6px;}
.sw{width:17px;height:17px;border-radius:999px;box-shadow:0 0 0 1.5px rgba(31,68,96,.15);}
.loves{font-size:13px;font-weight:600;color:var(--mid);}
.addbtn{background:var(--powder);color:var(--deep);border-radius:999px;padding:10px;font-weight:700;font-size:14px;transition:.18s;}
.addbtn:hover{background:var(--deep);color:var(--white);}

/* looks */
.looks{display:grid;grid-template-columns:1.35fr 1fr;gap:16px;}
@media(max-width:760px){.looks{grid-template-columns:1fr;}}
.look{border-radius:30px;padding:30px;min-height:270px;display:flex;flex-direction:column;justify-content:flex-end;
  gap:10px;position:relative;overflow:hidden;box-shadow:var(--shadow);}
.look h3{font-size:clamp(26px,4vw,38px);}
.look.one{background:linear-gradient(160deg,var(--baby),var(--mid));color:var(--white);}
.look.two{background:var(--powder);color:var(--ink);}
.look .script{font-size:52px;position:absolute;top:18px;right:24px;opacity:.55;}

/* quiz */
.quiz{background:var(--baby);border-radius:34px;padding:44px 22px;text-align:center;position:relative;overflow:hidden;}
.quiz h2{font-size:clamp(32px,6vw,58px);}
.quizmark{position:absolute;top:6px;right:26px;font-size:62px;color:var(--white);opacity:.6;}
.quizline{max-width:40ch;margin:12px auto 22px;font-weight:700;line-height:1.45;font-size:clamp(17px,2.6vw,22px);color:var(--deep);}
.qfade{animation:qfade .4s cubic-bezier(.2,.85,.25,1) both;}
@keyframes qfade{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
.dots{display:flex;gap:7px;justify-content:center;margin-bottom:18px;}
.dot{width:9px;height:9px;border-radius:999px;background:var(--white);opacity:.55;}
.dot.on{opacity:1;background:var(--deep);}
.qtext{font-family:'Baloo 2',cursive;font-weight:800;font-size:clamp(28px,5.4vw,46px);line-height:1.08;margin:0 0 24px;}
.opts{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.opt{background:var(--white);border-radius:26px;padding:26px 20px;min-width:170px;flex:1 1 190px;max-width:250px;
  box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s;display:flex;flex-direction:column;align-items:center;gap:10px;}
.opt:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);}
.opt .lbl{font-family:'Baloo 2',cursive;font-weight:800;font-size:23px;color:var(--ink);}
.opt .sub{font-size:14px;font-weight:600;color:var(--mid);}
.qback{margin-top:20px;font-weight:700;color:var(--deep);text-decoration:underline;text-underline-offset:4px;}
.result{background:var(--white);border-radius:34px;padding:34px 20px;box-shadow:var(--shadow);text-align:center;}
.rlead{font-family:'Great Vibes',cursive;font-size:clamp(44px,7.5vw,72px);color:var(--deep);line-height:1;margin:0;}
.rname{font-family:'Baloo 2',cursive;font-weight:800;font-size:clamp(24px,4.4vw,38px);margin:8px 0 6px;}
.rblurb{max-width:44ch;margin:0 auto 24px;font-weight:600;line-height:1.5;}
.rgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:14px;text-align:left;}
.rfoot{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:26px;}

/* reviews + footer */
.revs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;}
.rev{background:var(--white);border-radius:24px;padding:20px;box-shadow:var(--shadow);}
.rev p{margin:10px 0 0;line-height:1.5;font-weight:600;}
.who{margin-top:14px;font-size:13.5px;color:var(--mid);font-weight:700;}
.stars{color:var(--deep);letter-spacing:2px;}
.foot{background:var(--baby);margin-top:36px;padding:44px 18px 26px;border-radius:38px 38px 0 0;}
.footgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:26px;}
.foot h4{margin:0 0 10px;font-family:'Baloo 2',cursive;font-size:18px;}
.foot ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font-weight:600;font-size:14.5px;align-items:flex-start;}
.footlink{font-weight:600;font-size:14.5px;text-align:left;padding:2px 0;border-bottom:1.5px solid transparent;}
.footlink:hover{border-bottom-color:var(--deep);}
.foot .fine{margin-top:26px;font-size:13px;font-weight:600;color:var(--deep);}
.mailrow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.mailrow input{flex:1;min-width:150px;border:none;border-radius:999px;padding:12px 16px;font-family:inherit;font-size:15px;background:var(--white);}

/* modal + toast */
.scrim{position:fixed;inset:0;background:rgba(31,68,96,.45);backdrop-filter:blur(4px);z-index:60;
  display:flex;align-items:center;justify-content:center;padding:18px;}
.sheet{background:var(--white);width:100%;max-width:400px;border-radius:30px;padding:28px;box-shadow:var(--shadow-lg);}
.authbtn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;font-weight:700;
  font-size:15px;border-radius:999px;margin-bottom:10px;background:var(--powder);transition:transform .18s;}
.authbtn.apple{background:var(--ink);color:var(--white);}
.authbtn:hover{transform:translateY(-2px);}
.divider{display:flex;align-items:center;gap:10px;margin:16px 0;font-weight:600;color:var(--mid);font-size:14px;}
.divider:before,.divider:after{content:"";flex:1;height:1.5px;background:var(--powder);}
.field{width:100%;padding:13px 16px;border:1.5px solid var(--powder);border-radius:999px;font-family:inherit;font-size:15px;}
.toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);background:var(--deep);color:var(--white);
  padding:13px 22px;border-radius:999px;font-weight:700;z-index:70;box-shadow:var(--shadow-lg);}

/* signature block */
.sig{background:var(--white);border-radius:36px;box-shadow:var(--shadow);overflow:hidden;padding-bottom:8px;}
.sighead{text-align:center;padding:44px 22px 4px;}
.sigtitle{font-family:'Great Vibes',cursive;font-size:clamp(44px,7vw,72px);color:var(--deep);line-height:1;display:block;}
.sigsub{font-weight:700;color:var(--ink);margin:10px auto 0;max-width:38ch;line-height:1.45;}
.sigmain{max-width:580px;margin:26px auto 0;padding:0 18px;}
.sigstage{position:relative;background:#F2F1EF;border-radius:30px;overflow:hidden;aspect-ratio:4/5;cursor:zoom-in;}
.stagehint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.92);
  border-radius:999px;padding:6px 14px;font-size:12.5px;font-weight:700;color:var(--deep);box-shadow:var(--shadow);}
.sigstage img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .4s ease;}
.sigstage img.on{opacity:1;}
.thumbs{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-top:14px;}
.thumb{width:64px;height:64px;border-radius:18px;overflow:hidden;background:#F2F1EF;box-shadow:0 0 0 1.5px rgba(31,68,96,.12);transition:transform .16s;}
.thumb:hover{transform:translateY(-2px);}
.thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.thumb[aria-pressed="true"]{box-shadow:0 0 0 2.5px var(--white),0 0 0 5px var(--deep);}
.viewname{text-align:center;font-weight:700;margin:12px 0 0;color:var(--deep);}
.sigbuy{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin:16px 0 6px;}
.feats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:760px;margin:30px auto 0;padding:0 18px;}
@media(max-width:720px){.feats{grid-template-columns:1fr 1fr;}}
.feat{background:var(--wash);border-radius:20px;padding:16px 12px;font-weight:700;font-size:14.5px;line-height:1.3;text-align:center;}
.feat span{display:block;color:var(--mid);font-weight:600;font-size:12.5px;margin-top:3px;}
.dets{list-style:none;max-width:400px;margin:24px auto 0;padding:0;display:flex;flex-direction:column;gap:7px;font-weight:600;font-size:14.5px;}
.dets li:before{content:"♥ ";color:var(--baby);}
.worn{padding:38px 18px 30px;}
.worn h4{text-align:center;font-family:'Baloo 2',cursive;font-size:22px;margin:0 0 4px;}
.worn p.sml{text-align:center;font-weight:600;color:var(--mid);font-size:14px;margin:0 0 16px;}
.models{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:660px;margin:0 auto;}
.models button{padding:0;border-radius:22px;overflow:hidden;position:relative;display:block;
  box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s;background:#F2F1EF;}
.models button:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);}
.models img{width:100%;display:block;}
.zoom{position:absolute;bottom:8px;right:8px;background:rgba(255,255,255,.92);border-radius:999px;
  width:30px;height:30px;display:grid;place-items:center;font-size:14px;box-shadow:var(--shadow);}
.mcap{position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,.92);border-radius:999px;
  padding:4px 10px;font-size:12px;font-weight:700;color:var(--deep);}
.stylechips{display:flex;gap:7px;flex-wrap:wrap;}
.stylechip{border-radius:999px;padding:8px 14px;font-weight:700;font-size:13.5px;background:var(--wash);color:var(--deep);}
.stylechip[aria-pressed="true"]{background:var(--deep);color:var(--white);}

/* size guide */
.sizeguide{background:var(--white);border-radius:34px;box-shadow:var(--shadow);padding:34px 20px 30px;margin-top:18px;}
.sghead{text-align:center;}
.sgtitle{font-family:'Great Vibes',cursive;font-size:clamp(36px,6vw,56px);color:var(--deep);line-height:1.05;display:block;}
.sghead p{font-weight:600;color:var(--mid);margin:6px 0 0;font-size:14.5px;}
.sgchips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:22px 0 18px;}
.sgchip{background:var(--wash);border-radius:20px;padding:10px 16px;min-width:66px;transition:.16s;
  display:flex;flex-direction:column;align-items:center;gap:1px;}
.sgchip strong{font-family:'Baloo 2',cursive;font-size:21px;font-weight:800;color:var(--ink);line-height:1;}
.sgchip span{font-size:12px;font-weight:700;color:var(--mid);letter-spacing:.06em;}
.sgchip[aria-pressed="true"]{background:var(--deep);}
.sgchip[aria-pressed="true"] strong,.sgchip[aria-pressed="true"] span{color:var(--white);}
.sgstats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:460px;margin:0 auto;}
.sgtable{min-width:480px;}
.sgstat{background:var(--baby);border-radius:22px;padding:16px 8px;text-align:center;}
.sgstat span{display:block;font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--deep);}
.sgstat strong{font-family:'Baloo 2',cursive;font-weight:800;font-size:clamp(28px,6vw,38px);line-height:1.1;display:block;}
.sgstat i{font-style:normal;font-size:12.5px;font-weight:700;color:var(--deep);}
.sgtablewrap{overflow-x:auto;margin:24px auto 0;max-width:640px;scrollbar-width:none;}
.sgtablewrap::-webkit-scrollbar{display:none;}
.sgtable{border-collapse:separate;border-spacing:4px;width:100%;min-width:420px;}
.sgtable th,.sgtable td{padding:9px 6px;text-align:center;font-size:14px;font-weight:700;border-radius:12px;}
.sgtable thead th{background:var(--wash);color:var(--ink);}
.sgtable thead th.sub{font-size:12px;color:var(--mid);letter-spacing:.06em;}
.sgtable thead th.on{background:var(--deep);color:var(--white);}
.sgtable tbody th{background:var(--powder);color:var(--deep);text-align:left;padding-left:12px;}
.sgtable tbody td{background:var(--wash);color:var(--ink);font-weight:600;}
.sgtable tbody td.on{background:var(--baby);font-weight:700;}
.sgtip{text-align:center;font-weight:600;line-height:1.5;color:var(--deep);max-width:46ch;margin:20px auto 0;font-size:14.5px;}

/* drawers */
.drawerscrim{position:fixed;inset:0;background:rgba(31,68,96,.42);backdrop-filter:blur(3px);z-index:75;
  display:flex;justify-content:flex-end;}
.drawer{background:var(--wash);width:min(420px,100%);height:100%;display:flex;flex-direction:column;
  box-shadow:var(--shadow-lg);animation:slidein .3s cubic-bezier(.2,.85,.25,1) both;}
@keyframes slidein{from{transform:translateX(30px);opacity:0;}to{transform:none;opacity:1;}}
.drawertop{display:flex;align-items:flex-start;gap:12px;padding:20px 18px 14px;background:var(--white);}
.drawertop h3{font-size:26px;}
.drawertop p{margin:4px 0 0;font-weight:600;color:var(--mid);font-size:14px;}
.drawertop button{margin-left:auto;}
.drawerbody{flex:1;overflow-y:auto;padding:16px 18px 24px;}
.bagline{background:var(--white);border-radius:20px;padding:14px 16px;margin-bottom:10px;
  display:flex;gap:12px;align-items:flex-start;box-shadow:var(--shadow);}
.bagline strong{font-weight:700;font-size:15px;line-height:1.35;}
.bagline span{display:block;font-weight:700;color:var(--deep);margin-top:4px;}
.bagline .rm{margin-left:auto;font-weight:700;color:var(--mid);font-size:13px;
  text-decoration:underline;text-underline-offset:3px;flex-shrink:0;}
.bagfoot{background:var(--white);border-radius:24px;padding:18px;box-shadow:var(--shadow);margin-top:6px;}
.bagtotal{display:flex;justify-content:space-between;align-items:baseline;font-weight:700;margin-bottom:14px;}
.bagtotal em{font-style:normal;font-family:'Baloo 2',cursive;font-weight:800;font-size:26px;color:var(--deep);}
.drawerempty{text-align:center;padding:40px 16px;}
.drawerempty p{font-weight:600;color:var(--mid);line-height:1.5;margin:8px auto 18px;max-width:28ch;}

/* menu */
.menubtn{width:42px;height:42px;border-radius:999px;background:var(--white);box-shadow:var(--shadow);
  display:grid;place-items:center;transition:transform .18s;flex-shrink:0;}
.menubtn:hover{transform:translateY(-2px);}
.burger{display:flex;flex-direction:column;gap:4px;width:18px;}
.burger i{display:block;height:2.4px;border-radius:2px;background:var(--deep);transition:transform .22s,opacity .18s;}
.burger.x i:nth-child(1){transform:translateY(6.4px) rotate(45deg);}
.burger.x i:nth-child(2){opacity:0;}
.burger.x i:nth-child(3){transform:translateY(-6.4px) rotate(-45deg);}
.menuscrim{position:fixed;inset:0;background:rgba(31,68,96,.28);z-index:44;}
.menupanel{position:fixed;top:76px;left:14px;width:250px;background:var(--white);border-radius:26px;
  box-shadow:var(--shadow-lg);padding:14px;z-index:45;animation:qfade .25s cubic-bezier(.2,.85,.25,1) both;}
.menulabel{margin:2px 0 8px 12px;font-size:11.5px;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;color:var(--mid);}
.menuitem{display:block;width:100%;text-align:left;padding:11px 12px;border-radius:16px;
  font-weight:700;font-size:16px;transition:background .16s;}
.menuitem:hover{background:var(--wash);}
.menuitem[aria-pressed="true"]{background:var(--deep);color:var(--white);}
.menuitem.strong{color:var(--deep);}
.menusplit{height:1.5px;background:var(--powder);margin:10px 8px;}
.cataloguewrap{padding:14px 18px 60px;max-width:980px;margin:0 auto;}

/* limited pieces */
.limitedhead{text-align:center;background:var(--baby);border-radius:32px;padding:34px 22px;margin-bottom:18px;}
.limitedtag{display:inline-block;background:var(--white);color:var(--deep);border-radius:999px;
  padding:6px 16px;font-weight:700;font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;}
.limitedhead h2{font-size:clamp(30px,5.6vw,52px);margin-top:12px;}
.limitedhead p{max-width:40ch;margin:10px auto 0;font-weight:600;line-height:1.5;color:var(--deep);}

/* dresses */
.dress{background:var(--white);border-radius:36px;box-shadow:var(--shadow);overflow:hidden;padding-bottom:10px;margin-bottom:18px;}
.dhead{text-align:center;padding:40px 22px 2px;}
.dname{font-family:'Great Vibes',cursive;font-size:clamp(40px,6.5vw,66px);color:var(--deep);line-height:1.05;display:block;}
.dtag{font-family:'Great Vibes',cursive;font-size:clamp(20px,3vw,28px);color:var(--mid);margin:2px 0 0;}
.dmain{max-width:520px;margin:20px auto 0;padding:0 18px;}
.dstage{position:relative;background:#F6F3F0;border-radius:30px;overflow:hidden;aspect-ratio:4/5;cursor:zoom-in;}
.dstage img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .4s ease;}
.dstage img.on{opacity:1;}
.dblurb{max-width:52ch;margin:20px auto 0;text-align:center;font-weight:600;line-height:1.55;padding:0 18px;}
.dbuy{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin:18px 0 4px;}
.dsizes{display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin-top:14px;}
.dgridwrap{padding:30px 18px 0;}
.dgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;max-width:900px;margin:0 auto;}
.dtile{background:var(--wash);border-radius:20px;overflow:hidden;text-align:center;padding-bottom:12px;}
.dtile img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;}
.dtile strong{display:block;font-size:14px;margin-top:10px;color:var(--deep);}
.dtile span{display:block;font-size:12.5px;font-weight:600;color:var(--mid);margin-top:2px;}
.dspecs{list-style:none;max-width:420px;margin:26px auto 0;padding:0 18px;display:grid;
  grid-template-columns:1fr 1fr;gap:8px;font-weight:600;font-size:14.5px;}
@media(max-width:560px){.dspecs{grid-template-columns:1fr;}}
.dspecs li:before{content:"♥ ";color:var(--baby);}
.dcolours{display:flex;gap:14px;justify-content:center;align-items:center;margin-top:22px;flex-wrap:wrap;}
.dcol{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;}
.dcol i{width:26px;height:26px;border-radius:999px;display:block;box-shadow:0 0 0 1.5px rgba(31,68,96,.18);}

/* sets */
.setsheet{position:fixed;inset:0;z-index:70;background:var(--wash);overflow-y:auto;animation:qfade .35s cubic-bezier(.2,.85,.25,1) both;}
.setstop{position:sticky;top:0;background:rgba(245,251,255,.92);backdrop-filter:blur(12px);
  display:flex;align-items:center;gap:12px;padding:16px 18px;z-index:2;}
.setstop h2{font-size:clamp(26px,5vw,40px);}
.setswrap{padding:14px 18px 60px;display:grid;gap:18px;max-width:900px;margin:0 auto;}
.setcard{background:var(--white);border-radius:32px;box-shadow:var(--shadow);overflow:hidden;}
.setpics{display:grid;gap:2px;background:var(--powder);}
.setpics.n2{grid-template-columns:1fr 1fr;}
.setpics.n3{grid-template-columns:1fr 1fr 1fr;}
.setpics.n4{grid-template-columns:1fr 1fr;}
.setpic{position:relative;background:#F2F1EF;aspect-ratio:4/5;}
.setpic img{width:100%;height:100%;object-fit:cover;display:block;}
.setpic span{position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,.92);border-radius:999px;
  padding:4px 10px;font-size:11.5px;font-weight:700;color:var(--deep);}
.setinfo{padding:20px 20px 22px;display:flex;flex-direction:column;gap:12px;}
.setinfo h3{font-size:24px;}
.setpieces{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-weight:600;font-size:14.5px;}
.setpieces li{display:flex;justify-content:space-between;gap:12px;}
.setpieces li span{color:var(--mid);}
.setprice{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;}
.setprice .was{color:var(--mid);text-decoration:line-through;font-weight:600;}
.setprice .now{font-family:'Baloo 2',cursive;font-weight:800;font-size:26px;color:var(--deep);}
.setprice .save{background:var(--baby);color:var(--ink);border-radius:999px;padding:4px 11px;font-size:12.5px;font-weight:700;}

/* lightbox */
.lbox{position:fixed;inset:0;background:rgba(31,68,96,.72);backdrop-filter:blur(6px);z-index:80;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;}
.lbox img{max-width:min(92vw,460px);max-height:70vh;border-radius:26px;box-shadow:var(--shadow-lg);}
.lbrow{display:flex;align-items:center;gap:14px;}
.lbbtn{width:46px;height:46px;border-radius:999px;background:var(--white);color:var(--deep);
  font-size:20px;font-weight:700;box-shadow:var(--shadow);display:grid;place-items:center;transition:transform .16s;}
.lbbtn:hover{transform:scale(1.08);}
.lbcap{color:var(--white);font-weight:700;font-size:15.5px;min-width:150px;text-align:center;}
.lbclose{position:absolute;top:18px;right:18px;background:var(--white);color:var(--deep);
  border-radius:999px;padding:10px 18px;font-weight:700;box-shadow:var(--shadow);}

@media (prefers-reduced-motion:reduce){.ooch *{animation:none !important;transition:none !important;}}
`;

/* ---------------- vector art for the not-yet-photographed pieces ---------------- */
const S = { fill: "none", strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" };
const Joggers = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M62 30 H138 V142 H104 L100 96 L96 142 H62 Z" fill={a} stroke={b} {...S} />
    <path d="M60 24 h80 a8 8 0 0 1 8 8 v6 a8 8 0 0 1 -8 8 h-80 a8 8 0 0 1 -8 -8 v-6 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
    <path d="M60 140 h40 a8 8 0 0 1 8 8 v8 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 v-8 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
    <path d="M100 140 h40 a8 8 0 0 1 8 8 v8 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 v-8 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
  </svg>
);
const Shorts = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M58 52 H142 L146 128 H106 L100 96 L94 128 H54 Z" fill={a} stroke={b} {...S} />
    <path d="M56 44 h88 a8 8 0 0 1 8 8 v4 a8 8 0 0 1 -8 8 h-88 a8 8 0 0 1 -8 -8 v-4 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
  </svg>
);
const Skirt = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M66 52 h68 l26 106 Q100 172 40 158 Z" fill={a} stroke={b} {...S} />
    <path d="M64 44 h72 a8 8 0 0 1 8 8 v2 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-2 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
    <path d="M90 68 L84 162 M112 68 L120 162" stroke={b} strokeWidth="3" opacity=".5" fill="none" />
  </svg>
);
const Skort = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M70 52 h60 l24 92 h-40 L100 122 L86 144 H46 Z" fill={a} stroke={b} {...S} />
    <path d="M64 44 h72 a8 8 0 0 1 8 8 v2 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-2 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
    <path d="M100 62 L100 122" stroke={b} strokeWidth="3" opacity=".5" fill="none" />
  </svg>
);
const CropTop = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M68 54 L86 46 Q100 62 114 46 L132 54 L162 76 L144 94 L136 86 L136 132 Q100 140 64 132 L64 86 L56 94 L38 76 Z" fill={a} stroke={b} {...S} />
    <path d="M86 46 Q100 62 114 46" stroke={b} {...S} />
  </svg>
);
const FlowyTop = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M74 40 L88 32 Q100 48 112 32 L126 40 L156 62 L140 78 L132 70 L164 160 Q100 178 36 160 L68 70 L60 78 L44 62 Z" fill={a} stroke={b} {...S} />
    <path d="M86 88 L80 158 M114 88 L120 158" stroke={b} strokeWidth="3" opacity=".45" fill="none" />
  </svg>
);
const LongSleeve = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M68 32 L86 24 Q100 42 114 24 L132 32 L162 54 L176 138 L152 146 L140 86 L140 176 H60 V86 L48 146 L24 138 L38 54 Z" fill={a} stroke={b} {...S} />
    <path d="M86 24 Q100 42 114 24" stroke={b} {...S} />
  </svg>
);
const Blazer = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M66 30 L100 44 L134 30 L170 60 L152 82 L142 72 L144 176 H56 L58 72 L48 82 L30 60 Z" fill={a} stroke={b} {...S} />
    <path d="M100 44 L78 96 L92 176 M100 44 L122 96 L108 176" stroke={b} {...S} />
  </svg>
);
const DressPants = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M60 34 H140 L146 176 H108 L100 100 L92 176 H54 Z" fill={a} stroke={b} {...S} />
    <path d="M58 26 h84 a8 8 0 0 1 8 8 v4 a8 8 0 0 1 -8 8 h-84 a8 8 0 0 1 -8 -8 v-4 a8 8 0 0 1 8 -8 z" fill={a} stroke={b} {...S} />
    <path d="M80 56 L76 172 M120 56 L124 172" stroke={b} strokeWidth="3" opacity=".45" fill="none" />
  </svg>
);
const Tote = ({ a, b }) => (
  <svg className="garment" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M70 64 Q70 26 100 26 Q130 26 130 64" stroke={b} strokeWidth="5" fill="none" />
    <path d="M46 64 h108 v96 a14 14 0 0 1 -14 14 h-80 a14 14 0 0 1 -14 -14 z" fill={a} stroke={b} {...S} />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"
       fill={filled ? "#2C6E9B" : "none"} stroke="#2C6E9B" strokeWidth="2.2" strokeLinejoin="round">
    <path d="M12 20.5 3.8 12.6a5 5 0 1 1 7.1-7l1.1 1.1 1.1-1.1a5 5 0 1 1 7.1 7z" />
  </svg>
);

/* ---------------- data ---------------- */
let COLOURS = [
  { key: "baby-blue",  name: "Baby blue",  note: "soft & sweet",       hex: "#D4DDED" },
  { key: "sky-blue",   name: "Sky blue",   note: "bright & fresh",     hex: "#B3CCEB" },
  { key: "cornflower", name: "Cornflower", note: "cool & calm",        hex: "#8DA0C2" },
  { key: "denim-blue", name: "Denim blue", note: "classic & timeless", hex: "#5875A4" },
  { key: "navy-blue",  name: "Navy blue",  note: "deep & effortless",  hex: "#293046" },
];

let SIZES = ["2XS", "XS", "S", "M", "L", "XL"];

let PHOTO_PRODUCTS = [
  { id: "tee", staple: true,    name: "Everyday tee", price: 55, prefix: "tee", sizes: true, cat: "tops",
    blurb: "Soft cotton, close fit, five blues. The one you reach for without thinking." },
  { id: "hoodie", staple: true, name: "Classic zip-thru hoodie", price: 115, prefix: "hoodie", sizes: true, cat: "tops",
    blurb: "Full length zip, drawcord hood, brushed inside. Roomy through the body, drops to the hip." },
  { id: "pant", staple: true,   name: "Classic wide trackie", price: 99, prefix: "pant", sizes: true, cat: "bottoms",
    blurb: "High elastic waist, drawcord, and a leg that keeps going. Matches the hoodie exactly." },
  { id: "singlet", staple: true, name: "Scoop back singlet", price: 49, prefix: "singlet-front", sizes: true, cat: "tops",
    styles: [
      { key: "singlet-front", label: "Front" },
      { key: "singlet-back",  label: "Back" },
    ],
    blurb: "V front, scoop back, straps set wide at the arm. Made to go under the zip-thru or on its own." },
  { id: "skort", staple: true,  name: "Mini skort", price: 75, prefix: "skort", sizes: true, cat: "bottoms",
    blurb: "Pleated, high waisted, with a satin bow at the hip. Built-in shorts underneath." },
  { id: "tote", staple: true,   name: "Mini tote", price: 39, prefix: "tote", sizes: false, cat: "accessories",
    blurb: "Heavy canvas, flat bottom, fits a laptop. The ooch script printed on the front." },
  { id: "bikini", name: "Ooch bikini", price: 79, prefix: "bikini-front", sizes: true, cat: "swim",
    colours: [
      { key: "sky-blue", name: "Sky blue", note: "bright & fresh", hex: "#A8C8E8" },
      { key: "white",     name: "White",     note: "clean & classic", hex: "#F2F2EF" },
    ],
    styles: [
      { key: "bikini-front", label: "Front" },
      { key: "bikini-back",  label: "Back" },
    ],
    blurb: "Classic triangle top and tie-side bottoms, both adjustable. Quick dry, with the ooch script at the back." },
  { id: "band", staple: true,   name: "Fabric headband", price: 20, prefix: "band-twist", sizes: false, cat: "accessories",
    styles: [
      { key: "band-twist",  label: "Twist" },
      { key: "band-bow",    label: "Bow" },
      { key: "band-skinny", label: "Skinny" },
      { key: "band-wide",   label: "Wide" },
    ],
    blurb: "Four shapes, five blues, one size. Soft jersey with a stretch back that stays put." },
];

let PRODUCTS = [
  { id: 7, cat: "accessories", staple: true, name: "Bow headband",     price: 20, badge: "New",        loves: "4.1k", img: "band-bow-sky-blue",     sw: ["#D4DDED", "#B3CCEB", "#8DA0C2", "#5875A4", "#293046"] },
  { id: 8, cat: "accessories", staple: true, name: "Skinny headband",  price: 15,  badge: "Two for $25", loves: "2.6k", img: "band-skinny-cornflower", sw: ["#D4DDED", "#B3CCEB", "#8DA0C2", "#5875A4", "#293046"] },
  { id: 9, cat: "accessories", staple: true, name: "Wide headband",    price: 20, badge: "Low stock",  loves: "1.8k", img: "band-wide-denim-blue",  sw: ["#D4DDED", "#B3CCEB", "#8DA0C2", "#5875A4", "#293046"] },
];

let DRESSES = [
  {
    id: "summer", name: "Cocktail dress", tagline: "sweet. feminine. effortless.",
    price: 119, cat: "dresses", limited: true,
    blurb: "A flirty summer dress made for sunshine days and warm nights. Halter neck tie, open back, and a layered ruffle skirt with built-in shorts underneath, so you can move without thinking about it. Finished with a dainty belt and bow details.",
    views: [
      { key: "summer-front", label: "Front" },
      { key: "summer-back", label: "Back" },
      { key: "summer-shorts", label: "Built-in shorts" },
    ],
    details: [
      { key: "summer-d1", title: "Bow detail", note: "sweet & delicate" },
      { key: "summer-d2", title: "Dainty belt", note: "adjustable & flattering" },
      { key: "summer-d3", title: "Ruffle skirt", note: "playful & feminine" },
      { key: "summer-d4", title: "Open back", note: "tie for the perfect fit" },
      { key: "summer-d5", title: "Lightweight fabric", note: "soft, breathable & cool" },
    ],
    models: ["summer-m1", "summer-m2", "summer-m3"],
    specs: ["Halter neck tie", "Open back", "Built-in shorts", "Adjustable belt",
            "Lightweight and breathable", "Day to night"],
  },
  {
    id: "bow", name: "Strapless bow dress", tagline: "twirl. flirt. feel free.",
    price: 129, cat: "dresses", limited: true,
    blurb: "The strapless one, made for sunshine and sweet moments. Delicate bow details, a full circle skirt that actually twirls, and built-in shorts so it can. Back zip, waist tie, and nothing to keep adjusting.",
    views: [
      { key: "bow-front", label: "Front" },
      { key: "bow-back", label: "Back" },
      { key: "bow-shorts", label: "Built-in shorts" },
    ],
    details: [
      { key: "bow-d1", title: "Strapless fit", note: "secure & flattering" },
      { key: "bow-d2", title: "Bow details", note: "sweet & feminine" },
      { key: "bow-d3", title: "Waist tie", note: "adjustable & flattering" },
      { key: "bow-d4", title: "Circle skirt", note: "made to twirl" },
      { key: "bow-d5", title: "Lightweight fabric", note: "soft, breathable & airy" },
      { key: "bow-d6", title: "Back zip", note: "easy & secure" },
    ],
    models: ["bow-m1", "bow-m2", "bow-m3", "bow-m4"],
    specs: ["Strapless neckline", "Bow accents", "Circle skirt", "Built-in shorts",
            "Waist tie", "Back zipper", "Lightweight and breathable", "Day or night"],
  },
];

let DRESS_COLOURS = [
  { name: "Sky blue", hex: "#7EA8DC" },
  { name: "White", hex: "#FFFFFF" },
];

let DENIM_COLOURS = [
  { name: "Denim", hex: "#2B3A5C" },
  { name: "White", hex: "#FFFFFF" },
];

let FIVE_BLUES = COLOURS.map((c) => ({ name: c.name, hex: c.hex }));

let SHORTS = [
  {
    id: "dresspant", name: "Ooch tailored pant", tagline: "effortless. flowy. timeless.",
    price: 129, cat: "bottoms", limited: true,
    colours: [
      { name: "Black", hex: "#151515" },
      { name: "White", hex: "#F7F5F0" },
    ],
    blurb: "A low rise tailored pant that sits on the hips, wide and flowy through the leg, cut extra long to skim the floor. 82% polyester, 18% rayon — lightweight with a smooth drape. Functional side pockets, belt loops, zip fly with a button closure.",
    views: [
      { key: "dp-black-front", label: "Black, front" },
      { key: "dp-black-side", label: "Black, side" },
      { key: "dp-white-front", label: "White, front" },
      { key: "dp-white-side", label: "White, side" },
    ],
    details: [
      { key: "dp-d1", title: "Low rise fit", note: "sits low on the hips" },
      { key: "dp-d2", title: "Functional side pockets", note: "deep enough for the essentials" },
      { key: "dp-d3", title: "Flowy & draped", note: "lightweight, beautiful drape" },
      { key: "dp-d4", title: "Clean & minimal", note: "refined details" },
      { key: "dp-d5", title: "Extra long length", note: "skims the floor" },
      { key: "dp-fabric", title: "82% polyester, 18% rayon", note: "light, flowy, breathable" },
    ],
    models: ["dp-m1", "dp-m2"],
    specs: ["Low rise tailored fit", "Wide leg and flowy", "Functional side pockets",
            "Belt loops", "Zip fly with button closure",
            "Relaxed through the leg", "Extra long length"],
  },
  {
    id: "maxi", name: "Ooch lily maxi dress", tagline: "soft. floral. unforgettable.",
    price: 145, cat: "dresses", staple: true,
    colours: [{ name: "White with blue lily", hex: "linear-gradient(135deg,#FFFFFF 45%,#7EA8DC 45%)" }],
    blurb: "A bias-cut slip maxi in white, with a hand-painted blue lily print placed across the body and hem. Fine adjustable straps, a straight neckline, low scoop back, and a skirt that falls long and moves as you walk.",
    views: [
      { key: "maxi-front", label: "Front" },
      { key: "maxi-back", label: "Back" },
    ],
    details: [
      { key: "maxi-d1", title: "Straight neckline", note: "fine adjustable straps" },
      { key: "maxi-d2", title: "Hand-painted lily print", note: "placed, not repeated" },
    ],
    models: ["maxi-m1", "maxi-m2", "maxi-m3"],
    specs: ["Bias cut slip shape", "Fine adjustable straps", "Straight neckline",
            "Low scoop back", "Placed lily print", "Full length, falls to the floor"],
  },
  {
    id: "relaxedshort", name: "Ooch relaxed short", tagline: "cute. comfy. everyday.",
    price: 55, cat: "bottoms", staple: true,
    colours: [
      { name: "Sky blue", hex: "#B3CCEB" },
      { name: "White", hex: "#F7F5F0" },
    ],
    blurb: "A relaxed fit short in thick, soft fleece — 80% cotton, 20% polyester. Elastic waist with a drawstring, deep side pockets, white piping round the leg and the ooch script embroidered on the front.",
    views: [
      { key: "relaxed-front", label: "Front" },
      { key: "relaxed-back", label: "Back" },
    ],
    details: [
      { key: "relaxed-d1", title: "Adjustable waist", note: "elastic with a drawstring" },
      { key: "relaxed-d2", title: "Side pockets", note: "deep enough for your phone" },
      { key: "relaxed-d3", title: "Embroidered logo", note: "subtle ooch script" },
      { key: "relaxed-d4", title: "Contrast piping", note: "white, sporty finish" },
      { key: "relaxed-fabric", title: "80% cotton, 20% polyester", note: "thick, soft fleece inside" },
    ],
    models: ["relaxed-m1", "relaxed-m2"],
    specs: ["Relaxed fit shorts", "Soft, cosy and breathable", "Side pockets",
            "Elastic waistband with drawstring", "Ooch embroidery",
            "Size up for a more oversized look"],
  },
  {
    id: "denimshort", name: "Ooch low denim short", tagline: "low rise. mini length. every day.",
    price: 69, cat: "bottoms", limited: true, colours: DENIM_COLOURS,
    blurb: "A low rise mini short in a soft denim blend with just enough stretch. Five pocket build, button closure, belt loops, and the ooch script embroidered on the back pocket. Runs low on the waist, so size up if you are between two.",
    views: [
      { key: "denim-front", label: "Front" },
      { key: "denim-back", label: "Back" },
    ],
    details: [
      { key: "denim-d1", title: "Button closure", note: "belt loops & five pockets" },
      { key: "denim-d2", title: "Embroidered logo", note: "on the back pocket" },
      { key: "denim-d3", title: "Soft denim blend", note: "stretches, holds its shape" },
      { key: "denim-d4", title: "Side profile", note: "low rise, mini length" },
    ],
    models: [],
    specs: ["Low rise fit", "Mini length", "Button closure", "Belt loops",
            "Five pocket design", "Embroidered logo", "Soft denim blend", "Comfortable and breathable"],
  },
  {
    id: "foldshort", name: "Ooch fold back short", tagline: "soft. flattering. made to move with you.",
    /* coloursFollowPalette: this item's swatches ARE the five blues, so when the
       palette is edited in the admin they must follow it. Without the marker the
       item would keep a stale copy of the old palette forever. */
    price: 45, cat: "bottoms", staple: true, colours: FIVE_BLUES, coloursFollowPalette: true,
    blurb: "Buttery soft and light enough to forget you have them on. The waistband folds over and stays put, with the ooch script centred on the back fold. Five blues, one size run, endless ways to wear them.",
    views: [
      { key: "fold-baby-blue", label: "Baby blue" },
      { key: "fold-sky-blue", label: "Sky blue" },
      { key: "fold-cornflower", label: "Cornflower" },
      { key: "fold-denim-blue", label: "Denim blue" },
      { key: "fold-navy-blue", label: "Navy blue" },
    ],
    details: [
      { key: "fold-d1", title: "Buttery soft fabric", note: "lightweight & breathable" },
      { key: "fold-d2", title: "Fold over waistband", note: "flexible & flattering" },
      { key: "fold-d3", title: "Made to move", note: "nothing restrictive" },
      { key: "fold-d4", title: "Signature ooch logo", note: "centred on the back fold" },
    ],
    models: ["fold-m1"],
    specs: ["Fold over waistband", "Buttery soft jersey", "Lightweight and breathable",
            "Squat friendly", "For lounging, errands and everything", "Easy to style"],
  },
];

let LAYERS = [
  {
    id: "sstee", name: "Ooch short sleeve tee", tagline: "cute. comfy. effortless.",
    price: 49, cat: "tops", staple: true,
    colours: [
      { name: "Sky blue, white logo", hex: "#A8C8E8" },
      { name: "White, sky blue logo", hex: "#F7F7F5" },
    ],
    blurb: "A fitted short sleeve tee in premium cotton, soft and breathable, with the signature ooch script embroidered on the chest. Flattering crew neck, sleeves cut to the right length, and a slightly curved hem. Sky blue with a white logo, or white with a sky blue one.",
    views: [
      { key: "sst-blue-front", label: "Sky blue, front" },
      { key: "sst-blue-back", label: "Sky blue, back" },
      { key: "sst-white-front", label: "White, front" },
      { key: "sst-white-back", label: "White, back" },
    ],
    details: [
      { key: "sst-d1", title: "Signature cursive logo", note: "embroidered, not printed" },
      { key: "sst-d2", title: "Short sleeve", note: "the perfect length" },
      { key: "sst-d3", title: "Soft & breathable", note: "premium cotton" },
      { key: "sst-d4", title: "Flattering crew neck", note: "classic & comfy" },
      { key: "sst-d5", title: "Slightly curved hem", note: "for the perfect fit" },
    ],
    models: [],
    specs: ["Fitted short sleeve tee", "Embroidered ooch script", "Crew neckline",
            "Soft, breathable premium cotton", "Slightly curved hem",
            "Made to move with you", "Everyday essential"],
  },
  {
    id: "tubetop", name: "Ooch tube top", tagline: "effortless. cool. iconic.",
    price: 39, cat: "tops", staple: true,
    colours: [
      { name: "White", hex: "#F7F7F5" },
    ],
    blurb: "A strapless tube top in a premium cotton blend, 95% cotton and 5% elastane, so it stretches and stays where you put it. Elasticated top band, double stitched hems, and the ooch script embroidered on the back. Layer it or wear it on its own.",
    views: [
      { key: "tube-front", label: "Front" },
      { key: "tube-back", label: "Back" },
    ],
    details: [
      { key: "tube-d1", title: "Stay-put design", note: "elasticated top band" },
      { key: "tube-d2", title: "Soft & stretchy", note: "premium cotton blend" },
      { key: "tube-d3", title: "Embroidered logo", note: "ooch script on the back" },
      { key: "tube-d4", title: "Clean finish", note: "double stitched hems" },
      { key: "tube-fabric", title: "95% cotton, 5% elastane", note: "soft, breathable, light" },
    ],
    models: [],
    specs: ["Strapless tube top", "Embroidered logo on back", "Soft and breathable",
            "Stretchy, body-hugging fit", "Layer it or wear it solo",
            "Fits true to size", "Size down for a snugger fit"],
  },
  {
    id: "nettop", name: "Ooch net top", tagline: "see-through. sun-kissed. effortless.",
    price: 59, cat: "tops", limited: true,
    colours: [
      { name: "White", hex: "#F5F1E8" },
      { name: "Black", hex: "#141414" },
    ],
    blurb: "A see-through net knit made to go over your swimmers. Wide crew neckline, long slightly flared sleeves, a lettuce-edge hem and the ooch script embroidered at the back neck. 100% polyester, quick dry, light enough to wear all day in the sun.",
    views: [
      { key: "net-front", label: "Front" },
      { key: "net-back", label: "Back" },
    ],
    details: [
      { key: "net-d1", title: "Wide crew neckline", note: "layers over swimwear" },
      { key: "net-d2", title: "Embroidered logo", note: "ooch script at back neck" },
      { key: "net-d3", title: "Lightweight & breathable", note: "soft, airy knit" },
      { key: "net-d4", title: "Relaxed sleeve", note: "slightly flared" },
      { key: "net-d5", title: "Finished hem", note: "clean lettuce edge" },
      { key: "net-fabric", title: "100% polyester", note: "soft net knit, quick dry" },
    ],
    models: ["net-m1", "net-m2"],
    specs: ["See-through net knit", "Embroidered logo at back neck", "Long sleeves",
            "Relaxed, easy fit", "Perfect over swimwear",
            "Size down for a closer fit", "Size up for an oversized look"],
  },
  {
    id: "knit", name: "Fitted knit top", tagline: "cosy. feminine. timeless.",
    price: 95, cat: "tops", limited: true,
    colours: [{ name: "White", hex: "#F7F4EE" }],
    blurb: "A thick, fluffy wool knit with a wide boat neckline that sits right on the shoulders. Fitted through the body, extra long sleeves finished with a wide cuff, and a clean back with no embroidery. 80% wool, 20% nylon.",
    views: [
      { key: "knit-front", label: "Front" },
      { key: "knit-back", label: "Back" },
    ],
    details: [
      { key: "knit-d1", title: "Wide boat neckline", note: "sits on the shoulders" },
      { key: "knit-d2", title: "Thick & fluffy wool knit", note: "heavyweight, for warmth" },
      { key: "knit-d3", title: "No back embroidery", note: "clean and minimal" },
      { key: "knit-d4", title: "Wide sleeve cuff", note: "extra long sleeves" },
      { key: "knit-fabric", title: "80% wool, 20% nylon", note: "extra thick, warm & fluffy" },
    ],
    models: ["knit-m1", "knit-m2"],
    specs: ["Long sleeve knitted top", "Thick wool knit stitch", "Wide sleeve cuff",
            "Fitted and flattering shape", "No embroidery at back",
            "Fits true to size", "Size up for a more relaxed fit"],
  },
  {
    id: "offshoulder", name: "Ooch off-shoulder long sleeve top",
    tagline: "soft. feminine. effortless.", price: 65, cat: "tops", limited: true,
    colours: [
      { name: "Sky blue / White", hex: "linear-gradient(180deg,#7EA8DC 50%,#FFFFFF 50%)" },
      { name: "White / Sky blue", hex: "linear-gradient(180deg,#FFFFFF 50%,#7EA8DC 50%)" },
    ],
    blurb: "A layering-inspired shape that feels like a soft hug. The off-shoulder overlay adds dimension, the fitted long sleeve base keeps it comfortable, and it ties in a bow at the back. Cosy days or dressed-up nights.",
    views: [
      { key: "top-front", label: "Front" },
      { key: "top-back", label: "Back" },
      { key: "top-layer", label: "Double layer" },
    ],
    details: [
      { key: "top-d1", title: "Off-shoulder overlay", note: "feminine & elegant" },
      { key: "top-d2", title: "Tie-back detail", note: "adjustable & flattering" },
      { key: "top-d3", title: "Soft & stretchy", note: "ribbed for comfort" },
      { key: "top-d4", title: "Long sleeves", note: "snug & cosy fit" },
      { key: "top-d5", title: "Ooch logo", note: "subtle & signature" },
    ],
    models: ["top-m1", "top-m2", "top-m3", "top-m4"],
    specs: ["Off-shoulder overlay", "Long sleeves", "Tie-back design", "Fitted silhouette",
            "Soft ribbed fabric", "Embroidered logo"],
  },
  {
    id: "trackpant", name: "Piped track pant", tagline: "soft. flowy. effortless.",
    price: 79, cat: "bottoms", limited: true,
    colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Sky blue", hex: "#7EA8DC" },
    ],
    blurb: "Built for all-day comfort with a relaxed, flattering fit. Elastic waist with an adjustable drawstring, contrast piping down the leg, side pockets, and a wide leg that moves with you. The match for the off-shoulder top.",
    views: [
      { key: "pants-front", label: "Front" },
      { key: "pants-back", label: "Back" },
      { key: "pants-waist", label: "Waistband" },
    ],
    details: [
      { key: "pants-d1", title: "Adjustable waist", note: "custom fit, all-day comfort" },
      { key: "pants-d2", title: "Side pockets", note: "deep enough to use" },
      { key: "pants-d3", title: "Wide leg fit", note: "flowy & flattering" },
      { key: "pants-d4", title: "Contrast piping", note: "subtle detail, elevated look" },
    ],
    models: ["pants-m1", "pants-m2", "pants-m3", "pants-m4"],
    specs: ["Elastic waistband", "Adjustable drawstring", "Contrast piping",
            "Wide leg fit", "Side pockets", "Soft and breathable fabric"],
  },
];

let BIKINI_FEATURE = {
  id: "bikini-feature", name: "The ooch bikini", tagline: "minimal. effortless. iconic.",
  price: 79, cat: "swim",
  colours: [
    { name: "Sky blue", hex: "#A8C8E8" },
    { name: "White", hex: "#F2F2EF" },
  ],
  blurb: "Classic triangle top with adjustable neck and back ties, and tie-side bottoms in medium coverage. Soft, smooth and quick dry in 80% nylon, 20% spandex, with the ooch script embroidered small on the back. Two colours, our signature sky blue and white.",
  views: [
    { key: "bikini-front-sky-blue", label: "Sky blue, front" },
    { key: "bikini-back-sky-blue", label: "Sky blue, back" },
    { key: "bikini-front-white", label: "White, front" },
    { key: "bikini-back-white", label: "White, back" },
  ],
  details: [
    { key: "bk-blue-top-1", title: "Triangle top", note: "sky blue, front" },
    { key: "bk-blue-top-2", title: "Neck & back ties", note: "fully adjustable" },
    { key: "bk-blue-btm-1", title: "Tie side bottoms", note: "sky blue" },
    { key: "bk-blue-btm-2", title: "Embroidered logo", note: "ooch script" },
    { key: "bk-white-top-1", title: "Triangle top", note: "white, front" },
    { key: "bk-white-top-2", title: "Neck & back ties", note: "fully adjustable" },
    { key: "bk-white-btm-1", title: "Tie side bottoms", note: "white" },
    { key: "bk-white-btm-2", title: "Embroidered logo", note: "ooch script" },
    { key: "bk-fabric", title: "80% nylon, 20% spandex", note: "soft, smooth & quick dry" },
  ],
  models: [],
  specs: ["Classic triangle top", "Adjustable neck and back ties", "Tie side bottoms",
          "Medium coverage", "Soft and stretchy", "Embroidered logo detail",
          "True to size", "Size up if in between"],
};

let SETS = [
  { id: "beach", name: "The beach set", fixed: true,
    colourNote: "Net top in white, bikini in sky blue",
    blurb: "The net top thrown over the ooch bikini. Wear it in, wear it out, no changing needed.",
    items: [
      { img: "net-front", name: "Ooch net top", price: 59 },
      { img: "bikini-front-sky-blue", name: "Ooch bikini", price: 79 },
    ] },
  { id: "offshoulder", name: "The off-shoulder set", fixed: true,
    colourNote: "Sky blue and white",
    blurb: "The off-shoulder long sleeve with the piped track pant that was made to go with it. The piping down the leg picks up the blue in the top.",
    items: [
      { img: "top-front", name: "Off-shoulder long sleeve top", price: 65 },
      { img: "pants-front", name: "Piped track pant", price: 79 },
    ] },
  { id: "classic", name: "The classic set",
    blurb: "The zip-thru hoodie with the wide trackie that matches it exactly. Same fabric, same blue.",
    items: [
      { prefix: "hoodie", name: "Classic zip-thru hoodie", price: 115 },
      { prefix: "pant", name: "Classic wide trackie", price: 99 },
    ] },
  { id: "skortset", name: "The skort set",
    blurb: "Scoop back singlet with the pleated skort and its satin bow. Straps sit wide, so nothing shows.",
    items: [
      { prefix: "singlet-front", name: "Scoop back singlet", price: 49 },
      { prefix: "skort", name: "Mini skort", price: 75 },
    ] },
  { id: "relaxed", name: "The relaxed set", fixed: true,
    colourNote: "Sky blue, with white piping",
    blurb: "The relaxed short with the everyday tee, the mini tote and a twist headband. All on the same blue, nothing to think about.",
    items: [
      { img: "relaxed-front", name: "Ooch relaxed short", price: 55 },
      { img: "tee-sky-blue", name: "Everyday tee", price: 55 },
    ],
    choice: {
      label: "Add a headband",
      optional: true,
      options: [
        { img: "band-twist-sky-blue", name: "Twist headband", price: 20, label: "Twist" },
        { img: "band-bow-sky-blue", name: "Bow headband", price: 20, label: "Bow" },
        { img: "band-skinny-sky-blue", name: "Skinny headband", price: 15, label: "Skinny" },
        { img: "band-wide-sky-blue", name: "Wide headband", price: 20, label: "Wide" },
      ],
    } },
];

let CATEGORIES = [
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "dresses", label: "Dresses" },
  { key: "swim", label: "Swim" },
  { key: "accessories", label: "Accessories" },
];
let TICKER = ["AUSTRALIAN OWNED", "DESIGNED FOR EVERYONE", "LIMITED EDITION ITEMS", "MUST HAVE STAPLES"];

let QUESTIONS = [
  { key: "priority", text: "What do you put first?", options: [
      { value: "comfort", label: "Comfort", sub: "Soft, easy, all day" },
      { value: "style",   label: "Style",   sub: "Put together, always" } ] },
  { key: "season", text: "What do you like better?", options: [
      { value: "winter", label: "Winter", sub: "Layers and long sleeves" },
      { value: "summer", label: "Summer", sub: "Light and bare arms" } ] },
];

/* ART_BY_NAME — 2026-08-10. These four quiz items used to hold a React COMPONENT
   directly (art: Shorts). DEFAULT_CONTENT is snapshotted with JSON.stringify for
   the admin, and JSON SILENTLY DROPS FUNCTION VALUES — so the admin read them
   back without their art and posted that document on any save, and the renderer
   then did <undefined/> and unmounted the whole app: a white page on three of
   the four quiz outcomes, triggered by pressing Save with no edits at all.
   Referring to the component BY NAME survives the round trip and makes the field
   editable in the console like any other string. */
const ART_BY_NAME = { Shorts, CropTop, FlowyTop, Blazer };

let RESULTS = {
  "comfort-winter": { name: "Cosy season",
    blurb: "Hoodies you live in and tracksuit pants that go everywhere. Warm, soft, zero effort.",
    items: [
      { name: "Classic zip-thru hoodie", price: 115, img: "hoodie-sky-blue" },
      { name: "Zip-thru in navy", price: 115, img: "hoodie-navy-blue" },
      { name: "Classic wide trackie", price: 99, img: "pant-sky-blue" },
      { name: "Wide trackie in navy", price: 99, img: "pant-navy-blue" },
    ] },
  "comfort-summer": { name: "Easy and loose",
    blurb: "Nothing clinging, nothing fussy. Loose tees with roomy shorts, skirts and skorts.",
    items: [
      { name: "Everyday tee", price: 55, img: "tee-baby-blue" },
      { name: "Everyday tee in cornflower", price: 55, img: "tee-cornflower" },
      { name: "Relaxed short", price: 40, artName: "Shorts" },
      { name: "Mini skort", price: 75, img: "skort-baby-blue" },
    ] },
  "style-summer": { name: "Summer statement",
    blurb: "Crop tops and flowy one-off tops, with mini shorts, skirts and skorts to match.",
    items: [
      { name: "Crop top", price: 34, artName: "CropTop" },
      { name: "Flowy top", price: 44, artName: "FlowyTop" },
      { name: "Mini skort", price: 75, img: "skort-navy-blue" },
      { name: "Bow headband", price: 20, img: "band-bow-baby-blue" },
    ] },
  "style-winter": { name: "Sharp and layered",
    blurb: "The fitted knit top under a proper jacket, finished with the tailored pant. Warm, but still put together.",
    items: [
      { name: "Fitted knit top", price: 95, img: "knit-front" },
      { name: "Knit top, back", price: 95, img: "knit-back" },
      { name: "Tailored jacket", price: 118, artName: "Blazer" },
      { name: "Ooch tailored pant", price: 129, img: "dp-black-front" },
    ] },
};

let BG = ["#E4F2FC", "#BFE1F6", "#F5FBFF", "#E4F2FC"];

/* ---------------- colour slider ---------------- */
function Showcase({ product, saved, onSave, onAdd }) {
  const PAL = product.colours || COLOURS;
  const [i, setI] = useState(0);
  const [style, setStyle] = useState(product.styles ? product.styles[0].key : product.prefix);
  const [size, setSize] = useState("M");
  const c = PAL[i];
  const go = (d) => setI((n) => (n + d + PAL.length) % PAL.length);
  const styleLabel = product.styles ? product.styles.find((s) => s.key === style).label : null;

  return (
    <div className="show">
      <div className="stage">
        {PAL.map((col, n) => (
          <img key={col.key} src={IMG[`${style}-${col.key}`]}
               alt={`${product.name} in ${col.name}`} className={n === i ? "on" : ""} />
        ))}
        <button className="heart" onClick={() => onSave(product.id, product.name)}
                aria-pressed={!!saved[product.id]} aria-label={`Save ${product.name}`}>
          <HeartIcon filled={!!saved[product.id]} />
        </button>
        <button className="arrow l" onClick={() => go(-1)} aria-label="Previous colour">‹</button>
        <button className="arrow r" onClick={() => go(1)} aria-label="Next colour">›</button>
        <div className="slidedots" aria-hidden="true">
          {PAL.map((col, n) => <span key={col.key} className={`slidedot ${n === i ? "on" : ""}`} />)}
        </div>
      </div>

      <div className="sinfo">
        <div className="stitle">
          <h3>{product.name}</h3>
          <span className="price">${product.price}</span>
        </div>
        <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.45, fontSize: 15 }}>{product.blurb}</p>

        {product.styles && (
          <div className="stylechips" role="group" aria-label="Choose a shape">
            {product.styles.map((s) => (
              <button key={s.key} className="stylechip" aria-pressed={style === s.key}
                      onClick={() => setStyle(s.key)}>{s.label}</button>
            ))}
          </div>
        )}

        <p className="cname" style={{ margin: 0 }}>{c.name} <span>· {c.note}</span></p>
        <div className="swrow" role="group" aria-label="Choose a colour">
          {PAL.map((col, n) => (
            <button key={col.key} className="swbtn" style={{ background: col.hex }}
                    aria-pressed={n === i} aria-label={col.name} onClick={() => setI(n)} />
          ))}
        </div>

        {product.sizes && (
          <div className="sizerow" role="group" aria-label="Choose a size">
            {SIZES.map((s) => (
              <button key={s} className="szbtn" aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        )}

        <button className="btn btn-solid"
                onClick={() => onAdd([product.name, styleLabel, c.name, product.sizes ? size : null]
                                     .filter(Boolean).join(" · "), product.price)}>
          Add to bag
        </button>
      </div>
    </div>
  );
}

function Dress({ dress, saved, onSave, onAdd }) {
  const [v, setV] = useState(0);
  const [size, setSize] = useState("M");
  const [box, setBox] = useState(null);
  const gallery = [...dress.views.map((x) => ({ key: x.key, cap: x.label })),
                   ...dress.details.map((d) => ({ key: d.key, cap: d.title })),
                   ...dress.models.map((m, i) => ({ key: m, cap: `Worn ${i + 1}` }))];

  useEffect(() => {
    if (box === null) return;
    const key = (e) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") setBox((n) => (n + 1) % gallery.length);
      if (e.key === "ArrowLeft") setBox((n) => (n - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [box, gallery.length]);

  return (
    <div className="dress">
      <div className="dhead">
        <span className="dname">{dress.name}</span>
        {dress.tagline && <p className="dtag">{dress.tagline}</p>}
      </div>

      <div className="dmain">
        <div className="dstage" role="button" tabIndex={0} aria-label="Open the photo larger"
             onClick={() => setBox(v)}
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setBox(v)}>
          {dress.views.map((s, n) => (
            <img key={s.key} src={IMG[s.key]} alt={`${dress.name}, ${s.label.toLowerCase()}`}
                 className={n === v ? "on" : ""} />
          ))}
          <button className="heart" onClick={(e) => { e.stopPropagation(); onSave(dress.id, dress.name); }}
                  aria-pressed={!!saved[dress.id]} aria-label={`Save the ${dress.name}`}>
            <HeartIcon filled={!!saved[dress.id]} />
          </button>
          <span className="stagehint">Tap to enlarge</span>
        </div>

        <div className="thumbs" role="group" aria-label="Choose a view">
          {dress.views.map((s, n) => (
            <button key={s.key} className="thumb" aria-pressed={n === v}
                    aria-label={s.label} onClick={() => setV(n)}>
              <img src={IMG[s.key]} alt="" />
            </button>
          ))}
        </div>
        <p className="viewname">{dress.views[v].label}</p>
      </div>

      <p className="dblurb">{dress.blurb}</p>

      <div className="dsizes" role="group" aria-label="Choose a size">
        {(dress.sizeList || SIZES).map((s) => (
          <button key={s} className="szbtn" aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>
        ))}
      </div>

      <div className="dbuy">
        <span className="price" style={{ fontSize: 24 }}>${dress.price}</span>
        <button className="btn btn-solid" onClick={() => onAdd(`${dress.name} · ${size}`, dress.price)}>Add to bag</button>
      </div>

      <div className="dcolours">
        {(dress.colours || DRESS_COLOURS).map((c) => (
          <span className="dcol" key={c.name}><i style={{ background: c.hex }} />{c.name}</span>
        ))}
      </div>

      <div className="dgridwrap">
        <div className="dgrid">
          {dress.details.map((d, n) => (
            <button className="dtile" key={d.key}
                    onClick={() => setBox(dress.views.length + n)}
                    aria-label={`Open photo: ${d.title}`}>
              <img src={IMG[d.key]} alt={d.title} />
              <strong>{d.title}</strong>
              <span>{d.note}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="dspecs">
        {dress.specs.map((s) => <li key={s}>{s}</li>)}
      </ul>

      {dress.models.length > 0 && (
      <div className="worn">
        <h4>See it on</h4>
        <p className="sml">Tap any photo to open it full size</p>
        <div className="models" style={{ gridTemplateColumns: `repeat(${dress.models.length}, 1fr)`, maxWidth: dress.models.length === 1 ? 320 : 760 }}>
          {dress.models.map((m, n) => (
            <button key={m} onClick={() => setBox(dress.views.length + dress.details.length + n)}
                    aria-label={`Open worn photo ${n + 1}`}>
              <img src={IMG[m]} alt={`${dress.name} worn`} />
              <span className="zoom" aria-hidden="true">⤢</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {box !== null && (
        <div className="lbox" role="dialog" aria-modal="true" aria-label={`${dress.name} photo`}
             onClick={(e) => e.target === e.currentTarget && setBox(null)}>
          <button className="lbclose" onClick={() => setBox(null)}>Close</button>
          <img src={IMG[gallery[box].key]} alt={`${dress.name}, ${gallery[box].cap.toLowerCase()}`} />
          <div className="lbrow">
            <button className="lbbtn" aria-label="Previous photo"
                    onClick={() => setBox((n) => (n - 1 + gallery.length) % gallery.length)}>‹</button>
            <span className="lbcap">{gallery[box].cap} · {box + 1} of {gallery.length}</span>
            <button className="lbbtn" aria-label="Next photo"
                    onClick={() => setBox((n) => (n + 1) % gallery.length)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SetCard({ set, onAdd }) {
  const [i, setI] = useState(1);            // sky blue by default
  const [extra, setExtra] = useState(set.choice ? 0 : null);
  const c = COLOURS[i];
  const chosen = set.choice && extra !== null ? set.choice.options[extra] : null;
  const items = chosen ? [...set.items, chosen] : set.items;
  const full = items.reduce((t, it) => t + it.price, 0);
  const now = Math.round(full * 0.9);

  return (
    <div className="setcard">
      <div className={`setpics n${items.length}`}>
        {items.map((it) => (
          <div className="setpic" key={it.img || it.prefix}>
            <img src={IMG[set.fixed ? it.img : `${it.prefix}-${c.key}`]}
                 alt={set.fixed ? it.name : `${it.name} in ${c.name}`} />
            <span>{it.name}</span>
          </div>
        ))}
      </div>
      <div className="setinfo">
        <h3>{set.name}</h3>
        <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.45, fontSize: 15 }}>{set.blurb}</p>

        {set.fixed ? (
          <p className="cname" style={{ margin: 0 }}>{set.colourNote}</p>
        ) : (
          <>
            <p className="cname" style={{ margin: 0 }}>{c.name} <span>· {c.note}</span></p>
            <div className="swrow" role="group" aria-label="Choose a colour for the set">
              {COLOURS.map((col, n) => (
                <button key={col.key} className="swbtn" style={{ background: col.hex }}
                        aria-pressed={n === i} aria-label={col.name} onClick={() => setI(n)} />
              ))}
            </div>
          </>
        )}

        {set.choice && (
          <>
            <p className="cname" style={{ margin: "4px 0 0" }}>{set.choice.label}</p>
            <div className="stylechips" role="group" aria-label={set.choice.label}>
              {set.choice.options.map((o, n) => (
                <button key={o.name} className="stylechip" aria-pressed={extra === n}
                        onClick={() => setExtra(n)}>{o.label}</button>
              ))}
              {set.choice.optional && (
                <button className="stylechip" aria-pressed={extra === null}
                        onClick={() => setExtra(null)}>No thanks</button>
              )}
            </div>
          </>
        )}

        <ul className="setpieces">
          {items.map((it) => (
            <li key={it.img || it.prefix}><span>{it.name}</span> ${it.price}</li>
          ))}
        </ul>

        <div className="setprice">
          <span className="now">${now}</span>
          <span className="was">${full}</span>
          <span className="save">Save ${full - now}</span>
        </div>

        <button className="btn btn-solid"
                onClick={() => onAdd(set.fixed ? set.name : `${set.name} · ${c.name}`, now, items.length)}>
          Add the set to bag
        </button>
      </div>
    </div>
  );
}

let SIZE_CHART = [
  { au: "4",  label: "2XS", bust: 76, waist: 60, hip: 81 },
  { au: "6",  label: "XS", bust: 78, waist: 63, hip: 86 },
  { au: "8",  label: "S",  bust: 83, waist: 68, hip: 91 },
  { au: "10", label: "M",  bust: 88, waist: 73, hip: 96 },
  { au: "12", label: "L",  bust: 93, waist: 78, hip: 101 },
  { au: "14", label: "XL", bust: 98, waist: 83, hip: 106 },
];

function SizeGuide() {
  const [i, setI] = useState(3);
  const s = SIZE_CHART[i];
  return (
    <div className="sizeguide">
      <div className="sghead">
        <span className="sgtitle">Find your size</span>
        <p>Australian sizing, measured on the body in centimetres.</p>
      </div>

      <div className="sgchips" role="group" aria-label="Choose a size">
        {SIZE_CHART.map((row, n) => (
          <button key={row.au} className="sgchip" aria-pressed={n === i} onClick={() => setI(n)}>
            <strong>{row.au}</strong><span>{row.label}</span>
          </button>
        ))}
      </div>

      <div className="sgstats">
        <div className="sgstat"><span>Bust</span><strong>{s.bust}</strong><i>cm</i></div>
        <div className="sgstat"><span>Waist</span><strong>{s.waist}</strong><i>cm</i></div>
        <div className="sgstat"><span>Hip</span><strong>{s.hip}</strong><i>cm</i></div>
      </div>

      <div className="sgtablewrap">
        <table className="sgtable">
          <thead>
            <tr>
              <th>Size</th>
              {SIZE_CHART.map((r) => <th key={r.au} className={r.au === s.au ? "on" : ""}>{r.au}</th>)}
            </tr>
            <tr>
              <th></th>
              {SIZE_CHART.map((r) => <th key={r.au} className={`sub ${r.au === s.au ? "on" : ""}`}>{r.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {["bust", "waist", "hip"].map((k) => (
              <tr key={k}>
                <th scope="row">{k[0].toUpperCase() + k.slice(1)}</th>
                {SIZE_CHART.map((r) => (
                  <td key={r.au} className={r.au === s.au ? "on" : ""}>{r[k]}cm</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="sgtip">Between two sizes? Take the bigger one — everything shrinks about 2% on the first wash, and returns are free for 30 days.</p>
    </div>
  );
}

function Drawer({ title, note, children, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="drawerscrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawertop">
          <div>
            <h3>{title}</h3>
            {note && <p>{note}</p>}
          </div>
          <button className="btn btn-soft" onClick={onClose}>Close</button>
        </div>
        <div className="drawerbody">{children}</div>
      </aside>
    </div>
  );
}

function CatalogueSheet({ title, note, banner, chips, cat, onCat, photos, features,
                          grid, onClose, saved, onSave, onAdd }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const empty = photos.length === 0 && features.length === 0 && grid.length === 0;

  return (
    <div className="setsheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="setstop">
        <h2>{title}</h2>
        {note && <p style={{ margin: 0, fontWeight: 600, color: "var(--deep)" }}>{note}</p>}
        <button className="btn btn-soft" style={{ marginLeft: "auto" }} onClick={onClose}>Close</button>
      </div>

      <div className="cataloguewrap">
        {banner && (
          <div className="limitedhead">
            <span className="limitedtag">Limited pieces</span>
            <h2>Made once</h2>
            <p>Small runs in one colourway. When they sell out they don't come back.</p>
          </div>
        )}

        {chips && (
          <div className="catrow" role="group" aria-label="Shop by category">
            <button className="chip" aria-pressed={cat === null} onClick={() => onCat(null)}>Everything</button>
            {CATEGORIES.map((c) => (
              <button key={c.key} className="chip" aria-pressed={cat === c.key}
                      onClick={() => onCat(c.key)}>{c.label}</button>
            ))}
          </div>
        )}

        {empty ? (
          <div className="emptycat">
            <h3>Nothing here yet</h3>
            <p>These land in a future drop. Sign up and you'll hear first.</p>
            <button className="btn btn-solid" onClick={onClose}>Back to the site</button>
          </div>
        ) : (
          <>
            {photos.length > 0 && (
              <div className="shows">
                {photos.map((p) => (
                  <Showcase key={p.id} product={p} saved={saved} onSave={onSave} onAdd={onAdd} />
                ))}
              </div>
            )}

            {features.map((d) => (
              <Dress key={d.id} dress={d} saved={saved} onSave={onSave} onAdd={onAdd} />
            ))}

            {grid.length > 0 && (
              <div className="grid" style={{ marginTop: 18 }}>
                {grid.map((p) => (
                  <article className="card" key={p.id}>
                    <div className="art" style={{ background: p.img ? "#F2F1EF" : p.bg }}>
                      <span className="badge">{p.badge}</span>
                      <button className="heart" onClick={() => onSave(p.id, p.name)}
                              aria-pressed={!!saved[p.id]} aria-label={`Save ${p.name}`}>
                        <HeartIcon filled={!!saved[p.id]} />
                      </button>
                      {p.img && <img src={IMG[p.img]} alt={p.name} />}
                    </div>
                    <div className="pmeta">
                      <div className="prow">
                        <span className="pname">{p.name}</span>
                        <span className="price">${p.price}</span>
                      </div>
                      <div className="prow">
                        <div className="swatches">
                          {p.sw.map((c, i) => <span className="sw" key={i} style={{ background: c }} />)}
                        </div>
                        <span className="loves">♡ {p.loves}</span>
                      </div>
                      <button className="addbtn" onClick={() => onAdd(p.name, p.price)}>Add to bag</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SetsSheet({ onClose, onAdd }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="setsheet" role="dialog" aria-modal="true" aria-label="Sets">
      <div className="setstop">
        <h2>Sets</h2>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--deep)" }}>Whole outfits, 10% off</p>
        <button className="btn btn-soft" style={{ marginLeft: "auto" }} onClick={onClose}>Close</button>
      </div>
      <div className="setswrap">
        {SETS.map((s) => <SetCard key={s.id} set={s} onAdd={onAdd} />)}
      </div>
    </div>
  );
}

let SIG_VIEWS = [
  { key: "sig-front",  label: "Front" },
  { key: "sig-back",   label: "Back" },
  { key: "sig-hood",   label: "Hood" },
  { key: "sig-fabric", label: "Fabric" },
  { key: "sig-logo",   label: "Logo" },
];

let MODELS = [
  { key: "sig-model-1", cap: "Worn, front" },
  { key: "sig-model-2", cap: "Worn, back" },
  { key: "sig-model-3", cap: "Worn with the pant" },
];

let GALLERY = [
  ...SIG_VIEWS.map((s) => ({ key: s.key, cap: s.label })),
  ...MODELS,
];

function Signature({ onAdd, saved, onSave }) {
  const [v, setV] = useState(0);
  const [size, setSize] = useState("M");
  const [box, setBox] = useState(null);

  useEffect(() => {
    if (box === null) return;
    const key = (e) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") setBox((n) => (n + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setBox((n) => (n - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [box]);

  return (
    <div className="sig">
      <div className="sighead">
        <span className="sigtitle">The ooch cloud hoodie</span>
        <p className="sigsub">Sky blue, with the white ooch logo embroidered on the chest.</p>
      </div>

      <div className="sigmain">
        <div className="sigstage" onClick={() => setBox(v)} role="button" tabIndex={0}
             aria-label="Open the photo larger"
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setBox(v)}>
          {SIG_VIEWS.map((s, n) => (
            <img key={s.key} src={IMG[s.key]} alt={`Cloud hoodie, ${s.label.toLowerCase()}`}
                 className={n === v ? "on" : ""} />
          ))}
          <button className="heart" onClick={(e) => { e.stopPropagation(); onSave("sig", "The ooch cloud hoodie"); }}
                  aria-pressed={!!saved.sig} aria-label="Save the ooch cloud hoodie">
            <HeartIcon filled={!!saved.sig} />
          </button>
          <span className="stagehint">Tap to enlarge</span>
        </div>

        <div className="thumbs" role="group" aria-label="Choose a view">
          {SIG_VIEWS.map((s, n) => (
            <button key={s.key} className="thumb" aria-pressed={n === v}
                    aria-label={s.label} onClick={() => setV(n)}>
              <img src={IMG[s.key]} alt="" />
            </button>
          ))}
        </div>
        <p className="viewname">{SIG_VIEWS[v].label}</p>

        <div className="dsizes" role="group" aria-label="Choose a size">
          {SIZES.map((s) => (
            <button key={s} className="szbtn" aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>
          ))}
        </div>

        <div className="sigbuy">
          <span className="price" style={{ fontSize: 24 }}>$115</span>
          <button className="btn btn-solid"
                  onClick={() => onAdd(`The ooch cloud hoodie · Sky blue · ${size}`, 115)}>
            Add to bag
          </button>
          <button className="btn btn-soft"
                  onClick={() => onAdd(`Matching track pant · Sky blue · ${size}`, 99)}>
            Add the matching pant
          </button>
        </div>
      </div>

      <div className="feats">
        <div className="feat">Ultra soft<span>cloud feel</span></div>
        <div className="feat">Cosy and warm<span>still breathable</span></div>
        <div className="feat">Everyday comfort<span>wears in, not out</span></div>
        <div className="feat">Clean and minimal<span>one small logo</span></div>
      </div>

      <ul className="dets">
        <li>Relaxed fit, slightly shaped through the body</li>
        <li>Ribbed cuffs and hem</li>
        <li>Double lined hood</li>
        <li>Embroidered logo, not printed</li>
      </ul>

      <div className="worn">
        <h4>See it on</h4>
        <p className="sml">Tap any photo to open it full size</p>
        <div className="models">
          {MODELS.map((m, n) => (
            <button key={m.key} onClick={() => setBox(SIG_VIEWS.length + n)}
                    aria-label={`Open photo: ${m.cap}`}>
              <img src={IMG[m.key]} alt={`Cloud hoodie worn, ${m.cap.toLowerCase()}`} />
              <span className="mcap">{m.cap}</span>
              <span className="zoom" aria-hidden="true">⤢</span>
            </button>
          ))}
        </div>
      </div>

      {box !== null && (
        <div className="lbox" role="dialog" aria-modal="true" aria-label="Cloud hoodie photo"
             onClick={(e) => e.target === e.currentTarget && setBox(null)}>
          <button className="lbclose" onClick={() => setBox(null)}>Close</button>
          <img src={IMG[GALLERY[box].key]} alt={`Cloud hoodie, ${GALLERY[box].cap.toLowerCase()}`} />
          <div className="lbrow">
            <button className="lbbtn" aria-label="Previous photo"
                    onClick={() => setBox((n) => (n - 1 + GALLERY.length) % GALLERY.length)}>‹</button>
            <span className="lbcap">{GALLERY[box].cap} · {box + 1} of {GALLERY.length}</span>
            <button className="lbbtn" aria-label="Next photo"
                    onClick={() => setBox((n) => (n + 1) % GALLERY.length)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */
/* ==================================================================
   CONTENT OVERRIDES — added 2026-08-10 for the admin console.
   ------------------------------------------------------------------
   Everything the site renders from is declared above as plain data.
   Those declarations are now `let` rather than `const` so the admin's
   saved content can replace them at boot, before the first render —
   no rebuild, no redeploy, no touching this file to change a price.

   DEFAULTS are snapshotted HERE, after every declaration and before
   any override can run, so "reset to original" always has something
   true to reset to. Deep-cloned: a shallow copy would hand the admin
   a reference to the live data and edits would leak into the default.

   Anything derived must be RECOMPUTED after an override, not copied:
   FIVE_BLUES comes from COLOURS, GALLERY from SIG_VIEWS + MODELS. And
   any product marked coloursFollowPalette re-points at the new blues,
   otherwise editing the palette would leave that product on a stale copy.
   ================================================================== */
const clone = (v) => JSON.parse(JSON.stringify(v));

export const DEFAULT_CONTENT = clone({
  IMG, COLOURS, SIZES, PHOTO_PRODUCTS, PRODUCTS, DRESSES, DRESS_COLOURS,
  DENIM_COLOURS, SHORTS, LAYERS, BIKINI_FEATURE, SETS, CATEGORIES, TICKER,
  QUESTIONS, RESULTS, SIZE_CHART, SIG_VIEWS, MODELS, BG,
});

/* The order matters: assign the raw structures first, then rebuild everything
   that is computed from them. */
export function applyContent(doc) {
  if (!doc || typeof doc !== "object") return false;
  const set = (k, fn) => { if (doc[k] !== undefined && doc[k] !== null) fn(doc[k]); };

  set("IMG", (v) => { IMG = v; });
  set("COLOURS", (v) => { COLOURS = v; });
  set("SIZES", (v) => { SIZES = v; });
  set("PHOTO_PRODUCTS", (v) => { PHOTO_PRODUCTS = v; });
  set("PRODUCTS", (v) => { PRODUCTS = v; });
  set("DRESSES", (v) => { DRESSES = v; });
  set("DRESS_COLOURS", (v) => { DRESS_COLOURS = v; });
  set("DENIM_COLOURS", (v) => { DENIM_COLOURS = v; });
  set("SHORTS", (v) => { SHORTS = v; });
  set("LAYERS", (v) => { LAYERS = v; });
  set("BIKINI_FEATURE", (v) => { BIKINI_FEATURE = v; });
  set("SETS", (v) => { SETS = v; });
  set("CATEGORIES", (v) => { CATEGORIES = v; });
  set("TICKER", (v) => { TICKER = v; });
  set("QUESTIONS", (v) => { QUESTIONS = v; });
  set("RESULTS", (v) => { RESULTS = v; });
  set("SIZE_CHART", (v) => { SIZE_CHART = v; });
  set("SIG_VIEWS", (v) => { SIG_VIEWS = v; });
  set("MODELS", (v) => { MODELS = v; });
  set("BG", (v) => { BG = v; });

  /* ---- derived, always rebuilt ---- */
  FIVE_BLUES = (COLOURS || []).map((c) => ({ name: c.name, hex: c.hex }));
  GALLERY = [
    ...(SIG_VIEWS || []).map((s) => ({ key: s.key, cap: s.label })),
    ...(MODELS || []),
  ];
  const follow = (list) => (list || []).map((it) =>
    it && it.coloursFollowPalette ? { ...it, colours: FIVE_BLUES } : it);
  SHORTS = follow(SHORTS);
  LAYERS = follow(LAYERS);
  return true;
}

export default function Ooch() {
  const [saved, setSaved] = useState({});
  const [bag, setBag] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [page, setPage] = useState(null);   // {kind:'shop'|'staples'|'limited', cat}
  const [cat, setCat] = useState(null);
  const [auth, setAuth] = useState(false);
  const [sets, setSets] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mail, setMail] = useState("");
  const [toast, setToast] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const closeRef = useRef(null);
  const quizRef = useRef(null);
  const sizeRef = useRef(null);

  const openShop = (key) => { setMenu(false); setCat(key); setPage({ kind: "shop" }); };
  const goSizeGuide = () => {
    setPage(null); setSets(false); setBagOpen(false); setSavedOpen(false); setMenu(false);
    setTimeout(() => sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const FEATURED = [...LAYERS, ...DRESSES, ...SHORTS];
  const inCat = (x) => !cat || x.cat === cat;
  const pick = (list) =>
    !page ? [] :
    page.kind === "staples" ? list.filter((x) => x.staple) :
    page.kind === "limited" ? list.filter((x) => x.limited) :
    list.filter(inCat);
  const catLabel = cat ? CATEGORIES.find((x) => x.key === cat).label : null;
  const pageTitle = !page ? "" :
    page.kind === "staples" ? "Our staples" :
    page.kind === "limited" ? "Limited pieces" :
    catLabel || "Everything";
  const pageNote = !page ? "" :
    page.kind === "staples" ? "The core range, in every blue" :
    page.kind === "limited" ? "Small runs, one colourway" : "";

  useEffect(() => {
    if (!auth) return;
    closeRef.current?.focus();
    const esc = (e) => e.key === "Escape" && setAuth(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [auth]);

  const ping = (m) => { setToast(m); setTimeout(() => setToast(""), 1700); };
  const savedCount = Object.values(saved).filter(Boolean).length;
  const toggleSave = (id, name) => {
    setSaved((s) => ({ ...s, [id]: s[id] ? false : name }));
    ping(saved[id] ? `${name} removed from saved` : `${name} saved`);
  };
  const addToBag = (label, price = 0, pieces = 1) => {
    setBag((b) => [...b, { key: `${label}-${Date.now()}-${b.length}`, label, price, pieces }]);
    ping(`${label} added to bag`);
  };
  const removeFromBag = (key) => setBag((b) => b.filter((x) => x.key !== key));
  const bagCount = bag.reduce((t, x) => t + x.pieces, 0);
  const bagTotal = bag.reduce((t, x) => t + x.price, 0);

  const startQuiz = () => {
    setAnswers({}); setStep(1);
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const answer = (key, value) => { setAnswers((a) => ({ ...a, [key]: value })); setStep((s) => s + 1); };
  const result = RESULTS[`${answers.priority}-${answers.season}`];

  return (
    <div className="ooch">
      <style>{CSS}</style>

      <div className="strip">
        <div className="strip-inner" aria-hidden="true">
          {[...TICKER, ...TICKER].map((t, i) => <span key={i}>{t} ✿</span>)}
        </div>
      </div>

      <nav className="nav">
        <button className="menubtn" onClick={() => setMenu((m) => !m)}
                aria-expanded={menu} aria-label={menu ? "Close menu" : "Open menu"}>
          <span className={`burger ${menu ? "x" : ""}`} aria-hidden="true"><i /><i /><i /></span>
        </button>
        <span className="mark">ooch</span>

        <div className="navright">
          <button className="icobtn" onClick={() => setAuth(true)} aria-label="Sign in">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2C6E9B"
                 strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
          </button>
          <button className="icobtn" onClick={() => setSavedOpen(true)}
                  aria-label={`Saved items (${savedCount})`}>
            <HeartIcon filled={savedCount > 0} />
            {savedCount > 0 && <span className="count">{savedCount}</span>}
          </button>
          <button className="icobtn" onClick={() => setBagOpen(true)}
                  aria-label={`Bag, ${bagCount} items`}>
            👜{bagCount > 0 && <span className="count">{bagCount}</span>}
          </button>
        </div>
      </nav>

      {menu && (
        <>
          <div className="menuscrim" onClick={() => setMenu(false)} />
          <div className="menupanel" role="menu" aria-label="Shop menu">
            <p className="menulabel">Shop</p>
            <button className="menuitem" role="menuitem"
                    onClick={() => openShop(null)}>Everything</button>
            {CATEGORIES.map((c) => (
              <button key={c.key} className="menuitem" role="menuitem"
                      onClick={() => openShop(c.key)}>{c.label}</button>
            ))}
            <div className="menusplit" />
            <button className="menuitem strong" role="menuitem"
                    onClick={() => { setMenu(false); setPage({ kind: "staples" }); }}>Our staples</button>
            <button className="menuitem strong" role="menuitem"
                    onClick={() => { setMenu(false); setPage({ kind: "limited" }); }}>Limited pieces</button>
            <button className="menuitem strong" role="menuitem"
                    onClick={() => { setMenu(false); setSets(true); }}>Sets</button>
          </div>
        </>
      )}

      <header className="hero">
        <div className="blob b1" aria-hidden="true" />
        <div className="blob b2" aria-hidden="true" />
        <div className="hero-in">
          <p className="findyour rise">Find your</p>
          <span className="oochword script rise d1">ooch</span>
          <p className="herosub">Unique drops every month.</p>
          <div className="herobtns">
            <button className="btn btn-solid" onClick={() => setSets(true)}>Save with sets</button>
            <button className="btn btn-clear" onClick={startQuiz}>Take the style quiz</button>
          </div>
        </div>
        <svg className="wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 46 C 180 92, 360 6, 560 34 C 760 62, 900 96, 1100 62 C 1250 36, 1350 46, 1440 58 L1440 90 L0 90 Z" fill="#F5FBFF" />
        </svg>
      </header>

      <section className="sect">
        <Dress dress={BIKINI_FEATURE} saved={saved} onSave={toggleSave} onAdd={addToBag} />
      </section>

      <section className="sect">
        <Signature onAdd={addToBag} saved={saved} onSave={toggleSave} />
      </section>

      <section className="sect" ref={quizRef}>
        {step === 0 && (
          <div className="quiz qfade">
            <span className="script quizmark" aria-hidden="true">ooch</span>
            <h2>What's your style?</h2>
            <p className="quizline">Don't know? Take the quiz.</p>
            <button className="btn btn-solid" onClick={startQuiz}>Take the quiz</button>
          </div>
        )}

        {(step === 1 || step === 2) && (() => {
          const q = QUESTIONS[step - 1];
          return (
            <div className="quiz">
              <div className="dots" aria-hidden="true">
                {QUESTIONS.map((_, i) => <span key={i} className={`dot ${i < step ? "on" : ""}`} />)}
              </div>
              <div className="qfade" key={q.key}>
                <p className="qtext">{q.text}</p>
                <div className="opts">
                  {q.options.map((o) => (
                    <button key={o.value} className="opt" onClick={() => answer(q.key, o.value)}>
                      <span className="lbl">{o.label}</span>
                      <span className="sub">{o.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button className="qback" onClick={() => setStep(step - 1)}>
                {step === 1 ? "Maybe later" : "Back a question"}
              </button>
            </div>
          );
        })()}

        {step === 3 && result && (
          <div className="result qfade">
            <p className="rlead">We think this is for you</p>
            <h2 className="rname">{result.name}</h2>
            <p className="rblurb">{result.blurb}</p>
            <div className="rgrid">
              {result.items.map((it, i) => {
                const Art = it.art || ART_BY_NAME[it.artName] || null;
                return (
                  <article className="card" key={it.name}>
                    <div className="art" style={{ background: it.img ? "#F2F1EF" : BG[i % BG.length] }}>
                      {it.img ? <img src={IMG[it.img]} alt={it.name} />
                              : Art ? <Art a={i % 2 ? "#BFE1F6" : "#FFFFFF"} b="#2C6E9B" /> : null}
                    </div>
                    <div className="pmeta">
                      <div className="prow">
                        <span className="pname">{it.name}</span>
                        <span className="price">${it.price}</span>
                      </div>
                      <button className="addbtn" onClick={() => addToBag(it.name, it.price)}>Add to bag</button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="rfoot">
              <button className="btn btn-solid" onClick={() => ping("Saved to your account — wire up in build")}>
                Save my style
              </button>
              <button className="btn btn-soft" onClick={startQuiz}>Take it again</button>
            </div>
          </div>
        )}
        <div ref={sizeRef}><SizeGuide /></div>
      </section>

      <section className="sect">
        <div className="looks">
          <div className="look one">
            <span className="script" aria-hidden="true">ooch</span>
            <h3>This month's drop</h3>
            <p style={{ margin: 0, fontWeight: 600, maxWidth: "30ch" }}>
              Six pieces that go with each other and nothing else you own. Here until the end of the month.
            </p>
            <button className="btn btn-soft" style={{ alignSelf: "flex-start", marginTop: 6 }}
                    onClick={() => setSets(true)}>Shop the look</button>
          </div>
          <div className="look two">
            <h3>Styled by you</h3>
            <p style={{ margin: 0, fontWeight: 600, maxWidth: "26ch" }}>
              Tag @ooch and your fit could land on the homepage. 1,240 posted this month.
            </p>
            <button className="btn btn-solid" style={{ alignSelf: "flex-start", marginTop: 6 }}
                    onClick={() => ping("Instagram feed — connect @ooch in the build")}>See the feed</button>
          </div>
        </div>
      </section>

      <section className="sect">
        <div className="shead">
          <div>
            <h2>What people say</h2>
            <p>4.8 out of 5, from 2,913 reviews</p>
          </div>
          <button className="link" onClick={() => ping("All 2,913 reviews — coming in the build")}>Read all</button>
        </div>
        <div className="revs">
          <div className="rev">
            <span className="stars" aria-label="5 out of 5">★★★★★</span>
            <p>The zip-thru is so soft I've worn it four days running. Sizing was spot on with the quiz.</p>
            <div className="who">Léa · Lyon · verified buyer</div>
          </div>
          <div className="rev">
            <span className="stars" aria-label="5 out of 5">★★★★★</span>
            <p>Ordered Tuesday, wore it Thursday. The blue is exactly the blue on the website.</p>
            <div className="who">Maya · Manchester · verified buyer</div>
          </div>
          <div className="rev">
            <span className="stars" aria-label="4 out of 5">★★★★☆</span>
            <p>Bought the tee in cornflower then went back for navy. Sized up and glad I did.</p>
            <div className="who">Anouk · Amsterdam · verified buyer</div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="footgrid">
          <div>
            <h4>Shop</h4>
            <ul>
              <li><button className="footlink" onClick={() => openShop(null)}>Everything</button></li>
              <li><button className="footlink" onClick={() => openShop("tops")}>Tops</button></li>
              <li><button className="footlink" onClick={() => openShop("bottoms")}>Bottoms</button></li>
              <li><button className="footlink" onClick={() => openShop("accessories")}>Accessories</button></li>
              <li><button className="footlink" onClick={() => setPage({ kind: "staples" })}>Our staples</button></li>
              <li><button className="footlink" onClick={() => setPage({ kind: "limited" })}>Limited pieces</button></li>
              <li><button className="footlink" onClick={() => setSets(true)}>Sets</button></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><button className="footlink" onClick={goSizeGuide}>Size guide</button></li>
              <li><button className="footlink" onClick={() => ping("Delivery info — coming in the build")}>Delivery</button></li>
              <li><button className="footlink" onClick={() => ping("Returns are free for 30 days")}>Returns</button></li>
              <li><button className="footlink" onClick={() => ping("Order tracking — coming in the build")}>Track my order</button></li>
              <li><button className="footlink" onClick={() => ping("hello@ooch.com")}>Contact us</button></li>
            </ul>
          </div>
          <div>
            <h4>About ooch</h4>
            <ul>
              <li><button className="footlink" onClick={() => ping("Australian owned, designed for everyone")}>Our story</button></li>
              <li><button className="footlink" onClick={() => ping("Limited runs, made once — coming in the build")}>How we make it</button></li>
              <li><button className="footlink" onClick={() => ping("15% off with a student email")}>Student discount</button></li>
              <li><button className="footlink" onClick={() => ping("No openings right now")}>Careers</button></li>
            </ul>
          </div>
          <div>
            <h4>Get the drop first</h4>
            <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: 14.5 }}>
              Early access to every drop, once a month. No spam, promise.
            </p>
            <div className="mailrow">
              <input type="email" placeholder="Your email" aria-label="Email for drop alerts"
                     value={mail} onChange={(e) => setMail(e.target.value)} />
              <button className="btn btn-solid"
                      onClick={() => {
                        if (!mail.includes("@") || !mail.includes(".")) { ping("That email doesn't look right"); return; }
                        ping("You're on the list");
                        setMail("");
                      }}>Sign up</button>
            </div>
          </div>
        </div>
        <p className="fine">© 2026 ooch · Privacy · Terms · Cookies · All prices in AUD · You need to be 16 or over to make an account.</p>
      </footer>

      {auth && (
        <div className="scrim" role="dialog" aria-modal="true" aria-label="Sign in to ooch"
             onClick={(e) => e.target === e.currentTarget && setAuth(false)}>
          <div className="sheet">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 className="script" style={{ fontSize: 50, color: "var(--deep)", lineHeight: 1.1, fontWeight: 400 }}>Hi again</h3>
              <button ref={closeRef} onClick={() => setAuth(false)} aria-label="Close sign in"
                      style={{ fontWeight: 700, color: "var(--mid)" }}>Close</button>
            </div>
            <p style={{ margin: "12px 0 22px", fontWeight: 600, lineHeight: 1.45 }}>
              Save your style, keep your wishlist, and get drops before everyone else.
            </p>
            <button className="authbtn apple" onClick={() => ping("Apple sign-in — wire up in build")}>
              <svg width="16" height="19" viewBox="0 0 16 19" fill="currentColor" aria-hidden="true">
                <path d="M13.1 10.1c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2.1.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.3zM10.9 3.6c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z" />
              </svg>
              Continue with Apple
            </button>
            <button className="authbtn" onClick={() => ping("Google sign-in — wire up in build")}>
              <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v8h12c-.2 2-1.6 5-4.5 7l7 5.4C42.6 36.6 45 30.9 45 24z" />
                <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7-5.4C29.7 36.4 27.1 37.3 24 37.3c-5.8 0-10.7-3.9-12.5-9.1l-7.2 5.6C8 40.8 15.4 46 24 46z" />
                <path fill="#FBBC05" d="M11.5 28.2c-.5-1.4-.7-2.8-.7-4.2s.3-2.9.7-4.2l-7.2-5.6C2.8 17 2 20.4 2 24s.8 7 2.3 9.8l7.2-5.6z" />
                <path fill="#EA4335" d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.1 30 2 24 2 15.4 2 8 7.2 4.3 14.2l7.2 5.6c1.8-5.2 6.7-9.1 12.5-9.1z" />
              </svg>
              Continue with Google
            </button>
            <div className="divider">or use your email</div>
            <input className="field" type="email" placeholder="you@email.com" aria-label="Email address" />
            <button className="btn btn-solid" style={{ width: "100%", marginTop: 12 }}
                    onClick={() => ping("Magic link sent — wire up in build")}>Send me a link</button>
            <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, color: "var(--mid)", fontWeight: 600 }}>
              You need to be 16 or over to make an account. Under 16, a parent can set one up with you.
            </p>
          </div>
        </div>
      )}

      {sets && <SetsSheet onClose={() => setSets(false)} onAdd={addToBag} />}

      {page && (
        <CatalogueSheet
          title={pageTitle} note={pageNote}
          banner={page.kind === "limited"}
          chips={page.kind === "shop"} cat={cat} onCat={setCat}
          photos={pick(PHOTO_PRODUCTS)} features={pick(FEATURED)} grid={pick(PRODUCTS)}
          saved={saved} onSave={toggleSave} onAdd={addToBag}
          onClose={() => setPage(null)} />
      )}

      {bagOpen && (
        <Drawer title="Your bag" note={bagCount === 1 ? "1 piece" : `${bagCount} pieces`}
                onClose={() => setBagOpen(false)}>
          {bag.length === 0 ? (
            <div className="drawerempty">
              <h3>Nothing in here yet</h3>
              <p>Add something and it'll show up here.</p>
              <button className="btn btn-solid" onClick={() => { setBagOpen(false); openShop(null); }}>
                Start shopping
              </button>
            </div>
          ) : (
            <>
              {bag.map((line) => (
                <div className="bagline" key={line.key}>
                  <div>
                    <strong>{line.label}</strong>
                    <span>${line.price}{line.pieces > 1 ? ` · ${line.pieces} pieces` : ""}</span>
                  </div>
                  <button className="rm" onClick={() => removeFromBag(line.key)}>Remove</button>
                </div>
              ))}
              <div className="bagfoot">
                <div className="bagtotal"><span>Subtotal</span><em>${bagTotal}</em></div>
                <button className="btn btn-solid" style={{ width: "100%" }}
                        onClick={() => ping("Checkout — connect payments in the build")}>
                  Checkout
                </button>
                <button className="btn btn-soft" style={{ width: "100%", marginTop: 8 }}
                        onClick={() => setBag([])}>
                  Empty the bag
                </button>
                <p style={{ margin: "12px 0 0", fontSize: 13, fontWeight: 600, color: "var(--mid)", textAlign: "center" }}>
                  Free returns for 30 days · Prices in AUD
                </p>
              </div>
            </>
          )}
        </Drawer>
      )}

      {savedOpen && (
        <Drawer title="Saved" note={savedCount === 1 ? "1 piece" : `${savedCount} pieces`}
                onClose={() => setSavedOpen(false)}>
          {savedCount === 0 ? (
            <div className="drawerempty">
              <h3>No saves yet</h3>
              <p>Tap the heart on anything you like and it'll wait for you here.</p>
              <button className="btn btn-solid" onClick={() => { setSavedOpen(false); openShop(null); }}>
                Have a look
              </button>
            </div>
          ) : (
            Object.entries(saved).filter(([, v]) => v).map(([id, name]) => (
              <div className="bagline" key={id}>
                <div><strong>{name}</strong></div>
                <button className="rm" onClick={() => toggleSave(id, name)}>Remove</button>
              </div>
            ))
          )}
        </Drawer>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
