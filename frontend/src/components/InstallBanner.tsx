import { useRef, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import logo from '../loqo.jpeg'

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  if (!canInstall || dismissed) return null

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null) return
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  function onTouchEnd() {
    if (dragY > 100) {
      setDismissed(true)
    }
    setDragY(0)
    startY.current = null
  }

  const opacity = Math.max(0, 1 - dragY / 300)

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px]"
        style={{ opacity }}
        onClick={() => setDismissed(true)}
      />

      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-[100]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' : 'none',
          animation: dragY === 0 ? 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)' : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Handle bar — drag buradan başlayır */}
        <div className="flex justify-center pt-3 pb-1 bg-white rounded-t-[28px] touch-none cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="bg-white px-5 pb-8 pt-3 relative">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={15} className="text-gray-500" />
          </button>

          <div className="flex items-center gap-4 mb-5">
            <img
              src={logo}
              alt="Mobil İcra"
              className="w-16 h-16 rounded-2xl object-cover shadow-md border border-gray-100 flex-shrink-0"
            />
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">Mobil İcra</p>
              <p className="text-sm text-gray-500 mt-0.5">Şəhər idarəetmə platforması</p>
              <div className="flex items-center gap-1 mt-1.5">
                {['★','★','★','★','★'].map((s, i) => (
                  <span key={i} className="text-amber-400 text-xs">{s}</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">Pulsuz</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
            {[
              { icon: '📍', text: 'GPS müraciət' },
              { icon: '⚡', text: 'Real vaxt' },
              { icon: '📊', text: 'Analitika' },
              { icon: '🔔', text: 'Bildiriş' },
            ].map(f => (
              <div
                key={f.text}
                className="flex-shrink-0 flex flex-col items-center gap-1 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100"
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-[10px] font-medium text-gray-600 whitespace-nowrap">{f.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={install}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1A3C6E] text-white font-bold text-base py-4 active:scale-[0.98] transition-transform shadow-lg shadow-blue-200"
          >
            <Download size={18} />
            Tətbiqi quraşdır
          </button>

          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            <Smartphone size={11} />
            Ana ekrana əlavə edilir · Yer tutmur
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
