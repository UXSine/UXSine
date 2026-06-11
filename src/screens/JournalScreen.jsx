import TaskRow from '../components/TaskRow'
import { JOURNAL_TASK_DEF, isTaskDone, taskMeta, getWeekNumber } from '../data/model'
import { getWeeklyQuestion } from '../data/weeklyQuestions'

const MOODS = ['😞', '🙁', '😐', '🙂', '😄']
const SCALES = [
  { key: 'energy', label: 'Energy' },
  { key: 'sleepQuality', label: 'Sleep quality' },
  { key: 'mentalClarity', label: 'Mental clarity' },
]

export default function JournalScreen({ state, dayNum, dayLog, onOpenTask, onUpdateToday, onUpdateWeeklyReflection }) {
  const wellness = dayLog.tasks.wellness || { mood: null, energy: 0, sleepQuality: 0, mentalClarity: 0, notes: '' }

  const updateWellness = (patch) => onUpdateToday({ wellness: { ...wellness, ...patch } })

  const weekNumber = getWeekNumber(dayNum)
  const question = getWeeklyQuestion(weekNumber)
  const reflection = state.weeklyReflections[weekNumber] || { weekNumber, question, response: '', hardestMoment: '', proudestMoment: '' }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-header__title">Journal</h1>
      </div>

      <div>
        <div className="section-header">Today's entry</div>
        <div className="task-list">
          <TaskRow
            def={JOURNAL_TASK_DEF}
            done={isTaskDone(dayLog, 'journal')}
            meta={taskMeta(dayLog, 'journal')}
            onClick={() => onOpenTask('journal')}
          />
        </div>
      </div>

      <div>
        <div className="section-header">Wellness check-in</div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <div className="task-meta" style={{ marginBottom: 'var(--space-sm)' }}>How are you feeling?</div>
            <div className="mood-row">
              {MOODS.map((emoji, i) => (
                <button
                  key={i}
                  className={`mood-option${wellness.mood === i + 1 ? ' mood-option--active' : ''}`}
                  onClick={() => updateWellness({ mood: i + 1 })}
                  aria-label={`Mood ${i + 1}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {SCALES.map(({ key, label }) => (
            <div key={key}>
              <div className="task-meta" style={{ marginBottom: 'var(--space-sm)' }}>{label}</div>
              <div className="scale-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`scale-dot${(wellness[key] || 0) >= n ? ' scale-dot--active' : ''}`}
                    onClick={() => updateWellness({ [key]: n })}
                    aria-label={`${label} ${n}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-header">Week {weekNumber} reflection</div>
        <div className="card">
          <p className="quote-block__text" style={{ fontSize: 22 }}>{question}</p>
          <textarea
            className="journal-area"
            placeholder="Write your reflection…"
            value={reflection.response || ''}
            onChange={(e) => onUpdateWeeklyReflection(weekNumber, { ...reflection, response: e.target.value })}
          />
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div className="task-meta" style={{ marginBottom: 'var(--space-xs)' }}>Hardest moment</div>
            <textarea
              className="text-input"
              rows={2}
              value={reflection.hardestMoment || ''}
              onChange={(e) => onUpdateWeeklyReflection(weekNumber, { ...reflection, hardestMoment: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div className="task-meta" style={{ marginBottom: 'var(--space-xs)' }}>Proudest moment</div>
            <textarea
              className="text-input"
              rows={2}
              value={reflection.proudestMoment || ''}
              onChange={(e) => onUpdateWeeklyReflection(weekNumber, { ...reflection, proudestMoment: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
