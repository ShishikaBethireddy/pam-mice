import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import { computeTopMatches, TopMatchesPanel, type Brief } from "@/pages/PlanWithAllie";
import heroImg from "@/assets/nobu-venue-ballroom.jpg";

type LocationState = { brief?: Brief; rfpId?: string } | null;

const NEXT_STEPS: { title: string; desc: string; done?: boolean }[] = [
  { title: "Brief submitted", desc: "Your event brief is in with the Nobu events team.", done: true },
  { title: "A specialist reaches out", desc: "Your dedicated sales rep will contact you shortly to confirm the details." },
  { title: "Customize your event", desc: "Shape attendees, rooms, F&B, spaces, décor, and run-of-show." },
  { title: "Review your proposal", desc: "We send tailored pricing and a proposal for your sign-off." },
  { title: "Confirm & countdown", desc: "Lock it in — we handle the rest right up to showtime." },
];

export default function BriefSubmitted() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { brief, rfpId } = (state as LocationState) || {};

  if (!brief) return <Navigate to="/plan" replace />;

  const { matches, tier, flexible } = computeTopMatches(brief);
  const firstName = (brief.contactName || "").trim().split(/\s+/)[0];
  const greetingName = firstName || "there";
  const planHref = "/servicing/RFP-2041/overview";

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <NobuTopNav activeTab="Plan My Event" />

      {/* Hero */}
      <div className="relative h-[260px] w-full overflow-hidden md:h-[320px]">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,22,18,0.86) 0%, rgba(20,22,18,0.5) 55%, rgba(20,22,18,0.18) 100%)",
          }}
        />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#A6AF93] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1c1f17]">
            <Check className="h-3.5 w-3.5" /> Brief submitted
          </div>
          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.05] text-white md:text-6xl">
            You&rsquo;re all set,
            <br />
            {greetingName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
            Your brief is with the Nobu events team. Here are your strongest property matches — and exactly what
            happens next.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
        {/* Left — top matches */}
        <div>
          <TopMatchesPanel matches={matches} tier={tier} flexible={flexible} clientName={brief.companyName} />
        </div>

        {/* Right — what happens next + CTA */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#d0d0d0] bg-white p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#969696]">
              What happens next
            </div>
            <ol className="mt-5 space-y-5">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <div
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                      s.done ? "bg-[#6F7E50] text-white" : "border border-[#d0d0d0] bg-white text-[#969696]"
                    }`}
                  >
                    {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm font-medium text-[#2b2b27]">{s.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-[#969696]">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Continue to plan */}
          <div className="rounded-2xl border border-[#A6AF93] bg-white p-6">
            <div className="text-sm font-medium text-[#2b2b27]">Continue to plan my event</div>
            <p className="mt-1 text-xs leading-relaxed text-[#969696]">
              Don&rsquo;t wait on the proposal — jump in now and customize attendees, rooms, F&amp;B, spaces, décor,
              and run-of-show.
            </p>
            <button
              onClick={() => navigate(planHref)}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white transition hover:opacity-80"
            >
              Continue to plan my event <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/account")}
              className="mt-2 block w-full text-center text-xs font-medium uppercase tracking-[0.08em] text-[#969696] hover:text-[#2b2b27]"
            >
              Track this proposal{rfpId ? ` · ${rfpId}` : ""}
            </button>
          </div>

          {/* Schedule a call */}
          <div className="rounded-2xl border border-[#d0d0d0] bg-[#f4efe6] p-6 text-center">
            <div className="font-serif text-lg italic text-[#2b2b27]">Have questions?</div>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-white hover:opacity-80">
              <Phone className="h-3.5 w-3.5" /> Schedule a call
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
