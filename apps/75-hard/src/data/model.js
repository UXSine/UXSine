export const STORAGE_KEY = '75hard_v3'
export const LEGACY_STORAGE_KEY = '75hard_v2'

export const WATER_GOAL_OZ = 128
export const WATER_STEP_OZ = 8
export const MEDITATION_GOAL_MIN = 15
export const READING_GOAL_PAGES = 10
export const WORKOUT_GOAL_MIN = 45

export const MILESTONES = [10, 25, 30, 50, 60, 75]

export const TASK_DEFS = [
  { key: 'workout1', label: 'Workout 1', meta: '45 min — indoor', icon: 'Barbell' },
  { key: 'workout2', label: 'Workout 2', meta: '45 min — outdoor', icon: 'Sun' },
  { key: 'water', label: 'Drink water', meta: `${WATER_GOAL_OZ} oz / 1 gallon`, icon: 'Drop' },
  { key: 'meditation', label: 'Meditate', meta: `${MEDITATION_GOAL_MIN} minutes`, icon: 'Brain' },
  { key: 'reading', label: 'Read 10 pages', meta: 'Non-fiction', icon: 'BookOpen' },
  { key: 'diet', label: 'Follow your diet', meta: 'No cheats, no alcohol', icon: 'ForkKnife' },
  { key: 'photo', label: 'Progress photo', meta: 'Daily picture', icon: 'Camera' },
]

export const JOURNAL_TASK_DEF = {
  key: 'journal', label: 'Journal', meta: 'Prompt + gratitude', icon: 'NotePencil',
}

function formatLocalDate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayStr() {
  return formatLocalDate(new Date())
}

export function getDayNumber(startDate, ref = todayStr()) {
  const start = new Date(startDate + 'T00:00:00')
  const today = new Date(ref + 'T00:00:00')
  return Math.floor((today - start) / 86400000) + 1
}

export function dateForDay(startDate, day) {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + (day - 1))
  return formatLocalDate(d)
}

export function emptyDayLog(date) {
  return {
    date,
    tasks: {
      workout1: null,
      workout2: null,
      water: 0,
      meditation: 0,
      reading: null,
      diet: null,
      journal: null,
      photo: null,
      wellness: null,
    },
  }
}

export function isTaskDone(dayLog, key) {
  if (!dayLog) return false
  const t = dayLog.tasks || {}
  switch (key) {
    case 'workout1':
      return !!t.workout1 && (t.workout1.durationMinutes || 0) >= WORKOUT_GOAL_MIN
    case 'workout2':
      return !!t.workout2 && t.workout2.isOutdoor && (t.workout2.durationMinutes || 0) >= WORKOUT_GOAL_MIN
    case 'water':
      return (t.water || 0) >= WATER_GOAL_OZ
    case 'meditation':
      return (t.meditation || 0) >= MEDITATION_GOAL_MIN
    case 'reading':
      return !!t.reading && (t.reading.pagesRead || 0) >= READING_GOAL_PAGES
    case 'diet':
      return !!t.diet && t.diet.noCheats && t.diet.noAlcohol && t.diet.noArtificialSugar && t.diet.trackedCalories
    case 'photo':
      return !!t.photo && !!t.photo.taken
    case 'journal':
      return !!t.journal && !!t.journal.promptResponse && t.journal.promptResponse.trim().length > 0
    case 'wellness':
      return !!t.wellness
    default:
      return false
  }
}

export function getActiveTasks(state) {
  const all = [...TASK_DEFS, JOURNAL_TASK_DEF]
  const keys = state?.settings?.activeTasks
  if (!keys || !Array.isArray(keys)) return all
  return all.filter((t) => keys.includes(t.key))
}

export function countDone(dayLog, activeTasks) {
  const tasks = activeTasks ?? TASK_DEFS
  return tasks.filter((t) => isTaskDone(dayLog, t.key)).length
}

export function isComplete(dayLog, activeTasks) {
  const tasks = activeTasks ?? TASK_DEFS
  if (tasks.length === 0) return false
  return countDone(dayLog, tasks) === tasks.length
}

