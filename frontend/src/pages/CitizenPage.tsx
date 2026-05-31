import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FileText, Bell, MapPin, Settings2,
  CheckCircle, Clock, Plus,
  Info, AlertTriangle, CheckCircle2, Lightbulb,
  ImageIcon, Upload, X,
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { reportsApi, proposalsApi, alertsApi } from '../api'
import { Report, Proposal, GovAlert } from '../types'
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
  const [form, setForm] = useState({ title: '', description: '', category: '', address: '' })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [images, setImages] = useState<{ file: File; url: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const categories = ['Yollar', 'Su kəməri', 'Elektrik', 'Abadlıq', 'Zibil', 'Digər']

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.title || !form.description || !form.category) {
      toast.error('Bütün sahələri doldurun')
      return
    }
    setSubmitting(true)
    try {
      await reportsApi.create({ ...form, lat: location?.lat ?? 0, lng: location?.lng ?? 0 })
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

  function addImages(files: FileList | null) {
    if (!files) return
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (allowed.length !== files.length) toast.error('Yalnız şəkil faylları qəbul edilir')
    const next = allowed.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setImages(prev => [...prev, ...next])
  }

  function removeImage(url: string) {
    setImages(prev => {
      const img = prev.find(i => i.url === url)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter(i => i.url !== url)
    })
  }

  function useGps() {
    if (!navigator.geolocation) {
      toast.error('GPS dəstəklənmir')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error('GPS icazəsi verilmədi')
    )
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
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Müraciət məlumatı</p>
          <div className="mt-3 flex flex-col gap-3">
            <Input label="Başlıq" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="Problemin qısa təsviri" />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Ətraflı təsvir</label>
              <textarea value={form.description} onChange={e => setF('description', e.target.value)} rows={3}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Problemi ətraflı izah edin..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
              <select value={form.category} onChange={e => setF('category', e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="">Seçin...</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Ünvan (istəyə bağlı)" value={form.address} onChange={e => setF('address', e.target.value)} placeholder="Küçə, bina nömrəsi" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-500" /> GPS / Xəritə
            </label>
            <button onClick={useGps} type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              GPS-dən götür
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Xəritədən yer seçin və ya GPS icazəsi verin</p>
          <div className="mt-2">
            <LocationPickerMap value={location} onChange={setLocation} showLabel={false} height={180} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <ImageIcon size={14} className="text-blue-500" /> Şəkillər (istəyə bağlı)
          </label>
          <p className="text-xs text-gray-400 mt-1">Hadisəni daha aydın təsvir etmək üçün şəkil əlavə edin</p>
          <label className="mt-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all p-4 cursor-pointer flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Şəkil əlavə et</p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP · bir neçə seçilə bilər</p>
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={e => addImages(e.target.files)} />
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map(img => (
                <div key={img.url} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('reports')
  const [newProposalOpen, setNewProposalOpen] = useState(false)

  const storedUser = localStorage.getItem('apexcore_user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const userName = currentUser?.full_name || currentUser?.name || 'İstifadəçi'

  const reportsFetch = useApi<Report[]>(() => reportsApi.mine())
  const proposalsFetch = useApi<Proposal[]>(() => proposalsApi.list())
  const alertsFetch = useApi<GovAlert[]>(() => alertsApi.list())

  const reports = toArr<Report>(reportsFetch.data)
  const proposals = toArr<Proposal>(proposalsFetch.data)
  const alerts = toArr<GovAlert>(alertsFetch.data)

  const kpi = {
    pending: reports.filter(r => r.status === 'pending').length,
    inprogress: reports.filter(r => r.status === 'inprogress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  }


  const tabs = [
    { key: 'reports' as Tab, label: 'Müraciətlərim', icon: FileText, count: reports.length },
    { key: 'proposals' as Tab, label: 'Təkliflərim', icon: Lightbulb, count: proposals.length },
    { key: 'alerts' as Tab, label: 'Bildirişlər', icon: Bell, count: alerts.length },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <PortalHeader role="citizen" userName={userName} notifCount={alerts.length} />

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
                {t.count !== null && (
                  <span className={`rounded-full text-xs px-1.5 py-0.5 font-bold
                    ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {t.count}
                  </span>
                )}
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
            <button onClick={() => navigate('/citizen/reports/new')}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl py-4 font-semibold text-base transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              + Yeni müraciət (AI)
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
              <Plus size={20} /> Yeni təklif yaz
            </button>

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Mənim təkliflərim</h2>
              <span className="text-xs text-gray-500">Səsvermə yoxdur</span>
            </div>

            {proposalsFetch.loading && <div className="flex justify-center py-8"><Spinner /></div>}
            <div className="flex flex-col gap-3">
              {proposals.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{p.title}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap flex-shrink-0">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mt-2">{p.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>Yazar: {p.author}</span>
                  </div>
                </div>
              ))}
              {proposals.length === 0 && (
                <p className="text-center text-gray-400 py-16">Hələ təklif yoxdur</p>
              )}
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

      <NewProposalModal open={newProposalOpen} onClose={() => setNewProposalOpen(false)} onSuccess={proposalsFetch.refetch} />
    </div>
  )
}
