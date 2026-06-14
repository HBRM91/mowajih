import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiGet, API_URL } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";

interface PlatformData {
  funnel: { simulations: number; leads: number; optIns: number; contacts: number; converted: number; simToLead: number; leadToOptIn: number; optInToConverted: number };
  schoolDemand: Array<{ schoolSlug: string; count: number; avgProbability: number }>;
  trackDist: Array<{ bacTrack: string; count: number; avgGrade: number }>;
  regionDist: Array<{ region: string; count: number }>;
  budgetDist: Array<{ bracket: string; count: number }>;
  trend30d: Array<{ day: string; count: number }>;
  recentProfiles: Array<{ uuid: string; bacTrack: string; mention: string; city: string; generalGrade: number; financialBracket: string; createdAt: string }>;
  monthlyRevenue: Array<{ month: string; revenue: number; optIns: number; leads: number }>;
  mentionDist: Array<{ mention: string; count: number }>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getSuggestions(data?: PlatformData): string[] {
  if (!data) {
    return [
      "Résume les performances de la plateforme",
      "Détecte des anomalies dans les données",
      "Rédige un email de partenariat pour une école",
      "Quelles actions prioritaires cette semaine ?",
    ];
  }
  const f = data.funnel;
  const suggestions: string[] = [];

  if (f.leadToOptIn < 10) {
    suggestions.push(`⚠️ Taux lead→opt-in à ${f.leadToOptIn}% — que faire ?`);
  } else {
    suggestions.push(`Taux opt-in à ${f.leadToOptIn}% — comment l'améliorer ?`);
  }

  const top = data.schoolDemand?.[0];
  if (top) {
    suggestions.push(`Rédige un email de partenariat pour ${top.schoolSlug}`);
  }

  const topTrack = data.trackDist?.[0];
  if (topTrack) {
    suggestions.push(`Analyse le segment ${topTrack.bacTrack} (${topTrack.count} profils)`);
  }

  suggestions.push("Génère un rapport mensuel de performance");
  return suggestions.slice(0, 4);
}

function EmailBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-3 border border-gold-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gold-50 border-b border-gold-200">
        <span className="text-[10px] font-semibold text-gold-700 uppercase tracking-wider">Email rédigé</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[10px] text-navy-600 hover:text-navy-900 transition font-medium"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-600">Copié !</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copier
            </>
          )}
        </button>
      </div>
      <div className="p-3 bg-white text-xs text-navy-700 font-mono whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function renderContent(text: string) {
  const emailRegex = /---EMAIL---([\s\S]*?)---FIN EMAIL---/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match;

  while ((match = emailRegex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<PlainText key={`t-${last}`} text={text.slice(last, match.index)} />);
    }
    parts.push(<EmailBlock key={`e-${match.index}`} content={match[1].trim()} />);
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(<PlainText key={`t-${last}`} text={text.slice(last)} />);
  }

  return parts;
}

function PlainText({ text }: { text: string }) {
  const lines = text.trim().split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        const isAlert = line.startsWith("⚠️");
        const isBullet = /^(\s{0,4})[-•]/.test(line);
        const isHeader = /^[A-ZÀ-ɏ].*:$/.test(line.trim()) && line.trim().length < 50;

        const formattedLine = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

        if (isAlert) {
          return (
            <div key={i} className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800 text-xs font-medium">
              <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
            </div>
          );
        }

        if (isHeader) {
          return (
            <p key={i} className="text-[11px] font-bold text-navy-500 uppercase tracking-wide mt-2 mb-0.5">
              {line.replace(/:$/, "")}
            </p>
          );
        }

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 text-xs text-navy-700">
              <span className="text-gold-500 mt-0.5 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^(\s{0,4})[-•]\s*/, "") }} />
            </div>
          );
        }

        return (
          <p key={i} className="text-xs text-navy-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: analytics } = useQuery<PlatformData>({
    queryKey: ["platform-analytics"],
    queryFn: () => apiGet("/api/admin/analytics/platform"),
    staleTime: 60_000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const prevMessages = messages;
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/admin/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: trimmed,
          history: prevMessages.slice(-14),
          context: analytics ?? undefined,
        }),
      });

      const data = await res.json() as { response?: string; error?: string };

      if (!res.ok || data.error) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `Erreur : ${data.error ?? `HTTP ${res.status}`}. Réessayez dans quelques secondes.`,
        }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.response ?? "" }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connexion impossible. Vérifiez votre connexion et réessayez.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, analytics, isLoading]);

  const suggestions = getSuggestions(analytics);
  const f = analytics?.funnel;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        title="Assistant IA JAD2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        {messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            IA
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[460px] max-w-[calc(100vw-2rem)] h-[580px] bg-cream rounded-2xl shadow-2xl border border-gold-200/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-navy-900 to-navy-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <div className="font-heading font-bold text-gold-300 leading-none">Assistant IA</div>
                  <div className="text-[10px] text-gold-200/60 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {isLoading ? "Analyse en cours…" : "JAD2 TAWJIH · Gemini 2.5 Flash"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="text-white/40 hover:text-white/80 transition text-[10px] px-2 py-1 rounded"
                    title="Nouvelle conversation"
                  >
                    Effacer
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Analytics context bar */}
            {f && (
              <div className="px-4 py-2 bg-navy-800/5 border-b border-gold-100/50 flex items-center gap-3 overflow-x-auto scrollbar-hide shrink-0">
                <ContextBadge label="Simulations" value={f.simulations} color="blue" />
                <ContextBadge label="Leads" value={f.leads} color="indigo" />
                <ContextBadge label="Opt-ins" value={f.optIns} color="emerald" />
                <ContextBadge
                  label="Conv. lead→opt"
                  value={`${f.leadToOptIn}%`}
                  color={f.leadToOptIn < 8 ? "amber" : "emerald"}
                />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-center text-xs text-navy-400 py-2">
                    Bonjour Hamza — les données de la plateforme sont injectées automatiquement.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-left px-3 py-2.5 bg-white hover:bg-gold-50 rounded-xl text-xs text-navy-700 transition border border-gold-100 shadow-sm leading-snug"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <svg className="w-3 h-3 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-navy-700 text-white text-xs rounded-br-md"
                      : "bg-white border border-gold-100/80 rounded-bl-md shadow-sm"
                  }`}>
                    {msg.role === "user"
                      ? <p className="text-xs leading-relaxed">{msg.content}</p>
                      : renderContent(msg.content)
                    }
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <svg className="w-3 h-3 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="bg-white border border-gold-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gold-100 bg-white shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Analysez les données, rédigez un email…"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gold-200 text-xs focus:border-gold-400 focus:ring-2 focus:ring-gold-100 outline-none bg-cream placeholder:text-navy-300"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-xl text-xs font-semibold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ContextBadge({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-medium ${colors[color] ?? colors.blue}`}>
      <span className="opacity-70">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
