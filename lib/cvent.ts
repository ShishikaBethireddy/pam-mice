export type CventRequestStatus = 'new' | 'parsing' | 'draft_ready' | 'sent' | 'needs_alternatives'

export type ExtraServiceCategory = 'entertainment' | 'av' | 'fb' | 'transport' | 'wellness' | 'other'

export interface ParsedExtraService {
  id: string
  category: ExtraServiceCategory
  label: string
  rawText: string
  quantity?: string
  estimatedCost?: number
}

export interface RoomBlockRequirement {
  rooms: number
  nights: number
  roomNights: number
  checkIn: string
  checkOut: string
  suiteCount?: number
  billingCode?: string
}

export interface PropertyRoomType {
  id: string
  name: string
  description?: string
  baseRate?: number
}

export interface RoomTypeAllocation {
  id: string
  roomTypeId: string
  count: number
}

export type DateFlexibility = 'firm' | 'flexible' | 'alternate_ok'

export interface CventBudget {
  amount: number
  currency: string
  type: 'firm' | 'target' | 'not_to_exceed'
  notes?: string
}

export interface AlternateDateWindow {
  start: string
  end: string
  label?: string
}

export interface CventIntakeEdits {
  billingCode?: string
  budget: CventBudget
  dateFlexibility: DateFlexibility
  flexibleDateNotes?: string
  eventLocationState: string
  clientHeadquartersState?: string
}

export interface RequestEdits {
  intake: CventIntakeEdits
  roomBlock: RoomBlockRequirement
  roomTypes: RoomTypeAllocation[]
  extraServices: ParsedExtraService[]
}

export const NOBU_ROOM_TYPES: PropertyRoomType[] = [
  { id: 'ocean-king', name: 'Ocean View King', description: 'King bed · 450 sq ft', baseRate: 485 },
  { id: 'ocean-double', name: 'Ocean View Double', description: 'Two doubles · 480 sq ft', baseRate: 465 },
  { id: 'zen-suite', name: 'Zen Suite', description: 'Suite · living area', baseRate: 890 },
  { id: 'nobu-suite', name: 'Nobu Suite', description: 'Premium suite · oceanfront', baseRate: 1250 },
  { id: 'residence-2br', name: '2BR Residence', description: 'Residence · private pool', baseRate: 1850 },
]

export const EXTRA_SERVICE_CATEGORIES: { id: ExtraServiceCategory; label: string }[] = [
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'av', label: 'AV & production' },
  { id: 'fb', label: 'F&B' },
  { id: 'transport', label: 'Transport' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'other', label: 'Other' },
]

export interface InventoryOption {
  id: string
  propertyId: string
  propertyName: string
  location: string
  available: boolean
  matchScore: number
  reason?: string
  roomBlock?: RoomBlockRequirement
  meetingSpaces?: string[]
  notes?: string
}

export interface CventRequest {
  id: string
  cventRef: string
  status: CventRequestStatus
  receivedAt: string
  clientName: string
  agencyName: string
  agentName: string
  agentEmail: string
  eventType: string
  headcount: number
  preferredDates: { start: string; end: string }
  dateFlexibility: DateFlexibility
  flexibleDateNotes?: string
  alternateDateWindows?: AlternateDateWindow[]
  datesAvailable: boolean
  budget: CventBudget
  eventLocationState: string
  clientHeadquartersState?: string
  roomBlock: RoomBlockRequirement
  extraServices: ParsedExtraService[]
  rawExcerpt: string
  assignedPam?: string
  proposalId?: string
}

export type ProposalHistoryStatus = 'draft' | 'sent' | 'counter_received' | 'revised' | 'finalized'

export interface ProposalHistoryEntry {
  id: string
  proposalId: string
  requestId: string
  version: number
  label: string
  createdAt: string
  sentAt?: string
  finalizedAt?: string
  status: ProposalHistoryStatus
  grandTotal: number
  notes?: string
  agentFeedback?: string
}

