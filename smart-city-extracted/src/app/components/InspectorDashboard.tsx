import { useState } from "react";
import {
  Map, CheckCircle, Clock, AlertCircle, Upload,
  Bell, LogOut, Shield, ChevronRight, Navigation, Layers,
  Wind, Droplets, Car, AlertTriangle, Activity,
  X, Camera, FileImage, User, Volume2, Mountain, Sparkles, ShieldAlert
} from "lucide-react";

interface InspectorDashboardProps {
  onLogout: () => void;
}

type TaskStatus = "pending" | "inprogress" | "resolved";
type DashTab = "route" | "tasks" | "simulation";

interface Task {
  id: string;
  title: string;
  address: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: TaskStatus;
  citizen: string;
  citizenPhone: string;
  date: string;
  desc: string;
  photo: string; // emoji placeholder
  agencyReqs: string[];
  agencyBody: string;
  mapX: number;
  mapY: number;
}

const TASKS: Task[] = [
  {
    id: "T-001", title: "Küçə lampası xarabdır", address: "Hüsü Hacıyev küç. 12", category: "Elektrik",
    priority: "high", status: "inprogress", citizen: "Əli Məmmədov", citizenPhone: "+994 50 123 45 67", date: "24 May 2026",
    desc: "Küçə lampası 3 gündür işləmir. Gecə vaxtı həmin ərazi tamamilə qaranlıq qalır, bu da pedestrlar üçün təhlükə yaradır.",
    photo: "🔦",
    agencyBody: "Azərişıq ASC standartlarına əsasən, küçə lampasının dəyişdirilməsi zamanı aşağıdakı tələblərə riayət edilməlidir:",
    agencyReqs: ["LED lampa gücü minimum 150W olmalıdır", "Quraşdırma yüksəkliyi 6–8 m arasında saxlanılmalıdır", "İş bitdikdən sonra 24 saat ərzində sınaq keçirilməlidir", "Bütün işlər gecə 22:00–05:00 arasında aparılmalıdır"],
    mapX: 145, mapY: 88,
  },
  {
    id: "T-002", title: "Su borusu sızır", address: "Elmlər Akad. küç. 5", category: "Su Təchizatı",
    priority: "high", status: "pending", citizen: "Leyla Quliyeva", citizenPhone: "+994 55 234 56 78", date: "22 May 2026",
    desc: "Bina 5-in yanında güclü sızma var. Su yolu ilə axaraq bina zirzəmisinə daxil olur. Vəziyyət getdikcə pisləşir.",
    photo: "💧",
    agencyBody: "Azərsu ASC qaydalarına əsasən, boru sızmalarında aşağıdakı protokol tətbiq edilir:",
    agencyReqs: ["İlk öncə su qəti bağlanmalı, sonra qazıntı başlamalıdır", "Qazıntı dərinliyi 2.5 m-dən artıq olarsa, dağılmaya qarşı tədbirlər görülməlidir", "Yeni boru DN300 və ya daha böyük diametrli olmalıdır", "İş sona çatdıqda su keyfiyyəti labdan keçirilməlidir"],
    mapX: 260, mapY: 125,
  },
  {
    id: "T-003", title: "Yol örtüyündə böyük çuxur", address: "Mete Turan küç. 8", category: "Yol",
    priority: "medium", status: "pending", citizen: "Rauf Babayev", citizenPhone: "+994 77 345 67 89", date: "20 May 2026",
    desc: "Yolun sağ hissəsində 40×30 sm ölçülü dərin çuxur yaranıb. Avtomobillər zərər görür, yüngül qəzalar baş verir.",
    photo: "🚧",
    agencyBody: "İcra Hakimiyyətinin yol təmiri standartlarına görə:",
    agencyReqs: ["Çuxur ətrafı 1 m genişlikdə söküldükdən sonra yenidən yapılmalıdır", "Asfalt layı minimum 8 sm olmalıdır", "Beton zəmini kontrol edilməli, zəruri hallarda dəyişdirilməlidir", "Müvəqqəti maneələr iş zamanı qoyulmalı, sonra götürülməlidir"],
    mapX: 100, mapY: 148,
  },
  {
    id: "T-005", title: "Körpü altında ciddi çökük", address: "Mete Turan körpüsü", category: "Fövqəladə hal",
    priority: "high", status: "pending", citizen: "Kamran Rəsulzadə", citizenPhone: "+994 70 567 89 01", date: "30 May 2026",
    desc: "Körpünün alt konstruksiyasında ciddi çökük müşahidə edilib. Struktur bütövlüyü risk altındadır, nəqliyyat dərhal bağlanmalıdır.",
    photo: "🌉",
    agencyBody: "Fövqəladə Hallar Nazirliyi protokoluna əsasən:",
    agencyReqs: ["Ərazinin dərhal mühafizəyə alınması və ictimaiyyətin uzaqlaşdırılması", "Konstruktiv qiymətləndirmə üçün sertifikatlı mühəndis dəvəti", "Alternativ nəqliyyat marşrutunun müəyyənləşdirilməsi", "24 saat ərzində rəsmi hesabat və risk dəyərləndirməsinin təqdimi"],
    mapX: 310, mapY: 155,
  },
  {
    id: "T-004", title: "Park fəvvarəsi işləmir", address: "Nərimanov meydanı", category: "Bələdiyyə",
    priority: "low", status: "resolved", citizen: "Tural Əliyev", citizenPhone: "+994 51 456 78 90", date: "17 May 2026",
    desc: "Əsas parkdakı dekorativ fəvvarə 2 həftədir işləmir. Nasosun arızalanması ehtimal olunur.",
    photo: "⛲",
    agencyBody: "Bələdiyyənin abadlaşdırma tələbləri:",
    agencyReqs: ["Nasos bloku tam sökülərək yoxlanılmalıdır", "Qurğunun su sızdırmazlığı bərpa edilməlidir", "Elektrik qoşulması xüsusi mütəxəssis tərəfindən aparılmalıdır", "Sınaq rejimi 48 saat davam etdirildikdən sonra tam istifadəyə verilməlidir"],
    mapX: 205, mapY: 105,
  },
];

