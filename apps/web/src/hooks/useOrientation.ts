import { useMutation } from "@tanstack/react-query";
import { SCHOOLS, type School } from "../data/schools";

export interface SimulatePayload {
  bacTrack: string;
  generalGrade: number;
  // Subject grades used by local matching algorithm (biologyGrade/economicsGrade/techGrade
  // improve client-side match scores; mathGrade/physicsGrade are also accepted by the API)
  mathGrade?: number;
  physicsGrade?: number;
  biologyGrade?: number;
  economicsGrade?: number;
  techGrade?: number;
  // Profile
  city: string;
  region: string;
  financialBracket: string;
  // Optional contact info for personalized dossier
  firstName?: string;
  lastName?: string;
  emailContact?: string;
  // Language for localised output
  language?: string;
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

const TRACK_LABELS: Record<string, Record<string, string>> = {
  SM: { fr: "Sciences Mathématiques", ar: "العلوم الرياضية", en: "Mathematical Sciences" },
  PC: { fr: "Physique-Chimie", ar: "الفيزياء والكيمياء", en: "Physics-Chemistry" },
  SVT: { fr: "Sciences Vie & Terre", ar: "علوم الحياة والأرض", en: "Life & Earth Sciences" },
  SE: { fr: "Sciences Économiques", ar: "العلوم الاقتصادية", en: "Economic Sciences" },
  SH: { fr: "Sciences Humaines", ar: "العلوم الإنسانية", en: "Human Sciences" },
  STI: { fr: "Sciences & Tech. Industrielles", ar: "العلوم والتقنيات الصناعية", en: "Industrial Sciences & Technology" },
  L: { fr: "Lettres", ar: "آداب", en: "Literature" },
};

function getTrackLabel(bacTrack: string, lang: string): string {
  return TRACK_LABELS[bacTrack]?.[lang] ?? TRACK_LABELS[bacTrack]?.fr ?? bacTrack;
}

function getMaxBudget(bracket: string): number {
  if (bracket === "<<3000") return 4000;
  if (bracket === "3000-8000") return 25000;
  if (bracket === "8000-15000") return 82000;
  return Infinity;
}

function generateRationale(school: School, generalGrade: number, bacTrack: string, gradeGap: number, lang = "fr"): string {
  const tl = getTrackLabel(bacTrack, lang);

  if (school.admission === "cnc") {
    const cpge = school.cpgeFilières?.[0] ?? "MP/PSI";
    if (lang === "ar") {
      if (gradeGap >= 2) return `ملفك في ${tl} (${generalGrade}/20) تنافسي للالتحاق بـ CPGE ${cpge} واجتياز مباراة CNC. الحد الأدنى للـ CPGE: ${school.minGrade}/20. مجاني تقريباً، وخريجوه في مناصب متميزة في الصناعة الوطنية.`;
      if (gradeGap >= 0) return `ملفك ضمن منطقة الترشيح للـ CPGE ${cpge} في ${school.shortName} (الحد ${school.minGrade}/20). مع العمل الجاد خلال سنتي الأقسام التحضيرية، تصبح مباراة CNC في المتناول. الترشيح عبر صيغة: ن = ن1 + (ن2−10) + (170×ن3/20) + (10×ن4/25).`;
      return `${school.shortName} طموح (حد CPGE ${school.minGrade}/20، معدلك ${generalGrade}/20). استهدف قسماً تحضيرياً جهوياً وراهن على التطور — كثيرون يسدّون هذا الفارق خلال سنتين.`;
    }
    if (lang === "en") {
      if (gradeGap >= 2) return `Your ${tl} profile (${generalGrade}/20) is competitive for a ${cpge} CPGE and the national CNC exam. Recommended CPGE threshold: ${school.minGrade}/20. Nearly free, with alumni well-placed in national industry.`;
      if (gradeGap >= 0) return `Profile in the CPGE ${cpge} pre-selection zone for ${school.shortName} (threshold ${school.minGrade}/20). With solid work during 2 years of CPGE, the CNC is within reach. Pre-selection formula: N = N1 + (N2−10) + (170×N3/20) + (10×N4/25).`;
      return `${school.shortName} is ambitious (CPGE threshold ${school.minGrade}/20, your average is ${generalGrade}/20). Aim for a regional CPGE and count on progression — many students close this gap in 2 years.`;
    }
    // fr
    if (gradeGap >= 2) return `Ton dossier ${tl} (${generalGrade}/20) est compétitif pour intégrer une CPGE ${cpge} et décrocher le Concours National Commun. Seuil CPGE recommandé : ${school.minGrade}/20. Quasi gratuit, alumni bien placés dans l'industrie nationale.`;
    if (gradeGap >= 0) return `Profil dans la zone de présélection CPGE ${cpge} pour ${school.shortName} (seuil ${school.minGrade}/20). Avec un bon travail sur les 2 ans de CPGE, le CNC est atteignable. Présélection via formule N = N1 + (N2−10) + (170×N3/20) + (10×N4/25).`;
    return `${school.shortName} est ambitieux (seuil CPGE ${school.minGrade}/20, ta moyenne est ${generalGrade}/20). Vise une CPGE régionale et mise sur la progression — beaucoup comblent cet écart sur 2 ans.`;
  }

  if (school.admission === "tafem") {
    if (lang === "ar") {
      if (gradeGap >= 1) return `معدلك (${generalGrade}/20) يتجاوز حد الترشيح لـ TAFEM في ${school.shortName} (الحد ${school.minGrade}/20). اختبار TAFEM هو QCM في الثقافة العامة + الرياضيات/الاقتصاد — احضّر جيداً. الصيغة: 75%×وطنية + 25%×جهوية.`;
      if (gradeGap >= 0) return `أنت ضمن منطقة الترشيح لـ TAFEM في ${school.shortName} (الحد ${school.minGrade}/20). ركّز على اختبار TAFEM للتميّز. يستخدم الترشيح المسبق صيغة 75%×وطنية + 25%×جهوية.`;
      return `حد TAFEM لـ ${school.shortName} هو ${school.minGrade}/20. مع ${generalGrade}/20، نتيجة ممتازة في TAFEM وملف قوي يمكن أن يعوّضا الفارق.`;
    }
    if (lang === "en") {
      if (gradeGap >= 1) return `Your average (${generalGrade}/20) exceeds the TAFEM pre-selection threshold for ${school.shortName} (${school.minGrade}/20). TAFEM is an MCQ on general knowledge + maths/economics — prepare well. Formula: 75%×national + 25%×regional.`;
      if (gradeGap >= 0) return `You're in the TAFEM pre-selection zone for ${school.shortName} (threshold ${school.minGrade}/20). Focus on the TAFEM exam to stand out. Pre-selection uses the formula 75%×national + 25%×regional.`;
      return `The TAFEM threshold for ${school.shortName} is ${school.minGrade}/20. With ${generalGrade}/20, an excellent TAFEM score and a strong dossier can make up the difference.`;
    }
    // fr
    if (gradeGap >= 1) return `Ta moyenne (${generalGrade}/20) dépasse le seuil TAFEM de présélection pour ${school.shortName} (seuil ${school.minGrade}/20). L'épreuve TAFEM est un QCM de culture générale + maths/éco — prépare-toi bien. Formule : 75%×nationale + 25%×régionale.`;
    if (gradeGap >= 0) return `Tu es dans la zone de présélection TAFEM pour ${school.shortName} (seuil ${school.minGrade}/20). Mise tout sur l'épreuve TAFEM pour te démarquer. La pré-sélection utilise la formule 75%×nationale + 25%×régionale.`;
    return `Le seuil TAFEM pour ${school.shortName} est ${school.minGrade}/20. Avec ${generalGrade}/20, un excellent score à l'épreuve TAFEM et un dossier solide peuvent compenser la différence.`;
  }

  if (school.admission === "concours") {
    if (school.type === "medicine") {
      if (lang === "ar") {
        if (gradeGap >= 0) return `ملفك SVT/PC (${generalGrade}/20) يبلغ حد الترشيح للطب (${school.minGrade}/20 بصيغة 75%×وطني + 25%×جهوي). القبول النهائي يعتمد على المباراة الوطنية (SVT، الفيزياء، الكيمياء، الرياضيات). تنافسية جداً — احضّر 6 أشهر مسبقاً.`;
        return `حد الطب ${school.minGrade}/20. مع ${generalGrade}/20، قوّ SVT والفيزياء-كيمياء. المباراة الوطنية انتقائية جداً لكن آلاف الباكالوريا يحصلون عليها سنوياً بتحضير جيد.`;
      }
      if (lang === "en") {
        if (gradeGap >= 0) return `Your SVT/PC profile (${generalGrade}/20) meets the pre-selection threshold for medicine (${school.minGrade}/20 via 75%×national + 25%×regional). Final admission depends on the national written exam (SVT, Physics, Chemistry, Maths). Highly competitive — prepare 6 months in advance.`;
        return `Medicine threshold: ${school.minGrade}/20. With ${generalGrade}/20, strengthen SVT and Physics-Chemistry. The national exam is very selective, but thousands succeed each year with proper preparation.`;
      }
      if (gradeGap >= 0) return `Ton profil SVT/PC (${generalGrade}/20) atteint le seuil de présélection médecine (${school.minGrade}/20 via formule 75%×nat + 25%×rég). L'admission finale dépend du concours national écrit (SVT, Physique, Chimie, Maths). Très compétitif — prépare-toi 6 mois à l'avance.`;
      return `Seuil médecine ${school.minGrade}/20. Avec ${generalGrade}/20, renforce SVT et Physique-Chimie. Le concours national est très sélectif mais des milliers de bacheliers l'obtiennent chaque année avec une bonne préparation.`;
    }
    if (school.slug === "iscae") {
      if (lang === "ar") {
        if (gradeGap >= 0) return `ISCAE الدار البيضاء — أرقى مدرسة تجارية عامة في المغرب. حدود 2025 : SE 17.24 · SGC 17.39 · SM 17.66 · SVT 18.14 · PC 18.59/20 (صيغة 75%×وطنية + 25%×جهوية). ملفك في ${tl} ضمن المنطقة التنافسية. مباراة خاصة: اختبار كتابي + شفوي.`;
        return `ISCAE يشترط حدوداً مرتفعة جداً (SE 17.24 إلى PC 18.59/20 حسب الفرع). ملفك ${tl} (${generalGrade}/20) يستهدف ENCG كبديل قوي، أو CPGE ECS للوصول إلى ISCAE بعد سنتين.`;
      }
      if (lang === "en") {
        if (gradeGap >= 0) return `ISCAE Casablanca — Morocco's most selective public business school. 2025 thresholds: SE 17.24 · SGC 17.39 · SM 17.66 · SVT 18.14 · PC 18.59/20 (formula 75%×national + 25%×regional). Your ${tl} profile is in the competitive zone. Entrance exam: written + oral.`;
        return `ISCAE requires very high thresholds (SE 17.24 to PC 18.59/20 by track). Your ${tl} profile (${generalGrade}/20) is better suited for ENCG as a solid alternative, or CPGE ECS to aim for ISCAE after 2 years.`;
      }
      if (gradeGap >= 0) return `ISCAE Casablanca — la grande école de commerce publique la plus sélective du Maroc. Seuils 2025 : SE 17.24 · SGC 17.39 · SM 17.66 · SVT 18.14 · PC 18.59/20 (formule 75%×nat + 25%×rég). Ton profil ${tl} est dans la zone compétitive. Concours propre : épreuve écrite + oral.`;
      return `ISCAE demande des seuils bac très élevés (SE 17.24 à PC 18.59/20 selon filière). Ton profil ${tl} (${generalGrade}/20) vise plutôt l'ENCG comme alternative solide, ou une CPGE ECS pour viser ISCAE après 2 ans.`;
    }
    if (lang === "ar") {
      if (gradeGap >= 0) return `مباراة دخول مباشر من الباكالوريا (الحد ${school.minGrade}/20). ملفك ${tl} (${generalGrade}/20) يضعك في منطقة الترشيح. احضّر الاختبار الخاص بـ ${school.shortName}.`;
      return `مباراة ${school.shortName} (الحد ${school.minGrade}/20). مع ${generalGrade}/20، التحضير الدقيق للاختبار الخاص ضروري للتعويض.`;
    }
    if (lang === "en") {
      if (gradeGap >= 0) return `Direct entry exam from baccalaureate (threshold ${school.minGrade}/20). Your ${tl} profile (${generalGrade}/20) places you in the pre-selection zone. Prepare the specific exam for ${school.shortName}.`;
      return `${school.shortName} own entrance exam (threshold ${school.minGrade}/20). With ${generalGrade}/20, rigorous preparation of the specific exam is essential to compensate.`;
    }
    if (gradeGap >= 0) return `Concours d'accès direct depuis le bac (seuil ${school.minGrade}/20). Ton profil ${tl} (${generalGrade}/20) te place dans la zone de présélection. Prépare l'épreuve spécifique de ${school.shortName}.`;
    return `Concours propre de ${school.shortName} (seuil ${school.minGrade}/20). Avec ${generalGrade}/20, la préparation rigoureuse de l'épreuve spécifique est essentielle pour compenser.`;
  }

  if (school.admission === "dossier") {
    if (lang === "ar") {
      if (school.access === "private") return `قبول بالملف + مقابلة. ${school.shortName} يقدّر ملفك في ${tl} (${generalGrade}/20). أتقن رسالة الدوافع وأبرز مشاريعك وأنشطتك. منح الاستحقاق متاحة — استفسر!`;
      return `قبول بالملف والمقابلة. ملف ${tl} (${generalGrade}/20) متوافق. ${school.shortName} يقيّم أيضاً الأنشطة خارج المدرسة والدوافع والمشروع المهني.`;
    }
    if (lang === "en") {
      if (school.access === "private") return `Admission by application + interview. ${school.shortName} values your ${tl} profile (${generalGrade}/20). Polish your motivation letter and highlight your projects and activities. Merit scholarships available — ask about them!`;
      return `Admission by application and interview. ${tl} profile (${generalGrade}/20) compatible. ${school.shortName} also evaluates extracurricular activities, motivation, and professional project.`;
    }
    if (school.access === "private") return `Admission sur dossier + entretien. ${school.shortName} valorise ton profil ${tl} (${generalGrade}/20). Soigne ta lettre de motivation, mets en avant tes projets et activités. Bourses mérite disponibles — renseigne-toi !`;
    return `Admission sur dossier et entretien. Profil ${tl} (${generalGrade}/20) compatible. ${school.shortName} évalue aussi les activités extrascolaires, la motivation et le projet professionnel.`;
  }

  if (lang === "ar") return `التسجيل مفتوح عند تقديم الباكالوريا المصادق عليها. ${school.shortName} يستقبل جميع الملفات — انطلاق سريع، إدماج مهني مباشر في 2-3 سنوات.`;
  if (lang === "en") return `Open enrollment upon presentation of validated baccalaureate. ${school.shortName} welcomes all profiles — quick start, direct professional integration in 2–3 years.`;
  return `Inscription ouverte sur présentation du bac validé. ${school.shortName} accueille tous les profils — démarrage rapide, insertion professionnelle directe en 2–3 ans.`;
}

function generateAlternatives(bacTrack: string, _generalGrade: number, lang = "fr"): Array<{ name: string; type: string; reason: string }> {
  const alts: Array<{ name: string; type: string; reason: string }> = [];

  if (["SM", "PC", "STI"].includes(bacTrack)) {
    if (lang === "ar") {
      alts.push({ name: "BTS — كهربوتقنية / إعلاميات / هندسة مدنية", type: "BTS", reason: "تكوين تقني لمدة سنتين في الثانوية (وزارة التربية). إدماج مباشر في الصناعة + جسر نحو بكالوريوس في ENSA/ENSAM عبر نظام المسالك." });
      alts.push({ name: "DUT — المدرسة العليا للتكنولوجيا (EST)", type: "EST/DUT", reason: "سنتان جامعيتان، الانتقاء عبر منصة توجيهي (معاملات 1.0-1.5 ملائمة لـ SM/STI). جسر نحو الإجازة أو دورة المهندس في السنة الثالثة." });
    } else if (lang === "en") {
      alts.push({ name: "BTS — Electrical Engineering / Computer Science / Civil Engineering", type: "BTS", reason: "2-year technical program (Ministry of Education). Direct industry integration + pathway to Bachelor's at ENSA/ENSAM via bridge system." });
      alts.push({ name: "DUT — École Supérieure de Technologie (EST)", type: "EST/DUT", reason: "2 university years, selection via Tawjihi platform (coefficients 1.0–1.5 favorable for SM/STI). Pathway to Bachelor's or Engineering cycle in 3rd year." });
    } else {
      alts.push({ name: "BTS — Électrotechnique / Informatique / Génie Civil", type: "BTS", reason: "Formation technique en 2 ans au lycée (Ministère Éducation). Insertion directe dans l'industrie + passerelle Bac+3 vers ENSA/ENSAM via le système Passerelles." });
      alts.push({ name: "DUT — École Supérieure de Technologie (EST)", type: "EST/DUT", reason: "2 ans universitaires, sélection via plateforme Tawjihi (coefficients 1.0–1.5 favorables SM/STI). Passerelle vers Licence ou Cycle Ingénieur en 3ème année." });
    }
  }
  if (["SE", "SH", "L"].includes(bacTrack)) {
    if (lang === "ar") {
      alts.push({ name: "FSJES — كلية الحقوق والعلوم الاقتصادية (جامعة عامة)", type: "جامعة عامة", reason: "ولوج حر عند الباكالوريا، مجاني. إجازة في 3 سنوات (قانون خاص/عام، اقتصاد، تسيير). فرص: إدارة، مقاولات، ماستر متخصص تنافسي." });
      alts.push({ name: "ISTA / OFPPT — تقني متخصص تسيير/تجارة", type: "تكوين مهني", reason: "سنتان، مجاني، إدماج سريع. تخصصات: محاسبة، تجارة، سياحة، فندقة. متاح في جميع الجهات. الانتقاء بالملف + القرب الجغرافي." });
    } else if (lang === "en") {
      alts.push({ name: "FSJES — Faculty of Law & Economic Sciences (Public University)", type: "Public University", reason: "Open access with baccalaureate, free. Bachelor's in 3 years (Law, Economics, Management). Careers: administration, business, competitive specialized Master's." });
      alts.push({ name: "ISTA / OFPPT — Specialized Technician in Management/Commerce", type: "Vocational Training", reason: "2 years, free, fast integration. Specialties: accounting, commerce, tourism, hospitality. Available in all regions. Selection by application + proximity." });
    } else {
      alts.push({ name: "FSJES — Faculté de Droit & Sciences Économiques (Université publique)", type: "Université publique", reason: "Accès libre sur bac, gratuit. Licence en 3 ans (Droit Privé/Public, Économie, Gestion). Débouchés : administration, entreprises, master spécialisé concurrentiel." });
      alts.push({ name: "ISTA / OFPPT — Technicien Spécialisé Gestion/Commerce", type: "Formation professionnelle", reason: "2 ans, gratuit, insertion rapide. Spécialités : comptabilité, commerce, tourisme, hôtellerie. Présent dans toutes les régions. Sélection sur dossier + proximité géographique." });
    }
  }
  if (["SVT", "PC"].includes(bacTrack)) {
    if (lang === "ar") {
      alts.push({ name: "ISPITS — ممرض، معالج فيزيائي، قابلة، مختص في الأشعة", type: "صحة عامة", reason: "إجازة دولة في 3 سنوات. مباراة وطنية (حد 14.18-16.95/20 حسب التخصص، صيغة 75%×وطني + 25%×جهوي + شفوي). فرص ممتازة في المستشفيات والعيادات الخاصة." });
    } else if (lang === "en") {
      alts.push({ name: "ISPITS — Nurse, Physiotherapist, Midwife, Radiologist", type: "Public Health", reason: "3-year state degree. National entrance exam (threshold 14.18–16.95/20 by specialty, formula 75%×national + 25%×regional + oral). Excellent career opportunities." });
    } else {
      alts.push({ name: "ISPITS — Infirmier, Kinésithérapeute, Sage-femme, Radiologue", type: "Santé publique", reason: `Licence d'État en 3 ans. Concours national (seuil 14.18–16.95/20 selon spécialité, formule 75%×nat + 25%×rég + oral). Débouchés excellents en CHU et cliniques privées.` });
    }
  }
  if (["SM", "SE", "PC", "STI"].includes(bacTrack)) {
    if (lang === "ar") {
      alts.push({ name: "تكوين بالخارج — فرنسا، إسبانيا، تركيا، كندا", type: "دولي", reason: "منح ONOUSC، دبلوم مزدوج UM6P 2026-2027، France Campus (Parcoursup). تودَع الملفات منذ يناير. منح MEXT اليابان 2027-2028 أيضاً متاحة." });
    } else if (lang === "en") {
      alts.push({ name: "Studies Abroad — France, Spain, Turkey, Canada", type: "International", reason: "ONOUSC grants, UM6P Double Degree 2026–2027, France Campus (Parcoursup). Applications from January. MEXT Japan 2027–2028 also available." });
    } else {
      alts.push({ name: "Formation à l'étranger — France, Espagne, Turquie, Canada", type: "International", reason: "Bourses ONOUSC, UM6P Double Diplomation 2026–2027, France Campus (Parcoursup). Procédures à déposer dès janvier. MEXT Japon 2027–2028 aussi disponible." });
    }
  }
  if (!alts.some(a => a.type === "International" || a.type === "دولي")) {
    if (lang === "ar") {
      alts.push({ name: "تكوين بالخارج — منح متاحة", type: "دولي", reason: "منح ONOUSC، دبلوم مزدوج مع فرنسا، منح MEXT اليابان. استفسر لدى مصلحة الشؤون الطلابية في جامعتك." });
    } else if (lang === "en") {
      alts.push({ name: "Studies Abroad — grants available", type: "International", reason: "ONOUSC grants, Double Degree with France, MEXT Japan. Ask your university's student affairs office." });
    } else {
      alts.push({ name: "Formation à l'étranger — bourses disponibles", type: "International", reason: "Bourses ONOUSC, Double Diplomation France, MEXT Japon. Renseigne-toi auprès du service des affaires étudiantes de ton université." });
    }
  }

  return alts.slice(0, 4);
}

function suggestTracks(bacTrack: string, generalGrade: number, mathGrade?: number, physicsGrade?: number, lang = "fr"): string[] {
  const tracks: string[] = [];
  const avgSci = mathGrade && physicsGrade ? (mathGrade + physicsGrade) / 2 : generalGrade;

  if (bacTrack === "SM") {
    if (generalGrade >= 16) {
      if (lang === "ar") {
        tracks.push("CPGE MP → EMI / ENSIAS / INPT / EHTP (مسار CNC، أعلى تصنيف)");
        tracks.push("CPGE ECS → ISCAE الدار البيضاء (إدارة ومالية نخبة)");
        tracks.push("UM6P — علوم الحاسوب / علوم البيانات / هندسة معمارية (ملف + مقابلة، منحة 100% ممكنة)");
      } else if (lang === "en") {
        tracks.push("CPGE MP → EMI / ENSIAS / INPT / EHTP (CNC track, top ranking)");
        tracks.push("CPGE ECS → ISCAE Casablanca (elite management & finance)");
        tracks.push("UM6P — Computer Science / Data Science / Architecture (application + interview, 100% scholarship possible)");
      } else {
        tracks.push("CPGE MP → EMI / ENSIAS / INPT / EHTP (voie CNC, top classement)");
        tracks.push("CPGE ECS → ISCAE Casablanca (gestion & finance d'élite)");
        tracks.push("UM6P — Computer Science / Data Science / Architecture (dossier + entretien, bourse 100% possible)");
      }
    } else if (generalGrade >= 14) {
      if (lang === "ar") {
        tracks.push("CPGE PSI أو MP → شبكة ENSA (11 حرماً) أو ENSAM");
        tracks.push("شبكة ENCG — مباراة TAFEM (حد 12/20 SM، صيغة 75%/25%)");
        if (avgSci >= 14) tracks.push("UM6P — كلية الحوسبة (ملف + اختبار منطق + شفوي)");
      } else if (lang === "en") {
        tracks.push("CPGE PSI or MP → ENSA network (11 campuses) or ENSAM");
        tracks.push("ENCG network — TAFEM exam (threshold 12/20 SM, formula 75%/25%)");
        if (avgSci >= 14) tracks.push("UM6P — College of Computing (application + logic test + oral)");
      } else {
        tracks.push("CPGE PSI ou MP → Réseau ENSA (11 campus) ou ENSAM");
        tracks.push("ENCG réseau — Concours TAFEM (seuil 12/20 SM, formule 75%/25%)");
        if (avgSci >= 14) tracks.push("UM6P — College of Computing (dossier + test logique + oral)");
      }
    } else if (generalGrade >= 12) {
      if (lang === "ar") {
        tracks.push("FST — إجازة علوم وتقنيات: إعلاميات، شبكات، رياضيات تطبيقية");
        tracks.push("EMSI / UIR — هندسة المعلوميات (مباشر من الباك، ملف + مقابلة)");
        tracks.push("شبكة ENCG — مباراة TAFEM (حد 12/20 لـ SM)");
      } else if (lang === "en") {
        tracks.push("FST — Bachelor Science & Technology: Computer Science, Networks, Applied Maths");
        tracks.push("EMSI / UIR — Computer Engineering (direct from bac, application + interview)");
        tracks.push("ENCG network — TAFEM exam (threshold 12/20 for SM)");
      } else {
        tracks.push("FST — Licence Sciences & Techniques : Informatique, Réseaux, Maths Appliquées");
        tracks.push("EMSI / UIR — Génie Informatique (direct bac, dossier + entretien)");
        tracks.push("ENCG réseau — Concours TAFEM (seuil 12/20 pour SM)");
      }
    } else {
      if (lang === "ar") {
        tracks.push("EST — DUT إعلاميات التسيير / الهندسة الكهربائية");
        tracks.push("ISTA OFPPT — تقني متخصص شبكات / تطوير");
      } else if (lang === "en") {
        tracks.push("EST — DUT Management Computing / Electrical Engineering");
        tracks.push("ISTA OFPPT — Specialized Technician Networks / Development");
      } else {
        tracks.push("EST — DUT Informatique de Gestion / Génie Électrique");
        tracks.push("ISTA OFPPT — Technicien Spécialisé Réseaux / Développement");
      }
    }
  } else if (bacTrack === "PC") {
    if (generalGrade >= 14) {
      if (lang === "ar") {
        tracks.push("CPGE PC → شبكة ENSA (مسار CNC). ENSAM مباشر من باك PC: حد 16.17/20");
        tracks.push("كلية الطب والصيدلة — مباراة وطنية (حد 12/20 سنة 2025، تنافسية جداً عملياً)");
        tracks.push("ENAM مكناس — هندسة زراعية (حد 15.56/20 PC، 75%×وطني + 25%×جهوي)");
      } else if (lang === "en") {
        tracks.push("CPGE PC → ENSA network (CNC track). ENSAM direct bac PC: threshold 16.17/20");
        tracks.push("Faculty of Medicine & Pharmacy — national exam (threshold 12/20 in 2025, very competitive in practice)");
        tracks.push("ENAM Meknès — Agricultural Engineering (threshold 15.56/20 PC, 75%×national + 25%×regional)");
      } else {
        tracks.push("CPGE PC → Réseau ENSA (voie CNC). ENSAM direct bac PC : seuil 16.17/20");
        tracks.push("Faculté de Médecine & Pharmacie — concours national (seuil 12/20 en 2025, très compétitif en pratique)");
        tracks.push("ENAM Meknès — Ingénierie Agricole (seuil 15.56/20 PC, 75%×nat + 25%×rég)");
      }
    } else if (generalGrade >= 12) {
      if (lang === "ar") {
        tracks.push("FST — هندسة كيميائية / هندسة بيولوجية / شبكات");
        tracks.push("ISPITS — كينيزيتيرابي / تخدير وإنعاش / أشعة (حد 14-17/20)");
        tracks.push("ESITH الدار البيضاء — هندسة النسيج والتدبير الصناعي");
      } else if (lang === "en") {
        tracks.push("FST — Chemical Engineering / Biological Engineering / Networks");
        tracks.push("ISPITS — Physiotherapy / Anesthesia-Resuscitation / Radiology (threshold 14–17/20)");
        tracks.push("ESITH Casablanca — Textile Engineering & Industrial Management");
      } else {
        tracks.push("FST — Génie Chimique / Génie Biologique / Réseaux");
        tracks.push("ISPITS — Kinésithérapie / Anesthésie-Réanimation / Radiologie (seuil 14–17/20)");
        tracks.push("ESITH Casablanca — Génie Textile & Management Industriel");
      }
    } else {
      if (lang === "ar") {
        tracks.push("EST — DUT الهندسة الكهربائية / الصيانة الصناعية");
        tracks.push("كلية العلوم — إجازة علوم فيزيائية (ولوج حر)");
      } else if (lang === "en") {
        tracks.push("EST — DUT Electrical Engineering / Industrial Maintenance");
        tracks.push("Faculty of Sciences — Bachelor Physical Sciences (open access)");
      } else {
        tracks.push("EST — DUT Génie Électrique / Maintenance Industrielle");
        tracks.push("Faculté des Sciences — Licence Sciences Physiques (accès libre)");
      }
    }
  } else if (bacTrack === "SVT") {
    if (generalGrade >= 12) {
      if (lang === "ar") {
        tracks.push("كلية الطب والصيدلة — مباراة وطنية (حد 12/20 سنة 2025، تنافسية جداً عملياً)");
        tracks.push("IAV حسن الثاني — زراعة / طب بيطري / طوبوغرافيا (CPGE BCPST + مباراة APGE)");
        tracks.push("ISPITS — تمريض، كينيزيتيرابي، قبالة، أشعة");
      } else if (lang === "en") {
        tracks.push("Faculty of Medicine & Pharmacy — national exam (threshold 12/20 in 2025, very competitive in practice)");
        tracks.push("IAV Hassan II — Agronomy / Veterinary Medicine / Topography (CPGE BCPST + APGE exam)");
        tracks.push("ISPITS — Nursing, Physiotherapy, Midwifery, Radiology");
      } else {
        tracks.push("Faculté de Médecine & Pharmacie — concours national (seuil 12/20 en 2025, très compétitif en pratique)");
        tracks.push("IAV Hassan II — Agronomie / Médecine Vétérinaire / Topographie (CPGE BCPST + concours APGE)");
        tracks.push("ISPITS — Soins Infirmiers, Kinésithérapie, Sages-femmes, Radiologie");
      }
    } else {
      if (lang === "ar") {
        tracks.push("كلية العلوم البيولوجية (FS، ولوج حر لباك SVT)");
        tracks.push("ISPITS — تمريض متعدد التخصصات (حد 14.18-16.95/20)");
        tracks.push("IAV حسن الثاني APESA — زراعة (ملف + اختبار نفسي تقني)");
      } else if (lang === "en") {
        tracks.push("Faculty of Biological Sciences (FS, open access for SVT bac)");
        tracks.push("ISPITS — Polyvalent Nursing (threshold 14.18–16.95/20)");
        tracks.push("IAV Hassan II APESA — Agronomy (application + psychotechnical logic test)");
      } else {
        tracks.push("Faculté des Sciences Biologiques (FS, accès libre sur bac SVT)");
        tracks.push("ISPITS — Soins Infirmiers Polyvalents (seuil 14.18–16.95/20)");
        tracks.push("IAV Hassan II APESA — Agronomie (dossier + test psychotechnique logique)");
      }
    }
  } else if (bacTrack === "SE") {
    if (generalGrade >= 17.24) {
      if (lang === "ar") tracks.push("ISCAE الدار البيضاء — أرقى مدرسة تجارية عامة (حدود 2025: SE 17.24 · SM 17.66 · SVT 18.14 · PC 18.59/20)");
      else if (lang === "en") tracks.push("ISCAE Casablanca — Top public business school (2025 thresholds: SE 17.24 · SM 17.66 · SVT 18.14 · PC 18.59/20)");
      else tracks.push("ISCAE Casablanca — Grande École Commerce publique (seuil 2025 : SE 17.24 · SM 17.66 · SVT 18.14 · PC 18.59/20)");
    }
    if (generalGrade >= 12) {
      if (lang === "ar") {
        tracks.push("شبكة ENCG الوطنية — مباراة TAFEM (حد 12/20 SE/SM، 16-16.5/20 للفروع الأخرى)");
        tracks.push("HEM Business School — ملف + مقابلة (5 حرم جامعي، اعتماد AACSB)");
      } else if (lang === "en") {
        tracks.push("ENCG national network — TAFEM exam (threshold 12/20 SE/SM, 16–16.5/20 other tracks)");
        tracks.push("HEM Business School — Application + interview (5 campuses, AACSB accreditation)");
      } else {
        tracks.push("ENCG réseau national — Concours TAFEM (seuil 12/20 SE/SM, 16–16.5/20 autres filières)");
        tracks.push("HEM Business School — Dossier + entretien (5 campus, accréditation AACSB)");
      }
    }
    if (lang === "ar") tracks.push("FSJES — العلوم الاقتصادية والتدبير (ولوج حر، ماستر متخصص بعده)");
    else if (lang === "en") tracks.push("FSJES — Economics & Management Sciences (open access, specialized Master's after)");
    else tracks.push("FSJES — Sciences Économiques et de Gestion (accès libre, master spécialisé après)");
  } else if (["SH", "L"].includes(bacTrack)) {
    if (lang === "ar") {
      tracks.push("FSJES — قانون عام / خاص / علوم سياسية (ولوج حر، مكانة قانونية رفيعة)");
      tracks.push("FLSH — لغات، علم النفس، علم الاجتماع، تاريخ (ولوج حر)");
      tracks.push("ISIC الرباط — معهد الإعلام والتواصل (مباراة، تاريخ: 18-06-2026)");
      tracks.push("شبكة ENCG — مباراة TAFEM (فروع SH/L مؤهلة)");
    } else if (lang === "en") {
      tracks.push("FSJES — Public/Private Law / Political Sciences (open access, legal prestige)");
      tracks.push("FLSH — Languages, Psychology, Sociology, History (open access)");
      tracks.push("ISIC Rabat — Information & Communication Institute (entrance exam, date: 18-06-2026)");
      tracks.push("ENCG network — TAFEM exam (SH/L tracks eligible)");
    } else {
      tracks.push("FSJES — Droit Public / Privé / Sciences Politiques (accès libre, prestige juridique)");
      tracks.push("FLSH — Langues, Psychologie, Sociologie, Histoire (accès libre)");
      tracks.push("ISIC Rabat — Institut Information & Communication (concours, date : 18-06-2026)");
      tracks.push("ENCG réseau — Concours TAFEM (filières SH/L éligibles)");
    }
  } else if (bacTrack === "STI") {
    if (lang === "ar") {
      tracks.push("CPGE TSI → ENSAM / شبكة ENSA (مسار CNC، حد CPGE ≈15/20 STI)");
      tracks.push("BTS كهربوتقنية / إنتاجية ميكانيكية / أنظمة إلكترونية");
      tracks.push("EST — DUT الهندسة الصناعية والصيانة / الهندسة الميكانيكية");
      tracks.push("ESITH الدار البيضاء — هندسة النسيج والصناعة (قبول مباشر من الباك)");
    } else if (lang === "en") {
      tracks.push("CPGE TSI → ENSAM / ENSA network (CNC track, CPGE threshold ≈15/20 STI)");
      tracks.push("BTS Electrical Engineering / Mechanical Production / Electronic Systems");
      tracks.push("EST — DUT Industrial Engineering & Maintenance / Mechanical Engineering");
      tracks.push("ESITH Casablanca — Textile & Industrial Engineering (direct bac admission)");
    } else {
      tracks.push("CPGE TSI → ENSAM / Réseau ENSA (voie CNC, seuil CPGE ≈15/20 STI)");
      tracks.push("BTS Électrotechnique / Productique Mécanique / Systèmes Électroniques");
      tracks.push("EST — DUT Génie Industriel et Maintenance / Génie Mécanique");
      tracks.push("ESITH Casablanca — Génie Textile & Industrie (admission directe bac)");
    }
  }

  return tracks.slice(0, 4);
}

const TIER_ORDER: Record<string, number> = { elite: 0, premium: 1, selective: 2, standard: 3, accessible: 4 };

function simulateLocally(payload: SimulatePayload): SimulateResult {
  const { bacTrack, generalGrade, mathGrade, physicsGrade, financialBracket, city } = payload;
  const lang = payload.language ?? "fr";
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
      const { biologyGrade, economicsGrade, techGrade } = payload;

      if (["engineering", "preparatory"].includes(school.type) && mathGrade !== undefined && physicsGrade !== undefined) {
        const avgSci = (mathGrade + physicsGrade) / 2;
        if (avgSci >= 16) probability = Math.min(0.97, probability + 0.07);
        else if (avgSci >= 14) probability = Math.min(0.95, probability + 0.03);
        else if (avgSci < 10) probability = Math.max(0.04, probability - 0.08);
      }
      if (school.type === "engineering" && bacTrack === "STI" && techGrade !== undefined) {
        if (techGrade >= 15) probability = Math.min(0.97, probability + 0.05);
        else if (techGrade < 10) probability = Math.max(0.04, probability - 0.06);
      }
      if (school.type === "medicine") {
        const bioScore = biologyGrade ?? physicsGrade ?? generalGrade;
        const physScore = physicsGrade ?? generalGrade;
        const sciAvg = (bioScore + physScore) / 2;
        if (sciAvg >= 15) probability = Math.min(0.97, probability + 0.06);
        else if (sciAvg < 12) probability = Math.max(0.04, probability - 0.08);
      }
      if (school.type === "business" && economicsGrade !== undefined) {
        if (economicsGrade >= 15) probability = Math.min(0.97, probability + 0.05);
        else if (economicsGrade < 10) probability = Math.max(0.04, probability - 0.05);
      }

      probability = Math.round(probability * 100) / 100;

      const confidence: MatchResult["confidence"] =
        probability >= 0.65 ? "high" : probability >= 0.4 ? "medium" : "low";

      return {
        university_slug: school.slug,
        probability,
        confidence,
        rationale: generateRationale(school, generalGrade, bacTrack, gradeGap, lang),
        estimated_annual_cost_mad: school.annualCostMAD[0],
        _tier: school.tier,
        _gradeGap: gradeGap,
      };
    })
    .filter((s) => s.probability >= 0.12)
    .sort((a, b) => {
      const probDiff = b.probability - a.probability;
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
    alternatives: generateAlternatives(bacTrack, generalGrade, lang),
    suggested_tracks: suggestTracks(bacTrack, generalGrade, mathGrade, physicsGrade, lang),
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
      await new Promise((r) => setTimeout(r, 900));
      const result = simulateLocally(payload);
      saveProfileAsync(payload, result);
      return result;
    },
  });
}
