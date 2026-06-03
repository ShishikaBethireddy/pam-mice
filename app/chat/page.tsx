'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import DesktopSplitWrapper from '@/components/DesktopSplitWrapper'
import WeddingNotebook from '@/components/WeddingNotebook'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────
type Step = 'name' | 'style1' | 'guests' | 'moodboard-prompt' | 'moodboard-results' | 'date-question' | 'date-input' | 'results'
type Selections = Record<string, string[]>

// ── Mood data ────────────────────────────────────────────────────
const MOODS = [
  {
    name: 'Silver Renaissance',
    subtitle: 'Chrome · Sculpted · Directional',
    image: 'https://www.figma.com/api/mcp/asset/a2de52d8-b78a-498e-abd3-d5cb5db02cef',
    palette: ['#e8eaed', '#b0bac5', '#7a90a4', '#2c3540'],
    imageHeight: 108,
  },
  {
    name: 'Meadowcore',
    subtitle: 'Untamed · Botanical · Grounded',
    image: 'https://www.figma.com/api/mcp/asset/dea1d6f1-dcdb-4969-a00b-88060387ecbc',
    palette: ['#f0ebe0', '#c4b99a', '#7a8c65', '#3d5236'],
    imageHeight: 116,
  },
  {
    name: 'Retro-Cinematic',
    subtitle: 'Candlelit · Nostalgic · Intimate',
    image: 'https://www.figma.com/api/mcp/asset/acc5a5ae-06a8-431d-ba54-ea400361c601',
    palette: ['#f2e8d5', '#c49a6c', '#7c4a2d', '#1e1510'],
    imageHeight: 108,
  },
  {
    name: 'Pearlcore',
    subtitle: 'Iridescent · Heirloom · Coquette',
    image: 'https://www.figma.com/api/mcp/asset/9936beb3-23dd-4ff5-9774-609ba3d468f1',
    palette: ['#f8f3f0', '#c8b8cc', '#d4a8b4', '#6b2537'],
    imageHeight: 132,
  },
  {
    name: 'Architectural Minimalism',
    subtitle: 'Structural · Gallery · Quiet',
    image: 'https://www.figma.com/api/mcp/asset/635b504c-eb5d-4d88-a1a3-c7e45d7d293d',
    palette: ['#f5f0ea', '#ddd5c8', '#a09688', '#2e2a26'],
    imageHeight: 132,
  },
]

// ── Moodboard results masonry images ─────────────────────────────
const MASONRY_LEFT = [
  { src: 'https://www.figma.com/api/mcp/asset/dadeb85e-9f88-4385-ac00-94f96c18abff', h: 195 },
  { src: 'https://www.figma.com/api/mcp/asset/f9eea12b-e35b-4eb9-a7ed-a26e06203b1e', h: 290 },
  { src: 'https://www.figma.com/api/mcp/asset/09ca15f5-404b-487d-861c-ccdb48fa6009', h: 160 },
]
const MASONRY_RIGHT = [
  { src: 'https://www.figma.com/api/mcp/asset/3169976f-97ca-4b4e-9062-9f859b4a298b', h: 140 },
  { src: 'https://www.figma.com/api/mcp/asset/61214dca-3f61-486f-a50e-e777e4997c73', h: 148 },
  { src: 'https://www.figma.com/api/mcp/asset/fe0f785c-358c-41df-be3a-3ef71235dd5d', h: 228 },
  { src: 'https://www.figma.com/api/mcp/asset/d7293d61-12e2-40ff-a90e-1d2f25ffee31', h: 124 },
]

