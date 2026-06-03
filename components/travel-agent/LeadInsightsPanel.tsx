import type { CventRequest } from '@/lib/cvent'
import { formatStaySummary, getLeadInsights, venueAvailabilityMeta } from '@/lib/lead-insights'

export default function LeadInsightsPanel({ request }: { request: CventRequest }) {
  const insights = getLeadInsights(request)
  const venue = venueAvailabilityMeta(insights.venueAvailability)

  return (
    <section className="grid grid-cols-3 gap-3">
      <InsightCard label="Preferred arrival" value={insights.preferredArrivalLabel} sub={formatStaySummary(request)} />
      <InsightCard
        label="Venue availability"
        value={insights.venueAvailabilityLabel}
        sub={request.datesAvailable ? 'Opera + Delphi in sync' : 'Alternate dates recommended'}
        valueStyle={{ color: venue.color }}
      />
      <InsightCard
        label="Peak room nights"
        value={insights.peakRoomNights.toLocaleString()}
        sub={`${insights.peakRooms} rooms × ${insights.stayNights} nights`}
      />
    </section>
  )
}

function InsightCard({
  label,
  value,
  sub,
  valueStyle,
}: {
  label: string
  value: string
  sub: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div className="rounded-[12px] border border-[#ebe3d4] bg-white p-4">
      <p className="font-sans text-[10px] uppercase tracking-[1.2px] text-[#969696] mb-1">{label}</p>
      <p className="font-sans text-[16px] font-semibold text-[#2b2b27]" style={valueStyle}>
        {value}
      </p>
      <p className="font-sans text-[11px] text-[#969696] mt-1">{sub}</p>
    </div>
  )
}
