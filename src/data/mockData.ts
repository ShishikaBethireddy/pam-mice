export type RfpStatus = "new" | "in_progress" | "awaiting_review" | "submitted" | "revision_requested" | "lost";
export type Source = "Cvent" | "Direct";

export interface Rfp {
  id: string;
  source: Source;
  cventId?: string;
  directPortalRef?: string;
  client: string;
  clientLogo: string;
  eventName: string;
  contact: { name: string; title: string; email: string };
  arrival: string;
  departure: string;
  nights: number;
  peakRooms: number;
  totalRoomNights: number;
  meetingSpaceSqft: number;
  fbBudget: number;
  specialRequests: string[];
  status: RfpStatus;
  receivedAt: string;
  responseDue: string;
  estValue: number;
  previousProposal?: PreviousProposal;
  revisionRequest?: RevisionRequest;
}

export interface PreviousProposal {
  version: string;
  submittedAt: string;
  submittedBy: string;
  format: "PDF" | "PPTX";
  propertyId: string;
  arrival: string;
  departure: string;
  peakRooms: number;
  groupRateAvg: number;
  totalValue: number;
  inclusions: string[];
  fileName: string;
}

export interface RevisionRequest {
  requestedAt: string;
  requestedBy: string;
  channel: "Cvent" | "Email" | "Direct";
  summary: string;
  asks: string[];
}

export interface Property {
  id: string;
  name: string;
  city: string;
  brand: string;
  rooms: number;
  meetingSqft: number;
  rating: number;
}

export const properties: Property[] = [
  { id: "p1", name: "Nobu Hotel Los Cabos", city: "Cabo San Lucas, MX", brand: "Nobu", rooms: 200, meetingSqft: 18000, rating: 4.9 },
  { id: "p2", name: "Ava Resort Cancun", city: "Cancun, MX", brand: "Ava", rooms: 460, meetingSqft: 32000, rating: 4.7 },
  { id: "p3", name: "UNICO 20°87° Riviera Maya", city: "Riviera Maya, MX", brand: "UNICO", rooms: 448, meetingSqft: 24000, rating: 4.8 },
  { id: "p4", name: "Hard Rock Hotel Riviera Maya", city: "Riviera Maya, MX", brand: "Hard Rock", rooms: 1264, meetingSqft: 45000, rating: 4.6 },
];

