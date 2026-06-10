import { WATER_GOAL_OZ, WATER_STEP_OZ } from '../App'

export default function WaterTracker({ value, onChange }) {
  const pct = Math.min(100, Math.round((value / WATER_GOAL_OZ) * 100))
  const done = value >= WATER_GOAL_OZ

  const subtract = () => onChange(Math.max(0, value - WATER_STEP_OZ))
  const add = () => onChange(Math.min(WATER_GOAL_OZ, value + WATER_STEP_OZ))
  const toggleDone = () => onChange(done ? 0 : WATER_GOAL_OZ)

  return (
    <section className={`meter-card${done ? ' done' : ''}`}>
      <div className="meter-top">
        <div>
          <div className="meter-eyebrow">Hydration</div>
          <h2 className="meter-title serif">Track your water</h2>
          <p className="meter-sub">We set your daily goal for you</p>
        </div>
        <div className="meter-icon water">💧</div>
      </div>

      <div className="jug-row">
        <div className="jug">
          <div className="jug-cap" />
          <div className="jug-fill" style={{ height: `${pct}%` }} />
          <div className="jug-amount">
            {value}<span className="unit"> oz</span>
          </div>
        </div>

        <div className="jug-side">
          <p className="jug-goal">{WATER_GOAL_OZ} oz goal<br />(1 gallon)</p>
          <div className="meter-controls">
            <button className="btn-step" onClick={subtract} aria-label="Remove water">−</button>
            <button className="btn-pill-outline" onClick={add}>+ Water</button>
          </div>
          <button className={`btn-pill-dark${done ? ' active' : ''}`} onClick={toggleDone}>
            {done ? '✓ Completed' : 'Mark as done'}
          </button>
        </div>
      </div>
    </section>
  )
}
