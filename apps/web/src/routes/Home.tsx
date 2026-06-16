import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../stores/formStore";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SCHOOLS, getTopSchoolsByTrack, TIER_LABELS, TIER_COLORS } from "../data/schools";
import SchoolLogo from "../components/ui/SchoolLogo";
import { API_URL } from "../lib/api";

const BAC_TRACKS = [
  { key: "SM", icon: "🧮", color: "from-blue-600 to-blue-800" },
  { key: "PC", icon: "⚛️", color: "from-indigo-600 to-indigo-800" },
  { key: "SVT", icon: "🧬", color: "from-emerald-600 to-emerald-800" },
  { key: "SE", icon: "📊", color: "from-amber-600 to-amber-800" },
  { key: "SH", icon: "📚", color: "from-rose-600 to-rose-800" },
  { key: "STI", icon: "🔧", color: "from-slate-600 to-slate-800" },
  { key: "L", icon: "✍️", color: "from-purple-600 to-purple-800" },
];

const STATS = [
  { value: `${SCHOOLS.length}+`, labelKey: "stats.schools", icon: "🏛️" },
  { value: "12", labelKey: "stats.regions", icon: "🇲🇦" },
  { value: "7", labelKey: "stats.tracks", icon: "🎓" },
  { value: "100%", labelKey: "stats.free", icon: "✅" },
];

const SCHOOL_TYPE_FILTERS = [
  { key: "all", labelKey: "filter.all" },
  { key: "engineering", labelKey: "filter.engineering" },
  { key: "business", labelKey: "filter.business" },
  { key: "medicine", labelKey: "filter.medicine" },
  { key: "preparatory", labelKey: "filter.preparatory" },
  { key: "university", labelKey: "filter.university" },
];

const FEATURED_SCHOOLS = SCHOOLS.filter((s) =>
  ["emi", "ehtp", "ensias", "inpt", "um6p", "iscae", "uir", "hem", "mundiapolis", "iav-hassan-ii", "al-akhawayn", "insea", "ena-rabat", "fm-rabat", "cpge-moulay-youssef", "emsi", "encg-casablanca"].includes(s.slug)
);

const HOW_IT_WORKS = [
  { step: "01", icon: "🎯", image: "/images/step-01-profile.jpeg", titleKey: "how.step1.title", descKey: "how.step1.desc", color: "from-navy-700 to-navy-800" },
  { step: "02", icon: "🤖", image: "/images/step-02-processing.jpeg", titleKey: "how.step2.title", descKey: "how.step2.desc", color: "from-gold-600 to-gold-700" },
  { step: "03", icon: "🏆", image: "/images/step-03-match.jpeg", titleKey: "how.step3.title", descKey: "how.step3.desc", color: "from-emerald-600 to-emerald-700" },
];

// Slug mapping for hero school tags
const HERO_SCHOOL_SLUGS: Record<string, string> = {
  "EMI": "emi", "ENSIAS": "ensias", "EHTP": "ehtp", "UM6P": "um6p",
  "UIR": "uir", "ISCAE": "iscae", "HEM": "hem", "INPT": "inpt",
  "ENCG": "encg-casablanca", "IAV": "iav-hassan-ii", "ENSA": "ensa-casablanca",
};

