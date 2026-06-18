import { Link } from 'react-router-dom'
import { PlusCircle, Mountain } from 'lucide-react'
import StatCard from '../components/StatCard'
import CurrentWeekCard from '../components/CurrentWeekCard'
import TrailLadder from '../components/TrailLadder'
import { MOAB_RACE_DISTANCE_MILES, MOAB_RACE_GAIN_FT, getWeek } from '../data/trainingPlan'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { getCurrentWeekNumber, getWeeksToRace, getDaysUntilStart } from '../utils/dates'

export default function Dashboard() {
  const { logs, getLog, toggleComplete } = useWorkoutLog()

  const currentWeekNumber = getCurrentWeekNumber()
  const weeksToRace = getWeeksToRace()
  const daysUntilStart = getDaysUntilStart()
  const displayWeek = getWeek(currentWeekNumber === 0 ? 1 : currentWeekNumber)

  const totalMiles = logs
    .filter((l) => l.completed)
    .reduce((sum, l) => sum + (Number(l.actualMiles) || 0), 0)

  const longRunDay = displayWeek.days.find((d) => d.workoutType === 'Long Run' || d.workoutType === 'Long Trail')
  const longRunLog = longRunDay ? getLog(displayWeek.weekNumber, longRunDay.dayName) : null
  const longRunCompleted = !!longRunLog?.completed

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-crimson text-cream rounded-card px-5 py-6">
        <div className="flex items-center gap-2 mb-2">
          <Mountain size={20} strokeWidth={1.5} />
          <span className="label-caption text-cream/70">10-Week Trail Training Plan</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">Moab Trail Half Marathon</h1>
        <p className="text-sm text-cream/80 mt-1">
          Kane Creek Canyon · {MOAB_RACE_DISTANCE_MILES} miles · ~{MOAB_RACE_GAIN_FT.toLocaleString()} ft gain
        </p>

        {currentWeekNumber === 0 ? (
          <p className="mt-3 text-lg font-display font-bold">
            Training starts August 24 — {daysUntilStart} day{daysUntilStart === 1 ? '' : 's'} to go
          </p>
        ) : (
          <p className="mt-3 text-lg font-display font-bold">
            {weeksToRace > 0 ? `${weeksToRace} week${weeksToRace === 1 ? '' : 's'} to go` : 'Race week is here!'}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          <StatCard variant="hero" label="Current Week" value={currentWeekNumber === 0 ? '—' : `${currentWeekNumber}/10`} />
          <StatCard variant="hero" label="Miles Logged" value={totalMiles.toFixed(1)} />
          <StatCard variant="hero" label="Long Run" value={longRunCompleted ? '✓' : '✗'} sub="this week" />
        </div>
      </div>

      {/* Milestone banners */}
      {displayWeek.weekNumber === 6 && longRunCompleted && (
        <div className="rounded-card bg-sage/15 border border-sage/30 px-4 py-3 text-sm text-bark">
          <span className="font-display font-bold text-sage">You just ran harder than Moab.</span> The race is within
          reach. 🏔️
        </div>
      )}
      {displayWeek.weekNumber === 8 && longRunCompleted && (
        <div className="rounded-card bg-sage/15 border border-sage/30 px-4 py-3 text-sm text-bark">
          <span className="font-display font-bold text-sage">That was your hardest training day.</span> Race day just
          got easier.
        </div>
      )}
      {displayWeek.weekNumber === 10 && (
        <div className="rounded-card bg-sky/15 border border-sky/30 px-4 py-3 text-sm text-bark">
          <span className="font-display font-bold text-sky">The work is done.</span> Trust it.
        </div>
      )}

      {/* Current Week */}
      <CurrentWeekCard week={displayWeek} getLog={getLog} onToggleComplete={toggleComplete} />

      {/* Trail Ladder */}
      <TrailLadder />

      {/* Quick log CTA */}
      <Link
        to="/log"
        className="btn-primary flex items-center justify-center gap-2 w-full py-3.5 text-sm"
      >
        <PlusCircle size={16} strokeWidth={1.5} />
        Log Today's Workout
      </Link>
    </div>
  )
}
