import { FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { analyticsApi, reportsApi } from '../../api'
import { KPISummary, SLABreach, Report } from '../../types'
import { MOCK_KPI, MOCK_BREACHES, MOCK_REPORTS } from '../../mocks'
import KPICard from '../../components/KPICard'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/ui/Spinner'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function ExecutiveDashboard() {
  const summary = useApi<KPISummary>(() => analyticsApi.summary())
  const breaches = useApi<SLABreach[]>(() => analyticsApi.slaBreaches())
  const recent = useApi<Report[]>(() => reportsApi.all({}))

  const kpi = summary.data ?? MOCK_KPI
  const breachList = toArr<SLABreach>(breaches.data).length > 0 ? toArr<SLABreach>(breaches.data) : MOCK_BREACHES
  const recentList = toArr<Report>(recent.data).length > 0 ? toArr<Report>(recent.data) : MOCK_REPORTS

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">İcraçı Paneli</h1>

      {summary.loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KPICard label="Cəmi müraciət" value={kpi.total} icon={<FileText size={20} />} />
          <KPICard label="Açıq" value={kpi.open} icon={<TrendingUp size={20} />} color="text-blue-600" />
          <KPICard label="Həll edilib" value={kpi.resolved} icon={<CheckCircle size={20} />} color="text-success" />
          <KPICard label="SLA pozuntusu" value={kpi.sla_breaches} icon={<AlertCircle size={20} />} color="text-danger" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-gray-900">Son müraciətlər</h2>
            <Link to="/executive/reports" className="text-sm text-primary hover:underline">Hamısı</Link>
          </div>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Başlıq</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentList.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">{r.title}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-gray-900">SLA Pozuntuları</h2>
            <Link to="/executive/analytics" className="text-sm text-primary hover:underline">Analitika</Link>
          </div>
          <div className="flex flex-col gap-3">
            {breachList.slice(0, 4).map(b => (
              <div key={b.report_id} className={`rounded-xl p-4 border
                ${b.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.title}</p>
                    <p className="text-xs text-muted mt-0.5">{b.neighborhood} · {b.assigned_to}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${b.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    +{b.overdue_days} gün
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
