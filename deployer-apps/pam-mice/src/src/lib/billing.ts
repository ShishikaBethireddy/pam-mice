/* ------------------------------------------------------------------ *
 * Billing tracker data model + mock estimator
 *
 * computeBilling derives a live estimate from the awarded contract value
 * plus scope changes, and a payment milestone schedule. Swap the mock for
 * a real fetcher later; the shape is intentionally API-friendly.
 * ------------------------------------------------------------------ */

export interface ChangeEntry {
  id: string;
  date: string; // ISO date
  label: string;
  source: string;
  delta: number;
}

export type PaymentStatus = "paid" | "due" | "scheduled" | "overdue";

export interface Payment {
  id: string;
  label: string;
  amount: number;
  due: string; // ISO date
  paidOn?: string; // ISO date
  method?: string;
  status: PaymentStatus;
}

export interface Billing {
  baseContract: number;
  changes: ChangeEntry[];
  estimatedTotal: number;
  payments: Payment[];
  paid: number;
  outstanding: number;
}

export function computeBilling(baseContract: number): Billing {
  const changes: ChangeEntry[] = [
    { id: "c1", date: "2026-05-28", label: "Added 25 rooms on peak night", source: "Client revision", delta: 18500 },
    { id: "c2", date: "2026-05-30", label: "Upgraded mainstage AV to broadcast bundle", source: "Client revision", delta: 12000 },
    { id: "c3", date: "2026-06-01", label: "Negotiated group rate −$30/night", source: "Sales", delta: -8400 },
  ];
  const estimatedTotal = baseContract + changes.reduce((s, c) => s + c.delta, 0);
  const payments: Payment[] = [
    { id: "p1", label: "Deposit · 25%", amount: Math.round(baseContract * 0.25), due: "2026-05-15", paidOn: "2026-05-14", method: "Wire", status: "paid" },
    { id: "p2", label: "Second milestone · 35%", amount: Math.round(baseContract * 0.35), due: "2026-07-15", paidOn: "2026-07-14", method: "ACH", status: "paid" },
    { id: "p3", label: "Pre-arrival · 30%", amount: Math.round(estimatedTotal * 0.3), due: "2026-08-25", method: "Wire", status: "due" },
    {
      id: "p4",
      label: "Final reconciliation",
      amount:
        estimatedTotal -
        Math.round(baseContract * 0.25) -
        Math.round(baseContract * 0.35) -
        Math.round(estimatedTotal * 0.3),
      due: "2026-08-15",
      method: "ACH",
      status: "scheduled",
    },
  ];
  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const outstanding = estimatedTotal - paid;
  return { baseContract, changes, estimatedTotal, payments, paid, outstanding };
}

/* ---------- Documents ---------- */

export type BillingDocType = "Invoice" | "Receipt" | "Contract" | "Statement" | "Other";

export interface BillingDoc {
  id: string;
  name: string;
  type: BillingDocType;
  date: string; // ISO date
  amount?: number;
  sizeKb: number;
}

export const SEED_DOCS: BillingDoc[] = [
  { id: "d1", name: "INV-2026-0142 · Deposit.pdf", type: "Invoice", date: "2026-05-10", amount: 81250, sizeKb: 184 },
  { id: "d2", name: "Receipt · Wire 05-14.pdf", type: "Receipt", date: "2026-05-14", amount: 81250, sizeKb: 92 },
  { id: "d3", name: "Master event contract.pdf", type: "Contract", date: "2026-04-22", sizeKb: 612 },
  { id: "d4", name: "INV-2026-0188 · Milestone 2.pdf", type: "Invoice", date: "2026-07-08", amount: 113750, sizeKb: 196 },
  { id: "d5", name: "Receipt · ACH 07-14.pdf", type: "Receipt", date: "2026-07-14", amount: 113750, sizeKb: 88 },
];

export function inferDocType(name: string): BillingDocType {
  const n = name.toLowerCase();
  if (n.includes("invoice") || n.startsWith("inv")) return "Invoice";
  if (n.includes("receipt")) return "Receipt";
  if (n.includes("contract") || n.includes("agreement")) return "Contract";
  if (n.includes("statement")) return "Statement";
  return "Other";
}
