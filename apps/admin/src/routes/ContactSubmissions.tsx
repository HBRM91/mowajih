import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet, API_URL } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

type FilterTab = "all" | "student" | "b2b";

interface StudentSubmission {
  type: "student";
  uuid: string;
  name?: string;
  email: string;
  phone?: string;
  requestType: "orientation" | "coaching" | "question" | "other";
  message: string;
  submittedAt: string;
  read: boolean;
}

interface B2BSubmission {
  type: "b2b";
  uuid: string;
  institutionName: string;
  contactName: string;
  role?: string;
  email: string;
  phone?: string;
  partnershipType: "partnership" | "data" | "recruitment" | "other";
  message: string;
  submittedAt: string;
  read: boolean;
}

type Submission = StudentSubmission | B2BSubmission;

interface ContactData {
  submissions: Submission[];
  total: number;
  unread: number;
}

const REQUEST_LABELS: Record<string, string> = {
  orientation: "Orientation générale",
  coaching: "Coaching 1-on-1",
  question: "Question spécifique",
  other: "Autre",
  partnership: "Partenariat commercial",
  data: "Données & Analytics",
  recruitment: "Recrutement étudiant",
};

const REQUEST_COLORS: Record<string, string> = {
  orientation: "bg-blue-50 text-blue-700 border-blue-200",
  coaching: "bg-gold-50 text-gold-700 border-gold-200",
  question: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partnership: "bg-violet-50 text-violet-700 border-violet-200",
  data: "bg-teal-50 text-teal-700 border-teal-200",
  recruitment: "bg-orange-50 text-orange-700 border-orange-200",
  other: "bg-navy-50 text-navy-600 border-navy-200",
};

function SubmissionCard({ sub, onMarkRead }: { sub: Submission; onMarkRead: (uuid: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const reqType = sub.type === "student" ? sub.requestType : sub.partnershipType;
  const displayName = sub.type === "student"
    ? (sub.name ?? sub.email.split("@")[0])
    : sub.institutionName;
  const subLine = sub.type === "student"
    ? sub.email
    : `${sub.contactName}${sub.role ? ` · ${sub.role}` : ""} · ${sub.email}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
        sub.read ? "border-gold-100/60" : "border-gold-300"
      }`}
    >
      <div
        className="p-5 cursor-pointer hover:bg-navy-50/30 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Unread dot */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${sub.read ? "bg-transparent" : "bg-gold-500"}`} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sub.type === "student" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                {sub.type === "student" ? "👤 Étudiant" : "🏛️ Établissement"}
              </span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${REQUEST_COLORS[reqType] ?? REQUEST_COLORS.other}`}>
                {REQUEST_LABELS[reqType] ?? reqType}
              </span>
            </div>
            <div className="font-semibold text-navy-800 text-sm truncate">{displayName}</div>
            <div className="text-xs text-navy-400 truncate">{subLine}</div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xs text-navy-400">
              {new Date(sub.submittedAt).toLocaleDateString("fr-MA", { day: "numeric", month: "short" })}
            </div>
            <div className="text-[10px] text-navy-300">
              {new Date(sub.submittedAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <svg
              className={`w-4 h-4 text-navy-300 mt-1 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-navy-50 px-5 py-4 space-y-4">
              {/* Message */}
              <div>
                <div className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">Message</div>
                <p className="text-sm text-navy-700 leading-relaxed whitespace-pre-wrap bg-navy-50/50 rounded-xl p-3 border border-navy-100/50">
                  {sub.message}
                </p>
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1">Email</div>
                  <a href={`mailto:${sub.email}`} className="text-sm text-gold-600 hover:text-gold-700 transition-colors">
                    {sub.email}
                  </a>
                </div>
                {sub.phone && (
                  <div>
                    <div className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1">Téléphone</div>
                    <a href={`tel:${sub.phone}`} className="text-sm text-navy-700">{sub.phone}</a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <a
                  href={`mailto:${sub.email}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Répondre par email
                </a>
                {!sub.read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(sub.uuid)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition"
                  >
                    ✓ Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactSubmissions() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [filter, setFilter] = useState<FilterTab>("all");

  const typeParam = filter === "all" ? "" : `?type=${filter}`;
  const { data, isLoading } = useQuery<ContactData>({
    queryKey: ["contact-submissions", filter],
    queryFn: () => apiGet<ContactData>(`/api/admin/contact${typeParam}`),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const markRead = useMutation({
    mutationFn: async (uuid: string) => {
      await fetch(`${API_URL}/api/admin/contact/${uuid}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });

  const submissions = data?.submissions ?? [];
  const unread = data?.unread ?? 0;
  const studentCount = submissions.filter((s) => s.type === "student").length;
  const b2bCount = submissions.filter((s) => s.type === "b2b").length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-800">Demandes de contact</h1>
          <p className="text-navy-400 text-sm mt-1">Étudiants et partenaires institutionnels</p>
        </div>
        {unread > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gold-50 border border-gold-200 rounded-full text-xs font-bold text-gold-700">
            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
            {unread} non lu{unread > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: data?.total ?? "—", color: "text-navy-800" },
          { label: "Non lus", value: unread || "—", color: "text-gold-600" },
          { label: "Étudiants", value: studentCount || "—", color: "text-blue-600" },
          { label: "Établissements", value: b2bCount || "—", color: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gold-100/60 p-4 text-center shadow-sm">
            <div className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-navy-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-navy-50 rounded-xl border border-navy-100">
        {(["all", "student", "b2b"] as FilterTab[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              filter === f
                ? "bg-white shadow text-navy-800"
                : "text-navy-400 hover:text-navy-600"
            }`}
          >
            {f === "all" ? "Tous" : f === "student" ? "👤 Étudiants" : "🏛️ Partenaires"}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-gold-100/60 animate-pulse" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gold-100/60 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold text-navy-600">Aucune demande pour le moment</div>
          <div className="text-sm text-navy-400 mt-1">
            Les demandes de contact apparaîtront ici dès qu'elles seront soumises.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <SubmissionCard
              key={sub.uuid}
              sub={sub}
              onMarkRead={(uuid) => markRead.mutate(uuid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
