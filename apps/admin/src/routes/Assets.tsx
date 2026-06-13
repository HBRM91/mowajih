import { useState, useRef } from "react";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";

const STYLE_PRESETS = [
  { key: "", label: "Aucun", desc: "Pas de style imposé" },
  { key: "flat design, clean minimalist vector, navy and gold color palette", label: "Flat / Minimal", desc: "Icônes épurées" },
  { key: "professional photo-realistic, high quality, cinematic lighting", label: "Photo réaliste", desc: "Rendu photographique" },
  { key: "watercolor illustration, soft pastel colors, artistic", label: "Aquarelle", desc: "Illustration artistique" },
  { key: "modern geometric abstract, gradient, moroccan pattern inspired", label: "Géométrique Maroc", desc: "Motifs marocains modernes" },
  { key: "3D render, glossy, studio lighting, product design", label: "3D Render", desc: "Rendu 3D brillant" },
  { key: "vintage poster illustration, retro academic style", label: "Poster Vintage", desc: "Affiches rétro" },
];

const PROMPT_PRESETS = [
  { label: "Bannière EMI Rabat", prompt: "Modern university engineering school building in Rabat Morocco, EMI school, modern architecture, Moroccan design elements, navy blue and gold accents, wide banner format" },
  { label: "Héros IA / Orientation", prompt: "Moroccan university student studying with AI assistant hologram, modern digital interface, navy blue and gold palette, aspirational and professional" },
  { label: "Badge Réussite", prompt: "Academic achievement badge, Moroccan university graduation theme, gold medal design, elegant and minimal, trophy icon" },
  { label: "Fond Géo. Marocain", prompt: "Abstract Moroccan geometric pattern background, zellige tile inspired, navy and gold color scheme, seamless pattern, decorative" },
  { label: "Portrait Conseiller", prompt: "Professional academic advisor portrait illustration, Moroccan university setting, confident and approachable, minimalist style" },
  { label: "Carte École ENCG", prompt: "Business school building illustration Morocco, ENCG style, professional commerce school architecture, clean modern design, gold accents" },
];

interface GeneratedAsset {
  id: string;
  imageBase64: string;
  mimeType: string;
  prompt: string;
  caption: string | null;
  style: string;
  timestamp: Date;
}

