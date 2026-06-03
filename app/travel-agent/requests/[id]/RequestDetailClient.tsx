'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TravelAgentShell from '@/components/travel-agent/TravelAgentShell'
import {
  type CventRequest,
  type RequestEdits,
  type RoomTypeAllocation,
  type ParsedExtraService,
  type InventoryOption,
  getInventoryForRequest,
  buildDraftProposal,
  formatDateRange,
  statusLabel,
  createRequestEdits,
  recalcRoomBlock,
  sumRoomTypeCounts,
  newExtraService,
  newRoomTypeAllocation,
  getProposalHistoryForRequest,
  proposalHistoryStatusLabel,
  type ProposalHistoryEntry,
  NOBU_ROOM_TYPES,
  EXTRA_SERVICE_CATEGORIES,
  dateFlexibilityLabel,
  budgetTypeLabel,
  type CventIntakeEdits,
  type DateFlexibility,
  type CventBudget,
} from '@/lib/cvent'
import { buildRpaSyncFields } from '@/lib/proposal-experience'
import { ValueScoreBadge, ValueScoreDetail } from '@/components/travel-agent/ValueScoreBadge'

type RequestView = 'workflow' | 'history'

type WizardStep = 'cvent-intake' | 'room-block' | 'services' | 'review'

const STEPS: { id: WizardStep; label: string; num: number }[] = [
  { id: 'cvent-intake', label: 'RPA sync', num: 1 },
  { id: 'room-block', label: 'Rooms', num: 2 },
  { id: 'services', label: 'Build', num: 3 },
  { id: 'review', label: 'Publish', num: 4 },
]

const STEP_ORDER: WizardStep[] = ['cvent-intake', 'room-block', 'services', 'review']

const inputClass =
  'w-full rounded-[8px] border border-[#d0d0d0] px-3 py-2 font-sans text-[14px] text-[#2b2b27] bg-white focus:outline-none focus:border-[#8e7351]'

