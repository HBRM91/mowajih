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

// ─── GRANDES ÉCOLES with on-campus residences ─────────────────────────────────
// These schools have their own dorms but were not in the original INTEGRATED_CAMPUSES.
// Housing is ONOUSC-managed (~400 MAD/year) unless noted otherwise.

// Shared Rabat city housing appended to each school's own housing
const RABAT_OFFCAMPUS: HousingRange[] = [
  { label: { fr: "Résidence privée (Bayt Al Maarif, RU Rabat)", ar: "إقامة خاصة (بيت المعارف، RU الرباط)", en: "Private residence (Bayt Al Maarif, RU Rabat)" }, cost: "2 500 – 4 000 MAD/mois" },
  { label: { fr: "Colocation (Agdal / Al Irfane)", ar: "مشاركة سكن (أكدال / العرفان)", en: "Flat-share (Agdal / Al Irfane)" }, cost: "1 800 – 3 000 MAD/pers/mois" },
];

const CASA_OFFCAMPUS: HousingRange[] = [
  { label: { fr: "Résidence privée (Oasis, Maarif)", ar: "إقامة خاصة (واحة، المعاريف)", en: "Private residence (Oasis, Maarif)" }, cost: "2 500 – 4 000 MAD/mois" },
  { label: { fr: "Colocation (Oasis / Route El Jadida)", ar: "مشاركة سكن (واحة / طريق الجديدة)", en: "Flat-share (Oasis / Route El Jadida)" }, cost: "2 000 – 4 000 MAD/pers/mois" },
];

const MEKNES_OFFCAMPUS: HousingRange[] = [
  { label: { fr: "Colocation privée (Hamria, Al Qods)", ar: "مشاركة سكن خاصة (حمرية، القدس)", en: "Private flat-share (Hamria, Al Qods)" }, cost: "800 – 2 000 MAD/pers/mois" },
];

const RABAT_SAFETY: I18nText = {
  fr: "Rabat est globalement sûre. Al Irfane (cité universitaire) est encadré. Résidences privées recommandées pour les étudiantes seules : digicode, gardien. Tramway sûr.",
  ar: "الرباط آمنة بشكل عام. العرفان (مدينة جامعية) منظم. الإقامات الخاصة موصى بها للطالبات وحدهن: شفرة دخول، حارس. الترامواي آمن.",
  en: "Rabat is broadly safe. Al Irfane (university city) is well-supervised. Private residences recommended for female students living alone: keypad, guard. Tram is safe.",
};

const RABAT_TRANSPORT: I18nText = {
  fr: "Tramway de Rabat dessert Agdal et Al Irfane. Budget transport ~300–500 MAD/mois.",
  ar: "ترامواي الرباط يخدم أكدال والعرفان. ميزانية النقل ~300-500 درهم/شهر.",
  en: "Rabat tram serves Agdal and Al Irfane. Transport budget ~300–500 MAD/month.",
};

const CASA_SAFETY: I18nText = {
  fr: "Casablanca est grande et animée. Quartiers universitaires (Oasis, El Jadida) habitués aux étudiantes. Résidences privées recommandées. Tramway sûr. Évite les trajets tardifs en solo.",
  ar: "الدار البيضاء كبيرة وحيوية. أحياء جامعية (واحة، الجديدة) معتادة على الطالبات. الإقامات الخاصة موصى بها. الترامواي آمن. تجنبي التنقل المتأخر وحدك.",
  en: "Casablanca is large and lively. University areas (Oasis, El Jadida) are accustomed to female students. Private residences recommended. Tram is safe. Avoid late-night solo travel.",
};

const CASA_TRANSPORT: I18nText = {
  fr: "Tramway Casablanca (T1 & T2). Budget transport ~400–600 MAD/mois.",
  ar: "ترامواي الدار البيضاء (T1 وT2). ميزانية النقل ~400-600 درهم/شهر.",
  en: "Casablanca tram (T1 & T2). Transport budget ~400–600 MAD/month.",
};

