import { NavLink, useNavigate } from 'react-router-dom'
import { LucideIcon, LogOut } from 'lucide-react'
import logo from '../loqo.jpeg'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  role: string
  items: NavItem[]
}

export default function Sidebar({ role, items }: SidebarProps) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 min-h-screen bg-primary flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Mobil İcra" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white/30" />
          <div>
            <p className="font-heading font-bold text-white text-sm leading-tight">Mobil İcra</p>
            <span className="text-white/60 text-xs capitalize">{role}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors
              ${isActive
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={17} />
          Çıxış
        </button>
      </div>
    </aside>
  )
}
