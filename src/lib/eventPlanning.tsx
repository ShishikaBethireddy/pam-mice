import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router-dom";
import { rfps } from "@/data/mockData";

/* ------------------------------------------------------------------ *
 * Domain types
 * ------------------------------------------------------------------ */

export type AttendeeStatus = "Confirmed" | "Hold" | "Pending" | "Declined";

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Halal",
  "Kosher",
  "Nut allergy",
  "Dairy-free",
  "Pescatarian",
  "Other",
] as const;
export type Dietary = (typeof DIETARY_OPTIONS)[number];

export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  vip: boolean;
  status: AttendeeStatus;
  /** guests travelling with them, including the attendee (default 1) */
  partySize: number;
  dietary: Dietary[];
  dietaryOther?: string;
  arrival: string; // ISO date
  departure: string; // ISO date
  notes?: string;
  /** assigned room type — null/undefined means unassigned */
  roomTypeId?: string | null;
}

export interface RoomType {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
}

export interface MealSlotDef {
  key: string;
  label: string;
  time: string;
}

export const MEAL_SLOTS: MealSlotDef[] = [
  { key: "breakfast", label: "Breakfast", time: "7:30 AM" },
  { key: "am_break", label: "AM coffee break", time: "10:30 AM" },
  { key: "lunch", label: "Lunch", time: "12:30 PM" },
  { key: "pm_break", label: "PM coffee break", time: "3:30 PM" },
  { key: "dinner", label: "Dinner", time: "7:00 PM" },
];

export interface FnbPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  courses: string[];
  /** dietary needs this package can fully accommodate */
  dietary: Dietary[];
  /** meal slot keys this package suits */
  slots: string[];
}

export interface PlanningEvent {
  id: string;
  client: string;
  clientLogo: string;
  eventName: string;
  arrival: string;
  departure: string;
  nights: number;
  peakRooms: number;
  estValue: number;
  contactName: string;
}

interface PlanningState {
  attendees: Attendee[];
  roomTypes: RoomType[];
  /** map of `${dayISO}__${slotKey}` -> packageId */
  fnb: Record<string, string>;
}

/* ------------------------------------------------------------------ *
 * Catalogs (would come from an API)
 * ------------------------------------------------------------------ */

