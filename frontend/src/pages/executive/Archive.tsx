import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { reportsApi } from '../../api'
import { Report } from '../../types'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function Archive() {
  const [search, setSearch] = useState('')
  const { data, loading } = useApi<Report[]>(() => reportsApi.all({ status: 'resolved' }))

  const list = toArr<Report>(data)
  const filtered = list.filter(r =>
    !search ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.neighborhood ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/executive/dashboard' }, { label: 'Arxiv' }]} />
      <div className="flex items-center justify-between mt-4 mb-5">
        <h1 className="font-heading text-2xl font-bold text-primary">Arxiv</h1>
        <Button variant="secondary" onClick={() => reportsApi.exportCsv({ status: 'resolved' })}>
          <Download size={15} /> CSV ixrac
        </Button>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Axtar (başlıq, rayon)..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none
            focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Başlıq</th>
                <th className="px-4 py-3 text-left">Kateqoriya</th>
                <th className="px-4 py-3 text-left">Rayon</th>
                <th className="px-4 py-3 text-left">Göndərildi</th>
                <th className="px-4 py-3 text-left">Həll edildi</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 max-w-[180px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-muted">{r.category ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{r.neighborhood ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{r.submitted_date ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{r.resolved_date ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted">Qeyd tapılmadı</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
