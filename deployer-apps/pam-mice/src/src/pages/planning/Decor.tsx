import { toast } from "sonner";
import { Megaphone } from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { cn } from "@/lib/utils";

type Tone = "success" | "warn" | "info";

const TONE_CLS: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warn: "bg-warning-soft text-warning",
  info: "bg-copper/10 text-copper",
};

const ITEMS: { label: string; value: string; tone: Tone; status: string }[] = [
  { label: "Florals", value: "Low ikebana centerpieces", tone: "warn", status: "Awaiting proof" },
  { label: "Branding", value: "Cobalt logo · entry & stage", tone: "info", status: "In production" },
  { label: "Lighting", value: "Warm amber wash · 2700K", tone: "success", status: "Approved" },
  { label: "Signage", value: "Welcome + wayfinding ×6", tone: "info", status: "Drafting" },
  { label: "Linen", value: "Charcoal · matte", tone: "success", status: "Confirmed" },
  { label: "Stage", value: "Low riser + monogram", tone: "warn", status: "Pending GM" },
];

export default function Decor() {
  const action = (
    <button
      onClick={() => toast.success("Décor brief sent to the styling vendor.")}
      className="inline-flex items-center gap-2 rounded-full border border-border-default bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:border-ink"
    >
      <Megaphone className="h-4 w-4" /> Brief vendor
    </button>
  );

  return (
    <PlanningWorkspace activeStep="decor" action={action}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((c) => (
          <div key={c.label} className="rounded-xl border border-border-subtle bg-paper p-5 shadow-card">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">{c.label}</div>
            <div className="mt-2 text-sm font-medium text-ink">{c.value}</div>
            <div className="mt-3">
              <span
                className={cn(
                  "inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]",
                  TONE_CLS[c.tone],
                )}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PlanningWorkspace>
  );
}
