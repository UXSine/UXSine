import DetailHeader from '../../components/DetailHeader'
import { getPromptForDay } from '../../data/journalPrompts'

export default function JournalTaskScreen({ dayLog, dayNum, onUpdate, onBack }) {
  const journal = dayLog.tasks.journal || { promptResponse: '', gratitude: ['', '', ''] }
  const prompt = getPromptForDay(dayNum)

  const update = (patch) => onUpdate({ journal: { ...journal, ...patch } })

  const setGratitude = (i, value) => {
    const next = [...(journal.gratitude || ['', '', ''])]
    next[i] = value
    update({ gratitude: next })
  }

  return (
    <div className="screen screen--full">
      <DetailHeader title="Journal" onBack={onBack} />

      <div className="card">
        <p className="quote-block__text" style={{ fontSize: 20 }}>{prompt}</p>
        <textarea
          className="journal-area"
          placeholder="Write here…"
          value={journal.promptResponse || ''}
          onChange={(e) => update({ promptResponse: e.target.value })}
        />
      </div>

      <div>
        <div className="section-header">Gratitude</div>
        <div className="card">
          {[0, 1, 2].map((i) => (
            <div className="gratitude-row" key={i}>
              <div className="gratitude-num">{i + 1}</div>
              <input
                className="gratitude-input"
                placeholder="I'm grateful for…"
                value={journal.gratitude?.[i] || ''}
                onChange={(e) => setGratitude(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