// ── Contextual Allie response ────────────────────────────────────
function getStyleResponse(sel: Selections): string {
  const settings = sel['BY SETTING'] || []
  const formats  = sel['BY FORMAT']  || []
  if (settings.includes('Beach') || settings.includes('Historic Villa') || settings.includes('Castle'))
    return 'A venue with history. The kind of place that already has a story before yours begins.'
  if (formats.includes('Elopement'))
    return 'Just the two of you and the view. Intimate, deliberate, and completely yours.'
  if (formats.includes('Micro Wedding'))
    return 'Small list, big feelings. The guests who matter most — no one else.'
  if (formats.includes('Traditional'))
    return "Classic, beautiful, and exactly as it should be. We're here for it."
  if (settings.includes('Mountain Lodge') || settings.includes('Vineyard'))
    return 'Rustic, rooted, and full of soul. That backdrop is going to be stunning.'
  return "Beautiful choices — we're already picturing it."
}

// ── Allie avatar (Nobu mode: Surface/Feature = #585858) ──────────
function AllieAvatar() {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      style={{ background: '#585858' }}
    >
      <div className="relative" style={{ width: 27, height: 22 }}>
        <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" />
      </div>
    </div>
  )
}

// ── Allie speech bubble ──────────────────────────────────────────
function AllieBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut', delay }}
      className="bg-[#e8e8e8] rounded-tr-xl rounded-br-xl rounded-bl-xl px-6 py-6 flex flex-col gap-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      style={{ maxWidth: 286 }}
    >
      {children}
    </motion.div>
  )
}

// ── User speech bubble ───────────────────────────────────────────
function UserBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay }}
      className="flex justify-end"
    >
      <div className="bg-black rounded-tl-xl rounded-tr-xl rounded-bl-xl px-4 py-3 max-w-[260px]">
        {children}
      </div>
    </motion.div>
  )
}

// ── Chip ─────────────────────────────────────────────────────────
function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      className="flex items-center gap-1.5 px-[17px] py-[9px] rounded-full border text-sm font-sans transition-all duration-150"
      style={
        selected
          ? { background: '#1e1e1e', borderColor: '#1e1e1e', color: 'white' }
          : { background: 'white', borderColor: '#d0d0d0', color: '#000000' }
      }
    >
      {label}
      {selected && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  )
}

