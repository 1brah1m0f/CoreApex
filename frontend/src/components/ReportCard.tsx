import { MapPin, Calendar } from 'lucide-react'
import { Report } from '../types'
import StatusBadge from './StatusBadge'

interface ReportCardProps {
  report: Report
  onClick?: () => void
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-white p-4 shadow-card border border-border
        ${onClick ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-1">{report.title}</h3>
        <StatusBadge status={report.status} />
      </div>
      <div className="flex flex-col gap-1 text-sm text-muted">
        {report.address && (
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {report.address}
          </span>
        )}
        {(report.submitted_date || report.date) && (
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {report.submitted_date ?? report.date}
          </span>
        )}
        {report.category && (
          <span className="text-xs bg-blue-50 text-primary rounded-full px-2 py-0.5 w-fit">
            {report.category}
          </span>
        )}
      </div>
    </div>
  )
}
