export default function Header({ day, completedDays }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">75 HARD</div>
        <div className="header-right">
          {completedDays > 0 && (
            <div className="completed-pill">{completedDays} complete</div>
          )}
          <div className="day-pill">
            Day {day}<span className="denom"> / 75</span>
          </div>
        </div>
      </div>
    </header>
  )
}
