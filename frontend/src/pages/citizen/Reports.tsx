import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { reportsApi } from '../../api'
import { Report } from '../../types'
import ReportCard from '../../components/ReportCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const statuses = [
  { value: '', label: 'Hamısı' },
  { value: 'pending', label: 'Gözləyir' },
  { value: 'inprogress', label: 'Davam edir' },
  { value: 'resolved', label: 'Həll edilib' },
  { value: 'overdue', label: 'Gecikib' },
]

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function CitizenReports() {
  const [status, setStatus] = useState('')
  const { data, loading } = useApi<Report[]>(
    () => reportsApi.mine(status || undefined),
    [status]
  )

  const list = toArr<Report>(data)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/citizen/dashboard' }, { label: 'Müraciətlərim' }]} />
      <div className="flex items-center justify-between mt-4 mb-5">
        <h1 className="font-heading text-2xl font-bold text-primary">Müraciətlərim</h1>
        <Link to="/citizen/reports/new">
          <Button>+ Yeni müraciət</Button>
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors
              ${status === s.value
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map(r => <ReportCard key={r.id} report={r} />)}
          {list.length === 0 && (
            <p className="col-span-2 text-center text-muted py-16">Müraciət tapılmadı</p>
          )}
        </div>
      )}
    </div>
  )
}
