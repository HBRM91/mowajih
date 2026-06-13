import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";

interface Message {
  role: "user" | "slimane";
  content: string;
  quickReplies?: string[];
  timestamp?: Date;
}

type Lang = "fr" | "ar" | "en";

// ── Inline markdown renderer ────────────────────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-navy-900">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <div key={key++} className="space-y-1.5 my-1 ps-1">
        {listBuffer.map((item, li) => {
          const isArrow = item.startsWith("→ ");
          const isCheck = item.startsWith("✅ ");
          const content = item.replace(/^(→|•|✅|❌|-) /, "");
          return (
            <div key={li} className="flex items-start gap-2">
              <span className={`shrink-0 font-bold mt-px ${isArrow ? "text-gold-600" : isCheck ? "text-emerald-600" : "text-navy-400"}`}>
                {isArrow ? "→" : isCheck ? "✅" : "·"}
              </span>
              <span className="text-sm leading-snug">{parseInline(content)}</span>
            </div>
          );
        })}
      </div>
    );
    listBuffer = [];
  };

  for (const line of lines) {
    if (/^(→|•|✅|❌|-) /.test(line)) {
      listBuffer.push(line);
    } else {
      flushList();
      if (line.trim() === "") {
        nodes.push(<div key={key++} className="h-1.5" />);
      } else {
        nodes.push(
          <p key={key++} className="text-sm leading-relaxed">{parseInline(line)}</p>
        );
      }
    }
  }
  flushList();

  return <div className="space-y-0.5">{nodes}</div>;
}

// ── Slimane avatar ──────────────────────────────────────────────────────────
const SlimaneAvatar = ({ mood = "happy", size = "md" }: { mood?: string; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  return (
    <div className={`relative ${sizeClass} rounded-full flex-shrink-0 shadow-lg transition-all ${
      mood === "thinking" ? "animate-pulse ring-2 ring-amber-400/50" : "ring-2 ring-gold-400/40"
    }`}>
      <img
        src="/images/slimane-avatar.jpeg"
        alt="Slimane"
        className="w-full h-full rounded-full object-cover object-top"
      />
      {mood === "happy" && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-cream flex items-center justify-center">
          <span className="text-[7px] text-white font-bold">✓</span>
        </div>
      )}
      {mood === "thinking" && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-cream" />
      )}
    </div>
  );
};

// ── Multilingual response engine ─────────────────────────────────────────────
function tx(lang: Lang, fr: string, ar: string, en: string) {
  if (lang === "ar") return ar;
  if (lang === "en") return en;
  return fr;
}
function qx(lang: Lang, fr: string[], ar: string[], en: string[]): string[] {
  if (lang === "ar") return ar;
  if (lang === "en") return en;
  return fr;
}

function getInitialGreeting(lang: Lang): { text: string; quickReplies: string[] } {
  return {
    text: tx(
      lang,
      "Bonjour ! Je suis Slimane, conseiller académique IA spécialisé dans l'enseignement supérieur au Maroc. Je connais toutes les écoles — ENSA, ENCG, EMI, EHTP, UM6P, UIR, HEM, médecine et bien plus.\n\nPose-moi n'importe quelle question sur ton orientation ou lance le questionnaire pour un matching personnalisé.",
      "مرحباً ! أنا سليمان، مستشار أكاديمي متخصص في التعليم العالي بالمغرب. أعرف جميع المؤسسات — ENSA، ENCG، EMI، EHTP، UM6P، UIR، HEM، كلية الطب وغيرها.\n\nاطرح علي أي سؤال حول توجيهك الدراسي، أو أجرِ الاستبيان للحصول على توصيات مخصصة.",
      "Hello! I'm Slimane, an AI academic advisor specialising in higher education in Morocco. I know every institution — ENSA, ENCG, EMI, EHTP, UM6P, UIR, HEM, medicine and more.\n\nAsk me anything about your orientation, or take the questionnaire for a personalised match."
    ),
    quickReplies: qx(
      lang,
      ["Je suis Bac SM/PC", "Je veux faire médecine", "Écoles à Casablanca", "Passer le questionnaire"],
      ["شعبة علوم رياضية / فيزيائية", "أريد دراسة الطب", "مدارس في الدار البيضاء", "إجراء الاستبيان"],
      ["I'm Bac SM/PC", "I want to study medicine", "Schools in Casablanca", "Take the questionnaire"]
    ),
  };
}

