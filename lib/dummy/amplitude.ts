export type ContractorRole = "battery_swapper" | "damage_collector" | "rebalancer" | "guardian"

export type FunnelStep = {
  name: string
  completions: number
  dropoffPct: number
}

export type RoleFunnel = {
  role: ContractorRole
  label: string
  totalSessions: number
  completionRate: number
  avgTaskMinutes: number
  steps: FunnelStep[]
  frictionScore: number // 1–10, higher = more friction
}

export const AMPLITUDE_FUNNELS: RoleFunnel[] = [
  {
    role: "battery_swapper",
    label: "Battery Swapper",
    totalSessions: 1840,
    completionRate: 61,
    avgTaskMinutes: 8.4,
    frictionScore: 8,
    steps: [
      { name: "Open app", completions: 1840, dropoffPct: 0 },
      { name: "Select zone", completions: 1720, dropoffPct: 7 },
      { name: "Scan QR code", completions: 1490, dropoffPct: 13 },
      { name: "Confirm swap details", completions: 1180, dropoffPct: 21 },
      { name: "Swap confirmed", completions: 1122, dropoffPct: 5 },
    ],
  },
  {
    role: "damage_collector",
    label: "Damage Collector",
    totalSessions: 640,
    completionRate: 54,
    avgTaskMinutes: 12.1,
    frictionScore: 9,
    steps: [
      { name: "Open app", completions: 640, dropoffPct: 0 },
      { name: "Locate bike", completions: 602, dropoffPct: 6 },
      { name: "Start damage report", completions: 540, dropoffPct: 10 },
      { name: "Upload photos", completions: 381, dropoffPct: 29 },
      { name: "Submit report", completions: 346, dropoffPct: 9 },
    ],
  },
  {
    role: "rebalancer",
    label: "Rebalancer",
    totalSessions: 920,
    completionRate: 72,
    avgTaskMinutes: 18.7,
    frictionScore: 6,
    steps: [
      { name: "Open app", completions: 920, dropoffPct: 0 },
      { name: "Load route", completions: 868, dropoffPct: 6 },
      { name: "Confirm pickup points", completions: 803, dropoffPct: 7 },
      { name: "Mark bikes collected", completions: 751, dropoffPct: 6 },
      { name: "Mark bikes deployed", completions: 662, dropoffPct: 12 },
    ],
  },
  {
    role: "guardian",
    label: "Guardian",
    totalSessions: 1120,
    completionRate: 78,
    avgTaskMinutes: 22.3,
    frictionScore: 5,
    steps: [
      { name: "Open app", completions: 1120, dropoffPct: 0 },
      { name: "Start patrol", completions: 1064, dropoffPct: 5 },
      { name: "Log zone check", completions: 989, dropoffPct: 7 },
      { name: "Report incidents", completions: 921, dropoffPct: 7 },
      { name: "End patrol", completions: 874, dropoffPct: 5 },
    ],
  },
]

export const AMPLITUDE_STATS = {
  totalSessions: AMPLITUDE_FUNNELS.reduce((s, r) => s + r.totalSessions, 0),
  avgCompletionRate: Math.round(
    AMPLITUDE_FUNNELS.reduce((s, r) => s + r.completionRate, 0) / AMPLITUDE_FUNNELS.length,
  ),
  mostFrictionRole: [...AMPLITUDE_FUNNELS].sort((a, b) => b.frictionScore - a.frictionScore)[0],
  bestCompletionRole: [...AMPLITUDE_FUNNELS].sort((a, b) => b.completionRate - a.completionRate)[0],
}
