import type { CventRequest } from './cvent'
import { formatDateRange } from './cvent'

export type VenueAvailabilityStatus = 'available' | 'limited' | 'waitlist'

export interface LeadInsights {
  preferredArrival: string
  preferredArrivalLabel: string
  venueAvailability: VenueAvailabilityStatus
  venueAvailabilityLabel: string
  peakRoomNights: number
  peakRooms: number
  stayNights: number
  estimatedRevenue: number
  estimatedProfit: number
  profitMarginPct: number
}

export function venueAvailabilityMeta(status: VenueAvailabilityStatus) {
  const map = {
    available: { label: 'Available', bg: '#e8f5e9', color: '#2d5a3d' },
    limited: { label: 'Limited', bg: '#fff8e6', color: '#8e7351' },
    waitlist: { label: 'Waitlist', bg: '#fde8e8', color: '#8b3a3a' },
  }
  return map[status]
}

export function getLeadInsights(req: CventRequest): LeadInsights {
  const peakRooms = req.roomBlock.rooms
  const stayNights = req.roomBlock.nights
  const peakRoomNights = req.roomBlock.roomNights || peakRooms * stayNights

  let venueAvailability: VenueAvailabilityStatus = 'available'
  if (!req.datesAvailable) venueAvailability = 'waitlist'
  else if (peakRooms >= 120 || req.headcount >= 400) venueAvailability = 'limited'

  const avgRate = 520
  const fbPerGuest = Math.min(180, req.budget.amount / Math.max(1, req.headcount) * 0.12)
  const roomRevenue = peakRoomNights * avgRate
  const fbRevenue = req.headcount * stayNights * fbPerGuest * 0.35
  const meetingRevenue = req.extraServices.length * 4200
  const estimatedRevenue = Math.round(roomRevenue + fbRevenue + meetingRevenue)
  const estimatedProfit = Math.round(estimatedRevenue * (venueAvailability === 'available' ? 0.34 : 0.28))
  const profitMarginPct = Math.round((estimatedProfit / Math.max(1, estimatedRevenue)) * 100)

  const arrival = new Date(req.preferredDates.start + 'T12:00:00')

  return {
    preferredArrival: req.preferredDates.start,
    preferredArrivalLabel: arrival.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    venueAvailability,
    venueAvailabilityLabel: venueAvailabilityMeta(venueAvailability).label,
    peakRoomNights,
    peakRooms,
    stayNights,
    estimatedRevenue,
    estimatedProfit,
    profitMarginPct,
  }
}

export function formatArrivalShort(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatStaySummary(req: CventRequest) {
  return formatDateRange(req.preferredDates.start, req.preferredDates.end)
}
