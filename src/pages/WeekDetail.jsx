import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react'
import PhaseBadge from '../components/PhaseBadge'
import TrailInfoBox from '../components/TrailInfoBox'
import DayCard from '../components/DayCard'
import { getWeek } from '../data/trainingPlan'
import { useWorkoutLog } from '../hooks/useWorkoutLog'

export default function WeekDetail() {
  const { weekNumber } = useParams()
  const num = Number(weekNumber)
  const { getLog, upsertLog } = useWorkoutLog()

  if (!Number.isInteger(num) || num < 1 || num > 10) {
    return <Navigate to="/week/1" replace />
  }

  const week = getWeek(num)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caption">Week {week.weekNumber} of 10 · {week.phase}</p>
          <h1 className="text-2xl font-display font-bold text-bark mt-0.5">{week.title}</h1>
        </div>
        <PhaseBadge badge={week.badge} />
      </div>

      <TrailInfoBox week={week} />

      {(week.weekNumber === 2 || week.weekNumber === 5) && (
        <div className="flex items-start gap-2.5 rounded-card border border-sky/30 bg-sky/10 px-3.5 py-3">
          <Stethoscope size={18} strokeWidth={1.5} className="text-sky mt-0.5 shrink-0" />
          <p className="text-sm text-bark">
            <span className="font-display font-bold text-sky">Knee check-in:</span> how have your knees felt the
            last couple weeks? If you're noticing soreness creeping in, this is a good week to dial back and add
            extra mobility work.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {week.days.map((day) => (
          <DayCard key={day.dayName} weekNumber={week.weekNumber} day={day} log={getLog(week.weekNumber, day.dayName)} onSaveLog={upsertLog} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        {week.weekNumber > 1 ? (
          <Link
            to={`/week/${week.weekNumber - 1}`}
            className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-widest text-canyon"
          >
            <ChevronLeft size={14} strokeWidth={1.5} /> Previous Week
          </Link>
        ) : (
          <span />
        )}
        {week.weekNumber < 10 ? (
          <Link
            to={`/week/${week.weekNumber + 1}`}
            className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-widest text-canyon"
          >
            Next Week <ChevronRight size={14} strokeWidth={1.5} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
