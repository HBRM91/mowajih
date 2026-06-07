import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";

interface LeadRow {
  id: number;
  studentUuid: string;
  matchProbability: number;
  matchType: string;
  aiRationale: string;
  hasOptedIn: boolean;
  status: string;
  studentBacTrack: string;
  studentMention: string;
  studentCity: string | null;
  universityName: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  dormant: "bg-slate-100 text-slate-800",
};

const trackColors: Record<string, string> = {
  SM: "bg-blue-50 text-blue-700",
  PC: "bg-indigo-50 text-indigo-700",
  SVT: "bg-emerald-50 text-emerald-700",
  SE: "bg-amber-50 text-amber-700",
  SH: "bg-rose-50 text-rose-700",
  STI: "bg-slate-50 text-slate-700",
  L: "bg-purple-50 text-purple-700",
};

export default function LeadTable({ data, isLoading }: { data: LeadRow[]; isLoading: boolean }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<LeadRow>[] = [
    {
      accessorKey: "studentUuid",
      header: "ID Étudiant",
      cell: ({ row }) => <span className="font-mono text-xs text-slate-500">{row.original.studentUuid.slice(0, 8)}...</span>,
    },
    {
      accessorKey: "studentBacTrack",
      header: "Bac",
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${trackColors[row.original.studentBacTrack] || "bg-slate-100"}`}>
          {row.original.studentBacTrack}
        </span>
      ),
    },
    {
      accessorKey: "studentMention",
      header: "Mention",
    },
    {
      accessorKey: "studentCity",
      header: "Ville",
      cell: ({ row }) => (
        <span className={row.original.hasOptedIn ? "" : "blur-sm select-none"}>
          {row.original.studentCity ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "matchProbability",
      header: "Probabilité",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-tawjih-500"
              style={{ width: `${(row.original.matchProbability * 100).toFixed(0)}%` }}
            />
          </div>
          <span className="text-xs font-medium">{Math.round(row.original.matchProbability * 100)}%</span>
        </div>
      ),
    },
    {
      accessorKey: "matchType",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
          {row.original.matchType.replace("_", "-")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[row.original.status] || "bg-slate-100"}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "hasOptedIn",
      header: "Opt-In",
      cell: ({ row }) => (
        row.original.hasOptedIn
          ? <span className="text-emerald-600 text-xs font-semibold">🔓 Débloqué</span>
          : <span className="text-slate-400 text-xs">🔒 Anonyme</span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement des leads...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-sm">Aucun lead trouvé.</div>
      )}
    </div>
  );
}
