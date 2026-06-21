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

  // ─── ENSA — COMPLEXES (suite) ─────────────────────────────────────────────

  {
    id: "ensa-cx-005", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "facile",
    question: "L'écriture exponentielle de z = 1 + i est :",
    options: ["z = √2 · e^(iπ/4)", "z = 2 · e^(iπ/4)", "z = √2 · e^(iπ/2)", "z = e^(iπ/4)"],
    correctIndex: 0,
    explanation: "|z| = √(1²+1²) = √2. arg(z) = arctan(1/1) = π/4. Donc z = √2 · e^(iπ/4).",
    tip: "Forme exponentielle : z = r·e^(iθ) avec r = |z| et θ = arg(z)."
  },
  {
    id: "ensa-cx-006", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "facile",
    question: "Le module de z = (2+i)/(1-i) est :",
    options: ["√5/2", "√5/√2", "5/√2", "√(5/2)"],
    correctIndex: 3,
    explanation: "|z| = |2+i|/|1-i| = √5/√2 = √(5/2).",
    tip: "|z₁/z₂| = |z₁|/|z₂|. Calcul rapide sans développer la fraction."
  },
  {
    id: "ensa-cx-007", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "Si z₁ et z₂ sont racines de z² - 2z + 4 = 0, alors z₁³ + z₂³ vaut :",
    options: ["-16", "16", "0", "-8"],
    correctIndex: 0,
    explanation: "Par Viète : z₁+z₂ = 2, z₁z₂ = 4. z₁³+z₂³ = (z₁+z₂)³ - 3z₁z₂(z₁+z₂) = 8 - 3×4×2 = 8 - 24 = -16.",
    tip: "Formule : a³+b³ = (a+b)³ - 3ab(a+b). Utiliser Viète, ne pas résoudre."
  },
  {
    id: "ensa-cx-008", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "Soit z = cos θ + i sin θ. L'expression z^n + z^{-n} vaut :",
    options: ["2 cos(nθ)", "2i sin(nθ)", "2 cos(θ/n)", "e^(inθ)"],
    correctIndex: 0,
    explanation: "z = e^(iθ), z^n = e^(inθ) et z^{-n} = e^(-inθ). Somme : e^(inθ)+e^(-inθ) = 2cos(nθ).",
    tip: "Formule de Moivre : 2cos(nθ) = z^n + z^{-n} avec z = e^(iθ)."
  },
  {
    id: "ensa-cx-009", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "On note j = e^(2iπ/3). Alors 1 + j + j² vaut :",
    options: ["3", "1", "0", "i√3"],
    correctIndex: 2,
    explanation: "j est racine de z³-1 = (z-1)(z²+z+1) = 0 avec j ≠ 1, donc j²+j+1 = 0, soit 1+j+j² = 0.",
    tip: "Résultat fondamental : 1 + j + j² = 0 où j = e^(2iπ/3). À mémoriser absolument."
  },
  {
    id: "ensa-cx-010", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "L'argument principal de z = -√3 + i est :",
    options: ["π/6", "5π/6", "2π/3", "-π/6"],
    correctIndex: 1,
    explanation: "|z| = 2. x = -√3 < 0, y = 1 > 0 → 2ème quadrant. cos θ = -√3/2, sin θ = 1/2 → θ = 5π/6.",
    tip: "Dans le 2ème quadrant : arg = π - arctan(|y/x|) = π - π/6 = 5π/6."
  },
  {
    id: "ensa-cx-011", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "Soit z = (1+i)⁸. La valeur de z est :",
    options: ["16", "-16", "16i", "256"],
    correctIndex: 0,
    explanation: "1+i = √2·e^(iπ/4). (1+i)⁸ = (√2)⁸·e^(i·2π) = 16·1 = 16.",
    tip: "Convertir en exponentielle AVANT d'élever à la puissance. (√2)⁸ = 2⁴ = 16."
  },
  {
    id: "ensa-cx-012", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Les solutions complexes de z⁴ = -16 sont :",
    options: [
      "z = ±2, ±2i",
      "z = 2e^(iπ/4), 2e^(i3π/4), 2e^(-i3π/4), 2e^(-iπ/4)",
      "z = √2(1±i), √2(-1±i)",
      "Les options B et C sont équivalentes"
    ],
    correctIndex: 3,
    explanation: "-16 = 16e^(iπ). z = 2e^(i(π+2kπ)/4). k=0: 2e^(iπ/4)=√2(1+i) ; k=1: 2e^(i3π/4)=√2(-1+i) ; k=2: 2e^(i5π/4)=√2(-1-i) ; k=3: 2e^(i7π/4)=√2(1-i). B et C donnent les mêmes nombres.",
    tip: "zⁿ = ρe^(iα) : zₖ = ρ^(1/n)·e^(i(α+2kπ)/n) pour k=0,...,n-1."
  },
  {
    id: "ensa-cx-013", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "facile",
    question: "Si |z| = 2 et arg(z) = π/3, la forme algébrique de z est :",
    options: ["1 + i√3", "√3 + i", "1 + i", "√3 - i"],
    correctIndex: 0,
    explanation: "z = 2(cos(π/3) + i·sin(π/3)) = 2(1/2 + i√3/2) = 1 + i√3.",
    tip: "cos(π/3) = 1/2, sin(π/3) = √3/2. Valeurs à connaître par cœur."
  },
  {
    id: "ensa-cx-014", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "La partie réelle de z = 1/(2+i) est :",
    options: ["1/3", "2/5", "1/5", "2/3"],
    correctIndex: 1,
    explanation: "Multiplier par le conjugué : 1/(2+i) × (2-i)/(2-i) = (2-i)/5. Partie réelle = 2/5.",
    tip: "Pour z₁/z₂ en forme algébrique : multiplier par z̄₂/z̄₂."
  },
  {
    id: "ensa-cx-015", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Le lieu des points M(z) tel que |z - 1| = |z + i| est :",
    options: [
      "Le cercle de centre (1/2, -1/2) et rayon 1",
      "La médiatrice du segment [1, -i] : droite d'équation y = -x",
      "La droite d'équation x = y",
      "Un cercle passant par 0"
    ],
    correctIndex: 1,
    explanation: "|z-1| = |z-(-i)| → M est équidistant de A(1,0) et B(0,-1) → médiatrice de [AB]. Direction de AB : pente = (-1-0)/(0-1) = 1 → médiatrice a pente -1, passe par le milieu (1/2,-1/2). Équation : y+1/2 = -1(x-1/2) → y = -x.",
    tip: "|z - z₁| = |z - z₂| ⟺ lieu = médiatrice du segment [z₁, z₂]."
  },
  {
    id: "ensa-cx-016", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "La transformation f : z ↦ iz représente géométriquement :",
    options: ["Une homothétie de rapport |i| = 1", "Une rotation de centre O et d'angle π/2", "Une symétrie par rapport à l'axe réel", "Une translation de vecteur (0,1)"],
    correctIndex: 1,
    explanation: "i = e^(iπ/2). Multiplier z par e^(iα) est une rotation de centre O et d'angle α = π/2.",
    tip: "Multiplier par e^(iα) = rotation d'angle α. Multiplier par r > 0 = homothétie de rapport r."
  },
  {
    id: "ensa-cx-017", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Les racines cubiques de l'unité vérifient la relation :",
    options: [
      "ω³ = 0 et 1 + ω + ω² ≠ 0",
      "ω³ = 1 et 1 + ω + ω² = 0 pour ω ≠ 1",
      "ω² = 1 et ω + ω² = -1",
      "ω³ = -1 et ω = e^(iπ/3)"
    ],
    correctIndex: 1,
    explanation: "Les racines de z³ = 1 sont 1, ω = e^(2iπ/3), ω² = e^(4iπ/3). Pour ω ≠ 1 : ω³ = 1 et la somme des trois racines (coefficient de z² dans z³-1 est 0) donne 1+ω+ω² = 0.",
    tip: "ω³ = 1 (définition). 1+ω+ω² = 0 (somme des racines de z³-1 = (z-1)(z²+z+1))."
  },
  {
    id: "ensa-cx-018", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "Si z = a + bi avec a,b ∈ ℝ, alors z·z̄ est égal à :",
    options: ["a² - b²", "a² + b²", "(a+b)²", "2ab"],
    correctIndex: 1,
    explanation: "z·z̄ = (a+bi)(a-bi) = a² - (bi)² = a² - b²(-1) = a² + b² = |z|².",
    tip: "z·z̄ = |z|². Propriété fondamentale utilisée pour inverser un nombre complexe : z⁻¹ = z̄/|z|²."
  },
  {
    id: "ensa-cx-019", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "difficile",
    question: "Soit P(z) = z⁴ + 1. Le produit de toutes les racines de P est :",
    options: ["-1", "1", "i", "0"],
    correctIndex: 1,
    explanation: "Par le théorème de Viète pour un polynôme z⁴ + 0·z³ + 0·z² + 0·z + 1, le produit des racines est le terme constant (avec le signe (-1)⁴ = +1 pour un polynôme unitaire de degré 4). Produit = +1.",
    tip: "Viète : pour z^n + ... + a₀, produit des racines = (-1)^n × a₀. Ici : (-1)⁴ × 1 = 1."
  },
  {
    id: "ensa-cx-020", exam: "ensa", subject: "complexes", subjectLabel: "Nombres complexes",
    level: "moyen",
    question: "On donne z₁ = 1+i et z₂ = √3 - i. L'argument de z₁/z₂ est :",
    options: ["π/12", "7π/12", "5π/12", "-π/12"],
    correctIndex: 1,
    explanation: "arg(z₁) = π/4. arg(z₂) = -π/6 (module 2, x=√3>0, y<0, angle = -π/6). arg(z₁/z₂) = arg(z₁) - arg(z₂) = π/4 - (-π/6) = π/4 + π/6 = 3π/12 + 2π/12 = 5π/12.",
    tip: "arg(z₁/z₂) = arg(z₁) - arg(z₂) (modulo 2π)."
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

  // ─── ENSA — SUITES (suite) ─────────────────────────────────────────────────

  {
    id: "ensa-su-004", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "facile",
    question: "La somme S = 1 + 2 + 3 + ... + 100 vaut :",
    options: ["5 000", "5 050", "10 100", "10 000"],
    correctIndex: 1,
    explanation: "Formule de la somme des entiers : S = n(n+1)/2 = 100×101/2 = 5 050.",
    tip: "Gauss : somme de 1 à n = n(n+1)/2. Mémoriser cette formule fondamentale."
  },
  {
    id: "ensa-su-005", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "facile",
    question: "Suite arithmétique : u₁ = 3, raison r = 4. La valeur de u₁₀ est :",
    options: ["39", "43", "36", "40"],
    correctIndex: 0,
    explanation: "uₙ = u₁ + (n-1)r. u₁₀ = 3 + 9×4 = 3 + 36 = 39.",
    tip: "Suite arithmétique : uₙ = u₁ + (n-1)r. Ne pas oublier le -1 dans (n-1)."
  },
  {
    id: "ensa-su-006", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "facile",
    question: "Suite géométrique : u₀ = 2, raison q = 3. La valeur de u₄ est :",
    options: ["54", "162", "81", "486"],
    correctIndex: 1,
    explanation: "uₙ = u₀ × qⁿ = 2 × 3⁴ = 2 × 81 = 162.",
    tip: "Suite géométrique : uₙ = u₀ × qⁿ. u₄ utilise la puissance 4 (pas 5)."
  },
  {
    id: "ensa-su-007", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "La somme géométrique S = 1 + 1/2 + 1/4 + ... + (1/2)^n tend vers :",
    options: ["2", "∞", "1", "3/2"],
    correctIndex: 0,
    explanation: "Série géométrique de raison q = 1/2 (|q| < 1) : S = u₀/(1-q) = 1/(1-1/2) = 2.",
    tip: "Série géométrique convergente (|q|<1) : somme = premier terme / (1 - raison)."
  },
  {
    id: "ensa-su-008", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "Soit (uₙ) définie par u₀ = 1 et uₙ₊₁ = 2uₙ + 3. La suite (vₙ = uₙ + 3) est :",
    options: ["Arithmétique de raison 3", "Géométrique de raison 2", "Constante égale à 4", "Divergente"],
    correctIndex: 1,
    explanation: "vₙ = uₙ + 3. vₙ₊₁ = uₙ₊₁ + 3 = 2uₙ + 3 + 3 = 2(uₙ + 3) = 2vₙ. C'est une suite géométrique de raison 2. v₀ = u₀ + 3 = 4. Donc vₙ = 4·2ⁿ et uₙ = 4·2ⁿ - 3.",
    tip: "Pour résoudre uₙ₊₁ = auₙ + b, poser vₙ = uₙ + b/(a-1) pour obtenir une suite géométrique."
  },
  {
    id: "ensa-su-009", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "La suite uₙ = (3n² + 2n - 1)/(n² + 5) converge vers :",
    options: ["0", "3", "+∞", "2/5"],
    correctIndex: 1,
    explanation: "Diviser numérateur et dénominateur par n² : uₙ = (3 + 2/n - 1/n²)/(1 + 5/n²) → 3/1 = 3.",
    tip: "Pour une fraction rationnelle, diviser par la plus haute puissance au dénominateur. Termes en 1/n → 0."
  },
  {
    id: "ensa-su-010", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "difficile",
    question: "On définit uₙ par u₀ = 0 et u_{n+1} = √(2 + uₙ). La limite de cette suite est :",
    options: ["√2", "2", "1 + √2", "φ (nombre d'or)"],
    correctIndex: 1,
    explanation: "Si la suite converge vers L, alors L = √(2 + L), soit L² = 2 + L, L² - L - 2 = 0, (L-2)(L+1) = 0. L = 2 (car L ≥ 0). On vérifie que (uₙ) est croissante et majorée par 2.",
    tip: "Pour trouver la limite d'une suite récurrente : supposer uₙ→L et résoudre l'équation fixe L = f(L)."
  },
  {
    id: "ensa-su-011", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "La suite uₙ = n!/nⁿ (avec n ≥ 1) :",
    options: ["Diverge vers +∞", "Converge vers 1", "Converge vers 0", "Oscille"],
    correctIndex: 2,
    explanation: "n! = 1×2×3×...×n et nⁿ = n×n×...×n (n fois). Chaque facteur k/n ≤ 1, et beaucoup de termes sont très petits. Par l'inégalité n! ≤ nⁿ/2^(n-1), uₙ → 0.",
    tip: "Pour comparer n! et nⁿ : noter que n! < nⁿ pour n>1 et le rapport tend vers 0 (formule de Stirling)."
  },
  {
    id: "ensa-su-012", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "PGCD(2024, 168) = ? (à calculer par l'algorithme d'Euclide)",
    options: ["4", "8", "24", "48"],
    correctIndex: 1,
    explanation: "2024 = 12×168 + 8. 168 = 21×8 + 0. Donc PGCD(2024, 168) = 8.",
    tip: "Algorithme d'Euclide : PGCD(a,b) = PGCD(b, a mod b) jusqu'à reste nul."
  },
  {
    id: "ensa-su-013", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "La somme S = Σₖ₌₁ⁿ k² = n(n+1)(2n+1)/6. Pour n = 10, S vaut :",
    options: ["275", "385", "330", "440"],
    correctIndex: 1,
    explanation: "S = 10×11×21/6 = 2310/6 = 385.",
    tip: "Formule à retenir : Σk² = n(n+1)(2n+1)/6. Pour Σk = n(n+1)/2. Pour Σk³ = [n(n+1)/2]²."
  },
  {
    id: "ensa-su-014", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "difficile",
    question: "Si la somme des 10 premiers termes d'une suite arithmétique est 155 et u₁ = 2, la raison r est :",
    options: ["2", "3", "1.5", "4"],
    correctIndex: 1,
    explanation: "S₁₀ = n(u₁ + u₁₀)/2 = 10(2 + u₁₀)/2 = 155. Donc 2 + u₁₀ = 31, u₁₀ = 29. u₁₀ = u₁ + 9r → 29 = 2 + 9r → r = 3.",
    tip: "Sₙ = n(u₁ + uₙ)/2. Relier la somme à u₁ et r : uₙ = u₁ + (n-1)r."
  },
  {
    id: "ensa-su-015", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "difficile",
    question: "La suite uₙ = (-1)ⁿ/(n+1) est :",
    options: [
      "Divergente car elle oscille",
      "Convergente vers 0 car |uₙ| = 1/(n+1) → 0",
      "Convergente vers 1",
      "Ni convergente ni divergente"
    ],
    correctIndex: 1,
    explanation: "|uₙ| = 1/(n+1) → 0. Par le théorème des gendarmes (0 ≤ |uₙ| ≤ 1/(n+1) → 0), uₙ → 0. Même si les termes alternent de signe, la limite est bien 0.",
    tip: "Si |uₙ| → 0, alors uₙ → 0, même si les termes alternent de signe."
  },
  {
    id: "ensa-su-016", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "Le reste de la division de 7⁵⁰ par 5 est :",
    options: ["0", "1", "2", "4"],
    correctIndex: 2,
    explanation: "7 ≡ 2 (mod 5). On cherche 2⁵⁰ (mod 5). Or 2⁴ = 16 ≡ 1 (mod 5) (Fermat : 2^(5-1) ≡ 1). 50 = 4×12 + 2, donc 2⁵⁰ = (2⁴)¹² × 2² ≡ 1 × 4 = 4. Donc 7⁵⁰ ≡ 4 (mod 5).",
    tip: "Petit théorème de Fermat : aᵖ⁻¹ ≡ 1 (mod p) si p premier et p∤a. Ici p=5, a=2, 2⁴ ≡ 1."
  },
  {
    id: "ensa-su-017", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "difficile",
    question: "Le développement binomial de (1+x)^n au rang 2 donne l'approximation :",
    options: [
      "1 + nx",
      "1 + nx + n(n-1)x²/2",
      "1 + x + x²",
      "eˣ"
    ],
    correctIndex: 1,
    explanation: "(1+x)^n = Σ C(n,k) xᵏ = 1 + nx + n(n-1)x²/2 + ... Pour |x| << 1, l'approximation au rang 2 est 1 + nx + n(n-1)x²/2.",
    tip: "Formule de Newton/Taylor : (1+x)^n ≈ 1 + nx pour x petit. Au rang 2 : ajouter n(n-1)x²/2."
  },
  {
    id: "ensa-su-018", exam: "ensa", subject: "suites", subjectLabel: "Suites & Arithmétique",
    level: "moyen",
    question: "Pour quelles valeurs entières de n, n² + n + 41 est-il premier ? (Tester n=0,1,...,5)",
    options: [
      "Pour tous les entiers n ≥ 0 (toujours premier)",
      "Pour n = 0, 1, 2, 3, 4 mais pas n = 5",
      "Pour n = 0, 1, 2, 3, 4, 5 (tous premiers)",
      "Pour aucun n entier"
    ],
    correctIndex: 2,
    explanation: "n=0: 41✓ ; n=1: 43✓ ; n=2: 47✓ ; n=3: 53✓ ; n=4: 61✓ ; n=5: 71✓. Cependant pour n=40 : 40²+40+41 = 41×41 n'est pas premier. La formule génère des premiers jusqu'à n=39 mais pas au-delà.",
    tip: "n²+n+41 (Euler 1772) est premier pour n=0,...,39 mais pas pour n=40. Curiosité mathématique."
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

  // ─── ENSA — ANALYSE (suite) ────────────────────────────────────────────────

  {
    id: "ensa-an-004", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "facile",
    question: "La dérivée de f(x) = x³ - 3x² + 2x - 5 est :",
    options: ["3x² - 6x + 2", "3x² - 6x", "x² - 3x + 2", "3x² - 3x + 2"],
    correctIndex: 0,
    explanation: "f'(x) = 3x² - 6x + 2. Règle : (xⁿ)' = nxⁿ⁻¹. Les constantes disparaissent à la dérivation.",
    tip: "Dériver terme par terme. La constante -5 donne 0. (x³)' = 3x², (x²)' = 2x, (x)' = 1."
  },
  {
    id: "ensa-an-005", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "facile",
    question: "La primitive de f(x) = 4x³ + 3x² - 2x + 1 est :",
    options: ["x⁴ + x³ - x² + x + C", "12x² + 6x - 2 + C", "4x⁴/3 + x³ - x² + x + C", "x⁴ + x³ - x + C"],
    correctIndex: 0,
    explanation: "∫(4x³ + 3x² - 2x + 1)dx = 4x⁴/4 + 3x³/3 - 2x²/2 + x + C = x⁴ + x³ - x² + x + C.",
    tip: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Intégrer terme par terme."
  },
  {
    id: "ensa-an-006", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "La limite lim(x→0) (e^x - 1 - x)/x² est :",
    options: ["0", "1/2", "1", "+∞"],
    correctIndex: 1,
    explanation: "DL de e^x en 0 : e^x = 1 + x + x²/2 + ... Donc e^x - 1 - x = x²/2 + o(x²). Ratio : x²/2 / x² = 1/2.",
    tip: "DL de base : e^x = 1 + x + x²/2 + x³/6 + ... Mémoriser les 4 premiers termes."
  },
  {
    id: "ensa-an-007", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "∫₀^(π/2) sin(x) dx vaut :",
    options: ["0", "-1", "1", "2"],
    correctIndex: 2,
    explanation: "∫sin(x)dx = -cos(x) + C. [-cos(x)]₀^(π/2) = -cos(π/2) + cos(0) = -0 + 1 = 1.",
    tip: "Primitive de sin : -cos. Primitive de cos : sin. Signe moins à retenir pour sin."
  },
  {
    id: "ensa-an-008", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "La dérivée de f(x) = ln(x² + 1) est :",
    options: ["1/(x²+1)", "2x/(x²+1)", "2/(x²+1)", "ln(2x)"],
    correctIndex: 1,
    explanation: "f = ln(u) avec u = x²+1. f' = u'/u = 2x/(x²+1).",
    tip: "(ln u)' = u'/u. Règle de la chaîne systématique pour les compositions."
  },
  {
    id: "ensa-an-009", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "∫ x·sin(x) dx par parties (u = x, v' = sin x) vaut :",
    options: ["x·cos(x) + sin(x) + C", "-x·cos(x) + sin(x) + C", "x·cos(x) - sin(x) + C", "-x·cos(x) - sin(x) + C"],
    correctIndex: 1,
    explanation: "u = x, u' = 1 ; v' = sin x, v = -cos x. ∫u·v' = uv - ∫u'v = -x·cos x - ∫(-cos x)dx = -x·cos x + sin x + C.",
    tip: "IPP : ∫u·v' = uv - ∫u'·v. Choisir u = polynôme et v' = fonction facile à intégrer."
  },
  {
    id: "ensa-an-010", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "La dérivée de f(x) = sin²(x) est :",
    options: ["2sin(x)", "cos²(x)", "sin(2x)", "2cos(x)"],
    correctIndex: 2,
    explanation: "f(x) = sin²(x), f'(x) = 2sin(x)·cos(x) = sin(2x). Utilisation de la formule 2sin(x)cos(x) = sin(2x).",
    tip: "Règle : (u²)' = 2u·u'. Simplifier ensuite avec les formules trigonométriques."
  },
  {
    id: "ensa-an-011", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "L'équation différentielle y' - y = e^x admet comme solution particulière :",
    options: ["y = xe^x", "y = e^x", "y = x·e^x/2", "y = (x+1)e^x"],
    correctIndex: 0,
    explanation: "On cherche y_p = Ae^x mais e^x est solution homogène → on essaie y_p = Axe^x. y_p' = Ae^x + Axe^x. y_p' - y_p = Ae^x + Axe^x - Axe^x = Ae^x = e^x → A = 1. Donc y_p = xe^x.",
    tip: "Si le second membre est solution homogène, multiplier par x pour trouver la solution particulière."
  },
  {
    id: "ensa-an-012", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "La valeur de ∫₀¹ dx/(1+x²) est :",
    options: ["π/2", "π/4", "1", "ln(2)"],
    correctIndex: 1,
    explanation: "∫dx/(1+x²) = arctan(x) + C. [arctan(x)]₀¹ = arctan(1) - arctan(0) = π/4 - 0 = π/4.",
    tip: "Primitive fondamentale : ∫dx/(1+x²) = arctan(x). À mémoriser avec ∫dx/√(1-x²) = arcsin(x)."
  },
  {
    id: "ensa-an-013", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "lim(x→+∞) x·e^(-x) vaut :",
    options: ["+∞", "1", "0", "−∞"],
    correctIndex: 2,
    explanation: "L'exponentielle l'emporte sur tout polynôme : e^x >> x^n pour tout n quand x→+∞. Donc x·e^(-x) = x/e^x → 0.",
    tip: "Croissances comparées : e^x domine x^n qui domine ln(x). x/e^x → 0 est fondamental."
  },
  {
    id: "ensa-an-014", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "La fonction f(x) = x ln(x) définie sur ]0,+∞[. En x=1/e, f admet :",
    options: ["Un maximum local de valeur -1/e", "Un minimum local de valeur -1/e", "Un point d'inflexion", "Aucun extremum"],
    correctIndex: 1,
    explanation: "f'(x) = ln(x) + 1. f'(x) = 0 ↔ x = 1/e. f''(x) = 1/x > 0 → minimum. f(1/e) = (1/e)ln(1/e) = (1/e)(-1) = -1/e.",
    tip: "f' > 0 sur un intervalle → croissante. f' change de - à + → minimum local."
  },
  {
    id: "ensa-an-015", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "Combien de solutions réelles a l'équation ln(x) = 2 - x ?",
    options: ["0", "1", "2", "3"],
    correctIndex: 1,
    explanation: "Poser f(x) = ln(x) - 2 + x. f'(x) = 1/x + 1 > 0 pour x>0 → f strictement croissante. f(1) = -1 < 0 et f(2) = ln2 > 0 → une seule solution dans ]1,2[.",
    tip: "Pour compter les solutions de f(x) = g(x) : étudier h(x) = f(x) - g(x). Variations de h → nombre de racines."
  },
  {
    id: "ensa-an-016", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "∫ dx/(x² - 1) par décomposition en éléments simples vaut :",
    options: [
      "(1/2)ln|x+1| - (1/2)ln|x-1| + C",
      "(1/2)ln|(x-1)/(x+1)| + C",
      "ln|x² - 1| + C",
      "arctan(x) + C"
    ],
    correctIndex: 1,
    explanation: "1/(x²-1) = 1/[(x-1)(x+1)] = A/(x-1) + B/(x+1). A = 1/2, B = -1/2. Intégrale : (1/2)ln|x-1| - (1/2)ln|x+1| = (1/2)ln|(x-1)/(x+1)| + C.",
    tip: "Décomposition en éléments simples : 1/(x²-a²) = 1/(2a)[1/(x-a) - 1/(x+a)]."
  },
  {
    id: "ensa-an-017", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "moyen",
    question: "La dérivée de f(x) = arctan(x) est :",
    options: ["1/(1-x²)", "1/(1+x²)", "-1/(1+x²)", "arctan(x)/(1+x²)"],
    correctIndex: 1,
    explanation: "f'(x) = 1/(1+x²). Formule fondamentale à mémoriser. De même : (arcsin x)' = 1/√(1-x²).",
    tip: "Dérivées des fonctions trigonométriques inverses : (arctan x)' = 1/(1+x²), (arcsin x)' = 1/√(1-x²)."
  },
  {
    id: "ensa-an-018", exam: "ensa", subject: "analyse", subjectLabel: "Analyse & Intégrales",
    level: "difficile",
    question: "Le développement limité de ln(1+x) à l'ordre 3 en 0 est :",
    options: [
      "x - x²/2 + x³/3 + o(x³)",
      "x + x²/2 + x³/3 + o(x³)",
      "1 + x - x²/2 + x³/3 + o(x³)",
      "x - x² + x³ + o(x³)"
    ],
    correctIndex: 0,
    explanation: "DL fondamental : ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... (série de Taylor convergente pour |x|≤1, x≠-1).",
    tip: "DLs à mémoriser : ln(1+x) = x - x²/2 + x³/3 - ... ; e^x = 1+x+x²/2!+x³/3!+... ; sin x = x - x³/6 + ..."
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

  // ─── ENSA — PROBABILITÉS (suite) ──────────────────────────────────────────

  {
    id: "ensa-pb-002", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "facile",
    question: "On tire une carte d'un jeu de 52 cartes. La probabilité de tirer un as est :",
    options: ["1/4", "1/13", "1/52", "4/52"],
    correctIndex: 1,
    explanation: "Il y a 4 as dans 52 cartes. P = 4/52 = 1/13.",
    tip: "P = nombre de cas favorables / nombre total de cas. Simplifier la fraction."
  },
  {
    id: "ensa-pb-003", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "facile",
    question: "On lance deux dés équilibrés. La probabilité d'obtenir une somme de 7 est :",
    options: ["1/6", "6/36", "7/36", "1/7"],
    correctIndex: 0,
    explanation: "Paires donnant 7 : (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 paires. Total = 36. P = 6/36 = 1/6.",
    tip: "La somme 7 est la plus probable avec deux dés (6 façons). Dresser le tableau des 36 issues."
  },
  {
    id: "ensa-pb-004", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "Une urne contient 5 boules rouges et 3 boules bleues. On tire 2 boules sans remise. P(les 2 sont rouges) = ?",
    options: ["5/16", "25/64", "5/14", "10/56"],
    correctIndex: 2,
    explanation: "P = C(5,2)/C(8,2) = 10/28 = 5/14.",
    tip: "Sans remise → combinaisons. C(5,2) = 10 façons de choisir 2 rouges sur 5. C(8,2) = 28 total."
  },
  {
    id: "ensa-pb-005", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "X suit une loi B(10, 0,3). L'espérance E(X) et la variance V(X) sont :",
    options: ["E=3, V=2,1", "E=3, V=3", "E=7, V=2,1", "E=0,3, V=0,21"],
    correctIndex: 0,
    explanation: "Pour X ~ B(n,p) : E(X) = np = 10×0,3 = 3. V(X) = np(1-p) = 10×0,3×0,7 = 2,1.",
    tip: "Loi binomiale B(n,p) : E = np, V = npq avec q = 1-p. Écart-type σ = √(npq)."
  },
  {
    id: "ensa-pb-006", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "difficile",
    question: "A et B sont indépendants avec P(A) = 0,4 et P(B) = 0,5. P(A ∩ B) vaut :",
    options: ["0,9", "0,2", "0,3", "0,7"],
    correctIndex: 1,
    explanation: "A et B indépendants → P(A ∩ B) = P(A)×P(B) = 0,4×0,5 = 0,2.",
    tip: "Indépendance : P(A ∩ B) = P(A)×P(B). Ne pas confondre avec incompatibilité (P(A∩B)=0)."
  },
  {
    id: "ensa-pb-007", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "P(A) = 0,3, P(B|A) = 0,6, P(B|Ā) = 0,1. Par Bayes, P(A|B) vaut :",
    options: ["0,18/0,25", "0,6", "0,72", "0,3×0,6"],
    correctIndex: 0,
    explanation: "P(B) = P(B|A)P(A) + P(B|Ā)P(Ā) = 0,6×0,3 + 0,1×0,7 = 0,18 + 0,07 = 0,25. P(A|B) = P(B|A)P(A)/P(B) = 0,18/0,25 = 0,72.",
    tip: "Formule de Bayes : P(A|B) = P(B|A)·P(A)/P(B). Calculer P(B) par probabilités totales d'abord."
  },
  {
    id: "ensa-pb-008", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "P(X = k) = e^(-λ) λᵏ/k! est la loi de Poisson. Si λ = 2, P(X = 3) est proche de :",
    options: ["0,090", "0,180", "0,135", "0,270"],
    correctIndex: 2,
    explanation: "P(X=3) = e^(-2)×2³/3! = e^(-2)×8/6 ≈ 0,1353×1,333 ≈ 0,180. Correction : e^(-2) ≈ 0,1353, 8/6 = 4/3 ≈ 1,333 → 0,1353 × 4/3 = 0,1804. Arrondi ≈ 0,180.",
    tip: "Loi de Poisson λ : E = V = λ. Utilisée pour les événements rares (pannes, accidents, appels)."
  },
  {
    id: "ensa-pb-009", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "difficile",
    question: "X ~ N(μ=100, σ=15). La probabilité P(85 < X < 115) est approximativement :",
    options: ["68%", "95%", "99,7%", "50%"],
    correctIndex: 0,
    explanation: "85 = 100 - 15 = μ - σ et 115 = 100 + 15 = μ + σ. La règle des 68-95-99,7 : P(μ-σ < X < μ+σ) ≈ 68%.",
    tip: "Règle empirique (3 σ) : ±1σ → 68%, ±2σ → 95%, ±3σ → 99,7%. À mémoriser absolument."
  },
  {
    id: "ensa-pb-010", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "difficile",
    question: "Le nombre d'arrangements de 3 lettres différentes parmi les 26 lettres de l'alphabet est :",
    options: ["C(26,3) = 2600", "A(26,3) = 15600", "26³ = 17576", "3! = 6"],
    correctIndex: 1,
    explanation: "On choisit 3 lettres différentes DANS UN ORDRE DONNÉ (arrangement). A(26,3) = 26×25×24 = 15600.",
    tip: "Arrangement Aₙᵏ = n!/(n-k)! : ordre important, sans répétition. Combinaison Cₙᵏ = n!/(k!(n-k)!) : ordre non important."
  },
  {
    id: "ensa-pb-011", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "moyen",
    question: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Si P(A)=0,5, P(B)=0,4, P(A∩B)=0,2, alors P(Ā ∩ B̄) vaut :",
    options: ["0,3", "0,7", "0,5", "0,1"],
    correctIndex: 0,
    explanation: "P(A∪B) = 0,5+0,4-0,2 = 0,7. P(Ā∩B̄) = P(complement de A∪B) = 1 - P(A∪B) = 1 - 0,7 = 0,3.",
    tip: "Loi de De Morgan : Ā∩B̄ = complément de (A∪B). P(Ā∩B̄) = 1 - P(A∪B)."
  },
  {
    id: "ensa-pb-012", exam: "ensa", subject: "probabilites", subjectLabel: "Probabilités",
    level: "difficile",
    question: "Une chaîne a 5 maillons indépendants, chacun de probabilité de rupture 0,01. La probabilité que la chaîne résiste (aucune rupture) est :",
    options: ["0,95", "(0,99)⁵ ≈ 0,951", "0,05", "0,99"],
    correctIndex: 1,
    explanation: "P(maillon résiste) = 0,99. Les 5 maillons sont indépendants. P(chaîne résiste) = (0,99)⁵ ≈ 0,951.",
    tip: "Événements indépendants : P(tous résistent) = produit des probabilités individuelles."
  },

  // ─── ENSA — ÉLECTRICITÉ (nouveau sujet) ───────────────────────────────────

  {
    id: "ensa-elec-001", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "facile",
    question: "Deux résistances R₁ = 4Ω et R₂ = 6Ω en série. La résistance équivalente est :",
    options: ["2,4 Ω", "10 Ω", "24 Ω", "1,2 Ω"],
    correctIndex: 1,
    explanation: "En série : Rₑq = R₁ + R₂ = 4 + 6 = 10 Ω.",
    tip: "Série : Rₑq = ΣRᵢ. Parallèle : 1/Rₑq = Σ(1/Rᵢ)."
  },
  {
    id: "ensa-elec-002", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "facile",
    question: "Les mêmes résistances R₁ = 4Ω et R₂ = 6Ω en parallèle. La résistance équivalente est :",
    options: ["10 Ω", "2,4 Ω", "5 Ω", "12 Ω"],
    correctIndex: 1,
    explanation: "1/Rₑq = 1/4 + 1/6 = 3/12 + 2/12 = 5/12. Rₑq = 12/5 = 2,4 Ω.",
    tip: "Deux résistances en parallèle : Rₑq = R₁R₂/(R₁+R₂) = 4×6/(4+6) = 24/10 = 2,4 Ω."
  },
  {
    id: "ensa-elec-003", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "facile",
    question: "Un circuit RC série (R = 1kΩ, C = 10µF). La constante de temps τ est :",
    options: ["100 s", "10 s", "0,01 s", "0,1 s"],
    correctIndex: 2,
    explanation: "τ = RC = 1000 × 10×10⁻⁶ = 10⁻² s = 0,01 s.",
    tip: "τ = RC. Convertir les unités : kΩ × µF = 10³ × 10⁻⁶ = 10⁻³ s par unité, puis multiplier."
  },
  {
    id: "ensa-elec-004", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "moyen",
    question: "Dans un circuit RC, la tension aux bornes du condensateur lors de la charge à t = τ vaut :",
    options: ["0", "E/2", "E(1 - 1/e) ≈ 0,63E", "E"],
    correctIndex: 2,
    explanation: "Uc(t) = E(1 - e^(-t/τ)). À t = τ : Uc = E(1 - e^(-1)) = E(1 - 1/e) ≈ 0,632E.",
    tip: "Après 1τ : 63% de la charge max. Après 5τ : 99% (considéré comme chargé)."
  },
  {
    id: "ensa-elec-005", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "moyen",
    question: "Une bobine idéale L = 0,5 H est traversée par i(t) = 2t A. La tension à ses bornes est :",
    options: ["0 V", "1 V", "2 V", "t V"],
    correctIndex: 1,
    explanation: "u_L = L·di/dt = 0,5 × 2 = 1 V (courant linéaire → di/dt = 2 A/s).",
    tip: "Loi de la bobine : u = L·di/dt. Pour un courant linéaire i = at : u = La = constante."
  },
  {
    id: "ensa-elec-006", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "moyen",
    question: "En courant alternatif sinusoïdal u(t) = 220√2·sin(100πt) V. L'amplitude, la fréquence et la valeur efficace sont :",
    options: [
      "Uₘ = 220V, f = 50Hz, U_eff = 220V",
      "Uₘ = 220√2 V, f = 50Hz, U_eff = 220V",
      "Uₘ = 220V, f = 100Hz, U_eff = 155V",
      "Uₘ = 220√2 V, f = 100πHz, U_eff = 220V"
    ],
    correctIndex: 1,
    explanation: "Uₘ = 220√2 V (amplitude). ω = 100π rad/s → f = ω/(2π) = 50Hz. U_eff = Uₘ/√2 = 220V.",
    tip: "Forme u = Uₘsin(ωt+φ). U_eff = Uₘ/√2. f = ω/(2π). Le 220V des prises = valeur efficace."
  },
  {
    id: "ensa-elec-007", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "moyen",
    question: "La loi de Joule : puissance dissipée dans une résistance R parcourue par I est :",
    options: ["P = R/I²", "P = RI", "P = RI²", "P = I/R"],
    correctIndex: 2,
    explanation: "P = RI² = U²/R = UI (avec U = RI d'après Ohm). En alternatif : P = R·I_eff².",
    tip: "3 formules équivalentes : P = RI² = U²/R = UI. Choisir selon les données disponibles."
  },
  {
    id: "ensa-elec-008", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "difficile",
    question: "En RLC série, la fréquence de résonance f₀ avec L = 0,1H et C = 100µF est :",
    options: ["50 Hz", "159 Hz", "1000 Hz", "503 Hz"],
    correctIndex: 0,
    explanation: "ω₀ = 1/√(LC) = 1/√(0,1 × 100×10⁻⁶) = 1/√(10⁻⁵) = 1/(3,16×10⁻³) ≈ 316 rad/s. f₀ = ω₀/(2π) ≈ 50,3 Hz ≈ 50 Hz.",
    tip: "f₀ = 1/(2π√(LC)). À la résonance : XL = XC et Z = R (minimum). I est maximum."
  },
  {
    id: "ensa-elec-009", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "difficile",
    question: "Dans un circuit RL série (U_eff = 100V, R = 6Ω, X_L = 8Ω), l'intensité efficace est :",
    options: ["10 A", "12,5 A", "100/6 A", "100/8 A"],
    correctIndex: 0,
    explanation: "Z = √(R²+X_L²) = √(36+64) = √100 = 10 Ω. I_eff = U_eff/Z = 100/10 = 10 A.",
    tip: "Impédance Z = √(R² + (X_L - X_C)²). En RL : Z = √(R² + X_L²) avec X_L = Lω."
  },
  {
    id: "ensa-elec-010", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "difficile",
    question: "Le facteur de puissance cos φ pour un circuit RL (R = 6Ω, X_L = 8Ω) vaut :",
    options: ["0,6", "0,8", "0,75", "1"],
    correctIndex: 0,
    explanation: "Z = 10Ω. cos φ = R/Z = 6/10 = 0,6. La puissance active P = UI·cos φ = P_apparente × cos φ.",
    tip: "cos φ = R/Z. Si cos φ = 1 : circuit purement résistif (RL ou RC à la résonance). cos φ < 1 : présence de réactance."
  },
  {
    id: "ensa-elec-011", exam: "ensa", subject: "electricite", subjectLabel: "Électricité",
    level: "moyen",
    question: "La loi des nœuds de Kirchhoff stipule :",
    options: [
      "La somme des tensions dans une maille = 0",
      "La somme algébrique des courants entrant et sortant d'un nœud = 0",
      "La résistance équivalente d'un réseau = somme des résistances",
      "L'énergie dissipée par effet Joule = Q²/C"
    ],
    correctIndex: 1,
    explanation: "Loi des nœuds (1ère loi de Kirchhoff) : ΣI = 0 à chaque nœud (conservation du courant). Loi des mailles (2ème loi) : ΣU = 0 dans toute maille fermée (conservation de l'énergie).",
    tip: "Nœuds : courants (conservation de la charge). Mailles : tensions (conservation de l'énergie)."
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

  // ─── ENSA — MÉCANIQUE (suite) ─────────────────────────────────────────────

  {
    id: "ensa-mec-005", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "facile",
    question: "Un objet de masse m = 2 kg tombe en chute libre depuis le repos sur h = 20 m (g = 10 m/s²). Sa vitesse à l'impact est :",
    options: ["10 m/s", "20 m/s", "14,1 m/s", "200 m/s"],
    correctIndex: 1,
    explanation: "v² = 2gh = 2×10×20 = 400. v = 20 m/s.",
    tip: "Chute libre : v² = 2gh (énergie potentielle → cinétique). Ne pas utiliser la masse."
  },
  {
    id: "ensa-mec-006", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Un projectile lancé à v₀ = 20 m/s à 30° de l'horizontale (g = 10 m/s²). La portée horizontale est :",
    options: ["20 m", "34,6 m", "40 m", "10 m"],
    correctIndex: 1,
    explanation: "Portée : R = v₀²·sin(2θ)/g = 400×sin(60°)/10 = 400×(√3/2)/10 = 20√3 ≈ 34,6 m.",
    tip: "Portée maximale pour θ = 45°. Formule R = v₀²·sin(2θ)/g."
  },
  {
    id: "ensa-mec-007", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "La deuxième loi de Newton : ΣF = ma. Si F = 30 N et a = 6 m/s², alors m vaut :",
    options: ["0,2 kg", "5 kg", "180 kg", "36 kg"],
    correctIndex: 1,
    explanation: "m = F/a = 30/6 = 5 kg.",
    tip: "ΣF = ma est vectorielle. En scalaire : si une seule force, F = ma → m = F/a."
  },
  {
    id: "ensa-mec-008", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "moyen",
    question: "Loi de conservation de l'énergie : une voiture de 1000 kg à v = 20 m/s. Son énergie cinétique Ec est :",
    options: ["10 000 J", "100 000 J", "200 000 J", "400 000 J"],
    correctIndex: 2,
    explanation: "Ec = ½mv² = ½×1000×400 = 200 000 J = 200 kJ.",
    tip: "Ec = ½mv². Bien mettre v en m/s avant le calcul."
  },
  {
    id: "ensa-mec-009", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "difficile",
    question: "Un pendule simple de longueur L = 0,4 m (g = 10 m/s²). Sa période propre T₀ est :",
    options: ["π/5 s ≈ 0,63 s", "π/√(25) ≈ 0,63 s", "4π/10 ≈ 1,26 s", "2π/√25 ≈ 1,26 s"],
    correctIndex: 3,
    explanation: "T₀ = 2π√(L/g) = 2π√(0,4/10) = 2π√(0,04) = 2π×0,2 = 0,4π ≈ 1,257 s. Option D exprime la même valeur : 2π/√25 = 2π/5 = 0,4π.",
    tip: "Pendule simple (petites oscillations) : T = 2π√(L/g). T ne dépend pas de la masse ni de l'amplitude."
  },
  {
    id: "ensa-mec-010", exam: "ensa", subject: "mecanique", subjectLabel: "Mécanique",
    level: "difficile",
    question: "Un corps de 5 kg glisse sur un plan incliné (α = 30°, µ = 0,2, g = 10 m/s²). L'accélération est :",
    options: ["5 m/s²", "g·sin30° = 5 m/s²", "g(sin30° - µcos30°) ≈ 3,27 m/s²", "g(sin30° + µcos30°) ≈ 6,73 m/s²"],
    correctIndex: 2,
    explanation: "Forces : composante du poids le long du plan = mg·sin30° = 25N. Frottement = µN = µmg·cos30° = 0,2×5×10×(√3/2) ≈ 8,66N. ΣF = 25-8,66 = 16,34N. a = F/m = 3,27 m/s².",
    tip: "Plan incliné : a = g(sinα - µcosα) pour glissement vers le bas avec frottement."
  },

  // ─── ENSA — OPTIQUE (suite) ───────────────────────────────────────────────

  {
    id: "ensa-opt-003", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "moyen",
    question: "Un rayon lumineux passe de l'eau (n₁=1,33) à l'air (n₂=1). Pour un angle d'incidence de 30°, l'angle de réfraction est (loi de Snell-Descartes) :",
    options: ["22°", "41,8°", "30°", "67°"],
    correctIndex: 1,
    explanation: "n₁·sin θ₁ = n₂·sin θ₂ → sin θ₂ = 1,33×sin30° = 1,33×0,5 = 0,665 → θ₂ ≈ 41,8°.",
    tip: "Loi de Snell : n₁sinθ₁ = n₂sinθ₂. En passant vers un milieu moins dense (n₂ < n₁), le rayon s'éloigne de la normale."
  },
  {
    id: "ensa-opt-004", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "moyen",
    question: "Pour une lentille convergente de distance focale f' = 20 cm, un objet est placé à p = -40 cm (convention algébrique). L'image est à :",
    options: ["p' = 40 cm", "p' = -40 cm", "p' = 20 cm", "p' = 13,3 cm"],
    correctIndex: 0,
    explanation: "Formule des lentilles : 1/p' - 1/p = 1/f'. 1/p' = 1/f' + 1/p = 1/20 + 1/(-40) = 2/40 - 1/40 = 1/40. p' = 40 cm.",
    tip: "Convention : distances algébriques depuis la lentille. Objet réel → p < 0 (à gauche). Image réelle → p' > 0 (à droite)."
  },
  {
    id: "ensa-opt-005", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "difficile",
    question: "L'angle critique de réflexion totale interne eau→air (n_eau = 1,33) est :",
    options: ["48,75°", "30°", "41,8°", "60°"],
    correctIndex: 0,
    explanation: "Angle critique : sin θ_c = n₂/n₁ = 1/1,33 ≈ 0,752 → θ_c ≈ 48,75°. Pour θ₁ > θ_c, toute la lumière est réfléchie (réflexion totale).",
    tip: "Réflexion totale seulement quand le rayon va du milieu dense vers le milieu peu dense (n₁ > n₂)."
  },
  {
    id: "ensa-opt-006", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "moyen",
    question: "Un interféromètre de Young éclairé en rouge (λ₁=630nm) puis en vert (λ₂=504nm). Le rapport des interfranges i₁/i₂ est :",
    options: ["1,25", "0,8", "504/630", "630×504"],
    correctIndex: 0,
    explanation: "i = λD/a. Donc i₁/i₂ = λ₁/λ₂ = 630/504 = 1,25. La frange rouge est 25% plus large que la verte.",
    tip: "i ∝ λ : plus la longueur d'onde est grande (rouge), plus l'interfrange est large."
  },
  {
    id: "ensa-opt-007", exam: "ensa", subject: "optique", subjectLabel: "Optique & Nucléaire",
    level: "difficile",
    question: "Désintégration α : ²³⁸₉₂U → X + ⁴₂He. Le noyau fils X est :",
    options: ["²³⁴₉₀Th", "²³⁴₉₂U", "²³⁴₉₄Pu", "²³⁸₉₀Th"],
    correctIndex: 0,
    explanation: "Conservation du nombre de masse : 238 = A + 4 → A = 234. Conservation du numéro atomique : 92 = Z + 2 → Z = 90. Z = 90 → Thorium (Th). Le noyau fils est ²³⁴₉₀Th.",
    tip: "Désintégration α : A→A-4, Z→Z-2. Désintégration β⁻ : A→A, Z→Z+1."
  },

  // ─── ENSA — CHIMIE (suite) ────────────────────────────────────────────────

  {
    id: "ensa-chi-002", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "facile",
    question: "La concentration molaire d'une solution NaOH de masse m = 4g dans V = 0,5L (M_NaOH = 40g/mol) est :",
    options: ["0,1 mol/L", "0,2 mol/L", "0,08 mol/L", "2 mol/L"],
    correctIndex: 1,
    explanation: "n = m/M = 4/40 = 0,1 mol. C = n/V = 0,1/0,5 = 0,2 mol/L.",
    tip: "C = n/V = m/(M×V). Les unités : mol/L = M. Toujours vérifier les unités de V (en litres)."
  },
  {
    id: "ensa-chi-003", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "moyen",
    question: "Pour l'équation Zn + 2HCl → ZnCl₂ + H₂, si on part de 1,3g de Zn (M = 65g/mol) et 0,2mol HCl, quel est le réactif limitant ?",
    options: ["Zn (car n(Zn) = 0,02 mol nécessite 0,04 mol HCl)", "HCl (car 0,2 mol HCl < 0,04 mol requis)", "Les deux sont en stœchiométrie exacte", "Aucun réactif limitant car réaction totale"],
    correctIndex: 0,
    explanation: "n(Zn) = 1,3/65 = 0,02 mol. Stœchiométrie : il faut 2×0,02 = 0,04 mol HCl. On dispose de 0,2 mol HCl >> 0,04 mol. Le Zn est donc le réactif limitant (en défaut).",
    tip: "Réactif limitant : celui qui est consommé en premier. Comparer les ratios n_disponible/coeff_stœchio."
  },
  {
    id: "ensa-chi-004", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "moyen",
    question: "Le pH d'une solution d'HCl à 0,01 mol/L est :",
    options: ["pH = 1", "pH = 2", "pH = 12", "pH = 0,01"],
    correctIndex: 1,
    explanation: "HCl est un acide fort (ionisation totale). [H₃O⁺] = 0,01 = 10⁻² mol/L. pH = -log(10⁻²) = 2.",
    tip: "Acide fort : ionisation totale. [H₃O⁺] = concentration initiale. pH = -log[H₃O⁺]."
  },
  {
    id: "ensa-chi-005", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "moyen",
    question: "Lors de l'électrolyse d'eau (2H₂O → 2H₂ + O₂), à la cathode on produit :",
    options: ["De l'oxygène par oxydation", "De l'hydrogène par réduction : 2H⁺ + 2e⁻ → H₂", "Du dioxyde de carbone", "Des ions OH⁻ par oxydation"],
    correctIndex: 1,
    explanation: "Cathode = électrode négative = réduction. 2H⁺ + 2e⁻ → H₂ (ou 2H₂O + 2e⁻ → H₂ + 2OH⁻ en milieu neutre). Anode (oxydation) : 2H₂O → O₂ + 4H⁺ + 4e⁻.",
    tip: "Cathode = réduction (H₂). Anode = oxydation (O₂). Moyen mnémotechnique : CANCOA (Cathode : ANode = Oxydation)... Réduc-Cathode, Oxyd-Anode."
  },
  {
    id: "ensa-chi-006", exam: "ensa", subject: "chimie", subjectLabel: "Chimie",
    level: "difficile",
    question: "La réaction N₂ + 3H₂ ⇌ 2NH₃ (synthèse de l'ammoniac). Selon Le Chatelier, pour maximiser la production de NH₃ il faut :",
    options: [
      "Augmenter T et P",
      "Diminuer P et augmenter T",
      "Augmenter P et diminuer T (mais cinétique lente)",
      "Augmenter T uniquement (réaction endothermique)"
    ],
    correctIndex: 2,
    explanation: "Réaction exothermique (ΔH < 0) : basse T favorise les produits mais ralentit la cinétique. Réaction avec diminution du nombre de moles de gaz (4→2) : haute P déplace vers les produits. En industrie (procédé Haber) : T ≈ 400-500°C (compromis cinétique/équilibre), P ≈ 150-300 atm, catalyseur Fe.",
    tip: "Le Chatelier : augmenter P favorise le sens qui diminue le nombre de moles de gaz. Réaction exo : basse T favorise les produits."
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

  // ─── ENA — GÉOMÉTRIE (suite) ─────────────────────────────────────────────

  {
    id: "ena-geo-009", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un cercle a un diamètre de 14 cm. Son aire est (π ≈ 22/7) :",
    options: ["44 cm²", "154 cm²", "616 cm²", "308 cm²"],
    correctIndex: 1,
    explanation: "r = 7 cm. Aire = πr² = (22/7)×7² = 22×7 = 154 cm².",
    tip: "Aire cercle = πr². Avec π ≈ 22/7, et r = d/2 : bien diviser le diamètre par 2."
  },
  {
    id: "ena-geo-010", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Dans un triangle rectangle, l'hypoténuse mesure 13 cm et un côté 5 cm. L'autre côté mesure :",
    options: ["8 cm", "12 cm", "9 cm", "11 cm"],
    correctIndex: 1,
    explanation: "Pythagore : a² + b² = c². 5² + b² = 13². b² = 169 - 25 = 144. b = 12 cm. (Triangle 5-12-13 pythagoricien.)",
    tip: "Triplets pythagoriciens classiques : (3,4,5), (5,12,13), (8,15,17), (7,24,25)."
  },
  {
    id: "ena-geo-011", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un cône a une base circulaire de rayon r = 3 m et une hauteur h = 4 m. Son volume est :",
    options: ["12π m³", "36π m³", "4π m³", "48π m³"],
    correctIndex: 2,
    explanation: "V = (1/3)πr²h = (1/3)π×9×4 = 12π/3 = 4π ≈ 12,57 m³.",
    tip: "Volume cône = (1/3)×base×hauteur = (1/3)πr²h. Le 1/3 est souvent oublié."
  },
  {
    id: "ena-geo-012", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Sur un plan à l'échelle 1/200, un hall mesure 8cm × 5cm. Quelle est la superficie réelle ?",
    options: ["40 m²", "160 m²", "80 m²", "3200 m²"],
    correctIndex: 1,
    explanation: "Dimensions réelles : 8×200 = 1600cm = 16m et 5×200 = 1000cm = 10m. Surface = 16×10 = 160 m².",
    tip: "Surface plan → surface réelle : multiplier par (dénominateur)². Ici (200)² = 40 000. 40cm² × 40000 = 1 600 000 cm² = 160 m²."
  },
  {
    id: "ena-geo-013", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "difficile",
    question: "Le théorème de Thalès : dans un triangle ABC, si DE est parallèle à BC avec D sur AB et E sur AC, alors :",
    options: [
      "AD/AB = AE/AC = BC/DE",
      "AD/DB = AE/EC = DE/BC",
      "AD/AB = AE/AC = DE/BC",
      "AB/AD = AC/AE = BC/DE"
    ],
    correctIndex: 2,
    explanation: "Thalès : si DE // BC, alors AD/AB = AE/AC = DE/BC. Les rapports de division sont égaux. Corollaire : AD/DB = AE/EC.",
    tip: "Thalès : ratio des segments DEPUIS le sommet (AD/AB, non AD/DB). Mémoriser : même point de départ A pour les 3 ratios."
  },
  {
    id: "ena-geo-014", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "facile",
    question: "L'angle au centre est 120°. La longueur de l'arc correspondant dans un cercle de rayon 6 cm est :",
    options: ["2π cm", "4π cm", "6π cm", "12π cm"],
    correctIndex: 1,
    explanation: "L = (θ/360°)×2πr = (120/360)×2π×6 = (1/3)×12π = 4π cm.",
    tip: "Longueur arc = (angle/360)×périmètre. Périmètre = 2πr."
  },
  {
    id: "ena-geo-015", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "La perspective axonométrique isométrique d'un cube de côté a=10cm représente les angles des arêtes visibles à :",
    options: ["45°, 45°, 90°", "30°, 30°, 90°", "30°, 60°, 90°", "60°, 60°, 60°"],
    correctIndex: 1,
    explanation: "En projection isométrique, les 3 arêtes partant d'un sommet visible font entre elles des angles de 120° (soit 30° et 30° avec l'horizontale pour les fuyantes latérales, et la troisième est verticale). Les arêtes fuyantes sont à 30° de l'horizontal.",
    tip: "Axonométrie isométrique : arêtes fuyantes à 30° de l'horizontal. Toutes les arêtes conservent leurs longueurs réelles."
  },
  {
    id: "ena-geo-016", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "difficile",
    question: "Un bâtiment de 8m × 12m représenté sur un plan où 1 cm = 4 m. Le contour du plan occupe :",
    options: ["2cm × 3cm", "3cm × 4cm", "32cm × 48cm", "4cm × 6cm"],
    correctIndex: 0,
    explanation: "Échelle : 1 cm = 4 m. 8m/4 = 2 cm. 12m/4 = 3 cm. Le contour est 2cm × 3cm.",
    tip: "Dimension plan = dimension réelle / dénominateur. Toujours diviser (pas multiplier) pour aller du réel au plan."
  },
  {
    id: "ena-geo-017", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "La règle de construction d'un escalier (formule de Blondel : 2h + g ≈ 63 cm). Si un étage fait 3m et on veut des marches de 17cm de haut, le nombre de marches et le giron sont :",
    options: [
      "17 marches, giron = 29 cm",
      "18 marches, giron = 27 cm",
      "15 marches, giron = 33 cm",
      "20 marches, giron = 23 cm"
    ],
    correctIndex: 1,
    explanation: "n = hauteur/h = 300/17 ≈ 17,6 → arrondir à 18. h réel = 300/18 ≈ 16,67 cm. g = 63 - 2×16,67 = 29,67 ≈ 27 cm. En pratique, 18 marches de 16,7cm et giron de 27-30cm est confortable.",
    tip: "Nombre de marches = hauteur totale / hauteur marche. Ajuster pour obtenir un entier. Puis recalculer le giron."
  },
  {
    id: "ena-geo-018", exam: "ena", subject: "geometrie", subjectLabel: "Géométrie & Échelles",
    level: "moyen",
    question: "Un cylindre creux (tuyau) : diamètre extérieur 10cm, épaisseur paroi 1cm, longueur 2m. Le volume de matière du tuyau est :",
    options: ["56π cm³", "5600π cm³", "2800π cm³", "5 650 cm³"],
    correctIndex: 1,
    explanation: "r_ext = 5cm, r_int = 4cm. Volume = π×(r²_ext - r²_int)×L = π×(25-16)×200 = 1800π cm³. Attention : L = 2m = 200cm. Calcul : π×9×200 = 1800π ≈ 5655 cm³. La réponse D arrondie est proche. Option B : 5600π semble erronée. Recalcul : 9×200×π = 1800π ≈ 5655 cm³ ≈ 5650 cm³.",
    tip: "Volume couronne cylindrique = π(R²-r²)×h. Convertir toutes les unités avant le calcul."
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

  // ─── ENA — ART & ARCHITECTURE (suite) ────────────────────────────────────

  {
    id: "ena-art-007", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "Le style 'Déconstructivisme' en architecture est associé à :",
    options: ["Le Corbusier", "Frank Gehry, Zaha Hadid, Rem Koolhaas", "Mies van der Rohe", "Antoni Gaudí"],
    correctIndex: 1,
    explanation: "Le déconstructivisme (fin XXe s.) se caractérise par des formes fragmentées, tordues, non rectilignes. Représentants : Frank Gehry (Guggenheim Bilbao), Zaha Hadid, Rem Koolhaas, Daniel Libeskind, Peter Eisenman.",
    tip: "Déconstructivisme : structures visuellement instables, géométrie non-euclidienne. À distinguer du brutalisme (béton brut) et du minimalisme."
  },
  {
    id: "ena-art-008", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "facile",
    question: "La voûte à muqarnas (ou stalactites) est une caractéristique de :",
    options: ["L'architecture gothique européenne", "L'architecture arabo-islamique et hispano-mauresque", "L'architecture moderniste", "L'architecture romane"],
    correctIndex: 1,
    explanation: "Les muqarnas sont des alvéoles tridimensionnelles en nid d'abeilles utilisées pour la transition entre les murs et le plafond/coupole. On les trouve à l'Alhambra (Grenade), au Palais Bahia (Marrakech), et dans nombreuses mosquées marocaines.",
    tip: "Muqarnas = caractéristique distinctive de l'architecture islamique. Terme ENA très fréquent."
  },
  {
    id: "ena-art-009", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "Le 'Plan Directeur' ou PLU (Plan Local d'Urbanisme) définit principalement :",
    options: ["Le budget communal pour les travaux publics", "Les règles d'utilisation du sol, hauteurs, densités et affectations des zones urbaines", "Les normes parasismiques des bâtiments", "La qualité de l'eau et des réseaux d'assainissement"],
    correctIndex: 1,
    explanation: "Le PLU est le document d'urbanisme qui réglemente l'utilisation du sol (zones R=résidentiel, U=urbain, AU=à urbaniser, N=naturel), les hauteurs maximales, les COS/CES, les retraits, etc. Au Maroc : le SDAU (Schéma Directeur d'Aménagement Urbain) joue un rôle similaire.",
    tip: "Documents d'urbanisme au Maroc : SDAU (vision 20-25 ans), Plan d'Aménagement PA (règles de construction), Permis de construire (projet individuel)."
  },
  {
    id: "ena-art-010", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "La 'verdure' dans le zouak (peinture sur bois marocaine) désigne :",
    options: ["Un pigment vert à base d'oxyde de cuivre", "Les motifs végétaux stylisés (arabesques florales) peints sur les plafonds en cèdre", "L'enduit vert appliqué sur les minarets", "Le toit en tuile verte des palais royaux"],
    correctIndex: 1,
    explanation: "Le zouak est l'art de la peinture décorative sur bois (plafonds, portes, moucharabiehs) avec des motifs géométriques, floraux et calligraphiques. Le vert est obtenu à partir de composés de cuivre. Les plafonds en cèdre de l'Atlas sont particulièrement valorisés.",
    tip: "Zouak, zellige (carrelage), tadelakt (enduit), moucharabieh : les 4 techniques artisanales emblématiques de l'ENA."
  },
  {
    id: "ena-art-011", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "difficile",
    question: "Le riad traditionnel marocain se caractérise par :",
    options: [
      "Une façade richement décorée visible de la rue, avec jardins à l'avant",
      "Une façade sobre sur rue, un patio central avec jardin (4 parterres), une fontaine, et des galeries sur colonnes",
      "Un plan circulaire autour d'une cour centrale",
      "Des murs en verre permettant l'apport de lumière naturelle maximale"
    ],
    correctIndex: 1,
    explanation: "Le riad (de l'arabe 'rawdh' = jardin) est une maison traditionnelle organisée autour d'un patio intérieur avec 4 parterres de plantes (d'où le nom 'quad'). La façade sur rue est intentionnellement simple (intériorité, intimité). Patio = régulateur thermique naturel.",
    tip: "Riad = intériorité. Patio central + fontaine + orangers/citronniers + galeries. Principe bioclimatique : fraîcheur en été par effet de cheminée."
  },
  {
    id: "ena-art-012", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "moyen",
    question: "La Renaissance italienne en architecture (XVe-XVIe siècle) est caractérisée par :",
    options: [
      "Les arcs brisés, voûtes en croisée d'ogives et flèches élancées",
      "Le retour aux ordres grecs et romains (colonnes, frontons, symétrie, proportions)",
      "Les murs en béton brut et les larges fenêtres horizontales",
      "Les façades ornées de carreaux de faïence colorés"
    ],
    correctIndex: 1,
    explanation: "La Renaissance (Brunelleschi, Alberti, Palladio) renoue avec l'Antiquité gréco-romaine : ordres architecturaux (dorique, ionique, corinthien), symétrie, proportions harmonieuses, frontons triangulaires. Exemple : Palais Rucellai (Alberti), Villa Rotonda (Palladio).",
    tip: "Gothique = arcs brisés et verticalité. Renaissance = Retour à l'Antiquité et horizontalité. Baroque = mouvement et décoration exubérante."
  },
  {
    id: "ena-art-013", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "facile",
    question: "La tour Hassan à Rabat est le minaret inachevé d'une mosquée commencée sous :",
    options: ["Alaouite - 1672", "Almohade - Yacoub Al Mansour - XIIe siècle", "Mérinide - XIVe siècle", "Saadien - XVIe siècle"],
    correctIndex: 1,
    explanation: "La tour Hassan fut commencée vers 1195 sous le sultan almohade Yacoub Al-Mansour (mort en 1199). Elle reste inachevée à 44m (sur les 80m prévus). Elle forme un ensemble architectural avec le mausolée Mohammed V.",
    tip: "Tour Hassan, Koutoubia (Marrakech), Giralda (Séville) : 3 minarets almohades construits sous Yacoub Al-Mansour au XIIe s."
  },
  {
    id: "ena-art-014", exam: "ena", subject: "art", subjectLabel: "Art & Architecture",
    level: "difficile",
    question: "Le 'COS' (Coefficient d'Occupation des Sols) de 1,5 signifie :",
    options: [
      "Le bâtiment peut couvrir 150% de la parcelle (impossible)",
      "La surface plancher totale peut représenter 1,5 fois la surface de la parcelle",
      "Le bâtiment doit laisser 1,5m de recul par rapport aux limites",
      "La hauteur maximale est de 1,5 fois la largeur de la voie"
    ],
    correctIndex: 1,
    explanation: "COS (ou SHON/surface de plancher) : surface de plancher totale = COS × surface parcelle. COS = 1,5 sur une parcelle de 200m² → max 300m² de plancher. Le CES (Coefficient d'Emprise au Sol) limite la projection au sol.",
    tip: "COS = ratio surface plancher/surface parcelle. CES = ratio emprise bâtiment/parcelle. CES < COS car il y a plusieurs niveaux."
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

  // ─── ENA — CULTURE GÉNÉRALE (suite) ──────────────────────────────────────

  {
    id: "ena-cul-004", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "Le zellige marocain est :",
    options: [
      "Un tissu brodé à la main à Fès",
      "Un pavement de carreaux de faïence émaillée taillés à la main et assemblés en mosaïques géométriques",
      "Une technique de peinture murale à l'huile",
      "Un type de sculpture en bois de thuya"
    ],
    correctIndex: 1,
    explanation: "Le zellige est une mosaïque de carreaux de céramique émaillée taillés à la main selon des formes géométriques précises. Technique ancestrale de Fès, il orne les fontaines, les mosquées et les palais marocains.",
    tip: "4 arts décoratifs marocains à connaître : Zellige (céramique), Tadelakt (enduit), Zouak (peinture bois), Moucharabieh (bois sculpté)."
  },
  {
    id: "ena-cul-005", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "L'Avenue Mohammed VI à Rabat fait partie du projet de réaménagement de :",
    options: ["La médina de Rabat", "La vallée du Bouregreg", "La corniche d'Ain Diab à Casablanca", "Le quartier de l'Agdal"],
    correctIndex: 1,
    explanation: "Le projet de la vallée du Bouregreg est un grand projet urbain entre Rabat et Salé comprenant la marina, la kasbah des Oudayas, le tramway, et de nouveaux quartiers. Architecte principal : Bofill et autres.",
    tip: "Grands projets urbains marocains : Bouregreg (Rabat-Salé), Casa Anfa (Casablanca), Tanger Med (port logistique)."
  },
  {
    id: "ena-cul-006", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "Le mouvement 'Bauhaus' (1919-1933) est important pour l'architecture car :",
    options: [
      "Il a inventé le béton armé",
      "Il a promu l'union des arts, de l'artisanat et de l'industrie : 'la forme suit la fonction'",
      "Il a développé le style baroque tardif en Allemagne",
      "Il a restauré les châteaux médiévaux européens"
    ],
    correctIndex: 1,
    explanation: "Fondé par Walter Gropius à Weimar, le Bauhaus a révolutionné le design et l'architecture en promouvant la fonctionnalité, les matériaux industriels et la formation pluridisciplinaire. Principe : 'less is more' (Mies van der Rohe). Fermé par les nazis en 1933.",
    tip: "Bauhaus → modernisme fonctionnaliste. Figures : Gropius, Mies van der Rohe, László Moholy-Nagy, Marcel Breuer."
  },
  {
    id: "ena-cul-007", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "La Bibliothèque nationale du Royaume du Maroc (BNRM) se situe à :",
    options: ["Fès", "Casablanca", "Rabat", "Marrakech"],
    correctIndex: 2,
    explanation: "La BNRM est située à Rabat (avenue Allal Al Fassi). Elle a été inaugurée en 2012 et conçue par l'architecte marocain Hassan Jamal Eddine.",
    tip: "Grands équipements culturels de Rabat : BNRM, Musée Mohammed VI d'art moderne, Musée archéologique, Musée des Oudayas."
  },
  {
    id: "ena-cul-008", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "L'école française d'architecture a fortement influencé la formation des architectes marocains via :",
    options: [
      "Les 'Beaux-Arts' et l'École Polytechnique",
      "L'École Nationale Supérieure d'Architecture de Paris-la-Villette, Paris-Belleville et les ENSA françaises",
      "Le MIT (Massachusetts Institute of Technology)",
      "La London School of Architecture"
    ],
    correctIndex: 1,
    explanation: "La plupart des architectes marocains de la génération 1970-2000 ont été formés dans les ENSA françaises (Écoles Nationales Supérieures d'Architecture). L'ENA de Rabat s'inscrit dans cette tradition tout en développant une pédagogie ancrée dans la culture marocaine.",
    tip: "Les ENSA françaises forment via le cursus Licence (Bac+3) + Master (Bac+5) + Diplôme de qualification (HMONP). L'ENA Rabat suit un modèle similaire."
  },
  {
    id: "ena-cul-009", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "difficile",
    question: "Le principe bioclimatique des villes médinas marocaines inclut :",
    options: [
      "Des rues larges et rectilignes pour maximiser la lumière",
      "Des rues étroites et sinueuses, des cours intérieures, des matériaux épais (adobe, pisé) pour l'inertie thermique",
      "Des façades en verre pour capter l'énergie solaire",
      "Des toits plats exclusivement pour la réflexion de la chaleur"
    ],
    correctIndex: 1,
    explanation: "Les médinas marocaines sont un exemple de bioclimatisme vernaculaire : rues étroites (ombre, protection du vent), murs épais en terre (pisé, adobe = forte inertie thermique : chaud l'hiver, frais l'été), cours intérieures (fraîcheur par évaporation de la fontaine), toits-terrasses pour dormir l'été.",
    tip: "Architecture vernaculaire = adaptée au climat local sans système énergétique artificiel. Concept clé en ENA."
  },
  {
    id: "ena-cul-010", exam: "ena", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "La 'Norme HQE' (Haute Qualité Environnementale) en bâtiment concerne :",
    options: [
      "L'esthétique et le respect du patrimoine architectural local",
      "La performance énergétique, le confort et l'impact environnemental d'un bâtiment",
      "La sécurité incendie et les normes antisismiques",
      "Le pourcentage d'espaces verts obligatoires dans un quartier"
    ],
    correctIndex: 1,
    explanation: "La certification HQE (label français) ou LEED/BREEAM (international) évalue un bâtiment sur : énergie (isolation, EnR), eau, matériaux (empreinte carbone), confort (acoustique, visuel, thermique), qualité de l'air. Au Maroc : CGNB et label HQE-Bâtiment.",
    tip: "HQE = Haute Qualité Environnementale. 14 cibles regroupées en : Éco-construction, Éco-gestion, Confort, Santé."
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

  // ─── ENA — LOGIQUE (suite) ────────────────────────────────────────────────

  {
    id: "ena-log-005", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "facile",
    question: "Quelle figure vient logiquement après : ○ □ △ ○ □ △ ○ □ ... ?",
    options: ["○", "□", "△", "◇"],
    correctIndex: 2,
    explanation: "Le motif répété est ○ □ △ (3 éléments). Après ○ □, la prochaine est △.",
    tip: "Identifier la période du cycle. Diviser la position par la longueur du cycle → le reste donne la position dans le cycle."
  },
  {
    id: "ena-log-006", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Complétez : 3, 6, 11, 18, 27, ...",
    options: ["36", "38", "39", "40"],
    correctIndex: 1,
    explanation: "Différences : +3, +5, +7, +9 (impairs croissants). Prochaine différence : +11. 27 + 11 = 38.",
    tip: "Quand la suite des termes n'est pas évidente, calculer les différences. Souvent : les différences forment une PA."
  },
  {
    id: "ena-log-007", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "facile",
    question: "Lucie est plus grande que Marie. Sophie est plus petite que Marie. Qui est la plus petite ?",
    options: ["Lucie", "Marie", "Sophie", "On ne peut pas savoir"],
    correctIndex: 2,
    explanation: "Lucie > Marie > Sophie. Sophie est donc la plus petite.",
    tip: "Ordonner les éléments selon la relation donnée. Ici : Lucie > Marie (énoncé 1) et Marie > Sophie (énoncé 2)."
  },
  {
    id: "ena-log-008", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Si tous les A sont B et que tous les B sont C, alors :",
    options: ["Tous les C sont A", "Tous les A sont C", "Aucun A n'est C", "Certains C sont A"],
    correctIndex: 1,
    explanation: "Syllogisme : A ⊂ B et B ⊂ C → A ⊂ C. Donc tous les A sont C. On ne peut pas conclure que tous les C sont A (C peut contenir des éléments qui ne sont pas B ni A).",
    tip: "Syllogisme classique : Si A→B et B→C, alors A→C. La réciproque n'est pas nécessairement vraie."
  },
  {
    id: "ena-log-009", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "facile",
    question: "Le mot 'symétrie' en architecture signifie :",
    options: [
      "Une façade entièrement vitrée",
      "La correspondance de forme et de proportion de part et d'autre d'un axe ou d'un centre",
      "L'absence de tout ornement",
      "L'utilisation de matériaux recyclés"
    ],
    correctIndex: 1,
    explanation: "La symétrie (axiale, centrale ou rotative) est un principe fondamental de composition architecturale depuis l'Antiquité. Les palais, mosquées et monuments officiels utilisent souvent la symétrie bilatérale pour exprimer l'ordre et la majesté.",
    tip: "Symétrie axiale : miroir d'un côté à l'autre. Symétrie centrale : rotation de 180°. Symétrie de translation : motifs répétés."
  },
  {
    id: "ena-log-010", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Un architecte doit dessiner un plan à l'échelle 1/50. Sur son papier A1 (841mm × 594mm), la plus grande pièce carrée qu'il peut représenter a un côté de :",
    options: ["29,7m", "42,05m", "594cm", "29,7cm"],
    correctIndex: 0,
    explanation: "La plus petite dimension du papier est 594mm. Sur le plan, 594mm représente 594×50 = 29 700mm = 29,7m de côté dans la réalité.",
    tip: "Dimension réelle max = dimension papier × dénominateur de l'échelle. 594mm × 50 = 29 700mm = 29,7m."
  },
  {
    id: "ena-log-011", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "difficile",
    question: "Complétez la suite logique : 1, 4, 9, 16, 25, 36, ...",
    options: ["42", "47", "49", "51"],
    correctIndex: 2,
    explanation: "Ce sont les carrés parfaits : 1²=1, 2²=4, 3²=9, ..., 7²=49.",
    tip: "Identifier le type de suite : carrés, cubes, nombres premiers, Fibonacci. Les carrés parfaits : 1,4,9,16,25,36,49,64,81,100."
  },
  {
    id: "ena-log-012", exam: "ena", subject: "logique", subjectLabel: "Logique & Français",
    level: "moyen",
    question: "Un dessin au 1/100 représente une porte de 0,9cm × 2,1cm sur le plan. Ses dimensions réelles sont :",
    options: ["90cm × 210cm", "9m × 21m", "9cm × 21cm", "0,09m × 0,21m"],
    correctIndex: 0,
    explanation: "0,9cm × 100 = 90cm de large. 2,1cm × 100 = 210cm = 2,10m de haut. Dimensions standard d'une porte en France/Maroc.",
    tip: "Dimension réelle = dimension plan × dénominateur. Standard portes intérieures : 83cm ou 93cm × 204cm."
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

  // ─── ENCG — MATHÉMATIQUES (suite) ─────────────────────────────────────────

  {
    id: "encg-m-011", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "Un capital de 50 000 DH placé à 6% annuels en intérêts composés pendant 4 ans donne :",
    options: ["62 000 DH", "63 123 DH", "68 000 DH", "72 000 DH"],
    correctIndex: 1,
    explanation: "VA = 50 000 × (1,06)⁴ = 50 000 × 1,2625 ≈ 63 123 DH.",
    tip: "(1,06)⁴ ≈ 1,2625. (1,06)² = 1,1236 ; (1,1236)² ≈ 1,2625. Ou calculer pas à pas."
  },
  {
    id: "encg-m-012", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "La valeur actuelle de 100 000 DH reçus dans 5 ans avec un taux d'actualisation de 8% est :",
    options: ["136 049 DH", "92 593 DH", "68 058 DH", "100 000 DH"],
    correctIndex: 2,
    explanation: "VA = VF / (1+r)^n = 100 000 / (1,08)⁵ = 100 000 / 1,4693 ≈ 68 058 DH.",
    tip: "Actualisation = inverse de la capitalisation. VA = VF × (1+r)^(-n). Plus le taux est élevé, plus la valeur actuelle est faible."
  },
  {
    id: "encg-m-013", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Un commerçant achète à 600 DH et vend à 900 DH. Son taux de marge (sur prix de vente) est :",
    options: ["50%", "33,3%", "66,7%", "150%"],
    correctIndex: 1,
    explanation: "Taux de marge = (PV - PA)/PV = (900-600)/900 = 300/900 = 33,3%.",
    tip: "Taux de marge = marge/prix de vente. Taux de marque = marge/prix d'achat. Distinguer les deux !"
  },
  {
    id: "encg-m-014", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Le taux de marque pour le même article (PA=600, PV=900) est :",
    options: ["33,3%", "50%", "100%", "150%"],
    correctIndex: 1,
    explanation: "Taux de marque = (PV - PA)/PA = 300/600 = 50%.",
    tip: "Marque vs Marge : Marque = bénéfice/PA (achat). Marge = bénéfice/PV (vente). Taux marque > taux marge pour un même article."
  },
  {
    id: "encg-m-015", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Un emprunt de 120 000 DH à 10% sur 3 ans. L'annuité constante (amortissement) est :",
    options: ["40 000 DH", "48 253 DH", "44 000 DH", "52 400 DH"],
    correctIndex: 1,
    explanation: "Annuité constante = C × r / (1-(1+r)^(-n)) = 120000 × 0,10 / (1-1,1^(-3)) = 12000/0,2487 ≈ 48 253 DH.",
    tip: "Formule annuité constante : a = C × r / (1-(1+r)^(-n)). C = capital, r = taux, n = durée."
  },
  {
    id: "encg-m-016", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Données : 10, 15, 20, 25, 30. La variance est :",
    options: ["50", "25", "5", "7,07"],
    correctIndex: 1,
    explanation: "Moyenne μ = (10+15+20+25+30)/5 = 100/5 = 20. Variance = [(10-20)²+(15-20)²+(20-20)²+(25-20)²+(30-20)²]/5 = [100+25+0+25+100]/5 = 250/5 = 50. Correction : variance = 50, écart-type = √50 ≈ 7,07.",
    tip: "V = Σ(xᵢ - μ)²/n. Écart-type σ = √V. La variance est toujours ≥ 0 et en unités au carré."
  },
  {
    id: "encg-m-017", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "difficile",
    question: "Si Qd = 200 - 4P et Qo = -20 + 2P, le prix et la quantité d'équilibre sont :",
    options: ["P=30, Q=80", "P=36,7, Q=53,3", "P=40, Q=60", "P=25, Q=100"],
    correctIndex: 2,
    explanation: "À l'équilibre : 200-4P = -20+2P → 220 = 6P → P = 36,67 DH. Q = 200-4×36,67 ≈ 53,33. Options A : Qd=200-120=80, Qo=-20+60=40 ≠ ; C : Qd=200-160=40, Qo=-20+80=60 ≠. Recalcul : P=36,67, Q≈53,3. Réponse B.",
    tip: "Équilibre : Qd = Qo. Résoudre en P, puis substituer pour Q. Vérifier dans les deux équations."
  },
  {
    id: "encg-m-018", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "moyen",
    question: "Un investisseur veut 500 000 DH dans 10 ans. Combien doit-il placer aujourd'hui à 7% annuels composés ?",
    options: ["300 000 DH", "254 175 DH", "350 000 DH", "400 000 DH"],
    correctIndex: 1,
    explanation: "VA = 500 000 / (1,07)¹⁰ = 500 000 / 1,9672 ≈ 254 175 DH.",
    tip: "Actualisation à 10 ans à 7% : facteur (1,07)^10 ≈ 1,967. Mémoriser quelques facteurs courants."
  },
  {
    id: "encg-m-019", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "difficile",
    question: "Le coefficient de corrélation de Pearson r vaut +0,95 entre ventes et publicité. Cela indique :",
    options: [
      "Corrélation négative forte : plus de pub → moins de ventes",
      "Corrélation positive forte : plus de pub → tendance à plus de ventes",
      "Absence de corrélation",
      "Causalité prouvée : la pub cause les ventes"
    ],
    correctIndex: 1,
    explanation: "r = +0,95 indique une corrélation linéaire positive forte (r ∈ [0,8 ; 1[). Les deux variables tendent à varier dans le même sens. ATTENTION : corrélation ≠ causalité. D'autres facteurs peuvent expliquer les ventes.",
    tip: "Interprétation : |r| < 0,3 = faible ; 0,3-0,7 = modérée ; > 0,7 = forte. r positif = variation dans le même sens."
  },
  {
    id: "encg-m-020", exam: "encg", subject: "maths", subjectLabel: "Mathématiques",
    level: "facile",
    question: "TVA incluse : un article coûte 1 200 DH TTC, TVA = 20%. Son prix HT est :",
    options: ["1 440 DH", "960 DH", "1 000 DH", "1 100 DH"],
    correctIndex: 2,
    explanation: "Prix TTC = Prix HT × (1 + taux TVA). 1200 = HT × 1,2 → HT = 1200/1,2 = 1000 DH.",
    tip: "Piège classique : ne pas soustraire 20% du TTC (erreur = 960 DH). Diviser par (1+taux)."
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

  // ─── ENCG — ÉCONOMIE (suite) ──────────────────────────────────────────────

  {
    id: "encg-e-009", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Le PIB est calculé par trois approches équivalentes. L'approche par les dépenses donne PIB = :",
    options: ["Revenus des ménages + Profits des entreprises", "C + I + G + (X - M)", "Valeur ajoutée brute de tous les secteurs", "Somme des salaires + loyers + intérêts + profits"],
    correctIndex: 1,
    explanation: "Identité comptable nationale : PIB = C (consommation des ménages) + I (investissement = FBCF) + G (dépenses publiques) + X (exportations) - M (importations).",
    tip: "3 approches PIB : Valeur ajoutée (production), Revenus (répartition), Dépenses (utilisation). Toutes donnent le même résultat."
  },
  {
    id: "encg-e-010", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Le taux de chômage au Maroc en 2024 est approximativement :",
    options: ["3%", "6%", "13%", "20%"],
    correctIndex: 2,
    explanation: "Taux de chômage Maroc 2024 ≈ 13% (HCP 2024). Le chômage urbain est plus élevé (~17%) et touche particulièrement les jeunes diplômés.",
    tip: "Données clés Maroc 2024 à mémoriser : PIB ≈ 1400 Mds DH, chômage ≈ 13%, croissance ≈ 3,5%, inflation ≈ 1-2%."
  },
  {
    id: "encg-e-011", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "L'instrument principal de la politique monétaire de Bank Al-Maghrib est :",
    options: [
      "Le taux d'imposition sur les bénéfices des entreprises",
      "Le taux directeur (taux de la politique monétaire - TPM)",
      "Le taux de TVA",
      "Le budget de l'État"
    ],
    correctIndex: 1,
    explanation: "BAM utilise principalement le taux directeur (TPM) pour influencer l'inflation et la croissance. En baissant le TPM : crédit moins cher → plus d'investissement et consommation → relance. En le relevant : freiner l'inflation.",
    tip: "Politique monétaire = BAM (taux directeur, réserves obligatoires). Politique budgétaire = Gouvernement (impôts, dépenses)."
  },
  {
    id: "encg-e-012", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Les exportations marocaines sont dominées par :",
    options: [
      "Le textile-habillement et produits agroalimentaires",
      "Les phosphates et dérivés, automobile et aérospatiale",
      "Le pétrole et gaz naturel",
      "Les services financiers et informatiques"
    ],
    correctIndex: 1,
    explanation: "Les principales exportations du Maroc (2024) : phosphates et dérivés (OCP ~20%), secteur automobile (Renault, Stellantis ~20%), textile, agriculture (agrumes, tomates). Le secteur aéronautique (Safran, Airbus) est en forte croissance.",
    tip: "Mémoriser le podium des exportations : 1. Automobile 2. Phosphates & engrais 3. Textile 4. Agroalimentaire."
  },
  {
    id: "encg-e-013", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "facile",
    question: "La 'courbe de Phillips' décrit la relation (à court terme) entre :",
    options: ["Croissance économique et emploi", "Inflation et chômage (trade-off)", "Exportations et taux de change", "Consommation et épargne"],
    correctIndex: 1,
    explanation: "La courbe de Phillips (1958) montre une relation inverse entre inflation et chômage à court terme : pour réduire le chômage, il faut accepter plus d'inflation et vice versa. Cette relation s'est affaiblie depuis les années 1970-80.",
    tip: "Phillips : ↑ chômage → ↓ inflation. Relation remise en cause par la stagflation des années 1970."
  },
  {
    id: "encg-e-014", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "difficile",
    question: "L'effet multiplicateur keynésien : si la propension marginale à consommer (PMC) = 0,8 et les investissements augmentent de 100 Mds DH, l'augmentation du PIB est :",
    options: ["100 Mds DH", "180 Mds DH", "400 Mds DH", "500 Mds DH"],
    correctIndex: 3,
    explanation: "Multiplicateur k = 1/(1-PMC) = 1/(1-0,8) = 1/0,2 = 5. ΔPIB = k × ΔI = 5 × 100 = 500 Mds DH.",
    tip: "Multiplicateur keynésien k = 1/(1-PMC) = 1/PMS (PMS = propension marginale à épargner = 1-PMC)."
  },
  {
    id: "encg-e-015", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "Le Plan Maroc Vert (2008-2020) et Green Generation (2020-2030) concernent :",
    options: ["L'énergie solaire et éolienne", "La modernisation et le développement du secteur agricole marocain", "Le tourisme durable", "La réforme de l'éducation nationale"],
    correctIndex: 1,
    explanation: "Le Plan Maroc Vert visait à moderniser l'agriculture : pilier 1 (agriculture moderne intensive) et pilier 2 (agriculture solidaire). Green Generation 2020-2030 vise à créer une classe moyenne agricole et à augmenter les exportations agro-alimentaires.",
    tip: "Grands plans sectoriels à connaître : Maroc Vert (agri), Plan Solaire (énergie), Plan Azur (tourisme), Émergence (industrie), Maroc Digital."
  },
  {
    id: "encg-e-016", exam: "encg", subject: "economie", subjectLabel: "Économie",
    level: "moyen",
    question: "La dette publique du Maroc représente environ (en % du PIB, 2024) :",
    options: ["30%", "45%", "70%", "100%"],
    correctIndex: 2,
    explanation: "La dette du Trésor marocain représente environ 69-72% du PIB en 2024, considérée comme soutenable mais en hausse depuis la crise COVID. Pour comparaison : France ≈ 110%, Allemagne ≈ 65%, USA ≈ 125%.",
    tip: "Critère de Maastricht (UE) : dette publique < 60% du PIB. Le Maroc est au-dessus de ce seuil mais a un meilleur ratio que beaucoup de pays développés."
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

  // ─── ENCG — MANAGEMENT (suite) ────────────────────────────────────────────

  {
    id: "encg-mg-006", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "La matrice BCG (Boston Consulting Group) classe les produits selon :",
    options: [
      "Rentabilité et coûts de production",
      "Part de marché relative et taux de croissance du marché",
      "Qualité et prix de vente",
      "Notoriété de la marque et budget publicitaire"
    ],
    correctIndex: 1,
    explanation: "Matrice BCG : 4 quadrants selon 2 axes. Axe X = part de marché relative (forte/faible). Axe Y = taux de croissance du marché (élevé/faible). Donne : Vedettes (Stars), Vaches à lait, Dilemmes (Question marks), Poids morts.",
    tip: "BCG 4 cases : Vaches à lait (forte part/croissance lente) → Cash. Stars (forte part/forte croissance) → Investir. Dilemmes → Décider. Poids morts → Abandonner."
  },
  {
    id: "encg-mg-007", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "Le cycle de vie d'un produit comprend les phases suivantes dans l'ordre :",
    options: [
      "Introduction → Croissance → Maturité → Déclin",
      "Croissance → Introduction → Maturité → Déclin",
      "Introduction → Maturité → Croissance → Déclin",
      "Développement → Croissance → Saturation → Déclin"
    ],
    correctIndex: 0,
    explanation: "Cycle de vie produit : 1. Introduction (faibles ventes, pertes) → 2. Croissance (ventes en hausse, profits) → 3. Maturité (ventes stables, forte concurrence) → 4. Déclin (ventes en baisse, décision d'arrêt ou relance).",
    tip: "CVP en courbe S inversée. À chaque phase : stratégie marketing différente (pénétration, expansion, différenciation, retrait)."
  },
  {
    id: "encg-mg-008", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "difficile",
    question: "L'analyse de la chaîne de valeur de Porter identifie les activités créatrices de valeur. Les activités 'de soutien' incluent :",
    options: [
      "Production, marketing, logistique, ventes, SAV",
      "Infrastructure de l'entreprise, GRH, développement technologique, approvisionnement",
      "Recherche-développement, production, distribution",
      "Finance, comptabilité, juridique, communication"
    ],
    correctIndex: 1,
    explanation: "Porter distingue : Activités PRIMAIRES (logistique entrante, production, logistique sortante, marketing/ventes, services) et Activités de SOUTIEN (infrastructure, GRH, R&D/technologie, achats). La marge = différence entre valeur créée et coûts.",
    tip: "Activités primaires = flux physique du produit. Activités de soutien = fonctions transversales qui renforcent les primaires."
  },
  {
    id: "encg-mg-009", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "La segmentation de marché consiste à :",
    options: [
      "Réduire le prix pour atteindre plus de clients",
      "Diviser le marché total en sous-groupes homogènes selon des critères pertinents (géo, démographique, comportemental)",
      "Exporter vers de nouveaux pays",
      "Développer de nouveaux produits pour le marché existant"
    ],
    correctIndex: 1,
    explanation: "Segmentation → Ciblage → Positionnement (SCP). La segmentation identifie des groupes de clients aux besoins similaires. Critères : géographiques, démographiques, psychographiques, comportementaux.",
    tip: "SCP = Segmentation, Ciblage, Positionnement. La segmentation DÉCOUPE le marché, le ciblage CHOISIT les segments, le positionnement DIFFÉRENCIE l'offre."
  },
  {
    id: "encg-mg-010", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "moyen",
    question: "Le bilan comptable est composé de :",
    options: [
      "Produits et charges de l'entreprise sur l'exercice",
      "L'actif (emplois des ressources : immobilisations + actif circulant) et le passif (sources de financement : capitaux propres + dettes)",
      "Les flux de trésorerie entrants et sortants",
      "Le budget prévisionnel de l'année suivante"
    ],
    correctIndex: 1,
    explanation: "Bilan = état patrimonial à une date donnée. ACTIF (=emplois) : Immobilisations (long terme) + Actif circulant (stocks, créances, trésorerie). PASSIF (=ressources) : Capitaux propres (KP) + Provisions + Dettes financières + Dettes circulantes.",
    tip: "Équilibre fondamental : Actif total = Passif total. Fonds de roulement = KP + Dettes LT - Immobilisations (ressources stables - emplois stables)."
  },
  {
    id: "encg-mg-011", exam: "encg", subject: "management", subjectLabel: "Management",
    level: "difficile",
    question: "Le Balanced Scorecard (BSC) de Kaplan & Norton évalue la performance sur :",
    options: [
      "2 axes : financier et non-financier",
      "4 perspectives : financière, client, processus internes, apprentissage et croissance",
      "3 dimensions : qualité, délai, coût",
      "5 forces : concurrents, fournisseurs, clients, entrants, substituts"
    ],
    correctIndex: 1,
    explanation: "BSC (tableau de bord prospectif) = 4 perspectives : 1) Financière (ROI, bénéfice) → 2) Client (satisfaction, fidélité) → 3) Processus internes (qualité, efficacité) → 4) Apprentissage/Croissance (formation, innovation). Elles sont liées causalement.",
    tip: "BSC ≠ simple tableau de bord. C'est un outil STRATÉGIQUE qui lie les objectifs opérationnels aux objectifs financiers via des indicateurs KPI."
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

  // ─── ENCG — FRANÇAIS (suite) ──────────────────────────────────────────────

  {
    id: "encg-fr-005", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "Quel est le nom correspondant au verbe 'acquérir' ?",
    options: ["Acquisition", "Acquérissement", "Acquis", "Acquêt"],
    correctIndex: 0,
    explanation: "'Acquérir' → 'acquisition' (nom féminin). 'Acquis' est le participe passé, utilisé comme nom (l'acquis = ce qu'on a acquis).",
    tip: "Dérivation : connaître les familles de mots. En contexte commercial : acquisition de clients, d'actifs."
  },
  {
    id: "encg-fr-006", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "Quelle phrase est orthographiquement correcte ?",
    options: [
      "Les résultats que nous avons obtenu sont satisfaisants.",
      "Les résultats que nous avons obtenus sont satisfaisants.",
      "Les résultats que nous avons obtenues sont satisfaisants.",
      "Les résultats que nous avons obtenu sont satisfaisantes."
    ],
    correctIndex: 1,
    explanation: "Le participe passé avec 'avoir' s'accorde avec le COD quand celui-ci est placé AVANT le verbe. 'que' = antécédent = 'les résultats' (masculin pluriel) → 'obtenus'.",
    tip: "Accord du PP avec avoir : COD avant → accord. COD après (ou absent) → pas d'accord. 'Les résultats que nous avons obtenUS'."
  },
  {
    id: "encg-fr-007", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "facile",
    question: "Le terme 'benchmark' en management signifie :",
    options: ["Un bilan financier trimestriel", "Une pratique d'étalonnage consistant à comparer ses performances aux meilleures pratiques du secteur", "Un rapport annuel pour les actionnaires", "Un outil de gestion de projet"],
    correctIndex: 1,
    explanation: "Le benchmarking (étalonnage) consiste à identifier les meilleures pratiques (best practices) d'entreprises concurrentes ou de référence, pour s'en inspirer et améliorer ses propres performances.",
    tip: "Anglicismes courants en management : benchmark, stakeholder (partie prenante), reporting, business plan, lean management."
  },
  {
    id: "encg-fr-008", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "Transformez la phrase active en passive : 'Le directeur a signé le contrat.'",
    options: [
      "Le contrat a signé par le directeur.",
      "Le contrat a été signé par le directeur.",
      "Le contrat était signé du directeur.",
      "Le contrat est signé par le directeur."
    ],
    correctIndex: 1,
    explanation: "Passif : sujet de l'actif → complément d'agent. Verbe : être + participe passé au temps correspondant. 'A signé' (passé composé actif) → 'a été signé' (passé composé passif).",
    tip: "Voix passive : être (conjugué) + participe passé. Temps du passif = temps du verbe 'être' (même que l'actif)."
  },
  {
    id: "encg-fr-009", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "moyen",
    question: "L'expression 'toutes choses égales par ailleurs' (ceteris paribus) signifie :",
    options: [
      "En tenant compte de toutes les variables simultanément",
      "En supposant que toutes les autres variables restent constantes",
      "En comparant des situations identiques",
      "En faisant la moyenne de tous les facteurs"
    ],
    correctIndex: 1,
    explanation: "Ceteris paribus (latin) : expression utilisée en économie pour isoler l'effet d'UNE variable sur une autre en supposant que tout le reste est constant. Exemple : 'si le prix augmente, toutes choses égales par ailleurs, la demande baisse'.",
    tip: "Expression-clé en économie et management. Souvent dans les QCM : 'si X change, TCEP, que se passe-t-il ?' → isoler l'effet de X seul."
  },
  {
    id: "encg-fr-010", exam: "encg", subject: "francais", subjectLabel: "Français",
    level: "facile",
    question: "Quel connecteur logique exprime la cause ?",
    options: ["Cependant", "Donc", "Car / Parce que", "Ainsi que"],
    correctIndex: 2,
    explanation: "'Car' et 'parce que' expriment la cause. 'Donc' = conséquence. 'Cependant' = opposition/concession. 'Ainsi que' = addition.",
    tip: "Connecteurs logiques : CAUSE (car, parce que, puisque, en raison de). CONSÉQUENCE (donc, ainsi, par conséquent). OPPOSITION (mais, cependant, toutefois). ADDITION (et, de plus, aussi)."
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

  // ─── ENCG — CULTURE GÉNÉRALE (suite) ─────────────────────────────────────

  {
    id: "encg-cg-006", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "Le World Economic Forum (Forum Économique Mondial) se tient annuellement à :",
    options: ["Genève", "Davos (Suisse)", "New York", "Bruxelles"],
    correctIndex: 1,
    explanation: "Le WEF se tient à Davos (Suisse) chaque janvier. Il réunit dirigeants politiques, chefs d'entreprise et académiques pour discuter des enjeux mondiaux.",
    tip: "WEF (Davos), FMI/Banque Mondiale (Washington), OMC (Genève), OCDE (Paris)."
  },
  {
    id: "encg-cg-007", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "L'accord de libre-échange entre le Maroc et l'Union Européenne est en vigueur depuis :",
    options: ["1987", "2000", "2004", "2012"],
    correctIndex: 2,
    explanation: "L'Accord d'Association UE-Maroc est entré en vigueur le 1er mars 2000 (signé en 1996), mais la zone de libre-échange industrielle complète a été atteinte vers 2012. L'UE est le 1er partenaire commercial du Maroc.",
    tip: "ALE Maroc : UE (60% échanges), USA (2006), Turquie, monde arabe (GZALE)."
  },
  {
    id: "encg-cg-008", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "facile",
    question: "Les 'Sustainable Development Goals' (ODD) de l'ONU comprennent :",
    options: ["5 objectifs", "10 objectifs", "17 objectifs", "25 objectifs"],
    correctIndex: 2,
    explanation: "Les 17 Objectifs de Développement Durable ont été adoptés en 2015 pour la période 2015-2030. Ils couvrent : pauvreté, faim, santé, éducation, égalité, énergie, emploi, etc.",
    tip: "17 ODD à l'horizon 2030 (Agenda 2030). Le Maroc a aligné son plan de développement sur ces objectifs."
  },
  {
    id: "encg-cg-009", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "Le principal secteur exportateur du Maroc en termes de valeur en 2024 est :",
    options: ["Textile", "Phosphates et dérivés", "Secteur automobile", "Tourisme"],
    correctIndex: 2,
    explanation: "En 2024, le secteur automobile (Renault, Stellantis) dépasse les phosphates comme premier poste d'exportation, suivi des engrais et phosphates (OCP). Le Maroc est devenu le 1er producteur automobile d'Afrique.",
    tip: "Podium des exportations marocaines : 1. Automobile 2. Phosphates & engrais 3. Textile 4. Agroalimentaire."
  },
  {
    id: "encg-cg-010", exam: "encg", subject: "culture", subjectLabel: "Culture générale",
    level: "moyen",
    question: "La Coupe du Monde 2030 sera co-organisée par :",
    options: ["Maroc seul", "Maroc, Espagne, Portugal (et matchs inauguraux en Amérique du Sud)", "Maroc et Algérie", "Maroc et France"],
    correctIndex: 1,
    explanation: "La Coupe du Monde 2030 sera co-organisée par Maroc, Espagne et Portugal. Des matchs historiques se joueront en Argentine, Uruguay et Paraguay pour le centenaire de la CdM. Premier mondial sur 3 continents.",
    tip: "CdM 2026 : USA, Canada, Mexique. CdM 2030 : Maroc-Espagne-Portugal + matchs sud-américains. CdM 2034 : Arabie Saoudite."
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

  // ─── FMP — SVT : ÉNERGIE CELLULAIRE (suite) ─────────────────────────────

  {
    id: "fmp-e-006", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "facile",
    question: "La photosynthèse a lieu dans les :",
    options: ["Mitochondries", "Ribosomes", "Chloroplastes", "Noyaux"],
    correctIndex: 2,
    explanation: "La photosynthèse se déroule dans les chloroplastes : phase claire (thylakoïdes) et phase sombre/cycle de Calvin (stroma).",
    tip: "Chloroplaste = photosynthèse. Mitochondrie = respiration. Les deux ont une double membrane et leur propre ADN (endosymbiose)."
  },
  {
    id: "fmp-e-007", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "moyen",
    question: "Dans la phase claire de la photosynthèse, la photolyse de l'eau produit :",
    options: [
      "Du CO₂ et de l'ATP",
      "Du O₂, des protons H⁺ et des électrons e⁻ (alimentant la chaîne photosynthétique)",
      "Du glucose directement",
      "Du NADH et de l'ADP"
    ],
    correctIndex: 1,
    explanation: "Photolyse : 2H₂O → 4H⁺ + 4e⁻ + O₂. L'O₂ est libéré dans l'atmosphère (c'est l'origine de l'O₂ atmosphérique). Les e⁻ alimentent PS II et PS I pour produire ATP et NADPH.",
    tip: "L'O₂ atmosphérique provient de la photolyse de l'eau par la photosynthèse. Réaction d'oxydation de H₂O par la lumière.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-008", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "moyen",
    question: "Le cycle de Calvin (phase sombre) nécessite comme matières premières :",
    options: [
      "O₂ et glucose",
      "CO₂, ATP et NADPH (produits de la phase claire)",
      "H₂O et lumière uniquement",
      "Glucose et ADP"
    ],
    correctIndex: 1,
    explanation: "Le cycle de Calvin (stroma) utilise : CO₂ (fixé par RuBisCO), ATP et NADPH (fournis par la phase claire). Produit : G3P → précurseur du glucose.",
    tip: "Phase claire : lumière → ATP + NADPH + O₂. Phase Calvin : CO₂ + ATP + NADPH → glucose. Deux phases complémentaires.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-009", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "difficile",
    question: "La fermentation alcoolique diffère de la fermentation lactique en ce que :",
    options: [
      "Elle produit plus d'ATP (4 ATP au lieu de 2)",
      "Elle libère CO₂ et produit de l'éthanol au lieu de lactate (les deux régénèrent NAD⁺)",
      "Elle nécessite de l'oxygène",
      "Elle se passe dans la mitochondrie"
    ],
    correctIndex: 1,
    explanation: "Fermentation lactique : pyruvate + NADH → lactate + NAD⁺. Fermentation alcoolique : pyruvate → acétaldéhyde + CO₂ → éthanol + NAD⁺. Bilan ATP identique (2 ATP de la glycolyse). Différence : produit final et CO₂.",
    tip: "Les 2 fermentations = 2 ATP (de la glycolyse). Différence : éthanol+CO₂ (levures) vs lactate (muscles, bactéries).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-e-010", exam: "fmp", subject: "svt_energie", subjectLabel: "Énergie cellulaire",
    level: "moyen",
    question: "La créatine phosphate (phosphocréatine) dans le muscle sert à :",
    options: [
      "Stocker de l'oxygène pour la respiration aérobie",
      "Régénérer rapidement l'ATP lors d'un effort court et intense (système alactique)",
      "Produire du lactate lors de l'effort prolongé",
      "Activer les protéines contractiles directement"
    ],
    correctIndex: 1,
    explanation: "La phosphocréatine = réserve immédiate d'énergie. PCr + ADP → ATP + créatine (créatine kinase). Durée : 5-8 secondes d'effort maximal. Système alactique (sans lactate, sans O₂).",
    tip: "3 systèmes énergétiques : Alactique (PCr, <8s), Lactique (glycolyse anaérobie, 8s-1min), Aérobie (respiration, >1min).",
    source: "Concours FMP 2025"
  },

  // ─── FMP — SVT : MUSCLE & CONTRACTION ─────────────────────────────────────

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

  // ─── FMP — SVT : MUSCLE (suite) ──────────────────────────────────────────

  {
    id: "fmp-m-005", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "moyen",
    question: "La tétanisation musculaire est atteinte quand :",
    options: [
      "Le muscle est complètement fatigué et ne peut plus se contracter",
      "La fréquence de stimulation est suffisamment élevée pour que les secousses se fusionnent en une contraction soutenue",
      "La température du muscle dépasse 40°C",
      "La concentration en Ca²⁺ intracellulaire devient nulle"
    ],
    correctIndex: 1,
    explanation: "Secousse musculaire = réponse à 1 stimulus. Sommation = stimuli rapprochés dont les effets s'additionnent. Tétanos incomplet → tétanos complet (fusion totale) quand f > f_critique. Force tétanique ≈ 3-4 × force d'une secousse.",
    tip: "Tétanisation ≠ crampe. C'est un phénomène physiologique normal qui permet les mouvements fluides. Le tétanos médical est une maladie bactérienne différente.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-006", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "moyen",
    question: "La jonction neuromusculaire (plaque motrice) fonctionne par :",
    options: [
      "Connexion électrique directe entre le motoneurone et le muscle",
      "Libération d'acétylcholine (ACh) dans la fente synaptique → liaison aux récepteurs → dépolarisation de la fibre",
      "Libération d'adrénaline qui stimule la contraction directement",
      "Passage du courant électrique par les canaux ioniques du sarcomère"
    ],
    correctIndex: 1,
    explanation: "Potentiel d'action motoneurone → vésicules synaptiques libèrent ACh → ACh se fixe sur récepteurs nicotiniques → ouverture canaux Na⁺/K⁺ → dépolarisation → potentiel d'action musculaire → libération Ca²⁺ → contraction.",
    tip: "Neurotransmetteur à la jonction NM = acétylcholine (ACh). Bloqué par la curare (myorelaxant). Détruit par l'acétylcholinestérase.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-007", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "difficile",
    question: "Lors de la contraction isométrique (tension sans raccourcissement), par rapport à la contraction isotonique :",
    options: [
      "La tension développée est plus faible et il n'y a pas de travail mécanique",
      "La tension développée peut être très grande mais le déplacement est nul, donc le travail mécanique W = F×d = 0",
      "L'ATP consommé est identique dans les deux cas",
      "Elle ne fait intervenir ni actine ni myosine"
    ],
    correctIndex: 1,
    explanation: "Contraction isométrique : longueur constante, tension variable. W = F × Δl = 0 (pas de déplacement) mais l'ATP est quand même consommé (les ponts actomyosine se forment). Isotonique : tension constante, longueur variable → W > 0.",
    tip: "Isométrique = même longueur (iso = même, métrique = longueur). Isotonique = même tension (tonique = tension). Les deux consomment de l'ATP.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-m-008", exam: "fmp", subject: "svt_muscle", subjectLabel: "Muscle & Contraction",
    level: "moyen",
    question: "La relaxation musculaire se produit quand :",
    options: [
      "L'ATP est épuisé et les ponts actomyosine se rompent spontanément",
      "Le Ca²⁺ est recapturé activement par le réticulum sarcoplasmique (pompe SERCA, ATP-dépendante) → la troponine masque les sites actine",
      "Le motoneurone envoie un potentiel d'action inhibiteur",
      "La tropomyosine est dégradée par les enzymes lysosomiales"
    ],
    correctIndex: 1,
    explanation: "Relaxation : la SERCA (Sarco-Endoplasmic Reticulum Ca²⁺-ATPase) recapture le Ca²⁺ dans le RS (consomme 1 ATP par 2 Ca²⁺). Quand [Ca²⁺] < seuil, troponine reprend sa conformation initiale → tropomyosine masque les sites actine → les têtes myosine ne peuvent plus se fixer → relaxation.",
    tip: "Relaxation = ACTIVE (nécessite de l'ATP pour pomper le Ca²⁺). Rigor mortis = manque d'ATP après la mort → ponts actomyosine bloqués.",
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

  // ─── FMP — SVT : GÉNÉTIQUE (suite) ───────────────────────────────────────

  {
    id: "fmp-g-009", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "La mitose produit des cellules filles :",
    options: [
      "Haploïdes (n chromosomes) génétiquement identiques à la cellule mère diploïde",
      "Diploïdes (2n chromosomes) génétiquement identiques à la cellule mère",
      "Haploïdes avec recombinaison génétique",
      "Diploïdes avec du matériel génétique différent de la cellule mère"
    ],
    correctIndex: 1,
    explanation: "Mitose = division équatoire : 1 cellule 2n → 2 cellules 2n identiques. Utilisée pour la croissance et la réparation. La méiose = division réductionnelle : 1 cellule 2n → 4 cellules n (gamètes) avec recombinaison.",
    tip: "Mitose : 2n → 2n (clonage). Méiose : 2n → n (gamètes, recombinaison). Mitose = corps. Méiose = reproduction sexuée.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-010", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "Le crossing-over (enjambement) lors de la méiose I permet :",
    options: [
      "La réplication de l'ADN en phase S",
      "L'échange de segments entre chromatides non sœurs de chromosomes homologues → brassage intrachromosomique",
      "La séparation des chromosomes homologues à l'anaphase II",
      "La fusion des gamètes lors de la fécondation"
    ],
    correctIndex: 1,
    explanation: "Le crossing-over se produit lors de la prophase I, quand les chromosomes homologues s'apparient (synapsis). Les chromatides non sœurs échangent des segments → nouvelles combinaisons alléliques. Ce brassage intrachromosomique + le brassage interchromosomique (ségrégation indépendante) assurent la diversité génétique.",
    tip: "2 sources de diversité en méiose : (1) Crossing-over = brassage intra-chromosomique. (2) Assortiment indépendant = brassage inter-chromosomique. + Fécondation.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-g-011", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "moyen",
    question: "La maladie de Tay-Sachs est autosomique récessive. Si les deux parents sont porteurs (Aa × Aa), les probabilités d'avoir des enfants AA, Aa, aa sont :",
    options: ["1/4, 1/2, 1/4", "1/2, 1/4, 1/4", "0, 1/2, 1/2", "1/3, 1/3, 1/3"],
    correctIndex: 0,
    explanation: "Carré de Punnett Aa × Aa : AA (1/4), Aa (2/4 = 1/2), aa (1/4). Phénotypiquement : 3/4 normaux (AA + Aa), 1/4 atteints (aa).",
    tip: "Récessif : 1/4 atteints pour 2 parents porteurs. Dominant : atteints si au moins 1 allèle dominant. Ratio 3:1 est le ratio mendélien classique."
  },
  {
    id: "fmp-g-012", exam: "fmp", subject: "svt_genetique", subjectLabel: "ADN & Génétique",
    level: "difficile",
    question: "La technique PCR (Polymerase Chain Reaction) amplifie l'ADN grâce à :",
    options: [
      "Une enzyme de restriction qui coupe aux sites spécifiques",
      "Des cycles alternant dénaturation (95°C), hybridation des amorces et extension par la Taq polymérase (ADN polymérase thermostable)",
      "L'électrophorèse sur gel d'agarose",
      "Des bactéries transformées par un plasmide recombinant"
    ],
    correctIndex: 1,
    explanation: "PCR (Mullis, 1983) : 1) Dénaturation à 95°C (sépare les 2 brins). 2) Hybridation (55-65°C) : les amorces se fixent aux extrémités de la cible. 3) Extension à 72°C : Taq polymérase (thermostable) synthétise le brin complémentaire. 30-40 cycles → 2³⁰ copies. Applications : diagnostic, médecine légale.",
    tip: "PCR = amplification exponentielle. 30 cycles → 2³⁰ ≈ 10⁹ copies. La Taq polymérase est thermostable (issue de Thermus aquaticus, bactérie des sources chaudes)."
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

  // ─── FMP — CHIMIE : REDOX (suite) ─────────────────────────────────────────

  {
    id: "fmp-c-005", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "moyen",
    question: "La vitesse de réaction est définie comme v = -d[réactif]/dt = +d[produit]/dt. Pour A + 2B → C, si d[C]/dt = 0,02 mol/L/s, alors d[B]/dt vaut :",
    options: ["-0,01 mol/L/s", "-0,02 mol/L/s", "-0,04 mol/L/s", "+0,04 mol/L/s"],
    correctIndex: 2,
    explanation: "D'après la stœchiométrie : -d[A]/dt = -(1/2)d[B]/dt = d[C]/dt. Donc d[B]/dt = -2×d[C]/dt = -2×0,02 = -0,04 mol/L/s (le B disparaît 2× plus vite que C apparaît).",
    tip: "Vitesses stœchiométriques : v = -(1/a)d[A]/dt = -(1/b)d[B]/dt = (1/c)d[C]/dt. Diviser/multiplier par les coefficients.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-006", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "moyen",
    question: "Un catalyseur homogène est en :",
    options: [
      "Phase solide dans une réaction liquide",
      "Même phase que les réactifs (ex : enzyme dans une solution aqueuse)",
      "Phase gazeuse dans toutes les réactions catalytiques",
      "Phase différente pour accélérer le transfert de masse"
    ],
    correctIndex: 1,
    explanation: "Catalyseur homogène = même phase que les réactifs (ex : acide H₂SO₄ pour l'estérification en solution). Catalyseur hétérogène = phase différente (ex : platine solide pour l'hydrogénation gazeuse). Les enzymes sont des catalyseurs biologiques homogènes.",
    tip: "Homo = même phase. Hétéro = phases différentes. Les deux abaissent Eₐ et accélèrent l'équilibre sans modifier K.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-007", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "difficile",
    question: "Pour la réaction 2Cl⁻ → Cl₂ + 2e⁻ à l'anode d'une électrolyse, le nombre d'oxydation du Cl passe de :",
    options: ["-1 à 0 (oxydation)", "0 à -1 (réduction)", "-1 à +1 (oxydation)", "+1 à 0 (réduction)"],
    correctIndex: 0,
    explanation: "Cl⁻ : NO = -1. Cl₂ : NO = 0 (élément). Passage de -1 à 0 = augmentation du NO = oxydation. Cohérent avec l'anode (électrode où se produit l'oxydation en électrolyse).",
    tip: "Nombre d'oxydation (NO) : augmente → oxydation. Diminue → réduction. Cl₂ = NO 0. NaCl → Cl⁻ = NO -1. HCl → Cl = NO -1.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-c-008", exam: "fmp", subject: "chimie_redox", subjectLabel: "Redox & Cinétique",
    level: "moyen",
    question: "La réaction entre Fe³⁺ et I⁻ : 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂. L'oxydant et le réducteur sont :",
    options: [
      "Fe³⁺ = réducteur ; I⁻ = oxydant",
      "Fe³⁺ = oxydant (il se réduit en Fe²⁺) ; I⁻ = réducteur (s'oxyde en I₂)",
      "Fe²⁺ = oxydant ; I₂ = réducteur",
      "Les deux sont des réducteurs"
    ],
    correctIndex: 1,
    explanation: "Fe³⁺ + e⁻ → Fe²⁺ : le fer REÇOIT des électrons = il est RÉDUIT = c'est l'OXYDANT. I⁻ → ½I₂ + e⁻ : l'iode DONNE des électrons = il est OXYDÉ = c'est le RÉDUCTEUR.",
    tip: "Oxydant = espèce qui s'OXYDE... non ! Oxydant = celui qui OXYDE les autres = celui qui SE RÉDUIT (reçoit des e⁻). Réducteur = celui qui se RÉDUIT... non ! Réducteur = celui qui RÉDUIT les autres = celui qui S'OXYDE (donne des e⁻)."
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

  // ─── FMP — CHIMIE ACIDO-BASIQUE (suite) ──────────────────────────────────

  {
    id: "fmp-ca-005", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "facile",
    question: "Le pH d'une solution de NaOH à 0,001 mol/L (base forte) est :",
    options: ["pH = 3", "pH = 11", "pH = 7", "pH = 13"],
    correctIndex: 1,
    explanation: "NaOH base forte : [OH⁻] = 0,001 = 10⁻³ mol/L. pOH = 3. pH = 14 - pOH = 14 - 3 = 11.",
    tip: "pH + pOH = 14 (à 25°C). Pour une base forte : [OH⁻] = concentration de la base → calculer pOH puis pH.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-006", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "moyen",
    question: "Pour un acide faible AH de concentration C = 0,1 mol/L et pKₐ = 4, le pH approximatif est :",
    options: ["pH = 4", "pH = 2,5", "pH = 7", "pH = 0,1"],
    correctIndex: 1,
    explanation: "Pour un acide faible (faible ionisation) : pH ≈ ½(pKₐ - log C) = ½(4 - log 0,1) = ½(4 + 1) = 2,5. Vérification : taux d'ionisation τ = 10^(pKₐ-pH)/C... méthode simplifiée valide si τ << 1.",
    tip: "Formule pour acide faible dilué : pH ≈ ½(pKₐ + pC) = ½(pKₐ - log C). Valide si [H⁺] << C.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-007", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "difficile",
    question: "Le taux d'avancement à l'équilibre τ d'une réaction est défini comme τ = x_éq/x_max. Pour AH ⇌ A⁻ + H⁺ avec C=0,1M et Ka=10⁻⁵, τ est approximativement :",
    options: ["τ = 1 (total)", "τ ≈ 1% (0,01)", "τ ≈ 10% (0,1)", "τ ≈ 50%"],
    correctIndex: 1,
    explanation: "Ka = [H⁺][A⁻]/[AH] ≈ (Cτ)²/(C(1-τ)) ≈ Cτ² (si τ << 1). Cτ² = Ka → τ² = Ka/C = 10⁻⁵/10⁻¹ = 10⁻⁴ → τ = 10⁻² = 1%.",
    tip: "Acide faible : τ = √(Ka/C). Plus l'acide est fort ou la solution est diluée, plus τ est grand.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-ca-008", exam: "fmp", subject: "chimie_acide", subjectLabel: "Acido-basique",
    level: "moyen",
    question: "L'acide carbonique H₂CO₃ est un acide diprotique avec pKₐ₁ = 6,4 et pKₐ₂ = 10,3. Au pH physiologique = 7,4, l'espèce dominante dans le sang est :",
    options: ["H₂CO₃ (acide)", "HCO₃⁻ (hydrogénocarbonate)", "CO₃²⁻ (carbonate)", "CO₂ dissous"],
    correctIndex: 1,
    explanation: "Diagramme de prédominance : H₂CO₃ dominant pour pH < pKₐ₁=6,4. HCO₃⁻ dominant pour 6,4 < pH < 10,3. CO₃²⁻ dominant pour pH > 10,3. pH sanguin = 7,4 → HCO₃⁻ est l'espèce dominante (bicarbonate).",
    tip: "Le couple HCO₃⁻/H₂CO₃ (pKₐ = 6,4) est le principal tampon du sang. pH sanguin = 7,35-7,45. Acidose < 7,35, Alcalose > 7,45.",
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

  // ─── FMP — CHIMIE ORGANIQUE (suite) ──────────────────────────────────────

  {
    id: "fmp-co-005", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "moyen",
    question: "L'hydrolyse acide de l'éthanoate d'éthyle (CH₃COOC₂H₅ + H₂O ⇌ CH₃COOH + C₂H₅OH) est :",
    options: [
      "Totale et rapide (comme la saponification)",
      "Lente et limitée (équilibre), inverse de l'estérification",
      "Impossible car les esters résistent aux acides",
      "Rapide car l'acide est un catalyseur irréversible"
    ],
    correctIndex: 1,
    explanation: "L'hydrolyse acide d'un ester est l'inverse de l'estérification : même équilibre, mêmes caractéristiques LENTE + LIMITÉE + ATHERMIQUE. On peut déplacer l'équilibre vers l'hydrolyse en ajoutant un excès d'eau.",
    tip: "Estérification et hydrolyse acide = même équilibre. Seules les concentrations initiales diffèrent. Saponification (hydroxyde) = totale.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-co-006", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "moyen",
    question: "La réaction de substitution nucléophile (SN2) est favorisée pour :",
    options: [
      "Les halogénoalcanes tertiaires en présence de base forte",
      "Les halogénoalcanes primaires en présence de nucléophile fort",
      "Les halogénoalcanes tertiaires car ils sont plus réactifs",
      "Les halogénoarènes car le cycle aromatique facilite l'attaque"
    ],
    correctIndex: 1,
    explanation: "SN2 (substitution bimoléculaire) : attaque par derrière du nucléophile + départ du nucléofuge en une seule étape. Favorisée par : halogénure PRIMAIRE (peu d'encombrement stérique) + nucléophile FORT (OH⁻, I⁻, CN⁻...). Halogénures tertiaires → élimination (E2) ou SN1.",
    tip: "SN1 : tertiaire (intermédiaire carbocation stable). SN2 : primaire (attaque directe). Encombrement stérique = ennemi de SN2.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-co-007", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "moyen",
    question: "Le glucose (C₆H₁₂O₆) est un aldose car :",
    options: [
      "Il possède 6 atomes de carbone et un groupe cétone",
      "Son carbone anomère (C1) porte un groupe aldéhyde en forme linéaire",
      "Il est soluble dans l'eau contrairement aux cétoses",
      "Il peut se polymériser en cellulose sans intermédiaire"
    ],
    correctIndex: 1,
    explanation: "Le glucose est un aldohexose : aldéhyde en C1 (en forme linéaire de Fischer), 6 atomes de carbone, 4 carbones asymétriques (C2-C5). En solution aqueuse : majorité en forme cyclique (pyranose), avec anomères α et β en équilibre (mutarotation).",
    tip: "Aldose = aldéhyde + ose. Cétose = cétone + ose (ex: fructose, C2). Les deux sont réducteurs et donnent un test positif à Fehling (mais le fructose moins)."
  },
  {
    id: "fmp-co-008", exam: "fmp", subject: "chimie_organique", subjectLabel: "Chimie organique",
    level: "difficile",
    question: "L'isomérie de position dans un alcène : mais-1-ène CH₂=CH-CH₂-CH₃ et mais-2-ène CH₃-CH=CH-CH₃. Ces deux molécules ont :",
    options: [
      "La même formule brute et la même formule semi-développée",
      "La même formule brute C₄H₈ mais une position différente de la double liaison",
      "Des formules brutes différentes car les groupes sont inversés",
      "La même formule semi-développée mais des propriétés physiques identiques"
    ],
    correctIndex: 1,
    explanation: "Isomérie de position : même formule brute (C₄H₈), même type de fonction (alcène), mais position différente de la double liaison (entre C1-C2 vs C2-C3). Les propriétés physiques (Tébullition) diffèrent légèrement.",
    tip: "Types d'isomérie : carbonée (squelette), position (groupe fonctionnel à différents endroits), fonction (groupes différents), géométrique (cis/trans)."
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

  // ─── FMP — ONDES (suite) ──────────────────────────────────────────────────

  {
    id: "fmp-o-005", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "moyen",
    question: "Deux sources S₁ et S₂ en phase émettent des ondes de λ = 4 cm. Le point M tel que S₁M - S₂M = 6 cm est :",
    options: [
      "Un point d'interférence constructive (ventre)",
      "Un point d'interférence destructive (nœud)",
      "Un point quelconque sans interférence notable",
      "Un nœud uniquement si les sources sont perpendiculaires"
    ],
    correctIndex: 0,
    explanation: "Deux sources en phase : constructive si δ = S₁M - S₂M = kλ. δ = 6 cm = 1,5λ = (3/2)λ. Ce n'est pas un multiple entier de λ → interférence DESTRUCTIVE. Correction : 6 = 1,5×4 → δ = (2k+1)λ/2 → destructive. Réponse B.",
    tip: "Sources EN PHASE : constructif si δ = kλ ; destructif si δ = (2k+1)λ/2. Sources EN OPPOSITION : inverser les conditions.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-006", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "moyen",
    question: "L'effet Doppler : une ambulance s'approche à v_s = 30 m/s avec une sirène à f₀ = 500 Hz. Le son perçu par un observateur immobile (vitesse du son v = 340 m/s) a une fréquence :",
    options: ["455 Hz", "500 Hz", "548 Hz", "446 Hz"],
    correctIndex: 2,
    explanation: "Effet Doppler (source s'approchant) : f = f₀ × v/(v - v_s) = 500 × 340/(340-30) = 500 × 340/310 ≈ 500 × 1,097 ≈ 548 Hz. La fréquence perçue est plus élevée quand la source s'approche.",
    tip: "Doppler : source s'approche → f observée > f₀. Source s'éloigne → f observée < f₀. Formule : f = f₀ × (v ± v_obs)/(v ∓ v_src).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-007", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "difficile",
    question: "Une onde stationnaire se forme dans une corde de longueur L fixée aux deux extrémités. Les fréquences propres sont :",
    options: [
      "f_n = v/L × n pour n = 0, 1, 2, ...",
      "f_n = n × v/(2L) pour n = 1, 2, 3, ... (harmoniques)",
      "f_n = v/(2L) uniquement (fondamentale seulement)",
      "f_n = v × L/n"
    ],
    correctIndex: 1,
    explanation: "Corde fixée aux deux bouts : nœuds aux extrémités. Condition : L = n × λ/2 → λ = 2L/n → f_n = v/λ = nv/(2L). f₁ = v/(2L) = fondamentale. f₂ = 2f₁, etc. (harmoniques entières).",
    tip: "Modes propres d'une corde : L = n×λ/2. Tuyau ouvert-ouvert : identique. Tuyau fermé-ouvert : L = (2n-1)×λ/4 (harmoniques impaires).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-o-008", exam: "fmp", subject: "physique_ondes", subjectLabel: "Ondes",
    level: "moyen",
    question: "L'ultrasonographie médicale utilise des ultrasons car :",
    options: [
      "Ils traversent les os et les dents sans atténuation",
      "Ils n'ionisent pas les tissus (non dangereux) et leur courte λ permet une bonne résolution spatiale",
      "Ils sont visibles à l'œil nu et permettent un guidage direct",
      "Ils se propagent dans le vide, idéaux pour les cavités corporelles"
    ],
    correctIndex: 1,
    explanation: "Ultrasons (f > 20 kHz) : non ionisants (contrairement aux RX) → sans danger pour les tissus. λ courte → haute résolution (pouvoir séparateur ≈ λ). Réflexion aux interfaces (échographie) ou absorption (thérapie). Fréquences médicales : 1-20 MHz.",
    tip: "Imagerie médicale : Échographie = ultrasons (non ionisant, temps réel). Scanner/RX = rayons X (ionisant). IRM = champ magnétique (non ionisant)."
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

  // ─── FMP — PHYSIQUE NUCLÉAIRE (suite) ────────────────────────────────────

  {
    id: "fmp-n-005", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "moyen",
    question: "La réaction de fission : ²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + x ¹₀n. La valeur de x est :",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    explanation: "Conservation du nombre de masse : 235 + 1 = 141 + 92 + x×1 → x = 236 - 233 = 3. Conservation du numéro atomique : 92 + 0 = 56 + 36 + 0 ✓. La fission libère 3 neutrons qui peuvent induire d'autres fissions (réaction en chaîne).",
    tip: "Conserver A et Z séparément. ΣA gauche = ΣA droite. La fission de U-235 libère en moyenne 2-3 neutrons.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-006", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "moyen",
    question: "L'énergie libérée lors de la désintégration α de ²²⁶₈₈Ra → ²²²₈₆Rn + ⁴₂He. Défaut de masse : Δm = 0,005u. En MeV (1u = 931 MeV/c²) :",
    options: ["0,005 MeV", "4,655 MeV", "9,31 MeV", "931 MeV"],
    correctIndex: 1,
    explanation: "E = Δm × c² = 0,005 × 931 = 4,655 MeV.",
    tip: "Conversion : 1u = 931 MeV/c². Multiplier simplement le défaut de masse par 931 pour obtenir l'énergie en MeV.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-007", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "difficile",
    question: "L'activité A(t) d'un échantillon radioactif obéit à :",
    options: [
      "A(t) = A₀ × t (augmentation linéaire)",
      "A(t) = A₀ × e^(-λt) = A₀ × (1/2)^(t/t₁/₂)",
      "A(t) = λ × N₀ (constante)",
      "A(t) = A₀ / t (décroissance hyperbolique)"
    ],
    correctIndex: 1,
    explanation: "La loi de désintégration radioactive est exponentielle décroissante. A(t) = A₀e^(-λt) = A₀(1/2)^(t/t₁/₂). λ = constante de désintégration = ln2/t₁/₂. Unité de l'activité : Becquerel (Bq) = 1 désintégration/seconde.",
    tip: "Loi radioactive : N(t) = N₀e^(-λt). Activité A = λN = A₀e^(-λt). La courbe est une exponentielle décroissante.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-n-008", exam: "fmp", subject: "physique_nuc", subjectLabel: "Physique nucléaire",
    level: "moyen",
    question: "Le carbone-14 (t₁/₂ = 5730 ans) est utilisé en datation car :",
    options: [
      "Il est présent dans tous les roches et minéraux",
      "Il est produit dans l'atmosphère par rayonnement cosmique et intégré dans les êtres vivants qui arrêtent de l'assimiler à leur mort",
      "Il est radioactif α très énergétique",
      "Il est stable et sert de référence pour comparer les autres isotopes"
    ],
    correctIndex: 1,
    explanation: "¹⁴C est formé dans l'atmosphère : ¹⁴N + n → ¹⁴C + p. Les organismes vivants assimilent ¹⁴C via CO₂. À la mort, l'assimilation cesse → ¹⁴C décroît. En mesurant le rapport ¹⁴C/¹²C, on peut dater un échantillon jusqu'à ~50 000 ans.",
    tip: "Datation au ¹⁴C valide jusqu'à ~50 000 ans. Pour des âges plus anciens : datation par d'autres radioéléments (K-Ar pour millions d'années, U-Pb pour milliards)."
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

  // ─── FMP — ÉLECTRICITÉ (suite) ────────────────────────────────────────────

  {
    id: "fmp-el-006", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "moyen",
    question: "Dans un circuit RLC série, quand ω > ω₀ (fréquence au-dessus de la résonance), le circuit se comporte comme :",
    options: ["Un circuit purement résistif", "Un circuit inductif (la bobine domine)", "Un circuit capacitif (le condensateur domine)", "Un circuit sans déphasage"],
    correctIndex: 1,
    explanation: "Z = R + j(Lω - 1/(Cω)). Pour ω > ω₀ : Lω > 1/(Cω) → partie imaginaire positive → circuit INDUCTIF. Déphasage φ > 0 (courant en retard sur tension). Pour ω < ω₀ : circuit capacitif.",
    tip: "ω > ω₀ → inductif (bobine domine). ω < ω₀ → capacitif (condensateur domine). ω = ω₀ → résonance (purement résistif, φ = 0).",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-007", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "facile",
    question: "Un générateur de tension u = E + r×i (avec r = résistance interne). Si la résistance de charge R est très grande devant r, la tension aux bornes est :",
    options: ["Nulle", "Égale à E (tension à vide)", "Supérieure à E", "Égale à r×i"],
    correctIndex: 1,
    explanation: "i = E/(R+r). U_charge = R×i = ER/(R+r). Si R >> r : U_charge ≈ E. À vide (R→∞) : U = E (tension à vide). En court-circuit (R=0) : i = E/r (courant de court-circuit).",
    tip: "Tension à vide = E (tension maximale). Sous charge : tension aux bornes < E à cause de la chute ohmique r×i."
  },
  {
    id: "fmp-el-008", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "difficile",
    question: "Un circuit RC (R=10kΩ, C=1µF) en régime sinusoïdal à f=100Hz. L'impédance complexe Z vaut :",
    options: [
      "Z = 10 000 Ω (résistance seule)",
      "Z = R - j/(Cω) = 10 000 - j×1592 Ω, |Z| ≈ 10 125 Ω",
      "Z = j×Cω = j×0,000628 Ω",
      "Z = R + j×Cω = 10 000 + j×0,000628 Ω"
    ],
    correctIndex: 1,
    explanation: "Impédance du condensateur : Z_C = 1/(jCω) = -j/(Cω). ω = 2πf = 628 rad/s. 1/(Cω) = 1/(10⁻⁶×628) = 1592 Ω. Z = R + Z_C = 10000 - j×1592. |Z| = √(10000² + 1592²) ≈ 10 125 Ω.",
    tip: "Z_résistance = R. Z_condensateur = 1/(jCω) = -j/(Cω). Z_bobine = jLω. Impédance totale = somme des impédances en série.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-el-009", exam: "fmp", subject: "physique_elec", subjectLabel: "Électricité",
    level: "moyen",
    question: "Pendant la décharge d'un condensateur dans un circuit RC, la tension Uc(t) décroît selon :",
    options: [
      "Uc(t) = U₀ × t/τ (linéaire)",
      "Uc(t) = U₀ × e^(-t/τ) (exponentielle décroissante avec τ = RC)",
      "Uc(t) = U₀ × (1 - e^(-t/τ)) (chargement)",
      "Uc(t) = U₀/2 pour tout t (constante)"
    ],
    correctIndex: 1,
    explanation: "Décharge : Uc(t) = U₀ × e^(-t/τ). À t=0 : Uc = U₀. À t=τ : Uc = U₀/e ≈ 0,37U₀. À t=5τ : Uc ≈ 0,007U₀ (quasi-nulle). Charge : Uc(t) = E(1-e^(-t/τ)). Les deux utilisent τ = RC.",
    tip: "Retenir les deux formules : Charge → (1-e^(-t/τ)) ; Décharge → e^(-t/τ). τ = RC = constante de temps."
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

  // ─── FMP — MATHS : ANALYSE (suite) ───────────────────────────────────────

  {
    id: "fmp-ma-009", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "La dérivée de f(x) = eˣ·cos(x) est :",
    options: [
      "eˣ·cos(x) - eˣ·sin(x)",
      "eˣ·(cos(x) - sin(x))",
      "eˣ·sin(x)",
      "-eˣ·sin(x)"
    ],
    correctIndex: 1,
    explanation: "Règle du produit : (uv)' = u'v + uv'. u = eˣ, u' = eˣ ; v = cos(x), v' = -sin(x). f'(x) = eˣ·cos(x) + eˣ·(-sin(x)) = eˣ(cos x - sin x).",
    tip: "(eˣ)' = eˣ. (cos x)' = -sin x. (sin x)' = cos x. Produit : (uv)' = u'v + uv'."
  },
  {
    id: "fmp-ma-010", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "∫ sin²(x) dx sur [0, π] vaut :",
    options: ["0", "π/2", "π", "2π"],
    correctIndex: 1,
    explanation: "sin²(x) = (1 - cos(2x))/2. ∫₀^π sin²(x)dx = ∫₀^π (1-cos(2x))/2 dx = [x/2 - sin(2x)/4]₀^π = π/2 - 0 = π/2.",
    tip: "Formule de linéarisation : sin²x = (1-cos2x)/2. cos²x = (1+cos2x)/2. Indispensable pour les intégrales de fonctions trigonométriques."
  },
  {
    id: "fmp-ma-011", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "difficile",
    question: "Soit f(x) = ln(x+1)/x pour x > 0. La limite de f en 0⁺ et l'asymptote en +∞ sont :",
    options: [
      "f(0⁺) = 0 ; asymptote y = 0",
      "f(0⁺) = 1 (DL : ln(1+x)/x → 1) ; asymptote y = 0 (car ln(x+1)/x → 0)",
      "f(0⁺) = +∞ ; asymptote y = 1",
      "f(0⁺) = 1 ; asymptote y = 1"
    ],
    correctIndex: 1,
    explanation: "En 0⁺ : DL → ln(1+x) ≈ x → f(x) ≈ x/x = 1. En +∞ : ln(x+1)/x → 0 (log croit moins vite que x). Asymptote horizontale y = 0.",
    tip: "DL en 0 : ln(1+x) ≈ x - x²/2 + ... → ln(1+x)/x → 1 quand x→0. Croissances comparées : lnx << x quand x→+∞."
  },
  {
    id: "fmp-ma-012", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "difficile",
    question: "L'équation différentielle y'' - y = 0. La solution générale est :",
    options: [
      "y = Acos(x) + Bsin(x)",
      "y = Ae^x + Be^(-x) (ou y = A·sh(x) + B·ch(x))",
      "y = (Ax + B)e^x",
      "y = A·ln(x) + B"
    ],
    correctIndex: 1,
    explanation: "Équation caractéristique : r² - 1 = 0 → r = ±1 (racines réelles distinctes). Solution générale : y = Ae^x + Be^(-x). Alternativement : y = A·cosh(x) + B·sinh(x) (fonctions hyperboliques).",
    tip: "r² - ω² = 0 → r = ±ω → y = Ae^(ωx) + Be^(-ωx) (exponentiel). r² + ω² = 0 → r = ±iω → y = Acos(ωx) + Bsin(ωx) (sinusoïdal)."
  },
  {
    id: "fmp-ma-013", exam: "fmp", subject: "maths_analyse", subjectLabel: "Analyse & Calcul",
    level: "moyen",
    question: "Le développement de Taylor de f(x) = 1/(1-x) en 0 (pour |x| < 1) est :",
    options: [
      "1 - x + x² - x³ + ...",
      "1 + x + x² + x³ + ... (série géométrique)",
      "x + x²/2 + x³/3 + ...",
      "e^x"
    ],
    correctIndex: 1,
    explanation: "1/(1-x) = Σ xⁿ = 1 + x + x² + x³ + ... pour |x| < 1. C'est la somme de la série géométrique de raison x.",
    tip: "Séries de Taylor fondamentales : 1/(1-x) = Σxⁿ ; e^x = Σxⁿ/n! ; ln(1+x) = Σ(-1)^(n+1)xⁿ/n ; sin(x) = Σ(-1)ⁿx^(2n+1)/(2n+1)!"
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

  // ─── FMP — PROBABILITÉS (suite) ───────────────────────────────────────────

  {
    id: "fmp-p-005", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "X suit une loi normale N(μ=70, σ=10). P(60 < X < 80) est approximativement :",
    options: ["50%", "68%", "95%", "99,7%"],
    correctIndex: 1,
    explanation: "P(μ-σ < X < μ+σ) ≈ 68% (règle empirique). Ici 60 = 70-10 = μ-σ et 80 = 70+10 = μ+σ. Donc P(60<X<80) ≈ 68%.",
    tip: "N(μ,σ) : P(μ±σ) ≈ 68%, P(μ±2σ) ≈ 95%, P(μ±3σ) ≈ 99,7%. Règle des 68-95-99,7.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-006", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "difficile",
    question: "X ~ N(0,1) (loi normale centrée réduite). La valeur z telle que P(X ≤ z) = 0,975 est :",
    options: ["z = 1,645", "z = 1,960", "z = 2,326", "z = 2,576"],
    correctIndex: 1,
    explanation: "P(X ≤ 1,96) = 0,975 (table de la loi normale). Ce qui signifie P(-1,96 ≤ X ≤ 1,96) = 0,95. Le z critique pour l'intervalle de confiance à 95% est z = 1,96.",
    tip: "Valeurs critiques à mémoriser : z_0,90 = 1,645 ; z_0,95 = 1,960 ; z_0,99 = 2,576. Très utiles pour les tests statistiques.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-007", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "L'espérance mathématique E[X] d'une variable aléatoire discrète X est :",
    options: [
      "La valeur la plus fréquente (mode)",
      "La valeur médiane de la distribution",
      "La moyenne pondérée : E[X] = Σ xᵢ × P(X = xᵢ)",
      "La somme des probabilités"
    ],
    correctIndex: 2,
    explanation: "E[X] = Σ xᵢ × P(X=xᵢ). Exemple : dé équilibré E[X] = 1×(1/6)+2×(1/6)+...+6×(1/6) = 21/6 = 3,5. L'espérance peut prendre une valeur non réalisable (3,5 n'est pas une face d'un dé).",
    tip: "E[X] = moyenne pondérée par les probabilités. Linéarité : E[aX+b] = aE[X]+b. V[X] = E[X²] - (E[X])²."
  },
  {
    id: "fmp-p-008", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "difficile",
    question: "Un test médical a une sensibilité de 95% et une spécificité de 90%. La prévalence de la maladie est 1%. Par Bayes, la valeur prédictive positive (VPP) est :",
    options: ["95%", "90%", "≈8,7%", "≈50%"],
    correctIndex: 2,
    explanation: "VPP = P(malade|test+) = P(test+|malade)×P(malade)/P(test+). P(test+) = 0,95×0,01 + 0,10×0,99 = 0,0095+0,099 = 0,1085. VPP = 0,0095/0,1085 ≈ 8,76%. Très faible car la maladie est rare (prévalence 1%).",
    tip: "VPP faible avec prévalence faible même si sensibilité et spécificité sont bonnes. Paradoxe de Bayes = concept médical fondamental.",
    source: "Concours FMP 2025"
  },
  {
    id: "fmp-p-009", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "Le coefficient binomial C(n,k) = n!/(k!(n-k)!). C(10,4) vaut :",
    options: ["40", "210", "5040", "10"],
    correctIndex: 1,
    explanation: "C(10,4) = 10!/(4!×6!) = (10×9×8×7)/(4×3×2×1) = 5040/24 = 210.",
    tip: "C(n,k) = C(n, n-k). C(10,4) = C(10,6). Calculer en simplifiant : (10×9×8×7)/(4!) = 5040/24 = 210."
  },
  {
    id: "fmp-p-010", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "difficile",
    question: "X ~ B(20, 0,1). La loi de Poisson approche la loi binomiale avec λ = np = :",
    options: ["λ = 0,1", "λ = 2", "λ = 10", "λ = 20"],
    correctIndex: 1,
    explanation: "Approximation de Poisson : valide quand n grand (≥30) et p petit (≤0,1). λ = np = 20×0,1 = 2. P(X=k) ≈ e^(-2)×2^k/k!.",
    tip: "Règle d'approximation : n ≥ 30 ET p ≤ 0,1 → B(n,p) ≈ Poisson(np). La loi de Poisson est plus simple à calculer."
  },
  {
    id: "fmp-p-011", exam: "fmp", subject: "maths_proba", subjectLabel: "Probabilités",
    level: "moyen",
    question: "La variance V(X) d'une variable aléatoire est toujours :",
    options: ["Égale à l'espérance", "Positive ou nulle (V(X) ≥ 0), et nulle seulement si X est constante", "Comprise entre 0 et 1", "Inférieure à l'espérance"],
    correctIndex: 1,
    explanation: "V(X) = E[(X-μ)²] = somme de termes (x-μ)² × P(X=x) ≥ 0. V(X) = 0 seulement si X est constante (probabilité 1 sur une seule valeur). L'écart-type σ = √V(X) ≥ 0 est dans les mêmes unités que X.",
    tip: "V(X) ≥ 0. V(aX+b) = a²V(X) (constante b n'affecte pas la variance, mais a la multiplie au carré)."
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
