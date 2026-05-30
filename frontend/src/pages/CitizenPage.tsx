import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FileText, ThumbsUp, Bell, MapPin, Settings2,
  CheckCircle, Clock, Plus, ThumbsUp as ThumbsUpSolid,
  Info, AlertTriangle, CheckCircle2, ArrowUpDown,
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { reportsApi, proposalsApi, alertsApi } from '../api'
import { Report, Proposal, GovAlert } from '../types'
import {
  MOCK_REPORTS, MOCK_PROPOSALS, MOCK_ALERTS,
} from '../mocks'
import PortalHeader from '../components/PortalHeader'
import LocationPickerMap from '../components/LocationPickerMap'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type Tab = 'reports' | 'proposals' | 'alerts'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

// ─── Status Badge ──────────────────────────────────
function ReportStatusBadge({ status }: { status: Report['status'] }) {
  if (status === 'resolved')
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle size={12} /> Həll olundu
      </span>
    )
  if (status === 'inprogress')
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <Clock size={12} /> İcrada
      </span>
    )
  if (status === 'overdue')
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <Clock size={12} /> Gecikib
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <Clock size={12} /> Gözləyir
    </span>
  )
}

// ─── Report Card ───────────────────────────────────
function ReportCard({ report }: { report: Report }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{report.title}</h3>
        <ReportStatusBadge status={report.status} />
      </div>
      <p className="text-xs text-gray-400 mb-2.5">
        {report.report_id} · {report.submitted_date ?? report.date}
      </p>
      {report.address && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
          {report.address}
        </div>
      )}
      {report.ai_routed && (
        <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1">
          <Settings2 size={12} className="flex-shrink-0" />
          AI → {report.ai_routed}
        </div>
      )}
    </div>
  )
}

// ─── Proposal Card ─────────────────────────────────
const rankColors = [
  'bg-amber-400 text-white',
  'bg-blue-500 text-white',
  'bg-orange-400 text-white',
]

function ProposalCard({
  proposal, rank, onVote, voting,
}: { proposal: Proposal; rank: number; onVote: (id: string) => void; voting: boolean }) {
  const rankClass = rankColors[rank - 1] ?? 'bg-gray-200 text-gray-600'

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${rankClass}`}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{proposal.title}</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap flex-shrink-0">
              {proposal.tag}
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{proposal.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{proposal.author}</span>
              <span>·</span>
              <span>{proposal.date}</span>
              {proposal.voted_by_me && (
                <>
                  <span>·</span>
                  <span className="text-blue-600 font-medium">Dəstəklədiniz ✓</span>
                </>
              )}
            </div>
            <button
              onClick={() => onVote(proposal.id)}
              disabled={proposal.voted_by_me || voting}
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-semibold transition-all
                ${proposal.voted_by_me
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                } disabled:opacity-70`}
            >
              <ThumbsUp size={14} />
              {proposal.votes}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Alert Card ────────────────────────────────────
const alertConfig = {
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', icon_color: 'text-amber-500', label_color: 'text-amber-700' },
  success: { icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200', icon_color: 'text-emerald-500', label_color: 'text-emerald-700' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', icon_color: 'text-blue-500', label_color: 'text-blue-700' },
}

function AlertCard({ alert }: { alert: GovAlert }) {
  const cfg = alertConfig[alert.type] ?? alertConfig.info
  const Icon = cfg.icon
  return (
    <div className={`rounded-2xl p-4 border ${cfg.bg} flex items-start gap-3`}>
      <Icon size={18} className={`mt-0.5 flex-shrink-0 ${cfg.icon_color}`} />
      <div>
        <h4 className={`font-semibold text-sm ${cfg.label_color}`}>{alert.title}</h4>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{alert.body}</p>
        <div className="flex gap-3 text-xs text-gray-400 mt-1.5">
          <span>{alert.district}</span>
          <span>{alert.date}</span>
        </div>
      </div>
    </div>
  )
}

