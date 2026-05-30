import { useEffect, useState } from 'react'
import { Bell, User, LogOut, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Modal from './ui/Modal'
import { GovAlert } from '../types'
import { MOCK_ALERTS } from '../mocks'

interface PortalHeaderProps {
  role: 'citizen' | 'inspector' | 'executive'
  userName?: string
  notifCount?: number
  notifications?: GovAlert[]
}

const roleConfig = {
  citizen: { label: 'Vətəndaş', color: 'text-blue-500 bg-blue-50', userIcon: User },
  inspector: { label: 'Müfəttiş', color: 'text-green-600 bg-green-50', userIcon: User },
  executive: { label: 'İcra Hakimiyyəti', color: 'text-purple-600 bg-purple-50', userIcon: Building2 },
}

export default function PortalHeader({
  role,
  userName = 'İstifadəçi',
  notifCount = 0,
  notifications = MOCK_ALERTS,
}: PortalHeaderProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(notifCount > 0)
  const { label, color, userIcon: UserIcon } = roleConfig[role]

  useEffect(() => {
    setHasUnread(notifCount > 0)
  }, [notifCount])

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
          <button
            onClick={() => {
              setNotifOpen(true)
              setHasUnread(false)
            }}
            className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
            title="Bildirişlər"
          >
            <Bell size={20} className="text-gray-500" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 pl-1 rounded-xl px-2 py-1 hover:bg-gray-50 transition-colors"
            title="Profil"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <UserIcon size={15} className="text-gray-500" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <span className="text-xs text-gray-400">Profil</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors ml-1"
            title="Çıxış"
          >
            <LogOut size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Profil Məlumatları">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <UserIcon size={20} className="text-gray-500" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{userName}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Portal</p>
            <p className="font-medium text-gray-800">Nərimanov SmartOps</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Bildirişlər</p>
            <p className="font-medium text-gray-800">{notifCount}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <p className="font-medium text-gray-800">Aktiv</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Rol</p>
            <p className="font-medium text-gray-800">{label}</p>
          </div>
        </div>
      </Modal>
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Bildirişlər">
        <div className="flex flex-col gap-3">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500">Hazırda bildiriş yoxdur.</p>
          )}
          {notifications.map(n => (
            <div key={n.id} className="rounded-xl border border-gray-100 bg-white p-3">
              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{n.body}</p>
              <div className="mt-2 flex gap-3 text-xs text-gray-400">
                <span>{n.district}</span>
                <span>{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </header>
  )
}