export const PACKAGE_CATALOG: FnbPackage[] = [
  // ---- Breakfast ----
  {
    id: "continental",
    name: "Continental",
    description: "Pastries, fruit, yogurt, juices, coffee.",
    pricePerPerson: 38,
    courses: ["Viennoiserie basket", "Seasonal fruit", "Greek yogurt + granola", "Cold-pressed juices"],
    dietary: ["Vegetarian", "Nut allergy"],
    slots: ["breakfast"],
  },
  {
    id: "executive-hot",
    name: "Executive hot buffet",
    description: "Eggs, smoked salmon, hot station, grains.",
    pricePerPerson: 62,
    courses: ["Eggs your way", "Smoked salmon", "Hot bacon & turkey", "Steel-cut oats", "Açaí bowl"],
    dietary: ["Vegetarian", "Gluten-free", "Halal", "Pescatarian"],
    slots: ["breakfast"],
  },
  {
    id: "plant-forward",
    name: "Plant-forward bowls",
    description: "Vegan grain bowls, fruit, plant milks.",
    pricePerPerson: 48,
    courses: ["Quinoa & avocado bowl", "Chia pudding", "Smoothie flight", "Sourdough toast"],
    dietary: ["Vegetarian", "Vegan", "Gluten-free", "Nut allergy", "Dairy-free", "Halal"],
    slots: ["breakfast"],
  },
  // ---- Lunch ----
  {
    id: "working-lunch",
    name: "Working lunch",
    description: "Three-course plated, served fast.",
    pricePerPerson: 95,
    courses: ["Garden salad", "Protein of the day", "Petit fours"],
    dietary: ["Vegetarian", "Gluten-free", "Halal"],
    slots: ["lunch"],
  },
  {
    id: "bento",
    name: "Nobu bento",
    description: "Signature bento boxes by Nobu kitchen.",
    pricePerPerson: 120,
    courses: ["Miso soup", "Sashimi selection", "Black cod or tofu", "Steamed rice", "Mochi"],
    dietary: ["Vegetarian", "Gluten-free", "Pescatarian"],
    slots: ["lunch"],
  },
  {
    id: "garden-lunch",
    name: "Garden lunch",
    description: "Light, plant-forward sharing menu.",
    pricePerPerson: 78,
    courses: ["Roasted veg mezze", "Grain bowls", "Herb-grilled tofu", "Sorbet trio"],
    dietary: ["Vegetarian", "Vegan", "Gluten-free", "Nut allergy", "Halal", "Dairy-free"],
    slots: ["lunch"],
  },
  // ---- Dinner ----
  {
    id: "omakase",
    name: "Omakase tasting · 7 course",
    description: "Chef's tasting menu with wine pairing.",
    pricePerPerson: 285,
    courses: ["Amuse", "Sashimi", "Tempura", "Black cod miso", "Wagyu", "Rice course", "Dessert"],
    dietary: ["Gluten-free", "Pescatarian"],
    slots: ["dinner"],
  },
  {
    id: "plated-three",
    name: "Plated three-course",
    description: "Classic plated dinner, choice of mains.",
    pricePerPerson: 165,
    courses: ["Starter", "Choice of 3 mains", "Dessert"],
    dietary: ["Vegetarian", "Gluten-free", "Halal"],
    slots: ["dinner"],
  },
  {
    id: "vegan-tasting",
    name: "Plant-based tasting",
    description: "Six-course vegan tasting menu.",
    pricePerPerson: 195,
    courses: ["Crudités", "Mushroom dashi", "Charred greens", "Koji cauliflower", "Grain course", "Dessert"],
    dietary: ["Vegetarian", "Vegan", "Gluten-free", "Nut allergy", "Halal", "Dairy-free"],
    slots: ["dinner"],
  },
  // ---- AM / PM coffee breaks ----
  {
    id: "espresso-bar",
    name: "Espresso bar + pastry",
    description: "Barista station, mini pastries, fruit.",
    pricePerPerson: 24,
    courses: ["Espresso bar", "Mini viennoiserie", "Fresh fruit", "Still & sparkling"],
    dietary: ["Vegetarian", "Halal"],
    slots: ["am_break", "pm_break"],
  },
  {
    id: "wellness-break",
    name: "Wellness break",
    description: "Cold-press juices, energy bites, tea.",
    pricePerPerson: 28,
    courses: ["Cold-press juices", "Energy bites", "Matcha & herbal tea", "Crudité cups"],
    dietary: ["Vegetarian", "Vegan", "Gluten-free", "Nut allergy", "Halal", "Dairy-free"],
    slots: ["am_break", "pm_break"],
  },
];

const ROOM_TYPE_SEED: Omit<RoomType, "checkIn" | "checkOut">[] = [
  { id: "rt-suite", name: "Nobu Suite" },
  { id: "rt-king", name: "Deluxe King" },
  { id: "rt-twin", name: "Deluxe Twin" },
  { id: "rt-garden", name: "Garden Room" },
  { id: "rt-accessible", name: "Accessible King" },
];

