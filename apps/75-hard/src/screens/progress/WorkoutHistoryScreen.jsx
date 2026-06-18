import { Barbell, Sun } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { dateForDay, WORKOUT_GOAL_MIN } from '../../data/model'

const TYPE_LABELS = {
  weights: 'Weights',
  running: 'Running',
  yoga: 'Yoga',
  walk: 'Walk',
  hike: 'Hike',
  other: 'Other',
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function WorkoutHistoryScreen({ state, dayNum, onBack }) {
  const entries = []
  let totalMinutes = 0
  let totalSessions = 0

  for (let d = dayNum; d >= 1; d--) {
    const date = dateForDay(state.challenge.startDate, d)
    const log = state.days[date]
    if (!log) continue
    for (const key of ['workout1', 'workout2']) {
      const w = log.tasks?.[key]
      if (w && w.durationMinutes > 0) {
        totalMinutes += w.durationMinutes
        totalSessions++
        entries.push({ day: d, date, key, ...w })
      }
    }
  }

  return (
    <div className="screen screen--full">
      <DetailHeader title="Workout history" onBack={onBack} />

      <div className="card stat-row">
        <div className="stat-tile">
          <span className="stat-tile__value serif">{totalSessions}</span>
          <span className="stat-tile__label">sessions</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{totalMinutes}</span>
          <span className="stat-tile__label">total minutes</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{Math.round(totalMinutes / 60)}</span>
          <span className="stat-tile__label">hours</span>
        </div>
      </div>

      <div>
        <div className="section-header">Sessions</div>
        {entries.length > 0 ? (
          <div className="task-list">
            {entries.map((e) => {
              const Icon = e.key === 'workout2' ? Sun : Barbell
              const done = e.durationMinutes >= WORKOUT_GOAL_MIN
              return (
                <div className={`task-row${done ? ' task-row--done' : ''}`} key={`${e.date}-${e.key}`}>
                  <div className="task-row__icon"><Icon size={20} weight="regular" /></div>
                  <div className="task-row__body">
                    <div className={`task-name${done ? ' task-name--done' : ''}`}>
                      {TYPE_LABELS[e.type] || 'Workout'}{e.isOutdoor ? ' · Outdoor' : ''}
                    </div>
                    <div className="task-meta">Day {e.day} · {formatDate(e.date)}</div>
                  </div>
                  <div className="task-meta">{e.durationMinutes} min</div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>No workouts logged yet.</p>
        )}
      </div>
    </div>
  )
}
