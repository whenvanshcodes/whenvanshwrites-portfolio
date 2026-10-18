# whenvanshwrites — Portfolio & Interactive Village

Production-ready personal portfolio for **Vansh Bhati (whenvanshwrites)** built on **Next.js 16 (App Router) / React 19**, powered by **Supabase (PostgreSQL + Supabase Storage + Supabase Auth)**, and deployed on **Vercel** with a custom **`whenvanshwrites.is-a.dev`** domain.

---

## Architecture Overview

1. **Dual-Entry Portfolio System**:
   - **Direct Route (`01`)**: Clean, editorial professional showcase featuring data analysis & business analysis case studies, working method, resume viewer, and downloadable resume.
   - **Scenic Route (`02`)**: Living interactive canvas village featuring animated day/night cycles, mini-game rally driving, visitor notebook, garden word drops, typewriter quotes, and creative Hut.
2. **Backend & Persistence (Supabase)**:
   - **PostgreSQL Database**: Replaces Cloudflare D1 with standard Postgres tables (`contacts`, `portfolio_content`, `project_media`, `photo_series`, `photos`, `writings`, `visitor_words`, `visitor_experiences`, `race_times`).
   - **Supabase Storage**: Bucket `portfolio-media` stores uploaded project screenshots and photo series.
   - **Supabase Auth**: Protects `/adminvansh` (Owner Studio) using verified owner user ID (`SUPABASE_OWNER_USER_ID`). Privileged keys are never exposed in browser bundles.
3. **Deployment (Vercel)**:
   - Standard Next.js serverless deployment.
   - Native build: `node scripts/sync-next-markup.mjs && next build`.
   - Security headers: strict Content-Type nosniff, referrer-policy, and permissions-policy.
4. **Custom Subdomain (`whenvanshwrites.is-a.dev`)**:
   - Automated DNS routing via CNAME `cname.vercel-dns.com` through the official `is-a-dev/register` service.

---

## Quick Start (Local Development)

### 1. Requirements
- **Node.js**: v22+ (v24 recommended)
- **Package Manager**: `pnpm` 11+

