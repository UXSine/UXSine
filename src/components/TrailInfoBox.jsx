import { ExternalLink } from 'lucide-react'
import MoabGainBar from './MoabGainBar'

const DIFFICULTY_STYLES = {
  Easy: 'bg-sage/15 text-sage',
  Moderate: 'bg-canyon/15 text-canyon',
  Hard: 'bg-crimson/15 text-crimson',
}

export default function TrailInfoBox({ week }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-display font-bold text-bark leading-tight">{week.trailName}</h2>
          <p className="text-xs text-muted mt-0.5">{week.trailLocation}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-body font-medium uppercase tracking-widest ${
            DIFFICULTY_STYLES[week.trailDifficulty] || DIFFICULTY_STYLES.Moderate
          }`}
        >
          {week.trailDifficulty}
        </span>
      </div>

      <div className="flex gap-6 my-3">
        <div>
          <span className="text-xl font-display font-bold text-bark">{week.trailMiles}</span>
          <span className="text-xs text-muted ml-1">miles</span>
        </div>
        <div>
          <span className="text-xl font-display font-bold text-bark">{week.trailElevationGain.toLocaleString()}</span>
          <span className="text-xs text-muted ml-1">ft gain</span>
        </div>
      </div>

      <MoabGainBar elevationGain={week.trailElevationGain} moabGainPct={week.moabGainPct} phase={week.phase} showGainLabel={false} />

      <p className="text-sm text-muted mt-3 leading-relaxed">{week.trailNote}</p>

      <a
        href={week.trailAllTrailsUrl}
        target="_blank"
        rel="noreferrer"
        className="btn-primary inline-flex items-center gap-1.5 mt-3"
      >
        View on AllTrails
        <ExternalLink size={14} strokeWidth={1.5} />
      </a>
    </div>
  )
}
