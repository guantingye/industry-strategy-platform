import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Optional: reuse in-app seed content for insights (keeps UI + DB perfectly aligned).
import { INSIGHTS } from '../src/data/insights.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRole) {
  console.error(
    [
      'Missing env vars.',
      'Required:',
      '  - SUPABASE_URL (or VITE_SUPABASE_URL)',
      '  - SUPABASE_SERVICE_ROLE_KEY',
      '',
      'Example (macOS/Linux):',
      '  SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." npm run seed:supabase',
    ].join('\n')
  )
  process.exit(1)
}

const supabase = createClient(url, serviceRole)

function readJson(rel) {
  const p = path.join(__dirname, '..', rel)
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function toDateOrNull(s) {
  if (!s) return null
  // Keep YYYY-MM-DD
  return String(s).slice(0, 10)
}

async function upsertInChunks(table, rows, onConflict, size = 50) {
  let total = 0
  for (const part of chunk(rows, size)) {
    const { error, data } = await supabase.from(table).upsert(part, { onConflict })
    if (error) throw error
    total += (data?.length ?? part.length)
  }
  return total
}

async function main() {
  console.log('Seeding Supabase…')

  // 1) Hubs
  const hubs = readJson('supabase/seeds/hubs.json')
  const hubsRows = hubs.map((h) => ({
    id: h.id,
    city: h.city,
    region: h.region,
    lat: h.lat,
    lng: h.lng,
    pin: h.pin ?? null,
    themes: h.themes ?? [],
    signals: h.signals ?? [],
  }))
  await upsertInChunks('hubs', hubsRows, 'id', 50)
  console.log(`✓ hubs: ${hubsRows.length}`)

  // 2) Insights (from src/data/insights.js to keep in sync with UI)
  const insightsRows = INSIGHTS.map((it) => ({
    id: it.id,
    date: toDateOrNull(it.date),
    kicker: it.kicker ?? '',
    title: it.title,
    subtitle: it.subtitle ?? '',
    tags: it.tags ?? [],
    hero_image_url: it.heroImage ?? '',
    support_image_url: it.supportImage ?? '',
    takeaways: it.takeaways ?? [],
    sections: it.sections ?? [],
    signals: it.signals ?? [],
    sources: it.sources ?? [],
  }))
  await upsertInChunks('insights', insightsRows, 'id', 20)
  console.log(`✓ insights: ${insightsRows.length}`)

  // 3) Startups
  const startups = readJson('supabase/seeds/startups.json')
  const startupsRows = startups.map((r) => ({
    date: toDateOrNull(r.date),
    company: r.company,
    sector: r.sector ?? '',
    founders_background: r.founders_background ?? '',
    the_moat: r.the_moat ?? '',
    business_model: r.business_model ?? '',
    funding_status: r.funding_status ?? '',
    key_risks: r.key_risks ?? '',
    verdict: r.verdict ?? '',
  }))
  await upsertInChunks('startups', startupsRows, 'company', 50)
  console.log(`✓ startups: ${startupsRows.length}`)

  console.log('Done.')
}

main().catch((err) => {
  console.error('Seed failed:', err?.message || err)
  process.exit(1)
})