/* ------------------------------------------------------------------ *
 * Date helpers (timezone-safe)
 * ------------------------------------------------------------------ */

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** inclusive list of ISO dates between arrival and departure */
export function eventDays(arrivalISO: string, departureISO: string): string[] {
  const start = parseLocalDate(arrivalISO);
  const end = parseLocalDate(departureISO);
  const days: string[] = [];
  const cur = new Date(start);
  let guard = 0;
  while (cur <= end && guard < 60) {
    days.push(toISODate(cur));
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return days;
}

export function formatDayLong(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function mealKey(dayISO: string, slotKey: string): string {
  return `${dayISO}__${slotKey}`;
}

/* ------------------------------------------------------------------ *
 * Seed data
 * ------------------------------------------------------------------ */

function getEventMeta(eventId: string): PlanningEvent {
  const rfp = rfps.find((r) => r.id === eventId) ?? rfps.find((r) => r.id === "RFP-2041") ?? rfps[0];
  return {
    id: rfp.id,
    client: rfp.client,
    clientLogo: rfp.clientLogo,
    eventName: rfp.eventName,
    arrival: rfp.arrival,
    departure: rfp.departure,
    nights: rfp.nights,
    peakRooms: rfp.peakRooms,
    estValue: rfp.estValue,
    contactName: rfp.contact.name,
  };
}

function uid(prefix = "att"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function seedState(event: PlanningEvent): PlanningState {
  const a = event.arrival;
  const d = event.departure;
  const company = event.client;

  const roomTypes: RoomType[] = ROOM_TYPE_SEED.map((rt) => ({
    ...rt,
    checkIn: a,
    checkOut: d,
  }));

  const make = (
    fullName: string,
    role: string,
    status: AttendeeStatus,
    opts: Partial<Attendee> = {},
  ): Attendee => {
    const [first, ...rest] = fullName.toLowerCase().split(" ");
    const domain = company.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10) || "company";
    return {
      id: uid(),
      fullName,
      email: `${first}.${rest.join("") || "x"}@${domain}.com`,
      phone: "+1 (555) " + Math.floor(100 + Math.random() * 899) + "-" + Math.floor(1000 + Math.random() * 8999),
      company,
      role,
      vip: false,
      status,
      partySize: 1,
      dietary: [],
      arrival: a,
      departure: d,
      ...opts,
    };
  };

  const attendees: Attendee[] = [
    make("Avery Chen", "Chief Executive Officer", "Confirmed", {
      vip: true,
      partySize: 2,
      dietary: ["Vegetarian"],
      roomTypeId: "rt-suite",
    }),
    make("Daniel Cho", "Chief Financial Officer", "Confirmed", {
      vip: true,
      partySize: 2,
      dietary: ["Vegetarian"],
      roomTypeId: "rt-suite",
    }),
    make("Marcus Hill", "Board Chair", "Confirmed", { roomTypeId: "rt-king" }),
    make("Sophia Marin", "General Counsel", "Confirmed", {
      dietary: ["Gluten-free"],
      roomTypeId: "rt-king",
    }),
    make("Omar Haddad", "Strategic Advisor", "Confirmed", {
      dietary: ["Halal"],
      roomTypeId: "rt-king",
    }),
    make("Priya Sanaa", "Board Member", "Pending", { dietary: ["Gluten-free"] }),
    make("Lina Rossi", "Board Member", "Hold", { dietary: ["Vegan"], roomTypeId: "rt-twin" }),
    make("Jonas Werner", "Managing Partner", "Confirmed", {
      company: `${company} Partners`,
      roomTypeId: "rt-twin",
    }),
    make("Rachel Green", "Board Member", "Pending", { dietary: ["Nut allergy"] }),
    make("Elena Fischer", "Board Member", "Confirmed", {
      dietary: ["Vegetarian"],
      roomTypeId: "rt-garden",
    }),
    make("Victor Nunez", "Head of Operations", "Hold", {
      dietary: ["Vegetarian", "Dairy-free"],
      roomTypeId: "rt-garden",
    }),
    make("Thomas Beck", "Investor Relations", "Declined", {}),
  ];

  return { attendees, roomTypes, fnb: {} };
}

/* ------------------------------------------------------------------ *
 * Persistence
 * ------------------------------------------------------------------ */

function storageKey(eventId: string) {
  return `pam-mice:planning:${eventId}`;
}

function loadOrSeed(event: PlanningEvent): PlanningState {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(storageKey(event.id));
      if (raw) {
        const parsed = JSON.parse(raw) as PlanningState;
        if (parsed && Array.isArray(parsed.attendees)) return parsed;
      }
    } catch {
      /* ignore corrupt cache */
    }
  }
  return seedState(event);
}

/* ------------------------------------------------------------------ *
 * Selectors
 * ------------------------------------------------------------------ */

export interface AttendeeSummary {
  total: number;
  totalGuests: number;
  confirmed: number;
  pending: number;
  hold: number;
  declined: number;
}

