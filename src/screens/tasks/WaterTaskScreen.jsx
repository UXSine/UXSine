import { Drop } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { WATER_GOAL_OZ, WATER_STEP_OZ } from '../../data/model'

const QUICK_ADDS = [8, 16, 32]

export default function WaterTaskScreen({ dayLog, onUpdate, onBack }) {
  const value = dayLog.tasks.water || 0
  const pct = Math.min(100, Math.round((value / WATER_GOAL_OZ) * 100))
  const done = value >= WATER_GOAL_OZ

  const setValue = (v) => onUpdate({ water: Math.max(0, v) })
  const subtract = () => setValue(value - WATER_STEP_OZ)

  return (
    <div className="screen screen--full">
      <DetailHeader title="Water" onBack={onBack} />

      <div className="cup-container">
        <svg viewBox="0 0 200 240" className="cup-svg">
          <defs>
            <clipPath id="cupClip">
              <path d="M40 30 L160 30 L150 222 Q150 232 140 232 L60 232 Q50 232 50 222 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#cupClip)">
            <rect x="30" y={232 - (pct / 100) * 202} width="140" height="240" className="cup-fill-water" />
          </g>
          <path
            d="M40 30 L160 30 L150 222 Q150 232 140 232 L60 232 Q50 232 50 222 Z"
            fill="none"
            stroke="#1A1A18"
            strokeWidth="3"
          />
          <rect x="35" y="14" width="130" height="20" rx="6" fill="#FFFFFF" stroke="#1A1A18" strokeWidth="3" />
          <rect x="94" y="0" width="12" height="20" rx="3" fill="#7EC4C6" stroke="#1A1A18" strokeWidth="2" />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="text-stat">
          {value}
          <span className="text-body" style={{ color: 'var(--color-text-tertiary)' }}> / {WATER_GOAL_OZ} oz</span>
        </div>
        <p className="text-caption" style={{ marginTop: 'var(--space-xs)' }}>
          {done ? 'Goal complete!' : '1 gallon a day'}
        </p>
      </div>

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="chip-row" style={{ justifyContent: 'center' }}>
        {QUICK_ADDS.map((amt) => (
          <button key={amt} className="chip" onClick={() => setValue(value + amt)}>
            <Drop size={14} weight="fill" style={{ marginRight: 4, verticalAlign: -2 }} />
            +{amt} oz
          </button>
        ))}
      </div>

      <div className="counter-row">
        <button className="counter-btn" onClick={subtract} aria-label="Remove water">−</button>
        <button className="counter-btn" onClick={() => setValue(value + WATER_STEP_OZ)} aria-label="Add water">+</button>
      </div>

      <button className={`btn-primary${done ? ' btn-cta' : ''}`} onClick={() => setValue(done ? 0 : WATER_GOAL_OZ)}>
        {done ? 'Goal complete!' : 'Mark as done'}
      </button>
    </div>
  )
}
