import { Link } from 'react-router-dom'
import { ExternalLink, ArrowRight } from 'lucide-react'
import PhaseBadge from './PhaseBadge'
import MoabGainBar from './MoabGainBar'
import DayGridCell from './DayGridCell'

export default function CurrentWeekCard({ week, getLog, onToggleComplete }) {
  const isPrepWeek = week.weekNumber === 0
  const gridDays = isPrepWeek
    ? week.days.filter((d) => d.dayName !== 'Sunday')
    : week.days.filter((d) => d.dayName !== 'Sunday')
  const sunday = week.days.find((d) => d.dayName === 'Sunday')

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="label-caption">{isPrepWeek ? 'Prep Week' : `Week ${week.weekNumber} of 9`} · {week.phase}</p>
          <h2 className="text-xl font-display font-bold text-bark mt-0.5">{week.title}</h2>
        </div>
        <PhaseBadge badge={week.badge} />
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-1.5">
          <h3 className="text-sm font-display font-medium text-bark">{week.trailName}</h3>
          <span className="text-xs text-muted">{week.trailMiles} mi</span>
        </div>
        <MoabGainBar elevationGain={week.trailElevationGain} moabGainPct={week.moabGainPct} phase={week.phase} />
        <a
          href={week.trailAllTrailsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-widest text-canyon mt-2.5"
        >
          AllTrails <ExternalLink size={12} strokeWidth={1.5} />
        </a>
      </div>

      <p className="label-caption mb-2">This week's training</p>
      <div className={`grid gap-2 mb-3 ${isPrepWeek ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
        {gridDays.map((day) => (
          <DayGridCell
            key={day.dayName}
            day={day}
            completed={!!getLog(week.weekNumber, day.dayName)?.completed}
            onToggle={() => onToggleComplete(week.weekNumber, day.dayName, day)}
          />
        ))}
      </div>

      {sunday && (
        <div className="flex items-center justify-between rounded-card bg-sky/10 px-3 py-2.5 mb-3">
          <span className="text-sm font-body text-sky">
            <span className="font-display font-bold">{sunday.dayName}</span> · {sunday.title}
          </span>
        </div>
      )}

      <Link
        to={`/week/${week.weekNumber}`}
        className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-widest text-canyon"
      >
        View full week <ArrowRight size={12} strokeWidth={1.5} />
      </Link>
    </div>
  )
}
