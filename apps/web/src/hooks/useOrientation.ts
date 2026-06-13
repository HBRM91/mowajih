import { useMutation } from "@tanstack/react-query";
import { SCHOOLS, type School } from "../data/schools";

export interface SimulatePayload {
  bacTrack: string;
  generalGrade: number;
  // Core subject grades
  mathGrade?: number;
  physicsGrade?: number;
  frenchGrade?: number;
  arabicGrade?: number;
  philosophyGrade?: number;
  biologyGrade?: number;
  economicsGrade?: number;
  historyGrade?: number;
  techGrade?: number;
  englishGrade?: number;
  // Profile
  city: string;
  region: string;
  financialBracket: string;
  // Optional contact info for personalized dossier
  firstName?: string;
  lastName?: string;
  emailContact?: string;
}

export interface MatchResult {
  university_slug: string;
  probability: number;
  confidence: "high" | "medium" | "low";
  rationale: string;
  estimated_annual_cost_mad: number;
}

export interface SimulateResult {
  studentUuid: string;
  matches: MatchResult[];
  alternatives: Array<{ name: string; type: string; reason: string }>;
  suggested_tracks: string[];
}

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const TRACK_LABELS: Record<string, string> = {
  SM: "Sciences Mathématiques",
  PC: "Physique-Chimie",
  SVT: "Sciences Vie & Terre",
  SE: "Sciences Économiques",
  SH: "Sciences Humaines",
  STI: "Sciences & Tech. Industrielles",
  L: "Lettres",
};

function getMaxBudget(bracket: string): number {
  // Map monthly family income bracket → max affordable annual school fees
  if (bracket === "<<3000") return 4000;      // Only free/quasi-free public schools
  if (bracket === "3000-8000") return 25000;  // ENCG, public + affordable selective
  if (bracket === "8000-15000") return 82000; // UIR (67K), HEM (79K), Mundiapolis (35K)
  return Infinity;                             // AUI (90K), all private schools
}

