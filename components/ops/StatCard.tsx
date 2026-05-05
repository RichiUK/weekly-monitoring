type Color = "default" | "red" | "yellow" | "green" | "blue" | "purple"

type Props = {
  label: string
  value: string | number
  subtext?: string
  color?: Color
}

const valueColors: Record<Color, string> = {
  default: "text-slate-100",
  red: "text-red-400",
  yellow: "text-yellow-400",
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-violet-400",
}

export function StatCard({ label, value, subtext, color = "default" }: Props) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-xs text-slate-400 uppercase tracking-widest font-medium">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${valueColors[color]}`}>{value}</div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
  )
}
