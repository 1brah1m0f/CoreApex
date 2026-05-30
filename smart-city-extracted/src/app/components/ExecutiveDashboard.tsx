import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Bell, LogOut, Building2, Download, Search, Filter,
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  FileText, Database, ChevronDown, CalendarDays, X,
  Send, ClipboardList
} from "lucide-react";

interface ExecutiveDashboardProps {
  onLogout: () => void;
}

type ExecTab = "analytics" | "archive" | "alerts";
type ReportStatus = "resolved" | "inprogress" | "pending" | "overdue";

interface ArchiveRecord {
  id: string;
  title: string;
  category: string;
  neighborhood: string;
  status: ReportStatus;
  citizen: string;
  assignedTo: string;
  submittedDate: string;
  resolvedDate: string;
  deadlineDate: string;
  deadlinePassed: boolean;
}

const today = new Date("2026-05-30");
const isBefore = (d: string) => new Date(d) < today;

const ARCHIVE: ArchiveRecord[] = [
  { id: "MR-0241", title: "Küçə lampası işləmir", category: "Elektrik", neighborhood: "H. Hacıyev", status: "resolved", citizen: "Əli Məmmədov", assignedTo: "Azərişıq ASC", submittedDate: "01 May 2026", resolvedDate: "03 May 2026", deadlineDate: "05 May 2026", deadlinePassed: isBefore("2026-05-05") },
  { id: "MR-0238", title: "Su borusu sızır", category: "Su Təchizatı", neighborhood: "Elmlər Akad.", status: "inprogress", citizen: "Leyla Quliyeva", assignedTo: "Azərsu ASC", submittedDate: "10 May 2026", resolvedDate: "—", deadlineDate: "15 May 2026", deadlinePassed: isBefore("2026-05-15") },
  { id: "MR-0235", title: "Yol çuxuru", category: "Yol", neighborhood: "Mete Turan", status: "overdue", citizen: "Rauf Babayev", assignedTo: "İcra Hakimiyyəti", submittedDate: "15 May 2026", resolvedDate: "—", deadlineDate: "20 May 2026", deadlinePassed: isBefore("2026-05-20") },
  { id: "MR-0232", title: "Zibil daşınmayıb", category: "Sanitariya", neighborhood: "Ə. Vahid", status: "resolved", citizen: "Nigar Hüseynova", assignedTo: "Bələdiyyə", submittedDate: "05 May 2026", resolvedDate: "06 May 2026", deadlineDate: "08 May 2026", deadlinePassed: isBefore("2026-05-08") },
  { id: "MR-0229", title: "Park fəvvarəsi xarabdır", category: "Bələdiyyə", neighborhood: "Nərimanov", status: "inprogress", citizen: "Tural Əliyev", assignedTo: "Bələdiyyə", submittedDate: "17 May 2026", resolvedDate: "—", deadlineDate: "02 Jun 2026", deadlinePassed: false },
  { id: "MR-0225", title: "Siqnal işığı xarab", category: "Elektrik", neighborhood: "Əhmədbəyli", status: "overdue", citizen: "Şamil Nəzərov", assignedTo: "Azərişıq ASC", submittedDate: "08 May 2026", resolvedDate: "—", deadlineDate: "13 May 2026", deadlinePassed: isBefore("2026-05-13") },
  { id: "MR-0221", title: "Kanal tıxanıb", category: "Su Təchizatı", neighborhood: "H. Hacıyev", status: "resolved", citizen: "Günay Əsgərova", assignedTo: "Azərsu ASC", submittedDate: "12 May 2026", resolvedDate: "14 May 2026", deadlineDate: "17 May 2026", deadlinePassed: isBefore("2026-05-17") },
  { id: "MR-0218", title: "Ağac yolu bağlayıb", category: "Yol", neighborhood: "Nərimanov", status: "resolved", citizen: "Fuad Həsənov", assignedTo: "Bələdiyyə", submittedDate: "20 May 2026", resolvedDate: "21 May 2026", deadlineDate: "25 May 2026", deadlinePassed: isBefore("2026-05-25") },
  { id: "MR-0215", title: "Küçə zibilliyi", category: "Sanitariya", neighborhood: "Əhmədbəyli", status: "pending", citizen: "Aytən Babayeva", assignedTo: "Bələdiyyə", submittedDate: "26 May 2026", resolvedDate: "—", deadlineDate: "01 Jun 2026", deadlinePassed: false },
  { id: "MR-0210", title: "Fasad suvaqlanmayıb", category: "Yol", neighborhood: "Elmlər Akad.", status: "pending", citizen: "Vüsal Kərimov", assignedTo: "İcra Hakimiyyəti", submittedDate: "28 May 2026", resolvedDate: "—", deadlineDate: "07 Jun 2026", deadlinePassed: false },
];

