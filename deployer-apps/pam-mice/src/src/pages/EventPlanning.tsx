import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { SourceBadge } from "@/components/StatusPill";
import { rfps, currency, fmtDate, type Rfp } from "@/data/mockData";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  PartyPopper,
  Users,
  Sparkles,
} from "lucide-react";

type PlanningStage = "ready" | "in_planning" | "finalizing" | "confirmed";

const STAGE_META: Record<
  PlanningStage,
  { label: string; cls: string; progress: number }
> = {
  ready: { label: "Ready to plan", cls: "bg-primary/10 text-primary border-primary/30", progress: 10 },
  in_planning: { label: "In planning", cls: "bg-warning/10 text-warning border-warning/30", progress: 45 },
  finalizing: { label: "Finalizing", cls: "bg-warning/10 text-warning border-warning/30", progress: 78 },
  confirmed: { label: "Confirmed", cls: "bg-success/10 text-success border-success/30", progress: 100 },
};

type PlanningEvent = {
  rfp: Rfp;
  stage: PlanningStage;
  owner: string;
  nextTask: string;
};

// Approved RFPs handed to event servicing for planning.
const PLANNING_EVENTS: PlanningEvent[] = [
  { id: "RFP-2041", stage: "ready", owner: "Maya Alvarez", nextTask: "Confirm space hold & kickoff call" },
  { id: "RFP-2047", stage: "in_planning", owner: "Maya Alvarez", nextTask: "Lock F&B menus & private dining" },
  { id: "RFP-2045", stage: "finalizing", owner: "Devin Park", nextTask: "Finalize breakout tracks & AV run-of-show" },
  { id: "RFP-2043", stage: "confirmed", owner: "Devin Park", nextTask: "Distribute final event brief to property" },
]
  .map((e) => {
    const rfp = rfps.find((r) => r.id === e.id);
    return rfp ? { ...e, rfp } : null;
  })
  .filter((e): e is PlanningEvent => e !== null);

const stats = [
  { label: "Approved events", value: String(PLANNING_EVENTS.length), icon: CalendarCheck },
  { label: "In planning", value: String(PLANNING_EVENTS.filter((e) => e.stage === "in_planning" || e.stage === "finalizing").length), icon: ClipboardList },
  { label: "Confirmed", value: String(PLANNING_EVENTS.filter((e) => e.stage === "confirmed").length), icon: PartyPopper },
  { label: "Next 90 days", value: String(PLANNING_EVENTS.length), icon: CalendarClock },
];

export default function EventPlanning() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Hero */}
        <section className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2 inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Event Servicing · CMS workspace
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
            Good morning, Maya.
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            These RFPs have been approved and handed to event servicing. Pick one up to plan spaces,
            F&amp;B, AV and run-of-show, then hand a finished brief back to the property.
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
            </div>
          ))}
        </section>

        {/* Approved events 2x2 grid of cards */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-serif text-2xl">Approved events</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Approved RFPs ready for event planning
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {PLANNING_EVENTS.map(({ rfp, stage, owner, nextTask }) => {
              const meta = STAGE_META[stage];
              return (
                <button
                  key={rfp.id}
                  onClick={() => navigate(`/servicing/${rfp.id}/overview`)}
                  className="group card-surface p-6 text-left transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary">
                        {rfp.clientLogo}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{rfp.client}</div>
                        <div className="text-xs text-muted-foreground">
                          {rfp.eventName} · {rfp.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${meta.cls}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Meta grid */}
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <MetaItem icon={CalendarClock} label="Dates" value={`${fmtDate(rfp.arrival)} · ${rfp.nights} nights`} />
                    <MetaItem icon={Users} label="Peak rooms" value={String(rfp.peakRooms)} />
                    <MetaItem icon={ClipboardList} label="Meeting space" value={`${rfp.meetingSpaceSqft.toLocaleString()} sqft`} />
                    <MetaItem icon={PartyPopper} label="F&B budget" value={currency(rfp.fbBudget)} />
                  </dl>

                  {/* Planning progress */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span className="uppercase tracking-wider">Planning progress</span>
                      <span>{meta.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${meta.progress}%` }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Next task</div>
                      <div className="truncate text-sm text-foreground">{nextTask}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Owner · {owner}</div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary opacity-70 group-hover:opacity-100">
                      {stage === "confirmed" ? "View event" : "Start event planning"}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <SourceBadge source={rfp.source} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="text-foreground font-medium truncate">{value}</dd>
      </div>
    </div>
  );
}
