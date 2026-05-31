import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Salam! Mən Nərimanov SmartOps köməkçisiyəm. Sizə necə kömək edə bilərəm?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (!API_KEY) {
        throw new Error("API açarı tapılmadı");
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      
      const contents = messages.filter(m => m.id !== 'welcome').map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            role: 'user', // REST API expects standard roles or system instruction object. For simplest usage, we pass system instructions in system_instruction field.
            parts: [{ text: "Sən Nərimanov SmartOps platformasının köməkçi chatbotusan. Vətəndaşlara problem bildirməyi, inspektorlara tapşırıqları icra etməyi, icraçılara isə analitikaya baxmağı başa salırsan. Cavabların qısa, aydın və Azərbaycan dilində olmalıdır." }]
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Xəta baş verdi");
      }

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Bağışlayın, cavablandıra bilmədim.";
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: botText };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: "Sistem xətası: Çatbot hazırda xidmət göstərə bilmir. (API Key və ya internet əlaqəsini yoxlayın)" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div 
          className="bg-white border border-border shadow-card rounded-2xl w-80 sm:w-96 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4"
          role="dialog"
          aria-label="Köməkçi Çatbot"
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-heading font-bold text-sm">SmartOps Köməkçisi</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label="Çatbotu bağla"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-bg flex flex-col gap-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={clsx(
                  "flex gap-2 max-w-[85%]",
                  msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div className={clsx(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white",
                  msg.role === 'user' ? "bg-accent" : "bg-primary"
                )}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={clsx(
                  "p-3 rounded-2xl text-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-sm" 
                    : "bg-white border border-border text-gray-800 rounded-tl-sm shadow-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] self-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-border text-gray-800 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-muted">Yazır...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-border flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sualınızı yazın..."
              className="flex-1 max-h-24 min-h-[40px] resize-none rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              aria-label="Sualınızı yazın"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Mesajı göndər"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all group"
          aria-label="Köməkçi çatbotu aç"
        >
          <MessageSquare size={26} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
