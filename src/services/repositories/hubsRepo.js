import { supabase, hasSupabase } from '../supabaseClient'

/** Fetch hub definitions for the 3D globe markers. */
export async function fetchHubs() {
  if (!hasSupabase || !supabase) return null

  const { data, error } = await supabase
    .from('hubs')
    .select('id, city, region, lat, lng, themes, signals, pin')
    .order('id', { ascending: true })

  if (error) throw error
  return (data || []).map((h) => ({
    id: h.id,
    city: h.city,
    region: h.region,
    lat: h.lat,
    lng: h.lng,
    themes: h.themes || [],
    signals: h.signals || [],
    pin: h.pin || null,
  }))
}
