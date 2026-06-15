import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WeekDetail from './pages/WeekDetail'
import LogWorkout from './pages/LogWorkout'
import Progress from './pages/Progress'
import { getCurrentWeekNumber } from './utils/dates'

export default function App() {
  const currentWeek = Math.max(getCurrentWeekNumber(), 1)

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/week" element={<Navigate to={`/week/${currentWeek}`} replace />} />
        <Route path="/week/:weekNumber" element={<WeekDetail />} />
        <Route path="/log" element={<LogWorkout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
