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
    name: "hero-photo",
    prompt: "Professional editorial photograph of a young Moroccan male student, 18 years old, wearing a crisp white shirt, sitting at a modern minimalist desk with a laptop showing a glowing university admissions dashboard. Soft bokeh university campus background visible through a window. Warm golden hour light from the left. Shot on Sony A7R with 85mm f/1.4 lens. The mood is ambitious, hopeful, focused. Color grading: deep navy shadows, warm golden highlights. The student looks confident and inspired, slightly smiling at the screen. Photorealistic, cinematic, magazine quality.",
    style: "photorealistic, editorial photography, cinematic color grading, professional DSLR quality",
  },
  {
    name: "step-01-profile",
    prompt: "Modern minimal UI screenshot of a mobile phone screen showing a clean academic profile form. Dark navy blue phone with a form asking for BAC track choices displayed as elegant cards: Sciences Maths, Physique-Chimie, SVT. Clean sans-serif typography, gold accent colors on selected state. The phone is angled at 15 degrees, floating on pure white background with very subtle shadow beneath. Professional app mockup style, no hands, just the device. Realistic screen glow.",
    style: "professional product mockup, minimal UI screenshot, clean app design render",
  },
  {
    name: "step-02-processing",
    prompt: "Minimalist 3D render of a glowing neural network sphere made of gold light nodes and navy blue connecting lines, representing AI processing student data. The sphere is perfectly centered on a clean white background. Subtle bokeh light particles surround it. A few floating data chips with university logos orbiting the sphere. Modern tech aesthetic, luxurious, precise. Studio lighting, soft shadows. No text, no people.",
    style: "3D render, minimal, premium tech aesthetic, studio lighting",
  },
  {
    name: "step-03-match",
    prompt: "Professional photograph of a clean desk with a printed university match report card showing three school logos with percentage scores (92%, 87%, 74%), a graduation cap placed beside it, and a subtle gold trophy figurine in the background. Shot from directly above (flat lay). Warm neutral tones. Crisp shadows. Minimalist Moroccan geometric pattern on the paper border. Very editorial and clean.",
    style: "flat lay photography, editorial, minimal, warm tones, professional product photography",
  },
];

async function generate(asset) {
  console.log(`\n⏳ Generating: ${asset.name}...`);
  const fullPrompt = `${asset.prompt}. Visual style: ${asset.style}`;

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
    console.error(`  ✗ No image returned. Text: ${parts.find(p => p.text)?.text?.slice(0, 100)}`);
    return null;
  }

  const ext = imagePart.inlineData.mimeType.split("/")[1] ?? "jpeg";
  const filePath = join(OUT, `${asset.name}.${ext}`);
  writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✓ Saved: apps/web/public/images/${asset.name}.${ext}`);
  return filePath;
}

console.log("🎨 JAD2 TAWJIH — Premium Asset Generator (Photorealistic)");
console.log(`   Generating ${ASSETS.length} assets...\n`);

for (const asset of ASSETS) {
  await generate(asset);
  await new Promise(r => setTimeout(r, 2000));
}

console.log("\n✅ Done!");
