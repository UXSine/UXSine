import { useRef, useState } from 'react'
import { Barbell, Sun, Drop, Brain, BookOpen, ForkKnife, Camera, NotePencil } from '@phosphor-icons/react'
import { readBackupFile } from '../utils/backup'
import { todayStr } from '../data/model'

function computeStartDate(dayNum) {
  const d = new Date()
  d.setDate(d.getDate() - (dayNum - 1))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDisplayDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function SetupScreen({ onStart, onImport }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('new') // 'new' | 'existing'
  const [currentDay, setCurrentDay] = useState(2)

  const handleRestoreClick = () => {
    setError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await readBackupFile(file)
      onImport(data)
    } catch {
      setError("That file doesn't look like a valid 75 Hard backup.")
    } finally {
      e.target.value = ''
    }
  }

  const adjustDay = (delta) => {
    setCurrentDay((d) => Math.max(2, Math.min(74, d + delta)))
  }

  const startDate = computeStartDate(currentDay)

  const rules = [
    { Icon: Barbell, name: 'Workout 1 — 45 min', detail: 'Any activity, indoor or out' },
    { Icon: Sun, name: 'Workout 2 — 45 min', detail: 'Must be outside, rain or shine' },
    { Icon: Drop, name: 'Drink a gallon of water', detail: '128 oz / ~3.8 litres' },
    { Icon: Brain, name: 'Meditate 15 minutes', detail: 'Quiet the noise, daily' },
    { Icon: BookOpen, name: 'Read 10 pages', detail: 'Non-fiction or self-improvement' },
    { Icon: ForkKnife, name: 'Follow your diet', detail: 'No cheat meals, no alcohol' },
    { Icon: Camera, name: 'Take a progress photo', detail: 'Every single day' },
    { Icon: NotePencil, name: 'Journal', detail: 'Reflect on today, gratitude' },
  ]

  return (
    <div className="setup">
      <div className="brand-mark setup-mark">75</div>
      <h1 className="setup-title serif">
        {mode === 'existing' ? <>Log your<br />progress</> : <>Start your<br />challenge</>}
      </h1>
      <p className="setup-tagline">75 days. Daily habits. Zero excuses.</p>

      {mode === 'new' && (
        <div className="setup-rules">
          {rules.map(({ Icon, name, detail }, i) => (
            <div className="setup-rule" key={i}>
              <div className="rule-icon">
                <Icon size={18} weight="regular" />
              </div>
              <div className="rule-info">
                <strong>{name}</strong>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'existing' && (
        <div className="setup-existing">
          <p className="setup-existing__label">What day are you currently on?</p>
          <div className="counter-row">
            <button className="counter-btn" onClick={() => adjustDay(-1)} aria-label="Decrease day">−</button>
            <span className="counter-value">
              {currentDay}
              <span style={{ fontSize: 18, fontWeight: 400, color: 'var(--color-text-tertiary)' }}> / 75</span>
            </span>
            <button className="counter-btn" onClick={() => adjustDay(1)} aria-label="Increase day">+</button>
          </div>
          <p className="setup-existing__hint">
            Started {formatDisplayDate(startDate)} · {currentDay - 1} day{currentDay - 1 === 1 ? '' : 's'} to catch up
          </p>
        </div>
      )}

      <div className="setup-choice">
        {mode === 'new' ? (
          <>
            <button className="btn-primary btn-cta" onClick={() => onStart(todayStr(), false)}>
              Start the Challenge
            </button>
            <button className="btn-primary btn-ghost" onClick={() => setMode('existing')}>
              I've already started
            </button>
            <button className="btn-link" onClick={handleRestoreClick}>
              Restore from backup
            </button>
            {error && <p className="backup-error">{error}</p>}
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        ) : (
          <>
            <button className="btn-primary btn-cta" onClick={() => onStart(startDate, true)}>
              Begin logging past days
            </button>
            <button className="btn-link" onClick={() => setMode('new')}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
