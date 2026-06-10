export default function Header({ day, progress, completedDays }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark">75</span>
          <span className="brand-name">Hard Tracker</span>
        </div>
        <div className="header-right">
          {completedDays > 0 && (
            <div className="completed-pill">{completedDays} complete</div>
          )}
          <div className="day-pill">
            Day {day}<span className="denom"> / 75</span>
          </div>
        </div>
      </div>
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </header>
  )
}
