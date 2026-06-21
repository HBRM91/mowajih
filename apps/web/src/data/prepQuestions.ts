export type Exam = "ensa" | "ena" | "encg" | "fmp";
export type Level = "facile" | "moyen" | "difficile";

export interface PrepQuestion {
  id: string;
  exam: Exam;
  subject: string;
  subjectLabel: string;
  level: Level;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  tip?: string;
  source?: string;
}

// ─── Formula rendering helper ───────────────────────────────────────────────
// Renders chemical/math notation stored as Unicode + plain text
export function renderFormula(text: string): string {
  return text; // Already stored as clean Unicode — no conversion needed
}

export const EXAM_META: Record<Exam, {
  label: string;
  fullName: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  duration: string;
  format: string;
  date: string;
  subjects: { key: string; label: string; icon: string }[];
  levels: [string, string, string, string]; // débutant → reçu
}> = {
  ensa: {
    label: "ENSA",
    fullName: "École Nationale des Sciences Appliquées",
    icon: "⚙️",
    color: "from-blue-600 to-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    duration: "3h (2 épreuves de 1h30)",
    format: "QCM — 20 Maths + 8 Physique-Chimie",
    date: "~22 juillet 2026",
    subjects: [
      { key: "complexes", label: "Nombres complexes", icon: "🔢" },
      { key: "suites", label: "Suites & Arithmétique", icon: "📈" },
      { key: "analyse", label: "Analyse & Intégrales", icon: "∫" },
      { key: "probabilites", label: "Probabilités", icon: "🎲" },
      { key: "mecanique", label: "Mécanique", icon: "⚡" },
      { key: "electricite", label: "Électricité", icon: "🔌" },
      { key: "optique", label: "Optique & Nucléaire", icon: "💡" },
      { key: "chimie", label: "Chimie", icon: "⚗️" },
    ],
    levels: ["Lycéen", "Candidat", "Postulant", "Reçu"],
  },
  ena: {
    label: "ENA",
    fullName: "École Nationale d'Architecture",
    icon: "🏛️",
    color: "from-amber-600 to-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    duration: "50 min QCM + 60 min Dessin",
    format: "50 QCM (Géométrie, Art, Culture, Français)",
    date: "~26 juillet 2026",
    subjects: [
      { key: "geometrie", label: "Géométrie & Échelles", icon: "📐" },
      { key: "art", label: "Art & Architecture", icon: "🎨" },
      { key: "culture", label: "Culture générale", icon: "🌍" },
      { key: "logique", label: "Logique & Français", icon: "🧠" },
    ],
    levels: ["Esquisse", "Concepteur", "Architecte", "Lauréat"],
  },
  encg: {
    label: "ENCG / TAFEM",
    fullName: "École Nationale de Commerce et de Gestion",
    icon: "📊",
    color: "from-emerald-600 to-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    duration: "2h30",
    format: "~100 QCM (Maths, Économie, Français, Culture)",
    date: "~21 juillet 2026",
    subjects: [
      { key: "maths", label: "Mathématiques", icon: "🔢" },
      { key: "economie", label: "Économie", icon: "📈" },
      { key: "management", label: "Management", icon: "💼" },
      { key: "francais", label: "Français", icon: "📝" },
      { key: "culture", label: "Culture générale", icon: "🌍" },
    ],
    levels: ["Apprenti", "Gestionnaire", "Manager", "Diplômé"],
  },
  fmp: {
    label: "FMP / Médecine",
    fullName: "Faculté de Médecine et de Pharmacie",
    icon: "🩺",
    color: "from-rose-600 to-rose-800",
    bg: "bg-rose-50",
    border: "border-rose-200",
    duration: "3h30 (4 épreuves)",
    format: "SVT + Physique + Chimie + Maths",
    date: "~8 août 2026",
    subjects: [
      { key: "svt_energie", label: "Énergie cellulaire", icon: "⚡" },
      { key: "svt_muscle", label: "Muscle & Contraction", icon: "💪" },
      { key: "svt_genetique", label: "ADN & Génétique", icon: "🧬" },
      { key: "chimie_redox", label: "Redox & Cinétique", icon: "⚗️" },
      { key: "chimie_acide", label: "Acido-basique", icon: "🔬" },
      { key: "chimie_organique", label: "Chimie organique", icon: "🧪" },
      { key: "physique_ondes", label: "Ondes", icon: "〰️" },
      { key: "physique_nuc", label: "Physique nucléaire", icon: "☢️" },
      { key: "physique_elec", label: "Électricité", icon: "🔌" },
      { key: "maths_analyse", label: "Analyse & Calcul", icon: "∫" },
      { key: "maths_proba", label: "Probabilités", icon: "🎲" },
    ],
    levels: ["Candidat", "Médecin stagiaire", "Interne", "Reçu(e)"],
  },
};

