import { scoreCventRequest, scoreTierMeta } from '@/lib/request-scoring'
import type { CventRequest } from '@/lib/cvent'

export function ValueScoreBadge({ request, compact }: { request: CventRequest; compact?: boolean }) {
  const result = scoreCventRequest(request)
  const meta = scoreTierMeta(result.tier)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-sans font-medium ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}
      style={{ background: meta.bg, color: meta.color }}
      title={`Score ${result.score}/100`}
    >
      {result.label}
      <span className="opacity-70">· {result.score}</span>
    </span>
  )
}

export function ValueScoreDetail({ request }: { request: CventRequest }) {
  const result = scoreCventRequest(request)
  const meta = scoreTierMeta(result.tier)
  return (
    <motionlessScore className="rounded-[12px] p-4 border border-[#ebe3d4] bg-white">
      <motionlessHeader className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[1.4px] text-[#969696]">Lead score</p>
          <p className="font-sans font-medium text-[15px]" style={{ color: meta.color }}>
            {result.label}
          </p>
        </motionlessHeader>
        <span className="font-sans text-[22px] font-semibold text-[#2b2b27]">{result.score}</span>
      </motionlessHeader>
      <p className="font-sans text-[11px] text-[#969696] mb-3">
        Prioritized by availability, opportunity, and profit potential.
      </p>

      <div className="space-y-2 mb-3">
        {result.dimensions.map((dim) => (
          <div key={dim.id}>
            <motionlessRow className="flex justify-between font-sans text-[11px] mb-0.5">
              <span className="text-[#585858]">{dim.label}</span>
              <span className="font-medium text-[#2b2b27]">{dim.score}</span>
            </motionlessRow>
            <div className="h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
              <div className="h-full rounded-full bg-[#8e7351]" style={{ width: `${dim.score}%` }} />
            </div>
            <p className="font-sans text-[10px] text-[#969696] mt-0.5">{dim.detail}</p>
          </div>
        ))}
      </motionlessHeader>

      {result.reasons.length > 0 && (
        <ul className="mb-2 space-y-0.5 font-sans text-[11px] text-[#585858] border-t border-[#f0f0f0] pt-2">
          {result.reasons.map((r) => (
            <li key={r}>+ {r}</li>
          ))}
        </ul>
      )}
      {result.flags.length > 0 && (
        <ul className="space-y-0.5 font-sans text-[11px] text-[#8b3a3a]">
          {result.flags.map((f) => (
            <li key={f}>⚠ {f}</li>
          ))}
        </ul>
      )}
    </motionlessScore>
  )
}