export const PROPOSAL_HISTORY: ProposalHistoryEntry[] = [
  {
    id: 'hist-1031-1',
    proposalId: 'prop-1031-v1',
    requestId: 'req-1031',
    version: 1,
    label: 'Initial proposal',
    createdAt: '2026-05-17T14:00:00Z',
    sentAt: '2026-05-17T15:20:00Z',
    status: 'counter_received',
    grandTotal: 298400,
    agentFeedback: 'Client asked to trim F&B on day 2 and reduce suite count.',
  },
  {
    id: 'hist-1031-2',
    proposalId: 'prop-1031-v2',
    requestId: 'req-1031',
    version: 2,
    label: 'Revised after F&B counter',
    createdAt: '2026-05-18T10:30:00Z',
    sentAt: '2026-05-18T11:45:00Z',
    status: 'counter_received',
    grandTotal: 312800,
    notes: 'Adjusted lunch format · added hybrid AV breakout.',
    agentFeedback: 'Needs executive boardroom on day 1 — can you add?',
  },
  {
    id: 'hist-1031-3',
    proposalId: 'prop-1031',
    requestId: 'req-1031',
    version: 3,
    label: 'Current draft (v3)',
    createdAt: '2026-05-19T08:00:00Z',
    sentAt: '2026-05-19T09:15:00Z',
    status: 'sent',
    grandTotal: 328600,
    notes: 'Includes boardroom + town hall AV from negotiation.',
  },
  {
    id: 'hist-1038-1',
    proposalId: 'prop-1038-v1',
    requestId: 'req-1038',
    version: 1,
    label: 'Nobu alternate dates',
    createdAt: '2026-05-18T16:00:00Z',
    sentAt: '2026-05-18T17:10:00Z',
    status: 'sent',
    grandTotal: 198500,
    notes: 'Proposed Nov 6–9 shift + HRC portfolio alternate.',
  },
  {
    id: 'hist-1042-1',
    proposalId: 'prop-1042-v1',
    requestId: 'req-1042',
    version: 1,
    label: 'Working draft',
    createdAt: '2026-05-19T10:00:00Z',
    status: 'draft',
    grandTotal: 512000,
    notes: 'In progress — SKO room block at 92 rooms.',
  },
  {
    id: 'hist-1056-1',
    proposalId: 'prop-1056-v1',
    requestId: 'req-1056',
    version: 1,
    label: 'Initial scope review',
    createdAt: '2026-05-19T07:30:00Z',
    status: 'draft',
    grandTotal: 1240000,
    notes: '520-guest pharma congress — awaiting PMS hold confirmation.',
  },
]

export function getProposalHistoryForRequest(requestId: string): ProposalHistoryEntry[] {
  return PROPOSAL_HISTORY.filter((h) => h.requestId === requestId).sort((a, b) => b.version - a.version)
}

export function proposalHistoryStatusLabel(status: ProposalHistoryStatus): string {
  const map: Record<ProposalHistoryStatus, string> = {
    draft: 'Draft',
    sent: 'Sent to requester',
    counter_received: 'Counter received',
    revised: 'Revised',
    finalized: 'Finalized',
  }
  return map[status]
}

export interface ProposalLineItem {
  id: string
  section: 'rooms' | 'meeting' | 'fb' | 'services' | 'fees'
  description: string
  quantity: string
  unitPrice: number
  total: number
}

export interface DraftProposal {
  id: string
  requestId: string
  cventRef: string
  propertyName: string
  propertyId: string
  clientName: string
  createdAt: string
  updatedAt: string
  validUntil: string
  status: 'draft' | 'ready' | 'sent_to_cvent' | 'finalized'
  lineItems: ProposalLineItem[]
  subtotal: number
  taxesAndFees: number
  grandTotal: number
  alternativesIncluded: InventoryOption[]
  pdfFileName: string
  sentToCventAt?: string
  format?: 'interactive' | 'pdf'
  presentationUrl?: string
  modules?: import('./proposal-experience').ProposalModuleId[]
  pricingTiers?: import('./proposal-experience').PricingTier[]
  engagement?: import('./proposal-experience').ProposalEngagement
}

export const PAM_PROPERTIES = [
  { id: 'nobu-cabos', name: 'Nobu Hotel Los Cabos', location: 'Cabo San Lucas, B.C.S.' },
  { id: 'hrc-cabos', name: 'Hard Rock Hotel Los Cabos', location: 'Cabo San Lucas, B.C.S.' },
  { id: 'unico-20', name: 'UNICO 20°87°', location: 'Riviera Maya, Mexico' },
  { id: 'ava-cancun', name: 'AVA Resort Cancun', location: 'Cancún, Mexico' },
] as const