function generateSlimaneReply(userText: string, lang: Lang): { text: string; quickReplies?: string[] } {
  const lower = userText.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const raw = userText; // for Arabic detection

  // Questionnaire
  if (/(questionnaire|formulaire|commencer|demarrer|start|استبيان|ابدأ|لبدأ)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Super ! Le questionnaire prend 2 minutes et me permet de faire un matching précis avec les établissements marocains. Tu gagneras aussi des XP en cours de route.",
        "ممتاز ! يستغرق الاستبيان دقيقتين فقط ويُمكّنني من إيجاد أفضل المؤسسات المناسبة لملفك. ستكسب نقاطاً في الطريق أيضاً.",
        "Great! The questionnaire takes 2 minutes and lets me match you precisely with Moroccan institutions. You'll also earn XP along the way."
      ),
      quickReplies: qx(lang,
        ["C'est parti !", "Combien de temps ça prend ?"],
        ["هيا نبدأ !", "كم من الوقت يستغرق ؟"],
        ["Let's go!", "How long does it take?"]
      ),
    };
  }

  // Bac SM
  if (/(bac sm|sciences math|mathematiques|علوم رياضية|رياضيات بكالوريا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Le Bac SM ouvre les portes des meilleures filières scientifiques et d'ingénierie.\n\n**Voie élite — CPGE puis concours CNC :**\n→ EMI, EHTP, ENSIAS, INPT, ENIM (gratuites ou quasi gratuites)\n→ 2 ans de classes préparatoires MP ou PSI, puis la mbaraâ CNC\n→ Seuil d'entrée en CPGE : mention Assez Bien minimum\n\n**Voie directe via Tawjihi :**\n→ ENSA (11 campus, seuil SM 12/20, gratuit)\n→ ENSAM (seuil SM 12.25/20, frais ~50 000 MAD/an)\n→ ISCAE (seuil SM 17.66/20, quasi gratuit)\n→ ENCG (seuil SM 12/20, quasi gratuit)\n\nLes quick replies ci-dessous t'orientent selon ta mention.",
        "بكالوريا العلوم الرياضية تفتح أبواب أفضل التخصصات العلمية والهندسية.\n\n**المسار النخبوي — أقسام تحضيرية ثم مباراة CNC :**\n→ EMI، EHTP، ENSIAS، INPT، ENIM (مجانية أو شبه مجانية)\n→ سنتان تحضيريتان (MP أو PSI)، ثم المباراة الوطنية المشتركة CNC\n→ عتبة الدخول للأقسام التحضيرية : ميزة حسن كحد أدنى\n\n**القبول المباشر عبر التوجيه :**\n→ ENSA (11 حرماً، عتبة SM 12/20، مجاني)\n→ ENSAM (عتبة SM 12.25/20، رسوم ~50 000 درهم/سنة)\n→ ISCAE (عتبة SM 17.66/20، شبه مجاني)\n→ ENCG (عتبة SM 12/20، شبه مجاني)",
        "Bac SM opens the doors to the best scientific and engineering programmes.\n\n**Elite pathway — CPGE then CNC exam:**\n→ EMI, EHTP, ENSIAS, INPT, ENIM (free or near-free tuition)\n→ 2 years of preparatory classes (MP or PSI), then the CNC national exam\n→ Entry threshold for CPGE: minimum Mention Assez Bien\n\n**Direct admission via Tawjihi:**\n→ ENSA (11 campuses, SM threshold 12/20, free tuition)\n→ ENSAM (SM threshold 12.25/20, fees ~50,000 MAD/year)\n→ ISCAE (SM threshold 17.66/20, near-free)\n→ ENCG (SM threshold 12/20, near-free)"
      ),
      quickReplies: qx(lang,
        ["Je veux faire ingénierie (CPGE)", "Je veux ISCAE ou ENCG", "Mention TB 16+", "Mention AB 12-14"],
        ["أريد الهندسة عبر الأقسام التحضيرية", "أريد ISCAE أو ENCG", "ميزة جيد جداً 16+", "ميزة حسن 12-14"],
        ["I want engineering (CPGE)", "I want ISCAE or ENCG", "Mention TB 16+", "Mention AB 12-14"]
      ),
    };
  }

  // Bac PC
  if (/(bac pc|physique.chimie|علوم فيزيائية|فيزياء بكالوريا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Le Bac PC est polyvalent et très recherché pour l'ingénierie et les sciences.\n\n**Accès ingénierie :**\n→ CPGE PC → CNC → EMI, EHTP, ENSA (voie élite)\n→ ENSA direct bac (seuil PC 14/20, gratuit)\n→ ENSAM (seuil PC 16.17/20, frais ~50 000 MAD/an)\n\n**Accès médecine :**\n→ FMP Rabat, Casablanca, Fès, Marrakech (seuil ~12/20, concours national)\n→ Bac PC accepté avec SVT comme matière complémentaire\n\n**Business :**\n→ ENCG (seuil PC 14/20), HEM, UIR sur dossier",
        "بكالوريا العلوم الفيزيائية متعددة الاستخدامات وتُعدّ مطلوبة جداً في الهندسة والعلوم.\n\n**الوصول إلى الهندسة :**\n→ أقسام تحضيرية PC ← مباراة CNC ← EMI، EHTP، ENSA (المسار النخبوي)\n→ ENSA مباشرة من البكالوريا (عتبة PC 14/20، مجاني)\n→ ENSAM (عتبة PC 16.17/20، رسوم ~50 000 درهم/سنة)\n\n**الطب :**\n→ كلية الطب والصيدلة في الرباط والدار البيضاء وفاس ومراكش (عتبة ~12/20، مباراة وطنية)\n\n**الاقتصاد والأعمال :**\n→ ENCG (عتبة PC 14/20)، HEM، UIR على أساس الملف",
        "Bac PC is versatile and highly sought-after for engineering and sciences.\n\n**Engineering access:**\n→ CPGE PC → CNC → EMI, EHTP, ENSA (elite pathway)\n→ ENSA direct from Bac (PC threshold 14/20, free tuition)\n→ ENSAM (PC threshold 16.17/20, fees ~50,000 MAD/year)\n\n**Medicine:**\n→ FMP Rabat, Casablanca, Fès, Marrakech (threshold ~12/20, national exam)\n\n**Business:**\n→ ENCG (PC threshold 14/20), HEM, UIR by file"
      ),
      quickReplies: qx(lang,
        ["Ingénierie avec PC", "Médecine avec PC", "ENCG ou HEM ?"],
        ["الهندسة مع العلوم الفيزيائية", "الطب مع العلوم الفيزيائية", "ENCG أم HEM ؟"],
        ["Engineering with PC", "Medicine with PC", "ENCG or HEM?"]
      ),
    };
  }

  // Bac SVT
  if (/(bac svt|svt|biologie|biochimie|علوم الحياة|بيولوجيا بكالوريا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Le Bac SVT est la principale voie vers les métiers de la santé et des sciences du vivant.\n\n**Médecine & pharmacie (publique) :**\n→ FMP dans 5 villes (Rabat, Casa, Fès, Marrakech, Oujda)\n→ Seuil 2025 : ~12/20 (formule 75% nationale + 25% régionale)\n→ Durée : 7 ans médecine, 6 ans pharmacie, quasi gratuit\n\n**Agronomie & vétérinaire :**\n→ IAV Hassan II Rabat (BCPST recommandée)\n\n**Privé :**\n→ UPF Fès, UPM Marrakech, UPCI Casablanca — 80K–150K MAD/an\n\n**Ingénierie possible :** UIR, EMSI, certains privés acceptent SVT.",
        "بكالوريا علوم الحياة والأرض هي المسار الرئيسي نحو مهن الصحة وعلوم الأحياء.\n\n**الطب والصيدلة (عام) :**\n→ كلية الطب والصيدلة في 5 مدن (الرباط، الدار البيضاء، فاس، مراكش، وجدة)\n→ عتبة 2025 : ~12/20 (75% وطنية + 25% جهوية)\n→ المدة : 7 سنوات للطب، 6 للصيدلة، شبه مجاني\n\n**الزراعة والبيطرة :**\n→ IAV Hassan II الرباط (يُنصح بـ BCPST)\n\n**القطاع الخاص :**\n→ UPF فاس، UPM مراكش، UPCI الدار البيضاء — 80K–150K درهم/سنة",
        "Bac SVT is the primary pathway towards health professions and life sciences.\n\n**Medicine & pharmacy (public):**\n→ FMP in 5 cities (Rabat, Casablanca, Fès, Marrakech, Oujda)\n→ 2025 threshold: ~12/20 (75% national + 25% regional)\n→ Duration: 7 years medicine, 6 years pharmacy, near-free tuition\n\n**Agronomy & veterinary:**\n→ IAV Hassan II Rabat (BCPST recommended)\n\n**Private:**\n→ UPF Fès, UPM Marrakech, UPCI Casablanca — 80K–150K MAD/year"
      ),
      quickReplies: qx(lang,
        ["FMP médecine comment postuler ?", "SVT → ingénierie possible ?", "Pharmacie vs médecine", "Médecine privée coûts"],
        ["كيف التقدم لكلية الطب ؟", "علوم الحياة → الهندسة ممكن ؟", "الصيدلة مقابل الطب", "تكاليف الطب الخاص"],
        ["How to apply to FMP medicine?", "SVT → engineering possible?", "Pharmacy vs medicine", "Private medicine costs"]
      ),
    };
  }

  // Bac SE
  if (/(bac se|sciences eco|economique|علوم اقتصادية|اقتصاد بكالوريا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Le Bac SE est idéal pour le business, l'économie et la gestion.\n\n**Public quasi gratuit :**\n→ ENCG (12 campus, seuil SE 12/20, 5K–12K MAD/an)\n→ ISCAE Casablanca/Rabat (seuil SE 17.24/20, très sélectif)\n→ FSJES dans toutes les universités publiques (accès libre)\n\n**Privé premium :**\n→ HEM Business School (35K–65K MAD/an, accrédité AACSB)\n→ UIR pôle Business (40K–60K MAD/an)\n→ UM6P (bourses disponibles jusqu'à 100%)\n\nInscriptions via **cursussup.gov.ma** pour le public.",
        "بكالوريا العلوم الاقتصادية مثالية للأعمال والاقتصاد والتسيير.\n\n**القطاع العام (شبه مجاني) :**\n→ ENCG (12 حرماً، عتبة SE 12/20، 5K–12K درهم/سنة)\n→ ISCAE الدار البيضاء/الرباط (عتبة SE 17.24/20، انتقائي جداً)\n→ FSJES في جميع الجامعات العامة (قبول حر)\n\n**القطاع الخاص المتميز :**\n→ مدرسة HEM للإدارة (35K–65K درهم/سنة، معتمدة AACSB)\n→ UIR قطب الأعمال (40K–60K درهم/سنة)\n→ UM6P (منح متاحة حتى 100%)\n\nالتسجيل عبر **cursussup.gov.ma** للقطاع العام.",
        "Bac SE is ideal for business, economics and management.\n\n**Public (near-free):**\n→ ENCG (12 campuses, SE threshold 12/20, 5K–12K MAD/year)\n→ ISCAE Casablanca/Rabat (SE threshold 17.24/20, highly selective)\n→ FSJES in all public universities (open admission)\n\n**Premium private:**\n→ HEM Business School (35K–65K MAD/year, AACSB accredited)\n→ UIR Business (40K–60K MAD/year)\n→ UM6P (scholarships up to 100% available)\n\nApply via **cursussup.gov.ma** for public institutions."
      ),
      quickReplies: qx(lang,
        ["Comment intégrer ENCG ?", "ISCAE vs HEM", "FSJES gratuite ?", "Bourses UM6P"],
        ["كيف أنتسب إلى ENCG ؟", "ISCAE مقابل HEM", "FSJES مجانية ؟", "منح UM6P"],
        ["How to get into ENCG?", "ISCAE vs HEM", "Is FSJES free?", "UM6P scholarships"]
      ),
    };
  }

  // Bac STI
  if (/(bac sti|sciences techniques|electrotechnique|technique|علوم تقنية|تقنية بكالوريا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Le Bac STI ouvre l'accès aux écoles d'ingénieurs et aux filières techniques.\n\n**Voie élite — CPGE TSI :**\n→ 2 ans CPGE TSI → CNC → EMI, EHTP, ENSA (filières génie industriel/électrique)\n→ Seuil : mention Assez Bien minimum\n\n**Voie directe :**\n→ ENSA (seuil STI 15–16/20, gratuit selon campus)\n→ ENSAM (seuil STI 16.17/20, frais ~50K MAD/an)\n→ EMSI, ESIG, ESISA (privé, sur dossier)\n\n**Formations courtes :**\n→ BTS Électrotechnique, Maintenance industrielle — 2 ans, très bonne insertion",
        "بكالوريا العلوم التقنية تفتح الوصول إلى مدارس الهندسة والتخصصات التقنية.\n\n**المسار النخبوي — أقسام تحضيرية TSI :**\n→ سنتان تحضيريتان TSI ← مباراة CNC ← EMI، EHTP، ENSA\n→ عتبة الدخول : ميزة حسن كحد أدنى\n\n**القبول المباشر :**\n→ ENSA (عتبة STI 15–16/20، مجاني حسب الحرم)\n→ ENSAM (عتبة STI 16.17/20، رسوم ~50K درهم/سنة)\n→ EMSI، ESIG (خاص، على أساس الملف)\n\n**تكوين قصير المدى :**\n→ BTS الكهروتقنية، الصيانة الصناعية — سنتان، إدماج مهني ممتاز",
        "Bac STI gives access to engineering schools and technical programmes.\n\n**Elite pathway — CPGE TSI:**\n→ 2 years CPGE TSI → CNC → EMI, EHTP, ENSA (industrial/electrical engineering)\n→ Entry threshold: minimum Mention Assez Bien\n\n**Direct admission:**\n→ ENSA (STI threshold 15–16/20, free tuition by campus)\n→ ENSAM (STI threshold 16.17/20, fees ~50K MAD/year)\n→ EMSI, ESIG, ESISA (private, file-based)\n\n**Short programmes:**\n→ BTS Electrotechnics, Industrial Maintenance — 2 years, excellent job placement"
      ),
      quickReplies: qx(lang,
        ["CPGE TSI c'est quoi ?", "ENSA avec STI", "BTS ou ENSA ?"],
        ["ما هي الأقسام التحضيرية TSI ؟", "ENSA مع العلوم التقنية", "BTS أم ENSA ؟"],
        ["What is CPGE TSI?", "ENSA with STI", "BTS or ENSA?"]
      ),
    };
  }

  // Medicine
  if (/(medecine|docteur|chirurgie|pharmacie|dentaire|fmp|sante|طب|صيدلة|طبيب|صحة)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "La médecine au Maroc — un parcours exigeant et une carrière stable.\n\n**Publique (quasi gratuit) :**\n→ FMP dans 5 villes : Rabat, Casablanca, Fès, Marrakech, Oujda\n→ Seuil 2025 : **12/20** (formule : 75% note nationale + 25% note régionale)\n→ Bacs requis : SVT ou PC impérativement\n→ Durée : 7 ans médecine · 6 ans pharmacie · 5 ans dentaire\n\n**Privée :**\n→ UPF Fès, UPM Marrakech, UPCI Casablanca — 80K–150K MAD/an\n→ Admission sur dossier + entretien, sans concours national",
        "الطب بالمغرب — مسار صعب ومهنة مستقرة.\n\n**العام (شبه مجاني) :**\n→ كلية الطب والصيدلة في 5 مدن : الرباط، الدار البيضاء، فاس، مراكش، وجدة\n→ عتبة 2025 : **12/20** (75% وطنية + 25% جهوية)\n→ الشعب المطلوبة : علوم الحياة أو الفيزياء إجباريًا\n→ المدة : 7 سنوات طب · 6 سنوات صيدلة · 5 سنوات طب الأسنان\n\n**الخاص :**\n→ UPF فاس، UPM مراكش، UPCI الدار البيضاء — 80K–150K درهم/سنة\n→ قبول على أساس الملف والمقابلة، دون مباراة وطنية",
        "Medicine in Morocco — a demanding path and a stable career.\n\n**Public (near-free):**\n→ FMP in 5 cities: Rabat, Casablanca, Fès, Marrakech, Oujda\n→ 2025 threshold: **12/20** (formula: 75% national + 25% regional)\n→ Required Bac tracks: SVT or PC mandatory\n→ Duration: 7 years medicine · 6 pharmacy · 5 dentistry\n\n**Private:**\n→ UPF Fès, UPM Marrakech, UPCI Casablanca — 80K–150K MAD/year\n→ File-based + interview admission, no national exam"
      ),
      quickReplies: qx(lang,
        ["FMP Rabat ou Casablanca ?", "Préparer le concours FMP", "Pharmacie vs médecine", "Médecine privée budget"],
        ["FMP الرباط أم الدار البيضاء ؟", "التحضير لمباراة كلية الطب", "الصيدلة مقابل الطب", "ميزانية الطب الخاص"],
        ["FMP Rabat or Casablanca?", "Preparing the FMP exam", "Pharmacy vs medicine", "Private medicine budget"]
      ),
    };
  }

  // EMI
  if (/(emi|mohammadia|ecole mohammadia)/.test(lower)) {
    return {
      text: tx(lang,
        "**EMI — École Mohammadia d'Ingénieurs**\nLa plus prestigieuse école d'ingénieurs publique du Maroc.\n\n→ Filières : GC, GI, GE, GM, GP, Génie des Procédés\n→ Accès **uniquement** via CPGE 2 ans (MP/PSI) + Concours CNC — aucune entrée directe bac\n→ ~548 places ouvertes chaque année\n→ Coût : quasi gratuit (frais symboliques)\n→ Débouchés : OCP, CDG, ONEE, BMCE, multinationales\n\nParcours type : Bac SM/PC → CPGE Moulay Youssef / Louis Massignon → CNC → EMI.",
        "**EMI — المدرسة المحمدية للمهندسين**\nأرقى مدرسة هندسة عامة في المغرب.\n\n→ التخصصات : الهندسة المدنية، المعلوميات، الكهربائية، الميكانيكية، العمليات\n→ الوصول **حصراً** عبر أقسام تحضيرية 2 سنة (MP/PSI) + مباراة CNC — لا قبول مباشراً من البكالوريا\n→ ~548 مقعداً سنوياً\n→ الرسوم : شبه مجانية\n→ مخرجات : OCP، CDG، ONEE، BMCE، شركات متعددة الجنسيات\n\nالمسار : بكالوريا SM/PC ← أقسام تحضيرية مولاي يوسف / لويس ماسينيون ← CNC ← EMI.",
        "**EMI — Mohammadia School of Engineers**\nMorocco's most prestigious public engineering school.\n\n→ Programmes: Civil, Computer, Electrical, Mechanical, Process Engineering\n→ Access **only** via 2-year CPGE (MP/PSI) + CNC exam — no direct Bac entry\n→ ~548 places per year\n→ Cost: near-free tuition\n→ Graduates work at OCP, CDG, ONEE, BMCE, multinationals\n\nPathway: Bac SM/PC → CPGE Moulay Youssef / Louis Massignon → CNC → EMI."
      ),
      quickReplies: qx(lang,
        ["CPGE c'est quoi ?", "EMI vs EHTP", "Classement CNC pour EMI ?"],
        ["ما هي الأقسام التحضيرية ؟", "EMI مقابل EHTP", "ترتيب CNC للدخول لـ EMI ؟"],
        ["What is CPGE?", "EMI vs EHTP", "CNC ranking needed for EMI?"]
      ),
    };
  }

  // EHTP
  if (/(ehtp|hassania|travaux publics)/.test(lower)) {
    return {
      text: tx(lang,
        "**EHTP — École Hassania des Travaux Publics**\nSous tutelle du Ministère du Transport, excellence pour l'infrastructure.\n\n→ Accès : CPGE 2 ans (MP/PSI) + CNC uniquement — pas d'entrée directe bac\n→ ~300 places par an\n→ Spécialités : GC, Génie Électrique, Informatique, Transport & Logistique\n→ Coût : 5K–15K MAD/an\n→ Double diplôme France possible\n\nParcours : Bac SM/PC → CPGE → CNC → EHTP.",
        "**EHTP — مدرسة الحسنية للأشغال العامة**\nتابعة لوزارة النقل، متميزة في البنية التحتية.\n\n→ الوصول : أقسام تحضيرية 2 سنة (MP/PSI) + CNC حصراً — لا قبول مباشراً\n→ ~300 مقعداً سنوياً\n→ التخصصات : الهندسة المدنية، الكهربائية، المعلوميات، النقل واللوجستيك\n→ الرسوم : 5K–15K درهم/سنة\n→ شهادة مزدوجة مع فرنسا ممكنة",
        "**EHTP — Hassania School of Public Works**\nUnder the Ministry of Transport, excellence in infrastructure.\n\n→ Access: 2-year CPGE (MP/PSI) + CNC only — no direct Bac entry\n→ ~300 places per year\n→ Specialisations: Civil Eng., Electrical, Computer Science, Transport & Logistics\n→ Fees: 5K–15K MAD/year\n→ French double degree possible"
      ),
      quickReplies: qx(lang,
        ["EHTP vs EMI", "CPGE pour EHTP", "Débouchés EHTP"],
        ["EHTP مقابل EMI", "الأقسام التحضيرية لـ EHTP", "مخرجات EHTP"],
        ["EHTP vs EMI", "CPGE for EHTP", "EHTP career prospects"]
      ),
    };
  }

  // UM6P
  if (/(um6p|mohammed vi polytechnique|ben guerir)/.test(lower)) {
    return {
      text: tx(lang,
        "**UM6P — Université Mohammed VI Polytechnique**\nCréée par l'OCP à Ben Guerir — top 5 africain.\n\n→ Enseignement : anglais + français\n→ Filières : Data Science, Computer Science, Agronomie, Architecture, Business, Génie Minier\n→ Coût : 45K–100K MAD/an **MAIS** bourses très généreuses (jusqu'à 100% pour les profils excellents)\n→ Campus : 150 hectares ultra-moderne\n→ Accès : dossier + entretien (mention Bien ou TB recommandée)",
        "**UM6P — جامعة محمد السادس متعددة التقنيات**\nأسسها OCP في بن جرير — ضمن أفضل 5 في أفريقيا.\n\n→ التعليم : بالإنجليزية والفرنسية\n→ التخصصات : علوم البيانات، المعلوميات، الزراعة، الهندسة المعمارية، الأعمال، الهندسة المنجمية\n→ الرسوم : 45K–100K درهم/سنة **لكن** منح سخية جداً (حتى 100% للملفات المتميزة)\n→ الحرم : 150 هكتاراً حديثاً\n→ القبول : على أساس الملف والمقابلة (يُنصح بميزة جيد أو جيد جداً)",
        "**UM6P — Mohammed VI Polytechnic University**\nFounded by OCP in Ben Guerir — top 5 in Africa.\n\n→ Teaching: English + French\n→ Programmes: Data Science, Computer Science, Agronomy, Architecture, Business, Mining Engineering\n→ Fees: 45K–100K MAD/year **BUT** very generous scholarships (up to 100% for strong profiles)\n→ Campus: 150 ultra-modern hectares\n→ Admission: file + interview (Mention Bien or TB recommended)"
      ),
      quickReplies: qx(lang,
        ["Bourses UM6P comment postuler ?", "UM6P vs UIR", "Vivre à Ben Guerir ?"],
        ["كيف التقدم لمنح UM6P ؟", "UM6P مقابل UIR", "الحياة في بن جرير ؟"],
        ["How to apply for UM6P scholarships?", "UM6P vs UIR", "Living in Ben Guerir?"]
      ),
    };
  }

  // UIR
  if (/(uir|universite internationale de rabat|sala al jadida)/.test(lower)) {
    return {
      text: tx(lang,
        "**UIR — Université Internationale de Rabat**\nUniversité privée trilingue (AR/FR/EN) à Sala Al Jadida.\n\n→ Accréditations CTI (ingénieurs) + doubles diplômes France/Canada\n→ Filières : Ingénierie, Business, Droit, Architecture, Aéronautique\n→ Coût : 30K–70K MAD/an — bourses mérite disponibles\n→ Campus smart de 25 hectares\n→ Accès : Bac mention Assez Bien + dossier",
        "**UIR — الجامعة الدولية للرباط**\nجامعة خاصة ثلاثية اللغة (العربية/الفرنسية/الإنجليزية) في سلا الجديدة.\n\n→ اعتمادات CTI (الهندسة) + شهادات مزدوجة مع فرنسا وكندا\n→ التخصصات : الهندسة، الأعمال، الحقوق، الهندسة المعمارية، الطيران\n→ الرسوم : 30K–70K درهم/سنة — منح التفوق متاحة\n→ حرم ذكي على 25 هكتاراً\n→ القبول : بكالوريا ميزة حسن + الملف",
        "**UIR — International University of Rabat**\nPrivate trilingual university (AR/FR/EN) in Sala Al Jadida.\n\n→ CTI accreditation (engineering) + double degrees with France/Canada\n→ Programmes: Engineering, Business, Law, Architecture, Aeronautics\n→ Fees: 30K–70K MAD/year — merit scholarships available\n→ 25-hectare smart campus\n→ Admission: Bac Mention Assez Bien + file"
      ),
      quickReplies: qx(lang,
        ["Aéronautique UIR", "UIR vs Mundiapolis", "Bourses UIR"],
        ["الطيران في UIR", "UIR مقابل مونديابوليس", "منح UIR"],
        ["Aeronautics at UIR", "UIR vs Mundiapolis", "UIR scholarships"]
      ),
    };
  }

  // ENCG
  if (/(encg|tafem|cursussup|ecole commerce nationale)/.test(lower)) {
    return {
      text: tx(lang,
        "**ENCG — Écoles Nationales de Commerce et de Gestion**\n12 campus au Maroc — l'une des meilleures options publiques.\n\n→ Villes : Casablanca, Agadir, Tanger, Fès, Marrakech, Oujda, Settat, Kénitra...\n→ **Concours TAFEM :** pré-sélection sur note bac, puis épreuve QCM écrite\n→ Seuils : SM 12/20 · SE 12/20 · PC 14/20 · SVT 14/20\n→ Coût : 5K–12K MAD/an\n→ Inscription : **cursussup.gov.ma**",
        "**ENCG — المدارس الوطنية للتجارة والتسيير**\n12 حرماً بالمغرب — من أفضل الخيارات العامة.\n\n→ المدن : الدار البيضاء، أكادير، طنجة، فاس، مراكش، وجدة، سطات، القنيطرة...\n→ **مباراة TAFEM :** انتقاء مسبق على أساس نقطة البكالوريا، ثم اختبار QCM كتابي\n→ العتبات : SM 12/20 · SE 12/20 · PC 14/20 · SVT 14/20\n→ الرسوم : 5K–12K درهم/سنة\n→ التسجيل : **cursussup.gov.ma**",
        "**ENCG — National Schools of Commerce and Management**\n12 campuses across Morocco — one of the best public options.\n\n→ Cities: Casablanca, Agadir, Tanger, Fès, Marrakech, Oujda, Settat, Kénitra...\n→ **TAFEM exam:** pre-selection on Bac grade, then written QCM test\n→ Thresholds: SM 12/20 · SE 12/20 · PC 14/20 · SVT 14/20\n→ Fees: 5K–12K MAD/year\n→ Apply via: **cursussup.gov.ma**"
      ),
      quickReplies: qx(lang,
        ["ENCG vs ISCAE", "Meilleur campus ENCG ?", "Comment préparer TAFEM ?"],
        ["ENCG مقابل ISCAE", "أفضل حرم ENCG ؟", "كيف أتحضر لمباراة TAFEM ؟"],
        ["ENCG vs ISCAE", "Best ENCG campus?", "How to prepare for TAFEM?"]
      ),
    };
  }

  // ISCAE
  if (/(iscae|commerce administration entreprise|grande ecole commerce publique)/.test(lower)) {
    return {
      text: tx(lang,
        "**ISCAE — Institut Supérieur de Commerce et d'Administration des Entreprises**\nLa grande école de commerce publique du Maroc — très sélective.\n\n**Seuils 2025 par filière :**\n→ SE : 17.24/20 · SM : 17.66/20 · SGC : 17.39/20\n→ SVT : 18.14/20 · PC : 18.59/20\n\n→ Formule : 75% note nationale + 25% note régionale\n→ Âge maximum : 21 ans au 31/12 de l'année d'inscription\n→ 2 campus : Casablanca + Rabat · Quasi gratuit",
        "**ISCAE — المعهد العالي للتجارة وإدارة المقاولات**\nأكبر مدرسة تجارة عامة في المغرب — انتقائية جداً.\n\n**عتبات 2025 حسب الشعبة :**\n→ SE : 17.24/20 · SM : 17.66/20 · SGC : 17.39/20\n→ SVT : 18.14/20 · PC : 18.59/20\n\n→ الصيغة : 75% نقطة وطنية + 25% نقطة جهوية\n→ الحد الأقصى للسن : 21 سنة في 31/12 من سنة التسجيل\n→ حرمان : الدار البيضاء + الرباط · شبه مجاني",
        "**ISCAE — Higher Institute of Commerce and Business Administration**\nMorocco's top public business school — highly selective.\n\n**2025 thresholds by track:**\n→ SE: 17.24/20 · SM: 17.66/20 · SGC: 17.39/20\n→ SVT: 18.14/20 · PC: 18.59/20\n\n→ Formula: 75% national grade + 25% regional grade\n→ Maximum age: 21 years as of 31/12 of enrolment year\n→ 2 campuses: Casablanca + Rabat · Near-free tuition"
      ),
      quickReplies: qx(lang,
        ["ISCAE vs ENCG", "Chances avec 17/20 ?", "ISCAE programmes MBA"],
        ["ISCAE مقابل ENCG", "فرصي مع 17/20 ؟", "برامج الماجستير في ISCAE"],
        ["ISCAE vs ENCG", "Chances with 17/20?", "ISCAE MBA programmes"]
      ),
    };
  }

  // HEM
  if (/(hem business|hem )/.test(lower)) {
    return {
      text: tx(lang,
        "**HEM Business School**\nPremière école privée de management au Maroc — accréditée AACSB.\n\n→ 5 campus : Casablanca, Rabat, Marrakech, Fès, Tanger\n→ Programmes : Grande École (5 ans), MBA, Bachelor\n→ Coût : 35K–65K MAD/an\n→ Alumni : +12 000 dirigeants dans les grandes entreprises\n→ Partenariats : EM Lyon, Kedge, ESCP\n→ Accès : dossier + entretien, mention Assez Bien minimum",
        "**مدرسة HEM للإدارة**\nأول مدرسة إدارة أعمال خاصة في المغرب — معتمدة من AACSB.\n\n→ 5 أحرام : الدار البيضاء، الرباط، مراكش، فاس، طنجة\n→ البرامج : المدرسة الكبرى (5 سنوات)، ماجستير MBA، بكالوريوس\n→ الرسوم : 35K–65K درهم/سنة\n→ الخريجون : +12 000 مدير في كبرى المقاولات\n→ شراكات : EM Lyon، Kedge، ESCP\n→ القبول : الملف والمقابلة، ميزة حسن كحد أدنى",
        "**HEM Business School**\nMorocco's first private management school — AACSB accredited.\n\n→ 5 campuses: Casablanca, Rabat, Marrakech, Fès, Tanger\n→ Programmes: Grande École (5 years), MBA, Bachelor\n→ Fees: 35K–65K MAD/year\n→ Alumni: 12,000+ leaders in major companies\n→ Partnerships: EM Lyon, Kedge, ESCP\n→ Admission: file + interview, minimum Mention Assez Bien"
      ),
      quickReplies: qx(lang,
        ["Finance HEM", "HEM vs ENCG", "Bourse HEM ?"],
        ["التمويل في HEM", "HEM مقابل ENCG", "منحة HEM ؟"],
        ["Finance at HEM", "HEM vs ENCG", "HEM scholarship?"]
      ),
    };
  }

  // ENSA
  if (/(ensa|sciences appliquees|nationale sciences appliquees)/.test(lower)) {
    return {
      text: tx(lang,
        "**ENSA — Écoles Nationales des Sciences Appliquées**\nRéseau de 11 écoles d'ingénieurs publiques et **gratuites**.\n\n→ Villes : Agadir, Fès, Casablanca, Marrakech, Kénitra, Tanger, Oujda, Béni Mellal, El Jadida, Berrechid, Tétouan\n→ Accès : directement depuis le Bac via la plateforme Tawjihi (75% × nat + 25% × rég)\n→ Seuils : SM 12/20 · PC 14/20 · STI 15–16/20 (varie selon campus)\n→ Inscription : **cursussup.gov.ma**\n→ Coût : gratuit\n\n**Important :** EMI, EHTP, ENSIAS et INPT ne sont PAS des ENSA — leur accès est via CPGE + CNC uniquement.",
        "**ENSA — المدارس الوطنية للعلوم التطبيقية**\nشبكة من 11 مدرسة هندسة عامة **مجانية**.\n\n→ المدن : أكادير، فاس، الدار البيضاء، مراكش، القنيطرة، طنجة، وجدة، بني ملال، الجديدة، برشيد، تطوان\n→ القبول : مباشرة من البكالوريا عبر منصة التوجيه (75% وطنية + 25% جهوية)\n→ العتبات : SM 12/20 · PC 14/20 · STI 15–16/20 (تتفاوت حسب الحرم)\n→ التسجيل : **cursussup.gov.ma**\n→ الرسوم : مجانية\n\n**ملاحظة :** EMI وEHTP وENSIAS وINPT ليست من شبكة ENSA — الوصول إليها عبر أقسام تحضيرية + CNC فقط.",
        "**ENSA — National Schools of Applied Sciences**\nNetwork of 11 public, **free-tuition** engineering schools.\n\n→ Cities: Agadir, Fès, Casablanca, Marrakech, Kénitra, Tanger, Oujda, Béni Mellal, El Jadida, Berrechid, Tétouan\n→ Admission: directly from Bac via the Tawjihi platform (75% national + 25% regional)\n→ Thresholds: SM 12/20 · PC 14/20 · STI 15–16/20 (varies by campus)\n→ Apply via: **cursussup.gov.ma**\n→ Fees: free\n\n**Note:** EMI, EHTP, ENSIAS and INPT are NOT ENSA schools — they require CPGE + CNC."
      ),
      quickReplies: qx(lang,
        ["ENSA Casablanca vs Fès", "ENSA vs EMI/EHTP", "Comment s'inscrire ?"],
        ["ENSA الدار البيضاء مقابل فاس", "ENSA مقابل EMI/EHTP", "كيف أسجل ؟"],
        ["ENSA Casablanca vs Fès", "ENSA vs EMI/EHTP", "How to apply?"]
      ),
    };
  }

  // CPGE
  if (/(cpge|classe prepa|prepas|grandes ecoles|mp|psi|maths sup)/.test(lower)) {
    return {
      text: tx(lang,
        "**CPGE — Classes Préparatoires aux Grandes Écoles**\nLa voie royale vers les meilleures écoles d'ingénieurs.\n\n**Filières :**\n→ MP/MP* : Maths-Physique → EMI, EHTP, concours France\n→ PC/PC* : Physique-Chimie → EMI, EHTP, ENSA\n→ PSI : Physique-Sciences de l'Ingénieur\n→ TSI : Technologie (Bac STI) → EMI, EHTP\n→ BCPST : Bio-Chimie-Sciences de la Terre → IAV\n\n**Meilleures CPGE :** Moulay Youssef (Rabat), Louis Massignon (Casa), Ibn Ghazi (Casa)\n→ Seuil : 16+/20 recommandé · Gratuit · 2 ans très intensifs",
        "**الأقسام التحضيرية للمدارس العليا (CPGE)**\nالمسار الملكي نحو أفضل مدارس الهندسة.\n\n**الشعب :**\n→ MP/MP* : رياضيات-فيزياء ← EMI، EHTP، مباريات فرنسا\n→ PC/PC* : فيزياء-كيمياء ← EMI، EHTP، ENSA\n→ PSI : فيزياء-علوم المهندس\n→ TSI : التكنولوجيا (بكالوريا تقنية) ← EMI، EHTP\n→ BCPST : أحياء-كيمياء-علوم الأرض ← IAV\n\n**أفضل الأقسام التحضيرية :** مولاي يوسف (الرباط)، لويس ماسينيون (الدار البيضاء)، ابن غازي (الدار البيضاء)\n→ العتبة الموصى بها : 16+/20 · مجانية · سنتان مكثفتان جداً",
        "**CPGE — Preparatory Classes for Engineering Schools**\nThe royal road to Morocco's top engineering schools.\n\n**Tracks:**\n→ MP/MP*: Maths-Physics → EMI, EHTP, French exams\n→ PC/PC*: Physics-Chemistry → EMI, EHTP, ENSA\n→ PSI: Physics-Engineering Sciences\n→ TSI: Technology (Bac STI) → EMI, EHTP\n→ BCPST: Biology-Chemistry-Earth Sciences → IAV\n\n**Top CPGE schools:** Moulay Youssef (Rabat), Louis Massignon (Casa), Ibn Ghazi (Casa)\n→ Recommended threshold: 16+/20 · Free · 2 very intense years"
      ),
      quickReplies: qx(lang,
        ["CPGE MP ou PC ?", "Comment intégrer une CPGE ?", "CPGE Maroc vs France"],
        ["أقسام تحضيرية MP أم PC ؟", "كيف أدخل الأقسام التحضيرية ؟", "تحضيري بالمغرب أم فرنسا"],
        ["CPGE MP or PC?", "How to get into CPGE?", "CPGE Morocco vs France"]
      ),
    };
  }

  // Budget
  if (/(budget|cout|frais|scolarite|gratuit|bourse|cher|ميزانية|تكاليف|مجاني|منحة)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Voici le panorama des coûts au Maroc :\n\n**Gratuit ou quasi gratuit :**\n→ Universités publiques (FSJES, FS, FST) : 0–1 500 MAD/an\n→ ENSA, EMI, EHTP : 0–5 000 MAD/an\n→ ENCG : 5 000–12 000 MAD/an · CPGE : gratuit\n\n**Privé abordable :**\n→ EMSI : 20K–40K MAD/an\n→ ESISA, ESIG : 15K–35K MAD/an\n\n**Privé premium :**\n→ UIR : 30K–70K MAD · HEM : 35K–65K MAD\n→ UM6P : 45K–100K MAD (bourses jusqu'à 100%)\n→ Al Akhawayn : 80K–130K MAD (bourses 50–100%)",
        "إليك نظرة عامة على التكاليف في المغرب :\n\n**مجاني أو شبه مجاني :**\n→ الجامعات العامة (FSJES، FS، FST) : 0–1500 درهم/سنة\n→ ENSA، EMI، EHTP : 0–5000 درهم/سنة\n→ ENCG : 5000–12000 درهم/سنة · الأقسام التحضيرية : مجانية\n\n**الخاص بأسعار معقولة :**\n→ EMSI : 20K–40K درهم/سنة\n→ ESISA، ESIG : 15K–35K درهم/سنة\n\n**الخاص المتميز :**\n→ UIR : 30K–70K درهم · HEM : 35K–65K درهم\n→ UM6P : 45K–100K درهم (منح حتى 100%)\n→ الأخوين : 80K–130K درهم (منح 50–100%)",
        "Here is an overview of costs in Morocco:\n\n**Free or near-free:**\n→ Public universities (FSJES, FS, FST): 0–1,500 MAD/year\n→ ENSA, EMI, EHTP: 0–5,000 MAD/year\n→ ENCG: 5,000–12,000 MAD/year · CPGE: free\n\n**Affordable private:**\n→ EMSI: 20K–40K MAD/year\n→ ESISA, ESIG: 15K–35K MAD/year\n\n**Premium private:**\n→ UIR: 30K–70K MAD · HEM: 35K–65K MAD\n→ UM6P: 45K–100K MAD (scholarships up to 100%)\n→ Al Akhawayn: 80K–130K MAD (scholarships 50–100%)"
      ),
      quickReplies: qx(lang,
        ["Budget moins de 20K MAD", "Comment avoir une bourse ?", "Meilleures options gratuites"],
        ["ميزانية أقل من 20K درهم", "كيف أحصل على منحة ؟", "أفضل الخيارات المجانية"],
        ["Budget under 20K MAD", "How to get a scholarship?", "Best free options"]
      ),
    };
  }

  // Casablanca
  if (/(casablanca|casa|dar beida|الدار البيضاء)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Casablanca — la capitale économique du Maroc**\nLe marché de l'emploi le plus dynamique du pays.\n\n**Top écoles :**\n→ EHTP (Ingénierie, voie CPGE, élite)\n→ ISCAE Casa (Business public, très sélectif)\n→ ENCG Casablanca (Business, TAFEM)\n→ HEM Casablanca (Business premium)\n→ Mundiapolis (multi-filières, privé)\n→ EMSI Casablanca (Ingénierie, accessible)\n→ ESITH (Textile, unique au Maroc)\n→ FMP Casablanca (Médecine publique)",
        "**الدار البيضاء — العاصمة الاقتصادية للمغرب**\nأكثر أسواق العمل ديناميكية في البلاد.\n\n**أفضل المدارس :**\n→ EHTP (الهندسة، عبر الأقسام التحضيرية، نخبة)\n→ ISCAE الدار البيضاء (أعمال عامة، انتقائي جداً)\n→ ENCG الدار البيضاء (الأعمال، TAFEM)\n→ HEM الدار البيضاء (أعمال متميزة)\n→ Mundiapolis (متعدد التخصصات، خاص)\n→ EMSI الدار البيضاء (الهندسة، قبول ميسر)\n→ ESITH (النسيج، فريد في المغرب)\n→ كلية الطب والصيدلة الدار البيضاء",
        "**Casablanca — Morocco's economic capital**\nThe country's most dynamic job market.\n\n**Top schools:**\n→ EHTP (Engineering, CPGE pathway, elite)\n→ ISCAE Casablanca (Public business, highly selective)\n→ ENCG Casablanca (Business, TAFEM)\n→ HEM Casablanca (Premium business)\n→ Mundiapolis (Multi-programme, private)\n→ EMSI Casablanca (Engineering, accessible)\n→ ESITH (Textile, unique in Morocco)\n→ FMP Casablanca (Public medicine)"
      ),
      quickReplies: qx(lang,
        ["Ingénierie à Casablanca", "Business à Casablanca", "Coût de vie Casa"],
        ["الهندسة بالدار البيضاء", "الأعمال بالدار البيضاء", "تكلفة المعيشة بالدار البيضاء"],
        ["Engineering in Casablanca", "Business in Casablanca", "Cost of living in Casa"]
      ),
    };
  }

  // Rabat
  if (/(rabat|sale|sala al jadida|الرباط|سلا)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Rabat — la capitale et hub des grandes écoles publiques**\n\n**Top écoles :**\n→ EMI (Ingénierie, élite nationale, CPGE requis)\n→ ENSIAS (Informatique, élite, CPGE requis)\n→ INPT (Télécoms, CPGE requis)\n→ ENIM (Mines, CPGE requis)\n→ ISCAE Rabat (Business public)\n→ INSEA (Statistiques et économie appliquée)\n→ IAV Hassan II (Agronomie & vétérinaire)\n→ ENA (Architecture)\n→ UIR à Sala Al Jadida\n→ FMP Rabat (Médecine publique)",
        "**الرباط — العاصمة ومحور المدارس الكبرى العامة**\n\n**أفضل المدارس :**\n→ EMI (الهندسة، نخبة وطنية، أقسام تحضيرية ضرورية)\n→ ENSIAS (المعلوميات، نخبة، أقسام تحضيرية ضرورية)\n→ INPT (الاتصالات، أقسام تحضيرية ضرورية)\n→ ENIM (المناجم، أقسام تحضيرية ضرورية)\n→ ISCAE الرباط (أعمال عامة)\n→ INSEA (الإحصاء والاقتصاد التطبيقي)\n→ IAV الحسن الثاني (الزراعة والبيطرة)\n→ ENA (الهندسة المعمارية)\n→ UIR في سلا الجديدة\n→ كلية الطب والصيدلة الرباط",
        "**Rabat — the capital and hub of top public schools**\n\n**Top schools:**\n→ EMI (Engineering, national elite, CPGE required)\n→ ENSIAS (Computer Science, elite, CPGE required)\n→ INPT (Telecoms, CPGE required)\n→ ENIM (Mining Engineering, CPGE required)\n→ ISCAE Rabat (Public business)\n→ INSEA (Statistics & applied economics)\n→ IAV Hassan II (Agronomy & veterinary)\n→ ENA (Architecture)\n→ UIR in Sala Al Jadida\n→ FMP Rabat (Public medicine)"
      ),
      quickReplies: qx(lang,
        ["EMI admission", "UIR ou ENSA Rabat ?", "Logement à Rabat"],
        ["القبول في EMI", "UIR أم ENSA الرباط ؟", "السكن بالرباط"],
        ["EMI admission", "UIR or ENSA Rabat?", "Accommodation in Rabat"]
      ),
    };
  }

  // Stress / anxiety
  if (/(peur|stress|anxieux|anxiete|stresse|inquiet|perdu|aide|confused|panic|قلق|خوف|ضائع|مساعدة)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "C'est tout à fait normal de se sentir dépassé à cette étape — des milliers de bacheliers marocains ressentent la même chose chaque année.\n\nLa bonne nouvelle : il n'y a pas de mauvais choix, il y a des choix mieux adaptés à ton profil. Mon rôle est de t'aider à trouver le tien.\n\nCommence par me dire ta filière Bac et ta moyenne approximative — je construis avec toi une feuille de route claire, étape par étape.",
        "من الطبيعي تماماً أن تشعر بالارتباك في هذه المرحلة — الآلاف من طلاب البكالوريا المغاربة يمرون بنفس الشعور كل عام.\n\nالبشرى الطيبة : لا يوجد خيار خاطئ، هناك فقط خيارات مناسبة أو أقل مناسبة لملفك الشخصي. دوري هو مساعدتك على اكتشاف الأنسب لك.\n\nأخبرني بشعبتك في البكالوريا ومعدلك التقريبي — سأضع معك خارطة طريق واضحة خطوة بخطوة.",
        "It's completely normal to feel overwhelmed at this stage — thousands of Moroccan Bac students feel the same way every year.\n\nThe good news: there is no wrong choice, only choices that fit your profile better or less well. My role is to help you find yours.\n\nJust tell me your Bac track and approximate grade — I'll build a clear roadmap with you, step by step."
      ),
      quickReplies: qx(lang,
        ["Je suis Bac SM", "Je suis Bac SE", "Je suis Bac SVT", "Lancer le questionnaire"],
        ["أنا في شعبة علوم رياضية", "أنا في شعبة علوم اقتصادية", "أنا في شعبة علوم الحياة", "إجراء الاستبيان"],
        ["I'm Bac SM", "I'm Bac SE", "I'm Bac SVT", "Take the questionnaire"]
      ),
    };
  }

  // Weak mention
  if (/(passable|pas de mention|moins de 12|faible|redouble|mention passable|ميزة مقبول|معدل ضعيف)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Une mention passable ne ferme aucune porte définitivement.\n\n**Options accessibles :**\n→ Universités publiques (FSJES, FS, FST) — gratuit, sans concours\n→ ISTA/OFPPT — formations technicien spécialisé, 2 ans, bonne insertion\n→ BTS (Brevet Technicien Supérieur) — très prisé par les entreprises\n→ Écoles privées (EMSI, ESIG, ESISA) — acceptent dès 10/20\n\nL'important : identifier ta passion et t'y consacrer pleinement. Les parcours atypiques réussissent souvent très bien au Maroc.",
        "ميزة مقبول لا تغلق أي باب بشكل نهائي.\n\n**الخيارات المتاحة :**\n→ الجامعات العامة (FSJES، FS، FST) — مجانية، بدون مباراة\n→ ISTA/OFPPT — تكوين تقني متخصص، سنتان، إدماج مهني جيد\n→ BTS — شهادة تقنية عليا مطلوبة جداً من طرف المقاولات\n→ المدارس الخاصة (EMSI، ESIG، ESISA) — تقبل من 10/20\n\nالأهم : تحديد شغفك والانكباب عليه. المسارات غير التقليدية كثيراً ما تُفضي إلى نجاحات باهرة بالمغرب.",
        "A pass grade doesn't permanently close any door.\n\n**Accessible options:**\n→ Public universities (FSJES, FS, FST) — free, no entrance exam\n→ ISTA/OFPPT — specialised technician training, 2 years, good job placement\n→ BTS — highly valued by employers\n→ Private schools (EMSI, ESIG, ESISA) — accept from 10/20\n\nThe key: identify your passion and commit to it fully. Non-traditional paths often lead to great success in Morocco."
      ),
      quickReplies: qx(lang,
        ["Université publique options", "OFPPT c'est quoi ?", "BTS ou Licence ?"],
        ["خيارات الجامعة العامة", "ما هو OFPPT ؟", "BTS أم ليسانس ؟"],
        ["Public university options", "What is OFPPT?", "BTS or Bachelor's?"]
      ),
    };
  }

  // Salaries / prospects
  if (/(salaire|revenu|debouche|emploi|travail|job|راتب|دخل|عمل|توظيف)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Salaires de départ au Maroc selon le diplôme :\n\n→ **Ingénieurs EMI/EHTP/ENSIAS :** 12K–18K MAD/mois\n→ **Développeur IT (ENSIAS, INPT, EMSI) :** 8K–15K MAD/mois\n→ **Business ISCAE/HEM :** 7K–12K MAD/mois\n→ **Médecin :** 15K–25K public · 30K+ privé\n→ **Architecte :** 8K–15K MAD/mois\n→ **ENCG :** 6K–10K MAD/mois\n\n**Secteurs porteurs :** IT, Finance islamique, Génie Civil, Santé, Automobile (Tanger/Kénitra), Offshoring.",
        "الرواتب الأولية بالمغرب حسب الشهادة :\n\n→ **مهندسو EMI/EHTP/ENSIAS :** 12K–18K درهم/شهر\n→ **مطور تقنيات المعلومات (ENSIAS، INPT، EMSI) :** 8K–15K درهم/شهر\n→ **أعمال ISCAE/HEM :** 7K–12K درهم/شهر\n→ **طبيب :** 15K–25K عام · 30K+ خاص\n→ **مهندس معماري :** 8K–15K درهم/شهر\n→ **ENCG :** 6K–10K درهم/شهر\n\n**القطاعات الواعدة :** تقنية المعلومات، التمويل الإسلامي، الهندسة المدنية، الصحة، السيارات (طنجة/القنيطرة)، الإسناد الخارجي.",
        "Starting salaries in Morocco by qualification:\n\n→ **Engineers EMI/EHTP/ENSIAS:** 12K–18K MAD/month\n→ **IT Developer (ENSIAS, INPT, EMSI):** 8K–15K MAD/month\n→ **Business ISCAE/HEM:** 7K–12K MAD/month\n→ **Doctor:** 15K–25K public · 30K+ private\n→ **Architect:** 8K–15K MAD/month\n→ **ENCG:** 6K–10K MAD/month\n\n**Growing sectors:** IT, Islamic finance, Civil engineering, Healthcare, Automotive (Tanger/Kénitra), Offshoring."
      ),
      quickReplies: qx(lang,
        ["Secteurs qui recrutent le plus ?", "Salaires IT Maroc", "Partir à l'étranger après ?"],
        ["أكثر القطاعات توظيفاً ؟", "رواتب تقنية المعلومات بالمغرب", "العمل بالخارج بعد الشهادة ؟"],
        ["Which sectors hire most?", "IT salaries in Morocco", "Working abroad after graduation?"]
      ),
    };
  }

  // Abroad / France / Canada
  if (/(france|canada|etranger|partir|europe|belgique|montreal|paris|فرنسا|كندا|الخارج)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Étudier à l'étranger** — les chemins les plus empruntés par les bacheliers marocains.\n\n**France :**\n→ CPGE Maroc → Grandes écoles françaises (Polytechnique, CentraleSupélec)\n→ Parcoursup accessible pour les bacheliers marocains\n→ Campus France : Licence/Master dans les universités françaises\n\n**Canada :**\n→ Québec : Montréal, Laval, Sherbrooke — 15K–30K CAD/an\n\n**Conseil :** Commence par un diplôme marocain solide (EMI, UIR, ENSA), puis Master à l'étranger. C'est souvent le chemin le plus rapide et le moins coûteux.",
        "**الدراسة بالخارج** — أكثر المسارات شيوعاً بين خريجي البكالوريا المغاربة.\n\n**فرنسا :**\n→ أقسام تحضيرية بالمغرب ← كبرى المدارس الفرنسية (بوليتيكنيك، CentraleSupélec)\n→ Parcoursup متاحة لحاملي البكالوريا المغربية\n→ Campus France : ليسانس/ماستر في الجامعات الفرنسية\n\n**كندا :**\n→ كيبيك : مونتريال، لافال، شيربروك — 15K–30K دولار كندي/سنة\n\n**نصيحة :** ابدأ بشهادة مغربية متينة (EMI، UIR، ENSA)، ثم ماستر بالخارج. هذا في الغالب الطريق الأسرع والأقل تكلفة.",
        "**Studying abroad** — the most common paths for Moroccan Bac graduates.\n\n**France:**\n→ Moroccan CPGE → Top French engineering schools (Polytechnique, CentraleSupélec)\n→ Parcoursup accessible for Moroccan graduates\n→ Campus France: Bachelor/Master at French universities\n\n**Canada:**\n→ Québec: Montréal, Laval, Sherbrooke — 15K–30K CAD/year\n\n**Advice:** Start with a solid Moroccan degree (EMI, UIR, ENSA), then pursue a Master's abroad. This is usually the fastest and least expensive route."
      ),
      quickReplies: qx(lang,
        ["CPGE Maroc → France comment ?", "Canada comment s'inscrire ?", "Budget pour partir en France"],
        ["الأقسام التحضيرية المغربية ← فرنسا كيف ؟", "كيف التسجيل في كندا ؟", "ميزانية الدراسة بفرنسا"],
        ["Moroccan CPGE → France, how?", "How to apply to Canada?", "Budget for studying in France"]
      ),
    };
  }

  // Architecture
  if (/(architecture|architecte|design|urbanisme|هندسة معمارية|مهندس معماري)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Architecture au Maroc**\n\n**Publique (quasi gratuit) :**\n→ ENA — Rabat, Casablanca, Marrakech, Fès, Tétouan\n→ Seuil : ~14/20 + épreuve de dessin/aptitude artistique\n→ Durée : 6 ans (3 Licence + 3 Master), quasi gratuit\n→ Bacs acceptés : SM, STI et autres filières selon école\n\n**Privée :**\n→ UM6P Architecture (50K+/an, bourses disponibles)\n→ UIR Architecture · INAU Rabat",
        "**الهندسة المعمارية بالمغرب**\n\n**العامة (شبه مجانية) :**\n→ المدرسة الوطنية للهندسة المعمارية — الرباط، الدار البيضاء، مراكش، فاس، تطوان\n→ العتبة : ~14/20 + اختبار الرسم/الكفاءة الفنية\n→ المدة : 6 سنوات (3 ليسانس + 3 ماستر)، شبه مجانية\n→ الشعب المقبولة : SM، STI وأخرى حسب المدرسة\n\n**الخاصة :**\n→ UM6P الهندسة المعمارية (50K+/سنة، منح متاحة)\n→ UIR الهندسة المعمارية · INAU الرباط",
        "**Architecture in Morocco**\n\n**Public (near-free):**\n→ ENA — Rabat, Casablanca, Marrakech, Fès, Tétouan\n→ Threshold: ~14/20 + drawing/artistic aptitude test\n→ Duration: 6 years (3 Licence + 3 Master), near-free\n→ Accepted Bac tracks: SM, STI and others by school\n\n**Private:**\n→ UM6P Architecture (50K+/year, scholarships available)\n→ UIR Architecture · INAU Rabat"
      ),
      quickReplies: qx(lang,
        ["ENA Rabat admission", "UM6P Architecture", "Débouchés architecte"],
        ["قبول ENA الرباط", "UM6P الهندسة المعمارية", "مخرجات الهندسة المعمارية"],
        ["ENA Rabat admission", "UM6P Architecture", "Architecture career prospects"]
      ),
    };
  }

  // Engineering (generic)
  if (/(ingenierie|genie civil|ecole ing|ingenieur|هندسة|مهندس)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Ingénierie au Maroc — deux grandes voies**\n\n**Voie élite (CPGE → CNC) :**\n→ EMI, EHTP, ENSIAS, INPT, ENIM — les meilleures écoles publiques\n→ 2 ans de CPGE (MP ou PSI), puis concours CNC national\n→ Quasi gratuit · Exige mention Assez Bien minimum au bac\n\n**Voie directe depuis le bac :**\n→ ENSA réseau 11 campus (seuil SM 12/20, gratuit)\n→ ENSAM (seuil SM 12.25/20 · PC 16.17/20, frais ~50K MAD/an)\n→ UIR, EMSI, ESIG (privé, sur dossier)\n\nInscriptions publiques via **cursussup.gov.ma** après les résultats Tawjihi.",
        "**الهندسة بالمغرب — مساران رئيسيان**\n\n**المسار النخبوي (أقسام تحضيرية ← CNC) :**\n→ EMI، EHTP، ENSIAS، INPT، ENIM — أفضل المدارس العامة\n→ سنتان تحضيريتان (MP أو PSI)، ثم المباراة الوطنية المشتركة CNC\n→ شبه مجاني · يستلزم ميزة حسن كحد أدنى\n\n**القبول المباشر من البكالوريا :**\n→ ENSA شبكة 11 حرماً (عتبة SM 12/20، مجاني)\n→ ENSAM (عتبة SM 12.25/20 · PC 16.17/20، رسوم ~50K درهم/سنة)\n→ UIR، EMSI، ESIG (خاص، على أساس الملف)\n\nالتسجيل العام عبر **cursussup.gov.ma** بعد نتائج التوجيه.",
        "**Engineering in Morocco — two main pathways**\n\n**Elite pathway (CPGE → CNC):**\n→ EMI, EHTP, ENSIAS, INPT, ENIM — the best public schools\n→ 2 years CPGE (MP or PSI), then the national CNC exam\n→ Near-free · Requires minimum Mention Assez Bien at Bac\n\n**Direct admission from Bac:**\n→ ENSA network of 11 campuses (SM threshold 12/20, free)\n→ ENSAM (SM threshold 12.25/20 · PC 16.17/20, fees ~50K MAD/year)\n→ UIR, EMSI, ESIG (private, file-based)\n\nPublic registration via **cursussup.gov.ma** after Tawjihi results."
      ),
      quickReplies: qx(lang,
        ["Je suis Bac SM", "Je suis Bac PC", "CPGE c'est quoi ?", "Coût ENSAM ?"],
        ["أنا في شعبة علوم رياضية", "أنا في شعبة علوم فيزيائية", "ما هي الأقسام التحضيرية ؟", "تكلفة ENSAM ؟"],
        ["I'm Bac SM", "I'm Bac PC", "What is CPGE?", "ENSAM costs?"]
      ),
    };
  }

  // Business (generic)
  if (/(business|management|commerce|marketing|finance|gestion|الأعمال|التسيير|التجارة|التمويل)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "**Business & management au Maroc**\n\n**Public quasi gratuit :**\n→ ENCG (12 campus, TAFEM, seuil 12/20 SM/SE)\n→ ISCAE Casa/Rabat (17+/20, très sélectif)\n→ FSJES — accès libre, toutes universités publiques\n\n**Privé premium :**\n→ HEM Business School (AACSB, 35K–65K MAD/an)\n→ UIR Business (40K–60K MAD/an)\n→ UM6P (bourses jusqu'à 100%)",
        "**الأعمال والتسيير بالمغرب**\n\n**القطاع العام (شبه مجاني) :**\n→ ENCG (12 حرماً، TAFEM، عتبة 12/20 SM/SE)\n→ ISCAE الدار البيضاء/الرباط (17+/20، انتقائي جداً)\n→ FSJES — قبول حر في جميع الجامعات العامة\n\n**القطاع الخاص المتميز :**\n→ مدرسة HEM للإدارة (AACSB، 35K–65K درهم/سنة)\n→ UIR الأعمال (40K–60K درهم/سنة)\n→ UM6P (منح حتى 100%)",
        "**Business & management in Morocco**\n\n**Public (near-free):**\n→ ENCG (12 campuses, TAFEM exam, threshold 12/20 SM/SE)\n→ ISCAE Casa/Rabat (17+/20, highly selective)\n→ FSJES — open admission, all public universities\n\n**Premium private:**\n→ HEM Business School (AACSB, 35K–65K MAD/year)\n→ UIR Business (40K–60K MAD/year)\n→ UM6P (scholarships up to 100%)"
      ),
      quickReplies: qx(lang,
        ["ENCG admission", "ISCAE seuils", "HEM vs ENCG"],
        ["قبول في ENCG", "عتبات ISCAE", "HEM مقابل ENCG"],
        ["ENCG admission", "ISCAE thresholds", "HEM vs ENCG"]
      ),
    };
  }

  // Help / undecided
  if (/(choisir|aide|perdu|oriente|orientation|quoi faire|je sais pas|decide|لا أعرف|مساعدة في الاختيار|توجيه)/.test(lower + raw)) {
    return {
      text: tx(lang,
        "Pour te proposer les meilleures options, j'ai besoin de trois informations :\n\n→ **Ta filière Bac** (SM, PC, SVT, SE, STI, SH ou L)\n→ **Ta note générale** approximative (sur 20)\n→ **Ce que tu aimes** — technologies, chiffres, contact humain, créativité ?\n\nAvec ça, je construis 3 à 4 parcours qui correspondent vraiment à ton profil.",
        "لأقترح عليك أفضل الخيارات، أحتاج إلى ثلاث معلومات :\n\n→ **شعبتك في البكالوريا** (علوم رياضية، فيزيائية، أحياء، اقتصادية، تقنية، إنسانية أو آداب)\n→ **معدلك العام** التقريبي (من 20)\n→ **ما تستمتع به** — التكنولوجيا، الأرقام، التواصل مع الناس، الإبداع ؟\n\nبهذه المعلومات، أُعدّ لك 3 إلى 4 مسارات تناسب ملفك فعلاً.",
        "To suggest the best options, I need three pieces of information:\n\n→ **Your Bac track** (SM, PC, SVT, SE, STI, SH or L)\n→ **Your approximate overall grade** (out of 20)\n→ **What you enjoy** — technology, numbers, human interaction, creativity?\n\nWith that, I'll map out 3 to 4 pathways that truly fit your profile."
      ),
      quickReplies: qx(lang,
        ["Je suis Bac SM", "Je suis Bac SE", "Je suis Bac SVT", "Lancer le questionnaire"],
        ["أنا في علوم رياضية", "أنا في علوم اقتصادية", "أنا في علوم الحياة", "إجراء الاستبيان"],
        ["I'm Bac SM", "I'm Bac SE", "I'm Bac SVT", "Take the questionnaire"]
      ),
    };
  }

  // Greetings
  const greetings = ["salam", "bonjour", "salut", "hello", "hi", "slt", "bonsoir", "marhaba", "ahlan", "مرحبا", "السلام", "صباح", "مساء"];
  if (greetings.some((g) => lower.includes(g) || raw.includes(g))) {
    const greeting = getInitialGreeting(lang);
    return { text: greeting.text, quickReplies: greeting.quickReplies };
  }

  // Default fallback
  return {
    text: tx(lang,
      "Je n'ai pas bien saisi votre question. Reformulez-la ou choisissez un sujet ci-dessous — je connais toutes les écoles marocaines : ingénierie, médecine, business, architecture et plus encore.",
      "لم أفهم سؤالك جيداً. يرجى إعادة صياغته أو اختيار موضوع من الأزرار أدناه — أعرف جميع المؤسسات المغربية : الهندسة، الطب، الأعمال، الهندسة المعمارية وغيرها.",
      "I didn't quite catch that. Please rephrase your question or choose a topic below — I know all Moroccan institutions: engineering, medicine, business, architecture and more."
    ),
    quickReplies: qx(lang,
      ["Ingénierie au Maroc", "Business au Maroc", "Médecine au Maroc", "Aide-moi à choisir"],
      ["الهندسة بالمغرب", "الأعمال بالمغرب", "الطب بالمغرب", "ساعدني في الاختيار"],
      ["Engineering in Morocco", "Business in Morocco", "Medicine in Morocco", "Help me choose"]
    ),
  };
}

