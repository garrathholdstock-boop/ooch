# ooch — draft storefront

Australian owned. Unique drops every month.

## What's in here

    dist/            ← the built site. Upload this and you're done.
    src/Ooch.jsx     ← the whole site, one React component
    src/main.jsx     ← mounts it
    public/img/      ← all 202 product photos (webp)
    index.html
    package.json
    vite.config.js

## Put it live (no build needed)

Everything in `dist/` is plain static files. Copy the *contents* of `dist/`
into your web root:

    scp -r dist/* user@your-server:/var/www/ooch/

nginx server block:

    server {
        listen 80;
        server_name ooch.com www.ooch.com;
        root /var/www/ooch;
        index index.html;
        location / { try_files $uri $uri/ /index.html; }
        location ~* \.(webp|js|css|woff2)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

Then `sudo certbot --nginx -d ooch.com -d www.ooch.com` for HTTPS.

Apache works the same way — just point DocumentRoot at the folder.

## Change something and rebuild

    npm install
    npm run dev      # local preview on http://localhost:5173
    npm run build    # writes dist/

Node 18 or newer.

## Where things live in the code

Everything is in `src/Ooch.jsx`, near the top, as plain data you can edit:

    COLOURS          the five blues
    SIZES            the size run (2XS–XL)
    PHOTO_PRODUCTS   the staples with colour sliders
    LAYERS / DRESSES / SHORTS   the pieces with full detail pages
    SETS             the bundles, including the optional headband
    SIZE_CHART       the size guide table
    QUESTIONS / RESULTS   the style quiz
    IMG              filename → /img/*.webp

Prices are plain numbers in AUD. Change a price in one place and it updates
everywhere, including the set totals.

## Still to wire up before taking money

- **Checkout.** The bag is real — it tracks lines, quantities and a subtotal —
  but the Checkout button doesn't charge anyone. Connect Stripe or Shopify.
- **Sign in.** Google and Apple buttons are styled and positioned but not
  connected. Apple sign-in needs a paid Apple Developer account, a Services ID
  and a client secret you regenerate every 6 months.
- **Accounts and saved items** live in browser memory only, so they reset on
  refresh. They need a database behind them.
- **Stock levels.** Nothing sells out yet.
- **Under-16s** can't consent to their own data processing in most of the
  world, which is why the sign-in panel says 16+. Worth a lawyer's eye before
  launch given the age range you're selling to.

## Photography notes

- Black colourways of the net top and tube top are listed but not shot.
- The maxi dress copy is written from the photos — no spec sheet was supplied.
- Model shots on the cloud hoodie came from a composite sheet, so they're
  lower resolution than the rest.
