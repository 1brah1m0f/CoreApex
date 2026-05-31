import { useNavigate } from 'react-router-dom'
import { User, HardHat, Briefcase } from 'lucide-react'

const roles = [
  {
    role: 'citizen',
    icon: User,
    title: 'Vətəndaş',
    desc: 'Müraciət göndər, təkliflər ver, bildirişləri izlə',
    color: 'hover:border-primary',
  },
  {
    role: 'inspector',
    icon: HardHat,
    title: 'İnspektor',
    desc: 'Tapşırıqları icra et, hesabat yüklə, simulyasiya aç',
    color: 'hover:border-accent',
  },
  {
    role: 'executive',
    icon: Briefcase,
    title: 'İcraçı',
    desc: 'Analitika izlə, müraciətlərə nəzarət et, bildiriş göndər',
    color: 'hover:border-success',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F4F6FA] px-4">
      <div className="max-w-6xl mx-auto pt-12 pb-12">
        <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-50">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#1A3C6E_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
          <div className="absolute top-8 right-10 hidden lg:block">
            <div className="rounded-2xl border border-blue-100 bg-white/70 px-3 py-1 text-xs font-semibold text-primary">
              Yeni nəsil şəhər idarəetməsi
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10 p-8 md:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary border border-blue-100">
                Nərimanov Rayonu · Baku
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mt-4 leading-tight">
                Nərimanov SmartOps
              </h1>
              <p className="text-gray-600 text-base md:text-lg mt-3 leading-relaxed">
                Müraciət, tapşırıq, analitika və xəbərdarlıq axınlarını birləşdirən vahid idarəetmə mühiti.
                Şəhər xidmətləri real vaxt rejimində koordinasiya olunur.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/auth?role=citizen')}
                  className="rounded-xl bg-primary px-5 py-2.5 text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700"
                >
                  Vətəndaş portalına daxil ol
                </button>
                <button
                  onClick={() => navigate('/auth?role=executive')}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary border border-blue-100 hover:bg-blue-50"
                >
                  İcraçı paneli
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/90 border border-gray-100 p-3 text-center">
                  <p className="text-xl font-bold text-primary">24/7</p>
                  <p className="text-xs text-gray-500">Monitorinq</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-gray-100 p-3 text-center">
                  <p className="text-xl font-bold text-primary">+32%</p>
                  <p className="text-xs text-gray-500">SLA uyğunluq</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-gray-100 p-3 text-center">
                  <p className="text-xl font-bold text-primary">15</p>
                  <p className="text-xs text-gray-500">Qurum</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'AI Təsnifat', desc: 'Müraciətləri avtomatik yönləndirir' },
                  { label: 'Marşrut Xəritəsi', desc: 'Müfəttiş üçün optimal xətt' },
                  { label: 'Rəqəmsal Arxiv', desc: 'İzləmə, filtr və CSV ixrac' },
                  { label: 'Simulyasiya', desc: 'Risk qiyməti və təsir analizi' },
                ].map((f, i) => (
                  <div key={i} className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
                    <p className="font-semibold text-gray-900 text-sm">{f.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Giriş</p>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">Portal seçin</h2>
                  <p className="text-sm text-gray-500 mt-1">Rolunuza uyğun panelə keçid edin</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-primary font-bold">
                  NS
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {roles.map(({ role, icon: Icon, title, desc, color }) => (
                  <button
                    key={role}
                    onClick={() => navigate(`/auth?role=${role}`)}
                    className={`rounded-2xl bg-[#F7F8FC] p-4 border border-transparent transition-all
                      hover:bg-white hover:border-blue-100 hover:shadow-md ${color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm border border-gray-100">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white p-4">
                <p className="text-sm font-semibold">Yüksək prioritetlər üçün sürətli giriş</p>
                <p className="text-xs text-blue-100 mt-1">
                  Müraciət statusu, tapşırıq axını və bildirişlər real vaxtda görünür.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-heading text-xl font-bold text-gray-900">İş Axını</h3>
            <p className="text-sm text-gray-500 mt-1">Müraciətdən nəticəyə qədər şəffaf proses</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { t: 'Qəbul', d: 'Müraciət və ya sorğu daxil olur' },
                { t: 'İcra', d: 'Tapşırıq quruma yönləndirilir' },
                { t: 'Nəticə', d: 'SLA və hesabat tamamlanır' },
              ].map((s, i) => (
                <div key={s.t} className="rounded-2xl border border-gray-100 bg-[#F7F8FC] p-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <p className="mt-3 font-semibold text-gray-900">{s.t}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6">
            <h3 className="font-heading text-xl font-bold text-gray-900">Şəhər Xidmətləri Bir Ekranda</h3>
            <p className="text-sm text-gray-600 mt-1">
              Qurumlararası koordinasiya, icra vəziyyəti və risk göstəriciləri vahid paneldə.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['SLA izləmə', 'Kritik xəbərdarlıq', 'Qurum KPI', 'Arxiv ixracı'].map(tag => (
                <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#1A3C6E', '#2563EB', '#7C3AED'].map(c => (
                  <span key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs text-gray-500">3 əsas portal, 1 koordinasiya mərkəzi</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-gray-900">Canlı Vəziyyət Paneli</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                Aktiv
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { k: 'Açıq sorğu', v: '48' },
                { k: 'İcrada', v: '19' },
                { k: 'Gecikən', v: '6' },
                { k: 'Yeni bildiriş', v: '3' },
              ].map(i => (
                <div key={i.k} className="rounded-2xl bg-[#F7F8FC] border border-gray-100 p-3">
                  <p className="text-xs text-gray-400">{i.k}</p>
                  <p className="text-lg font-bold text-gray-900">{i.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Ümumi SLA uyğunluğu</span>
                <span className="font-semibold text-blue-700">86%</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100">
                <div className="h-2.5 rounded-full bg-blue-600" style={{ width: '86%' }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-gray-900">Xidmət Sətirləri</h3>
            <p className="text-sm text-gray-500 mt-1">Prioritet xidmətlər üzrə sürətli nəzarət</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { t: 'Elektrik', c: 'bg-amber-50 border-amber-200 text-amber-700', v: '12' },
                { t: 'Su', c: 'bg-blue-50 border-blue-200 text-blue-700', v: '9' },
                { t: 'Yol', c: 'bg-orange-50 border-orange-200 text-orange-700', v: '7' },
                { t: 'Sanitariya', c: 'bg-emerald-50 border-emerald-200 text-emerald-700', v: '5' },
              ].map(s => (
                <div key={s.t} className={`rounded-2xl border p-4 ${s.c}`}>
                  <p className="text-xs font-semibold">{s.t}</p>
                  <p className="text-lg font-bold mt-1">{s.v} tapşırıq</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">Son Aktivlik</h3>
              <p className="text-sm text-gray-500 mt-1">Qurumlararası əməliyyat axını</p>
            </div>
            <button className="text-xs font-semibold text-primary border border-blue-100 rounded-full px-3 py-1 hover:bg-blue-50">
              Hamısına bax
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: 'Azərqaz → Yollar', d: 'Qazıntı sonrası bərpa sorğusu', s: '14 gün', c: 'bg-amber-50 border-amber-200 text-amber-700' },
              { t: 'Azərsu → Abadlıq', d: 'Yaşıllıq bərpası tamamlanır', s: 'İcrada', c: 'bg-blue-50 border-blue-200 text-blue-700' },
              { t: 'Azərişıq → Yollar', d: 'Kabel xətti sonrası asfalt', s: 'Gecikib', c: 'bg-red-50 border-red-200 text-red-700' },
            ].map((a, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400">{a.t}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{a.d}</p>
                <span className={`inline-flex mt-3 text-xs font-semibold rounded-full px-2.5 py-1 ${a.c}`}>
                  {a.s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