export default function Assets() {
  const token = useAuthStore((s) => s.token);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/assets/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt.trim(), style: style || undefined }),
      });

      const data = await res.json() as {
        imageBase64?: string;
        mimeType?: string;
        caption?: string | null;
        prompt?: string;
        error?: string;
        detail?: string;
      };

      if (!res.ok || !data.imageBase64) {
        setError(data.error ?? "Génération échouée.");
        if (data.detail) setError((prev) => `${prev} (${data.detail})`);
        return;
      }

      const asset: GeneratedAsset = {
        id: crypto.randomUUID(),
        imageBase64: data.imageBase64,
        mimeType: data.mimeType ?? "image/png",
        prompt: data.prompt ?? prompt,
        caption: data.caption ?? null,
        style,
        timestamp: new Date(),
      };

      setAssets((prev) => [asset, ...prev]);
      setSelectedAsset(asset);
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  function downloadAsset(asset: GeneratedAsset) {
    const ext = asset.mimeType.split("/")[1] ?? "png";
    const link = document.createElement("a");
    link.href = `data:${asset.mimeType};base64,${asset.imageBase64}`;
    link.download = `jad2-asset-${asset.id.slice(0, 8)}.${ext}`;
    link.click();
  }

  function copyBase64(asset: GeneratedAsset) {
    navigator.clipboard.writeText(`data:${asset.mimeType};base64,${asset.imageBase64}`);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy-800">Générateur d'Assets</h1>
        <p className="text-navy-400 mt-1">Créez des images pour JAD2 TAWJIH via Gemini AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left panel: controls ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Prompt */}
          <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
            <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-3">
              Prompt
            </label>
            <textarea
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
              placeholder="Ex: Modern university campus in Morocco, engineering school, navy and gold colors, professional…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-navy-100 bg-navy-50/40 text-navy-800 placeholder-navy-300 focus:outline-none focus:border-gold-400 focus:bg-white transition-all text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-navy-300">{prompt.length}/500</span>
              <button
                onClick={() => setPrompt("")}
                className="text-[11px] text-navy-300 hover:text-navy-500 transition"
              >
                Effacer
              </button>
            </div>
          </div>

          {/* Style presets */}
          <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
            <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-3">
              Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {STYLE_PRESETS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all text-sm ${
                    style === s.key
                      ? "border-gold-400 bg-gold-50 text-navy-800"
                      : "border-parchment bg-cream text-navy-500 hover:border-gold-200"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style === s.key ? "bg-gold-500" : "bg-navy-200"}`} />
                  <div>
                    <div className="font-semibold text-[13px]">{s.label}</div>
                    <div className="text-[11px] text-navy-400">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt presets */}
          <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
            <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-3">
              Suggestions rapides
            </label>
            <div className="flex flex-wrap gap-2">
              {PROMPT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setPrompt(p.prompt); promptRef.current?.focus(); }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-navy-50 text-navy-600 border border-navy-100 hover:bg-gold-50 hover:border-gold-200 hover:text-navy-800 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={!prompt.trim() || loading}
            className="w-full py-4 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-xl font-bold hover:from-navy-800 hover:to-navy-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-navy-900/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Génération en cours…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Générer l'image
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-navy-300">
            Propulsé par Gemini 2.0 Flash · Max 20 générations/heure
          </p>
        </div>

        {/* ── Right panel: preview + history ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Main preview */}
          <div className="bg-white rounded-2xl border border-gold-100/60 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gold-100/50 flex items-center justify-between">
              <span className="font-semibold text-navy-800 text-sm">Aperçu</span>
              {selectedAsset && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyBase64(selectedAsset)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-500 bg-navy-50 hover:bg-navy-100 rounded-lg transition border border-navy-100"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copier base64
                  </button>
                  <button
                    onClick={() => downloadAsset(selectedAsset)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy-900 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 rounded-lg transition shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger
                  </button>
                </div>
              )}
            </div>

            <div className="p-5">
              {loading ? (
                <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                  </div>
                  <div className="text-center">
                    <p className="text-navy-700 font-semibold text-sm">Génération en cours…</p>
                    <p className="text-navy-400 text-xs mt-1">Gemini 2.0 Flash traite votre image</p>
                  </div>
                </div>
              ) : selectedAsset ? (
                <div>
                  <img
                    src={`data:${selectedAsset.mimeType};base64,${selectedAsset.imageBase64}`}
                    alt={selectedAsset.prompt}
                    className="w-full rounded-xl object-cover shadow-md"
                  />
                  {selectedAsset.caption && (
                    <p className="mt-3 text-sm text-navy-500 italic leading-relaxed">{selectedAsset.caption}</p>
                  )}
                  <div className="mt-3 p-3 bg-navy-50 rounded-xl">
                    <p className="text-[11px] text-navy-400 font-medium uppercase tracking-wider mb-1">Prompt utilisé</p>
                    <p className="text-xs text-navy-600">{selectedAsset.prompt}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-navy-50 to-parchment rounded-xl flex flex-col items-center justify-center gap-3 border-2 border-dashed border-navy-100">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <div className="text-center px-6">
                    <p className="text-navy-600 font-semibold text-sm">Entrez un prompt et générez</p>
                    <p className="text-navy-300 text-xs mt-1">L'image apparaîtra ici</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {assets.length > 0 && (
            <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-navy-800 text-sm">
                  Historique de session ({assets.length})
                </span>
                <button
                  onClick={() => { setAssets([]); setSelectedAsset(null); }}
                  className="text-xs text-navy-300 hover:text-red-400 transition"
                >
                  Effacer
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="group relative">
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedAsset?.id === asset.id
                          ? "border-gold-400 shadow-md shadow-gold-300/20"
                          : "border-parchment hover:border-gold-200"
                      }`}
                    >
                      <img
                        src={`data:${asset.mimeType};base64,${asset.imageBase64}`}
                        alt={asset.prompt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <button
                      onClick={() => downloadAsset(asset)}
                      className="absolute bottom-1 right-1 w-6 h-6 bg-navy-800/80 text-white rounded-md text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Télécharger"
                    >
                      ↓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