function generateRationale(school: School, generalGrade: number, bacTrack: string, gradeGap: number): string {
  const trackLabel = TRACK_LABELS[bacTrack] ?? bacTrack;

  if (school.admission === "cnc") {
    const cpge = school.cpgeFilières?.[0] ?? "MP/PSI";
    if (gradeGap >= 2)
      return `Ton dossier ${trackLabel} (${generalGrade}/20) est compétitif pour intégrer une CPGE ${cpge} et décrocher le Concours National Commun. Seuil CPGE recommandé : ${school.minGrade}/20. Quasi gratuit, alumni bien placés dans l'industrie nationale.`;
    if (gradeGap >= 0)
      return `Profil dans la zone de présélection CPGE ${cpge} pour ${school.shortName} (seuil ${school.minGrade}/20). Avec un bon travail sur les 2 ans de CPGE, le CNC est atteignable. Présélection via formule N = N1 + (N2−10) + (170×N3/20) + (10×N4/25).`;
    return `${school.shortName} est ambitieux (seuil CPGE ${school.minGrade}/20, ta moyenne est ${generalGrade}/20). Vise une CPGE régionale et mise sur la progression — beaucoup comblent cet écart sur 2 ans.`;
  }

  if (school.admission === "tafem") {
    if (gradeGap >= 1)
      return `Ta moyenne (${generalGrade}/20) dépasse le seuil TAFEM de présélection pour ${school.shortName} (seuil ${school.minGrade}/20). L'épreuve TAFEM est un QCM de culture générale + maths/éco — prépare-toi bien. Formule : 75%×nationale + 25%×régionale.`;
    if (gradeGap >= 0)
      return `Tu es dans la zone de présélection TAFEM pour ${school.shortName} (seuil ${school.minGrade}/20). Mise tout sur l'épreuve TAFEM pour te démarquer. La pré-sélection utilise la formule 75%×nationale + 25%×régionale.`;
    return `Le seuil TAFEM pour ${school.shortName} est ${school.minGrade}/20. Avec ${generalGrade}/20, un excellent score à l'épreuve TAFEM et un dossier solide peuvent compenser la différence.`;
  }

  if (school.admission === "concours") {
    if (school.type === "medicine") {
      if (gradeGap >= 0)
        return `Ton profil SVT/PC (${generalGrade}/20) atteint le seuil de présélection médecine (${school.minGrade}/20 via formule 75%×nat + 25%×rég). L'admission finale dépend du concours national écrit (SVT, Physique, Chimie, Maths). Très compétitif — prépare-toi 6 mois à l'avance.`;
      return `Seuil médecine ${school.minGrade}/20. Avec ${generalGrade}/20, renforce SVT et Physique-Chimie. Le concours national est très sélectif mais des milliers de bacheliers l'obtiennent chaque année avec une bonne préparation.`;
    }
    if (school.slug === "iscae") {
      if (gradeGap >= 0)
        return `ISCAE Casablanca — la grande école de commerce publique la plus sélective du Maroc. Seuils 2025 : SE 17.24 · SGC 17.39 · SM 17.66 · SVT 18.14 · PC 18.59/20 (formule 75%×nat + 25%×rég). Ton profil ${trackLabel} est dans la zone compétitive. Concours propre : épreuve écrite + oral.`;
      return `ISCAE demande des seuils bac très élevés (SE 17.24 à PC 18.59/20 selon filière). Ton profil ${trackLabel} (${generalGrade}/20) vise plutôt l'ENCG comme alternative solide, ou une CPGE ECS pour viser ISCAE après 2 ans.`;
    }
    if (gradeGap >= 0)
      return `Concours d'accès direct depuis le bac (seuil ${school.minGrade}/20). Ton profil ${trackLabel} (${generalGrade}/20) te place dans la zone de présélection. Prépare l'épreuve spécifique de ${school.shortName}.`;
    return `Concours propre de ${school.shortName} (seuil ${school.minGrade}/20). Avec ${generalGrade}/20, la préparation rigoureuse de l'épreuve spécifique est essentielle pour compenser.`;
  }

  if (school.admission === "dossier") {
    if (school.access === "private")
      return `Admission sur dossier + entretien. ${school.shortName} valorise ton profil ${trackLabel} (${generalGrade}/20). Soigne ta lettre de motivation, mets en avant tes projets et activités. Bourses mérite disponibles — renseigne-toi !`;
    return `Admission sur dossier et entretien. Profil ${trackLabel} (${generalGrade}/20) compatible. ${school.shortName} évalue aussi les activités extrascolaires, la motivation et le projet professionnel.`;
  }

  return `Inscription ouverte sur présentation du bac validé. ${school.shortName} accueille tous les profils — démarrage rapide, insertion professionnelle directe en 2–3 ans.`;
}

function generateAlternatives(bacTrack: string, _generalGrade: number): Array<{ name: string; type: string; reason: string }> {
  const alts: Array<{ name: string; type: string; reason: string }> = [];

  if (["SM", "PC", "STI"].includes(bacTrack)) {
    alts.push({
      name: "BTS — Électrotechnique / Informatique / Génie Civil",
      type: "BTS",
      reason: "Formation technique en 2 ans au lycée (Ministère Éducation). Insertion directe dans l'industrie + passerelle Bac+3 vers ENSA/ENSAM via le système Passerelles.",
    });
    alts.push({
      name: "DUT — École Supérieure de Technologie (EST)",
      type: "EST/DUT",
      reason: "2 ans universitaires, sélection via plateforme Tawjihi (coefficients 1.0–1.5 favorables SM/STI). Passerelle vers Licence ou Cycle Ingénieur en 3ème année.",
    });
  }
  if (["SE", "SH", "L"].includes(bacTrack)) {
    alts.push({
      name: "FSJES — Faculté de Droit & Sciences Économiques (Université publique)",
      type: "Université publique",
      reason: "Accès libre sur bac, gratuit. Licence en 3 ans (Droit Privé/Public, Économie, Gestion). Débouchés : administration, entreprises, master spécialisé concurrentiel.",
    });
    alts.push({
      name: "ISTA / OFPPT — Technicien Spécialisé Gestion/Commerce",
      type: "Formation professionnelle",
      reason: "2 ans, gratuit, insertion rapide. Spécialités : comptabilité, commerce, tourisme, hôtellerie. Présent dans toutes les régions. Sélection sur dossier + proximité géographique.",
    });
  }
  if (["SVT", "PC"].includes(bacTrack)) {
    alts.push({
      name: "ISPITS — Infirmier, Kinésithérapeute, Sage-femme, Radiologue",
      type: "Santé publique",
      reason: `Licence d'État en 3 ans. Concours national (seuil 14.18–16.95/20 selon spécialité, formule 75%×nat + 25%×rég + oral). Débouchés excellents en CHU et cliniques privées.`,
    });
  }
  if (["SM", "SE", "PC", "STI"].includes(bacTrack)) {
    alts.push({
      name: "Formation à l'étranger — France, Espagne, Turquie, Canada",
      type: "International",
      reason: "Bourses ONOUSC, UM6P Double Diplomation 2026–2027, France Campus (Parcoursup). Procédures à déposer dès janvier. MEXT Japon 2027–2028 aussi disponible.",
    });
  }
  if (!alts.some(a => a.type === "International")) {
    alts.push({
      name: "Formation à l'étranger — bourses disponibles",
      type: "International",
      reason: "Bourses ONOUSC, Double Diplomation France, MEXT Japon. Renseigne-toi auprès du service des affaires étudiantes de ton université.",
    });
  }

  return alts.slice(0, 4);
}

