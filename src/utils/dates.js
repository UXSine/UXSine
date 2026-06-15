import { DAY_NAMES } from '../data/trainingPlan'

export const START_DATE = new Date(2026, 7, 24) // Aug 24, 2026 (Monday)
export const RACE_DATE = new Date(2026, 10, 7) // Nov 7, 2026

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

// Returns 0 if training hasn't started yet, 1-10 during the plan, 10 once the plan is complete
export function getCurrentWeekNumber(today = new Date()) {
  const diff = diffInDays(START_DATE, today)
  if (diff < 0) return 0
  return Math.min(Math.floor(diff / 7) + 1, 10)
}

// Returns the plan day name (Monday-Sunday) for today, or null if outside the active plan
export function getCurrentDayName(today = new Date()) {
  const diff = diffInDays(START_DATE, today)
  if (diff < 0 || diff >= 70) return null
  return DAY_NAMES[diff % 7]
}

export function getDaysUntilStart(today = new Date()) {
  return Math.max(diffInDays(today, START_DATE), 0)
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
