import { useEffect, useRef, useState } from 'react'
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { Task } from '../types'

const BAKU = { lat: 40.4093, lng: 49.8671 }
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string

const PRIORITY_COLOR: Record<string, string> = {
  high:   '#EF4444',
  medium: '#F59E0B',
  low:    '#3B82F6',
  Yüksək: '#EF4444',
  Orta:   '#F59E0B',
  Aşağı:  '#3B82F6',
}

const PRIORITY_LABEL: Record<string, string> = {
  high:   'Yüksək',
  medium: 'Orta',
  low:    'Aşağı',
  Yüksək: 'Yüksək',
  Orta:   'Orta',
  Aşağı:  'Aşağı',
}

function catEmoji(cat?: string): string {
  const c = (cat ?? '').toLowerCase()
  if (c.includes('elektrik')) return '⚡'
  if (c.includes('su'))       return '💧'
  if (c.includes('zibil'))   return '🗑'
  if (c.includes('yol'))     return '🛣'
  if (c.includes('abadl'))   return '🌿'
  return '📍'
}

interface TaskMapProps {
  tasks: Task[]
  highlightId?: string | null
  onNavigateToTasks?: () => void
}

export default function TaskMap({ tasks, highlightId, onNavigateToTasks }: TaskMapProps) {
  const [selected, setSelected] = useState<Task | null>(null)
  const prevHighlight = useRef<string | null>(null)

  const gpsTasks = tasks.filter(t => t.map_x != null && t.map_y != null)

  useEffect(() => {
    if (!highlightId || highlightId === prevHighlight.current) return
    prevHighlight.current = highlightId
    const t = gpsTasks.find(t => t.id === highlightId)
    if (t) setSelected(t)
  }, [highlightId]) // eslint-disable-line

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: 460, borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <Map
          mapId={MAP_ID}
          defaultCenter={BAKU}
          defaultZoom={13}
          gestureHandling="cooperative"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {gpsTasks.map(task => {
            const bg    = PRIORITY_COLOR[task.priority] ?? '#3B82F6'
            const isSel = selected?.id === task.id

            return (
              <AdvancedMarker
                key={task.id}
                position={{ lat: task.map_x!, lng: task.map_y! }}
                zIndex={isSel ? 99 : 1}
                onClick={() => setSelected(isSel ? null : task)}
              >
                {/* Simple div marker — guaranteed to render in all browsers */}
                <div style={{
                  width:  isSel ? 52 : 44,
                  height: isSel ? 52 : 44,
                  borderRadius: '50%',
                  background: bg,
                  border: `3px solid ${isSel ? '#fff' : bg}`,
                  boxShadow: isSel
                    ? `0 0 0 4px ${bg}55, 0 4px 16px rgba(0,0,0,0.3)`
                    : '0 3px 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isSel ? 22 : 18,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}>
                  {catEmoji(task.category)}
                </div>
              </AdvancedMarker>
            )
          })}

          {selected && selected.map_x != null && selected.map_y != null && (
            <InfoWindow
              position={{ lat: selected.map_x, lng: selected.map_y }}
              onClose={() => setSelected(null)}
            >
              <div style={{ maxWidth: 240, fontFamily: 'sans-serif', padding: '4px 2px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    background: PRIORITY_COLOR[selected.priority] ?? '#3b82f6',
                    color: '#fff', borderRadius: 20, padding: '2px 9px',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {PRIORITY_LABEL[selected.priority] ?? selected.priority}
                  </span>
                  {selected.category && (
                    <span style={{
                      fontSize: 11, color: '#374151',
                      background: '#f3f4f6', borderRadius: 20, padding: '2px 8px',
                    }}>
                      {catEmoji(selected.category)} {selected.category}
                    </span>
                  )}
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 5px', color: '#111' }}>
                  {selected.title}
                </p>
                {selected.address && (
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>
                    📍 {selected.address}
                  </p>
                )}
                {selected.description && (
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.45 }}>
                    {selected.description}
                  </p>
                )}
                {onNavigateToTasks && (
                  <button
                    onClick={() => { setSelected(null); onNavigateToTasks() }}
                    style={{
                      marginTop: 10, width: '100%', padding: '7px 0',
                      background: '#2563EB', color: '#fff',
                      border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    → Tapşırıqlar siyahısına
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* GPS count badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(255,255,255,0.96)',
        borderRadius: 12, padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        border: '1px solid #e5e7eb',
        pointerEvents: 'none',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0 }}>
          {gpsTasks.length} GPS müraciət
        </p>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>xəritədə görünür</p>
      </div>
    </div>
  )
}
