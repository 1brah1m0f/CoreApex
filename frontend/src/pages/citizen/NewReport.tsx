import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { reportsApi } from '../../api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Breadcrumb from '../../components/ui/Breadcrumb'

const categories = ['Yollar', 'Su kəməri', 'Elektrik', 'Abadlıq', 'Zibil', 'Digər']

export default function NewReport() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', address: '', neighborhood: '', category: '', photo_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [classifying, setClassifying] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Başlıq tələb olunur'
    if (!form.description.trim()) e.description = 'Təsvir tələb olunur'
    if (!form.address.trim()) e.address = 'Ünvan tələb olunur'
    if (!form.category) e.category = 'Kateqoriya seçin'
    return e
  }

  async function handleAiClassify() {
    if (!form.photo_url.trim()) { toast.error('Foto URL daxil edin'); return }
    setClassifying(true)
    try {
      const res = await reportsApi.aiClassify(form.photo_url) as { category?: string; title?: string }
      if (res.category) set('category', res.category)
      if (res.title) set('title', res.title)
      toast.success('AI kateqoriya müəyyən etdi')
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setClassifying(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await reportsApi.create(form)
      toast.success('Müraciət göndərildi')
      navigate('/citizen/reports')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: 'Ana səhifə', to: '/citizen/dashboard' },
        { label: 'Müraciətlərim', to: '/citizen/reports' },
        { label: 'Yeni müraciət' },
      ]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-6">Yeni müraciət</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 flex flex-col gap-5">
        <Input
          label="Başlıq"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          error={errors.title}
          placeholder="Problemin qısa təsviri"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ətraflı təsvir</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors
              focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none
              ${errors.description ? 'border-danger' : 'border-border'}`}
            placeholder="Problemi ətraflı izah edin..."
          />
          {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ünvan"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            error={errors.address}
            placeholder="Küçə, bina nömrəsi"
          />
          <Input
            label="Rayon / Məhəllə"
            value={form.neighborhood}
            onChange={e => set('neighborhood', e.target.value)}
            placeholder="Məs. Nəsimi"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors
              focus:border-primary focus:ring-2 focus:ring-primary/20
              ${errors.category ? 'border-danger' : 'border-border'}`}
          >
            <option value="">Seçin...</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-danger">{errors.category}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Foto URL (isteğe bağlı)</label>
          <div className="flex gap-2">
            <Input
              value={form.photo_url}
              onChange={e => set('photo_url', e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAiClassify}
              loading={classifying}
            >
              <Wand2 size={15} /> AI
            </Button>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/citizen/reports')}>
            Ləğv et
          </Button>
          <Button type="submit" loading={submitting}>
            Göndər
          </Button>
        </div>
      </form>
    </div>
  )
}
