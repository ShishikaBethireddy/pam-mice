import { useState } from "react";
import { CheckCircle2, CreditCard, Lock, Phone, ShieldCheck } from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import { useSocialCtx } from "@/lib/socialPlanning";
import { currency } from "@/data/mockData";

type Payment = { id: string; label: string; date: string; amount: number };

const TERMS = [
  "The $500 deposit secures your event date for 72 hours pending final contract.",
  "Refundable up to 14 days prior, applied to your final invoice at settlement.",
  "Final guest count confirmed 7 days before the event.",
];

export default function Payments() {
  const ctx = useSocialCtx();
  const [payments, setPayments] = useState<Payment[]>([]);

  const coreEstimate = ctx.subtotal;
  const addOns = 0;
  const depositPaid = payments
    .filter((p) => p.label.toLowerCase().includes("deposit"))
    .reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(0, coreEstimate + addOns - totalPaid);

  const makeDeposit = () => {
    setPayments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: "Deposit",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        amount: ctx.deposit,
      },
    ]);
  };

  const rows: { label: string; value: number; strong?: boolean }[] = [
    { label: "Core estimate", value: coreEstimate },
    { label: "Add-ons", value: addOns },
    { label: "Deposit paid", value: -depositPaid },
    { label: "Remaining balance", value: remaining, strong: true },
  ];

  return (
    <SocialPlanningShell activeStep="payments">
      <div className="max-w-3xl space-y-10">
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Payment &amp; terms</p>
          <h2 className="mt-2 font-serif text-3xl text-grey-900">Your receipt</h2>

          <div className="mt-6 divide-y divide-grey-100 border-y border-grey-200">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-4">
                <span className={r.strong ? "font-medium text-grey-900" : "text-grey-700"}>{r.label}</span>
                <span className={r.strong ? "font-serif text-xl text-grey-900" : "tabular-nums text-grey-900"}>
                  {r.value < 0 ? `−${currency(Math.abs(r.value))}` : currency(r.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={makeDeposit}
              disabled={remaining === 0}
              className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-grey-700 disabled:opacity-40"
            >
              <CreditCard className="h-4 w-4" /> Make payment now
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-grey-300 px-6 py-3 text-sm font-medium text-grey-800 hover:bg-grey-50">
              <Phone className="h-4 w-4" /> Call concierge
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-grey-500">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS secured</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 256-bit TLS</span>
          </div>

          <ul className="mt-5 space-y-2">
            {TERMS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-grey-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-grey-300" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Payment history</p>
          <h3 className="mt-2 font-serif text-2xl text-grey-900">Previous payments</h3>

          {payments.length === 0 ? (
            <div className="mt-5 border border-dashed border-grey-300 px-6 py-12 text-center text-sm text-grey-500">
              No payments yet.
            </div>
          ) : (
            <div className="mt-5 divide-y divide-grey-100 border border-grey-200">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-brand-700">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium text-grey-900">{p.label}</div>
                      <div className="text-xs text-grey-500">{p.date}</div>
                    </div>
                  </div>
                  <span className="tabular-nums font-medium text-grey-900">{currency(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </SocialPlanningShell>
  );
}
