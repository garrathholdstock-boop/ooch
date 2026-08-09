# ooch

Storefront and admin console for ooch.com. Static files — no build step, no database, no Node on the server.

## Files

| File | What it is |
|---|---|
| `index.html` | The shop |
| `admin.html` | The admin console |
| `ooch-data.js` | Shared data layer both files read from |
| `Caddyfile` | Web server config — HTTPS, www redirect, admin password |
| `docker-compose.yml` | One-command start |
| `robots.txt` | Keeps the admin out of search results |
| `DEPLOY.md` | Full deployment instructions |

## Quick start

```bash
git clone git@github.com:YOURNAME/ooch.git /srv/ooch
cd /srv/ooch
docker compose up -d
```

Full instructions, including DNS and the admin password, are in `DEPLOY.md`.

## Before the first deploy

Set the admin password:

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'your-password-here'
```

Paste the hash into `Caddyfile`, replacing `$2a$14$REPLACE_THIS...`, then stop git from overwriting it on future pulls:

```bash
git update-index --skip-worktree Caddyfile
```

## Updating later

```bash
cd /srv/ooch && git pull && docker compose restart
```

## What this is

A working prototype. Everything is interactive and the admin genuinely drives the shop — hide a product and it disappears within a second. But:

- Data lives in each browser's local storage, so changes are per-device
- There is no checkout; that is Shopify in the live build
- Sales figures are generated so the analytics have something to show
- Garments are drawn as vectors, standing in for photography

Reset before showing anyone: **Settings → Reset everything**.

## Adding to a phone

Open the site in Safari, tap Share, then **Add to Home Screen**. It opens full screen with its own icon. The admin does the same.