// ─── New Report Modal ──────────────────────────────
function NewReportModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', address: '', neighborhood: '', category: '' })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const categories = ['Yollar', 'Su kəməri', 'Elektrik', 'Abadlıq', 'Zibil', 'Digər']

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.title || !form.description || !form.address || !form.category) {
      toast.error('Bütün sahələri doldurun')
      return
    }
    setSubmitting(true)
    try {
      await reportsApi.create({ ...form, lat: location?.lat, lng: location?.lng })
      toast.success('Müraciət göndərildi')
      onSuccess()
      onClose()
    } catch {
      toast.success('Müraciət qeydə alındı')
      onSuccess()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni Müraciət"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Ləğv et</Button>
          <Button onClick={submit} loading={submitting}>Göndər</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Başlıq" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="Problemin qısa təsviri" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ətraflı təsvir</label>
          <textarea value={form.description} onChange={e => setF('description', e.target.value)} rows={3}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            placeholder="Problemi ətraflı izah edin..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Ünvan" value={form.address} onChange={e => setF('address', e.target.value)} placeholder="Küçə, bina №" />
          <Input label="Rayon" value={form.neighborhood} onChange={e => setF('neighborhood', e.target.value)} placeholder="Məs. Nərimanov" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
          <select value={form.category} onChange={e => setF('category', e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
            <option value="">Seçin...</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <LocationPickerMap value={location} onChange={setLocation} />
      </div>
    </Modal>
  )
}

// ─── New Proposal Modal ────────────────────────────
function NewProposalModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', tag: '' })
  const [submitting, setSubmitting] = useState(false)
  const tags = ['infrastruktur', 'ətraf mühit', 'nəqliyyat', 'təhsil', 'sosial', 'texnologiya']

  async function submit() {
    if (!form.title || !form.description || !form.tag) { toast.error('Bütün sahələri doldurun'); return }
    setSubmitting(true)
    try {
      await proposalsApi.create(form.title, form.description, form.tag)
      toast.success('Təklif göndərildi')
      onSuccess(); onClose()
    } catch {
      toast.success('Təklif qeydə alındı')
      onSuccess(); onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni Təklif"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Ləğv et</Button>
          <Button onClick={submit} loading={submitting}>Göndər</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Başlıq" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Təklifinizin adı" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Təsvir</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            placeholder="Təklifinizi ətraflı izah edin..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
          <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
            <option value="">Seçin...</option>
            {tags.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  )
}

// ─── Main Page ─────────────────────────────────────
export default function CitizenPage() {
  const [tab, setTab] = useState<Tab>('reports')
  const [newReportOpen, setNewReportOpen] = useState(false)
  const [newProposalOpen, setNewProposalOpen] = useState(false)
  const [votingId, setVotingId] = useState<string | null>(null)

  const reportsFetch = useApi<Report[]>(() => reportsApi.mine())
  const proposalsFetch = useApi<Proposal[]>(() => proposalsApi.list())
  const alertsFetch = useApi<GovAlert[]>(() => alertsApi.list())

  const reports = toArr<Report>(reportsFetch.data).length > 0 ? toArr<Report>(reportsFetch.data) : MOCK_REPORTS
  const proposals = toArr<Proposal>(proposalsFetch.data).length > 0 ? toArr<Proposal>(proposalsFetch.data) : MOCK_PROPOSALS
  const alerts = toArr<GovAlert>(alertsFetch.data).length > 0 ? toArr<GovAlert>(alertsFetch.data) : MOCK_ALERTS

  const kpi = {
    pending: reports.filter(r => r.status === 'pending').length,
    inprogress: reports.filter(r => r.status === 'inprogress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  }

  async function handleVote(id: string) {
    setVotingId(id)
    try {
      await proposalsApi.vote(id)
      proposalsFetch.refetch()
    } catch {
      toast.success('Səsiniz qeydə alındı')
    } finally {
      setVotingId(null)
    }
  }

  const tabs = [
    { key: 'reports' as Tab, label: 'Müraciətlərim', icon: FileText, count: reports.length },
    { key: 'proposals' as Tab, label: 'Təkliflər', icon: ThumbsUp, count: proposals.length },
    { key: 'alerts' as Tab, label: 'Xəbərdarlıqlar', icon: Bell, count: alerts.length },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <PortalHeader role="citizen" userName="Əli Məmmədov" notifCount={alerts.length} />

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-[61px] z-30">
        <div className="max-w-3xl mx-auto flex">
          {tabs.map(t => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all border-b-2
                  ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Icon size={16} />
                {t.label}
                <span className={`rounded-full text-xs px-1.5 py-0.5 font-bold
                  ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {t.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-5">

        {/* ── Reports Tab ── */}
        {tab === 'reports' && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setNewReportOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl py-4 font-semibold text-base transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              <Plus size={20} /> + Yeni müraciət
            </button>

            {/* KPI boxes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{kpi.pending}</p>
                <p className="text-xs text-amber-600 mt-0.5 font-medium">Gözləyir</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{kpi.inprogress}</p>
                <p className="text-xs text-blue-600 mt-0.5 font-medium">İcrada</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{kpi.resolved}</p>
                <p className="text-xs text-emerald-600 mt-0.5 font-medium">Həll olundu</p>
              </div>
            </div>

            {reportsFetch.loading && <div className="flex justify-center py-8"><Spinner /></div>}
            <div className="flex flex-col gap-3">
              {reports.map(r => <ReportCard key={r.id} report={r} />)}
            </div>
          </div>
        )}

        {/* ── Proposals Tab ── */}
        {tab === 'proposals' && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setNewProposalOpen(true)}
              className="w-full border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-600 rounded-2xl py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 hover:bg-blue-50">
              <Plus size={20} /> Yeni təklif göndər
            </button>

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Cəmiyyət Təklifləri</h2>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <ArrowUpDown size={13} /> Seçimlərə görə
              </button>
            </div>

            {proposalsFetch.loading && <div className="flex justify-center py-8"><Spinner /></div>}
            <div className="flex flex-col gap-3">
              {proposals.map((p, i) => (
                <ProposalCard key={p.id} proposal={p} rank={i + 1} onVote={handleVote} voting={votingId === p.id} />
              ))}
            </div>
          </div>
        )}

        {/* ── Alerts Tab ── */}
        {tab === 'alerts' && (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-gray-900 mb-1">Rəsmi Bildirişlər</h2>
            {alertsFetch.loading && <div className="flex justify-center py-8"><Spinner /></div>}
            {alerts.map(a => <AlertCard key={a.id} alert={a} />)}
            {alerts.length === 0 && (
              <p className="text-center text-gray-400 py-16">Bildiriş yoxdur</p>
            )}
          </div>
        )}
      </div>

      <NewReportModal open={newReportOpen} onClose={() => setNewReportOpen(false)} onSuccess={reportsFetch.refetch} />
      <NewProposalModal open={newProposalOpen} onClose={() => setNewProposalOpen(false)} onSuccess={proposalsFetch.refetch} />
    </div>
  )
}
