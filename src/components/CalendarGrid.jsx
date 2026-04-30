import { isComplete, countDone } from '../App'

function getCellState(dayIndex, startDate, days, today, currentDay) {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + dayIndex)
  const dateStr = d.toISOString().split('T')[0]

  if (dateStr === today) return 'today'

  const dayNum = dayIndex + 1
  if (dayNum > currentDay) return 'future'

  const dayData = days[dateStr]
  if (isComplete(dayData)) return 'complete'
  if (countDone(dayData) > 0) return 'partial'
  return 'missed'
}

export default function CalendarGrid({ startDate, days, today, currentDay }) {
  const completedCount = Object.values(days).filter(isComplete).length

  return (
    <div className="calendar-card">
      <div className="card-header">
        <div className="card-title">75-Day Progress</div>
        <div className="card-stat">
          <strong>{completedCount}</strong> / 75 days
        </div>
      </div>

      <div className="day-grid">
        {Array.from({ length: 75 }, (_, i) => {
          const state = getCellState(i, startDate, days, today, currentDay)
          return (
            <div className="day-cell" key={i} data-state={state}>
              <span className="day-num-label">{i + 1}</span>
            </div>
          )
        })}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--success)' }} />
          Complete
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--amber)' }} />
          Partial
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--danger)', opacity: 0.55 }} />
          Missed
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--primary)', border: '1.5px solid var(--primary)' }} />
          Today
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--surface-2)', opacity: 0.3 }} />
          Upcoming
        </div>
      </div>
    </div>
  )
}
