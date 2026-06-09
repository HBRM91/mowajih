import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";

interface Profile {
  uuid: string;
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  region: string;
  financialBracket: string;
  firstName: string | null;
  lastName: string | null;
  emailContact: string | null;
  mathGrade: number | null;
  physicsGrade: number | null;
  frenchGrade: number | null;
  arabicGrade: number | null;
  biologyGrade: number | null;
  economicsGrade: number | null;
  techGrade: number | null;
  englishGrade: number | null;
  createdAt: string;
}

const MENTION_COLORS: Record<string, string> = {
  "Très Bien": "bg-emerald-100 text-emerald-800",
  "Bien": "bg-blue-100 text-blue-800",
  "Assez Bien": "bg-amber-100 text-amber-800",
  "Passable": "bg-rose-100 text-rose-800",
};

const TRACK_COLORS: Record<string, string> = {
  SM: "bg-blue-50 text-blue-700 border-blue-200",
  PC: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SVT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SE: "bg-amber-50 text-amber-700 border-amber-200",
  SH: "bg-rose-50 text-rose-700 border-rose-200",
  STI: "bg-slate-50 text-slate-700 border-slate-200",
  L: "bg-purple-50 text-purple-700 border-purple-200",
};

function fetchProfiles(token: string | null, page: number, search: string) {
  const params = new URLSearchParams({ page: String(page), limit: "20", search });
  return fetch(`${API_URL}/api/admin/profiles?${params}`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  }).then((r) => r.json());
}

export default function Profiles() {
  const token = useAuthStore((s) => s.token);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-profiles", page, search],
    queryFn: () => fetchProfiles(token, page, search),
    staleTime: 30_000,
  });

  const profiles: Profile[] = data?.profiles ?? [];
  const pagination = data?.pagination ?? { total: 0, pages: 1 };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-800">Profils Étudiants</h1>
          <p className="text-navy-400 text-sm mt-1">
            {pagination.total} profil{pagination.total !== 1 ? "s" : ""} enregistré{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par filière, ville..."
          className="px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none w-full sm:w-72 bg-cream"
        />
      </div>

      {/* Stats quick view */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total profils", value: pagination.total, icon: "👤" },
          { label: "Avec contact", value: profiles.filter(p => p.emailContact).length, icon: "✉️" },
          { label: "Mention TB/B", value: profiles.filter(p => ["Très Bien","Bien"].includes(p.mention)).length, icon: "⭐" },
          { label: "Cette page", value: profiles.length, icon: "📄" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gold-100/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{stat.icon}</span>
              <span className="font-heading text-2xl font-bold text-navy-800">{stat.value}</span>
            </div>
            <div className="text-xs text-navy-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gold-100/50 p-12 text-center">
          <div className="w-8 h-8 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-navy-400 text-sm">Chargement des profils...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-100/50 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-navy-500 font-medium">Aucun profil trouvé</p>
          <p className="text-navy-400 text-sm mt-1">Les profils apparaissent ici quand des étudiants complètent l'orientation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gold-100/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50 border-b border-gold-100">
                <tr>
                  {["ID", "Bac / Mention", "Moyenne", "Ville", "Contact", "Notes clés", "Date", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-navy-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-50">
                {profiles.map((p) => (
                  <ProfileRow key={p.uuid} profile={p} token={token} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gold-100">
              <span className="text-xs text-navy-400">
                Page {page} / {pagination.pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gold-200 text-navy-600 disabled:opacity-40 hover:bg-gold-50 transition"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gold-200 text-navy-600 disabled:opacity-40 hover:bg-gold-50 transition"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileRow({ profile, token }: { profile: Profile; token: string | null }) {
  const name = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : null;

  const topGrade = Math.max(
    profile.mathGrade ?? 0,
    profile.physicsGrade ?? 0,
    profile.biologyGrade ?? 0,
    profile.economicsGrade ?? 0,
  );

  return (
    <tr className="hover:bg-gold-50/30 transition group">
      <td className="px-4 py-3">
        <span className="font-mono text-[11px] text-navy-400">{profile.uuid.slice(0, 8)}…</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border ${TRACK_COLORS[profile.bacTrack] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}>
            Bac {profile.bacTrack}
          </span>
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${MENTION_COLORS[profile.mention] ?? "bg-slate-100 text-slate-700"}`}>
            {profile.mention}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-14 h-2 bg-navy-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
              style={{ width: `${(profile.generalGrade / 20) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-navy-700">{profile.generalGrade}/20</span>
        </div>
        {topGrade > 0 && (
          <div className="text-[10px] text-navy-400 mt-0.5">Meilleure matière: {topGrade}/20</div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-navy-700">{profile.city}</div>
        <div className="text-[10px] text-navy-400">{profile.region}</div>
      </td>
      <td className="px-4 py-3">
        {name ? (
          <div>
            <div className="text-sm font-medium text-navy-700">{name}</div>
            {profile.emailContact && (
              <a href={`mailto:${profile.emailContact}`} className="text-[10px] text-gold-600 hover:text-gold-700">
                {profile.emailContact}
              </a>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-navy-400 italic">Anonyme</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-[10px] text-navy-400 space-y-0.5">
          {profile.mathGrade != null && <div>Maths: {profile.mathGrade}/20</div>}
          {profile.physicsGrade != null && <div>Physique: {profile.physicsGrade}/20</div>}
          {profile.biologyGrade != null && <div>SVT: {profile.biologyGrade}/20</div>}
          {profile.economicsGrade != null && <div>Éco: {profile.economicsGrade}/20</div>}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-[11px] text-navy-400">
          {profile.createdAt ? new Date(typeof profile.createdAt === "number" ? profile.createdAt * 1000 : profile.createdAt).toLocaleDateString("fr-FR") : "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/profiles/${profile.uuid}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-navy-800 text-gold-200 hover:bg-navy-700 transition opacity-0 group-hover:opacity-100"
        >
          Voir →
        </Link>
      </td>
    </tr>
  );
}
