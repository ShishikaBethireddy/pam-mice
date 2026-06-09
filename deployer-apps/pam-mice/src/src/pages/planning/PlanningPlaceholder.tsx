import { Hammer } from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { PLANNING_STEPS, type PlanningStepKey } from "@/lib/eventPlanning";

export default function PlanningPlaceholder({ step }: { step: PlanningStepKey }) {
  const def = PLANNING_STEPS.find((s) => s.key === step)!;
  return (
    <PlanningWorkspace activeStep={step}>
      <div className="rounded-xl border border-dashed border-border-default bg-paper/60 px-6 py-16 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-copper/10 text-copper">
          <Hammer className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-2xl text-ink">{def.label} coming soon</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
          {def.description} This planning step is on the roadmap.
        </p>
      </div>
    </PlanningWorkspace>
  );
}
