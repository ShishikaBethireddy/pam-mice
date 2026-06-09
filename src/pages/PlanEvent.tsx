import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CalendarCheck,
  FileSignature,
  MessageCircle,
  PartyPopper,
  Phone,
  Presentation,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

/**
 * Pre-chat "Plan your event" page for Meetings & Events (MICE).
 *
 * MICE counterpart of the PAM Social Events `/plan` editorial page:
 * an editorial hero with a glass picker (what kind of program + roughly
 * when), an "events we host" carousel, and a 1-2-3 "how it works" band.
 * Hitting "Plan my event" stores the selections and routes to `/plan`
 * (the Allie concierge chat).
 */

const LOGO = "/assets/logo-nobu-white.png";

const EVENT_TYPES = [
  "Leadership Meeting",
  "Sales Kickoff",
  "Conference",
  "Incentive Trip",
  "Team Offsite",
  "Product Launch",
  "Board Meeting",
  "Awards Gala",
  "Training Academy",
  "Trade Show",
  "Custom Event",
] as const;
type EventType = (typeof EVENT_TYPES)[number];

const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;
const YEARS = ["2026", "2027", "2028"] as const;
type Season = (typeof SEASONS)[number];
type Year = (typeof YEARS)[number];

const EVENT_CAROUSEL_ITEMS = [
  { name: "Meetings & Conferences", Icon: Presentation, img: "/assets/venue-ballroom.jpg" },
  { name: "Incentive Trips", Icon: Award, img: "/assets/ava-resort.png" },
  { name: "Leadership Offsites", Icon: Users, img: "/assets/venue-yakusoku-garden.png" },
  { name: "Sales Kickoffs", Icon: Trophy, img: "/assets/venue-shiawase-terrace.png" },
  { name: "Product Launches", Icon: Rocket, img: "/assets/venue-rooftop.jpg" },
  { name: "Board Dinners", Icon: Briefcase, img: "/assets/venue-private-dining.jpg" },
  { name: "Awards & Galas", Icon: Sparkles, img: "/assets/unico-terrace.png" },
  { name: "Welcome Receptions", Icon: Wine, img: "/assets/venue-poolside.jpg" },
  { name: "Beachfront Dinners", Icon: UtensilsCrossed, img: "/assets/venue-beach.png" },
] as const;

function EventTypesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateAffordances = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateAffordances();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateAffordances, { passive: true });
    window.addEventListener("resize", updateAffordances);
    return () => {
      el.removeEventListener("scroll", updateAffordances);
      window.removeEventListener("resize", updateAffordances);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section className="bg-ink py-16 text-paper md:py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow text-copper-soft">Every format</p>
            <h2 className="font-title text-3xl leading-tight text-paper md:text-4xl">
              <span>Events</span> <span className="italic text-copper-soft">we host here.</span>
            </h2>
            <p className="mt-1 max-w-md font-sans text-sm leading-5 text-paper/70">
              From board dinners to full-resort conferences — a glimpse of what
              your team can convene under the Nobu roof.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              disabled={!canLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-white/5 text-paper transition-colors hover:border-paper/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              disabled={!canRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-white/5 text-paper transition-colors hover:border-paper/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {EVENT_CAROUSEL_ITEMS.map(({ name, Icon, img }) => (
              <article
                key={name}
                className="group relative w-[210px] shrink-0 snap-start overflow-hidden rounded-xl transition-all hover:-translate-y-1 md:w-[250px]"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={img}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <p className="font-title text-base leading-tight text-paper">{name}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink to-transparent md:w-16" />
        </div>
      </div>
    </section>
  );
}

const HOW_IT_WORKS_STEPS = [
  {
    Icon: ClipboardList,
    title: "Submit a proposal request",
    body: "Tell us the headcount, dates, and the kind of program you're shaping. Allie packages it into a proposal request in about four minutes.",
  },
  {
    Icon: MessageCircle,
    title: "Hear from the team",
    body: "A Nobu events specialist reviews your brief and follows up with availability, options, and a tailored estimate.",
  },
  {
    Icon: FileSignature,
    title: "Sign the contract with best value",
    body: "Compare your options, lock in the best value, and sign — transparent pricing with no surprises.",
  },
  {
    Icon: CalendarCheck,
    title: "Plan your event",
    body: "Shape every detail with your specialist — spaces, F&B, AV, room blocks, and run-of-show.",
  },
  {
    Icon: PartyPopper,
    title: "Attend the event",
    body: "Show up and enjoy it. Our team runs production end to end while you focus on your people.",
  },
] as const;

function HowItWorks({ onSpecialist }: { onSpecialist: () => void }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start gap-2 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow">How it works</p>
            <h2 className="font-title text-3xl leading-tight text-ink md:text-4xl">
              <span>Easy as</span> <span className="italic">1, 2, 3.</span>
            </h2>
            <p className="mt-1 max-w-md font-sans text-sm leading-5 text-ink-soft">
              From first inquiry to confirmed program — three steps, no spreadsheets.
            </p>
          </div>
          <button
            type="button"
            onClick={onSpecialist}
            className="hidden items-center gap-1.5 font-sans text-sm font-medium text-copper transition-colors hover:text-copper-hover md:inline-flex"
          >
            Speak to an events specialist
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-12">
          <div className="relative overflow-hidden rounded-xl">
            <div className="aspect-[4/5] w-full md:h-full">
              <img
                src="/assets/hero-celebration.jpg"
                alt="A Nobu corporate event in full swing"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="font-title text-2xl italic leading-tight text-paper md:text-3xl">
                From first inquiry to final toast.
              </p>
              <p className="mt-1 font-sans text-sm text-paper/85">One specialist, start to finish.</p>
            </div>
          </div>

          <ol className="flex flex-col gap-4">
            {HOW_IT_WORKS_STEPS.map(({ Icon, title, body }, i) => (
              <li
                key={title}
                className="flex gap-4 rounded-xl border border-border-subtle bg-cream-soft p-5 md:p-6"
              >
                <span className="font-title text-4xl italic leading-none text-copper md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-copper shadow-sm">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-title text-lg leading-snug text-ink md:text-xl">{title}</h3>
                  </div>
                  <p className="font-sans text-sm leading-6 text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function EventTypePicker({
  value,
  onChange,
}: {
  value: EventType | null;
  onChange: (v: EventType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-b border-paper pb-2 pt-2 text-left"
      >
        <span className="font-title font-normal text-[26px] md:text-[28px] leading-8 text-paper">
          {value ?? "Choose an event"}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-paper transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="flex flex-wrap gap-2 pt-3">
          {EVENT_TYPES.map((t) => {
            const selected = value === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={`rounded-full border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                  selected
                    ? "border-paper bg-paper text-ink"
                    : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DatePicker({
  season,
  year,
  onSeason,
  onYear,
}: {
  season: Season;
  year: Year;
  onSeason: (s: Season) => void;
  onYear: (y: Year) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-b border-paper pb-2 pt-2 text-left"
      >
        <span className="font-title font-normal text-[26px] md:text-[28px] leading-8 text-paper">
          {season} {year}
        </span>
        <CalendarDays className="h-5 w-5 shrink-0 text-paper" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="flex flex-col gap-2 pt-3">
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => {
              const selected = season === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSeason(s)}
                  className={`rounded-full border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                    selected
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            {YEARS.map((y) => {
              const selected = year === y;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    onYear(y);
                    setOpen(false);
                  }}
                  className={`rounded-full border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                    selected
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const PlanEvent = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [season, setSeason] = useState<Season>("Spring");
  const [year, setYear] = useState<Year>("2027");
  const [trustVisible, setTrustVisible] = useState(false);

  useEffect(() => {
    if (eventType) setTrustVisible(true);
  }, [eventType]);

  const handlePlan = () => {
    if (eventType) sessionStorage.setItem("nobu_event_type", eventType);
    sessionStorage.setItem("nobu_event_date", `${season} ${year}`);
    navigate("/plan");
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      {/* Nav */}
      <header className="bg-ink">
        <div
          className="w-full text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase"
          style={{ background: "#A6AF93", color: "#2b2b27" }}
        >
          Meetings &amp; Events · Nobu Hotels
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/book" className="flex h-[34px] items-center" aria-label="Nobu Hotel Los Cabos">
            <img src={LOGO} alt="Nobu Hotel Los Cabos" className="h-[28px] w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/plan")}
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full border border-paper/40 px-4 text-[11px] uppercase tracking-[0.22em] text-paper font-sans hover:bg-paper/10 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
              Speak to an Event Specialist
            </button>
            <Link
              to="/book"
              className="inline-flex h-9 items-center gap-1.5 px-3 text-[11px] uppercase tracking-[0.22em] text-paper/80 font-sans hover:text-copper-soft transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-end overflow-hidden py-10 md:justify-center md:py-24"
        style={{ minHeight: 580 }}
      >
        <div className="absolute inset-0">
          <img
            src="/assets/hero-celebration.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />
        </div>

        <div className="relative flex w-full flex-col items-center gap-10 px-4 md:max-w-3xl">
          <div className="font-title text-center text-paper text-5xl leading-[52px] md:text-7xl md:leading-[80px]">
            <p>An event</p>
            <p className="italic">your whole team</p>
            <p>won&apos;t forget</p>
          </div>

          <div
            className="flex w-full max-w-[342px] flex-col items-start justify-end gap-6 rounded-xl border p-6 md:max-w-lg md:p-8"
            style={{
              borderColor: "rgba(218, 214, 206, 0.5)",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex w-full flex-col gap-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper">
                We&apos;re hosting a…
              </p>
              <EventTypePicker value={eventType} onChange={setEventType} />
            </div>

            <div className="flex w-full flex-col gap-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper">…around</p>
              <DatePicker season={season} year={year} onSeason={setSeason} onYear={setYear} />
            </div>

            {trustVisible && (
              <div className="flex w-full items-center gap-2 rounded-full bg-paper/15 px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-paper" strokeWidth={1.6} />
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-paper">
                  38 corporate programs booked this month
                </p>
              </div>
            )}

            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handlePlan}
                disabled={!eventType}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-copper px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-copper-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Plan my event <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/plan")}
                className="font-sans text-xs uppercase tracking-[0.2em] text-paper underline underline-offset-4 hover:text-paper/85 transition-colors"
              >
                Speak to an event specialist
              </button>
            </div>
          </div>
        </div>
      </section>

      <EventTypesCarousel />

      <HowItWorks onSpecialist={() => navigate("/plan")} />

      {/* Bottom CTA band */}
      <section className="border-t border-border-default bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="flex flex-col gap-2 md:max-w-xl">
            <p className="eyebrow">From first inquiry to final toast</p>
            <h3 className="font-title text-2xl text-ink md:text-3xl">
              Let&apos;s start. Tell Allie the dates, the headcount, the objective.
            </h3>
            <p className="font-sans text-sm text-ink-soft">
              One conversation, one estimate, one refundable hold — and you can loop in a
              real event specialist any time.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <button
              type="button"
              onClick={handlePlan}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-soft"
            >
              Plan my event <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/book"
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/30 bg-transparent px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink hover:bg-cream transition-colors"
            >
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanEvent;
