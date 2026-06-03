import type { CventRequest } from './cvent'
import { NOBU_ROOM_TYPES } from './cvent'
import type { RequestEdits } from './cvent'
import { getLeadInsights } from './lead-insights'

export interface ScenarioOverrides {
  dateShiftDays: number
  roomCountDelta: number
  nightsDelta: number
}

export interface ScenarioImpact {
  baselineRevenue: number
  baselineProfit: number
  projectedRevenue: number
  projectedProfit: number
  revenueDelta: number
  profitDelta: number
  projectedRoomNights: number
  roomNightsDelta: number
  marginPct: number
  summary: string
}

export function calculateScenarioImpact(
  request: CventRequest,
  edits: RequestEdits,
  overrides: ScenarioOverrides,
): ScenarioImpact {
  const baseline = getLeadInsights(request)
  const avgRate =
    edits.roomTypes.reduce((sum, row) => {
      const type = NOBU_ROOM_TYPES.find((t) => t.id === row.roomTypeId)
      return sum + (type?.baseRate ?? 520) * row.count
    }, 0) / Math.max(1, edits.roomTypes.reduce((s, r) => s + r.count, 0)) || 520

  const projectedRooms = Math.max(1, request.roomBlock.rooms + overrides.roomCountDelta)
  const projectedNights = Math.max(1, edits.roomBlock.nights + overrides.nightsDelta)
  const projectedRoomNights = projectedRooms * projectedNights

  const dateFactor = overrides.dateShiftDays === 0 ? 1 : overrides.dateShiftDays > 0 ? 0.97 : 1.03
  const roomFactor = projectedRooms / Math.max(1, request.roomBlock.rooms)
  const nightFactor = projectedNights / Math.max(1, edits.roomBlock.nights)

  const projectedRevenue = Math.round(
    baseline.estimatedRevenue * roomFactor * nightFactor * dateFactor,
  )
  const projectedProfit = Math.round(projectedRevenue * (baseline.profitMarginPct / 100))
  const revenueDelta = projectedRevenue - baseline.estimatedRevenue
  const profitDelta = projectedProfit - baseline.estimatedProfit
  const marginPct = Math.round((projectedProfit / Math.max(1, projectedRevenue)) * 100)

  let summary = 'Baseline scenario'
  if (overrides.dateShiftDays !== 0) {
    summary = overrides.dateShiftDays > 0
      ? `Shift +${overrides.dateShiftDays} days — softer demand window`
      : `Shift ${overrides.dateShiftDays} days — premium shoulder dates`
  }
  if (overrides.roomCountDelta !== 0) {
    summary += overrides.roomCountDelta > 0 ? ' · larger block' : ' · trimmed block'
  }

  return {
    baselineRevenue: baseline.estimatedRevenue,
    baselineProfit: baseline.estimatedProfit,
    projectedRevenue,
    projectedProfit,
    revenueDelta,
    profitDelta,
    projectedRoomNights,
    roomNightsDelta: projectedRoomNights - baseline.peakRoomNights,
    marginPct,
    summary,
  }
}
