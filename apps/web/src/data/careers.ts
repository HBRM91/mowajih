export interface SchoolCareers {
  jobFamilies: string[];
  avgStartSalaryMAD: number;
  avgMidSalaryMAD: number;
  topEmployers: string[];
  employmentRate: number;
  internationalOpportunities?: boolean;
}

export const CAREERS_DATA: Record<string, SchoolCareers> = {
  // ─── ELITE ENGINEERING — CNC ──────────────────────────────────────────────
  "emi": {
    jobFamilies: ["Ingénieur logiciel", "Data Engineer", "Chef de projet SI", "Consultant IT", "Architecte systèmes"],
    avgStartSalaryMAD: 11000,
    avgMidSalaryMAD: 32000,
    topEmployers: ["OCP Group", "Maroc Telecom", "CDG", "BMCE Bank", "McKinsey Maroc"],
    employmentRate: 96,
    internationalOpportunities: true,
  },
  "ehtp": {
    jobFamilies: ["Ingénieur génie civil", "Chef de chantier BTP", "Ingénieur transport", "Directeur de projets", "Urbaniste"],
    avgStartSalaryMAD: 10000,
    avgMidSalaryMAD: 28000,
    topEmployers: ["OCP Group", "ONCF", "ADM (Autoroutes)", "Lydec", "Groupe Holcim"],
    employmentRate: 95,
    internationalOpportunities: true,
  },
  "ensias": {
    jobFamilies: ["Ingénieur logiciel", "Cybersécurité", "Data Scientist", "Architecte cloud", "Product Manager"],
    avgStartSalaryMAD: 12000,
    avgMidSalaryMAD: 35000,
    topEmployers: ["Capgemini Maroc", "Sqli", "Maroc Telecom", "OCP Digital", "CGI"],
    employmentRate: 97,
    internationalOpportunities: true,
  },
  "inpt": {
    jobFamilies: ["Ingénieur télécoms", "Ingénieur réseaux", "Cybersécurité", "Ingénieur cloud", "IoT Engineer"],
    avgStartSalaryMAD: 11000,
    avgMidSalaryMAD: 30000,
    topEmployers: ["Maroc Telecom", "Orange Maroc", "Inwi", "Nokia", "Ericsson Maroc"],
    employmentRate: 96,
    internationalOpportunities: true,
  },
  "enim": {
    jobFamilies: ["Ingénieur minier", "Ingénieur chimiste", "Géologue de production", "Ingénieur environnement", "Ingénieur procédés"],
    avgStartSalaryMAD: 9000,
    avgMidSalaryMAD: 24000,
    topEmployers: ["OCP Group", "MANAGEM Group", "CMH", "COSUMAR", "LafargeHolcim"],
    employmentRate: 93,
    internationalOpportunities: false,
  },
  "insea": {
    jobFamilies: ["Actuaire", "Data Scientist", "Économètre", "Analyste risques", "Statisticien"],
    avgStartSalaryMAD: 10000,
    avgMidSalaryMAD: 28000,
    topEmployers: ["Bank Al-Maghrib", "Wafa Assurance", "HCP", "CDG", "CIH Bank"],
    employmentRate: 94,
    internationalOpportunities: true,
  },

  // ─── ELITE BUSINESS ───────────────────────────────────────────────────────
  "iscae": {
    jobFamilies: ["Auditeur financier", "Contrôleur de gestion", "Directeur financier", "Analyste stratégique", "Manager commercial"],
    avgStartSalaryMAD: 9000,
    avgMidSalaryMAD: 26000,
    topEmployers: ["Deloitte Maroc", "KPMG", "PwC", "Attijariwafa Bank", "BMCE Bank"],
    employmentRate: 94,
    internationalOpportunities: true,
  },

  // ─── UM6P ─────────────────────────────────────────────────────────────────
  "um6p": {
    jobFamilies: ["Data Scientist", "Ingénieur R&D", "Manager de projet international", "Chercheur", "Entrepreneur tech"],
    avgStartSalaryMAD: 15000,
    avgMidSalaryMAD: 45000,
    topEmployers: ["OCP Group", "McKinsey", "CERN", "Google", "Startups tech"],
    employmentRate: 92,
    internationalOpportunities: true,
  },

  // ─── ENSAM NETWORK ────────────────────────────────────────────────────────
  "ensam-casablanca": {
    jobFamilies: ["Ingénieur industriel", "Responsable qualité", "Ingénieur méthodes", "Ingénieur maintenance", "Responsable production"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 18000,
    topEmployers: ["PSA Maroc", "Renault Tanger", "Safran", "Yazaki", "Valeo Maroc"],
    employmentRate: 91,
    internationalOpportunities: false,
  },
  "ensam-meknes": {
    jobFamilies: ["Ingénieur industriel", "Responsable qualité", "Ingénieur méthodes", "Ingénieur HSE", "Responsable logistique"],
    avgStartSalaryMAD: 7000,
    avgMidSalaryMAD: 16000,
    topEmployers: ["Stellantis", "Renault Maroc", "SOMACA", "Sews Cabind", "LEAR Corporation"],
    employmentRate: 90,
    internationalOpportunities: false,
  },

  // ─── ENSA NETWORK ─────────────────────────────────────────────────────────
  "ensa-agadir": {
    jobFamilies: ["Ingénieur génie civil", "Ingénieur électrique", "Développeur logiciel", "Ingénieur agroalimentaire", "Chef de projet"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 15000,
    topEmployers: ["Agro industrie Souss", "ONEE", "Sogemar", "Cosumar", "Bureau d'études"],
    employmentRate: 88,
    internationalOpportunities: false,
  },
  "ensa-fes": {
    jobFamilies: ["Ingénieur informatique", "Ingénieur mécanique", "Ingénieur électrique", "Chef de projet industrie", "Ingénieur qualité"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 15000,
    topEmployers: ["SNEP", "Groupe Léon Grosse", "ONEEP", "Safran", "Yazaki"],
    employmentRate: 88,
    internationalOpportunities: false,
  },
  "ensa-casablanca": {
    jobFamilies: ["Ingénieur logiciel", "Ingénieur génie civil", "Ingénieur systèmes embarqués", "Ingénieur cloud", "Chef de projet"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 18000,
    topEmployers: ["CGI Maroc", "Capgemini", "Lydec", "OCP", "ONA"],
    employmentRate: 91,
    internationalOpportunities: false,
  },
  "ensa-marrakech": {
    jobFamilies: ["Ingénieur génie civil", "Ingénieur électrique", "Développeur web", "Ingénieur BI", "Chef de projet construction"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 14000,
    topEmployers: ["Groupe Alliances", "BMCE Bank", "OCP", "ONEE", "Bureau d'études"],
    employmentRate: 87,
    internationalOpportunities: false,
  },
  "ensa-kenitra": {
    jobFamilies: ["Ingénieur automobile", "Ingénieur informatique", "Ingénieur production", "Technicien chef de produit", "Ingénieur qualité"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 14500,
    topEmployers: ["PSA Kenitra", "Renault Maroc", "SNEP", "LEONI", "Safran Maroc"],
    employmentRate: 89,
    internationalOpportunities: false,
  },
  "ensa-tanger": {
    jobFamilies: ["Ingénieur logistique", "Ingénieur portuaire", "Développeur logiciel", "Ingénieur transport", "Chef de projet douane"],
    avgStartSalaryMAD: 7000,
    avgMidSalaryMAD: 16000,
    topEmployers: ["Tanger Med", "Renault Tanger", "SNPT", "DHL Maroc", "Maersk Maroc"],
    employmentRate: 90,
    internationalOpportunities: true,
  },

  // ─── ENCG NETWORK ─────────────────────────────────────────────────────────
  "encg-casablanca": {
    jobFamilies: ["Contrôleur de gestion", "Responsable marketing", "Commercial B2B", "Responsable RH", "Analyste financier"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 18000,
    topEmployers: ["Attijariwafa Bank", "OCP", "L'Oréal Maroc", "P&G Maroc", "Nestlé Maroc"],
    employmentRate: 92,
    internationalOpportunities: false,
  },
  "encg-agadir": {
    jobFamilies: ["Manager commercial", "Responsable marketing", "Gestionnaire PME", "Contrôleur de gestion", "Chargé export"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 15000,
    topEmployers: ["Groupe Zniber", "COSUMAR", "ONCF", "Souss-Massa Draa invest.", "Agroconcept"],
    employmentRate: 88,
    internationalOpportunities: false,
  },
  "encg-fes": {
    jobFamilies: ["Manager commercial", "Contrôleur de gestion", "Responsable RH", "Analyste financier", "Chef de projet"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 15000,
    topEmployers: ["BMCE Bank", "CIH Bank", "Renault Maroc", "Maroc Telecom", "Groupe Holcim"],
    employmentRate: 87,
    internationalOpportunities: false,
  },

  // ─── MEDICINE ─────────────────────────────────────────────────────────────
  "fm-rabat": {
    jobFamilies: ["Médecin généraliste", "Spécialiste hospitalier", "Chirurgien", "Pharmacien", "Chercheur médical"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 40000,
    topEmployers: ["CHU Ibn Sina", "Cliniques privées", "Ministère de la Santé", "OCP", "CNSS"],
    employmentRate: 99,
    internationalOpportunities: true,
  },
  "fm-casablanca": {
    jobFamilies: ["Médecin généraliste", "Spécialiste hospitalier", "Chirurgien", "Dentiste", "Pharmacien"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 40000,
    topEmployers: ["CHU Ibn Rochd", "Clinique Casablanca", "Polyclinique privée", "Ministère Santé", "CNOPS"],
    employmentRate: 99,
    internationalOpportunities: true,
  },
  "fm-fes": {
    jobFamilies: ["Médecin généraliste", "Spécialiste", "Chirurgien", "Médecin urgentiste", "Pharmacien"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 38000,
    topEmployers: ["CHU Hassan II Fès", "Cliniques privées", "Ministère de la Santé", "OCP Health"],
    employmentRate: 99,
    internationalOpportunities: true,
  },
  "fm-marrakech": {
    jobFamilies: ["Médecin généraliste", "Spécialiste", "Chirurgien", "Médecin de famille", "Pharmacien"],
    avgStartSalaryMAD: 7500,
    avgMidSalaryMAD: 38000,
    topEmployers: ["CHU Mohammed VI", "Clinique Internationale Marrakech", "Ministère Santé"],
    employmentRate: 99,
    internationalOpportunities: true,
  },
  "fm-oujda": {
    jobFamilies: ["Médecin généraliste", "Médecin urgentiste", "Pharmacien", "Chirurgien", "Médecin de famille"],
    avgStartSalaryMAD: 7000,
    avgMidSalaryMAD: 35000,
    topEmployers: ["CHU Oujda", "Ministère Santé", "Cliniques privées Oujda"],
    employmentRate: 99,
    internationalOpportunities: false,
  },

  // ─── ARCHITECTURE (ENA) ───────────────────────────────────────────────────
  "ena-rabat": {
    jobFamilies: ["Architecte DPLG", "Urbaniste", "Chef de projet immobilier", "Directeur artistique", "Architecte d'intérieur"],
    avgStartSalaryMAD: 6000,
    avgMidSalaryMAD: 20000,
    topEmployers: ["Al Omrane", "CGI", "Tgcc", "Caisse de Dépôt et de Gestion", "Bureaux d'études"],
    employmentRate: 86,
    internationalOpportunities: true,
  },
  "ena-fes": {
    jobFamilies: ["Architecte DPLG", "Expert patrimoine", "Urbaniste", "Architecte de restauration", "Designer"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 18000,
    topEmployers: ["Al Omrane", "Direction du Patrimoine", "UNESCO Maroc", "Bureaux d'études"],
    employmentRate: 83,
    internationalOpportunities: true,
  },
  "ena-marrakech": {
    jobFamilies: ["Architecte", "Designer d'intérieur", "Chef de projet hôtelier", "Urbaniste", "Architecte paysagiste"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 18000,
    topEmployers: ["Groupe AccorHotels", "Sefrioui Group", "TGCC", "Al Omrane", "Agences immobilières"],
    employmentRate: 84,
    internationalOpportunities: true,
  },
  "ena-agadir": {
    jobFamilies: ["Architecte côtier", "Urbaniste", "Architecte tourisme", "Chef de projet", "Architecte paysagiste"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 17000,
    topEmployers: ["Al Omrane Agadir", "ONA immobilier", "Offices régionaux", "Hôtels Agadir"],
    employmentRate: 83,
    internationalOpportunities: false,
  },
  "ena-oujda": {
    jobFamilies: ["Architecte", "Urbaniste", "Architecte industriel", "Chef de projet", "Expert immobilier"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 15000,
    topEmployers: ["Al Omrane Oriental", "Ministère de l'Habitat", "OCP Oujda", "Bureaux d'études"],
    employmentRate: 81,
    internationalOpportunities: false,
  },
  "ena-tetouan": {
    jobFamilies: ["Architecte patrimoine", "Architecte hispano-marocain", "Urbaniste", "Chef de projet restauration", "Directeur artistique"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 16000,
    topEmployers: ["Inspection des Monuments", "UNESCO", "Al Omrane Nord", "Bureaux d'études Maroc-Espagne"],
    employmentRate: 82,
    internationalOpportunities: true,
  },

  // ─── AGRICULTURE & VETERINAIRE ────────────────────────────────────────────
  "iav-hassan-ii": {
    jobFamilies: ["Ingénieur agronome", "Vétérinaire", "Ingénieur agroalimentaire", "Chercheur en agronomie", "Consultant agriculture"],
    avgStartSalaryMAD: 8500,
    avgMidSalaryMAD: 22000,
    topEmployers: ["OCP Africa", "Al Moutmir", "FNADMV", "INRA Maroc", "FAO/ONU Maroc"],
    employmentRate: 92,
    internationalOpportunities: true,
  },

  // ─── PRIVATE UNIVERSITIES ─────────────────────────────────────────────────
  "uir": {
    jobFamilies: ["Ingénieur logiciel", "Manager international", "Data Analyst", "Ingénieur aéronautique", "Chercheur"],
    avgStartSalaryMAD: 10000,
    avgMidSalaryMAD: 30000,
    topEmployers: ["Boeing Maroc", "Airbus Africa", "OCP", "Capgemini", "Orange Digital Center"],
    employmentRate: 90,
    internationalOpportunities: true,
  },
  "al-akhawayn": {
    jobFamilies: ["Manager international", "Diplomate", "Consultant", "Entrepreneur", "Chercheur"],
    avgStartSalaryMAD: 12000,
    avgMidSalaryMAD: 38000,
    topEmployers: ["Deloitte", "BCG", "Ambassades", "Multinationales", "ONG internationales"],
    employmentRate: 88,
    internationalOpportunities: true,
  },
  "hem": {
    jobFamilies: ["Manager marketing", "Directeur commercial", "Responsable RH", "Analyste financier", "Entrepreneur"],
    avgStartSalaryMAD: 8500,
    avgMidSalaryMAD: 24000,
    topEmployers: ["Attijariwafa Bank", "Crédit du Maroc", "L'Oréal", "Total Maroc", "Philip Morris"],
    employmentRate: 89,
    internationalOpportunities: false,
  },
  "mundiapolis": {
    jobFamilies: ["Manager international", "Ingénieur logiciel", "Juriste international", "Responsable RH", "Commercial export"],
    avgStartSalaryMAD: 8000,
    avgMidSalaryMAD: 22000,
    topEmployers: ["Attijariwafa Bank", "ONA", "Groupe BMCE", "Entreprises Europe-Maroc", "ONG"],
    employmentRate: 87,
    internationalOpportunities: true,
  },
  "emsi": {
    jobFamilies: ["Développeur web/mobile", "Ingénieur réseaux", "Cybersécurité", "Data Analyst", "Chef de projet IT"],
    avgStartSalaryMAD: 7000,
    avgMidSalaryMAD: 18000,
    topEmployers: ["CGI Maroc", "Capgemini", "Sqli", "IT factory", "IBM Maroc"],
    employmentRate: 88,
    internationalOpportunities: false,
  },
  "esith": {
    jobFamilies: ["Ingénieur textile", "Responsable qualité", "Manager production", "Ingénieur logistique", "Ingénieur procédés"],
    avgStartSalaryMAD: 6500,
    avgMidSalaryMAD: 16000,
    topEmployers: ["ITHEMBA", "Smartex", "Industrie textile Casablanca", "Proline", "SETAVEX"],
    employmentRate: 87,
    internationalOpportunities: false,
  },
  "esca-casablanca": {
    jobFamilies: ["Manager stratégique", "Consultant", "Directeur marketing", "DG PME", "Directeur financier"],
    avgStartSalaryMAD: 10000,
    avgMidSalaryMAD: 28000,
    topEmployers: ["Deloitte", "EY", "Multinationales France", "BMCE Bank", "Crédit Agricole"],
    employmentRate: 91,
    internationalOpportunities: true,
  },
  // ─── EST NETWORK ──────────────────────────────────────────────────────────
  "est-casablanca": {
    jobFamilies: ["Technicien supérieur IT", "Technicien commercial", "Assistant manager", "Technicien qualité", "Gestionnaire PME"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 10000,
    topEmployers: ["PME industrie", "Commerce & distribution", "ONDA", "ONA", "Secteur privé"],
    employmentRate: 83,
    internationalOpportunities: false,
  },
  "est-sale": {
    jobFamilies: ["Technicien supérieur", "Assistant manager", "Technicien commercial", "Gestionnaire", "Technicien BTP"],
    avgStartSalaryMAD: 4800,
    avgMidSalaryMAD: 9500,
    topEmployers: ["Administration publique", "Commerce Rabat-Salé", "PME", "ONCF", "ONA"],
    employmentRate: 82,
    internationalOpportunities: false,
  },
  "est-agadir": {
    jobFamilies: ["Technicien tourisme & hôtellerie", "Technicien pêche", "Responsable commercial", "Gestionnaire hôtelier", "Agent import-export"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 10000,
    topEmployers: ["Clubs Med Agadir", "Sofitel Agadir", "Port d'Agadir", "Office Halieutique", "ONMT"],
    employmentRate: 85,
    internationalOpportunities: false,
  },

  // ─── FST NETWORK ──────────────────────────────────────────────────────────
  "fst-mohammedia": {
    jobFamilies: ["Ingénieur logiciel", "Physicien industriel", "Chimiste industriel", "Chargé de formation", "Professeur chercheur"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 13000,
    topEmployers: ["ONEE", "Petromin", "ONA", "Enseignement supérieur", "Recherche"],
    employmentRate: 75,
    internationalOpportunities: false,
  },
  "fst-fes": {
    jobFamilies: ["Technicien de recherche", "Enseignant chercheur", "Ingénieur d'étude", "Analyste chimiste", "Informaticien"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 12000,
    topEmployers: ["Université SMSB", "INRA", "Industrie régionale", "Recherche publique"],
    employmentRate: 72,
    internationalOpportunities: false,
  },

  // ─── FSJES NETWORK ────────────────────────────────────────────────────────
  "fsjes-casablanca": {
    jobFamilies: ["Avocat", "Magistrat", "Juriste d'entreprise", "Économiste", "Fonctionnaire"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 12000,
    topEmployers: ["Ministères", "Cabinets d'avocats", "Banques", "Greffes", "Entreprises privées"],
    employmentRate: 70,
    internationalOpportunities: false,
  },
  "fsjes-agdal": {
    jobFamilies: ["Magistrat", "Diplomate", "Haut fonctionnaire", "Économiste politique", "Juriste international"],
    avgStartSalaryMAD: 5500,
    avgMidSalaryMAD: 14000,
    topEmployers: ["Parlement", "Ministère des AE", "Ministère des Finances", "Magistrature", "ONU"],
    employmentRate: 72,
    internationalOpportunities: true,
  },
  "fsjes-marrakech": {
    jobFamilies: ["Juriste", "Comptable", "Gestionnaire", "Fonctionnaire", "Éducateur"],
    avgStartSalaryMAD: 4500,
    avgMidSalaryMAD: 10000,
    topEmployers: ["Administration locale", "Banques Marrakech", "PME", "Enseignement"],
    employmentRate: 68,
    internationalOpportunities: false,
  },

  // ─── ARTS & SPÉCIALISÉES ──────────────────────────────────────────────────
  "isic-rabat": {
    jobFamilies: ["Journaliste TV/Presse", "Chargé de communication", "Community manager", "Réalisateur", "Relations publiques"],
    avgStartSalaryMAD: 5000,
    avgMidSalaryMAD: 12000,
    topEmployers: ["2M", "Medi1TV", "MAP (Agence Maroc Presse)", "Radio Maroc", "Agences RP"],
    employmentRate: 80,
    internationalOpportunities: false,
  },
  "esav-marrakech": {
    jobFamilies: ["Réalisateur", "Directeur artistique", "Animateur 3D", "Photographe professionnel", "Designer graphique"],
    avgStartSalaryMAD: 4500,
    avgMidSalaryMAD: 11000,
    topEmployers: ["FIFM", "CCM (Centre Cinématographique Marocain)", "Agences créatives", "Publicité", "Production indépendante"],
    employmentRate: 75,
    internationalOpportunities: true,
  },
  "inet-agadir": {
    jobFamilies: ["Manager hôtelier", "Revenue Manager", "Directeur d'agence de voyage", "Chargé tourisme durable", "Commercial hôtelier"],
    avgStartSalaryMAD: 6000,
    avgMidSalaryMAD: 14000,
    topEmployers: ["Club Med", "Accor Hotels Maroc", "Royal Air Maroc", "ONMT", "Agences de voyage"],
    employmentRate: 87,
    internationalOpportunities: true,
  },
  "cfg-schools": {
    jobFamilies: ["Trader", "Analyste financier", "Gestionnaire de portefeuille", "Risk Manager", "FinTech Product Manager"],
    avgStartSalaryMAD: 9000,
    avgMidSalaryMAD: 28000,
    topEmployers: ["CFG Bank", "Valoris Securities", "Bourse de Casablanca", "BMCE Capital", "Upline"],
    employmentRate: 90,
    internationalOpportunities: false,
  },
};

export function getSchoolCareers(slug: string): SchoolCareers | undefined {
  return CAREERS_DATA[slug];
}
