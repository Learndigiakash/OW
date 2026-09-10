# 🚂 Railway.com Deployment Guide — OnlineWallah.com

Deploy the **Next.js 16 app** + **PostgreSQL database** to Railway in ~15 minutes.
Railway hosts both the app service and the managed Postgres database inside one project.

---

## 0. Prerequisites

| Requirement | Notes |
|---|---|
| GitHub account | Code must be pushed to a GitHub repo |
| Railway account | Sign up free at https://railway.com (GitHub login recommended) |
| Railway CLI (optional) | `npm i -g @railway/cli` — only needed for CLI deploys |
| Repo pushed | `git add . && git commit -m "OnlineWallah portal" && git push origin main` |

Verify the project builds locally **before** deploying:

```bash
npm install
npx drizzle-kit push          # creates tables
npm run build                 # must exit 0
```

---

## 1. Push your code to GitHub

```bash
git init
git add .
git commit -m "feat: OnlineWallah government job portal"
git branch -M main
git remote add origin https://github.com/<your-username>/onlinewallah.git
git push -u origin main
```

> `.env` must **never** be committed. `.env.example` is already provided.
> Confirm `.env` is listed in `.gitignore` before pushing.

---

## 2. Create the Railway project

1. Go to https://railway.com/dashboard → **New Project**.
2. Choose **Deploy from GitHub repo**.
3. Authorise Railway to read your GitHub account (first time only).
4. Select the `onlinewallah` repository.
5. Railway immediately starts a first build — **let it fail or finish**, we will fix env vars next.

You now have one service in the project canvas (named after the repo).

---

## 3. Add the PostgreSQL database

1. Inside the project canvas click **+ Create** (or **New → Database**).
2. Choose **Add PostgreSQL**.
3. Railway provisions a Postgres 16 instance as a second service named `Postgres`.
4. Click the `Postgres` service → **Variables** tab → note the available keys:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
   - `DATABASE_PUBLIC_URL` (for connecting from your laptop)
5. **Do not copy/paste the password into your app manually.** Use a reference variable instead (step 4) so credentials stay in sync.

---

## 4. Configure environment variables on the app service

Open your **app service** (not Postgres) → **Variables** tab → **Raw Editor** (or **+ New Variable**) and add:

| Variable | Value | Purpose |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Reference variable — auto-resolves the Postgres connection string over Railway private networking |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 48` output | Signs the 8-hour admin JWT cookie |
| `NEXT_PUBLIC_SITE_URL` | `https://onlinewallah.com` | Canonical URLs / Open Graph tags |
| `NODE_ENV` | `production` | Enables secure cookies + prod optimisations |
| `NIXPACKS_NODE_VERSION` | `22` | Pins the Node runtime (optional but recommended) |

Generate a strong secret locally:

```bash
openssl rand -base64 48
```

> **Important:** the value must be written exactly as `${{Postgres.DATABASE_URL}}` (with the double curly braces).
> If your database service is named something other than `Postgres`, use that exact service name.
> Only fall back to copying `DATABASE_URL` from the Postgres service's Variables tab if you deploy the app **outside** Railway.

**Note on `PORT`:** Railway injects `PORT` automatically. `npm run start` → `next start` already respects it — never hardcode a port.

---

## 5. Verify build / deploy settings

The repo ships a `railway.json` that Railway reads automatically:

