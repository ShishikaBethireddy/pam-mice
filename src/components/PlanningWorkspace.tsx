import { type ComponentType, type ReactNode, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import {
  BILLING_STEPS,
  PLANNING_STEPS,
  useEventPlanning,
  type BillingStepKey,
  type PlanningStepKey,
  type WorkspaceStepKey,
} from "@/lib/eventPlanning";
import { fmtDate } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Props {
  activeStep: WorkspaceStepKey;
  /** action shown in the step header card (e.g. Import CSV / Open in PMS) */
  action?: ReactNode;
  children: ReactNode;
}

const BILLING_ICONS: Record<BillingStepKey, ComponentType<{ className?: string }>> = {
  "billing-overview": Receipt,
  "billing-documents": FolderOpen,
};

export default function PlanningWorkspace({ activeStep, action, children }: Props) {
  const { event, attendees, fnb } = useEventPlanning();
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = id ?? event.id;

  const completion: Record<PlanningStepKey, boolean> = {
    attendees: attendees.length > 0,
    rooms: attendees.some((a) => Boolean(a.roomTypeId)),
    fnb: Object.keys(fnb).length > 0,
    spaces: false,
    decor: false,
    agenda: false,
  };

  const planningStep = PLANNING_STEPS.find((s) => s.key === activeStep);
  const billingStep = BILLING_STEPS.find((s) => s.key === activeStep);
  const isBilling = Boolean(billingStep);
  const header = planningStep
    ? { kicker: `Step ${planningStep.stepNo}`, title: planningStep.label, blurb: planningStep.description }
    : { kicker: billingStep!.kicker, title: billingStep!.title, blurb: billingStep!.blurb };
  const [billingOpen, setBillingOpen] = useState(true);

  const meta = [
    { icon: Building2, label: event.client },
    {
      icon: CalendarDays,
      label: `${fmtDate(event.arrival)} · ${event.nights} ${event.nights === 1 ? "night" : "nights"}`,
    },
    { icon: Users, label: `${event.peakRooms} peak rms` },
    { icon: Wallet, label: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(event.estValue) },
  ];

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <NobuTopNav activeTab="Plan My Event" />

      <div className="flex">
        {/* ---- Left: planning tracker ---- */}
        <aside className="sticky top-[97px] hidden h-[calc(100vh-97px)] w-[300px] flex-none flex-col overflow-y-auto border-r border-border-subtle bg-paper px-6 py-8 lg:flex">
          <div className="mb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink-muted">
              Planning · {eventId}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">{event.client}</h2>
            <p className="mt-1 text-sm text-ink-soft">{event.eventName}</p>
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
            Planning tracker
          </p>
          <nav className="flex flex-col gap-1" aria-label="Planning steps">
            {PLANNING_STEPS.map((step) => {
              const isActive = step.key === activeStep;
              const done = completion[step.key];
              return (
                <Link
                  key={step.key}
                  to={`/servicing/${eventId}/${step.key}`}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors",
                    isActive ? "bg-copper/10 ring-1 ring-copper/20" : "hover:bg-canvas/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border text-[10px] font-semibold",
                      done || isActive
                        ? "border-copper bg-copper text-paper"
                        : "border-border-default bg-paper text-ink-muted",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={3} /> : step.stepNo}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm font-medium leading-tight",
                        isActive ? "text-ink" : "text-ink-soft",
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">
                      {step.description}
                    </span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-ink-muted/70" />
                </Link>
              );
            })}
          </nav>

          {/* Billing tracker group (collapsible) */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setBillingOpen((v) => !v)}
              className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-muted transition-colors hover:text-ink"
            >
              <span>Billing tracker</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", billingOpen ? "" : "-rotate-90")} />
            </button>
            {billingOpen && (
              <nav className="mt-3 flex flex-col gap-1" aria-label="Billing steps">
                {BILLING_STEPS.map((step) => {
                  const isActive = step.key === activeStep;
                  const Icon = BILLING_ICONS[step.key];
                  return (
                    <Link
                      key={step.key}
                      to={`/servicing/${eventId}/${step.route}`}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors",
                        isActive ? "bg-copper/10 ring-1 ring-copper/20" : "hover:bg-canvas/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border",
                          isActive
                            ? "border-copper bg-copper text-paper"
                            : "border-border-default bg-paper text-ink-muted",
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-sm font-medium leading-tight",
                            isActive ? "text-ink" : "text-ink-soft",
                          )}
                        >
                          {step.navLabel}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">
                          {step.navBlurb}
                        </span>
                      </span>
                      <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-ink-muted/70" />
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <button
            onClick={() => navigate("/event-planning")}
            className="mt-auto inline-flex items-center gap-2 pt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to planning
          </button>
        </aside>

        {/* ---- Right: content ---- */}
        <main className="min-w-0 flex-1 bg-paper">
          {/* Mobile step selector */}
          <div className="border-b border-border-subtle bg-paper px-4 py-3 lg:hidden">
            <label htmlFor="planning-step" className="sr-only">
              Jump to planning step
            </label>
            <select
              id="planning-step"
              value={isBilling ? billingStep!.route : activeStep}
              onChange={(e) => navigate(`/servicing/${eventId}/${e.target.value}`)}
              className="w-full rounded-md border border-border-default bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            >
              <optgroup label="Planning tracker">
                {PLANNING_STEPS.map((s) => (
                  <option key={s.key} value={s.key}>
                    Step {s.stepNo} — {s.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Billing tracker">
                {BILLING_STEPS.map((s) => (
                  <option key={s.key} value={s.route}>
                    {s.navLabel}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-7">
            {/* Event header */}
            <header className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-muted">
                    Awarded event · {eventId}
                  </p>
                  <h1 className="mt-1 font-serif text-4xl leading-tight text-ink">{event.eventName}</h1>
                </div>
                <span className="inline-flex items-center rounded-full border border-copper/30 bg-copper/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-copper">
                  Kickoff pending
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
                {meta.map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-1.5">
                    <m.icon className="h-4 w-4 text-copper" strokeWidth={1.6} />
                    {m.label}
                  </span>
                ))}
              </div>
            </header>

            {/* Step header card */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-paper px-6 py-5 shadow-card">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
                  {header.kicker}
                </p>
                <h2 className="mt-1 font-serif text-2xl text-ink">{header.title}</h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-soft">{header.blurb}</p>
              </div>
              {action ? <div className="flex-none">{action}</div> : null}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
