import {
  BedDouble,
  CalendarDays,
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Building2,
  Users,
  Wallet,
} from "lucide-react";
import { summarize, useEventPlanning } from "@/lib/eventPlanning";
import { fmtDate } from "@/data/mockData";

/* ------------------------------------------------------------------ *
 * Social Events planning — shared step metadata + planning context.
 * Drives the host-facing celebration workspace (Overview · Guest list ·
 * Room allocation · Food & Beverage · Spaces · Vendors · Itinerary ·
 * Payments). Context is derived from the existing event-planning data
 * so the workspace re-uses the live event rather than seeding its own.
 * ------------------------------------------------------------------ */

export type SocialStepKey =
  | "overview"
  | "guests"
  | "rooms"
  | "fnb"
  | "spaces"
  | "vendors"
  | "itinerary"
  | "payments";

export interface SocialStepDef {
  key: SocialStepKey;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SOCIAL_STEPS: SocialStepDef[] = [
  { key: "overview", label: "Overview", blurb: "Your celebration at a glance.", icon: LayoutDashboard },
  { key: "guests", label: "Guest list", blurb: "RSVPs, plus-ones, dietary & access needs.", icon: Users },
  { key: "rooms", label: "Room allocation", blurb: "Suites held for guests, arrivals & nights.", icon: BedDouble },
  { key: "fnb", label: "Food & Beverage", blurb: "Menus, tastings & dietary counts.", icon: UtensilsCrossed },
  { key: "spaces", label: "Spaces", blurb: "Function rooms, setups & capacities.", icon: Building2 },
  { key: "vendors", label: "Vendors", blurb: "Photography, florals, music & more.", icon: Store },
  { key: "itinerary", label: "Itinerary", blurb: "Day-by-day run-of-show.", icon: CalendarDays },
  { key: "payments", label: "Payments", blurb: "Estimate, milestones & balance.", icon: Wallet },
];

export const SOCIAL_VENUE = "Nobu Hotel Los Cabos";

export interface SocialCtx {
  id: string;
  eventName: string;
  firstName: string;
  dates: string;
  arrival: string;
  nights: number;
  venue: string;
  headcount: number;
  subtotal: number;
  deposit: number;
  paid: boolean;
  theme: {
    occasion: string;
    noun: { singular: string; plural: string };
  };
}

/** Derive a celebration planning context from the live event-planning state. */
export function useSocialCtx(): SocialCtx {
  const { event, attendees } = useEventPlanning();
  const headcount = Math.max(2, summarize(attendees).totalGuests || event.peakRooms * 2);
  const firstName = event.client?.split(" ")[0] || "Your";

  return {
    id: event.id,
    eventName: event.eventName,
    firstName,
    dates: `${fmtDate(event.arrival)} · ${event.nights} ${event.nights === 1 ? "night" : "nights"}`,
    arrival: event.arrival,
    nights: Math.max(1, event.nights),
    venue: SOCIAL_VENUE,
    headcount,
    subtotal: event.estValue,
    deposit: 500,
    paid: false,
    theme: {
      occasion: "celebration",
      noun: { singular: "guest", plural: "guests" },
    },
  };
}
