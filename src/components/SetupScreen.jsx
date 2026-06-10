export default function SetupScreen({ onStart }) {
  const rules = [
    { icon: '🥗', name: 'Stick to your diet', detail: 'No cheat meals, no alcohol' },
    { icon: '🏋️', name: 'Indoor workout — 45 min', detail: 'Any exercise counts' },
    { icon: '🌤️', name: 'Outdoor workout — 45 min', detail: 'Must be outside, rain or shine' },
    { icon: '👟', name: '10,000 steps a day', detail: 'Track your daily movement' },
    { icon: '💧', name: 'Drink 1 gallon of water', detail: '128 oz / ~3.8 litres' },
    { icon: '📖', name: 'Read 10 pages', detail: 'Non-fiction or self-improvement' },
    { icon: '🍎', name: 'Track your calories', detail: 'Log everything you eat' },
    { icon: '📸', name: 'Take a progress photo', detail: 'Every single day' },
  ]

  return (
    <div className="setup">
      <div className="brand-mark setup-mark">75</div>
      <h1 className="setup-title serif">
        Start your<br />challenge
      </h1>
      <p className="setup-tagline">75 days. 9 daily habits. Zero excuses.</p>

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

      <button className="btn-pill-dark btn-start" onClick={onStart}>
        Start the Challenge
      </button>
    </div>
  )
}