export default function Home() {
  const { t } = useTranslation();
  const [activeTrack, setActiveTrack] = useState("SM");
  const [activeFilter, setActiveFilter] = useState("all");
  const heroRef = useRef<HTMLElement>(null);

  const filteredSchools = activeFilter === "all"
    ? FEATURED_SCHOOLS
    : FEATURED_SCHOOLS.filter((s) => s.type === activeFilter);

  const trackSchools = getTopSchoolsByTrack(activeTrack, 6);

  return (
    <div className="-mt-16 overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center text-white overflow-hidden"
      >
        {/* Full-bleed campus photo */}
        <img
          src="/images/hero-campus.jpeg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Navy gradient overlay — strong enough to guarantee text legibility */}
        <div className="absolute inset-0 bg-navy-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-900/40 to-navy-950/80" />

        <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 text-center">

          {/* Urgency badge — tawjihi season */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-200 text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              JAD2 Advisory · Division Orientation
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-200 text-sm font-bold backdrop-blur-sm">
              🎓 {t("hero.badge.season")}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-2xl"
          >
            {t("hero.title")}
            <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
              {t("hero.title.highlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-3 leading-relaxed drop-shadow-lg"
          >
            {t("hero.subtitle", { count: SCHOOLS.length })}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm text-white/70 mb-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{t("hero.free")}</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{t("hero.cndp")}</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{t("hero.anonymous")}</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />{t("hero.independent")}</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-base shadow-lg shadow-gold-500/25 hover:shadow-gold-500/50 hover:scale-105 transition-all duration-300 touch-target"
            >
              <span>{t("hero.cta.discover")}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("how-it-works");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 touch-target backdrop-blur-sm"
            >
              {t("hero.cta.how")}
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>

          {/* Product preview — live result cards */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 max-w-2xl mx-auto"
          >
            {/* Outer glow */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/10 via-navy-400/5 to-gold-500/10 rounded-[2.5rem] blur-2xl" />
              <div className="relative bg-navy-900/80 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-navy-950/80">
                {/* Top bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-navy-950/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[11px] text-navy-400 font-medium">{t("home.mockup.title")}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Profile chip */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold-400/60 flex-shrink-0">
                      <img src="/images/slimane-avatar.jpeg" alt="Slimane" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold">Bac SM · 15.4/20 · Mention Bien</div>
                      <div className="text-navy-400 text-[11px]">Casablanca · Budget 3000-8000 MAD/mois</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Match cards */}
                  {[
                    { school: "ENSIAS", city: "Rabat", typeKey: "type.engineering", prob: 91, color: "emerald" },
                    { school: "INPT", city: "Rabat", typeKey: "type.engineering", prob: 84, color: "blue" },
                    { school: "ENCG Casablanca", city: "Casablanca", typeKey: "type.business", prob: 78, color: "gold" },
                  ].map((m, i) => (
                    <motion.div
                      key={m.school}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                      className="flex items-center gap-4 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-gold-500/20 rounded-2xl px-4 py-3 transition-all duration-200 group cursor-default"
                    >
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-heading font-bold text-xs ${
                        m.color === "emerald" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" :
                        m.color === "blue" ? "bg-blue-500/15 text-blue-300 border border-blue-500/20" :
                        "bg-gold-500/15 text-gold-300 border border-gold-500/20"
                      }`}>
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm">{m.school}</div>
                        <div className="text-navy-400 text-[11px]">{t(m.typeKey)} · {m.city}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-heading font-bold text-base ${
                          m.prob >= 85 ? "text-emerald-400" : m.prob >= 75 ? "text-gold-300" : "text-amber-400"
                        }`}>{m.prob}%</div>
                        <div className="text-[10px] text-navy-500">{t("home.mockup.match")}</div>
                      </div>
                      <div className="w-1.5 h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                        <motion.div
                          className={`w-full rounded-full ${m.prob >= 85 ? "bg-emerald-400" : m.prob >= 75 ? "bg-gold-400" : "bg-amber-400"}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${m.prob}%` }}
                          transition={{ delay: 1.1 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                          style={{ originY: 1 }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Bottom hint */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-navy-500">{t("home.mockup.more", { count: 12 })}</span>
                    <span className="text-[11px] text-gold-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                      {t("home.mockup.realtime")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick utility actions — under the Best Match mockup */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/8 border border-white/15 text-white text-sm font-semibold rounded-full hover:bg-white/15 hover:border-gold-400/40 transition-all duration-300 backdrop-blur-sm touch-target"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t("hero.quick.new_gen")}
            </Link>
            <button
              type="button"
              onClick={() => { (window as any).__slimaneOpen?.(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500/15 border border-gold-500/30 text-gold-200 text-sm font-semibold rounded-full hover:bg-gold-500/25 transition-all duration-300 backdrop-blur-sm touch-target"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t("hero.quick.talk_slimane")}
            </button>
          </motion.div>

          {/* Comparator callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-4 flex justify-center"
          >
            <Link
              to="/comparer"
              className="group inline-flex items-center gap-3 px-5 py-3 bg-white/8 border border-white/15 rounded-2xl backdrop-blur-sm hover:bg-white/12 hover:border-gold-400/40 transition-all duration-300"
            >
              <span className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-lg flex-shrink-0">⚖️</span>
              <span className="text-left">
                <span className="block text-white text-sm font-bold">{t("hero.compare.title")}</span>
                <span className="block text-white/60 text-xs">{t("hero.compare.subtitle")}</span>
              </span>
              <svg className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Floating school tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {["EMI", "ENSIAS", "EHTP", "UM6P", "UIR", "ISCAE", "HEM", "INPT", "ENCG", "IAV", "ENSA"].map((school, i) => (
              <Link
                key={school}
                to={`/ecoles/${HERO_SCHOOL_SLUGS[school] ?? school.toLowerCase()}`}
                className="px-3 py-1 bg-white/8 border border-white/15 rounded-full text-xs text-white/75 font-medium hover:bg-white/15 hover:border-gold-500/40 hover:text-gold-300 transition-all duration-300 backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {school}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Trust bar */}
        <div className="relative border-t border-white/8 bg-navy-950/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>{t("hero.trust.cndp")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span>{t("hero.trust.official")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇲🇦</span>
                <span>{t("hero.trust.morocco")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span>{t("hero.trust.fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────────────────────── */}
      <section className="bg-parchment border-b border-gold-100/60">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-heading text-4xl md:text-5xl font-bold text-navy-800 group-hover:text-gold-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-navy-400 mt-1 font-medium">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">{t("how.label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-4">
              {t("how.title")}
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto text-base leading-relaxed">
              {t("how.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-navy-200 via-gold-300 to-emerald-300 z-0" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl border border-gold-100/60 overflow-hidden hover:shadow-xl hover:shadow-navy-900/5 hover:border-gold-200 transition-all duration-300 h-full">
                  {/* Step illustration */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={step.image} alt={t(step.titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-heading font-bold text-sm shadow-lg`}>
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-navy-800 mb-3">{t(step.titleKey)}</h3>
                    <p className="text-navy-400 text-sm leading-relaxed">{t(step.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-full font-bold hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg shadow-navy-900/15 hover:shadow-navy-900/30 touch-target"
            >
              {t("how.cta")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SCHOOLS SHOWCASE ───────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-sm font-bold uppercase tracking-[0.15em]">{t("schools.section.label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
              {t("schools.section.title")}
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">{t("schools.section.title.highlight")}</span>
            </h2>
            <p className="text-navy-300 max-w-xl mx-auto">
              {t("schools.section.subtitle")}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SCHOOL_TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === f.key
                    ? "bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20"
                    : "bg-white/8 text-navy-300 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>

          {/* Schools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.slice(0, 9).map((school, i) => {
              const tierColors = TIER_COLORS[school.tier];
              return (
                <Link key={school.slug} to={`/ecoles/${school.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-gold-500/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <SchoolLogo school={school} size="sm" />
                        <div>
                          <div className="text-white font-bold text-sm leading-tight group-hover:text-gold-300 transition-colors">{school.shortName}</div>
                          <div className="text-navy-400 text-xs mt-0.5">{school.city}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                        {TIER_LABELS[school.tier]}
                      </span>
                    </div>

                    <p className="text-navy-400 text-xs leading-relaxed mb-4 line-clamp-2">{school.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {school.tracks.slice(0, 4).map((track) => (
                        <span key={track} className="text-[10px] px-2 py-0.5 bg-navy-800/80 text-navy-300 rounded-full border border-navy-700/50">
                          Bac {track}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/ecoles"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/8 hover:border-gold-500/40 transition-all"
            >
              {t("schools.section.see_all", { count: SCHOOLS.length })}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BAC TRACK EXPLORER ─────────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">{t("tracks.label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-4">
              {t("tracks.title")}
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              {t("tracks.subtitle")}
            </p>
          </div>

          {/* Track selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-10">
            {BAC_TRACKS.map((track) => (
              <button
                key={track.key}
                onClick={() => setActiveTrack(track.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-semibold transition-all duration-200 text-sm ${
                  activeTrack === track.key
                    ? `bg-gradient-to-br ${track.color} text-white border-transparent shadow-lg`
                    : "bg-white border-parchment text-navy-600 hover:border-gold-200 hover:bg-gold-50/50"
                }`}
              >
                <span className="text-2xl">{track.icon}</span>
                <span className="text-center leading-tight text-xs font-bold">{track.key}</span>
              </button>
            ))}
          </div>

          {/* Selected track info */}
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <span className="text-gold-600 font-semibold">
                {BAC_TRACKS.find((tr) => tr.key === activeTrack)?.icon} Bac{" "}
                {activeTrack} — {t(`track.${activeTrack}`)}
              </span>
              <h3 className="font-heading text-2xl font-bold text-navy-800 mt-1">
                {t("tracks.top")}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trackSchools.map((school, i) => {
                const tierColors = TIER_COLORS[school.tier];
                return (
                  <Link key={school.slug} to={`/ecoles/${school.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative bg-white rounded-2xl border p-5 hover:shadow-lg hover:border-gold-300 transition-all duration-300 group ${tierColors.border}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tierColors.bg}`}>
                          {school.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-navy-800 text-sm leading-tight truncate group-hover:text-gold-700 transition-colors">{school.shortName}</div>
                          <div className="text-xs text-navy-400 mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {school.city}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                          {TIER_LABELS[school.tier]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-400">
                          {t("school.quick.min_grade")} : <strong className="text-navy-700">{school.minGrade}/20</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${school.access === "public" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {school.access === "public" ? t("access.public") : school.access === "semi-public" ? t("access.semi-public") : t("access.private")}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/ecoles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all duration-300 touch-target shadow-md"
            >
              {t("tracks.cta.explore")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-gold-300 text-gold-700 rounded-full font-bold hover:bg-gold-50 transition-all duration-300 touch-target"
            >
              {t("tracks.cta.recommendations")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CALENDRIER DES INSCRIPTIONS ────────────────────────────────────── */}
      <DeadlinesSection />

      {/* ─── SLIMANE INTRODUCTION ───────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-navy-800 to-navy-900 relative overflow-hidden">
        {/* Hero photo as atmospheric background on large screens */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/images/hero-photo.jpeg"
            alt=""
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1/2 object-cover object-right opacity-[0.12] hidden lg:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/0 via-navy-800/80 to-navy-800/100" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Slimane presentation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold-400 text-sm font-bold uppercase tracking-[0.15em] block mb-4">{t("slimane.section.label")}</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                {t("slimane.section.heading")} <span className="text-gold-300">Slimane</span>
              </h2>
              <p className="text-navy-200 text-base leading-relaxed mb-6">
                {t("slimane.section.desc")}
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "🎯", textKey: "slimane.feature.profile" },
                  { icon: "🏛️", textKey: "slimane.feature.schools", count: SCHOOLS.length },
                  { icon: "💬", textKey: "slimane.feature.languages" },
                  { icon: "🗺️", textKey: "slimane.feature.city" },
                ].map((item) => (
                  <div key={item.textKey} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-navy-200 text-sm">{t(item.textKey, { count: item.count })}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to="/orientation"
                  onClick={() => { useFormStore.getState().reset(); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-gold-500/25 transition-all touch-target"
                >
                  {t("cta.chat_slimane")}
                </Link>
                <button
                  onClick={() => {
                    (window as any).__slimaneOpen?.();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-medium text-sm hover:bg-white/8 transition-all touch-target"
                >
                  {t("slimane.open_chat")}
                </button>
              </div>
            </motion.div>

            {/* Right: Chat preview mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-cream rounded-3xl shadow-2xl overflow-hidden border border-gold-200/20 max-w-sm mx-auto">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-navy-800 to-navy-700 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-2 border-gold-400">
                    <img src="/images/slimane-avatar.jpeg" alt="Slimane" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-gold-300 text-sm">Slimane</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      {t("slimane.status.online")}
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-3 bg-parchment/50">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-gold-400"><img src="/images/slimane-avatar.jpeg" alt="S" className="w-full h-full object-cover object-top" /></div>
                    <div className="bg-white border border-gold-100 rounded-2xl rounded-tl-md px-3 py-2 text-xs text-navy-700 shadow-sm max-w-[200px]">
                      {t("home.mockup.chat.slimane1")}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-navy-700 text-white rounded-2xl rounded-tr-md px-3 py-2 text-xs max-w-[160px]">
                      {t("home.mockup.chat.user1")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-gold-400"><img src="/images/slimane-avatar.jpeg" alt="S" className="w-full h-full object-cover object-top" /></div>
                    <div className="bg-white border border-gold-100 rounded-2xl rounded-tl-md px-3 py-2 text-xs text-navy-700 shadow-sm max-w-[210px]">
                      {t("home.mockup.chat.slimane2")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-9">
                    {["Casablanca", "Rabat", "Fès"].map((c) => (
                      <span key={c} className="px-2 py-1 bg-gold-50 border border-gold-200 text-navy-700 text-[10px] rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Input */}
                <div className="p-3 bg-white border-t border-gold-100 flex gap-2">
                  <div className="flex-1 px-3 py-2 rounded-xl border border-gold-200 text-xs text-navy-400 bg-cream">
                    {t("home.mockup.chat.placeholder")}
                  </div>
                  <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-300 text-sm font-medium mb-8">
              ✦ {t("hero.final.badge")}
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t("hero.final.title")}
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                {t("hero.final.title.highlight")}
              </span>
            </h2>
            <p className="text-navy-200 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("hero.final.desc", { count: SCHOOLS.length })}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/orientation"
                onClick={() => { useFormStore.getState().reset(); }}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-lg shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-105 transition-all duration-300 touch-target"
              >
                {t("nav.start.mobile")}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="text-navy-400 text-sm mt-6">
              {t("hero.final.disclaimer")}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── DEADLINES SECTION ──────────────────────────────────────────────────────
const DEADLINES = [
  {
    id: "bac",
    label: "Résultats Bac",
    sublabel: "Résultats officiels Tawjihi 2026",
    date: new Date("2026-06-17T08:00:00"),
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: "🎓",
    link: "https://bac.men.gov.ma",
    linkLabel: "men.gov.ma",
  },
  {
    id: "cursussup",
    label: "cursussup.gov.ma",
    sublabel: "Phase 1 — inscriptions ENSA, ENCG, ENSAM...",
    date: new Date("2026-07-15T23:59:00"),
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "🖥️",
    link: "https://cursussup.gov.ma",
    linkLabel: "cursussup.gov.ma",
  },
  {
    id: "tafem",
    label: "TAFEM — ENCG",
    sublabel: "Concours d'accès aux 12 campus ENCG",
    date: new Date("2026-08-22T09:00:00"),
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: "📝",
    link: "https://tafem.ma",
    linkLabel: "tafem.ma",
  },
  {
    id: "fmp",
    label: "FMP Médecine",
    sublabel: "Concours national d'entrée en médecine",
    date: new Date("2026-08-08T08:00:00"),
    color: "from-rose-500 to-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    icon: "🩺",
    link: null,
    linkLabel: null,
  },
  {
    id: "privees",
    label: "Écoles privées",
    sublabel: "Dossiers UM6P, UIR, HEM, AUI",
    date: new Date("2026-07-31T23:59:00"),
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-800",
    icon: "🏛️",
    link: null,
    linkLabel: null,
  },
];

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { days, hours, mins };
}

function DeadlineCard({ dl }: { dl: typeof DEADLINES[0] }) {
  const countdown = useCountdown(dl.date);
  const passed = !countdown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${dl.bg} border ${dl.border} rounded-2xl p-5 flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{dl.icon}</span>
          <div>
            <div className={`font-bold text-sm ${dl.text}`}>{dl.label}</div>
            <div className="text-[11px] text-navy-500 mt-0.5 leading-tight">{dl.sublabel}</div>
          </div>
        </div>
        {passed && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
            Passé
          </span>
        )}
      </div>

      <div className="text-[11px] text-navy-500">
        {dl.date.toLocaleDateString("fr-MA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>

      {!passed && countdown && (
        <div className="flex gap-2">
          {[
            { v: countdown.days, u: "j" },
            { v: countdown.hours, u: "h" },
            { v: countdown.mins, u: "min" },
          ].map(({ v, u }) => (
            <div key={u} className={`flex-1 text-center py-2 rounded-xl bg-gradient-to-br ${dl.color} text-white`}>
              <div className="font-heading font-bold text-lg leading-none">{v}</div>
              <div className="text-[9px] opacity-80 mt-0.5">{u}</div>
            </div>
          ))}
        </div>
      )}

      {dl.link && (
        <a
          href={dl.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[11px] font-semibold ${dl.text} hover:underline flex items-center gap-1`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {dl.linkLabel}
        </a>
      )}
    </motion.div>
  );
}

function DeadlinesSection() {
  const { data } = useQuery({
    queryKey: ["deadlines"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/public/deadlines`);
      if (!res.ok) return null;
      return res.json() as Promise<{ deadlines: Array<{ id: string; date: string; sublabel?: string }>; source?: string }>;
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const merged = DEADLINES.map((dl) => {
    const apiEntry = data?.deadlines?.find((d) => d.id === dl.id);
    if (!apiEntry) return dl;
    return { ...dl, date: new Date(apiEntry.date), sublabel: apiEntry.sublabel ?? dl.sublabel };
  });

  const isAiUpdated = data?.source === "auto";

  return (
    <section className="py-20 bg-parchment border-y border-gold-100/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-rose-600 text-sm font-bold uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Dates limites 2026
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-800 mt-3 mb-3">
            Calendrier des inscriptions
          </h2>
          <p className="text-navy-400 max-w-xl mx-auto text-sm">
            Les dates clés pour ta candidature 2026–2027. Ne rate aucune échéance.
          </p>
          {isAiUpdated && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-navy-400 mt-3 bg-navy-50 border border-navy-100 px-3 py-1 rounded-full">
              <svg className="w-3 h-3 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dates mises à jour automatiquement par IA
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {merged.map((dl) => <DeadlineCard key={dl.id} dl={dl} />)}
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-navy-400">
            Dates indicatives — vérifiez toujours les dates officielles sur les sites des établissements.
          </p>
        </div>
      </div>
    </section>
  );
}
