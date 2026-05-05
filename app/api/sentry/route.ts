import { NextResponse } from "next/server"

const BASE = "https://sentry.io/api/0"

export async function GET() {
  const token   = process.env.SENTRY_AUTH_TOKEN
  const org     = process.env.SENTRY_ORG
  const project = process.env.SENTRY_PROJECT

  if (!token || !org || !project) {
    return NextResponse.json(
      { error: "Sentry credentials not configured" },
      { status: 503 },
    )
  }

  // Fetch both unresolved and recently resolved issues over the last 14 days.
  // statsPeriod=14d is the only multi-day period the Sentry API supports,
  // so we split the daily stats array into two halves to derive this/prev week.
  const [unresolvedRes, resolvedRes] = await Promise.all([
    fetch(
      `${BASE}/projects/${org}/${project}/issues/?limit=25&query=is:unresolved&statsPeriod=14d`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 }, // cache 5 min
      },
    ),
    fetch(
      `${BASE}/projects/${org}/${project}/issues/?limit=10&query=is:resolved&statsPeriod=14d`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      },
    ),
  ])

  if (!unresolvedRes.ok) {
    return NextResponse.json(
      { error: `Sentry returned ${unresolvedRes.status}` },
      { status: unresolvedRes.status },
    )
  }

  const unresolved = await unresolvedRes.json()
  const resolved   = resolvedRes.ok ? await resolvedRes.json() : []

  return NextResponse.json({ unresolved, resolved })
}
