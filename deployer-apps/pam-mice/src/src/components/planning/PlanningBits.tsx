import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttendeeStatus, Dietary } from "@/lib/eventPlanning";

const STATUS_TONE: Record<AttendeeStatus, string> = {
  Confirmed: "bg-success-soft text-success",
  Hold: "bg-info-soft text-info",
  Pending: "bg-warning-soft text-warning",
  Declined: "bg-muted text-muted-foreground",
};

export function AttendeeStatusPill({
  status,
  className,
}: {
  status: AttendeeStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
        STATUS_TONE[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function DietaryTag({ diet, label }: { diet: Dietary; label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-copper/30 bg-copper/10 px-2 py-0.5 text-[10px] font-medium text-copper">
      {label ?? diet}
    </span>
  );
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function GuestAvatar({
  name,
  vip,
  className,
}: {
  name: string;
  vip?: boolean;
  className?: string;
}) {
  return (
    <span className="relative inline-flex flex-none">
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full bg-copper/10 text-[11px] font-semibold text-copper ring-1 ring-copper/20",
          className,
        )}
      >
        {getInitials(name)}
      </span>
      {vip && (
        <span
          className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-copper text-paper ring-2 ring-paper"
          aria-label="VIP"
        >
          <Star className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
        </span>
      )}
    </span>
  );
}
