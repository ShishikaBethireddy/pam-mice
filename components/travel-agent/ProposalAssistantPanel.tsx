'use client'

import { useState } from 'react'
import type { CventRequest, ParsedExtraService, RequestEdits } from '@/lib/cvent'
import { formatDateRange } from '@/lib/cvent'
import {
  applyCventDatesToEdits,
  autoAssignMeetingSpaces,
  enrichServicesWithSpaceNotes,
  type AgendaAssignment,
} from '@/lib/proposal-assistant'

export default function ProposalAssistantPanel({
  request,
  edits,
  onApplyEdits,
}: {
  request: CventRequest
  edits: RequestEdits
  onApplyEdits: (next: RequestEdits) => void
}) {
  const [assignments, setAssignments] = useState<AgendaAssignment[]>([])
  const [appliedDates, setAppliedDates] = useState(false)

  function handleApplyDates() {
    onApplyEdits(applyCventDatesToEdits(request, edits))
    setAppliedDates(true)
    setTimeout(() => setAppliedDates(false), 2000)
  }

  function handleAutoAssign() {
    const next = autoAssignMeetingSpaces(request, edits.extraServices)
    setAssignments(next)
    onApplyEdits({
      ...edits,
      extraServices: enrichServicesWithSpaceNotes(edits.extraServices, next),
    })
  }

  return (
    <section className="rounded-[12px] border border-[#d6bfa4] bg-[#faf8f5] p-4">
      <p className="font-sans text-[10px] uppercase tracking-[1.4px] text-[#8e7351] mb-1">Proposal assistant</p>
      <p className="font-sans text-[12px] text-[#585858] mb-4">
        Speed up drafting — apply Cvent dates in one click and auto-assign meeting spaces to agenda items.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={handleApplyDates}
          className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium border border-[#d0d0d0] bg-white hover:bg-[#f5f1ea]"
        >
          {appliedDates ? 'Dates applied ✓' : 'Apply Cvent dates'}
        </button>
        <button
          type="button"
          onClick={handleAutoAssign}
          className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium text-white"
          style={{ background: '#18181a' }}
        >
          Auto-assign meeting spaces
        </button>
      </div>

      <p className="font-sans text-[11px] text-[#969696] mb-2">
        Cvent window: {formatDateRange(request.preferredDates.start, request.preferredDates.end)}
      </p>

      {assignments.length > 0 && (
        <ul className="space-y-2 border-t border-[#ebe3d4] pt-3">
          {assignments.map((a) => (
            <li key={a.serviceId} className="flex items-start justify-between gap-2 font-sans text-[12px]">
              <span className="text-[#2b2b27]">
                <span className="text-[#8e7351]">{a.dayLabel}</span> · {a.serviceLabel}
              </span>
              <span className="text-right text-[#585858] shrink-0">
                {a.spaceName}
                <span className="block text-[10px] text-[#969696]">{a.confidence === 'high' ? 'High match' : 'Suggested'}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
