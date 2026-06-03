import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, Check, FileText, Mail, MessageSquare, Sparkles, Users, Wallet } from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import { useMockUser, useSubmittedRfps } from "@/lib/mockAuth";

const STAGES = [
  { key: "submitted", label: "Submitted", time: "DONE", blurb: "Brief received by the Nobu events team." },
  { key: "review", label: "In review", time: "24 HRS", blurb: "Allie & the events team are matching properties and dates." },
  { key: "proposal", label: "Proposal sent", time: "2–3 DAYS", blurb: "Custom proposal delivered for your review." },
  { key: "awarded", label: "Confirmed", time: "ON ACCEPT", blurb: "Dates held and contract issued." },
] as const;

const STATUS_TO_INDEX: Record<string, number> = {
  Submitted: 0,
  "In review": 1,
  "Proposal sent": 2,
  Awarded: 3,
};

export default function RfpRequest() {
  const { id } = useParams<{ id: string }>();
  const user = useMockUser();
  const navigate = useNavigate();
  const rfps = useSubmittedRfps();
  const rfp = useMemo(() => rfps.find((r) => r.id === id), [rfps, id]);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  if (!rfp) {
    return (
      <div className="min-h-screen bg-grey-50 text-grey-900">
        <NobuTopNav activeTab={null} />
        <main className="mx-auto max-w-[1100px] px-8 py-20 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-grey-400" />
          <h1 className="font-serif text-2xl">Request not found</h1>
          <p className="mt-2 text-sm text-grey-600">This RFP may have been removed.</p>
          <Link
            to="/account"
            className="mt-6 inline-block text-xs uppercase tracking-[0.2em] bg-grey-900 px-5 py-3 text-grey-50 hover:bg-grey-700"
          >
            Back to account
          </Link>
        </main>
      </div>
    );
  }

  const stageIdx = STATUS_TO_INDEX[rfp.status] ?? 0;
  const submittedDate = new Date(rfp.submittedAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-screen flex-col bg-grey-50 text-grey-900">
      <NobuTopNav activeTab={null} />

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar — RFP progress */}
        <aside className="hidden w-[340px] flex-none flex-col border-r border-grey-200 bg-white lg:flex">
          <div className="flex flex-col justify-center border-b border-grey-200 bg-grey-50 px-7 py-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
              Stage {stageIdx + 1} of {STAGES.length} · {STAGES[stageIdx].label}
            </div>
            <div className="mt-1 font-serif text-2xl text-grey-900">RFP Progress</div>
          </div>
          <div className="px-7 py-5 text-xs leading-relaxed text-grey-600">
            Track your request from submission to confirmed dates. We'll keep you posted at every stage.
          </div>
          <ol className="flex-1 overflow-y-auto px-4 pb-6">
            {STAGES.map((p, i) => {
              const state = i < stageIdx ? "done" : i === stageIdx ? "active" : "todo";
              return (
                <li
                  key={p.key}
                  className={`rounded-sm px-3 py-3 ${state === "active" ? "bg-brand-100" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-medium ${
                        state === "done"
                          ? "bg-grey-900 text-grey-50"
                          : state === "active"
                            ? "bg-brand-500 text-grey-50"
                            : "border border-grey-300 text-grey-400"
                      }`}
                    >
                      {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`flex items-center justify-between text-sm ${
                          state === "todo" ? "text-grey-400" : "text-grey-900"
                        }`}
                      >
                        <span className="font-medium">{p.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500">
                          {p.time}
                        </span>
                      </div>
                      <div
                        className={`mt-1 text-xs leading-relaxed ${
                          state === "todo" ? "text-grey-400" : "text-grey-600"
                        }`}
                      >
                        {p.blurb}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-grey-200 px-7 py-4">
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-grey-500 hover:text-grey-900"
            >
              <ArrowLeft className="h-3 w-3" /> Back to account
            </Link>
          </div>
        </aside>

        {/* Right pane — event details */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-10">
            {/* Mobile back */}
            <Link
              to="/account"
              className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-600 hover:text-grey-900 lg:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to account
            </Link>

            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
                  RFP request · {rfp.id}
                </div>
                <h1 className="mt-1 font-serif text-4xl text-grey-900">
                  {rfp.eventType || "Event request"}
                </h1>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-grey-600">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {rfp.property || "Property TBD"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Submitted {submittedDate}
                  </span>
                </div>
              </div>
              <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] bg-brand-500/10 text-brand-500">
                {rfp.status}
              </span>
            </div>

            {/* Event details */}
            <div className="mt-8 space-y-6">
              <Card title="Event brief">
                <Row icon={<Sparkles className="h-3.5 w-3.5" />} label="Event type" value={rfp.eventType} />
                <Row icon={<Users className="h-3.5 w-3.5" />} label="Attendees" value={rfp.headcount} />
                <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Timing" value={rfp.timing} />
                <Row icon={<Wallet className="h-3.5 w-3.5" />} label="Budget" value={rfp.budgetRange} />
                <Row icon={<Building2 className="h-3.5 w-3.5" />} label="Property" value={rfp.property} />
              </Card>

              <Card title="Spaces requested">
                {rfp.spaces.length ? <ChipList items={rfp.spaces} /> : <Empty>No spaces specified.</Empty>}
              </Card>

              <Card title="Food & beverage">
                {rfp.fnb.length ? <ChipList items={rfp.fnb} /> : <Empty>None specified.</Empty>}
              </Card>

              <Card title="Special requests">
                {rfp.specialRequests.length || rfp.specialRequestsNote ? (
                  <>
                    {rfp.specialRequests.length > 0 && <ChipList items={rfp.specialRequests} />}
                    {rfp.specialRequestsNote && (
                      <p className="mt-3 text-sm text-grey-700">{rfp.specialRequestsNote}</p>
                    )}
                  </>
                ) : (
                  <Empty>None specified.</Empty>
                )}
              </Card>

              <Card title="Contact">
                <Row icon={<Building2 className="h-3.5 w-3.5" />} label="Company" value={rfp.companyName} />
                <Row icon={<Users className="h-3.5 w-3.5" />} label="Primary contact" value={rfp.contactName} />
                <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={rfp.contactEmail} />
              </Card>

              {/* Message events team */}
              <div className="border border-grey-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
                      Need to add something?
                    </div>
                    <p className="mt-2 text-sm text-grey-700">
                      Send a note directly to the Nobu events team about this request.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] bg-grey-900 px-5 py-3 text-grey-50 hover:bg-grey-700">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message events team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-grey-200 bg-white p-6">
      <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-grey-500">{title}</div>
      {children}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-grey-100 py-3 last:border-0 last:pb-0 first:pt-0">
      <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-grey-100 text-grey-600">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-[0.2em] text-grey-500">{label}</div>
        <div className={`mt-0.5 text-sm ${value ? "text-grey-900" : "text-grey-400"}`}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-full border border-grey-200 bg-grey-50 px-3 py-1 text-xs text-grey-800"
        >
          {i}
        </span>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-grey-500">{children}</div>;
}