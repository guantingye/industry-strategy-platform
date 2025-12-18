import { supabase, hasSupabase } from '../supabaseClient'

const parseMaybeJson = (v, fallback) => {
  if (v == null) return fallback
  if (typeof v === 'string') {
    try {
      return JSON.parse(v)
    } catch {
      return fallback
    }
  }
  return v
}

const asArray = (v) => (Array.isArray(v) ? v : [])

export async function fetchInsights() {
  if (!hasSupabase || !supabase) return null

  const { data, error } = await supabase
    .from('insights')
    .select('id, date, kicker, title, subtitle, tags, hero_image_url, support_image_url, takeaways, sections, signals, sources')
    .order('date', { ascending: false })

  if (error) throw error

  return (data || []).map((r) => {
    const takeaways = asArray(parseMaybeJson(r.takeaways, []))
    const sections = asArray(parseMaybeJson(r.sections, []))
    const signals = asArray(parseMaybeJson(r.signals, []))
    const sourcesRaw = asArray(parseMaybeJson(r.sources, []))

    // 統一 sources 欄位命名
    const sources = sourcesRaw
      .map((s) => {
        if (!s) return null
        const href = s.href || s.url
        const label = s.label || s.title
        if (!href || !label) return null
        return { label, href }
      })
      .filter(Boolean)

    return {
      id: r.id,
      date: r.date,
      kicker: r.kicker || '',
      title: r.title,
      subtitle: r.subtitle,
      tags: asArray(r.tags),
      heroImage: r.hero_image_url || '',
      supportImage: r.support_image_url || '',
      takeaways,
      sections,
      signals,
      sources,
    }
  })
}