export function summarize(attendees: Attendee[]): AttendeeSummary {
  return attendees.reduce<AttendeeSummary>(
    (acc, a) => {
      acc.total += 1;
      if (a.status !== "Declined") acc.totalGuests += Math.max(1, a.partySize);
      if (a.status === "Confirmed") acc.confirmed += 1;
      if (a.status === "Pending") acc.pending += 1;
      if (a.status === "Hold") acc.hold += 1;
      if (a.status === "Declined") acc.declined += 1;
      return acc;
    },
    { total: 0, totalGuests: 0, confirmed: 0, pending: 0, hold: 0, declined: 0 },
  );
}

/** counts of each dietary requirement across travelling (non-declined) attendees */
export function dietaryBreakdown(attendees: Attendee[]): { diet: Dietary; count: number }[] {
  const counts = new Map<Dietary, number>();
  for (const a of attendees) {
    if (a.status === "Declined") continue;
    for (const diet of a.dietary) {
      counts.set(diet, (counts.get(diet) ?? 0) + 1);
    }
  }
  return DIETARY_OPTIONS.map((diet) => ({ diet, count: counts.get(diet) ?? 0 })).filter((x) => x.count > 0);
}

/** unique set of dietary requirements that must be accommodated */
export function requiredDiets(attendees: Attendee[]): Dietary[] {
  return dietaryBreakdown(attendees).map((x) => x.diet).filter((d) => d !== "Other");
}

export interface PackageCompatibility {
  compatible: boolean;
  missing: Dietary[];
}

export function packageCompatibility(pkg: FnbPackage, required: Dietary[]): PackageCompatibility {
  const missing = required.filter((d) => !pkg.dietary.includes(d));
  return { compatible: missing.length === 0, missing };
}

export interface RoomGroup {
  roomType: RoomType | null; // null = unassigned bucket
  attendees: Attendee[];
  roomCount: number;
}

export function groupByRoom(attendees: Attendee[], roomTypes: RoomType[]): RoomGroup[] {
  const byType = new Map<string, Attendee[]>();
  const unassigned: Attendee[] = [];
  for (const a of attendees) {
    if (a.roomTypeId) {
      const list = byType.get(a.roomTypeId) ?? [];
      list.push(a);
      byType.set(a.roomTypeId, list);
    } else {
      unassigned.push(a);
    }
  }
  const groups: RoomGroup[] = [];
  if (unassigned.length) {
    groups.push({ roomType: null, attendees: unassigned, roomCount: 0 });
  }
  for (const rt of roomTypes) {
    const list = byType.get(rt.id) ?? [];
    groups.push({
      roomType: rt,
      attendees: list,
      roomCount: list.reduce((sum, a) => sum + Math.max(1, Math.ceil(a.partySize / 2)), 0),
    });
  }
  return groups;
}

/* ------------------------------------------------------------------ *
 * CSV import
 * ------------------------------------------------------------------ */

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

const STATUS_SET: AttendeeStatus[] = ["Confirmed", "Hold", "Pending", "Declined"];

export function parseAttendeesCsv(text: string, event: PlanningEvent): Attendee[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
  const idx = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };
  const col = {
    name: idx("fullname", "name"),
    email: idx("email"),
    phone: idx("phone"),
    company: idx("company"),
    role: idx("role", "title", "roletitle"),
    status: idx("status"),
    party: idx("partysize", "party", "guests"),
    dietary: idx("dietary", "dietaryrestrictions", "diet"),
    vip: idx("vip"),
    arrival: idx("arrival", "arrivaldate"),
    departure: idx("departure", "departuredate"),
    notes: idx("notes"),
  };

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const get = (i: number) => (i >= 0 ? cells[i] ?? "" : "");
    const statusRaw = get(col.status);
    const status =
      STATUS_SET.find((s) => s.toLowerCase() === statusRaw.toLowerCase()) ?? "Pending";
    const dietRaw = get(col.dietary);
    const dietary = dietRaw
      ? (dietRaw
          .split(/[;|]/)
          .map((d) => d.trim())
          .map((d) => DIETARY_OPTIONS.find((o) => o.toLowerCase() === d.toLowerCase()))
          .filter(Boolean) as Dietary[])
      : [];
    const vipRaw = get(col.vip).toLowerCase();
    return {
      id: uid(),
      fullName: get(col.name) || "Unnamed guest",
      email: get(col.email),
      phone: get(col.phone),
      company: get(col.company) || event.client,
      role: get(col.role),
      vip: vipRaw === "true" || vipRaw === "yes" || vipRaw === "1",
      status,
      partySize: Math.max(1, parseInt(get(col.party), 10) || 1),
      dietary,
      arrival: get(col.arrival) || event.arrival,
      departure: get(col.departure) || event.departure,
      notes: get(col.notes) || undefined,
      roomTypeId: null,
    } satisfies Attendee;
  });
}

