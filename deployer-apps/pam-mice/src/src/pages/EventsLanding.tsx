import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  User as UserIcon,
  Phone,
  ArrowDown,
  ArrowRight,
  Gem,
  Presentation,
  Award,
  Users,
  Check,
  Quote,
  Calendar,
  Wallet,
  Sparkles,
  ConciergeBell,
  X,
  CalendarCheck,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * Meetings & Events (MICE) marketing landing for Nobu Los Cabos.
 *
 * Adapted from the PAM Social Events landing and re-customized for the
 * corporate audience: meetings, incentives, conferences, exhibitions,
 * retreats, offsites, SKOs and signature corporate events. Every primary
 * CTA hands off to `/plan` the Allie concierge which captures the
 * brief, builds an estimate, and ends in a refundable date hold.
 */

const RIBBON = "Meetings & Events · Nobu Hotels";
const LOGO = "/assets/logo-nobu-white.png";

const copperBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-copper px-7 text-xs uppercase tracking-[0.2em] text-paper font-sans font-semibold hover:bg-copper-hover transition-colors";
const ghostBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-paper/45 px-7 text-xs uppercase tracking-[0.22em] text-paper font-sans font-semibold hover:bg-paper/10 transition-colors";

/* ─────────────────────────────── Ribbon ─────────────────────────── */
const Ribbon = () => (
  <div
    className="w-full text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase"
    style={{ background: "#A6AF93", color: "#2b2b27" }}
  >
    {RIBBON}
  </div>
);

/* ──────────────────────────────── Nav ───────────────────────────── */
const Nav = ({
  onSpecialist,
  onMenu,
}: {
  onSpecialist: () => void;
  onMenu: () => void;
}) => (
  <header className="absolute top-0 left-0 right-0 z-30 bg-ink">
    <Ribbon />
    <div className="container flex items-center justify-between py-5 md:py-6">
      <Link to="/book" className="flex h-[38px] shrink-0 items-center" aria-label="Nobu Hotel Los Cabos">
        <img src={LOGO} alt="Nobu Hotel Los Cabos" className="h-[28px] md:h-[32px] w-auto object-contain" />
      </Link>

      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={onSpecialist}
          className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full border border-paper/40 px-4 text-[11px] uppercase tracking-[0.22em] text-paper font-sans hover:bg-paper/10 transition-colors"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
          Speak to an Event Specialist
        </button>

        <Link
          to="/login"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-paper text-sm font-sans hover:text-copper-soft transition-colors"
          aria-label="Sign in"
        >
          <UserIcon className="h-5 w-5" strokeWidth={1.5} />
          <span>Sign in</span>
        </Link>

        <button
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center text-paper hover:text-copper-soft transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-7 w-7" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  </header>
);

/* ─────────────────────────────── Hero ───────────────────────────── */
const Hero = ({ onPlan, onSpecialist }: { onPlan: () => void; onSpecialist: () => void }) => (
  <section className="relative min-h-[50svh] flex items-center overflow-hidden">
    <img
      src="/assets/hero-celebration.jpg"
      alt="Delegates at a candlelit Nobu terrace reception at golden hour"
      width={1920}
      height={1080}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

    <div className="container relative z-10 pt-28 pb-16 text-paper">
      <div className="max-w-2xl">
        <p className="eyebrow text-copper-soft">Meetings · Incentives · Conferences · Events</p>

        <h1 className="font-title text-5xl md:text-7xl leading-[1.04] mt-7 tracking-tight lg:whitespace-nowrap">
          Where business becomes<br />
          <em className="italic text-copper-soft">something memorable</em><br />
          at Nobu.
        </h1>

        <p className="mt-8 max-w-lg font-sans text-base md:text-lg text-paper/85 leading-relaxed">
          From leadership offsites and sales kickoffs to incentive trips, conferences,
          and product launches &mdash; our events team curates every detail: oceanfront
          venues, signature cuisine, and seamless production, all in one place.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button onClick={onPlan} className={copperBtn + " w-full sm:w-auto"}>
            <Gem className="h-4 w-4" />
            Start Planning My Event
          </button>
          <button onClick={onSpecialist} className={ghostBtn + " w-full sm:w-auto"}>
            Speak to an Event Specialist
          </button>
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-paper/65 font-sans">
          About 4 minutes · refundable date hold · no commitment
        </p>
      </div>
    </div>

    <div className="absolute bottom-8 left-0 right-0 z-10">
      <div className="container flex items-end justify-between text-paper/70 text-[11px] tracking-[0.3em] uppercase font-sans">
        <span className="inline-flex items-center gap-2">
          <ArrowDown className="h-3.5 w-3.5" /> Scroll to discover
        </span>
        <span className="hidden md:inline">Powered by Allie · AI MICE Planner</span>
      </div>
    </div>
  </section>
);

