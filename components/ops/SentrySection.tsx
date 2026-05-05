"use client"

import { useEffect, useState } from "react"
import {
  SENTRY_ISSUES,
  SENTRY_STATS,
  FLOW_BREAKDOWN,
  isRecurring,
  getTrend,
  type SentryIssue,
  type IssueTrend,
} from "@/lib/dummy/sentry"
import { fetchSentryLive, type SentryLiveData } from "@/lib/api/sentry"
import { StatCard } from "./StatCard"
import { SectionWrapper } from "./SectionWrapper"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(h / 24)
  if (d >= 7) return `${Math.floor(d / 7)}w ago`
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return "just now"
}

const LEVEL_DOT: Record<string, string> = {
  fatal:   "bg-red-500",
  error:   "bg-orange-500",
  warning: "bg-yellow-500",
}

const LEVEL_LABEL: Record<string, string> = {
  fatal:   "text-red-400",
  error:   "text-orange-400",
  warning: "text-yellow-400",
}

const FLOW_COLORS: Record<string, string> = {
  "Battery Swap":     "bg-violet-900/50 text-violet-300",
  "Rebalancing":      "bg-blue-900/50 text-blue-300",
  "Damage Collection":"bg-orange-900/50 text-orange-300",
  "Authentication":   "bg-red-900/50 text-red-300",
  "Guardian Patrol":  "bg-green-900/50 text-green-300",
  "Fleet Map":        "bg-teal-900/50 text-teal-300",
  "App Loading":      "bg-slate-700 text-slate-300",
  "App":              "bg-slate-700 text-slate-300",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendChip({ trend }: { trend: IssueTrend }) {
  if (trend.dir === "new")    return <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800">NEW</span>
  if (trend.dir === "stable") return <span className="text-xs text-slate-500">→ stable</span>
  if (trend.dir === "up")     return <span className="text-xs font-medium text-red-400">↑ +{trend.pct}%</span>
  return                             <span className="text-xs font-medium text-green-400">↓ -{trend.pct}%</span>
}

function IssueRow({ issue }: { issue: SentryIssue }) {
  const trend     = getTrend(issue)
  const recurring = isRecurring(issue)

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="py-3 pr-4">
        <div className="flex items-start gap-2">
          <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${LEVEL_DOT[issue.level]}`} />
          <div>
            <div className="text-sm text-slate-200 font-mono leading-snug max-w-[380px] truncate">
              {issue.title}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {issue.culprit}{" · "}
              <span className={`font-medium ${LEVEL_LABEL[issue.level]}`}>{issue.level}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="py-3 pr-4 whitespace-nowrap">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${FLOW_COLORS[issue.flow] ?? "bg-slate-700 text-slate-300"}`}>
          {issue.flow}
        </span>
      </td>

      <td className="py-3 pr-4 text-right whitespace-nowrap">
        <div className="text-sm font-semibold tabular-nums text-slate-100">{issue.count.toLocaleString()}</div>
        <div className="mt-0.5"><TrendChip trend={trend} /></div>
      </td>

      <td className="py-3 pr-4 text-right whitespace-nowrap">
        <span className="text-sm tabular-nums text-slate-300">{issue.userCount}</span>
      </td>

      <td className="py-3 pr-4 whitespace-nowrap">
        {issue.status === "resolved"
          ? <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-900/40 text-green-400 border border-green-800">Resolved</span>
          : <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-900">Unresolved</span>
        }
      </td>

      <td className="py-3 pr-4 whitespace-nowrap">
        {recurring
          ? <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-900">Recurring</span>
          : <span className="text-xs text-slate-500">—</span>
        }
      </td>

      <td className="py-3 text-right whitespace-nowrap">
        <span className="text-xs text-slate-500">{relativeTime(issue.lastSeen)}</span>
      </td>
    </tr>
  )
}

