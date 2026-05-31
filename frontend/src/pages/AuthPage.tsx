import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type AuthMode = 'login' | 'register'

interface LoginResponse {
  access_token: string
  role: 'citizen' | 'inspector' | 'executive'
  user: { id: string; name: string; email: string }
}

const ROLE_PATHS: Record<string, string> = {
  citizen: '/citizen',
  inspector: '/inspector',
  executive: '/executive',
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<AuthMode>((searchParams.get('mode') as AuthMode) ?? 'login')

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (mode === 'register' && !form.name.trim()) e.name = 'Ad tələb olunur'
    if (!form.email.trim()) e.email = 'Email tələb olunur'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email düzgün deyil'
    if (!form.password) e.password = 'Şifrə tələb olunur'
    else if (form.password.length < 6) e.password = 'Şifrə ən az 6 simvol'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      let res: unknown
      if (mode === 'register') {
        res = await authApi.register(form.name.trim(), form.email.trim(), form.password)
      } else {
        res = await authApi.login(form.email.trim(), form.password)
      }

      const { access_token, role, user } = res as LoginResponse
      localStorage.setItem('apexcore_token', access_token)
      localStorage.setItem('apexcore_role', role)
      localStorage.setItem('apexcore_user', JSON.stringify(user))

      toast.success(mode === 'register' ? 'Qeydiyyat tamamlandı' : 'Xoş gəldiniz!')
      navigate(ROLE_PATHS[role] ?? '/citizen')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next: AuthMode) {
    setMode(next)
    setForm({ name: '', email: '', password: '' })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white text-xl font-bold mb-3 shadow-lg shadow-blue-200">
            NS
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Nərimanov SmartOps</h1>
          <p className="text-sm text-gray-500 mt-1">Şəhər idarəetmə platforması</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all
                  ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {m === 'login' ? 'Giriş' : 'Qeydiyyat'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Ad Soyad"
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                error={errors.name}
                placeholder="Əli Məmmədov"
                autoComplete="name"
              />
            )}

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              error={errors.email}
              placeholder="example@mail.com"
              autoComplete="email"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Şifrə</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder={mode === 'register' ? 'Ən az 6 simvol' : '••••••••'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition-colors
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    ${errors.password ? 'border-danger' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center mt-1"
              size="lg"
            >
              {mode === 'login' ? 'Daxil ol' : 'Qeydiyyatdan keç'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? 'Hesabınız yoxdur?' : 'Hesabınız var?'}{' '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-primary font-semibold hover:underline"
            >
              {mode === 'login' ? 'Qeydiyyat' : 'Daxil ol'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <button onClick={() => navigate('/')} className="hover:text-gray-600 hover:underline">
            Ana səhifəyə qayıt
          </button>
        </p>
      </div>
    </div>
  )
}
