import type { CventRequest } from './cvent'
import type { RequestScore } from './request-scoring'

export type AutoResponseAction = 'auto_draft' | 'auto_decline' | 'flag_review'

export interface AutoResponseRule {
  id: string
  name: string
  description: string
  action: AutoResponseAction
  enabled: boolean
}

export interface AutoResponseMatch {
  rule: AutoResponseRule
  message: string
}

export const DEFAULT_AUTO_RESPONSE_RULES: AutoResponseRule[] = [
  {
    id: 'high-value-draft',
    name: 'High-value auto-draft',
    description: 'Score ≥ 78 with no spam flags → queue interactive proposal draft',
    action: 'auto_draft',
    enabled: true,
  },
  {
    id: 'spam-decline',
    name: 'Likely spam decline',
    description: 'Likely spam tier or 2+ flags → auto-decline with polite template',
    action: 'auto_decline',
    enabled: true,
  },
  {
    id: 'low-budget-review',
    name: 'Low budget review',
    description: 'Budget per guest under $150 → flag for manual review before responding',
    action: 'flag_review',
    enabled: true,
  },
  {
    id: 'no-availability',
    name: 'No availability alternate',
    description: 'Preferred dates unavailable → auto-draft with alternate date options',
    action: 'auto_draft',
    enabled: true,
  },
  {
    id: 'mega-program',
    name: 'Mega program priority',
    description: '500+ guests → flag for director review and expedited draft',
    action: 'flag_review',
    enabled: true,
  },
]

export function evaluateAutoResponseRules(
  req: CventRequest,
  score: RequestScore,
  rules: AutoResponseRule[] = DEFAULT_AUTO_RESPONSE_RULES,
): AutoResponseMatch | null {
  const enabled = rules.filter((r) => r.enabled)
  const perGuest = req.budget.amount / Math.max(1, req.headcount)

  for (const rule of enabled) {
    if (rule.id === 'spam-decline' && (score.tier === 'likely_spam' || score.flags.length >= 2)) {
      return { rule, message: 'Rule matched — recommend auto-decline' }
    }
    if (rule.id === 'high-value-draft' && score.tier === 'high_value' && score.flags.length === 0) {
      return { rule, message: 'Rule matched — draft proposal queued' }
    }
    if (rule.id === 'low-budget-review' && perGuest < 150) {
      return { rule, message: 'Rule matched — hold for revenue review' }
    }
    if (rule.id === 'no-availability' && !req.datesAvailable) {
      return { rule, message: 'Rule matched — draft with alternate dates' }
    }
    if (rule.id === 'mega-program' && req.headcount >= 500) {
      return { rule, message: 'Rule matched — director review required' }
    }
  }

  return null
}

export function autoResponseActionLabel(action: AutoResponseAction) {
  const map = {
    auto_draft: 'Auto-draft',
    auto_decline: 'Auto-decline',
    flag_review: 'Review',
  }
  return map[action]
}

export function autoResponseActionStyle(action: AutoResponseAction) {
  const map = {
    auto_draft: { bg: '#e8f5e9', color: '#2d5a3d' },
    auto_decline: { bg: '#fde8e8', color: '#8b3a3a' },
    flag_review: { bg: '#fff8e6', color: '#8e7351' },
  }
  return map[action]
}
