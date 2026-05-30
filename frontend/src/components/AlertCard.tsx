import { Info, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'
import { GovAlert, AlertType } from '../types'

const config: Record<AlertType, { icon: typeof Info; classes: string; bg: string }> = {
  info: { icon: Info, classes: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  warning: { icon: AlertTriangle, classes: 'text-warning', bg: 'bg-yellow-50 border-yellow-200' },
  success: { icon: CheckCircle, classes: 'text-success', bg: 'bg-green-50 border-green-200' },
}

interface AlertCardProps {
  alert: GovAlert
  onDelete?: (id: string) => void
  deleting?: boolean
}

export default function AlertCard({ alert, onDelete, deleting }: AlertCardProps) {
  const { icon: Icon, classes, bg } = config[alert.type] ?? config.info
  return (
    <div className={`rounded-xl p-4 border ${bg} flex items-start gap-3`}>
      <Icon size={18} className={`mt-0.5 flex-shrink-0 ${classes}`} />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900">{alert.title}</h4>
        <p className="text-sm text-muted mt-0.5">{alert.body}</p>
        <div className="flex gap-3 text-xs text-muted mt-1">
          <span>{alert.district}</span>
          <span>{alert.date}</span>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(alert.id)}
          disabled={deleting}
          className="text-muted hover:text-danger transition-colors disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
