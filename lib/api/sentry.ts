import type { SentryIssue, SentryLevel, SentryStatus } from "@/lib/dummy/sentry"

// ─── Raw Sentry API types ─────────────────────────────────────────────────────

type RawIssue = {
  shortId: string
  title: string
  culprit: string
  level: string
  status: string
  count: string        // NOTE: string in the Sentry API
  userCount: number
  firstSeen: string
  lastSeen: string
  permalink: string
  stats?: { "14d": [number, number][] }
}

// ─── Flow detection ───────────────────────────────────────────────────────────
// Maps Sentry issue text to the flows shown in the dashboard.

const FLOW_PATTERNS: [RegExp, string][] = [
  [/swap|battery|qr.?scan|charger/i,              "Battery Swap"],
  [/rebalanc|route|pickup|deploy/i,               "Rebalancing"],
  [/damage|photo|upload|camera|413|payload/i,     "Damage Collection"],
  [/auth|token|login|session|401|unauthorized/i,  "Authentication"],
  [/guardian|patrol/i,                            "Guardian Patrol"],
  [/map|gps|location|coordinate|geoloc/i,         "Fleet Map"],
  [/css|preload|nuxt|chunk|hydrat/i,              "App Loading"],
]

function guessFlow(title: string, culprit: string): string {
  const text = `${title} ${culprit}`
  for (const [re, flow] of FLOW_PATTERNS) {
    if (re.test(text)) return flow
  }
  return "App"
}

// ─── Stats helpers ────────────────────────────────────────────────────────────
// Sentry returns 14 daily buckets. Split into two halves for this/prev week.

function splitWeeks(stats14d?: [number, number][]): { thisWeek: number; prevWeek: number } {
  if (!stats14d || stats14d.length < 2) return { thisWeek: 0, prevWeek: 0 }
  const mid = Math.floor(stats14d.length / 2)
  const prevWeek = stats14d.slice(0, mid).reduce((s, [, c]) => s + c, 0)
  const thisWeek = stats14d.slice(mid).reduce((s, [, c]) => s + c, 0)
  return { thisWeek, prevWeek }
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapIssue(raw: RawIssue): SentryIssue {
  const { thisWeek, prevWeek } = splitWeeks(raw.stats?.["14d"])
  const totalCount = parseInt(raw.count, 10)

  // Use the weekly split when available, fall back to the 14d total
  const count     = thisWeek > 0 ? thisWeek : totalCount
  const prevCount = prevWeek

  const level: SentryLevel =
    raw.level === "fatal"   ? "fatal"   :
    raw.level === "warning" ? "warning" : "error"

  const status: SentryStatus =
    raw.status === "resolved" ? "resolved" :
    raw.status === "ignored"  ? "ignored"  : "unresolved"

  return {
    id:            raw.shortId,
    title:         raw.title,
    culprit:       raw.culprit || "—",
    flow:          guessFlow(raw.title, raw.culprit),
    level,
    count,
    userCount:     raw.userCount,
    firstSeen:     raw.firstSeen,
    lastSeen:      raw.lastSeen,
    status,
    prevWeekCount: prevCount,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type SentryLiveData = {
  issues:        SentryIssue[]
  stats: {
    totalEvents:          number
    uniqueIssues:         number
    affectedContractors:  number
    resolvedThisWeek:     number
    recurringIssues:      number
    newIssues:            number
  }
  flowBreakdown: { flow: string; count: number }[]
  isLive:        true
}

export async function fetchSentryLive(): Promise<SentryLiveData> {
  const res = await fetch("/api/sentry", { cache: "no-store" })
  if (!res.ok) throw new Error(`/api/sentry returned ${res.status}`)

  const { unresolved, resolved } = (await res.json()) as {
    unresolved: RawIssue[]
    resolved:   RawIssue[]
  }

  const issues = [...unresolved, ...resolved].map(mapIssue)

  const flowCounts = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.flow] = (acc[i.flow] ?? 0) + i.count
    return acc
  }, {})

  return {
    issues,
    stats: {
      totalEvents:         issues.filter(i => i.status !== "resolved").reduce((s, i) => s + i.count, 0),
      uniqueIssues:        issues.length,
      affectedContractors: issues.reduce((max, i) => Math.max(max, i.userCount), 0),
      resolvedThisWeek:    issues.filter(i => i.status === "resolved").length,
      recurringIssues:     issues.filter(i => i.prevWeekCount > 0).length,
      newIssues:           issues.filter(i => i.prevWeekCount === 0 && i.status !== "resolved").length,
    },
    flowBreakdown: Object.entries(flowCounts)
      .map(([flow, count]) => ({ flow, count }))
      .sort((a, b) => b.count - a.count),
    isLive: true,
  }
}
