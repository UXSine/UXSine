import { getWorkoutTypeStyle } from '../data/workoutTypes'

export default function WorkoutTypeTag({ workoutType, className = '' }) {
  const { icon: Icon, bg, text } = getWorkoutTypeStyle(workoutType)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-body font-medium uppercase tracking-widest ${bg} ${text} ${className}`}
    >
      <Icon size={12} strokeWidth={1.5} />
      {workoutType}
    </span>
  )
}