function suggestTracks(bacTrack: string, generalGrade: number, mathGrade?: number, physicsGrade?: number): string[] {
  const tracks: string[] = [];
  const avgSci = mathGrade && physicsGrade ? (mathGrade + physicsGrade) / 2 : generalGrade;

  if (bacTrack === "SM") {
    if (generalGrade >= 16) {
      tracks.push("CPGE MP → EMI / ENSIAS / INPT / EHTP (voie CNC, top classement)");
      tracks.push("CPGE ECS → ISCAE Casablanca (gestion & finance d'élite)");
      tracks.push("UM6P — Computer Science / Data Science / Architecture (dossier + entretien, bourse 100% possible)");
    } else if (generalGrade >= 14) {
      tracks.push("CPGE PSI ou MP → Réseau ENSA (11 campus) ou ENSAM");
      tracks.push("ENCG réseau — Concours TAFEM (seuil 12/20 SM, formule 75%/25%)");
      if (avgSci >= 14) tracks.push("UM6P — College of Computing (dossier + test logique + oral)");
    } else if (generalGrade >= 12) {
      tracks.push("FST — Licence Sciences & Techniques : Informatique, Réseaux, Maths Appliquées");
      tracks.push("EMSI / UIR — Génie Informatique (direct bac, dossier + entretien)");
      tracks.push("ENCG réseau — Concours TAFEM (seuil 12/20 pour SM)");
    } else {
      tracks.push("EST — DUT Informatique de Gestion / Génie Électrique");
      tracks.push("ISTA OFPPT — Technicien Spécialisé Réseaux / Développement");
    }
  } else if (bacTrack === "PC") {
    if (generalGrade >= 14) {
      tracks.push("CPGE PC → Réseau ENSA (voie CNC). ENSAM direct bac PC : seuil 16.17/20");
      tracks.push("Faculté de Médecine & Pharmacie — concours national (seuil 12/20 en 2025, très compétitif en pratique)");
      tracks.push("ENAM Meknès — Ingénierie Agricole (seuil 15.56/20 PC, 75%×nat + 25%×rég)");
    } else if (generalGrade >= 12) {
      tracks.push("FST — Génie Chimique / Génie Biologique / Réseaux");
      tracks.push("ISPITS — Kinésithérapie / Anesthésie-Réanimation / Radiologie (seuil 14–17/20)");
      tracks.push("ESITH Casablanca — Génie Textile & Management Industriel");
    } else {
      tracks.push("EST — DUT Génie Électrique / Maintenance Industrielle");
      tracks.push("Faculté des Sciences — Licence Sciences Physiques (accès libre)");
    }
  } else if (bacTrack === "SVT") {
    if (generalGrade >= 12) {
      tracks.push("Faculté de Médecine & Pharmacie — concours national (seuil 12/20 en 2025, très compétitif en pratique)");
      tracks.push("IAV Hassan II — Agronomie / Médecine Vétérinaire / Topographie (CPGE BCPST + concours APGE)");
      tracks.push("ISPITS — Soins Infirmiers, Kinésithérapie, Sages-femmes, Radiologie");
    } else {
      tracks.push("Faculté des Sciences Biologiques (FS, accès libre sur bac SVT)");
      tracks.push("ISPITS — Soins Infirmiers Polyvalents (seuil 14.18–16.95/20)");
      tracks.push("IAV Hassan II APESA — Agronomie (dossier + test psychotechnique logique)");
    }
  } else if (bacTrack === "SE") {
    if (generalGrade >= 17.24) {
      tracks.push("ISCAE Casablanca — Grande École Commerce publique (seuil 2025 : SE 17.24 · SM 17.66 · SVT 18.14 · PC 18.59/20)");
    }
    if (generalGrade >= 12) {
      tracks.push("ENCG réseau national — Concours TAFEM (seuil 12/20 SE/SM, 16–16.5/20 autres filières)");
      tracks.push("HEM Business School — Dossier + entretien (5 campus, accréditation AACSB)");
    }
    tracks.push("FSJES — Sciences Économiques et de Gestion (accès libre, master spécialisé après)");
  } else if (["SH", "L"].includes(bacTrack)) {
    tracks.push("FSJES — Droit Public / Privé / Sciences Politiques (accès libre, prestige juridique)");
    tracks.push("FLSH — Langues, Psychologie, Sociologie, Histoire (accès libre)");
    tracks.push("ISIC Rabat — Institut Information & Communication (concours, date : 18-06-2026)");
    tracks.push("ENCG réseau — Concours TAFEM (filières SH/L éligibles)");
  } else if (bacTrack === "STI") {
    tracks.push("CPGE TSI → ENSAM / Réseau ENSA (voie CNC, seuil CPGE ≈15/20 STI)");
    tracks.push("BTS Électrotechnique / Productique Mécanique / Systèmes Électroniques");
    tracks.push("EST — DUT Génie Industriel et Maintenance / Génie Mécanique");
    tracks.push("ESITH Casablanca — Génie Textile & Industrie (admission directe bac)");
  }

  return tracks.slice(0, 4);
}