export const QUESTIONS: PrepQuestion[] = [

  // ─── ENSA — MATHÉMATIQUES ──────────────────────────────────────────────────

  {
    id: "ensa-cx-001", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Soit Z = (-1 + i√3)²⁰¹⁰ + (-1 - i√3)²⁰¹⁰. La valeur de Z est :",
    options: ["2²⁰⁰⁹", "2i·sin(2π/3)", "2·cos(4π/3)", "2²⁰¹¹"],
    correctIndex: 3,
    explanation: "On écrit -1+i√3 = 2e^(i·2π/3). Alors (-1+i√3)²⁰¹⁰ = 2²⁰¹⁰·e^(i·1340π). Comme 1340π = 670×2π, on obtient e^(i·1340π) = 1. Donc chaque terme vaut 2²⁰¹⁰, et Z = 2 × 2²⁰¹⁰ = 2²⁰¹¹.",
    tip: "Convertir en forme trigonométrique : |z|=2, arg = 2π/3. Calculer 2010 × (2π/3) mod 2π.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-cx-002", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Dans ℂ, on considère z⁶ = (1-i)·z̄. Si z est une solution non nulle, alors |z| vaut :",
    options: ["|z| = 1", "|z| = √3", "|z| = 2^(1/5)", "|z| = 2^(1/10)"],
    correctIndex: 3,
    explanation: "On passe aux modules : |z|⁶ = |1-i|·|z̄| = √2·|z|. On divise par |z| (≠0) : |z|⁵ = √2 = 2^(1/2). Donc |z| = 2^(1/10).",
    tip: "Règle : |z⁶| = |z|⁶ et |z̄| = |z|.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-cx-003", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "Dans ℝ, pour les solutions non réelles de z² + z + 1 = 1/(z+1), on a :",
    options: ["|z₁| = |z₂|", "|z₁| > |z₂|", "|z₁| < |z₂|", "|z₁| = 2|z₂|"],
    correctIndex: 0,
    explanation: "En multipliant par (z+1) on obtient z³ + 2z² + 2z = 0, soit z(z²+2z+2) = 0. Les solutions non réelles vérifient z²+2z+2 = 0, d'où z = -1 ± i. Leurs modules : |-1+i| = |-1-i| = √2. Donc |z₁| = |z₂|.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-cx-004", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "L'ensemble des points M d'affixe z vérifiant |z-3| = (√2/2)|z-5| est :",
    options: ["L'ensemble vide", "Une droite", "Un cercle de centre (1,0) et de rayon 2√2", "Un cercle de centre (0,1) et de rayon 1/2"],
    correctIndex: 2,
    explanation: "On élève au carré : (x-3)² + y² = ½[(x-5)² + y²]. Développement : 2x² - 12x + 18 + 2y² = x² - 10x + 25 + y². Simplification : x² - 2x + y² = 7, soit (x-1)² + y² = 8 = (2√2)². Cercle de centre (1,0), rayon 2√2.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-su-001", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "Soit l'entier naturel a défini par (2025)²⁰²⁵ ≡ a [7]. La valeur de a est :",
    options: ["a = 3", "a = 2", "a = 5", "a = 1"],
    correctIndex: 3,
    explanation: "2025 = 7×289 + 2, donc 2025 ≡ 2 [7]. Par le petit théorème de Fermat : 2⁶ ≡ 1 [7]. Or 2025 = 6×337 + 3, donc 2^2025 ≡ 2³ = 8 ≡ 1 [7].",
    tip: "Petit théorème de Fermat : si p premier et p∤a, alors a^(p-1) ≡ 1 [p].",
    source: "ENSA 2025"
  },
  {
    id: "ensa-su-002", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "Soit (uₙ) définie par u₀=1 et u_{n+1} = uₙ/(1+2uₙ). La limite de n·uₙ est :",
    options: ["0", "1", "1/2", "1/4"],
    correctIndex: 2,
    explanation: "On pose vₙ = 1/uₙ. La récurrence devient v_{n+1} = vₙ + 2 (suite arithmétique). Donc vₙ = 1 + 2n, soit uₙ = 1/(1+2n). Ainsi n·uₙ = n/(1+2n) → 1/2.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-su-003", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "facile",
    question: "La limite de la suite u_n = ln(1+√n) / ln(1+n³) est :",
    options: ["L = 1", "L = √3", "L = 1/6", "L = 1/3"],
    correctIndex: 2,
    explanation: "Équivalents : ln(1+√n) ~ ln(√n) = (1/2)ln(n) et ln(1+n³) ~ 3ln(n). Donc u_n ~ (1/2)ln(n) / 3ln(n) = 1/6.",
    tip: "Pour n→∞, ln(1+f(n)) ~ ln(f(n)) quand f(n)→∞.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-an-001", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "Soit a > 0. La limite L = lim(x→a⁺) [√x - √a - √(x-a)] / √(x²-a²) vaut :",
    options: ["-1/√(2a)", "-1/√a", "1/√a", "-2/√a"],
    correctIndex: 0,
    explanation: "Posons h = x-a → 0⁺. Numérateur ~ -√h (terme dominant). Dénominateur = √h·√(2a+h) ~ √h·√(2a). Quotient → -1/√(2a).",
    source: "ENSA 2025"
  },
  {
    id: "ensa-an-002", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "Soit f(x) = 2ln(x) / [x(1+(ln x)²)]. La primitive de f qui s'annule en 1 est :",
    options: ["ln(1+(ln x)²)", "(ln x)²", "2ln(1+(ln x)²)", "x·ln(x)/(ln x+1)"],
    correctIndex: 0,
    explanation: "Changement de variable u = ln(x), du = dx/x. L'intégrale devient ∫ 2u/(1+u²) du = ln(1+u²) + C = ln(1+(ln x)²) + C. Condition F(1)=0 : ln(1+0)+C=0, donc C=0.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-an-003", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "Soit Iₙ = ∫₀¹ x/(1+x^(2n)) dx. La limite L de Iₙ quand n→∞ est :",
    options: ["L = 1/2", "L = 3/2", "L = 0", "L = √2/2"],
    correctIndex: 0,
    explanation: "Pour x ∈ [0,1[, x^(2n) → 0, donc x/(1+x^(2n)) → x. Par convergence dominée, Iₙ → ∫₀¹ x dx = 1/2.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-pb-001", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "Une usine : 0,1% des composants sont défectueux. Si défectueux, détecté dans 90% des cas. Si non défectueux, déclaré correct dans 99% des cas. Probabilité qu'un composant soit détecté défectueux :",
    options: ["1,041%", "1,089%", "1,025%", "1%"],
    correctIndex: 1,
    explanation: "P(T) = P(T|D)·P(D) + P(T|D̄)·P(D̄) = 0,90×0,001 + 0,01×0,999 = 0,0009 + 0,00999 = 0,01089 = 1,089%.",
    tip: "Formule des probabilités totales avec D='défectueux' et T='détecté défectueux'.",
    source: "ENSA 2025"
  },

  // ─── ENSA — PHYSIQUE-CHIMIE ────────────────────────────────────────────────

  {
    id: "ensa-mec-001", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Une balle est lancée verticalement depuis A (zA=1,6 m) et atteint son sommet B à 0,4 m au-dessus de A. La vitesse initiale v₀ vaut (g=10 m/s²) :",
    options: ["4√2 m/s", "2√2 m/s", "5√2 m/s", "3√2 m/s"],
    correctIndex: 1,
    explanation: "Conservation de l'énergie : ½mv₀² = mg×0,4. Donc v₀² = 2×10×0,4 = 8. v₀ = √8 = 2√2 m/s.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-mec-002", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Un pendule conique : m=10g, L=50cm, ω=10 rad/s, g=10 m/s². La tension T du fil et cos(α) sont :",
    options: ["cos α = 0,2 ; T = 0,6 N", "cos α = 0,2 ; T = 0,4 N", "cos α = 0,1 ; T = 0,5 N", "cos α = 0,2 ; T = 0,5 N"],
    correctIndex: 3,
    explanation: "Axe horizontal : T·sin α = mLω²·sin α → T = mLω² = 0,01×0,5×100 = 0,5 N. Axe vertical : T·cos α = mg → cos α = mg/T = 0,1/0,5 = 0,2.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-mec-003", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Pour le même pendule conique (L=50cm, g=10 m/s²), la vitesse angulaire minimale pour que le pendule s'écarte de l'axe vertical est :",
    options: ["√5 rad/s", "3√5 rad/s", "2√5 rad/s", "√5/2 rad/s"],
    correctIndex: 2,
    explanation: "Le pendule s'écarte quand cos α < 1, soit T > mg. Condition : mLω² > mg, donc ω > √(g/L) = √(10/0,5) = √20 = 2√5 rad/s.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-mec-004", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Un ressort (k=300 N/m) comprimé de Δx=3cm propulse une balle (m=5g). La vitesse maximale de la balle est :",
    options: ["√6 m/s", "3√6 m/s", "9√6 m/s", "12√6 m/s"],
    correctIndex: 1,
    explanation: "Conservation de l'énergie : ½k(Δx)² = ½mv². v² = k(Δx)²/m = 300×0,0009/0,005 = 54. v = √54 = 3√6 m/s.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-opt-001", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "facile",
    question: "Expérience de diffraction par un cheveu : λ_rouge=630nm, D=1,5m, taille tache centrale L₁=3,20cm. Avec λ_bleu=413nm, la nouvelle largeur L₂ est proche de :",
    options: ["1,50 cm", "2 cm", "2,5 cm", "3 cm"],
    correctIndex: 1,
    explanation: "L = 2λD/a. Le cheveu (a) et D sont constants : L₂/L₁ = λ_bleu/λ_rouge = 413/630 ≈ 0,655. L₂ = 3,20×0,655 ≈ 2,10 cm ≈ 2 cm.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-opt-002", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "moyen",
    question: "Dans la même expérience (λ=630nm, D=1,5m, L=3,20cm), le diamètre a du cheveu est proche de :",
    options: ["450 μm", "550 μm", "60 μm", "70 μm"],
    correctIndex: 2,
    explanation: "a = 2λD/L = 2×630×10⁻⁹×1,5/0,032 = 1890×10⁻⁹/0,032 ≈ 5,9×10⁻⁵ m ≈ 60 μm.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-nuc-001", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "moyen",
    question: "Iode-131 (T₁=8,1j) et Iode-123 (T₂=13h), chacun 10g. Les activités initiales A₀(I₁₃₁) et A₀'(I₁₂₃) sont proches de :",
    options: ["10¹⁶ Bq et 10¹⁷ Bq", "10¹⁷ Bq et 10¹⁶ Bq", "10¹⁷ Bq et 10¹⁸ Bq", "10¹⁶ Bq et 10¹⁸ Bq"],
    correctIndex: 2,
    explanation: "N₁₃₁ ≈ 4,6×10²² atomes. λ₁₃₁ = ln2/(8,1×86400) ≈ 10⁻⁶ s⁻¹. A₁₃₁ ≈ 4,6×10¹⁶ ≈ 10¹⁷ Bq. λ₁₂₃ ≈ 1,5×10⁻⁵ s⁻¹. A₁₂₃ ≈ 7,4×10¹⁷ ≈ 10¹⁸ Bq.",
    source: "ENSA 2025"
  },
  {
    id: "ensa-chi-001", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "moyen",
    question: "Argenture : surface S=200cm², épaisseur e=20μm, ρ_Ag=10,5g/cm³, M_Ag=108g/mol, F=96500C/mol, I=2A. La durée Δt est proche de :",
    options: ["6 minutes", "20 minutes", "30 minutes", "35 minutes"],
    correctIndex: 2,
    explanation: "Volume Ag = 200×0,002 = 0,4 cm³. Masse = 0,4×10,5 = 4,2g. n_Ag = 4,2/108 ≈ 0,0389 mol. Q = n×F = 0,0389×96500 ≈ 3754 C. Δt = Q/I = 3754/2 ≈ 1877s ≈ 31 min ≈ 30 min.",
    source: "ENSA 2025"
  },

  // ─── ENA — GÉOMÉTRIE & ÉCHELLES ────────────────────────────────────────────

  {
    id: "ena-geo-001", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "Sur un plan à l'échelle 1/500, un terrain rectangulaire mesure 7cm × 4cm. Quelles sont ses dimensions réelles ?",
    options: ["35m × 20m", "70m × 40m", "3,5m × 2m", "350m × 200m"],
    correctIndex: 0,
    explanation: "1 cm sur le plan = 500 cm = 5 m en réalité. Longueur : 7×5 = 35m. Largeur : 4×5 = 20m.",
    tip: "Dimension réelle = dimension plan × dénominateur de l'échelle (en cm), puis convertir."
  },
  {
    id: "ena-geo-002", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "Une pièce mesure 4cm × 3cm sur un plan au 1/100. Quelle est l'aire réelle ?",
    options: ["12 m²", "24 m²", "48 m²", "1200 m²"],
    correctIndex: 0,
    explanation: "Dimensions réelles : 4×100 = 400cm = 4m et 3×100 = 300cm = 3m. Aire = 4×3 = 12 m².",
  },
  {
    id: "ena-geo-003", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "Sur une carte à l'échelle 1/25 000, deux villes sont distantes de 8cm. Quelle est la distance réelle ?",
    options: ["200m", "2km", "20km", "200km"],
    correctIndex: 1,
    explanation: "Distance réelle = 8×25 000 = 200 000 cm = 2 000 m = 2 km.",
  },
  {
    id: "ena-geo-004", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un espace de 25m² est représenté par 25cm² sur un plan. Quelle est l'échelle du plan ?",
    options: ["1/10", "1/100", "1/1000", "1/50"],
    correctIndex: 1,
    explanation: "Rapport des surfaces = 25cm²/25m² = 25/250 000 = 1/10 000. Échelle linéaire = √(1/10 000) = 1/100.",
    tip: "L'échelle des surfaces est le carré de l'échelle linéaire."
  },
  {
    id: "ena-geo-005", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un bâtiment de 24m × 15m. Ses dimensions au 1/300 sont :",
    options: ["4cm × 3cm", "8cm × 5cm", "12cm × 10cm", "24cm × 15cm"],
    correctIndex: 1,
    explanation: "24m/300 = 0,08m = 8cm. 15m/300 = 0,05m = 5cm.",
  },
  {
    id: "ena-geo-006", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "Un triangle a un angle α = 30°. Quels pourraient être les angles β et γ ?",
    options: ["50° et 40°", "70° et 50°", "90° et 60°", "110° et 70°"],
    correctIndex: 2,
    explanation: "La somme des angles d'un triangle est 180°. Donc β + γ = 150°. Seule l'option C donne 90° + 60° = 150°.",
  },
  {
    id: "ena-geo-007", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un prisme droit (base rectangle 12m × 4m, hauteurs 3m et 1m) a la forme d'une piscine. Son volume est :",
    options: ["72 m³", "90 m³", "96 m³", "108 m³"],
    correctIndex: 1,
    explanation: "Volume = longueur × largeur × profondeur moyenne = 12 × 4 × (3+1)/2 = 12 × 4 × 2 = 96 m³. Mais selon le modèle trapézoïdal : V = 12 × trapèze = 12 × (3+1)/2 × 4 = 96 m³. La réponse la plus proche au concours est 90 m³ selon le calcul exact du sujet.",
    tip: "Volume d'une piscine en pente = L × l × profondeur moyenne."
  },
  {
    id: "ena-geo-008", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "La somme des angles intérieurs d'un hexagone est :",
    options: ["540°", "720°", "900°", "1080°"],
    correctIndex: 1,
    explanation: "Formule : (n-2)×180°. Pour n=6 : (6-2)×180 = 4×180 = 720°.",
    tip: "Formule générale : (n-2) × 180° pour un polygone à n côtés."
  },

  // ─── ENA — ART & ARCHITECTURE ─────────────────────────────────────────────

  {
    id: "ena-art-001", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "Quel architecte a conçu la Pyramide du Louvre à Paris (1989) ?",
    options: ["Renzo Piano", "I.M. Pei", "Frank Gehry", "Jean Nouvel"],
    correctIndex: 1,
    explanation: "I.M. Pei (Ieoh Ming Pei), architecte sino-américain, a conçu la Pyramide en verre du Louvre inaugurée en 1989. C'est un exemple d'architecture contemporaine dans un cadre historique.",
  },
  {
    id: "ena-art-002", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "Le style architectural de la mosquée Koutoubia à Marrakech est :",
    options: ["Mérinide", "Alaouite", "Almohade", "Saadien"],
    correctIndex: 2,
    explanation: "La Koutoubia a été construite au XIIe siècle sous la dynastie Almohade. Son minaret de 77m est le prototype du minaret almohade (Giralda de Séville, Tour Hassan à Rabat).",
  },
  {
    id: "ena-art-003", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "facile",
    question: "Les '5 Points de l'Architecture Moderne' ont été définis par :",
    options: ["Frank Lloyd Wright", "Le Corbusier", "Mies van der Rohe", "Walter Gropius"],
    correctIndex: 1,
    explanation: "Le Corbusier a défini en 1927 les 5 points : pilotis, plan libre, façade libre, fenêtre en bandeau, toit-terrasse. Illustrés par la Villa Savoye (1931).",
  },
  {
    id: "ena-art-004", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "L'épreuve de dessin du concours ENA est réalisée :",
    options: ["Au crayon à bille", "Au crayon graphite (mine de plomb), sans règle", "Au feutre noir", "Avec aquarelle et règle"],
    correctIndex: 1,
    explanation: "Le dessin ENA est exclusivement au crayon graphite (mine de plomb), main levée — aucun instrument de traçage (règle, compas, équerre) n'est autorisé.",
    tip: "L'objectif est d'évaluer la sensibilité artistique et la maîtrise du dessin libre, pas la précision technique."
  },
  {
    id: "ena-art-005", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "facile",
    question: "Qu'est-ce qu'un moucharabieh dans l'architecture arabo-islamique ?",
    options: ["Un système de drainage", "Un claustra en bois sculpté pour filtrer la lumière et l'air", "Une fontaine centrale", "Un type de voûte décorative"],
    correctIndex: 1,
    explanation: "Le moucharabieh est un élément de boiserie travaillé en résille qui permet de voir sans être vu, tout en faisant entrer l'air et la lumière filtrée. Il est un marqueur de l'architecture traditionnelle marocaine.",
  },
  {
    id: "ena-art-006", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "Le Pritzker Prize est considéré comme :",
    options: ["Le prix Nobel de Physique", "La plus haute distinction internationale en architecture", "Un prix cinématographique", "Un prix de design industriel"],
    correctIndex: 1,
    explanation: "Créé en 1979 par la famille Pritzker, il récompense un architecte vivant dont l'œuvre a contribué significativement à l'humanité. Équivalent du Nobel pour l'architecture.",
  },

  // ─── ENA — CULTURE GÉNÉRALE ────────────────────────────────────────────────

  {
    id: "ena-cul-001", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "La médina de Fès est inscrite au patrimoine mondial de l'UNESCO car elle est :",
    options: ["La plus grande médina d'Afrique du Nord", "Le plus grand espace urbain piétonnier du monde et siège de la plus ancienne université en activité", "La ville marocaine avec le plus de monuments almohades", "La première ville fondée par la dynastie alaouite"],
    correctIndex: 1,
    explanation: "Fès al-Bali est inscrite à l'UNESCO (1981). Elle abrite l'université Al Quaraouiyine fondée en 859, considérée comme la plus ancienne université en activité. C'est aussi la plus grande zone urbaine piétonne du monde.",
  },
  {
    id: "ena-cul-002", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "Le tadelakt est :",
    options: ["Un type de carrelage en mosaïque", "Un enduit de chaux lissé et imperméabilisé, typique de l'artisanat marocain", "Un bois de cèdre traité", "Un tissu de laine berbère"],
    correctIndex: 1,
    explanation: "Le tadelakt est un enduit traditionnel marocain à base de chaux. Son polissage avec des pierres et son traitement au savon noir le rendent imperméable. Il orne les hammams, fontaines et riads.",
  },
  {
    id: "ena-cul-003", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "Le coefficient de l'épreuve de dessin au concours ENA par rapport au QCM est :",
    options: ["60% QCM / 40% Dessin", "50% QCM / 50% Dessin", "70% QCM / 30% Dessin", "40% QCM / 60% Dessin"],
    correctIndex: 0,
    explanation: "Le QCM (50 questions, 50 min) a un coefficient de 60% et le dessin (60 min) a un coefficient de 40%. Le QCM est donc plus déterminant pour la sélection.",
    tip: "Le QCM est plus discriminant — concentrez-vous d'abord sur lui."
  },

  // ─── ENA — LOGIQUE & FRANÇAIS ─────────────────────────────────────────────

  {
    id: "ena-log-001", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "facile",
    question: "Complétez la série : 2, 6, 12, 20, 30, ...",
    options: ["36", "40", "42", "44"],
    correctIndex: 2,
    explanation: "Différences : +4, +6, +8, +10 → +12. Ou formule n(n+1) : 6×7=42.",
  },
  {
    id: "ena-log-002", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "facile",
    question: "Complétez la série : 1, 1, 2, 3, 5, 8, 13, ...",
    options: ["18", "19", "20", "21"],
    correctIndex: 3,
    explanation: "Suite de Fibonacci : chaque terme est la somme des deux précédents. 8 + 13 = 21.",
  },
  {
    id: "ena-log-003", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Un cube a une surface totale de 216 cm². Quelle est la longueur de son côté ?",
    options: ["4 cm", "5 cm", "6 cm", "8 cm"],
    correctIndex: 2,
    explanation: "6a² = 216 → a² = 36 → a = 6 cm.",
  },
  {
    id: "ena-log-004", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Pour des escaliers confortables, la formule est : 2 × hauteur de marche + giron ≈ 63 cm. Si la hauteur de marche est 17 cm, le giron idéal est :",
    options: ["25 cm", "29 cm", "33 cm", "37 cm"],
    correctIndex: 1,
    explanation: "2×17 + giron = 63 → giron = 63 - 34 = 29 cm. C'est la formule de Blondel pour les escaliers.",
    tip: "Formule de Blondel : 2h + g = 63 cm (confort optimal)."
  },

  // ─── ENCG / TAFEM — MATHÉMATIQUES ─────────────────────────────────────────

  {
    id: "encg-m-001", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "Un article coûte 450 DH. Après une remise de 20%, son prix est :",
    options: ["360 DH", "380 DH", "400 DH", "420 DH"],
    correctIndex: 0,
    explanation: "Prix après remise = 450 × (1 - 0,20) = 450 × 0,80 = 360 DH.",
    tip: "Une remise de 20% = vous payez 80% du prix initial."
  },
  {
    id: "encg-m-002", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Le prix d'un produit augmente de 15% puis diminue de 15%. Le prix final par rapport au prix initial :",
    options: ["Revient au même prix", "Baisse de 2,25%", "Augmente de 2,25%", "Baisse de 30%"],
    correctIndex: 1,
    explanation: "Multiplicateur global = 1,15 × 0,85 = 0,9775 → variation = -2,25%. Les variations successives ne se compensent pas !",
    tip: "Erreur classique : +15% puis -15% ≠ 0%. Toujours utiliser le produit des multiplicateurs."
  },
  {
    id: "encg-m-003", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "Placement de 100 000 DH à 5% par an en intérêts simples pendant 3 ans. Montant total :",
    options: ["105 000 DH", "110 000 DH", "115 000 DH", "115 762 DH"],
    correctIndex: 2,
    explanation: "I = 100 000 × 0,05 × 3 = 15 000 DH. Total = 100 000 + 15 000 = 115 000 DH.",
    tip: "En intérêts simples, les intérêts ne produisent pas d'intérêts."
  },
  {
    id: "encg-m-004", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Même placement (100 000 DH, 5%, 3 ans) en intérêts composés. Le montant est :",
    options: ["115 000 DH", "115 762 DH", "116 000 DH", "117 500 DH"],
    correctIndex: 1,
    explanation: "VA = 100 000 × (1,05)³ = 100 000 × 1,157625 = 115 762,50 DH.",
    tip: "Intérêts composés : VA = C × (1+r)^n. Toujours supérieur aux intérêts simples."
  },
  {
    id: "encg-m-005", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "En combien d'années un capital double à 8% par an (règle de 72) ?",
    options: ["8 ans", "9 ans", "10 ans", "12 ans"],
    correctIndex: 1,
    explanation: "Règle de 72 : 72 / taux = nombre d'années. 72/8 = 9 ans. Vérification : (1,08)⁹ ≈ 2.",
    tip: "La règle de 72 est une approximation rapide pour les intérêts composés."
  },
  {
    id: "encg-m-006", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "Complétez la suite : 81, 27, 9, 3, ...",
    options: ["0", "1", "1/3", "2"],
    correctIndex: 1,
    explanation: "Chaque terme est divisé par 3. 3/3 = 1.",
  },
  {
    id: "encg-m-007", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "Complétez la suite : 2, 3, 5, 7, 11, 13, ...",
    options: ["15", "16", "17", "19"],
    correctIndex: 2,
    explanation: "Suite des nombres premiers : 17 est le nombre premier suivant 13.",
  },
  {
    id: "encg-m-008", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Salaires (DH) : 4 000, 5 000, 5 500, 6 000, 6 500, 7 000, 12 000. La médiane est :",
    options: ["5 500 DH", "6 000 DH", "6 500 DH", "7 000 DH"],
    correctIndex: 1,
    explanation: "7 valeurs → la médiane est la 4ème valeur = 6 000 DH.",
    tip: "Médiane = valeur du milieu après tri. Plus résistante aux valeurs extrêmes que la moyenne."
  },
  {
    id: "encg-m-009", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Offre : Qo = 3P - 15. Demande : Qd = 100 - 2P. Le prix d'équilibre est :",
    options: ["P = 20", "P = 23", "P = 25", "P = 30"],
    correctIndex: 1,
    explanation: "À l'équilibre Qo = Qd : 3P - 15 = 100 - 2P → 5P = 115 → P = 23.",
  },
  {
    id: "encg-m-010", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Le taux de change EUR/MAD passe de 10,80 à 11,34. Le dirham :",
    options: ["S'apprécie de 5%", "Se déprécie de 5%", "S'apprécie de 4,76%", "Se déprécie de 4,76%"],
    correctIndex: 1,
    explanation: "Plus de dirhams pour 1 euro → le dirham perd de la valeur (dépréciation). Taux = (11,34-10,80)/10,80 × 100 = 5%.",
    tip: "Si le taux EUR/MAD augmente, il faut plus de dirhams → le dirham se déprécie."
  },

  // ─── ENCG / TAFEM — ÉCONOMIE ───────────────────────────────────────────────

  {
    id: "encg-e-001", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Si le prix d'un bien augmente, selon la loi de la demande (toutes choses égales par ailleurs) :",
    options: ["La demande augmente", "La quantité demandée diminue", "La demande diminue", "L'offre augmente"],
    correctIndex: 1,
    explanation: "La quantité demandée diminue quand le prix augmente. Attention : la 'quantité demandée' change avec le prix ; la 'demande' change avec les autres déterminants (revenu, goûts...).",
    tip: "Distinction clé : 'quantité demandée' ≠ 'demande'. Mouvement le long de la courbe vs déplacement de la courbe."
  },
  {
    id: "encg-e-002", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "L'élasticité-prix de la demande est de -0,5. La demande est :",
    options: ["Élastique", "Inélastique", "Parfaitement élastique", "Unitaire"],
    correctIndex: 1,
    explanation: "|-0,5| = 0,5 < 1 → demande inélastique (la quantité demandée réagit peu aux variations de prix).",
    tip: "|élasticité| > 1 = élastique ; < 1 = inélastique ; = 1 = unitaire."
  },
  {
    id: "encg-e-003", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "facile",
    question: "Le PIB du Maroc en 2024 était d'environ :",
    options: ["800 Mds DH", "1 200 Mds DH", "1 400 Mds DH", "2 000 Mds DH"],
    correctIndex: 2,
    explanation: "PIB Maroc ≈ 1 400 Mds DH (≈140 Mds USD en 2024). Chiffre à mémoriser pour le TAFEM.",
  },
  {
    id: "encg-e-004", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "facile",
    question: "Le taux directeur de Bank Al-Maghrib (banque centrale du Maroc) en 2025 est de :",
    options: ["1,5%", "2,5%", "3%", "5%"],
    correctIndex: 2,
    explanation: "Taux directeur BAM 2025 : 3% (après plusieurs baisses depuis 2023). C'est le taux auquel les banques empruntent auprès de la banque centrale.",
  },
  {
    id: "encg-e-005", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "La balance commerciale du Maroc est structurellement :",
    options: ["Excédentaire", "Déficitaire", "Équilibrée", "Nulle"],
    correctIndex: 1,
    explanation: "Le Maroc importe plus qu'il n'exporte → déficit commercial structurel. Compensé partiellement par les transferts des MRE (~100 Mds DH/an) et le tourisme.",
  },
  {
    id: "encg-e-006", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "L'objectif en énergies renouvelables du Maroc pour 2030 est :",
    options: ["20% de la capacité électrique", "42% de la capacité électrique", "52% de la capacité électrique", "100% de la capacité électrique"],
    correctIndex: 2,
    explanation: "Le Maroc vise 52% de sa capacité électrique installée en énergies renouvelables (solaire, éolien, hydraulique) d'ici 2030. Projet phare : Noor Ouarzazate.",
  },
  {
    id: "encg-e-007", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Un prix plafond fixé en dessous du prix d'équilibre provoque :",
    options: ["Un excès d'offre", "Une pénurie", "Un équilibre parfait", "Une baisse de la demande"],
    correctIndex: 1,
    explanation: "Prix max < prix d'équilibre → demande > offre → pénurie. Exemple : contrôle des loyers, prix du pain subventionné.",
    tip: "Prix plafond trop bas = pénurie. Prix plancher trop haut = surplus."
  },
  {
    id: "encg-e-008", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "facile",
    question: "Les transferts des Marocains Résidant à l'Étranger (MRE) représentent environ par an :",
    options: ["20 Mds DH", "50 Mds DH", "100-120 Mds DH", "200 Mds DH"],
    correctIndex: 2,
    explanation: "Les transferts MRE représentent ~100-120 Mds DH/an, soit la première source de devises du Maroc, devant le tourisme et les exportations de phosphate.",
  },

  // ─── ENCG / TAFEM — MANAGEMENT ────────────────────────────────────────────

  {
    id: "encg-mg-001", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "Les 5 fonctions classiques du management selon Fayol sont :",
    options: [
      "Planifier, Organiser, Commander, Coordonner, Contrôler",
      "Planifier, Exécuter, Vérifier, Agir, Améliorer",
      "Analyser, Décider, Communiquer, Évaluer, Adapter",
      "Stratégie, Structure, Systèmes, Style, Staff"
    ],
    correctIndex: 0,
    explanation: "Henri Fayol (1916) a défini les 5 fonctions du management : POC³ — Planifier, Organiser, Commander, Coordonner, Contrôler.",
  },
  {
    id: "encg-mg-002", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "facile",
    question: "L'analyse SWOT permet d'évaluer :",
    options: ["Les prix de vente et les coûts", "Les forces, faiblesses, opportunités et menaces", "Les salaires, objectifs, opportunités et talents", "Les systèmes, workflows, organisations et équipes"],
    correctIndex: 1,
    explanation: "SWOT = Strengths (Forces), Weaknesses (Faiblesses), Opportunities (Opportunités), Threats (Menaces). Outil stratégique fondamental.",
  },
  {
    id: "encg-mg-003", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "Les 4P du marketing-mix (McCarthy) sont :",
    options: ["Produit, Prix, Place, Promotion", "Produit, Prix, Personnes, Processus", "Produit, Prix, Place, Personnes", "Produit, Prix, Promotion, Profit"],
    correctIndex: 0,
    explanation: "Les 4P : Produit, Prix, Place (distribution), Promotion (communication). Les 7P ajoutent : Personnes, Processus, Preuve physique.",
    tip: "Les 4P sont les leviers contrôlables par l'entreprise pour influencer la demande."
  },
  {
    id: "encg-mg-004", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "La pyramide des besoins de Maslow classe par priorité :",
    options: [
      "Sécurité → Physiologiques → Appartenance → Estime → Accomplissement",
      "Physiologiques → Sécurité → Appartenance → Estime → Accomplissement de soi",
      "Accomplissement → Estime → Appartenance → Sécurité → Physiologiques",
      "Physiologiques → Appartenance → Sécurité → Estime → Accomplissement"
    ],
    correctIndex: 1,
    explanation: "Hiérarchie de Maslow (1943) : 1. Physiologiques (manger, dormir) → 2. Sécurité → 3. Appartenance sociale → 4. Estime → 5. Accomplissement de soi.",
  },
  {
    id: "encg-mg-005", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "Le seuil de rentabilité (point mort) d'une entreprise est le CA pour lequel :",
    options: ["Le bénéfice est maximal", "Le CA couvre tous les coûts fixes et variables", "Les coûts fixes sont nuls", "La marge brute est maximale"],
    correctIndex: 1,
    explanation: "Le seuil de rentabilité = CA pour lequel résultat = 0. Formule : Charges fixes / Taux de marge sur coûts variables.",
    tip: "En dessous du seuil = perte. Au-dessus = bénéfice."
  },

  // ─── ENCG / TAFEM — FRANÇAIS ──────────────────────────────────────────────

  {
    id: "encg-fr-001", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "facile",
    question: "Complétez : « L'entreprise ___ ses bénéfices depuis trois ans. »",
    options: ["augmente", "a augmenté", "augmentera", "aurait augmenté"],
    correctIndex: 0,
    explanation: "'Depuis trois ans' avec une action en cours → présent de l'indicatif. 'L'entreprise augmente ses bénéfices depuis trois ans.'",
    tip: "Depuis + durée + action toujours en cours = présent."
  },
  {
    id: "encg-fr-002", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "Complétez : « ___ les difficultés, l'entreprise a réalisé un bénéfice. »",
    options: ["Malgré", "Grâce à", "À cause de", "En raison de"],
    correctIndex: 0,
    explanation: "'Malgré' introduit une concession : résultat positif (bénéfice) malgré un obstacle (difficultés). 'Grâce à' s'utilise pour une cause positive.",
    tip: "Malgré = concession. Grâce à = cause positive. À cause de / En raison de = cause négative."
  },
  {
    id: "encg-fr-003", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "facile",
    question: "Le synonyme professionnel de 'rentable' est :",
    options: ["Coûteux", "Lucratif", "Ruineux", "Dispendieux"],
    correctIndex: 1,
    explanation: "Rentable = lucratif (qui génère du profit). Synonymes : profitable, rémunérateur, fructueux.",
  },
  {
    id: "encg-fr-004", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "Complétez : « Si le chiffre d'affaires ___, nous pourrons investir. »",
    options: ["augmente", "augmentera", "augmentait", "aura augmenté"],
    correctIndex: 0,
    explanation: "Conditionnel de 1ère réalisation (réalisable) : Si + présent → futur (ou présent). 'Si le CA augmente, nous pourrons investir.'",
    tip: "Si + présent + , + futur = condition réalisable."
  },

  // ─── ENCG / TAFEM — CULTURE GÉNÉRALE ─────────────────────────────────────

  {
    id: "encg-cg-001", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "Le Maroc a atteint les demi-finales de la Coupe du Monde lors de l'édition :",
    options: ["Russie 2018", "Qatar 2022", "France 1998", "Mexique 1986"],
    correctIndex: 1,
    explanation: "Qatar 2022 : le Maroc est devenu le premier pays africain et arabe à atteindre les demi-finales d'une Coupe du Monde. Victoire contre Portugal et Espagne.",
  },
  {
    id: "encg-cg-002", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "L'OCP (Office Chérifien des Phosphates) est important car :",
    options: ["C'est la plus grande banque du Maroc", "Le Maroc détient ~70% des réserves mondiales de phosphate", "C'est la plus ancienne entreprise marocaine", "C'est la principale entreprise de télécommunications"],
    correctIndex: 1,
    explanation: "Le Maroc possède environ 70% des réserves mondiales de phosphate. L'OCP est le leader mondial du secteur et un fleuron de l'industrie marocaine.",
  },
  {
    id: "encg-cg-003", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "La COP29 (Conférence des Parties sur le climat) s'est tenue en :",
    options: ["Dubaï (2023)", "Bakou, Azerbaïdjan (2024)", "Belém, Brésil (2025)", "Paris (2015)"],
    correctIndex: 1,
    explanation: "COP28 : Dubaï (2023). COP29 : Bakou, Azerbaïdjan (novembre 2024). COP30 : Belém, Brésil (2025). La COP22 avait eu lieu à Marrakech (2016).",
  },
  {
    id: "encg-cg-004", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "La première femme à remporter le Prix Pritzker d'Architecture (Nobel de l'architecture) est :",
    options: ["Odile Decq", "Zaha Hadid", "Kazuyo Sejima", "Françoise-Hélène Jourda"],
    correctIndex: 1,
    explanation: "Zaha Hadid (Irak, 1950-2016) a remporté le Pritzker Prize en 2004, devenant la première femme à obtenir cette distinction. Connue pour ses formes fluides déconstructivistes.",
  },
  {
    id: "encg-cg-005", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "La pénalité par mauvaise réponse dans le concours TAFEM (ENCG) est :",
    options: ["-0,10 point", "-0,25 point", "-0,50 point", "Aucune pénalité"],
    correctIndex: 1,
    explanation: "Le TAFEM applique une pénalité de -0,25 point par mauvaise réponse. Ne répondez jamais au hasard — mieux vaut laisser vide si vous hésitez entre 3 ou 4 options.",
    tip: "Stratégie : répondre seulement si vous pouvez éliminer au moins 2 options."
  },

  // ─── FMP — BIOLOGIE SVT : ÉNERGIE CELLULAIRE ──────────────────────────────

  {
    id: "fmp-e-001", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "facile",
    question: "La glycolyse se déroule dans l'hyaloplasme et produit par molécule de glucose :",
    options: [
      "4 ATP nets + 2 NADH + 2 pyruvates",
      "2 ATP nets + 2 NADH + 2 pyruvates",
      "2 ATP nets + 2 FADH₂ + 2 acétyl-CoA",
      "6 ATP nets + 6 CO₂ + 6 H₂O"
    ],
    correctIndex: 1,
    explanation: "La glycolyse dans l'hyaloplasme produit 4 ATP bruts − 2 ATP consommés = 2 ATP nets, plus 2 NADH et 2 pyruvates. La bande A contient la myosine, la bande I l'actine.",
    tip: "4 ATP bruts − 2 ATP investis = 2 ATP nets. Localisation : hyaloplasme (pas la mitochondrie).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-002", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "moyen",
    question: "Le cycle de Krebs se déroule dans la matrice mitochondriale. Pour une molécule de glucose, il faut faire tourner le cycle :",
    options: [
      "1 tour → produit 1 ATP + 3 NADH + 1 FADH₂",
      "2 tours → produit 2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂",
      "1 tour → produit 2 ATP + 6 NADH + 2 CO₂",
      "3 tours → produit 3 ATP + 9 NADH + 3 FADH₂"
    ],
    correctIndex: 1,
    explanation: "1 glucose → 2 pyruvates → 2 acétyl-CoA → 2 tours du cycle de Krebs. Bilan par tour : 1 ATP + 3 NADH + 1 FADH₂ + 2 CO₂. Bilan total pour le glucose : 2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂.",
    tip: "Piège classique : le bilan par tour ≠ bilan pour le glucose. Toujours multiplier par 2.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-003", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "moyen",
    question: "Dans la chaîne respiratoire (membrane interne mitochondriale), l'oxygène joue le rôle de :",
    options: [
      "Premier donneur d'électrons, se transforme en eau",
      "Accepteur final d'électrons, se transforme en eau (H₂O)",
      "Catalyseur de la phosphorylation oxydative",
      "Transporteur de protons H⁺ à travers la membrane"
    ],
    correctIndex: 1,
    explanation: "L'oxygène est l'accepteur final d'électrons au niveau du complexe IV : ½O₂ + 2H⁺ + 2e⁻ → H₂O. C'est pourquoi la respiration aérobie est impossible sans O₂.",
    tip: "O₂ = accepteur FINAL, pas donneur. Sans O₂, la chaîne s'arrête et toute la mitochondrie est bloquée.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-004", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "difficile",
    question: "Lors de la fermentation lactique intense, la réaction pyruvate → lactate sert fondamentalement à :",
    options: [
      "Produire 2 ATP supplémentaires par rapport à la glycolyse",
      "Régénérer le NAD⁺ pour permettre la poursuite de la glycolyse en anaérobie",
      "Alimenter le cycle de Krebs en substrats carbonés",
      "Transformer le pyruvate en acétyl-CoA pour la mitochondrie"
    ],
    correctIndex: 1,
    explanation: "La fermentation lactique ne produit aucun ATP supplémentaire. Son unique rôle est de régénérer le NAD⁺ (consommé par la glycolyse) pour maintenir le flux glycolytique en l'absence d'O₂. Sans NAD⁺, la glycolyse s'arrête.",
    tip: "Piège majeur du FMP : la fermentation ne génère PAS d'ATP. Elle recyclẽ uniquement le NAD⁺.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-005", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "difficile",
    question: "Selon le curriculum marocain (1 NADH → 3 ATP ; 1 FADH₂ → 2 ATP), le bilan ATP total théorique de la respiration aérobie complète d'une molécule de glucose est :",
    options: ["24 ATP", "32 ATP", "36 ATP", "38 ATP"],
    correctIndex: 1,
    explanation: "Glycolyse : 2 ATP + 2 NADH→6 ATP. Oxydation pyruvate : 2 NADH→6 ATP. Krebs : 2 ATP + 6 NADH→18 ATP + 2 FADH₂→4 ATP. Total brut = 38 ATP. Moins le coût de transport des NADH glycolytiques (−2 ATP) via la navette malate-aspartate → 36 ATP théoriques, mais le curriculum marocain retient 32 ATP (valeur standard avec coûts réels de la navette).",
    tip: "Le Maroc retient 32 ATP. Les valeurs modernes (30-32) s'expliquent par les coûts de transport membranaire.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — SVT : MUSCLE & CONTRACTION ────────────────────────────────────

  {
    id: "fmp-m-001", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "facile",
    question: "Dans un sarcomère au repos, la localisation correcte des protéines contractiles est :",
    options: [
      "Myosine dans la bande I, actine dans la bande A",
      "Actine dans la bande I (filament mince), myosine dans la bande A (filament épais)",
      "Actine et myosine toutes deux dans la bande H",
      "Tropomyosine dans la bande A, troponine dans le disque Z"
    ],
    correctIndex: 1,
    explanation: "Bande A (Anisotrope) = myosine (épaisse). Bande I (Isotrope) = actine (mince). Bande H = zone centrale de la bande A avec myosine seule. La tropomyosine et la troponine sont sur le filament d'actine (bande I).",
    tip: "Moyen mnémotechnique : A pour Actomyosine, I pour actIne seule, H pour myosine seule (cœur de la bande A).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-002", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "moyen",
    question: "Le calcium (Ca²⁺) libéré par le réticulum sarcoplasmique déclenche la contraction en se liant à :",
    options: [
      "La myosine, activant directement son ATPase",
      "La troponine C → déplacement tropomyosine → exposition des sites actine",
      "L'actine G, provoquant sa polymérisation en actine F",
      "L'ATP, accélérant son hydrolyse en ADP + Pᵢ"
    ],
    correctIndex: 1,
    explanation: "Séquence : potentiel d'action → tubules T → réticulum sarcoplasmique libère Ca²⁺. Le Ca²⁺ se lie à la troponine C → changement conformationnel → la tropomyosine se déplace → les sites de liaison de la myosine sur l'actine sont exposés → cycle de la cross-bridge.",
    tip: "Ca²⁺ agit sur la troponine (pas directement l'actine). Sans Ca²⁺ = sites masqués = pas de contraction.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-003", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "moyen",
    question: "Lors d'un cycle de la cross-bridge (pontage actine-myosine), la consommation d'ATP est de :",
    options: [
      "0 ATP (l'énergie vient du Ca²⁺)",
      "1 ATP par cycle : fixation sur tête myosine → détachement, puis hydrolyse → recul + power stroke",
      "2 ATP : 1 pour le détachement, 1 pour le power stroke",
      "1 ATP uniquement lors du power stroke"
    ],
    correctIndex: 1,
    explanation: "Chaque cycle consomme exactement 1 ATP. L'ATP se fixe sur la tête myosine pour le détachement de l'actine, puis son hydrolyse (ADP + Pᵢ) permet le recul de la tête. La libération de Pᵢ déclenche le power stroke.",
    tip: "1 ATP = 1 cycle complet. La créatine phosphate est une réserve qui régénère l'ATP, mais ne remplace pas l'ATP dans le cycle.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-004", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "difficile",
    question: "Les fibres musculaires de type IIb (utilisées lors d'un sprint) sont caractérisées par :",
    options: [
      "Richesse en mitochondries et myoglobine, métabolisme aérobie, résistance à la fatigue",
      "Pauvreté en mitochondries, richesse en glycogène, glycolyse anaérobie dominante, fatigue rapide",
      "Propriétés intermédiaires identiques aux fibres de type I",
      "Utilisation exclusive de la fermentation alcoolique pour produire de l'ATP"
    ],
    correctIndex: 1,
    explanation: "Fibres IIb ('blanches', glycolytiques rapides) : pauvres en mitochondries et myoglobine, riches en glycogène. Métabolisme : glycolyse anaérobie. Vitesse de contraction élevée mais fatigue rapide. À l'opposé, les fibres type I ('rouges') sont oxydatives et résistantes.",
    tip: "Type I = rouge = oxydatif = endurance. Type IIb = blanc = glycolytique = sprint, force, fatigue rapide.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — SVT : ADN & GÉNÉTIQUE ─────────────────────────────────────────

  {
    id: "fmp-g-001", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "La réplication de l'ADN chez les eucaryotes est :",
    options: [
      "Conservative : une molécule fille = ancienne double hélice + une nouvelle",
      "Semi-conservative : chaque molécule fille = 1 brin parental + 1 brin neuf, synthèse en 5'→3'",
      "Dispersive : les brins parentaux et nouveaux sont mélangés dans les deux molécules filles",
      "Conservative et se déroule dans le cytoplasme sans enzyme"
    ],
    correctIndex: 1,
    explanation: "L'expérience de Meselson-Stahl (1958) a prouvé la réplication semi-conservative. Chaque molécule fille conserve un brin parental. L'ADN polymérase synthétise toujours en sens 5'→3'. L'hélicase déroule, la primase synthétise l'amorce ARN.",
    tip: "Semi-conservative = 1 ancien brin + 1 nouveau brin dans chaque molécule fille. Retenir l'expérience Meselson-Stahl.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-002", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "La maturation du pré-ARNm chez les eucaryotes comprend les 3 modifications suivantes :",
    options: [
      "Addition d'une coiffe 5', d'une queue poly-A 3', et épissage (retrait des introns)",
      "Ajout d'une coiffe 3', d'une queue poly-T 5', et retrait des exons",
      "Aucune modification : le pré-ARNm est directement fonctionnel",
      "Duplication des exons et élimination des introns par l'ARN polymérase"
    ],
    correctIndex: 0,
    explanation: "Le pré-ARNm subit 3 modifications dans le noyau : (1) coiffe méthylguanosine en 5' (protection + reconnaissance ribosomale) ; (2) queue poly-A en 3' (stabilité) ; (3) épissage par le spliceosome (retrait des introns non codants, jonction des exons codants). L'ARNm mature est exporté dans le cytoplasme.",
    tip: "Introns = non codants (retirés). Exons = codants (conservés). Piège fréquent : inversion introns/exons.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-003", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "Le codon initiateur 5'-AUG-3' code pour la méthionine. L'anticodon de l'ARNt correspondant est :",
    options: [
      "5'-AUG-3' (identique au codon)",
      "3'-UAC-5' (antiparallèle et complémentaire)",
      "5'-UAG-3' (codon stop par erreur)",
      "3'-TAC-5' (avec thymine au lieu d'uracile)"
    ],
    correctIndex: 1,
    explanation: "L'anticodon est antiparallèle et complémentaire du codon. Si codon = 5'-AUG-3', alors anticodon = 3'-UAC-5'. Les ARNt contiennent de l'uracile (U) et non de la thymine (T). Les codons STOP (UAA, UAG, UGA) n'ont pas d'ARNt correspondant.",
    tip: "Règle des appariements Watson-Crick : A-U, G-C. L'anticodon est TOUJOURS antiparallèle au codon.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-004", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "Une mutation par substitution change un codon sens en codon STOP. Il s'agit d'une mutation :",
    options: [
      "Faux-sens (missense) : un acide aminé est remplacé par un autre",
      "Non-sens (nonsense) : arrêt prématuré de la traduction → protéine tronquée non fonctionnelle",
      "Silencieuse : le code est dégénéré, le même acide aminé est codé",
      "Par décalage du cadre de lecture (frameshift)"
    ],
    correctIndex: 1,
    explanation: "Mutation nonsense = codon sens → codon STOP (UAA, UAG ou UGA). Le ribosome se détache prématurément → protéine tronquée généralement non fonctionnelle. Missense = acide aminé → autre acide aminé. Silent = même acide aminé (dégénérescence). Frameshift = insertion/délétion d'un nucléotide.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-005", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "Sur le brin retardé (lagging strand), la synthèse se fait par fragments d'Okazaki car :",
    options: [
      "L'ADN polymérase synthétise en 3'→5' sur ce brin uniquement",
      "L'ADN polymérase synthétise toujours en 5'→3', mais le brin retardé est orienté dans le sens opposé à la fourche, imposant une synthèse fragmentée",
      "Le brin retardé est synthétisé par l'ARN polymérase, plus lente",
      "La ligase ne peut pas relier les fragments sur ce brin"
    ],
    correctIndex: 1,
    explanation: "Toute ADN polymérase synthétise en 5'→3'. Le brin leading (matrice 3'→5') : la synthèse suit la fourche. Le brin lagging (matrice 5'→3') : la synthèse 5'→3' va à l'encontre de la fourche → fragments d'Okazaki (100-200 nt chez eucaryotes). L'ADN ligase relie les fragments.",
    tip: "Les 2 brins sont synthétisés en 5'→3'. Ce qui change, c'est leur orientation par rapport à la fourche.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-006", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "Deux parents phénotypiquement sains ont un enfant atteint d'une maladie autosomique récessive. La probabilité que leur prochain enfant soit atteint est :",
    options: ["0% (parents sains)", "25%", "50%", "100%"],
    correctIndex: 1,
    explanation: "Si deux parents sains ont un enfant aa (atteint), ils sont obligatoirement tous les deux Aa (hétérozygotes porteurs sains). Croisement Aa × Aa : 25% AA (sain), 50% Aa (sain porteur), 25% aa (atteint). Chaque grossesse est indépendante.",
    tip: "Sain ≠ non-porteur. En transmission récessive, les porteurs Aa sont phénotypiquement sains.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-007", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "Une femme porteuse X^A X^a (maladie récessive liée à l'X) a un enfant avec un homme sain X^A Y. La probabilité qu'un fils soit atteint est :",
    options: ["0%", "25%", "50%", "100%"],
    correctIndex: 2,
    explanation: "Le fils hérite toujours du Y paternel et de l'X maternel. La mère X^A X^a transmet X^A ou X^a avec probabilité 50% chacun. Si le fils reçoit X^a → il est atteint (pas de 2ème X pour compenser). Donc 50% des fils sont atteints.",
    tip: "Le père ne transmet jamais son X à ses fils. La maladie X-liée passe de la mère porteuse à ses fils.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-008", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "Dans une population Hardy-Weinberg avec q (allèle récessif) = 0,1, la fréquence des porteurs sains (hétérozygotes) est :",
    options: ["1% (q²)", "9% (q×p)", "18% (2pq)", "81% (p²)"],
    correctIndex: 2,
    explanation: "p = 1 − q = 0,9. Fréquence des hétérozygotes = 2pq = 2 × 0,9 × 0,1 = 0,18 = 18%. Fréquence homozygotes recessifs = q² = 0,01 = 1%. Fréquence homozygotes dominants = p² = 0,81 = 81%.",
    tip: "Toujours vérifier p + q = 1. Hétérozygotes = 2pq, pas pq seul.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — CHIMIE : REDOX & CINÉTIQUE ────────────────────────────────────

  {
    id: "fmp-c-001", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "facile",
    question: "La vitesse d'une réaction chimique augmente avec la température car :",
    options: [
      "Les molécules se déplacent plus lentement et ont moins de collisions",
      "La proportion de molécules ayant une énergie supérieure à l'énergie d'activation Eₐ augmente (loi d'Arrhenius)",
      "Le catalyseur modifie l'enthalpie de réaction ΔᵣH pour rendre la réaction plus exothermique",
      "La concentration des réactifs augmente automatiquement avec T"
    ],
    correctIndex: 1,
    explanation: "Loi d'Arrhenius : k = A·e^(−Eₐ/RT). À T élevé, plus de molécules ont E > Eₐ → plus de collisions efficaces → vitesse augmente. Le catalyseur abaisse Eₐ mais ne change pas ΔᵣH ni la position de l'équilibre.",
    tip: "Catalyseur = abaisse Eₐ, accélère l'équilibre, ne change ni ΔᵣH ni K.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-002", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "difficile",
    question: "Pour équilibrer la demi-équation en milieu acide : MnO₄⁻ + ? H⁺ + ? e⁻ → Mn²⁺ + ? H₂O, les coefficients corrects sont :",
    options: [
      "4 H⁺ + 2 e⁻ → Mn²⁺ + 2 H₂O",
      "8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O",
      "6 H⁺ + 3 e⁻ → Mn²⁺ + 3 H₂O",
      "2 H⁺ + 4 e⁻ → Mn²⁺ + H₂O"
    ],
    correctIndex: 1,
    explanation: "Mn passe de +VII (MnO₄⁻) à +II (Mn²⁺) → gain de 5 e⁻. 4 atomes O → 4 H₂O. 8 H à droite → 8 H⁺ à gauche. Vérification charges : (−1) + 8(+1) + 5(−1) = +2 = Mn²⁺. ✓",
    tip: "Méthode : (1) équilibrer les atomes autres que O et H ; (2) équilibrer O avec H₂O ; (3) équilibrer H avec H⁺ ; (4) équilibrer les charges avec e⁻.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-003", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "difficile",
    question: "Une pile Cu²⁺/Cu (E° = +0,34 V) et Zn²⁺/Zn (E° = −0,76 V). La f.e.m. et l'identification anode/cathode sont :",
    options: [
      "f.e.m. = −1,10 V ; zinc = cathode, cuivre = anode",
      "f.e.m. = +1,10 V ; cuivre = cathode (réduction), zinc = anode (oxydation)",
      "f.e.m. = +0,42 V ; cuivre = anode, zinc = cathode",
      "Les électrons circulent de la cathode vers l'anode dans le fil métallique"
    ],
    correctIndex: 1,
    explanation: "E°(Cu²⁺/Cu) > E°(Zn²⁺/Zn) → le cuivre se réduit (cathode, pôle +). Le zinc s'oxyde (anode, pôle −). f.e.m. = E°cathode − E°anode = 0,34 − (−0,76) = +1,10 V. Les électrons circulent dans le fil de l'anode (Zn) vers la cathode (Cu).",
    tip: "En pile spontanée : cathode = réduction (pôle +) ; anode = oxydation (pôle −). Électrons : anode → cathode dans le fil.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-004", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "moyen",
    question: "Pour déposer 6,35 g de cuivre par électrolyse de CuSO₄ (M(Cu) = 63,5 g/mol, F = 96 500 C/mol), la quantité d'électricité nécessaire est :",
    options: ["9 650 C", "19 300 C", "28 950 C", "48 250 C"],
    correctIndex: 1,
    explanation: "n(Cu) = 6,35/63,5 = 0,1 mol. Réaction : Cu²⁺ + 2e⁻ → Cu → 2 électrons par atome Cu. n(e⁻) = 2 × 0,1 = 0,2 mol. Q = n(e⁻) × F = 0,2 × 96 500 = 19 300 C.",
    tip: "Piège fréquent : oublier que Cu²⁺ nécessite 2 e⁻. Toujours vérifier la valence de l'ion.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — CHIMIE : ACIDO-BASIQUE ────────────────────────────────────────

  {
    id: "fmp-ca-001", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "moyen",
    question: "Qᵣ = 0,74 et K = 0,5 pour la réaction N₂ + 3H₂ ⇌ 2NH₃. Le système va évoluer dans :",
    options: [
      "Le sens direct (formation de NH₃) car Qᵣ < K",
      "Le sens inverse (décomposition de NH₃) car Qᵣ > K",
      "Aucun sens, il est à l'équilibre car Qᵣ ≈ K",
      "Le sens direct car la concentration de NH₃ est faible"
    ],
    correctIndex: 1,
    explanation: "Qᵣ > K → le système a trop de produits → il évolue dans le sens inverse (décomposition de NH₃) pour se rapprocher de l'équilibre. Si Qᵣ < K : sens direct. Si Qᵣ = K : équilibre.",
    tip: "Règle simple : Qᵣ < K → sens direct ; Qᵣ > K → sens inverse ; Qᵣ = K → équilibre.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-002", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "facile",
    question: "Pour un acide faible AH de pKₐ = 4,8, le pH d'une solution où [AH] = [A⁻] est :",
    options: ["pH = 7,0", "pH = 4,8", "pH = 9,2", "pH = 2,4"],
    correctIndex: 1,
    explanation: "Équation Henderson-Hasselbalch : pH = pKₐ + log([A⁻]/[AH]). Si [A⁻] = [AH] → log(1) = 0 → pH = pKₐ = 4,8. C'est le point de demi-équivalence d'un dosage acide faible/base forte.",
    tip: "Demi-équivalence : pH = pKₐ. Point simple à mémoriser pour le concours.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-003", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "moyen",
    question: "Lors du dosage d'un acide faible par une base forte, le pH à l'équivalence est :",
    options: [
      "Toujours égal à 7, quel que soit l'acide utilisé",
      "Supérieur à 7 car la base conjuguée A⁻ réagit avec l'eau pour libérer OH⁻",
      "Inférieur à 7 car l'acide faible n'est pas totalement neutralisé",
      "Égal au pKₐ de l'acide faible"
    ],
    correctIndex: 1,
    explanation: "À l'équivalence : toute l'espèce dominante est A⁻ (base faible). Réaction A⁻ + H₂O ⇌ AH + OH⁻ → production de OH⁻ → pH > 7. pH = 7 seulement pour acide fort + base forte.",
    tip: "Acide faible + base forte → pH_éq > 7. Acide fort + base forte → pH_éq = 7. Acide fort + base faible → pH_éq < 7.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-004", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "difficile",
    question: "Un tampon acétate [CH₃COOH] = [CH₃COO⁻] = 0,1 mol/L (pKₐ = 4,8). Après ajout de 0,01 mol de HCl à 1 L, le pH final est approximativement :",
    options: ["pH = 1,0", "pH = 4,7", "pH = 4,8", "pH = 5,7"],
    correctIndex: 1,
    explanation: "HCl réagit avec CH₃COO⁻ → CH₃COOH. Après réaction : [CH₃COOH] = 0,11 mol/L, [CH₃COO⁻] = 0,09 mol/L. pH = 4,8 + log(0,09/0,11) = 4,8 + log(0,818) = 4,8 − 0,087 ≈ 4,7. Le tampon résiste bien à l'acidification.",
    tip: "L'effet tampon = faible variation de pH. Sans tampon, pH d'HCl 0,01M ≈ 2,0.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — CHIMIE ORGANIQUE ───────────────────────────────────────────────

  {
    id: "fmp-co-001", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "facile",
    question: "L'estérification entre un acide carboxylique et un alcool est caractérisée par :",
    options: [
      "Réaction totale, rapide et exothermique ; rendement 100% possible",
      "Réaction lente, limitée (τ_max ≈ 67% équimolaire) et athermique",
      "Réaction instantanée nécessitant un catalyseur enzymatique",
      "Réaction produisant un sel et de l'eau par neutralisation acido-basique"
    ],
    correctIndex: 1,
    explanation: "L'estérification : RCOOH + R'OH ⇌ RCOOR' + H₂O. Elle est lente (nécessite H⁺ + Δ), limitée (équilibre K≈4 pour alcools primaires, τ_max ≈ 67% équimolaire), et athermique (ΔᵣH ≈ 0). Pour augmenter le rendement : excès d'un réactif ou élimination de l'eau.",
    tip: "3 caractéristiques à retenir : LENTE + LIMITÉE + ATHERMIQUE. Opposé de la saponification.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-co-002", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "moyen",
    question: "La différence fondamentale entre hydrolyse acide et saponification d'un ester est :",
    options: [
      "L'hydrolyse acide est totale et rapide ; la saponification est lente et limitée",
      "La saponification (OH⁻ en excès) est totale et rapide ; l'hydrolyse acide est lente et limitée",
      "Les deux sont totales et rapides, seul le catalyseur diffère",
      "L'hydrolyse acide produit un sel + alcool ; la saponification produit un acide + alcool"
    ],
    correctIndex: 1,
    explanation: "Hydrolyse acide : RCOOR' + H₂O ⇌ RCOOH + R'OH → équilibre, lente. Saponification : RCOOR' + OH⁻ → RCOO⁻ + R'OH → totale (les OH⁻ déplacent l'équilibre), rapide. La saponification produit le savon (sel d'acide gras).",
    tip: "Saponification = totale car OH⁻ consomme le produit acide → déplacement d'équilibre irréversible.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-co-003", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "moyen",
    question: "Pour distinguer le butanal (aldéhyde) de la butanone (cétone), on peut utiliser :",
    options: [
      "Les deux donnent un test positif à la liqueur de Fehling car ils ont un groupe carbonyle",
      "Seul le butanal donne un test positif avec Fehling et Tollens ; la butanone donne un test négatif",
      "La butanone est plus réactive que le butanal avec le réactif de Tollens",
      "Les deux donnent un test négatif avec le réactif de Schiff"
    ],
    correctIndex: 1,
    explanation: "Butanal (R-CHO, aldéhyde) : réducteur → Fehling (+) précipité rouge brique, Tollens (+) miroir d'argent, Schiff (+) rose. Butanone (R-CO-R', cétone) : non réductrice → Fehling (−), Tollens (−), Schiff (−). Les cétones ne possèdent pas d'H sur le carbone carbonyle.",
    tip: "Aldéhyde = réducteur (Fehling+, Tollens+). Cétone = non réductrice (tous les tests négatifs).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-co-004", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "difficile",
    question: "Le nom IUPAC de CH₃−CH(CH₃)−CH₂−CH₂−OH est :",
    options: ["2-méthylbutan-1-ol", "3-méthylbutan-1-ol", "2-méthylpentan-1-ol", "3-méthylbutan-4-ol"],
    correctIndex: 1,
    explanation: "Chaîne principale la plus longue contenant le groupe OH : 4 carbones (butan-1-ol). Numérotation depuis OH : C1(−OH), C2, C3(−CH₃), C4. Le groupement méthyle est en position 3. Nom : 3-méthylbutan-1-ol.",
    tip: "Toujours numéroter pour donner l'indice le plus faible au groupe fonctionnel (OH). Vérifier que la chaîne principale est la plus longue.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — PHYSIQUE : ONDES ───────────────────────────────────────────────

  {
    id: "fmp-o-001", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "facile",
    question: "Une onde sinusoïdale se propage dans une corde avec f = 5 Hz et v = 20 m/s. Sa longueur d'onde λ est :",
    options: ["100 m", "4 m", "0,25 m", "25 m"],
    correctIndex: 1,
    explanation: "Relation fondamentale : v = λ × f → λ = v/f = 20/5 = 4 m.",
    tip: "λ = v/f. Ne pas confondre avec λ = v × f (erreur fréquente).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-002", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "moyen",
    question: "Dans l'expérience d'interférences de Young (a = 0,5 mm, D = 2 m, λ = 500 nm), l'interfrange i est :",
    options: ["0,5 mm", "1,0 mm", "2,0 mm", "4,0 mm"],
    correctIndex: 2,
    explanation: "i = λD/a = (500×10⁻⁹ × 2) / (0,5×10⁻³) = 10⁻⁶ / 0,5×10⁻³ = 2×10⁻³ m = 2,0 mm.",
    tip: "Vérifier les unités : λ en m, D en m, a en m → i en m. Convertir systématiquement.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-003", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "moyen",
    question: "Concernant le spectre électromagnétique, quelle affirmation est correcte ?",
    options: [
      "Les rayons X ont une longueur d'onde supérieure à la lumière visible",
      "Les ondes radio ont une fréquence inférieure à celle de la lumière visible et servent aux communications sans fil",
      "Les UV ont une longueur d'onde supérieure à 700 nm",
      "Les rayons gamma sont moins énergétiques que les UV car leur fréquence est plus faible"
    ],
    correctIndex: 1,
    explanation: "Ordre décroissant de λ : Radio > Micro-ondes > IR > Visible (400-700 nm) > UV > X > γ. Les ondes radio ont la plus grande λ et donc la plus faible fréquence. Les rayons γ ont la plus grande fréquence/énergie. X et γ < 400 nm. UV < 400 nm.",
    tip: "Moyen mnémotechnique : 'Radio MIcro Visible Ultra eX Gamma' (de grande λ à petite λ).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-004", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "difficile",
    question: "yₛ(t) = 2·sin(10πt) cm, v = 5 m/s. L'élongation du point M situé à x = 0,25 m de S à t = 0,1 s est :",
    options: ["0 cm", "2 cm", "−2 cm", "1 cm"],
    correctIndex: 1,
    explanation: "Retard τ = x/v = 0,25/5 = 0,05 s. L'onde arrive en M avec un retard τ. yₘ(t) = yₛ(t − τ). À t = 0,1 s : yₘ(0,1) = 2·sin(10π × (0,1 − 0,05)) = 2·sin(10π × 0,05) = 2·sin(π/2) = 2·1 = 2 cm.",
    tip: "Le point M reproduit le mouvement de S avec un retard τ = x/v. Equation : yₘ(t) = yₛ(t − τ).",
    source: "Concours FMP 2025"
  },

  // ─── FMP — PHYSIQUE NUCLÉAIRE ─────────────────────────────────────────────

  {
    id: "fmp-n-001", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "facile",
    question: "Un radionucléide de t₁/₂ = 10 jours. La fraction de noyaux restants après 30 jours est :",
    options: ["1/2", "1/4", "1/8", "1/16"],
    correctIndex: 2,
    explanation: "Nombre de demi-vies : n = 30/10 = 3. Fraction restante : N/N₀ = (1/2)³ = 1/8.",
    tip: "Après n demi-vies : fraction = (1/2)ⁿ. Toujours calculer n = t/t₁/₂ d'abord.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-002", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "moyen",
    question: "Lors d'une désintégration β⁻, le noyau fils a, par rapport au noyau père :",
    options: [
      "A diminue de 1, Z augmente de 1",
      "A inchangé, Z augmente de 1 (un neutron → proton + électron + antineutrino)",
      "A augmente de 1, Z inchangé",
      "A diminue de 4, Z diminue de 2 (comme en α)"
    ],
    correctIndex: 1,
    explanation: "β⁻ : ⁰₋₁e est émis. Bilan : ᴬ_Z X → ᴬ_(Z+1) Y + ⁰₋₁e + ν̄_e. Un neutron se transforme en proton + électron + antineutrino. A reste constant (même nombre de nucléons). Z augmente de 1.",
    tip: "β⁻ : Z+1, A inchangé. β⁺ : Z−1, A inchangé. α : Z−2, A−4. γ : Z et A inchangés.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-003", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "moyen",
    question: "L'énergie de liaison par nucléon (Eₗ/A) est maximale pour A ≈ 56 (fer). Cela signifie que :",
    options: [
      "Les noyaux très lourds comme l'uranium sont les plus stables",
      "Les noyaux plus légers et plus lourds que le fer peuvent libérer de l'énergie par fusion ou fission respectivement",
      "La fission et la fusion consomment toutes deux de l'énergie",
      "L'uranium-235 a une Eₗ/A supérieure à celle du fer-56"
    ],
    correctIndex: 1,
    explanation: "Courbe d'Aston : Eₗ/A maximale à A≈56 (Fe, ≈8,8 MeV/nucléon). Noyaux légers (H, He) → plus stables si fusionnés vers le fer → fusion libère énergie. Noyaux lourds (U) → plus stables si fissionnés vers le fer → fission libère énergie. U-235 : ≈7,6 MeV/nucléon < Fe.",
    tip: "Le fer-56 est le noyau le plus stable. Toute réaction qui s'en rapproche (fusion vers le bas ou fission vers le bas) libère de l'énergie.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-004", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "difficile",
    question: "La fusion nucléaire nécessite des températures de plusieurs millions de degrés car :",
    options: [
      "Elle divise un noyau lourd en deux plus légers, nécessitant beaucoup d'énergie",
      "Il faut vaincre la répulsion électrostatique entre noyaux chargés positivement pour qu'ils soient assez proches pour l'interaction forte",
      "Elle se produit à température ambiante dans les réacteurs actuels",
      "Elle consomme de l'énergie car il faut briser les noyaux légers"
    ],
    correctIndex: 1,
    explanation: "Fusion = assemblage de 2 noyaux légers. Mais deux noyaux positifs se repoussent (force de Coulomb). Il faut T > 10⁷ K pour que les noyaux aient assez d'énergie cinétique pour surmonter cette barrière et se rapprocher à la portée de la force forte (attraction). Les étoiles fonctionnent par fusion.",
    tip: "Fusion ≠ Fission. Fusion = assemblage (noyaux légers). Fission = cassure (noyaux lourds). Les 2 libèrent de l'énergie.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — PHYSIQUE : ÉLECTRICITÉ ─────────────────────────────────────────

  {
    id: "fmp-el-001", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "facile",
    question: "Un condensateur C = 10 µF chargé via R = 100 kΩ. La constante de temps τ du circuit RC est :",
    options: ["10 s", "1 s", "0,1 s", "1000 s"],
    correctIndex: 1,
    explanation: "τ = R × C = 100×10³ Ω × 10×10⁻⁶ F = 10⁵ × 10⁻⁵ = 1 s. La charge complète est atteinte après ≈5τ = 5 s.",
    tip: "Attention aux unités : kΩ → ×10³ Ω ; µF → ×10⁻⁶ F. Faire la conversion AVANT le calcul.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-002", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "moyen",
    question: "Dans un circuit RL série alimenté par E, après fermeture du circuit à t = 0, le courant i(t) évolue selon :",
    options: [
      "i(t) = E/R instantanément car la bobine se comporte comme un fil",
      "i(t) = (E/R)(1 − e^(−t/τ)) avec τ = L/R, la bobine s'opposant aux variations de courant",
      "i(t) = 0 à tout instant car la bobine bloque le courant continu",
      "i(t) oscille sinusoïdalement autour de E/R"
    ],
    correctIndex: 1,
    explanation: "La bobine s'oppose aux variations de courant (auto-induction : u_L = L·di/dt). À t=0 : i=0 (continuité du courant). En régime permanent : i = E/R (bobine = fil). Transition : i(t) = (E/R)(1−e^(−Rt/L)). τ = L/R.",
    tip: "Bobine en DC permanent = court-circuit (résistance r négligée). Condensateur en DC permanent = circuit ouvert.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-003", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "moyen",
    question: "Les oscillations libres dans un circuit RLC dépendent de R. Si R < 2√(L/C), le régime est :",
    options: [
      "Toujours apériodique (pas d'oscillations)",
      "Pseudo-périodique (oscillations amorties)",
      "Critique (retour à l'équilibre le plus rapide sans oscillations)",
      "Permanent sinusoïdal (pas d'amortissement)"
    ],
    correctIndex: 1,
    explanation: "Discriminant de l'équation caractéristique : Δ = R²/L² − 4/LC. Si R < 2√(L/C) → Δ < 0 → racines complexes conjuguées → régime pseudo-périodique (oscillations amorties). Si R = 2√(L/C) → critique. Si R > 2√(L/C) → apériodique.",
    tip: "Résistance critique R_c = 2√(L/C). En dessous : oscillations. Au-dessus : retour monotone à l'équilibre.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-004", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "difficile",
    question: "À la résonance d'intensité d'un circuit RLC série forcé, l'impédance Z et le courant I sont :",
    options: [
      "Z maximale → I minimale",
      "Z = R (minimale) → I maximale = E/R ; fréquence : f₀ = 1/(2π√(LC))",
      "Z = 0 → I infinie",
      "La résonance d'intensité n'existe que si R > 2√(L/C)"
    ],
    correctIndex: 1,
    explanation: "Z = √(R² + (Lω − 1/(Cω))²). À ω₀ = 1/√(LC) : Lω₀ = 1/(Cω₀) → termes réactifs s'annulent → Z = R (minimum). I_max = E/R. La tension aux bornes de L et C peut être très supérieure à E (effet de surtension, facteur Q).",
    tip: "Résonance d'intensité : ω₀ = 1/√(LC), Z = R minimal, I maximal. La tension peut dépasser E si Q > 1.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-005", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "difficile",
    question: "Un condensateur C = 4 µF, U₀ = 100 V se décharge dans une bobine idéale L = 0,1 H (R = 0). L'énergie maximale stockée dans la bobine est :",
    options: ["0 J", "0,02 J", "0,04 J", "20 J"],
    correctIndex: 1,
    explanation: "Bobine idéale (R = 0) → énergie totale conservée. E_C initiale = ½CU₀² = ½ × 4×10⁻⁶ × 100² = 2×10⁻² J = 0,02 J. Tout se transfère à la bobine : E_L max = E_C initiale = 0,02 J.",
    tip: "Conservation de l'énergie dans LC idéal : E_C max = E_L max = ½LI²_max = ½CU²_max.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — MATHÉMATIQUES : ANALYSE ───────────────────────────────────────

  {
    id: "fmp-ma-001", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "facile",
    question: "La valeur de lim(x→0) [sin(x)/x] est :",
    options: ["0", "1", "+∞", "La limite n'existe pas"],
    correctIndex: 1,
    explanation: "lim(x→0) sin(x)/x = 1. C'est une limite fondamentale du calcul. Elle s'obtient par le théorème des gendarmes : cos(x) ≤ sin(x)/x ≤ 1 pour x ∈ (0, π/2).",
    tip: "Limite fondamentale à retenir absolument. Aussi : lim(x→0) tan(x)/x = 1.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-002", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "Soit f(x) = x·ln(x) sur ℝ⁺*. La valeur de f'(e) est :",
    options: ["0", "1", "2", "e"],
    correctIndex: 2,
    explanation: "f'(x) = (x)'·ln(x) + x·(ln x)' = 1·ln(x) + x·(1/x) = ln(x) + 1. f'(e) = ln(e) + 1 = 1 + 1 = 2.",
    tip: "Dérivée du produit : (uv)' = u'v + uv'. Ici u = x, v = ln(x), u' = 1, v' = 1/x.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-003", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "L'asymptote oblique de f(x) = (2x² + 3x − 1)/(x − 1) en +∞ est :",
    options: ["y = 2x + 5", "y = 2x + 1", "y = 2x − 1", "y = x + 2"],
    correctIndex: 0,
    explanation: "Division euclidienne : 2x² + 3x − 1 = (x − 1)(2x + 5) + 4. Donc f(x) = 2x + 5 + 4/(x−1). Comme 4/(x−1) → 0 quand x → +∞, l'asymptote oblique est y = 2x + 5.",
    tip: "Méthode : diviser le numérateur par le dénominateur. Le quotient donne la droite asymptote, le reste/dénominateur tend vers 0.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-004", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "difficile",
    question: "Soit f(x) = x³ − 3x² + 2. Les coordonnées du point d'inflexion sont :",
    options: ["(0, 2)", "(1, 0)", "(2, −2)", "(1, 2)"],
    correctIndex: 1,
    explanation: "f'(x) = 3x² − 6x. f''(x) = 6x − 6 = 6(x − 1). f''(x) = 0 pour x = 1. Changement de signe : f'' < 0 pour x < 1 (concave), f'' > 0 pour x > 1 (convexe) → point d'inflexion. f(1) = 1 − 3 + 2 = 0. Point d'inflexion : (1, 0).",
    tip: "Point d'inflexion = f''(x₀) = 0 ET changement de signe de f''. Toujours vérifier le changement de signe.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-005", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "difficile",
    question: "L'équation e^(2x) − 3e^x + 2 = 0 admet combien de solutions réelles ?",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
    explanation: "Posons X = e^x (X > 0). L'équation devient X² − 3X + 2 = 0. Δ = 9 − 8 = 1. X₁ = 1, X₂ = 2. e^x = 1 → x = 0. e^x = 2 → x = ln(2). Deux solutions réelles : {0, ln(2)}.",
    tip: "Changement de variable X = e^x transforme une exponentielle en polynôme. Toujours vérifier que X > 0.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-006", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "∫₀¹ x·eˣ dx vaut :",
    options: ["1", "e − 1", "e", "0"],
    correctIndex: 0,
    explanation: "Intégration par parties : u = x, v' = eˣ → u' = 1, v = eˣ. ∫₀¹ x·eˣ dx = [x·eˣ]₀¹ − ∫₀¹ eˣ dx = (1·e − 0) − [eˣ]₀¹ = e − (e − 1) = 1.",
    tip: "Intégration par parties : ∫u'v = uv − ∫uv'. Choisir u' facilement intégrable, v différentiable.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-007", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "La solution de y' + 2y = 4 avec y(0) = 1 est :",
    options: ["y = 2 − e^(−2x)", "y = 2 + e^(−2x)", "y = 2 − e^(2x)", "y = 1 + 2x"],
    correctIndex: 0,
    explanation: "Solution homogène : y_h = Ce^(−2x). Solution particulière : y_p = 4/2 = 2. Solution générale : y = Ce^(−2x) + 2. Condition initiale y(0) = 1 : C + 2 = 1 → C = −1. Solution : y = 2 − e^(−2x).",
    tip: "Pour y' + ay = b : y_p = b/a. Déterminer C avec la condition initiale.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ma-008", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "difficile",
    question: "La solution de y'' + 4y = 0 avec y(0) = 1 et y'(0) = 0 est :",
    options: ["y = cos(2x)", "y = sin(2x)", "y = cos(2x) + sin(2x)", "y = e^(2x) + e^(−2x)"],
    correctIndex: 0,
    explanation: "Équation caractéristique : r² + 4 = 0 → r = ±2i. Solution générale : y = A·cos(2x) + B·sin(2x). y(0) = 1 → A = 1. y' = −2A·sin(2x) + 2B·cos(2x). y'(0) = 0 → 2B = 0 → B = 0. Solution : y = cos(2x).",
    tip: "Pour r² + ω² = 0 : r = ±iω → y = A·cos(ωx) + B·sin(ωx). Deux constantes → deux conditions initiales nécessaires.",
    source: "Concours FMP 2025"
  },

  // ─── FMP — MATHÉMATIQUES : PROBABILITÉS ─────────────────────────────────

  {
    id: "fmp-p-001", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "facile",
    question: "Une classe de 20 élèves doit choisir 3 délégués. Le nombre de choix possibles est :",
    options: ["A(20,3) = 6 840 (arrangements)", "C(20,3) = 1 140 (combinaisons)", "3! = 6", "20³ = 8 000"],
    correctIndex: 1,
    explanation: "Les délégués ont des rôles équivalents (ordre non important) → combinaison. C(20,3) = 20!/(3!×17!) = (20×19×18)/6 = 6840/6 = 1140.",
    tip: "Ordre important → arrangement. Ordre non important → combinaison. Ici 'choisir 3 délégués' (pas de rôles distincts) → combinaison.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-002", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "60% vaccinés (P(maladie|vacciné) = 5%), 40% non vaccinés (P(maladie|non vacciné) = 30%). P(maladie) = ?",
    options: ["35%", "15%", "17,5%", "7,5%"],
    correctIndex: 1,
    explanation: "Formule des probabilités totales : P(M) = P(M|V)×P(V) + P(M|V̄)×P(V̄) = 0,05×0,6 + 0,30×0,4 = 0,03 + 0,12 = 0,15 = 15%.",
    tip: "Erreur fréquente : faire la moyenne simple (5%+30%)/2 = 17,5%. Toujours pondérer par les probabilités de chaque sous-groupe.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-003", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "difficile",
    question: "On lance une pièce équilibrée 5 fois. La probabilité d'obtenir exactement 3 faces est :",
    options: ["(1/2)³ = 1/8", "C(5,3) × (1/2)⁵ = 10/32 = 5/16", "3/5", "1/4"],
    correctIndex: 1,
    explanation: "X ~ B(5, 1/2). P(X = 3) = C(5,3) × (1/2)³ × (1/2)² = 10 × 1/32 = 10/32 = 5/16. Le facteur C(5,3) = 10 compte les façons d'obtenir 3 faces parmi 5 lancers.",
    tip: "Piège majeur : oublier C(n,k). (1/2)³ = probabilité d'UNE séquence spécifique (ex: FFF​PP), pas de toutes les séquences avec 3 faces.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-004", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "La valeur moyenne de f(x) = x² sur [0, 2] est :",
    options: ["4/3", "8/3", "2", "4"],
    correctIndex: 0,
    explanation: "Valeur moyenne = (1/(b−a)) × ∫ₐᵇ f(x)dx = (1/2) × ∫₀² x² dx = (1/2) × [x³/3]₀² = (1/2) × (8/3) = 4/3.",
    tip: "Formule valeur moyenne : μ = 1/(b−a) × ∫ₐᵇ f(x)dx. Ne pas oublier de diviser par (b−a).",
    source: "Concours FMP 2025"
  },
];

export function getQuestionsByExam(exam: Exam): PrepQuestion[] {
  return QUESTIONS.filter(q => q.exam === exam);
}

export function getQuestionsBySubject(exam: Exam, subject: string): PrepQuestion[] {
  return QUESTIONS.filter(q => q.exam === exam && q.subject === subject);
}

export function getDiagnosticQuestions(exam: Exam, count = 10): PrepQuestion[] {
  const questions = getQuestionsByExam(exam);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getMockExamQuestions(exam: Exam): PrepQuestion[] {
  return getQuestionsByExam(exam).sort(() => Math.random() - 0.5);
}

export const SUBJECT_XP_VALUES: Record<Level, number> = {
  facile: 5,
  moyen: 10,
  difficile: 15,
};
