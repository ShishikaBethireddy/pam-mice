import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import { useSocialCtx } from "@/lib/socialPlanning";
import { currency } from "@/data/mockData";

const HERO = "/assets/hero-celebration.jpg";

const PLAN_INCLUSIONS = [
  "Private venue at Nobu Hotel Los Cabos",
  "Welcome cocktail reception",
  "Signature multi-course Nobu dinner",
  "Custom celebration cake moment",
  "DJ & dance floor with lighting",
  "Florals & table styling",
  "Photo backdrop & party setup",
  "Group room block at the preferred rate",
  "Dedicated event concierge, on-site",
];

export default function SocialOverview() {
  const ctx = useSocialCtx();

  const summary = [
    { key: "guests", icon: Users, label: "Guest list", stat: `${ctx.headcount} guests`, sub: "RSVPs, plus-ones & dietary" },
    { key: "rooms", icon: BedDouble, label: "Room allocation", stat: "5 rooms held", sub: "Garden Suite · sleeps 10" },
    { key: "vendors", icon: Store, label: "Vendors", stat: "1 of 9 booked", sub: "Frame & Field" },
    { key: "itinerary", icon: CalendarDays, label: "Itinerary", stat: "2 days · 4 items", sub: "Day-by-day run-of-show" },
    { key: "payments", icon: Wallet, label: "Payments", stat: `${currency(ctx.deposit)} deposit due`, sub: `Estimate ${currency(ctx.subtotal)}` },
  ] as const;

  return (
    <SocialPlanningShell activeStep="overview" fullBleed>
      <div className="w-full">
        {/* Hero */}
        <header className="relative h-[300px] w-full overflow-hidden sm:h-[360px]">
          <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/55 to-white/5" />
          <Link
            to="/account"
            className="absolute left-6 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-900 backdrop-blur md:hidden"
          >
            <ArrowLeft className="h-3 w-3" /> Account
          </Link>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-7 sm:px-10 sm:pb-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
              {ctx.theme.occasion} · Event Portal
            </p>
            <h1 className="mt-1 font-serif text-5xl leading-[1.02] text-grey-900 sm:text-6xl">{ctx.eventName}</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-grey-900/80">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-accent" /> {ctx.dates}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" /> {ctx.headcount} {ctx.theme.noun.plural}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {ctx.venue}
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-9 sm:px-10 sm:py-11">
          {/* Hold / estimate banner */}
          <section className="flex items-start gap-4">
            <Sparkles className="mt-0.5 h-6 w-6 flex-none text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Estimate ready</p>
              <h2 className="mt-2 font-serif text-3xl text-grey-900">
                Hold your date with a {currency(ctx.deposit)} deposit.
              </h2>
              <p className="mt-2 text-sm text-grey-600">
                Refundable up to 14 days before your {ctx.theme.occasion}.
              </p>
            </div>
          </section>

          {/* Core plan */}
          <section className="bg-texture-soft -mx-6 px-6 py-8 sm:-mx-10 sm:px-10 sm:py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Core plan</p>
            <h3 className="mt-1 font-serif text-2xl text-grey-900">What the celebration includes</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {PLAN_INCLUSIONS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-grey-900/90">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-accent/40">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" strokeWidth={2.2} />
                  </span>
                  <span className="leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Planning summary */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Planning summary</p>
            <h3 className="mt-1 font-serif text-2xl text-grey-900">Where things stand</h3>
            <p className="mt-2 max-w-xl text-sm text-grey-600">
              A quick look at each part of {ctx.firstName}&rsquo;s {ctx.theme.occasion}. Jump into any step to make changes.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {summary.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.key}
                    to={`/servicing/${ctx.id}/${it.key}`}
                    className="group flex items-center gap-4 border border-grey-200 bg-white p-5 transition-colors hover:border-accent/50"
                  >
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-100 text-brand-500">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">{it.label}</div>
                      <div className="mt-0.5 font-serif text-lg text-grey-900">{it.stat}</div>
                      <div className="text-xs text-grey-500">{it.sub}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-none text-grey-400 transition-colors group-hover:text-accent" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </SocialPlanningShell>
  );
}
