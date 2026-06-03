'use client'

import { useState, useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import TravelAgentShell from '@/components/travel-agent/TravelAgentShell'
import DesktopDialog from '@/components/travel-agent/DesktopDialog'
import type { CventRequest, DraftProposal } from '@/lib/cvent'
import { formatDateRange } from '@/lib/cvent'
import {
  PROPOSAL_MODULES,
  type ProposalModuleId,
  type PricingTier,
} from '@/lib/proposal-experience'

export default function ProposalDetailClient({
  proposal: initial,
  request,
}: {
  proposal: DraftProposal
  request?: CventRequest
}) {
  const [proposal, setProposal] = useState(initial)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(proposal.status === 'sent_to_cvent' || proposal.status === 'finalized')
  const [finalized, setFinalized] = useState(proposal.status === 'finalized')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)
  const [activeModule, setActiveModule] = useState<ProposalModuleId>('overview')
  const [pricingTierId, setPricingTierId] = useState(
    proposal.pricingTiers?.find((t) => t.recommended)?.id ?? proposal.pricingTiers?.[0]?.id ?? 'recommended',
  )
  const [linkCopied, setLinkCopied] = useState(false)

  const tiers = proposal.pricingTiers ?? []
  const activeTier = tiers.find((t) => t.id === pricingTierId) ?? tiers[1] ?? tiers[0]
  const engagement = proposal.engagement
  const displayTotal = activeTier?.grandTotal ?? proposal.grandTotal

  const moduleContent = useMemo(
    () => buildModuleContent(proposal, request, activeModule, activeTier, displayTotal),
    [proposal, request, activeModule, activeTier, displayTotal],
  )

  function handleSendToCvent() {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setShowConfirm(false)
      setProposal((p) => ({
        ...p,
        status: 'sent_to_cvent',
        sentToCventAt: new Date().toISOString(),
        engagement: p.engagement
          ? { ...p.engagement, heat: 'warm', suggestedFollowUp: 'Link shared via Cvent — tracking live when client opens.' }
          : p.engagement,
      }))
    }, 1500)
  }

  function handleFinalize() {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setFinalized(true)
      setShowFinalizeConfirm(false)
      setProposal((p) => ({
        ...p,
        status: 'finalized',
      }))
    }, 1500)
  }

  function copyLink() {
    const url = proposal.presentationUrl ?? `https://proposals.pam-mice.com/${proposal.id}`
    void navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const headerActions = (
    <>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium border border-[#d0d0d0] hover:bg-[#fafafa]"
      >
        {linkCopied ? 'Link copied' : 'Copy web link'}
      </button>
      {!finalized &&
        (!sent ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={sending}
            className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium disabled:opacity-60"
            style={{ background: '#d6bfa4', color: '#18181a' }}
          >
            {sending ? 'Publishing…' : 'Publish to Cvent'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowFinalizeConfirm(true)}
            disabled={sending}
            className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium text-white disabled:opacity-60"
            style={{ background: '#18181a' }}
          >
            {sending ? 'Sending…' : 'Finalize & send'}
          </button>
        ))}
      {finalized && (
        <Link
          href={request ? `/travel-agent/requests/${request.id}` : '/travel-agent'}
          className="rounded-[8px] px-4 py-2 font-sans text-[13px] font-medium text-white"
          style={{ background: '#18181a' }}
        >
          View history
        </Link>
      )}
    </>
  )

  return (
    <TravelAgentShell
      title={`Proposal · ${proposal.clientName}`}
      backHref={request ? `/travel-agent/requests/${request.id}` : '/travel-agent'}
      backLabel="← Request"
      actions={headerActions}
    >
      <div className="grid grid-cols-[320px_1fr] gap-6 px-8 py-6">
        <aside className="flex flex-col gap-4">
        {finalized && (
          <div className="rounded-[12px] p-4" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7' }}>
            <p className="font-sans font-medium text-[14px] text-[#2d5a3d]">Finalized & sent to requester</p>
            <p className="font-sans text-[12px] text-[#525249] mt-1">
              Locked proposal delivered to {request?.agentName ?? 'the agent'} · {proposal.cventRef}
            </p>
          </div>
        )}
        {sent && !finalized && (
          <div className="rounded-[12px] p-4" style={{ background: '#f5f1ea', border: '1px solid #ebe3d4' }}>
            <p className="font-sans font-medium text-[14px] text-[#2b2b27]">Published — ready to finalize</p>
            <p className="font-sans text-[12px] text-[#525249] mt-1">
              Web link is live in Cvent. Finalize when terms are agreed to send the locked version to the requester.
            </p>
          </div>
        )}

        {proposal.alternativesIncluded.length > 0 && (
          <section className="rounded-[12px] bg-[#f5f1ea] p-4 border border-[#ebe3d4]">
            <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-2">
              Alternate properties
            </h2>
            <ul className="flex flex-col gap-2">
              {proposal.alternativesIncluded.map((alt) => (
                <li key={alt.id} className="font-sans text-[12px] text-[#525249]">
                  <span className="font-medium text-[#2b2b27]">{alt.propertyName}</span> — {alt.reason}
                </li>
              ))}
            </ul>
          </section>
        )}
        </aside>

        <div className="flex flex-col gap-4 min-w-0">
          <div className="bg-[#18181a] px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-[1.4px]" style={{ color: '#d6bfa4' }}>
              Modular web proposal
            </p>
            <p className="font-serif text-[20px] italic text-white mt-0.5">{proposal.propertyName}</p>
            <p className="font-sans text-[12px] text-white/70">{proposal.clientName} · {proposal.cventRef}</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto p-3 border-b border-[#f0f0f0] bg-[#fafafa]">
            {PROPOSAL_MODULES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModule(m.id)}
                className="shrink-0 rounded-full px-3 py-1.5 font-sans text-[11px] font-medium transition-colors"
                style={{
                  background: activeModule === m.id ? '#18181a' : 'white',
                  color: activeModule === m.id ? 'white' : '#585858',
                  border: activeModule === m.id ? 'none' : '1px solid #d0d0d0',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 min-h-[200px]"
            >
              <p className="font-sans text-[10px] uppercase tracking-[1.2px] text-[#8e7351] mb-1">
                {PROPOSAL_MODULES.find((m) => m.id === activeModule)?.tagline}
              </p>
              <h3 className="font-serif text-[18px] italic text-[#2b2b27] mb-3">
                {PROPOSAL_MODULES.find((m) => m.id === activeModule)?.label}
              </h3>
              {moduleContent}
            </motion.div>
          </AnimatePresence>

          {activeModule === 'pricing' && tiers.length > 0 && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              {tiers.map((tier) => (
                <PricingTierCard
                  key={tier.id}
                  tier={tier}
                  selected={pricingTierId === tier.id}
                  onSelect={() => setPricingTierId(tier.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[12px] bg-white p-4 border border-[#ebe3d4]">
          <p className="font-sans text-[11px] text-[#969696] mb-1">Client-facing total ({activeTier?.label ?? 'Recommended'})</p>
          <p className="font-sans text-[22px] font-medium text-[#2b2b27]">
            ${displayTotal.toLocaleString()}
          </p>
          <p className="font-sans text-[11px] text-[#969696] mt-2">
            PDF export: {proposal.pdfFileName} · Valid until {proposal.validUntil}
          </p>
        </div>

        {proposal.alternativesIncluded.length > 0 && (
          <section className="rounded-[12px] bg-[#f5f1ea] p-4 border border-[#ebe3d4]">
            <h2 className="font-sans font-semibold text-[12px] uppercase tracking-[1.4px] text-[#8e7351] mb-2">
              Alternate properties (toggle in client view)
            </h2>
            <ul className="flex flex-col gap-2">
              {proposal.alternativesIncluded.map((alt) => (
                <li key={alt.id} className="font-sans text-[12px] text-[#525249]">
                  <span className="font-medium text-[#2b2b27]">{alt.propertyName}</span> — {alt.reason}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#d0d0d0] bg-white p-4 space-y-2">
        <button
          type="button"
          onClick={copyLink}
          className="h-[40px] w-full rounded-full font-sans text-[13px] font-medium border border-[#d0d0d0] text-[#2b2b27]"
        >
          {linkCopied ? 'Link copied' : 'Copy client web link'}
        </button>
        {!finalized ? (
          <>
            {!sent ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirm(true)}
                disabled={sending}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full font-sans text-[14px] font-medium disabled:opacity-60"
                style={{ background: '#d6bfa4', color: '#18181a' }}
              >
                {sending ? 'Publishing…' : 'Publish to Cvent'}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFinalizeConfirm(true)}
                disabled={sending}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full font-sans text-[14px] font-medium disabled:opacity-60"
                style={{ background: '#18181a', color: 'white' }}
              >
                {sending ? 'Sending…' : 'Finalize & send to requester'}
              </motion.button>
            )}
            <p className="font-sans text-[11px] text-center text-[#969696]">
              {!sent
                ? 'Share draft link for negotiation'
                : 'Locks pricing and notifies agent via Cvent'}
            </p>
          </>
        ) : (
          <Link
            href={request ? `/travel-agent/requests/${request.id}` : '/travel-agent'}
            className="flex h-[48px] w-full items-center justify-center rounded-full font-sans text-[14px] font-medium"
            style={{ background: '#18181a', color: 'white' }}
          >
            View request history
          </Link>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[390px] rounded-t-[20px] bg-white p-6"
            >
              <h3 className="font-serif text-[22px] italic text-[#2b2b27] mb-2">Publish to Cvent?</h3>
              <p className="font-sans text-[14px] text-[#585858] mb-4">
                Sends the secure web proposal to RFP {proposal.cventRef}, attaches PDF backup, and enables behavioral
                tracking for {request?.agentName ?? 'the agent'}.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendToCvent}
                  className="h-[44px] rounded-full font-sans text-[14px] font-medium"
                  style={{ background: '#18181a', color: 'white' }}
                >
                  Confirm publish
                </button>
                <button onClick={() => setShowConfirm(false)} className="h-[44px] font-sans text-[14px] text-[#585858]">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinalizeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
            onClick={() => setShowFinalizeConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[390px] rounded-t-[20px] bg-white p-6"
            >
              <h3 className="font-serif text-[22px] italic text-[#2b2b27] mb-2">Finalize proposal?</h3>
              <p className="font-sans text-[14px] text-[#585858] mb-4">
                This locks the proposal at <strong>${displayTotal.toLocaleString()}</strong> and sends it to{' '}
                {request?.agentName ?? 'the requester'} ({request?.agentEmail ?? 'via Cvent'}). Further edits require a
                new version.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleFinalize}
                  className="h-[44px] rounded-full font-sans text-[14px] font-medium"
                  style={{ background: '#18181a', color: 'white' }}
                >
                  Confirm finalize & send
                </button>
                <button onClick={() => setShowFinalizeConfirm(false)} className="h-[44px] font-sans text-[14px] text-[#585858]">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TravelAgentShell>
  )
}

function EngagementPanel({
  engagement,
  clientName,
}: {
  engagement?: DraftProposal['engagement']
  clientName: string
}) {
  if (!engagement) return null

  const heatStyles = {
    cold: { bg: '#f5f1ea', color: '#8e7351', label: 'Not yet opened' },
    warm: { bg: '#fff8e6', color: '#8e7351', label: 'Warm — reviewing' },
    hot: { bg: '#fde8e8', color: '#8b3a3a', label: 'Hot — follow up now' },
  }
  const heat = heatStyles[engagement.heat]
  const maxDwell = Math.max(...engagement.moduleDwell.map((d) => d.seconds), 1)

  return (
    <section className="rounded-[12px] p-4 border border-[#ebe3d4]" style={{ background: heat.bg }}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[1.4px] text-[#969696]">Client engagement</p>
          <p className="font-sans font-medium text-[14px]" style={{ color: heat.color }}>
            {heat.label}
          </p>
        </div>
        <span className="font-sans text-[11px] text-[#585858]">
          {engagement.totalViews} view{engagement.totalViews !== 1 ? 's' : ''} · {engagement.uniqueViewers} viewer
          {engagement.uniqueViewers !== 1 ? 's' : ''}
        </span>
      </div>

      {engagement.moduleDwell.length > 0 && (
        <div className="mb-3">
          <p className="font-sans text-[11px] text-[#969696] mb-2">Dwell time by module</p>
          <div className="flex flex-col gap-1.5">
            {engagement.moduleDwell.slice(0, 4).map((d) => (
              <div key={d.moduleId} className="flex items-center gap-2">
                <span className="w-16 shrink-0 font-sans text-[10px] text-[#585858]">{d.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/80 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.seconds / maxDwell) * 100}%`, background: '#8e7351' }}
                  />
                </div>
                <span className="font-sans text-[10px] text-[#969696] w-8 text-right">{d.seconds}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {engagement.forwardedTo.length > 0 && (
        <div className="mb-3">
          <p className="font-sans text-[11px] text-[#969696] mb-1">Forwarded to decision-makers</p>
          <ul className="space-y-1">
            {engagement.forwardedTo.map((f, i) => (
              <li key={i} className="font-sans text-[12px] text-[#2b2b27]">
                {f.name} <span className="text-[#969696]">({f.role})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="font-sans text-[12px] leading-[17px] text-[#525249]">
        <span className="font-medium text-[#2b2b27]">{clientName}: </span>
        {engagement.suggestedFollowUp}
      </p>
    </section>
  )
}

function PricingTierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: PricingTier
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-[10px] p-3 text-left border transition-colors"
      style={{
        borderColor: selected ? '#d6bfa4' : '#ebe3d4',
        background: selected ? '#f5f1ea' : 'white',
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-sans font-medium text-[13px] text-[#2b2b27]">
          {tier.label}
          {tier.recommended && (
            <span className="ml-2 text-[10px] uppercase tracking-wide text-[#8e7351]">Recommended</span>
          )}
        </span>
        <span className="font-sans text-[14px] font-medium">${tier.grandTotal.toLocaleString()}</span>
      </div>
      <p className="font-sans text-[11px] text-[#969696] mt-1">{tier.description}</p>
    </button>
  )
}

function buildModuleContent(
  proposal: DraftProposal,
  request: CventRequest | undefined,
  activeModule: ProposalModuleId,
  tier: PricingTier | undefined,
  displayTotal: number,
): ReactNode {
  const rooms = proposal.lineItems.filter((l) => l.section === 'rooms')
  const meeting = proposal.lineItems.filter((l) => l.section === 'meeting')
  const fb = proposal.lineItems.filter((l) => l.section === 'fb')
  const services = proposal.lineItems.filter((l) => l.section === 'services')

  if (activeModule === 'overview') {
    return (
      <div className="space-y-2 font-sans text-[13px] text-[#585858]">
        <p>
          {request
            ? `${request.eventType} for ${request.headcount} guests`
            : `Proposal for ${proposal.clientName}`}
        </p>
        {request && (
          <p>
            {formatDateRange(request.preferredDates.start, request.preferredDates.end)} · Valid until{' '}
            {proposal.validUntil}
          </p>
        )}
        <p className="text-[#2b2b27] font-medium pt-2">
          Clients toggle modules in real time — no static PDF required.
        </p>
      </div>
    )
  }

  if (activeModule === 'rooms') {
    return (
      <ul className="space-y-2 font-sans text-[12px] text-[#585858]">
        {rooms.map((l) => (
          <li key={l.id} className="flex justify-between gap-2 border-b border-[#f0f0f0] pb-2">
            <span>{l.description}</span>
            <span className="font-medium text-[#2b2b27]">${l.total.toLocaleString()}</span>
          </li>
        ))}
        <li className="text-[11px] text-[#8e7351]">Client can switch between Essential / Elevated room mixes</li>
      </ul>
    )
  }

  if (activeModule === 'spaces') {
    return (
      <div className="space-y-3">
        <div
          className="rounded-[10px] h-[120px] flex items-center justify-center border border-dashed border-[#d0d0d0]"
          style={{ background: 'linear-gradient(135deg, #f5f1ea 0%, #ebe3d4 100%)' }}
        >
          <p className="font-sans text-[11px] text-[#8e7351] text-center px-4">
            3D floor plan · drag to explore ballroom + breakouts
          </p>
        </div>
        {meeting.map((l) => (
          <p key={l.id} className="font-sans text-[12px] text-[#585858]">
            {l.description} — ${l.total.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }

  if (activeModule === 'menus') {
    return (
      <div className="space-y-2">
        {fb.map((l) => (
          <button
            key={l.id}
            type="button"
            className="w-full rounded-[8px] p-3 text-left border border-[#ebe3d4] bg-[#fafafa] font-sans text-[12px] text-[#2b2b27]"
          >
            <span className="block font-medium">{l.description}</span>
            <span className="text-[#969696]">{l.quantity} · tap to view menu slideshow</span>
          </button>
        ))}
      </div>
    )
  }

  if (activeModule === 'pricing') {
    return (
      <p className="font-sans text-[13px] text-[#585858]">
        Select a package tier below — totals update instantly for the client. Current selection:{' '}
        <strong className="text-[#2b2b27]">{tier?.label ?? 'Recommended'}</strong> at ${displayTotal.toLocaleString()}.
      </p>
    )
  }

  if (activeModule === 'services') {
    return (
      <ul className="space-y-2 font-sans text-[12px]">
        {services.length === 0 ? (
          <li className="text-[#969696]">No add-ons in this draft.</li>
        ) : (
          services.map((l) => (
            <li key={l.id} className="flex justify-between gap-2">
              <span className="text-[#585858]">{l.description}</span>
              <span className="text-[#2b2b27] font-medium">${l.total.toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>
    )
  }

  return null
}
