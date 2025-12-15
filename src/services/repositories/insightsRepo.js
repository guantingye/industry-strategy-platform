import { supabase, hasSupabase } from '../supabaseClient'

/** Fetch insight chapters (DB-ready content model). */
export async function fetchInsights() {
  if (!hasSupabase || !supabase) return null

  const { data, error } = await supabase
    .from('insights')
    .select(
      'id, date, kicker, title, subtitle, tags, hero_image_url, support_image_url, takeaways, sections, signals, sources'
    )
    .order('date', { ascending: false })

  if (error) throw error

  return (data || []).map((r) => ({
    id: r.id,
    date: r.date,
    kicker: r.kicker || '',
    title: r.title,
    subtitle: r.subtitle,
    tags: r.tags || [],
    heroImage: r.hero_image_url || '',
    supportImage: r.support_image_url || '',
    takeaways: r.takeaways || [],
    sections: r.sections || [],
    signals: r.signals || [],
    sources: r.sources || [],
  }))
}
