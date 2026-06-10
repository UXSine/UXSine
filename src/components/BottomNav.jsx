import { SquaresFour, ChartLineUp, BookOpen, User } from '@phosphor-icons/react'

const TABS = [
  { key: 'today', label: 'Today', icon: SquaresFour },
  { key: 'progress', label: 'Progress', icon: ChartLineUp },
  { key: 'journal', label: 'Journal', icon: BookOpen },
  { key: 'profile', label: 'Profile', icon: User },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            className={`nav-item${isActive ? ' active' : ''}`}
            onClick={() => onChange(key)}
          >
            <Icon size={22} weight="regular" color={isActive ? '#2A7A7D' : '#9C9C96'} />
            <span className={`nav-label${isActive ? ' nav-label--active' : ''}`}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
