# AKSAM — Premium Showcase

Production-grade corporate showcase for **AKSAM** (Namangan, Uzbekistan) — a manufacturer of
ribbons, elastic tapes and brand labels. Red and white brand identity, three languages
(uz / ru / en), a real-time lead pipeline to Telegram, and a full admin panel.

---

## Two independent projects

```
aksam/
├── web/   Next.js 15 storefront + admin panel (Cloudflare Pages)
└── api/   Node.js + Fastify 5 backend (any VPS — plain Node, no Docker)
```

The two projects share **no code and no dependencies** — each has its own `package.json`,
its own lockfile and its own `node_modules`. They talk to each other only over REST:

```
┌─────────────────────────────┐          ┌──────────────────────────────────────┐
│  web  (Next.js 15)          │  REST    │  api  (Fastify 5)                     │
│  Cloudflare Pages / Workers │ ───────► │  VPS — plain Node                    │
│                             │  JSON    │                                      │
│  - storefront (uz/ru/en)    │          │  - Prisma + PostgreSQL               │
│  - admin panel (/admin)     │          │  - Redis (cache + rate limits)       │
│  - sitemap / robots / SEO   │          │  - JWT auth (access + refresh)       │
│  - edge middleware          │          │  - Telegram bot (order leads)        │
└─────────────────────────────┘          │  - ImgBB image hosting               │
        │  (fallback)                    └──────────────────────────────────────┘
        └──► bundled demo dataset (web/lib/fallback/data.ts)
```

The Next.js app contains **no business logic and no API routes of its own**. Server
components fetch from the Fastify API at build time; if the API is unreachable the site
falls back to a bundled demo catalog — it never renders broken. At runtime, fresh data
arrives silently through client-side hydration, so admin edits appear without a redeploy.

---

## Frontend (`web/`)

