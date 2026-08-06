import { useEffect, useRef, useState, useCallback } from 'react'
import { loadState, saveState } from './storage'

const MODES = {
  focus: { label: 'Focus', key: 'focusMin' },
  short: { label: 'Short Break', key: 'shortBreakMin' },
  long: { label: 'Long Break', key: 'longBreakMin' },
}

function fmt(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// A short two-tone chime using the Web Audio API — no asset files needed.
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    const notes = [880, 1174.66]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = now + i * 0.18
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.55)
    })
    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Audio unavailable — silently continue.
  }
}

export default function App() {
  const [settings, setSettings] = useState(loadState)
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(loadState().focusMin * 60)
  const [running, setRunning] = useState(false)
  const [round, setRound] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const tickRef = useRef(null)

  const modeSeconds = useCallback(
    (m) => settings[MODES[m].key] * 60,
    [settings],
  )

  // Persist settings + daily count whenever they change.
  useEffect(() => {
    saveState(settings)
  }, [settings])

  // Keep the tab title in sync so it's usable in a background tab.
  useEffect(() => {
    document.title = running
      ? `${fmt(secondsLeft)} · ${MODES[mode].label}`
      : 'Focus'
    return () => {
      document.title = 'Focus'
    }
  }, [secondsLeft, running, mode])

  const switchMode = useCallback(
    (nextMode, autoStart = false) => {
      setMode(nextMode)
      setSecondsLeft(modeSeconds(nextMode))
      setRunning(autoStart)
    },
    [modeSeconds],
  )

  const handleComplete = useCallback(() => {
    if (settings.sound) playChime()
    setRunning(false)

    if (mode === 'focus') {
      const done = settings.completedToday + 1
      setSettings((s) => ({ ...s, completedToday: s.completedToday + 1 }))
      const isLong = round % settings.roundsBeforeLong === 0
      const next = isLong ? 'long' : 'short'
      setRound((r) => r + 1)
      switchMode(next, settings.autoStart)
    } else {
      switchMode('focus', settings.autoStart)
    }
    return
  }, [mode, round, settings, switchMode])

  // The countdown loop.
  useEffect(() => {
    if (!running) return
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tickRef.current)
          // Defer the mode transition out of the state updater.
          queueMicrotask(handleComplete)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [running, handleComplete])

  // Space bar toggles start/pause (unless typing in the task field).
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        setRunning((r) => !r)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reset = () => {
    setRunning(false)
    setSecondsLeft(modeSeconds(mode))
  }

  const skip = () => {
    setRunning(false)
    if (mode === 'focus') {
      const isLong = round % settings.roundsBeforeLong === 0
      setRound((r) => r + 1)
      switchMode(isLong ? 'long' : 'short')
    } else {
      switchMode('focus')
    }
  }

  const selectMode = (m) => {
    setRunning(false)
    switchMode(m)
  }

  const total = modeSeconds(mode)
  const progress = total > 0 ? 1 - secondsLeft / total : 0
  const R = 130
  const C = 2 * Math.PI * R
  const dash = C * progress

  const updateSetting = (key, value) => {
    setSettings((s) => {
      const next = { ...s, [key]: value }
      // If we changed the current mode's duration while idle, reflect it.
      if (!running && key === MODES[mode].key) {
        setSecondsLeft(value * 60)
      }
      return next
    })
  }

  return (
    <div className={`app mode-${mode}`}>
      <header className="topbar">
        <div className="brand">Focus</div>
        <button
          className="icon-btn"
          onClick={() => setShowSettings((v) => !v)}
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
      </header>

      <div className="mode-tabs">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            className={`mode-tab ${mode === key ? 'active' : ''}`}
            onClick={() => selectMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="timer-wrap">
        <svg className="ring" viewBox="0 0 300 300" aria-hidden="true">
          <circle className="ring-track" cx="150" cy="150" r={R} />
          <circle
            className="ring-progress"
            cx="150"
            cy="150"
            r={R}
            strokeDasharray={C}
            strokeDashoffset={C - dash}
          />
        </svg>
        <div className="timer-center">
          <div className="time">{fmt(secondsLeft)}</div>
          <div className="mode-label">{MODES[mode].label}</div>
        </div>
      </div>

      <input
        className="task-input"
        type="text"
        placeholder="What are you focusing on?"
        value={settings.task}
        onChange={(e) => updateSetting('task', e.target.value)}
      />

      <div className="controls">
        <button className="ctrl-secondary" onClick={reset} aria-label="Reset">
          <ResetIcon />
        </button>
        <button className="ctrl-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="ctrl-secondary" onClick={skip} aria-label="Skip">
          <SkipIcon />
        </button>
      </div>

      <div className="stats">
        <span>Round {((round - 1) % settings.roundsBeforeLong) + 1} of {settings.roundsBeforeLong}</span>
        <span className="dot">·</span>
        <span>{settings.completedToday} focus {settings.completedToday === 1 ? 'session' : 'sessions'} today</span>
      </div>

      {showSettings && (
        <div className="sheet-backdrop" onClick={() => setShowSettings(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>Settings</h2>
              <button
                className="icon-btn"
                onClick={() => setShowSettings(false)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <NumberRow
              label="Focus length"
              suffix="min"
              value={settings.focusMin}
              min={1}
              max={120}
              onChange={(v) => updateSetting('focusMin', v)}
            />
            <NumberRow
              label="Short break"
              suffix="min"
              value={settings.shortBreakMin}
              min={1}
              max={60}
              onChange={(v) => updateSetting('shortBreakMin', v)}
            />
            <NumberRow
              label="Long break"
              suffix="min"
              value={settings.longBreakMin}
              min={1}
              max={90}
              onChange={(v) => updateSetting('longBreakMin', v)}
            />
            <NumberRow
              label="Rounds before long break"
              value={settings.roundsBeforeLong}
              min={1}
              max={12}
              onChange={(v) => updateSetting('roundsBeforeLong', v)}
            />

            <ToggleRow
              label="Auto-start next timer"
              value={settings.autoStart}
              onChange={(v) => updateSetting('autoStart', v)}
            />
            <ToggleRow
              label="Chime when a timer ends"
              value={settings.sound}
              onChange={(v) => updateSetting('sound', v)}
            />

            <p className="hint">Tip: press the space bar to start or pause.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function NumberRow({ label, value, min, max, suffix, onChange }) {
  const clamp = (v) => Math.max(min, Math.min(max, v))
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <div className="stepper">
        <button onClick={() => onChange(clamp(value - 1))} aria-label={`Decrease ${label}`}>
          −
        </button>
        <span className="stepper-value">
          {value}
          {suffix ? <span className="suffix"> {suffix}</span> : null}
        </span>
        <button onClick={() => onChange(clamp(value + 1))} aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <button
        className={`toggle ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <span className="knob" />
      </button>
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4l10 8-10 8z" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
