import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeadTable from "../components/pipeline/LeadTable";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function fetchLeads() {
  return fetch(`${API_URL}/leads`, {
    headers: { "CF-Access-JWT-Assertion": localStorage.getItem("tawjih_access_token") || "" },
  }).then((r) => r.json());
}

export default function Pipeline() {
  const { data, isLoading } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });
  const [filter, setFilter] = useState("");

  const leads = data ?? [];
  const filtered = filter
    ? leads.filter((l: any) =>
        l.studentBacTrack?.toLowerCase().includes(filter.toLowerCase()) ||
        l.universityName?.toLowerCase().includes(filter.toLowerCase())
      )
    : leads;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-800">Pipeline</h1>
          <p className="text-navy-400 text-sm mt-1">Gérez vos leads et suivez les conversions</p>
        </div>
        <input
          type="text"
          placeholder="Filtrer par filière, école..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none w-full sm:w-72 bg-cream"
        />
      </div>
      <LeadTable data={filtered} isLoading={isLoading} />
    </div>
  );
}