| Concern      | Choice                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Framework    | Next.js **15.5.23** (App Router) — pinned above CVE-2025-66478 (React2Shell, CVSS 10). `next-on-pages` supports up to 15.5.x; `web/.npmrc` handles the peer range. |
| Rendering    | Home + all product pages fully static (SSG, instant navigation); remaining public pages edge-rendered with zero API round-trips |
| Styling      | Tailwind CSS v4 (`@theme` tokens: `brand #C8102E`, `ink #1A1A1A`, `paper`; container = 2100px) |
| Animation    | Framer Motion (micro-interactions, page transitions) + GSAP ScrollTrigger (hero parallax) + IntersectionObserver CSS reveals |
| i18n         | i18next — per-locale instance; all UI text in `lib/i18n/resources/*.json` (uz/ru/en). Header/footer live in the ROOT layout, so switching language never remounts them — no refresh feel |
| Maps         | Google Maps embed (keyless by default; optional Embed API via `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) |
| State        | Zustand (UI toasts/order modal, admin auth, hydrated data store)        |
| Deployment   | Cloudflare Pages via `@cloudflare/next-on-pages`, config in `web/wrangler.jsonc` |

## Backend (`api/`)

| Concern      | Choice                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Server       | Fastify 5 + TypeScript, structured logging (pino)                       |
| Data         | Prisma 6 + PostgreSQL; every text field stored per locale (uz/ru/en)    |
| Cache        | Redis-first reads (products/categories/settings, TTL 5 min) with immediate invalidation on every admin write |
| Auth         | JWT access tokens (15 min) + rotating refresh tokens in httpOnly cookies (7 days), bcrypt hashing |
| RBAC         | `SUPERADMIN` > `ADMIN` > `EDITOR`. Destructive routes require ADMIN+    |
| Rate limits  | Redis fixed-window buckets — global, per-route, per-IP and per-token    |
| Orders       | `POST /v1/orders` validates (zod) + sanitizes, stores the lead, forwards it to the Telegram channel instantly (fire-and-forget) |
| Uploads      | Multipart → streamed to ImgBB → only the returned URL is stored          |
| Analytics    | Anonymous visitor token (localStorage) → hashed, counted in Redis, flushed to Postgres every 45 s |

---

## Getting started (local)

Requirements: Node 20+, PostgreSQL, Redis (any install — native, apt, Homebrew…).

```bash
# ---- API ----
cd api
cp .env.example .env          # fill in DATABASE_URL, REDIS_URL, secrets
npm install
npx prisma migrate dev --name init
npm run db:seed               # superadmin + demo catalog + sample stats
npm run dev                   # http://localhost:4000

# ---- Web (separate terminal) ----
cd web
cp .env.example .env.local    # NEXT_PUBLIC_API_BASE=http://localhost:4000
npm install --legacy-peer-deps
npm run dev                   # http://localhost:3000
```

Default admin login (from `api/.env`): `admin@aksam.uz` / `Aksam2026!` — **change it in production**.

The API seed uses its own copy of the demo catalog (`api/prisma/seed-data.ts`), so the two
projects never import each other.

---

## Environment variables

- **`api/.env.example`** — DATABASE_URL, REDIS_URL, JWT secrets, TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID, IMGBB_API_KEY, ADMIN_EMAIL/PASSWORD, CORS_ORIGINS, …
- **`web/.env.example`** — NEXT_PUBLIC_API_BASE, NEXT_API_INTERNAL_BASE,
  NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (optional).

**Never commit `.env` files** — they are gitignored.

---

## Deployment

### Frontend → Cloudflare Pages

1. Create a Pages project pointing at the `web/` directory.
2. Build settings:
   - **Build command:** `npm run pages:build` (runs `next build` + `@cloudflare/next-on-pages`)
   - **Output directory:** `.vercel/output/static`
3. Build-time env vars: `NEXT_PUBLIC_API_BASE=https://api.aksam.uz`,
   `NEXT_PUBLIC_SITE_URL=https://aksam.uz`.
4. `web/wrangler.jsonc` is ready for the Pages/Wrangler flow; `web/.npmrc` lets the
   adapter's internal install resolve the pinned Next version.

### Backend → any VPS (plain Node, no Docker)

```bash
# on the server
cd api
npm ci --omit=dev
npx prisma generate && npx prisma migrate deploy
npm run build                # tsc -> dist/
npm run db:seed              # first run only
```

Run it with PM2 (recommended):

```bash
npm i -g pm2
pm2 start dist/index.js --name aksam-api
pm2 save && pm2 startup
```

Or with plain systemd — create `/etc/systemd/system/aksam-api.service`:

```ini
[Unit]
Description=AKSAM API
After=network.target

[Service]
WorkingDirectory=/srv/aksam/api
ExecStart=/usr/bin/node dist/index.js
Restart=always
EnvironmentFile=/srv/aksam/api/.env

[Install]
WantedBy=multi-user.target
```

Behind nginx/caddy:

```
api.aksam.uz  ->  127.0.0.1:4000   (HTTPS, proxy_set_header X-Forwarded-For)
```

Set `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none` when frontend and API live on
different origins over HTTPS; add the frontend origin(s) to `CORS_ORIGINS`.

### Telegram order notifications

1. Create a bot with [@BotFather](https://t.me/BotFather), copy the token.
2. Create a private channel, add the bot as **administrator**.
3. Put the channel id (e.g. `-100xxxxxxxxxx`) into `TELEGRAM_CHANNEL_ID`.
   The optional admin-utility bot (`npm run bot`) prints a chat id when you send `/id`.

Without the bot configured the site keeps working — leads stay in the database and are
visible in the admin panel.

---

## Admin panel

`/admin` — JWT login, RBAC, three interface languages (uz/ru/en switcher bottom-left).

| Section      | What it does                                                        |
| ------------ | ------------------------------------------------------------------- |
| Dashboard    | Today/30-day visitors and uniques, new leads, product counts, 14-day charts, recent leads |
| Products     | CRUD with uz/ru/en tabs, highlights + technical specs per locale, SEO fields per locale, image upload to ImgBB (reorder/remove), active toggle |
| Categories   | CRUD with per-locale names/descriptions and image                    |
| Leads        | Orders + contact messages, status workflow (NEW → CONTACTED → CLOSED/SPAM), inline notes, search, pagination |
| Visitors     | Views/uniques charts for 14/30/90 days                               |
| Settings     | Site name, contacts, address, map coordinates, social links          |

Roles: **EDITOR** manages content, **ADMIN** additionally deletes and edits settings,
**SUPERADMIN** is the seed account with full access.

---

## SEO checklist (implemented)

- Per-product dynamic title/description/canonical + `hreflang` alternates on **every** page.
- `og:image` = the product's own first gallery image; site-wide default OG banner built
  from the client's brand image (`public/images/og-default.jpg`).
- schema.org `Product` JSON-LD **without price/offers** (availability is order-based, specs
  exported as `additionalProperty`); `Organization` JSON-LD on the home page.
- `sitemap.xml` generated live — all 3 locales × all pages + products, with hreflang;
  `robots.txt` disallows `/admin`.
- Semantic HTML, single H1 per page, `next/image` with sizes + blur placeholders.

## Security checklist (implemented)

- Short-lived JWT access + rotating refresh tokens (used tokens are revoked and replaced).
- RBAC on every admin endpoint; bcrypt password hashing.
- Redis-backed rate limits: global, per-IP, per-token, stricter on auth (10/min) and upload.
- Zod validation + sanitization (control chars stripped, phone normalized, honeypot field).
- CORS locked to configured origins, Helmet security headers, Prisma parameterized queries.
- Graceful shutdown (flushes analytics, closes DB/Redis), `/health` endpoint.

---

## Scripts

**web/** — `npm run dev` · `build` · `start` · `pages:build` (Cloudflare) · `test` · `typecheck`

**api/** — `npm run dev` · `build` · `start` · `db:generate` · `db:migrate` · `db:deploy` · `db:seed` · `bot`
