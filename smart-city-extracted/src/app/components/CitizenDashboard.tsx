import { useState } from "react";
import {
  Plus, MapPin, Cpu, CheckCircle, Clock, AlertCircle,
  Camera, X, Send, Bell, LogOut, User,
  Droplets, Zap, Trash2, Building, MessageSquare,
  ThumbsUp, Megaphone, ArrowUpDown, Sparkles,
  FileText, ImagePlus, Navigation
} from "lucide-react";

interface CitizenDashboardProps {
  onLogout: () => void;
}

type StatusType = "pending" | "inprogress" | "resolved";
type Tab = "reports" | "proposals" | "alerts";

interface Report {
  id: string;
  title: string;
  date: string;
  status: StatusType;
  address: string;
  aiRouted: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  voted: boolean;
  tag: string;
  tagCls: string;
}

interface GovAlert {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  type: "info" | "warning" | "success";
  district: string;
}

const REPORTS: Report[] = [
  { id: "MR-0241", title: "Küçə lampası işləmir", date: "24 May 2026", status: "resolved", address: "Hüsü Hacıyev küç. 12", aiRouted: "Azərişıq ASC" },
  { id: "MR-0238", title: "Su borusu sızır", date: "22 May 2026", status: "inprogress", address: "Elmlər Akademiyası 5", aiRouted: "Azərsu ASC" },
  { id: "MR-0235", title: "Zibil vaxtında yığılmayıb", date: "20 May 2026", status: "pending", address: "Mete Turan küç. 8", aiRouted: "Bələdiyyə" },
  { id: "MR-0229", title: "Yol örtüyü zədəlidir", date: "18 May 2026", status: "inprogress", address: "Əliağa Vahid küç. 22", aiRouted: "İcra Hakimiyyəti" },
];

const CATEGORIES = [
  { id: "electric", label: "Elektrik / İşıqlandırma", icon: Zap, grad: "from-yellow-400 to-orange-500", aiRoute: "Azərişıq ASC" },
  { id: "water", label: "Su Təchizatı", icon: Droplets, grad: "from-blue-400 to-blue-600", aiRoute: "Azərsu ASC" },
  { id: "waste", label: "Zibil / Sanitariya", icon: Trash2, grad: "from-green-400 to-emerald-600", aiRoute: "Bələdiyyə" },
  { id: "road", label: "Yol / İnfrastruktur", icon: Building, grad: "from-orange-400 to-red-500", aiRoute: "İcra Hakimiyyəti" },
  { id: "other", label: "Digər", icon: MessageSquare, grad: "from-purple-400 to-violet-600", aiRoute: "İcra Hakimiyyəti" },
];

const STATUS_CFG: Record<StatusType, { label: string; color: string; Icon: typeof CheckCircle; bg: string }> = {
  pending: { label: "Gözləyir", color: "text-amber-600", Icon: Clock, bg: "bg-amber-50 border-amber-200" },
  inprogress: { label: "İcrada", color: "text-blue-600", Icon: AlertCircle, bg: "bg-blue-50 border-blue-200" },
  resolved: { label: "Həll olundu", color: "text-emerald-600", Icon: CheckCircle, bg: "bg-emerald-50 border-emerald-200" },
};

const ALERT_CFG = {
  info: { border: "border-blue-200", bg: "bg-blue-50", emoji: "ℹ️", text: "text-blue-700" },
  warning: { border: "border-amber-200", bg: "bg-amber-50", emoji: "⚠️", text: "text-amber-700" },
  success: { border: "border-emerald-200", bg: "bg-emerald-50", emoji: "✅", text: "text-emerald-700" },
};

