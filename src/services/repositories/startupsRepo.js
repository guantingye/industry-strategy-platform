import { supabase, hasSupabase } from '../supabaseClient'

function toUiRow(r) {
  return {
    Date: r?.date ?? '',
    Company: r?.company ?? '',
    Sector: r?.sector ?? '',
    Founders_Background: r?.founders_background ?? '',
    The_Moat: r?.the_moat ?? '',
    Business_Model: r?.business_model ?? '',
    Funding_Status: r?.funding_status ?? '',
    Key_Risks: r?.key_risks ?? '',
    Verdict: r?.verdict ?? '',
  }
}

/**
 * Fetch startups from Supabase.
 * Returns UI-contract rows (same keys as the seed JSON) to keep the table renderer unchanged.
 */
export async function fetchStartups() {
  if (!hasSupabase || !supabase) return null

  const { data, error } = await supabase
    .from('startups')
    .select(
      'date, company, sector, founders_background, the_moat, business_model, funding_status, key_risks, verdict'
    )
    .order('date', { ascending: false })
    .limit(1000)

  if (error) throw error
  return (data || []).map(toUiRow)
}
