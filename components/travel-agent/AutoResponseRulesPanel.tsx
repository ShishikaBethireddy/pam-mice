'use client'

import { useState } from 'react'
import type { CventRequest } from '@/lib/cvent'
import { scoreCventRequest } from '@/lib/request-scoring'
import {
  DEFAULT_AUTO_RESPONSE_RULES,
  evaluateAutoResponseRules,
  autoResponseActionLabel,
  autoResponseActionStyle,
  type AutoResponseRule,
} from '@/lib/auto-response-rules'

export default function AutoResponseRulesPanel({ requests }: { requests: CventRequest[] }) {
  const [rules, setRules] = useState<AutoResponseRule[]>(DEFAULT_AUTO_RESPONSE_RULES)

  const matches = requests
    .map((req) => ({ req, match: evaluateAutoResponseRules(req, scoreCventRequest(req), rules) }))
    .filter((m) => m.match != null)

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  return (
    <section className="rounded-[12px] border border-[#d0d0d0] bg-white overflow-hidden">
      <div className="border-b border-[#ebe3d4] bg-[#fafafa] px-4 py-3">
        <p className="font-sans text-[10px] uppercase tracking-[1.4px] text-[#8e7351]">Automated response rules</p>
        <p className="font-sans text-[12px] text-[#585858] mt-0.5">
          Auto-draft proposals or decline low-value RFPs based on hotel preferences.
        </p>
      </div>

      <ul className="divide-y divide-[#f0f0f0]">
        {rules.map((rule) => {
          const style = autoResponseActionStyle(rule.action)
          return (
            <li key={rule.id} className="px-4 py-3 flex items-start gap-3">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={() => toggleRule(rule.id)}
                className="mt-1 accent-[#8e7351]"
                aria-label={`Enable ${rule.name}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-sans text-[13px] font-medium text-[#2b2b27]">{rule.name}</p>
                  <span
                    className="rounded-full px-2 py-0.5 font-sans text-[10px] font-medium"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {autoResponseActionLabel(rule.action)}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-[#969696] mt-0.5">{rule.description}</p>
              </div>
            </li>
          )
        })}
      </ul>

      {matches.length > 0 && (
        <div className="border-t border-[#ebe3d4] bg-[#f5f1ea] px-4 py-3">
          <p className="font-sans text-[11px] uppercase tracking-[1px] text-[#8e7351] mb-2">Active matches ({matches.length})</p>
          <ul className="space-y-1.5">
            {matches.slice(0, 4).map(({ req, match }) => {
              if (!match) return null
              const style = autoResponseActionStyle(match.rule.action)
              return (
                <li key={req.id} className="font-sans text-[12px] text-[#525249]">
                  <span className="font-medium text-[#2b2b27]">{req.clientName}</span>
                  <span className="mx-1">·</span>
                  <span style={{ color: style.color }}>{match.message}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}

export function AutoResponseBadge({ request }: { request: CventRequest }) {
  const match = evaluateAutoResponseRules(request, scoreCventRequest(request))
  if (!match) return null
  const style = autoResponseActionStyle(match.rule.action)
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-medium mt-0.5"
      style={{ background: style.bg, color: style.color }}
      title={match.message}
    >
      {autoResponseActionLabel(match.rule.action)}
    </span>
  )
}
