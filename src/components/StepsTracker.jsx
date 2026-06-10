import { STEPS_GOAL, STEPS_STEP } from '../App'

export default function StepsTracker({ value, onChange }) {
  const pct = Math.min(100, Math.round((value / STEPS_GOAL) * 100))
  const done = value >= STEPS_GOAL

  const subtract = () => onChange(Math.max(0, value - STEPS_STEP))
  const add = () => onChange(value + STEPS_STEP)
  const toggleDone = () => onChange(done ? 0 : STEPS_GOAL)

  return (
    <section className={`meter-card${done ? ' done' : ''}`}>
      <div className="meter-top">
        <div>
          <div className="meter-eyebrow">Movement</div>
          <h2 className="meter-title serif">Daily steps</h2>
          <p className="meter-sub">Goal: {STEPS_GOAL.toLocaleString()} steps a day</p>
        </div>
        <div className="meter-icon steps">👟</div>
      </div>

      <div className="steps-count">
        {value.toLocaleString()}
        <span className="unit"> / {STEPS_GOAL.toLocaleString()}</span>
      </div>
      <div className="steps-bar">
        <div className="steps-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="meter-controls">
        <button className="btn-step" onClick={subtract} aria-label="Remove steps">−</button>
        <button className="btn-pill-outline" onClick={add}>+ {STEPS_STEP.toLocaleString()} steps</button>
      </div>
      <button className={`btn-pill-dark${done ? ' active' : ''}`} onClick={toggleDone}>
        {done ? '✓ Completed' : 'Mark as done'}
      </button>
    </section>
  )
}
