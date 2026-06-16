import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://tawjih-api.hamzaelbouhali.workers.dev";

type Tab = "student" | "b2b";

const STUDENT_REQUEST_TYPES = [
  { value: "orientation", icon: "🧭", labelKey: "contact.req.orientation", descKey: "contact.req.orientation.desc" },
  { value: "coaching",    icon: "🎯", labelKey: "contact.req.coaching",    descKey: "contact.req.coaching.desc" },
  { value: "question",   icon: "❓", labelKey: "contact.req.question",    descKey: "contact.req.question.desc" },
  { value: "other",      icon: "💬", labelKey: "contact.req.other",       descKey: "contact.req.other.desc" },
] as const;

const B2B_TYPES = [
  { value: "partnership", icon: "🤝", labelKey: "contact.b2b.partnership", descKey: "contact.b2b.partnership.desc" },
  { value: "data",        icon: "📊", labelKey: "contact.b2b.data",        descKey: "contact.b2b.data.desc" },
  { value: "recruitment", icon: "🎓", labelKey: "contact.b2b.recruitment", descKey: "contact.b2b.recruitment.desc" },
  { value: "other",       icon: "💬", labelKey: "contact.b2b.other",       descKey: "contact.b2b.other.desc" },
] as const;

function SuccessScreen({ type }: { type: Tab }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-6"
    >
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-heading text-2xl font-bold text-navy-800 mb-3">{t("contact.success.title")}</h3>
      <p className="text-navy-500 text-sm max-w-sm mx-auto leading-relaxed">
        {type === "student" ? t("contact.success.student") : t("contact.success.b2b")}
      </p>
      <div className="mt-6 text-xs text-navy-400 flex items-center justify-center gap-2">
        <span className="text-emerald-500">●</span>
        <a href="mailto:Tawjih@jad2advisory.com" className="hover:text-gold-600 transition-colors">
          Tawjih@jad2advisory.com
        </a>
      </div>
    </motion.div>
  );
}