const SLA_ALERTS = [
  { id: "MR-0225", title: "Siqnal işığı xarab", hood: "Əhmədbəyli", overdue: 17, assignedTo: "Azərişıq ASC", severity: "critical" as const },
  { id: "MR-0238", title: "Su borusu sızır", hood: "Elmlər Akad.", overdue: 15, assignedTo: "Azərsu ASC", severity: "high" as const },
  { id: "MR-0235", title: "Yol çuxuru", hood: "Mete Turan", overdue: 10, assignedTo: "İcra Hakimiyyəti", severity: "high" as const },
];

const NEIGHBORHOOD_DATA = [
  { name: "H.Hacıyev", həll: 42, açıq: 8, gecikən: 2 },
  { name: "Elmlər A.", həll: 28, açıq: 6, gecikən: 1 },
  { name: "Mete Turan", həll: 55, açıq: 9, gecikən: 3 },
  { name: "Ə.Vahid", həll: 38, açıq: 15, gecikən: 7 },
  { name: "Nərimanov", həll: 72, açıq: 4, gecikən: 0 },
  { name: "Əhmədbəyli", həll: 47, açıq: 11, gecikən: 4 },
];

const PIE_DATA = [
  { name: "Elektrik", value: 34, color: "#f59e0b" },
  { name: "Su Təchizatı", value: 28, color: "#3b82f6" },
  { name: "Yol", value: 22, color: "#f97316" },
  { name: "Sanitariya", value: 10, color: "#10b981" },
  { name: "Digər", value: 6, color: "#8b5cf6" },
];

