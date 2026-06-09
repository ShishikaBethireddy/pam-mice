import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockEventHistory, setMockUser, useMockUser, useSubmittedRfps } from "@/lib/mockAuth";
import {
  LogOut,
  Building2,
  Mail,
  Calendar,
  Users,
  FileText,
  Clock,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  PartyPopper,
} from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import { rfps, currency, fmtDate, type Rfp } from "@/data/mockData";

type PlanningStage = "ready" | "in_planning" | "finalizing" | "confirmed";

const STAGE_META: Record<PlanningStage, { label: string; cls: string; progress: number }> = {
  ready: { label: "Ready to plan", cls: "bg-brand-500/10 text-brand-500 border-brand-500/30", progress: 10 },
  in_planning: { label: "In planning", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30", progress: 45 },
  finalizing: { label: "Finalizing", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30", progress: 78 },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", progress: 100 },
};

type PlanningEvent = {
  rfp: Rfp;
  stage: PlanningStage;
  owner: string;
  nextTask: string;
};

// Approved RFPs handed off to the planner — these open the full planning flow.
const PLANNING_EVENTS: PlanningEvent[] = [
  { id: "RFP-2041", stage: "ready", owner: "Maya Alvarez", nextTask: "Confirm space hold & kickoff call" },
  { id: "RFP-2047", stage: "in_planning", owner: "Maya Alvarez", nextTask: "Lock F&B menus & private dining" },
  { id: "RFP-2045", stage: "finalizing", owner: "Devin Park", nextTask: "Finalize breakout tracks & AV run-of-show" },
  { id: "RFP-2043", stage: "confirmed", owner: "Devin Park", nextTask: "Distribute final event brief to property" },
]
  .map((e) => {
    const rfp = rfps.find((r) => r.id === e.id);
    return rfp ? { ...e, rfp } : null;
  })
  .filter((e): e is PlanningEvent => e !== null);

export default function Account() {
  const user = useMockUser();
  const navigate = useNavigate();
  const submittedRfps = useSubmittedRfps();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-grey-50 text-grey-900">
      <NobuTopNav activeTab={null} />

      <main className="mx-auto max-w-[1400px] px-8 py-12">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setMockUser(null);
              navigate("/book");
            }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-600 hover:text-grey-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-12">
          <div className="w-20 h-20 bg-grey-900 text-grey-50 flex items-center justify-center font-serif text-2xl">
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500 mb-1">Account</div>
            <h1 className="font-serif text-4xl mb-2">{user.name}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-grey-600">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {user.company}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Stat label="Events hosted" value={String(mockEventHistory.length)} />
          <Stat
            label="Total attendees"
            value={mockEventHistory.reduce((s, e) => s + e.attendees, 0).toLocaleString()}
          />
          <Stat label="Open RFP requests" value={String(submittedRfps.length)} />
        </section>

        {/* Events ready to plan — opens the full planning flow */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-serif text-2xl">Events ready to plan</h2>
              <p className="text-sm text-grey-600 mt-1">
                Your approved events — pick one up to plan spaces, F&amp;B, AV, and run-of-show.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {PLANNING_EVENTS.map(({ rfp, stage, owner, nextTask }) => {
              const meta = STAGE_META[stage];
              return (
                <button
                  key={rfp.id}
                  onClick={() => navigate(`/servicing/${rfp.id}/overview`)}
                  className="group border border-grey-200 bg-white p-6 text-left transition-colors hover:border-brand-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-grey-900 text-grey-50 grid place-items-center font-serif">
                        {rfp.clientLogo}
                      </div>
                      <div>
                        <div className="font-medium text-grey-900">{rfp.client}</div>
                        <div className="text-xs text-grey-500">
                          {rfp.eventName} · {rfp.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${meta.cls}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Meta grid */}
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <MetaItem icon={CalendarClock} label="Dates" value={`${fmtDate(rfp.arrival)} · ${rfp.nights} nights`} />
                    <MetaItem icon={Users} label="Peak rooms" value={String(rfp.peakRooms)} />
                    <MetaItem icon={ClipboardList} label="Meeting space" value={`${rfp.meetingSpaceSqft.toLocaleString()} sqft`} />
                    <MetaItem icon={PartyPopper} label="F&B budget" value={currency(rfp.fbBudget)} />
                  </dl>

                  {/* Planning progress */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] text-grey-500 mb-1.5">
                      <span className="uppercase tracking-wider">Planning progress</span>
                      <span>{meta.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
                      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${meta.progress}%` }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-grey-100 pt-4">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-grey-500">Next task</div>
                      <div className="truncate text-sm text-grey-900">{nextTask}</div>
                      <div className="mt-0.5 text-xs text-grey-500">Owner · {owner}</div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-500 opacity-70 group-hover:opacity-100">
                      {stage === "confirmed" ? "View event" : "Start planning"}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Submitted RFP requests */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-serif text-2xl">Submitted RFP requests</h2>
              <p className="text-sm text-grey-600 mt-1">
                Briefs you've sent to the Nobu events team via Allie.
              </p>
            </div>
            <Link
              to="/plan"
              className="text-xs uppercase tracking-[0.2em] text-grey-600 hover:text-grey-900"
            >
              + New request
            </Link>
          </div>

          {submittedRfps.length === 0 ? (
            <div className="border border-dashed border-grey-300 bg-white p-10 text-center">
              <FileText className="w-6 h-6 text-grey-400 mx-auto mb-3" />
              <div className="text-sm text-grey-700 font-medium">No RFP requests yet</div>
              <div className="text-xs text-grey-500 mt-1">
                Plan an event with Allie and your brief will appear here.
              </div>
              <Link
                to="/plan"
                className="inline-block mt-4 text-xs uppercase tracking-[0.2em] bg-grey-900 px-5 py-3 text-grey-50 hover:bg-grey-700"
              >
                Plan My Event
              </Link>
            </div>
          ) : (
            <div className="border border-grey-200 bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-grey-500 border-b border-grey-200">
                    <th className="px-5 py-4 font-medium">Request</th>
                    <th className="px-5 py-4 font-medium">Property</th>
                    <th className="px-5 py-4 font-medium">Timing</th>
                    <th className="px-5 py-4 font-medium text-right">Attendees</th>
                    <th className="px-5 py-4 font-medium">Budget</th>
                    <th className="px-5 py-4 font-medium">Submitted</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedRfps.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => navigate(`/account/rfp/${r.id}`)}
                      className="border-b border-grey-100 last:border-0 hover:bg-grey-50 cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium">{r.eventType || "Event request"}</div>
                        <div className="text-xs text-grey-500">{r.id}</div>
                      </td>
                      <td className="px-5 py-4 text-grey-700">{r.property || "—"}</td>
                      <td className="px-5 py-4 text-grey-700">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-grey-400" />
                          {r.timing || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-grey-400" />
                          {r.headcount || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-grey-700">{r.budgetRange || "—"}</td>
                      <td className="px-5 py-4 text-grey-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-grey-400" />
                          {new Date(r.submittedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] bg-brand-500/10 text-brand-500">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-serif text-2xl">Previous events</h2>
              <p className="text-sm text-grey-600 mt-1">
                Your team's history across PAM Hotels properties.
              </p>
            </div>
            <Link
              to="/plan"
              className="text-xs uppercase tracking-[0.2em] bg-grey-900 px-5 py-3 text-grey-50 hover:bg-grey-700"
            >
              Plan a new event
            </Link>
          </div>

          <div className="border border-grey-200 bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-grey-500 border-b border-grey-200">
                  <th className="px-5 py-4 font-medium">Event</th>
                  <th className="px-5 py-4 font-medium">Property</th>
                  <th className="px-5 py-4 font-medium">Dates</th>
                  <th className="px-5 py-4 font-medium text-right">Attendees</th>
                  <th className="px-5 py-4 font-medium text-right">Value</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockEventHistory.map((e) => (
                  <tr key={e.id} className="border-b border-grey-100 last:border-0 hover:bg-grey-50">
                    <td className="px-5 py-4">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-grey-500">{e.id}</div>
                    </td>
                    <td className="px-5 py-4 text-grey-700">{e.property}</td>
                    <td className="px-5 py-4 text-grey-700">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-grey-400" />
                        {e.dates}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-grey-400" />
                        {e.attendees}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium">{e.value}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] ${
                          e.status === "Completed"
                            ? "bg-grey-100 text-grey-700"
                            : "bg-brand-500/10 text-brand-500"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-grey-200 bg-white p-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-2">{label}</div>
      <div className="font-serif text-3xl">{value}</div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-grey-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-wider text-grey-500">{label}</dt>
        <dd className="text-grey-900 font-medium truncate">{value}</dd>
      </div>
    </div>
  );
}