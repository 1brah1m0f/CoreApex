import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { reportsApi, alertsApi } from '../../api'
import { Report, GovAlert } from '../../types'
import KPICard from '../../components/KPICard'
import ReportCard from '../../components/ReportCard'
import AlertCard from '../../components/AlertCard'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function CitizenDashboard() {
  const reports = useApi<Report[]>(() => reportsApi.mine())
  const alerts = useApi<GovAlert[]>(() => alertsApi.list())

  const all = toArr<Report>(reports.data)
  const alertList = toArr<GovAlert>(alerts.data)

  const kpi = {
    total: all.length,
    inprogress: all.filter(r => r.status === 'inprogress').length,
    resolved: all.filter(r => r.status === 'resolved').length,
    overdue: all.filter(r => r.status === 'overdue').length,
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Xoş gəldiniz</h1>
        <Link to="/citizen/reports/new">
          <Button>+ Yeni müraciət</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KPICard label="Cəmi müraciət" value={kpi.total} icon={<FileText size={20} />} />
        <KPICard label="Davam edir" value={kpi.inprogress} icon={<Clock size={20} />} color="text-blue-600" />
        <KPICard label="Həll edilib" value={kpi.resolved} icon={<CheckCircle size={20} />} color="text-success" />
        <KPICard label="Gecikib" value={kpi.overdue} icon={<AlertCircle size={20} />} color="text-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-gray-900">Son müraciətlər</h2>
            <Link to="/citizen/reports" className="text-sm text-primary hover:underline">Hamısı</Link>
          </div>
          {reports.loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : all.slice(0, 4).map(r => (
            <div key={r.id} className="mb-3">
              <ReportCard report={r} />
            </div>
          ))}
          {!reports.loading && all.length === 0 && (
            <p className="text-sm text-muted text-center py-8">Hələ müraciət yoxdur</p>
          )}
        </section>

        <section>
          <h2 className="font-heading font-semibold text-gray-900 mb-3">Aktiv bildirişlər</h2>
          {alerts.loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : alertList.slice(0, 4).map(a => (
            <div key={a.id} className="mb-3">
              <AlertCard alert={a} />
            </div>
          ))}
          {!alerts.loading && alertList.length === 0 && (
            <p className="text-sm text-muted text-center py-8">Bildiriş yoxdur</p>
          )}
        </section>
      </div>
    </div>
  )
}
