import type { CventRequest, ParsedExtraService, RequestEdits } from './cvent'

export interface MeetingSpace {
  id: string
  name: string
  capacity: number
  sqft: number
}

export interface AgendaAssignment {
  serviceId: string
  serviceLabel: string
  spaceId: string
  spaceName: string
  dayLabel: string
  confidence: 'high' | 'medium'
}

export const NOBU_MEETING_SPACES: MeetingSpace[] = [
  { id: 'ballroom', name: 'Nobu Ballroom', capacity: 600, sqft: 8500 },
  { id: 'harbor-terrace', name: 'Harbor Terrace', capacity: 220, sqft: 3200 },
  { id: 'zen-boardroom', name: 'Zen Boardroom', capacity: 24, sqft: 680 },
  { id: 'ocean-salon-a', name: 'Ocean Salon A', capacity: 120, sqft: 2100 },
  { id: 'ocean-salon-b', name: 'Ocean Salon B', capacity: 90, sqft: 1650 },
  { id: 'pool-deck', name: 'Pool Deck Pavilion', capacity: 180, sqft: 2800 },
]

export function applyCventDatesToEdits(request: CventRequest, edits: RequestEdits): RequestEdits {
  return {
    ...edits,
    roomBlock: {
      ...edits.roomBlock,
      checkIn: request.preferredDates.start,
      checkOut: request.preferredDates.end,
      nights: request.roomBlock.nights,
      billingCode: edits.intake.billingCode ?? edits.roomBlock.billingCode,
    },
  }
}

function pickSpace(service: ParsedExtraService, headcount: number, index: number): MeetingSpace {
  const text = `${service.label} ${service.rawText}`.toLowerCase()
  if (/boardroom|executive|leadership|c-suite/.test(text)) return NOBU_MEETING_SPACES[2]
  if (/breakout|workshop|training/.test(text)) {
    return index % 2 === 0 ? NOBU_MEETING_SPACES[3] : NOBU_MEETING_SPACES[4]
  }
  if (/gala|dinner|reception|welcome/.test(text)) return NOBU_MEETING_SPACES[5]
  if (/general session|plenary|keynote|town hall|all-hands/.test(text) || headcount >= 200) {
    return NOBU_MEETING_SPACES[0]
  }
  if (/outdoor|terrace|sunset/.test(text)) return NOBU_MEETING_SPACES[1]
  return headcount >= 100 ? NOBU_MEETING_SPACES[0] : NOBU_MEETING_SPACES[3]
}

export function autoAssignMeetingSpaces(
  request: CventRequest,
  services: ParsedExtraService[],
): AgendaAssignment[] {
  const meetingLike = services.filter(
    (s) =>
      s.category === 'av' ||
      s.category === 'fb' ||
      /session|meeting|breakout|boardroom|reception|gala|workshop|keynote/i.test(`${s.label} ${s.rawText}`),
  )

  const targets = meetingLike.length > 0 ? meetingLike : services.slice(0, 4)

  return targets.map((service, index) => {
    const space = pickSpace(service, request.headcount, index)
  const dayNum = (index % request.roomBlock.nights) + 1
    return {
      serviceId: service.id,
      serviceLabel: service.label,
      spaceId: space.id,
      spaceName: space.name,
      dayLabel: `Day ${dayNum}`,
      confidence: /session|boardroom|breakout/i.test(service.label) ? 'high' : 'medium',
    }
  })
}

export function enrichServicesWithSpaceNotes(
  services: ParsedExtraService[],
  assignments: AgendaAssignment[],
): ParsedExtraService[] {
  return services.map((service) => {
    const match = assignments.find((a) => a.serviceId === service.id)
    if (!match) return service
    const note = `[${match.dayLabel} · ${match.spaceName}]`
    if (service.rawText.includes(match.spaceName)) return service
    return {
      ...service,
      rawText: `${note} ${service.rawText}`.trim(),
    }
  })
}
