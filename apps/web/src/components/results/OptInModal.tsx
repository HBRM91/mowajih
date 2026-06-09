import { motion, AnimatePresence } from "framer-motion";

interface Props {
  universityName: string;
  onClose: () => void;
}

export default function OptInModal({ universityName, onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 280 }}
          className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gold-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 px-6 pt-6 pb-5 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-gold-500/20">
              <svg className="w-7 h-7 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-1">Intérêt enregistré</h3>
            <p className="text-navy-300 text-xs">
              <strong className="text-gold-300">{universityName}</strong>
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4 text-sm text-navy-700 leading-relaxed">
              <p className="font-semibold text-navy-800 mb-1">Prochaine étape</p>
              <p>
                Pour transmettre ton profil à <strong>{universityName}</strong>, renseigne tes coordonnées dans le formulaire d'orientation (prénom, nom, email) — notre équipe prendra contact avec l'établissement en ton nom.
              </p>
            </div>

            <div className="text-xs text-navy-400 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Conformément à la Loi 09-08 (CNDP), tes données ne sont partagées qu'avec ton accord explicite.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm hover:from-gold-400 hover:to-gold-300 transition shadow-md shadow-gold-500/20"
            >
              Compris — retour aux résultats
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.__slimaneOpen?.();
              }}
              className="w-full py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition"
            >
              Poser une question à Slimane
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

declare global {
  interface Window {
    __slimaneOpen?: () => void;
  }
}
