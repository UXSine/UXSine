import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import Header from './components/Header'
import TodayCard from './components/TodayCard'
import WaterTracker from './components/WaterTracker'
import StepsTracker from './components/StepsTracker'
import CalendarGrid from './components/CalendarGrid'

const STORAGE_KEY = '75hard_v2'

export const WATER_GOAL_OZ = 128
export const WATER_STEP_OZ = 8
export const STEPS_GOAL = 10000
export const STEPS_STEP = 500
export const TOTAL_TASKS = 9

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function getDayNumber(startDate) {
  const start = new Date(startDate + 'T00:00:00')
  const today = new Date(todayStr() + 'T00:00:00')
  return Math.floor((today - start) / 86400000) + 1
}

export function emptyDay() {
  return {
    diet: false,
    noAlcohol: false,
    workoutIndoor: false,
    workoutOutdoor: false,
    steps: 0,
    waterOz: 0,
    reading: false,
    calories: false,
    photo: false,
  }
}

export function isComplete(d) {
  if (!d) return false
  return !!(
    d.diet &&
    d.noAlcohol &&
    d.workoutIndoor &&
    d.workoutOutdoor &&
    d.reading &&
    d.calories &&
    d.photo &&
    (d.steps || 0) >= STEPS_GOAL &&
    (d.waterOz || 0) >= WATER_GOAL_OZ
  )
}

export function countDone(d) {
  if (!d) return 0
  const checks = [
    d.diet,
    d.noAlcohol,
    d.workoutIndoor,
    d.workoutOutdoor,
    d.reading,
    d.calories,
    d.photo,
    (d.steps || 0) >= STEPS_GOAL,
    (d.waterOz || 0) >= WATER_GOAL_OZ,
  ]
  return checks.filter(Boolean).length
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function App() {
  const [challenge, setChallenge] = useState(load)

  useEffect(() => {
    if (challenge) save(challenge)
  }, [challenge])

  const handleStart = () => {
    const data = { startDate: todayStr(), days: {} }
    save(data)
    setChallenge(data)
  }

  const handleUpdate = (updates) => {
    const today = todayStr()
    setChallenge((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [today]: { ...emptyDay(), ...(prev.days[today] || {}), ...updates },
      },
    }))
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setChallenge(null)
  }

  if (!challenge) {
    return <SetupScreen onStart={handleStart} />
  }

  const today = todayStr()
  const dayNum = Math.min(Math.max(getDayNumber(challenge.startDate), 1), 75)
  const todayData = challenge.days[today] || emptyDay()
  const completedDays = Object.values(challenge.days).filter(isComplete).length
  const progress = Math.round((completedDays / 75) * 100)

  return (
    <div className="app">
      <Header day={dayNum} progress={progress} completedDays={completedDays} />
      <main className="main">
        <TodayCard
          day={dayNum}
          data={todayData}
          onChange={handleUpdate}
          today={today}
        />
        <StepsTracker
          value={todayData.steps || 0}
          onChange={(steps) => handleUpdate({ steps })}
        />
        <WaterTracker
          value={todayData.waterOz || 0}
          onChange={(waterOz) => handleUpdate({ waterOz })}
        />
        <CalendarGrid
          startDate={challenge.startDate}
          days={challenge.days}
          today={today}
          currentDay={dayNum}
        />
        <button className="btn-reset" onClick={handleReset}>
          Restart Challenge
        </button>
      </main>
    </div>
  )
}