export const CVENT_REQUESTS: CventRequest[] = [
  {
    id: 'req-1042',
    cventRef: 'CV-2026-88421',
    status: 'new',
    receivedAt: '2026-05-19T09:14:00Z',
    clientName: 'Meridian Health Systems',
    agencyName: 'Globe Corporate Travel',
    agentName: 'Priya Nair',
    agentEmail: 'priya.nair@globect.com',
    eventType: 'Sales kickoff (SKO)',
    headcount: 185,
    preferredDates: { start: '2026-09-14', end: '2026-09-17' },
    dateFlexibility: 'flexible',
    flexibleDateNotes: '±5 days from preferred window if weekday savings apply',
    alternateDateWindows: [
      { start: '2026-09-07', end: '2026-09-10', label: 'One week earlier' },
      { start: '2026-09-21', end: '2026-09-24', label: 'One week later' },
    ],
    datesAvailable: true,
    budget: { amount: 485000, currency: 'USD', type: 'target', notes: 'Inclusive of rooms, F&B, AV · excludes air' },
    eventLocationState: 'Baja California Sur',
    clientHeadquartersState: 'Illinois',
    roomBlock: {
      rooms: 92,
      nights: 3,
      roomNights: 276,
      checkIn: '2026-09-14',
      checkOut: '2026-09-17',
      suiteCount: 8,
      billingCode: 'MHS-SKO-2026',
    },
    extraServices: [
      { id: 's1', category: 'entertainment', label: 'DJ · welcome reception', rawText: 'DJ for welcome reception (4 hrs)', quantity: '1', estimatedCost: 4200 },
      { id: 's2', category: 'av', label: 'General session AV + LED wall', rawText: 'Main stage AV, 2 breakouts, recording', estimatedCost: 28500 },
      { id: 's3', category: 'fb', label: 'Gala dinner · Nobu menu', rawText: 'Plated gala for 185, premium bar package', estimatedCost: 46250 },
      { id: 's4', category: 'transport', label: 'Airport transfers', rawText: 'SJD group transfers, 3 waves', estimatedCost: 6800 },
    ],
    rawExcerpt:
      'Need 90-95 rooms peak, flexible +/- 5. Mon arrival, Thu departure. Main ballroom + 2 breakouts. DJ welcome party Tue. Gala Wed. Commission 12%.',
    assignedPam: 'Camila R.',
  },
  {
    id: 'req-1038',
    cventRef: 'CV-2026-88102',
    status: 'needs_alternatives',
    receivedAt: '2026-05-18T14:02:00Z',
    clientName: 'Northwind Analytics',
    agencyName: 'Summit Advisors',
    agentName: 'James Okonkwo',
    agentEmail: 'j.okonkwo@summitadv.com',
    eventType: 'Leadership retreat',
    headcount: 42,
    preferredDates: { start: '2026-11-20', end: '2026-11-23' },
    dateFlexibility: 'alternate_ok',
    flexibleDateNotes: 'Nov 20–23 unavailable at Nobu — open to portfolio alternates or date shift',
    alternateDateWindows: [
      { start: '2026-11-06', end: '2026-11-09', label: 'Preferred alternate' },
      { start: '2026-12-04', end: '2026-12-07', label: 'December option' },
    ],
    datesAvailable: false,
    budget: { amount: 185000, currency: 'USD', type: 'not_to_exceed' },
    eventLocationState: 'Baja California Sur',
    clientHeadquartersState: 'Washington',
    roomBlock: {
      rooms: 38,
      nights: 3,
      roomNights: 114,
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      suiteCount: 4,
    },
    extraServices: [
      { id: 's1', category: 'wellness', label: 'Group spa block', rawText: 'Spa appointments for 20 leaders', estimatedCost: 5400 },
      { id: 's2', category: 'fb', label: 'Working lunches × 3', rawText: 'Bento-style working lunches, ocean terrace', estimatedCost: 6300 },
    ],
    rawExcerpt:
      'Executive offsite, board members attending. Require NDA-friendly meeting suite. Nov 20-23 sold out per agent — please advise alternates.',
    assignedPam: 'Camila R.',
  },
  {
    id: 'req-1031',
    cventRef: 'CV-2026-87944',
    status: 'draft_ready',
    receivedAt: '2026-05-17T11:30:00Z',
    clientName: 'Brightline Robotics',
    agencyName: 'Atlas MICE Partners',
    agentName: 'Elena Vasquez',
    agentEmail: 'e.vasquez@atlasmice.com',
    eventType: 'All-hands offsite',
    headcount: 120,
    preferredDates: { start: '2026-10-06', end: '2026-10-09' },
    dateFlexibility: 'firm',
    flexibleDateNotes: 'Dates confirmed with client — no flexibility',
    datesAvailable: true,
    budget: { amount: 320000, currency: 'USD', type: 'firm' },
    eventLocationState: 'Baja California Sur',
    clientHeadquartersState: 'California',
    roomBlock: {
      rooms: 58,
      nights: 3,
      roomNights: 174,
      checkIn: '2026-10-06',
      checkOut: '2026-10-09',
    },
    extraServices: [
      { id: 's1', category: 'av', label: 'Town hall AV', rawText: 'Single plenary, hybrid stream', estimatedCost: 12000 },
      { id: 's2', category: 'entertainment', label: 'Team dinner entertainment', rawText: 'Acoustic duo, 2 hrs', estimatedCost: 2800 },
    ],
    rawExcerpt: 'Annual all-hands. Prefer Nobu Cabos. Need comp policy for 2 night min stay.',
    assignedPam: 'Diego M.',
    proposalId: 'prop-1031',
  },
  {
    id: 'req-1056',
    cventRef: 'CV-2026-88602',
    status: 'new',
    receivedAt: '2026-05-19T07:12:00Z',
    clientName: 'Apex Pharmaceuticals',
    agencyName: 'Encore Global',
    agentName: 'Maria Lindstrom',
    agentEmail: 'm.lindstrom@encoreglobal.com',
    eventType: 'National sales congress',
    headcount: 520,
    preferredDates: { start: '2026-11-03', end: '2026-11-07' },
    dateFlexibility: 'flexible',
    flexibleDateNotes: 'Prefer early Nov · can shift ±3 days',
    datesAvailable: true,
    budget: { amount: 890000, currency: 'USD', type: 'target', notes: 'Rooms, general session, gala, breakouts' },
    eventLocationState: 'Baja California Sur',
    clientHeadquartersState: 'New Jersey',
    roomBlock: {
      rooms: 260,
      nights: 4,
      roomNights: 1040,
      checkIn: '2026-11-03',
      checkOut: '2026-11-07',
      suiteCount: 24,
      billingCode: 'APX-NSC-2026',
    },
    extraServices: [
      { id: 's1', category: 'av', label: 'General session + 6 breakouts', rawText: 'Full congress AV', estimatedCost: 68000 },
      { id: 's2', category: 'fb', label: 'Gala dinner · 520 pax', rawText: 'Plated gala, premium bar', estimatedCost: 124000 },
      { id: 's3', category: 'transport', label: 'Airport transfers · 4 waves', rawText: 'SJD group logistics', estimatedCost: 22000 },
    ],
    rawExcerpt:
      'Annual sales congress for 520 reps and leadership. Need main ballroom, breakout grid, and comp policy for 3-night min. Commission 10%.',
    assignedPam: 'Camila R.',
  },
  {
    id: 'req-1052',
    cventRef: 'CV-2026-88510',
    status: 'new',
    receivedAt: '2026-05-19T06:45:00Z',
    clientName: 'GlobalTech Industries',
    agencyName: 'Maritz Global Events',
    agentName: 'Tom Bradley',
    agentEmail: 't.bradley@maritz.com',
    eventType: 'Global SKO',
    headcount: 340,
    preferredDates: { start: '2026-08-18', end: '2026-08-21' },
    dateFlexibility: 'firm',
    datesAvailable: true,
    budget: { amount: 620000, currency: 'USD', type: 'firm' },
    eventLocationState: 'Baja California Sur',
    clientHeadquartersState: 'Texas',
    roomBlock: {
      rooms: 170,
      nights: 3,
      roomNights: 510,
      checkIn: '2026-08-18',
      checkOut: '2026-08-21',
      suiteCount: 12,
      billingCode: 'GTI-SKO-26',
    },
    extraServices: [
      { id: 's1', category: 'av', label: 'Keynote + awards stage', rawText: 'LED wall, IMAG, show calling', estimatedCost: 52000 },
      { id: 's2', category: 'entertainment', label: 'Awards night DJ', rawText: '4-hr reception', estimatedCost: 6500 },
    ],
    rawExcerpt:
      'Global SKO for 340 — firm dates Aug 18–21. Main ballroom, 3 breakouts, awards dinner. Need attrition terms.',
    assignedPam: 'Diego M.',
  },
  {
    id: 'req-1049',
    cventRef: 'CV-2026-88201',
    status: 'new',
    receivedAt: '2026-05-19T05:20:00Z',
    clientName: 'Nexus "Events" Group',
    agencyName: 'Independent',
    agentName: 'Mike T.',
    agentEmail: 'mike.traveldeals@gmail.com',
    eventType: 'Corporate event',
    headcount: 600,
    preferredDates: { start: '2026-12-01', end: '2026-12-05' },
    dateFlexibility: 'flexible',
    datesAvailable: true,
    budget: { amount: 18000, currency: 'USD', type: 'target' },
    eventLocationState: 'Baja California Sur',
    roomBlock: {
      rooms: 480,
      nights: 4,
      roomNights: 1920,
      checkIn: '2026-12-01',
      checkOut: '2026-12-05',
    },
    extraServices: [],
    rawExcerpt: 'Need cheapest quote for 600 people. Send best rate only. No commission.',
    assignedPam: 'Camila R.',
  },
  {
    id: 'req-1047',
    cventRef: 'CV-2026-88155',
    status: 'new',
    receivedAt: '2026-05-18T22:10:00Z',
    clientName: 'Best Deal Hotels LLC',
    agencyName: 'Best Deal Hotels LLC',
    agentName: 'Sales Bot',
    agentEmail: 'quotes@bestdeal-hotels.net',
    eventType: 'Conference',
    headcount: 450,
    preferredDates: { start: '2026-07-01', end: '2026-07-04' },
    dateFlexibility: 'flexible',
    datesAvailable: true,
    budget: { amount: 25000, currency: 'USD', type: 'not_to_exceed' },
    eventLocationState: 'Mexico',
    roomBlock: {
      rooms: 400,
      nights: 3,
      roomNights: 1200,
      checkIn: '2026-07-01',
      checkOut: '2026-07-04',
    },
    extraServices: [{ id: 's1', category: 'other', label: 'TBD', rawText: 'TBD', estimatedCost: 0 }],
    rawExcerpt: 'Send quote. Lowest price. Test RFP.',
    assignedPam: 'Camila R.',
  },
]

