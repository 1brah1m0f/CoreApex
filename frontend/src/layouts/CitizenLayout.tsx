import { Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, Lightbulb, Bell } from 'lucide-react'
import Sidebar from './Sidebar'

const nav = [
  { to: '/citizen/dashboard', label: 'Ana səhifə', icon: LayoutDashboard },
  { to: '/citizen/reports', label: 'Müraciətlərim', icon: FileText },
  { to: '/citizen/proposals', label: 'Təkliflər', icon: Lightbulb },
  { to: '/citizen/alerts', label: 'Bildirişlər', icon: Bell },
]

export default function CitizenLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role="vətəndaş" items={nav} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
