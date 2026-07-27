import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app runs fully on localStorage until these are set; adding them flips the
// same code path onto Supabase with no other changes (see store.js).
export const hasSupabase = Boolean(url && anonKey)

export const supabase = hasSupabase
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

// Each device gets an anonymous auth user so Row-Level Security (auth.uid())
// has something to scope rows to. No email/password in v1.
export async function ensureSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session.user
  const { data: signed, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signed.user
}
