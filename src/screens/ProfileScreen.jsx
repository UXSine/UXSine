import { useRef, useState } from 'react'
import { ArrowCounterClockwise, Trophy } from '@phosphor-icons/react'
import { exportData, readBackupFile } from '../utils/backup'
import { computeStreak, isComplete } from '../data/model'

const NOTIFICATIONS = [
  { key: 'morning', label: 'Morning kickoff', sub: '7:00 AM — Day starts now' },
  { key: 'afternoon', label: 'Afternoon nudge', sub: '4:00 PM — if tasks remain' },
  { key: 'evening', label: 'Evening journal', sub: '8:30 PM — journal reminder' },
  { key: 'streak', label: 'Streak protection', sub: '9:00 PM — don\'t break the streak' },
]

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })
}

export default function ProfileScreen({ state, dayNum, onUpdateSettings, onRestart, onImport }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

  const notifications = state.settings?.notifications || {}
  const streak = computeStreak(state)
  const completedDays = Object.values(state.days).filter(isComplete).length

  const handleExport = () => exportData(state)

  const handleImportClick = () => {
    setError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await readBackupFile(file)
      const ok = window.confirm('Importing will replace your current progress with this backup. Continue?')
      if (ok) onImport(data)
    } catch {
      setError("That file doesn't look like a valid 75 Hard backup.")
    } finally {
      e.target.value = ''
    }
  }

  const handleRestart = () => {
    const ok = window.confirm(
      `Restart the challenge? Day ${dayNum} of attempt ${state.challenge.attemptNumber} will be archived, and Day 1 of a new attempt starts today.`
    )
    if (ok) onRestart()
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-header__title">Profile</h1>
      </div>

      <div className="card stat-row">
        <div className="stat-tile">
          <span className="stat-tile__value serif">{dayNum}</span>
          <span className="stat-tile__label">current day</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{state.challenge.attemptNumber}</span>
          <span className="stat-tile__label">attempt</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{formatShortDate(state.challenge.startDate)}</span>
          <span className="stat-tile__label">started</span>
        </div>
      </div>

      <div className="card stat-row">
        <div className="stat-tile">
          <span className="stat-tile__value serif">{streak}</span>
          <span className="stat-tile__label">day streak</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value serif">{completedDays}</span>
          <span className="stat-tile__label">days complete</span>
        </div>
      </div>

      <div>
        <div className="section-header">Notifications</div>
        <div className="card">
          {NOTIFICATIONS.map((n) => (
            <div className="toggle-row" key={n.key}>
              <div>
                <div className="task-name">{n.label}</div>
                <div className="task-meta">{n.sub}</div>
              </div>
              <button
                className={`toggle${notifications[n.key] ? ' toggle--on' : ''}`}
                onClick={() => onUpdateSettings({ notifications: { ...notifications, [n.key]: !notifications[n.key] } })}
                aria-label={n.label}
              >
                <span className="toggle__thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {state.history.length > 0 && (
        <div>
          <div className="section-header">Attempt history</div>
          <div className="task-list">
            {[...state.history].reverse().map((h) => (
              <div className="task-row" key={h.attemptNumber}>
                <div className="task-row__icon"><Trophy size={20} weight="regular" /></div>
                <div className="task-row__body">
                  <div className="task-name">Attempt {h.attemptNumber}</div>
                  <div className="task-meta">{h.daysCompleted} days complete · {formatDate(h.startDate)} – {formatDate(h.endDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="section-header">Backup</div>
        <p className="text-caption" style={{ marginBottom: 'var(--space-sm)' }}>
          Your progress is saved on this device only. Export a backup file regularly so you don't lose it.
        </p>
        <div className="backup-actions">
          <button className="btn-primary" onClick={handleExport}>Export Data</button>
          <button className="btn-primary" onClick={handleImportClick}>Import Data</button>
        </div>
        {error && <p className="backup-error">{error}</p>}
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <button className="btn-primary btn-destructive" onClick={handleRestart}>
        <ArrowCounterClockwise size={18} weight="regular" />
        Restart Challenge
      </button>
    </div>
  )
}
