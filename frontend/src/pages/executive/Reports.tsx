import { useState } from 'react'
import { toast } from 'sonner'
import { Download, Search } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { reportsApi, tasksApi } from '../../api'
import { Report } from '../../types'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const statuses = ['', 'pending', 'inprogress', 'resolved', 'overdue']
const statusLabels: Record<string, string> = {
  '': 'Hamısı', pending: 'Gözləyir', inprogress: 'Davam edir', resolved: 'Həll edilib', overdue: 'Gecikib',
}

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function ExecutiveReports() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const { data, loading, refetch } = useApi<Report[]>(
    () => reportsApi.all(status ? { status } : {}),
    [status]
  )
  const [slaModal, setSlaModal] = useState<Report | null>(null)
  const [slaForm, setSlaForm] = useState({ report_text: '', recommended_action: '', severity: 'high' })
  const [submitting, setSubmitting] = useState(false)
  const [taskModal, setTaskModal] = useState<Report | null>(null)
  const [taskForm, setTaskForm] = useState({ inspector_id: '', deadline: '' })
  const [creatingTask, setCreatingTask] = useState(false)

  const list = toArr<Report>(data)
  const filtered = list.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSlaSubmit() {
    if (!slaModal) return
    setSubmitting(true)
    try {
      await reportsApi.slaReport(slaModal.id, slaForm.report_text, slaForm.recommended_action, slaForm.severity)
      toast.success('SLA hesabatı göndərildi')
      setSlaModal(null)
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateTask() {
    if (!taskModal) return
    if (!taskForm.inspector_id || !taskForm.deadline) { toast.error('Bütün sahələri doldurun'); return }
    setCreatingTask(true)
    try {
      await tasksApi.create(taskModal.id, taskForm.inspector_id, taskForm.deadline)
      toast.success('Tapşırıq yaradıldı')
      setTaskModal(null)
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setCreatingTask(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/executive/dashboard' }, { label: 'Müraciətlər' }]} />
      <div className="flex items-center justify-between mt-4 mb-5">
        <h1 className="font-heading text-2xl font-bold text-primary">Müraciətlər</h1>
        <Button variant="secondary" onClick={() => reportsApi.exportCsv(status ? { status } : {})}>
          <Download size={15} /> CSV ixrac
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Axtar..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none
              focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors
              ${status === s
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}
          >
            {statusLabels[s]}
          </button>
        ))}
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
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-muted">{r.category ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{r.neighborhood ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSlaModal(r); setSlaForm({ report_text: '', recommended_action: '', severity: 'high' }) }}
                        className="text-xs text-primary hover:underline"
                      >
                        SLA
                      </button>
                      <button
                        onClick={() => { setTaskModal(r); setTaskForm({ inspector_id: '', deadline: '' }) }}
                        className="text-xs text-accent hover:underline"
                      >
                        Tapşırıq
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">Müraciət tapılmadı</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!slaModal}
        onClose={() => setSlaModal(null)}
        title="SLA Hesabatı"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSlaModal(null)}>Ləğv et</Button>
            <Button onClick={handleSlaSubmit} loading={submitting}>Göndər</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Hesabat mətni</label>
            <textarea
              value={slaForm.report_text}
              onChange={e => setSlaForm(f => ({ ...f, report_text: e.target.value }))}
              rows={3}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <Input
            label="Tövsiyə olunan tədbirlər"
            value={slaForm.recommended_action}
            onChange={e => setSlaForm(f => ({ ...f, recommended_action: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ciddilik</label>
            <select
              value={slaForm.severity}
              onChange={e => setSlaForm(f => ({ ...f, severity: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="high">Yüksək</option>
              <option value="critical">Kritik</option>
              <option value="medium">Orta</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!taskModal}
        onClose={() => setTaskModal(null)}
        title="Tapşırıq Yarat"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTaskModal(null)}>Ləğv et</Button>
            <Button onClick={handleCreateTask} loading={creatingTask}>Yarat</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="İnspektor ID"
            value={taskForm.inspector_id}
            onChange={e => setTaskForm(f => ({ ...f, inspector_id: e.target.value }))}
            placeholder="Inspector UUID"
          />
          <Input
            label="Son tarix"
            type="date"
            value={taskForm.deadline}
            onChange={e => setTaskForm(f => ({ ...f, deadline: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}
