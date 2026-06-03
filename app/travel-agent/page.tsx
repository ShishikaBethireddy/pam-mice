'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import TravelAgentShell from '@/components/travel-agent/TravelAgentShell'
import { ValueScoreBadge } from '@/components/travel-agent/ValueScoreBadge'
import { LeadInsightsCells } from '@/components/travel-agent/LeadInsightsCells'
import AutoResponseRulesPanel, { AutoResponseBadge } from '@/components/travel-agent/AutoResponseRulesPanel'
import { CVENT_REQUESTS, statusLabel, type CventRequestStatus } from '@/lib/cvent'
import { scoreCventRequest, sortRequestsByScore, type RequestScoreTier } from '@/lib/request-scoring'

type StatusFilter = 'all' | CventRequestStatus
type ScoreFilter = 'all' | RequestScoreTier

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All statuses' },
  { id: 'new', label: 'New' },
  { id: 'needs_alternatives', label: 'Alternates' },
  { id: 'draft_ready', label: 'Drafts' },
]

const SCORE_FILTERS: { id: ScoreFilter; label: string }[] = [
  { id: 'all', label: 'All scores' },
  { id: 'high_value', label: 'High value' },
  { id: 'worth_review', label: 'Worth review' },
  { id: 'likely_spam', label: 'Likely spam' },
]

export default function TravelAgentDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')

  const filtered = useMemo(() => {
    let list = sortRequestsByScore(CVENT_REQUESTS)
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter)
    if (scoreFilter !== 'all') list = list.filter((r) => scoreCventRequest(r).tier === scoreFilter)
    return list
  }, [statusFilter, scoreFilter])

  return (
    <TravelAgentShell title="Cvent inbox">
      <div className="px-8 py-6">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="font-sans text-[14px] text-[#585858] max-w-[640px]">
              Lead scoring prioritizes RFPs by availability, opportunity, and profit. At-a-glance insights surface
              arrival, venue status, and peak room nights — automated rules draft or decline on your preferences.
            </p>
          </div>
          <p className="font-sans text-[13px] text-[#585858] shrink-0">
            <span className="font-semibold text-[#2b2b27]">{filtered.length}</span> requests · sorted by lead score
          </p>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6 mb-6">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <FilterGroup label="Score" filters={SCORE_FILTERS} active={scoreFilter} onChange={setScoreFilter} />
              <FilterGroup label="Status" filters={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />
            </motionlessFilters>

            <div className="overflow-hidden rounded-[12px] border border-[#d0d0d0] bg-white">
              <table className="w-full border-collapse font-sans text-[13px]">
                <thead>
                  <tr className="border-b border-[#ebe3d4] bg-[#fafafa] text-left text-[11px] uppercase tracking-[1px] text-[#969696]">
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Arrival</th>
                    <th className="px-4 py-3 font-medium">Venue</th>
                    <th className="px-4 py-3 font-medium">Peak RN</th>
                    <th className="px-4 py-3 font-medium">Event</th>
                    <th className="px-4 py-3 font-medium">Guests</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => {
                    const score = scoreCventRequest(req)
                    return (
                      <tr key={req.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3">
                          <ValueScoreBadge request={req} compact />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/travel-agent/requests/${req.id}`} className="font-medium text-[#2b2b27] hover:text-[#8e7351]">
                            {req.clientName}
                          </Link>
                          <AutoResponseBadge request={req} />
                          {score.flags[0] && score.tier === 'likely_spam' && (
                            <p className="text-[11px] text-[#8b3a3a] mt-0.5">{score.flags[0]}</p>
                          )}
                        </td>
                        <LeadInsightsCells request={req} />
                        <td className="px-4 py-3 text-[#585858]">{req.eventType}</td>
                        <td className="px-4 py-3 font-medium text-[#2b2b27]">{req.headcount}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={req.status} />
                        </td>
                        <td className="px-4 py-3 text-[#969696]">{req.cventRef}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <AutoResponseRulesPanel requests={CVENT_REQUESTS} />
        </motionlessGrid>
      </div>
    </TravelAgentShell>
  )
}

function FilterGroup<T extends string>({
  label,
  filters,
  active,
  onChange,
}: {
  label: string
  filters: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[1.2px] text-[#969696]">{label}</span>
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className="rounded-[6px] px-3 py-1.5 font-sans text-[12px] font-medium transition-colors"
          style={{
            background: active === f.id ? '#18181a' : 'white',
            color: active === f.id ? 'white' : '#585858',
            border: active === f.id ? 'none' : '1px solid #d0d0d0',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

function StatusPill({ status }: { status: CventRequestStatus }) {
  const styles: Record<CventRequestStatus, { bg: string; color: string }> = {
    new: { bg: '#f5f1ea', color: '#8e7351' },
    parsing: { bg: '#f0f0f0', color: '#585858' },
    draft_ready: { bg: '#e8f5e9', color: '#2d5a3d' },
    sent: { bg: '#e8f5e9', color: '#2d5a3d' },
    needs_alternatives: { bg: '#fde8e8', color: '#8b3a3a' },
  }
  const s = styles[status]
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: s.bg, color: s.color }}>
      {statusLabel(status)}
    </span>
  )
}
