import { Trophy } from '@phosphor-icons/react'
import { getQuoteForDay } from '../data/quotes'

const HEADLINES = {
  10: 'Ten days down.',
  25: 'A third of the way.',
  30: 'Halfway there.',
  50: 'Final stretch begins.',
  60: 'Sixty days down.',
  75: 'Challenge complete.',
}

export default function MilestoneScreen({ day, onContinue }) {
  const isQuoteMoment = day === 30 || day === 75
  const quote = getQuoteForDay(day)

  return (
    <div className={`screen screen--full ${isQuoteMoment ? 'screen--milestone' : ''}`}>
      <div className="milestone-content">
        <Trophy size={40} weight="regular" color={isQuoteMoment ? 'rgba(255,255,255,0.85)' : 'var(--color-text-teal)'} />
        <div className="milestone-number serif">Day {day}</div>
        <p className="text-title">{HEADLINES[day] || 'Milestone reached.'}</p>
        {isQuoteMoment && (
          <div className="quote-block">
            <p className="quote-block__text">{quote.text}</p>
            <p className="quote-block__attribution">{quote.author}</p>
          </div>
        )}
      </div>
      <button className="btn-primary btn-cta" onClick={onContinue}>Continue</button>
    </div>
  )
}
