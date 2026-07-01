import { useRef, useState } from 'react'
import { ArrowCounterClockwise, Trophy, Camera, User } from '@phosphor-icons/react'
import { exportData, readBackupFile } from '../utils/backup'
import { readImageAsDataURL } from '../utils/image'
import { computeStreak, isComplete, TASK_DEFS, JOURNAL_TASK_DEF } from '../data/model'
import { TASK_ICONS } from '../data/icons'

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

export default function ProfileScreen({ state, dayNum, onUpdateSettings, onUpdateProfile, onRestart, onImport }) {
  const fileInputRef = useRef(null)
  const avatarInputRef = useRef(null)
  const [error, setError] = useState('')
  const [name, setName] = useState(state.profile?.name || '')

  const notifications = state.settings?.notifications || {}
  const avatarUri = state.profile?.avatarUri
  const streak = computeStreak(state)
  const completedDays = Object.values(state.days).filter(isComplete).length

  const ALL_TASK_DEFS = [...TASK_DEFS, JOURNAL_TASK_DEF]
  const activeTaskKeys = state.settings?.activeTasks ?? ALL_TASK_DEFS.map((t) => t.key)

  const toggleTask = (key) => {
    const next = activeTaskKeys.includes(key)
      ? activeTaskKeys.filter((k) => k !== key)
      : [...activeTaskKeys, key]
    if (next.length === 0) return
    onUpdateSettings({ activeTasks: next })
  }

  const handleNameBlur = () => {
    const trimmed = name.trim()
    if (trimmed !== (state.profile?.name || '')) onUpdateProfile({ name: trimmed })
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const uri = await readImageAsDataURL(file, 320)
      onUpdateProfile({ avatarUri: uri })
    } finally {
      e.target.value = ''
    }
  }

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

      <div className="profile-header">
        <button className="avatar" onClick={() => avatarInputRef.current?.click()} aria-label="Change profile photo">
          {avatarUri ? <img src={avatarUri} alt="Profile" /> : <User size={34} weight="light" />}
          <span className="avatar__badge"><Camera size={13} weight="bold" /></span>
        </button>
        <input
          className="profile-name-input"
          type="text"
          placeholder="Add your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          maxLength={40}
        />
        <input
          type="file"
          accept="image/*"
          ref={avatarInputRef}
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
      </div>

      <div>
        <div className="section-header">Challenge</div>
        <div className="card">
          <div className="list-row">
            <span className="list-row__label">Current day</span>
            <span className="list-row__value">Day {dayNum} of 75</span>
          </div>
          <div className="list-row">
            <span className="list-row__label">Day streak</span>
            <span className="list-row__value">{streak} {streak === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="list-row">
            <span className="list-row__label">Days complete</span>
            <span className="list-row__value">{completedDays}</span>
          </div>
          <div className="list-row">
            <span className="list-row__label">Attempt</span>
            <span className="list-row__value">{state.challenge.attemptNumber}</span>
          </div>
          <div className="list-row">
            <span className="list-row__label">Started</span>
            <span className="list-row__value">{formatDate(state.challenge.startDate)}</span>
          </div>
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

      <div>
        <div className="section-header">Daily tasks</div>
        <div className="card">
          {ALL_TASK_DEFS.map((def) => {
            const Icon = TASK_ICONS[def.icon]
            const isOn = activeTaskKeys.includes(def.key)
            return (
              <div className="toggle-row" key={def.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <Icon size={18} weight="regular" />
                  <div>
                    <div className="task-name">{def.label}</div>
                    <div className="task-meta">{def.meta}</div>
                  </div>
                </div>
                <button
                  className={`toggle${isOn ? ' toggle--on' : ''}`}
                  onClick={() => toggleTask(def.key)}
                  aria-label={def.label}
                >
                  <span className="toggle__thumb" />
                </button>
              </div>
            )
          })}
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
