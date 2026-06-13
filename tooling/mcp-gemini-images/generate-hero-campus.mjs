import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Set GEMINI_API_KEY env var"); process.exit(1); }
const MODEL = "gemini-3.1-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const OUT = "../../apps/web/public/images";

mkdirSync(OUT, { recursive: true });

const ASSET = {
  name: "hero-campus",
  prompt: `Wide panoramic cinematic photograph of a modern Moroccan university campus at golden hour.
The image is a full-width landscape (16:9 aspect ratio).
In the foreground: confident young Moroccan students (male and female, 18-20 years old) walking on a plaza, some with backpacks, looking forward with energy and purpose.
In the midground: a beautiful contemporary academic building with Islamic geometric patterns on its façade, green palm trees, well-maintained pathways.
In the background: a stunning sunset sky with deep navy blue fading to warm golden orange on the horizon.
The overall palette is deep navy blue (#0a1628), warm gold (#c9a227), and crisp white.
This is a wide establishing shot, cinematic scope. Shot on RED camera with Zeiss Milvus 21mm lens.
Magazine editorial quality. Very high resolution. No text overlays. Real people, not AI-generated looking.
Color grade: cinematic teal-and-orange contrast with navy shadows and golden highlights.`,
};

async function generate(asset) {
  console.log(`\n⏳ Generating: ${asset.name}...`);

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: asset.prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    console.error(`  ✗ Error: ${data.error?.message ?? res.status}`);
    console.error(JSON.stringify(data, null, 2));
    return null;
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart?.inlineData) {
    const textPart = parts.find((p) => p.text);
    console.error(`  ✗ No image returned. Text: ${textPart?.text?.slice(0, 200)}`);
    return null;
  }

  const ext = imagePart.inlineData.mimeType.split("/")[1] ?? "jpeg";
  const filePath = join(OUT, `${asset.name}.${ext}`);
  writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✓ Saved: apps/web/public/images/${asset.name}.${ext}`);
  return filePath;
}

console.log("🎨 Generating hero-campus panoramic image...");
await generate(ASSET);
console.log("\n✅ Done!");