const TIER_ORDER: Record<string, number> = { elite: 0, premium: 1, selective: 2, standard: 3, accessible: 4 };

function simulateLocally(payload: SimulatePayload): SimulateResult {
  const { bacTrack, generalGrade, mathGrade, physicsGrade, financialBracket, city } = payload;
  const maxBudget = getMaxBudget(financialBracket);

  const scoredSchools = SCHOOLS.filter((school) => {
    if (!school.tracks.includes(bacTrack)) return false;
    if (maxBudget !== Infinity && school.annualCostMAD[0] > maxBudget) return false;
    return true;
  })
    .map((school) => {
      const gradeGap = generalGrade - school.minGrade;

      let probability: number;
      if (gradeGap >= 4) probability = 0.95;
      else if (gradeGap >= 3) probability = 0.88;
      else if (gradeGap >= 2) probability = 0.80;
      else if (gradeGap >= 1) probability = 0.70;
      else if (gradeGap >= 0) probability = 0.58;
      else if (gradeGap >= -1) probability = 0.42;
      else if (gradeGap >= -2) probability = 0.26;
      else if (gradeGap >= -3) probability = 0.14;
      else probability = 0.07;

      // City/proximity boost
      if (school.city === city || school.cities?.includes(city)) {
        probability = Math.min(0.97, probability + 0.05);
      }

      // Subject-grade boosts for more accurate matching
      const { biologyGrade, economicsGrade, techGrade, frenchGrade } = payload;

      // Engineering/preparatory — math+physics performance
      if (["engineering", "preparatory"].includes(school.type) && mathGrade !== undefined && physicsGrade !== undefined) {
        const avgSci = (mathGrade + physicsGrade) / 2;
        if (avgSci >= 16) probability = Math.min(0.97, probability + 0.07);
        else if (avgSci >= 14) probability = Math.min(0.95, probability + 0.03);
        else if (avgSci < 10) probability = Math.max(0.04, probability - 0.08);
      }
      // STI track → tech grade matters for ENSA/ENSAM
      if (school.type === "engineering" && bacTrack === "STI" && techGrade !== undefined) {
        if (techGrade >= 15) probability = Math.min(0.97, probability + 0.05);
        else if (techGrade < 10) probability = Math.max(0.04, probability - 0.06);
      }
      // Medicine — biology and physics are key
      if (school.type === "medicine") {
        const bioScore = biologyGrade ?? physicsGrade ?? generalGrade;
        const physScore = physicsGrade ?? generalGrade;
        const sciAvg = (bioScore + physScore) / 2;
        if (sciAvg >= 15) probability = Math.min(0.97, probability + 0.06);
        else if (sciAvg < 12) probability = Math.max(0.04, probability - 0.08);
      }
      // Business schools — economics grade for SE/SH tracks
      if (school.type === "business" && economicsGrade !== undefined) {
        if (economicsGrade >= 15) probability = Math.min(0.97, probability + 0.05);
        else if (economicsGrade < 10) probability = Math.max(0.04, probability - 0.05);
      }
      // Architecture — French/arts matters
      if (school.type === "architecture" && frenchGrade !== undefined) {
        if (frenchGrade >= 14) probability = Math.min(0.97, probability + 0.04);
      }

      probability = Math.round(probability * 100) / 100;

      const confidence: MatchResult["confidence"] =
        probability >= 0.65 ? "high" : probability >= 0.4 ? "medium" : "low";

      return {
        university_slug: school.slug,
        probability,
        confidence,
        rationale: generateRationale(school, generalGrade, bacTrack, gradeGap),
        estimated_annual_cost_mad: school.annualCostMAD[0],
        _tier: school.tier,
        _gradeGap: gradeGap,
      };
    })
    .filter((s) => s.probability >= 0.12)
    .sort((a, b) => {
      const probDiff = b.probability - a.probability;
      // If probabilities are close, prefer higher tier
      if (Math.abs(probDiff) < 0.1) {
        return (TIER_ORDER[a._tier] ?? 4) - (TIER_ORDER[b._tier] ?? 4);
      }
      return probDiff;
    })
    .slice(0, 9)
    .map(({ _tier, _gradeGap, ...rest }) => rest);

  return {
    studentUuid: generateUuid(),
    matches: scoredSchools,
    alternatives: generateAlternatives(bacTrack, generalGrade),
    suggested_tracks: suggestTracks(bacTrack, generalGrade, mathGrade, physicsGrade),
  };
}

