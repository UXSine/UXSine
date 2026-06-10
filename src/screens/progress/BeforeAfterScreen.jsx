import { Camera } from '@phosphor-icons/react'
import DetailHeader from '../../components/DetailHeader'
import { dateForDay } from '../../data/model'

export default function BeforeAfterScreen({ state, dayNum, onBack }) {
  let before = null
  let after = null

  for (let d = 1; d <= dayNum; d++) {
    const date = dateForDay(state.challenge.startDate, d)
    const photo = state.days[date]?.tasks?.photo
    if (photo?.frontUri) {
      if (!before) before = { day: d, ...photo }
      after = { day: d, ...photo }
    }
  }

  const hasComparison = before && after && before.day !== after.day

  return (
    <div className="screen screen--full">
      <DetailHeader title="Before & after" onBack={onBack} />

      {before ? (
        <>
          <div className="before-after">
            <div className="before-after__item">
              <div className="before-after__photo">
                <img src={before.frontUri} alt={`Day ${before.day}`} />
              </div>
              <div className="text-caption" style={{ textAlign: 'center' }}>Day {before.day}</div>
            </div>
            <div className="before-after__item">
              <div className="before-after__photo">
                {hasComparison ? <img src={after.frontUri} alt={`Day ${after.day}`} /> : <Camera size={28} weight="regular" />}
              </div>
              <div className="text-caption" style={{ textAlign: 'center' }}>{hasComparison ? `Day ${after.day}` : 'Keep going'}</div>
            </div>
          </div>
          {!hasComparison && (
            <p className="text-body" style={{ color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
              Take more progress photos to see your transformation here.
            </p>
          )}
        </>
      ) : (
        <p className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>No progress photos yet. Add one from today's tasks.</p>
      )}
    </div>
  )
}
