import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Monitor,
  Calendar,
  UsersRound,
} from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import heroImg from "@/assets/nobu-corporate-hero.jpg";
import venueTerrace from "@/assets/nobu-venue-terrace.jpg";
import miceMeetings from "@/assets/mice-meetings.jpg";
import miceIncentives from "@/assets/mice-incentives.jpg";
import miceConferences from "@/assets/mice-conferences.jpg";
import miceExhibitions from "@/assets/mice-exhibitions.jpg";
import miceGala from "@/assets/mice-gala.jpg";
import miceWorkshops from "@/assets/mice-workshops.jpg";
import nobuCulinary from "@/assets/nobu-culinary.jpg";

const helpCards = [
  {
    title: "Event strategy & programming",
    body: "Agenda design, speaker flow, and experience pacing — from keynote to unstructured connection time.",
  },
  {
    title: "Hospitality & room blocks",
    body: "Negotiated rates, suite allocations, billing codes, and attrition guidance for corporate travel policies.",
  },
  {
    title: "Culinary & F&B",
    body: "Nobu menus, dietary accommodations, coffee breaks, and themed dinners scaled to your group size.",
  },
  {
    title: "AV & hybrid production",
    body: "In-room AV, streaming for remote leaders, and rehearsal support before doors open.",
  },
  {
    title: "Local experiences",
    body: "Team adventures, CSR activities, and spouse programs coordinated through vetted Cabo partners.",
  },
  {
    title: "On-site execution",
    body: "Nobu events team, security liaisons, and Allie keeping every department on the same run-of-show.",
  },
];

const eventFormats = [
  {
    img: miceMeetings,
    eyebrow: "Meetings",
    title: "Executive Meetings & Board Meetings",
    heading: "Private boardrooms with the Pacific outside the window",
    body: "Confidential settings for board prep, annual planning, and executive alignment — with breakout privacy, Nobu hospitality, and zero resort distractions.",
    meta: "10–40 attendees · 2–4 nights typical",
  },
  {
    img: miceIncentives,
    eyebrow: "Incentives",
    title: "Incentive Trips & President's Club",
    heading: "Reward top performers with a destination they'll never forget",
    body: "Beachfront welcome receptions, curated Cabo experiences, and an awards dinner under the stars — incentive programs designed to lift retention and recruiting.",
    meta: "50–250 attendees · 3–5 nights typical",
  },
  {
    img: miceConferences,
    eyebrow: "Conferences",
    title: "Conferences & Sales Kickoffs",
    heading: "Plenary stages, breakouts, and the polish your field expects",
    body: "Theater-style general sessions, product deep-dives, and broadcast-ready production — across Nobu's flexible ballrooms and oceanfront breakout spaces.",
    meta: "100–450 attendees · 3–4 nights typical",
  },
  {
    img: miceExhibitions,
    eyebrow: "Exhibitions",
    title: "Product Launches & Brand Activations",
    heading: "Show the work — and let the venue do the rest",
    body: "Branded showcases, demo lounges, and media-ready exhibition floors with rigging, power, and lighting handled by Nobu's in-house production team.",
    meta: "80–300 attendees · 2–3 nights typical",
  },
  {
    img: miceGala,
    eyebrow: "Events",
    title: "Galas, Awards & Anniversary Dinners",
    heading: "Black-tie evenings the team will talk about all year",
    body: "Ballroom galas, awards nights, and milestone celebrations — bespoke menus from the Nobu kitchen, signature uplighting, and entertainment programming end-to-end.",
    meta: "120–500 attendees · 1–2 nights typical",
  },
  {
    img: miceWorkshops,
    eyebrow: "Workshops",
    title: "Workshops, Academies & L&D",
    heading: "Focused learning away from the noise of the office",
    body: "Classroom setups, collaboration labs, and reflection time built in — ideal for manager academies, certification weeks, and cross-functional design sprints.",
    meta: "20–120 attendees · 2–5 nights typical",
  },
];

