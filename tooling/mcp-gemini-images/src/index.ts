import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const STYLES: Record<string, string> = {
  flat:          "flat design, clean vector illustration, bold shapes, minimal detail",
  photo:         "photorealistic, high quality DSLR photograph, cinematic lighting, sharp focus",
  watercolor:    "watercolor illustration, soft washes, artistic brushwork, pastel palette",
  "3d":          "3D render, glossy surfaces, studio lighting, product visualization",
  sketch:        "pencil sketch illustration, hand-drawn, fine line art, black and white",
  isometric:     "isometric illustration, geometric, clean modern design, flat colors",
  gradient:      "modern gradient design, vibrant colors, smooth blends, contemporary UI style",
  vintage:       "vintage poster illustration, retro aesthetic, aged textures, muted palette",
  icon:          "app icon design, clean vector, transparent background, minimal, 1:1 ratio",
  hero:          "wide cinematic hero banner, dramatic lighting, high resolution, professional web design",
};

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{ content: { parts: GeminiPart[] } }>;
  error?: { message: string; code: number };
}

const server = new McpServer({
  name: "gemini-image-generator",
  version: "1.0.0",
});

// ── Tool 1: generate_image ──────────────────────────────────────────────────
server.tool(
  "generate_image",
  `Generate an image using Gemini 2.0 Flash AI and save it to disk.
Use this whenever a website project needs visual assets: hero images, section backgrounds,
icons, illustrations, product mockups, or any other image content.
The image is saved relative to the current working directory.`,
  {
    prompt: z.string().min(3).max(1000).describe(
      "Detailed description of the image. Be specific about subject, mood, colors, composition, and intended use."
    ),
    style: z.enum([
      "flat", "photo", "watercolor", "3d", "sketch",
      "isometric", "gradient", "vintage", "icon", "hero",
    ]).optional().describe(
      "Visual style preset. Use 'icon' for UI icons, 'hero' for full-width banners, 'photo' for realistic images."
    ),
    output_path: z.string().optional().describe(
      "File path to save the image (relative to cwd). E.g. 'public/images/hero.png' or 'src/assets/logo.png'. Defaults to public/images/<slug>.png"
    ),
  },
  async ({ prompt, style, output_path }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        content: [{
          type: "text" as const,
          text: "Error: GEMINI_API_KEY environment variable is not set. Add it to the MCP server config.",
        }],
      };
    }

    const styleDesc = style ? STYLES[style] : undefined;
    const fullPrompt = styleDesc ? `${prompt}. Art direction: ${styleDesc}` : prompt;

    let res: Response;
    try {
      res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      });
    } catch (err) {
      return { content: [{ type: "text" as const, text: `Network error calling Gemini: ${err}` }] };
    }

    const data = await res.json() as GeminiResponse;

    if (!res.ok || data.error) {
      return {
        content: [{
          type: "text" as const,
          text: `Gemini API error ${res.status}: ${data.error?.message ?? "Unknown error"}`,
        }],
      };
    }

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData);
    const textPart = parts.find((p) => p.text);

    if (!imagePart?.inlineData) {
      return {
        content: [{
          type: "text" as const,
          text: `Gemini did not return an image. Response: ${textPart?.text ?? "empty"}`,
        }],
      };
    }

    // Build output path
    const ext = imagePart.inlineData.mimeType.split("/")[1] ?? "png";
    const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40).replace(/-+$/, "");
    const ts = Date.now();
    const resolvedPath = path.resolve(output_path ?? path.join("public", "images", `${slug}-${ts}.${ext}`));

    // Ensure directory exists
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

    // Write file
    fs.writeFileSync(resolvedPath, Buffer.from(imagePart.inlineData.data, "base64"));

    const relPath = path.relative(process.cwd(), resolvedPath);

    return {
      content: [{
        type: "text" as const,
        text: [
          `✓ Image saved: ${relPath}`,
          `  MIME: ${imagePart.inlineData.mimeType}`,
          style ? `  Style: ${style}` : null,
          textPart?.text ? `  Caption: ${textPart.text}` : null,
          `  Use in HTML: <img src="/${relPath.replace(/\\/g, "/")}" alt="${prompt.slice(0, 60)}" />`,
        ].filter(Boolean).join("\n"),
      }],
    };
  }
);

// ── Tool 2: list_image_styles ──────────────────────────────────────────────
server.tool(
  "list_image_styles",
  "List all available image style presets for generate_image.",
  {},
  async () => {
    const lines = Object.entries(STYLES).map(
      ([key, desc]) => `• ${key.padEnd(12)} — ${desc}`
    );
    return {
      content: [{
        type: "text" as const,
        text: `Available styles for generate_image:\n\n${lines.join("\n")}`,
      }],
    };
  }
);

// ── Tool 3: generate_image_batch ──────────────────────────────────────────
server.tool(
  "generate_image_batch",
  "Generate multiple images at once for a website project. Each item gets its own prompt and output path.",
  {
    images: z.array(z.object({
      prompt: z.string().min(3).max(1000),
      style: z.enum([
        "flat", "photo", "watercolor", "3d", "sketch",
        "isometric", "gradient", "vintage", "icon", "hero",
      ]).optional(),
      output_path: z.string().optional(),
    })).min(1).max(5).describe("Array of up to 5 images to generate"),
  },
  async ({ images }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        content: [{ type: "text" as const, text: "Error: GEMINI_API_KEY not set." }],
      };
    }

    const results: string[] = [];

    for (const img of images) {
      const styleDesc = img.style ? STYLES[img.style] : undefined;
      const fullPrompt = styleDesc ? `${img.prompt}. Art direction: ${styleDesc}` : img.prompt;

      try {
        const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        });

        const data = await res.json() as GeminiResponse;
        const parts = data.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p) => p.inlineData);

        if (!imagePart?.inlineData) {
          results.push(`✗ "${img.prompt.slice(0, 40)}…" — no image returned`);
          continue;
        }

        const ext = imagePart.inlineData.mimeType.split("/")[1] ?? "png";
        const slug = img.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40).replace(/-+$/, "");
        const resolvedPath = path.resolve(img.output_path ?? path.join("public", "images", `${slug}-${Date.now()}.${ext}`));
        fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
        fs.writeFileSync(resolvedPath, Buffer.from(imagePart.inlineData.data, "base64"));
        results.push(`✓ ${path.relative(process.cwd(), resolvedPath)}`);
      } catch (err) {
        results.push(`✗ "${img.prompt.slice(0, 40)}…" — error: ${err}`);
      }
    }

    return {
      content: [{ type: "text" as const, text: `Batch results:\n${results.join("\n")}` }],
    };
  }
);

// ── Start ──────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
