import type { CventRequest } from './cvent'

export type RequestScoreTier = 'high_value' | 'worth_review' | 'low_priority' | 'likely_spam'

export interface ScoreDimension {
  id: 'availability' | 'opportunity' | 'profit'
  label: string
  score: number
  detail: string
}

export interface RequestScore {
  score: number
  tier: RequestScoreTier
  label: string
  reasons: string[]
  flags: string[]
  dimensions: ScoreDimension[]
}

const TIER_META: Record<RequestScoreTier, { label: string; color: string; bg: string }> = {
  high_value: { label: 'High value', color: '#2d5a3d', bg: '#e8f5e9' },
  worth_review: { label: 'Worth review', color: '#8e7351', bg: '#f5f1ea' },
  low_priority: { label: 'Low priority', color: '#585858', bg: '#f0f0f0' },
  likely_spam: { label: 'Likely spam', color: '#8b3a3a', bg: '#fde8e8' },
}

export function scoreTierMeta(tier: RequestScoreTier) {
  return TIER_META[tier]
}

const TRUSTED_AGENCIES = [
  'Globe Corporate Travel',
  'Atlas MICE Partners',
  'Summit Advisors',
  'Encore Global',
  'Maritz Global Events',
]

export function scoreCventRequest(req: CventRequest): RequestScore {
  let score = 48
  const reasons: string[] = []
  const flags: string[] = []

  if (req.headcount >= 500) {
    score += 28
    reasons.push(`${req.headcount} guests — flagship program`)
  } else if (req.headcount >= 300) {
    score += 22
    reasons.push(`${req.headcount} guests — large corporate block`)
  } else if (req.headcount >= 150) {
    score += 12
    reasons.push('Mid-size group with room-night potential')
  } else if (req.headcount < 25) {
    score -= 10
    flags.push('Very small headcount')
  }

  const perGuest = req.budget.amount / Math.max(1, req.headcount)
  if (perGuest >= 1200) {
    score += 14
    reasons.push('Strong budget per guest')
  } else if (perGuest >= 700) {
    score += 6
  } else if (perGuest < 120) {
    score -= 32
    flags.push('Budget unrealistic for group size')
  }

  if (req.budget.amount >= 500000) {
    score += 10
    reasons.push('Program budget $500k+')
  } else if (req.budget.amount >= 250000) {
    score += 5
  }

  if (TRUSTED_AGENCIES.includes(req.agencyName)) {
    score += 12
    reasons.push('Verified agency partner')
  }

  const email = req.agentEmail.toLowerCase()
  if (email.includes('@gmail.') || email.includes('@yahoo.') || email.includes('@hotmail.')) {
    score -= 28
    flags.push('Consumer email on RFP')
  }

  if (req.budget.type === 'firm') {
    score += 8
    reasons.push('Firm budget on file')
  }

  if (req.extraServices.length >= 3) score += 4
  if (req.roomBlock.billingCode) score += 3

  const excerpt = req.rawExcerpt.toLowerCase()
  if (excerpt.length < 45) {
    score -= 14
    flags.push('Vague or incomplete RFP')
  }
  if (/cheapest|test rfp|best rate only|send quote|lowest price/.test(excerpt)) {
    score -= 22
    flags.push('Low-intent RFP language')
  }

  const roomsRatio = req.roomBlock.rooms / Math.max(1, req.headcount)
  if (roomsRatio > 0.75) {
    score -= 12
    flags.push('Room count out of line with headcount')
  }

  if (/wedding|birthday party|family reunion/.test(excerpt) && req.headcount > 200) {
    score -= 8
    flags.push('Possible misrouted leisure inquiry')
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  let availabilityScore = req.datesAvailable ? 88 : 38
  if (req.dateFlexibility === 'alternate_ok') availabilityScore += 4
  if (req.alternateDateWindows?.length) availabilityScore += 3
  availabilityScore = Math.min(100, availabilityScore)

  let opportunityScore = 50
  if (req.headcount >= 300) opportunityScore += 25
  else if (req.headcount >= 150) opportunityScore += 14
  if (TRUSTED_AGENCIES.includes(req.agencyName)) opportunityScore += 12
  if (req.extraServices.length >= 3) opportunityScore += 6
  opportunityScore = Math.max(0, Math.min(100, opportunityScore))

  let profitScore = 45
  if (perGuest >= 900) profitScore += 28
  else if (perGuest >= 600) profitScore += 16
  else if (perGuest >= 300) profitScore += 8
  if (req.budget.amount >= 400000) profitScore += 12
  const roomNights = req.roomBlock.roomNights || req.roomBlock.rooms * req.roomBlock.nights
  if (roomNights >= 800) profitScore += 10
  profitScore = Math.max(0, Math.min(100, profitScore))

  const dimensions: ScoreDimension[] = [
    {
      id: 'availability',
      label: 'Availability',
      score: availabilityScore,
      detail: req.datesAvailable ? 'Preferred dates open in Opera' : 'Constrained — alternate windows needed',
    },
    {
      id: 'opportunity',
      label: 'Opportunity',
      score: opportunityScore,
      detail: `${req.headcount} guests · ${req.eventType}`,
    },
    {
      id: 'profit',
      label: 'Profit potential',
      score: profitScore,
      detail: `$${Math.round(perGuest).toLocaleString()}/guest · ${roomNights} room nights`,
    },
  ]

  let tier: RequestScoreTier
  if (flags.length >= 2 || score < 32) tier = 'likely_spam'
  else if (score >= 78 && flags.length === 0) tier = 'high_value'
  else if (score < 52) tier = 'low_priority'
  else tier = 'worth_review'

  return {
    score,
    tier,
    label: TIER_META[tier].label,
    reasons: reasons.slice(0, 4),
    flags,
    dimensions,
  }
}

export function sortRequestsByScore<T extends CventRequest>(requests: T[]): T[] {
  return [...requests].sort((a, b) => scoreCventRequest(b).score - scoreCventRequest(a).score)
}
