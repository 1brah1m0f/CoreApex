import { useState, useEffect } from 'react';
import { Accessibility, Type, Contrast, Orbit, Volume2 } from 'lucide-react';
import { clsx } from 'clsx';

interface A11ySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  talkBack: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  talkBack: false,
};

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(() => {
    const saved = localStorage.getItem('apexcore_accessibility');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('apexcore_accessibility', JSON.stringify(settings));
    
    const html = document.documentElement;
    
    if (settings.largeText) {
      html.classList.add('text-[110%]');
    } else {
      html.classList.remove('text-[110%]');
    }

    if (settings.highContrast) {
      html.classList.add('contrast-125');
    } else {
      html.classList.remove('contrast-125');
    }

    if (settings.reduceMotion) {
      html.classList.add('a11y-reduce-motion');
    } else {
      html.classList.remove('a11y-reduce-motion');
    }
  }, [settings]);

  useEffect(() => {
    if (!settings.talkBack) {
      window.speechSynthesis.cancel();
      document.querySelectorAll('.a11y-talkback-highlight').forEach(el => {
        el.classList.remove('a11y-talkback-highlight');
      });
      return;
    }

    let currentTarget: HTMLElement | null = null;
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Prevent reading the accessibility panel itself to avoid annoying loops
      if (target.closest('[role="dialog"]')) return;

      const readable = target.closest('button, a, h1, h2, h3, h4, h5, h6, p, label, li, span, input, textarea');
      if (readable && readable !== currentTarget) {
        currentTarget = readable as HTMLElement;
        clearTimeout(timeout);
        
        document.querySelectorAll('.a11y-talkback-highlight').forEach(el => {
          el.classList.remove('a11y-talkback-highlight');
        });
        
        timeout = setTimeout(() => {
          if (!currentTarget) return;
          let textToRead = currentTarget.getAttribute('aria-label') || currentTarget.innerText || currentTarget.textContent;
          
          if (currentTarget.tagName === 'INPUT' || currentTarget.tagName === 'TEXTAREA') {
             const input = currentTarget as HTMLInputElement;
             textToRead = input.value || input.placeholder || currentTarget.getAttribute('aria-label') || 'Mətn qutusu';
          }
          
          textToRead = textToRead?.trim();
          
          if (textToRead) {
            currentTarget.classList.add('a11y-talkback-highlight');
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToRead);
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('az') || v.lang.startsWith('tr')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
          }
        }, 400);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // Əgər siçan hələ də hədəf elementin içində gəzirsə, ləğv etmə!
      if (currentTarget && e.relatedTarget instanceof Node && currentTarget.contains(e.relatedTarget)) {
        return;
      }

      clearTimeout(timeout);
      if (currentTarget) {
        currentTarget.classList.remove('a11y-talkback-highlight');
      }
      currentTarget = null;
      window.speechSynthesis.cancel();
    };

    // Make sure voices are loaded
    window.speechSynthesis.onvoiceschanged = () => {};

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      window.speechSynthesis.cancel();
      clearTimeout(timeout);
      document.querySelectorAll('.a11y-talkback-highlight').forEach(el => {
        el.classList.remove('a11y-talkback-highlight');
      });
    };
  }, [settings.talkBack]);

  const toggleSetting = (key: keyof A11ySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      {isOpen && (
        <div 
          className="absolute bottom-16 left-0 bg-white border border-border shadow-card rounded-2xl p-4 w-72 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2"
          role="dialog"
          aria-label="Əlçatanlıq seçimləri paneli"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-primary text-sm">Əlçatanlıq Seçimləri</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label="Paneli bağla"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          
          <button
            onClick={() => toggleSetting('largeText')}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors",
              settings.largeText ? "border-primary bg-blue-50 text-primary" : "border-gray-100 bg-bg text-gray-700 hover:border-blue-200"
            )}
            aria-pressed={settings.largeText}
          >
            <Type size={18} aria-hidden="true" />
            <span className="text-sm font-semibold">Mətn ölçüsünü böyüt</span>
          </button>

          <button
            onClick={() => toggleSetting('highContrast')}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors",
              settings.highContrast ? "border-primary bg-blue-50 text-primary" : "border-gray-100 bg-bg text-gray-700 hover:border-blue-200"
            )}
            aria-pressed={settings.highContrast}
          >
            <Contrast size={18} aria-hidden="true" />
            <span className="text-sm font-semibold">Yüksək kontrast</span>
          </button>

          <button
            onClick={() => toggleSetting('reduceMotion')}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors",
              settings.reduceMotion ? "border-primary bg-blue-50 text-primary" : "border-gray-100 bg-bg text-gray-700 hover:border-blue-200"
            )}
            aria-pressed={settings.reduceMotion}
          >
            <Orbit size={18} aria-hidden="true" />
            <span className="text-sm font-semibold">Animasiyaları azalt</span>
          </button>

          <button
            onClick={() => toggleSetting('talkBack')}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors",
              settings.talkBack ? "border-primary bg-blue-50 text-primary" : "border-gray-100 bg-bg text-gray-700 hover:border-blue-200"
            )}
            aria-pressed={settings.talkBack}
          >
            <Volume2 size={18} aria-hidden="true" />
            <span className="text-sm font-semibold">Səsli oxuma (TalkBack)</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all"
        aria-label="Əlçatanlıq menyusunu aç"
        aria-expanded={isOpen}
      >
        <Accessibility size={26} aria-hidden="true" />
      </button>
    </div>
  );
}