const allieFeatures = [
  {
    icon: Users,
    title: "Attendee & Room Block Hub",
    body: "Import rosters, manage VIP arrivals, track dietary needs, and publish negotiated room rates — no more spreadsheet chaos.",
  },
  {
    icon: CheckCircle2,
    title: "Vendor & Production Tracker",
    body: "AV, DMC, swag, and transportation vendors in one thread — contracts, deposits, and day-of contacts always current.",
  },
  {
    icon: Monitor,
    title: "Attendee Portal",
    body: "A branded microsite with agenda, travel info, packing lists, and shuttle times — updates sync when the run-of-show changes.",
  },
  {
    icon: Calendar,
    title: "Run-of-Show Command Center",
    body: "Minute-by-minute schedule with room assignments, cues, and backup plans — exportable for ops, security, and catering.",
  },
  {
    icon: UsersRound,
    title: "Stakeholder Collaboration",
    body: "Event lead, EAs, People Ops, and Nobu on-property coordinators share one workspace — approvals, notes, and version history included.",
  },
];

const journey = [
  {
    n: "01",
    title: "Define the event",
    body: "Objectives, audience, dates, and budget guardrails. Allie asks the right questions so nothing is missing from the brief.",
  },
  {
    n: "02",
    title: "Match venues & flow",
    body: "See which Nobu spaces fit your format — plenary, breakouts, meals, and evening events — with capacity and AV notes inline.",
  },
  {
    n: "03",
    title: "Build the proposal",
    body: "Room block, F&B, production, and experiences roll into one estimate you can send to leadership for sign-off.",
  },
  {
    n: "04",
    title: "Coordinate attendees",
    body: "Launch the attendee portal, collect travel details, and keep dietary and accessibility requests in one place.",
  },
  {
    n: "05",
    title: "Execute on property",
    body: "Nobu events and Allie share the same run-of-show — last-minute changes propagate to catering, AV, and front desk instantly.",
  },
];

const engagementTiers = [
  {
    eyebrow: "Focused meeting",
    scale: "15–40 rooms · 2–3 nights",
    items: [
      "Dedicated event coordinator and single main meeting space",
      "Daily breakfast and one group dinner at Nobu",
      "Standard AV package and attendee portal",
    ],
  },
  {
    eyebrow: "Department conference",
    scale: "40–100 rooms · 3–4 nights",
    items: [
      "Plenary plus two breakout tracks",
      "Welcome reception and awards or closing gala",
      "Enhanced AV, signage, and shuttle coordination",
      "Allie workspace for up to 5 internal planners",
    ],
  },
  {
    eyebrow: "Company-wide event",
    scale: "100+ rooms · 3–5 nights",
    items: [
      "Multi-venue buyout options and custom staging",
      "Full production support and regional rooming rules",
      "Executive hosting suite and VIP arrival program",
      "Dedicated Nobu on-site command center",
    ],
  },
];

