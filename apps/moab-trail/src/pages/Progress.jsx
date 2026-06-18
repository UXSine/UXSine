import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Stethoscope } from 'lucide-react'
import StatCard from '../components/StatCard'
import { TRAINING_PLAN, TRAILS, DAY_NAMES, MOAB_RACE_DISTANCE_MILES, MOAB_RACE_GAIN_FT } from '../data/trainingPlan'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { getDateForWeekDay, todayISO } from '../utils/dates'

const COLORS = {
  canyon: '#E47F4D',
  crimson: '#B2442C',
  sage: '#7F7948',
  sky: '#6D9599',
  sandstone: '#F7B85D',
  border: '#EDE0CC',
  muted: '#8A7A6E',
  bark: '#1C1209',
}

const TRAIL_ORDER = ['bst', 'cornerCanyon', 'lccCreek', 'redPineLake', 'lakeBlanche', 'silverLake']
const TRAIL_SHORT_NAMES = {
  bst: 'BST',
  cornerCanyon: 'Corner Canyon',
  lccCreek: 'LCC Creek',
  redPineLake: 'Red Pine Lake',
  lakeBlanche: 'Lake Blanche',
  silverLake: 'Silver Lake',
}

const TRAINING_DAY_NAMES = DAY_NAMES.filter((d) => d !== 'Sunday')

