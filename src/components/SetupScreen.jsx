import { useRef, useState } from 'react'
import { Barbell, Sun, Drop, Brain, BookOpen, ForkKnife, Camera, NotePencil } from '@phosphor-icons/react'
import { readBackupFile } from '../utils/backup'

export default function SetupScreen({ onStart, onImport }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

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

  const rules = [
    { Icon: Barbell, name: 'Workout 1 — 45 min', detail: 'Any activity, indoor or out' },
    { Icon: Sun, name: 'Workout 2 — 45 min', detail: 'Must be outside, rain or shine' },
    { Icon: Drop, name: 'Drink a gallon of water', detail: '128 oz / ~3.8 litres' },
    { Icon: Brain, name: 'Meditate 15 minutes', detail: 'Quiet the noise, daily' },
    { Icon: BookOpen, name: 'Read 10 pages', detail: 'Non-fiction or self-improvement' },
    { Icon: ForkKnife, name: 'Follow your diet', detail: 'No cheat meals, no alcohol' },
    { Icon: Camera, name: 'Take a progress photo', detail: 'Every single day' },
    { Icon: NotePencil, name: 'Journal', detail: "Reflect on today, gratitude" },
  ]

  return (
    <div className="setup">
      <div className="brand-mark setup-mark">75</div>
      <h1 className="setup-title serif">
        Start your<br />challenge
      </h1>
      <p className="setup-tagline">75 days. Daily habits. Zero excuses.</p>

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

      <button className="btn-primary btn-cta btn-start" onClick={onStart}>
        Start the Challenge
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
    </div>
  )
}
