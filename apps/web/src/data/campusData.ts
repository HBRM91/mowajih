// Campus, housing & student life data — Morocco 2025/2026
// Source: JAD2 Advisory research + official institution data

export type CampusType = "integrated" | "urban_major" | "urban_secondary" | "regional";

export interface I18nText {
  fr: string;
  ar: string;
  en: string;
}

export interface HousingRange {
  label: I18nText;
  cost: string; // always in MAD/month — language-agnostic numbers
}

export interface CampusInfo {
  type: CampusType;
  // For integrated campuses (UM6P, UIR, UM6SS, AUI)
  onCampus?: {
    available: boolean;
    cost: string;
    facilities: I18nText[];
    girlsWing: boolean; // separate girls' residence
  };
  housing: HousingRange[];
  neighborhoods?: string[]; // proper names — same across languages
  safety: I18nText;
  transport?: I18nText;
  scholarshipNote?: I18nText;
}

// ─── Integrated campus schools ────────────────────────────────────────────────

export const INTEGRATED_CAMPUSES: Record<string, CampusInfo> = {
  "um6p": {
    type: "integrated",
    onCampus: {
      available: true,
      cost: "1 900 – 2 300 MAD/mois",
      facilities: [
        { fr: "Résidences modernes (chambre individuelle ou partagée)", ar: "مساكن حديثة (غرفة فردية أو مشتركة)", en: "Modern dorms (single or shared rooms)" },
        { fr: "Restaurants subventionnés (~1 800 MAD/mois, 3 repas)", ar: "مطاعم مدعومة (~1 800 درهم/شهر، 3 وجبات)", en: "Subsidised restaurants (~1,800 MAD/month, 3 meals)" },
        { fr: "Piscine olympique, salles de gym", ar: "مسبح أولمبي وصالات رياضية", en: "Olympic pool, gyms" },
        { fr: "Wi-Fi haut débit, sécurité 24h/24", ar: "إنترنت عالي السرعة، حراسة 24/24", en: "High-speed Wi-Fi, 24/7 security" },
      ],
      girlsWing: true,
    },
    housing: [
      { label: { fr: "Sur campus (chambre partagée)", ar: "داخل الحرم (غرفة مشتركة)", en: "On campus (shared room)" }, cost: "1 900 – 2 300 MAD/mois" },
      { label: { fr: "Ville Verte (off-campus)", ar: "المدينة الخضراء (خارج الحرم)", en: "Ville Verte (off-campus)" }, cost: "3 000 – 4 500 MAD/mois" },
    ],
    neighborhoods: ["Benguerir Ville Verte"],
    safety: {
      fr: "Campus entièrement sécurisé, caméras et gardiens 24h/24. Résidences femmes séparées avec accès contrôlé. L'un des campus les plus sûrs d'Afrique.",
      ar: "حرم آمن بالكامل، كاميرات وحراسة 24/24. مساكن منفصلة للطالبات مع وصول مُتحكَّم به. أحد أكثر الحرمات أماناً في أفريقيا.",
      en: "Fully secured campus with cameras and guards 24/7. Separate women's residences with controlled access. One of the safest campuses in Africa.",
    },
    transport: {
      fr: "Navettes gratuites UM6P entre le campus et les villes voisines (Marrakech, Casablanca). Benguerir est accessible par train depuis Casa (~1h30).",
      ar: "حافلات مكوكية مجانية بين الحرم والمدن المجاورة (مراكش، الدار البيضاء). بنجرير يُصل إليه بالقطار من كازا (~1h30).",
      en: "Free UM6P shuttles between campus and nearby cities (Marrakech, Casablanca). Benguerir is accessible by train from Casa (~1h30).",
    },
    scholarshipNote: {
      fr: "Plus de 70% des étudiants reçoivent une aide financière. Les meilleurs profils obtiennent une bourse 100% (scolarité + logement + restauration).",
      ar: "أكثر من 70% من الطلاب يتلقون دعماً مالياً. أفضل الملفات تحصل على منحة 100% (رسوم + سكن + إطعام).",
      en: "Over 70% of students receive financial aid. Top profiles get a 100% scholarship covering tuition, housing and meals.",
    },
  },

  "uir": {
    type: "integrated",
    onCampus: {
      available: true,
      cost: "1 800 – 2 500 MAD/mois",
      facilities: [
        { fr: "6 résidences modernes directement sur campus", ar: "6 مساكن حديثة داخل الحرم مباشرة", en: "6 modern residences directly on campus" },
        { fr: "Mini-marchés, terrains de sport, cafétérias", ar: "مراكز تجارية صغيرة، ملاعب رياضية، مقاصف", en: "Mini-markets, sports courts, cafeterias" },
        { fr: "Sécurité 24h/24, accès badge", ar: "حراسة 24/24، دخول ببطاقة", en: "24/7 security, badge access" },
      ],
      girlsWing: true,
    },
    housing: [
      { label: { fr: "Résidence sur campus (chambre double)", ar: "إقامة داخل الحرم (غرفة مزدوجة)", en: "On-campus residence (double room)" }, cost: "1 800 MAD/mois" },
      { label: { fr: "Résidence sur campus (chambre individuelle)", ar: "إقامة داخل الحرم (غرفة فردية)", en: "On-campus residence (single room)" }, cost: "2 500 MAD/mois" },
      { label: { fr: "Sala Al Jadida (off-campus, appart. partagé)", ar: "سلا الجديدة (خارج الحرم، شقة مشتركة)", en: "Sala Al Jadida (off-campus, shared flat)" }, cost: "2 500 – 4 000 MAD/mois" },
    ],
    neighborhoods: ["Sala Al Jadida", "Technopolis"],
    safety: {
      fr: "Zone Technopolis sécurisée. Résidences UIR avec gardiennage 24h/24 et cartes d'accès. Résidences femmes avec aile séparée. Très recommandé pour les étudiantes en 1ère année.",
      ar: "منطقة تكنوبوليس آمنة. مساكن UIR بحراسة 24/24 وبطاقات وصول. جناح منفصل للطالبات. يوصى به بشدة للطالبات في السنة الأولى.",
      en: "Secured Technopolis zone. UIR residences with 24/7 guards and access cards. Separate women's wing. Highly recommended for first-year female students.",
    },
    transport: {
      fr: "Bus UIR réguliers vers Rabat centre (20–30 min). Taxis disponibles depuis Technopolis. Budget transport off-campus ~400–600 MAD/mois.",
      ar: "حافلات UIR منتظمة نحو وسط الرباط (20-30 دقيقة). سيارات أجرة متاحة من تكنوبوليس. ميزانية النقل خارج الحرم ~400-600 درهم/شهر.",
      en: "Regular UIR buses to Rabat centre (20–30 min). Taxis available from Technopolis. Off-campus transport budget ~400–600 MAD/month.",
    },
  },

  "um6ss": {
    type: "integrated",
    onCampus: {
      available: true,
      cost: "2 000 – 3 500 MAD/mois",
      facilities: [
        { fr: "Résidences partenaires (Anfa City I & II, Bouskoura)", ar: "مساكن شريكة (أنفا سيتي I & II، بوسكورة)", en: "Partner residences (Anfa City I & II, Bouskoura)" },
        { fr: "Accès direct CHU Cheikh Khalifa", ar: "وصول مباشر إلى مستشفى الشيخ خليفة", en: "Direct access to Cheikh Khalifa Hospital" },
        { fr: "Salles de simulation clinique ultra-équipées", ar: "قاعات محاكاة سريرية متطورة", en: "State-of-the-art clinical simulation labs" },
      ],
      girlsWing: true,
    },
    housing: [
      { label: { fr: "Résidence partenaire (chambre)", ar: "إقامة شريكة (غرفة)", en: "Partner residence (room)" }, cost: "2 000 – 3 500 MAD/mois" },
      { label: { fr: "Location privée Anfa City", ar: "إيجار خاص أنفا سيتي", en: "Private rental Anfa City" }, cost: "6 000 – 10 000 MAD/mois" },
      { label: { fr: "Location privée Bouskoura", ar: "إيجار خاص بوسكورة", en: "Private rental Bouskoura" }, cost: "4 500 – 7 000 MAD/mois" },
    ],
    neighborhoods: ["Anfa City", "Bouskoura", "Oulfa"],
    safety: {
      fr: "Les résidences partenaires UM6SS sont sécurisées avec digicode et gardien. Anfa City est un quartier résidentiel moderne et calme — très sûr pour les étudiantes. Évite les trajets tardifs en dehors du quartier.",
      ar: "مساكن UM6SS الشريكة محمية برمز دخول وحارس. أنفا سيتي حي سكني حديث وهادئ — آمن جداً للطالبات. تجنبي التنقل في وقت متأخر خارج الحي.",
      en: "UM6SS partner residences are secured with keypad and guard. Anfa City is a modern, quiet residential area — very safe for female students. Avoid late-night travel outside the neighbourhood.",
    },
    transport: {
      fr: "Tramway de Casablanca à proximité. Budget transport ~400–600 MAD/mois. Bouskoura nécessite un véhicule ou covoiturage.",
      ar: "ترامواي الدار البيضاء بالقرب. ميزانية النقل ~400-600 درهم/شهر. بوسكورة تتطلب سيارة أو مشاركة في الركوب.",
      en: "Casablanca tram nearby. Transport budget ~400–600 MAD/month. Bouskoura requires a car or carpooling.",
    },
  },

  "aui": {
    type: "integrated",
    onCampus: {
      available: true,
      cost: "3 200 – 5 000 MAD/mois",
      facilities: [
        { fr: "20+ bâtiments résidentiels (standard à premium)", ar: "20+ مبنى سكني (من عادي إلى مميز)", en: "20+ residential buildings (standard to premium)" },
        { fr: "Studios individuels premium disponibles", ar: "استوديوهات فردية مميزة متاحة", en: "Premium individual studios available" },
        { fr: "Plans de restauration via carte campus", ar: "خطط إطعام عبر بطاقة الحرم", en: "Meal plans via campus card" },
        { fr: "Bibliothèque, salles informatiques, sports", ar: "مكتبة، قاعات حاسوب، رياضة", en: "Library, computer labs, sports" },
      ],
      girlsWing: true,
    },
    housing: [
      { label: { fr: "Chambre standard sur campus", ar: "غرفة عادية داخل الحرم", en: "Standard on-campus room" }, cost: "16 000 MAD/semestre (~3 200/mois)" },
      { label: { fr: "Studio premium sur campus", ar: "استوديو مميز داخل الحرم", en: "Premium on-campus studio" }, cost: "25 000 MAD/semestre (~5 000/mois)" },
      { label: { fr: "Appartement à Ifrane (off-campus, seniors)", ar: "شقة بإفران (خارج الحرم، الطلاب المتقدمون)", en: "Ifrane apartment (off-campus, seniors only)" }, cost: "3 500 – 6 000 MAD/mois" },
    ],
    neighborhoods: ["Ifrane centre (15 min à pied)"],
    safety: {
      fr: "Ifrane est la ville la plus sûre du Maroc — reconnue pour sa propreté et sa tranquillité. Le campus AUI est entièrement clôturé avec contrôle d'accès strict. Idéal pour les étudiantes.",
      ar: "إفران هي أكثر المدن أماناً في المغرب — معروفة بنظافتها وهدوئها. حرم AUI محاط بسياج كامل مع تحكم صارم في الوصول. مثالي للطالبات.",
      en: "Ifrane is Morocco's safest city — known for its cleanliness and tranquillity. AUI campus is fully fenced with strict access control. Ideal for female students.",
    },
    transport: {
      fr: "Navettes CTM entre Ifrane, Fès et Meknès. Ifrane est à 1h de Fès. Budget transport ~300–500 MAD/mois.",
      ar: "حافلات CTM بين إفران وفاس ومكناس. إفران على بُعد ساعة من فاس. ميزانية النقل ~300-500 درهم/شهر.",
      en: "CTM shuttles between Ifrane, Fès and Meknès. Ifrane is 1 hour from Fès. Transport budget ~300–500 MAD/month.",
    },
  },
};