export default function ProgressPage() {
  const { logs, getLog } = useWorkoutLog()
  const completedLogs = logs.filter((l) => l.completed)

  const totalMiles = completedLogs.reduce((sum, l) => sum + (Number(l.actualMiles) || 0), 0)
  const totalWorkouts = completedLogs.length
  const longestRun = completedLogs.reduce((max, l) => Math.max(max, Number(l.actualMiles) || 0), 0)
  const avgEffort = completedLogs.length
    ? (completedLogs.reduce((sum, l) => sum + (Number(l.perceivedEffort) || 0), 0) / completedLogs.length).toFixed(1)
    : null

  const weeksWithLogs = [...new Set(completedLogs.map((l) => l.weekNumber))].sort((a, b) => a - b)
  const recentWeeks = weeksWithLogs.slice(-4)
  const recentKneeLogs = completedLogs.filter((l) => recentWeeks.includes(l.weekNumber) && l.kneeFeeling != null)
  const kneeTrend = recentKneeLogs.length
    ? recentKneeLogs.reduce((sum, l) => sum + Number(l.kneeFeeling), 0) / recentKneeLogs.length
    : null
  const kneeTrendColor =
    kneeTrend == null ? COLORS.muted : kneeTrend <= 2 ? COLORS.sage : kneeTrend <= 3 ? COLORS.sandstone : COLORS.crimson

  // Long run progression: planned vs actual per week
  const longRunData = TRAINING_PLAN.map((w) => {
    const longRunDay = w.days.find((d) => d.workoutType === 'Long Run' || d.workoutType === 'Long Trail')
    const log = longRunDay ? getLog(w.weekNumber, longRunDay.dayName) : null
    return {
      week: `W${w.weekNumber}`,
      planned: w.longRunMiles,
      actual: log?.completed ? Number(log.actualMiles) : null,
    }
  })

  // Elevation gain per trail vs Moab
  const elevationData = TRAIL_ORDER.map((key) => {
    const trail = TRAILS[key]
    return {
      name: TRAIL_SHORT_NAMES[key],
      gain: trail.trailElevationGain,
      fill: trail.moabGainPct >= 100 ? COLORS.crimson : COLORS.canyon,
    }
  })

  // Knee health over time
  const kneeData = completedLogs
    .filter((l) => l.kneeFeeling != null && l.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => ({ date: l.date.slice(5), knee: Number(l.kneeFeeling) }))

  const last2Weeks = weeksWithLogs.slice(-2)
  const physioWarning =
    last2Weeks.length === 2 &&
    last2Weeks.every((wn) => {
      const weekLogs = completedLogs.filter((l) => l.weekNumber === wn && l.kneeFeeling != null)
      if (!weekLogs.length) return false
      const avg = weekLogs.reduce((s, l) => s + Number(l.kneeFeeling), 0) / weekLogs.length
      return avg > 3
    })

  function getCellState(weekNumber, dayName) {
    const log = getLog(weekNumber, dayName)
    if (log?.completed) return 'completed'
    const date = getDateForWeekDay(weekNumber, dayName)
    return date < todayISO() ? 'incomplete' : 'upcoming'
  }

  const today = todayISO()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-display font-bold text-bark">Progress</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <StatCard label="Total Miles" value={totalMiles.toFixed(1)} />
        <StatCard label="Workouts" value={totalWorkouts} />
        <StatCard label="Longest Run" value={`${longestRun.toFixed(1)} mi`} />
        <StatCard label="Avg Effort" value={avgEffort ?? '—'} sub={avgEffort ? '/ 5' : undefined} />
        <div className="card px-3 py-2.5">
          <p className="text-[11px] font-body uppercase tracking-widest text-muted">Knee Trend</p>
          <p className="text-xl font-display font-bold mt-0.5" style={{ color: kneeTrendColor }}>
            {kneeTrend == null ? '—' : kneeTrend.toFixed(1)}
          </p>
          <p className="text-xs text-muted mt-0.5">last 4 weeks</p>
        </div>
      </div>

      {physioWarning && (
        <div className="flex items-start gap-2.5 rounded-card border border-crimson/30 bg-crimson/10 px-3.5 py-3">
          <Stethoscope size={18} strokeWidth={1.5} className="text-crimson mt-0.5 shrink-0" />
          <p className="text-sm text-bark">
            Your knee feeling has averaged above 3 for the last two weeks. Consider a check-in with a physio.
          </p>
        </div>
      )}

      {/* Long run progression */}
      <div className="card p-4">
        <h2 className="text-lg font-display font-bold text-bark mb-1">Long Run Progression</h2>
        <p className="label-caption mb-3">Planned vs. actual miles, week by week</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={longRunData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid stroke={COLORS.border} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: COLORS.muted }} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} unit=" mi" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: COLORS.border }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine
              y={MOAB_RACE_DISTANCE_MILES}
              stroke={COLORS.crimson}
              strokeDasharray="3 3"
              label={{ value: `Race: ${MOAB_RACE_DISTANCE_MILES} mi`, position: 'insideTopRight', fill: COLORS.crimson, fontSize: 11 }}
            />
            <Line type="monotone" dataKey="planned" name="Planned" stroke={COLORS.canyon} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke={COLORS.sage} strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Elevation gain */}
      <div className="card p-4">
        <h2 className="text-lg font-display font-bold text-bark mb-1">Elevation Gain by Trail</h2>
        <p className="label-caption mb-3">Each trail's gain vs. Moab's {MOAB_RACE_GAIN_FT.toLocaleString()} ft</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={elevationData} margin={{ top: 5, right: 10, left: -15, bottom: 40 }}>
            <CartesianGrid stroke={COLORS.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: COLORS.muted }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} unit=" ft" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: COLORS.border }} />
            <ReferenceLine
              y={MOAB_RACE_GAIN_FT}
              stroke={COLORS.crimson}
              strokeDasharray="3 3"
              label={{ value: 'Moab Race', position: 'insideTopRight', fill: COLORS.crimson, fontSize: 11 }}
            />
            <Bar dataKey="gain" name="Elevation gain" radius={[4, 4, 0, 0]}>
              {elevationData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Week-by-week completion grid */}
      <div className="card p-4">
        <h2 className="text-lg font-display font-bold text-bark mb-1">Completion Grid</h2>
        <p className="label-caption mb-3">Monday – Saturday, weeks 1–10</p>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-10"></th>
                {TRAINING_PLAN.map((w) => (
                  <th key={w.weekNumber} className="text-[10px] font-body text-muted font-normal px-0.5 pb-1">
                    W{w.weekNumber}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRAINING_DAY_NAMES.map((dayName) => (
                <tr key={dayName}>
                  <td className="text-[10px] text-muted pr-1.5 text-right">{dayName.slice(0, 3)}</td>
                  {TRAINING_PLAN.map((w) => {
                    const state = getCellState(w.weekNumber, dayName)
                    const stateClasses = {
                      completed: 'bg-sage text-white',
                      incomplete: 'bg-sandstone text-bark',
                      upcoming: 'bg-cream border border-border text-transparent',
                    }
                    return (
                      <td key={w.weekNumber} className="p-0.5">
                        <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded ${stateClasses[state]}`} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sage inline-block" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sandstone inline-block" /> Missed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-cream border border-border inline-block" /> Upcoming
          </span>
        </div>
      </div>

      {/* Knee health log */}
      <div className="card p-4">
        <h2 className="text-lg font-display font-bold text-bark mb-1">Knee Health Log</h2>
        <p className="label-caption mb-3">1 = Great · 5 = Ouch</p>
        {kneeData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={kneeData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.muted }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: COLORS.muted }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: COLORS.border }} />
              <ReferenceLine y={3} stroke={COLORS.sandstone} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="knee" name="Knee feeling" stroke={COLORS.sky} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Log a workout with a knee rating to see your trend here.</p>
        )}
      </div>
    </div>
  )
}
