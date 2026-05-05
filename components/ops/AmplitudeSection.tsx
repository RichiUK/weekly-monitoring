import { AMPLITUDE_FUNNELS, AMPLITUDE_STATS, type RoleFunnel } from "@/lib/dummy/amplitude"
import { StatCard } from "./StatCard"
import { SectionWrapper } from "./SectionWrapper"

const ROLE_COLORS: Record<string, { bar: string; text: string; border: string }> = {
  battery_swapper: { bar: "bg-violet-500", text: "text-violet-300", border: "border-violet-800" },
  damage_collector: { bar: "bg-orange-500", text: "text-orange-300", border: "border-orange-800" },
  rebalancer: { bar: "bg-blue-500", text: "text-blue-300", border: "border-blue-800" },
  guardian: { bar: "bg-green-500", text: "text-green-300", border: "border-green-800" },
}

function frictionColor(score: number) {
  if (score >= 8) return "text-red-400"
  if (score >= 6) return "text-yellow-400"
  return "text-green-400"
}

function FunnelCard({ funnel }: { funnel: RoleFunnel }) {
  const colors = ROLE_COLORS[funnel.role]
  const maxStep = funnel.steps[0]?.completions ?? 1

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${colors.text}`}>{funnel.label}</h3>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border bg-transparent ${colors.border} ${colors.text}`}>
          {funnel.completionRate}% complete
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div>
          <div className="text-slate-500">Sessions</div>
          <div className="text-slate-200 font-semibold tabular-nums">{funnel.totalSessions.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500">Avg time</div>
          <div className="text-slate-200 font-semibold tabular-nums">{funnel.avgTaskMinutes}m</div>
        </div>
        <div>
          <div className="text-slate-500">Friction</div>
          <div className={`font-semibold tabular-nums ${frictionColor(funnel.frictionScore)}`}>
            {funnel.frictionScore}/10
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        {funnel.steps.map((step, idx) => {
          const widthPct = Math.round((step.completions / maxStep) * 100)
          return (
            <div key={step.name}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-slate-400 truncate max-w-[160px]">{idx + 1}. {step.name}</span>
                <span className="tabular-nums text-slate-400 ml-2 flex-shrink-0">
                  {step.completions.toLocaleString()}
                  {step.dropoffPct > 0 && <span className="text-red-500 ml-1">-{step.dropoffPct}%</span>}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full">
                <div className={`h-1.5 rounded-full ${colors.bar}`} style={{ width: `${widthPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AmplitudeSection() {
  const mostFriction = AMPLITUDE_STATS.mostFrictionRole

  return (
    <SectionWrapper
      title="Amplitude — Contractor Activity"
      subtitle="Funnel completion and drop-off by role"
      badge={`Most friction: ${mostFriction.label}`}
      badgeColor="red"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total sessions" value={AMPLITUDE_STATS.totalSessions.toLocaleString()} />
        <StatCard
          label="Avg completion"
          value={`${AMPLITUDE_STATS.avgCompletionRate}%`}
          subtext="across all roles"
          color={AMPLITUDE_STATS.avgCompletionRate >= 70 ? "green" : "yellow"}
        />
        <StatCard label="Most friction" value={mostFriction.label} subtext={`score ${mostFriction.frictionScore}/10`} color="red" />
        <StatCard
          label="Best completion"
          value={AMPLITUDE_STATS.bestCompletionRole.label}
          subtext={`${AMPLITUDE_STATS.bestCompletionRole.completionRate}% complete`}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {AMPLITUDE_FUNNELS.map((funnel) => (
          <FunnelCard key={funnel.role} funnel={funnel} />
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-red-950/30 border border-red-900/50 px-4 py-3">
        <div className="text-xs font-semibold text-red-400 mb-2">⚠ Critical drop-offs this week</div>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>
            <span className="text-orange-400 font-medium">Damage Collector</span>{" — "}
            Upload photos step: <span className="text-red-400">29% drop-off</span>. Likely related to Sentry UploadError FF-3012.
          </li>
          <li>
            <span className="text-violet-400 font-medium">Battery Swapper</span>{" — "}
            Confirm swap step: <span className="text-red-400">21% drop-off</span>. Correlates with FF-2841 TypeError.
          </li>
        </ul>
      </div>
    </SectionWrapper>
  )
}
