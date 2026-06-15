import { Footprints, Mountain, Dumbbell, Bike, Moon, Flag, TrendingUp } from 'lucide-react'

// Visual config per workout type — icon + tag colors (soft bg / matching text)
export const WORKOUT_TYPES = {
  'Easy Run': { icon: Footprints, bg: 'bg-canyon/15', text: 'text-canyon' },
  'Trail Run': { icon: Mountain, bg: 'bg-sage/15', text: 'text-sage' },
  Strength: { icon: Dumbbell, bg: 'bg-sandstone/30', text: 'text-bark' },
  'Cross-Train': { icon: Bike, bg: 'bg-sky/15', text: 'text-sky' },
  Rest: { icon: Moon, bg: 'bg-sky/15', text: 'text-sky' },
  'Long Run': { icon: TrendingUp, bg: 'bg-canyon/15', text: 'text-canyon' },
  'Long Trail': { icon: Flag, bg: 'bg-crimson/15', text: 'text-crimson' },
}

export function getWorkoutTypeStyle(workoutType) {
  return WORKOUT_TYPES[workoutType] || WORKOUT_TYPES['Easy Run']
}

// Phase badge colors
export const PHASE_BADGES = {
  Building: { bg: 'bg-canyon/15', text: 'text-canyon' },
  Recovery: { bg: 'bg-sky/15', text: 'text-sky' },
  Taper: { bg: 'bg-sky/15', text: 'text-sky' },
  'Race Week': { bg: 'bg-crimson/15', text: 'text-crimson' },
}

export function getBadgeStyle(badge) {
  return PHASE_BADGES[badge] || PHASE_BADGES.Building
}
