import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { alertsApi } from '../../api'
import { GovAlert, AlertType } from '../../types'
import AlertCard from '../../components/AlertCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function ExecutiveAlerts() {
  const { data, loading, refetch } = useApi<GovAlert[]>(() => alertsApi.list())
  const [deleting, setDeleting] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', type: 'info', district: '' })
  const [submitting, setSubmitting] = useState(false)

  const list = toArr<GovAlert>(data)

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await alertsApi.delete(id)
      toast.success('Bildiriş silindi')
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setDeleting(null)
    }
  }

  async function handleCreate() {
    if (!form.title || !form.body || !form.district) { toast.error('Bütün sahələri doldurun'); return }
    setSubmitting(true)
    try {
      await alertsApi.create(form.title, form.body, form.type as AlertType, form.district)
      toast.success('Bildiriş göndərildi')
      setModalOpen(false)
      setForm({ title: '', body: '', type: 'info', district: '' })
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/executive/dashboard' }, { label: 'Bildirişlər' }]} />
      <div className="flex items-center justify-between mt-4 mb-5">
        <h1 className="font-heading text-2xl font-bold text-primary">Bildirişlər</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Yeni bildiriş</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(a => (
            <AlertCard key={a.id} alert={a} onDelete={handleDelete} deleting={deleting === a.id} />
          ))}
          {list.length === 0 && (
            <p className="text-center text-muted py-16">Bildiriş yoxdur</p>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yeni Bildiriş"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Ləğv et</Button>
            <Button onClick={handleCreate} loading={submitting}>Göndər</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Başlıq"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mətn</label>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              rows={3}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Növ</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                  focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="info">Məlumat</option>
                <option value="warning">Xəbərdarlıq</option>
                <option value="success">Müsbət</option>
              </select>
            </div>
            <Input
              label="Rayon"
              value={form.district}
              onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              placeholder="Məs. Nəsimi"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
