import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  MapPin,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  LocateFixed,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MapsSource {
  title: string;
  uri: string;
  reviewSnippets?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  mapsSources?: MapsSource[];
  recommendedServiceOption?: string;
  showBookingCta?: boolean;
}

interface SalonChatbotProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onBookFromChat: (serviceOption: string, label: string) => void;
}

const STARTER_QUESTIONS = [
  'What services & prices do you offer?',
  'Where is Floraison located & opening hours?',
  'Best treatment for frizzy, dry hair?',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: "Welcome to **FLORAISON** (T.G. Road, Ram Nagar, Agartala). Ask me anything about our haircuts, L'Oréal colour & French Balayage, Keratin & Hair Spa, skin treatments, pricing, hours, or directions via Google Maps.",
  recommendedServiceOption: 'Free Consultation',
  showBookingCta: true,
};

function renderFormattedLine(line: string, lineKey: number) {
  // Parse **bold** and [label](url) tokens safely without HTML injection
  const tokens: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={`${lineKey}-${match.index}`} className="font-semibold text-luxury-ivory">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (linkMatch) {
        tokens.push(
          <a
            key={`${lineKey}-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-luxury-gold underline hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        tokens.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }

  return tokens;
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-luxury-gold mt-1">•</span>
              <span>{renderFormattedLine(line.slice(2), idx)}</span>
            </div>
          );
        }
        return <p key={idx}>{renderFormattedLine(line, idx)}</p>;
      })}
    </div>
  );
}

export default function SalonChatbot({ isOpen, onToggle, onBookFromChat }: SalonChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      { timeout: 6000 }
    );
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historyForApi = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setError(null);
    setIsSending(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          ...(userLocation ? { location: userLocation } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to get a response right now.');
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        mapsSources: Array.isArray(data.mapsSources) ? data.mapsSources : [],
        recommendedServiceOption: data.recommendedServiceOption || 'Free Consultation',
        showBookingCta: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Response timed out. Please try asking again.');
      } else {
        setError(err instanceof Error ? err.message : 'Unable to reach Floraison AI Concierge.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
  };

  const handleCtaClick = (serviceOption: string) => {
    onToggle(false);
    onBookFromChat(serviceOption, serviceOption);
  };

  return (
    <>
      {/* Floating Launcher (Bottom-Left so it never overlaps WhatsApp on Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onToggle(true)}
          className="fixed bottom-24 md:bottom-10 left-4 md:left-10 z-50 px-5 py-3.5 rounded-full bg-luxury-gold text-luxury-black border border-[#202127]/20 shadow-2xl hover:bg-[#F9DF6F] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2.5 font-bold text-xs uppercase tracking-widest group"
          aria-label="Open Floraison AI Concierge Chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Floraison AI</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Multi-turn Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-8 sm:bottom-8 z-50 sm:w-[420px] h-[560px] max-h-[82vh] rounded-2xl bg-luxury-black border border-luxury-champagne/25 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-luxury-champagne/15 bg-luxury-ivory/[0.04] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-luxury-gold text-luxury-black flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-bold text-sm text-luxury-ivory truncate">
                    FLORAISON AI Concierge
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/75 truncate">
                    Salon Guide &amp; Google Maps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={requestLocation}
                  title={
                    locationStatus === 'granted'
                      ? 'Using your live location for Maps'
                      : 'Share location for tailored Google Maps directions'
                  }
                  className={cn(
                    'p-2 rounded-full border transition-colors',
                    locationStatus === 'granted'
                      ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10'
                      : 'border-luxury-champagne/20 text-luxury-champagne hover:border-luxury-gold hover:text-luxury-gold'
                  )}
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-2 rounded-full border border-luxury-champagne/20 text-luxury-champagne hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(false)}
                  aria-label="Close chat"
                  className="p-2 rounded-full border border-luxury-champagne/20 text-luxury-champagne hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col gap-2',
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl px-4 py-3',
                      msg.role === 'user'
                        ? 'bg-luxury-gold text-luxury-black font-medium text-sm rounded-br-sm'
                        : 'bg-luxury-ivory/[0.06] border border-luxury-champagne/20 text-luxury-champagne rounded-bl-sm'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}
                  </div>

                  {/* Google Maps Grounding Links */}
                  {msg.role === 'model' && msg.mapsSources && msg.mapsSources.length > 0 && (
                    <div className="max-w-[88%] w-full space-y-1.5 pl-1">
                      <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/60 font-bold">
                        Google Maps Grounding
                      </p>
                      {msg.mapsSources.map((src, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-2.5 bg-luxury-ivory/[0.04] border border-luxury-champagne/15 space-y-1"
                        >
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-luxury-gold hover:underline"
                          >
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{src.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                          {src.reviewSnippets &&
                            src.reviewSnippets.map((snippet, si) => (
                              <p key={si} className="text-[11px] text-luxury-champagne/75 italic pl-5">
                                “{snippet}”
                              </p>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Booking Form CTA after assistant answer */}
                  {msg.role === 'model' && msg.showBookingCta && (
                    <button
                      type="button"
                      onClick={() => handleCtaClick(msg.recommendedServiceOption || 'Free Consultation')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-luxury-gold text-luxury-black hover:bg-[#F9DF6F] transition-colors text-[11px] font-bold uppercase tracking-wider shadow-md"
                    >
                      <span>
                        Book{' '}
                        {msg.recommendedServiceOption && msg.recommendedServiceOption !== 'Free Consultation'
                          ? msg.recommendedServiceOption.split(' (')[0]
                          : 'Free Consultation'}{' '}
                        in Form
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Quick Starter Prompts on first open */}
              {messages.length === 1 && !isSending && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/60 font-bold">
                    Quick Questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => void sendMessage(q)}
                        className="text-left text-xs px-3 py-2 rounded-xl bg-luxury-ivory/[0.05] border border-luxury-champagne/20 text-luxury-ivory hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSending && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-luxury-ivory/[0.06] border border-luxury-champagne/20 text-xs text-luxury-champagne flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-pulse" />
                    <span>Checking Floraison menu &amp; Google Maps...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-3 py-2.5 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-luxury-champagne/15 bg-luxury-ivory/[0.03] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about services, prices, directions..."
                className="flex-1 bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-full px-4 py-2.5 text-xs sm:text-sm text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-luxury-gold text-luxury-black flex items-center justify-center shrink-0 hover:bg-[#F9DF6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
