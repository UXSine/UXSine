import { Sun } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { WORKOUT_GOAL_MIN } from '../../data/model'

const TYPES = [
  { key: 'weights', label: 'Weights' },
  { key: 'running', label: 'Running' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'walk', label: 'Walk' },
  { key: 'hike', label: 'Hike' },
  { key: 'other', label: 'Other' },
]

const DURATION_STEP = 5

export default function WorkoutTaskScreen({ dayLog, taskKey, isOutdoor, title, onUpdate, onBack }) {
  const entry = dayLog.tasks[taskKey] || { type: 'weights', isOutdoor, durationMinutes: 0, notes: '' }

  const update = (patch) => onUpdate({ [taskKey]: { ...entry, isOutdoor, ...patch } })

  const setDuration = (mins) => update({ durationMinutes: Math.max(0, mins) })
  const done = entry.durationMinutes >= WORKOUT_GOAL_MIN

  return (
    <div className="screen screen--full">
      <DetailHeader title={title} onBack={onBack} />

      {isOutdoor && (
        <div className="pill">
          <Sun size={14} weight="fill" /> Must be outside
        </div>
      )}

      <div>
        <div className="section-header">Activity type</div>
        <div className="chip-row">
          {TYPES.map((t) => (
            <button
              key={t.key}
              className={`chip${entry.type === t.key ? ' chip--active' : ''}`}
              onClick={() => update({ type: t.key })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="section-header">Duration</div>
        <div style={{ textAlign: 'center' }}>
          <div className="counter-value">{entry.durationMinutes}<span className="text-body" style={{ color: 'var(--color-text-tertiary)' }}> min</span></div>
          <p className="text-caption" style={{ marginTop: 'var(--space-xs)' }}>Goal: {WORKOUT_GOAL_MIN} min</p>
        </div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-md)' }}>
          <div className="progress-bar__fill" style={{ width: `${Math.min(100, (entry.durationMinutes / WORKOUT_GOAL_MIN) * 100)}%` }} />
        </div>
        <div className="counter-row" style={{ marginTop: 'var(--space-md)' }}>
          <button className="counter-btn" onClick={() => setDuration(entry.durationMinutes - DURATION_STEP)}>−</button>
          <button className="counter-btn" onClick={() => setDuration(entry.durationMinutes + DURATION_STEP)}>+</button>
        </div>
      </div>

      <div>
        <div className="section-header">Notes</div>
        <textarea
          className="text-input"
          rows={3}
          placeholder="What did you do?"
          value={entry.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <button className={`btn-primary${done ? ' btn-cta' : ''}`} onClick={() => setDuration(done ? 0 : WORKOUT_GOAL_MIN)}>
        {done ? 'Goal complete!' : 'Mark as done'}
      </button>
    </div>
  )
}
