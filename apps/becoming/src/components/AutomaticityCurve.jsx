import { GRADUATION_THRESHOLD } from '../lib/derive'

// The automaticity curve — NOT a streak flame. Rendered in midnight (evidence),
// on a paper field. Misses are never marked; only pulse data appears, which is
// the whole point. x-axis = pulse instances, so a miss can't read as a gap.

const MID = '#202B3D'
const INK = '#17130E'

// Catmull-Rom -> cubic bezier for a smooth, non-overshooting line.
function smoothPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`
  }
  return d
}

export default function AutomaticityCurve({ series = [], celebrate = false }) {
  const W = 340
  const H = 200
  const pad = { l: 30, r: 16, t: 16, b: 26 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b

  const maxI = Math.max(series.length, 6)
  const x = (i) => pad.l + ((i - 1) / (maxI - 1)) * iw
  const y = (v) => pad.t + (1 - v / 100) * ih

  const pts = series.map((p) => ({ x: x(p.i), y: y(p.score), ...p }))
  const last = pts[pts.length - 1]

  // "typical plateau range" — honest about variability, not a false single line.
  const bandTop = y(90)
  const bandBottom = y(72)

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`Automaticity curve, currently ${last ? last.score : 0} out of 100`}
      >
        {/* minimal gridlines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(v)}
              y2={y(v)}
              stroke={INK}
              strokeOpacity="0.08"
            />
            <text
              x={pad.l - 6}
              y={y(v) + 3}
              textAnchor="end"
              fill={INK}
              fillOpacity="0.45"
              fontSize="9"
              fontFamily="'IBM Plex Mono', monospace"
            >
              {v}
            </text>
          </g>
        ))}

        {/* typical plateau range band */}
        <rect
          x={pad.l}
          y={bandTop}
          width={iw}
          height={bandBottom - bandTop}
          fill={MID}
          fillOpacity="0.07"
        />
        {/* automatic threshold — the line the curve approaches */}
        <line
          x1={pad.l}
          x2={W - pad.r}
          y1={y(GRADUATION_THRESHOLD)}
          y2={y(GRADUATION_THRESHOLD)}
          stroke={MID}
          strokeWidth="1"
          strokeDasharray="2 3"
          strokeOpacity="0.7"
        />
        <text
          x={W - pad.r}
          y={y(GRADUATION_THRESHOLD) - 4}
          textAnchor="end"
          fill={MID}
          fontSize="8.5"
          fontFamily="'IBM Plex Mono', monospace"
          letterSpacing="0.15em"
        >
          AUTOMATIC
        </text>

        {/* the curve */}
        {pts.length >= 2 && (
          <path
            d={smoothPath(pts)}
            fill="none"
            stroke={MID}
            strokeWidth="2.25"
            strokeLinecap="round"
            className={celebrate ? 'curve-draw' : ''}
          />
        )}

        {/* current position — a single labeled point in ink, tabular numeral */}
        {last && (
          <>
            <circle cx={last.x} cy={last.y} r="4.5" fill={INK} />
            <text
              x={Math.min(last.x, W - pad.r - 18)}
              y={last.y - 10}
              textAnchor="middle"
              fill={INK}
              fontSize="12"
              fontFamily="'IBM Plex Mono', monospace"
              fontWeight="500"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {last.score}
            </text>
          </>
        )}
      </svg>
      <figcaption className="eyebrow text-midnight/70 mt-1 px-1">
        x: pulse instances · misses are never plotted
      </figcaption>

      {celebrate && (
        <style>{`
          .curve-draw {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw 800ms var(--ease-structural) forwards;
          }
          @keyframes draw { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </figure>
  )
}
