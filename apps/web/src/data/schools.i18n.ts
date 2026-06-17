export interface SchoolI18n {
  ar?: { description: string; programs: string[] };
  en?: { description: string; programs: string[] };
}

export const SCHOOL_I18N: Record<string, SchoolI18n> = {
  "emi": {
    ar: {
      description: "أعرق وأكبر مدرسة للمهندسين الحكومية في المغرب (1959). الدخول عبر سنتين من الكلاس براباطوار (MP/PSI/TSI) ثم مباراة CNC الوطنية. 548 مقعداً تُفتح كل سنة.",
      programs: ["الهندسة المدنية والبناء", "الهندسة الكهربائية والطاقة", "الهندسة المعلوماتية والشبكات", "الهندسة الميكانيكية والمواد", "الهندسة الصناعية واللوجستيك", "هندسة العمليات والكيمياء"],
    },
    en: {
      description: "Morocco's oldest and largest public engineering school (1959). Entry via 2-year CPGE (MP/PSI/TSI) + National CNC competitive exam. 548 places per year.",
      programs: ["Civil Engineering & Construction", "Electrical Engineering & Energy", "Computer Engineering & Networks", "Mechanical Engineering & Materials", "Industrial Engineering & Logistics", "Process Engineering & Chemistry"],
    },
  },
  "ehtp": {
    ar: {
      description: "المدرسة الوطنية للأشغال العامة والبنية التحتية تحت وصاية وزارة النقل. الدخول عبر كلاس براباطوار (MP/PSI) ثم CNC. 300 مقعد. المرجع في مشاريع البنية التحتية الكبرى بالمغرب.",
      programs: ["الهندسة المدنية والهياكل", "الهندسة الكهربائية وأنظمة النقل", "الهندسة المعلوماتية والشبكات", "النقل واللوجستيك", "التخطيط العمراني وتهيئة التراب"],
    },
    en: {
      description: "National school for public works and infrastructure under the Ministry of Transport. Entry via CPGE (MP/PSI) + CNC. 300 places. The reference for Morocco's major infrastructure projects.",
      programs: ["Civil Engineering & Structures", "Electrical Engineering & Transport Systems", "Computer Engineering & Networks", "Transport & Logistics", "Urban Planning & Territorial Management"],
    },
  },
  "ensias": {
    ar: {
      description: "أفضل مدرسة للمعلوماتية بالمغرب. الدخول عبر كلاس براباطوار (MP/PSI/TSI) ثم CNC. 281 مقعد. شراكات مع Microsoft وOracle وIBM.",
      programs: ["هندسة البرمجيات والمعمارية", "الأمن المعلوماتي وحماية الأنظمة", "الذكاء الاصطناعي وتعلم الآلة", "الشبكات والحوسبة السحابية", "علم البيانات وذكاء الأعمال", "الأنظمة المدمجة وإنترنت الأشياء"],
    },
    en: {
      description: "Morocco's top computer science school. Entry via CPGE (MP/PSI/TSI) + CNC. 281 places. Partnerships with Microsoft, Oracle and IBM.",
      programs: ["Software Engineering & Architecture", "Cybersecurity & Information Systems Security", "Artificial Intelligence & Machine Learning", "Networks & Cloud Computing", "Data Science & Business Intelligence", "Embedded Systems & IoT"],
    },
  },
  "inpt": {
    ar: {
      description: "المدرسة الوطنية للاتصالات. الدخول عبر كلاس براباطوار (MP/PSI/TSI) ثم CNC. 246 مقعد. الشريان الرئيسي لشركات Maroc Telecom وInwi وOrange.",
      programs: ["الاتصالات والشبكات المحمولة", "الأمن المعلوماتي وحماية البيانات", "الحوسبة السحابية والبنية الموزعة", "الذكاء الاصطناعي وتحليل البيانات الضخمة", "أنظمة المعلومات"],
    },
    en: {
      description: "The national telecom engineering school. Entry via CPGE (MP/PSI/TSI) + CNC. 246 places. Main pipeline for Maroc Telecom, Inwi and Orange.",
      programs: ["Telecommunications & Mobile Networks", "Cybersecurity & Data Protection", "Cloud Computing & Distributed Architecture", "AI & Big Data Analytics", "Information Systems"],
    },
  },
  "enim": {
    ar: {
      description: "الشريك التاريخي لمجموعة OCP. الدخول عبر كلاس براباطوار (MP/PSI) ثم CNC. المدرسة المرجعية لصناعة المناجم والكيمياء والفوسفاط بالمغرب.",
      programs: ["الهندسة المنجمية والاستخراج", "الجيولوجيا التطبيقية والتنقيب", "الكيمياء الصناعية وهندسة العمليات", "هندسة البيئة ومعالجة النفايات", "هندسة المواد والمعادن"],
    },
    en: {
      description: "OCP Group's historic partner. Entry via CPGE (MP/PSI) + CNC. The reference school for Morocco's mining, chemical and phosphate industry.",
      programs: ["Mining Engineering & Extraction", "Applied Geology & Prospecting", "Industrial Chemistry & Process Engineering", "Environmental Engineering & Waste Treatment", "Materials Engineering & Metallurgy"],
    },
  },
  "insea": {
    ar: {
      description: "المدرسة الوطنية للإحصاء والاقتصاد التطبيقي. الدخول عبر كلاس براباطوار (MP/PSI) ثم CNC. تُخرج خبراء البيانات والإحصاء للوزارات والبنوك وشركات التأمين.",
      programs: ["الإحصاء والرياضيات التطبيقية", "العلوم الاكتوارية والتأمين", "علم البيانات وتعلم الآلة", "الاقتصاد القياسي والتحليل الاقتصادي", "المالية الكمية وإدارة المخاطر", "الديموغرافيا ودراسات السكان"],
    },
    en: {
      description: "The national statistics and applied economics school. Entry via CPGE (MP/PSI) + CNC. Trains data and statistics experts for ministries, banks and insurance companies.",
      programs: ["Statistics & Applied Mathematics", "Actuarial Science & Insurance", "Data Science & Machine Learning", "Econometrics & Economic Analysis", "Quantitative Finance & Risk Management", "Demography & Population Studies"],
    },
  },
  "um6p": {
    ar: {
      description: "جامعة ذات مكانة عالمية مدعومة من مجموعة OCP. القبول مباشرة على الملف + مقابلة. منح تغطي 100% من التكاليف للمتفوقين. حرم فريد على مساحة 150 هكتار في بن جرير.",
      programs: ["علوم الحاسوب وهندسة البرمجيات", "علم البيانات والذكاء الاصطناعي", "الهندسة المستدامة والتكنولوجيا الخضراء", "الزراعة الذكية والتكنولوجيا الزراعية", "العمارة والتصميم العمراني", "تحليل الأعمال والمالية", "الهندسة المدنية والمناجم", "الطب (بشراكة محمد الخامس)"],
    },
    en: {
      description: "World-ranked university backed by OCP Group. Direct admission via application + interview. Merit scholarships covering 100% of fees. Unique 150-hectare campus in Ben Guerir.",
      programs: ["Computer Science & Software Engineering", "Data Science & Artificial Intelligence", "Sustainable Engineering & Green Tech", "Smart Agriculture & AgriTech", "Architecture & Urban Design", "Business Analytics & Finance", "Civil Engineering & Mining", "Medicine (partnership with Mohammed V)"],
    },
  },
  "ensam-casablanca": {
    ar: {
      description: "قبول مباشر من الباكالوريا عبر منصة توجيهي (75%×وطني + 25%×جهوي). معدلات 2025: SM 12.25 · PC/STI 16.17/20. دورة مهندس دولة 5 سنوات. الرسوم ~50,000 درهم/سنة.",
      programs: ["الهندسة الميكانيكية والتصميم الصناعي", "الهندسة الكهروميكانيكية والأتمتة", "الهندسة الصناعية والتصنيع الرشيق", "هندسة المواد المركبة والمتطورة", "الأنظمة الآلية والروبوتيك"],
    },
    en: {
      description: "Direct post-bac admission via Tawjihi platform (75%×national + 25%×regional). 2025 thresholds: SM 12.25 · PC/STI 16.17/20. 5-year State Engineer cycle. Fees ~50,000 MAD/year.",
      programs: ["Mechanical Engineering & Industrial Design", "Electromechanical Engineering & Automation", "Industrial Engineering & Lean Manufacturing", "Composite & Advanced Materials Engineering", "Automated Systems & Robotics"],
    },
  },
  "ensam-meknes": {
    ar: {
      description: "حرم ENSAM بمكناس. قبول مباشر من الباكالوريا عبر توجيهي. دورة مهندس دولة 5 سنوات. المنطقة الصناعية بمكناس تضمن فرص تدريب ممتازة.",
      programs: ["الهندسة الميكانيكية", "الهندسة الصناعية", "هندسة المواد", "الجودة والصيانة"],
    },
    en: {
      description: "ENSAM Meknes campus. Direct post-bac admission via Tawjihi. 5-year State Engineer cycle. Meknes industrial zone ensures excellent internship opportunities.",
      programs: ["Mechanical Engineering", "Industrial Engineering", "Materials Engineering", "Quality & Maintenance"],
    },
  },
  "ensam-rabat": {
    ar: {
      description: "الحرم الثالث لشبكة ENSAM في العاصمة الرباط. قبول مباشر من الباكالوريا عبر توجيهي. دورة مهندس دولة 5 سنوات.",
      programs: ["الهندسة الميكانيكية", "الهندسة الصناعية", "الهندسة الكهروميكانيكية", "التصنيع الرقمي"],
    },
    en: {
      description: "Third ENSAM campus, located in the capital Rabat. Direct post-bac admission via Tawjihi. 5-year State Engineer cycle.",
      programs: ["Mechanical Engineering", "Industrial Engineering", "Electromechanical Engineering", "Digital Manufacturing"],
    },
  },
  "ensa-agadir": {
    ar: {
      description: "قبول مباشر من الباكالوريا عبر توجيهي (75%×وطني + 25%×جهوي). معدلات: SM 12/20 · PC 14/20 · STI 15-16.5/20. دورة مندمجة 5 سنوات. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية", "الهندسة الصناعية"],
    },
    en: {
      description: "Direct post-bac admission via Tawjihi (75%×national + 25%×regional). Thresholds: SM 12 · PC 14 · STI 15-16.5/20. 5-year integrated cycle. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering", "Industrial Engineering"],
    },
  },
  "ensa-fes": {
    ar: {
      description: "حرم ENSA بفاس. قبول مباشر من الباكالوريا عبر توجيهي. وسط صناعي متنوع ومتنامٍ. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية", "الهندسة الميكانيكية"],
    },
    en: {
      description: "ENSA Fès campus. Direct post-bac admission via Tawjihi. Diverse and growing industrial environment. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering", "Mechanical Engineering"],
    },
  },
  "ensa-marrakech": {
    ar: {
      description: "حرم ENSA بمراكش، قرب الحوض الصناعي الكبير. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Marrakech campus, near the major industrial zone. Direct post-bac admission via Tawjihi. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-kenitra": {
    ar: {
      description: "حرم ENSA بالقنيطرة، قطب PSA/رونو الصناعي. فرص تدريب ضخمة في صناعة السيارات. قبول مباشر عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Kénitra campus, in the PSA/Renault automotive hub. Huge internship opportunities in the car industry. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-tanger": {
    ar: {
      description: "حرم ENSA بطنجة، المركز اللوجستي الكبير (ميناء طنجة المتوسط). تخصص في الهندسة اللوجستية. قبول مباشر عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية", "الهندسة اللوجستية"],
    },
    en: {
      description: "ENSA Tanger campus, major logistics hub (Tanger Med port). Specialisation in logistics engineering. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering", "Logistics Engineering"],
    },
  },
  "ensa-oujda": {
    ar: {
      description: "حرم ENSA بوجدة، بوابة الجهة الشرقية وقطب تنموي صاعد. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Oujda campus, gateway to the Eastern region and a rising development hub. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-beni-mellal": {
    ar: {
      description: "حرم ENSA ببني ملال، قطب جهوي صاعد في الهضبة الوسطى. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Béni Mellal campus, rising regional hub in the central plateau. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-el-jadida": {
    ar: {
      description: "حرم ENSA بالجديدة، قرب موقع OCP جرف لصفر الصناعي الكبير. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA El Jadida campus, near the large OCP Jorf Lasfar industrial site. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-berrechid": {
    ar: {
      description: "حرم ENSA ببرشيد، ضمن الشبكة الصناعية لقطب عرفاء-برشيد-البيضاء. قبول مباشر عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Berrechid campus, within the Settat-Berrechid-Casablanca industrial network. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-khouribga": {
    ar: {
      description: "حرم ENSA بخريبكة، عاصمة الفوسفاط العالمية. شراكة استراتيجية مع OCP. قبول مباشر عبر توجيهي. مجاني.",
      programs: ["الهندسة المعلوماتية", "الهندسة الكهربائية", "الهندسة المنجمية", "الهندسة المدنية"],
    },
    en: {
      description: "ENSA Khouribga campus, the world phosphate capital. Strategic partnership with OCP. Direct post-bac admission. Free.",
      programs: ["Computer Engineering", "Electrical Engineering", "Mining Engineering", "Civil Engineering"],
    },
  },
  "ensa-safi": {
    ar: {
      description: "حرم ENSA بآسفي. تخصصات في الهندسة الكيميائية ومعالجة مياه الصرف الصناعي. قبول مباشر عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة الكيميائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Safi campus. Specialisations in chemical engineering and industrial wastewater treatment. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Chemical Engineering", "Computer Engineering"],
    },
  },
  "ensa-al-hoceima": {
    ar: {
      description: "حرم ENSA بالحسيمة، ضمن مبادرة تنمية المنطقة الشمالية الشرقية. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية"],
    },
    en: {
      description: "ENSA Al Hoceima campus, part of the northeastern region development initiative. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering"],
    },
  },
  "ensa-tetouan": {
    ar: {
      description: "حرم ENSA بتطوان، القريبة من التكتل الصناعي لطنجة المتوسط. قبول مباشر من الباكالوريا عبر توجيهي. مجاني.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة المعلوماتية", "الهندسة الصناعية"],
    },
    en: {
      description: "ENSA Tétouan campus, close to the Tanger Med industrial cluster. Direct post-bac admission. Free.",
      programs: ["Civil Engineering", "Electrical Engineering", "Computer Engineering", "Industrial Engineering"],
    },
  },
  "iscae": {
    ar: {
      description: "أكبر مدرسة تجارية حكومية بالمغرب. تتيح مسار ليسانس مباشر من الباكالوريا (2025: SE 17.24 · SM 17.66 · PC 18.59/20). السن ≤ 21 سنة. مجاني في المسار الحكومي.",
      programs: ["الإدارة العامة والاستراتيجية", "مالية المقاولة والأسواق", "التسويق الرقمي والتواصل", "التدقيق والمراقبة والمحاسبة", "التجارة الدولية وسلسلة التوريد", "ماجستير تنفيذي", "ريادة الأعمال والابتكار"],
    },
    en: {
      description: "Morocco's largest public business school. Offers a direct post-bac Bachelor track (2025: SE 17.24 · SM 17.66 · PC 18.59/20). Age ≤ 21. Free on the public track.",
      programs: ["General Management & Strategy", "Corporate Finance & Markets", "Digital Marketing & Communication", "Audit, Control & Accounting", "International Trade & Supply Chain", "Executive MBA", "Entrepreneurship & Innovation"],
    },
  },
  "iav-hassan-ii": {
    ar: {
      description: "المرجع الوطني في علوم الزراعة والطب البيطري. الدخول عبر سنة تحضيرية انتقائية (APESA) بعد الباكالوريا (SVT/PC). يُخرج أطر مخطط المغرب الأخضر.",
      programs: ["الزراعة العامة والتغذية", "الطب البيطري (6 سنوات)", "البستنة والخضروات", "الصناعة الغذائية والتكنولوجيا الزراعية", "الطبوغرافيا والجيوماتيك", "الهندسة الريفية والماء والبيئة"],
    },
    en: {
      description: "National reference for agronomy and veterinary medicine. Entry via a selective preparatory year (APESA) directly after bac (SVT/PC). Trains engineers for Morocco's Green Plan.",
      programs: ["General Agronomy & Food", "Veterinary Medicine (6 years)", "Horticulture & Market Gardening", "Food Industry & Agri-Technology", "Topography & Geomatics", "Rural Engineering, Water & Environment"],
    },
  },
  "ena-rabat": {
    ar: {
      description: "مباراة وطنية للدخول (QCM + اختبار رسم). معدل 2025 — الرباط 16.04/20. دبلوم الدولة في العمارة (DESA) في 6 سنوات. التسجيل: concoursena.ma",
      programs: ["العمارة", "التخطيط العمراني", "التصميم العمراني", "التراث", "العمارة الداخلية"],
    },
    en: {
      description: "National competitive exam (QCM + drawing test). 2025 threshold — Rabat 16.04/20. State Architecture Diploma (DESA) in 6 years. Registration: concoursena.ma",
      programs: ["Architecture", "Urban Planning", "Urban Design", "Heritage", "Interior Architecture"],
    },
  },
  "ena-fes": {
    ar: {
      description: "حرم ENA بفاس. مباراة وطنية + اختبار رسم. معدل 2025: فاس 15.22/20. فاس القديمة المصنفة يونسكو مختبر حي للعمارة الإسلامية وترميم التراث.",
      programs: ["العمارة", "التخطيط العمراني", "التصميم العمراني", "التراث والصون"],
    },
    en: {
      description: "ENA Fès campus. National exam + drawing test. 2025 threshold: Fès 15.22/20. UNESCO-listed Fès medina is a living laboratory for Islamic architecture and heritage conservation.",
      programs: ["Architecture", "Urban Planning", "Urban Design", "Heritage & Conservation"],
    },
  },
  "ena-marrakech": {
    ar: {
      description: "حرم ENA بمراكش. معدل 2025: مراكش 15.20/20. مباراة وطنية. تخصص في العمارة البيوكليماتية وعمارة السياحة.",
      programs: ["العمارة", "التخطيط العمراني", "المناظر الطبيعية والسياحة", "العمارة البيوكليماتية"],
    },
    en: {
      description: "ENA Marrakech campus. 2025 threshold: 15.20/20. National exam. Specialisation in bioclimatic architecture and tourism architecture.",
      programs: ["Architecture", "Urban Planning", "Landscape & Tourism", "Bioclimatic Architecture"],
    },
  },
  "ena-agadir": {
    ar: {
      description: "حرم ENA جنوب المغرب. مباراة وطنية. التركيز على العمارة الساحلية والتنمية السياحية المستدامة في محور أكادير.",
      programs: ["العمارة", "العمارة الساحلية", "التعمير المستدام", "تصميم المناظر الطبيعية"],
    },
    en: {
      description: "ENA southern Morocco campus. National exam. Focus on coastal architecture and sustainable tourism development in the Agadir corridor.",
      programs: ["Architecture", "Coastal Architecture", "Sustainable Urban Planning", "Landscape Design"],
    },
  },
  "ena-tetouan": {
    ar: {
      description: "حرم ENA في شمال المغرب. تطوان المصنفة يونسكو توفر سياقاً فريداً للعمارة الأندلسية-المغربية. مباراة وطنية.",
      programs: ["العمارة", "المدينة القديمة والتراث", "العمارة الإسبانية-المغربية", "التعمير في الشمال"],
    },
    en: {
      description: "ENA northern Morocco campus. UNESCO-listed Tetouan offers a unique setting for Andalusian-Moroccan architecture. National exam.",
      programs: ["Architecture", "Medina & Heritage", "Hispano-Moroccan Architecture", "Northern Urban Planning"],
    },
  },
  "ena-oujda": {
    ar: {
      description: "حرم ENA في الجهة الشرقية. مباراة وطنية. معدل 2025: ~14.61/20. متخصص في العمارة المتكيفة مع المناخ القاري والبيئات الجافة.",
      programs: ["العمارة", "التعمير الصحراوي", "العمارة البيوكليماتية", "تدبير التراث"],
    },
    en: {
      description: "ENA Eastern region campus. National exam. 2025 threshold: ~14.61/20. Specialised in architecture adapted to continental climates and arid environments.",
      programs: ["Architecture", "Saharan Urban Planning", "Bioclimatic Architecture", "Heritage Management"],
    },
  },
  "fm-rabat": {
    ar: {
      description: "كلية الطب والصيدلة المرجعية وطنياً (جامعة محمد الخامس). مباراة الدخول الوطنية: معدل 12/20 (2025، 75%×وطني + 25%×جهوي). مسار 7 سنوات للطب.",
      programs: ["الطب العام (7 سنوات)", "التخصصات الطبية (إقامة 3-5 سنوات)", "الصيدلة السريرية (5 سنوات)", "الصيدلة الصناعية والمستشفيات"],
    },
    en: {
      description: "Morocco's national reference Faculty of Medicine and Pharmacy (Mohammed V University). National entrance exam: grade 12/20 (2025, 75%×national + 25%×regional). 7-year medicine programme.",
      programs: ["General Medicine (7 years)", "Medical Specialisations (3-5 year residency)", "Clinical Pharmacy (5 years)", "Hospital & Industrial Pharmacy"],
    },
  },
  "fm-casablanca": {
    ar: {
      description: "كلية الطب والصيدلة بالدار البيضاء (ابن رشد — جامعة الحسن الثاني). مباراة الدخول الوطنية: معدل 12/20 (2025). مرتبطة بالمستشفى الجامعي الأكبر بالمغرب.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Casablanca (Ibn Rochd — Hassan II University). National entrance exam: grade 12/20 (2025). Affiliated with Morocco's largest university hospital.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fm-fes": {
    ar: {
      description: "كلية الطب والصيدلة بفاس (جامعة سيدي محمد بن عبد الله). مباراة الدخول الوطنية: معدل 12/20 (2025). تقاليد علمية عريقة.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Fès (Sidi Mohammed Ben Abdellah University). National entrance exam: grade 12/20 (2025). Rich scientific tradition.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fm-marrakech": {
    ar: {
      description: "كلية الطب والصيدلة بمراكش (جامعة قاضي عياض). مباراة الدخول الوطنية. مرتبطة بالمستشفى الجامعي محمد السادس.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Marrakech (Cadi Ayyad University). National entrance exam. Affiliated with the Mohammed VI University Hospital.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fm-oujda": {
    ar: {
      description: "كلية الطب والصيدلة بوجدة (جامعة محمد الأول). مباراة الدخول الوطنية. تُخدم الجهة الشرقية وتطمح لتقليص فجوة الصحة الإقليمية.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Oujda (Mohammed I University). National entrance exam. Serves the Eastern region and aims to reduce the regional health gap.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fm-tanger": {
    ar: {
      description: "كلية الطب والصيدلة بطنجة (جامعة عبد المالك السعدي). مباراة الدخول الوطنية. المستشفى الجامعي محمد السادس بطنجة — مؤسسة التكوين السريري.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Tanger (Abdelmalek Essaâdi University). National entrance exam. Affiliated with the Mohammed VI University Hospital in Tanger.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fm-agadir": {
    ar: {
      description: "كلية الطب والصيدلة بأكادير (جامعة ابن زهر). مباراة الدخول الوطنية. تُخدم منطقة سوس-ماسة وتُعالج النقص الكبير في الأطر الطبية بالجنوب.",
      programs: ["الطب", "الصيدلة"],
    },
    en: {
      description: "Faculty of Medicine and Pharmacy in Agadir (Ibn Zohr University). National entrance exam. Serves the Souss-Massa region and addresses the major shortage of medical staff in the south.",
      programs: ["Medicine", "Pharmacy"],
    },
  },
  "fmd-rabat": {
    ar: {
      description: "كلية طب الأسنان بالرباط. مباراة وطنية خاصة بطب الأسنان (مستقلة عن مباراة الطب). مسار 6 سنوات. إحدى 3 كليات فقط في المغرب.",
      programs: ["جراحة الأسنان", "تقويم الأسنان", "أمراض اللثة", "تعويض الأسنان"],
    },
    en: {
      description: "Faculty of Dental Surgery in Rabat. Own national exam (independent from medicine exam). 6-year programme. One of only 3 dental faculties in Morocco.",
      programs: ["Dental Surgery", "Orthodontics", "Periodontology", "Dental Prosthetics"],
    },
  },
  "fmd-casablanca": {
    ar: {
      description: "كلية طب الأسنان بالدار البيضاء. مباراة وطنية خاصة. 6 سنوات دراسية. المعدل المطلوب عموماً أعلى من مباراة الطب.",
      programs: ["جراحة الأسنان", "تقويم الأسنان", "أمراض اللثة"],
    },
    en: {
      description: "Faculty of Dental Surgery in Casablanca. Own national exam. 6-year programme. The required grade is generally higher than for medicine.",
      programs: ["Dental Surgery", "Orthodontics", "Periodontology"],
    },
  },
  "fmd-fes": {
    ar: {
      description: "كلية طب الأسنان بفاس. مباراة وطنية خاصة. 6 سنوات دراسية. المعدل المطلوب عموماً أعلى من مباراة الطب.",
      programs: ["جراحة الأسنان", "تقويم الأسنان", "تعويض الأسنان"],
    },
    en: {
      description: "Faculty of Dental Surgery in Fès. Own national exam. 6-year programme. The required grade is generally higher than for medicine.",
      programs: ["Dental Surgery", "Orthodontics", "Dental Prosthetics"],
    },
  },
  "ispits": {
    ar: {
      description: "أكبر شبكة عمومية للتكوين شبه الطبي بالمغرب. 20+ معهداً في جميع الجهات. مباراة جهوية. ليسانس مهنية 3 سنوات. تحت وصاية وزارة الصحة.",
      programs: ["التمريض", "قابلة التوليد", "الأشعة والتصوير الطبي", "التخدير والإنعاش", "العلاج الفيزيائي", "المختبر الطبي"],
    },
    en: {
      description: "Morocco's largest public paramedical training network. 20+ institutes across all regions. Regional competitive exam. 3-year Professional Bachelor. Under the Ministry of Health.",
      programs: ["Nursing", "Midwifery", "Radiology & Medical Imaging", "Anaesthesia & Resuscitation", "Physiotherapy", "Medical Laboratory"],
    },
  },
  "encg-casablanca": {
    ar: {
      description: "مدرسة ENCG الدار البيضاء — بوابة التجارة الدولية. الدخول عبر انتقاء مسبق على الملف (12/20 SE/SM) + مباراة TAFEM كتابية. التسجيل: cursussup.gov.ma",
      programs: ["الإدارة العامة والتنظيم", "مالية المقاولة والمحاسبة", "التسويق والتواصل التجاري", "التجارة الدولية والاستيراد/التصدير", "التدقيق ومراقبة التسيير", "اللوجستيك وسلسلة التوريد"],
    },
    en: {
      description: "ENCG Casablanca — gateway to international trade. Entry via pre-selection on file (12/20 SE/SM) + TAFEM written exam. Registration: cursussup.gov.ma",
      programs: ["General Management & Organisation", "Corporate Finance & Accounting", "Marketing & Commercial Communication", "International Trade & Import/Export", "Audit & Management Control", "Logistics & Supply Chain Management"],
    },
  },
  "encg-agadir": {
    ar: {
      description: "مدرسة ENCG أكادير مع تخصص متميز في السياحة. الدخول عبر مباراة TAFEM (12/20 SE/SM). مثالية لقطب سوس-ماسة.",
      programs: ["الإدارة", "المالية", "التسويق", "السياحة والفندقة"],
    },
    en: {
      description: "ENCG Agadir with a distinctive tourism specialisation. Entry via TAFEM exam (12/20 SE/SM). Ideal for the Souss-Massa hub.",
      programs: ["Management", "Finance", "Marketing", "Tourism & Hospitality"],
    },
  },
  "encg-fes": {
    ar: {
      description: "مدرسة ENCG فاس. الدخول عبر مباراة TAFEM (12/20 SE/SM). وسط تجاري وصناعي عريق.",
      programs: ["الإدارة", "المالية", "التسويق", "التجارة الدولية"],
    },
    en: {
      description: "ENCG Fès. Entry via TAFEM exam (12/20 SE/SM). Established commercial and industrial environment.",
      programs: ["Management", "Finance", "Marketing", "International Trade"],
    },
  },
  "encg-tanger": {
    ar: {
      description: "مدرسة ENCG طنجة ذات التوجه التجاري الدولي. الدخول عبر مباراة TAFEM. مثالية لمحور البحر الأبيض المتوسط الشمالي وميناء طنجة المتوسط.",
      programs: ["الإدارة", "التجارة الدولية", "اللوجستيك", "المالية"],
    },
    en: {
      description: "ENCG Tanger with a strong international trade orientation. Entry via TAFEM exam. Ideal for the northern Mediterranean axis and Tanger Med port.",
      programs: ["Management", "International Trade", "Logistics", "Finance"],
    },
  },
  "encg-marrakech": {
    ar: {
      description: "مدرسة ENCG مراكش مع تخصص في السياحة. الدخول عبر مباراة TAFEM (12/20 SE/SM). قطب سياحي من الدرجة الأولى.",
      programs: ["الإدارة", "السياحة", "التسويق", "المالية"],
    },
    en: {
      description: "ENCG Marrakech with a tourism specialisation. Entry via TAFEM exam (12/20 SE/SM). First-rate tourism hub.",
      programs: ["Management", "Tourism", "Marketing", "Finance"],
    },
  },
  "encg-oujda": {
    ar: {
      description: "مدرسة ENCG وجدة. الدخول عبر مباراة TAFEM. تُخدم الجهة الشرقية وتُنمي الكفاءات التجارية والمالية الإقليمية.",
      programs: ["الإدارة", "المالية", "التسويق"],
    },
    en: {
      description: "ENCG Oujda. Entry via TAFEM exam. Serves the Eastern region and develops regional commercial and financial skills.",
      programs: ["Management", "Finance", "Marketing"],
    },
  },
  "encg-settat": {
    ar: {
      description: "مدرسة ENCG سطات. الدخول عبر مباراة TAFEM. تخصص في أعمال الزراعة والصناعة الغذائية، قرب قطب الشاوية الزراعي.",
      programs: ["الإدارة", "المالية", "التسويق", "أعمال الزراعة"],
    },
    en: {
      description: "ENCG Settat. Entry via TAFEM exam. Specialisation in agribusiness, near the Chaouia agricultural hub.",
      programs: ["Management", "Finance", "Marketing", "Agribusiness"],
    },
  },
  "encg-kenitra": {
    ar: {
      description: "مدرسة ENCG القنيطرة. الدخول عبر مباراة TAFEM. تستفيد من قطب القنيطرة الصناعي والمنطقة الاقتصادية الخاصة.",
      programs: ["الإدارة", "المالية", "التسويق", "التجارة"],
    },
    en: {
      description: "ENCG Kénitra. Entry via TAFEM exam. Benefits from Kénitra's industrial hub and special economic zone.",
      programs: ["Management", "Finance", "Marketing", "Commerce"],
    },
  },
  "encg-el-jadida": {
    ar: {
      description: "مدرسة ENCG الجديدة. الدخول عبر مباراة TAFEM. تخصص في التجارة الدولية بالقرب من الموانئ الصناعية.",
      programs: ["الإدارة", "المالية", "التجارة الدولية", "التسويق"],
    },
    en: {
      description: "ENCG El Jadida. Entry via TAFEM exam. International trade specialisation close to industrial ports.",
      programs: ["Management", "Finance", "International Trade", "Marketing"],
    },
  },
  "encg-beni-mellal": {
    ar: {
      description: "مدرسة ENCG بني ملال. الدخول عبر مباراة TAFEM. تخصص في أعمال الزراعة في القطب الزراعي للهضبة الوسطى.",
      programs: ["الإدارة", "المالية", "التسويق", "أعمال الزراعة"],
    },
    en: {
      description: "ENCG Béni Mellal. Entry via TAFEM exam. Agribusiness specialisation in the agricultural hub of the central plateau.",
      programs: ["Management", "Finance", "Marketing", "Agribusiness"],
    },
  },
  "encg-dakhla": {
    ar: {
      description: "مدرسة ENCG الداخلة في الأقاليم الجنوبية. الدخول عبر مباراة TAFEM. تخصصات في السياحة وصيد الأسماك المائي في المدينة الصاعدة.",
      programs: ["الإدارة", "التجارة", "السياحة", "صيد الأسماك والاستزراع المائي"],
    },
    en: {
      description: "ENCG Dakhla in the Southern Provinces. Entry via TAFEM exam. Tourism and aquaculture specialisations in this rising city.",
      programs: ["Management", "Commerce", "Tourism", "Fisheries & Aquaculture"],
    },
  },
  "isit-tanger": {
    ar: {
      description: "المعهد الوطني للسياحة تحت وصاية وزارة السياحة. مباراة دخول كتابية وشفهية. قطاع السياحة من أكبر أصحاب العمل بالمغرب.",
      programs: ["إدارة الفنادق", "إدارة وكالات السفر", "السياحة المستدامة والسياحة البيئية", "إدارة الإيرادات"],
    },
    en: {
      description: "National tourism institute under the Ministry of Tourism. Written + oral competitive exam. Tourism is one of Morocco's largest employers.",
      programs: ["Hotel Management", "Travel Agency Management", "Sustainable & Eco-Tourism", "Revenue Management"],
    },
  },
  "cpge-moulay-youssef": {
    ar: {
      description: "أفضل كلاس براباطوار بالمغرب. يُحضّر لمباريات CNC (EMI، ENSIAS، EHTP، INPT) والكبريات المدارس الفرنسية (البوليتكنيك، CentraleSupélec). مجاني. التسجيل: cpge.ac.ma",
      programs: ["MP (رياضيات-فيزياء)", "PC (فيزياء-كيمياء)", "PSI (فيزياء وعلوم المهندس)"],
    },
    en: {
      description: "Morocco's top CPGE. Prepares for CNC exams (EMI, ENSIAS, EHTP, INPT) and top French grandes écoles (Polytechnique, CentraleSupélec). Free. Registration: cpge.ac.ma",
      programs: ["MP (Maths-Physics)", "PC (Physics-Chemistry)", "PSI (Physics & Engineering Sciences)"],
    },
  },
  "cpge-ferhat-hachad": {
    ar: {
      description: "كلاس براباطوار بالقنيطرة. مسارات الهندسة (MPSI/MP) والتكنولوجيا (TSI لباكالوريا STI). يُحضّر للمباراة الوطنية CNC. مجاني.",
      programs: ["MPSI", "MP", "TSI (مسار STI)"],
    },
    en: {
      description: "CPGE in Kénitra. Engineering tracks (MPSI/MP) and technology track (TSI for STI bac). Prepares for the national CNC exam. Free.",
      programs: ["MPSI", "MP", "TSI (STI track)"],
    },
  },
  "cpge-alkindi-tanger": {
    ar: {
      description: "كلاس براباطوار بطنجة. يخدم باكالوريي الشمال المغربي. يُحضّر للمباراة الوطنية CNC لمدارس الهندسة الكبرى. مجاني.",
      programs: ["MPSI", "PCSI", "MP", "PC"],
    },
    en: {
      description: "CPGE in Tanger. Serves northern Morocco bac graduates. Prepares for the national CNC exam for major engineering schools. Free.",
      programs: ["MPSI", "PCSI", "MP", "PC"],
    },
  },
  "cpge-ibn-youssef": {
    ar: {
      description: "كلاس براباطوار التاريخي بمراكش. البوابة الرئيسية للكبريات المدارس الهندسية لباكالوريي جنوب المغرب. مجاني.",
      programs: ["MPSI", "PCSI", "MP", "PC"],
    },
    en: {
      description: "Historic CPGE in Marrakech. Main gateway to top engineering schools for southern Morocco bac graduates. Free.",
      programs: ["MPSI", "PCSI", "MP", "PC"],
    },
  },
  "cpge-oujda": {
    ar: {
      description: "كلاس براباطوار بالجهة الشرقية. يُحضّر باكالوريي SM/PC للمباراة الوطنية CNC لمدارس الهندسة الحكومية. مجاني.",
      programs: ["MPSI", "MP"],
    },
    en: {
      description: "CPGE in the Eastern region. Prepares SM/PC bac graduates for the national CNC exam for public engineering schools. Free.",
      programs: ["MPSI", "MP"],
    },
  },
  "uir": {
    ar: {
      description: "جامعة دولية خاصة ثلاثية اللغة (AR/FR/EN). اعتماد CTI الفرنسي. القبول على الملف + مقابلة مباشرة من الباكالوريا. حرم حديث 25 هكتار. الرسوم: 67,000-125,000 درهم/سنة.",
      programs: ["الهندسة المعلوماتية والأمن الإلكتروني", "الهندسة المدنية والبناء", "الهندسة الكهربائية والطاقات المتجددة", "إدارة الأعمال والمالية", "قانون الأعمال والقانون الدولي", "العمارة والتصميم العمراني", "الطيران والنقل الجوي", "العلوم الصحية والطب"],
    },
    en: {
      description: "International trilingual private university (AR/FR/EN). CTI France accreditation. Direct post-bac admission via application + interview. Modern 25-hectare campus. Fees: 67,000–125,000 MAD/year.",
      programs: ["Computer Engineering & Cybersecurity", "Civil Engineering & Construction", "Electrical Engineering & Renewable Energy", "Business Management & Finance", "Business & International Law", "Architecture & Urban Design", "Aeronautics & Air Transport", "Health Sciences & Medicine"],
    },
  },
  "al-akhawayn": {
    ar: {
      description: "جامعة مغرب الأمريكية، حرم 'أمريكا الصغيرة' في إفران. التدريس 100% بالإنجليزية، النظام الأمريكي. القبول على الملف + SAT. الرسوم ~80,760 درهم/سنة. منح كريمة (50-100%).",
      programs: ["إدارة الأعمال (MBA/BBA)", "علوم الحاسوب والأمن الإلكتروني", "الهندسة الكهربائية والإلكترونية", "الآداب والعلوم الإنسانية", "العلوم الاجتماعية والعلاقات الدولية", "دراسات التواصل", "الدراسات البيئية"],
    },
    en: {
      description: "Morocco's American university, 'Little America' campus in Ifrane. 100% English instruction, American system. Admission via application + SAT. Fees ~80,760 MAD/year. Very generous scholarships (50-100%).",
      programs: ["Business Administration (MBA/BBA)", "Computer Science & Cybersecurity", "Electrical & Computer Engineering", "Liberal Arts & Humanities", "Social Sciences & International Relations", "Communication Studies", "Environmental Studies"],
    },
  },
  "hem": {
    ar: {
      description: "أول مدرسة إدارة أعمال خاصة بالمغرب. اعتماد AACSB. القبول على الملف + مقابلة. 5 حرم جامعي (البيضاء، الرباط، مراكش، فاس، طنجة). شبكة خريجين 12,000+ قيادي. الرسوم 70,000-79,000 درهم/سنة.",
      programs: ["الكبرى مدرسة الإدارة (بك+5)", "ماجستير تنفيذي", "بكالوريوس إدارة الأعمال", "مالية السوق والتمويل المؤسسي", "التسويق الرقمي وتسويق البيانات", "الموارد البشرية والقيادة", "ريادة الأعمال والابتكار"],
    },
    en: {
      description: "Morocco's first private business school. AACSB accredited. Admission via application + interview. 5 campuses (Casablanca, Rabat, Marrakech, Fès, Tanger). 12,000+ executive alumni network. Fees: 70,000–79,000 MAD/year.",
      programs: ["Grande École Management (Bac+5)", "Executive MBA", "Bachelor Business Administration", "Capital Markets & Corporate Finance", "Digital Marketing & Data Marketing", "HR & Leadership", "Entrepreneurship & Innovation"],
    },
  },
  "esith": {
    ar: {
      description: "المدرسة الوحيدة المتخصصة في صناعة النسيج والملبوسات بالمغرب. القبول على الملف + اختبارات. المغرب ثاني مصدر عالمي للملابس — توظيف شبه مضمون.",
      programs: ["الهندسة النسيجية", "تصميم الأزياء", "الإدارة الصناعية", "الجودة واللوجستيك"],
    },
    en: {
      description: "Morocco's only school specialised in the textile and clothing industry. Admission via application + tests. Morocco is the world's 2nd clothing exporter — near-guaranteed employment.",
      programs: ["Textile Engineering", "Fashion Design", "Industrial Management", "Quality & Logistics"],
    },
  },
  "enset-mohammedia": {
    ar: {
      description: "مدرسة عليا حكومية تُكون مهندسين وأساتذة التعليم التقني. قبول على مباراة. تُقدم DUT وليسانس وماستر ودورة مهندس. تابعة لجامعة الحسن الثاني.",
      programs: ["الهندسة الكهربائية", "الهندسة الميكانيكية", "الهندسة المعلوماتية", "ليسانس التعليم التقني", "ماجستير الهندسة"],
    },
    en: {
      description: "Public engineering school training engineers and technical education teachers. Competitive exam entry. Offers DUT, Bachelor, Master and engineering cycle. Part of Hassan II University.",
      programs: ["Electrical Engineering", "Mechanical Engineering", "Computer Engineering", "Technical Education Bachelor", "Engineering Master"],
    },
  },
  "mundiapolis": {
    ar: {
      description: "جامعة متعددة التخصصات معتمدة من الدولة. القبول على الملف + مقابلة. شراكات مع فرنسا وإسبانيا وكندا. الرسوم ~33,000 درهم/سنة.",
      programs: ["الهندسة المعلوماتية", "إدارة الأعمال", "التواصل", "الحقوق", "العمارة", "العلوم السياسية"],
    },
    en: {
      description: "Multi-disciplinary state-accredited university. Admission via application + interview. Partnerships with France, Spain and Canada. Fees ~33,000 MAD/year.",
      programs: ["Computer Engineering", "Business", "Communication", "Law", "Architecture", "Political Science"],
    },
  },
  "emsi": {
    ar: {
      description: "مدرسة خاصة للهندسة حاضرة في 8 مدن، تُكون أكثر من 7,000 مهندس سنوياً. القبول على الملف. مثالية للحاصلين على الباكالوريا الراغبين في مسار هندسة دون المرور بالكلاس براباطوار.",
      programs: ["الهندسة المعلوماتية", "الهندسة المدنية", "الهندسة الكهربائية", "علم البيانات", "الأمن الإلكتروني"],
    },
    en: {
      description: "Private engineering school present in 8 cities, training over 7,000 engineers per year. Admission via application. Ideal for bac holders seeking an engineering path without CPGE.",
      programs: ["Computer Engineering", "Civil Engineering", "Electrical Engineering", "Data Science", "Cybersecurity"],
    },
  },
  "upf": {
    ar: {
      description: "جامعة خاصة كبرى بفاس. كلية طب معتمدة من وزارة الصحة. القبول على الملف لجميع الشعب.",
      programs: ["الطب", "الصيدلة", "الحقوق", "إدارة الأعمال", "الهندسة", "العلوم التمريضية"],
    },
    en: {
      description: "Large private university in Fès. Medical faculty accredited by the Ministry of Health. Application-based admission for all programmes.",
      programs: ["Medicine", "Pharmacy", "Law", "Business", "Engineering", "Nursing Sciences"],
    },
  },
  "upm": {
    ar: {
      description: "جامعة خاصة في مراكش الحمراء. كلية طب معتمدة وتكوينات مهنية متنوعة. القبول على الملف.",
      programs: ["الطب", "الهندسة", "إدارة الأعمال", "العمارة", "السياحة", "العلوم التمريضية"],
    },
    en: {
      description: "Private university in Marrakech. Accredited medical school and diverse professional programmes. Application-based admission.",
      programs: ["Medicine", "Engineering", "Business", "Architecture", "Tourism", "Nursing Sciences"],
    },
  },
  "um6ss": {
    ar: {
      description: "البديل الخاص المرجعي للدراسات الطبية بالمغرب. معتمد من وزارة الصحة. رسوم مرتفعة لكن منح متوفرة. عيادة جامعية داخل الحرم.",
      programs: ["الطب العام (7 سنوات)", "الصيدلة (5 سنوات)", "جراحة الأسنان (6 سنوات)", "العلوم التمريضية والطب المساعد", "العلاج الفيزيائي وإعادة التأهيل", "الصحة العامة وإدارة المستشفيات"],
    },
    en: {
      description: "Morocco's leading private medical school. Accredited by the Ministry of Health. High fees but scholarships available. University clinic on campus.",
      programs: ["General Medicine (7 years)", "Pharmacy (5 years)", "Dental Surgery (6 years)", "Nursing & Paramedical Sciences", "Physiotherapy & Rehabilitation", "Public Health & Hospital Management"],
    },
  },
  "esisa": {
    ar: {
      description: "مدرسة المعلوماتية المرجعية بفاس. القبول على الملف. برامج موجهة نحو سوق الشغل مع نسبة إدماج مهني مرتفعة.",
      programs: ["الهندسة المعلوماتية", "أنظمة المعلومات", "علم البيانات", "الأمن الإلكتروني"],
    },
    en: {
      description: "Reference IT school in Fès. Application-based admission. Market-oriented programmes with high professional integration rates.",
      programs: ["Computer Engineering", "Information Systems", "Data Science", "Cybersecurity"],
    },
  },
  "fs-rabat": {
    ar: {
      description: "كلية علوم تاريخية بالعاصمة (جامعة محمد الخامس). قبول مجاني مباشر على الباكالوريا العلمية. بوابة نحو الماجستير المهني والدكتوراه.",
      programs: ["الرياضيات", "الفيزياء", "الكيمياء", "علم الأحياء", "الإعلاميات", "الجيولوجيا"],
    },
    en: {
      description: "Historic science faculty in the capital (Mohammed V University). Free direct admission on science bac. Gateway to professional Masters and PhDs.",
      programs: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Geology"],
    },
  },
  "fsjes-casablanca": {
    ar: {
      description: "كلية الحقوق والاقتصاد والتدبير بالدار البيضاء. قبول مجاني مباشر على الباكالوريا. البوابة المجانية لقطاع القانون والاقتصاد.",
      programs: ["الحقوق", "الاقتصاد", "التسيير", "العلوم السياسية", "العلوم الاجتماعية"],
    },
    en: {
      description: "Faculty of Law, Economics and Management in Casablanca. Free direct bac admission. Free gateway to the legal and economic sector.",
      programs: ["Law", "Economics", "Management", "Political Science", "Social Sciences"],
    },
  },
  "ista": {
    ar: {
      description: "شبكة OFPPT الوطنية. تكوين تقني متخصص في سنتين. مجاني للحاصلين على الباكالوريا المغربية. حاضر في جميع جهات المملكة.",
      programs: ["تقني متخصص في المعلوماتية", "الإلكترونيك", "المحاسبة", "التسيير", "التجارة"],
    },
    en: {
      description: "OFPPT national network. 2-year Specialist Technician training. Free for Moroccan bac holders. Present in all regions of the kingdom.",
      programs: ["IT Specialist Technician", "Electronics", "Accounting", "Management", "Commerce"],
    },
  },
  "fst-mohammedia": {
    ar: {
      description: "كلية العلوم والتقنيات بالمحمدية (جامعة الحسن الثاني). قبول مجاني على الباكالوريا العلمية. تكوين ليسانس بوابة نحو الماجستير المهني ومدارس الهندسة.",
      programs: ["الرياضيات والإعلاميات", "العلوم الفيزيائية", "الكيمياء", "الهندسة المدنية", "الهندسة الكهربائية", "علم الأحياء"],
    },
    en: {
      description: "Faculty of Science and Technology in Mohammedia (Hassan II University). Free bac admission. Licence programme as gateway to professional Masters and engineering schools.",
      programs: ["Mathematics & Computer Science", "Physical Sciences", "Chemistry", "Civil Engineering", "Electrical Engineering", "Biology"],
    },
  },
  "fst-fes": {
    ar: {
      description: "كلية العلوم والتقنيات بفاس (جامعة سيدي محمد بن عبد الله). قبول مجاني على الباكالوريا العلمية.",
      programs: ["الرياضيات التطبيقية", "الفيزياء", "الكيمياء", "الهندسة المدنية", "الهندسة الكهربائية"],
    },
    en: {
      description: "Faculty of Science and Technology in Fès (Sidi Mohammed Ben Abdellah University). Free bac admission.",
      programs: ["Applied Mathematics", "Physics", "Chemistry", "Civil Engineering", "Electrical Engineering"],
    },
  },
  "fst-marrakech": {
    ar: {
      description: "كلية العلوم والتقنيات بمراكش (جامعة قاضي عياض). قبول مجاني على الباكالوريا العلمية.",
      programs: ["الهندسة المدنية", "الهندسة الكهربائية", "الرياضيات التطبيقية", "الكيمياء"],
    },
    en: {
      description: "Faculty of Science and Technology in Marrakech (Cadi Ayyad University). Free bac admission.",
      programs: ["Civil Engineering", "Electrical Engineering", "Applied Mathematics", "Chemistry"],
    },
  },
  "fst-agadir": {
    ar: {
      description: "كلية العلوم والتقنيات بأكادير (جامعة ابن زهر). قبول مجاني على الباكالوريا العلمية. تخصص في علوم البحر والجيولوجيا.",
      programs: ["الهندسة المعلوماتية", "العلوم الفيزيائية", "الكيمياء", "الجيولوجيا", "علم الأحياء البحرية"],
    },
    en: {
      description: "Faculty of Science and Technology in Agadir (Ibn Zohr University). Free bac admission. Specialisation in marine sciences and geology.",
      programs: ["Computer Engineering", "Physical Sciences", "Chemistry", "Geology", "Marine Biology"],
    },
  },
  "fst-beni-mellal": {
    ar: {
      description: "كلية العلوم والتقنيات ببني ملال (جامعة السلطان مولاي سليمان). قبول مجاني على الباكالوريا العلمية.",
      programs: ["الرياضيات", "الفيزياء", "الكيمياء", "علم الأحياء", "الإعلاميات"],
    },
    en: {
      description: "Faculty of Science and Technology in Béni Mellal (Sultan Moulay Slimane University). Free bac admission.",
      programs: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    },
  },
  "est-casablanca": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بالبيضاء. تكوين DUT في سنتين. الانتقاء عبر توجيهي. إدماج سريع في قطاع الصناعة والتجارة.",
      programs: ["تقنيات التدبير", "التجارة والتوزيع", "الإعلاميات التطبيقية", "الاتصالات", "الإلكترونيك"],
    },
    en: {
      description: "School of Applied Science and Technology in Casablanca. 2-year DUT training. Selection via Tawjihi. Fast integration into industry and commerce.",
      programs: ["Management Techniques", "Commerce & Distribution", "Applied IT", "Telecommunications", "Electronics"],
    },
  },
  "est-sale": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بسلا. تكوين DUT في سنتين. الانتقاء عبر توجيهي.",
      programs: ["تقنيات التدبير", "الهندسة المدنية", "إعلاميات التسيير", "التجارة الدولية"],
    },
    en: {
      description: "School of Applied Science and Technology in Salé. 2-year DUT training. Selection via Tawjihi.",
      programs: ["Management Techniques", "Civil Engineering", "Management IT", "International Trade"],
    },
  },
  "est-fes": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بفاس. تكوين DUT في سنتين. الانتقاء عبر توجيهي.",
      programs: ["تقنيات التدبير", "الإعلاميات", "الإلكترونيك", "التجارة والتوزيع"],
    },
    en: {
      description: "School of Applied Science and Technology in Fès. 2-year DUT training. Selection via Tawjihi.",
      programs: ["Management Techniques", "IT", "Electronics", "Commerce & Distribution"],
    },
  },
  "est-meknes": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بمكناس. تكوين DUT في سنتين. تخصصات صناعية متوافقة مع نسيج مكناس الصناعي.",
      programs: ["الهندسة الصناعية", "الصيانة الصناعية", "إعلاميات التسيير", "التجارة"],
    },
    en: {
      description: "School of Applied Science and Technology in Meknes. 2-year DUT training. Industrial specialisations aligned with Meknes' industrial fabric.",
      programs: ["Industrial Engineering", "Industrial Maintenance", "Management IT", "Commerce"],
    },
  },
  "est-agadir": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بأكادير. تكوين DUT في سنتين. تخصصات مرتبطة بالسياحة وصيد الأسماك.",
      programs: ["الفندقة والسياحة", "صيد الأسماك والاستزراع المائي", "الإعلاميات التطبيقية", "التجارة"],
    },
    en: {
      description: "School of Applied Science and Technology in Agadir. 2-year DUT training. Specialisations linked to tourism and fisheries.",
      programs: ["Hotel & Tourism", "Fisheries & Aquaculture", "Applied IT", "Commerce"],
    },
  },
  "est-oujda": {
    ar: {
      description: "مدرسة العلوم والتقنيات التطبيقية بوجدة. تكوين DUT في سنتين. الانتقاء عبر توجيهي.",
      programs: ["تقنيات التدبير", "الإعلاميات", "الإلكترونيك", "التجارة"],
    },
    en: {
      description: "School of Applied Science and Technology in Oujda. 2-year DUT training. Selection via Tawjihi.",
      programs: ["Management Techniques", "IT", "Electronics", "Commerce"],
    },
  },
  "fsjes-agdal": {
    ar: {
      description: "كلية الحقوق والاقتصاد وعلوم التدبير بالرباط-أكدال (محمد الخامس). قبول مجاني مباشر على الباكالوريا.",
      programs: ["الحقوق الخاصة", "الحقوق العامة", "الاقتصاد العام", "تدبير المقاولة", "العلوم السياسية"],
    },
    en: {
      description: "Faculty of Law, Economics and Management Sciences in Rabat-Agdal (Mohammed V). Free direct bac admission.",
      programs: ["Private Law", "Public Law", "General Economics", "Business Management", "Political Science"],
    },
  },
  "fsjes-marrakech": {
    ar: {
      description: "كلية الحقوق والاقتصاد والتدبير بمراكش (جامعة قاضي عياض). قبول مجاني مباشر على الباكالوريا.",
      programs: ["الحقوق", "الاقتصاد", "التسيير", "المالية", "حقوق الأعمال"],
    },
    en: {
      description: "Faculty of Law, Economics and Management in Marrakech (Cadi Ayyad University). Free direct bac admission.",
      programs: ["Law", "Economics", "Management", "Finance", "Business Law"],
    },
  },
  "fsjes-agadir": {
    ar: {
      description: "كلية الحقوق والاقتصاد والتدبير بأكادير (جامعة ابن زهر). قبول مجاني مباشر على الباكالوريا. تخصص في سياحة وحقوق الأعمال.",
      programs: ["الحقوق", "الاقتصاد", "التسيير", "السياحة وحقوق الأعمال", "التجارة الدولية"],
    },
    en: {
      description: "Faculty of Law, Economics and Management in Agadir (Ibn Zohr University). Free direct bac admission. Tourism and business law specialisation.",
      programs: ["Law", "Economics", "Management", "Tourism & Business Law", "International Trade"],
    },
  },
  "fsjes-fes": {
    ar: {
      description: "كلية الحقوق والاقتصاد والتدبير بفاس (جامعة سيدي محمد بن عبد الله). قبول مجاني مباشر على الباكالوريا. تشتهر بشعبة الحقوق الإسلامية.",
      programs: ["الحقوق الخاصة", "الحقوق العامة", "الاقتصاد", "التسيير", "الحقوق الإسلامية"],
    },
    en: {
      description: "Faculty of Law, Economics and Management in Fès (Sidi Mohammed Ben Abdellah University). Free direct bac admission. Known for its Islamic law specialisation.",
      programs: ["Private Law", "Public Law", "Economics", "Management", "Islamic Law"],
    },
  },
  "isic-rabat": {
    ar: {
      description: "المدرسة الحكومية الوحيدة للصحافة والإعلام بالمغرب. انتقاء صارم بكتابي + مقابلة شفهية. تُخرج صحفيي القنوات والإذاعات المغربية الكبرى.",
      programs: ["الصحافة", "التواصل المؤسسي", "العلاقات العامة", "السمعي البصري والسينما", "التواصل الرقمي"],
    },
    en: {
      description: "Morocco's only public journalism and media school. Selective written exam + oral interview. Trains journalists for Morocco's major TV channels and radio stations.",
      programs: ["Journalism", "Corporate Communication", "Public Relations", "Audiovisual & Cinema", "Digital Communication"],
    },
  },
  "inba-tetouan": {
    ar: {
      description: "إحدى أعرق مدارس الفنون بالمغرب، تأسست في عهد الحماية الإسبانية. مباراة فنية خاصة. تُكون الفنانين والمصممين وأساتذة الفنون التشكيلية.",
      programs: ["الرسم والفنون التشكيلية", "التصميم الغرافيكي", "التصوير", "النحت", "الفن والتراث"],
    },
    en: {
      description: "One of Morocco's oldest art schools, founded during the Spanish Protectorate. Specific artistic competitive exam. Trains artists, designers and plastic arts teachers.",
      programs: ["Painting & Plastic Arts", "Graphic Design", "Photography", "Sculpture", "Art & Heritage"],
    },
  },
  "isadac": {
    ar: {
      description: "المعهد الوطني الوحيد لفنون المسرح بالمغرب. دخول عبر التجارب الأدائية. يُكون الممثلين والمخرجين والمديرين الثقافيين المغاربة.",
      programs: ["الفن الدرامي", "الإخراج المسرحي", "الديكور والسينوغرافيا", "التنشيط الثقافي", "التدبير الثقافي"],
    },
    en: {
      description: "Morocco's only national performing arts institute. Entry via artistic auditions. Trains Morocco's actors, directors and cultural managers.",
      programs: ["Dramatic Arts", "Theatre Directing", "Set Design & Scenography", "Cultural Animation", "Cultural Management"],
    },
  },
  "esav-marrakech": {
    ar: {
      description: "المدرسة المرجعية للسينما والفنون البصرية بالمغرب. شراكة مع المهرجان الدولي للفيلم بمراكش ومركز السينما المغربي (CCM).",
      programs: ["السينما والإخراج", "الأنيماسيون ثلاثي الأبعاد والمؤثرات البصرية", "التصميم الغرافيكي", "التصوير الفني"],
    },
    en: {
      description: "Morocco's reference school for cinema and visual arts. Partner of the Marrakech International Film Festival and the Moroccan Cinema Centre (CCM).",
      programs: ["Cinema & Directing", "3D Animation & VFX", "Graphic Design", "Artistic Photography"],
    },
  },
  "fp-rabat": {
    ar: {
      description: "الكلية المتعددة التخصصات بجامعة محمد الخامس بالرباط. الانتقاء عبر توجيهي. دورة ليسانس مع مسار ماستر هندسة.",
      programs: ["الهندسة المعلوماتية", "الهندسة الإلكترونية", "هندسة الأنظمة", "علوم وهندسة المواد"],
    },
    en: {
      description: "Polytechnic faculty of Mohammed V University in Rabat. Selection via Tawjihi. Bachelor programme with an engineering Master pathway.",
      programs: ["Computer Engineering", "Electronic Engineering", "Systems Engineering", "Materials Science & Engineering"],
    },
  },
  "esca-casablanca": {
    ar: {
      description: "مدرسة إدارة الأعمال المعتمدة EFMD بالدار البيضاء. شريك لأكثر من 150 جامعة عالمية. دبلومات مزدوجة مع مؤسسات أوروبية وكندية.",
      programs: ["الكبرى مدرسة الإدارة", "المالية", "التسويق الرقمي", "ريادة الأعمال", "التجارة الدولية"],
    },
    en: {
      description: "EFMD-accredited business school in Casablanca. Partner of 150+ global universities. Double degrees with European and Canadian institutions.",
      programs: ["Grande École Management", "Finance", "Digital Marketing", "Entrepreneurship", "International Business"],
    },
  },
  "supdeco": {
    ar: {
      description: "مدرسة تجارة كبرى مغربية بـ 3 حرم جامعي (مراكش، الدار البيضاء، الرباط). شراكات جامعية مع فرنسا وكندا. قبول على الملف.",
      programs: ["الكبرى مدرسة التجارة", "التسويق", "المالية", "الموارد البشرية", "الأعمال الرقمية"],
    },
    en: {
      description: "Moroccan commerce school with 3 campuses (Marrakech, Casablanca, Rabat). University partnerships in France and Canada. Application-based admission.",
      programs: ["Grande École Commerce", "Marketing", "Finance", "Human Resources", "Digital Business"],
    },
  },
  "ipes": {
    ar: {
      description: "مؤسسة خاصة متعددة التخصصات متاحة لجميع شعب الباكالوريا. رسوم معقولة. مثالية للراغبين في تكوين خاص بأسعار مناسبة.",
      programs: ["الحقوق", "التجارة", "الإعلاميات", "تدبير المقاولة", "التواصل"],
    },
    en: {
      description: "Multi-disciplinary private institution open to all bac tracks. Moderate fees. Ideal for those seeking affordable private education.",
      programs: ["Law", "Commerce", "Computer Science", "Business Management", "Communication"],
    },
  },
  "fst-tanger": {
    ar: {
      description: "كلية العلوم والتقنيات بطنجة (جامعة عبد المالك السعدي). قبول مجاني مباشر على الباكالوريا العلمية. منطقة الشمال الاستراتيجية — ميناء طنجة المتوسط.",
      programs: ["الهندسة المعلوماتية", "الهندسة المدنية", "الهندسة الكهربائية", "الرياضيات التطبيقية"],
    },
    en: {
      description: "Faculty of Science and Technology in Tanger (Abdelmalek Essaâdi University). Free direct bac admission. Strategic northern region — Tanger Med port.",
      programs: ["Computer Engineering", "Civil Engineering", "Electrical Engineering", "Applied Mathematics"],
    },
  },
  "fst-settat": {
    ar: {
      description: "كلية العلوم والتقنيات بسطات (جامعة الحسن الأول). قبول مجاني مباشر على الباكالوريا العلمية. قريبة من الدار البيضاء.",
      programs: ["الرياضيات", "الفيزياء", "الكيمياء", "الإعلاميات", "الهندسة المدنية"],
    },
    en: {
      description: "Faculty of Science and Technology in Settat (Hassan I University). Free direct bac admission. Close to Casablanca.",
      programs: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Civil Engineering"],
    },
  },
  "fst-errachidia": {
    ar: {
      description: "كلية العلوم والتقنيات بالراشيدية (جامعة مولاي إسماعيل). قبول مجاني مباشر على الباكالوريا. منطقة درعة-تافيلالت. الأولوية للحاصلين على منح.",
      programs: ["الرياضيات", "الفيزياء", "الكيمياء", "علم الأحياء", "الجيولوجيا"],
    },
    en: {
      description: "Faculty of Science and Technology in Errachidia (Moulay Ismail University). Free direct bac admission. Drâa-Tafilalet region. Priority for scholarship holders.",
      programs: ["Mathematics", "Physics", "Chemistry", "Biology", "Geology"],
    },
  },
  "fst-al-hoceima": {
    ar: {
      description: "كلية العلوم والتقنيات بالحسيمة (جامعة عبد المالك السعدي). قبول مجاني مباشر على الباكالوريا. منطقة الريف المتوسطية. الأولوية للحاصلين على منح.",
      programs: ["الرياضيات", "الفيزياء", "الكيمياء", "علم الأحياء", "الإعلاميات"],
    },
    en: {
      description: "Faculty of Science and Technology in Al Hoceïma (Abdelmalek Essaâdi University). Free direct bac admission. Mediterranean Rif region. Priority for scholarship holders.",
      programs: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    },
  },
};

export function getSchoolText(
  school: { slug: string; description: string; programs: string[] },
  lang: "fr" | "ar" | "en"
): { description: string; programs: string[] } {
  if (lang === "fr") return { description: school.description, programs: school.programs };
  const override = SCHOOL_I18N[school.slug]?.[lang];
  if (!override) return { description: school.description, programs: school.programs };
  return override;
}