const PRIORITY_CFG = {
  high: { label: "Yüksək", cls: "bg-red-50 border-red-200 text-red-600" },
  medium: { label: "Orta", cls: "bg-amber-50 border-amber-200 text-amber-600" },
  low: { label: "Aşağı", cls: "bg-slate-50 border-slate-200 text-slate-500" },
};

const STATUS_CFG: Record<TaskStatus, { label: string; color: string; Icon: typeof CheckCircle; bg: string; pin: string }> = {
  pending: { label: "Gözləyir", color: "text-amber-600", Icon: Clock, bg: "bg-amber-50 border-amber-200", pin: "#f59e0b" },
  inprogress: { label: "İcrada", color: "text-blue-600", Icon: AlertCircle, bg: "bg-blue-50 border-blue-200", pin: "#3b82f6" },
  resolved: { label: "Həll olundu", color: "text-emerald-600", Icon: CheckCircle, bg: "bg-emerald-50 border-emerald-200", pin: "#10b981" },
};

interface SimLayer {
  key: string;
  label: string;
  sublabel: string;
  Icon: typeof Droplets;
  activeColor: string;
  activeBorder: string;
  activeBg: string;
  riskLabel: string;
  riskLevel: "low" | "medium" | "high";
  details: Array<{ k: string; v: string }>;
  warning?: string;
}

