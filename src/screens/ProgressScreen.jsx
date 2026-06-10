import { useState } from 'react'
import { TASK_ICONS, Check } from '../data/icons'
import {
  TASK_DEFS,
  JOURNAL_TASK_DEF,
  isTaskDone,
  isComplete,
  countDone,
  dateForDay,
  computeStreak,
} from '../data/model'

function dayStatus(state, day, dayNum) {
  if (day > dayNum) return 'future'
  if (day === dayNum) return 'today'
  const date = dateForDay(state.challenge.startDate, day)
  const log = state.days[date]
  if (isComplete(log)) return 'complete'
  if (countDone(log) > 0) return 'partial'
  return 'missed'
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const ALL_TASKS = [...TASK_DEFS, JOURNAL_TASK_DEF]

export default function ProgressScreen({ state, dayNum }) {
  const [view, setView] = useState('day')
  const [selectedDay, setSelectedDay] = useState(dayNum)

  const selectedDate = dateForDay(state.challenge.startDate, selectedDay)
  const selectedLog = state.days[selectedDate]

  const completedDays = Object.values(state.days).filter(isComplete).length
  const streak = computeStreak(state)
  const completionPct = dayNum > 0 ? Math.round((completedDays / dayNum) * 100) : 0

  const habitPercents = ALL_TASKS.map((def) => {
    let count = 0
    for (let d = 1; d <= dayNum; d++) {
      const date = dateForDay(state.challenge.startDate, d)
      if (isTaskDone(state.days[date], def.key)) count++
    }
    return { def, pct: dayNum > 0 ? Math.round((count / dayNum) * 100) : 0 }
  })

  const photos = []
  for (let d = 1; d <= dayNum; d++) {
    const date = dateForDay(state.challenge.startDate, d)
    const photo = state.days[date]?.tasks?.photo
    if (photo?.frontUri) photos.push({ day: d, uri: photo.frontUri })
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-header__title">Progress</h1>
      </div>

      <div className="toggle-switch-row">
        <button
          className={`toggle-switch-option${view === 'day' ? ' toggle-switch-option--active' : ''}`}
          onClick={() => setView('day')}
        >
          Day
        </button>
        <button
          className={`toggle-switch-option${view === 'overall' ? ' toggle-switch-option--active' : ''}`}
          onClick={() => setView('overall')}
        >
          Overall
        </button>
      </div>

      {view === 'day' ? (
        <>
          <div className="day-strip">
            {Array.from({ length: 75 }, (_, i) => i + 1).map((d) => {
              const status = dayStatus(state, d, dayNum)
              const numClass = status === 'today' ? ' day-strip-num--today' : status === 'missed' || status === 'partial' || status === 'complete' ? ' day-strip-num--past' : ''
              const dotClass =
                status === 'complete' ? ' day-strip-dot--complete'
                : status === 'partial' ? ' day-strip-dot--partial'
                : status === 'today' ? ' day-strip-dot--today'
                : ''
              return (
                <button key={d} className="day-strip-cell" onClick={() => setSelectedDay(d)}>
                  <div className={`day-strip-num${numClass}${selectedDay === d ? ' day-strip-num--selected' : ''}`}>{d}</div>
                  <div className={`day-strip-dot${dotClass}`} />
                </button>
              )
            })}
          </div>

          <div>
            <div className="home-eyebrow">Day {selectedDay}</div>
            <h2 className="text-title">{formatDate(selectedDate)}</h2>
          </div>

          {selectedLog ? (
            <div className="task-list">
              {ALL_TASKS.map((def) => {
                const Icon = TASK_ICONS[def.icon]
                const done = isTaskDone(selectedLog, def.key)
                return (
                  <div className={`task-row${done ? ' task-row--done' : ''}`} key={def.key}>
                    <div className="task-row__icon"><Icon size={20} weight="regular" /></div>
                    <div className="task-row__body">
                      <div className={`task-name${done ? ' task-name--done' : ''}`}>{def.label}</div>
                    </div>
                    <div className={`task-check${done ? ' task-check--done' : ''}`}>
                      {done && <Check size={14} weight="bold" />}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>No data for this day.</p>
          )}
        </>
      ) : (
        <>
          <div className="card stat-row">
            <div className="stat-tile">
              <span className="stat-tile__value serif">{completedDays}</span>
              <span className="stat-tile__label">days complete</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__value serif">{streak}</span>
              <span className="stat-tile__label">day streak</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__value serif">{completionPct}%</span>
              <span className="stat-tile__label">completion</span>
            </div>
          </div>

          <div>
            <div className="section-header">Habit breakdown</div>
            <div className="card">
              {habitPercents.map(({ def, pct }) => (
                <div className="habit-row" key={def.key}>
                  <span className="task-name" style={{ minWidth: 90 }}>{def.label}</span>
                  <div className="habit-row__bar progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="habit-row__pct">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {photos.length > 0 && (
            <div>
              <div className="section-header">Progress photos</div>
              <div className="photo-thumb-grid">
                {photos.map(({ day, uri }) => (
                  <div className="photo-thumb" key={day}>
                    <img src={uri} alt={`Day ${day}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
