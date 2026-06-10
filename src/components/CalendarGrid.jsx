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
    <section className="calendar-card">
      <div className="card-header">
        <h2 className="card-title serif">Your progress</h2>
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
          <div className="legend-dot" data-state="complete" />
          Complete
        </div>
        <div className="legend-item">
          <div className="legend-dot" data-state="partial" />
          Partial
        </div>
        <div className="legend-item">
          <div className="legend-dot" data-state="missed" />
          Missed
        </div>
        <div className="legend-item">
          <div className="legend-dot" data-state="today" />
          Today
        </div>
        <div className="legend-item">
          <div className="legend-dot" data-state="future" />
          Upcoming
        </div>
      </div>
    </section>
  )
}