export const CSV_TEMPLATE = `Full name,Email,Phone,Company,Role,Status,Party size,Dietary,VIP,Arrival,Departure,Notes
Jordan Blake,jordan.blake@example.com,+1 (555) 123-4567,Cobalt Industries,VP Strategy,Confirmed,1,Vegetarian,no,2026-08-04,2026-08-06,
Sam Rivera,sam.rivera@example.com,+1 (555) 987-6543,Cobalt Industries,Director,Pending,2,Gluten-free;Dairy-free,yes,2026-08-04,2026-08-06,Late arrival`;

/* ------------------------------------------------------------------ *
 * Context + provider
 * ------------------------------------------------------------------ */

export type NewAttendee = Omit<Attendee, "id">;

interface EventPlanningContextValue extends PlanningState {
  event: PlanningEvent;
  packages: FnbPackage[];
  days: string[];
  addAttendee: (a: NewAttendee) => void;
  updateAttendee: (id: string, patch: Partial<Attendee>) => void;
  deleteAttendee: (id: string) => void;
  importAttendees: (list: Attendee[]) => void;
  assignAttendee: (attendeeId: string, roomTypeId: string | null) => void;
  addRoomType: (name: string) => void;
  updateRoomType: (id: string, patch: Partial<RoomType>) => void;
  deleteRoomType: (id: string) => void;
  setMeal: (dayISO: string, slotKey: string, packageId: string | null) => void;
  resetPlanning: () => void;
}

const EventPlanningContext = createContext<EventPlanningContextValue | null>(null);

