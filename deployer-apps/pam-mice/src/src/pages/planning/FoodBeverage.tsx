import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Leaf, Plus, WheatOff } from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MEAL_SLOTS,
  dietaryBreakdown,
  formatDayLong,
  mealKey,
  packageCompatibility,
  requiredDiets,
  useEventPlanning,
  type FnbPackage,
} from "@/lib/eventPlanning";
import { cn } from "@/lib/utils";

interface SlotTarget {
  day: string;
  dayIdx: number;
  slotKey: string;
  slotLabel: string;
}

function Pill({
  tone = "info",
  children,
}: {
  tone?: "success" | "warn" | "info";
  children: React.ReactNode;
}) {
  const cls =
    tone === "success"
      ? "bg-success-soft text-success"
      : tone === "warn"
        ? "bg-warning-soft text-warning"
        : "bg-brand-100 text-brand-700";
  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]", cls)}>
      {children}
    </span>
  );
}

function PackagePicker({ target, onClose }: { target: SlotTarget | null; onClose: () => void }) {
  const { attendees, packages, fnb, setMeal } = useEventPlanning();
  const required = useMemo(() => requiredDiets(attendees), [attendees]);

  if (!target) return null;
  const selectedId = fnb[mealKey(target.day, target.slotKey)];
  const options = packages.filter((p) => p.slots.includes(target.slotKey));

  const choose = (pkg: FnbPackage) => {
    setMeal(target.day, target.slotKey, pkg.id);
    toast.success(`${pkg.name} added to ${target.slotLabel}.`);
    onClose();
  };

  return (
    <Dialog open={Boolean(target)} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-grey-900">
            {target.slotLabel} · Day {target.dayIdx + 1}
          </DialogTitle>
          <DialogDescription className="text-grey-500">
            {required.length
              ? "Packages compatible with your guests' dietary needs are highlighted."
              : "No dietary requirements recorded all packages work."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-3">
          {options.map((pkg) => {
            const { compatible } = packageCompatibility(pkg, required);
            const covers = required.filter((t) => pkg.dietary.includes(t));
            const missing = required.filter((t) => !pkg.dietary.includes(t));
            const isSelected = pkg.id === selectedId;
            return (
              <button
                key={pkg.id}
                onClick={() => choose(pkg)}
                className={cn(
                  "rounded-xl border bg-white p-4 text-left transition-colors",
                  isSelected
                    ? "border-grey-900 ring-1 ring-grey-900/10"
                    : compatible
                      ? "border-success/40 bg-success-soft/30 hover:border-success"
                      : "border-grey-200 hover:border-accent",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-grey-900">{pkg.name}</div>
                    <div className="mt-0.5 text-xs text-grey-600">{pkg.description}</div>
                  </div>
                  <div className="flex-none text-right">
                    <div className="font-serif text-lg text-grey-900">${pkg.pricePerPerson}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-grey-500">per guest</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-grey-600">{pkg.courses.join(" · ")}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {covers.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-success"
                    >
                      <Leaf className="h-3 w-3" /> {t}
                    </span>
                  ))}
                  {missing.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-warning"
                    >
                      <WheatOff className="h-3 w-3" /> needs {t.toLowerCase()} option
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
          {options.length === 0 && (
            <p className="py-8 text-center text-sm text-grey-500">
              No packages configured for this meal yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FoodBeverage() {
  const { attendees, packages, days, fnb } = useEventPlanning();
  const [target, setTarget] = useState<SlotTarget | null>(null);

  const diets = useMemo(() => dietaryBreakdown(attendees), [attendees]);
  const pkgById = useMemo(() => new Map(packages.map((p) => [p.id, p])), [packages]);

  return (
    <SocialPlanningShell activeStep="fnb">
      {/* Dietary needs pulled from the attendee list */}
      <div className="mb-5 rounded-xl border border-grey-200 bg-white px-5 py-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">
          <Leaf className="h-3.5 w-3.5" /> Dietary needs from attendee list
        </div>
        {diets.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {diets.map((d) => (
              <span
                key={d.diet}
                className="inline-flex items-center gap-2 rounded-full border border-brand-300/50 bg-brand-100 px-3 py-1 text-xs text-brand-700"
              >
                <span>{d.diet}</span>
                <span className="font-semibold">· {d.count}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-grey-500">No dietary requirements recorded yet.</p>
        )}
      </div>

      {/* Day-by-day meal grid */}
      <div className="space-y-5">
        {days.map((day, dayIdx) => (
          <div key={day} className="overflow-hidden rounded-xl border border-grey-200 bg-white">
            <div className="flex items-center justify-between border-b border-grey-200 bg-white px-5 py-3">
              <div className="text-sm font-medium text-grey-900">
                Day {dayIdx + 1} · {formatDayLong(day)}
              </div>
              <Pill>{MEAL_SLOTS.length} meals</Pill>
            </div>
            <div className="grid gap-px bg-grey-200 sm:grid-cols-2 lg:grid-cols-3">
              {MEAL_SLOTS.map((slot) => {
                const pkgId = fnb[mealKey(day, slot.key)];
                const pkg = pkgId ? pkgById.get(pkgId) : undefined;
                const openPicker = () =>
                  setTarget({ day, dayIdx, slotKey: slot.key, slotLabel: slot.label });

                return (
                  <div key={slot.key} className="bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-grey-900">{slot.label}</div>
                        <div className="text-xs text-grey-500">{slot.time}</div>
                      </div>
                      {pkg ? <Pill tone="success">Selected</Pill> : <Pill>Empty</Pill>}
                    </div>

                    {pkg ? (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-sm text-grey-900">{pkg.name}</div>
                        <div className="text-xs text-grey-600">
                          ${pkg.pricePerPerson} /pp · {pkg.description}
                        </div>
                        <button
                          onClick={openPicker}
                          className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent hover:text-brand-700"
                        >
                          Change package
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={openPicker}
                        className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-grey-300 bg-grey-50 px-4 py-6 text-center text-grey-500 transition-colors hover:border-accent hover:bg-brand-100/40 hover:text-accent"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-xs">No menu selected</span>
                        <span className="text-[11px] uppercase tracking-[0.18em]">Select package</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <PackagePicker target={target} onClose={() => setTarget(null)} />
    </SocialPlanningShell>
  );
}
