import { DAY_NAMES } from '../data/trainingPlan'

export const PREP_DATE = new Date(2026, 8, 3)  // Sep 3, 2026 (Thursday — prep week starts)
export const START_DATE = new Date(2026, 8, 7)  // Sep 7, 2026 (Monday — Week 1 starts)
export const RACE_DATE = new Date(2026, 10, 7)  // Nov 7, 2026

const PREP_DAY_NAMES = ['Thursday', 'Friday', 'Saturday', 'Sunday']

const MS_PER_DAY = 1000 * 60 * 60 * 24

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function diffInDays(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY)
}

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Returns -1 before prep week, 0 during prep week (Sep 3-6), 1-9 during the plan
export function getCurrentWeekNumber(today = new Date()) {
  const diffFromPrep = diffInDays(PREP_DATE, today)
  const diffFromStart = diffInDays(START_DATE, today)
  if (diffFromPrep < 0) return -1
  if (diffFromStart < 0) return 0
  return Math.min(Math.floor(diffFromStart / 7) + 1, 9)
}

// Returns the plan day name for today, or null if outside the active plan
export function getCurrentDayName(today = new Date()) {
  const diffFromPrep = diffInDays(PREP_DATE, today)
  const diffFromStart = diffInDays(START_DATE, today)
  if (diffFromPrep < 0 || diffFromStart >= 63) return null
  if (diffFromStart < 0) return PREP_DAY_NAMES[diffFromPrep] || null
  return DAY_NAMES[diffFromStart % 7]
}

export function getDaysUntilStart(today = new Date()) {
  return Math.max(diffInDays(today, PREP_DATE), 0)
}

// Whole weeks remaining until race day (can be 0 or negative once race has passed)
export function getWeeksToRace(today = new Date()) {
  const diff = diffInDays(today, RACE_DATE)
  return Math.ceil(diff / 7)
}

export function todayISO(today = new Date()) {
  return toISODate(startOfDay(today))
}

// Calendar date (ISO) for a given plan week + day, based on the training start date
export function getDateForWeekDay(weekNumber, dayName) {
  if (weekNumber === 0) {
    const prepIndex = PREP_DAY_NAMES.indexOf(dayName)
    if (prepIndex === -1) return null
    const date = new Date(PREP_DATE)
    date.setDate(date.getDate() + prepIndex)
    return toISODate(date)
  }
  const dayIndex = DAY_NAMES.indexOf(dayName)
  const offsetDays = (weekNumber - 1) * 7 + dayIndex
  const date = new Date(START_DATE)
  date.setDate(date.getDate() + offsetDays)
  return toISODate(date)
}

export function formatDate(isoString) {
  if (!isoString) return ''
  const [y, m, d] = isoString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
