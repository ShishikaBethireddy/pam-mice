import type { ReactNode } from "react";

type Logo = { from: string; to: string; glyph: ReactNode };

/* White glyphs sit on a brand gradient tile. */
const S = { fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* Per-client logo marks, keyed by RFP id. */
const logos: Record<string, Logo> = {
  // Northstar Pharmaceuticals — north star
  "RFP-2048": {
    from: "#3b82f6",
    to: "#1d4ed8",
    glyph: <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#fff" />,
  },
  // Linden Capital Partners — ascending growth bars
  "RFP-2047": {
    from: "#10b981",
    to: "#047857",
    glyph: (
      <g fill="#fff">
        <rect x="4" y="14" width="4" height="6" rx="1" />
        <rect x="10" y="9" width="4" height="11" rx="1" />
        <rect x="16" y="4" width="4" height="16" rx="1" />
      </g>
    ),
  },
  // Helios Medical Society — radiant sun
  "RFP-2045": {
    from: "#f59e0b",
    to: "#d97706",
    glyph: (
      <g {...S}>
        <circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </g>
    ),
  },
  // Cobalt Industries — mineral hexagon
  "RFP-2041": {
    from: "#6366f1",
    to: "#4338ca",
    glyph: (
      <g {...S}>
        <path d="M12 2.5 20 7v10l-8 4.5L4 17V7z" />
        <path d="M12 8.5 15.5 10.5v3L12 15.5 8.5 13.5v-3z" />
      </g>
    ),
  },
  // Vantage Logistics — forward motion chevrons
  "RFP-2039": {
    from: "#14b8a6",
    to: "#0d9488",
    glyph: (
      <g {...S} strokeWidth={2.4}>
        <path d="M5 5l7 7-7 7" />
        <path d="M12 5l7 7-7 7" />
      </g>
    ),
  },
  // Meridian Tech Group — meridian globe
  "RFP-2043": {
    from: "#8b5cf6",
    to: "#6d28d9",
    glyph: (
      <g {...S}>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </g>
    ),
  },
};

export function ClientLogo({
  id,
  fallback,
  className = "",
}: {
  id: string;
  fallback?: string;
  className?: string;
}) {
  const logo = logos[id];

  if (!logo) {
    return (
      <div
        className={`w-10 h-10 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary ${className}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-md grid place-items-center shadow-sm ${className}`}
      style={{ background: `linear-gradient(135deg, ${logo.from}, ${logo.to})` }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        {logo.glyph}
      </svg>
    </div>
  );
}
