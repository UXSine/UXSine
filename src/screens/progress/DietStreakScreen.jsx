import DetailHeader from '../../components/DetailHeader'
import { dateForDay, isTaskDone } from '../../data/model'

export default function DietStreakScreen({ state, dayNum, onBack }) {
  let currentStreak = 0
  let longestStreak = 0
  let runningStreak = 0
  let totalDone = 0

  for (let d = 1; d <= dayNum; d++) {
    const date = dateForDay(state.challenge.startDate, d)
    if (isTaskDone(state.days[date], 'diet')) {
      totalDone++
      runningStreak++
      longestStreak = Math.max(longestStreak, runningStreak)
    } else {
      runningStreak = 0
    }
  }

  for (let d = dayNum; d >= 1; d--) {
    const date = dateForDay(state.challenge.startDate, d)
    if (isTaskDone(state.days[date], 'diet')) currentStreak++
    else break
  }

  return (
    <div className="screen screen--full">
      <DetailHeader title="Diet streak" onBack={onBack} />

      <div className="card stat-row">
        <div className="stat-tile">
          <span className="stat-tile__value serif">{currentStreak}</span>
          <span className="stat-tile__label">current streak</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{longestStreak}</span>
          <span className="stat-tile__label">longest streak</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{totalDone}</span>
          <span className="stat-tile__label">days on diet</span>
        </div>
      </div>

      <div>
        <div className="section-header">75-day overview</div>
        <div className="diet-grid">
          {Array.from({ length: 75 }, (_, i) => i + 1).map((d) => {
            const date = dateForDay(state.challenge.startDate, d)
            const done = d <= dayNum && isTaskDone(state.days[date], 'diet')
            const isToday = d === dayNum
            return (
              <div
                key={d}
                className={`diet-cell${done ? ' diet-cell--done' : ''}${isToday ? ' diet-cell--today' : ''}`}
                title={`Day ${d}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
