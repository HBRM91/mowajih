import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGameStore } from "../stores/gameStore";
import { useFormStore } from "../stores/formStore";
import { useState, useRef } from "react";
import { SCHOOLS, getTopSchoolsByTrack, TIER_LABELS, TIER_COLORS } from "../data/schools";

const BAC_TRACKS = [
  { key: "SM", label: "Sciences Maths", icon: "🧮", color: "from-blue-600 to-blue-800", light: "bg-blue-50 border-blue-200 text-blue-800" },
  { key: "PC", label: "Physique-Chimie", icon: "⚛️", color: "from-indigo-600 to-indigo-800", light: "bg-indigo-50 border-indigo-200 text-indigo-800" },
  { key: "SVT", label: "Sciences Vie & Terre", icon: "🧬", color: "from-emerald-600 to-emerald-800", light: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { key: "SE", label: "Sciences Économiques", icon: "📊", color: "from-amber-600 to-amber-800", light: "bg-amber-50 border-amber-200 text-amber-800" },
  { key: "SH", label: "Sciences Humaines", icon: "📚", color: "from-rose-600 to-rose-800", light: "bg-rose-50 border-rose-200 text-rose-800" },
  { key: "STI", label: "Sciences Techniques", icon: "🔧", color: "from-slate-600 to-slate-800", light: "bg-slate-50 border-slate-200 text-slate-800" },
  { key: "L", label: "Lettres", icon: "✍️", color: "from-purple-600 to-purple-800", light: "bg-purple-50 border-purple-200 text-purple-800" },
];

const STATS = [
  { value: `${SCHOOLS.length}+`, label: "Établissements référencés", icon: "🏛️" },
  { value: "12", label: "Régions du Maroc", icon: "🇲🇦" },
  { value: "7", label: "Filières Bac couvertes", icon: "🎓" },
  { value: "100%", label: "Gratuit & indépendant", icon: "✅" },
];

const SCHOOL_TYPE_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "engineering", label: "Ingénierie" },
  { key: "business", label: "Business" },
  { key: "medicine", label: "Médecine" },
  { key: "preparatory", label: "Prépas" },
  { key: "university", label: "Universités" },
];

const FEATURED_SCHOOLS = SCHOOLS.filter((s) =>
  ["emi", "ehtp", "ensias", "inpt", "um6p", "iscae", "uir", "hem", "mundiapolis", "iav-hassan-ii", "al-akhawayn", "insea", "ena-rabat", "fm-rabat", "cpge-moulay-youssef", "emsi", "encg-casablanca"].includes(s.slug)
);

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🎯",
    title: "Choisis ta filière",
    desc: "Indique ton Bac, tes notes et ta ville. 2 minutes, top chrono.",
    color: "from-navy-700 to-navy-800",
    xp: "+10 XP",
  },
  {
    step: "02",
    icon: "🤖",
    title: "Slimane t'analyse",
    desc: "Notre IA calcule ta probabilité d'admission dans chaque école de ta région.",
    color: "from-gold-600 to-gold-700",
    xp: "+15 XP",
  },
  {
    step: "03",
    icon: "🏆",
    title: "Découvre tes matchs",
    desc: "Tu reçois une liste personnalisée d'écoles avec les chances d'admission et les coûts.",
    color: "from-emerald-600 to-emerald-700",
    xp: "+30 XP",
  },
];

const GAMIFICATION_BADGES = [
  { icon: "🌟", name: "Nouveau", desc: "Début de l'aventure" },
  { icon: "🔍", name: "Explorateur", desc: "Questionnaire complété" },
  { icon: "🎯", name: "Matcheur", desc: "Premier match trouvé" },
  { icon: "🔓", name: "Héros", desc: "Dossier transmis" },
  { icon: "♟️", name: "Stratège", desc: "3 écoles comparées" },
  { icon: "🏅", name: "Champion", desc: "Niveau 5 atteint" },
];

