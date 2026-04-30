import { countDone } from '../App'

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)

const icons = {
  diet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2a2 2 0 0 0-2 2v5H4v2c0 3.5 2.5 6.4 6 7v2H7v2h10v-2h-3v-2c3.5-.6 6-3.5 6-7V9h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  ),
  workoutIndoor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h1v11h-1" />
      <path d="M16.5 6.5h1v11h-1" />
      <path d="M7.5 12h9" />
      <path d="M4 9v6" />
      <path d="M20 9v6" />
      <path d="M3 10v4" />
      <path d="M21 10v4" />
    </svg>
  ),
  workoutOutdoor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" />
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  photo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
}

const tasks = [
  { key: 'diet', name: 'Diet', sub: 'No cheat meals, no alcohol' },
  { key: 'workoutIndoor', name: 'Indoor Workout', sub: '45 minutes' },
  { key: 'workoutOutdoor', name: 'Outdoor Workout', sub: '45 minutes outside' },
  { key: 'water', name: 'Drink 1 Gallon', sub: '128 oz of water' },
  { key: 'reading', name: 'Read 10 Pages', sub: 'Non-fiction book' },
  { key: 'photo', name: 'Progress Photo', sub: 'Daily photo' },
]

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function TodayCard({ day, data, onChange, today }) {
  const done = countDone(data)
  const allDone = done === 6

  const toggle = (key) => {
    onChange({ [key]: !data[key] })
  }

  return (
    <div className={`today-card${allDone ? ' all-done' : ''}`}>
      <div className="today-meta">
        <div>
          <div className="today-label">Today</div>
          <div className="today-date-text">{formatDate(today)}</div>
        </div>
        <div className="today-tally">
          <div className="tally-count">
            {done}<span className="denom">/6</span>
          </div>
          <div className="tally-label">tasks done</div>
        </div>
      </div>

      {allDone && (
        <div className="done-banner">
          <span>✅</span>
          Day {day} complete — great work!
        </div>
      )}

      <div className="task-list">
        {tasks.map(({ key, name, sub }) => {
          const checked = !!data[key]
          return (
            <label className={`task-item${checked ? ' done' : ''}`} key={key}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <div className="task-icon">{icons[key]}</div>
              <div className="task-body">
                <div className="task-name">{name}</div>
                <div className="task-sub">{sub}</div>
              </div>
              <div className="task-checkbox">
                <CheckIcon />
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
