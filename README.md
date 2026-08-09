# ooch

Storefront and admin console for ooch. Static files — no build step, no database, no Node on the server.

## Files

| | |
|---|---|
| `index.html` | The shop |
| `admin.html` | The admin console |
| `ooch-data.js` | Shared data layer both files read from |
| `assets/` | 57 product photographs (WebP) |
| `Caddyfile` / `docker-compose.yml` | Unused on the current server, which runs nginx |
| `robots.txt` | Keeps the admin out of search results |
| `DEPLOY.md` | Deployment notes |

## Updating the live site

```bash
cd /srv/ooch/app && git pull
```

Nothing to rebuild or restart — they are static files.

## The range

**Photographed (10):** Cloud hoodie, Everyday tee, Wide leg track pant, Mini skort, Mini tote, Ooch bikini, and headbands in twist, bow, skinny and wide. Five blues each, except the bikini in sky blue and white.

**Placeholder art (14):** vector stand-ins so the shop looks full and the analytics have depth. The admin labels every one of them "Placeholder art". Delete them once the real range is settled.

## The style quiz

Two questions, four outcomes. Every result opens with "We think this is for you".

| Answer | Result |
|---|---|
| Comfort · Winter | Cosy season |
| Comfort · Summer | Easy and loose |
| Style · Summer | Summer statement |
| Style · Winter | Sharp and layered |

Questions and outcomes are editable in the admin under Content → Style quiz.

## What this is

A working prototype. The admin genuinely drives the shop — hide a product and it disappears within a second. But data lives in each browser, there is no checkout, and the sales figures are generated so the analytics have something to show.

Reset before showing anyone: **Settings → Reset everything**.

## On a phone

Safari → Share → **Add to Home Screen**. Opens full screen with its own icon. The admin does the same.