export function taskMeta(dayLog, key) {
  const t = (dayLog && dayLog.tasks) || {}
  switch (key) {
    case 'workout1':
      return `${t.workout1?.durationMinutes || 0} / ${WORKOUT_GOAL_MIN} min — indoor`
    case 'workout2':
      return `${t.workout2?.durationMinutes || 0} / ${WORKOUT_GOAL_MIN} min — outdoor`
    case 'water':
      return `${t.water || 0} / ${WATER_GOAL_OZ} oz`
    case 'meditation':
      return `${t.meditation || 0} / ${MEDITATION_GOAL_MIN} min`
    case 'reading':
      return `${t.reading?.pagesRead || 0} / ${READING_GOAL_PAGES} pages`
    case 'diet':
      return 'No cheats, no alcohol, no sugar'
    case 'photo':
      return t.photo?.taken ? 'Saved today' : 'Daily picture'
    case 'journal':
      return t.journal?.promptResponse ? 'Entry saved' : 'Prompt + gratitude'
    case 'wellness':
      return t.wellness ? 'Checked in' : 'Mood + energy check-in'
    default:
      return ''
  }
}

export function computeStreak(state) {
  const { startDate } = state.challenge
  const dayNum = getDayNumber(startDate)
  const activeTasks = getActiveTasks(state)
  let streak = 0
  for (let d = dayNum; d >= 1; d--) {
    const date = dateForDay(startDate, d)
    if (isComplete(state.days[date], activeTasks)) streak++
    else break
  }
  return streak
}

function emptyChallenge(startDate, attemptNumber = 1) {
  return {
    id: `c${Date.now()}`,
    attemptNumber,
    startDate,
    status: 'active',
  }
}

export function emptyState(startDate, profile = {}) {
  return {
    version: 3,
    challenge: emptyChallenge(startDate),
    profile: { name: '', ...profile },
    days: {},
    books: [],
    history: [],
    weeklyReflections: {},
    settings: {
      notifications: {
        morning: true,
        afternoon: true,
        evening: true,
        streak: true,
      },
      activeTasks: [...TASK_DEFS.map((t) => t.key), JOURNAL_TASK_DEF.key],
    },
  }
}

export function getWeekNumber(dayNum) {
  return Math.ceil(dayNum / 7)
}

function migrateLegacyDay(old) {
  return {
    date: undefined, // set by caller
    tasks: {
      workout1: old.workoutIndoor
        ? { type: 'weights', isOutdoor: false, durationMinutes: WORKOUT_GOAL_MIN }
        : null,
      workout2: old.workoutOutdoor
        ? { type: 'walk', isOutdoor: true, durationMinutes: WORKOUT_GOAL_MIN }
        : null,
      water: old.waterOz || 0,
      meditation: 0,
      reading: old.reading
        ? { bookId: null, pagesRead: READING_GOAL_PAGES, currentPage: READING_GOAL_PAGES }
        : null,
      diet: (old.diet || old.noAlcohol || old.calories)
        ? {
            noCheats: !!old.diet,
            noAlcohol: !!old.noAlcohol,
            noArtificialSugar: !!old.diet,
            trackedCalories: !!old.calories,
            notes: '',
          }
        : null,
      journal: null,
      photo: old.photo ? { taken: true, frontUri: null, sideUri: null, notes: '' } : null,
      wellness: null,
    },
  }
}

export function migrateLegacy(legacy) {
  const state = emptyState(legacy.startDate)
  for (const [date, oldDay] of Object.entries(legacy.days || {})) {
    const dayLog = migrateLegacyDay(oldDay)
    dayLog.date = date
    state.days[date] = dayLog
  }
  return state
}

export function normalizeImport(data) {
  if (data && data.version === 3 && data.challenge) {
    const days = {}
    for (const [date, day] of Object.entries(data.days || {})) {
      days[date] = { ...emptyDayLog(date), ...day, tasks: { ...emptyDayLog(date).tasks, ...(day.tasks || {}) } }
    }
    return {
      ...emptyState(data.challenge.startDate),
      ...data,
      days,
      weeklyReflections: data.weeklyReflections || {},
    }
  }
  // legacy v2 shape
  if (data && typeof data.startDate === 'string' && typeof data.days === 'object') {
    return migrateLegacy(data)
  }
  throw new Error('Invalid backup file')
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through
  }
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw)
      const migrated = migrateLegacy(legacy)
      save(migrated)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return migrated
    }
  } catch {
    // fall through
  }
  return null
}

export function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable — keep the app running on in-memory state
  }
}
