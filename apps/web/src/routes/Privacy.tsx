import { motion } from "framer-motion";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-navy-800 mb-4 pb-2 border-b border-gold-100">{title}</h2>
      <div className="space-y-3 text-navy-600 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Documents légaux
        </div>
        <h1 className="font-heading text-4xl font-bold text-navy-900">Politique de Confidentialité</h1>
        <p className="text-navy-400 text-sm mt-2">
          Dernière mise à jour : Juin 2026 · JAD2 TAWJIH — Division Éducation de JAD2 Advisory
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex items-start gap-3">
        <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Outil d'orientation indépendant.</strong> JAD2 TAWJIH n'est partenaire d'aucun établissement présenté. Les résultats sont indicatifs et non contractuels. Vérifiez toujours les conditions d'admission officielles sur le site de l'établissement ou sur <a href="https://cursussup.gov.ma" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">cursussup.gov.ma</a>.
        </p>
      </div>

      <Section title="1. Identité du responsable de traitement">
        <p>
          Le traitement de vos données personnelles est effectué par <strong>JAD2 Advisory</strong>, division Éducation, responsable de la plateforme JAD2 TAWJIH.
        </p>
        <p>Contact DPO : <a href="mailto:contact@jad2tawjih.ma" className="text-gold-600 hover:text-gold-700">contact@jad2tawjih.ma</a></p>
      </Section>

      <Section title="2. Données collectées">
        <p>JAD2 TAWJIH collecte uniquement les données nécessaires à la fourniture du service d'orientation :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Données académiques :</strong> filière Baccalauréat, notes par matière, mention</li>
          <li><strong>Données de localisation :</strong> ville et région (non précise)</li>
          <li><strong>Données socio-économiques :</strong> tranche de budget mensuel (anonymisée)</li>
          <li><strong>Données de contact (optionnelles) :</strong> prénom, nom, email — uniquement si vous les renseignez volontairement pour la génération d'un dossier personnalisé</li>
        </ul>
        <p>
          <strong>Données non collectées :</strong> numéro CIN, adresse postale, numéro de téléphone, données de paiement, données biométriques.
        </p>
      </Section>

      <Section title="3. Finalités du traitement">
        <ul className="list-disc pl-5 space-y-1">
          <li>Calcul algorithmique des correspondances école-profil</li>
          <li>Génération de dossiers de candidature personnalisés (si consentement)</li>
          <li>Amélioration de la qualité des recommandations</li>
          <li>Statistiques agrégées et anonymisées sur les tendances d'orientation</li>
        </ul>
        <p>
          <strong>Base légale :</strong> Consentement explicite (art. 4 Loi 09-08) recueilli lors de l'étape 4 du formulaire.
        </p>
      </Section>

      <Section title="4. Durée de conservation">
        <p>
          Vos données sont conservées <strong>24 mois maximum</strong> à compter de la date de soumission, conformément à la Loi 09-08. Passé ce délai, elles sont automatiquement supprimées de nos serveurs.
        </p>
        <p>
          Les données de contact (nom, email) peuvent être supprimées à tout moment sur simple demande.
        </p>
      </Section>

      <Section title="5. Partage des données">
        <p>
          Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles peuvent être partagées avec des établissements d'enseignement supérieur <strong>uniquement dans les conditions suivantes</strong> :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Vous avez explicitement coché la case d'opt-in sur la page des résultats</li>
          <li>L'établissement concerné a signé une convention de traitement des données avec JAD2 Advisory</li>
          <li>L'établissement s'engage à n'utiliser les données qu'aux fins de recrutement académique</li>
        </ul>
        <p>
          <strong>Sans opt-in :</strong> seules des données anonymisées et agrégées (filière, mention, région) sont accessibles aux établissements.
        </p>
      </Section>

      <Section title="6. Sécurité">
        <ul className="list-disc pl-5 space-y-1">
          <li>Toutes les communications sont chiffrées via HTTPS/TLS 1.3</li>
          <li>Les données sont hébergées dans des datacenters certifiés ISO 27001 (infrastructure Cloudflare)</li>
          <li>L'accès administrateur est protégé par authentification à facteurs multiples</li>
          <li>Un journal d'audit complet enregistre tous les accès aux données personnelles</li>
        </ul>
      </Section>

      <Section title="7. Vos droits (Loi 09-08)">
        <p>Conformément à la Loi 09-08, vous disposez des droits suivants :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
          <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
        </ul>
        <p>
          Pour exercer ces droits : <a href="mailto:contact@jad2tawjih.ma" className="text-gold-600 hover:text-gold-700">contact@jad2tawjih.ma</a>. Réponse sous 30 jours.
        </p>
        <p>
          En cas de litige, vous pouvez saisir la <strong>CNDP</strong> (Commission Nationale de contrôle de la Protection des Données Personnelles) : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">www.cndp.ma</a>
        </p>
      </Section>

      <Section title="8. Conditions Générales d'Utilisation">
        <p>
          L'utilisation de JAD2 TAWJIH est <strong>gratuite et sans inscription</strong> pour les étudiants. En utilisant le service, vous acceptez les présentes conditions.
        </p>
        <p>
          <strong>Limitation de responsabilité :</strong> JAD2 TAWJIH fournit des recommandations à titre indicatif basées sur des données statistiques agrégées. JAD2 Advisory ne peut être tenu responsable des décisions d'admission prises par les établissements, ni des conséquences de l'orientation choisie par l'utilisateur.
        </p>
        <p>
          <strong>Propriété intellectuelle :</strong> Le code, l'algorithme de recommandation, les contenus et la marque "JAD2 TAWJIH" sont la propriété exclusive de JAD2 Advisory. Toute reproduction ou utilisation commerciale sans autorisation est interdite.
        </p>
        <p>
          <strong>Droit applicable :</strong> Les présentes CGU sont soumises au droit marocain. Tout litige sera soumis à la compétence exclusive des tribunaux de Casablanca.
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>
          JAD2 TAWJIH utilise des cookies techniques strictement nécessaires au fonctionnement du service (mémorisation de votre progression dans le formulaire). Aucun cookie de tracking publicitaire ou analytique tiers n'est utilisé.
        </p>
      </Section>

      <div className="mt-12 p-5 bg-navy-50 rounded-2xl border border-navy-100 text-center">
        <p className="text-xs text-navy-400">
          © {new Date().getFullYear()} JAD2 Advisory · Division Éducation · contact@jad2tawjih.ma
        </p>
        <p className="text-xs text-navy-300 mt-1">
          Conforme Loi 09-08 (CNDP Maroc) · Outil d'orientation indépendant — Non affilié aux établissements présentés
        </p>
      </div>
    </motion.div>
  );
}
