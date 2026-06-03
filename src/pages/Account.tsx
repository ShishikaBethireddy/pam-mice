import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockEventHistory, setMockUser, useMockUser, useSubmittedRfps } from "@/lib/mockAuth";
import { LogOut, Building2, Mail, Calendar, Users, FileText, Clock } from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";

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