const STATUS_CFG: Record<ReportStatus, { label: string; color: string; bg: string; border: string }> = {
  resolved: { label: "Həll olundu", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  pending: { label: "Gözləyir", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  inprogress: { label: "İcrada", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  overdue: { label: "Vaxtı keçib", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((e: any) => (
        <p key={e.name} style={{ color: e.color }}>{e.name}: {e.value}</p>
      ))}
    </div>
  );
};

export function ExecutiveDashboard({ onLogout }: ExecutiveDashboardProps) {
  const [tab, setTab] = useState<ExecTab>("analytics");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Report modal for SLA alerts
  interface ReportModalData {
    alertId: string;
    alertTitle: string;
    hood: string;
    assignedTo: string;
    overdueDays: number;
    severity: string;
  }
  const [reportModal, setReportModal] = useState<ReportModalData | null>(null);
  const [reportText, setReportText] = useState("");
  const [reportAction, setReportAction] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const openReportModal = (a: typeof SLA_ALERTS[0]) => {
    setReportModal({ alertId: a.id, alertTitle: a.title, hood: a.hood, assignedTo: a.assignedTo, overdueDays: a.overdue, severity: a.severity });
    setReportText("");
    setReportAction("");
    setReportSent(false);
  };

  const submitReport = () => {
    if (!reportText || !reportAction) return;
    setReportSent(true);
    setTimeout(() => {
      setReportModal(null);
      setReportSent(false);
    }, 2200);
  };

  const filtered = ARCHIVE.filter(r => {
    const q = search.toLowerCase();
    const matchQ = r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.neighborhood.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || r.status === statusFilter;
    return matchQ && matchS;
  });

  const resolved = ARCHIVE.filter(r => r.status === "resolved").length;
  const open = ARCHIVE.filter(r => r.status !== "resolved").length;
  const overdueCount = ARCHIVE.filter(r => r.deadlinePassed && r.status !== "resolved").length;
  const onTime = resolved;

  const EXEC_TABS = [
    { id: "analytics", label: "Analitik Panel", Icon: TrendingUp },
    { id: "archive", label: "Rəqəmsal Arxiv", Icon: Database },
    { id: "alerts", label: "Xəbərdarlıqlar", Icon: AlertTriangle, badge: SLA_ALERTS.length },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">NS</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm">Nərimanov SmartOps</span>
            <div><span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">İcra Hakimiyyəti</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: 9 }}>{SLA_ALERTS.length}</span>
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-sm text-slate-700 hidden sm:block">Admin Rəhbərlik</span>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Cəmi Müraciət", v: ARCHIVE.length, Icon: FileText, cls: "text-violet-600", bgIcon: "bg-violet-100" },
            { label: "Həll Edilmiş", v: resolved, Icon: CheckCircle, cls: "text-emerald-600", bgIcon: "bg-emerald-100" },
            { label: "Açıq Müraciət", v: open, Icon: Clock, cls: "text-blue-600", bgIcon: "bg-blue-100" },
            { label: "SLA Pozuntusu", v: overdueCount, Icon: AlertTriangle, cls: "text-red-600", bgIcon: "bg-red-100" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl ${k.bgIcon} flex items-center justify-center`}>
                  <k.Icon className={`w-4 h-4 ${k.cls}`} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <div className={`text-2xl font-bold ${k.cls}`}>{k.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
          {EXEC_TABS.map(({ id, label, Icon, badge }: any) => (
            <button
              key={id}
              onClick={() => setTab(id as ExecTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-white text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
              {badge && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{badge}</span>}
            </button>
          ))}
        </div>

        {/* ════ ANALYTICS ════ */}
        {tab === "analytics" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bar chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-slate-800 font-semibold mb-4">Rayon üzrə Statistika</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={NEIGHBORHOOD_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="həll" name="Həll olundu" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="açıq" name="Açıq" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="gecikən" name="Gecikən" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-slate-800 font-semibold mb-4">Kateqoriya üzrə Bölgü</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} dataKey="value">
                      {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly trend */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-slate-800 font-semibold mb-4">Aylıq Müraciət Trendi (2026)</h3>
              <ResponsiveContainer width="100%" height={175}>
                <BarChart
                  data={[
                    { ay: "Yan", müraciət: 85, həll: 80 },
                    { ay: "Feb", müraciət: 92, həll: 87 },
                    { ay: "Mar", müraciət: 110, həll: 100 },
                    { ay: "Apr", müraciət: 98, həll: 95 },
                    { ay: "May", müraciət: 124, həll: 108 },
                  ]}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="ay" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="müraciət" name="Müraciət" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="həll" name="Həll olundu" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Agency performance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-slate-800 font-semibold mb-4">Qurum Performansı</h3>
              <div className="space-y-3">
                {[
                  { name: "Azərişıq ASC", pct: 92, avg: "18 saat" },
                  { name: "Azərsu ASC", pct: 87, avg: "22 saat" },
                  { name: "Bələdiyyə", pct: 74, avg: "31 saat" },
                  { name: "İcra Hakimiyyəti", pct: 63, avg: "48 saat" },
                ].map(q => (
                  <div key={q.name} className="flex items-center gap-3">
                    <span className="w-36 text-xs text-slate-600 shrink-0">{q.name}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${q.pct >= 90 ? "bg-emerald-500" : q.pct >= 75 ? "bg-blue-500" : "bg-amber-500"}`}
                        style={{ width: `${q.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{q.pct}%</span>
                    <span className="text-xs text-slate-400 w-16 text-right">{q.avg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ ARCHIVE ════ */}
        {tab === "archive" && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Müraciəti axtar (ID, başlıq, rayon)..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white hover:bg-slate-50"
                  >
                    <Filter className="w-4 h-4" />
                    {statusFilter === "all" ? "Hamısı" : STATUS_CFG[statusFilter as ReportStatus]?.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 min-w-40">
                      {[
                        { v: "all", l: "Hamısı" },
                        { v: "resolved", l: "Həll olundu" },
                        { v: "pending", l: "Gözləyir" },
                        { v: "inprogress", l: "İcrada" },
                        { v: "overdue", l: "Vaxtı keçib" },
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => { setStatusFilter(o.v); setFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === o.v ? "text-violet-600 font-medium" : "text-slate-600"}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-700 transition-colors">
                  <Download className="w-4 h-4" /> İxrac et
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">{filtered.length} nəticə tapıldı</p>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Müraciət</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Rayon</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Qurum</th>
                      {/* Status + Deadline column */}
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status / Deadline</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Göndərilmə</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const s = STATUS_CFG[r.status];
                      const isOverdue = r.deadlinePassed && r.status !== "resolved";
                      return (
                        <tr
                          key={r.id}
                          className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${isOverdue ? "bg-red-50/25" : ""}`}
                        >
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs text-violet-600 font-medium">{r.id}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800 text-sm">{r.title}</p>
                            <p className="text-xs text-slate-400">{r.citizen}</p>
                          </td>
                          <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">{r.neighborhood}</td>
                          <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-500">{r.assignedTo}</td>

                          {/* ── CRITICAL: Status badge + Deadline below it ── */}
                          <td className="py-3.5 px-4">
                            {/* Status badge */}
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${s.bg} ${s.border} ${s.color}`}>
                              {isOverdue && r.status !== "overdue" && <AlertTriangle className="w-3 h-3" />}
                              {s.label}
                            </span>

                            {/* Deadline row — always shown directly below */}
                            <div className="flex items-center gap-1 mt-1.5">
                              <CalendarDays className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-xs text-slate-400">Son tarix:</span>
                              <span className={`text-xs font-semibold ${isOverdue ? "text-red-600" : "text-emerald-600"}`}>
                                {r.deadlineDate}
                              </span>
                            </div>

                            {/* Overdue / On-time indicator */}
                            <div className="mt-1">
                              {isOverdue ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                                  Vaxtı keçib
                                </span>
                              ) : r.status === "resolved" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                  Vaxtında
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
                                  Gözləyir
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-400">{r.submittedDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ SLA ALERTS ════ */}
        {tab === "alerts" && (
          <div className="space-y-4">
            {/* Warning banner */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold">SLA Xəbərdarlıq Paneli</h3>
                <p className="text-red-600 text-sm mt-0.5">{SLA_ALERTS.length} müraciət qanuni vaxt çərçivəsini aşmışdır. Dərhal müdaxilə tələb olunur.</p>
              </div>
            </div>

            {/* Alert cards */}
            {SLA_ALERTS.map(a => (
              <div
                key={a.id}
                className={`rounded-2xl border-2 p-5 ${a.severity === "critical" ? "border-red-400 bg-red-50" : "border-orange-300 bg-orange-50"}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.severity === "critical" ? "bg-red-100" : "bg-orange-100"}`}>
                      <AlertTriangle className={`w-5 h-5 ${a.severity === "critical" ? "text-red-600" : "text-orange-600"}`} />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-semibold">{a.title}</h4>
                      <p className="text-xs text-slate-500">{a.id} · {a.hood} · {a.assignedTo}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold flex-shrink-0 ${a.severity === "critical" ? "bg-red-600 text-white" : "bg-orange-500 text-white"}`}>
                    {a.severity === "critical" ? "KRİTİK" : "YÜKSƏK"}
                  </span>
                </div>

                {/* Deadline display */}
                <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${a.severity === "critical" ? "bg-red-100/60" : "bg-orange-100/60"}`}>
                  <Clock className={`w-4 h-4 flex-shrink-0 ${a.severity === "critical" ? "text-red-600" : "text-orange-600"}`} />
                  <span className={`text-sm font-bold ${a.severity === "critical" ? "text-red-700" : "text-orange-700"}`}>
                    {a.overdue} gün gecikir
                  </span>
                  <span className="text-xs text-slate-500 ml-1">— Qanuni son tarix artıq keçib</span>
                </div>

                {/* Deadline badge (same style as archive) */}
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">Deadline tarixi:</span>
                  <span className="text-xs font-bold text-red-600">keçib</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 ml-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                    Vaxtı keçib
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all ${a.severity === "critical" ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}>
                    Təcili Müdaxilə Et
                  </button>
                  <button
                    onClick={() => openReportModal(a)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm border border-slate-300 text-slate-600 hover:bg-white hover:border-violet-300 hover:text-violet-600 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Hesabat Göndər
                  </button>
                </div>
              </div>
            ))}

            {/* SLA overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-slate-800 font-semibold mb-4">SLA İcra Vəziyyəti</h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Vaxtında Həll", v: onTime, pct: Math.round((onTime / ARCHIVE.length) * 100), cls: "text-emerald-600", bar: "bg-emerald-500" },
                  { label: "İşdədir", v: open - overdueCount, pct: Math.round(((open - overdueCount) / ARCHIVE.length) * 100), cls: "text-blue-600", bar: "bg-blue-500" },
                  { label: "SLA Pozuntusu", v: overdueCount, pct: Math.round((overdueCount / ARCHIVE.length) * 100), cls: "text-red-600", bar: "bg-red-500" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className={`text-2xl font-bold ${s.cls}`}>{s.v}</div>
                    <div className="text-xs text-slate-500 mb-2">{s.label}</div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{s.pct}%</div>
                  </div>
                ))}
              </div>

              <h3 className="text-slate-800 font-semibold mb-3">Aktiv SLA Qaydaları</h3>
              <div className="space-y-2">
                {[
                  { cat: "Elektrik / İşıqlandırma", deadline: "72 saat", prio: "Yüksək", prioCls: "bg-orange-100 text-orange-600" },
                  { cat: "Su Təchizatı", deadline: "48 saat", prio: "Kritik", prioCls: "bg-red-100 text-red-600" },
                  { cat: "Yol / İnfrastruktur", deadline: "120 saat", prio: "Orta", prioCls: "bg-slate-100 text-slate-500" },
                  { cat: "Sanitariya", deadline: "48 saat", prio: "Yüksək", prioCls: "bg-orange-100 text-orange-600" },
                ].map(r => (
                  <div key={r.cat} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-700">{r.cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Maks: {r.deadline}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.prioCls}`}>{r.prio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ REPORT MODAL ════ */}
      {reportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Rəsmi Hesabat Göndər</h3>
                  <p className="text-xs text-slate-500">{reportModal.alertId} · {reportModal.alertTitle}</p>
                </div>
              </div>
              <button onClick={() => setReportModal(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Auto-populated context */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Avtomatik Doldurulmuş Məlumat</p>
                <div className="space-y-2">
                  {[
                    { label: "Müraciət ID", value: reportModal.alertId },
                    { label: "Problem", value: reportModal.alertTitle },
                    { label: "Rayon", value: reportModal.hood },
                    { label: "Məsul Qurum", value: reportModal.assignedTo },
                    { label: "Gecikdiyi Gün", value: `${reportModal.overdueDays} gün` },
                    { label: "Ciddilik", value: reportModal.severity === "critical" ? "Kritik" : "Yüksək" },
                  ].map(f => (
                    <div key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{f.label}:</span>
                      <span className="font-medium text-slate-800">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report text */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Hesabat Mətni <span className="text-red-500">*</span></label>
                <textarea
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  placeholder="Problemin cari vəziyyəti, görülmüş tədbirlər və nəticəsi haqqında ətraflı məlumat yazın..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                />
              </div>

              {/* Recommended action */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tövsiyə Edilən Tədbirlər <span className="text-red-500">*</span></label>
                <input
                  value={reportAction}
                  onChange={e => setReportAction(e.target.value)}
                  placeholder="Növbəti addımlar, məsul şəxslər, son tarix..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>

              {reportSent ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Hesabat uğurla göndərildi!
                </div>
              ) : (
                <button
                  onClick={submitReport}
                  disabled={!reportText || !reportAction}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-800 text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" /> Hesabatı Göndər
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
