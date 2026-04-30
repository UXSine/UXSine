import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import Header from './components/Header'
import TodayCard from './components/TodayCard'
import CalendarGrid from './components/CalendarGrid'

const STORAGE_KEY = '75hard_v1'

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
    workoutIndoor: false,
    workoutOutdoor: false,
    water: false,
    reading: false,
    photo: false,
  }
}

export function isComplete(dayData) {
  if (!dayData) return false
  return !!(
    dayData.diet &&
    dayData.workoutIndoor &&
    dayData.workoutOutdoor &&
    dayData.water &&
    dayData.reading &&
    dayData.photo
  )
}

export function countDone(dayData) {
  if (!dayData) return 0
  return [
    dayData.diet,
    dayData.workoutIndoor,
    dayData.workoutOutdoor,
    dayData.water,
    dayData.reading,
    dayData.photo,
  ].filter(Boolean).length
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
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <main className="main">
        <TodayCard
          day={dayNum}
          data={todayData}
          onChange={handleUpdate}
          today={today}
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
