import { statusMeta, RfpStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  neutral: "bg-muted text-muted-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function StatusPill({ status, className }: { status: RfpStatus; className?: string }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider",
        toneClass[meta.tone],
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: "Cvent" | "Direct" | string }) {
  const config: Record<string, { bg: string; fg: string; mark: React.ReactNode }> = {
    Cvent: {
      bg: "bg-[#FF6B35]",
      fg: "text-white",
      // Stylized "c" mark
      mark: <span className="font-bold italic leading-none">c</span>,
    },
    Direct: {
      bg: "bg-foreground",
      fg: "text-background",
      // Globe mark = direct from client website
      mark: (
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      ),
    },
  };
  const c = config[source] ?? { bg: "bg-muted", fg: "text-foreground", mark: source[0] };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground">
      <span
        className={cn(
          "w-5 h-5 rounded grid place-items-center text-[10px]",
          c.bg,
          c.fg,
        )}
        aria-label={source}
      >
        {c.mark}
      </span>
      {source}
    </span>
  );
}