const SIM_LAYERS: SimLayer[] = [
  {
    key: "water", label: "Yeraltı Sular", sublabel: "Su Boru Şəbəkəsi", Icon: Droplets,
    activeColor: "text-blue-600", activeBorder: "border-blue-300", activeBg: "bg-blue-50",
    riskLabel: "Diqqət tələb edir", riskLevel: "medium",
    details: [{ k: "Boru diametri", v: "DN 300 mm" }, { k: "Dərinlik", v: "1.8 m" }, { k: "Yaş", v: "18 il" }],
    warning: "2.1 m məsafədə əsas magistral xətt var!",
  },
  {
    key: "traffic", label: "Şəhər Tıxacı", sublabel: "Nəqliyyat Analizi", Icon: Car,
    activeColor: "text-orange-600", activeBorder: "border-orange-300", activeBg: "bg-orange-50",
    riskLabel: "Yüksək risk", riskLevel: "high",
    details: [{ k: "Gündəlik axın", v: "8,400 avtomobil" }, { k: "Pik saatlar", v: "08–09 · 17–19" }, { k: "Alternativ", v: "Vahid küç." }],
    warning: "Pik saatlarda yüksək tıxac gözlənilir!",
  },
  {
    key: "wind", label: "Külək Axını", sublabel: "Hava Axını Simulyasiyası", Icon: Wind,
    activeColor: "text-violet-600", activeBorder: "border-violet-300", activeBg: "bg-violet-50",
    riskLabel: "Aşağı risk", riskLevel: "low",
    details: [{ k: "Sürət", v: "14 km/saat" }, { k: "İstiqamət", v: "Şimal-Şərq" }, { k: "Toz yayılması", v: "Cənub-Qərb" }],
  },
  {
    key: "noise", label: "Səs-küy Çirklənməsi", sublabel: "Akustik Təsir Radiusu", Icon: Volume2,
    activeColor: "text-rose-600", activeBorder: "border-rose-300", activeBg: "bg-rose-50",
    riskLabel: "Orta risk", riskLevel: "medium",
    details: [{ k: "Mərkəzdə səs", v: "82 dB" }, { k: "Təsir radiusu", v: "120 m" }, { k: "Limit norma", v: "65 dB" }],
    warning: "Şaxtalar şəkilli binalara səs izolasiyası tövsiyə olunur.",
  },
  {
    key: "soil", label: "Qruntun Davamlılığı", sublabel: "Geotexniki Analiz", Icon: Mountain,
    activeColor: "text-amber-700", activeBorder: "border-amber-300", activeBg: "bg-amber-50",
    riskLabel: "Normal", riskLevel: "low",
    details: [{ k: "Gil qatı", v: "0.8–1.2 m" }, { k: "Daşıma qabiliyyəti", v: "180 kPa" }, { k: "Nəmlik", v: "Orta" }],
  },
];

