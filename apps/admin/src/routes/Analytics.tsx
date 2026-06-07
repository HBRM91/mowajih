import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function fetchAnalytics() {
  return fetch(`${API_URL}/admin/analytics`, {
    headers: { "CF-Access-JWT-Assertion": localStorage.getItem("tawjih_access_token") || "" },
  }).then((r) => r.json());
}

const COLORS = ["#1B365D", "#C9A962", "#2D508C", "#A68B4F", "#5773A3", "#DFC387"];

export default function Analytics() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });

  const trend = data?.monthlyTrend ?? [];
  const tracks = data?.topTracks ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy-800">Analytiques</h1>
        <p className="text-navy-400 text-sm mt-1">Insights et tendances de votre recrutement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Leads sur 6 mois">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A962" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8196BA" }} />
              <YAxis tick={{ fontSize: 12, fill: "#8196BA" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F5F3EE" }} />
              <Area type="monotone" dataKey="count" stroke="#C9A962" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Répartition par filière">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tracks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
              <XAxis dataKey="bacTrack" tick={{ fontSize: 12, fill: "#8196BA" }} />
              <YAxis tick={{ fontSize: 12, fill: "#8196BA" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F5F3EE" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {tracks.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Qualité des matches">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "High", value: 45 },
                  { name: "Medium", value: 35 },
                  { name: "Low", value: 20 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {["#1B365D", "#C9A962", "#ABB9D1"].map((color, idx) => (
                  <Cell key={idx} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F5F3EE" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gold-100/50 shadow-sm">
      <h3 className="font-heading font-bold text-navy-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
