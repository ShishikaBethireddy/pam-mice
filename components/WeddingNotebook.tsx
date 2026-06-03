'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── 6-step planner (Figma: 6_Wedding Planning Notebook — 390 mobile Nobu) ──
export const NOTEBOOK_STEPS = [
  {
    num: 1,
    timelineLabel: 'Format',
    title: 'Format',
    desc: 'Pick the type of celebration — the structure everything else builds on. One tile, three answers.',
    time: '2 MIN',
  },
  {
    num: 2,
    timelineLabel: ['Guest', 'Count'],
    title: 'Guest Count',
    desc: 'Tell me your headcount so we can right-size the venue and budget.',
    time: '2 MIN',
  },
  {
    num: 3,
    timelineLabel: 'Mood',
    title: 'Mood',
    desc: 'Pick the aesthetic, palette, and feeling that pulls at you.',
    time: '2 MIN',
  },
  {
    num: 4,
    timelineLabel: ['Your', 'Matches'],
    title: 'Recos',
    desc: "Here's what we've built for you — your matched venues, edits, and vendors in one view.",
    time: '1 MIN',
  },
  {
    num: 5,
    timelineLabel: ['Add', 'Vendors'],
    title: 'Add Vendors',
    desc: 'Lock in the team that brings your vision together.',
    time: '2 MIN',
  },
  {
    num: 6,
    timelineLabel: ['Save my', 'Date'],
    title: 'Save my Date',
    desc: 'Hold your date for 24 hours while you decide — no pressure.',
    time: '2 MIN',
  },
] as const

const SURFACE_BRAND = '#c6cdc6'
const SURFACE_SUBTLE = '#e8e8e8'
const SURFACE_FEATURE = '#585858'
const BORDER_DEFAULT = '#d0d0d0'
const TEXT_PRIMARY = '#000000'
const TEXT_SECONDARY = '#585858'
const TEXT_TERTIARY = '#969696'
const TEXT_DISABLED = '#b4b4b4'

interface WeddingNotebookProps {
  activeStep?: number // 1–6
  defaultExpanded?: boolean
}

function TimelineLabel({
  label,
  active,
}: {
  label: string | readonly [string, string]
  active: boolean
}) {
  const color = active ? TEXT_SECONDARY : TEXT_TERTIARY
  if (Array.isArray(label)) {
    return (
      <span className="text-center">
        {label.map((line) => (
          <span key={line} className="block text-[12px] leading-4" style={{ color }}>
            {line}
          </span>
        ))}
      </span>
    )
  }
  return (
    <span className="text-center text-[12px] leading-4 whitespace-nowrap" style={{ color }}>
      {label}
    </span>
  )
}

function StepBead({ active, num }: { active: boolean; num: number }) {
  return (
    <div
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] border-[1.5px] text-[13px]"
      style={{
        background: active ? SURFACE_FEATURE : '#ffffff',
        borderColor: BORDER_DEFAULT,
        color: active ? '#ffffff' : TEXT_TERTIARY,
      }}
    >
      {num}
    </div>
  )
}

export default function WeddingNotebook({
  activeStep = 1,
  defaultExpanded = false,
}: WeddingNotebookProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const stepIndex = Math.min(Math.max(activeStep, 1), NOTEBOOK_STEPS.length)

  return (
    <div className="w-full bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-0 px-4 py-2 text-left"
        style={{ background: SURFACE_BRAND }}
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: TEXT_PRIMARY, lineHeight: '16px' }}
          >
            How it works
          </p>
          <HeaderRow>
            <p className="text-[14px] leading-5" style={{ color: TEXT_PRIMARY }}>
              Wedding Planning Notebook
            </p>
            <span
              className="shrink-0 rounded px-2.5 py-0.5 text-[12px] font-semibold uppercase leading-[19px]"
              style={{ background: SURFACE_SUBTLE, color: TEXT_PRIMARY }}
            >
              Step {stepIndex} of {NOTEBOOK_STEPS.length}
            </span>
          </HeaderRow>
        </div>
        <span
          className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center pl-3"
          style={{ color: TEXT_PRIMARY }}
          aria-hidden
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className="inline-flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="notebook-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 bg-white px-6 py-4">
              <p className="max-w-[342px] text-[14px] leading-5" style={{ color: TEXT_PRIMARY }}>
                Here&apos;s how we&apos;ll design your dream wedding and save your date for 24 hours —
                together, in under 30 minutes.
              </p>
              <div className="flex gap-4">
                <button type="button" className="py-2.5 text-[16px] font-medium leading-6" style={{ color: TEXT_PRIMARY }}>
                  Reset
                </button>
                <button type="button" className="py-2.5 text-[16px] font-medium leading-6" style={{ color: TEXT_PRIMARY }}>
                  Save
                </button>
              </div>
            </div>

            <div className="relative px-4 py-3" style={{ background: SURFACE_SUBTLE }}>
              <TimelineLine />
              <div className="relative flex gap-1.5">
                {NOTEBOOK_STEPS.map((s) => {
                  const active = s.num === stepIndex
                  return (
                    <TimelineStep key={s.num} active={active} step={s} />
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col bg-white p-4">
              {NOTEBOOK_STEPS.map((s) => {
                const active = s.num === stepIndex
                return (
                  <div
                    key={s.num}
                    className="flex gap-2 rounded p-4"
                    style={{ background: active ? SURFACE_BRAND : 'transparent' }}
                  >
                    <StepBead active={active} num={s.num} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[18px] leading-6"
                        style={{ color: active ? TEXT_PRIMARY : TEXT_TERTIARY }}
                      >
                        {s.title}
                      </p>
                      <p
                        className="mt-1 text-[14px] leading-5"
                        style={{ color: active ? TEXT_SECONDARY : TEXT_TERTIARY }}
                      >
                        {s.desc}
                      </p>
                    </div>
                    <p
                      className="shrink-0 pt-1 text-[12px] font-semibold uppercase tracking-[0.08em]"
                      style={{ color: active ? '#ffffff' : TEXT_DISABLED, lineHeight: '16px' }}
                    >
                      {s.time}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HeaderRow({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full items-center justify-between gap-2">{children}</div>
}

function TimelineLine() {
  return (
    <div
      className="pointer-events-none absolute left-[46px] right-[46px] top-[27px] border-t border-dashed"
      style={{ borderColor: BORDER_DEFAULT }}
      aria-hidden
    />
  )
}

function TimelineStep({
  active,
  step,
}: {
  active: boolean
  step: (typeof NOTEBOOK_STEPS)[number]
}) {
  return (
    <div className="flex w-[55px] shrink-0 flex-col items-center gap-2">
      <StepBead active={active} num={step.num} />
      <TimelineLabel label={step.timelineLabel} active={active} />
    </div>
  )
}
