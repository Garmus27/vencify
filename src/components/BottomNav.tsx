import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/branches', label: 'Sucursales', icon: '🏪' },
  { to: '/reports', label: 'Reportes', icon: '📋' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-xl -translate-x-1/2 border-t border-gray-800 bg-gray-900/95 backdrop-blur-safe">
      <div className="flex justify-around py-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`
            }
          >
            <span className="text-2xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
