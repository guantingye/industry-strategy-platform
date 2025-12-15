# Strategy Intelligence Platform (Vite + React + Tailwind)

A clean, VC-style, 3-page dashboard:
- **Home**: 3D Earth + global hub markers
- **Industry Strategy Insights**: long-form analysis chapters
- **Startup Observatory**: searchable company table + analyst notes

This version adds:
- **Supabase-ready DB layer** (tables: `startups`, `insights`, `hubs`)
- **Optional “DB first / seed fallback” mode** (no UI changes required)
- **RWD/mobile support** (desktop layout preserved)

---

## 1) Local dev

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
npm run preview
```

---

## 2) Supabase integration

### 2.1 Create tables + policies

1. Create a Supabase project
2. Open **SQL Editor**
3. Run: `supabase/schema.sql`

This creates:
- `public.startups`
- `public.insights`
- `public.hubs`

RLS is enabled:
- **Anon key** can **SELECT only**
- writes are intended via **service role key** (trusted scripts / server)

### 2.2 Seed initial content (includes 201 startups)

This repo includes seed data:
- `supabase/seeds/startups.json`  ← 201 rows (from `deep_vc_database_updated_20251215.xlsx`)
- `supabase/seeds/hubs.json`      ← hub markers
- `src/data/insights.js`          ← insights chapters (used as seed source)

Run the seed script locally (uses **service role key**):

```bash
SUPABASE_URL="https://YOUR_PROJECT.supabase.co" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" npm run seed:supabase
```

Expected output:
- `✓ hubs: 8`
- `✓ insights: 5`
- `✓ startups: 201`

---

## 3) Deploy to Vercel

In Vercel → Project → Settings → Environment Variables:

- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

Then deploy.

**Note:** the front-end only performs `SELECT` queries (read-only).

---

## 4) How data is loaded in the UI

Each page loads from Supabase **if env vars exist**, otherwise it falls back to local seed data:

- Home: `fetchHubs()` → fallback: `src/data/hubs.js`
- Insights: `fetchInsights()` → fallback: `src/data/insights.js`
- Startups: `fetchStartups()` → fallback: `src/data/startups.seed.json`

---

## 5) DB schema (field mapping)

### startups
DB columns (snake_case) → UI keys (original table renderer)

- `date` → `Date`
- `company` → `Company`
- `sector` → `Sector`
- `founders_background` → `Founders_Background`
- `the_moat` → `The_Moat`
- `business_model` → `Business_Model`
- `funding_status` → `Funding_Status`
- `key_risks` → `Key_Risks`
- `verdict` → `Verdict`

### insights
- `tags` is `text[]`
- `takeaways`, `sections`, `signals`, `sources` are `jsonb` (arrays)

### hubs
- `themes`, `signals` are `jsonb` arrays
- `pin` is `jsonb` (optional; currently not required by the 3D globe)

---

## 6) Project structure

```
src/
  components/
  data/                 # local seeds + templates
  pages/                # Home / Insights / Startups
  services/
    supabaseClient.js
    repositories/
      hubsRepo.js
      insightsRepo.js
      startupsRepo.js
supabase/
  schema.sql
  seeds/
scripts/
  seed-supabase.mjs
```
