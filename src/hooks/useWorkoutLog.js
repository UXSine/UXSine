import { useCallback, useEffect, useState } from 'react'
import { todayISO } from '../utils/dates'

const STORAGE_KEY = 'moab-tracker-workout-logs'

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `log-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// Single hook for all workout-log persistence (localStorage)
export function useWorkoutLog() {
  const [logs, setLogs] = useState(loadLogs)

  useEffect(() => {
    saveLogs(logs)
  }, [logs])

  const getLog = useCallback(
    (weekNumber, dayName) => logs.find((l) => l.weekNumber === weekNumber && l.dayName === dayName) || null,
    [logs]
  )

  // Create or update the log entry for a given plan day
  const upsertLog = useCallback((entry) => {
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.weekNumber === entry.weekNumber && l.dayName === entry.dayName)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], ...entry }
        return next
      }
      return [...prev, { id: makeId(), ...entry }]
    })
  }, [])

  // Quick toggle for the dashboard / week detail checkboxes
  const toggleComplete = useCallback(
    (weekNumber, dayName, planDay) => {
      const existing = getLog(weekNumber, dayName)
      if (existing) {
        upsertLog({ ...existing, completed: !existing.completed })
      } else {
        upsertLog({
          weekNumber,
          dayName,
          date: todayISO(),
          completed: true,
          actualMiles: planDay?.miles ?? 0,
          actualMinutes: 0,
          perceivedEffort: 3,
          kneeFeeling: 1,
          notes: '',
          trailName: '',
        })
      }
    },
    [getLog, upsertLog]
  )

  return { logs, getLog, upsertLog, toggleComplete }
}