export const rfps: Rfp[] = [
  {
    id: "RFP-2048",
    source: "Cvent",
    cventId: "CV-884321",
    client: "Northstar Pharmaceuticals",
    clientLogo: "NP",
    eventName: "Q3 National Sales Kickoff",
    contact: { name: "Erica Holm", title: "Director, Corporate Events", email: "eholm@northstar.com" },
    arrival: "2026-09-14",
    departure: "2026-09-17",
    nights: 3,
    peakRooms: 220,
    totalRoomNights: 612,
    meetingSpaceSqft: 14500,
    fbBudget: 185000,
    specialRequests: ["Plated dinner for 240 on night 2", "Branded room keys", "EV charging for 12 vehicles"],
    status: "new",
    receivedAt: "2026-05-26T09:14:00Z",
    responseDue: "2026-06-02",
    estValue: 412000,
  },
  {
    id: "RFP-2047",
    source: "Direct",
    directPortalRef: "WEB-58210",
    client: "Linden Capital Partners",
    clientLogo: "LC",
    eventName: "Annual Investor Summit",
    contact: { name: "Marcus Vale", title: "Chief of Staff", email: "marcus@lindencap.com" },
    arrival: "2026-10-05",
    departure: "2026-10-08",
    nights: 3,
    peakRooms: 95,
    totalRoomNights: 270,
    meetingSpaceSqft: 6500,
    fbBudget: 92000,
    specialRequests: ["Private dining on night 1", "Secure breakout for 12", "Black-car shuttle from ORD"],
    status: "in_progress",
    receivedAt: "2026-05-24T16:42:00Z",
    responseDue: "2026-05-31",
    estValue: 248000,
  },
  {
    id: "RFP-2045",
    source: "Cvent",
    cventId: "CV-883901",
    client: "Helios Medical Society",
    clientLogo: "HM",
    eventName: "Cardiology Symposium 2026",
    contact: { name: "Dr. Priya Raman", title: "Program Chair", email: "praman@heliosmed.org" },
    arrival: "2026-11-12",
    departure: "2026-11-16",
    nights: 4,
    peakRooms: 340,
    totalRoomNights: 1180,
    meetingSpaceSqft: 22000,
    fbBudget: 310000,
    specialRequests: ["Concurrent breakout tracks (8)", "Exhibit hall 18k sqft", "Accessible suites x6"],
    status: "awaiting_review",
    receivedAt: "2026-05-21T11:30:00Z",
    responseDue: "2026-05-30",
    estValue: 695000,
  },
  {
    id: "RFP-2041",
    source: "Direct",
    directPortalRef: "WEB-58104",
    client: "Cobalt Industries",
    clientLogo: "CI",
    eventName: "Board Meeting",
    contact: { name: "Janine Okafor", title: "EA to CEO", email: "j.okafor@cobalt.io" },
    arrival: "2026-08-04",
    departure: "2026-08-06",
    nights: 2,
    peakRooms: 24,
    totalRoomNights: 48,
    meetingSpaceSqft: 1800,
    fbBudget: 38000,
    specialRequests: ["Chef's table dinner", "Spa block 9–11am"],
    status: "submitted",
    receivedAt: "2026-05-18T08:00:00Z",
    responseDue: "2026-05-25",
    estValue: 84000,
  },
  {
    id: "RFP-2039",
    source: "Cvent",
    cventId: "CV-883110",
    client: "Vantage Logistics",
    clientLogo: "VL",
    eventName: "Regional Manager Summit",
    contact: { name: "Tom Reilly", title: "VP Operations", email: "treilly@vantagelog.com" },
    arrival: "2026-07-22",
    departure: "2026-07-24",
    nights: 2,
    peakRooms: 60,
    totalRoomNights: 118,
    meetingSpaceSqft: 3400,
    fbBudget: 45000,
    specialRequests: ["Outdoor reception", "AV for general session 120"],
    status: "lost",
    receivedAt: "2026-05-10T13:21:00Z",
    responseDue: "2026-05-17",
    estValue: 96000,
  },
  {
    id: "RFP-2043",
    source: "Cvent",
    cventId: "CV-883612",
    client: "Meridian Tech Group",
    clientLogo: "MT",
    eventName: "Global Engineering Summit",
    contact: { name: "Avery Chen", title: "Head of Events", email: "achen@meridiantech.com" },
    arrival: "2026-09-29",
    departure: "2026-10-02",
    nights: 3,
    peakRooms: 180,
    totalRoomNights: 504,
    meetingSpaceSqft: 11000,
    fbBudget: 148000,
    specialRequests: ["Hackathon space 24h access", "Vegan menu for 60", "Recording-grade AV in mainstage"],
    status: "revision_requested",
    receivedAt: "2026-05-12T10:05:00Z",
    responseDue: "2026-05-30",
    estValue: 338000,
    previousProposal: {
      version: "v1",
      submittedAt: "2026-05-19T15:22:00Z",
      submittedBy: "Sloane Whitfield",
      format: "PDF",
      propertyId: "p1",
      arrival: "2026-09-29",
      departure: "2026-10-02",
      peakRooms: 180,
      groupRateAvg: 309,
      totalValue: 352000,
      inclusions: [
        "180 peak rooms · run-of-house king",
        "11,000 sqft meeting space, mainstage + 4 breakouts",
        "Standard AV bundle, F&B $148K",
        "Complimentary WiFi, 1:50 staff:guest concierge",
      ],
      fileName: "Meridian-Tech-Proposal-v1.pdf",
    },
    revisionRequest: {
      requestedAt: "2026-05-26T08:40:00Z",
      requestedBy: "Avery Chen",
      channel: "Cvent",
      summary:
        "Client appreciates the v1 proposal but needs the group rate trimmed and an upgraded AV package for the mainstage. Open to flexing arrival by one day if it unlocks better pricing.",
      asks: [
        "Lower group rate to $279 or below",
        "Upgrade mainstage AV to broadcast bundle (LED wall + recording)",
        "Add 25 additional rooms on peak night (Sep 30)",
        "Confirm hackathon space access 24h, no overtime fees",
      ],
    },
  },
];

export interface AvailabilityNight {
  date: string;
  requested: number;
  available: number;
  bestAvailableRate: number;
  groupRate: number;
}

export function buildAvailability(rfp: Rfp, propertyId: string = "p1"): AvailabilityNight[] {
  const start = new Date(rfp.arrival);
  const nights: AvailabilityNight[] = [];
  const propMultiplier =
    propertyId === "p4" ? 1.4 : propertyId === "p3" ? 1.15 : propertyId === "p2" ? 1.0 : 0.78;
  for (let i = 0; i < rfp.nights; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const requested = i === 1 ? rfp.peakRooms : Math.round(rfp.peakRooms * 0.85);
    const baseAvail = Math.round(rfp.peakRooms * (i === 1 ? 0.92 : 1.1) * propMultiplier);
    nights.push({
      date: d.toISOString().slice(0, 10),
      requested,
      available: baseAvail,
      bestAvailableRate: 329 + i * 14,
      groupRate: 279 + i * 10,
    });
  }
  return nights;
}

export const integrations = [
  { name: "Cvent", status: "connected" as const, lastSync: "2 min ago", icon: "C" },
  { name: "Direct Web Portal", status: "connected" as const, lastSync: "4 min ago", icon: "D" },
  { name: "Opera PMS", status: "connected" as const, lastSync: "live", icon: "O" },
];

export const statusMeta: Record<RfpStatus, { label: string; tone: "info" | "warning" | "success" | "neutral" | "danger" }> = {
  new: { label: "New", tone: "info" },
  in_progress: { label: "In progress", tone: "warning" },
  awaiting_review: { label: "Awaiting review", tone: "warning" },
  submitted: { label: "Submitted", tone: "success" },
  revision_requested: { label: "Revision requested", tone: "warning" },
  lost: { label: "Lost", tone: "danger" },
};

export function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function fmtShortDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}