import { Map, AdvancedMarker, MapMouseEvent } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

const BAKU = { lat: 40.4093, lng: 49.8671 }
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

interface Pos { lat: number; lng: number }

interface Props {
  value: Pos | null
  onChange: (pos: Pos) => void
  showLabel?: boolean
  height?: number
}

export default function LocationPickerMap({ value, onChange, showLabel = true, height = 200 }: Props) {
  function handleClick(e: MapMouseEvent) {
    const ll = e.detail.latLng
    if (ll) onChange({ lat: ll.lat, lng: ll.lng })
  }

  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <MapPin size={14} className="text-blue-500" />
          Xəritədən yer seçin
          <span className="text-xs text-gray-400 font-normal">(istəyə bağlı — klik ilə pin qoy)</span>
        </label>
      )}
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
        <Map
          mapId={MAP_ID}
          defaultCenter={BAKU}
          defaultZoom={13}
          onClick={handleClick}
          gestureHandling="cooperative"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          style={{ cursor: 'crosshair' }}
        >
          {value && (
            <AdvancedMarker position={value}>
              <div
                style={{
                  width: 16, height: 16,
                  background: '#2563EB',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.5)',
                }}
              />
            </AdvancedMarker>
          )}
        </Map>
      </div>
      {value && (
        <p className="text-xs text-gray-400">
          📍 {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          <button onClick={() => onChange(null as unknown as Pos)} className="ml-2 text-red-400 hover:text-red-600">
            Sil
          </button>
        </p>
      )}
    </div>
  )
}
