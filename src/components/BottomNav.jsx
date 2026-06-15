import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, PlusCircle, TrendingUp } from 'lucide-react'
import { getCurrentWeekNumber } from '../utils/dates'

const links = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/week', label: 'My Week', icon: CalendarDays },
  { to: '/log', label: 'Log', icon: PlusCircle },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
]

export default function BottomNav() {
  const currentWeek = Math.max(getCurrentWeekNumber(), 1)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around py-2 z-20">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to === '/week' ? `/week/${currentWeek}` : to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-body uppercase tracking-widest ${
              isActive ? 'text-canyon' : 'text-muted'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
