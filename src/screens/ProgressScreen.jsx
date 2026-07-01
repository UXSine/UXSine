import { useEffect, useState } from 'react'
import { CaretRight, Barbell, ForkKnife, Image, BookOpen } from '@phosphor-icons/react'
import { TASK_ICONS, Check } from '../data/icons'
import {
  TASK_DEFS,
  JOURNAL_TASK_DEF,
  getActiveTasks,
  isTaskDone,
  isComplete,
  countDone,
  dateForDay,
  emptyDayLog,
  computeStreak,
} from '../data/model'

function dayStatus(state, day, dayNum, activeTasks) {
  if (day > dayNum) return 'future'
  if (day === dayNum) return 'today'
  const date = dateForDay(state.challenge.startDate, day)
  const log = state.days[date]
  if (isComplete(log, activeTasks)) return 'complete'
  if (countDone(log, activeTasks) > 0) return 'partial'
  return 'missed'
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const DETAIL_LINKS = [
  { key: 'workoutHistory', label: 'Workout history', icon: Barbell },
  { key: 'dietStreak', label: 'Diet streak', icon: ForkKnife },
  { key: 'beforeAfter', label: 'Before & after', icon: Image },
  { key: 'bookLibrary', label: 'Book library', icon: BookOpen },
]

export default function ProgressScreen({ state, dayNum, focusDay, onOpenDetail, onEditPastTask, onClearFocusDay }) {
  const [view, setView] = useState('day')
  const [selectedDay, setSelectedDay] = useState(focusDay ?? dayNum)

  useEffect(() => {
    if (focusDay != null) {
      setSelectedDay(focusDay)
      onClearFocusDay?.()
    }
  }, [focusDay])

  const activeTasks = getActiveTasks(state)
  const selectedDate = dateForDay(state.challenge.startDate, selectedDay)
  const selectedLog = state.days[selectedDate]

  const completedDays = Object.values(state.days).filter((d) => isComplete(d, activeTasks)).length
  const streak = computeStreak(state)
  const completionPct = dayNum > 0 ? Math.round((completedDays / dayNum) * 100) : 0

  const habitPercents = activeTasks.map((def) => {
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
              const status = dayStatus(state, d, dayNum, activeTasks)
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

          {selectedDay < dayNum ? (
            <div className="task-list">
              {activeTasks.map((def) => {
                const Icon = TASK_ICONS[def.icon]
                const log = selectedLog || emptyDayLog(selectedDate)
                const done = isTaskDone(log, def.key)
                return (
                  <button
                    key={def.key}
                    className={`task-row${done ? ' task-row--done' : ''}`}
                    onClick={() => onEditPastTask(def.key, selectedDate, selectedDay)}
                  >
                    <div className="task-row__icon"><Icon size={20} weight="regular" /></div>
                    <div className="task-row__body">
                      <div className={`task-name${done ? ' task-name--done' : ''}`}>{def.label}</div>
                    </div>
                    <div className={`task-check${done ? ' task-check--done' : ''}`}>
                      {done
                        ? <Check size={14} weight="bold" />
                        : <CaretRight size={14} weight="bold" color="var(--color-text-tertiary)" />}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : selectedLog ? (
            <div className="task-list">
              {activeTasks.map((def) => {
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
            <p className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>No tasks yet.</p>
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

          <div>
            <div className="section-header">Details</div>
            <div className="task-list">
              {DETAIL_LINKS.map(({ key, label, icon: Icon }) => (
                <button className="task-row" key={key} onClick={() => onOpenDetail(key)}>
                  <div className="task-row__icon"><Icon size={20} weight="regular" /></div>
                  <div className="task-row__body">
                    <div className="task-name">{label}</div>
                  </div>
                  <CaretRight size={16} weight="bold" color="var(--color-text-tertiary)" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
