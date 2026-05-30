import { ReportStatus } from '../types'

const config: Record<ReportStatus, { label: string; classes: string }> = {
  pending: { label: 'Gözləyir', classes: 'bg-yellow-100 text-yellow-800' },
  inprogress: { label: 'Davam edir', classes: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Həll edilib', classes: 'bg-green-100 text-green-800' },
  overdue: { label: 'Gecikib', classes: 'bg-red-100 text-red-800' },
}

export default function StatusBadge({ status }: { status: ReportStatus }) {
  const { label, classes } = config[status] ?? config.pending
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
