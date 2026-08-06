export const STORAGE_KEY = 'uxsine.focus.v1'

const DEFAULTS = {
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  roundsBeforeLong: 4,
  autoStart: false,
  sound: true,
  task: '',
  completedToday: 0,
  lastDay: '',
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function loadState() {
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    saved = {}
  }
  const state = { ...DEFAULTS, ...saved }
  // Reset the daily counter on a new day.
  if (state.lastDay !== today()) {
    state.completedToday = 0
    state.lastDay = today()
  }
  return state
}

export function saveState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastDay: today() }),
    )
  } catch {
    // Ignore write failures (e.g. private mode).
  }
}
