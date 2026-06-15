import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import WorkoutTypeTag from '../components/WorkoutTypeTag'
import WorkoutLogForm from '../components/WorkoutLogForm'
import { TRAINING_PLAN, DAY_NAMES, getWeek } from '../data/trainingPlan'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { getCurrentWeekNumber, getCurrentDayName, getDateForWeekDay } from '../utils/dates'
import { getRandomFact } from '../data/motivationalFacts'

const TRAINING_DAY_NAMES = DAY_NAMES.filter((d) => d !== 'Sunday')

export default function LogWorkout() {
  const { getLog, upsertLog } = useWorkoutLog()

  const currentWeekNum = getCurrentWeekNumber()
  const todayDayName = getCurrentDayName()

  const [selectedWeek, setSelectedWeek] = useState(currentWeekNum === 0 ? 1 : currentWeekNum)
  const [selectedDay, setSelectedDay] = useState(
    todayDayName && todayDayName !== 'Sunday' ? todayDayName : 'Monday'
  )
  const [savedFact, setSavedFact] = useState(null)

  const week = getWeek(selectedWeek)
  const planDay = week.days.find((d) => d.dayName === selectedDay)
  const initialLog = getLog(selectedWeek, selectedDay)

  function handleSave(formData) {
    upsertLog({
      weekNumber: selectedWeek,
      dayName: selectedDay,
      date: getDateForWeekDay(selectedWeek, selectedDay),
      ...formData,
    })
    setSavedFact(getRandomFact())
  }

  if (savedFact) {
    return (
      <div className="space-y-5">
        <div className="card p-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/15">
            <Sparkles size={20} strokeWidth={1.5} className="text-sage" />
          </div>
          <h1 className="text-xl font-display font-bold text-bark">Workout logged!</h1>
          <p className="text-sm text-muted mt-3 leading-relaxed">{savedFact}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSavedFact(null)}
            className="flex-1 rounded-md border border-border bg-card py-2.5 text-xs font-display font-bold uppercase tracking-widest text-muted"
          >
            Log Another
          </button>
          <Link to="/" className="btn-primary flex-1 flex items-center justify-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-display font-bold text-bark">Log a Workout</h1>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="label-caption block mb-1.5">Week</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon"
            >
              {TRAINING_PLAN.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  Week {w.weekNumber} — {w.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-caption block mb-1.5">Day</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-bark focus:outline-none focus:border-canyon"
            >
              {TRAINING_DAY_NAMES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-start justify-between gap-3 rounded-card bg-cream border border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-display font-medium text-bark">{planDay.title}</p>
            <p className="text-xs text-muted mt-0.5">{planDay.description}</p>
          </div>
          <WorkoutTypeTag workoutType={planDay.workoutType} className="shrink-0" />
        </div>
      </div>

      <div className="card p-4">
        <WorkoutLogForm
          key={`${selectedWeek}-${selectedDay}`}
          planDay={planDay}
          initialLog={initialLog}
          onSave={handleSave}
          submitLabel="Save Workout"
        />
      </div>
    </div>
  )
}