// ─── City housing data for traditional public schools ─────────────────────────

export interface CityHousingData {
  housing: HousingRange[];
  neighborhoods: string[];
  safety: I18nText;
  transport?: I18nText;
  stateDormNote: I18nText;
}

export const CITY_HOUSING: Record<string, CityHousingData> = {
  "Rabat": {
    housing: [
      { label: { fr: "Cité universitaire ONOUSC (sous conditions)", ar: "مدينة جامعية ONOUSC (بشروط)", en: "ONOUSC state dorm (means-tested)" }, cost: "~400 MAD/an" },
      { label: { fr: "Dar Al Talib / Taliba (étudiants ruraux)", ar: "دار الطالب/الطالبة (للطلاب القادمين من القرى)", en: "Dar Al Talib / Taliba (rural students)" }, cost: "Gratuit / Free" },
      { label: { fr: "Résidence privée (Bayt Al Maarif, RU...)", ar: "إقامة خاصة (بيت المعارف، RU...)", en: "Private residence (Bayt Al Maarif, RU...)" }, cost: "2 500 – 4 000 MAD/mois" },
      { label: { fr: "Colocation privée (2–3 étudiants, Agdal/Irfane)", ar: "مشاركة سكن (2-3 طلاب، أكدال/العرفان)", en: "Private flat-share (2–3 students, Agdal/Irfane)" }, cost: "1 800 – 3 000 MAD/pers/mois" },
    ],
    neighborhoods: ["Al Irfane", "Agdal", "Hay Riad", "Souissi"],
    safety: {
      fr: "Rabat est la capitale et globalement sûre. Le quartier Al Irfane (cité universitaire) est encadré. Les résidences privées (Bayt Al Maarif, Résidences Universitaires) sont fortement recommandées pour les étudiantes seules : digicode, gardien et caméras. Agdal est calme et très bien desservi.",
      ar: "الرباط هي العاصمة وآمنة بشكل عام. حي العرفان (المدينة الجامعية) منظم جيداً. الإقامات الخاصة (بيت المعارف، المساكن الجامعية) موصى بها بشدة للطالبات المقيمات وحدهن: شفرة دخول، حارس وكاميرات. أكدال هادئ ومخدوم جيداً.",
      en: "Rabat is the capital and broadly safe. The Al Irfane neighbourhood (university city) is well-supervised. Private residences (Bayt Al Maarif, RU) are strongly recommended for female students living alone: keypad entry, guard and cameras. Agdal is quiet and well-served.",
    },
    transport: {
      fr: "Tramway de Rabat dessert Al Irfane et Agdal. Budget transport ~300–500 MAD/mois.",
      ar: "ترامواي الرباط يخدم العرفان وأكدال. ميزانية النقل ~300-500 درهم/شهر.",
      en: "Rabat tram serves Al Irfane and Agdal. Transport budget ~300–500 MAD/month.",
    },
    stateDormNote: {
      fr: "La Cité Universitaire est très difficile à obtenir — critères stricts (revenus parentaux + distance). Prévoir un hébergement privé si tu viens de hors région.",
      ar: "المدينة الجامعية يصعب الحصول عليها جداً — معايير صارمة (دخل الوالدين + المسافة). يُنصح بتوفير سكن خاص إذا كنت قادماً من خارج المنطقة.",
      en: "The state dorm is very hard to get — strict criteria (parental income + distance). Plan for private housing if you're coming from outside the region.",
    },
  },

  "Casablanca": {
    housing: [
      { label: { fr: "Cité universitaire ONOUSC (sous conditions)", ar: "مدينة جامعية ONOUSC (بشروط)", en: "ONOUSC state dorm (means-tested)" }, cost: "~400 MAD/an" },
      { label: { fr: "Résidence privée (Oasis, El Jadida, Maarif)", ar: "إقامة خاصة (واحة، الجديدة، المعاريف)", en: "Private residence (Oasis, El Jadida, Maarif)" }, cost: "2 500 – 4 000 MAD/mois" },
      { label: { fr: "Colocation (Oasis / Route El Jadida)", ar: "مشاركة سكن (واحة / طريق الجديدة)", en: "Flat-share (Oasis / Route El Jadida)" }, cost: "2 000 – 4 000 MAD/pers/mois" },
      { label: { fr: "Colocation Quartier des Hôpitaux (FMP/FMD)", ar: "مشاركة سكن حي المستشفيات (FMP/FMD)", en: "Flat-share Hospital Quarter (FMP/FMD)" }, cost: "2 500 – 4 500 MAD/pers/mois" },
    ],
    neighborhoods: ["Oasis", "Route d'El Jadida", "Hay Hassani", "Beauséjour", "Quartier des Hôpitaux", "Maarif"],
    safety: {
      fr: "Casa est grande et animée. Les quartiers universitaires (Oasis, El Jadida) sont habitués aux étudiantes. Résidences privées fortement recommandées pour les étudiantes seules : digicode, gardien, caméras. Évite les trajets tardifs en solo. Le tramway est sûr.",
      ar: "الدار البيضاء كبيرة وحيوية. الأحياء الجامعية (واحة، الجديدة) معتادة على الطالبات. الإقامات الخاصة موصى بها بشدة للطالبات المقيمات وحدهن: شفرة دخول، حارس، كاميرات. تجنبي التنقل المتأخر وحدك. الترامواي آمن.",
      en: "Casa is large and lively. University areas (Oasis, El Jadida) are accustomed to female students. Private residences strongly recommended for female students living alone: keypad, guard, cameras. Avoid late-night solo travel. The tram is safe.",
    },
    transport: {
      fr: "Tramway de Casablanca (T1 & T2) dessert Oasis et El Jadida. Budget transport ~400–600 MAD/mois.",
      ar: "ترامواي الدار البيضاء (T1 وT2) يخدم واحة والجديدة. ميزانية النقل ~400-600 درهم/شهر.",
      en: "Casablanca tram (T1 & T2) serves Oasis and El Jadida. Transport budget ~400–600 MAD/month.",
    },
    stateDormNote: {
      fr: "Cité universitaire ONOUSC : places très limitées, critères très stricts. Quasi inaccessible sauf situations de grande précarité.",
      ar: "المدينة الجامعية ONOUSC: أماكن محدودة جداً، معايير صارمة جداً. يكاد يكون غير متاح إلا في حالات الهشاشة الاجتماعية الحادة.",
      en: "ONOUSC state dorm: very limited places, very strict criteria. Almost inaccessible except for cases of severe financial hardship.",
    },
  },

  "Fès": {
    housing: [
      { label: { fr: "Cité universitaire (campus Aïn Chkef)", ar: "مدينة جامعية (حرم عين الشكف)", en: "State dorm (Aïn Chkef campus)" }, cost: "~400 MAD/an" },
      { label: { fr: "Résidence privée", ar: "إقامة خاصة", en: "Private residence" }, cost: "2 000 – 3 500 MAD/mois" },
      { label: { fr: "Colocation (Aïn Chkef, Route Imouzzer)", ar: "مشاركة سكن (عين الشكف، طريق أمزكان)", en: "Flat-share (Aïn Chkef, Route Imouzzer)" }, cost: "1 200 – 2 500 MAD/pers/mois" },
    ],
    neighborhoods: ["Aïn Chkef", "Route d'Imouzzer", "Les Ambassadeurs", "Narjiss"],
    safety: {
      fr: "Fès est une ville étudiante calme et sûre. La zone universitaire d'Aïn Chkef est très organisée. Recommandé pour les étudiantes : loger dans des résidences gardiennées ou en colocation mixte avec d'autres étudiantes du campus.",
      ar: "فاس مدينة جامعية هادئة وآمنة. منطقة عين الشكف الجامعية منظمة جيداً. يُنصح للطالبات: السكن في إقامات ذات حراسة أو في شقق مشتركة مع طالبات أخريات من الحرم.",
      en: "Fès is a quiet, safe student city. The Aïn Chkef university area is well-organised. Recommended for female students: stay in guarded residences or share flats with fellow female students from campus.",
    },
    transport: {
      fr: "Bus universitaires disponibles. Budget transport ~200–350 MAD/mois.",
      ar: "حافلات جامعية متاحة. ميزانية النقل ~200-350 درهم/شهر.",
      en: "University buses available. Transport budget ~200–350 MAD/month.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible sur conditions de ressources. Mieux accessible qu'à Casablanca ou Rabat.",
      ar: "المدينة الجامعية متاحة بشروط الدخل. أكثر قابلية للوصول من الدار البيضاء أو الرباط.",
      en: "State dorm available on means-testing basis. More accessible than Casablanca or Rabat.",
    },
  },

  "Marrakech": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Résidence privée", ar: "إقامة خاصة", en: "Private residence" }, cost: "2 500 – 4 000 MAD/mois" },
      { label: { fr: "Colocation (Guéliz, Massira)", ar: "مشاركة سكن (كيليز، مسيرة)", en: "Flat-share (Guéliz, Massira)" }, cost: "1 500 – 3 000 MAD/pers/mois" },
    ],
    neighborhoods: ["Guéliz", "Massira", "Hay Hassani", "Syba"],
    safety: {
      fr: "Marrakech est sûre dans les zones résidentielles (Guéliz, Massira). Évite la Médina pour le logement étudiant. Résidences privées avec gardien recommandées pour les étudiantes. Le quartier Guéliz est moderne et calme.",
      ar: "مراكش آمنة في المناطق السكنية (كيليز، مسيرة). تجنبي المدينة القديمة للسكن الطلابي. الإقامات الخاصة ذات الحراسة موصى بها للطالبات. حي كيليز حديث وهادئ.",
      en: "Marrakech is safe in residential areas (Guéliz, Massira). Avoid the Medina for student housing. Guarded private residences recommended for female students. Guéliz is a modern, quiet neighbourhood.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible sur conditions de ressources.",
      ar: "المدينة الجامعية متاحة بشروط الدخل.",
      en: "State dorm available on means-testing basis.",
    },
  },

  "Agadir": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Résidence privée", ar: "إقامة خاصة", en: "Private residence" }, cost: "2 000 – 3 500 MAD/mois" },
      { label: { fr: "Colocation (Quartier Dakhla — quartier 100% étudiant)", ar: "مشاركة سكن (حي الداخلة — حي طلابي 100%)", en: "Flat-share (Dakhla Quarter — 100% student area)" }, cost: "1 000 – 2 500 MAD/pers/mois" },
    ],
    neighborhoods: ["Quartier Dakhla", "Salam", "Tilila"],
    safety: {
      fr: "Agadir est considérée comme l'une des villes les plus sûres du Maroc pour les étudiantes. Le quartier Dakhla est entièrement dédié à la vie étudiante — cafés, épiceries, pharmacies et résidences pour étudiants. Très recommandé.",
      ar: "تُعدّ أكادير من أكثر المدن أماناً في المغرب للطالبات. حي الداخلة مكرّس بالكامل للحياة الطلابية — مقاهي، بقالات، صيدليات ومساكن للطلاب. موصى به للغاية.",
      en: "Agadir is considered one of Morocco's safest cities for female students. The Dakhla quarter is entirely dedicated to student life — cafés, groceries, pharmacies and student residences. Highly recommended.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible sur conditions de ressources.",
      ar: "المدينة الجامعية متاحة بشروط الدخل.",
      en: "State dorm available on means-testing basis.",
    },
  },

  "Tanger": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Résidence privée", ar: "إقامة خاصة", en: "Private residence" }, cost: "2 000 – 3 500 MAD/mois" },
      { label: { fr: "Colocation (Boukhalef, Ibn Batouta)", ar: "مشاركة سكن (بوخالف، ابن بطوطة)", en: "Flat-share (Boukhalef, Ibn Batouta)" }, cost: "1 200 – 2 500 MAD/pers/mois" },
    ],
    neighborhoods: ["Boukhalef", "Ibn Batouta", "Malabata"],
    safety: {
      fr: "Le pôle universitaire de Boukhalef est moderne et sécurisé. Les résidences privées à proximité sont équipées de digicodes et gardiens. Tanger est en fort développement — ville dynamique et sûre pour les étudiantes dans les quartiers nord.",
      ar: "القطب الجامعي ببوخالف حديث وآمن. الإقامات الخاصة القريبة مجهزة بشفرات دخول وحراس. طنجة في تطور قوي — مدينة نشيطة وآمنة للطالبات في الأحياء الشمالية.",
      en: "The Boukhalef university hub is modern and secured. Nearby private residences have keypad entry and guards. Tanger is rapidly developing — a dynamic and safe city for female students in the northern districts.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible sur conditions de ressources.",
      ar: "المدينة الجامعية متاحة بشروط الدخل.",
      en: "State dorm available on means-testing basis.",
    },
  },

  "Oujda": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Colocation (centre-ville, très accessible)", ar: "مشاركة سكن (وسط المدينة، ميسور جداً)", en: "Flat-share (city centre, very affordable)" }, cost: "800 – 2 000 MAD/pers/mois" },
    ],
    neighborhoods: ["Hay Salam", "Centre ville", "Cité universitaire"],
    safety: {
      fr: "Oujda est calme et très sûre pour les étudiantes. Coût de vie parmi les plus bas du Maroc. Idéal pour un budget limité.",
      ar: "وجدة هادئة وآمنة جداً للطالبات. تكلفة المعيشة من بين الأدنى في المغرب. مثالية لميزانية محدودة.",
      en: "Oujda is quiet and very safe for female students. Cost of living among the lowest in Morocco. Ideal for a tight budget.",
    },
    stateDormNote: {
      fr: "Cité universitaire accessible — conditions de ressources standard.",
      ar: "المدينة الجامعية متاحة — شروط الدخل العادية.",
      en: "State dorm accessible — standard means-testing conditions.",
    },
  },

  "Meknès": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Colocation privée (très abordable)", ar: "مشاركة سكن خاصة (ميسورة جداً)", en: "Private flat-share (very affordable)" }, cost: "800 – 2 000 MAD/pers/mois" },
    ],
    neighborhoods: ["Hamria", "Al Qods", "Centre ville"],
    safety: {
      fr: "Meknès est très sûre et bon marché. Excellent choix pour les étudiantes avec un budget limité.",
      ar: "مكناس آمنة جداً وغير مكلفة. خيار ممتاز للطالبات ذوات الميزانية المحدودة.",
      en: "Meknès is very safe and inexpensive. Excellent choice for female students on a tight budget.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible sur conditions de ressources.",
      ar: "المدينة الجامعية متاحة بشروط الدخل.",
      en: "State dorm available on means-testing basis.",
    },
  },

  "Settat": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Colocation (très abordable, petite ville)", ar: "مشاركة سكن (ميسور جداً، مدينة صغيرة)", en: "Flat-share (very affordable, small city)" }, cost: "600 – 1 500 MAD/pers/mois" },
    ],
    neighborhoods: ["Centre ville", "Hay Mohammadi"],
    safety: {
      fr: "Settat est une petite ville calme et très sûre. Coût de vie très bas.",
      ar: "سطات مدينة صغيرة هادئة وآمنة جداً. تكلفة معيشة منخفضة جداً.",
      en: "Settat is a small, quiet and very safe city. Very low cost of living.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible.",
      ar: "المدينة الجامعية متاحة.",
      en: "State dorm available.",
    },
  },

  "Kénitra": {
    housing: [
      { label: { fr: "Cité universitaire", ar: "مدينة جامعية", en: "State dorm" }, cost: "~400 MAD/an" },
      { label: { fr: "Colocation privée", ar: "مشاركة سكن خاصة", en: "Private flat-share" }, cost: "1 000 – 2 200 MAD/pers/mois" },
    ],
    neighborhoods: ["Cité universitaire", "Centre", "Hay Al Fath"],
    safety: {
      fr: "Kénitra est sûre avec une vie étudiante active.",
      ar: "القنيطرة آمنة مع حياة طلابية نشطة.",
      en: "Kénitra is safe with an active student life.",
    },
    stateDormNote: {
      fr: "Cité universitaire disponible.",
      ar: "المدينة الجامعية متاحة.",
      en: "State dorm available.",
    },
  },
};

// ─── Helper: get campus info for a school ────────────────────────────────────

const INTEGRATED_SLUGS = new Set(["um6p", "uir", "um6ss", "aui"]);

export function getSchoolCampusInfo(slug: string, city: string): {
  isIntegrated: boolean;
  integrated?: CampusInfo;
  cityHousing?: CityHousingData;
} {
  if (INTEGRATED_SLUGS.has(slug)) {
    return { isIntegrated: true, integrated: INTEGRATED_CAMPUSES[slug] };
  }
  const cityHousing = CITY_HOUSING[city];
  return { isIntegrated: false, cityHousing };
}
