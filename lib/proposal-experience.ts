import type { CventRequest, DraftProposal } from './cvent'
import { formatDateRange, budgetTypeLabel } from './cvent'

export type ProposalModuleId = 'overview' | 'rooms' | 'spaces' | 'menus' | 'pricing' | 'services'

export interface ProposalModuleMeta {
  id: ProposalModuleId
  label: string
  tagline: string
  clientFeature: string
}

export const PROPOSAL_MODULES: ProposalModuleMeta[] = [
  { id: 'overview', label: 'Overview', tagline: 'Retreat story & dates', clientFeature: 'Hero + key terms' },
  { id: 'rooms', label: 'Rooms', tagline: 'Block & rate options', clientFeature: 'Toggle room tiers' },
  { id: 'spaces', label: 'Spaces', tagline: 'Ballroom & breakouts', clientFeature: '3D floor plan' },
  { id: 'menus', label: 'F&B', tagline: 'Menus & packages', clientFeature: 'Interactive menus' },
  { id: 'pricing', label: 'Pricing', tagline: 'Packages & totals', clientFeature: 'Live pricing options' },
  { id: 'services', label: 'Add-ons', tagline: 'AV, DJ, transport', clientFeature: 'Optional modules' },
]

export interface RpaSyncField {
  id: string
  label: string
  value: string
  source: 'cvent' | 'pms'
  status: 'synced' | 'pending'
}

export interface ProposalEngagement {
  heat: 'cold' | 'warm' | 'hot'
  firstOpenedAt?: string
  lastActivityAt?: string
  totalViews: number
  uniqueViewers: number
  forwardedTo: { name: string; role: string; at: string }[]
  moduleDwell: { moduleId: ProposalModuleId; label: string; seconds: number }[]
  suggestedFollowUp: string
}

export interface PricingTier {
  id: string
  label: string
  description: string
  grandTotal: number
  recommended?: boolean
}

export function buildRpaSyncFields(request: CventRequest): RpaSyncField[] {
  const { roomBlock, budget, preferredDates } = request
  return [
    { id: 'client', label: 'Client / RFP', value: request.clientName, source: 'cvent', status: 'synced' },
    { id: 'event', label: 'Event type', value: request.eventType, source: 'cvent', status: 'synced' },
    { id: 'guests', label: 'Headcount', value: `${request.headcount} guests`, source: 'cvent', status: 'synced' },
    { id: 'dates', label: 'Preferred dates', value: formatDateRange(preferredDates.start, preferredDates.end), source: 'cvent', status: 'synced' },
    { id: 'flex', label: 'Date flexibility', value: request.flexibleDateNotes ?? 'Firm', source: 'cvent', status: 'synced' },
    { id: 'budget', label: 'Budget', value: `${budget.currency} ${budget.amount.toLocaleString()} (${budgetTypeLabel(budget.type)})`, source: 'cvent', status: 'synced' },
    { id: 'billing', label: 'Billing code', value: roomBlock.billingCode ?? '—', source: 'cvent', status: 'synced' },
    { id: 'rooms', label: 'Room block', value: `${roomBlock.rooms} rooms · ${roomBlock.nights} nights`, source: 'cvent', status: 'synced' },
    { id: 'availability', label: 'PMS availability', value: request.datesAvailable ? 'Holds placed in Opera' : 'Alternate dates flagged', source: 'pms', status: request.datesAvailable ? 'synced' : 'pending' },
    { id: 'rates', label: 'BAR / group rates', value: 'Synced from Delphi rate manager', source: 'pms', status: 'synced' },
  ]
}

export function buildPricingTiers(proposal: DraftProposal): PricingTier[] {
  const base = proposal.grandTotal
  return [
    {
      id: 'essential',
      label: 'Essential',
      description: 'Rooms + meeting package + core F&B',
      grandTotal: Math.round(base * 0.88),
    },
    {
      id: 'recommended',
      label: 'Recommended',
      description: 'Full program as scoped in RFP',
      grandTotal: base,
      recommended: true,
    },
    {
      id: 'elevated',
      label: 'Elevated',
      description: 'Premium suites, gala upgrade, extended AV',
      grandTotal: Math.round(base * 1.14),
    },
  ]
}

export function presentationUrlFor(proposalId: string): string {
  return `https://proposals.pam-mice.com/${proposalId}`
}

export function getProposalEngagement(proposalId: string, status: DraftProposal['status']): ProposalEngagement {
  if (proposalId === 'prop-1031' || status === 'sent_to_cvent') {
    return {
      heat: 'hot',
      firstOpenedAt: '2026-05-18T14:22:00Z',
      lastActivityAt: '2026-05-19T08:41:00Z',
      totalViews: 12,
      uniqueViewers: 4,
      forwardedTo: [
        { name: 'David Chen', role: 'VP Procurement', at: '2026-05-18T16:05:00Z' },
        { name: 'Finance shared inbox', role: 'Budget approval', at: '2026-05-19T07:12:00Z' },
      ],
      moduleDwell: [
        { moduleId: 'pricing', label: 'Pricing', seconds: 142 },
        { moduleId: 'menus', label: 'F&B', seconds: 98 },
        { moduleId: 'spaces', label: 'Spaces', seconds: 76 },
        { moduleId: 'rooms', label: 'Rooms', seconds: 54 },
        { moduleId: 'services', label: 'Add-ons', seconds: 41 },
        { moduleId: 'overview', label: 'Overview', seconds: 28 },
      ],
      suggestedFollowUp: 'Pricing module had highest dwell — client likely comparing tiers. Follow up before 10am CST.',
    }
  }

  if (proposalId === 'prop-1042') {
    return {
      heat: 'warm',
      firstOpenedAt: '2026-05-19T09:30:00Z',
      lastActivityAt: '2026-05-19T09:47:00Z',
      totalViews: 3,
      uniqueViewers: 2,
      forwardedTo: [],
      moduleDwell: [
        { moduleId: 'overview', label: 'Overview', seconds: 45 },
        { moduleId: 'rooms', label: 'Rooms', seconds: 32 },
      ],
      suggestedFollowUp: 'Opened twice this morning — rooms module viewed but pricing not yet opened.',
    }
  }

  return {
    heat: 'cold',
    totalViews: 0,
    uniqueViewers: 0,
    forwardedTo: [],
    moduleDwell: [],
    suggestedFollowUp: 'Share the secure web link — engagement tracking starts when the client opens the proposal.',
  }
}

export function enrichProposal(proposal: DraftProposal): DraftProposal {
  return {
    ...proposal,
    format: 'interactive',
    presentationUrl: presentationUrlFor(proposal.id),
    modules: PROPOSAL_MODULES.map((m) => m.id),
    pricingTiers: buildPricingTiers(proposal),
    engagement: getProposalEngagement(proposal.id, proposal.status),
  }
}
