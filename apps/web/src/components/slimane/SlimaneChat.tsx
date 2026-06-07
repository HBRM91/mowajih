import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import {} from "../../data/schools";

interface Message {
  role: "user" | "slimane";
  content: string;
  quickReplies?: string[];
  timestamp?: Date;
}

const SlimaneAvatar = ({ mood = "happy", size = "md" }: { mood?: string; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg";
  return (
    <div className={`relative ${sizeClass} rounded-full flex items-center justify-center font-bold shadow-lg transition-all flex-shrink-0 ${
      mood === "thinking"
        ? "bg-gradient-to-br from-gold-300 to-gold-400 animate-pulse"
        : "bg-gradient-to-br from-gold-400 to-gold-600"
    }`}>
      <span className="text-navy-900 font-heading">S</span>
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

// Slimane's AI knowledge engine
function generateSlimaneReply(userText: string): { text: string; quickReplies?: string[] } {
  const lower = userText.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Questionnaire redirect
  if (/(questionnaire|remplir|formulaire|test|commencer|demarrer|start)/.test(lower)) {
    return {
      text: "Super initiative ! Le questionnaire prend 2 minutes et me permet de te faire un matching ultra-précis avec les écoles marocaines. Tu gagneras aussi des XP ! 🎯",
      quickReplies: ["C'est parti !", "Combien de temps ça prend ?", "Quelles infos tu as besoin ?"],
    };
  }

  // Bac SM
  if (/(bac sm|sciences math|maths|mathematiques)/.test(lower)) {
    return {
      text: "Bac SM, la filière reine au Maroc ! 🧮 Voici les deux grandes voies :\n\n**Voie CPGE (recommandée pour ingénierie) :**\nBac SM → CPGE 2 ans (MP/PSI) → Concours CNC → EMI, EHTP, ENSIAS, INPT, ENSA\nSeuil CPGE : mention AB (12/20) minimum, mention B/TB pour les tops.\n\n**Voie directe bac :**\n→ ISCAE (seuil 17.97/20), UM6P (dossier), UIR (dossier), HEM, ENCG TAFEM (12/20)\n→ Universités publiques : FSJES, FS (inscription libre)\n\nTu as quelle mention au bac ?",
      quickReplies: ["Je veux faire ingénierie (CPGE)", "Je veux faire business (ISCAE/ENCG)", "Mention TB 16+", "Mention AB 12-14"],
    };
  }

  // Bac PC
  if (/(bac pc|physique.chimie|pc )/.test(lower)) {
    return {
      text: "Bac PC — une filière polyvalente et très demandée ! ⚛️ Tu peux accéder aux meilleures écoles d'ingénieurs : EMI, EHTP, ENSIAS, INPT, ENSA, UIR. Pour la médecine, la FMP te reste accessible avec SVT en complément. Quelle est ta note générale ?",
      quickReplies: ["Médecine avec PC", "Ingénierie avec PC", "Quelle est la différence SM/PC ?", "Mon profil PC"],
    };
  }

  // Bac SVT
  if (/(bac svt|svt|biologie|biochimie)/.test(lower)) {
    return {
      text: "Bac SVT, la porte vers la santé et les sciences du vivant ! 🧬 Tes principales options : Médecine/Pharmacie (FMP Rabat, Casablanca, Fès, Marrakech), Agronomie (IAV Hassan II), Sciences infirmières (ISPITS), ou des universités privées. La FMP est très sélective (concours national). Tu vises quoi ?",
      quickReplies: ["Je veux faire médecine", "Je veux faire pharmacie", "Sciences infirmières", "Agronomie et vét."],
    };
  }

  // Bac SE
  if (/(bac se|sciences eco|economique|commerce|business|gestion)/.test(lower)) {
    return {
      text: "Bac SE — idéal pour le business et l'économie ! 📊 Tes meilleures options : ENCG (12 campus au Maroc, gratuit ou presque), ISCAE (la grande école publique de commerce), HEM Business School, FSJES dans une université publique. La filière SE ouvre aussi l'accès aux licences économie dans toutes les universités.",
      quickReplies: ["Comment intégrer ENCG ?", "ISCAE vs HEM", "FSJES gratuite ?", "Budget 20K-30K MAD"],
    };
  }

  // Bac STI
  if (/(bac sti|sciences techniques|electrotechnique|electronique|technique)/.test(lower)) {
    return {
      text: "Bac STI — parfait pour l'ingénierie technique ! 🔧 Tu peux accéder aux ENSA, CPGE TSI (→ grandes écoles d'ingénieurs), ESITH (textile), EMSI et d'autres écoles privées. Avec une mention TB, les CPGE TSI te mèneront aux meilleures écoles. Tu vises quelle région ?",
      quickReplies: ["CPGE TSI c'est quoi ?", "ENSA avec STI", "Maroc ou France ?", "Écoles privées STI"],
    };
  }

  // Médecine
  if (/(medecine|docteur|chirurgie|pharmacy|pharmacie|dentaire|fmp|chu|urgences)/.test(lower)) {
    return {
      text: "La médecine au Maroc, c'est 7 ans intenses mais une carrière noble et stable ! 🏥\n\n**Publique (quasi gratuit) :** FMP Rabat, Casablanca, Fès, Marrakech, Oujda — concours national sélectif.\n• Seuil d'accès : **13/20** (formule : 75% note nationale + 25% note régionale)\n• Épreuve : 2h écrit (SVT, Physique, Chimie, Maths)\n• Bacs requis : SVT ou PC obligatoire\n\n**Privée :** UPF Fès, UPM Marrakech, UPCI Casablanca — admission sur dossier, 80K-150K MAD/an.\n\nQuelle ville tu préfères ?",
      quickReplies: ["FMP Rabat ou Casablanca ?", "Médecine privée coûts", "Préparer le concours FMP", "Pharmacie vs Médecine"],
    };
  }

  // EMI specifically
  if (/(emi|mohammadia|ecole mohammadia)/.test(lower)) {
    return {
      text: "EMI — École Mohammadia d'Ingénieurs 🏆 La plus grande et prestigieuse école d'ingénieurs publique du Maroc !\n\n• Filières : GC, GE, GI, GM, GP, Génie des Procédés\n• Accès : **UNIQUEMENT** via 2 ans CPGE (MP/PSI/TSI) + Concours National CNC. Il n'y a pas d'accès direct bac.\n• Parcours : Bac SM/PC/STI → CPGE 2 ans → CNC → EMI\n• 548 places ouvertes chaque année\n• Coût : Quasi gratuit (frais symboliques)\n• Alumni : OCP, CDG, ONEE, BMCE...\n\nTu es en quelle année scolaire ?",
      quickReplies: ["C'est quoi la CPGE ?", "EMI vs EHTP", "EMI vs ENSIAS", "Quel classement CNC pour EMI ?"],
    };
  }

  // EHTP
  if (/(ehtp|hassania|travaux publics)/.test(lower)) {
    return {
      text: "EHTP — École Hassania des Travaux Publics 🏗️ Sous tutelle du Ministère du Transport, excellence pour l'infrastructure marocaine !\n\n• Accès : **Uniquement via CPGE 2 ans (MP/PSI) + CNC.** Pas d'entrée directe bac.\n• Parcours : Bac SM/PC → CPGE (Moulay Youssef, Louis Massignon...) → CNC → EHTP\n• 300 places\n• Spécialités : GC, GE, Informatique, Transport & Logistique\n• Coût : 5000-15000 MAD/an\n• Double diplôme France possible\n\nTu vises CPGE quelle filière ?",
      quickReplies: ["EHTP vs EMI", "CPGE pour EHTP", "Spécialités EHTP", "Frais EHTP exacts"],
    };
  }

  // UM6P
  if (/(um6p|mohammed vi|polytechnique|ben guerir)/.test(lower)) {
    return {
      text: "UM6P — Université Mohammed VI Polytechnique 🌍 La 'Harvard du Maroc' selon certains ! Fondée par l'OCP Group à Ben Guerir.\n\n• Enseignement : 100% anglais + français\n• Filières : Data Science, Computer Science, Agronomie, Architecture, Business\n• Coût : 45K-100K MAD/an MAIS bourses très généreuses (jusqu'à 100% pour les bons profils)\n• Campus : 150 hectares ultramoderne\n• Classement : Top 5 Afrique\n\nTu as quel profil ?",
      quickReplies: ["Bourses UM6P comment postuler ?", "UM6P vs UIR", "Filières UM6P disponibles", "Vivre à Ben Guerir ?"],
    };
  }

  // UIR
  if (/(uir|universite internationale de rabat|sala al jadida)/.test(lower)) {
    return {
      text: "UIR — Université Internationale de Rabat 🎓 Université privée trilingue (AR/FR/EN) à Sala Al Jadida !\n\n• Accréditations CTI (ingénieurs) + doubles diplômes France/Canada\n• Filières : Ingénierie, Business, Droit, Architecture, Aéronautique\n• Coût : 30K-70K MAD/an\n• Bourses mérite disponibles\n• Campus smart de 25 hectares\n• Accès : Bac mention AB + dossier\n\nQuelle filière t'intéresse à l'UIR ?",
      quickReplies: ["Aéronautique UIR", "UIR vs Mundiapolis", "Bourses UIR", "Accréditation CTI expliquée"],
    };
  }

  // ENCG
  if (/(encg|nationale de commerce|ecole commerce|tafem|cursussup)/.test(lower)) {
    return {
      text: "Les ENCG — Écoles Nationales de Commerce et de Gestion 📊 11 campus au Maroc, quasi gratuit !\n\n• Villes : Casablanca, Agadir, Tanger, Fès, Marrakech, Oujda, Settat, Kénitra...\n• **Accès TAFEM :** pré-sélection bac (12/20 minimum en SE/SM, ou 14/20 en PC/SVT) puis épreuve QCM écrite\n• Coût : 5K-12K MAD/an\n• Inscription sur **cursussup.gov.ma**\n• Bacs : SE, SH, SM, PC, L\n\nLes ENCG sont une excellente option publique à coût réduit. Quelle ville tu vises ?",
      quickReplies: ["Seuil ENCG Casablanca", "ENCG vs HEM", "ENCG Agadir vs Tanger", "Inscription sur cursussup ?"],
    };
  }

  // ISCAE
  if (/(iscae|commerce administration|grande ecole commerce publique)/.test(lower)) {
    return {
      text: "ISCAE — Institut Supérieur de Commerce et d'Administration des Entreprises 📊 La grande école de commerce publique du Maroc !\n\n• Seuils très élevés par filière bac :\n  - SE : **17.44/20** min | SM : **17.97/20** | SGC : **17.42/20**\n  - SVT : **18.23/20** | STI : **18.82/20** | PC : **18.67/20**\n• Âge : maximum 21 ans au 31/12 de l'année d'inscription\n• Formule : 75% note nationale + 25% note régionale\n• Coût : Quasi gratuit\n• 2 campus : Casablanca + Rabat\n\nC'est l'une des admissions les plus sélectives du Maroc. Tu as quelle mention ?",
      quickReplies: ["ISCAE vs ENCG", "Mon profil pour ISCAE", "ISCAE programmes MBA", "Chances avec 17/20 ?"],
    };
  }

  // HEM
  if (/(hem|business school|hem )/.test(lower)) {
    return {
      text: "HEM Business School 🎩 La première école privée de management au Maroc, accréditée AACSB !\n\n• 5 campus : Casablanca, Rabat, Marrakech, Fès, Tanger\n• Programmes : Grande École (3 ans + 2 ans spé), MBA, Bachelor\n• Coût : 35K-65K MAD/an\n• Alumni : +12 000 dirigeants dans les grandes entreprises marocaines\n• Partenariats internationaux : EM Lyon, Kedge, ESCP\n• Accès : Dossier + entretien (mention AB minimum)\n\nQuelle spécialité t'intéresse ?",
      quickReplies: ["Finance HEM", "Marketing Digital HEM", "HEM vs ENCG", "Bourse HEM ?"],
    };
  }

  // ENSA
  if (/(ensa|sciences appliquees|nationale sciences appliquees)/.test(lower)) {
    return {
      text: "Les ENSA — Écoles Nationales des Sciences Appliquées 🏛️ Réseau de 11 écoles d'ingénieurs publiques et gratuites au Maroc !\n\n• Villes : Agadir, Fès, Casablanca, Marrakech, Kénitra, Tanger, Oujda, Béni Mellal, El Jadida, Berrechid, Tétouan\n• Accès : **Uniquement via 2 ans CPGE (MP/PSI/TSI) + Concours CNC.** Il n'y a pas d'accès direct bac.\n• Parcours : Bac SM/PC/STI → CPGE 2 ans → CNC → ENSA\n• Coût : **GRATUIT** + bourse CNOUS possible\n\nLes ENSA sont accessibles à tous les bacheliers scientifiques capables d'intégrer une CPGE. Quelle ville t'intéresse ?",
      quickReplies: ["ENSA Casablanca vs Fès", "Comment intégrer une CPGE ?", "ENSA Agadir (Souss)", "ENSA vs EMSI sans CPGE ?"],
    };
  }

  // CPGE / Classes prépa
  if (/(cpge|classe prepa|prepas|preparation aux grandes ecoles|mp|pc|psI|maths sup)/.test(lower)) {
    return {
      text: "Les CPGE — Classes Préparatoires aux Grandes Écoles 📐 La voie royale pour accéder aux meilleures écoles d'ingénieurs !\n\n**Filières :**\n• MP/MP* : Maths-Physique (→ EMI, EHTP, concours France)\n• PC/PC* : Physique-Chimie (→ EMI, EHTP, ENSA)\n• PSI : Physique-Sciences de l'Ingénieur\n• TSI : Technologie pour Bac STI\n• BCPST : Bio-Chimie-Physique-Sciences Terre (→ IAV)\n\n**Meilleures CPGE Maroc :** Moulay Youssef Rabat, Louis Massignon Casablanca, Ibn Ghazi Casa\n\nSeuil : 16+/20, gratuit. 2 ans très intensifs.",
      quickReplies: ["CPGE MP ou PC ?", "Comment intégrer une CPGE ?", "CPGE puis EMI ?", "CPGE Maroc vs France ?"],
    };
  }

  // Budget / Coûts
  if (/(budget|cout|prix|frais|scolarite|argent|cher|gratuit|bourse)/.test(lower)) {
    return {
      text: "Voici le panorama des coûts au Maroc 💰\n\n**Gratuit (ou presque) :**\n• Universités publiques : 0-1500 MAD/an\n• ENSA, EMI, EHTP : 0-5000 MAD/an\n• ENCG : 5000-12000 MAD/an\n• CPGE : Gratuit\n\n**Privé abordable :**\n• EMSI : 20K-40K MAD/an\n• ESISA, ESIG : 15K-35K MAD/an\n\n**Privé premium :**\n• UIR : 30K-70K MAD\n• HEM : 35K-65K MAD\n• UM6P : 45K-100K MAD (bourses !)\n• Al Akhawayn : 80K-130K MAD (bourses 50-100%)\n\nTon budget familial est dans quelle fourchette ?",
      quickReplies: ["Budget moins de 20K MAD", "Budget 20K-50K MAD", "Budget 50K+ MAD", "Comment avoir une bourse ?"],
    };
  }

  // Casablanca
  if (/(casablanca|casa|dar beida)/.test(lower)) {
    return {
      text: "Casablanca — la capitale économique du Maroc ! 🌆 Excellente ville pour étudier avec un marché de l'emploi sans pareil.\n\n**Top écoles à Casa :**\n• EHTP ⭐ (Ingénierie, élite)\n• ISCAE (Business, élite publique)\n• ENCG Casablanca (Business, sélectif)\n• Mundiapolis (Multi-filières, privé)\n• EMSI Casa (Ingénierie, accessible)\n• HEM Casablanca (Business, premium)\n• ESITH (Textile, spécialisé)\n\nQuelle filière tu vises à Casa ?",
      quickReplies: ["Ingénierie à Casablanca", "Business à Casablanca", "Médecine à Casablanca", "Coût de vie Casa"],
    };
  }

  // Rabat
  if (/(rabat|sale|salé|sala)/.test(lower)) {
    return {
      text: "Rabat — la capitale politique et ville des grandes écoles publiques ! 🏛️\n\n**Top écoles à Rabat :**\n• EMI ⭐⭐ (Ingénierie, élite nationale)\n• ENSIAS ⭐⭐ (Informatique, élite)\n• INPT ⭐ (Télécoms, élite)\n• ENIM ⭐ (Mines, élite)\n• ISCAE Rabat (Business)\n• INSEA (Statistiques)\n• IAV Hassan II (Agro/Vét)\n• ENA (Architecture)\n• UIR (Sala Al Jadida, multi-filières)\n• FMP Rabat (Médecine)\n\nRabat est LE hub des grandes écoles publiques. Quelle école te tente ?",
      quickReplies: ["EMI admission", "ENSIAS comment y entrer ?", "UIR ou ENSA Rabat ?", "Logement à Rabat"],
    };
  }

  // Marrakech
  if (/(marrakech|marrakesh|ocre)/.test(lower)) {
    return {
      text: "Marrakech — la ville ocre en plein essor académique ! 🌴\n\n**Écoles à Marrakech :**\n• ENSA Marrakech (Ingénierie publique gratuit)\n• ENCG Marrakech (Business)\n• UPM (Médecine + Multi-filières, privé)\n• HEM Marrakech (Business premium)\n• EMSI Marrakech\n• Proche de UM6P Ben Guerir (40 min)\n• ENA Marrakech (Architecture)\n\nAvantages : Ville internationale, secteur tourisme dynamique, coût de vie modéré. Quelle filière ?",
      quickReplies: ["Tourisme à Marrakech", "ENSA Marrakech", "UPM médecine", "UM6P depuis Marrakech"],
    };
  }

  // Fès
  if (/(fes|fès|fez)/.test(lower)) {
    return {
      text: "Fès — la capitale universitaire et spirituelle du Maroc ! 📿\n\n**Écoles à Fès :**\n• ENSA Fès (Ingénierie publique gratuit)\n• ENCG Fès (Business)\n• UPF (Médecine + Multi, privé, 20K-45K/an)\n• ESISA (Informatique)\n• Université Sidi Mohammed Ben Abdallah (public)\n• FMP Fès (Médecine publique)\n• Al Akhawayn Ifrane (45 min, 100% anglais)\n\nFès : coût de vie parmi les plus bas, ville très étudiante. Quelle filière ?",
      quickReplies: ["ENSA Fès concours", "UPF médecine coûts", "Al Akhawayn depuis Fès", "Bac SM à Fès"],
    };
  }

  // Stress / anxiété / peur
  if (/(peur|stress|anxieux|anxiete|stresse|inquiet|perdu|aide|confused|paniq)/.test(lower)) {
    return {
      text: "Hé, respire ! 🌟 C'est tout à fait normal de se sentir perdu à 17-18 ans face à l'avenir. Chaque année, des milliers de bacheliers marocains ressentent la même chose.\n\nVoici la bonne nouvelle : il n'y a pas de mauvais choix, il y a juste des choix mieux adaptés à TON profil. C'est exactement ce que je suis là pour t'aider à trouver.\n\nDis-moi juste ta filière Bac et ta ville, et je construis avec toi une feuille de route claire. Étape par étape. 💪",
      quickReplies: ["Commencer par ma filière Bac", "Quels critères sont importants ?", "Que faire si j'ai pas de mention ?", "Aide-moi à me décider"],
    };
  }

  // Mention faible / pas de mention
  if (/(passable|mention passable|pas de mention|10|11|moins de 12|12.*bac|faible|redouble)/.test(lower)) {
    return {
      text: "Une mention passable, c'est pas la fin du monde ! Je vais être honnête avec toi 😊\n\nCe qui t'est accessible :\n✅ Universités publiques (FSJES, FS, FST...) — gratuit et sans concours\n✅ ISTA/OFPPT — formations technicien spécialisé 2 ans\n✅ Certaines écoles privées (EMSI, ESIG, ESISA) acceptent dès 10/20\n✅ BTS (Brevet Technicien Supérieur) — très bonne insertion pro\n\nL'important : quelle est ta passion ? C'est ça qui compte pour l'avenir.",
      quickReplies: ["Université publique options", "OFPPT c'est quoi ?", "BTS ou Licence ?", "Reconversion possible"],
    };
  }

  // Salaires / débouchés
  if (/(salaire|revenu|argent apres|debouche|emploi|travail|trouver un job|marche travail)/.test(lower)) {
    return {
      text: "Super question stratégique ! Voici les salaires de départ au Maroc selon le diplôme 💼\n\n**Ingénieurs (EMI, EHTP, ENSIAS) :** 12K-18K MAD/mois\n**IT/Dev (ENSIAS, INPT, EMSI) :** 8K-15K MAD/mois\n**Business (ISCAE, HEM) :** 7K-12K MAD/mois\n**Médecin :** 15K-25K MAD/mois (public) / 30K+ (privé)\n**Architecte :** 8K-15K MAD/mois\n**ENCG/ENCG :** 6K-10K MAD/mois\n\nLes secteurs les plus porteurs : IT, Finance, Ingénierie Civil, Santé, Automobile (Tanger/Kénitra).",
      quickReplies: ["Secteurs qui recrutent 2025 ?", "Salaires ingénieurs IT", "Partir à l'étranger après ?", "Meilleures villes pour trouver emploi"],
    };
  }

  // Étranger / France / Canada
  if (/(france|canada|etranger|partir|europe|usa|belgique|montreal|paris)/.test(lower)) {
    return {
      text: "L'option étranger ! Voici les chemins les plus empruntés par les bacheliers marocains 🌍\n\n**France :**\n• CPGE Maroc → Grandes écoles françaises (Polytechnique, CentraleSupélec, Arts et Métiers)\n• Campus France : Licence/Master dans universités françaises\n• Parcoursup accessible pour les bacheliers marocains\n\n**Canada :**\n• Québec : Universités ouvertes (Montréal, Laval, Sherbrooke)\n• Frais : 15K-30K CAD/an\n\n**Conseil Slimane :** Commence par un diplôme au Maroc (ENSA, EMI, UIR...) puis Master à l'étranger. C'est souvent le chemin le plus rapide et le moins cher.",
      quickReplies: ["CPGE Maroc → France", "Canada comment s'inscrire ?", "UM6P puis étranger", "Budget pour partir en France"],
    };
  }

  // XP / gamification
  if (/(xp|points|badge|niveau|level|game|jeu|score)/.test(lower)) {
    return {
      text: "Ah, tu aimes le côté gamification ! 🎮 Voici comment ça marche sur JAD2 TAWJIH :\n\n• **+10 XP** : Choisir ta filière Bac\n• **+15 XP** : Renseigner tes notes\n• **+15 XP** : Compléter ton profil\n• **+20 XP** : Accepter les conditions\n• **+30 XP** : Consulter tes résultats\n\n**Badges à débloquer :** 🌟 Nouveau, 🔍 Explorateur, 🎯 Matcheur, 🔓 Héros, ♟️ Stratège\n\nPlus tu progresses, plus tu montes en niveau. Le niveau max actuel est 10 (Maître de l'Orientation). Prêt à jouer ?",
      quickReplies: ["Commencer et gagner des XP", "Montrer mon profil de jeu", "Je veux le badge Héros", "Combien de XP pour le niveau 5 ?"],
    };
  }

  // Default response with intelligent fallback
  const greetings = ["salam", "bonjour", "salut", "hello", "hi", "slt", "bonsoir", "marhaba"];
  if (greetings.some((g) => lower.includes(g))) {
    return {
      text: "Salam ! 👋 Je suis Slimane, ton conseiller académique IA. Je connais tous les établissements du Maroc — des ENSA gratuites aux grandes universités privées comme UM6P ou UIR.\n\nPour te donner les meilleurs conseils, dis-moi :\n1️⃣ Ta filière Bac (SM, PC, SVT, SE...)\n2️⃣ Ton niveau (mention, note générale)\n3️⃣ Ta ville ou région\n\nOu lance directement le questionnaire et je t'oriente en 2 minutes ! 🎯",
      quickReplies: ["Lancer le questionnaire", "Je suis Bac SM", "Je suis Bac SE", "Je veux faire médecine"],
    };
  }

  return {
    text: `Bonne question ! Pour te donner les meilleures recommandations personnalisées, j'ai besoin de connaître ta filière Bac et ta ville. Autrement, dis-moi ce qui t'intéresse : ingénierie, médecine, business, architecture... et je te dresse la liste des écoles adaptées à ton profil.`,
    quickReplies: ["Lancer le questionnaire (2 min)", "Je veux faire ingénierie", "Je veux faire business", "Aide-moi à choisir"],
  };
}

let openCallback: (() => void) | null = null;
export function openSlimane() {
  openCallback?.();
}

export default function SlimaneChat() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "slimane",
      content: "Salam ! 👋 Je suis Slimane, ton conseiller académique IA pour le Maroc. Je connais toutes les écoles — ENSA, ENCG, EMI, EHTP, UM6P, UIR, HEM et bien plus. Pose-moi n'importe quelle question sur ton orientation !",
      quickReplies: ["Je suis Bac SM/PC", "Je veux faire médecine", "Quelles écoles à Casablanca ?", "Passer le questionnaire"],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mood, setMood] = useState("happy");
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSlimaneMode = useFormStore((s) => s.setSlimaneMode);

  // Register open callback for external trigger
  useEffect(() => {
    openCallback = () => {
      setOpen(true);
      setUnread(0);
    };
    (window as any).__slimaneOpen = () => {
      setOpen(true);
      setUnread(0);
    };
    return () => {
      openCallback = null;
    };
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
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setMood("thinking");

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      setIsThinking(false);
      setMood("happy");
      const reply = generateSlimaneReply(text);
      const slimaneMsg: Message = {
        role: "slimane",
        content: reply.text,
        quickReplies: reply.quickReplies,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, slimaneMsg]);
      if (!open) setUnread((n) => n + 1);
    }, delay);
  }, [isThinking, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
          >
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.4 }}
              className="hidden group-hover:flex items-center gap-2 bg-navy-800 text-gold-200 text-xs px-3 py-2 rounded-xl whitespace-nowrap shadow-xl border border-gold-500/20"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Slimane — Conseiller IA
            </motion.div>
            <div className="relative">
              <SlimaneAvatar mood="happy" />
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-gold-400/20 animate-ping" />
              {/* Unread badge */}
              {unread > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-cream">
                  {unread}
                </div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[440px] max-w-[calc(100vw-1.5rem)] h-[640px] max-h-[85vh] bg-parchment rounded-3xl shadow-2xl border border-gold-200/40 flex flex-col overflow-hidden"
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
                    {isThinking ? "En train d'analyser..." : "Conseiller académique IA · En ligne"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSlimaneMode(true); setOpen(false); }}
                  className="text-xs bg-gold-500/15 text-gold-300 px-3 py-1.5 rounded-full hover:bg-gold-500/25 border border-gold-500/20 transition font-medium"
                >
                  📋 Questionnaire
                </button>
                <button
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
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "slimane" && <SlimaneAvatar mood="happy" size="sm" />}
                  <div className={`max-w-[86%] space-y-2`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-navy-700 text-white rounded-br-md shadow-sm"
                          : "bg-white border border-gold-100 text-navy-800 rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.quickReplies && msg.role === "slimane" && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            onClick={() => sendMessage(qr)}
                            className="px-3 py-1.5 bg-gold-50 border border-gold-200 text-navy-700 text-xs rounded-full hover:bg-gold-100 hover:border-gold-300 transition-all font-medium"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      Toi
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex gap-2.5 justify-start">
                  <SlimaneAvatar mood="thinking" size="sm" />
                  <div className="bg-white border border-gold-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "180ms" }} />
                      <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "360ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-gold-100/60 bg-white/80 backdrop-blur-sm flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("slimane.placeholder")}
                  disabled={isThinking}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none bg-cream text-navy-800 placeholder-navy-300 transition disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isThinking || !input.trim()}
                  className="w-10 h-10 bg-gradient-to-br from-navy-700 to-navy-800 text-gold-300 rounded-xl flex items-center justify-center hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 transition shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <p className="text-center text-[10px] text-navy-300 mt-2">
                Slimane est une IA — vérifie les informations officielles avant de décider
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
