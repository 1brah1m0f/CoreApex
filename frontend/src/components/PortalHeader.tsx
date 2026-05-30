import { Bell, User, LogOut, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PortalHeaderProps {
  role: 'citizen' | 'inspector' | 'executive'
  userName?: string
  notifCount?: number
}

const roleConfig = {
  citizen: { label: 'Vətəndaş', color: 'text-blue-500 bg-blue-50', userIcon: User },
  inspector: { label: 'Müfəttiş', color: 'text-green-600 bg-green-50', userIcon: User },
  executive: { label: 'İcra Hakimiyyəti', color: 'text-purple-600 bg-purple-50', userIcon: Building2 },
}

export default function PortalHeader({ role, userName = 'İstifadəçi', notifCount = 0 }: PortalHeaderProps) {
  const navigate = useNavigate()
  const { label, color, userIcon: UserIcon } = roleConfig[role]

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm tracking-wide">NS</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[15px] leading-tight">Nərimanov SmartOps</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Bell size={20} className="text-gray-500" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <UserIcon size={15} className="text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors ml-1"
            title="Çıxış"
          >
            <LogOut size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