INTEGRATED_CAMPUSES["emi"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~400 MAD/an (ONOUSC)",
    facilities: [
      { fr: "Résidence universitaire sur site (places limitées — demande tôt)", ar: "مسكن جامعي داخل الحرم (أماكن محدودة — سجّل مبكراً)", en: "On-site university residence (limited places — apply early)" },
      { fr: "Terrains de sport, cafétéria, bibliothèque centrale", ar: "ملاعب رياضية، مقصف، مكتبة مركزية", en: "Sports grounds, cafeteria, central library" },
      { fr: "Campus historique de 12 ha au cœur de Rabat-Agdal", ar: "حرم تاريخي 12 هكتار في قلب الرباط-أكدال", en: "12-hectare historic campus in the heart of Rabat-Agdal" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ONOUSC (places limitées)", ar: "داخل الحرم — إقامة ONOUSC (أماكن محدودة)", en: "On campus — ONOUSC residence (limited places)" }, cost: "~400 MAD/an" },
    ...RABAT_OFFCAMPUS,
  ],
  neighborhoods: ["Agdal", "Al Irfane", "Hay Riad"],
  safety: RABAT_SAFETY,
  transport: RABAT_TRANSPORT,
};

INTEGRATED_CAMPUSES["ehtp"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~400 MAD/an (ONOUSC)",
    facilities: [
      { fr: "Résidence universitaire sur campus (places limitées)", ar: "إقامة جامعية داخل الحرم (أماكن محدودة)", en: "University residence on campus (limited places)" },
      { fr: "Laboratoires BTP, transport et infrastructure", ar: "مختبرات البناء والنقل والبنية التحتية", en: "BTP, transport and infrastructure laboratories" },
      { fr: "Campus de 8 ha à Casablanca-Aïn Sebaâ", ar: "حرم 8 هكتار بالدار البيضاء-عين السبع", en: "8-hectare campus in Casablanca-Aïn Sebaâ" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ONOUSC (places limitées)", ar: "داخل الحرم — إقامة ONOUSC (أماكن محدودة)", en: "On campus — ONOUSC residence (limited places)" }, cost: "~400 MAD/an" },
    ...CASA_OFFCAMPUS,
  ],
  neighborhoods: ["Aïn Sebaâ", "Oasis", "Maarif"],
  safety: CASA_SAFETY,
  transport: CASA_TRANSPORT,
};

INTEGRATED_CAMPUSES["enim"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~400 MAD/an (ONOUSC)",
    facilities: [
      { fr: "Résidence universitaire sur campus (places limitées)", ar: "إقامة جامعية داخل الحرم (أماكن محدودة)", en: "University residence on campus (limited places)" },
      { fr: "Terrain de sport, campus de 5 ha à Rabat-Agdal", ar: "ملعب رياضي، حرم 5 هكتار بالرباط-أكدال", en: "Sports ground, 5-hectare campus in Rabat-Agdal" },
      { fr: "Laboratoires géologie et chimie de pointe", ar: "مختبرات جيولوجيا وكيمياء متطورة", en: "Advanced geology and chemistry laboratories" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ONOUSC (places limitées)", ar: "داخل الحرم — إقامة ONOUSC (أماكن محدودة)", en: "On campus — ONOUSC residence (limited places)" }, cost: "~400 MAD/an" },
    ...RABAT_OFFCAMPUS,
  ],
  neighborhoods: ["Agdal", "Al Irfane", "Souissi"],
  safety: RABAT_SAFETY,
  transport: RABAT_TRANSPORT,
};

INTEGRATED_CAMPUSES["insea"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~400 MAD/an (ONOUSC, très limité)",
    facilities: [
      { fr: "Résidence universitaire possible via ONOUSC (places très limitées)", ar: "إقامة جامعية ممكنة عبر ONOUSC (أماكن محدودة جداً)", en: "University residence possible via ONOUSC (very limited places)" },
      { fr: "Salles informatiques & statistiques spécialisées, bibliothèque", ar: "قاعات معلوماتية وإحصاء متخصصة، مكتبة", en: "Specialist IT & statistics labs, library" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ONOUSC (très peu de places)", ar: "داخل الحرم — إقامة ONOUSC (أماكن قليلة جداً)", en: "On campus — ONOUSC residence (very few places)" }, cost: "~400 MAD/an" },
    ...RABAT_OFFCAMPUS,
  ],
  neighborhoods: ["Agdal", "Hay Riad", "Al Irfane"],
  safety: RABAT_SAFETY,
  transport: RABAT_TRANSPORT,
};

INTEGRATED_CAMPUSES["iscae"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "3 700 MAD/an (~310 MAD/mois)",
    facilities: [
      { fr: "Résidence universitaire sur campus (places limitées) — tarif très avantageux", ar: "إقامة جامعية داخل الحرم (أماكن محدودة) — سعر مغري جداً", en: "On-campus university residence (limited places) — very affordable rate" },
      { fr: "2 500 MAD (loyer) + 700 MAD (inscription) + 500 MAD (charges) = 3 700 MAD/an", ar: "2500 درهم (إيجار) + 700 درهم (تسجيل) + 500 درهم (مصاريف) = 3700 درهم/سنة", en: "2,500 MAD (rent) + 700 MAD (registration) + 500 MAD (charges) = 3,700 MAD/year" },
      { fr: "Campus Aïn Sebaâ (Casa) + antenne Rabat", ar: "حرم عين السبع (كازا) + فرع الرباط", en: "Aïn Sebaâ campus (Casa) + Rabat branch" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ISCAE (places limitées)", ar: "داخل الحرم — إقامة ISCAE (أماكن محدودة)", en: "On campus — ISCAE residence (limited places)" }, cost: "3 700 MAD/an" },
    ...CASA_OFFCAMPUS,
  ],
  neighborhoods: ["Aïn Sebaâ", "Oasis", "Maarif"],
  safety: CASA_SAFETY,
  transport: CASA_TRANSPORT,
};

INTEGRATED_CAMPUSES["iav-hassan-ii"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~400 MAD/an (ONOUSC)",
    facilities: [
      { fr: "Résidences étudiantes sur le grand campus agronomique de 70 ha", ar: "مساكن طلابية داخل الحرم الزراعي الكبير 70 هكتار", en: "Student residences on the 70-hectare agronomic campus" },
      { fr: "1 500 lits actuels — extension à 2 300 lits en cours", ar: "1500 سرير حالياً — توسيع إلى 2300 سرير قيد الإنجاز", en: "1,500 beds currently — expansion to 2,300 beds underway" },
      { fr: "Fermes pédagogiques, clinique vétérinaire, restaurant universitaire", ar: "مزارع تعليمية، عيادة بيطرية، مطعم جامعي", en: "Teaching farms, veterinary clinic, university restaurant" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ONOUSC (large capacité)", ar: "داخل الحرم — إقامة ONOUSC (سعة كبيرة)", en: "On campus — ONOUSC residence (large capacity)" }, cost: "~400 MAD/an" },
    ...RABAT_OFFCAMPUS,
  ],
  neighborhoods: ["Agdal", "Al Irfane", "Hay Riad"],
  safety: RABAT_SAFETY,
  transport: RABAT_TRANSPORT,
};

INTEGRATED_CAMPUSES["ensam-casablanca"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "1 050 MAD/mois",
    facilities: [
      { fr: "Chambres individuelles avec douche, armoire et cuisine partagée", ar: "غرف فردية مع دش وخزانة ومطبخ مشترك", en: "Individual rooms with shower, wardrobe and shared kitchen" },
      { fr: "Restaurant universitaire sur campus — 26 MAD/repas (menus variés)", ar: "مطعم جامعي داخل الحرم — 26 درهم/وجبة (قوائم متنوعة)", en: "Campus restaurant — 26 MAD/meal (varied menus)" },
      { fr: "Machines à laver disponibles sur place", ar: "غسالات متاحة في الموقع", en: "Washing machines available on site" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ENSAM (disponible)", ar: "داخل الحرم — إقامة ENSAM (متاحة)", en: "On campus — ENSAM residence (available)" }, cost: "1 050 MAD/mois" },
    ...CASA_OFFCAMPUS,
  ],
  neighborhoods: ["Aïn Sebaâ", "Oasis", "Maarif"],
  safety: CASA_SAFETY,
  transport: CASA_TRANSPORT,
};

INTEGRATED_CAMPUSES["ensam-meknes"] = {
  type: "urban_secondary",
  onCampus: {
    available: true,
    cost: "1 050 MAD/mois",
    facilities: [
      { fr: "Chambres individuelles avec douche, armoire et cuisine partagée", ar: "غرف فردية مع دش وخزانة ومطبخ مشترك", en: "Individual rooms with shower, wardrobe and shared kitchen" },
      { fr: "Restaurant universitaire — 26 MAD/repas (traditionnel, grill, asiatique, italien)", ar: "مطعم جامعي — 26 درهم/وجبة (تقليدي، شواء، آسيوي، إيطالي)", en: "Campus restaurant — 26 MAD/meal (traditional, grill, Asian, Italian)" },
      { fr: "Machines à laver, terrains de sport", ar: "غسالات، ملاعب رياضية", en: "Washing machines, sports grounds" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ENSAM (disponible)", ar: "داخل الحرم — إقامة ENSAM (متاحة)", en: "On campus — ENSAM residence (available)" }, cost: "1 050 MAD/mois" },
    ...MEKNES_OFFCAMPUS,
  ],
  neighborhoods: ["Hamria", "Al Qods", "Centre ville"],
  safety: {
    fr: "Meknès est très sûre et peu chère. Excellente ville étudiante.",
    ar: "مكناس آمنة جداً وغير مكلفة. مدينة جامعية ممتازة.",
    en: "Meknès is very safe and inexpensive. Excellent student city.",
  },
  transport: {
    fr: "Bus locaux. Budget transport ~150–250 MAD/mois.",
    ar: "حافلات محلية. ميزانية النقل ~150-250 درهم/شهر.",
    en: "Local buses. Transport budget ~150–250 MAD/month.",
  },
};

INTEGRATED_CAMPUSES["ensam-rabat"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "~1 050 MAD/mois",
    facilities: [
      { fr: "Résidence universitaire sur campus (campus Rabat, récent)", ar: "إقامة جامعية داخل الحرم (حرم الرباط، حديث)", en: "University residence on campus (Rabat campus, recent)" },
      { fr: "Restaurant universitaire et infrastructures sportives", ar: "مطعم جامعي ومرافق رياضية", en: "University restaurant and sports facilities" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus — résidence ENSAM Rabat", ar: "داخل الحرم — إقامة ENSAM الرباط", en: "On campus — ENSAM Rabat residence" }, cost: "~1 050 MAD/mois" },
    ...RABAT_OFFCAMPUS,
  ],
  neighborhoods: ["Agdal", "Al Irfane", "Hay Riad"],
  safety: RABAT_SAFETY,
  transport: RABAT_TRANSPORT,
};

INTEGRATED_CAMPUSES["mundiapolis"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "2 000 – 3 500 MAD/mois",
    facilities: [
      { fr: "Résidence sur campus (chambres individuelles et doubles)", ar: "إقامة داخل الحرم (غرف فردية ومزدوجة)", en: "On-campus residence (single and double rooms)" },
      { fr: "Bibliothèque, restaurant, terrains de sport, parking", ar: "مكتبة، مطعم، ملاعب رياضية، موقف سيارات", en: "Library, restaurant, sports grounds, parking" },
      { fr: "Partenariats étudiants internationaux actifs", ar: "شراكات طلابية دولية فعّالة", en: "Active international student partnerships" },
    ],
    girlsWing: false,
  },
  housing: [
    { label: { fr: "Sur campus (chambre individuelle)", ar: "داخل الحرم (غرفة فردية)", en: "On campus (single room)" }, cost: "2 500 – 3 500 MAD/mois" },
    { label: { fr: "Sur campus (chambre double)", ar: "داخل الحرم (غرفة مزدوجة)", en: "On campus (double room)" }, cost: "2 000 – 2 800 MAD/mois" },
    ...CASA_OFFCAMPUS,
  ],
  neighborhoods: ["Nouaceur", "Bouskoura", "Casablanca sud"],
  safety: CASA_SAFETY,
  transport: {
    fr: "Navettes campus-Casablanca disponibles. Budget transport ~300–500 MAD/mois.",
    ar: "حافلات مكوكية من الحرم إلى الدار البيضاء. ميزانية النقل ~300-500 درهم/شهر.",
    en: "Campus-Casablanca shuttles available. Transport budget ~300–500 MAD/month.",
  },
};

INTEGRATED_CAMPUSES["upf"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "1 800 – 2 500 MAD/mois",
    facilities: [
      { fr: "Résidence sur campus (Fès, route Meknès)", ar: "إقامة داخل الحرم (فاس، طريق مكناس)", en: "On-campus residence (Fès, Route Meknès)" },
      { fr: "Restaurant universitaire, clinique médicale sur place", ar: "مطعم جامعي، عيادة طبية في الموقع", en: "University restaurant, medical clinic on site" },
      { fr: "Sécurité 24h/24", ar: "حراسة 24/24", en: "24/7 security" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Sur campus UPF (chambre)", ar: "داخل حرم UPF (غرفة)", en: "On campus UPF (room)" }, cost: "1 800 – 2 500 MAD/mois" },
    { label: { fr: "Colocation privée (Aïn Chkef, Imouzzer)", ar: "مشاركة سكن خاصة (عين الشكف، أمزكان)", en: "Private flat-share (Aïn Chkef, Imouzzer)" }, cost: "1 200 – 2 500 MAD/pers/mois" },
  ],
  neighborhoods: ["Aïn Chkef", "Route d'Imouzzer", "Narjiss"],
  safety: {
    fr: "Fès est une ville étudiante calme et sûre. Campus UPF sécurisé 24h/24.",
    ar: "فاس مدينة جامعية هادئة وآمنة. حرم UPF محمي 24/24.",
    en: "Fès is a quiet, safe student city. UPF campus secured 24/7.",
  },
  transport: {
    fr: "Bus universitaires. Budget transport ~200–350 MAD/mois.",
    ar: "حافلات جامعية. ميزانية النقل ~200-350 درهم/شهر.",
    en: "University buses. Transport budget ~200–350 MAD/month.",
  },
};

INTEGRATED_CAMPUSES["upm"] = {
  type: "urban_major",
  onCampus: {
    available: true,
    cost: "3 333 – 4 500 MAD/mois",
    facilities: [
      { fr: "My Campus In — résidence premium sur campus de 32 ha (13 km de Marrakech)", ar: "My Campus In — إقامة مميزة داخل حرم 32 هكتار (13 كلم من مراكش)", en: "My Campus In — premium residence on 32-hectare campus (13 km from Marrakech)" },
      { fr: "Bungalow, studio ou Riad — 25 m², AC réversible, salle de bain privative", ar: "بنغالو، استوديو أو رياض — 25 م²، تكييف عكسي، حمام خاص", en: "Bungalow, studio or Riad — 25 m², reversible A/C, private bathroom" },
      { fr: "Restaurant, buanderie, infirmerie, mosquée, piscine couverte, padel, tennis", ar: "مطعم، مغسلة، مستوصف، مسجد، مسبح مغطى، بادل، تنس", en: "Restaurant, laundry, infirmary, mosque, covered pool, padel, tennis" },
      { fr: "Navettes gratuites campus-Marrakech", ar: "حافلات مكوكية مجانية بين الحرم ومراكش", en: "Free campus-Marrakech shuttles" },
    ],
    girlsWing: true,
  },
  housing: [
    { label: { fr: "Studio individuel My Campus In", ar: "استوديو فردي في My Campus In", en: "Individual studio at My Campus In" }, cost: "4 000 MAD/mois (48 000 MAD/an)" },
    { label: { fr: "Studio double My Campus In", ar: "استوديو مزدوج في My Campus In", en: "Double studio at My Campus In" }, cost: "3 333 MAD/mois (40 000 MAD/an)" },
    { label: { fr: "Riad individuel (premium)", ar: "رياض فردي (مميز)", en: "Individual Riad (premium)" }, cost: "4 500 MAD/mois (54 000 MAD/an)" },
    { label: { fr: "Colocation privée Guéliz/Massira (off-campus)", ar: "مشاركة سكن كيليز/مسيرة (خارج الحرم)", en: "Private flat-share Guéliz/Massira (off-campus)" }, cost: "1 500 – 3 000 MAD/pers/mois" },
  ],
  neighborhoods: ["Marrakech (13 km)", "Guéliz", "Massira"],
  safety: {
    fr: "Campus entièrement sécurisé 24h/24. Résidences mixtes et non-mixtes. Navette gratuite vers Marrakech.",
    ar: "حرم مؤمَّن بالكامل 24/24. مساكن مختلطة وغير مختلطة. حافلة مجانية نحو مراكش.",
    en: "Fully secured campus 24/7. Mixed and non-mixed residences. Free shuttle to Marrakech.",
  },
  transport: {
    fr: "Navettes gratuites UPM vers Marrakech centre. Budget transport external ~200 MAD/mois.",
    ar: "حافلات مجانية من UPM إلى مركز مراكش. ميزانية النقل الخارجي ~200 درهم/شهر.",
    en: "Free UPM shuttles to Marrakech centre. External transport budget ~200 MAD/month.",
  },
};

// ─── Helper: get campus info for a school ────────────────────────────────────

const INTEGRATED_SLUGS = new Set([
  "um6p", "uir", "um6ss", "aui",
  "emi", "ehtp", "enim", "insea", "iscae", "iav-hassan-ii",
  "ensam-casablanca", "ensam-meknes", "ensam-rabat",
  "mundiapolis", "upf", "upm",
]);

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
