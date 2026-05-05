export type SentryLevel = "fatal" | "error" | "warning"
export type SentryStatus = "unresolved" | "resolved" | "ignored"

export type SentryIssue = {
  id: string
  title: string
  culprit: string
  flow: string
  level: SentryLevel
  count: number
  userCount: number
  firstSeen: string
  lastSeen: string
  status: SentryStatus
  prevWeekCount: number
}

export const SENTRY_ISSUES: SentryIssue[] = [
  {
    id: "FF-2841",
    title: "TypeError: Cannot read properties of null (reading 'batteryLevel')",
    culprit: "BatterySwapFlow > SwapConfirmation",
    flow: "Battery Swap",
    level: "error",
    count: 847,
    userCount: 312,
    firstSeen: "2026-04-14T09:15:00Z",
    lastSeen: "2026-04-27T18:42:00Z",
    status: "unresolved",
    prevWeekCount: 234,
  },
  {
    id: "FF-2956",
    title: "NetworkError: Failed to fetch rebalancing route",
    culprit: "RebalancingModule > fetchRoute",
    flow: "Rebalancing",
    level: "error",
    count: 623,
    userCount: 198,
    firstSeen: "2026-04-21T14:22:00Z",
    lastSeen: "2026-04-27T16:10:00Z",
    status: "unresolved",
    prevWeekCount: 580,
  },
  {
    id: "FF-3012",
    title: "UploadError: Damage photo upload failed — 413 Payload Too Large",
    culprit: "DamageCollector > uploadPhoto",
    flow: "Damage Collection",
    level: "error",
    count: 441,
    userCount: 87,
    firstSeen: "2026-04-22T11:05:00Z",
    lastSeen: "2026-04-27T09:33:00Z",
    status: "unresolved",
    prevWeekCount: 0,
  },
  {
    id: "FF-2789",
    title: "AuthError: Token refresh failed — 401 Unauthorized",
    culprit: "AuthService > refreshToken",
    flow: "Authentication",
    level: "fatal",
    count: 389,
    userCount: 256,
    firstSeen: "2026-04-19T08:00:00Z",
    lastSeen: "2026-04-26T22:15:00Z",
    status: "resolved",
    prevWeekCount: 1203,
  },
  {
    id: "FF-3045",
    title: "GeolocationError: GPS position unavailable",
    culprit: "MapComponent > getCurrentPosition",
    flow: "Guardian Patrol",
    level: "warning",
    count: 234,
    userCount: 145,
    firstSeen: "2026-04-23T10:30:00Z",
    lastSeen: "2026-04-27T17:55:00Z",
    status: "unresolved",
    prevWeekCount: 189,
  },
  {
    id: "FF-3067",
    title: "RenderError: FleetMap component crashed — Invalid coordinates",
    culprit: "FleetMap > renderBikeMarkers",
    flow: "Fleet Overview",
    level: "error",
    count: 178,
    userCount: 67,
    firstSeen: "2026-04-24T13:45:00Z",
    lastSeen: "2026-04-27T11:20:00Z",
    status: "unresolved",
    prevWeekCount: 0,
  },
  {
    id: "FF-2901",
    title: "TimeoutError: Battery QR scan response timed out (>10s)",
    culprit: "QRScanner > processScan",
    flow: "Battery Swap",
    level: "error",
    count: 156,
    userCount: 89,
    firstSeen: "2026-04-21T16:00:00Z",
    lastSeen: "2026-04-27T14:08:00Z",
    status: "unresolved",
    prevWeekCount: 34,
  },
]

export function isRecurring(issue: SentryIssue): boolean {
  return issue.prevWeekCount > 0
}

export type IssueTrend =
  | { dir: "new" }
  | { dir: "up"; pct: number }
  | { dir: "down"; pct: number }
  | { dir: "stable" }

export function getTrend(issue: SentryIssue): IssueTrend {
  if (issue.prevWeekCount === 0) return { dir: "new" }
  const pct = Math.round(((issue.count - issue.prevWeekCount) / issue.prevWeekCount) * 100)
  if (Math.abs(pct) < 5) return { dir: "stable" }
  return { dir: pct > 0 ? "up" : "down", pct: Math.abs(pct) }
}

const flowCounts = SENTRY_ISSUES.reduce<Record<string, number>>((acc, issue) => {
  acc[issue.flow] = (acc[issue.flow] ?? 0) + issue.count
  return acc
}, {})

export const FLOW_BREAKDOWN = Object.entries(flowCounts)
  .map(([flow, count]) => ({ flow, count }))
  .sort((a, b) => b.count - a.count)

export const SENTRY_STATS = {
  totalEvents: SENTRY_ISSUES.reduce((s, i) => s + i.count, 0),
  uniqueIssues: SENTRY_ISSUES.length,
  affectedContractors: Math.max(...SENTRY_ISSUES.map((i) => i.userCount)),
  resolvedThisWeek: SENTRY_ISSUES.filter((i) => i.status === "resolved").length,
  recurringIssues: SENTRY_ISSUES.filter(isRecurring).length,
  newIssues: SENTRY_ISSUES.filter((i) => !isRecurring(i)).length,
}
