import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabase = Boolean(url && anon)

// Client used in the browser.
// - Keep it READ-ONLY (SELECT) via RLS policies.
// - Writes should be done with a service role key from a trusted environment.
export const supabase = hasSupabase
  ? createClient(url, anon, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'strategy-intelligence-platform',
        },
      },
    })
  : null
