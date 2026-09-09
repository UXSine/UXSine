import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { todayISO } from '../utils/dates'

const STORAGE_KEY = 'moab-tracker-workout-logs'

// Supabase client — only created when env vars are present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  } catch {
    // storage full — skip silently
  }
}

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `log-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toRow(entry, userId) {
  return {
    id: entry.id,
    user_id: userId,
    week_number: entry.weekNumber,
    day_name: entry.dayName,
    date: entry.date ?? null,
    completed: entry.completed ?? false,
    actual_miles: entry.actualMiles ?? 0,
    actual_minutes: entry.actualMinutes ?? 0,
    perceived_effort: entry.perceivedEffort ?? 3,
    knee_feeling: entry.kneeFeeling ?? 1,
    notes: entry.notes ?? '',
    trail_name: entry.trailName ?? '',
    photo_data_url: entry.photoDataUrl ?? null,
  }
}

function fromRow(row) {
  return {
    id: row.id,
    weekNumber: row.week_number,
    dayName: row.day_name,
    date: row.date,
    completed: row.completed,
    actualMiles: row.actual_miles,
    actualMinutes: row.actual_minutes,
    perceivedEffort: row.perceived_effort,
    kneeFeeling: row.knee_feeling,
    notes: row.notes,
    trailName: row.trail_name,
    photoDataUrl: row.photo_data_url,
  }
}

export function useWorkoutLog() {
  const [logs, setLogs] = useState(loadLogs)
  const userIdRef = useRef(null)
  const [synced, setSynced] = useState(false)

  // Sign in anonymously and pull existing logs from Supabase on mount
  useEffect(() => {
    if (!supabase) return

    async function init() {
      let { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const { data } = await supabase.auth.signInAnonymously()
        session = data.session
      }
      if (!session) return

      userIdRef.current = session.user.id

      const { data: rows } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', session.user.id)

      if (rows && rows.length > 0) {
        const remote = rows.map(fromRow)
        setLogs(remote)
        saveLogs(remote)
      }
      setSynced(true)
    }

    init()
  }, [])

  // Persist to localStorage on every change
  useEffect(() => {
    saveLogs(logs)
  }, [logs])

  const getLog = useCallback(
    (weekNumber, dayName) => logs.find((l) => l.weekNumber === weekNumber && l.dayName === dayName) || null,
    [logs]
  )

  const upsertLog = useCallback((entry) => {
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.weekNumber === entry.weekNumber && l.dayName === entry.dayName)
      let next
      if (idx >= 0) {
        next = [...prev]
        next[idx] = { ...next[idx], ...entry }
      } else {
        next = [...prev, { id: makeId(), ...entry }]
      }

      // Write to Supabase in background
      if (supabase && userIdRef.current) {
        const updated = next.find((l) => l.weekNumber === entry.weekNumber && l.dayName === entry.dayName)
        supabase
          .from('workout_logs')
          .upsert(toRow(updated, userIdRef.current), { onConflict: 'user_id,week_number,day_name' })
          .then(({ error }) => { if (error) console.warn('Supabase upsert failed:', error.message) })
      }

      return next
    })
  }, [])

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
          photoDataUrl: null,
        })
      }
    },
    [getLog, upsertLog]
  )

  return { logs, getLog, upsertLog, toggleComplete, synced }
}
