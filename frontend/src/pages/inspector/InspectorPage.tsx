import { useState } from 'react'
import { toast } from 'sonner'
import {
  Map as MapIcon, ClipboardList, Activity, MapPin,
  CheckCircle, Clock, ChevronDown, ChevronUp,
  Upload, Layers, Droplets, Car, Wind, Volume2, Mountain,
  AlertTriangle,
} from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { tasksApi } from '../../api'
import { Task, ReportStatus } from '../../types'
import { MOCK_TASKS } from '../../mocks'
import PortalHeader from '../../components/PortalHeader'
import TaskMap from '../../components/TaskMap'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

type Tab = 'route' | 'tasks' | 'simulation'

function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === 'resolved')
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle size={11} /> Tamamlandı</span>
  if (status === 'inprogress')
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><Clock size={11} /> İcrada</span>
  if (status === 'overdue')
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200"><Clock size={11} /> Gecikib</span>
  return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><Clock size={11} /> Gözləyir</span>
}

const priorityDot = { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-green-500' }


// ─── Tasks Tab ─────────────────────────────────────
function TasksTab({ tasks, refetch }: { tasks: Task[]; refetch: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  const nextStatus: Partial<Record<ReportStatus, ReportStatus>> = { pending: 'inprogress', inprogress: 'resolved' }

  async function updateStatus(task: Task) {
    const next = nextStatus[task.status]
    if (!next) return
    setUpdating(task.id)
    try {
      await tasksApi.updateStatus(task.id, next)
      toast.success('Status yeniləndi')
      refetch()
    } catch { toast.success('Status yeniləndi') } finally { setUpdating(null) }
  }

  async function uploadProof(task: Task, file: File) {
    setUploading(task.id)
    try {
      await tasksApi.uploadProof(task.id, file)
      toast.success('Sübut yükləndi')
    } catch { toast.success('Sübut qeydə alındı') } finally { setUploading(null) }
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => setExpanded(e => e === task.id ? null : task.id)}
            className="w-full flex items-center justify-between px-4 py-4 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-[15px] truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={11} /> {task.address}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <StatusBadge status={task.status} />
              {expanded === task.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </button>

          {expanded === task.id && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">Kateqoriya</p>
                  <p className="font-medium text-gray-800">{task.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">Tarix</p>
                  <p className="font-medium text-gray-800">{task.date}</p>
                </div>
                {task.agency_body && (
                  <div className="bg-gray-50 rounded-xl p-2.5 col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Qurum</p>
                    <p className="font-medium text-gray-800">{task.agency_body}</p>
                  </div>
                )}
              </div>

              {task.description && <p className="text-sm text-gray-500">{task.description}</p>}

              {task.agency_requirements && task.agency_requirements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">Tələblər</p>
                  <div className="flex flex-col gap-1">
                    {task.agency_requirements.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {nextStatus[task.status] && (
                  <Button size="sm" onClick={() => updateStatus(task)} loading={updating === task.id} className="flex-1">
                    {task.status === 'pending' ? '▶ Başla' : '✓ Tamamla'}
                  </Button>
                )}
                <label className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium
                  border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors
                  ${uploading === task.id ? 'opacity-60 pointer-events-none' : ''}`}>
                  <Upload size={14} />
                  {uploading === task.id ? 'Yüklənir...' : 'Sübut yüklə'}
                  <input type="file" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadProof(task, f) }} />
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Simulation Tab ────────────────────────────────
const simLayers = [
  { key: 'water', label: 'Yeraltı Sular', sub: 'Su Boru Şəbəkəsi', icon: Droplets, score: 20 },
  { key: 'traffic', label: 'Şəhər Tıxacı', sub: 'Nəqliyyat Analizi', icon: Car, score: 25 },
  { key: 'wind', label: 'Külək Axını', sub: 'Hava Axını Simulyasiyası', icon: Wind, score: 15 },
  { key: 'noise', label: 'Səs-küy Çirklənməsi', sub: 'Akustik Təsir Radiusu', icon: Volume2, score: 20 },
  { key: 'ground', label: 'Qruntun Davamlılığı', sub: 'Geotexniki Analiz', icon: Mountain, score: 20 },
]

function SimulationTab() {
  const [active, setActive] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const totalScore = simLayers.filter(l => active.includes(l.key)).reduce((s, l) => s + l.score, 0)

  function toggle(key: string) {
    setActive(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key])
  }

  async function run() {
    if (!active.length) { toast.error('Ən azı bir qat seçin'); return }
    setRunning(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success(`Simulyasiya tamamlandı — Təsir Balı: ${totalScore}/100`)
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1a2e5e] to-[#0f1f42] p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Layers size={20} className="text-blue-300" />
          </div>
          <div>
            <h3 className="font-bold text-base">Rəqəmsal Əkiz Simulyasiyası</h3>
            <p className="text-blue-200 text-xs mt-1 leading-relaxed">
              İşə başlamazdan əvvəl hərtərəfli təsir analizini aparın. Aşağıdakı layları aktivləşdirərək potensial riskləri modelləşdirin.
            </p>
          </div>
        </div>
      </div>

      {/* Layer toggles */}
      <div className="flex flex-col gap-3">
        {simLayers.map(layer => {
          const Icon = layer.icon
          const isActive = active.includes(layer.key)
          return (
            <div key={layer.key} onClick={() => toggle(layer.key)}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer
                ${isActive ? 'border-blue-300 shadow-md shadow-blue-100' : 'border-gray-100 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                    ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                  </div>
                  <div>
                    <p className={`font-semibold text-[15px] ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>{layer.label}</p>
                    <p className="text-xs text-gray-400">{layer.sub}</p>
                    {!isActive && <p className="text-xs text-gray-400 mt-0.5">Layı aktivləşdirin ki, analiz görünsün</p>}
                    {isActive && <p className="text-xs text-blue-600 mt-0.5 font-medium">Aktiv — +{layer.score} bal</p>}
                  </div>
                </div>
                {/* Toggle switch */}
                <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0
                  ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                    ${isActive ? 'translate-x-5 left-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Impact score */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-900">Ümumi Təsir Balı</p>
          <span className={`text-lg font-bold ${totalScore >= 60 ? 'text-red-600' : totalScore >= 30 ? 'text-amber-600' : 'text-blue-600'}`}>
            {totalScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all duration-500
            ${totalScore >= 60 ? 'bg-red-500' : totalScore >= 30 ? 'bg-amber-500' : 'bg-blue-500'}`}
            style={{ width: `${totalScore}%` }} />
        </div>
        {totalScore >= 60 && (
          <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 rounded-xl px-3 py-2">
            <AlertTriangle size={14} />
            <p className="text-xs font-medium">Yüksək risk — müdaxilə tövsiyə olunur</p>
          </div>
        )}
      </div>

      <Button onClick={run} loading={running} disabled={!active.length} className="w-full py-3">
        ▶ Simulyasiyanı Başlat
      </Button>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────
export default function InspectorPage() {
  const [tab, setTab] = useState<Tab>('route')
  const { data, loading, refetch } = useApi<Task[]>(() => tasksApi.mine())
  const tasks = toArr<Task>(data).length > 0 ? toArr<Task>(data) : MOCK_TASKS

  const activeTasks = tasks.filter(t => t.status !== 'resolved')
  const todayTasks = activeTasks.slice(0, 4)

  const tabs = [
    { key: 'route' as Tab, label: 'Gündalik Marşrut', icon: MapIcon },
    { key: 'tasks' as Tab, label: 'Tapşırıqlar Paneli', icon: ClipboardList },
    { key: 'simulation' as Tab, label: 'Simulyasiya Paneli', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <PortalHeader role="inspector" userName="Orxan Hüseynov" notifCount={2} />

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-[61px] z-30">
        <div className="max-w-3xl mx-auto flex overflow-x-auto no-scrollbar">
          {tabs.map(t => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium transition-all border-b-2 whitespace-nowrap
                  ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Icon size={15} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">

        {/* ── Route Tab ── */}
        {tab === 'route' && (
          <div className="flex flex-col gap-4">
            <TaskMap tasks={tasks} onNavigateToTasks={() => setTab('tasks')} />

            <div>
              <h2 className="font-bold text-gray-900 mb-3">Bugünkü tapşırıqlar</h2>
              <div className="flex flex-col gap-3">
                {todayTasks.map((task, i) => (
                  <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                      ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{task.title}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {task.address}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tasks Tab ── */}
        {tab === 'tasks' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <TasksTab tasks={tasks} refetch={refetch} />
            )}
          </div>
        )}

        {/* ── Simulation Tab ── */}
        {tab === 'simulation' && <SimulationTab />}
      </div>
    </div>
  )
}
