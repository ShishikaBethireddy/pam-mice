import type { CventRequest } from '@/lib/cvent'
import { formatArrivalShort, getLeadInsights, venueAvailabilityMeta } from '@/lib/lead-insights'

export function LeadInsightsCells({ request }: { request: CventRequest }) {
  const insights = getLeadInsights(request)
  const venue = venueAvailabilityMeta(insights.venueAvailability)

  return (
    <>
      <td className="px-4 py-3 text-[#585858] whitespace-nowrap">
        <span className="font-medium text-[#2b2b27]">{formatArrivalShort(insights.preferredArrival)}</span>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
          style={{ background: venue.bg, color: venue.color }}
        >
          {insights.venueAvailabilityLabel}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-[#2b2b27]">{insights.peakRoomNights.toLocaleString()}</td>
    </>
  )
}
