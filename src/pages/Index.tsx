import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusPill, SourceBadge } from "@/components/StatusPill";
import { rfps, currency, fmtDate, type RfpStatus } from "@/data/mockData";
import { ArrowUpRight, CalendarClock, TrendingUp, Inbox, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Active RFPs", value: "14", delta: "+3 this week", icon: Inbox },
  { label: "Pipeline value", value: "$2.4M", delta: "+18% MoM", icon: TrendingUp },
  { label: "Avg. response time", value: "4.2h", delta: "−61% vs. baseline", icon: CalendarClock },
  { label: "Win rate (90d)", value: "42%", delta: "+9 pts", icon: CheckCircle2 },
];

export default function Index() {
  const navigate = useNavigate();
  const filters: { label: string; value: "all" | RfpStatus }[] = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "In progress", value: "in_progress" },
    { label: "Awaiting review", value: "awaiting_review" },
    { label: "Revision requested", value: "revision_requested" },
    { label: "Submitted", value: "submitted" },
  ];
  const [activeFilter, setActiveFilter] = useState<"all" | RfpStatus>("all");
  const filteredRfps = activeFilter === "all" ? rfps : rfps.filter((r) => r.status === activeFilter);
  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Hero */}
        <section className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Tuesday, May 26</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
            Good morning, Sloane.
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Synced with Cvent, direct client portal and Opera PMS at 9:14 AM. Auto-drafted proposals are ready for review.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-5">
              <div className="flex items-start justify-between">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="mt-3 font-serif text-4xl text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-success">{s.delta}</div>
            </div>
          ))}
        </section>

        {/* RFP Inbox */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-serif text-2xl">RFP Inbox</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Pulled live from Cvent and direct client requests</p>
            </div>
            <div className="flex items-center gap-1 text-xs overflow-x-auto -mx-1 px-1">
              {filters.map((f) => {
                const count = f.value === "all" ? rfps.length : rfps.filter((r) => r.status === f.value).length;
                const active = activeFilter === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {f.label} <span className={active ? "opacity-70" : "opacity-60"}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card-surface overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
                  <th className="px-6 py-3 font-medium">Client / Event</th>
                  <th className="px-3 py-3 font-medium">Source</th>
                  <th className="px-3 py-3 font-medium">Dates</th>
                  <th className="px-3 py-3 font-medium text-right">Peak rms</th>
                  <th className="px-3 py-3 font-medium text-right">Est. value</th>
                  <th className="px-3 py-3 font-medium">Due</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRfps.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/rfp/${r.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary">
                          {r.clientLogo}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{r.client}</div>
                          <div className="text-xs text-muted-foreground">{r.eventName} · {r.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4"><SourceBadge source={r.source} /></td>
                    <td className="px-3 py-4 text-muted-foreground">
                      <div className="text-foreground">{fmtDate(r.arrival)}</div>
                      <div className="text-xs">{r.nights} nights</div>
                    </td>
                    <td className="px-3 py-4 text-right font-medium">{r.peakRooms}</td>
                    <td className="px-3 py-4 text-right font-medium">{currency(r.estValue)}</td>
                    <td className="px-3 py-4 text-muted-foreground">{fmtDate(r.responseDue)}</td>
                    <td className="px-3 py-4"><StatusPill status={r.status} /></td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/rfp/${r.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        Open <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredRfps.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No RFPs match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
