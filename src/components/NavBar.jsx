import { NavLink } from 'react-router-dom'
import { Mountain } from 'lucide-react'
import { getCurrentWeekNumber } from '../utils/dates'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/week', label: 'My Week' },
  { to: '/log', label: 'Log' },
  { to: '/progress', label: 'Progress' },
]

export default function NavBar() {
  const currentWeek = Math.max(getCurrentWeekNumber(), 1)

  return (
    <header className="bg-crimson text-cream">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <Mountain size={22} strokeWidth={1.5} />
          <span className="font-display font-bold text-lg">Kane Creek</span>
        </NavLink>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to === '/week' ? `/week/${currentWeek}` : link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-xs font-display font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-cream' : 'text-cream/60 hover:text-cream'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
