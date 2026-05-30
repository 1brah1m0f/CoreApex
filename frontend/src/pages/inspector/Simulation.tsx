import { useState } from 'react'
import { toast } from 'sonner'
import { Play, AlertTriangle } from 'lucide-react'
import { simulationApi } from '../../api'
import { SimLayer } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Breadcrumb from '../../components/ui/Breadcrumb'

const riskColors = {
  low: 'bg-green-50 border-green-200 text-green-800',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  high: 'bg-red-50 border-red-200 text-red-800',
}

export default function Simulation() {
  const [lat, setLat] = useState('40.4093')
  const [lng, setLng] = useState('49.8671')
  const [layers, setLayers] = useState<SimLayer[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<unknown>(null)

  async function fetchLayers() {
    setLoadingLayers(true)
    try {
      const res = await simulationApi.layers(parseFloat(lat), parseFloat(lng)) as { layers: SimLayer[] }
      setLayers(res.layers ?? [])
      setSelected([])
      setResult(null)
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setLoadingLayers(false)
    }
  }

  function toggleLayer(key: string) {
    setSelected(s => s.includes(key) ? s.filter(k => k !== key) : [...s, key])
  }

  async function runSim() {
    if (!selected.length) { toast.error('Ən azı bir qat seçin'); return }
    setRunning(true)
    try {
      const res = await simulationApi.run('', selected, parseFloat(lat), parseFloat(lng))
      setResult(res)
      toast.success('Simulyasiya tamamlandı')
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Ana səhifə', to: '/inspector/dashboard' }, { label: 'Simulyasiya' }]} />
      <h1 className="font-heading text-2xl font-bold text-primary mt-4 mb-6">Risk Simulyasiyası</h1>

      <div className="bg-white rounded-xl shadow-card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Koordinatlar</h2>
        <div className="flex gap-4 items-end">
          <Input label="Enlik (lat)" value={lat} onChange={e => setLat(e.target.value)} className="w-40" />
          <Input label="Uzunluq (lng)" value={lng} onChange={e => setLng(e.target.value)} className="w-40" />
          <Button onClick={fetchLayers} loading={loadingLayers} variant="secondary">
            Qatları yüklə
          </Button>
        </div>
      </div>

      {loadingLayers && <div className="flex justify-center py-8"><Spinner size="lg" /></div>}

      {layers.length > 0 && (
        <div className="bg-white rounded-xl shadow-card p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Risk Qatları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {layers.map(layer => (
              <label
                key={layer.key}
                className={`rounded-lg border p-4 cursor-pointer transition-all
                  ${riskColors[layer.risk_level]}
                  ${selected.includes(layer.key) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(layer.key)}
                    onChange={() => toggleLayer(layer.key)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium">{layer.label}</p>
                    <p className="text-xs mt-0.5">{layer.risk_label}</p>
                    {layer.warning && (
                      <p className="text-xs flex items-center gap-1 mt-1 text-warning">
                        <AlertTriangle size={11} /> {layer.warning}
                      </p>
                    )}
                    <div className="mt-2 space-y-0.5">
                      {layer.details.map(d => (
                        <p key={d.k} className="text-xs">
                          <span className="font-medium">{d.k}:</span> {d.v}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={runSim} loading={running} disabled={!selected.length}>
              <Play size={15} /> Simulyasiya et
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Nəticə</h2>
          <pre className="text-xs bg-gray-50 rounded-lg p-4 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