export function EventPlanningProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const eventId = id ?? "RFP-2041";
  const event = useMemo(() => getEventMeta(eventId), [eventId]);
  const [state, setState] = useState<PlanningState>(() => loadOrSeed(event));

  // re-seed when navigating to a different event
  useEffect(() => {
    setState(loadOrSeed(event));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // persist
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(eventId), JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state, eventId]);

  const days = useMemo(() => eventDays(event.arrival, event.departure), [event]);

  const addAttendee = useCallback((a: NewAttendee) => {
    setState((s) => ({ ...s, attendees: [...s.attendees, { ...a, id: uid() }] }));
  }, []);

  const updateAttendee = useCallback((attendeeId: string, patch: Partial<Attendee>) => {
    setState((s) => ({
      ...s,
      attendees: s.attendees.map((a) => (a.id === attendeeId ? { ...a, ...patch } : a)),
    }));
  }, []);

  const deleteAttendee = useCallback((attendeeId: string) => {
    setState((s) => ({ ...s, attendees: s.attendees.filter((a) => a.id !== attendeeId) }));
  }, []);

  const importAttendees = useCallback((list: Attendee[]) => {
    setState((s) => ({ ...s, attendees: [...s.attendees, ...list] }));
  }, []);

  const assignAttendee = useCallback((attendeeId: string, roomTypeId: string | null) => {
    setState((s) => ({
      ...s,
      attendees: s.attendees.map((a) => (a.id === attendeeId ? { ...a, roomTypeId } : a)),
    }));
  }, []);

  const addRoomType = useCallback(
    (name: string) => {
      setState((s) => ({
        ...s,
        roomTypes: [
          ...s.roomTypes,
          { id: uid("rt"), name, checkIn: event.arrival, checkOut: event.departure },
        ],
      }));
    },
    [event],
  );

  const updateRoomType = useCallback((rtId: string, patch: Partial<RoomType>) => {
    setState((s) => ({
      ...s,
      roomTypes: s.roomTypes.map((r) => (r.id === rtId ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteRoomType = useCallback((rtId: string) => {
    setState((s) => ({
      ...s,
      roomTypes: s.roomTypes.filter((r) => r.id !== rtId),
      attendees: s.attendees.map((a) => (a.roomTypeId === rtId ? { ...a, roomTypeId: null } : a)),
    }));
  }, []);

  const setMeal = useCallback((dayISO: string, slotKey: string, packageId: string | null) => {
    setState((s) => {
      const key = mealKey(dayISO, slotKey);
      const next = { ...s.fnb };
      if (packageId) next[key] = packageId;
      else delete next[key];
      return { ...s, fnb: next };
    });
  }, []);

  const resetPlanning = useCallback(() => {
    setState(seedState(event));
  }, [event]);

  const value = useMemo<EventPlanningContextValue>(
    () => ({
      ...state,
      event,
      packages: PACKAGE_CATALOG,
      days,
      addAttendee,
      updateAttendee,
      deleteAttendee,
      importAttendees,
      assignAttendee,
      addRoomType,
      updateRoomType,
      deleteRoomType,
      setMeal,
      resetPlanning,
    }),
    [
      state,
      event,
      days,
      addAttendee,
      updateAttendee,
      deleteAttendee,
      importAttendees,
      assignAttendee,
      addRoomType,
      updateRoomType,
      deleteRoomType,
      setMeal,
      resetPlanning,
    ],
  );

  return <EventPlanningContext.Provider value={value}>{children}</EventPlanningContext.Provider>;
}

export function useEventPlanning(): EventPlanningContextValue {
  const ctx = useContext(EventPlanningContext);
  if (!ctx) throw new Error("useEventPlanning must be used within EventPlanningProvider");
  return ctx;
}

/* ------------------------------------------------------------------ *
 * Planning step metadata (shared by tracker)
 * ------------------------------------------------------------------ */

export type PlanningStepKey = "attendees" | "rooms" | "fnb" | "spaces" | "decor" | "agenda";

export interface PlanningStepDef {
  key: PlanningStepKey;
  label: string;
  description: string;
  stepNo: string;
}

export const PLANNING_STEPS: PlanningStepDef[] = [
  { key: "attendees", label: "Attendee lists", description: "Guest roster, RSVPs, dietary & access needs.", stepNo: "01" },
  { key: "rooms", label: "Room booking", description: "Room block, suite assignments, arrivals.", stepNo: "02" },
  { key: "fnb", label: "Food & Beverage", description: "Menus, tastings, dietary counts.", stepNo: "03" },
  { key: "spaces", label: "Spaces", description: "Function rooms, setups, capacities.", stepNo: "04" },
  { key: "decor", label: "Décor", description: "Florals, branding, lighting, signage.", stepNo: "05" },
  { key: "agenda", label: "Agenda", description: "Day-by-day run-of-show.", stepNo: "06" },
];

/* ------------------------------------------------------------------ *
 * Billing tracker metadata (separate sidebar group)
 * ------------------------------------------------------------------ */

export type BillingStepKey = "billing-overview" | "billing-documents";

export interface BillingStepDef {
  key: BillingStepKey;
  /** label shown in the sidebar */
  navLabel: string;
  /** short blurb shown under the sidebar label */
  navBlurb: string;
  /** title shown in the step-header card */
  title: string;
  /** blurb shown in the step-header card */
  blurb: string;
  /** kicker shown above the step-header title */
  kicker: string;
  /** route segment relative to /servicing/:id/ */
  route: string;
}

export const BILLING_STEPS: BillingStepDef[] = [
  {
    key: "billing-overview",
    navLabel: "Billing overview",
    navBlurb: "Live estimate, payments & balances.",
    title: "Billing overview",
    blurb:
      "Live estimate, payment history, and outstanding balances in one view. Totals re-estimate automatically as scope changes.",
    kicker: "Billing · Overview",
    route: "billing/overview",
  },
  {
    key: "billing-documents",
    navLabel: "Documents",
    navBlurb: "Invoices & billing files.",
    title: "Invoices & billing documents",
    blurb:
      "Store invoices, receipts, contracts, and statements tied to this event. Drag-and-drop or browse to upload.",
    kicker: "Billing · Documents",
    route: "billing/documents",
  },
];

export type WorkspaceStepKey = PlanningStepKey | BillingStepKey;
