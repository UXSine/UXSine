import { MOAB_RACE_GAIN_FT } from '../data/trainingPlan'

// Visual bar showing a trail's elevation gain relative to Moab's 1,500 ft race gain.
// Scale tops out at 200% of Moab so the reference marker sits at the midpoint.
export default function MoabGainBar({ elevationGain, moabGainPct, phase, showGainLabel = true }) {
  const barColor = phase === 'Taper' ? 'bg-sky' : moabGainPct >= 100 ? 'bg-crimson' : 'bg-canyon'
  const fillPct = Math.min((moabGainPct / 200) * 100, 100)
  const markerPct = 50

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        {showGainLabel ? (
          <span className="text-sm font-display font-bold text-bark">{elevationGain.toLocaleString()} ft gain</span>
        ) : (
          <span />
        )}
        <span className="label-caption">{moabGainPct}% of Moab</span>
      </div>
      <div className="relative h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${fillPct}%` }} />
        <div className="absolute top-0 h-full w-px bg-bark/30" style={{ left: `${markerPct}%` }} />
      </div>
      <div className="relative h-4 mt-1">
        <span
          className="absolute text-[10px] text-muted font-body whitespace-nowrap"
          style={{ left: `${markerPct}%`, transform: 'translateX(-50%)' }}
        >
          Moab: {MOAB_RACE_GAIN_FT.toLocaleString()} ft
        </span>
      </div>
    </div>
  )
}
