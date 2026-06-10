import { countDone, TOTAL_TASKS } from '../App'

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)

const icons = {
  diet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2a2 2 0 0 0-2 2v5H4v2c0 3.5 2.5 6.4 6 7v2H7v2h10v-2h-3v-2c3.5-.6 6-3.5 6-7V9h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  ),
  noAlcohol: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14l-2.5 9.5a4 4 0 0 1-3.9 3H11.4a4 4 0 0 1-3.9-3L5 3z" />
      <path d="M12 15.5V21" />
      <path d="M8.5 21h7" />
      <path d="M3 3l18 18" />
    </svg>
  ),
  workoutIndoor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  calories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c2 3-1 4-1 6.5A3.5 3.5 0 0 0 14.5 12c0-1-.5-1.5-.5-1.5 1.5 1 2.5 3 2.5 5a5 5 0 0 1-10 0c0-3 1.5-5 2.5-7C9.5 6.5 10 4 12 2z" />
    </svg>
  ),
  photo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
}

const tasks = [
  { key: 'diet', name: 'Stick to your diet', sub: 'No cheat meals' },
  { key: 'noAlcohol', name: 'No alcohol', sub: 'Zero drinks today' },
  { key: 'workoutIndoor', name: 'Indoor workout', sub: '45 minutes' },
  { key: 'workoutOutdoor', name: 'Outdoor workout', sub: '45 minutes outside' },
  { key: 'reading', name: 'Read 10 pages', sub: 'Non-fiction book' },
  { key: 'calories', name: 'Track calories', sub: 'Log everything you eat' },
  { key: 'photo', name: 'Progress photo', sub: 'Daily picture' },
]

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function TodayCard({ day, data, onChange, today }) {
  const done = countDone(data)
  const allDone = done === TOTAL_TASKS

  const toggle = (key) => {
    onChange({ [key]: !data[key] })
  }

  return (
    <section className="today-section">
      <div className="today-meta">
        <div className="today-eyebrow">Day {day} of 75</div>
        <h1 className="today-day serif">Day {day}</h1>
        <p className="today-date">{formatDate(today)}</p>
      </div>

      <div className="today-tally">
        <span>{done} of {TOTAL_TASKS} habits done</span>
        <div className="tally-bar">
          <div className="tally-fill" style={{ width: `${(done / TOTAL_TASKS) * 100}%` }} />
        </div>
      </div>

      {allDone && (
        <div className="done-banner">
          <span>Day {day} complete — well done.</span>
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
    </section>
  )
}
