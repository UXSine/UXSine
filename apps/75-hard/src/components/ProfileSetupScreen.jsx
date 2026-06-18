import { useState } from 'react'

export default function ProfileSetupScreen({ onContinue }) {
  const [name, setName] = useState('')

  const handleContinue = () => onContinue(name.trim())

  return (
    <div className="setup">
      <div className="brand-mark setup-mark">75</div>
      <h1 className="setup-title serif">
        Welcome.<br />Who's training?
      </h1>
      <p className="setup-tagline">This is just for your device — your data stays local and isn't shared.</p>

      <input
        className="text-input"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        maxLength={40}
      />

      <button className="btn-primary btn-cta btn-start" onClick={handleContinue} style={{ marginTop: 'var(--space-xl)' }}>
        Continue
      </button>

      <button className="btn-link" onClick={() => onContinue('')}>
        Skip for now
      </button>
    </div>
  )
}
