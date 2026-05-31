import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, Loader2, Sparkles, X, LocateFixed, Camera, Images } from 'lucide-react'

const DEMO_LOCATION = { lat: 40.40649797518252, lng: 49.84804894424138 }
import { toast } from 'sonner'
import { reportsApi } from '../../api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Breadcrumb from '../../components/ui/Breadcrumb'
import LocationPickerMap from '../../components/LocationPickerMap'

const categories = ['Yollar', 'Su kəməri', 'Elektrik', 'Abadlıq', 'Zibil', 'Digər']

interface AiResult {
  category?: string
  title?: string
  description?: string
  assigned_agency?: string
  photo_url?: string
}

export default function NewReport() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [showSourcePicker, setShowSourcePicker] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', category: '', photo_url: '',
    lat: null as number | null, lng: null as number | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [classifying, setClassifying] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [aiFields, setAiFields] = useState<Set<string>>(new Set())
  const [assignedAgency, setAssignedAgency] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationCaptured, setLocationCaptured] = useState(false)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
    // If user edits an AI-filled field, remove the AI badge
    setAiFields(prev => { const next = new Set(prev); next.delete(field); return next })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Başlıq tələb olunur'
    if (!form.description.trim()) e.description = 'Təsvir tələb olunur'
    if (!form.category) e.category = 'Kateqoriya seçin'
    return e
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setClassifying(true)

    try {
      const res = await reportsApi.classifyUpload(file) as AiResult
      const filled = new Set<string>()

      setForm(f => {
        const next = { ...f }
        if (res.category) { next.category = res.category; filled.add('category') }
        if (res.title) { next.title = res.title; filled.add('title') }
        if (res.description) { next.description = res.description; filled.add('description') }
        if (res.photo_url) { next.photo_url = res.photo_url }
        return next
      })
      if (res.assigned_agency) setAssignedAgency(res.assigned_agency)
      setAiFields(filled)

      toast.success('AI sahələri avtomatik doldurdu')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'AI analizi uğursuz oldu')
    } finally {
      setClassifying(false)
    }
  }

  function handleGps() {
    setLocating(true)
    setTimeout(() => {
      setForm(f => ({ ...f, lat: DEMO_LOCATION.lat, lng: DEMO_LOCATION.lng }))
      setLocationCaptured(true)
      setLocating(false)
      toast.success('Lokasiya tapıldı')
    }, 600)
  }

  function removePhoto() {
    setPreview(null)
    setForm(f => ({ ...f, photo_url: '' }))
    if (fileRef.current) fileRef.current.value = ''
    setAiFields(new Set())
    setAssignedAgency(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await reportsApi.create({ ...form, assigned_agency: assignedAgency })
      toast.success('Müraciət göndərildi')
      navigate('/citizen')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: 'Ana səhifə', to: '/citizen' },
        { label: 'Müraciətlərim', to: '/citizen' },
        { label: 'Yeni müraciət' },
      ]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-6">Yeni müraciət</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 flex flex-col gap-5">

        {/* Image upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Foto</label>
          {preview ? (
            <div className="relative w-full rounded-lg overflow-hidden border border-border">
              <img src={preview} alt="preview" className="w-full max-h-56 object-cover" />
              {classifying && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 text-white text-sm">
                  <Loader2 size={24} className="animate-spin" />
                  AI analiz edir...
                </div>
              )}
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 hover:bg-white transition-colors"
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSourcePicker(true)}
                className="flex flex-col items-center justify-center gap-2 w-full h-36 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-gray-400 hover:text-primary"
              >
                <ImagePlus size={28} />
                <span className="text-sm">Şəkil seçin — AI avtomatik dolduracaq</span>
              </button>

              {showSourcePicker && (
                <>
                  <div className="absolute inset-0 z-10" onClick={() => setShowSourcePicker(false)} />
                  <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white rounded-xl border border-border shadow-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => { setShowSourcePicker(false); cameraRef.current?.click() }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Camera size={18} className="text-primary" />
                      Kamera ilə çək
                    </button>
                    <div className="border-t border-border" />
                    <button
                      type="button"
                      onClick={() => { setShowSourcePicker(false); galleryRef.current?.click() }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Images size={18} className="text-primary" />
                      Qaleriyadan seç
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Camera input */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Gallery input */}
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Fallback (köhnə ref-ə uyğunluq üçün) */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Kateqoriya</label>
            {aiFields.has('category') && <AiBadge />}
          </div>
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
          {assignedAgency && form.category && (
            <p className="text-xs text-gray-500">Cavabdeh qurum: <span className="font-medium">{assignedAgency}</span></p>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Başlıq</label>
            {aiFields.has('title') && <AiBadge />}
          </div>
          <Input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            error={errors.title}
            placeholder="Problemin qısa başlığı"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ətraflı təsvir</label>
            {aiFields.has('description') && <AiBadge />}
          </div>
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


        {/* Location */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleGps}
              disabled={locating}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors
                ${locationCaptured
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-border bg-white text-gray-700 hover:border-primary hover:text-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {locating ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
              {locating ? 'Axtarılır...' : locationCaptured ? 'Lokasiya tapıldı' : 'GPS ilə yer al'}
            </button>
          </div>
          <LocationPickerMap
            value={locationCaptured && form.lat != null && form.lng != null ? { lat: form.lat, lng: form.lng } : null}
            onChange={pos => {
              if (!pos) { setForm(f => ({ ...f, lat: null, lng: null })); setLocationCaptured(false); return }
              setForm(f => ({ ...f, lat: pos.lat, lng: pos.lng }))
              setLocationCaptured(true)
            }}
            showLabel={false}
            height={260}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/citizen')}>
            Ləğv et
          </Button>
          <Button type="submit" loading={submitting} disabled={classifying}>
            Göndər
          </Button>
        </div>
      </form>
    </div>
  )
}

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
      <Sparkles size={10} />
      AI
    </span>
  )
}