// ── External open trigger ────────────────────────────────────────────────────
let openCallback: (() => void) | null = null;
export function openSlimane() { openCallback?.(); }

// ── Main component ───────────────────────────────────────────────────────────
export default function SlimaneChat() {
  const { t, i18n } = useTranslation();
  const lang = (["fr", "ar", "en"].includes(i18n.language) ? i18n.language : "fr") as Lang;
  const isRtl = lang === "ar";

  const makeInitial = (l: Lang): Message => {
    const g = getInitialGreeting(l);
    return { role: "slimane", content: g.text, quickReplies: g.quickReplies, timestamp: new Date() };
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([makeInitial(lang)]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mood, setMood] = useState("happy");
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSlimaneMode = useFormStore((s) => s.setSlimaneMode);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([makeInitial(lang)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    openCallback = () => { setOpen(true); setUnread(0); };
    (window as any).__slimaneOpen = () => { setOpen(true); setUnread(0); };
    return () => { openCallback = null; };
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [messages, open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isThinking) return;
    setMessages((prev) => [...prev, { role: "user", content: text, timestamp: new Date() }]);
    setInput("");
    setIsThinking(true);
    setMood("thinking");

    setTimeout(() => {
      setIsThinking(false);
      setMood("happy");
      const reply = generateSlimaneReply(text, lang);
      setMessages((prev) => [...prev, {
        role: "slimane",
        content: reply.text,
        quickReplies: reply.quickReplies,
        timestamp: new Date(),
      }]);
      if (!open) setUnread((n) => n + 1);
    }, 900 + Math.random() * 800);
  }, [isThinking, open, lang]);

  const posClass = isRtl ? "left-6 right-auto" : "right-6 left-auto";

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { setOpen(true); setUnread(0); }}
            className={`fixed bottom-6 z-50 group flex items-center gap-3 ${posClass}`}
            style={{ flexDirection: isRtl ? "row-reverse" : "row" }}
          >
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.4 }}
              className="hidden group-hover:flex items-center gap-2 bg-navy-800 text-gold-200 text-xs px-3 py-2 rounded-xl whitespace-nowrap shadow-xl border border-gold-500/20"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {t("slimane.name")} — {t("slimane.status")}
            </motion.div>
            <div className="relative">
              <SlimaneAvatar mood="happy" />
              <div className="absolute inset-0 rounded-full bg-gold-400/20 animate-ping" />
              {unread > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-cream">
                  {unread}
                </div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed bottom-6 z-50 w-[440px] max-w-[calc(100vw-1.5rem)] h-[640px] max-h-[85vh] bg-parchment rounded-3xl shadow-2xl border border-gold-200/40 flex flex-col overflow-hidden ${posClass}`}
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(215,180,105,0.15)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <SlimaneAvatar mood={mood} />
                <div>
                  <div className="font-heading font-bold text-gold-300 text-base">{t("slimane.name")}</div>
                  <div className="text-[10px] text-navy-300 flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                    {isThinking ? t("slimane.analyzing") : t("slimane.status")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setSlimaneMode(true); setOpen(false); }}
                  className="text-xs bg-gold-500/15 text-gold-300 px-3 py-1.5 rounded-full hover:bg-gold-500/25 border border-gold-500/20 transition font-medium"
                >
                  📋 {t("slimane.questionnaire_btn")}
                </button>
                <button
                  type="button"
                  aria-label="Fermer / Close"
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {messages.map((msg, idx) => {
                const isLastSlimane =
                  msg.role === "slimane" && !isThinking &&
                  idx === messages.map((m) => m.role).lastIndexOf("slimane");
                return (
                  <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "slimane" && <SlimaneAvatar mood="happy" size="sm" />}
                    <div className="max-w-[82%] space-y-2">
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-navy-700 text-white rounded-br-sm"
                          : "bg-white border border-gold-100/80 text-navy-800 rounded-bl-sm shadow-sm"
                      }`}>
                        {msg.role === "slimane"
                          ? <SimpleMarkdown text={msg.content} />
                          : <span>{msg.content}</span>
                        }
                      </div>
                      {isLastSlimane && msg.quickReplies && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {msg.quickReplies.map((qr) => (
                            <button
                              type="button"
                              key={qr}
                              onClick={() => sendMessage(qr)}
                              className="px-3 py-1.5 bg-navy-50 border border-navy-200/60 text-navy-700 text-xs rounded-full hover:bg-gold-50 hover:border-gold-300 hover:text-navy-800 transition-all font-medium"
                            >
                              {qr}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 bg-navy-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {t("slimane.you")}
                      </div>
                    )}
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex gap-2.5 justify-start">
                  <SlimaneAvatar mood="thinking" size="sm" />
                  <div className="bg-white border border-gold-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:180ms]" />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:360ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gold-100/60 bg-white/80 backdrop-blur-sm flex-shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("slimane.placeholder")}
                  disabled={isThinking}
                  dir="auto"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none bg-cream text-navy-800 placeholder-navy-300 transition disabled:opacity-60"
                />
                <button
                  type="submit"
                  aria-label="Envoyer / Send"
                  disabled={isThinking || !input.trim()}
                  className="w-10 h-10 bg-gradient-to-br from-navy-700 to-navy-800 text-gold-300 rounded-xl flex items-center justify-center hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 transition shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <p className="text-center text-[10px] text-navy-300 mt-2">{t("slimane.disclaimer")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
