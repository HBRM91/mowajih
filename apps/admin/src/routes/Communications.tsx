import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Communications() {
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [tone, setTone] = useState<"formal" | "friendly">("formal");
  const [leadUuid, setLeadUuid] = useState("");
  const [result, setResult] = useState<{ channel: string; subject: string; body: string; callToAction: string } | null>(null);

  const draft = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/admin/communications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CF-Access-JWT-Assertion": localStorage.getItem("tawjih_access_token") || "",
        },
        body: JSON.stringify({
          leadUuid,
          channel,
          tone,
          universityName: "Université Mundiapolis",
          deanName: "Dr. Alami",
        }),
      });
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Communications IA</h1>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 max-w-xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Lead UUID</label>
          <input
            type="text"
            value={leadUuid}
            onChange={(e) => setLeadUuid(e.target.value)}
            placeholder="ex: 550e8400-e29b-41d4-a716-446655440000"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Canal</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as "email" | "sms")}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ton</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as "formal" | "friendly")}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="formal">Formel</option>
              <option value="friendly">Chaleureux</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => draft.mutate()}
          disabled={draft.isPending}
          className="px-6 py-2.5 bg-tawjih-600 text-white rounded-xl font-medium hover:bg-tawjih-700 disabled:opacity-50"
        >
          {draft.isPending ? "Génération..." : "Générer le brouillon"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-sm font-semibold text-slate-900 mb-1">{result.subject}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line">{result.body}</div>
            <div className="mt-2 text-xs text-tawjih-600 font-medium">CTA: {result.callToAction}</div>
          </div>
        )}
      </div>
    </div>
  );
}
