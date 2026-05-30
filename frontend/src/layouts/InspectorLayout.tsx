import { Outlet } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Activity } from 'lucide-react'
import Sidebar from './Sidebar'

const nav = [
  { to: '/inspector/dashboard', label: 'Ana səhifə', icon: LayoutDashboard },
  { to: '/inspector/tasks', label: 'Tapşırıqlar', icon: ClipboardList },
  { to: '/inspector/simulation', label: 'Simulyasiya', icon: Activity },
]

export default function InspectorLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role="inspektor" items={nav} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
