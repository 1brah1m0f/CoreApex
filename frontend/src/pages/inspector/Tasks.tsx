import { useState } from 'react'
import { toast } from 'sonner'
import { Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { tasksApi } from '../../api'
import { Task, ReportStatus } from '../../types'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const nextStatus: Partial<Record<ReportStatus, ReportStatus>> = {
  pending: 'inprogress',
  inprogress: 'resolved',
}

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function InspectorTasks() {
  const { data, loading, refetch } = useApi<Task[]>(() => tasksApi.mine())
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  const list = toArr<Task>(data)

  async function handleStatusUpdate(task: Task) {
    const next = nextStatus[task.status]
    if (!next) return
    setUpdating(task.id)
    try {
      await tasksApi.updateStatus(task.id, next)
      toast.success('Status yeniləndi')
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setUpdating(null)
    }
  }

  async function handleUpload(task: Task, file: File) {
    setUploading(task.id)
    try {
      await tasksApi.uploadProof(task.id, file)
      toast.success('Sübut yükləndi')
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/inspector/dashboard' }, { label: 'Tapşırıqlar' }]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-5">Tapşırıqlarım</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(task => (
            <div key={task.id} className="rounded-xl bg-white shadow-card border border-border overflow-hidden">
              <button
                onClick={() => setExpanded(e => e === task.id ? null : task.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={task.status} />
                  <span className="font-medium text-gray-900">{task.title}</span>
                </div>
                {expanded === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expanded === task.id && (
                <div className="px-5 pb-5 border-t border-border pt-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted">Ünvan:</span> {task.address}</div>
                    <div><span className="text-muted">Kateqoriya:</span> {task.category}</div>
                    <div><span className="text-muted">Prioritet:</span> {task.priority}</div>
                    <div><span className="text-muted">Tarix:</span> {task.date}</div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted">{task.description}</p>
                  )}

                  {task.agency_requirements && task.agency_requirements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Tələblər:</p>
                      <ul className="list-disc list-inside text-sm text-muted space-y-0.5">
                        {task.agency_requirements.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {nextStatus[task.status] && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(task)}
                        loading={updating === task.id}
                      >
                        {task.status === 'pending' ? 'Başla' : 'Tamamla'}
                      </Button>
                    )}
                    <label className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm
                      font-medium bg-white border border-primary text-primary hover:bg-blue-50
                      cursor-pointer transition-colors ${uploading === task.id ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {uploading === task.id ? 'Yüklənir...' : 'Sübut yüklə'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) handleUpload(task, f)
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          {list.length === 0 && (
            <p className="text-center text-muted py-16">Tapşırıq tapılmadı</p>
          )}
        </div>
      )}
    </div>
  )
}
