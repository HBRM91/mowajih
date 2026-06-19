const BASE_URL = "https://tawjih.jad2advisory.com";
const LASTMOD = "2026-06-19";

const STATIC_PAGES = [
  { loc: `${BASE_URL}/`,           priority: "1.0", changefreq: "monthly" },
  { loc: `${BASE_URL}/ecoles`,     priority: "0.9", changefreq: "weekly"  },
  { loc: `${BASE_URL}/comparer`,   priority: "0.9", changefreq: "weekly"  },
  { loc: `${BASE_URL}/orientation`,priority: "0.9", changefreq: "weekly"  },
  { loc: `${BASE_URL}/contact`,    priority: "0.3", changefreq: "yearly"  },
  { loc: `${BASE_URL}/privacy`,    priority: "0.3", changefreq: "yearly"  },
];

const SCHOOL_SLUGS = [
  "emi","ehtp","ensias","inpt","enim","insea","um6p",
  "ensam-casablanca","ensam-meknes","ensam-rabat",
  "ensa-agadir","ensa-fes","ensa-marrakech","ensa-kenitra","ensa-tanger",
  "ensa-oujda","ensa-beni-mellal","ensa-el-jadida","ensa-berrechid",
  "ensa-khouribga","ensa-safi","ensa-al-hoceima","ensa-tetouan",
  "iscae","iav-hassan-ii",
  "ena-rabat","ena-fes","ena-marrakech","ena-agadir","ena-tetouan","ena-oujda",
  "fm-rabat","fm-casablanca","fm-fes","fm-marrakech","fm-oujda","fm-tanger","fm-agadir",
  "fmd-rabat","fmd-casablanca","fmd-fes","ispits",
  "encg-casablanca","encg-agadir","encg-fes","encg-tanger","encg-marrakech",
  "encg-oujda","encg-settat","encg-kenitra","encg-el-jadida","encg-beni-mellal","encg-dakhla",
  "isit-tanger",
  "cpge-moulay-youssef","cpge-ferhat-hachad","cpge-alkindi-tanger","cpge-ibn-youssef","cpge-oujda",
  "uir","al-akhawayn","hem","esith","enset-mohammedia","mundiapolis","emsi",
  "upf","upm","um6ss","esisa",
  "fs-rabat","fsjes-casablanca","ista",
  "fst-mohammedia","fst-fes","fst-marrakech","fst-agadir","fst-beni-mellal",
  "fst-tanger","fst-settat","fst-errachidia","fst-al-hoceima",
  "est-casablanca","est-sale","est-fes","est-meknes","est-agadir","est-oujda",
  "fsjes-agdal","fsjes-marrakech","fsjes-agadir","fsjes-fes",
  "isic-rabat","inba-tetouan","isadac","esav-marrakech","fp-rabat","esca-casablanca",
  "supdeco","ipes",
];

export const onRequest: PagesFunction = async () => {
  const urls = [
    ...STATIC_PAGES,
    ...SCHOOL_SLUGS.map((slug) => ({
      loc: `${BASE_URL}/ecoles/${slug}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
