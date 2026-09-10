# 🇮🇳 OnlineWallah.com — Government & Institutions Job Portal (Production-Ready)

**OnlineWallah.com** is a high-traffic, mobile-first Government & Public Institutions Job Information Portal engineered for students and job seekers across India.

---

## 🏗️ Tech Stack & Architecture (Option A — Modern Full-Stack)

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 + Tailwind CSS |
| **Backend API** | Next.js Server Components & Edge/Route Handlers |
| **Database** | PostgreSQL + Drizzle ORM |
| **Authentication** | JWT (via `jose`) + bcrypt password hashing + HTTP-only cookies |
| **Icons & UI** | Lucide React + Tailwind custom responsive utility layers |
| **Deployment** | Vercel (Frontend & Edge) + Railway / Render / Neon (PostgreSQL) |

---

## 🌟 Key Features

1. **High-Density SarkariResult-Class 3-Column Layout:**
   - Column 1: **Latest Jobs** (15+ items with relative time & status badges)
   - Column 2: **Results** (10+ items) + **Admit Cards** (10+ items)
   - Column 3: **Admissions** (8+ items) + **Answer Keys** (8+ items) + **Syllabus** (6+ items)
2. **Flagship Post Page (`/[category]/[slug]`):**
   - ⭐ **Important Dates Table** (with bold red highlight flags)
   - 📋 **Application Fee Table** (category breakdown + payment mode notes)
   - 📌 **Age Limit Table** (min/max age + calculation cutoff date)
   - 🏢 **Vacancy & Educational Eligibility Table** (post-wise seats & qualifications)
   - 📎 **Important Direct Official Links** (High-CTR colored buttons for Apply Online, Download Notification PDF, Admit Cards, and Results)
   - 📝 **Step-by-Step How to Apply Guide**
   - ⚡ **Interactive Self-Eligibility Checker Tool**
   - 🟢 **1-Click WhatsApp Share Deeplink**, Telegram Share, Copy Link, and **Print View** stylesheet
3. **Continuous Marquee News Ticker:**
   - Smooth CSS keyframe auto-scrolling ticker with pause-on-hover (`news_ticker` table driven).
4. **Debounced Live Autosuggest Search:**
   - Real-time search by title, organization, qualification, category, or subcategory.
5. **Interactive Job Seeker Tools:**
   - **Sarkari Exam Age Calculator** (calculates exact Years, Months, Days as on cutoff date)
   - **Free Instant Job Alerts Box** (Email / WhatsApp alerts subscription)
6. **Strict Legal & Aggregator Compliance:**
   - Clear non-government aggregator disclaimer on every page and in footer.
   - Verified official `.gov.in` and `.nic.in` link directory (60+ portal links).
7. **Protected Admin CMS (`/wallah-admin`):**
   - Unlisted, secure admin path with 8-hour JWT session expiry.
   - Full post creator & editor with interactive table builders (Dates, Fees, Vacancy, Links).
   - Live Google SERP preview & Live Post simulator.
   - News ticker manager and government portal directory manager.
   - One-click demo database re-seed button.

---

## 🔐 Admin Panel Credentials

- **Admin URL:** `http://localhost:3000/wallah-admin` (Unlisted path)
- **Default Username:** `admin`
- **Default Password:** `AdminPassword2026!`

*(You can also use the one-click demo credentials helper on the login page)*

---

## 🚀 Quickstart & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/onlinewallah.git
cd onlinewallah
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` points to your PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db"
ADMIN_JWT_SECRET="your-secure-admin-secret-key-2026"
```

### 3. Apply Schema & Seed Initial Data
```bash
npx drizzle-kit push
```

The app automatically seeds 30+ realistic posts across UPSC, SSC, Railway, NEET, Banking, Defense, and Police upon first launch. You can also re-seed anytime via the Admin Header or by making a POST request to `/api/seed`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment

### Option 1: Railway (App + PostgreSQL in one project) — RECOMMENDED
👉 **Full step-by-step guide: [`DEPLOYMENT-RAILWAY.md`](./DEPLOYMENT-RAILWAY.md)**

Quick version:
1. Push the repo to GitHub and create a new Railway project from that repo.
2. Add the **PostgreSQL** database service to the same project.
3. On the **app** service, set `DATABASE_URL = ${{Postgres.DATABASE_URL}}`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NODE_ENV=production`.
4. Railway reads the committed `railway.json`: build `npm run build`, pre-deploy `npx drizzle-kit push --url="$DATABASE_URL"`, start `npm run start`, healthcheck `/api/health`.
5. Generate a public domain, then seed with `curl -X POST https://<domain>/api/seed`.

### Option 1b: Vercel frontend + Neon/Railway PostgreSQL
1. Create a PostgreSQL database on [Neon](https://neon.tech) or [Railway](https://railway.app).
2. Push your code to GitHub.
3. Import repository into [Vercel](https://vercel.com).
4. Set Environment Variables:
   - `DATABASE_URL`: Your production PostgreSQL connection string with `?sslmode=require`.
   - `ADMIN_JWT_SECRET`: A strong 32+ character random string.
5. Deploy! Vercel will automatically build the Next.js production bundle.
6. Apply the schema once from your machine: `npx drizzle-kit push --url="<production-url>"`.

### Option 2: Docker / VPS (Ubuntu + Nginx + PM2)
```bash
npm run build
pm2 start npm --name "onlinewallah" -- start
```

---

## 📊 Performance & Mobile Optimization

- **First Load JS:** Under 150kB
- **Lighthouse Performance Score:** > 85
- **Semantic HTML & SEO:** Dynamic XML Sitemap (`/sitemap.xml`), `robots.txt`, and Google `JobPosting` schema markup on all post pages.
