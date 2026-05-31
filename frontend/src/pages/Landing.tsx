import { useNavigate } from 'react-router-dom';
import {
  User,
  HardHat,
  Briefcase,
  ChevronRight,
  Users,
  Monitor,
  Code2,
  Activity,
  ArrowRight
} from 'lucide-react';
import AccessibilityPanel from '../components/AccessibilityPanel';

const roles = [
  {
    path: '/citizen',
    icon: User,
    title: 'Vətəndaş',
    desc: 'Müraciət göndər, təkliflər ver, bildirişləri izlə',
    color: 'hover:border-primary text-primary',
    iconBg: 'bg-blue-50',
  },
  {
    path: '/inspector',
    icon: HardHat,
    title: 'İnspektor',
    desc: 'Tapşırıqları icra et, hesabat yüklə, simulyasiya aç',
    color: 'hover:border-success text-success',
    iconBg: 'bg-emerald-50',
  },
  {
    path: '/executive',
    icon: Briefcase,
    title: 'İcraçı',
    desc: 'Analitika izlə, müraciətlərə nəzarət et, bildiriş göndər',
    color: 'hover:border-executive text-executive',
    iconBg: 'bg-purple-50',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col font-body relative">
      <AccessibilityPanel />
      
      {/* STICKY NAV BAR */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">
              NS
            </div>
            <span className="font-heading font-bold text-lg text-primary">Nərimanov SmartOps</span>
          </div>
          <nav aria-label="Əsas naviqasiya">
            <button
              onClick={() => navigate('/auth')}
              className="rounded-lg bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              aria-label="Sistemə daxil ol"
            >
              Daxil ol
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10" aria-label="Əsas məzmun">
        
        {/* BÖLMƏ 1 — HERO + FEATURE GRID & PORTAL SELECTOR */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden rounded-[36px] border border-border bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#1A3C6E_1px,transparent_1px)] [background-size:18px_18px]" aria-hidden="true" />
          <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="absolute top-8 right-10 hidden lg:block" aria-hidden="true">
            <div className="rounded-2xl border border-blue-100 bg-white/70 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              Yeni nəsil şəhər idarəetməsi
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10 p-8 md:p-12">
            {/* Left Column - Hero */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary border border-blue-100 shadow-sm" aria-hidden="true">
                Nərimanov Rayonu · Bakı
              </div>
              <h1 id="hero-heading" className="font-heading text-4xl md:text-5xl font-bold text-primary mt-4 leading-tight">
                Nərimanov SmartOps
              </h1>
              <p className="text-gray-600 text-base md:text-lg mt-3 leading-relaxed">
                Müraciət, tapşırıq, analitika və xəbərdarlıq axınlarını birləşdirən vahid idarəetmə mühiti.
                Şəhər xidmətləri real vaxt rejimində koordinasiya olunur.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/auth')}
                  className="rounded-xl bg-primary px-5 py-2.5 text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  aria-label="Vətəndaş portalına daxil ol"
                >
                  Vətəndaş portalına daxil ol
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary border border-border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  aria-label="İcraçı panelinə daxil ol"
                >
                  İcraçı paneli
                </button>
              </div>

              {/* KPI Pills */}
              <div className="mt-6 grid grid-cols-3 gap-3" aria-label="Əsas göstəricilər">
                <div className="rounded-2xl bg-white/90 border border-border p-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-primary" aria-hidden="true">24/7</p>
                  <p className="text-xs text-muted">Monitorinq</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-border p-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-primary" aria-hidden="true">+32%</p>
                  <p className="text-xs text-muted">SLA uyğunluq</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-border p-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-primary" aria-hidden="true">15</p>
                  <p className="text-xs text-muted">Qurum</p>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Əsas funksionallıqlar">
                {[
                  { label: 'AI Təsnifat', desc: 'Müraciətləri avtomatik yönləndirir' },
                  { label: 'Marşrut Xəritəsi', desc: 'Müfəttiş üçün optimal xətt' },
                  { label: 'Rəqəmsal Arxiv', desc: 'İzləmə, filtr və CSV ixrac' },
                  { label: 'Simulyasiya', desc: 'Risk qiyməti və təsir analizi' },
                ].map((f, i) => (
                  <div key={i} className="relative rounded-2xl bg-white p-4 border border-border shadow-sm overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />
                    <p className="font-semibold text-gray-900 text-sm">{f.label}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Portal Selector */}
            <div className="bg-white rounded-3xl border border-border shadow-card p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted" aria-hidden="true">Giriş</p>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">Portal seçin</h2>
                  <p className="text-sm text-muted mt-1">Rolunuza uyğun panelə keçid edin</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-primary font-bold" aria-hidden="true">
                  NS
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3" role="group" aria-label="Portal seçimi">
                {roles.map(({ path, icon: Icon, title, desc, color, iconBg }) => (
                  <button
                    key={path}
                    onClick={() => navigate('/auth')}
                    className={`rounded-2xl bg-bg p-4 border border-transparent transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${color.split(' ')[0]}`}
                    aria-label={`${title} portalına daxil ol`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-3 shadow-sm border border-border ${iconBg}`} aria-hidden="true">
                        <Icon size={20} className={color.split(' ')[1]} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-muted mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-5">
                <div className="rounded-2xl bg-gradient-to-r from-primary to-[#2557A7] text-white p-4 shadow-sm" aria-hidden="true">
                  <p className="text-sm font-semibold">Yüksək prioritetlər üçün sürətli giriş</p>
                  <p className="text-xs text-blue-100 mt-1">
                    Müraciət statusu, tapşırıq axını və bildirişlər real vaxtda görünür.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BÖLMƏ 2 — İŞ AXINI (Workflow Steps) */}
        <section aria-labelledby="workflow-heading" className="bg-white rounded-3xl border border-border shadow-sm p-6">
          <h3 id="workflow-heading" className="font-heading text-xl font-bold text-gray-900">İş Axını</h3>
          <p className="text-sm text-muted mt-1">Müraciətdən nəticəyə qədər şəffaf proses</p>
          <div className="mt-6 flex flex-col md:flex-row items-center gap-4" aria-label="Əməliyyat mərhələləri">
            {[
              { t: 'Qəbul', d: 'Müraciət və ya sorğu daxil olur' },
              { t: 'İcra', d: 'Tapşırıq quruma yönləndirilir' },
              { t: 'Nəticə', d: 'SLA və hesabat tamamlanır' },
            ].map((s, i, arr) => (
              <div key={s.t} className="flex-1 flex flex-col md:flex-row items-center w-full">
                <div className="rounded-2xl border border-border bg-bg p-5 flex-1 w-full relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm" aria-hidden="true">
                    {i + 1}
                  </div>
                  <p className="mt-3 font-semibold text-gray-900">{s.t}</p>
                  <p className="text-xs text-muted mt-1">{s.d}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="my-3 md:my-0 md:mx-4 flex justify-center items-center" aria-hidden="true">
                    <ArrowRight className="text-gray-300 transform rotate-90 md:rotate-0" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BÖLMƏ 3 — CANLI VƏZİYYƏT PANELİ + XİDMƏT SƏTİRLƏRİ */}
        <section aria-label="Statistik panellər" className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-gray-900">Canlı Vəziyyət Paneli</h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-success bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full" aria-label="Sistem aktivdir">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
                Aktiv
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 flex-1" aria-label="Canlı statistika">
              {[
                { k: 'Açıq sorğu', v: '48' },
                { k: 'İcrada', v: '19' },
                { k: 'Gecikən', v: '6' },
                { k: 'Yeni bildiriş', v: '3' },
              ].map(i => (
                <div key={i.k} className="rounded-2xl bg-bg border border-border p-4 flex flex-col justify-center">
                  <p className="text-xs text-muted font-medium">{i.k}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{i.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="SLA uyğunluğu 86 faizdir">
              <div className="flex items-center justify-between text-xs text-muted" aria-hidden="true">
                <span>Ümumi SLA uyğunluğu</span>
                <span className="font-semibold text-primary text-sm">86%</span>
              </div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-bg overflow-hidden" aria-hidden="true">
                <div className="h-full rounded-full bg-primary" style={{ width: '86%' }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-gray-900">Xidmət Sətirləri</h3>
            <p className="text-sm text-muted mt-1">Prioritet xidmətlər üzrə sürətli nəzarət</p>
            <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Sahələr üzrə tapşırıqlar">
              {[
                { t: 'Elektrik', c: 'bg-amber-50 border-amber-200 text-amber-700', v: '12' },
                { t: 'Su', c: 'bg-blue-50 border-blue-200 text-blue-700', v: '9' },
                { t: 'Yol', c: 'bg-orange-50 border-orange-200 text-orange-700', v: '7' },
                { t: 'Sanitariya', c: 'bg-emerald-50 border-emerald-200 text-emerald-700', v: '5' },
              ].map(s => (
                <div key={s.t} className={`rounded-2xl border p-4 ${s.c}`}>
                  <p className="text-xs font-semibold">{s.t}</p>
                  <p className="text-xl font-bold mt-1">{s.v} <span className="text-xs font-normal opacity-80" aria-hidden="true">tapşırıq</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BÖLMƏ 4 — PLATFORM MİQYASI */}
        <section aria-labelledby="scale-heading" className="rounded-3xl border border-border bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 shadow-sm">
          <div className="mb-4">
            <h3 id="scale-heading" className="font-heading text-xl font-bold text-gray-900">Platform Miqyası</h3>
            <p className="text-sm text-muted mt-1">Vahid mərkəzdən idarəetmə göstəriciləri</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Platformanın göstəriciləri">
            {[
              { k: '3', v: 'Rol-əsaslı portal', i: Users },
              { k: '14', v: 'Unikal ekran', i: Monitor },
              { k: '27', v: 'API endpoint', i: Code2 },
              { k: '24/7', v: 'Canlı monitorinq', i: Activity },
            ].map(item => (
              <div key={item.k} className="rounded-2xl bg-white border border-border p-4 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-bg flex items-center justify-center flex-shrink-0 text-primary" aria-hidden="true">
                  <item.i size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{item.k}</p>
                  <p className="text-xs text-muted font-medium mt-0.5">{item.v}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BÖLMƏ 5 — SON AKTİVLİK */}
        <section aria-labelledby="activity-heading" className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 id="activity-heading" className="font-heading text-xl font-bold text-gray-900">Son Aktivlik</h3>
              <p className="text-sm text-muted mt-1">Qurumlararası əməliyyat axını</p>
            </div>
            <button 
              className="text-xs font-semibold text-primary border border-border rounded-full px-4 py-2 hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center gap-1"
              aria-label="Bütün son aktivliklərə bax"
            >
              Hamısına bax
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Son qurumlararası sorğular">
            {[
              { from: 'Azərqaz', to: 'Yollar', d: 'Qazıntı sonrası bərpa sorğusu', s: '14 gün', c: 'bg-amber-50 border-amber-200 text-amber-700' },
              { from: 'Azərsu', to: 'Abadlıq', d: 'Yaşıllıq bərpası tamamlanır', s: 'İcrada', c: 'bg-blue-50 border-blue-200 text-blue-700' },
              { from: 'Azərişıq', to: 'Yollar', d: 'Kabel xətti sonrası asfalt', s: 'Gecikib', c: 'bg-red-50 border-red-200 text-red-700' },
            ].map((a, i) => (
              <div key={i} className="rounded-2xl border border-border p-4 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-bg w-fit px-2 py-1 rounded-md mb-3" aria-hidden="true">
                  <span>{a.from}</span>
                  <ArrowRight size={12} className="text-gray-400" />
                  <span>{a.to}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-1">
                  <span className="sr-only">{a.from} qurumundan {a.to} qurumuna sorğu: </span>
                  {a.d}
                </p>
                <div className="mt-4">
                  <span className={`inline-flex text-xs font-semibold rounded-full px-3 py-1 border ${a.c}`} aria-label={`Status: ${a.s}`}>
                    {a.s}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BÖLMƏ 6 — FOOTER */}
      <footer className="bg-primary text-white/60 py-8 mt-auto border-t border-primary-hover" aria-label="Səhifə sonu">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2026 Nərimanov SmartOps · Nərimanov Rayon İcra Hakimiyyəti · v1.0</p>
        </div>
      </footer>
    </div>
  );
}
