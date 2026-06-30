import { useEffect, useRef, useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import SetupScreen from './components/SetupScreen'
import ProfileSetupScreen from './components/ProfileSetupScreen'
import BottomNav from './components/BottomNav'
import TodayScreen from './screens/TodayScreen'
import ProgressScreen from './screens/ProgressScreen'
import JournalScreen from './screens/JournalScreen'
import ProfileScreen from './screens/ProfileScreen'
import MilestoneScreen from './screens/MilestoneScreen'
import MissedDayScreen from './screens/MissedDayScreen'
import WaterTaskScreen from './screens/tasks/WaterTaskScreen'
import WorkoutTaskScreen from './screens/tasks/WorkoutTaskScreen'
import MeditationTaskScreen from './screens/tasks/MeditationTaskScreen'
import ReadingTaskScreen from './screens/tasks/ReadingTaskScreen'
import DietTaskScreen from './screens/tasks/DietTaskScreen'
import PhotoTaskScreen from './screens/tasks/PhotoTaskScreen'
import JournalTaskScreen from './screens/tasks/JournalTaskScreen'
import WorkoutHistoryScreen from './screens/progress/WorkoutHistoryScreen'
import DietStreakScreen from './screens/progress/DietStreakScreen'
import BeforeAfterScreen from './screens/progress/BeforeAfterScreen'
import BookLibraryScreen from './screens/progress/BookLibraryScreen'
import {
  load,
  save,
  emptyState,
  emptyDayLog,
  todayStr,
  getDayNumber,
  dateForDay,
  isComplete,
  MILESTONES,
} from './data/model'

function getCurrentBook(state) {
  return state.books.find((b) => !b.finishedDay) || state.books[state.books.length - 1] || null
}

export default function App() {
  const [state, setState] = useState(load)
  const [tab, setTab] = useState('today')
  const [detail, setDetail] = useState(null)
  const [showSplash, setShowSplash] = useState(true)
  const [profileName, setProfileName] = useState(null)
  const [progressFocusDay, setProgressFocusDay] = useState(null)
  const checkedMissed = useRef(false)

  useEffect(() => {
    if (state) save(state)
  }, [state])

  useEffect(() => {
    if (!state || checkedMissed.current) return
    checkedMissed.current = true
    const dayNum = getDayNumber(state.challenge.startDate)
    if (dayNum > 1 && state.challenge.status === 'active') {
      const yesterdayDate = dateForDay(state.challenge.startDate, dayNum - 1)
      const yesterdayLog = state.days[yesterdayDate]
      if (!isComplete(yesterdayLog) && state.challenge.lastAcknowledgedMiss !== yesterdayDate) {
        let completedCount = 0
        for (let d = 1; d < dayNum; d++) {
          if (isComplete(state.days[dateForDay(state.challenge.startDate, d)])) completedCount++
        }
        setDetail({ type: 'missed', missedDay: dayNum - 1, yesterdayDate, completedCount })
      }
    }
  }, [state])

  const handleStart = () => {
    setState(emptyState(todayStr(), { name: profileName || '' }))
  }

  const handleImport = (data) => {
    setState(data)
    setTab('today')
    setDetail(null)
  }

  if (showSplash) {
    return (
      <div className="app">
        <SplashScreen onDone={() => setShowSplash(false)} />
      </div>
    )
  }

  if (!state) {
    if (profileName === null) {
      return <ProfileSetupScreen onContinue={setProfileName} />
    }
    return <SetupScreen onStart={handleStart} onImport={handleImport} />
  }

  const today = todayStr()
  const dayNum = Math.min(Math.max(getDayNumber(state.challenge.startDate), 1), 75)
  const dayLog = state.days[today] || emptyDayLog(today)
  const book = getCurrentBook(state)

  const updateDayLog = (date, patch) => {
    setState((prev) => {
      const prevLog = prev.days[date] || emptyDayLog(date)
      const nextLog = { ...prevLog, tasks: { ...prevLog.tasks, ...patch } }
      return { ...prev, days: { ...prev.days, [date]: nextLog } }
    })
  }

  const updateToday = (patch) => {
    const prevLog = state.days[today] || emptyDayLog(today)
    const wasComplete = isComplete(prevLog)
    const nextLog = { ...prevLog, tasks: { ...prevLog.tasks, ...patch } }
    setState((prev) => ({ ...prev, days: { ...prev.days, [today]: nextLog } }))
    if (!wasComplete && isComplete(nextLog) && MILESTONES.includes(dayNum)) {
      setDetail({ type: 'milestone', day: dayNum })
    }
  }

  const updateBook = (patch) => {
    setState((prev) => {
      const current = getCurrentBook(prev)
      let books
      if (current) {
        books = prev.books.map((b) => (b.id === current.id ? { ...b, ...patch } : b))
      } else {
        books = [...prev.books, { id: `b${Date.now()}`, title: '', author: '', startedDay: dayNum, totalPagesRead: 0, ...patch }]
      }
      return { ...prev, books }
    })
  }

  const updateSettings = (patch) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }

  const updateProfile = (patch) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
  }

  const updateWeeklyReflection = (weekNumber, reflection) => {
    setState((prev) => ({
      ...prev,
      weeklyReflections: { ...prev.weeklyReflections, [weekNumber]: reflection },
    }))
  }

  const handleRestart = () => {
    setState((prev) => {
      const startDayNum = getDayNumber(prev.challenge.startDate)
      let completedCount = 0
      for (let d = 1; d < startDayNum; d++) {
        if (isComplete(prev.days[dateForDay(prev.challenge.startDate, d)])) completedCount++
      }
      const history = [
        ...prev.history,
        {
          attemptNumber: prev.challenge.attemptNumber,
          startDate: prev.challenge.startDate,
          endDate: todayStr(),
          daysCompleted: completedCount,
        },
      ]
      return {
        ...prev,
        challenge: {
          ...prev.challenge,
          attemptNumber: prev.challenge.attemptNumber + 1,
          startDate: todayStr(),
          status: 'active',
          lastAcknowledgedMiss: null,
        },
        history,
      }
    })
    setDetail(null)
    setTab('today')
  }

  const handleMissedContinue = () => {
    setState((prev) => ({
      ...prev,
      challenge: { ...prev.challenge, lastAcknowledgedMiss: detail.yesterdayDate },
    }))
    setDetail(null)
  }

  const handleLogYesterdaysTasks = () => {
    const { yesterdayDate, missedDay } = detail
    setState((prev) => ({
      ...prev,
      challenge: { ...prev.challenge, lastAcknowledgedMiss: yesterdayDate },
    }))
    setProgressFocusDay(missedDay)
    setDetail(null)
    setTab('progress')
  }

  const closeDetail = () => setDetail(null)
  const openTask = (key) => setDetail({ type: 'task', key })
  const openPastTask = (key, date, pastDayNum) => setDetail({ type: 'past-task', key, date, pastDayNum })
  const openProgressDetail = (key) => setDetail({ type: 'progress', key })

  if (detail?.type === 'missed') {
    return (
      <div className="app">
        <MissedDayScreen
          missedDay={detail.missedDay}
          completedCount={detail.completedCount}
          onRestart={handleRestart}
          onContinue={handleMissedContinue}
          onLogYesterday={handleLogYesterdaysTasks}
        />
      </div>
    )
  }

  if (detail?.type === 'milestone') {
    return (
      <div className="app">
        <MilestoneScreen day={detail.day} onContinue={closeDetail} />
      </div>
    )
  }

  if (detail?.type === 'task' || detail?.type === 'past-task') {
    const isPast = detail.type === 'past-task'
    const taskLog = isPast ? (state.days[detail.date] || emptyDayLog(detail.date)) : dayLog
    const updateLog = isPast ? (patch) => updateDayLog(detail.date, patch) : updateToday
    const taskDayNum = isPast ? detail.pastDayNum : dayNum

    let screen
    switch (detail.key) {
      case 'water':
        screen = <WaterTaskScreen dayLog={taskLog} onUpdate={updateLog} onBack={closeDetail} />
        break
      case 'workout1':
        screen = (
          <WorkoutTaskScreen
            dayLog={taskLog}
            taskKey="workout1"
            isOutdoor={false}
            title="Workout 1"
            onUpdate={updateLog}
            onBack={closeDetail}
          />
        )
        break
      case 'workout2':
        screen = (
          <WorkoutTaskScreen
            dayLog={taskLog}
            taskKey="workout2"
            isOutdoor={true}
            title="Workout 2"
            onUpdate={updateLog}
            onBack={closeDetail}
          />
        )
        break
      case 'meditation':
        screen = <MeditationTaskScreen dayLog={taskLog} onUpdate={updateLog} onBack={closeDetail} />
        break
      case 'reading':
        screen = <ReadingTaskScreen dayLog={taskLog} book={book} onUpdate={updateLog} onUpdateBook={updateBook} onBack={closeDetail} />
        break
      case 'diet':
        screen = <DietTaskScreen dayLog={taskLog} onUpdate={updateLog} onBack={closeDetail} />
        break
      case 'photo':
        screen = <PhotoTaskScreen dayLog={taskLog} onUpdate={updateLog} onBack={closeDetail} />
        break
      case 'journal':
        screen = <JournalTaskScreen dayLog={taskLog} dayNum={taskDayNum} onUpdate={updateLog} onBack={closeDetail} />
        break
      default:
        screen = null
    }
    return <div className="app">{screen}</div>
  }

  if (detail?.type === 'progress') {
    let screen
    switch (detail.key) {
      case 'workoutHistory':
        screen = <WorkoutHistoryScreen state={state} dayNum={dayNum} onBack={closeDetail} />
        break
      case 'dietStreak':
        screen = <DietStreakScreen state={state} dayNum={dayNum} onBack={closeDetail} />
        break
      case 'beforeAfter':
        screen = <BeforeAfterScreen state={state} dayNum={dayNum} onBack={closeDetail} />
        break
      case 'bookLibrary':
        screen = <BookLibraryScreen state={state} onBack={closeDetail} />
        break
      default:
        screen = null
    }
    return <div className="app">{screen}</div>
  }

  let content
  switch (tab) {
    case 'progress':
      content = (
        <ProgressScreen
          state={state}
          dayNum={dayNum}
          focusDay={progressFocusDay}
          onOpenDetail={openProgressDetail}
          onEditPastTask={openPastTask}
          onClearFocusDay={() => setProgressFocusDay(null)}
        />
      )
      break
    case 'journal':
      content = (
        <JournalScreen
          state={state}
          dayNum={dayNum}
          dayLog={dayLog}
          onOpenTask={openTask}
          onUpdateToday={updateToday}
          onUpdateWeeklyReflection={updateWeeklyReflection}
        />
      )
      break
    case 'profile':
      content = (
        <ProfileScreen
          state={state}
          dayNum={dayNum}
          onUpdateSettings={updateSettings}
          onUpdateProfile={updateProfile}
          onRestart={handleRestart}
          onImport={handleImport}
        />
      )
      break
    default:
      content = (
        <TodayScreen state={state} dayNum={dayNum} today={today} dayLog={dayLog} onOpenTask={openTask} />
      )
  }

  return (
    <div className="app">
      {content}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
