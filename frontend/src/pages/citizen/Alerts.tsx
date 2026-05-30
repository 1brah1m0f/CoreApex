import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { alertsApi } from '../../api'
import { GovAlert } from '../../types'
import AlertCard from '../../components/AlertCard'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const types = [
  { value: '', label: 'Hamısı' },
  { value: 'info', label: 'Məlumat' },
  { value: 'warning', label: 'Xəbərdarlıq' },
  { value: 'success', label: 'Müsbət' },
]

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function CitizenAlerts() {
  const [type, setType] = useState('')
  const { data, loading } = useApi<GovAlert[]>(
    () => alertsApi.list(type || undefined),
    [type]
  )

  const list = toArr<GovAlert>(data)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/citizen/dashboard' }, { label: 'Bildirişlər' }]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-5">Rəsmi Bildirişlər</h1>

      <div className="flex gap-2 flex-wrap mb-5">
        {types.map(t => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors
              ${type === t.value
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(a => <AlertCard key={a.id} alert={a} />)}
          {list.length === 0 && (
            <p className="text-center text-muted py-16">Bildiriş tapılmadı</p>
          )}
        </div>
      )}
    </div>
  )
}