export default function RequestDetailClient({ request }: { request: CventRequest }) {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>('cvent-intake')
  const [view, setView] = useState<RequestView>('workflow')
  const [edits, setEdits] = useState<RequestEdits>(() => createRequestEdits(request))
  const [generating, setGenerating] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState('nobu-cabos')

  const history = getProposalHistoryForRequest(request.id)

  const inventory = getInventoryForRequest(request.id)
  const cventRoomTarget = request.roomBlock.rooms
  const allocatedRooms = sumRoomTypeCounts(edits.roomTypes)
  const roomMismatch = allocatedRooms !== cventRoomTarget
  const stepIndex = STEP_ORDER.indexOf(step)

  function updateIntake(patch: Partial<CventIntakeEdits>) {
    setEdits((prev) => {
      const intake = { ...prev.intake, ...patch }
      const roomBlock =
        patch.billingCode !== undefined
          ? { ...prev.roomBlock, billingCode: patch.billingCode || undefined }
          : prev.roomBlock
      return { ...prev, intake, roomBlock }
    })
  }

  function goNext() {
    if (step === 'cvent-intake') {
      setEdits((prev) => ({
        ...prev,
        roomBlock: {
          ...prev.roomBlock,
          billingCode: prev.intake.billingCode,
          checkIn: request.preferredDates.start,
          checkOut: request.preferredDates.end,
        },
      }))
    }
    const i = stepIndex
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1])
  }

  function goBack() {
    if (stepIndex > 0) setStep(STEP_ORDER[stepIndex - 1])
  }

  function updateRoomBlock(patch: Partial<RequestEdits['roomBlock']>) {
    setEdits((prev) => {
      let roomBlock = { ...prev.roomBlock, ...patch }
      if (patch.nights != null) {
        roomBlock = recalcRoomBlock(roomBlock, prev.roomTypes)
      }
      return { ...prev, roomBlock }
    })
  }

  function updateRoomType(id: string, patch: Partial<RoomTypeAllocation>) {
    setEdits((prev) => {
      const roomTypes = prev.roomTypes.map((r) => (r.id === id ? { ...r, ...patch } : r))
      return { ...prev, roomTypes, roomBlock: recalcRoomBlock(prev.roomBlock, roomTypes) }
    })
  }

  function removeRoomType(id: string) {
    setEdits((prev) => {
      const roomTypes = prev.roomTypes.filter((r) => r.id !== id)
      return { ...prev, roomTypes, roomBlock: recalcRoomBlock(prev.roomBlock, roomTypes) }
    })
  }

  function addRoomType() {
    setEdits((prev) => ({ ...prev, roomTypes: [...prev.roomTypes, newRoomTypeAllocation()] }))
  }

  function updateService(id: string, patch: Partial<ParsedExtraService>) {
    setEdits((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  function removeService(id: string) {
    setEdits((prev) => ({ ...prev, extraServices: prev.extraServices.filter((s) => s.id !== id) }))
  }

  function addService() {
    setEdits((prev) => ({ ...prev, extraServices: [...prev.extraServices, newExtraService()] }))
  }

  function handleGenerate(propertyId?: string) {
    setGenerating(true)
    setTimeout(() => {
      const proposal = buildDraftProposal(request.id, propertyId ?? selectedPropertyId, edits)
      setGenerating(false)
      if (proposal) router.push(`/travel-agent/proposals/${proposal.id}`)
    }, 900)
  }

  const wizardActions =
    view === 'workflow' ? (
      step !== 'review' ? (
        <>
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="rounded-[8px] px-5 py-2 font-sans text-[13px] font-medium border border-[#d0d0d0] text-[#2b2b27] hover:bg-[#fafafa]"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            className="rounded-[8px] px-5 py-2 font-sans text-[13px] font-medium text-white"
            style={{ background: '#18181a' }}
          >
            {step === 'cvent-intake' ? 'Continue to room block' : 'Continue'} →
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={generating}
          className="rounded-[8px] px-5 py-2 font-sans text-[13px] font-medium disabled:opacity-60"
          style={{ background: '#d6bfa4', color: '#18181a' }}
        >
          {generating ? 'Publishing…' : 'Publish interactive proposal'}
        </button>
      )
    ) : null

  return (
    <TravelAgentShell
      title={request.clientName}
      backHref="/travel-agent"
      backLabel="← Inbox"
      actions={wizardActions}
    >
      <div className="border-b border-[#d0d0d0] bg-white px-5 py-3">
        <div className="flex gap-2 mb-3">
          <ViewTab active={view === 'workflow'} onClick={() => setView('workflow')} label="Build proposal" />
          <ViewTab
            active={view === 'history'}
            onClick={() => setView('history')}
            label={`History${history.length > 0 ? ` (${history.length})` : ''}`}
          />
        </div>
        {view === 'workflow' && (
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full font-sans text-[11px] font-semibold"
                style={{
                  background: s.num <= STEPS[stepIndex].num ? '#18181a' : '#f0f0f0',
                  color: s.num <= STEPS[stepIndex].num ? 'white' : '#969696',
                }}
              >
                {s.num}
              </div>
              <span className="font-sans text-[10px] text-center text-[#585858] leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5 pb-32">
        <ValueScoreDetail request={request} />

        {view === 'history' ? (
          <ProposalHistoryPanel history={history} request={request} />
        ) : (
          <>
        {step !== 'cvent-intake' && <RequestMeta request={request} />}

        <ContextBanner step={step} request={request} cventRoomTarget={cventRoomTarget} />

        {step === 'cvent-intake' && (
          <CventIntakeStep request={request} edits={edits} onUpdateIntake={updateIntake} />
        )}

        {step === 'room-block' && (
          <RoomBlockStep
            edits={edits}
            cventRoomTarget={cventRoomTarget}
            allocatedRooms={allocatedRooms}
            roomMismatch={roomMismatch}
            onUpdateBlock={updateRoomBlock}
            onUpdateRoomType={updateRoomType}
            onRemoveRoomType={removeRoomType}
            onAddRoomType={addRoomType}
          />
        )}

        {step === 'services' && (
          <ServicesStep
            services={edits.extraServices}
            onUpdate={updateService}
            onRemove={removeService}
            onAdd={addService}
          />
        )}

        {step === 'review' && (
          <ReviewStep
            request={request}
            edits={edits}
            inventory={inventory}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={setSelectedPropertyId}
            onGenerate={handleGenerate}
          />
        )}
          </>
        )}
      </div>

      </div>
    </TravelAgentShell>
        {step !== 'review' ? (
          <div className="flex gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="h-[48px] flex-1 rounded-full font-sans text-[14px] font-medium border border-[#d0d0d0] text-[#2b2b27]"
              >
                Back
              </button>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={goNext}
              className="h-[48px] flex-[2] rounded-full font-sans text-[14px] font-medium"
              style={{ background: '#18181a', color: 'white' }}
            >
              {step === 'cvent-intake' ? 'Continue to room block' : 'Continue'}
              <span className="ml-1" aria-hidden>
                →
              </span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerate()}
            disabled={generating}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full font-sans text-[14px] font-medium disabled:opacity-60"
            style={{ background: '#d6bfa4', color: '#18181a' }}
          >
            {generating ? 'Publishing…' : 'Publish interactive proposal'}
          </motion.button>
        )}
      </div>
      )}
    </TravelAgentShell>
  )
}

function ViewTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[8px] px-3 py-2 text-left font-sans text-[13px] font-medium transition-colors"
      style={{
        background: active ? '#f5f1ea' : 'transparent',
        color: active ? '#2b2b27' : '#585858',
      }}
    >
      {label}
    </button>
  )
}

