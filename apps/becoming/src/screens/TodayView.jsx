import PhaseGlyph from '../components/PhaseGlyph'
import { PHASE_META } from '../lib/derive'

// Today view — designed as a widget, not a screen, because for most sessions it
// IS the screen. One card, one primary tap target, one line of context. No day
// count (streak-free); context comes from automaticity instead.

function State({ status }) {
  // The single large affordance. State by shape + fill only, never hue.
  const size = 132
  const c = size / 2
  const r = size * 0.42
  const sw = 3
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {status === 'complete' && <circle cx={c} cy={c} r={r} fill="#17130E" />}
      {status !== 'complete' && (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#17130E" strokeWidth={sw} />
      )}
      {status === 'paused' && (
        <line
          x1={c - r * 0.5}
          y1={c}
          x2={c + r * 0.5}
          y2={c}
          stroke="#17130E"
          strokeWidth={sw}
          strokeLinecap="round"
        />
      )}
      {status === 'complete' && (
        <path
          d={`M ${c - r * 0.42} ${c + r * 0.02} l ${r * 0.28} ${r * 0.3} l ${r * 0.55} ${-r * 0.6}`}
          fill="none"
          stroke="#F4F1EA"
          strokeWidth={sw + 1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export default function TodayView({ identity, phase, status, score, onComplete, onMiss }) {
  const done = status === 'complete'
  const context =
    score != null
      ? `Automaticity ${score} — it holds steadier than a streak.`
      : 'Your first pulse will start the automaticity curve.'

  return (
    <div className="min-h-full bg-ink cloth flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-paper rounded-widget px-7 py-10 flex flex-col items-center text-center shadow-[0_1px_0_rgba(244,241,234,0.06)]">
        <div className="flex items-center gap-2 mb-8 self-start">
          <PhaseGlyph phase={phase} size={18} />
          <span className="eyebrow text-ink/55">{PHASE_META[phase]?.label}</span>
        </div>

        <h1 className="font-display text-[26px] leading-[1.25] text-ink mb-1">
          I’m someone who
          <br />
          <span className="italic">{identity}</span>
        </h1>

        <button
          onClick={done ? undefined : onComplete}
          className="my-8 active:scale-[0.97] structural"
          aria-label={done ? 'Completed today' : 'Mark today complete'}
        >
          <State status={status} />
        </button>

        <p className="font-body text-ink/70 text-[15px] leading-relaxed tabular max-w-[16rem]">
          {done ? 'Logged for today. Nothing else needed.' : context}
        </p>
      </div>

      {!done && status !== 'paused' && (
        <button
          onClick={onMiss}
          className="mt-6 eyebrow text-pearl/55 hover:text-pearl/80 structural py-2"
        >
          Didn’t happen today
        </button>
      )}
    </div>
  )
}
