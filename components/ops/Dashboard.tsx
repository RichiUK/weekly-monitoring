"use client"

import { useState } from "react"
import { SentrySection } from "./SentrySection"
import { SlackSection } from "./SlackSection"
import { AmplitudeSection } from "./AmplitudeSection"
import { InsightsSection } from "./InsightsSection"

type DateRange = "this-week" | "last-week" | "last-4-weeks"

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "this-week": "Apr 21–27, 2026",
  "last-week": "Apr 14–20, 2026",
  "last-4-weeks": "Mar 31 – Apr 27, 2026",
}

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "this-week", label: "This week" },
  { value: "last-week", label: "Last week" },
  { value: "last-4-weeks", label: "Last 4 weeks" },
]

export function Dashboard() {
  const [range, setRange] = useState<DateRange>("this-week")

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🌿</span>
              <h1 className="text-xl font-bold text-slate-100">HumanForest Ops Dashboard</h1>
            </div>
            <p className="text-sm text-slate-500">
              Weekly monitoring · {DATE_RANGE_LABELS[range]}
            </p>
          </div>
          <div className="flex rounded-lg border border-slate-700 overflow-hidden text-sm">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-2 transition-colors ${
                  range === opt.value
                    ? "bg-violet-700 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-600 sm:text-right">
            Last updated: Apr 28, 2026 · 08:00 UTC
            <br />
            <span className="text-slate-700">Using dummy data</span>
          </div>
        </header>

        {range !== "this-week" && (
          <div className="mb-6 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-400">
            Showing{" "}
            <span className="text-slate-200 font-medium">{DATE_RANGE_LABELS[range]}</span>.
            Historical data will load from the real APIs once credentials are configured. Currently
            displaying this week&apos;s dummy data.
          </div>
        )}

        <main className="space-y-6">
          <InsightsSection />
          <SentrySection />
          <SlackSection />
          <AmplitudeSection />
        </main>

        <footer className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-700 text-center">
          HumanForest Ops Dashboard · Local only · No auth required
        </footer>
      </div>
    </div>
  )
}
