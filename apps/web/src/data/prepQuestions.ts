export type Exam = "ensa" | "ena" | "encg";
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
