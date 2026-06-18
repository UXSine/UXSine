import { Check } from 'lucide-react'
import { getWorkoutTypeStyle } from '../data/workoutTypes'

// Compact day tile used in the Dashboard's Mon-Sat workout grid
export default function DayGridCell({ day, completed, onToggle }) {
  const { icon: Icon, bg, text } = getWorkoutTypeStyle(day.workoutType)

  return (
    <div className={`card p-2.5 flex flex-col gap-2 ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${bg}`}>
          <Icon size={15} strokeWidth={1.5} className={text} />
        </span>
        {day.workoutType !== 'Rest' && (
          <button
            onClick={onToggle}
            aria-label="Mark complete"
            className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
              completed ? 'bg-sage border-sage' : 'border-border bg-card'
            }`}
          >
            {completed && <Check size={13} strokeWidth={2.5} className="text-white" />}
          </button>
        )}
      </div>
      <div>
        <p className="text-[10px] text-muted uppercase tracking-widest">{day.dayName.slice(0, 3)}</p>
        <p className={`text-xs font-display font-medium leading-snug mt-0.5 ${completed ? 'line-through text-muted' : 'text-bark'}`}>
          {day.title}
        </p>
      </div>
    </div>
  )
}
