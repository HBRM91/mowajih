import { motion } from "framer-motion";

export default function OptInModal({ universityName, onClose }: { universityName: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="bg-cream w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gold-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-heading text-xl font-bold text-navy-800 text-center mb-2">Dossier transmis !</h3>
        <p className="text-sm text-navy-400 text-center mb-6">
          Ton profil anonymisé a été envoyé à <strong className="text-navy-700">{universityName}</strong>. Ils te contacteront si ton profil les intéresse.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold hover:from-navy-800 hover:to-navy-900 transition"
        >
          Super, merci !
        </button>
      </motion.div>
    </motion.div>
  );
}
