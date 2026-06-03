import { useEffect, useState } from "react";

export type MockUser = {
  name: string;
  email: string;
  company: string;
};

const KEY = "nobu_mock_user";

export function getMockUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function setMockUser(u: MockUser | null) {
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("mock-auth-change"));
}

export function useMockUser() {
  const [user, setUser] = useState<MockUser | null>(() => getMockUser());
  useEffect(() => {
    const handler = () => setUser(getMockUser());
    window.addEventListener("mock-auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mock-auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return user;
}

export const mockEventHistory = [
  {
    id: "EVT-2025-014",
    name: "Leadership Offsite — Q3 Planning",
    property: "Nobu Hotel Los Cabos",
    dates: "Sep 13 – 15, 2025",
    attendees: 48,
    status: "Completed",
    value: "$182,400",
  },
  {
    id: "EVT-2025-007",
    name: "Global Sales Kickoff",
    property: "UNICO 20°87° Riviera Maya",
    dates: "Feb 4 – 7, 2025",
    attendees: 220,
    status: "Completed",
    value: "$612,800",
  },
  {
    id: "EVT-2024-031",
    name: "Board Strategy Session",
    property: "Ava Resort Cancun",
    dates: "Nov 11 – 13, 2024",
    attendees: 18,
    status: "Completed",
    value: "$94,200",
  },
];

/* ---------- Submitted RFPs (from Plan With Allie) ---------- */

export type SubmittedRfp = {
  id: string;
  submittedAt: string; // ISO
  eventType: string;
  property: string;
  headcount: string;
  timing: string;
  budgetRange: string;
  spaces: string[];
  fnb: string[];
  specialRequests: string[];
  specialRequestsNote?: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  status: "Submitted" | "In review" | "Proposal sent" | "Awarded";
};

const RFP_KEY = "nobu_submitted_rfps";

export function getSubmittedRfps(): SubmittedRfp[] {
  try {
    const raw = localStorage.getItem(RFP_KEY);
    return raw ? (JSON.parse(raw) as SubmittedRfp[]) : [];
  } catch {
    return [];
  }
}

export function addSubmittedRfp(rfp: Omit<SubmittedRfp, "id" | "submittedAt" | "status"> & { status?: SubmittedRfp["status"] }): SubmittedRfp {
  const yr = new Date().getFullYear();
  const seq = String(getSubmittedRfps().length + 1).padStart(3, "0");
  const record: SubmittedRfp = {
    id: `RFP-${yr}-${seq}`,
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    ...rfp,
  };
  const all = [record, ...getSubmittedRfps()];
  try {
    localStorage.setItem(RFP_KEY, JSON.stringify(all));
  } catch {}
  window.dispatchEvent(new Event("mock-rfps-change"));
  return record;
}

export function useSubmittedRfps() {
  const [rfps, setRfps] = useState<SubmittedRfp[]>(() => getSubmittedRfps());
  useEffect(() => {
    const handler = () => setRfps(getSubmittedRfps());
    window.addEventListener("mock-rfps-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mock-rfps-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return rfps;
}