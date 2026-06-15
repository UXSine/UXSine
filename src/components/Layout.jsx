import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-5 pb-24 md:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
