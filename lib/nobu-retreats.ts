export type RetreatSlug =
  | 'leadership'
  | 'all-hands'
  | 'sko'
  | 'learning'
  | 'team'

export type IconKey =
  | 'briefing'
  | 'proposal'
  | 'attendees'
  | 'vendors'
  | 'portal'
  | 'itinerary'
  | 'collab'

export interface RetreatType {
  slug: RetreatSlug
  name: string
  tagline: string
  description: string
  idealFor: string
  groupSize: string
  duration: string
  highlights: string[]
  spaces: string[]
  howWeHelp: string[]
  image?: string
}

export const RETREAT_TYPES: RetreatType[] = [
  {
    slug: 'leadership',
    name: 'Leadership & Executive Retreats',
    tagline: 'Strategy off-sites for C-suite and senior teams',
    description:
      'Confidential settings for board prep, annual planning, and executive alignment — with breakout privacy, Nobu hospitality, and zero resort distractions.',
    idealFor: 'C-suite, VPs, and leadership teams (12–40 attendees)',
    groupSize: '12–40 attendees',
    duration: '2–4 nights typical',
    highlights: [
      'Private salon and terrace buyouts for closed sessions',
      'Executive dining with Nobu chefs — dietary and NDA-friendly service',
      'Wellness blocks between strategy blocks (spa, beach, recovery)',
    ],
    spaces: ['Executive Boardroom', 'Shiawase Terrace', 'Private Nobu dining salon'],
    howWeHelp: [
      'Pre-read agendas and secure AV for hybrid board members',
      'Rooming by reporting line with VIP arrival coordination',
      'Evening programming that encourages candid conversation',
    ],
    image: '/assets/hero-bg.png',
  },
  {
    slug: 'all-hands',
    name: 'All-Hands & Company Offsites',
    tagline: 'Bring the whole company together in one place',
    description:
      'Main-stage moments, department breakouts, and celebration dinners — scaled across Nobu’s indoor and oceanfront venues with room blocks for every traveler.',
    idealFor: 'Company-wide or divisional gatherings (80–450 attendees)',
    groupSize: '80–450 attendees',
    duration: '3–5 nights typical',
    highlights: [
      'Main plenary with broadcast-ready AV and overflow lounges',
      'Department tracks in parallel breakout rooms',
      'Founder keynotes followed by team celebrations on the terrace',
    ],
    spaces: ['Shiawase Terrace', 'Ballroom', 'Yakusoku Garden', 'Beach lawn'],
    howWeHelp: [
      'Travel manifests, room blocks, and shuttle timing in one portal',
      'Run-of-show that balances plenary, meals, and free time',
      'Brand-forward stage design and signage across the property',
    ],
    image: '/assets/promo-nobu-cabos.png',
  },
  {
    slug: 'sko',
    name: 'Sales Kickoffs (SKO)',
    tagline: 'Energize the field and lock in the year’s number',
    description:
      'High-energy general sessions, product deep-dives, and awards nights — with the production polish your reps expect and the resort experience they’ll talk about all year.',
    idealFor: 'Revenue, GTM, and customer-facing teams (100–350 attendees)',
    groupSize: '100–350 attendees',
    duration: '3–4 nights typical',
    highlights: [
      'Main stage with lighting, LED, and reveal-ready AV',
      'Breakout tracks by segment, region, or product line',
      'Awards gala and after-party venues steps from guest rooms',
    ],
    spaces: ['Main ballroom', 'Breakout suites', 'Terrace reception', 'Nobu private dining'],
    howWeHelp: [
      'Session grid aligned to SKO playbook (keynotes → breakouts → certs)',
      'Vendor coordination for swag, staging, and photo moments',
      'Rooming lists by region with comp-night rules applied automatically',
    ],
    image: '/assets/wedding-matt-carlos.png',
  },
  {
    slug: 'learning',
    name: 'Corporate Learning & L&D',
    tagline: 'Workshops and academies away from the office',
    description:
      'Instructor-led programs, certification weeks, and manager academies — with classroom-style setups, collaborative labs, and reflection time built into the schedule.',
    idealFor: 'L&D, People Ops, and enablement teams (30–120 attendees)',
    groupSize: '30–120 attendees',
    duration: '2–5 nights typical',
    highlights: [
      'Flexible classroom and U-shape configurations',
      'Hands-on lab sessions with supplies and breakout support',
      'Quiet zones for assessments and 1:1 coaching',
    ],
    spaces: ['Learning studios', 'Breakout pods', 'Garden courtyard', 'Library lounge'],
    howWeHelp: [
      'Agenda templates for cohort-based learning paths',
      'Pre-work distribution and attendance tracking',
      'Certification dinner and closing celebration logistics',
    ],
    image: '/assets/wedding-priya-rahul.png',
  },
  {
    slug: 'team',
    name: 'Team Offsites & Initiative Trips',
    tagline: 'Ship the roadmap and rebuild trust in person',
    description:
      'Sprint weeks, hackathons, and cross-functional initiative trips — designed for deep work mornings and relationship-building afternoons on the Pacific.',
    idealFor: 'Product, engineering, and cross-functional squads (15–60 attendees)',
    groupSize: '15–60 attendees',
    duration: '2–3 nights typical',
    highlights: [
      'War-room style spaces with reliable Wi‑Fi and whiteboards',
      'Structured retros and planning workshops',
      'Optional adventure blocks — golf, water, desert experiences',
    ],
    spaces: ['Collaboration suites', 'Terrace huddle areas', 'Poolside working lounges'],
    howWeHelp: [
      'Daily standup and demo schedule baked into the run-of-show',
      'Meal pacing that protects focus blocks',
      'Team-building activities coordinated with local partners',
    ],
    image: '/assets/ava-resort.png',
  },
]

