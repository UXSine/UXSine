import { Flame } from '@phosphor-icons/react'
import TaskRow from '../components/TaskRow'
import {
  TASK_DEFS,
  JOURNAL_TASK_DEF,
  countDone,
  isComplete,
  isTaskDone,
  taskMeta,
  computeStreak,
} from '../data/model'
import { getQuoteForDay } from '../data/quotes'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function TodayScreen({ state, dayNum, today, dayLog, onOpenTask }) {
  const done = countDone(dayLog)
  const total = TASK_DEFS.length
  const allDone = isComplete(dayLog)
  const streak = computeStreak(state)
  const quote = getQuoteForDay(dayNum)
  const overallProgress = Math.round((dayNum / 75) * 100)

  const name = state.profile?.name

  return (
    <div className="screen">
      <div className="home-header">
        <div>
          {name && <p className="text-caption" style={{ marginBottom: 'var(--space-xs)' }}>Hi, {name}</p>}
          <div className="home-eyebrow">Day {dayNum} of 75</div>
          <div className="home-day-number">{dayNum}</div>
          <div className="home-date">{formatDate(today)}</div>
        </div>
        {streak > 0 && (
          <div className="streak-badge">
            <Flame size={14} weight="fill" />
            {streak} day{streak === 1 ? '' : 's'}
          </div>
        )}
      </div>

      <div className="home-progress">
        <div className="home-progress__label">
          <span>{done} of {total} habits done</span>
          <span>{overallProgress}% of challenge</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      {allDone ? (
        <div className="done-banner">Day {dayNum} complete — well done.</div>
      ) : (
        <div className="quote-block">
          <p className="quote-block__text">{quote.text}</p>
          <p className="quote-block__attribution">{quote.author}</p>
        </div>
      )}

      <div>
        <div className="section-header">Today's tasks</div>
        <div className="task-list">
          {TASK_DEFS.map((def) => (
            <TaskRow
              key={def.key}
              def={def}
              done={isTaskDone(dayLog, def.key)}
              meta={taskMeta(dayLog, def.key)}
              onClick={() => onOpenTask(def.key)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="section-header">Reflect</div>
        <div className="task-list">
          <TaskRow
            def={JOURNAL_TASK_DEF}
            done={isTaskDone(dayLog, 'journal')}
            meta={taskMeta(dayLog, 'journal')}
            onClick={() => onOpenTask('journal')}
          />
        </div>
      </div>
    </div>
  )
}
