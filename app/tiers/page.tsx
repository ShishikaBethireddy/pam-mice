'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

function Dot({ variant }: { variant: 'regular' | 'highlighted' | 'disabled' | 'none' }) {
  if (variant === 'none') return <div className="w-3 h-0.5 rounded-sm bg-[#969696]" />
  if (variant === 'highlighted') return <div className="w-3 h-3 rounded-full bg-white" />
  if (variant === 'disabled') return <div className="w-3 h-3 rounded-full bg-[#b4b4b4]" />
  return <div className="w-3 h-3 rounded-full bg-[#585858]" />
}

const COL_W = 60
const LABEL_W = 90

function MatrixRow({
  label,
  cells,
}: {
  label: string
  cells: Array<{ value: string | null; highlighted?: boolean; disabled?: boolean }>
}) {
  return (
    <div className="flex h-[44px] items-center border-b border-[#d0d0d0] bg-white">
      <div className="flex h-full items-center px-[12px] overflow-hidden" style={{ width: LABEL_W }}>
        <p className="font-sans text-[12px] leading-[16px] text-black">{label}</p>
      </div>
      {cells.map((cell, i) => {
        const isHighlighted = i === 3
        return (
          <div
            key={i}
            className="flex h-full items-center justify-center overflow-hidden shrink-0"
            style={{ width: COL_W, background: isHighlighted ? '#585858' : undefined }}
          >
            {cell.value === 'dot' ? (
              <Dot variant={isHighlighted ? 'highlighted' : cell.disabled ? 'disabled' : 'regular'} />
            ) : cell.value === '—' ? (
              <Dot variant="none" />
            ) : (
              <p
                className="font-sans text-[12px] leading-[16px] whitespace-nowrap"
                style={{
                  fontWeight: isHighlighted ? 500 : 400,
                  color: isHighlighted ? 'white' : cell.disabled ? '#b4b4b4' : '#585858',
                }}
              >
                {cell.value}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="h-[36px] flex items-center px-[12px] bg-[#e8e8e8]">
      <p className="font-sans font-medium text-[12px] leading-[16px] tracking-[0.4px] text-black">{label}</p>
    </div>
  )
}

export default function TiersPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  const D = [null, null, null, null, null]

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh bg-[#f5f5f5]">
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        {/* Back */}
        <div className="flex items-center gap-[6px] p-[16px]">
          <button onClick={() => router.back()} className="flex items-center gap-[6px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-sans text-[12px] leading-[16px] text-black">Back</span>
          </button>
        </div>

        {/* Intro */}
        <div className="flex flex-col gap-[6px] px-[16px] py-[24px]">
          <p className="font-serif text-[30px] leading-[40px] text-black">All tier benefits</p>
          <p className="font-sans text-[14px] leading-[20px] text-black" style={{ width: 358 }}>
            Benefits unlock based on rooms booked — not by paying more.
          </p>
          <p className="font-sans text-[12px] leading-[16px] text-black">Your group unlocks T4 — Signature</p>
        </div>

        {/* Matrix */}
        <div className="w-full overflow-x-hidden">

          {/* Column headers */}
          <div className="flex bg-white">
            <div style={{ width: LABEL_W, height: 52, flexShrink: 0 }} />
            {[
              { tier: 'T1', name: 'Essential', range: '10–19', highlight: false, disabled: false },
              { tier: 'T2', name: 'Classic',   range: '20–29', highlight: false, disabled: false },
              { tier: 'T3', name: 'Enhanced',  range: '30–49', highlight: false, disabled: false },
              { tier: 'T4', name: 'Signature', range: '50–89', highlight: true,  disabled: false },
              { tier: 'T5', name: 'Prestige',  range: '90+',   highlight: false, disabled: true },
            ].map((col) => (
              <div
                key={col.tier}
                className="flex flex-col items-center justify-center gap-[2px] px-[6px] py-[12px] overflow-hidden shrink-0"
                style={{
                  width: COL_W,
                  background: col.highlight ? '#585858' : undefined,
                }}
              >
                <p
                  className="font-sans font-medium text-[12px] leading-[16px]"
                  style={{ color: col.highlight ? 'white' : col.disabled ? '#b4b4b4' : 'black' }}
                >
                  {col.tier}
                </p>
                <p
                  className="font-sans text-[10px] leading-[16px] text-center"
                  style={{ color: col.highlight ? 'black' : col.disabled ? '#b4b4b4' : 'black' }}
                >
                  {col.name}
                </p>
                <p
                  className="font-sans text-[8px] leading-[16px]"
                  style={{ color: col.highlight ? 'white' : col.disabled ? '#b4b4b4' : 'black' }}
                >
                  {col.range}
                </p>
              </div>
            ))}
          </div>

          <SectionHeader label="RECEPTION" />
          <MatrixRow
            label="Dinner reception"
            cells={[
              { value: '2 hrs' },
              { value: '4 hrs' },
              { value: '3 hrs' },
              { value: '4 hrs', highlighted: true },
              { value: '5 hrs', disabled: true },
            ]}
          />
          <MatrixRow
            label="2nd day event"
            cells={[
              { value: '—' },
              { value: '—' },
              { value: '3 hrs' },
              { value: '4 hrs', highlighted: true },
              { value: '5 hrs', disabled: true },
            ]}
          />

          <SectionHeader label="INCLUSIONS" />
          <MatrixRow
            label="Standard tables"
            cells={[
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot', highlighted: true },
              { value: 'dot', disabled: true },
            ]}
          />
          <MatrixRow
            label="Food & beverage"
            cells={[
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot', highlighted: true },
              { value: 'dot', disabled: true },
            ]}
          />
          <MatrixRow
            label="Ceremony setup"
            cells={[
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot' },
              { value: 'dot', highlighted: true },
              { value: 'dot', disabled: true },
            ]}
          />

          <SectionHeader label="ROOMS" />
          <MatrixRow
            label="Comp room ratio"
            cells={[
              { value: '1:16' },
              { value: '1:16' },
              { value: '1:16' },
              { value: '1:16', highlighted: true },
              { value: '1:16', disabled: true },
            ]}
          />
          <MatrixRow
            label="Room upgrade"
            cells={[
              { value: '—' },
              { value: '—' },
              { value: 'dot' },
              { value: 'dot', highlighted: true },
              { value: 'dot', disabled: true },
            ]}
          />
          <MatrixRow
            label="Prices start at"
            cells={[
              { value: '$2,000' },
              { value: '$3,000' },
              { value: '$4,000' },
              { value: '$5,000', highlighted: true },
              { value: '$6,000', disabled: true },
            ]}
          />
        </div>

        {/* Upgrade nudge */}
        <div className="px-[16px] py-[24px]">
          <div
            className="flex items-center justify-between p-[16px] rounded-[8px]"
            style={{ background: '#b4b4b4' }}
          >
            <div className="flex flex-col gap-[4px]" style={{ width: 200 }}>
              <p className="font-sans font-medium text-[16px] leading-[24px] text-black">15 more rooms to Prestige</p>
              <p className="font-sans text-[12px] leading-[16px] text-black">Unlocks a 5-hr reception and a 5-hr second-day event.</p>
            </div>
            <button className="bg-black rounded-[8px] px-[12px] py-[12px] flex items-center justify-center">
              <span className="font-sans font-medium text-[12px] leading-[16px] text-white whitespace-nowrap">Share link</span>
            </button>
          </div>
        </div>

      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