export function getRetreatBySlug(slug: string): RetreatType | undefined {
  return RETREAT_TYPES.find((r) => r.slug === slug)
}

export const PLATFORM_BENEFITS = [
  {
    icon: 'briefing' as IconKey,
    title: 'Retreat Brief Builder',
    body: 'Capture objectives, attendee personas, and success metrics — Allie turns them into a venue-ready brief the Nobu events team can act on immediately.',
  },
  {
    icon: 'proposal' as IconKey,
    title: 'Live Budget & Proposal',
    body: 'Model room nights, F&B minimums, AV, and activations in one view. Share a branded proposal with finance before you lock dates.',
  },
  {
    icon: 'attendees' as IconKey,
    title: 'Attendee & Room Block Hub',
    body: 'Import rosters, manage VIP arrivals, track dietary needs, and publish negotiated room rates — no more spreadsheet chaos.',
  },
  {
    icon: 'vendors' as IconKey,
    title: 'Vendor & Production Tracker',
    body: 'AV, DMC, swag, and transportation vendors in one thread — contracts, deposits, and day-of contacts always current.',
  },
  {
    icon: 'portal' as IconKey,
    title: 'Attendee Portal',
    body: 'A branded microsite with agenda, travel info, packing lists, and shuttle times — updates sync when the run-of-show changes.',
  },
  {
    icon: 'itinerary' as IconKey,
    title: 'Run-of-Show Command Center',
    body: 'Minute-by-minute schedule with room assignments, cues, and backup plans — exportable for ops, security, and catering.',
  },
  {
    icon: 'collab' as IconKey,
    title: 'Stakeholder Collaboration',
    body: 'Event lead, EAs, People Ops, and Nobu on-property coordinators share one workspace — approvals, notes, and version history included.',
  },
]

export const PLANNING_JOURNEY = [
  {
    step: '01',
    title: 'Define the retreat',
    body: 'Objectives, audience, dates, and budget guardrails. Allie asks the right questions so nothing is missing from the brief.',
  },
  {
    step: '02',
    title: 'Match venues & flow',
    body: 'See which Nobu spaces fit your format — plenary, breakouts, meals, and evening events — with capacity and AV notes inline.',
  },
  {
    step: '03',
    title: 'Build the proposal',
    body: 'Room block, F&B, production, and experiences roll into one estimate you can send to leadership for sign-off.',
  },
  {
    step: '04',
    title: 'Coordinate attendees',
    body: 'Launch the attendee portal, collect travel details, and keep dietary and accessibility requests in one place.',
  },
  {
    step: '05',
    title: 'Execute on property',
    body: 'Nobu events and Allie share the same run-of-show — last-minute changes propagate to catering, AV, and front desk instantly.',
  },
]

export const ENGAGEMENT_TIERS = [
  {
    label: 'Focused Offsite',
    rooms: '15–40 rooms · 2–3 nights',
    perks: [
      'Dedicated event coordinator and single main meeting space',
      'Daily breakfast and one group dinner at Nobu',
      'Standard AV package and attendee portal',
    ],
  },
  {
    label: 'Department Retreat',
    rooms: '40–100 rooms · 3–4 nights',
    perks: [
      'Plenary plus two breakout tracks',
      'Welcome reception and awards or closing gala',
      'Enhanced AV, signage, and shuttle coordination',
      'Allie workspace for up to 5 internal planners',
    ],
  },
  {
    label: 'Company-Wide Gathering',
    rooms: '100+ rooms · 3–5 nights',
    perks: [
      'Multi-venue buyout options and custom staging',
      'Full production support and regional rooming rules',
      'Executive hosting suite and VIP arrival program',
      'Dedicated Nobu on-site command center',
    ],
  },
]

export const CORE_SERVICES = [
  {
    title: 'Event strategy & programming',
    body: 'Agenda design, speaker flow, and experience pacing — from keynote to unstructured connection time.',
  },
  {
    title: 'Hospitality & room blocks',
    body: 'Negotiated rates, suite allocations, billing codes, and attrition guidance for corporate travel policies.',
  },
  {
    title: 'Culinary & F&B',
    body: 'Nobu menus, dietary accommodations, coffee breaks, and themed dinners scaled to your group size.',
  },
  {
    title: 'AV & hybrid production',
    body: 'In-room AV, streaming for remote leaders, and rehearsal support before doors open.',
  },
  {
    title: 'Local experiences',
    body: 'Team adventures, CSR activities, and spouse programs coordinated through vetted Cabo partners.',
  },
  {
    title: 'On-site execution',
    body: 'Nobu events team, security liaisons, and Allie keeping every department on the same run-of-show.',
  },
]