### 2. Installation
```sh
pnpm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```sh
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (`https://<project-id>.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Anon Key (from Project Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (from Project Settings → API)
- `SUPABASE_OWNER_USER_ID`: Verified UUID of your owner account (from Supabase Authentication → Users)
- `SUPABASE_OWNER_EMAIL`: `vanshbhati522@gmail.com`
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` (or `https://whenvanshwrites.is-a.dev` in production)

### 4. Run Development Server
```sh
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Database Setup & SQL Migrations (Supabase)

To initialize your Supabase backend:

1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Run the migration script located at:
   [`supabase/migrations/20261018000000_init_supabase.sql`](file:///c:/Users/bhati/Downloads/whenvanshwrites-complete-source/whenvanshwrites/supabase/migrations/20261018000000_init_supabase.sql)
   This automatically:
   - Creates all 9 tables with proper indexes.
   - Configures Row Level Security (RLS) on each table.
   - Sets up the `portfolio-media` storage bucket with public read access and 50MB file size limits.
3. (Optional) Run [`supabase/seed.sql`](file:///c:/Users/bhati/Downloads/whenvanshwrites-complete-source/whenvanshwrites/supabase/seed.sql) to add starter sample words and notes.

### Data Export & Import Instructions (Existing Cloudflare Hosted Data)
> [!NOTE]
> This source code package contains the full source code and bundled defaults, but **does not** include live database rows or user-uploaded files from previously hosted Cloudflare D1/R2 instances.
>
> If you have existing live data from Cloudflare:
> - **D1 to Supabase Postgres**: In your Cloudflare dashboard / Wrangler CLI, export tables using `wrangler d1 export <db-name> --output=backup.sql`. Replace SQLite `INTEGER` primary keys/booleans with PostgreSQL equivalents and import into Supabase SQL Editor.
> - **R2 to Supabase Storage**: Download objects from Cloudflare R2 bucket (`r2://...`) and upload to the Supabase Storage bucket `portfolio-media` under `project-screenshots/` and `series/`.

---

## Owner Studio (`/adminvansh`)

The Owner Studio allows editing:
- **Profile & Positioning**: Name, tagline, intro, about story, approach, skills.
- **Projects**: Project metadata, case studies, problem/research/decisions narrative, feature status.
- **Resume & Services**: Structured JSON editors validated on the server.
- **Images**: Project screenshots upload with instant thumbnail previews.
- **Writing Hut**: Stories, poems, essays, field notes with immediate draft/publish states.
- **Photo Series**: Photo galleries with drag & drop multi-photo uploads.
- **Inbox**: Private messages submitted through the contact form.

### Security Model
- Protected by Supabase Auth and server-side verification using `SUPABASE_OWNER_USER_ID`.
- In production (`NODE_ENV === 'production'`), development cookie bypasses (`lab_local_owner=1`) are strictly disabled.
- Anonymous visitors or non-owner authenticated accounts cannot view messages or modify content.

---

## Deployment to Vercel

### Step 1: Push to GitHub
Initialize a clean GitHub repository and push:
```sh
git init
git add .
git commit -m "feat: migrate whenvanshwrites portfolio to standard Next.js and Supabase"
git branch -M main
git remote add origin https://github.com/<your-username>/whenvanshwrites.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New... → Project**.
2. Select your `whenvanshwrites` repository.
3. **Framework Preset**: Next.js (automatically detected).
4. **Build Command**: `pnpm run build` (or leave default).
5. **Environment Variables**: Add the variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_OWNER_USER_ID`
   - `SUPABASE_OWNER_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` (initially your `https://<project-name>.vercel.app`)
6. Click **Deploy**.

> [!IMPORTANT]
> **Hosting Plan Eligibility Notice (Vercel & is-a.dev)**:
> - **Vercel Hobby Plan**: Personal and non-commercial portfolios are permitted. If your site offers commercial freelance contracts or business agency services for profit, Vercel's Terms of Service recommend a Pro plan.
> - **is-a.dev Policy**: Subdomains under `is-a.dev` are free for personal developer portfolios and open-source software projects. The repository requires confirming that the site is personal/developer-focused and not an e-commerce commercial business.
> - All existing freelance and services content in your portfolio is preserved intact.

---

## Connecting Custom Domain (`whenvanshwrites.is-a.dev`)

The subdomain `whenvanshwrites.is-a.dev` has been checked and is **currently available**.

### Step 1: Add Domain in Vercel Dashboard
1. Go to your Vercel Project → **Settings → Domains**.
2. Enter `whenvanshwrites.is-a.dev` and click **Add**.
3. Choose **"No redirect"** (do NOT redirect to `www.whenvanshwrites.is-a.dev`).
4. Vercel will display the required DNS configuration:
   - Target: `cname.vercel-dns.com`
   - *If verification is requested*: Look for the TXT record on `_vercel.whenvanshwrites.is-a.dev` containing `vc-domain-verify=whenvanshwrites.is-a.dev,...`. Copy this exact value.

### Step 2: Submit Pull Request to `is-a-dev/register`
1. Fork [is-a-dev/register](https://github.com/is-a-dev/register).
2. Copy the pre-configured file from [`is-a-dev-registration/domains/whenvanshwrites.json`](file:///c:/Users/bhati/Downloads/whenvanshwrites-complete-source/whenvanshwrites/is-a-dev-registration/domains/whenvanshwrites.json) into the `domains/` folder of your fork.
   - Replace `INSERT_YOUR_GITHUB_USERNAME` with your GitHub username.
3. If Vercel requested a TXT verification record:
   - Also add [`is-a-dev-registration/domains/_vercel.whenvanshwrites.json`](file:///c:/Users/bhati/Downloads/whenvanshwrites-complete-source/whenvanshwrites/is-a-dev-registration/domains/_vercel.whenvanshwrites.json) with your exact `vc-domain-verify=...` string.
4. Submit a Pull Request to `is-a-dev/register` using the pre-filled template in [`is-a-dev-registration/PULL_REQUEST.md`](file:///c:/Users/bhati/Downloads/whenvanshwrites-complete-source/whenvanshwrites/is-a-dev-registration/PULL_REQUEST.md).

### Step 3: Propagation & Verification
- Once the `is-a.dev` maintainers review and merge your PR, DNS records typically propagate within 5–30 minutes.
- Vercel will automatically detect the CNAME, issue an SSL certificate, and mark the domain as **Valid Configuration**.
- Update `NEXT_PUBLIC_SITE_URL` in Vercel to `https://whenvanshwrites.is-a.dev`.
- In Supabase Dashboard → **Authentication → URL Configuration**, add `https://whenvanshwrites.is-a.dev/adminvansh` to your **Redirect URLs**.

---

## Test Suite & Verification

Run the full validation suite:
```sh
# Typecheck
pnpm run typecheck

# Game Physics & Rally Engine
pnpm run test:game

# Supabase Permissions & Content API
pnpm run test:portfolio

# Production Build
pnpm run build
```
All tests verify that anonymous visitors cannot access owner operations, game mechanics run with 120Hz consistency, and Next.js builds clean static & dynamic pages with Turbopack.