const INIT_PROPOSALS: Proposal[] = [
  { id: "P1", title: "Nərimanov parkında velo yolu çəkilsin", description: "Xüsusi velo marşrutu olmadığından vəlosipedçilər riskə məruz qalır. Yolun çəkilməsi tıxacı da azaldacaq.", author: "Tural Ə.", date: "20 May 2026", votes: 247, voted: false, tag: "Nəqliyyat", tagCls: "bg-blue-100 text-blue-700" },
  { id: "P2", title: "Məktəb yollarında ağıllı keçid sistemi", description: "Uşaqların məktəbə gedib-gəlməsini asanlaşdırmaq üçün senzorlu piyada keçidlərinin qurulması lazımdır.", author: "Sevinc M.", date: "18 May 2026", votes: 198, voted: false, tag: "Təhlükəsizlik", tagCls: "bg-red-100 text-red-700" },
  { id: "P3", title: "İctimai WiFi nöqtələri genişləndirilsin", description: "Rayon mərkəzindəki istirahət zonalarında pulsuz internet əlaqəsi mövcud deyil.", author: "Kamran N.", date: "15 May 2026", votes: 134, voted: false, tag: "Texnologiya", tagCls: "bg-purple-100 text-purple-700" },
  { id: "P4", title: "Qocalar üçün xüsusi oturma zonaları", description: "Yaşlı vətəndaşlar üçün yürüyüş məsafəsindəki küçə boyunca kölgəlik oturma yerlərinin artırılması vacibdir.", author: "Rəna H.", date: "12 May 2026", votes: 89, voted: false, tag: "Sosial", tagCls: "bg-green-100 text-green-700" },
  { id: "P5", title: "Gündüz vaxtı pulsuz uşaq meydançası", description: "Mövcud uşaq meydançaları gündüz vaxtı istifadəsiz qalır, ailələr girişdə çətinlik çəkir.", author: "Aytən B.", date: "10 May 2026", votes: 67, voted: false, tag: "Ailə", tagCls: "bg-orange-100 text-orange-700" },
];

const GOV_ALERTS: GovAlert[] = [
  { id: "A1", title: "Qazıntı işləri haqqında elan", body: "Bu gün saat 14:00-da Hüsü Hacıyev küçəsinin 5–12-ci ev hissəsində qazıntı işləri aparılacaq. Sakinlərə əlaqəli yollardan istifadə etmək tövsiyə olunur.", date: "30 May 2026", time: "10:15", type: "warning", district: "H. Hacıyev küç." },
  { id: "A2", title: "Elektrik kəsilişi barədə məlumat", body: "Təmir işləri səbəbindən sabah saat 09:00–13:00 arası Elmlər Akademiyası küçəsi 1–8 nömrəli binalarda elektrik enerjisi kəsiləcək.", date: "29 May 2026", time: "17:40", type: "warning", district: "Elmlər Akad. küç." },
  { id: "A3", title: "Yeni park açıldı!", body: "Nərimanov meydanı yaxınlığında əsaslı şəkildə yenilənmiş Gənclər Parkı bu gün rəsmi olaraq istifadəyə verildi.", date: "28 May 2026", time: "09:00", type: "success", district: "Nərimanov meydanı" },
  { id: "A4", title: "Su kəsintisi planı", body: "Şəbəkə bərpası çərçivəsində 1 İyun 2026 tarixində Mete Turan küçəsinin 3–15 nömrəli binalarında su 06:00–10:00 saatları arasında verilməyəcək.", date: "27 May 2026", time: "14:20", type: "info", district: "Mete Turan küç." },
  { id: "A5", title: "Komposter toplama günləri dəyişib", body: "Əliağa Vahid küçəsi üçün üzvi tullantı toplama cədvəli artıq hər cümə axşamı saat 08:00-da olacaq.", date: "26 May 2026", time: "11:05", type: "info", district: "Əliağa Vahid küç." },
];

// "choose" = pick auto/manual, "auto" = ai form, "manual" = manual form
type ReportModalStep = "choose" | "auto" | "manual";

