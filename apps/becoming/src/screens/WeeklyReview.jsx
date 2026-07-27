import { useState } from 'react'
import AutomaticityCurve from '../components/AutomaticityCurve'
import PhaseGlyph from '../components/PhaseGlyph'
import { PHASE_META, GRADUATION_THRESHOLD } from '../lib/derive'

// Weekly review — a data reflection, not a report card. No grade, no pass/fail.
// Shows the automaticity trend + attribution patterns as a mechanism-based
// insight. Also hosts the register-flex A/B toggle (Layer 5): the celebratory
// variant may add motion + warmer copy but shows the SAME number and mechanism.

function insight(logs) {
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)
  const misses = (logs || []).filter((l) => l.status === 'miss' && l.date >= weekAgo)
  if (misses.length === 0) return null
  const counts = {}
  misses.forEach((m) => m.attribution && (counts[m.attribution] = (counts[m.attribution] || 0) + 1))
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  if (!top) return `${misses.length} miss${misses.length > 1 ? 'es' : ''} this week — the curve held; it doesn’t reset.`
  return `“${top[0]}” came up most this week${top[1] > 1 ? ` (${top[1]}×)` : ''}. Automaticity dips a little after a pattern like this — it doesn’t reset.`
}

export default function WeeklyReview({ series, score, phase, logs }) {
  const [celebrate, setCelebrate] = useState(false)
  const meta = PHASE_META[phase]
  const graduated = phase === 'graduation'
  const note = insight(logs)

  const headline = graduated
    ? celebrate
      ? 'Morning training has moved from a practice to a pattern.'
      : `Automaticity has held above ${GRADUATION_THRESHOLD} across your last three check-ins.`
    : celebrate
      ? score != null
        ? `You’re building something real — automaticity is at ${score}.`
        : 'The curve starts with your first pulse.'
      : score != null
        ? `Current automaticity: ${score}. It’s built from your SRBAI pulses, not day counts.`
        : 'No pulses yet — the curve starts with your first one.'

  return (
    <div className="min-h-full bg-paper text-ink px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <PhaseGlyph phase={phase} size={20} />
          <span className="eyebrow text-ink/55">{meta?.label} · {meta?.meaning}</span>
        </div>

        <h1
          className={`font-display text-[24px] leading-[1.3] mb-8 ${graduated ? 'text-gilt' : 'text-ink'}`}
        >
          {headline}
        </h1>

        <div className="bg-flyleaf rounded-card p-5 mb-6">
          <p className="eyebrow text-midnight mb-3">Automaticity curve</p>
          <AutomaticityCurve series={series} celebrate={celebrate} />
        </div>

        {note && (
          <div className="border-l-2 border-midnight/40 pl-4 mb-8">
            <p className="eyebrow text-midnight mb-1.5">This week</p>
            <p className="font-body text-[15px] leading-relaxed text-ink/85">{note}</p>
          </div>
        )}

        {/* Register-flex demo (Layer 5). Both variants stay informational. */}
        <div className="flex items-center justify-between border-t border-ink/10 pt-5">
          <div>
            <p className="eyebrow text-ink/50">Register flex</p>
            <p className="font-body text-[13px] text-ink/55 mt-1">
              {celebrate ? 'Celebratory (B)' : 'Restrained (A)'} — same number, same mechanism
            </p>
          </div>
          <button
            onClick={() => setCelebrate((c) => !c)}
            role="switch"
            aria-checked={celebrate}
            className={`w-12 h-7 rounded-full p-1 structural ${celebrate ? 'bg-garnet' : 'bg-ink/20'}`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-pearl structural ${celebrate ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
