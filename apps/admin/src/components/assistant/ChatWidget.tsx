import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  functionCall?: string;
}

const suggestedQueries = [
  "Quels sont mes nouveaux leads ?",
  "Rédige un email de relance",
  "Quelle est ma meilleure filière cible ?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis Slimane, votre assistant JAD2 TAWJIH. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CF-Access-JWT-Assertion": localStorage.getItem("tawjih_access_token") || "",
        },
        body: JSON.stringify({ message: text, universityId: 1 }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "Je n'ai pas compris." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur de connexion. Réessayez." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition font-bold text-lg"
      >
        S
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] bg-cream rounded-3xl shadow-2xl border border-gold-200/50 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-navy-800 to-navy-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold">S</div>
                <div>
                  <div className="font-heading font-bold text-gold-300">Slimane</div>
                  <div className="text-[10px] text-gold-200/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {isLoading ? "Réflexion..." : "En ligne"}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-navy-700 text-white rounded-br-md" : "bg-white border border-gold-100 text-ink rounded-bl-md shadow-sm"
                  }`}>
                    {msg.content}
                    {msg.functionCall && <div className="mt-1 text-xs opacity-75">⚡ {msg.functionCall}</div>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gold-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  {suggestedQueries.map((q) => (
                    <button key={q} onClick={() => sendMessage(q)} className="block w-full text-left px-3 py-2 text-xs bg-white hover:bg-gold-50 rounded-lg text-navy-600 transition border border-gold-100">
                      💡 {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gold-100 bg-white">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none bg-cream"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="px-3 py-2 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-lg text-sm font-medium hover:from-navy-800 hover:to-navy-900 disabled:opacity-50">
                  Envoyer
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
