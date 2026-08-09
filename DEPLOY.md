# Putting ooch on the Hetzner box

Three static files and a web server. No build step, no Node on the server, no database.

## 1. Copy the files up

```bash
ssh root@YOUR_HETZNER_IP
mkdir -p /srv/ooch && cd /srv/ooch
```

From your laptop:

```bash
scp index.html admin.html ooch-data.js Caddyfile docker-compose.yml \
    root@YOUR_HETZNER_IP:/srv/ooch/
```

## 2. Point the domain at the box

At Cloudflare (or your registrar) create two A records to the Hetzner IP:

```
A    ooch.com        YOUR_HETZNER_IP
A    www.ooch.com    YOUR_HETZNER_IP
```

If you use Cloudflare, set SSL mode to **Full (strict)** and turn the orange proxy cloud **off** for the first run so Caddy can complete its certificate check. Turn it back on afterwards.

## 3. Lock the admin console

Generate a password hash:

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'a-long-password-here'
```

Paste the result into `Caddyfile`, replacing `$2a$14$REPLACE_THIS...`.

## 4. Start it

```bash
cd /srv/ooch
docker compose up -d
docker compose logs -f     # watch the certificate get issued
```

That is it. `https://www.ooch.com` is the shop, `https://www.ooch.com/admin.html` is the console behind a password.

## Without Docker

```bash
apt install -y caddy
cp Caddyfile /etc/caddy/Caddyfile
cp index.html admin.html ooch-data.js /srv/ooch/
systemctl reload caddy
```

## Showing it to people

- **On a phone:** open the site in Safari, tap Share, then **Add to Home Screen**. It opens full screen with its own icon, no browser chrome. The admin does the same.
- **Side by side:** put the admin on a laptop and the shop on a phone. Change something in the admin — hide a product, rename the hero, switch off a whole category — and the shop updates within a second. That is the demo.

## What this is and is not

This is a **prototype**. Everything is real and interactive, but:

- Product data lives in `ooch-data.js` and each browser's local storage, not a database. Changes are per-device.
- There is no checkout. In the live build that is Shopify.
- Sales figures are generated so the analytics have something to show. They are realistic, not real.
- Garments are drawn as vectors, standing in for photography.

To reset before showing someone: **Settings → Reset everything** in the admin.
