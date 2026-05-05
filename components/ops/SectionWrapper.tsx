type Props = {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: "red" | "yellow" | "green" | "blue" | "slate"
  children: React.ReactNode
}

const badgeColors = {
  red: "bg-red-900/40 text-red-400 border-red-800",
  yellow: "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  green: "bg-green-900/40 text-green-400 border-green-800",
  blue: "bg-blue-900/40 text-blue-400 border-blue-800",
  slate: "bg-slate-700 text-slate-300 border-slate-600",
}

export function SectionWrapper({ title, subtitle, badge, badgeColor = "slate", children }: Props) {
  return (
    <section className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {badge && (
          <span
            className={`ml-auto text-xs font-medium px-2.5 py-1 rounded border ${badgeColors[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}
