import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Hotel, ShieldCheck, Sparkles, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROPERTIES = [
  "Nobu Hotels",
  "Hard Rock Hotels",
  "UNICO 20°87°",
  "Hard Rock Live",
  "PAM Hotels",
];

const Landing = () => {
  const navigate = useNavigate();

  const personas = [
    {
      id: "direct",
      title: "Direct Booking",
      tagline: "For MICE planners (Meetings, Incentives, Conferences, Events)",
      description:
        "Plan your meeting, incentive trip, conference, or signature event directly with Nobu no Cvent, no middlemen. Get a tailored proposal in minutes.",
      icon: Building2,
      cta: "Start planning your event",
      to: "/book",
      points: [
        "Browse Nobu spaces matched to your event",
        "Live pricing, dates, and inclusions",
        "Refundable date hold no commitment",
      ],
    },
    {
      id: "partner",
      title: "Hotel Partner",
      tagline: "For PAM sales, revenue & on-property teams",
      description:
        "Manage inbound RFPs across Nobu, Hard Rock, and UNICO. Build proposals, run scenarios, and submit in one click.",
      icon: Hotel,
      cta: "Continue to RFP inbox",
      to: "/inbox",
      points: [
        "Unified RFP inbox across properties",
        "Scenario planner & availability",
        "One-click submission to Cvent + Salesforce",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-grey-900 text-grey-50">
      {/* Top brand bar */}
      <header className="border-b border-grey-800/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-brand-300/40 text-brand-300">
              <Building className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg tracking-[0.18em] text-grey-50">PROPOSAL BUILDER</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-grey-400">
                by PAM Hotels
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-grey-400 md:flex">
            <span>Nobu</span>
            <span>Hard Rock</span>
            <span>UNICO</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, hsl(var(--brand-300)) 0%, transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--brand-500)) 0%, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-brand-300/30 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-300">
            <Sparkles className="h-3 w-3" />
            Proposal Builder
          </div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
            Group business, <span className="italic text-brand-300">refined.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-grey-300 md:text-base">
            The proposal & RFP workspace for the PAM Hotels collection Nobu, Hard Rock, UNICO,
            and partner properties.
          </p>
        </div>
      </section>

      {/* Persona selection */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-grey-700" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-grey-400">
            Sign in as
          </span>
          <div className="h-px w-12 bg-grey-700" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => navigate(p.to)}
                className="group relative flex flex-col border border-grey-800 bg-grey-800/40 p-8 text-left transition-all hover:border-brand-300/60 hover:bg-grey-800/70"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-brand-300/40 text-brand-300 transition-colors group-hover:bg-brand-300/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-grey-500 transition-all group-hover:translate-x-1 group-hover:text-brand-300" />
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-brand-300">
                  {p.tagline}
                </div>
                <h2 className="mt-2 font-serif text-3xl font-light tracking-tight text-grey-50">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-grey-300">{p.description}</p>

                <ul className="mt-6 space-y-2 border-t border-grey-800 pt-5 text-sm text-grey-300">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-300" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-grey-50 group-hover:text-brand-300">
                  {p.cta}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Properties strip */}
        <div className="mt-16 border-t border-grey-800 pt-8">
          <div className="mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-grey-500">
            Trusted across the collection
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm tracking-[0.2em] text-grey-400">
            {PROPERTIES.map((name) => (
              <span key={name} className="font-serif uppercase">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-grey-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          SSO managed by PAM Hotels IT · Demo environment
        </div>
      </section>
    </div>
  );
};

export default Landing;