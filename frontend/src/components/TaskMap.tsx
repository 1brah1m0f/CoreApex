import { useState } from 'react'
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { Zap, Droplets, Trash2, Construction, Leaf, MapPin } from 'lucide-react'
import { Task } from '../types'

const BAKU = { lat: 40.4093, lng: 49.8671 }
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

const priorityStyle: Record<string, { bg: string; ring: string; label: string }> = {
  high:   { bg: '#EF4444', ring: '#FCA5A5', label: 'Yüksək' },
  medium: { bg: '#F59E0B', ring: '#FCD34D', label: 'Orta' },
  low:    { bg: '#3B82F6', ring: '#93C5FD', label: 'Aşağı' },
}

function categoryIcon(cat?: string) {
  const c = (cat ?? '').toLowerCase()
  if (c.includes('elektrik'))      return Zap
  if (c.includes('su'))            return Droplets
  if (c.includes('zibil'))         return Trash2
  if (c.includes('yol'))           return Construction
  if (c.includes('abadlıq') || c.includes('abadliq')) return Leaf
  return MapPin
}

// ─── Main Map ──────────────────────────────────────
interface TaskMapProps {
  tasks: Task[]
  onNavigateToTasks?: () => void
}

export default function TaskMap({ tasks, onNavigateToTasks }: TaskMapProps) {
  const [selected, setSelected] = useState<Task | null>(null)

  const activeTasks = tasks.filter(
    t => t.status !== 'resolved' && t.map_x != null && t.map_y != null
  )

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ height: 400 }}>
      <Map
        mapId={MAP_ID}
        defaultCenter={BAKU}
        defaultZoom={14}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        {activeTasks.map((task, i) => {
          const style = priorityStyle[task.priority] ?? priorityStyle.medium
          const isSelected = selected?.id === task.id
          const Icon = categoryIcon(task.category)

          return (
            <AdvancedMarker
              key={task.id}
              position={{ lat: task.map_x!, lng: task.map_y! }}
              onClick={() => setSelected(isSelected ? null : task)}
              zIndex={isSelected ? 99 : i}
            >
              <div
                style={{
                  width: 40, height: 40,
                  background: style.bg,
                  boxShadow: isSelected
                    ? `0 0 0 3px white, 0 0 0 6px ${style.bg}`
                    : `0 2px 8px rgba(0,0,0,0.3)`,
                  transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  border: '2.5px solid white',
                }}
              >
                <Icon size={18} strokeWidth={2.5} />
              </div>
            </AdvancedMarker>
          )
        })}

        {selected && selected.map_x != null && selected.map_y != null && (
          <InfoWindow
            position={{ lat: selected.map_x, lng: selected.map_y }}
            onClose={() => setSelected(null)}
          >
            <div style={{ padding: '6px 4px', maxWidth: 230, fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{
                  background: priorityStyle[selected.priority]?.bg ?? '#3b82f6',
                  color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 600,
                }}>
                  {priorityStyle[selected.priority]?.label}
                </span>
                {selected.category && (
                  <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', borderRadius: 20, padding: '1px 7px' }}>
                    {selected.category}
                  </span>
                )}
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px', color: '#111' }}>{selected.title}</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 3px' }}>
                📍 {selected.address}
              </p>
              {selected.agency_body && (
                <p style={{ fontSize: 11, color: '#7c3aed', margin: 0 }}>
                  🏢 {selected.agency_body}
                </p>
              )}
              {selected.description && (
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, lineHeight: 1.4 }}>
                  {selected.description}
                </p>
              )}
              {onNavigateToTasks && (
                <button
                  onClick={() => { setSelected(null); onNavigateToTasks() }}
                  style={{
                    marginTop: 10, width: '100%', padding: '6px 0',
                    background: '#2563EB', color: 'white', border: 'none',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  → Tapşırıqlar Panelinə keç
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-md border border-gray-200 flex flex-col gap-1.5">
        {Object.entries(priorityStyle).map(([key, s]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.bg }} />
            <span className="text-xs text-gray-600">{s.label} prioritet</span>
          </div>
        ))}
      </div>

      {/* Task count badge */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-200">
        <p className="text-xs font-semibold text-gray-700">{activeTasks.length} aktiv tapşırıq</p>
        <p className="text-xs text-gray-400">Günün marşrutu</p>
      </div>
    </div>
  )
}