function ProposalHistoryPanel({
  history,
  request,
}: {
  history: ProposalHistoryEntry[]
  request: CventRequest
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-[12px] bg-white p-6 border border-[#d0d0d0] text-center">
        <p className="font-sans text-[14px] text-[#2b2b27] mb-1">No proposals yet</p>
        <p className="font-sans text-[12px] text-[#969696]">
          Build and send a proposal — each version will appear here with negotiation notes.
        </p>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="font-sans text-[12px] text-[#585858]">
        Track iterations with {request.agentName} ({request.agencyName}). Open any version or finalize the latest to
        send back via Cvent.
      </p>
      {history.map((entry) => (
        <div key={entry.id} className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-sans font-medium text-[14px] text-[#2b2b27]">
                v{entry.version} · {entry.label}
              </p>
              <p className="font-sans text-[11px] text-[#969696]">
                {formatHistoryDate(entry.createdAt)}
                {entry.sentAt ? ` · Sent ${formatHistoryDate(entry.sentAt)}` : ''}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium"
              style={{
                background: entry.status === 'finalized' ? '#e8f5e9' : entry.status === 'draft' ? '#f0f0f0' : '#f5f1ea',
                color: entry.status === 'finalized' ? '#2d5a3d' : '#8e7351',
              }}
            >
              {proposalHistoryStatusLabel(entry.status)}
            </span>
          </div>
          <p className="font-sans text-[15px] font-medium text-[#2b2b27] mb-2">${entry.grandTotal.toLocaleString()}</p>
          {entry.notes && <p className="font-sans text-[12px] text-[#585858] mb-2">{entry.notes}</p>}
          {entry.agentFeedback && (
            <p className="font-sans text-[12px] text-[#8e7351] italic mb-3">&ldquo;{entry.agentFeedback}&rdquo;</p>
          )}
          <Link
            href={`/travel-agent/proposals/${entry.proposalId.replace(/-v\d+$/, '')}`}
            className="font-sans text-[13px] font-medium text-[#8e7351]"
          >
            View proposal →
          </Link>
        </div>
      ))}
    </section>
  )
}

function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function RpaSyncPanel({
  syncing,
  fields,
  cventRef,
}: {
  syncing: boolean
  fields: ReturnType<typeof buildRpaSyncFields>
  cventRef: string
}) {
  const synced = fields.filter((f) => f.status === 'synced').length
  return (
    <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <p className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351]">
            RPA · Cvent → PMS
          </p>
          <p className="font-sans text-[11px] text-[#969696] mt-0.5">
            {syncing ? `Syncing ${cventRef}…` : `${synced}/${fields.length} fields synced · Opera + Delphi`}
          </p>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full ${syncing ? 'animate-pulse bg-[#d6bfa4]' : 'bg-[#4caf50]'}`}
          aria-hidden
        />
      </div>
      <ul className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
        {fields.map((f) => (
          <li key={f.id} className="flex items-center justify-between gap-2 font-sans text-[11px]">
            <span className="text-[#585858]">
              <span className="text-[#969696] uppercase text-[9px] mr-1">{f.source}</span>
              {f.label}
            </span>
            <span className="text-[#2b2b27] font-medium truncate max-w-[48%] text-right">{f.value}</span>
          </li>
        ))}
      </ul>
      {!syncing && (
        <p className="mt-3 font-sans text-[11px] text-[#8e7351]">
          Room block & rates flow to step 2 — no manual re-entry.
        </p>
      )}
    </div>
  )
}

function ContextBanner({
  step,
  request,
  cventRoomTarget,
}: {
  step: WizardStep
  request: CventRequest
  cventRoomTarget: number
}) {
  const copy: Record<WizardStep, string> = {
    'cvent-intake': 'RPA pulled Cvent RFP data into PMS — confirm synced fields before room block.',
    'room-block': `PMS holds ${cventRoomTarget} rooms · ${request.roomBlock.nights} nights — assign categories.`,
    services: 'Build modular proposal sections (AV, F&B, entertainment).',
    review: 'Preview client-facing modules, pick property, publish secure web proposal.',
  }
  return (
    <div className="rounded-[12px] p-3" style={{ background: '#18181a' }}>
      <p className="font-sans text-[10px] uppercase tracking-[1.6px]" style={{ color: '#d6bfa4' }}>
        Parsed from Cvent · {request.cventRef}
      </p>
      <p className="font-sans text-[12px] mt-1" style={{ color: '#bebeb9' }}>
        {copy[step]}
      </p>
    </div>
  )
}

function CventIntakeStep({
  request,
  edits,
  onUpdateIntake,
}: {
  request: CventRequest
  edits: RequestEdits
  onUpdateIntake: (patch: Partial<CventIntakeEdits>) => void
}) {
  const { intake } = edits
  const { budget } = intake

  function updateBudget(patch: Partial<CventBudget>) {
    onUpdateIntake({ budget: { ...budget, ...patch } })
  }

  const [rpaSyncing, setRpaSyncing] = useState(true)
  const syncFields = buildRpaSyncFields(request)

  useEffect(() => {
    const t = setTimeout(() => setRpaSyncing(false), 900)
    return () => clearTimeout(t)
  }, [request.id])

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <RpaSyncPanel syncing={rpaSyncing} fields={syncFields} cventRef={request.cventRef} />

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">
          Client & agency
        </h2>
        <dl className="grid gap-2 font-sans text-[13px]">
          <IntakeRow label="Client" value={request.clientName} />
          <IntakeRow label="Agency" value={request.agencyName} />
          <IntakeRow label="Agent" value={`${request.agentName} · ${request.agentEmail}`} />
          <IntakeRow label="Event type" value={request.eventType} />
          <IntakeRow label="Headcount" value={`${request.headcount} guests`} />
        </dl>
      </div>

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">
          Location & billing
        </h2>
        <div className="grid gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-[#969696]">Event / destination state</span>
            <input
              type="text"
              className={inputClass}
              value={intake.eventLocationState}
              onChange={(e) => onUpdateIntake({ eventLocationState: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-[#969696]">Client HQ state</span>
            <input
              type="text"
              className={inputClass}
              value={intake.clientHeadquartersState ?? ''}
              placeholder="Optional"
              onChange={(e) => onUpdateIntake({ clientHeadquartersState: e.target.value || undefined })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-[#969696]">Billing / room block code</span>
            <input
              type="text"
              className={inputClass}
              value={intake.billingCode ?? ''}
              placeholder="From Cvent RFP"
              onChange={(e) => onUpdateIntake({ billingCode: e.target.value || undefined })}
            />
          </label>
        </div>
      </div>

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">Dates</h2>
        <IntakeRow
          label="Preferred stay"
          value={formatDateRange(request.preferredDates.start, request.preferredDates.end)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className="rounded-full px-2.5 py-1 font-sans text-[11px] font-medium"
            style={{ background: '#f5f1ea', color: '#8e7351' }}
          >
            {dateFlexibilityLabel(intake.dateFlexibility)}
          </span>
          {!request.datesAvailable && (
            <span className="rounded-full px-2.5 py-1 font-sans text-[11px] font-medium bg-[#fff0f0] text-[#a33]">
              Dates need alternates
            </span>
          )}
        </div>
        <label className="mt-3 flex flex-col gap-1">
          <span className="font-sans text-[11px] text-[#969696]">Date flexibility</span>
          <select
            className={inputClass}
            value={intake.dateFlexibility}
            onChange={(e) => onUpdateIntake({ dateFlexibility: e.target.value as DateFlexibility })}
          >
            <option value="firm">Firm dates</option>
            <option value="flexible">Flexible dates</option>
            <option value="alternate_ok">Open to alternates</option>
          </select>
        </label>
        <label className="mt-3 flex flex-col gap-1">
          <span className="font-sans text-[11px] text-[#969696]">Flexibility notes</span>
          <textarea
            className={`${inputClass} min-h-[56px] resize-y`}
            value={intake.flexibleDateNotes ?? ''}
            placeholder="e.g. ±5 days, weekday preference"
            onChange={(e) => onUpdateIntake({ flexibleDateNotes: e.target.value || undefined })}
          />
        </label>
        {request.alternateDateWindows && request.alternateDateWindows.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
            <p className="font-sans text-[11px] text-[#969696] mb-2">Alternate windows from Cvent</p>
            <ul className="space-y-2">
              {request.alternateDateWindows.map((w, i) => (
                <li key={i} className="font-sans text-[12px] text-[#2b2b27]">
                  {w.label ? `${w.label}: ` : ''}
                  {formatDateRange(w.start, w.end)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">Budget</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="font-sans text-[11px] text-[#969696]">Amount ({budget.currency})</span>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={budget.amount}
              onChange={(e) => updateBudget({ amount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-[#969696]">Budget type</span>
            <select
              className={inputClass}
              value={budget.type}
              onChange={(e) => updateBudget({ type: e.target.value as CventBudget['type'] })}
            >
              <option value="firm">Firm budget</option>
              <option value="target">Target budget</option>
              <option value="not_to_exceed">Not to exceed</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 col-span-2">
            <span className="font-sans text-[11px] text-[#969696]">Budget notes</span>
            <textarea
              className={`${inputClass} min-h-[48px] resize-y`}
              value={budget.notes ?? ''}
              placeholder="Scope, inclusions, exclusions"
              onChange={(e) => updateBudget({ notes: e.target.value || undefined })}
            />
          </label>
        </div>
        <p className="mt-3 font-sans text-[14px] font-medium text-[#2b2b27]">
          {budgetTypeLabel(budget.type)} ·{' '}
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: budget.currency, maximumFractionDigits: 0 }).format(
            budget.amount,
          )}
        </p>
      </div>

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">
          Room block preview (Cvent)
        </h2>
        <dl className="grid grid-cols-2 gap-2 font-sans text-[12px]">
          <div>
            <dt className="text-[#969696]">Peak rooms</dt>
            <dd className="font-medium text-[#2b2b27]">{request.roomBlock.rooms}</dd>
          </div>
          <div>
            <dt className="text-[#969696]">Nights</dt>
            <dd className="font-medium text-[#2b2b27]">{request.roomBlock.nights}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[#969696]">Room nights</dt>
            <dd className="font-medium text-[#2b2b27]">{request.roomBlock.roomNights}</dd>
          </div>
          {request.roomBlock.suiteCount != null && (
            <div>
              <dt className="text-[#969696]">Suites requested</dt>
              <dd className="font-medium text-[#2b2b27]">{request.roomBlock.suiteCount}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 font-sans text-[12px] text-[#585858]">
          {request.extraServices.length} parsed service line{request.extraServices.length === 1 ? '' : 's'} — edit on the
          next steps.
        </p>
      </div>

      <div className="rounded-[12px] bg-[#f5f1ea] p-4 border border-[#ebe3d4] xl:col-span-2">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-2">RFP excerpt</h2>
        <p className="font-sans text-[12px] leading-[18px] text-[#525249] italic">&ldquo;{request.rawExcerpt}&rdquo;</p>
      </div>
    </section>
  )
}

function IntakeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#f5f1ea] pb-2 last:border-0 last:pb-0">
      <span className="text-[#969696] shrink-0">{label}</span>
      <span className="text-[#2b2b27] text-right font-medium">{value}</span>
    </div>
  )
}

function RequestMeta({ request }: { request: CventRequest }) {
  return (
    <div className="rounded-[12px] bg-white p-4 border border-[#d0d0d0]">
      <div className="flex justify-between items-start mb-2">
        <span className="font-sans text-[11px] text-[#969696]">{request.cventRef}</span>
        <div className="flex flex-col items-end gap-1">
          <ValueScoreBadge request={request} compact />
          <span className="font-sans text-[11px] font-medium text-[#8e7351]">{statusLabel(request.status)}</span>
        </div>
      </div>
      <p className="font-sans text-[13px] text-[#585858]">
        {request.agencyName} · {request.agentName}
      </p>
      <p className="font-sans text-[12px] text-[#969696]">{request.agentEmail}</p>
      <p className="mt-2 font-sans text-[13px] text-[#2b2b27]">
        {request.eventType} · {request.headcount} guests
      </p>
      {request.proposalId && (
        <Link href={`/travel-agent/proposals/${request.proposalId}`} className="mt-2 inline-block font-sans text-[13px] font-medium text-[#8e7351]">
          View existing draft →
        </Link>
      )}
    </div>
  )
}

function RoomBlockStep({
  edits,
  cventRoomTarget,
  allocatedRooms,
  roomMismatch,
  onUpdateBlock,
  onUpdateRoomType,
  onRemoveRoomType,
  onAddRoomType,
}: {
  edits: RequestEdits
  cventRoomTarget: number
  allocatedRooms: number
  roomMismatch: boolean
  onUpdateBlock: (p: Partial<RequestEdits['roomBlock']>) => void
  onUpdateRoomType: (id: string, p: Partial<RoomTypeAllocation>) => void
  onRemoveRoomType: (id: string) => void
  onAddRoomType: () => void
}) {
  const { roomBlock, roomTypes } = edits

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">Stay dates</h2>
        <StayDatesForm roomBlock={roomBlock} onUpdateBlock={onUpdateBlock} />
      </div>

      <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351]">Room types</h2>
            <p className="font-sans text-[12px] text-[#585858] mt-1">Assign counts per room category</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[20px] font-medium text-[#2b2b27]">{allocatedRooms}</p>
            <p className="font-sans text-[10px] text-[#969696]">of {cventRoomTarget} from Cvent</p>
          </div>
        </div>

        {roomMismatch && (
          <div className="mb-3 rounded-[8px] px-3 py-2" style={{ background: '#fff8e6', border: '1px solid #ebe3d4' }}>
            <p className="font-sans text-[12px] text-[#8e7351]">
              Total ({allocatedRooms}) doesn&apos;t match Cvent request ({cventRoomTarget}). Adjust counts or continue if intentional.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {roomTypes.map((row) => (
            <RoomTypeRow key={row.id} row={row} onUpdate={onUpdateRoomType} onRemove={onRemoveRoomType} canRemove={roomTypes.length > 1} />
          ))}
        </div>

        <button type="button" onClick={onAddRoomType} className="mt-4 w-full h-[40px] rounded-[8px] border border-dashed border-[#d0d0d0] font-sans text-[13px] text-[#585858]">
          + Add room type
        </button>

        <dl className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-[#f0f0f0] font-sans text-[12px]">
          <div>
            <dt className="text-[#969696]">Room nights</dt>
            <dd className="font-medium text-[#2b2b27]">{roomBlock.roomNights}</dd>
          </div>
          <div>
            <dt className="text-[#969696]">Stay</dt>
            <dd className="font-medium text-[#2b2b27]">{formatDateRange(roomBlock.checkIn, roomBlock.checkOut)}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function StayDatesForm({
  roomBlock,
  onUpdateBlock,
}: {
  roomBlock: RequestEdits['roomBlock']
  onUpdateBlock: (p: Partial<RequestEdits['roomBlock']>) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] text-[#969696]">Check-in</span>
        <input type="date" className={inputClass} value={roomBlock.checkIn} onChange={(e) => onUpdateBlock({ checkIn: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] text-[#969696]">Check-out</span>
        <input type="date" className={inputClass} value={roomBlock.checkOut} onChange={(e) => onUpdateBlock({ checkOut: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 col-span-2">
        <span className="font-sans text-[11px] text-[#969696]">Nights</span>
        <input
          type="number"
          min={1}
          className={inputClass}
          value={roomBlock.nights}
          onChange={(e) => onUpdateBlock({ nights: Math.max(1, parseInt(e.target.value, 10) || 1) })}
        />
      </label>
      <label className="flex flex-col gap-1 col-span-2">
        <span className="font-sans text-[11px] text-[#969696]">Billing / room block code</span>
        <input
          type="text"
          className={inputClass}
          value={roomBlock.billingCode ?? ''}
          placeholder="Optional"
          onChange={(e) => onUpdateBlock({ billingCode: e.target.value || undefined })}
        />
      </label>
    </div>
  )
}

function RoomTypeRow({
  row,
  onUpdate,
  onRemove,
  canRemove,
}: {
  row: RoomTypeAllocation
  onUpdate: (id: string, p: Partial<RoomTypeAllocation>) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  const typeMeta = NOBU_ROOM_TYPES.find((t) => t.id === row.roomTypeId)
  return (
    <div className="rounded-[10px] border border-[#ebe3d4] p-3 bg-[#fafafa]">
      <div className="flex gap-2">
        <label className="flex-[2] flex flex-col gap-1 min-w-0">
          <span className="font-sans text-[10px] text-[#969696]">Room type</span>
          <select className={inputClass} value={row.roomTypeId} onChange={(e) => onUpdate(row.id, { roomTypeId: e.target.value })}>
            {NOBU_ROOM_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="w-[72px] flex flex-col gap-1">
          <span className="font-sans text-[10px] text-[#969696]">Count</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={row.count}
            onChange={(e) => onUpdate(row.id, { count: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        {canRemove && (
          <button type="button" onClick={() => onRemove(row.id)} className="self-end mb-1 px-2 font-sans text-[18px] text-[#969696]" aria-label="Remove">
            ×
          </button>
        )}
      </div>
      {typeMeta?.description && <p className="mt-1 font-sans text-[10px] text-[#969696]">{typeMeta.description}</p>}
    </div>
  )
}

function ServicesStep({
  services,
  onUpdate,
  onRemove,
  onAdd,
}: {
  services: ParsedExtraService[]
  onUpdate: (id: string, p: Partial<ParsedExtraService>) => void
  onRemove: (id: string) => void
  onAdd: () => void
}) {
  return (
    <section className="flex flex-col gap-3">
      <p className="font-sans text-[12px] text-[#585858]">Edit parsed services or add custom line items for the proposal.</p>
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} onUpdate={onUpdate} onRemove={onRemove} canRemove={services.length > 1} />
      ))}
      <button type="button" onClick={onAdd} className="h-[44px] rounded-[8px] border border-dashed border-[#d0d0d0] font-sans text-[13px] text-[#585858]">
        + Add service
      </button>
    </section>
  )
}

function ServiceCard({
  service,
  onUpdate,
  onRemove,
  canRemove,
}: {
  service: ParsedExtraService
  onUpdate: (id: string, p: Partial<ParsedExtraService>) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-[12px] border border-[#ebe3d4] bg-white p-4">
      <ServiceCardHeader service={service} onUpdate={onUpdate} onRemove={onRemove} canRemove={canRemove} />
      <label className="flex flex-col gap-1 mt-3">
        <span className="font-sans text-[10px] text-[#969696]">Category</span>
        <select
          className={inputClass}
          value={service.category}
          onChange={(e) => onUpdate(service.id, { category: e.target.value as ParsedExtraService['category'] })}
        >
          {EXTRA_SERVICE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 mt-3">
        <span className="font-sans text-[10px] text-[#969696]">Service name</span>
        <input
          type="text"
          className={inputClass}
          value={service.label}
          placeholder="e.g. DJ · welcome reception"
          onChange={(e) => onUpdate(service.id, { label: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 mt-3">
        <span className="font-sans text-[10px] text-[#969696]">Notes / RFP text</span>
        <textarea
          className={`${inputClass} min-h-[64px] resize-y`}
          value={service.rawText}
          placeholder="Details from Cvent or internal notes"
          onChange={(e) => onUpdate(service.id, { rawText: e.target.value })}
        />
      </label>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] text-[#969696]">Quantity</span>
          <input
            type="text"
            className={inputClass}
            value={service.quantity ?? ''}
            onChange={(e) => onUpdate(service.id, { quantity: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] text-[#969696]">Est. cost ($)</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={service.estimatedCost ?? ''}
            onChange={(e) => onUpdate(service.id, { estimatedCost: parseInt(e.target.value, 10) || 0 })}
          />
        </label>
      </div>
    </div>
  )
}

function ServiceCardHeader({
  service,
  onUpdate,
  onRemove,
  canRemove,
}: {
  service: ParsedExtraService
  onUpdate: (id: string, p: Partial<ParsedExtraService>) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  return (
    <div className="flex justify-end">
      {canRemove && (
        <button type="button" onClick={() => onRemove(service.id)} className="font-sans text-[12px] text-[#969696]">
          Remove
        </button>
      )}
    </div>
  )
}

function ReviewStep({
  request,
  edits,
  inventory,
  selectedPropertyId,
  onSelectProperty,
  onGenerate,
}: {
  request: CventRequest
  edits: RequestEdits
  inventory: InventoryOption[]
  selectedPropertyId: string
  onSelectProperty: (id: string) => void
  onGenerate: (propertyId?: string) => void
}) {
  const { roomBlock, roomTypes, extraServices } = edits
  const servicesTotal = extraServices.reduce((s, x) => s + (x.estimatedCost ?? 0), 0)

  return (
    <section className="flex flex-col gap-4">
      <ReviewSummary
        intake={edits.intake}
        roomBlock={roomBlock}
        roomTypes={roomTypes}
        extraServices={extraServices}
        servicesTotal={servicesTotal}
      />

      <div className="rounded-[12px] bg-[#f5f1ea] p-4 border border-[#ebe3d4]">
        <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-2">Cvent excerpt</h2>
        <p className="font-sans text-[12px] leading-[18px] text-[#525249] italic">&ldquo;{request.rawExcerpt}&rdquo;</p>
      </div>

      <div>
        <h2 className="font-serif text-[18px] italic text-[#2b2b27] mb-2">Property & inventory</h2>
        <div className="flex flex-col gap-2">
          {inventory.map((inv) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => onSelectProperty(inv.propertyId)}
              className="rounded-[10px] p-3 text-left border transition-colors"
              style={{
                borderColor: selectedPropertyId === inv.propertyId ? '#d6bfa4' : '#d0d0d0',
                background: selectedPropertyId === inv.propertyId ? '#f5f1ea' : 'white',
              }}
            >
              <p className="font-sans font-medium text-[13px] text-[#2b2b27]">{inv.propertyName}</p>
              <p className="font-sans text-[11px] text-[#969696]">{inv.reason}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewSummary({
  intake,
  roomBlock,
  roomTypes,
  extraServices,
  servicesTotal,
}: {
  intake: CventIntakeEdits
  roomBlock: RequestEdits['roomBlock']
  roomTypes: RoomTypeAllocation[]
  extraServices: ParsedExtraService[]
  servicesTotal: number
}) {
  const budget = intake.budget
  return (
    <div className="rounded-[12px] bg-white p-4 border border-[#d0d0d0]">
      <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-3">Summary</h2>
      <p className="font-sans text-[12px] text-[#585858] mb-2">
        {intake.eventLocationState}
        {intake.clientHeadquartersState ? ` · HQ ${intake.clientHeadquartersState}` : ''}
        {intake.billingCode ? ` · ${intake.billingCode}` : ''}
      </p>
      <p className="font-sans text-[13px] text-[#2b2b27] mb-1">
        {formatDateRange(roomBlock.checkIn, roomBlock.checkOut)} · {dateFlexibilityLabel(intake.dateFlexibility)}
      </p>
      <p className="font-sans text-[13px] text-[#2b2b27] mb-2">
        {roomBlock.nights} nights · {roomBlock.roomNights} room nights ·{' '}
        {budgetTypeLabel(budget.type)}{' '}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: budget.currency, maximumFractionDigits: 0 }).format(
          budget.amount,
        )}
      </p>
      <ul className="mb-3 space-y-1 font-sans text-[12px] text-[#585858]">
        {roomTypes
          .filter((r) => r.count > 0)
          .map((r) => {
            const name = NOBU_ROOM_TYPES.find((t) => t.id === r.roomTypeId)?.name ?? r.roomTypeId
            return (
              <li key={r.id}>
                {r.count} × {name}
              </li>
            )
          })}
      </ul>
      <p className="font-sans text-[12px] font-medium text-[#8e7351] mb-1">Extra services ({extraServices.length})</p>
      <ul className="space-y-1 font-sans text-[12px] text-[#585858]">
        {extraServices.map((s) => (
          <li key={s.id} className="flex justify-between gap-2">
            <span>{s.label || 'Untitled'}</span>
            {s.estimatedCost != null && <span>${s.estimatedCost.toLocaleString()}</span>}
          </li>
        ))}
      </ul>
      <p className="mt-2 font-sans text-[13px] text-[#2b2b27]">Services subtotal · ${servicesTotal.toLocaleString()}</p>
    </div>
  )
}
