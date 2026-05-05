export type SlackCategory = "bug" | "feature" | "data_request" | "general"

export type SlackMessage = {
  id: string
  author: string
  role: string
  text: string
  category: SlackCategory
  timestamp: string
  reactions: number
  threadReplies: number
}

export const SLACK_MESSAGES: SlackMessage[] = [
  {
    id: "msg-001",
    author: "Ana Torres",
    role: "Ops Lead",
    text: "Battery swappers are getting a blank screen after confirming a swap on iOS. It's been happening since Monday. Anyone else seeing this?",
    category: "bug",
    timestamp: "2026-04-21T09:12:00Z",
    reactions: 7,
    threadReplies: 12,
  },
  {
    id: "msg-002",
    author: "James Liu",
    role: "Fleet Ops",
    text: "Can someone pull the completion rate for rebalancers in Zone 4 last week? We think there might be a route optimisation issue.",
    category: "data_request",
    timestamp: "2026-04-21T11:34:00Z",
    reactions: 2,
    threadReplies: 3,
  },
  {
    id: "msg-003",
    author: "Priya Nair",
    role: "Product",
    text: "Feature request from the field: guardians want a quick way to flag a bike as 'needs immediate collection' without going through the full damage report flow.",
    category: "feature",
    timestamp: "2026-04-22T10:05:00Z",
    reactions: 11,
    threadReplies: 8,
  },
  {
    id: "msg-004",
    author: "Carlos Ruiz",
    role: "Tech Ops",
    text: "Photo uploads are failing for damage collectors — seems like files >5MB get rejected. Contractors are unable to submit reports with hi-res photos.",
    category: "bug",
    timestamp: "2026-04-22T14:20:00Z",
    reactions: 5,
    threadReplies: 6,
  },
  {
    id: "msg-005",
    author: "Fatima Al-Hassan",
    role: "Ops Lead",
    text: "Rebalancers in Zone 2 say the suggested routes take them through restricted areas. The map isn't respecting the geo-fences we set last week.",
    category: "bug",
    timestamp: "2026-04-23T08:45:00Z",
    reactions: 9,
    threadReplies: 15,
  },
  {
    id: "msg-006",
    author: "Tom Weston",
    role: "Data",
    text: "We need average task duration by contractor role for the last 30 days for the board deck on Thursday. Can Forest Fleet export this?",
    category: "data_request",
    timestamp: "2026-04-23T16:30:00Z",
    reactions: 1,
    threadReplies: 4,
  },
  {
    id: "msg-007",
    author: "Ana Torres",
    role: "Ops Lead",
    text: "The battery swap blank screen is still happening — no fix yet. This is blocking 300+ swappers. Escalating to P1.",
    category: "bug",
    timestamp: "2026-04-24T09:00:00Z",
    reactions: 14,
    threadReplies: 22,
  },
  {
    id: "msg-008",
    author: "James Liu",
    role: "Fleet Ops",
    text: "Request: can we add a 'pause shift' button for guardians? They currently have to end their shift entirely for breaks, which messes up shift data.",
    category: "feature",
    timestamp: "2026-04-24T13:15:00Z",
    reactions: 8,
    threadReplies: 5,
  },
  {
    id: "msg-009",
    author: "Sam Park",
    role: "Tech Ops",
    text: "App keeps logging contractors out mid-shift. Seems like the session token is expiring after 2h even for active users. Old behaviour was 8h.",
    category: "bug",
    timestamp: "2026-04-25T10:20:00Z",
    reactions: 18,
    threadReplies: 30,
  },
  {
    id: "msg-010",
    author: "Priya Nair",
    role: "Product",
    text: "Can we get a breakdown of which damage types are most reported per zone this month? Planning the next damage collection sprint.",
    category: "data_request",
    timestamp: "2026-04-25T15:40:00Z",
    reactions: 3,
    threadReplies: 2,
  },
  {
    id: "msg-011",
    author: "Fatima Al-Hassan",
    role: "Ops Lead",
    text: "GPS is totally unreliable in the City of London zone — guardians reporting constant 'position unavailable' errors. Affecting patrol coverage.",
    category: "bug",
    timestamp: "2026-04-26T09:55:00Z",
    reactions: 6,
    threadReplies: 9,
  },
  {
    id: "msg-012",
    author: "Carlos Ruiz",
    role: "Tech Ops",
    text: "The photo upload bug from Tuesday — still no fix. Damage collectors are taking notes manually and sending photos via WhatsApp as a workaround.",
    category: "bug",
    timestamp: "2026-04-26T14:10:00Z",
    reactions: 7,
    threadReplies: 11,
  },
]

const categoryCounts = SLACK_MESSAGES.reduce<Record<SlackCategory, number>>(
  (acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1
    return acc
  },
  { bug: 0, feature: 0, data_request: 0, general: 0 },
)

export const SLACK_STATS = {
  totalMessages: SLACK_MESSAGES.length,
  bugs: categoryCounts.bug,
  features: categoryCounts.feature,
  dataRequests: categoryCounts.data_request,
  totalReactions: SLACK_MESSAGES.reduce((s, m) => s + m.reactions, 0),
  totalThreadReplies: SLACK_MESSAGES.reduce((s, m) => s + m.threadReplies, 0),
}