// ── Chip card ────────────────────────────────────────────────────
function ChipCard({
  categories,
  selections,
  onToggle,
  delay = 0,
}: {
  categories: { key: string; label?: string; options: string[] }[]
  selections: Selections
  onToggle: (cat: string, val: string) => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut', delay }}
      className="bg-white border border-[#d0d0d0] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-6"
      style={{ maxWidth: 286 }}
    >
      {categories.map((cat) => (
        <div key={cat.key} className="flex flex-col gap-3">
          <p className="font-sans font-normal text-xs tracking-[1.8px] uppercase text-[#585858]">{cat.label ?? cat.key}</p>
          <div className="flex flex-wrap gap-2">
            {cat.options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={(selections[cat.key] || []).includes(opt)}
                onToggle={() => onToggle(cat.key, opt)}
              />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// ── Guest count card ─────────────────────────────────────────────
function GuestCountCard({ count, onChange }: { count: number; onChange: (v: number) => void }) {
  const pct = ((count - 10) / (500 - 10)) * 100
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut', delay: 0.3 }}
      className="bg-white border border-[#d0d0d0] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[0px_4px_15px_rgba(102,93,82,0.06)] p-6 flex flex-col gap-3"
      style={{ maxWidth: 286 }}
    >
      <p className="font-sans font-medium text-[18px] leading-7 text-[#1b1c1c]">Guest Count</p>
      <div className="flex items-end justify-between">
        <span
          className="font-sans font-light leading-none text-[#665d52]"
          style={{ fontSize: 72, letterSpacing: '-1.44px' }}
        >
          {count}
        </span>
        <span className="font-sans font-medium text-sm pb-2 text-[#4c463f] tracking-[1.4px] uppercase">
          GUESTS
        </span>
      </div>
      <div className="flex flex-col gap-3 pb-6 pt-3">
        <input
          type="range"
          min={10}
          max={500}
          value={count}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={
            {
              accentColor: '#665d52',
              '--range-pct': `${pct}%`,
            } as React.CSSProperties
          }
        />
        <div className="flex items-center justify-between">
          <span className="font-sans font-medium text-sm text-[#7d766e] tracking-[1.4px]">10</span>
          <span className="font-sans font-medium text-sm text-[#7d766e] tracking-[1.4px]">500+</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Input bar ────────────────────────────────────────────────────
function InputBar({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = 'Type a message...',
  disabled = false,
}: {
  value?: string
  onChange?: (v: string) => void
  onSend?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="bg-white border border-[#d0d0d0] rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-2 px-1 py-0.5 w-full">
      <button className="w-11 h-11 flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 font-sans text-sm text-[#2b2b27] placeholder:text-[#969696] bg-transparent outline-none py-2 px-1"
        />
      ) : (
        <p className="flex-1 font-sans text-sm text-[#969696] py-2 px-1">{placeholder}</p>
      )}
      <button
        onClick={onSend}
        disabled={disabled}
        className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 12V2M2 7L7 2L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

// ── Canvas card (desktop Selection Canvas) ───────────────────────
function CanvasCard({
  label,
  children,
  padded = true,
  delay = 0,
}: {
  label: string
  children: React.ReactNode
  padded?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className="rounded-[16px] overflow-hidden shadow-[0px_1px_2px_rgba(43,43,39,0.06)]"
      style={{ background: 'white' }}
    >
      {padded ? (
        <div className="px-[20px] py-[16px]">
          <p
            className="font-sans font-semibold text-[10px] tracking-[1.6px] uppercase mb-[8px]"
            style={{ color: '#8e7351' }}
          >
            {label}
          </p>
          {children}
        </div>
      ) : (
        <>
          <div className="px-[20px] pt-[16px] pb-[10px]">
            <p
              className="font-sans font-semibold text-[10px] tracking-[1.6px] uppercase"
              style={{ color: '#8e7351' }}
            >
              {label}
            </p>
          </div>
          {children}
        </>
      )}
    </motion.div>
  )
}

// ── Selection Canvas (right pane on desktop) ─────────────────────
function SelectionCanvas({
  userName,
  weddingDate,
  submittedDate,
  selections,
  hasStyle1Selections,
  guestCount,
  selectedMood,
  step,
}: {
  userName: string
  weddingDate: string
  submittedDate: string
  selections: Selections
  hasStyle1Selections: boolean
  guestCount: number
  selectedMood: string
  step: Step
}) {
  const mood = MOODS.find((m) => m.name === selectedMood)
  const allStyles = [
    ...(selections['BY FORMAT'] || []),
    ...(selections['BY TRADITION'] || []),
    ...(selections['SCHEDULE'] || []),
  ]
  const guestsConfirmed = step !== 'name' && step !== 'style1'
  const isEmpty = !userName && !hasStyle1Selections && !guestsConfirmed && !selectedMood && !submittedDate

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: '#f0ebe0' }}>
      <div className="max-w-[560px] mx-auto px-[40px] py-[48px] flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex flex-col gap-[8px]">
          <p
            className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase"
            style={{ color: '#8e7351' }}
          >
            Selection Canvas
          </p>
          <h2
            className="font-serif italic text-[32px] leading-[40px]"
            style={{ color: '#2b2b27' }}
          >
            Your wedding,<br />taking shape.
          </h2>
          <p
            className="font-sans font-light text-[14px] leading-[22px]"
            style={{ color: '#525249' }}
          >
            Allie is noting your selections as you go. Refine anything later.
          </p>
        </div>

        {isEmpty && (
          <div
            className="rounded-[16px] p-[24px] flex items-start gap-[12px]"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px dashed #c9bda5' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-[2px]">
              <path d="M10 3v14M3 10h14" stroke="#8e7351" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <p className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#6b5e4d' }}>
              We&apos;ll fill this in as we go — your name, date window, style, guest count, and the mood that pulls at you.
            </p>
          </div>
        )}

        {/* Date — always shown (default is 'Spring 2027') */}
        <CanvasCard label={submittedDate ? 'Wedding date' : 'Wedding window'}>
          <p
            className="font-serif italic text-[22px] leading-[28px]"
            style={{ color: '#2b2b27' }}
          >
            {submittedDate || weddingDate}
          </p>
          <p
            className="font-sans font-light text-[12px] leading-[18px] mt-[4px]"
            style={{ color: '#8e7351' }}
          >
            Nobu Los Cabos · Pacific-facing
          </p>
        </CanvasCard>

        {/* Couple */}
        <AnimatePresence>
          {userName && (
            <CanvasCard key="couple" label="Couple">
              <p className="font-serif text-[24px] leading-[30px]" style={{ color: '#2b2b27' }}>
                {userName}
              </p>
            </CanvasCard>
          )}
        </AnimatePresence>

        {/* Style */}
        <AnimatePresence>
          {hasStyle1Selections && (
            <CanvasCard key="style" label="Style">
              <div className="flex flex-wrap gap-[6px]">
                {allStyles.map((s) => (
                  <span
                    key={s}
                    className="font-sans text-[12px] leading-[16px] rounded-full px-[10px] py-[5px]"
                    style={{ background: '#e8e0cc', color: '#5a4a32' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </CanvasCard>
          )}
        </AnimatePresence>

        {/* Guests */}
        <AnimatePresence>
          {guestsConfirmed && (
            <CanvasCard key="guests" label="Guests">
              <div className="flex items-baseline gap-[8px]">
                <p
                  className="font-sans font-light leading-[1]"
                  style={{ color: '#2b2b27', fontSize: 42, letterSpacing: '-0.5px' }}
                >
                  {guestCount}
                </p>
                <p
                  className="font-sans font-medium text-[11px] tracking-[1.4px] uppercase"
                  style={{ color: '#8e7351' }}
                >
                  Guests
                </p>
              </div>
            </CanvasCard>
          )}
        </AnimatePresence>

        {/* Mood */}
        <AnimatePresence>
          {selectedMood && mood && (
            <CanvasCard key="mood" label="Mood" padded={false}>
              <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mood.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex">
                {mood.palette.map((c, i) => (
                  <div key={i} className="flex-1 h-[10px]" style={{ background: c }} />
                ))}
              </div>
              <div className="px-[20px] py-[16px] flex flex-col gap-[2px]">
                <p
                  className="font-serif text-[20px] leading-[26px]"
                  style={{ color: '#2b2b27' }}
                >
                  {mood.name}
                </p>
                <p
                  className="font-sans text-[12px] leading-[16px]"
                  style={{ color: '#6b5e4d' }}
                >
                  {mood.subtitle}
                </p>
              </div>
            </CanvasCard>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <p
          className="font-sans font-light text-[11px] leading-[16px] text-center pt-[8px]"
          style={{ color: '#8e7351' }}
        >
          Step {step === 'name' || step === 'style1' ? 1 : step === 'guests' ? 2 : 3} of 8 · You can revise anything before signing.
        </p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function ChatPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [step, setStep] = useState<Step>('name')
  const [inputValue, setInputValue] = useState('')
  const [userName, setUserName] = useState('')
  const [selections, setSelections] = useState<Selections>({
    'BY FORMAT': [],
    'BY TRADITION': [],
    'SCHEDULE': [],
  })
  const [guestCount, setGuestCount] = useState(150)
  const [allieStyleMsg, setAllieStyleMsg] = useState('')
  const [style1Summary, setStyle1Summary] = useState('')
  const [weddingDate, setWeddingDate] = useState('Spring 2027')
  const [submittedDate, setSubmittedDate] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const router = useRouter()
  type StepRefKey = 'style1' | 'guests' | 'moodboard-prompt' | 'moodboard-results' | 'date-q' | 'results'
  const stepRefs = useRef<Partial<Record<StepRefKey, HTMLDivElement | null>>>({})

  useEffect(() => {
    const saved = sessionStorage.getItem('weddingDate')
    if (saved) setWeddingDate(saved)
  }, [])

  useEffect(() => {
    const stepToRef: Record<Step, StepRefKey | null> = {
      'name':              null,
      'style1':            'style1',
      'guests':            'guests',
      'moodboard-prompt':  'moodboard-prompt',
      'moodboard-results': 'moodboard-results',
      'date-question':     'date-q',
      'date-input':        'date-q',
      'results':           'results',
    }
    const key = stepToRef[step]
    if (!key) return
    const t = setTimeout(() => {
      stepRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [step])

  const hasStyle1Selections = (selections['BY FORMAT']?.length || 0) + (selections['BY TRADITION']?.length || 0) + (selections['SCHEDULE']?.length || 0) > 0
  function toggleChip(cat: string, val: string) {
    setSelections((prev) => {
      const arr = prev[cat] || []
      return { ...prev, [cat]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] }
    })
  }

  function submitName() {
    const name = inputValue.trim()
    if (!name) return
    setUserName(name)
    sessionStorage.setItem('userName', name)
    setInputValue('')
    setStep('style1')
  }

  function submitStyle1() {
    if (!hasStyle1Selections) return
    const summary = [...(selections['BY FORMAT'] || []), ...(selections['BY TRADITION'] || []), ...(selections['SCHEDULE'] || [])].join(', ')
    setStyle1Summary(summary)
    setAllieStyleMsg(getStyleResponse(selections))
    sessionStorage.setItem('weddingStyle', summary)
    setStep('guests')
  }

  function submitGuests() {
    sessionStorage.setItem('guestCount', String(guestCount))
    setStep('moodboard-prompt')
  }

  function submitDate() {
    const date = inputValue.trim()
    if (!date) return
    setSubmittedDate(date)
    setInputValue('')
    setStep('results')
  }

  // Helper to check if we're past a given step
  const isPast = (s: Step) => {
    const order: Step[] = ['name', 'style1', 'guests', 'moodboard-prompt', 'moodboard-results', 'date-question', 'date-input', 'results']
    return order.indexOf(step) > order.indexOf(s)
  }

  return (
    <DesktopSplitWrapper>
    <div className="h-dvh bg-[#e8e8e8] md:bg-transparent overflow-hidden">
      <div className="w-full max-w-[390px] md:max-w-none mx-auto flex flex-col bg-[#f5f5f5] h-full">
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        {/* ── Wedding Notebook progress tracker ── */}
        <WeddingNotebook
          activeStep={
            step === 'name'                ? 1 :
            step === 'style1'              ? 1 :
            step === 'guests'              ? 2 :
            step === 'moodboard-prompt'    ? 3 :
            step === 'moodboard-results'   ? 3 :
            step === 'date-question'       ? 3 :
            step === 'date-input'          ? 3 :
            /* results */                    3
          }
        />

        {/* ── Desktop split: chat (left) + Selection Canvas (right) ── */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">

          {/* LEFT — chat column */}
          <div className="flex-1 md:flex-none md:w-[500px] md:shrink-0 flex flex-col min-h-0 bg-[#f5f5f5] md:border-r md:border-[#e8e8e7]">

        {/* ── Chat canvas ── */}
        <div className="flex flex-col gap-10 px-6 pt-7 pb-6 flex-1 overflow-y-auto">

          {/* Screen 3 — Allie intro */}
          <div className="flex items-start gap-3">
            <AllieAvatar />
            <AllieBubble>
              <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                I&apos;m Allie, I&apos;ll make it easy every step of the way.{' '}
                {weddingDate} in Mexican Pacific is 85 degrees, very low chance of rain. Good pick!
              </p>
              <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">
                Before we get started, what&apos;s your name?
              </p>
            </AllieBubble>
          </div>

          {/* After name — greeting + BY FORMAT/TRADITION card */}
          <AnimatePresence>
            {step !== 'name' && (
              <motion.div
                key="step-style1"
                ref={(el) => { stepRefs.current['style1'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-10"
              >
                <UserBubble>
                  <p className="font-sans font-normal text-base leading-6 text-white">{userName}</p>
                </UserBubble>

                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <AllieBubble delay={0.15}>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      Lovely to meet you, {userName} — and congratulations on your engagement!
                    </p>
                    <p className="font-sans font-medium text-base leading-6 text-[#000000]">
                      What style of celebration are you dreaming of?{' '}
                      <span className="font-normal text-[#585858]">
                        Choose as many as you like across all categories.
                      </span>
                    </p>
                  </AllieBubble>
                </div>

                {/* Format + Tradition card */}
                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <ChipCard
                    delay={0.3}
                    selections={selections}
                    onToggle={toggleChip}
                    categories={[
                      {
                        key: 'BY FORMAT',
                        options: ['Traditional', 'Elopement', 'Micro Wedding', 'Intimate', 'Vow Renewal'],
                      },
                      {
                        key: 'BY TRADITION',
                        options: ['Multi-Cultural', 'Indian', 'Jewish', 'Christian', 'Hindu', 'Muslim', 'Secular / Civil'],
                      },
                      {
                        key: 'SCHEDULE',
                        label: 'Schedule',
                        options: ['Ceremony & Reception', 'Multi-day celebration', 'Cocktails', 'Brunch'],
                      },
                    ]}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* After style1 — Allie response + guest count */}
          <AnimatePresence>
            {(step === 'guests' || step === 'moodboard-prompt' || step === 'moodboard-results' || step === 'date-question' || step === 'date-input' || step === 'results') && (
              <motion.div
                key="step-guests"
                ref={(el) => { stepRefs.current['guests'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-10"
              >
                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <AllieBubble delay={0.15}>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">{allieStyleMsg}</p>
                    <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">
                      How many people are celebrating with you?
                    </p>
                  </AllieBubble>
                </div>

                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <GuestCountCard count={guestCount} onChange={setGuestCount} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Moodboard prompt — AI feedback + mood picker */}
          <AnimatePresence>
            {(step === 'moodboard-prompt' || step === 'moodboard-results' || step === 'date-question' || step === 'date-input' || step === 'results') && (
              <motion.div
                key="step-moodboard-prompt"
                ref={(el) => { stepRefs.current['moodboard-prompt'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-10"
              >
                <UserBubble>
                  <p className="font-sans font-normal text-base leading-6 text-white">{guestCount} guests</p>
                </UserBubble>

                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <AllieBubble delay={0.15}>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      A wedding for {guestCount} feels like everyone you love in the same place at the same time. Let&apos;s find a vibe that feels right for you.
                    </p>
                    <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">
                      Five looks defining weddings right now. Pick the one that stops you. Choose the one that feels like you — Allie does the rest.
                    </p>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      Or upload your own.
                    </p>
                  </AllieBubble>
                </div>

                {/* Upload buttons — right aligned */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: 'easeOut', delay: 0.35 }}
                  className="flex flex-col items-end gap-4"
                >
                  <button className="h-[44px] px-[24px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center">
                    Upload Pinterest
                  </button>
                  <button className="h-[44px] px-[24px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center">
                    Upload Wedding binder
                  </button>
                </motion.div>

                {/* Mood cards */}
                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: 'easeOut', delay: 0.5 }}
                    className="flex flex-col gap-2"
                    style={{ maxWidth: 286, width: '100%' }}
                  >
                    {MOODS.map((mood) => (
                      <button
                        key={mood.name}
                        onClick={() => {
                          if (step === 'moodboard-prompt') {
                            setSelectedMood(mood.name)
                            sessionStorage.setItem('selectedMood', mood.name)
                            setStep('moodboard-results')
                          }
                        }}
                        className="bg-white rounded-[12px] flex flex-col overflow-hidden text-left w-full"
                        style={{
                          boxShadow: '0px 1px 2px 0px rgba(231,229,228,0.5)',
                          ...(isPast('moodboard-prompt') ? { opacity: 0.5, pointerEvents: 'none' } : {}),
                        }}
                      >
                        <div className="relative w-full overflow-hidden" style={{ height: mood.imageHeight }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={mood.image} alt={mood.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="flex w-full">
                          {mood.palette.map((color, i) => (
                            <div key={i} className="flex-1 h-[12px]" style={{ background: color }} />
                          ))}
                        </div>
                        <div className="flex flex-col gap-[4px] px-[12px] py-[16px]">
                          <p className="font-sans text-[18px] leading-6 text-black">{mood.name}</p>
                          <p className="font-sans text-[12px] leading-[16px] text-black">{mood.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Moodboard results — Allie response + mood display + masonry + Continue */}
          <AnimatePresence>
            {(step === 'moodboard-results' || step === 'date-question' || step === 'date-input' || step === 'results') && (
              <motion.div
                key="step-moodboard-results"
                ref={(el) => { stepRefs.current['moodboard-results'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <AllieBubble delay={0.15}>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      That&apos;s a beautiful choice — there is something so effortlessly romantic about a celebration that feels like it&apos;s growing wild and breathing right along with you.
                    </p>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      That&apos;s a beautifully clear north star, and every venue, vendor, and detail from here will pull from that exact mood.
                    </p>
                  </AllieBubble>
                </div>

                {/* Mood name + subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: 'easeOut', delay: 0.3 }}
                  className="flex flex-col gap-[4px] px-[12px]"
                >
                  <p className="font-serif text-[30px] leading-[40px] text-black">{selectedMood}</p>
                  <p className="font-sans text-[12px] leading-[16px] text-black">
                    {MOODS.find((m) => m.name === selectedMood)?.subtitle}
                  </p>
                </motion.div>

                {/* Palette */}
                <div className="flex px-[12px]">
                  {(MOODS.find((m) => m.name === selectedMood)?.palette ?? ['#f0ebe0', '#c4b99a', '#7a8c65', '#3d5236']).map((color, i) => (
                    <div key={i} className="flex-1 h-[12px]" style={{ background: color }} />
                  ))}
                </div>

                {/* Masonry grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="flex items-start justify-between overflow-hidden px-[12px]"
                >
                  <div className="flex flex-col gap-[6px]" style={{ width: 180 }}>
                    {MASONRY_LEFT.map((img, i) => (
                      <div key={i} className="relative w-full overflow-hidden" style={{ height: img.h }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-[6px]" style={{ width: 180 }}>
                    {MASONRY_RIGHT.map((img, i) => (
                      <div key={i} className="relative w-full overflow-hidden" style={{ height: img.h }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Continue button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: 'easeOut', delay: 0.55 }}
                  className="flex justify-center py-4"
                >
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { if (step === 'moodboard-results') setStep('date-question') }}
                    className="h-[48px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
                    style={{
                      width: 286,
                      ...(isPast('moodboard-results') ? { opacity: 0.5, pointerEvents: 'none' } : {}),
                    }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date question — Allie pitch + two option cards */}
          <AnimatePresence>
            {(step === 'date-question' || step === 'date-input' || step === 'results') && (
              <motion.div
                key="step-date-q"
                ref={(el) => { stepRefs.current['date-q'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-10"
              >
                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <AllieBubble delay={0.15}>
                    <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                      Nobu Los Cabos. Pacific-facing, impossibly intimate for {guestCount}, and the food will be talked about for years.
                    </p>
                    <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">
                      Before I show you what&apos;s available — when are you thinking?
                    </p>
                  </AllieBubble>
                </div>

                <div className="flex items-start gap-3">
                  <AllieAvatar />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: 'easeOut', delay: 0.3 }}
                    className="flex flex-col gap-3"
                    style={{ maxWidth: 286 }}
                  >
                    <button
                      onClick={() => setStep('date-input')}
                      className="bg-white border border-[#d0d0d0] rounded-xl p-[17px] text-left w-full"
                      style={step !== 'date-question' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                      <p className="font-sans font-light text-base text-[#1b1c1c] tracking-[0.4px]">I have a date in mind</p>
                    </button>
                    <Link
                      href="/flexible"
                      className="bg-white border border-[#d0d0d0] rounded-xl p-[17px] text-left w-full block"
                      style={step !== 'date-question' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                      <p className="font-sans font-light text-base text-[#1b1c1c] tracking-[0.4px]">I&apos;m flexible</p>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results — user date + Allie response + CTA */}
          <AnimatePresence>
            {step === 'results' && (
              <motion.div
                key="step-results"
                ref={(el) => { stepRefs.current['results'] = el }}
                style={{ scrollMarginTop: 16 }}
                className="flex flex-col gap-10"
              >
                <UserBubble>
                  <p className="font-sans font-normal text-base leading-6 text-white">{submittedDate}</p>
                </UserBubble>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <AllieAvatar />
                    <AllieBubble delay={0.15}>
                      <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                        <span className="font-medium text-[#2b2b27]">{submittedDate}.</span>{' '}
                        Here&apos;s what&apos;s available for your {guestCount}-guest celebration at Nobu Los Cabos.
                      </p>
                    </AllieBubble>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, ease: 'easeOut', delay: 0.35 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (submittedDate) sessionStorage.setItem('selectedSpaceDate', submittedDate)
                        router.push('/loader')
                      }}
                      className="flex items-center justify-center h-[44px] rounded-full bg-black"
                      style={{ width: 286 }}
                    >
                      <span className="font-sans font-medium text-base leading-6 text-white">
                        Explore the available spaces
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── Input bar (sticky on mobile, anchored to chat column on desktop) ── */}
        <div className="w-full bg-[#f5f5f5] border-t border-[#ebebeb] px-4 py-5 flex flex-col gap-3 shrink-0">
          {/* Continue button — appears when selections exist */}
          <AnimatePresence>
            {step === 'style1' && hasStyle1Selections && (
              <motion.button
                key="continue-style1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitStyle1}
                className="w-full h-11 rounded-full bg-black flex items-center justify-center"
              >
                <span className="font-sans font-medium text-base text-white">Continue →</span>
              </motion.button>
            )}
            {step === 'guests' && (
              <motion.button
                key="continue-guests"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitGuests}
                className="w-full h-11 rounded-full bg-black flex items-center justify-center"
              >
                <span className="font-sans font-medium text-base text-white">Continue →</span>
              </motion.button>
            )}
          </AnimatePresence>

          {step === 'name' ? (
            <InputBar
              value={inputValue}
              onChange={setInputValue}
              onSend={submitName}
              onKeyDown={(e) => e.key === 'Enter' && submitName()}
              placeholder="Type your name..."
              disabled={!inputValue.trim()}
            />
          ) : step === 'date-input' ? (
            <InputBar
              value={inputValue}
              onChange={setInputValue}
              onSend={submitDate}
              onKeyDown={(e) => e.key === 'Enter' && submitDate()}
              placeholder="Enter a date..."
              disabled={!inputValue.trim()}
            />
          ) : (
            <InputBar placeholder="Type a message..." />
          )}
        </div>

          </div>
          {/* END LEFT — chat column */}

          {/* RIGHT — Selection Canvas (desktop only) */}
          <div className="hidden md:flex md:flex-1 min-h-0">
            <SelectionCanvas
              userName={userName}
              weddingDate={weddingDate}
              submittedDate={submittedDate}
              selections={selections}
              hasStyle1Selections={hasStyle1Selections}
              guestCount={guestCount}
              selectedMood={selectedMood}
              step={step}
            />
          </div>

        </div>
        {/* END desktop split */}

      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
    </DesktopSplitWrapper>
  )
}
