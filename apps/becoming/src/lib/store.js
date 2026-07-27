import { supabase, hasSupabase, ensureSession } from './supabase'
import { todayKey } from './derive'

// One data API, two backends. The UI never knows which is active.
// localStorage is the default so the deployed app works with zero config;
// setting the Supabase env vars promotes the exact same calls to the backend.

const LS_KEY = 'becoming:v1'
const empty = { woop: null, paused: false, logs: [], pulses: [] }

function readLocal() {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') }
  } catch {
    return { ...empty }
  }
}
function writeLocal(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state))
  return state
}

export const backendName = hasSupabase ? 'Supabase' : 'this device'

export async function init() {
  if (hasSupabase) await ensureSession()
}

export async function load() {
  if (!hasSupabase) return readLocal()

  const user = await ensureSession()
  const [{ data: profile }, { data: logs }, { data: pulses }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('logs').select('*').eq('user_id', user.id),
    supabase.from('pulses').select('*').eq('user_id', user.id),
  ])
  return {
    woop: profile
      ? {
          wish: profile.wish,
          outcome: profile.outcome,
          obstacle: profile.obstacle,
          plan: profile.plan,
          identity: profile.identity,
        }
      : null,
    paused: profile?.paused ?? false,
    logs: (logs || []).map((l) => ({
      date: l.date,
      status: l.status,
      attribution: l.attribution,
      plan_forward: l.plan_forward,
    })),
    pulses: (pulses || []).map((p) => ({ at: p.at, items: p.items })),
  }
}

export async function saveWoop(woop) {
  if (!hasSupabase) {
    const s = readLocal()
    return writeLocal({ ...s, woop })
  }
  const user = await ensureSession()
  await supabase
    .from('profiles')
    .upsert({ user_id: user.id, ...woop, updated_at: new Date().toISOString() })
  return load()
}

export async function setPaused(paused) {
  if (!hasSupabase) {
    const s = readLocal()
    return writeLocal({ ...s, paused })
  }
  const user = await ensureSession()
  await supabase.from('profiles').upsert({ user_id: user.id, paused })
  return load()
}

export async function logToday(status, extra = {}) {
  const date = todayKey()
  const entry = {
    date,
    status,
    attribution: extra.attribution ?? null,
    plan_forward: extra.plan_forward ?? null,
  }
  if (!hasSupabase) {
    const s = readLocal()
    const logs = [...s.logs.filter((l) => l.date !== date), entry]
    return writeLocal({ ...s, logs })
  }
  const user = await ensureSession()
  await supabase
    .from('logs')
    .upsert({ user_id: user.id, ...entry }, { onConflict: 'user_id,date' })
  return load()
}

export async function addPulse(items) {
  const at = new Date().toISOString()
  if (!hasSupabase) {
    const s = readLocal()
    return writeLocal({ ...s, pulses: [...s.pulses, { at, items }] })
  }
  const user = await ensureSession()
  await supabase.from('pulses').insert({ user_id: user.id, at, items })
  return load()
}

export async function resetAll() {
  if (!hasSupabase) return writeLocal({ ...empty })
  const user = await ensureSession()
  await Promise.all([
    supabase.from('logs').delete().eq('user_id', user.id),
    supabase.from('pulses').delete().eq('user_id', user.id),
    supabase.from('profiles').delete().eq('user_id', user.id),
  ])
  return load()
}
