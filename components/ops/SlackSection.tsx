import { SLACK_MESSAGES, SLACK_STATS, type SlackCategory } from "@/lib/dummy/slack"
import { StatCard } from "./StatCard"
import { SectionWrapper } from "./SectionWrapper"

const CATEGORY_META: Record<SlackCategory, { label: string; color: string; dot: string }> = {
  bug: { label: "Bug", color: "bg-red-900/40 text-red-400 border-red-800", dot: "bg-red-500" },
  feature: { label: "Feature", color: "bg-blue-900/40 text-blue-400 border-blue-800", dot: "bg-blue-500" },
  data_request: { label: "Data req.", color: "bg-violet-900/40 text-violet-400 border-violet-800", dot: "bg-violet-500" },
  general: { label: "General", color: "bg-slate-700 text-slate-300 border-slate-600", dot: "bg-slate-400" },
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(h / 24)
  if (d >= 7) return `${Math.floor(d / 7)}w ago`
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return "just now"
}

export function SlackSection() {
  const bugPct = Math.round((SLACK_STATS.bugs / SLACK_STATS.totalMessages) * 100)
  const featPct = Math.round((SLACK_STATS.features / SLACK_STATS.totalMessages) * 100)
  const dataPct = Math.round((SLACK_STATS.dataRequests / SLACK_STATS.totalMessages) * 100)

  return (
    <SectionWrapper
      title="Slack — #tech-operations-bau"
      subtitle="Messages from the last 7 days"
      badge={`${SLACK_STATS.bugs} bugs reported`}
      badgeColor="red"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total messages" value={SLACK_STATS.totalMessages} />
        <StatCard label="Bugs" value={SLACK_STATS.bugs} color="red" />
        <StatCard label="Feature requests" value={SLACK_STATS.features} color="blue" />
        <StatCard label="Data requests" value={SLACK_STATS.dataRequests} color="purple" />
        <StatCard label="Thread replies" value={SLACK_STATS.totalThreadReplies} subtext="across all threads" />
      </div>

      <div className="mb-6">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
          Message breakdown
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          <div className="bg-red-500 h-full" style={{ width: `${bugPct}%` }} />
          <div className="bg-blue-500 h-full" style={{ width: `${featPct}%` }} />
          <div className="bg-violet-500 h-full" style={{ width: `${dataPct}%` }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-400">
          <span><span className="text-red-400">■</span> Bugs {bugPct}%</span>
          <span><span className="text-blue-400">■</span> Features {featPct}%</span>
          <span><span className="text-violet-400">■</span> Data requests {dataPct}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {SLACK_MESSAGES.map((msg) => {
          const meta = CATEGORY_META[msg.category]
          return (
            <div key={msg.id} className="flex items-start gap-3 px-3 py-3 rounded-lg bg-slate-800 border border-slate-700">
              <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${meta.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-slate-300">{msg.author}</span>
                  <span className="text-xs text-slate-600">{msg.role}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="ml-auto text-xs text-slate-600">{relativeTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{msg.text}</p>
                {(msg.reactions > 0 || msg.threadReplies > 0) && (
                  <div className="flex gap-3 mt-1.5 text-xs text-slate-600">
                    {msg.reactions > 0 && <span>👍 {msg.reactions}</span>}
                    {msg.threadReplies > 0 && <span>💬 {msg.threadReplies} replies</span>}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
