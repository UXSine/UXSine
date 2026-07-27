// Phase glyphs — one family, differentiated by fill and form, never by hue,
// so no phase reads as "the bad one". Graduation is the sole gilt surface.

const INK = '#17130E'
const GILT = '#A8894F'

export default function PhaseGlyph({ phase, size = 22 }) {
  const s = size
  const c = s / 2
  const r = s * 0.38
  const stroke = Math.max(1.5, s * 0.09)
  const common = { width: s, height: s, viewBox: `0 0 ${s} ${s}`, 'aria-hidden': true }

  switch (phase) {
    case 'ignition': // outline circle, low fill
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={r} fill={INK} opacity="0.12" />
          <circle cx={c} cy={c} r={r} fill="none" stroke={INK} strokeWidth={stroke} />
        </svg>
      )
    case 'maintenance': // filled circle
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={r} fill={INK} />
        </svg>
      )
    case 'break': // circle with a horizontal dash — paused, not failed
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={INK} strokeWidth={stroke} />
          <line
            x1={c - r * 0.55}
            y1={c}
            x2={c + r * 0.55}
            y2={c}
            stroke={INK}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      )
    case 'decayed-retry': // circle with a small return-arrow
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={INK} strokeWidth={stroke} />
          <path
            d={`M ${c + r * 0.5} ${c - r * 0.15} A ${r * 0.5} ${r * 0.5} 0 1 0 ${c + r * 0.5} ${c + r * 0.35}`}
            fill="none"
            stroke={INK}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${c + r * 0.5} ${c - r * 0.5} L ${c + r * 0.5} ${c - r * 0.05} L ${c + r * 0.9} ${c - r * 0.2}`}
            fill="none"
            stroke={INK}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'graduation': // concentric seal mark, gilt — earned
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={GILT} strokeWidth={stroke} />
          <circle cx={c} cy={c} r={r * 0.55} fill={GILT} />
        </svg>
      )
    default:
      return null
  }
}