/* ───────────────────────────── EventTypes ───────────────────────── */
const featured = [
  {
    name: "Meetings & Conferences",
    Icon: Presentation,
    desc: "Boardrooms to general sessions flexible spaces, full AV and production, and breakouts that keep every track on time.",
    img: "/assets/venue-ballroom.jpg",
  },
  {
    name: "Incentive Trips",
    Icon: Award,
    desc: "Reward top performers with oceanfront dinners, curated excursions, and once-in-a-career moments they will talk about for years.",
    img: "/assets/ava-resort.png",
  },
  {
    name: "Corporate Retreats & Offsites",
    Icon: Users,
    desc: "Leadership offsites, SKOs, and team builds private venues, tailored agendas, and space to think, align, and connect.",
    img: "/assets/venue-yakusoku-garden.png",
  },
];

const moreFormats = [
  "All-Hands & Town Halls",
  "Sales Kickoffs (SKOs)",
  "Product Launches",
  "Board & Executive Meetings",
  "Team Offsites",
  "Awards & Galas",
  "Training Academies",
  "Trade Shows & Exhibitions",
  "Hybrid Events",
  "Holiday Parties",
];

const EventTypes = () => (
  <section id="events" className="py-24 md:py-32 bg-white">
    <div className="container">
      <div className="max-w-3xl">
        <p className="eyebrow">Every Format, Curated</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          An event for every business objective.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-xl leading-relaxed">
          Whatever you are hosting, our specialists design programs that move your
          business forward &mdash; rooted in Nobu&rsquo;s signature warmth, precision,
          and quiet luxury.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {featured.map((t) => (
          <article key={t.name} className="group flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-cream rounded-md">
              <img
                src={t.img}
                alt={t.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-6 flex items-start gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-copper">
                <t.Icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-title text-2xl text-ink leading-tight">{t.name}</h3>
                <p className="mt-2 font-sans text-sm text-ink-soft leading-relaxed">{t.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 border-t border-border-subtle pt-10">
        <p className="eyebrow mb-6">Also hosted at Nobu</p>
        <ul className="flex flex-wrap gap-2.5">
          {moreFormats.map((m) => (
            <li
              key={m}
              className="rounded-full border border-border-default bg-paper px-4 py-2 font-sans text-sm text-ink hover:border-copper hover:text-copper transition-colors cursor-default"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────── Venues ─────────────────────────── */
const venues = [
  {
    name: "The Omakase Room",
    type: "Private Dining & Board Dinners",
    img: "/assets/venue-private-dining.jpg",
    capacity: "Up to 24 seated",
    desc: "An intimate timber-lined room with a dedicated chef ideal for executive dinners and board sessions.",
  },
  {
    name: "Sky Terrace",
    type: "Rooftop Reception",
    img: "/assets/venue-rooftop.jpg",
    capacity: "Up to 120 standing",
    desc: "Sunset views and a signature cocktail bar the welcome reception your delegates will remember.",
  },
  {
    name: "Pool Garden",
    type: "Poolside Networking",
    img: "/assets/venue-poolside.jpg",
    capacity: "Up to 180 standing",
    desc: "An infinity edge framed by palms and lanterns built for networking evenings and incentive celebrations.",
  },
  {
    name: "The Grand Ballroom",
    type: "General Sessions & Galas",
    img: "/assets/venue-ballroom.jpg",
    capacity: "Up to 300 seated",
    desc: "A column-free ballroom with staging, full AV, and a dedicated catering kitchen for plenaries and awards nights.",
  },
];

const Venues = () => (
  <section id="venues" className="py-24 md:py-32 bg-ink text-paper">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-soft">Signature Venues</p>
          <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-paper">
            Spaces that mean business.
          </h2>
        </div>
        <p className="font-sans text-paper/75 max-w-md leading-relaxed">
          From intimate board dinners to oceanview general sessions, every Nobu venue
          is engineered for flawless production &mdash; and unmistakable hospitality.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {venues.map((v) => (
          <article
            key={v.name}
            className="group flex flex-col overflow-hidden rounded-xl bg-white/[0.03] transition hover:bg-white/[0.06]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-ink">
              <img
                src={v.img}
                alt={`${v.name} ${v.type}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="eyebrow text-[10px] text-copper-soft">{v.type}</p>
              <h3 className="font-title text-xl mt-1.5 text-paper leading-tight">{v.name}</h3>
              <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-paper/20 bg-white/5 px-2.5 py-1 text-[11px] font-sans text-paper">
                <Users className="h-3 w-3 text-copper-soft" />
                {v.capacity}
              </div>
              <p className="mt-2.5 line-clamp-3 font-sans text-[13px] text-paper/70 leading-relaxed">{v.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────── Stays ──────────────────────────── */
const perks = [
  "Room blocks for groups of 10+",
  "Complimentary upgrade for your VIPs & speakers",
  "Flexible check-in & late checkout for delegates",
  "Branded welcome amenity in every room",
  "Dedicated group concierge & rooming-list support",
  "Private transfers & VIP arrivals",
];

const stayTypes = [
  { label: "Executive Suites", desc: "Oceanview suites with private terraces the standard for leadership and speakers." },
  { label: "Garden Rooms", desc: "Quiet courtyard rooms ideal for delegates and extended-stay teams." },
  { label: "Full-floor Takeovers", desc: "Lock a floor for your group, set the welcome amenities, and host on your terms." },
];

const Stays = () => (
  <section id="stays" className="py-24 md:py-32 bg-white">
    <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="order-2 lg:order-1">
        <p className="eyebrow">Stay &amp; Convene</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          Bring the whole team.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-lg leading-relaxed">
          From signature suites for executives to full-floor takeovers for the group,
          we host your delegates with the same precision we bring to your program.
          Group rates, room blocks, and VIP accommodations for every attendee.
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-3 font-sans text-sm text-ink">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-copper text-paper">
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid sm:grid-cols-3 gap-3">
          {stayTypes.map((s) => (
            <div key={s.label} className="rounded-md border border-border-subtle bg-cream-soft p-4">
              <p className="font-sans font-semibold text-sm text-ink">{s.label}</p>
              <p className="mt-1 font-sans text-xs text-ink-soft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden bg-cream rounded-md">
        <img
          src="/assets/stay-suite.jpg"
          alt="Ocean-view Nobu signature suite"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </section>
);

/* ─────────────────────────────── Dining ─────────────────────────── */
const offerings = [
  { title: "Conference Catering", desc: "Plated lunches, buffets, and working sessions timed to your agenda no track ever runs late." },
  { title: "Coffee & Energy Breaks", desc: "Barista carts, matcha bars, and crispy-rice bites to keep the room sharp between sessions." },
  { title: "Gala & Awards Dinners", desc: "Multi-course plated service with staging, AV, and signature Nobu showpieces." },
  { title: "Cocktail Receptions", desc: "Welcome receptions and networking hours with bespoke pours and passed canapés." },
  { title: "Private Board Dinners", desc: "An intimate chef&rsquo;s-table experience for executives and key clients." },
  { title: "Custom Catering", desc: "Family-style, passed, or stationed built for your headcount and tempo." },
];

const Dining = () => (
  <section id="dining" className="py-24 md:py-32 bg-ink text-paper">
    <div className="container grid lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="aspect-[4/5] overflow-hidden rounded-md">
          <img
            src="/assets/fb-omakase.jpg"
            alt="Plated Nobu omakase courses on dark ceramic"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="lg:col-span-7 flex flex-col justify-center">
        <p className="eyebrow text-copper-soft">The Nobu Kitchen</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight">
          Food &amp; beverage,<br />
          <em className="italic text-copper-soft">the Nobu way.</em>
        </h2>
        <p className="mt-5 font-sans text-paper/75 max-w-lg leading-relaxed">
          Our chefs design menus that fuel the agenda energizing breaks, working
          lunches, and gala dinners that close the program in style. Every package
          adapts to dietary, cultural, and schedule needs.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8">
          {offerings.map((o) => (
            <div key={o.title}>
              <div className="h-px w-12 bg-copper mb-4" />
              <h3 className="font-title text-xl" dangerouslySetInnerHTML={{ __html: o.title }} />
              <p
                className="mt-2 font-sans text-sm text-paper/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: o.desc }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ───────────────────────── Allie concierge band ─────────────────── */
const benefits = [
  { Icon: Sparkles, title: "An event that fits", body: "Your headcount, format, and dates in. Nobu venues that fit and what is actually open." },
  { Icon: Wallet, title: "Live estimate calculator", body: "Move attendees, menu, or dates and your all-in number updates right away." },
  { Icon: Calendar, title: "Refundable date hold", body: "Lock your shortlist with a fully-refundable deposit while we finalize the program." },
  { Icon: ConciergeBell, title: "Your specialist, already briefed", body: "When Nobu calls, they already know your event, headcount, and objectives." },
  { Icon: Users, title: "Room blocks in one tap", body: "Travelling delegates? Allie queues group rates and a curated welcome amenity per room." },
  { Icon: Gem, title: "The Nobu kitchen, on the agenda", body: "Black cod, omakase, signature breaks built into every proposal Allie ships." },
];

const AllieConcierge = ({ onPlan }: { onPlan: () => void }) => (
  <section className="bg-ink text-paper py-16 md:py-20">
    <div className="container">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-copper">
            <Gem className="h-3 w-3 text-paper" />
          </span>
          <p className="text-[11px] uppercase font-semibold tracking-[0.28em] text-copper-soft font-sans">
            Powered by Allie · AI MICE Planner
          </p>
        </div>

        <h2 className="mt-4 font-title text-3xl md:text-4xl leading-tight">
          The all-in-one planning suite for your next{" "}
          <em className="italic text-copper-soft">corporate event</em> at Nobu.
        </h2>

        <p className="mt-3 max-w-2xl font-sans text-sm md:text-base text-paper/75 leading-relaxed">
          You know the outcome you need not which space, dates, or budget. Allie
          shapes the brief with you in about four minutes, then hands a fully-briefed
          events specialist the keys.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {benefits.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-lg border border-paper/10 bg-paper/[0.04] p-4 transition-colors hover:border-copper/40"
          >
            <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-copper/15 text-copper-soft border border-copper/40">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h3 className="font-title italic text-lg leading-snug text-paper">{title}</h3>
              <p className="mt-0.5 font-sans text-[13px] text-paper/70 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <p className="font-title italic text-lg leading-snug">Ready when you are.</p>
          <p className="mt-0.5 font-sans text-[13px] text-paper/70 leading-relaxed">
            About 4 minutes. Refundable date hold at the end. No commitment.
          </p>
        </div>
        <button onClick={onPlan} className={copperBtn + " w-full md:w-auto"}>
          Start Planning My Event
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
);

/* ────────────────────────────── Testimonials ────────────────────── */
const quotes = [
  {
    quote: "Our global sales kickoff ran flawlessly across three days staging, breakouts, and a gala that had 400 people on their feet. The team made it effortless.",
    name: "VP, Global Sales",
    event: "Sales Kickoff · Nobu Los Cabos",
  },
  {
    quote: "We brought our top 80 performers for an incentive trip and every detail felt intentional. It is the benchmark every other property gets measured against now.",
    name: "Director, Events",
    event: "Incentive Program · Nobu Los Cabos",
  },
  {
    quote: "A leadership offsite that actually delivered private venues, a sharp agenda, and space to think. We are already booking next year.",
    name: "Chief of Staff",
    event: "Executive Retreat · Nobu Chicago",
  },
];

const Testimonials = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="container">
      <div className="max-w-2xl">
        <p className="eyebrow">Client Stories</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          Programs worth remembering.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-xl leading-relaxed">
          A few of the corporate events our specialists shaped this year. Yours is
          next and Allie already knows where to start.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {quotes.map((q) => (
          <figure key={q.name} className="flex flex-col rounded-md border border-border-subtle bg-paper p-8 shadow-sm">
            <Quote className="h-7 w-7 text-copper" strokeWidth={1.4} />
            <blockquote className="mt-5 font-title italic text-[22px] leading-snug text-ink flex-1">
              {q.quote}
            </blockquote>
            <figcaption className="mt-6 pt-6 border-t border-border-subtle">
              <div className="font-sans font-semibold text-sm text-ink">{q.name}</div>
              <div className="font-sans text-xs text-ink-muted mt-1 tracking-wide uppercase">{q.event}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

/* ───────────────────────────── Closing CTA ──────────────────────── */
const ClosingCTA = ({ onPlan, onSpecialist }: { onPlan: () => void; onSpecialist: () => void }) => (
  <section className="py-24 md:py-32 bg-ink text-paper">
    <div className="container text-center max-w-3xl">
      <p className="eyebrow text-copper-soft">Ready when you are</p>
      <h2 className="font-title text-5xl md:text-6xl mt-6 leading-[1.05] tracking-tight">
        Let&rsquo;s plan something<br />
        <em className="italic text-copper-soft">unforgettable</em>.
      </h2>
      <p className="mt-6 font-sans text-paper/75 max-w-xl mx-auto leading-relaxed">
        Tell us about your event. About 4 minutes with Allie refundable date hold at
        the end. No commitment until you say so.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
        <button onClick={onPlan} className={copperBtn + " w-full sm:w-auto"}>
          Start Planning My Event
          <ArrowRight className="h-4 w-4" />
        </button>
        <button onClick={onSpecialist} className={ghostBtn + " w-full sm:w-auto"}>
          Speak to an Event Specialist
        </button>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────── Footer ─────────────────────────── */
const Footer = () => (
  <footer className="bg-ink text-paper border-t border-paper/10">
    <div className="container py-14 grid md:grid-cols-12 gap-10">
      <div className="md:col-span-4">
        <img src={LOGO} alt="Nobu Hotel Los Cabos" className="h-[34px] w-auto object-contain" />
        <p className="mt-6 font-sans text-sm text-paper/70 leading-relaxed max-w-sm">
          The Meetings &amp; Events Booking Concierge is the digital arm of the Nobu
          events team designed to capture your brief, build your estimate, and hand
          off to a specialist who already knows your program inside and out.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-paper/80 font-sans">
          Prototype · for design review only
        </div>
      </div>

      <div className="md:col-span-2">
        <p className="text-paper font-sans font-semibold text-sm mb-4">Plan</p>
        <ul className="space-y-2.5 font-sans text-sm text-paper/70">
          <li><a href="#events" className="hover:text-copper-soft transition-colors">Formats</a></li>
          <li><a href="#venues" className="hover:text-copper-soft transition-colors">Venues</a></li>
          <li><a href="#stays" className="hover:text-copper-soft transition-colors">Stays</a></li>
          <li><a href="#dining" className="hover:text-copper-soft transition-colors">Dining</a></li>
        </ul>
      </div>

      <div className="md:col-span-3">
        <p className="text-paper font-sans font-semibold text-sm mb-4">Connect</p>
        <ul className="space-y-3 font-sans text-sm text-paper/70">
          <li className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <a href="mailto:events.loscabos@nobuhotels.com" className="hover:text-copper-soft transition-colors">
              events.loscabos@nobuhotels.com
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <Phone className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <a href="tel:+18006628338" className="hover:text-copper-soft transition-colors">+1 (800) NOBU-EVT</a>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <span>
              Carretera Transpeninsular Km 5.5<br />
              Cabo San Lucas, B.C.S.
            </span>
          </li>
        </ul>
      </div>

      <div className="md:col-span-3">
        <p className="text-paper font-sans font-semibold text-sm mb-4">For partners</p>
        <ul className="space-y-2.5 font-sans text-sm text-paper/70">
          <li><Link to="/inbox" className="hover:text-copper-soft transition-colors">PAM sales portal</Link></li>
          <li><Link to="/login" className="hover:text-copper-soft transition-colors">Sign in</Link></li>
          <li>
            <a href="https://www.nobuhotels.com/los-cabos/" className="hover:text-copper-soft transition-colors" target="_blank" rel="noreferrer">
              nobuhotels.com →
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-paper/10">
      <div className="container py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] tracking-[0.3em] uppercase text-paper/50 font-sans">
        <span>© {new Date().getFullYear()} Nobu Hospitality. All rights reserved.</span>
        <span>Powered by Allie · AI MICE Planner</span>
      </div>
    </div>
  </footer>
);

/* ───────────────────────────── SpecialistSheet ──────────────────── */
const SpecialistSheet = ({
  open,
  onClose,
  onChat,
}: {
  open: boolean;
  onClose: () => void;
  onChat: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const options = [
    {
      key: "chat",
      Icon: Gem,
      title: "Chat with Allie",
      sub: "Always on · instant answers from your AI planner",
      action: () => {
        onClose();
        onChat();
      },
    },
    { key: "schedule", Icon: CalendarCheck, title: "Book a consultation", sub: "Schedule a 30-minute call with a Nobu events specialist" },
    { key: "whatsapp", Icon: MessageCircle, title: "WhatsApp the events desk", sub: "Message us anytime · response in under an hour" },
    { key: "phone", Icon: Phone, title: "Call the events line", sub: "+1 (800) NOBU-EVT · Mon–Sun, 8am – 10pm CST" },
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-canvas border-l border-border-default p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-7 pt-9 pb-6 border-b border-border-subtle text-left">
            <p className="eyebrow">Connect with Nobu</p>
            <SheetTitle className="mt-3 font-title text-3xl text-ink leading-tight">
              How would you like to start?
            </SheetTitle>
            <SheetDescription className="font-sans text-sm text-ink-soft">
              Allie is always on. Or skip ahead to a human our event specialists
              respond within the hour during operating times.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {options.map(({ key, Icon, title, sub, action }) => {
              const interactive = !!action;
              const Comp = interactive ? "button" : "div";
              return (
                <Comp
                  key={key}
                  onClick={action}
                  className={`group flex w-full items-start gap-4 rounded-lg border border-border-subtle bg-paper p-5 text-left transition-colors ${
                    interactive ? "hover:border-copper hover:shadow-sm cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      key === "chat" ? "bg-ink text-copper-soft" : "bg-cream text-ink"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="flex-1">
                    <p className="font-sans font-semibold text-base text-ink leading-snug">{title}</p>
                    <p className="mt-1 font-sans text-sm text-ink-soft leading-relaxed">{sub}</p>
                  </div>
                  {interactive ? (
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-copper" />
                  ) : null}
                </Comp>
              );
            })}
          </div>

          <div className="border-t border-border-subtle bg-cream-soft px-7 py-5 text-[11px] uppercase tracking-[0.3em] text-ink-muted font-sans text-center">
            Nobu Hotel · Los Cabos · Events Desk
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ───────────────────────────── MenuOverlay ──────────────────────── */
const menuSections = [
  { label: "Formats", href: "#events" },
  { label: "Venues", href: "#venues" },
  { label: "Stays", href: "#stays" },
  { label: "Dining", href: "#dining" },
];

const MenuOverlay = ({
  open,
  onClose,
  onPlan,
  onSpecialist,
}: {
  open: boolean;
  onClose: () => void;
  onPlan: () => void;
  onSpecialist: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex flex-col bg-canvas text-ink animate-in fade-in">
      <Ribbon />
      <div className="bg-ink">
        <div className="container flex items-center justify-between py-5">
          <Link to="/book" onClick={onClose} className="flex h-[32px] items-center" aria-label="Nobu Hotel Los Cabos">
            <img src={LOGO} alt="Nobu Hotel Los Cabos" className="h-[26px] md:h-[30px] w-auto object-contain" />
          </Link>
          <button onClick={onClose} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center text-paper hover:text-copper-soft transition-colors">
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container py-12 md:py-16 grid lg:grid-cols-12 gap-10">
          <nav className="lg:col-span-7">
            <p className="eyebrow">Explore the experience</p>
            <ul className="mt-6 divide-y divide-border-subtle">
              {menuSections.map((s) => (
                <li key={s.label}>
                  <a href={s.href} onClick={onClose} className="group flex items-center justify-between py-5 md:py-6">
                    <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">{s.label}</span>
                    <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                  </a>
                </li>
              ))}
              <li>
                <Link to="/inbox" onClick={onClose} className="group flex items-center justify-between py-5 md:py-6">
                  <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">For partners</span>
                  <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={onClose} className="group flex items-center justify-between py-5 md:py-6">
                  <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">Sign in</span>
                  <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                </Link>
              </li>
            </ul>
          </nav>

          <aside className="lg:col-span-5 flex flex-col gap-6 lg:pl-8 lg:border-l lg:border-border-subtle">
            <div className="rounded-lg border border-border-subtle bg-paper p-7 shadow-sm">
              <p className="eyebrow">Ready to start</p>
              <h3 className="mt-3 font-title text-3xl text-ink leading-tight">Shape your event with Allie.</h3>
              <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
                About 4 minutes. Refundable date hold at the end. No commitment.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlan();
                }}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-copper px-6 text-xs uppercase tracking-[0.22em] text-paper font-sans font-semibold hover:bg-copper-hover transition-colors"
              >
                Start Planning My Event
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-dashed border-border-default bg-cream-soft p-7">
              <p className="eyebrow">Prefer to speak with us</p>
              <h3 className="mt-3 font-title text-2xl text-ink leading-tight">Connect with an event specialist.</h3>
              <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
                Chat, schedule a call, or reach the events line we&rsquo;ll route you
                to a specialist who knows your property.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onSpecialist();
                }}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink px-6 text-xs uppercase tracking-[0.22em] text-ink font-sans font-semibold hover:bg-cream transition-colors"
              >
                See ways to connect
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-ink text-paper">
        <div className="container py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.3em] font-sans">
          <span>Nobu Hotel · Los Cabos</span>
          <span className="opacity-70">© {new Date().getFullYear()} Nobu Hospitality · Prototype</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── Page ───────────────────────────── */
const EventsLanding = () => {
  const navigate = useNavigate();
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openPlanner = () => navigate("/plan-event");
  const openSpecialist = () => setSpecialistOpen(true);

  return (
    <div id="top" className="min-h-screen bg-canvas text-ink">
      <Nav onSpecialist={openSpecialist} onMenu={() => setMenuOpen(true)} />

      <main>
        <Hero onPlan={openPlanner} onSpecialist={openSpecialist} />
        <EventTypes />
        <Venues />
        <Stays />
        <Dining />
        <AllieConcierge onPlan={openPlanner} />
        <Testimonials />
        <ClosingCTA onPlan={openPlanner} onSpecialist={openSpecialist} />
      </main>

      <Footer />

      <SpecialistSheet open={specialistOpen} onClose={() => setSpecialistOpen(false)} onChat={() => navigate("/plan")} />
      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPlan={openPlanner}
        onSpecialist={openSpecialist}
      />
    </div>
  );
};

export default EventsLanding;