function inventoryForRequest(req: CventRequest): InventoryOption[] {
  const primary: InventoryOption = {
    id: 'inv-primary',
    propertyId: 'nobu-cabos',
    propertyName: 'Nobu Hotel Los Cabos',
    location: 'Cabo San Lucas, B.C.S.',
    available: req.datesAvailable,
    matchScore: req.datesAvailable ? 98 : 42,
    reason: req.datesAvailable ? 'Preferred dates open · room block fits' : 'Preferred dates constrained — see alternate windows',
    roomBlock: req.roomBlock,
    meetingSpaces: req.headcount > 100 ? ['Shiawase Terrace', 'Main ballroom', 'Breakout A & B'] : ['Executive boardroom', 'Yakusoku Garden'],
  }

  const alternates: InventoryOption[] = [
    {
      id: 'inv-alt-1',
      propertyId: 'nobu-cabos',
      propertyName: 'Nobu Hotel Los Cabos',
      location: 'Cabo San Lucas, B.C.S.',
      available: true,
      matchScore: 91,
      reason: 'Shift +7 days — full room block & terrace available',
      roomBlock: { ...req.roomBlock, checkIn: shiftDate(req.roomBlock.checkIn, 7), checkOut: shiftDate(req.roomBlock.checkOut, 7) },
      meetingSpaces: ['Shiawase Terrace', 'Breakout suites'],
      notes: 'Same property · recommended if client can flex',
    },
    {
      id: 'inv-alt-2',
      propertyId: 'hrc-cabos',
      propertyName: 'Hard Rock Hotel Los Cabos',
      location: 'Cabo San Lucas, B.C.S.',
      available: true,
      matchScore: 86,
      reason: 'Original dates available · larger breakout capacity',
      roomBlock: req.roomBlock,
      meetingSpaces: ['Sound Check Ballroom', 'Amplified Breakouts × 3'],
    },
    {
      id: 'inv-alt-3',
      propertyId: 'ava-cancun',
      propertyName: 'AVA Resort Cancun',
      location: 'Cancún, Mexico',
      available: true,
      matchScore: 78,
      reason: 'Portfolio alternate · 15% lower room rate band',
      roomBlock: { ...req.roomBlock, rooms: Math.ceil(req.roomBlock.rooms * 0.95) },
      meetingSpaces: ['Oceanfront pavilion', 'Collaboration studios'],
    },
  ]

  return [primary, ...alternates.filter((a) => a.id !== 'inv-primary' || !req.datesAvailable)]
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function getCventRequest(id: string): CventRequest | undefined {
  return CVENT_REQUESTS.find((r) => r.id === id)
}

export function getInventoryForRequest(requestId: string): InventoryOption[] {
  const req = getCventRequest(requestId)
  if (!req) return []
  return inventoryForRequest(req)
}

export function getRoomTypeName(roomTypeId: string): string {
  return NOBU_ROOM_TYPES.find((t) => t.id === roomTypeId)?.name ?? roomTypeId
}

/** Suggested split from Cvent-parsed room total */
export function defaultRoomTypesFromBlock(block: RoomBlockRequirement): RoomTypeAllocation[] {
  const suites = block.suiteCount ?? Math.max(1, Math.round(block.rooms * 0.1))
  const kings = Math.round((block.rooms - suites) * 0.55)
  const doubles = block.rooms - suites - kings
  return [
    { id: 'rt-1', roomTypeId: 'ocean-king', count: kings },
    { id: 'rt-2', roomTypeId: 'ocean-double', count: Math.max(0, doubles) },
    { id: 'rt-3', roomTypeId: 'zen-suite', count: suites },
  ].filter((r) => r.count > 0)
}

export function sumRoomTypeCounts(allocations: RoomTypeAllocation[]): number {
  return allocations.reduce((s, r) => s + r.count, 0)
}

export function recalcRoomBlock(
  block: RoomBlockRequirement,
  allocations: RoomTypeAllocation[],
): RoomBlockRequirement {
  const rooms = sumRoomTypeCounts(allocations)
  const suiteCount = allocations
    .filter((a) => a.roomTypeId.includes('suite') || a.roomTypeId.includes('residence'))
    .reduce((s, a) => s + a.count, 0)
  return {
    ...block,
    rooms,
    roomNights: rooms * block.nights,
    suiteCount: suiteCount > 0 ? suiteCount : undefined,
  }
}

export function dateFlexibilityLabel(mode: DateFlexibility): string {
  const map: Record<DateFlexibility, string> = {
    firm: 'Firm dates',
    flexible: 'Flexible dates',
    alternate_ok: 'Open to alternates',
  }
  return map[mode]
}

export function budgetTypeLabel(type: CventBudget['type']): string {
  const map: Record<CventBudget['type'], string> = {
    firm: 'Firm budget',
    target: 'Target budget',
    not_to_exceed: 'Not to exceed',
  }
  return map[type]
}

export function createIntakeEdits(request: CventRequest): CventIntakeEdits {
  return {
    billingCode: request.roomBlock.billingCode,
    budget: { ...request.budget },
    dateFlexibility: request.dateFlexibility,
    flexibleDateNotes: request.flexibleDateNotes,
    eventLocationState: request.eventLocationState,
    clientHeadquartersState: request.clientHeadquartersState,
  }
}

export function createRequestEdits(request: CventRequest): RequestEdits {
  return {
    intake: createIntakeEdits(request),
    roomBlock: { ...request.roomBlock },
    roomTypes: defaultRoomTypesFromBlock(request.roomBlock),
    extraServices: request.extraServices.map((s) => ({ ...s })),
  }
}

export function newExtraService(): ParsedExtraService {
  return {
    id: `s-${Date.now()}`,
    category: 'other',
    label: '',
    rawText: '',
    quantity: '1',
    estimatedCost: 0,
  }
}

export function newRoomTypeAllocation(): RoomTypeAllocation {
  return { id: `rt-${Date.now()}`, roomTypeId: 'ocean-king', count: 0 }
}

export function buildDraftProposal(
  requestId: string,
  propertyId = 'nobu-cabos',
  edits?: RequestEdits,
): DraftProposal | null {
  const req = getCventRequest(requestId)
  if (!req) return null

  const roomBlock = edits?.roomBlock ?? req.roomBlock
  const roomTypes = edits?.roomTypes ?? defaultRoomTypesFromBlock(roomBlock)
  const extraServices = edits?.extraServices ?? req.extraServices

  const property = PAM_PROPERTIES.find((p) => p.id === propertyId) ?? PAM_PROPERTIES[0]

  const roomBreakdown = roomTypes
    .filter((r) => r.count > 0)
    .map((r) => `${r.count} ${getRoomTypeName(r.roomTypeId)}`)
    .join(', ')

  const weightedRate =
    roomTypes.reduce((sum, r) => {
      const rate = NOBU_ROOM_TYPES.find((t) => t.id === r.roomTypeId)?.baseRate ?? 485
      return sum + r.count * rate
    }, 0) / Math.max(1, sumRoomTypeCounts(roomTypes))

  const roomTotal = Math.round(roomBlock.roomNights * weightedRate)

  const serviceLines: ProposalLineItem[] = extraServices
    .filter((s) => s.label.trim())
    .map((s, i) => ({
    id: `line-s-${i}`,
    section: 'services' as const,
    description: s.label,
    quantity: s.quantity ?? '1',
    unitPrice: s.estimatedCost ?? 0,
    total: s.estimatedCost ?? 0,
  }))

  const lineItems: ProposalLineItem[] = [
    {
      id: 'line-rooms',
      section: 'rooms',
      description: `Room block · ${roomBreakdown} × ${roomBlock.nights} nights`,
      quantity: `${roomBlock.roomNights} room nights`,
      unitPrice: Math.round(weightedRate),
      total: roomTotal,
    },
    {
      id: 'line-meeting',
      section: 'meeting',
      description: req.headcount > 100 ? 'Main ballroom + 2 breakouts · 3 days' : 'Executive meeting suite · 3 days',
      quantity: '1 package',
      unitPrice: req.headcount > 100 ? 42000 : 18500,
      total: req.headcount > 100 ? 42000 : 18500,
    },
    {
      id: 'line-fb',
      section: 'fb',
      description: 'Welcome reception + daily breakfast + working lunches',
      quantity: `${req.headcount} guests`,
      unitPrice: 95,
      total: req.headcount * 95 * roomBlock.nights,
    },
    ...serviceLines,
    {
      id: 'line-fees',
      section: 'fees',
      description: 'Service charge & destination fees',
      quantity: '—',
      unitPrice: 0,
      total: 0,
    },
  ]

  const subtotal = lineItems.reduce((sum, l) => sum + l.total, 0)
  const taxesAndFees = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + taxesAndFees

  const alternatives = getInventoryForRequest(requestId).filter((i) => i.propertyId !== propertyId || !i.available)

  return {
    id: req.proposalId ?? `prop-${requestId.replace('req-', '')}`,
    requestId: req.id,
    cventRef: req.cventRef,
    propertyName: property.name,
    propertyId: property.id,
    clientName: req.clientName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    validUntil: shiftDate(req.preferredDates.start, -45),
    status: 'draft',
    lineItems,
    subtotal,
    taxesAndFees,
    grandTotal,
    alternativesIncluded: alternatives.slice(0, 2),
    pdfFileName: `${req.cventRef}-${property.id}-proposal.pdf`,
  }
}

export function getProposal(id: string): DraftProposal | null {
  const fromRequest = CVENT_REQUESTS.find((r) => r.proposalId === id)
  if (fromRequest) return buildDraftProposal(fromRequest.id)!
  const reqId = id.replace('prop-', 'req-')
  if (getCventRequest(reqId)) return buildDraftProposal(reqId)!
  return buildDraftProposal('req-1042')
}

export function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  const s = new Date(start + 'T12:00:00').toLocaleDateString('en-US', opts)
  const e = new Date(end + 'T12:00:00').toLocaleDateString('en-US', opts)
  return `${s} – ${e}`
}

export function statusLabel(status: CventRequestStatus): string {
  const map: Record<CventRequestStatus, string> = {
    new: 'New from Cvent',
    parsing: 'Parsing…',
    draft_ready: 'Draft ready',
    sent: 'Sent to Cvent',
    needs_alternatives: 'Needs alternates',
  }
  return map[status]
}