function FlowBar({ flow, count, max }: { flow: string; count: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs text-slate-400 text-right truncate flex-shrink-0">{flow}</div>
      <div className="flex-1 bg-slate-800 rounded-full h-2">
        <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${Math.round((count / max) * 100)}%` }} />
      </div>
      <div className="w-14 text-right text-xs tabular-nums text-slate-300">{count.toLocaleString()}</div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-800 rounded" />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Data = {
  issues:       SentryIssue[]
  stats:        typeof SENTRY_STATS
  flowBreakdown: typeof FLOW_BREAKDOWN
  isLive:       boolean
}

export function SentrySection() {
  const [data, setData] = useState<Data>({
    issues:       SENTRY_ISSUES,
    stats:        SENTRY_STATS,
    flowBreakdown: FLOW_BREAKDOWN,
    isLive:       false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetchSentryLive()
      .then((live: SentryLiveData) => {
        setData(live)
        setError(null)
      })
      .catch((err: unknown) => {
        console.warn("Sentry live fetch failed, using dummy data:", err)
        setError("Could not reach Sentry — showing dummy data")
      })
      .finally(() => setLoading(false))
  }, [])

  const { issues, stats, flowBreakdown, isLive } = data
  const maxFlow = flowBreakdown[0]?.count ?? 1
  const recurringUnresolved = issues.filter(i => isRecurring(i) && i.status !== "resolved")

  const badge = loading
    ? "Loading…"
    : isLive
      ? "🟢 Live · forestfleet"
      : `${stats.recurringIssues} recurring`

  const badgeColor = loading ? "slate" : isLive ? "green" : "yellow"

  return (
    <SectionWrapper
      title="Sentry — Forest Fleet"
      subtitle="Errors from the contractor app · last 14 days"
      badge={badge}
      badgeColor={badgeColor}
    >
      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-xs text-slate-400">
          ⚠ {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total events"         value={loading ? "—" : stats.totalEvents.toLocaleString()} color="red" />
        <StatCard label="Unique issues"        value={loading ? "—" : stats.uniqueIssues} />
        <StatCard label="Affected contractors" value={loading ? "—" : stats.affectedContractors} subtext="peak per issue" />
        <StatCard label="Resolved"             value={loading ? "—" : stats.resolvedThisWeek} subtext="this period" color="green" />
        <StatCard label="Recurring"            value={loading ? "—" : stats.recurringIssues} subtext="vs prev week" color="yellow" />
        <StatCard label="New"                  value={loading ? "—" : stats.newIssues} subtext="first seen" color="blue" />
      </div>

      {/* Issues table + Flow breakdown */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0 overflow-x-auto">
          {loading ? (
            <TableSkeleton />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  {["Issue", "Flow", "Events", "Users", "Status", "Type", "Last seen"].map(h => (
                    <th key={h} className="pb-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
              </tbody>
            </table>
          )}
        </div>

        <div className="xl:w-72 flex-shrink-0">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
            Top affected flows
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 bg-slate-800 rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {flowBreakdown.map(({ flow, count }) => (
                <FlowBar key={flow} flow={flow} count={count} max={maxFlow} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recurring issues callout */}
      {!loading && recurringUnresolved.length > 0 && (
        <div className="mt-6 rounded-lg bg-yellow-950/40 border border-yellow-900/60 px-4 py-3">
          <div className="text-xs font-semibold text-yellow-400 mb-2">
            ⚠ {recurringUnresolved.length} unresolved issues also appeared in the previous period
          </div>
          <ul className="space-y-1">
            {recurringUnresolved.map(i => {
              const trend = getTrend(i)
              return (
                <li key={i.id} className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-slate-600 flex-shrink-0">{i.id}</span>
                  <span className="truncate max-w-[420px]">{i.title}</span>
                  {trend.dir === "up"   && <span className="text-red-400 flex-shrink-0">↑ +{trend.pct}%</span>}
                  {trend.dir === "down" && <span className="text-green-400 flex-shrink-0">↓ -{trend.pct}%</span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </SectionWrapper>
  )
}
