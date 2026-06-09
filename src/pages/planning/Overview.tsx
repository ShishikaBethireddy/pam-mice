import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flower2,
  MapPin,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { summarize, useEventPlanning, type PlanningStepKey } from "@/lib/eventPlanning";
import { computeBilling } from "@/lib/billing";
import { currency, fmtDate } from "@/data/mockData";
import heroImg from "@/assets/nobu-venue-ballroom.jpg";

type SummaryCard = {
  key: PlanningStepKey;
  icon: typeof Users;
  label: string;
  stat: string;
  sub: string;
};

export default function Overview() {
  const { event, attendees, fnb } = useEventPlanning();
  const { id } = useParams();
  const eventId = id ?? event.id;
  const b = useMemo(() => computeBilling(event.estValue), [event.estValue]);

  const s = summarize(attendees);
  const depositPayment = b.payments.find((p) => p.status === "paid");
  const deposit = depositPayment?.amount ?? Math.round(event.estValue * 0.25);

  const plan: string[] = [
    "Multi-day private event at Nobu Hotel Los Cabos",
    `${event.peakRooms} guest rooms held across connecting suites`,
    `${event.meetingSpaceSqft.toLocaleString()} sq ft of flexible meeting & function space`,
    "Dedicated event servicing manager end-to-end",
    "Curated Nobu F&B — chef's table dinner & breaks",
    "On-site AV, production & run-of-show support",
  ];

  const summary: SummaryCard[] = [
    {
      key: "attendees",
      icon: Users,
      label: "Attendees",
      stat: `${s.total} on the list`,
      sub: `${s.confirmed} confirmed · ${s.pending + s.hold} pending`,
    },
    {
      key: "rooms",
      icon: BedDouble,
      label: "Room booking",
      stat: `${event.peakRooms} rooms held`,
      sub: `${attendees.filter((a) => a.roomTypeId).length} guests assigned`,
    },
    {
      key: "fnb",
      icon: UtensilsCrossed,
      label: "Food & Beverage",
      stat: Object.keys(fnb).length ? `${Object.keys(fnb).length} menus set` : "Menus to plan",
      sub: `${currency(event.fbBudget)} F&B budget`,
    },
    {
      key: "spaces",
      icon: Building2,
      label: "Spaces",
      stat: event.venue,
      sub: `${event.meetingSpaceSqft.toLocaleString()} sq ft`,
    },
    {
      key: "decor",
      icon: Flower2,
      label: "Décor",
      stat: "Concept in progress",
      sub: "Florals, branding & lighting",
    },
    {
      key: "agenda",
      icon: CalendarDays,
      label: "Agenda",
      stat: `${event.nights + 1} days`,
      sub: "Day-by-day run-of-show",
    },
  ];

  return (
    <PlanningWorkspace activeStep="overview" bare>
      <div className="w-full">
        {/* Hero */}
        <header className="relative h-[300px] w-full overflow-hidden sm:h-[360px]">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-paper/5" />
          <Link
            to="/account"
            className="absolute left-6 top-5 inline-flex items-center gap-1.5 rounded-full bg-paper/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur lg:hidden"
          >
            <ArrowLeft className="h-3 w-3" /> Account
          </Link>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-7 sm:px-10 sm:pb-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-copper">
              {event.client} · Event portal
            </p>
            <h1 className="mt-1 font-serif text-5xl leading-[1.02] text-ink sm:text-6xl">{event.venue}</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-copper" /> {fmtDate(event.arrival)} · {event.nights}{" "}
                {event.nights === 1 ? "night" : "nights"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-copper" /> {s.totalGuests} attendees
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-copper" /> Nobu Hotel Los Cabos
              </span>
            </div>
          </div>
        </header>

        {/* Floating editorial content */}
        <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-9 sm:px-10 sm:py-11">
          {/* Payment confirmation */}
          <section className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-7 w-7 flex-none text-copper" strokeWidth={1.6} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-copper">Payment confirmed</p>
              <h2 className="mt-2 font-serif text-3xl text-ink">Your date is locked in.</h2>
              <p className="mt-2 text-sm text-ink-soft">
                {currency(deposit)} deposit received{depositPayment?.paidOn ? ` ${fmtDate(depositPayment.paidOn)}` : ""}.
                {event.contactEmail ? ` Receipt sent to ${event.contactEmail}.` : " A receipt is on its way."}
              </p>
            </div>
          </section>

          {/* Core plan */}
          <section className="-mx-6 bg-canvas/70 px-6 py-8 sm:-mx-10 sm:px-10 sm:py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-copper">Core plan</p>
            <h3 className="mt-1 font-serif text-2xl text-ink">What {event.eventName.toLowerCase()} includes</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {plan.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/90">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-copper/40">
                    <CheckCircle2 className="h-3.5 w-3.5 text-copper" strokeWidth={2.2} />
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Planning summary */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-copper">Planning summary</p>
            <h3 className="mt-1 font-serif text-2xl text-ink">Where things stand</h3>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              A quick look at each part of {event.client}&rsquo;s {event.eventName.toLowerCase()}. Jump into any step to
              make changes.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {summary.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.key}
                    to={`/servicing/${eventId}/${it.key}`}
                    className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-paper p-5 shadow-card transition-colors hover:border-copper/50"
                  >
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-copper/10 text-copper">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                        {it.label}
                      </div>
                      <div className="mt-0.5 font-serif text-lg text-ink">{it.stat}</div>
                      <div className="text-xs text-ink-muted">{it.sub}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-none text-ink-muted transition-colors group-hover:text-copper" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Balance / billing teaser */}
          <section className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-paper p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-copper">Billing</p>
              <h3 className="mt-1 font-serif text-2xl text-ink">
                Estimated total {currency(b.estimatedTotal)}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {currency(b.paid)} collected · {currency(b.outstanding)} outstanding
              </p>
            </div>
            <Link
              to={`/servicing/${eventId}/billing`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-ink/90"
            >
              <Wallet className="h-3.5 w-3.5" /> View billing & invoices
            </Link>
          </section>
        </div>
      </div>
    </PlanningWorkspace>
  );
}
