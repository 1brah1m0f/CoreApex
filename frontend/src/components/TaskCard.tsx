import { MapPin, Tag } from 'lucide-react'
import { Task } from '../types'
import StatusBadge from './StatusBadge'

const priorityColors = {
  high: 'text-danger',
  medium: 'text-warning',
  low: 'text-success',
}

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-white p-4 shadow-card border border-border
        ${onClick ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-1">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <div className="flex flex-col gap-1 text-sm text-muted">
        {task.address && (
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {task.address}
          </span>
        )}
        {task.category && (
          <span className="flex items-center gap-1">
            <Tag size={13} /> {task.category}
          </span>
        )}
        <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority === 'high' ? 'Yüksək' : task.priority === 'medium' ? 'Orta' : 'Aşağı'} prioritet
        </span>
      </div>
    </div>
  )
}
