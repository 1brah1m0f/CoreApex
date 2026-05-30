import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { proposalsApi } from '../../api'
import { Proposal } from '../../types'
import ProposalCard from '../../components/ProposalCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const tags = ['', 'infrastruktur', 'ətraf mühit', 'nəqliyyat', 'təhsil', 'digər']

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export default function CitizenProposals() {
  const [tag, setTag] = useState('')
  const { data, loading, refetch } = useApi<Proposal[]>(
    () => proposalsApi.list(tag || undefined),
    [tag]
  )
  const [voting, setVoting] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', tag: '' })
  const [submitting, setSubmitting] = useState(false)

  const list = toArr<Proposal>(data)

  async function handleVote(id: string) {
    setVoting(id)
    try {
      await proposalsApi.vote(id)
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setVoting(null)
    }
  }

  async function handleCreate() {
    if (!form.title || !form.description || !form.tag) {
      toast.error('Bütün sahələri doldurun')
      return
    }
    setSubmitting(true)
    try {
      await proposalsApi.create(form.title, form.description, form.tag)
      toast.success('Təklif göndərildi')
      setModalOpen(false)
      setForm({ title: '', description: '', tag: '' })
      refetch()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/citizen/dashboard' }, { label: 'Təkliflər' }]} />
      <div className="flex items-center justify-between mt-4 mb-5">
        <h1 className="font-heading text-2xl font-bold text-primary">Vətəndaş Təklifləri</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Yeni təklif</Button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors
              ${tag === t
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted hover:border-primary hover:text-primary'
              }`}
          >
            {t || 'Hamısı'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map(p => (
            <ProposalCard key={p.id} proposal={p} onVote={handleVote} voting={voting === p.id} />
          ))}
          {list.length === 0 && (
            <p className="text-center text-muted py-16">Təklif tapılmadı</p>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yeni Təklif"
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
            placeholder="Təklifinizin adı"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Təsvir</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Təklifinizi ətraflı izah edin..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
            <select
              value={form.tag}
              onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Seçin...</option>
              {tags.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