const NobuCorporate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-grey-50 text-grey-900">
      <NobuTopNav activeTab="Overview" />

      {/* HERO */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Nobu Los Cabos meetings and corporate events"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-8 text-grey-50">
            <div className="max-w-2xl">
              <div className="mb-6 text-[11px] uppercase tracking-[0.4em] text-brand-300">
                Meetings · Incentives · Conferences · Events
              </div>
              <h1 className="font-serif text-6xl font-light italic leading-[1.05] tracking-tight md:text-7xl">
                Nobu Los Cabos
                <br />
                Meetings & Events
              </h1>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-grey-100">
                Host leadership meetings, all-hands, SKOs, and learning programs on the Pacific —
                with Nobu hospitality, flexible meeting spaces, and Allie guiding your team from
                brief to on-site execution.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/plan")}
                  className="rounded-full bg-brand-100 px-7 py-4 text-sm font-medium text-grey-900 transition hover:bg-grey-50"
                >
                  Plan My Event  →
                </button>
                <a
                  href="#event-formats"
                  className="rounded-full border border-grey-50/70 px-7 py-4 text-sm font-medium text-grey-50 transition hover:bg-grey-50/10"
                >
                  Explore event formats
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="bg-brand-100">
        <div className="mx-auto max-w-[1400px] px-8 py-24">
          <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-500">
            How we help
          </div>
          <h2 className="max-w-3xl font-serif text-4xl font-light italic tracking-tight text-grey-900 md:text-5xl">
            One property. Every format your company needs.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700">
            Whether you are aligning executives, energizing the field, or running a multi-day
            academy, Nobu Los Cabos pairs oceanfront venues with a dedicated events team and Allie
            — your AI MICE planner — so logistics never slow down the work you came to do.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {helpCards.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl bg-grey-50/70 p-7"
              >
                <div className="text-lg font-semibold text-grey-900">{c.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-grey-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RETREAT TYPES */}
      <section id="event-formats" className="bg-brand-100">
        <div className="mx-auto max-w-[1400px] px-8 pb-24">
          <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-500">
            Event formats
          </div>
          <h2 className="max-w-3xl font-serif text-4xl font-light italic tracking-tight text-grey-900 md:text-5xl">
            Built for how your team gathers
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700">
            Meetings, incentives, conferences, exhibitions and signature events — every MICE format
            supported by Nobu's venues, culinary team, and on-property production.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventFormats.map((r) => (
              <article
                key={r.title}
                className="overflow-hidden rounded-2xl bg-grey-50"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-brand-300">
                      {r.eyebrow}
                    </div>
                    <h3 className="mt-1 font-serif text-xl font-light italic leading-tight text-grey-50">
                      {r.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-sm font-semibold text-brand-500">{r.heading}</div>
                  <p className="mt-2 text-sm leading-relaxed text-grey-600">{r.body}</p>
                  <div className="mt-3 text-xs text-grey-500">{r.meta}</div>
                  <button className="mt-4 text-sm font-medium text-grey-900 hover:text-brand-500">
                    Learn more  →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CULINARY — Nobu F&B for groups (expanded) */}
      <section className="bg-brand-100">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[560px]">
            <img
              src={nobuCulinary}
              alt="Nobu chef plating sashimi at oceanfront counter"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-20 md:px-16">
            <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-500">
              Culinary
            </div>
            <h2 className="font-serif text-4xl font-light italic leading-tight tracking-tight text-grey-900 md:text-5xl">
              Nobu F&amp;B, built around your agenda.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-grey-700">
              Our culinary team partners with you from the first brief — pacing menus to your
              run-of-show, scaling Nobu signatures to any group size, and weaving in Baja's
              local catch, farms, and mezcal producers. Every cover is hand-plated by the same
              brigade that runs the restaurant.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Working sessions",
                  body: "All-day coffee, cold-press juices, bento-style power lunches, and energy-friendly breaks timed to your agenda.",
                },
                {
                  title: "Signature dinners",
                  body: "Omakase counters, long-table Nobu classics, and chef-led tasting menus — black cod miso, yellowtail jalapeño, wagyu tobanyaki.",
                },
                {
                  title: "Receptions & activations",
                  body: "Sushi stations, robata grills, mezcal & sake pairings, and Cabo street-food moments for welcome nights and brand activations.",
                },
                {
                  title: "Every diet, no compromise",
                  body: "Vegan, gluten-free, kosher, halal, and allergy-aware menus crafted at the same standard — no separate, lesser plate.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-xl bg-grey-50 p-5">
                  <div className="text-sm font-semibold text-grey-900">{c.title}</div>
                  <p className="mt-2 text-xs leading-relaxed text-grey-600">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-grey-600">
              <span>· Chef Nobu signature dishes</span>
              <span>· Local Baja sourcing</span>
              <span>· Mezcal & sake program</span>
              <span>· 20 to 500 covers</span>
            </div>

            <button
              onClick={() => navigate("/inbox")}
              className="mt-10 inline-flex w-fit items-center rounded-full bg-grey-900 px-7 py-4 text-sm font-medium text-grey-50 transition hover:bg-grey-700"
            >
              Request F&amp;B scope  →
            </button>
          </div>
        </div>
      </section>

      {/* MEET ALLIE — split */}
      <section className="bg-grey-100">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[520px]">
            <img
              src={venueTerrace}
              alt="Nobu Los Cabos open-air venue"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full bg-grey-50/85 px-4 py-2 backdrop-blur">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-900 text-[11px] font-medium text-grey-50">N</div>
              <div>
                <div className="text-sm font-medium text-grey-900">Allie</div>
                <div className="text-[11px] text-grey-500">AI · Meetings & Events</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center px-8 py-20 md:px-16">
            <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-500">
              Meet Allie
            </div>
            <h2 className="font-serif text-4xl font-light italic leading-tight tracking-tight text-grey-900 md:text-5xl">
              Your AI planner for corporate meetings, incentives, conferences & events.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-grey-700">
              Allie works with Nobu's meetings & events team, your EAs and People Ops, and travel
              partners — so room blocks, meeting-space holds, AV specs, and F&B minimums stay
              aligned from RFP through on-site execution.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { eyebrow: "On-property", title: "Nobu Events Team", body: "Receives your brief ready-to-execute — venues, catering, and ops already scoped." },
                { eyebrow: "Your org", title: "EAs & People Ops", body: "One dashboard for approvals, attendee lists, and travel policy compliance." },
                { eyebrow: "For leaders", title: "Clear decisions faster", body: "Proposals and budgets leadership can sign off on without back-and-forth email chains." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl bg-grey-50 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brand-500">
                    {c.eyebrow}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-grey-900">{c.title}</div>
                  <p className="mt-2 text-xs leading-relaxed text-grey-600">{c.body}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/plan")}
              className="mt-10 inline-flex w-fit items-center rounded-full bg-grey-900 px-7 py-4 text-sm font-medium text-grey-50 transition hover:bg-grey-700"
            >
              Plan My Event  →
            </button>
          </div>
        </div>
      </section>

      {/* POWERED BY ALLIE — dark planning suite */}
      <section className="bg-grey-900 text-grey-50">
        <div className="mx-auto max-w-[1400px] px-8 py-24">
          <div className="mb-5 text-[11px] uppercase tracking-[0.4em] text-brand-300">
            Powered by Allie · AI MICE Planner
          </div>
          <h2 className="font-serif text-4xl font-light italic leading-tight tracking-tight md:text-5xl">
            All-in-one planning suite
            <br />
            for your MICE program at Nobu.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-400">
            Everything your event lead, EAs, and on-property team need — one login. From briefing
            to vendor contracts to the day-of run-of-show. No spreadsheets. No lost threads. Just a
            clear path from idea to on-site.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allieFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-grey-800 bg-grey-900 p-7"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-grey-800 text-brand-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-2xl font-light italic text-grey-50">
                    {f.title}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-grey-400">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NAVIGATE YOUR RETREAT */}
      {/* THE RESORT */}
      <section className="bg-grey-50">
        <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Nobu Los Cabos resort exterior"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="mx-auto max-w-[1400px] px-8 py-20">
          <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-500">
            The resort
          </div>
          <h2 className="font-serif text-4xl font-light italic leading-[1.05] tracking-tight text-grey-900 md:text-5xl">
            Meet here.
            <br />
            Stay here.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700">
            Over 200 rooms, suites, and residences — most with ocean views — give your attendees a
            private base between sessions. Cabo's energy is steps away when you want it; the
            property is calm when you need focus.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      {/* FINAL CTA — Your event starts here */}
      <section className="bg-grey-900 text-grey-50">
        <div className="mx-auto max-w-[1400px] px-8 py-28 text-center">
          <div className="mb-6 text-[11px] uppercase tracking-[0.4em] text-brand-300">
            Your event starts here
          </div>
          <h2 className="mx-auto max-w-4xl font-serif text-5xl font-light italic leading-[1.05] tracking-tight md:text-6xl">
            Scope your meeting in the next few minutes.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-grey-400">
            Allie will capture your objectives, match venues, and draft a proposal your leadership
            team can review — before you ever hop on a call with the events team.
          </p>
          <button
            onClick={() => navigate("/plan")}
            className="mt-12 inline-flex items-center rounded-full bg-brand-100 px-8 py-4 text-sm font-medium text-grey-900 transition hover:bg-grey-50"
          >
            Plan My Event  →
          </button>
        </div>
      </section>

      <footer className="bg-grey-900 text-grey-300">
        <div className="mx-auto grid max-w-[1400px] gap-10 border-t border-grey-800 px-8 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-serif text-base tracking-[0.25em] text-grey-50">NOBU HOTEL</div>
            <div className="text-[10px] tracking-[0.3em] text-grey-500">LOS CABOS</div>
            <div className="mt-5 text-sm leading-relaxed text-grey-400">
              Nobu Hotel Los Cabos
              <br />
              Carretera Transpeninsular Km 5.5, Cabo San Lucas, B.C.S.
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-grey-50">Plan</div>
            <ul className="mt-4 space-y-3 text-sm text-grey-400">
              <li>Start with Allie</li>
              <li>Event formats</li>
              <li>Events team</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-grey-50">Visit</div>
            <ul className="mt-4 space-y-3 text-sm text-grey-400">
              <li>Planner sign-in</li>
              <li>nobuhotels.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-grey-800">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-8 py-5 text-[11px] text-grey-500 md:flex-row md:items-center">
            <div>© 2026 Nobu Hospitality. Prototype · for design review only.</div>
            <div>Built with Allie · AI MICE Planner</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NobuCorporate;