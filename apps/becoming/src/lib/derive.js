// Pure, side-effect-free domain logic. Everything the UI claims about a number
// is computed here so the mechanism is inspectable (Principle 2: show your work).

export const GRADUATION_THRESHOLD = 85 // automaticity score, per Layer 4 copy
export const THRESHOLDS = [50, 75, 90] // register-flex celebration crossings

// Typical plateau range (pulse instances). Lally et al. (2010) found the plateau
// of automaticity anywhere from ~18 to ~254 days — we render a band, not a point.
export const PLATEAU_BAND = { lo: 18, hi: 66 }

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

// SRBAI: 4 items, each 1–5. Map the mean to a 0–100 automaticity score.
export function pulseScore(items) {
  if (!items || items.length === 0) return 0
  const mean = items.reduce((a, b) => a + b, 0) / items.length
  return Math.round(((mean - 1) / 4) * 100)
}

// The automaticity curve is the sequence of pulse scores, x-axis = pulse index
// (NOT calendar days — that's what keeps a miss from reading as a gap).
export function automaticitySeries(pulses) {
  return [...(pulses || [])]
    .sort((a, b) => new Date(a.at) - new Date(b.at))
    .map((p, i) => ({ i: i + 1, score: pulseScore(p.items), at: p.at }))
}

export function currentScore(pulses) {
  const s = automaticitySeries(pulses)
  return s.length ? s[s.length - 1].score : null
}

// Phase is derived from data — never from elapsed time alone (Layer 3, #3).
export function phase({ logs = [], pulses = [], paused = false } = {}) {
  const series = automaticitySeries(pulses)
  const last3 = series.slice(-3)
  const graduated =
    last3.length === 3 && last3.every((p) => p.score >= GRADUATION_THRESHOLD)
  if (graduated) return 'graduation'
  if (paused) return 'break'

  const sorted = [...logs].sort((a, b) => (a.date < b.date ? 1 : -1))
  const activity = sorted.length
  if (activity === 0 && series.length === 0) return 'ignition'

  // Re-engaging after a lapse: most recent log is a completion that follows a
  // gap of missed/absent days. Framed as continuation, not restart.
  const last = sorted[0]
  if (last && last.status === 'complete') {
    const prev = sorted[1]
    if (prev && prev.status !== 'complete') return 'decayed-retry'
  }

  if (activity < 4 && (currentScore(pulses) ?? 0) < 40) return 'ignition'
  return 'maintenance'
}

export const PHASE_META = {
  ignition: { label: 'Ignition', meaning: 'Just starting' },
  maintenance: { label: 'Maintenance', meaning: 'Steady state' },
  break: { label: 'Break', meaning: 'Paused — not failed' },
  'decayed-retry': { label: 'Decayed-retry', meaning: 'Re-engaging' },
  graduation: { label: 'Graduation', meaning: 'Earned transition' },
}

export function todayLog(logs, key = todayKey()) {
  return (logs || []).find((l) => l.date === key) || null
}

export const ATTRIBUTIONS = [
  'traveled',
  'got sick',
  'forgot',
  'chose not to',
  'overwhelmed',
]
