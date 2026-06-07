import { motion } from "framer-motion";

export default function ProbabilityRing({ probability, size = 64 }: { probability: number; size?: number }) {
  const stroke = size / 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - probability * circumference;

  const color = probability >= 0.7 ? "#22c55e" : probability >= 0.5 ? "#f59e0b" : "#ef4444";
  const bgColor = probability >= 0.7 ? "bg-emerald-50" : probability >= 0.5 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full ${bgColor} p-1`} style={{ width: size + 8, height: size + 8 }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E0D6" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-navy-800">{Math.round(probability * 100)}%</span>
    </div>
  );
}