function StudentForm() {
  const { t } = useTranslation();
  const [requestType, setRequestType] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isValid = requestType && email && message.length >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "student",
          name: name || undefined,
          email,
          phone: phone || undefined,
          requestType,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? t("contact.error.server"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("contact.error.server"));
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessScreen type="student" />;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-navy-700 mb-3">{t("contact.student.requestType")} *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STUDENT_REQUEST_TYPES.map((rt) => (
            <motion.button
              key={rt.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setRequestType(rt.value)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                requestType === rt.value
                  ? "border-gold-400 bg-gold-50 shadow-md"
                  : "border-parchment hover:border-gold-200 bg-cream"
              }`}
            >
              <span className="text-xl flex-shrink-0">{rt.icon}</span>
              <div>
                <div className="font-bold text-sm text-navy-700 leading-tight">{t(rt.labelKey)}</div>
                <div className="text-[11px] text-navy-400 mt-0.5">{t(rt.descKey)}</div>
              </div>
              {requestType === rt.value && (
                <div className="ml-auto w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.student.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yassine"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gold-100 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.student.email")} *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yassine@example.com"
            maxLength={120}
            required
            className="w-full px-4 py-3 rounded-xl border border-gold-100 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
          {t("contact.student.phone")}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+212 6XX XXX XXX"
          maxLength={20}
          className="w-full px-4 py-3 rounded-xl border border-gold-100 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
          {t("contact.student.message")} * <span className="normal-case font-normal text-navy-400">({message.length}/2000)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("contact.student.message.placeholder")}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gold-100 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => void handleSubmit()}
        disabled={!isValid || loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold hover:from-gold-400 hover:to-gold-300 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("contact.sending")}
          </>
        ) : (
          <>
            {t("contact.student.submit")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </motion.button>

      <p className="text-[11px] text-navy-400 leading-relaxed text-center">
        {t("contact.legal_notice")}
      </p>
    </div>
  );
}

function B2BForm() {
  const { t } = useTranslation();
  const [partnershipType, setPartnershipType] = useState<string>("");
  const [institutionName, setInstitutionName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isValid = partnershipType && institutionName && contactName && email && message.length >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "b2b",
          institutionName,
          contactName,
          role: role || undefined,
          email,
          phone: phone || undefined,
          partnershipType,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? t("contact.error.server"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("contact.error.server"));
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessScreen type="b2b" />;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-navy-700 mb-3">{t("contact.student.requestType")} *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {B2B_TYPES.map((bt) => (
            <motion.button
              key={bt.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setPartnershipType(bt.value)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                partnershipType === bt.value
                  ? "border-navy-600 bg-navy-50 shadow-md"
                  : "border-parchment hover:border-navy-200 bg-cream"
              }`}
            >
              <span className="text-xl flex-shrink-0">{bt.icon}</span>
              <div>
                <div className="font-bold text-sm text-navy-700 leading-tight">{t(bt.labelKey)}</div>
                <div className="text-[11px] text-navy-400 mt-0.5">{t(bt.descKey)}</div>
              </div>
              {partnershipType === bt.value && (
                <div className="ml-auto w-5 h-5 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
          {t("contact.b2b.institution")} *
        </label>
        <input
          type="text"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
          placeholder="Université Mohammed VI Polytechnique"
          maxLength={150}
          required
          className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.b2b.contactName")} *
          </label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Dr. Salma Benali"
            maxLength={100}
            required
            className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.b2b.role")}
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Directrice des admissions"
            maxLength={80}
            className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.b2b.email")} *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="s.benali@um6p.ma"
            maxLength={120}
            required
            className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
            {t("contact.b2b.phone")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 5XX XXX XXX"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy-500 uppercase tracking-wider mb-1.5">
          {t("contact.b2b.message")} * <span className="normal-case font-normal text-navy-400">({message.length}/3000)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("contact.b2b.message.placeholder")}
          maxLength={3000}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-navy-100 bg-white text-sm text-navy-700 focus:border-navy-400 focus:ring-2 focus:ring-navy-100 outline-none transition resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => void handleSubmit()}
        disabled={!isValid || loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-navy-900/20 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("contact.sending")}
          </>
        ) : (
          <>
            {t("contact.b2b.submit")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </motion.button>

      <p className="text-[11px] text-navy-400 leading-relaxed text-center">
        {t("contact.legal_notice")}
      </p>
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("student");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 bg-gold-500 rounded-full" />
            JAD2 TAWJIH
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t("contact.hero.title")}</h1>
          <p className="text-navy-300 text-sm max-w-xl mx-auto leading-relaxed">{t("contact.hero.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Tab selector */}
        <div className="flex gap-2 p-1.5 bg-navy-50 rounded-2xl border border-navy-100 mb-8">
          <button
            type="button"
            onClick={() => setTab("student")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === "student"
                ? "bg-white shadow text-navy-800 border border-gold-200"
                : "text-navy-400 hover:text-navy-600"
            }`}
          >
            <span className="text-base">👤</span>
            {t("contact.tab.student")}
          </button>
          <button
            type="button"
            onClick={() => setTab("b2b")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === "b2b"
                ? "bg-white shadow text-navy-800 border border-navy-200"
                : "text-navy-400 hover:text-navy-600"
            }`}
          >
            <span className="text-base">🏛️</span>
            {t("contact.tab.b2b")}
          </button>
        </div>

        {/* Context banner */}
        <div className={`mb-6 rounded-2xl p-4 border text-sm ${
          tab === "student"
            ? "bg-gold-50 border-gold-100 text-gold-900"
            : "bg-navy-50 border-navy-100 text-navy-700"
        }`}>
          <p>{tab === "student" ? t("contact.student.banner") : t("contact.b2b.banner")}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gold-100/60 shadow-sm p-6 md:p-8">
          <AnimatePresence mode="wait">
            {tab === "student" ? (
              <motion.div key="student" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <StudentForm />
              </motion.div>
            ) : (
              <motion.div key="b2b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <B2BForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-navy-400 mt-6">
          {t("contact.footer.email")}{" "}
          <a href="mailto:Tawjih@jad2advisory.com" className="text-gold-600 hover:text-gold-700 transition-colors">
            Tawjih@jad2advisory.com
          </a>
        </p>
      </div>
    </motion.div>
  );
}
