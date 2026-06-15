import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { TRAILS, MOAB_RACE_GAIN_FT } from '../data/trainingPlan'
import MoabGainBar from './MoabGainBar'

const TRAIL_ORDER = ['bst', 'cornerCanyon', 'lccCreek', 'redPineLake', 'lakeBlanche', 'silverLake']

export default function TrailLadder() {
  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h2 className="text-lg font-display font-bold text-bark">Trail Ladder</h2>
          <p className="label-caption mt-0.5">All 6 trails vs. Moab's {MOAB_RACE_GAIN_FT.toLocaleString()} ft gain</p>
        </div>
        {open ? <ChevronUp size={20} strokeWidth={1.5} className="text-muted" /> : <ChevronDown size={20} strokeWidth={1.5} className="text-muted" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {TRAIL_ORDER.map((key) => {
            const trail = TRAILS[key]
            const phase = key === 'silverLake' ? 'Taper' : undefined
            return (
              <div key={key}>
                <h3 className="text-sm font-display font-medium text-bark">{trail.trailName}</h3>
                <p className="text-xs text-muted mb-1.5">{trail.trailLocation}</p>
                <MoabGainBar elevationGain={trail.trailElevationGain} moabGainPct={trail.moabGainPct} phase={phase} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
