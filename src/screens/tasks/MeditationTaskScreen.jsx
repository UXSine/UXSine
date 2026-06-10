import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { MEDITATION_GOAL_MIN } from '../../data/model'

const SESSION_LENGTHS = [5, 10, 15, 20]
const RADIUS = 84
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function MeditationTaskScreen({ dayLog, onUpdate, onBack }) {
  const minutes = dayLog.tasks.meditation || 0
  const [sessionLength, setSessionLength] = useState(MEDITATION_GOAL_MIN)
  const [secondsLeft, setSecondsLeft] = useState(sessionLength * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          onUpdate({ meditation: minutes + sessionLength })
          return sessionLength * 60
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectLength = (len) => {
    if (running) return
    setSessionLength(len)
    setSecondsLeft(len * 60)
  }

  const toggleRunning = () => setRunning((r) => !r)

  const sessionPct = ((sessionLength * 60 - secondsLeft) / (sessionLength * 60)) * 100
  const offset = CIRCUMFERENCE * (1 - sessionPct / 100)
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const done = minutes >= MEDITATION_GOAL_MIN

  return (
    <div className="screen screen--full">
      <DetailHeader title="Meditation" onBack={onBack} />

      <div className="med-ring" style={running ? { animation: 'teal-pulse 2s ease-in-out infinite' } : undefined}>
        <svg viewBox="0 0 200 200">
          <circle className="med-ring__track" cx="100" cy="100" r={RADIUS} fill="none" strokeWidth="10" />
          <circle
            className="med-ring__fill"
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="med-ring__center">
          <span className="text-stat">{mm}:{ss}</span>
          <span className="text-caption">{sessionLength} min session</span>
        </div>
      </div>

      <div className="chip-row" style={{ justifyContent: 'center' }}>
        {SESSION_LENGTHS.map((len) => (
          <button
            key={len}
            className={`chip${sessionLength === len ? ' chip--active' : ''}`}
            onClick={() => selectLength(len)}
            disabled={running}
          >
            {len} min
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn-icon" style={{ width: 64, height: 64 }} onClick={toggleRunning}>
          {running ? <Pause size={24} weight="fill" /> : <Play size={24} weight="fill" />}
        </button>
      </div>

      <div>
        <div className="section-header">Today's total</div>
        <div className="text-stat">
          {minutes}<span className="text-body" style={{ color: 'var(--color-text-tertiary)' }}> / {MEDITATION_GOAL_MIN} min</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-sm)' }}>
          <div className="progress-bar__fill" style={{ width: `${Math.min(100, (minutes / MEDITATION_GOAL_MIN) * 100)}%` }} />
        </div>
      </div>

      <button className={`btn-primary${done ? ' btn-cta' : ''}`} onClick={() => onUpdate({ meditation: done ? 0 : MEDITATION_GOAL_MIN })}>
        {done ? 'Goal complete!' : 'Mark as done'}
      </button>
    </div>
  )
}
