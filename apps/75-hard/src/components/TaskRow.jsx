import { TASK_ICONS, Check } from '../data/icons'

export default function TaskRow({ def, done, meta, onClick }) {
  const Icon = TASK_ICONS[def.icon]
  return (
    <button className={`task-row${done ? ' task-row--done' : ''}`} onClick={onClick}>
      <div className="task-row__icon">
        <Icon size={20} weight="regular" />
      </div>
      <div className="task-row__body">
        <div className={`task-name${done ? ' task-name--done' : ''}`}>{def.label}</div>
        <div className="task-meta">{meta}</div>
      </div>
      <div className={`task-check${done ? ' task-check--done' : ''}`}>
        {done && <Check size={14} weight="bold" />}
      </div>
    </button>
  )
}
