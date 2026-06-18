import DetailHeader from '../../components/DetailHeader'

const TOGGLES = [
  { key: 'noCheats', label: 'Stick to your diet', sub: 'No cheat meals' },
  { key: 'noAlcohol', label: 'No alcohol', sub: 'Zero drinks today' },
  { key: 'noArtificialSugar', label: 'No artificial sugar', sub: 'Whole foods only' },
  { key: 'trackedCalories', label: 'Track calories', sub: 'Log everything you eat' },
]

export default function DietTaskScreen({ dayLog, onUpdate, onBack }) {
  const diet = dayLog.tasks.diet || {
    noCheats: false,
    noAlcohol: false,
    noArtificialSugar: false,
    trackedCalories: false,
    notes: '',
  }

  const update = (patch) => onUpdate({ diet: { ...diet, ...patch } })
  const done = diet.noCheats && diet.noAlcohol && diet.noArtificialSugar && diet.trackedCalories

  return (
    <div className="screen screen--full">
      <DetailHeader title="Diet" onBack={onBack} />

      <div className="card">
        {TOGGLES.map((t) => (
          <div className="toggle-row" key={t.key}>
            <div>
              <div className="task-name">{t.label}</div>
              <div className="task-meta">{t.sub}</div>
            </div>
            <button
              className={`toggle${diet[t.key] ? ' toggle--on' : ''}`}
              onClick={() => update({ [t.key]: !diet[t.key] })}
              aria-label={t.label}
            >
              <span className="toggle__thumb" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <div className="section-header">Notes</div>
        <textarea
          className="text-input"
          rows={3}
          placeholder="What did you eat today?"
          value={diet.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <button
        className={`btn-primary${done ? ' btn-cta' : ''}`}
        onClick={() =>
          update(
            done
              ? { noCheats: false, noAlcohol: false, noArtificialSugar: false, trackedCalories: false }
              : { noCheats: true, noAlcohol: true, noArtificialSugar: true, trackedCalories: true }
          )
        }
      >
        {done ? 'Goal complete!' : 'Mark as done'}
      </button>
    </div>
  )
}