```jsonc
{
  "build":  { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": {
    "startCommand": "npm run start",
    "preDeployCommand": "npx drizzle-kit push --url=\"$DATABASE_URL\"",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 120,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

What each part does:

- **buildCommand** → `next build` (Turbopack production bundle).
- **preDeployCommand** → runs `drizzle-kit push` against Railway Postgres **before** the new container receives traffic. This is what creates the `posts`, `categories`, `admin_users`, `news_ticker`, `important_links`, `contact_messages` and `job_alerts_subscribers` tables on every deploy, so schema changes never require manual SQL.
- **healthcheckPath** → Railway will not route traffic until `/api/health` returns HTTP 200 (it runs `select 1` against Postgres).
- **restartPolicyType: ON_FAILURE** → auto-restarts a crashed container.

If `preDeployCommand` is unavailable on your plan, use this alternative start command instead (Settings → Deploy → Custom Start Command):

```
npx drizzle-kit push --url="$DATABASE_URL" && npm run start
```

---

## 6. Deploy

1. On the app service click **Deploy** (or **⋮ → Redeploy**) to trigger a fresh build with the env vars applied.
2. Watch the **Deploy Logs** tab. A healthy deploy shows:
   - `✓ Compiled successfully`
   - `Reading config file '/app/drizzle.config.json'` → `[✓] Changes applied`
   - `▲ Next.js ... Ready in ...ms`
   - a successful healthcheck on `/api/health`
3. The service status should turn **Active**.

---

## 7. Expose the app publicly (generate a domain)

1. App service → **Settings** → **Networking** → **Public Networking** → **Generate Domain**.
2. Railway returns something like `onlinewallah-production.up.railway.app`.
3. Open it — the OnlineWallah home page loads with the ticker, quick-action grid and 3-column layout.
4. Confirm the health endpoint:
   ```bash
   curl -i https://<your-app>.up.railway.app/api/health
   # HTTP/2 200  →  {"ok":true}
   ```

---

## 8. Seed the production database (30+ realistic posts)

Two supported ways:

**A) HTTP (fastest, no local setup)**
```bash
curl -X POST https://<your-app>.up.railway.app/api/seed
# {"success":true,"message":"Database seeded successfully"}
```

**B) Admin UI**
1. Visit `https://<your-app>.up.railway.app/wallah-admin/login`
2. Sign in with username `admin` / password `AdminPassword2026!`
3. In the admin header click **Quick Re-Seed Data**.

The public home page also self-heals: if the `posts` table is empty on first visit it runs the seeder automatically.

> 🔐 **Change the default admin password immediately after seeding.** Insert a fresh bcrypt hash, or simply create a second admin and delete the default:
> ```bash
> railway run psql "$DATABASE_URL"
> ```
> ```sql
> UPDATE admin_users SET username='youradmin', email='you@yourdomain.com', password_hash='<bcrypt-hash>' WHERE username='admin';
> ```
> Generate a hash with: `node -e "console.log(require('bcryptjs').hashSync('YourNewStrongPassword!',10))"`

---

## 9. Custom domain (onlinewallah.com)

1. App service → **Settings → Networking → Custom Domain** → enter `onlinewallah.com` (and `www.onlinewallah.com`).
2. Railway gives you a **CNAME target** such as `xxxx.up.railway.app`.
3. At your DNS registrar (GoDaddy / Cloudflare / BigRock) add:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `xxxx.up.railway.app` | Automatic |
| CNAME | `@` | `xxxx.up.railway.app` | Automatic |

   - Cloudflare users: set the record to **DNS only (grey cloud)** while Railway issues the TLS certificate; you can re-enable the orange cloud afterwards.
   - If your registrar refuses a root CNAME, use their **ALIAS / ANAME / FLATTEN** record type instead.
4. Railway auto-issues a Let's Encrypt certificate. HTTPS becomes active in a few minutes.
5. Update `NEXT_PUBLIC_SITE_URL` to `https://onlinewallah.com` and redeploy so canonical URLs, OG tags, `sitemap.xml` and `robots.txt` point to the real domain.
6. Submit `https://onlinewallah.com/sitemap.xml` in Google Search Console.

---

## 10. Post-deploy smoke test checklist

