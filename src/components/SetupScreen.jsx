export default function SetupScreen({ onStart }) {
  const rules = [
    {
      icon: '🥗',
      name: 'Stick to a diet',
      detail: 'No cheat meals, no alcohol',
    },
    {
      icon: '🏋️',
      name: 'Indoor workout — 45 min',
      detail: 'Any exercise counts',
    },
    {
      icon: '🌤️',
      name: 'Outdoor workout — 45 min',
      detail: 'Must be outside, rain or shine',
    },
    {
      icon: '💧',
      name: 'Drink 1 gallon of water',
      detail: '128 oz / ~3.8 litres',
    },
    {
      icon: '📖',
      name: 'Read 10 pages',
      detail: 'Non-fiction or self-improvement (no audiobooks)',
    },
    {
      icon: '📸',
      name: 'Take a progress photo',
      detail: 'Every single day',
    },
  ]

  return (
    <div className="setup">
      <div className="setup-eyebrow">
        <span>🔥</span> Mental Toughness Program
      </div>
      <div className="setup-title">75</div>
      <span className="setup-num">HARD</span>
      <p className="setup-tagline">75 days. 6 tasks. Zero excuses.</p>

      <div className="setup-rules">
        {rules.map((r, i) => (
          <div className="setup-rule" key={i}>
            <div className="rule-icon">{r.icon}</div>
            <div className="rule-info">
              <strong>{r.name}</strong>
              <span>{r.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-start" onClick={onStart}>
        Start the Challenge
      </button>
    </div>
  )
}
