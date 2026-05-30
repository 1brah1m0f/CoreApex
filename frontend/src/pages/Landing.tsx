import { useNavigate } from 'react-router-dom'
import { User, HardHat, Briefcase } from 'lucide-react'

const roles = [
  {
    path: '/citizen',
    icon: User,
    title: 'Vətəndaş',
    desc: 'Müraciət göndər, təkliflər ver, bildirişləri izlə',
    color: 'hover:border-primary',
  },
  {
    path: '/inspector',
    icon: HardHat,
    title: 'İnspektor',
    desc: 'Tapşırıqları icra et, hesabat yüklə, simulyasiya aç',
    color: 'hover:border-accent',
  },
  {
    path: '/executive',
    icon: Briefcase,
    title: 'İcraçı',
    desc: 'Analitika izlə, müraciətlərə nəzarət et, bildiriş göndər',
    color: 'hover:border-success',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-primary mb-3">ApexCore</h1>
        <p className="text-muted text-lg">Ağıllı Şəhər İdarəetmə Platforması</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {roles.map(({ path, icon: Icon, title, desc, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`rounded-2xl bg-white p-8 shadow-card border-2 border-transparent
              transition-all hover:shadow-lg ${color} flex flex-col items-center gap-4 text-center`}
          >
            <div className="rounded-full bg-blue-50 p-4">
              <Icon size={28} className="text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-gray-900 text-lg">{title}</p>
              <p className="text-sm text-muted mt-1">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
