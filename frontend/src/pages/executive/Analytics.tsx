import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useApi } from '../../hooks/useApi'
import { analyticsApi } from '../../api'
import { NeighborhoodStat, CategoryStat, MonthlyTrend, AgencyPerformance } from '../../types'
import {
  MOCK_NEIGHBORHOOD, MOCK_CATEGORY, MOCK_TREND, MOCK_AGENCY,
} from '../../mocks'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function ExecutiveAnalytics() {
  const byNeighborhood = useApi<NeighborhoodStat[]>(() => analyticsApi.byNeighborhood())
  const byCategory = useApi<CategoryStat[]>(() => analyticsApi.byCategory())
  const monthlyTrend = useApi<MonthlyTrend[]>(() => analyticsApi.monthlyTrend())
  const agencyPerf = useApi<AgencyPerformance[]>(() => analyticsApi.agencyPerformance())

  const neighborhoods = toArr<NeighborhoodStat>(byNeighborhood.data).length > 0 ? toArr<NeighborhoodStat>(byNeighborhood.data) : MOCK_NEIGHBORHOOD
  const categories = toArr<CategoryStat>(byCategory.data).length > 0 ? toArr<CategoryStat>(byCategory.data) : MOCK_CATEGORY
  const trend = toArr<MonthlyTrend>(monthlyTrend.data).length > 0 ? toArr<MonthlyTrend>(monthlyTrend.data) : MOCK_TREND
  const agencies = toArr<AgencyPerformance>(agencyPerf.data).length > 0 ? toArr<AgencyPerformance>(agencyPerf.data) : MOCK_AGENCY

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/executive/dashboard' }, { label: 'Analitika' }]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-6">Analitika</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Aylıq Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submitted" name="Göndərildi" stroke="#1A3C6E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" name="Həll edildi" stroke="#16A34A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Kateqoriyaya görə</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Məhəlləyə görə</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={neighborhoods} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" name="Həll edilib" fill="#16A34A" />
              <Bar dataKey="open" name="Açıq" fill="#1A3C6E" />
              <Bar dataKey="overdue" name="Gecikib" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Qurum Performansı</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-muted text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Qurum</th>
                  <th className="px-3 py-2 text-right">Uyğunluq %</th>
                  <th className="px-3 py-2 text-right">Ort. saat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agencies.map(a => (
                  <tr key={a.agency}>
                    <td className="px-3 py-2.5 text-gray-900">{a.agency}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`font-semibold ${a.compliance_pct >= 80 ? 'text-success' : 'text-danger'}`}>
                        {a.compliance_pct}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted">
                      {a.avg_resolution_hours ? `${a.avg_resolution_hours}s` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
