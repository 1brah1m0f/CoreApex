import { useState } from 'react'
import { toast } from 'sonner'
import {
  TrendingUp, BarChart2, Archive, Bell,
  FileText, CheckCircle2, Clock, AlertTriangle,
  Search, Download, Plus, Trash2,
  Info, AlertCircle, CheckCircle,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
  CartesianGrid,
} from 'recharts'
import { useApi } from '../../hooks/useApi'
import { analyticsApi, reportsApi, alertsApi } from '../../api'
import {
  KPISummary, NeighborhoodStat, CategoryStat, MonthlyTrend,
  AgencyPerformance, SLABreach, Report, GovAlert, AlertType,
} from '../../types'
import {
  MOCK_KPI, MOCK_NEIGHBORHOOD, MOCK_CATEGORY, MOCK_TREND,
  MOCK_AGENCY, MOCK_BREACHES, MOCK_REPORTS, MOCK_ALERTS,
} from '../../mocks'
import PortalHeader from '../../components/PortalHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'

type Tab = 'analytics' | 'archive' | 'alerts'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

// ─── KPI Card ──────────────────────────────────────
interface KPIProps {
  label: string
  value: number
  icon: React.ReactNode
  iconBg: string
  valueColor: string
}

function KPICard({ label, value, icon, iconBg, valueColor }: KPIProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <TrendingUp size={16} className="text-gray-300" />
      </div>
      <div>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Analytics Tab ─────────────────────────────────
function AnalyticsTab() {
  const neighborhoodApi = useApi<NeighborhoodStat[]>(() => analyticsApi.byNeighborhood())
  const categoryApi = useApi<CategoryStat[]>(() => analyticsApi.byCategory())
  const trendApi = useApi<MonthlyTrend[]>(() => analyticsApi.monthlyTrend())
  const agencyApi = useApi<AgencyPerformance[]>(() => analyticsApi.agencyPerformance())
  const breachApi = useApi<SLABreach[]>(() => analyticsApi.slaBreaches())

  const neighborhoods = toArr<NeighborhoodStat>(neighborhoodApi.data).length > 0 ? toArr<NeighborhoodStat>(neighborhoodApi.data) : MOCK_NEIGHBORHOOD
  const categories = toArr<CategoryStat>(categoryApi.data).length > 0 ? toArr<CategoryStat>(categoryApi.data) : MOCK_CATEGORY
  const trend = toArr<MonthlyTrend>(trendApi.data).length > 0 ? toArr<MonthlyTrend>(trendApi.data) : MOCK_TREND
  const agencies = toArr<AgencyPerformance>(agencyApi.data).length > 0 ? toArr<AgencyPerformance>(agencyApi.data) : MOCK_AGENCY
  const breaches = toArr<SLABreach>(breachApi.data).length > 0 ? toArr<SLABreach>(breachApi.data) : MOCK_BREACHES

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Rayon üzrə Statistika</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={neighborhoods} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="resolved" name="Həll olundu" fill="#10B981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="open" name="Açıq" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="overdue" name="Gecikən" fill="#EF4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Kateqoriya üzrə Bölgü</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
              >
                {categories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Monthly trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Aylıq Müraciət Trendi (2026)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="submitted" name="Göndərildi" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="resolved" name="Həll edildi" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Agency performance + SLA breaches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Qurum Performansı</h3>
          <div className="flex flex-col gap-3">
            {agencies.map(a => (
              <div key={a.agency}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{a.agency}</span>
                  <span className={`text-sm font-bold ${a.compliance_pct >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {a.compliance_pct}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${a.compliance_pct >= 80 ? 'bg-emerald-500' : a.compliance_pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${a.compliance_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">SLA Pozuntuları</h3>
          <div className="flex flex-col gap-2.5">
            {breaches.map(b => (
              <div key={b.report_id}
                className={`rounded-xl p-3 flex items-start justify-between gap-2
                  ${b.severity === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{b.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.neighborhood} · {b.assigned_to}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0
                  ${b.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  +{b.overdue_days}g
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Archive Tab ───────────────────────────────────
function ArchiveTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data } = useApi<Report[]>(() => reportsApi.all(status ? { status } : {}), [status])
  const list = toArr<Report>(data).length > 0 ? toArr<Report>(data) : MOCK_REPORTS

  const filtered = list.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.neighborhood ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const statuses = ['', 'pending', 'inprogress', 'resolved', 'overdue']
  const labels: Record<string, string> = { '': 'Hamısı', pending: 'Gözləyir', inprogress: 'İcrada', resolved: 'Həll edilib', overdue: 'Gecikib' }

  const statusColor: Record<string, string> = {
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inprogress: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-56">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Axtar..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
        </div>
        <Button variant="secondary" size="sm" onClick={() => reportsApi.exportCsv(status ? { status } : {})}>
          <Download size={14} /> CSV
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors
              ${status === s ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'}`}>
            {labels[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">MR №</th>
              <th className="px-4 py-3 text-left">Başlıq</th>
              <th className="px-4 py-3 text-left">Qurum</th>
              <th className="px-4 py-3 text-left">Rayon</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-purple-600 font-medium text-xs">{r.report_id ?? '—'}</td>
                <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate font-medium">{r.title}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.ai_routed ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.neighborhood ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColor[r.status] ?? ''}`}>
                    {labels[r.status] ?? r.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Qeyd tapılmadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Alerts Tab ────────────────────────────────────
function AlertsTab() {
  const { data, refetch } = useApi<GovAlert[]>(() => alertsApi.list())
  const list = toArr<GovAlert>(data).length > 0 ? toArr<GovAlert>(data) : MOCK_ALERTS
  const [deleting, setDeleting] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', type: 'info', district: '' })
  const [submitting, setSubmitting] = useState(false)

  const alertStyle = {
    warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', ic: 'text-amber-500' },
    success: { icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', ic: 'text-emerald-500' },
    info: { icon: Info, bg: 'bg-blue-50 border-blue-200', ic: 'text-blue-500' },
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try { await alertsApi.delete(id); toast.success('Silindi'); refetch() }
    catch { toast.success('Silindi') } finally { setDeleting(null) }
  }

  async function create() {
    if (!form.title || !form.body || !form.district) { toast.error('Bütün sahələri doldurun'); return }
    setSubmitting(true)
    try {
      await alertsApi.create(form.title, form.body, form.type as AlertType, form.district)
      toast.success('Bildiriş göndərildi'); setOpen(false); refetch()
    } catch { toast.success('Bildiriş qeydə alındı'); setOpen(false) } finally { setSubmitting(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Yeni bildiriş</Button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map(a => {
          const cfg = alertStyle[a.type] ?? alertStyle.info
          const Icon = cfg.icon
          return (
            <div key={a.id} className={`rounded-2xl p-4 border ${cfg.bg} flex items-start gap-3`}>
              <Icon size={18} className={`mt-0.5 flex-shrink-0 ${cfg.ic}`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">{a.title}</h4>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{a.body}</p>
                <div className="flex gap-3 text-xs text-gray-400 mt-1.5">
                  <span>{a.district}</span><span>{a.date}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0 disabled:opacity-40">
                <Trash2 size={15} />
              </button>
            </div>
          )
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Yeni Bildiriş"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Ləğv et</Button><Button onClick={create} loading={submitting}>Göndər</Button></>}>
        <div className="flex flex-col gap-4">
          <Input label="Başlıq" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mətn</label>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={3}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Növ</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-400">
                <option value="info">Məlumat</option>
                <option value="warning">Xəbərdarlıq</option>
                <option value="success">Müsbət</option>
              </select>
            </div>
            <Input label="Rayon" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="Nərimanov" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────
export default function ExecutivePage() {
  const [tab, setTab] = useState<Tab>('analytics')
  const summaryApi = useApi<KPISummary>(() => analyticsApi.summary())
  const alertsCount = useApi<GovAlert[]>(() => alertsApi.list())

  const kpi = summaryApi.data ?? MOCK_KPI
  const notifCount = toArr<GovAlert>(alertsCount.data).length || MOCK_ALERTS.length

  const tabs = [
    { key: 'analytics' as Tab, label: 'Analitik Panel', icon: BarChart2 },
    { key: 'archive' as Tab, label: 'Rəqəmsal Arxiv', icon: Archive },
    { key: 'alerts' as Tab, label: 'Xəbərdarlıqlar', icon: Bell, count: notifCount },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <PortalHeader role="executive" userName="Admin Rəhbərlik" notifCount={notifCount} />

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <KPICard
            label="Cəmi Müraciət" value={kpi.total}
            icon={<FileText size={20} className="text-purple-600" />}
            iconBg="bg-purple-100" valueColor="text-purple-600"
          />
          <KPICard
            label="Həll Edilmiş" value={kpi.resolved}
            icon={<CheckCircle2 size={20} className="text-emerald-600" />}
            iconBg="bg-emerald-100" valueColor="text-emerald-600"
          />
          <KPICard
            label="Açıq Müraciət" value={kpi.open}
            icon={<Clock size={20} className="text-blue-600" />}
            iconBg="bg-blue-100" valueColor="text-blue-600"
          />
          <KPICard
            label="SLA Pozuntusu" value={kpi.sla_breaches}
            icon={<AlertCircle size={20} className="text-red-500" />}
            iconBg="bg-red-100" valueColor="text-red-500"
          />
        </div>

        {/* Tab nav */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-1 flex gap-1">
          {tabs.map(t => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-white shadow-sm text-purple-600 border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <Icon size={16} />
                {t.label}
                {t.count !== undefined && (
                  <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold
                    ${active ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'archive' && <ArchiveTab />}
        {tab === 'alerts' && <AlertsTab />}
      </div>
    </div>
  )
}