export function CitizenDashboard({ onLogout }: CitizenDashboardProps) {
  const [tab, setTab] = useState<Tab>("reports");
  const [showModal, setShowModal] = useState(false);
  const [reportStep, setReportStep] = useState<ReportModalStep>("choose");
  const [proposals, setProposals] = useState(INIT_PROPOSALS);

  // proposal submission
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [proposalTag, setProposalTag] = useState("Ümumi");
  const [proposalDone, setProposalDone] = useState(false);

  // report form state
  const [catId, setCatId] = useState<string | null>(null);
  const [aiRoute, setAiRoute] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiRunning, setAiRunning] = useState(false);
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  const openModal = () => { setShowModal(true); setReportStep("choose"); };

  const pickCategory = (id: string, route: string) => {
    setCatId(id);
    setAiRoute(route);
  };

  const runAI = () => {
    if (!photo) return;
    setAiRunning(true);
    setCatId(null);
    setAiRoute(null);
    setAiStep(1);
    [600, 1200, 1800].forEach((ms, i) => setTimeout(() => setAiStep(i + 2), ms));
    setTimeout(() => {
      const pick = CATEGORIES[Math.floor(Math.random() * 3)];
      setCatId(pick.id);
      setAiRoute(pick.aiRoute);
      setAiRunning(false);
    }, 2200);
  };

  const submitForm = () => {
    if (!catId || desc.length < 5) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setShowModal(false);
      setCatId(null);
      setAiRoute(null);
      setDesc("");
      setPhoto(false);
      setAiStep(0);
      setPin(null);
      setReportStep("choose");
    }, 2000);
  };

  const resetModal = () => {
    setShowModal(false);
    setCatId(null);
    setAiRoute(null);
    setDesc("");
    setPhoto(false);
    setAiStep(0);
    setAiRunning(false);
    setPin(null);
    setDone(false);
    setReportStep("choose");
  };

  const handleVote = (id: string) => {
    setProposals(prev =>
      prev
        .map(p => p.id === id ? { ...p, votes: p.voted ? p.votes - 1 : p.votes + 1, voted: !p.voted } : p)
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const submitProposal = () => {
    if (!proposalTitle || proposalDesc.length < 10) return;
    const newP: Proposal = {
      id: `P${Date.now()}`,
      title: proposalTitle,
      description: proposalDesc,
      author: "Əli Məmmədov",
      date: "30 May 2026",
      votes: 0,
      voted: false,
      tag: proposalTag,
      tagCls: "bg-slate-100 text-slate-600",
    };
    setProposals(prev => [newP, ...prev].sort((a, b) => b.votes - a.votes));
    setProposalDone(true);
    setTimeout(() => {
      setProposalDone(false);
      setShowProposalForm(false);
      setProposalTitle("");
      setProposalDesc("");
      setProposalTag("Ümumi");
    }, 1800);
  };

  const TABS = [
    { id: "reports", label: "Müraciətlərim", Icon: FileText, count: REPORTS.length },
    { id: "proposals", label: "Təkliflər", Icon: ThumbsUp, count: proposals.length },
    { id: "alerts", label: "Xəbərdarlıqlar", Icon: Megaphone, count: GOV_ALERTS.filter(a => a.type === "warning").length },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">NS</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm">Nərimanov SmartOps</span>
            <div><span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Vətəndaş</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-slate-700 hidden sm:block">Əli Məmmədov</span>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
          {TABS.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:block truncate">{label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${tab === id ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* ════ REPORTS ════ */}
        {tab === "reports" && (
          <div className="space-y-4">
            {/* New report CTA */}
            <button
              onClick={openModal}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              + Yeni müraciət
            </button>

            {/* Status summary strip */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Gözləyir", count: REPORTS.filter(r => r.status === "pending").length, cls: "bg-amber-50 border-amber-200 text-amber-600" },
                { label: "İcrada", count: REPORTS.filter(r => r.status === "inprogress").length, cls: "bg-blue-50 border-blue-200 text-blue-600" },
                { label: "Həll olundu", count: REPORTS.filter(r => r.status === "resolved").length, cls: "bg-emerald-50 border-emerald-200 text-emerald-600" },
              ].map(s => (
                <div key={s.label} className={`border rounded-xl p-3 text-center ${s.cls}`}>
                  <div className="font-bold text-xl">{s.count}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Report cards */}
            {REPORTS.map(r => {
              const { label, color, Icon: SIcon, bg } = STATUS_CFG[r.status];
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-slate-800 font-semibold">{r.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{r.id} · {r.date}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${bg} ${color}`}>
                      <SIcon className="w-3 h-3" />{label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                    <MapPin className="w-3 h-3" />{r.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600">
                    <Cpu className="w-3 h-3" /> AI → {r.aiRouted}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════ PROPOSALS ════ */}
        {tab === "proposals" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-slate-800 font-semibold">Cəmiyyət Təklifləri</h2>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                <ArrowUpDown className="w-3.5 h-3.5" /> Seçimlərə görə
              </span>
            </div>

            {/* Submit new proposal button */}
            <button
              onClick={() => setShowProposalForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Yeni təklif göndər
            </button>

            {proposals.map((p, i) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* rank + vote */}
                  <div className="flex flex-col items-center gap-2 pt-0.5 flex-shrink-0">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-500" : i === 2 ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"}`}>
                      {i + 1}
                    </span>
                    <button
                      onClick={() => handleVote(p.id)}
                      className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl border transition-all
                        ${p.voted ? "border-blue-300 bg-blue-50 text-blue-600" : "border-slate-200 hover:border-blue-200 text-slate-400 hover:text-blue-500 hover:bg-blue-50"}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-bold">{p.votes}</span>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="text-slate-800 font-semibold flex-1" style={{ lineHeight: 1.3 }}>{p.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${p.tagCls}`}>{p.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-2" style={{ lineHeight: 1.55 }}>{p.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{p.author}</span>
                      <span>·</span>
                      <span>{p.date}</span>
                      {p.voted && <span className="text-blue-500 font-medium">· Dəstəklədiniz ✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════ ALERTS ════ */}
        {tab === "alerts" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-slate-800 font-semibold">Hökumət Elanları</h2>
              <span className="text-xs text-slate-400">{GOV_ALERTS.length} elan</span>
            </div>
            {GOV_ALERTS.map(a => {
              const c = ALERT_CFG[a.type];
              return (
                <div key={a.id} className={`rounded-2xl border ${c.border} ${c.bg} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{c.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${c.text}`}>{a.title}</h4>
                        <span className="text-xs text-slate-400 flex-shrink-0">{a.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2" style={{ lineHeight: 1.6 }}>{a.body}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{a.district}</span>
                        <span>·</span>
                        <span>{a.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════ NEW REPORT MODAL ════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Sticky modal header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-slate-800 font-bold">Yeni Müraciət</h3>
                <p className="text-xs text-slate-400">
                  {reportStep === "choose" && "Kateqoriyalaşdırma üsulunu seçin"}
                  {reportStep === "auto" && "AI avtomatik kateqoriya müəyyən edəcək"}
                  {reportStep === "manual" && "Kateqoriyanı özünüz seçin"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {reportStep !== "choose" && (
                  <button
                    onClick={() => setReportStep("choose")}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl text-xs flex items-center gap-1"
                  >
                    ← Geri
                  </button>
                )}
                <button onClick={resetModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* ── STEP 1: Choose mode ── */}
              {reportStep === "choose" && (
                <div className="py-4 space-y-4">
                  <p className="text-slate-500 text-sm text-center">Müraciətinizi necə kateqoriyalaşdırmaq istəyirsiniz?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Auto */}
                    <button
                      onClick={() => setReportStep("auto")}
                      className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-violet-200 bg-violet-50 hover:border-violet-400 hover:bg-violet-100 text-left transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-800 font-bold">Avto kateqoriyalaşdırma</span>
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">AI</span>
                        </div>
                        <p className="text-slate-500 text-sm">Şəkli yükləyin — AI problemi analiz edib kateqoriyanı və uyğun qurumu avtomatik müəyyən edəcək.</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-violet-400 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Manual */}
                    <button
                      onClick={() => setReportStep("manual")}
                      className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 text-left transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-800 font-bold">Manual kateqoriyalaşdırma</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Özüm seçirəm</span>
                        </div>
                        <p className="text-slate-500 text-sm">Siyahıdan probleminizin növünü özünüz seçin və müraciəti doldurun.</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEPS 2a / 2b: Actual form ── */}
              {(reportStep === "auto" || reportStep === "manual") && (
              <>
              {done ? (
                <div className="flex flex-col items-center py-14 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">Müraciət göndərildi!</h3>
                  <p className="text-slate-500 text-sm">{aiRoute} qurumuna yönləndirildi</p>
                </div>
              ) : (
                <>
                  {/* ── Photo upload ── */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Foto Yüklə</label>
                    {photo ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-700">problem_foto.jpg</p>
                          <p className="text-xs text-emerald-500">2.4 MB · Yükləndi</p>
                        </div>
                        <button onClick={() => { setPhoto(false); setCatId(null); setAiRoute(null); setAiStep(0); }}>
                          <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPhoto(true)}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <ImagePlus className="w-7 h-7 text-slate-300" />
                        <p className="text-sm text-slate-400">Şəkil yükləmək üçün klikləyin</p>
                        <p className="text-xs text-slate-300">PNG, JPG, HEIC · maks 10 MB</p>
                      </button>
                    )}

                    {/* AI detect button — only in auto mode */}
                    {reportStep === "auto" && <button
                      onClick={runAI}
                      disabled={!photo || aiRunning}
                      className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all
                        ${photo && !aiRunning
                          ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent hover:opacity-90 shadow-lg shadow-purple-200"
                          : "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"}`}
                    >
                      {aiRunning
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> AI analiz edir...</>
                        : <><Sparkles className="w-4 h-4" /> AI Təyini — Kateqoriyanı avtomatik seç</>}
                    </button>}

                    {/* AI progress */}
                    {reportStep === "auto" && aiRunning && (
                      <div className="mt-2 bg-violet-50 border border-violet-200 rounded-xl p-3 space-y-1.5">
                        {[
                          { s: 2, label: "Şəkil işlənir..." },
                          { s: 3, label: "Problemin növü müəyyənləşdirilir..." },
                          { s: 4, label: "Uyğun qurum seçilir..." },
                        ].map(({ s, label }) => (
                          <div key={s} className={`flex items-center gap-2 text-xs transition-opacity ${aiStep >= s ? "opacity-100" : "opacity-25"}`}>
                            {aiStep > s
                              ? <CheckCircle className="w-3.5 h-3.5 text-violet-600" />
                              : <div className={`w-3.5 h-3.5 rounded-full border-2 border-violet-400 ${aiStep === s ? "border-t-transparent animate-spin" : ""}`} />}
                            <span className="text-violet-700">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI result banner */}
                    {reportStep === "auto" && aiRoute && !aiRunning && (
                      <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-emerald-700">AI → <strong>{aiRoute}</strong> qurumuna yönləndirildi</span>
                      </div>
                    )}
                  </div>

                  {/* ── Category grid ── */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Kateqoriya Seçin</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => pickCategory(cat.id, cat.aiRoute)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all
                              ${catId === cat.id ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.grad} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-700 text-xs font-medium">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Description ── */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Problemin Təsviri</label>
                    <textarea
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      placeholder="Problemi ətraflı izah edin — yer, vaxt, davam müddəti..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  {/* ── Map picker ── */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Yer Seçin (Xəritə)</label>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ height: 165 }}>
                      <svg
                        className="w-full h-full cursor-crosshair"
                        viewBox="0 0 420 165"
                        onClick={e => {
                          const r = e.currentTarget.getBoundingClientRect();
                          const scaleX = 420 / r.width;
                          const scaleY = 165 / r.height;
                          setPin({ x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY });
                        }}
                        style={{ background: "linear-gradient(135deg,#e8f5e9 0%,#e3f2fd 60%,#fce4ec 100%)" }}
                      >
                        {[52,104,156,208,260,312,368].map(x => <line key={x} x1={x} y1="0" x2={x} y2="165" stroke="#cbd5e1" strokeWidth="0.5" />)}
                        {[33,66,99,132].map(y => <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#cbd5e1" strokeWidth="0.5" />)}
                        <line x1="0" y1="82" x2="420" y2="82" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="210" y1="0" x2="210" y2="165" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="45" y="30" width="72" height="38" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
                        <rect x="135" y="18" width="58" height="50" rx="4" fill="#bbf7d0" stroke="#86efac" strokeWidth="1" />
                        <rect x="228" y="28" width="78" height="40" rx="4" fill="#fde68a" stroke="#fbbf24" strokeWidth="1" />
                        <rect x="48" y="102" width="88" height="44" rx="4" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="1" />
                        <rect x="300" y="90" width="70" height="52" rx="4" fill="#fecaca" stroke="#fca5a5" strokeWidth="1" />
                        <ellipse cx="348" cy="44" rx="30" ry="20" fill="#bbf7d0" opacity="0.7" />
                        <text x="348" y="47" textAnchor="middle" fill="#16a34a" fontSize="8" fontFamily="sans-serif">Park</text>
                        <text x="210" y="11" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">Nərimanov rayonu</text>
                        {pin && (
                          <>
                            <circle cx={pin.x} cy={pin.y} r="14" fill="#3b82f6" opacity="0.15" />
                            <circle cx={pin.x} cy={pin.y} r="6" fill="#2563eb" stroke="white" strokeWidth="2.5" />
                            <circle cx={pin.x} cy={pin.y} r="2" fill="white" />
                          </>
                        )}
                      </svg>
                      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-xs text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {pin ? "Yer seçildi ✓" : "Xəritəyə klikləyin..."}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={submitForm}
                    disabled={!catId || desc.length < 5}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                  >
                    <Send className="w-4 h-4" />
                    Müraciəti Göndər
                  </button>
                </>
              )}
              </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════ NEW PROPOSAL MODAL ════ */}
      {showProposalForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProposalForm(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-slate-800 font-bold">Yeni Təklif Göndər</h3>
                <p className="text-xs text-slate-400">Şəhər üçün öz ideyanızı paylaşın</p>
              </div>
              <button onClick={() => { setShowProposalForm(false); setProposalDone(false); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {proposalDone ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-slate-800 font-bold mb-1">Təklifiniz göndərildi!</h3>
                  <p className="text-slate-500 text-sm">Digər vətəndaşlar onu dəstəkləyə bilər</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Təklif başlığı</label>
                    <input
                      value={proposalTitle}
                      onChange={e => setProposalTitle(e.target.value)}
                      placeholder="Məsələn: Parka velo yolu çəkilsin..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Ətraflı açıqlama</label>
                    <textarea
                      value={proposalDesc}
                      onChange={e => setProposalDesc(e.target.value)}
                      placeholder="Niyə bu vacibdir? Kimə fayda verər? Necə həyata keçirilə bilər?"
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Kateqoriya</label>
                    <div className="flex flex-wrap gap-2">
                      {["Nəqliyyat", "Təhlükəsizlik", "Texnologiya", "Sosial", "Ailə", "Ümumi"].map(t => (
                        <button
                          key={t}
                          onClick={() => setProposalTag(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${proposalTag === t ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={submitProposal}
                    disabled={!proposalTitle || proposalDesc.length < 10}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium text-sm disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                  >
                    <Send className="w-4 h-4" />
                    Təklifi Göndər
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
