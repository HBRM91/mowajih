import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Set GEMINI_API_KEY env var"); process.exit(1); }
const MODEL = "gemini-3.1-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const OUT = "../../apps/web/public/images";

mkdirSync(OUT, { recursive: true });

const ASSETS = [
  {
    name: "slimane-avatar",
    prompt: "Professional AI academic counselor avatar, friendly Moroccan young man in his 30s, wearing a modern navy suit with gold tie, warm confident smile, clean digital illustration style, circular portrait format, white background, professional headshot, navy and gold color palette",
    style: "flat design, clean vector illustration, professional portrait",
  },
  {
    name: "hero-illustration",
    prompt: "Moroccan university student (17-18 years old) standing confidently in front of a glowing holographic display showing university buildings and school names like EMI, ENSIAS, ENCG, surrounded by floating data cards showing grades and admission probabilities, modern digital art, wide landscape format, navy deep blue background with gold accent lights",
    style: "modern digital illustration, cinematic, vibrant, tech aesthetic",
  },
  {
    name: "step-01-choose",
    prompt: "Clean minimalist illustration of a student's hand selecting a Bac track on a modern mobile phone interface, showing options SM, PC, SVT on a sleek dark navy phone screen, gold accent colors, white background, square format",
    style: "flat design, minimal, clean vector",
  },
  {
    name: "step-02-ai",
    prompt: "Minimalist illustration of an AI brain made of connected nodes analyzing a student profile, data flowing between a graduation cap icon and school building icons, navy blue and gold color palette, white background, square format",
    style: "flat design, minimal vector, tech geometric",
  },
  {
    name: "step-03-results",
    prompt: "Clean illustration of a trophy with a graduation cap on top, surrounded by school building icons with checkmarks and percentage scores, confetti and XP points floating around, gold and navy colors, white background, celebration mood, square format",
    style: "flat design, celebratory, minimal vector",
  },
  {
    name: "emi-building",
    prompt: "Illustration of EMI Ecole Mohammadia d Ingenieurs building in Rabat Morocco, modern university architecture, navy and gold color scheme, clean vector style, wide format, white background",
    style: "flat architectural illustration, minimal",
  },
  {
    name: "cpge-books",
    prompt: "Stack of engineering and science textbooks with a compass and calculator, representing CPGE preparatory classes, deep navy background, gold accent lighting, minimal clean illustration",
    style: "flat design, minimal vector, dark navy background",
  },
];

async function generate(asset) {
  console.log(`\n⏳ Generating: ${asset.name}...`);
  const fullPrompt = `${asset.prompt}. Art direction: ${asset.style}`;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    console.error(`  ✗ Error: ${data.error?.message ?? res.status}`);
    return null;
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart?.inlineData) {
    console.error(`  ✗ No image returned`);
    return null;
  }

  const ext = imagePart.inlineData.mimeType.split("/")[1] ?? "png";
  const filePath = join(OUT, `${asset.name}.${ext}`);
  writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✓ Saved: apps/web/public/images/${asset.name}.${ext}`);
  return filePath;
}

console.log("🎨 JAD2 TAWJIH — Gemini Image Generator");
console.log(`   Generating ${ASSETS.length} assets...\n`);

for (const asset of ASSETS) {
  await generate(asset);
  // Small pause between requests
  await new Promise(r => setTimeout(r, 2000));
}

console.log("\n✅ Done!");
