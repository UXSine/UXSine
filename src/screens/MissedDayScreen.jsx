import { Warning } from '@phosphor-icons/react'

export default function MissedDayScreen({ missedDay, completedCount, onRestart, onContinue }) {
  return (
    <div className="screen screen--full">
      <div className="milestone-content">
        <Warning size={40} weight="regular" color="var(--color-destructive)" />
        <h1 className="text-display">Day {missedDay}</h1>
        <p className="text-title">You missed yesterday.</p>
        <div className="card" style={{ width: '100%' }}>
          <p className="text-body">
            <strong>{completedCount} days banked.</strong> That discipline lives in you — restart to begin a fresh 75, or continue and keep your record honest.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <button className="btn-primary btn-destructive" onClick={onRestart}>Restart Challenge</button>
        <button className="btn-primary btn-ghost" onClick={onContinue}>Continue Anyway</button>
      </div>
    </div>
  )
}
