'use client'

import { useMemo, useState } from 'react'
import type { CventRequest, RequestEdits } from '@/lib/cvent'
import { calculateScenarioImpact, type ScenarioOverrides } from '@/lib/scenario-explorer'

export default function ScenarioExplorerPanel({
  request,
  edits,
}: {
  request: CventRequest
  edits: RequestEdits
}) {
  const [overrides, setOverrides] = useState<ScenarioOverrides>({
    dateShiftDays: 0,
    roomCountDelta: 0,
    nightsDelta: 0,
  })

  const impact = useMemo(() => calculateScenarioImpact(request, edits, overrides), [request, edits, overrides])

  return (
    <section className="rounded-[12px] border border-[#ebe3d4] bg-white p-4">
      <p className="font-sans text-[10px] uppercase tracking-[1.4px] text-[#8e7351] mb-1">Explore a scenario</p>
      <p className="font-sans text-[12px] text-[#585858] mb-4">
        Tweak dates and room block to preview revenue and profit impact before responding.
      </p>

      <div className="space-y-4 mb-4">
        <ScenarioSlider
          label="Shift arrival"
          value={overrides.dateShiftDays}
          min={-7}
          max={7}
          step={1}
          format={(v) => (v === 0 ? 'No shift' : `${v > 0 ? '+' : ''}${v} days`)}
          onChange={(v) => setOverrides((o) => ({ ...o, dateShiftDays: v }))}
        />
        <ScenarioSlider
          label="Peak rooms"
          value={overrides.roomCountDelta}
          min={-40}
          max={40}
          step={5}
          format={(v) => (v === 0 ? 'As requested' : `${v > 0 ? '+' : ''}${v} rooms`)}
          onChange={(v) => setOverrides((o) => ({ ...o, roomCountDelta: v }))}
        />
        <ScenarioSlider
          label="Stay length"
          value={overrides.nightsDelta}
          min={-2}
          max={3}
          step={1}
          format={(v) => (v === 0 ? 'As requested' : `${v > 0 ? '+' : ''}${v} nights`)}
          onChange={(v) => setOverrides((o) => ({ ...o, nightsDelta: v }))}
        />
      </div>

      <div className="rounded-[10px] bg-[#f5f1ea] p-3 border border-[#ebe3d4]">
        <p className="font-sans text-[11px] text-[#8e7351] mb-2">{impact.summary}</p>
        <dl className="grid grid-cols-2 gap-2 font-sans text-[12px]">
          <div>
            <dt className="text-[#969696]">Projected revenue</dt>
            <dd className="font-semibold text-[#2b2b27]">${impact.projectedRevenue.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-[#969696]">Projected profit</dt>
            <dd className="font-semibold text-[#2b2b27]">${impact.projectedProfit.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-[#969696]">Δ vs baseline</dt>
            <dd className={impact.revenueDelta >= 0 ? 'text-[#2d5a3d] font-medium' : 'text-[#8b3a3a] font-medium'}>
              {impact.revenueDelta >= 0 ? '+' : ''}${impact.revenueDelta.toLocaleString()} rev
            </dd>
          </div>
          <div>
            <dt className="text-[#969696]">Room nights</dt>
            <dd className="font-medium text-[#2b2b27]">
              {impact.projectedRoomNights.toLocaleString()}
              {impact.roomNightsDelta !== 0 && (
                <span className="text-[#8e7351] ml-1">
                  ({impact.roomNightsDelta > 0 ? '+' : ''}
                  {impact.roomNightsDelta})
                </span>
              )}
            </dd>
          </div>
        </dl>
        <p className="mt-2 font-sans text-[11px] text-[#969696]">Margin {impact.marginPct}% · baseline ${impact.baselineRevenue.toLocaleString()}</p>
      </div>
    </section>
  )
}

function ScenarioSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <div className="flex justify-between font-sans text-[12px] mb-1">
        <span className="text-[#585858]">{label}</span>
        <span className="font-medium text-[#2b2b27]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-[#8e7351]"
      />
    </label>
  )
}
