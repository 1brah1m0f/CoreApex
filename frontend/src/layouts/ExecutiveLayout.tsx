import { Outlet } from 'react-router-dom'
import { LayoutDashboard, BarChart2, FileText, Bell, Archive } from 'lucide-react'
import Sidebar from './Sidebar'

const nav = [
  { to: '/executive/dashboard', label: 'Ana səhifə', icon: LayoutDashboard },
  { to: '/executive/analytics', label: 'Analitika', icon: BarChart2 },
  { to: '/executive/reports', label: 'Müraciətlər', icon: FileText },
  { to: '/executive/alerts', label: 'Bildirişlər', icon: Bell },
  { to: '/executive/archive', label: 'Arxiv', icon: Archive },
]

export default function ExecutiveLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role="icraçı" items={nav} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
