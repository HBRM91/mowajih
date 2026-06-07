import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { universities } from "../../packages/shared/src/schema";

const sqlite = new Database("./tooling/drizzle/tawjih-local.db");
const db = drizzle(sqlite);

const universityData: Array<{
  slug: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  tier: "premium" | "selective" | "standard" | "accessible";
  requiredSeuil: number;
  bacTracksAccepted: string[];
  optInCost: number;
  monthlyQuota: number;
}> = [
  {
    slug: "universite-mundiapolis",
    name: "Université Mundiapolis",
    shortName: "Mundiapolis",
    city: "Casablanca",
    region: "Casablanca-Settat",
    tier: "selective",
    requiredSeuil: 14.5,
    bacTracksAccepted: ["SM", "PC", "SVT"],
    optInCost: 150,
    monthlyQuota: 60,
  },
  {
    slug: "emsi",
    name: "EMSI — École Marocaine des Sciences de l'Ingénieur",
    shortName: "EMSI",
    city: "Casablanca",
    region: "Multi-campus",
    tier: "standard",
    requiredSeuil: 12.0,
    bacTracksAccepted: ["SM", "PC", "SVT", "STI"],
    optInCost: 100,
    monthlyQuota: 80,
  },
  {
    slug: "heec",
    name: "HEEC — Hautes Études d'Ingénierie et de Commerce",
    shortName: "HEEC",
    city: "Casablanca",
    region: "Casablanca-Settat",
    tier: "premium",
    requiredSeuil: 15.0,
    bacTracksAccepted: ["SM", "PC"],
    optInCost: 200,
    monthlyQuota: 40,
  },
  {
    slug: "iscae",
    name: "ISCAE — Institut Supérieur de Commerce et d'Administration des Entreprises",
    shortName: "ISCAE",
    city: "Casablanca",
    region: "Casablanca-Settat",
    tier: "selective",
    requiredSeuil: 14.0,
    bacTracksAccepted: ["SE", "SM"],
    optInCost: 120,
    monthlyQuota: 50,
  },
  {
    slug: "ehtp",
    name: "EHTP — École Hassania des Travaux Publics",
    shortName: "EHTP",
    city: "Rabat",
    region: "Rabat-Salé-Kénitra",
    tier: "premium",
    requiredSeuil: 16.0,
    bacTracksAccepted: ["SM", "PC"],
    optInCost: 250,
    monthlyQuota: 30,
  },
  {
    slug: "insea",
    name: "INSEA — Institut National de Statistique et d'Économie Appliquée",
    shortName: "INSEA",
    city: "Rabat",
    region: "Rabat-Salé-Kénitra",
    tier: "premium",
    requiredSeuil: 15.5,
    bacTracksAccepted: ["SM", "PC", "SE"],
    optInCost: 220,
    monthlyQuota: 35,
  },
  {
    slug: "uir",
    name: "Université Internationale de Rabat",
    shortName: "UIR",
    city: "Rabat",
    region: "Rabat-Salé-Kénitra",
    tier: "selective",
    requiredSeuil: 13.5,
    bacTracksAccepted: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"],
    optInCost: 130,
    monthlyQuota: 55,
  },
  {
    slug: "universite-privee-fes",
    name: "Université Privée de Fès",
    shortName: "UPF",
    city: "Fès",
    region: "Fès-Meknès",
    tier: "standard",
    requiredSeuil: 11.0,
    bacTracksAccepted: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"],
    optInCost: 80,
    monthlyQuota: 70,
  },
  {
    slug: "universite-privee-marrakech",
    name: "Université Privée de Marrakech",
    shortName: "UPM",
    city: "Marrakech",
    region: "Marrakech-Safi",
    tier: "standard",
    requiredSeuil: 11.5,
    bacTracksAccepted: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"],
    optInCost: 90,
    monthlyQuota: 65,
  },
  {
    slug: "encg",
    name: "ENCG — École Nationale de Commerce et de Gestion",
    shortName: "ENCG",
    city: "Casablanca",
    region: "Casablanca-Settat",
    tier: "selective",
    requiredSeuil: 13.0,
    bacTracksAccepted: ["SE", "SM", "SH"],
    optInCost: 110,
    monthlyQuota: 60,
  },
  {
    slug: "isiam",
    name: "ISIAM — Institut Supérieur d'Ingénierie et des Affaires du Maroc",
    shortName: "ISIAM",
    city: "Casablanca",
    region: "Casablanca-Settat",
    tier: "standard",
    requiredSeuil: 10.5,
    bacTracksAccepted: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"],
    optInCost: 70,
    monthlyQuota: 90,
  },
  {
    slug: "universite-privee-tanger",
    name: "Université Privée de Tanger",
    shortName: "UPT",
    city: "Tanger",
    region: "Tanger-Tétouan-Al Hoceïma",
    tier: "accessible",
    requiredSeuil: 10.0,
    bacTracksAccepted: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"],
    optInCost: 50,
    monthlyQuota: 100,
  },
];

async function seed() {
  console.log("🌱 Seeding universities...");
  for (const uni of universityData) {
    await db.insert(universities).values(uni).onConflictDoNothing();
  }
  console.log(`✅ Seeded ${universityData.length} universities.`);
  sqlite.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
