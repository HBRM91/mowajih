interface Props {
  probability: number;
  size?: number;
}

export default function ProbabilityRing({ probability, size = 48 }: Props) {
  const stroke = size / 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - probability * circumference;
  const color = probability >= 0.7 ? "#22c55e" : probability >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-slate-800">{Math.round(probability * 100)}%</span>
    </div>
  );
}