export function InspectorDashboard({ onLogout }: InspectorDashboardProps) {
  const [tab, setTab] = useState<DashTab>("route");
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(Object.fromEntries(TASKS.map(t => [t.id, t.status])));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proofUploaded, setProofUploaded] = useState<Record<string, boolean>>({});
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});
  const [simRunning, setSimRunning] = useState(false);

  const [riskTaskId, setRiskTaskId] = useState<string | null>(null);
  const [riskCriteria, setRiskCriteria] = useState<Record<string, boolean>>({});
  const [aiRiskRunning, setAiRiskRunning] = useState(false);

  const RISK_CRITERIA = [
    { key: "soil", label: "Torpaq sabitliyi", desc: "Qruntun daşıma qabiliyyəti" },
    { key: "road", label: "Yol örtüyü vəziyyəti", desc: "Asfalt/beton layının vəziyyəti" },
    { key: "traffic", label: "Nəqliyyat sıxlığı", desc: "Pik saat tıxac riski" },
    { key: "utilities", label: "Yaxınlıqda kommunikasiyalar", desc: "Boru, kabel, qaz xətləri" },
    { key: "weather", label: "Hava şəraiti", desc: "Yağıntı və külək riski" },
    { key: "population", label: "Əhali sıxlığı", desc: "Təsirlənəcək sakin sayı" },
  ];

  const startRiskAssessment = (taskId: string) => {
    setRiskTaskId(taskId);
    setRiskCriteria({});
    setTab("simulation");
  };

  const toggleRiskCriterion = (key: string) => {
    setRiskCriteria(p => ({ ...p, [key]: !p[key] }));
  };

  const runAiRisk = () => {
    setAiRiskRunning(true);
    setRiskCriteria({});
    const keys = RISK_CRITERIA.map(c => c.key);
    let i = 0;
    const tick = () => {
      if (i >= keys.length) { setAiRiskRunning(false); return; }
      const k = keys[i];
      setRiskCriteria(p => ({ ...p, [k]: true }));
      i++;
      setTimeout(tick, 380);
    };
    setTimeout(tick, 500);
  };

  const riskCheckedCount = Object.values(riskCriteria).filter(Boolean).length;
  const riskScore = Math.round((riskCheckedCount / RISK_CRITERIA.length) * 100);

  const toggleLayer = (key: string) => setActiveLayers(p => ({ ...p, [key]: !p[key] }));
  const resolveTask = (id: string) => setStatuses(p => ({ ...p, [id]: "resolved" }));

  const activeLayerList = SIM_LAYERS.filter(l => activeLayers[l.key]);
  const impactScore = activeLayerList.reduce((acc, l) => acc + (l.riskLevel === "high" ? 40 : l.riskLevel === "medium" ? 25 : 12), 0);
  const clampedScore = Math.min(impactScore, 100);

  const DASH_TABS = [
    { id: "route", label: "Gündəlik Marşrut", Icon: Map },
    { id: "tasks", label: "Tapşırıqlar Paneli", Icon: Activity },
    { id: "simulation", label: "Simulyasiya Paneli", Icon: Layers },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">NS</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm">Nərimanov SmartOps</span>
            <div><span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Müfəttiş</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-700 hidden sm:block">Orxan Hüseynov</span>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5">
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Aktiv Tapşırıq", v: TASKS.filter(t => statuses[t.id] !== "resolved").length, cls: "text-blue-600" },
            { label: "Bugün Tamamlandı", v: 3, cls: "text-emerald-600" },
            { label: "Gecikən", v: 1, cls: "text-red-600" },
            { label: "Yüklülük", v: "78%", cls: "text-amber-600" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
              <div className={`font-bold text-xl ${k.cls}`}>{k.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
          {DASH_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as DashTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* ════ ROUTE MAP ════ */}
        {tab === "route" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">Gündəlik Marşrut — Nərimanov</h2>
              <button className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                <Navigation className="w-3.5 h-3.5" /> Naviqasiya Başlat
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div style={{ height: 340 }}>
                <svg className="w-full h-full" viewBox="0 0 420 280" style={{ background: "linear-gradient(160deg,#f0fdf4 0%,#eff6ff 50%,#fafafa 100%)" }}>
                  {[52,104,156,208,260,312,368].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" stroke="#e2e8f0" strokeWidth="1" />)}
                  {[40,80,120,160,200,240].map(y => <line key={`h${y}`} x1="0" y1={y} x2="420" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
                  <line x1="0" y1="140" x2="420" y2="140" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="210" y1="0" x2="210" y2="280" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="0" y1="80" x2="420" y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="210" y="14" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">Hüsü Hacıyev küç.</text>
                  <text x="8" y="138" fill="#64748b" fontSize="8" fontFamily="sans-serif">Elmlər Akad.</text>

                  {/* Buildings */}
                  <rect x="38" y="48" width="72" height="52" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" />
                  <rect x="128" y="28" width="58" height="62" rx="4" fill="#bbf7d0" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
                  <rect x="224" y="38" width="82" height="58" rx="4" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" />
                  <rect x="46" y="162" width="92" height="58" rx="4" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.8" />
                  <rect x="296" y="102" width="72" height="68" rx="4" fill="#fecaca" stroke="#fca5a5" strokeWidth="1.5" opacity="0.8" />
                  <rect x="152" y="158" width="68" height="52" rx="4" fill="#fed7aa" stroke="#fdba74" strokeWidth="1.5" opacity="0.8" />
                  <ellipse cx="348" cy="56" rx="34" ry="22" fill="#bbf7d0" stroke="#86efac" strokeWidth="1" opacity="0.7" />
                  <text x="348" y="60" textAnchor="middle" fill="#16a34a" fontSize="8" fontFamily="sans-serif">Park</text>

                  {/* Route */}
                  <path d="M210,140 L145,88 L100,148 L260,125 L205,105" stroke="#10b981" strokeWidth="2.5" strokeDasharray="7,4" fill="none" opacity="0.8" />

                  {/* Inspector dot */}
                  <circle cx="210" cy="140" r="14" fill="#6366f1" opacity="0.15" />
                  <circle cx="210" cy="140" r="8" fill="#6366f1" stroke="white" strokeWidth="2.5" />
                  <text x="210" y="163" textAnchor="middle" fill="#6366f1" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Siz</text>

                  {/* Task pins */}
                  {TASKS.map(t => {
                    const st = statuses[t.id];
                    const pinColor = STATUS_CFG[st].pin;
                    const isHov = hoveredPin === t.id;
                    return (
                      <g key={t.id} onClick={() => { setSelectedTask(t); setTab("tasks"); }} style={{ cursor: "pointer" }}>
                        <circle cx={t.mapX} cy={t.mapY} r={isHov ? 18 : 13} fill={pinColor} opacity="0.14" />
                        <circle
                          cx={t.mapX} cy={t.mapY} r={isHov ? 10 : 7}
                          fill={pinColor} stroke="white" strokeWidth="2"
                          onMouseEnter={() => setHoveredPin(t.id)}
                          onMouseLeave={() => setHoveredPin(null)}
                        />
                        <text x={t.mapX} y={t.mapY + 4} textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="bold">{t.id.split("-")[1]}</text>
                        {isHov && (
                          <>
                            <rect x={t.mapX - 44} y={t.mapY - 32} width="88" height="18" rx="4" fill="#1e293b" opacity="0.9" />
                            <text x={t.mapX} y={t.mapY - 20} textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif">{t.title}</text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              {/* Legend */}
              <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-5 text-xs text-slate-500">
                {Object.entries(STATUS_CFG).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: v.pin }} />
                    {v.label}
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  Müfəttiş (Siz)
                </div>
              </div>
            </div>

            {/* Quick task cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TASKS.filter(t => statuses[t.id] !== "resolved").map(t => {
                const st = statuses[t.id];
                const { label, color, Icon: SIcon, bg } = STATUS_CFG[st];
                return (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTask(t); setTab("tasks"); }}
                    className="bg-white rounded-xl border border-slate-200 p-3 text-left hover:shadow-md hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800 line-clamp-1">{t.title}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${bg} ${color}`}>
                        <SIcon className="w-3 h-3" />{label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{t.address}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ TASKS SPLIT-VIEW ════ */}
        {tab === "tasks" && (
          <div className="space-y-4">
            <h2 className="text-slate-800 font-semibold mb-2">Tapşırıqlar Paneli</h2>

            {/* task list */}
            <div className="space-y-2">
              {TASKS.map(t => {
                const st = statuses[t.id];
                const { label, color, Icon: SIcon, bg } = STATUS_CFG[st];
                const { label: pLabel, cls: pCls } = PRIORITY_CFG[t.priority];
                const isOpen = selectedTask?.id === t.id;
                return (
                  <div key={t.id} className={`bg-white rounded-2xl border-2 transition-all ${isOpen ? "border-emerald-400 shadow-lg" : "border-slate-200 hover:border-slate-300"}`}>
                    {/* Task row */}
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setSelectedTask(isOpen ? null : t)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-slate-800 font-semibold text-sm">{t.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${pCls}`}>{pLabel}</span>
                        </div>
                        <p className="text-xs text-slate-400">{t.address} · {t.date}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${bg} ${color}`}>
                        <SIcon className="w-3 h-3" />{label}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>

                    {/* ── SPLIT VIEW (expanded) ── */}
                    {isOpen && (
                      <div className="border-t border-slate-100 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Left: Citizen info */}
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-800">Vətəndaşın Müraciəti</span>
                            </div>

                            {/* Citizen photo placeholder */}
                            <div className="w-full h-28 rounded-xl bg-blue-100 border border-blue-200 flex flex-col items-center justify-center mb-3 text-4xl gap-1">
                              {t.photo}
                              <span className="text-xs text-blue-500">Vətəndaşın şəkli</span>
                            </div>

                            <div className="space-y-1.5 text-sm">
                              <div className="flex gap-2">
                                <span className="text-blue-500 text-xs w-20 shrink-0">Vətəndaş:</span>
                                <span className="text-blue-900 font-medium">{t.citizen}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-blue-500 text-xs w-20 shrink-0">Telefon:</span>
                                <span className="text-blue-800">{t.citizenPhone}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-blue-500 text-xs w-20 shrink-0">Tarix:</span>
                                <span className="text-blue-800">{t.date}</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-xs text-blue-500 mb-1 font-medium">Problemin Təsviri:</p>
                              <p className="text-sm text-blue-900 leading-relaxed">{t.desc}</p>
                            </div>
                          </div>

                          {/* Right: Agency requirements */}
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-semibold text-amber-800">Qurumun Tələbləri</span>
                            </div>
                            <p className="text-xs text-amber-700 mb-3 leading-relaxed">{t.agencyBody}</p>
                            <ul className="space-y-2">
                              {t.agencyReqs.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                  <span style={{ lineHeight: 1.5 }}>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Risk assessment button — only for road/emergency categories */}
                        {(t.category === "Yol" || t.category === "Fövqəladə hal") && (
                          <div className="mb-3">
                            <button
                              onClick={() => startRiskAssessment(t.id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-amber-200"
                            >
                              <ShieldAlert className="w-4 h-4" /> Risk Dəyərləndirməsi Apar
                            </button>
                          </div>
                        )}

                        {/* Proof upload + resolve */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {proofUploaded[t.id] ? (
                            <div className="flex-1 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <Camera className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs text-emerald-700 flex-1">sübut_{t.id}.jpg yükləndi ✓</span>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            </div>
                          ) : (
                            <button
                              onClick={() => setProofUploaded(p => ({ ...p, [t.id]: true }))}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            >
                              <Upload className="w-4 h-4" /> Sübut Fotosu Yüklə
                            </button>
                          )}

                          {statuses[t.id] !== "resolved" ? (
                            <button
                              onClick={() => resolveTask(t.id)}
                              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-emerald-200"
                            >
                              <CheckCircle className="w-4 h-4" /> Həll Olundu
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
                              <CheckCircle className="w-4 h-4" /> Tamamlandı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ SIMULATION ════ */}
        {tab === "simulation" && (
          <div className="space-y-4">
            {/* Header card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold" style={{ fontSize: "1.05rem" }}>Rəqəmsal Əkiz Simulyasiyası</h2>
                  <p className="text-slate-400 text-xs">İşə başlamazdan əvvəl hərtərəfli təsir analizini aparın</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Qazıntı, tikinti və ya infrastruktur müdaxiləsindən əvvəl aşağıdakı layları aktivləşdirərək potensial riskləri modelləşdirin.
              </p>
            </div>

            {/* ── RISK ASSESSMENT SECTION (shown when redirected from a task) ── */}
            {riskTaskId && (() => {
              const riskTask = TASKS.find(t => t.id === riskTaskId)!;
              return (
                <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 overflow-hidden">
                  {/* Context banner */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Risk Dəyərləndirməsi</p>
                        <h3 className="text-white font-semibold">{riskTask.title}</h3>
                        <p className="text-white/70 text-xs">{riskTask.address} · {riskTask.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setRiskTaskId(null); setRiskCriteria({}); }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Mode row */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-amber-900">Risk Meyarlarını Qiymətləndirin</p>
                      <button
                        onClick={runAiRisk}
                        disabled={aiRiskRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
                      >
                        {aiRiskRunning
                          ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analiz edilir...</>
                          : <><Sparkles className="w-3 h-3" /> AI ilə qiymətləndir</>}
                      </button>
                    </div>

                    {/* Criteria grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {RISK_CRITERIA.map(c => {
                        const checked = !!riskCriteria[c.key];
                        return (
                          <button
                            key={c.key}
                            onClick={() => !aiRiskRunning && toggleRiskCriterion(c.key)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${checked ? "border-amber-500 bg-amber-100" : "border-slate-200 bg-white hover:border-amber-300"}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "border-amber-500 bg-amber-500" : "border-slate-300 bg-white"}`}>
                                {checked && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-xs font-semibold ${checked ? "text-amber-800" : "text-slate-600"}`}>{c.label}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-tight ml-5">{c.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Risk score bar */}
                    <div className={`rounded-xl p-4 border ${riskScore > 60 ? "bg-red-50 border-red-200" : riskScore > 30 ? "bg-amber-100 border-amber-300" : "bg-white border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Risk Balı</span>
                        <span className={`text-xl font-bold ${riskScore > 60 ? "text-red-600" : riskScore > 30 ? "text-amber-600" : "text-emerald-600"}`}>{riskScore}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${riskScore > 60 ? "bg-red-500" : riskScore > 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${riskScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {riskScore === 0 && "Heç bir meyar seçilməyib. Yuxarıdakı meyarları qeyd edin."}
                        {riskScore > 0 && riskScore <= 33 && "Aşağı risk səviyyəsi. İş planlaması qəbul edilə bilər."}
                        {riskScore > 33 && riskScore <= 66 && "Orta risk. Ehtiyat tədbirləri nəzərə alınmalıdır."}
                        {riskScore > 66 && "Yüksək risk! Alternativ plan hazırlanması tövsiyə olunur."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 5 toggle layers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIM_LAYERS.map(layer => {
                const active = !!activeLayers[layer.key];
                const Icon = layer.Icon;
                return (
                  <div key={layer.key} className={`bg-white rounded-2xl border-2 p-4 transition-all ${active ? `${layer.activeBorder} shadow-md` : "border-slate-200"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? layer.activeBg : "bg-slate-100"}`}>
                          <Icon className={`w-5 h-5 ${active ? layer.activeColor : "text-slate-400"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{layer.label}</p>
                          <p className="text-xs text-slate-400">{layer.sublabel}</p>
                        </div>
                      </div>
                      {/* Custom toggle */}
                      <button
                        onClick={() => toggleLayer(layer.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${active ? "bg-emerald-500" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${active ? "translate-x-6" : ""}`} />
                      </button>
                    </div>

                    {active && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {layer.details.map(d => (
                          <div key={d.k} className="flex justify-between text-xs">
                            <span className="text-slate-500">{d.k}</span>
                            <span className={`font-medium ${layer.activeColor}`}>{d.v}</span>
                          </div>
                        ))}
                        {/* Risk badge */}
                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="text-slate-500">Risk Səviyyəsi</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium text-xs
                            ${layer.riskLevel === "high" ? "bg-red-100 text-red-600" : layer.riskLevel === "medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                            {layer.riskLabel}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${layer.riskLevel === "high" ? "bg-red-500 w-4/5" : layer.riskLevel === "medium" ? "bg-amber-500 w-1/2" : "bg-green-500 w-1/4"}`} />
                        </div>
                        {layer.warning && (
                          <div className="flex items-start gap-1.5 text-xs mt-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-red-600">{layer.warning}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {!active && (
                      <p className="text-xs text-slate-400 pt-1">Layı aktivləşdirin ki, analiz görünsün</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Impact score */}
            <div className={`rounded-2xl border-2 p-5 transition-all ${clampedScore > 60 ? "border-red-300 bg-red-50" : clampedScore > 30 ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-800 font-semibold">Ümumi Təsir Balı</h3>
                <span className={`text-2xl font-bold ${clampedScore > 60 ? "text-red-600" : clampedScore > 30 ? "text-amber-600" : "text-emerald-600"}`}>
                  {clampedScore}/100
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${clampedScore > 60 ? "bg-red-500" : clampedScore > 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${clampedScore}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                {clampedScore === 0 && "Heç bir lay seçilməyib. Analiz üçün layları aktivləşdirin."}
                {clampedScore > 0 && clampedScore <= 30 && "Aşağı risk. İş planlaması qəbul edilə bilər."}
                {clampedScore > 30 && clampedScore <= 60 && "Orta risk. Əlavə ehtiyat tədbirləri nəzərə alınmalıdır."}
                {clampedScore > 60 && "Yüksək risk! Alternativ plan hazırlanması tövsiyə olunur."}
              </p>
              <button
                onClick={() => { setSimRunning(true); setTimeout(() => setSimRunning(false), 2500); }}
                disabled={simRunning || clampedScore === 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {simRunning
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Simulyasiya işləyir...</>
                  : <><Layers className="w-4 h-4" /> Tam Simulyasiya Başlat</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
