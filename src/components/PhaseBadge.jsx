import { getBadgeStyle } from '../data/workoutTypes'

export default function PhaseBadge({ badge, className = '' }) {
  const style = getBadgeStyle(badge)
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-body font-medium uppercase tracking-widest ${style.bg} ${style.text} ${className}`}
    >
      {badge}
    </span>
  )
}