export default function Home() {
  const checkStreak = useGameStore((s) => s.checkStreak);
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
        className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white overflow-hidden"
      >
        {/* Animated background rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-gold-500/8 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-gold-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-400/12 rounded-full animate-[spin_25s_linear_infinite]" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/5 rounded-full blur-[80px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-navy-400/10 rounded-full blur-[80px]" />
          {/* Floating stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
              style={{
                top: `${10 + (i * 17 % 80)}%`,
                left: `${5 + (i * 23 % 90)}%`,
                animation: `pulse ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 text-center">

          {/* Urgency badge — tawjihi season */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/25 rounded-full text-gold-300 text-sm font-medium">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              JAD2 Advisory · Division Orientation
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-300 text-sm font-bold">
              🎓 Résultats Tawjihi 2026 — Commence ton orientation maintenant
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
          >
            Ton école idéale
            <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
              au Maroc
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-navy-200 max-w-2xl mx-auto mb-3 leading-relaxed"
          >
            Slimane, ton conseiller IA, analyse ton profil Bac et te propose les meilleures écoles — ENSA, ENCG, ISCAE, UIR, UM6P et {SCHOOLS.length}+ autres.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm text-navy-400 mb-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />100% Gratuit</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Conforme CNDP</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Anonyme</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />Outil indépendant &amp; non affilié</span>
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
              onClick={() => { useFormStore.getState().reset(); checkStreak(); }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-base shadow-lg shadow-gold-500/25 hover:shadow-gold-500/50 hover:scale-105 transition-all duration-300 touch-target"
            >
              <span>Découvrir mes écoles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("how-it-works");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/8 hover:border-white/40 transition-all duration-300 touch-target backdrop-blur-sm"
            >
              Comment ça marche ?
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>

          {/* Floating school tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-2"
          >
            {["EMI", "ENSIAS", "EHTP", "UM6P", "UIR", "ISCAE", "HEM", "INPT", "ENCG", "IAV", "ENSA"].map((school, i) => (
              <span
                key={school}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-navy-300 font-medium hover:bg-white/10 hover:border-gold-500/30 hover:text-gold-300 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {school}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Trust bar */}
        <div className="relative border-t border-white/8 bg-navy-950/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-navy-300">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>Données anonymisées CNDP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span>Données officielles Tawjihi & cursussup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇲🇦</span>
                <span>Expertise 100% Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span>Résultats en 2 minutes</span>
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
                key={stat.label}
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
                <div className="text-sm text-navy-400 mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">Processus</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-4">
              Ton avenir en 3 étapes
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto text-base leading-relaxed">
              Un processus simple et gamifié. Moins de 3 minutes pour obtenir ton plan d'orientation complet.
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
                <div className="bg-white rounded-3xl border border-gold-100/60 p-8 hover:shadow-xl hover:shadow-navy-900/5 hover:border-gold-200 transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-heading font-bold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-full">
                      {step.xp}
                    </span>
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{step.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-navy-800 mb-3">{step.title}</h3>
                  <p className="text-navy-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); checkStreak(); }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-full font-bold hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg shadow-navy-900/15 hover:shadow-navy-900/30 touch-target"
            >
              Commencer maintenant — Gratuit
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
            <span className="text-gold-500 text-sm font-bold uppercase tracking-[0.15em]">Établissements</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
              Les meilleures écoles
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">du Maroc</span>
            </h2>
            <p className="text-navy-300 max-w-xl mx-auto">
              De l'école d'ingénieurs publique aux universités privées internationales — toutes analysées pour ton profil.
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
                {f.label}
              </button>
            ))}
          </div>

          {/* Schools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.slice(0, 9).map((school, i) => {
              const tierColors = TIER_COLORS[school.tier];
              return (
                <motion.div
                  key={school.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:border-gold-500/30 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center text-xl">
                        {school.icon}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm leading-tight">{school.shortName}</div>
                        <div className="text-navy-400 text-xs mt-0.5">{school.city}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                      {TIER_LABELS[school.tier]}
                    </span>
                  </div>

                  <p className="text-navy-400 text-xs leading-relaxed mb-4 line-clamp-2">{school.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {school.tracks.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-navy-800/80 text-navy-300 rounded-full border border-navy-700/50">
                        Bac {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-navy-400 text-sm">
              + {SCHOOLS.length - filteredSchools.length} autres établissements analysés dans notre système
            </p>
          </div>
        </div>
      </section>

      {/* ─── BAC TRACK EXPLORER ─────────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">Filières Bac</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-4">
              Quelles écoles pour ton Bac ?
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              Chaque filière Bac ouvre des portes spécifiques. Clique sur ta filière pour voir les écoles accessibles.
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
                {BAC_TRACKS.find((t) => t.key === activeTrack)?.icon} Bac{" "}
                {activeTrack} — {BAC_TRACKS.find((t) => t.key === activeTrack)?.label}
              </span>
              <h3 className="font-heading text-2xl font-bold text-navy-800 mt-1">
                Top écoles accessibles
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trackSchools.map((school, i) => {
                const tierColors = TIER_COLORS[school.tier];
                return (
                  <motion.div
                    key={school.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative bg-white rounded-2xl border p-5 hover:shadow-lg transition-all duration-300 ${tierColors.border}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tierColors.bg}`}>
                        {school.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-navy-800 text-sm leading-tight truncate">{school.shortName}</div>
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
                        Note min: <strong className="text-navy-700">{school.minGrade}/20</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${school.access === "public" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {school.access === "public" ? "Public" : school.access === "semi-public" ? "Semi-pub." : "Privé"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/orientation"
              onClick={() => { useFormStore.getState().reset(); checkStreak(); }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all duration-300 touch-target shadow-md"
            >
              Voir toutes mes écoles personnalisées
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SLIMANE INTRODUCTION ───────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-navy-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
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
              <span className="text-gold-400 text-sm font-bold uppercase tracking-[0.15em] block mb-4">Ton conseiller personnel</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Rencontre <span className="text-gold-300">Slimane</span>
              </h2>
              <p className="text-navy-200 text-base leading-relaxed mb-6">
                Slimane est ton conseiller académique IA, disponible 24h/24. Il connaît tous les établissements marocains, les seuils d'admission, les frais de scolarité et les débouchés de chaque filière.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "🎯", text: "Analyse ton profil Bac en temps réel" },
                  { icon: "🏛️", text: `Connaît ${SCHOOLS.length}+ établissements marocains` },
                  { icon: "💬", text: "Répond à toutes tes questions en FR/AR/EN" },
                  { icon: "🗺️", text: "Guide selon ta ville et ton budget" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-navy-200 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to="/orientation"
                  onClick={() => { useFormStore.getState().reset(); checkStreak(); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-gold-500/25 transition-all touch-target"
                >
                  Parler à Slimane
                </Link>
                <button
                  onClick={() => {
                    (window as any).__slimaneOpen?.();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-medium text-sm hover:bg-white/8 transition-all touch-target"
                >
                  Ouvrir le chat
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
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center font-bold text-navy-900 shadow-lg">
                    S
                  </div>
                  <div>
                    <div className="font-heading font-bold text-gold-300 text-sm">Slimane</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      En ligne · Conseiller IA
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-3 bg-parchment/50">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-navy-900">S</div>
                    <div className="bg-white border border-gold-100 rounded-2xl rounded-tl-md px-3 py-2 text-xs text-navy-700 shadow-sm max-w-[200px]">
                      Salam ! Je suis Slimane 👋 Quelle est ta filière Bac ?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-navy-700 text-white rounded-2xl rounded-tr-md px-3 py-2 text-xs max-w-[160px]">
                      Bac SM, mention Bien (14.7)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-navy-900">S</div>
                    <div className="bg-white border border-gold-100 rounded-2xl rounded-tl-md px-3 py-2 text-xs text-navy-700 shadow-sm max-w-[210px]">
                      Excellent ! 🎯 Avec 14.7 en SM, tu as accès à ENSIAS, INPT, ENSA, ENCG... Dis-moi ta ville pour affiner !
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
                    Écris ta question...
                  </div>
                  <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating XP badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900 px-3 py-2 rounded-2xl shadow-xl border border-gold-300 text-sm font-bold"
              >
                +25 XP ✨
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── GAMIFICATION ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">Gamification</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-4">
              L'orientation, c'est
              <br />
              <span className="bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">un jeu sérieux</span>
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              Gagne des XP à chaque étape, débloque des badges et monte en niveau. L'avenir n'a jamais été aussi fun à construire.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* XP Level preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center text-2xl font-heading font-bold text-navy-900 shadow-lg">
                  3
                </div>
                <div>
                  <div className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-1">Niveau actuel</div>
                  <div className="font-heading text-xl font-bold text-gold-300">Explorateur</div>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-navy-300">Progression</span>
                <span className="text-gold-300 font-bold">120 / 200 XP</span>
              </div>
              <div className="h-3 bg-navy-950 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { action: "Filière Bac choisie", xp: "+10 XP" },
                  { action: "Notes renseignées", xp: "+15 XP" },
                  { action: "Profil complété", xp: "+15 XP" },
                  { action: "Résultats consultés", xp: "+30 XP" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center justify-between bg-navy-700/50 rounded-xl p-3">
                    <span className="text-xs text-navy-300">{item.action}</span>
                    <span className="text-xs font-bold text-gold-400">{item.xp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-2xl font-bold text-navy-800 mb-6">
                Badges à débloquer
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {GAMIFICATION_BADGES.map((badge, i) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-white border border-gold-100 rounded-2xl p-4 text-center hover:border-gold-300 hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="font-bold text-navy-800 text-sm">{badge.name}</div>
                    <div className="text-xs text-navy-400 mt-1 leading-tight">{badge.desc}</div>
                  </motion.div>
                ))}
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
              ✦ Outil d'orientation 100% indépendant · Gratuit
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Prêt à découvrir
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                ton école idéale ?
              </span>
            </h2>
            <p className="text-navy-200 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Gratuit, anonyme, et ça prend 2 minutes. Slimane est prêt à t'aider à trouver ta voie parmi les {SCHOOLS.length}+ établissements du Maroc.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/orientation"
                onClick={() => { useFormStore.getState().reset(); checkStreak(); }}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-lg shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-105 transition-all duration-300 touch-target"
              >
                Commencer mon orientation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="text-navy-400 text-sm mt-6">
              Aucune inscription requise · Données anonymisées · Résultats immédiats
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