const API_BASE = import.meta.env.VITE_API_URL ?? "https://tawjih-api.hamzaelbouhali.workers.dev";

async function saveProfileAsync(payload: SimulatePayload, result: SimulateResult): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bacTrack: payload.bacTrack,
        generalGrade: payload.generalGrade,
        mathGrade: payload.mathGrade,
        physicsGrade: payload.physicsGrade,
        frenchGrade: payload.frenchGrade,
        arabicGrade: payload.arabicGrade,
        philosophyGrade: payload.philosophyGrade,
        biologyGrade: payload.biologyGrade,
        economicsGrade: payload.economicsGrade,
        historyGrade: payload.historyGrade,
        techGrade: payload.techGrade,
        englishGrade: payload.englishGrade,
        city: payload.city,
        region: payload.region,
        financialBracket: payload.financialBracket,
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        emailContact: payload.emailContact || undefined,
        matches: result.matches,
        alternatives: result.alternatives,
        suggested_tracks: result.suggested_tracks,
      }),
    });
  } catch {
    // Fire-and-forget: profile save failure never blocks the user experience
  }
}

export function useEvaluate() {
  return useMutation({
    mutationFn: async (payload: SimulatePayload) => {
      // Brief delay so the loading state feels intentional
      await new Promise((r) => setTimeout(r, 900));
      const result = simulateLocally(payload);
      // Save to backend asynchronously — does not block navigation
      saveProfileAsync(payload, result);
      return result;
    },
  });
}