```bash
BASE=https://onlinewallah.com
curl -s $BASE/api/health                       # {"ok":true}
curl -s $BASE/api/posts?limit=3                # JSON list of posts
curl -s $BASE/api/search?q=upsc                # autosuggest results
curl -s "$BASE/api/ticker"                     # marquee headlines
curl -s $BASE/robots.txt                       # Sitemap: line present
curl -s $BASE/sitemap.xml | head -20           # URLs listed
```

Then in the browser:

- [ ] Home page: ticker auto-scrolls, pauses on hover
- [ ] Header search shows live suggestions after 2 characters
- [ ] Dark-mode toggle persists after reload
- [ ] `/latest-jobs/upsc-ias-recruitment-2026` shows all 5 tables (Dates, Fee, Age, Vacancy, Links)
- [ ] Copy-Link, Print View, WhatsApp share and the Eligibility Checker all work
- [ ] `/wallah-admin` redirects to the login screen (unauthenticated)
- [ ] Cookie consent banner appears for first-time visitors
- [ ] Mobile view at 375px width — no horizontal scroll

---

## 11. Optional: re-deploy via the Railway CLI

```bash
npm i -g @railway/cli
railway login                 # opens the browser
railway link                  # pick your project + app service
railway up                    # build & deploy current directory
railway logs                  # tail deploy/runtime logs
railway variables             # list service variables
railway run npm run build     # run a command with prod env injected
```

---

## 12. Automatic deploys & environments

- **Auto-deploy on push:** app service → Settings → Source → *Deploy on push* is enabled by default for the `main` branch. Every `git push` triggers a build; `drizzle-kit push` runs in the pre-deploy phase.
- **Staging environment:** project → **⋮ → New Environment** → *Duplicate* the production environment, then point `DATABASE_URL` to a second Postgres service. Railway gives each environment its own domain.
- **Rollbacks:** Deployments tab → pick a previous successful deployment → **Redeploy**. Database schema changes are additive through `drizzle-kit push`, so rolling the app back is safe.

---

## 13. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build fails: `DATABASE_URL is required` | Env var missing during build | Add `DATABASE_URL` reference variable; it must exist before the first build. Note that pages are server-rendered, so the build itself does not query the DB — but route imports still need the var present |
| `relation "important_links" does not exist` | Pre-deploy command did not run | Run `railway run npx drizzle-kit push --url="$DATABASE_URL"`, or switch to the combined start command from step 5 |
| Healthcheck failing / container restarts | `/api/health` cannot reach Postgres | Confirm the reference variable resolves (Variables tab shows the value), and that you used `${{Postgres.DATABASE_URL}}` (private URL, not the public one) |
| Login succeeds but immediately redirects back to login | Cookie rejected | Ensure the site is served over HTTPS and `NODE_ENV=production`; the cookie is `secure` + `httpOnly` in production |
| Blank page / 502 after deploy | `next start` bound to a hardcoded port | Never set `PORT`; read it from Railway's injected var (already handled) |
| Slow first request | Cold container boot | Pre-warm by hitting `/api/health` from an uptime monitor (Better Stack, UptimeRobot) every 5 minutes |
| `preDeployCommand` unsupported | Legacy Railway plan/config | Use step 5's alternative start command |
| Modified `drizzle.config.json` URL has no effect | It is a placeholder for local sandbox use | Always pass `--url="$DATABASE_URL"` to override credentials in CI/production |

---

## 14. Cost & scaling notes

- Railway's **Hobby** plan is sufficient at launch: one Node service + one Postgres database.
- **Scale vertically** first (app service → Settings → Resources → vCPU/RAM). `next start` is single-process, so 2+ vCPU handles thousands of concurrent readers comfortably.
- **Scale horizontally** by raising `numReplicas` in `railway.json` once traffic grows; sticky sessions are not required because JWT auth is stateless.
- Postgres: enable **point-in-time recovery backups** on the database service before going live.
- For heavy traffic, add a CDN (Cloudflare) in front of the custom domain and cache `/` for 60s — all listing pages are already `force-dynamic` server components that only read from Postgres.
