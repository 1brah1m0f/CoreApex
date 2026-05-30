import { ReactNode } from 'react'

interface KPICardProps {
  label: string
  value: number | string
  icon: ReactNode
  color?: string
}

export default function KPICard({ label, value, icon, color = 'text-primary' }: KPICardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card flex items-center gap-4">
      <div className={`rounded-lg bg-blue-50 p-3 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-heading font-bold text-gray-900">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  )
}
