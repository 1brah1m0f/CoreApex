import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { tasksApi } from '../../api'
import { Task } from '../../types'
import { MOCK_TASKS } from '../../mocks'
import KPICard from '../../components/KPICard'
import TaskCard from '../../components/TaskCard'
import Spinner from '../../components/ui/Spinner'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function InspectorDashboard() {
  const { data, loading } = useApi<Task[]>(() => tasksApi.mine())

  const apiAll = toArr<Task>(data)
  const all = apiAll.length ? apiAll : MOCK_TASKS
  const kpi = {
    total: all.length,
    inprogress: all.filter(t => t.status === 'inprogress').length,
    resolved: all.filter(t => t.status === 'resolved').length,
    overdue: all.filter(t => t.status === 'overdue').length,
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">İnspektor Paneli</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KPICard label="Cəmi tapşırıq" value={kpi.total} icon={<ClipboardList size={20} />} />
        <KPICard label="Davam edir" value={kpi.inprogress} icon={<Clock size={20} />} color="text-blue-600" />
        <KPICard label="Tamamlandı" value={kpi.resolved} icon={<CheckCircle size={20} />} color="text-success" />
        <KPICard label="Gecikib" value={kpi.overdue} icon={<AlertCircle size={20} />} color="text-danger" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-semibold text-gray-900">Aktiv tapşırıqlar</h2>
        <Link to="/inspector/tasks" className="text-sm text-primary hover:underline">Hamısı</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {all.filter(t => t.status !== 'resolved').slice(0, 6).map(t => (
            <TaskCard key={t.id} task={t} />
          ))}
          {all.length === 0 && (
            <p className="col-span-2 text-center text-muted py-16">Tapşırıq yoxdur</p>
          )}
        </div>
      )}
    </div>
  )
}
