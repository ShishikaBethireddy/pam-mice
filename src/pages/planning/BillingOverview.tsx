import { useMemo } from "react";
import { CheckCircle2, Clock, Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { useEventPlanning } from "@/lib/eventPlanning";
import { computeBilling, type PaymentStatus } from "@/lib/billing";
import { currency, fmtDate } from "@/data/mockData";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "warn";
}) {
  const valueCls = tone === "good" ? "text-success" : tone === "warn" ? "text-warning" : "text-ink";
  return (
    <div className="rounded-xl border border-border-subtle bg-paper p-5 shadow-card">
      <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">{label}</div>
      <div className={cn("mt-2 font-serif text-3xl", valueCls)}>{value}</div>
      {hint ? <div className="mt-1 text-xs text-ink-muted">{hint}</div> : null}
    </div>
  );
}

const PILL_TONE: Record<PaymentStatus, string> = {
  paid: "bg-success-soft text-success",
  due: "bg-warning-soft text-warning",
  scheduled: "bg-muted text-ink-soft",
  overdue: "bg-destructive/10 text-destructive",
};

function StatusPill({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]",
        PILL_TONE[status],
      )}
    >
      {status}
    </span>
  );
}

export default function BillingOverview() {
  const { event } = useEventPlanning();
  const b = useMemo(() => computeBilling(event.estValue), [event.estValue]);
  const deltaTotal = b.estimatedTotal - b.baseContract;
  const upcoming = b.payments.filter((p) => p.status !== "paid");
  const nextDue = upcoming[0];

  return (
    <PlanningWorkspace activeStep="billing-overview">
      {/* Headline stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Estimated total" value={currency(b.estimatedTotal)} hint={`Base ${currency(b.baseContract)}`} />
        <Stat
          label="Net change"
          value={`${deltaTotal >= 0 ? "+" : "−"}${currency(Math.abs(deltaTotal))}`}
          hint={`${b.changes.length} adjustments`}
          tone={deltaTotal >= 0 ? "warn" : "good"}
        />
        <Stat
          label="Collected"
          value={currency(b.paid)}
          tone="good"
          hint={`${b.payments.filter((p) => p.status === "paid").length} milestones`}
        />
        <Stat
          label="Outstanding"
          value={currency(b.outstanding)}
          tone="warn"
          hint={nextDue ? `Next ${fmtDate(nextDue.due)}` : ""}
        />
      </div>

      {/* Live estimate build-up */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border-subtle bg-paper shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Live estimate</div>
          <h3 className="mt-1 font-serif text-lg text-ink">How the total is built</h3>
        </div>
        <ul className="divide-y divide-border-subtle">
          <li className="flex items-center justify-between px-6 py-3 text-sm">
            <span className="text-ink-soft">Original contract value</span>
            <span className="font-medium text-ink">{currency(b.baseContract)}</span>
          </li>
          {b.changes.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
              <span className="flex flex-wrap items-center gap-2 text-ink-soft">
                {c.delta >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-warning" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-success" />
                )}
                {c.label}
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  · {c.source} · {fmtDate(c.date)}
                </span>
              </span>
              <span className={cn("whitespace-nowrap font-medium", c.delta >= 0 ? "text-warning" : "text-success")}>
                {c.delta >= 0 ? "+" : "−"}
                {currency(Math.abs(c.delta))}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between bg-canvas px-6 py-3 text-sm">
            <span className="font-medium text-ink">Estimated total</span>
            <span className="font-serif text-lg text-ink">{currency(b.estimatedTotal)}</span>
          </li>
        </ul>
      </div>

      {/* Payment history */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border-subtle bg-paper shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Payment history</div>
          <h3 className="mt-1 font-serif text-lg text-ink">Milestones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas text-left text-[11px] uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3 font-medium">Milestone</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Paid on</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {b.payments.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle/70 last:border-0">
                  <td className="px-5 py-3 text-ink">{p.label}</td>
                  <td className="px-5 py-3 text-ink-soft">{fmtDate(p.due)}</td>
                  <td className="px-5 py-3 text-ink-soft">{p.paidOn ? fmtDate(p.paidOn) : "—"}</td>
                  <td className="px-5 py-3 text-ink-soft">{p.method ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-medium text-ink">{currency(p.amount)}</td>
                  <td className="px-5 py-3">
                    <StatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outstanding */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border-subtle bg-paper shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Due amounts</div>
          <h3 className="mt-1 font-serif text-lg text-ink">Outstanding balance · {currency(b.outstanding)}</h3>
        </div>
        {upcoming.length === 0 ? (
          <div className="flex items-center gap-2 px-6 py-5 text-sm text-ink-soft">
            <CheckCircle2 className="h-4 w-4 text-success" /> All milestones collected.
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-copper/10 text-copper">
                    {p.status === "due" ? <Clock className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{p.label}</div>
                    <div className="text-xs text-ink-muted">
                      Due {fmtDate(p.due)} · {p.method}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-serif text-xl text-ink">{currency(p.amount)}</div>
                  <StatusPill status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 text-xs text-ink-muted">
        <Receipt className="mr-1 inline h-3 w-3" />
        New entries from Attendees, Rooms, F&amp;B, Spaces or Décor will re-estimate the total automatically.
      </div>
    </PlanningWorkspace>
  );
}
