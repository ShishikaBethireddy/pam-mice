'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

// ── Types & constants ────────────────────────────────────────────
type DotType = 'best' | 'neutral' | 'demand'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const SEASON_START: Record<string, { year: number; month: number }> = {
  Spring: { year: 2027, month: 3 },   // April
  Summer: { year: 2027, month: 5 },   // June
  Fall:   { year: 2027, month: 8 },   // September
  Winter: { year: 2027, month: 11 },  // December
}

const SEASONS = [
  { label: 'Spring', dot: null },
  { label: 'Summer', dot: '#b4b4b4' },
  { label: 'Fall',   dot: '#ca9151' },
  { label: 'Winter', dot: '#b4b4b4' },
]

const TEXT_COLOR: Record<DotType, string> = {
  best:    '#49513e',
  neutral: '#2b2b27',
  demand:  '#b83d30',
}
const DOT_COLOR: Record<DotType, string> = {
  best:    '#ca9151',
  neutral: '#b4b4b4',
  demand:  '#b83d30',
}

// ── Helpers ──────────────────────────────────────────────────────
function dotType(year: number, month: number, day: number): DotType {
  const dow = new Date(year, month, day).getDay()
  if (dow === 5 || dow === 6) return 'demand'
  if (dow === 2 || dow === 3) return 'best'
  return 'neutral'
}

function buildCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function fmtDate(d: Date) {
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`
}

// 3-week wedding date range = anchor date ± 10 days (= 21 days total)
const RANGE_OFFSET_DAYS = 10

function formatRange(start: Date, end: Date) {
  return start.getFullYear() === end.getFullYear()
    ? `${fmtDate(start)} – ${fmtDate(end)}, ${end.getFullYear()}`
    : `${fmtDate(start)}, ${start.getFullYear()} – ${fmtDate(end)}, ${end.getFullYear()}`
}

// ── Day cell ─────────────────────────────────────────────────────
interface CellProps {
  day: number | null
  year: number
  month: number
  inStay?: boolean
  isSelected?: boolean
  onTap?: () => void
}

function DayCell({ day, year, month, inStay = false, isSelected = false, onTap }: CellProps) {
  if (!day) return <div className="shrink-0" style={{ width: 47, height: 48 }} />

  const type = dotType(year, month, day)

  const style: React.CSSProperties = isSelected
    ? { background: '#f5f5f5', border: '1px solid #d0d0d0' }
    : !inStay
    ? { background: 'white' }
    : {}

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      className="shrink-0 flex flex-col items-center justify-center gap-[4px] rounded-[8px] cursor-pointer select-none"
      style={{ width: 47, height: 48, ...style }}
    >
      <span
        className="font-sans font-normal text-[14px] text-center"
        style={{ color: isSelected ? '#2b2b27' : TEXT_COLOR[type] }}
      >
        {day}
      </span>
      <span
        className="rounded-full"
        style={{ width: 4, height: 4, background: isSelected ? '#ca9151' : DOT_COLOR[type] }}
      />
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function FlexiblePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState('Spring')
  const [currentYear, setCurrentYear] = useState(2027)
  const [currentMonth, setCurrentMonth] = useState(3) // April
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [rangeText, setRangeText] = useState('')
  const router = useRouter()

  function chooseSeason(season: string) {
    setSelectedSeason(season)
    const { year, month } = SEASON_START[season]
    setCurrentYear(year)
    setCurrentMonth(month)
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  function tapDate(day: number) {
    const sel = new Date(currentYear, currentMonth, day)
    setSelectedDate(sel)
    const start = new Date(sel); start.setDate(sel.getDate() - RANGE_OFFSET_DAYS)
    const end   = new Date(sel); end.setDate(sel.getDate() + RANGE_OFFSET_DAYS)
    setRangeText(formatRange(start, end))
  }

  // Which days in the current month view fall inside the 3-week wedding date range?
  const stayDays = selectedDate
    ? (() => {
        const start = new Date(selectedDate); start.setDate(selectedDate.getDate() - RANGE_OFFSET_DAYS)
        const end   = new Date(selectedDate); end.setDate(selectedDate.getDate() + RANGE_OFFSET_DAYS)
        const out: Set<number> = new Set()
        for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth)
            out.add(d.getDate())
        }
        return out
      })()
    : new Set<number>()

  const selectedDayInView =
    selectedDate &&
    selectedDate.getFullYear() === currentYear &&
    selectedDate.getMonth() === currentMonth
      ? selectedDate.getDate()
      : null

  // Build week rows
  const cells = buildCells(currentYear, currentMonth)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

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
        <div className="flex items-center gap-[6px] p-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#767676" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/chat" className="font-sans font-normal text-[11px] leading-[14px] text-[#767676]">Back</Link>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-[8px] px-[20px] pb-[20px]">
          <h1 className="font-serif italic text-[30px] leading-[40px] text-[#2b2b27]">
            When would you like to celebrate?
          </h1>
          <p className="font-sans font-normal text-base leading-6 text-[#757569]">
            Tap any date — we&apos;ll highlight a 3-week wedding date range around it.
          </p>
        </div>

        {/* Season chips */}
        <div className="flex items-center gap-[6px] px-[20px] pb-[16px]">
          {SEASONS.map((s) => {
            const active = selectedSeason === s.label
            return (
              <motion.button
                key={s.label}
                whileTap={{ scale: 0.96 }}
                onClick={() => chooseSeason(s.label)}
                className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-full border shrink-0 transition-colors"
                style={active
                  ? { background: '#34342f', borderColor: '#34342f' }
                  : { background: 'white', borderColor: '#dad6ce' }}
              >
                <span className="rounded-full shrink-0" style={{ width: 6, height: 6, background: active ? 'white' : (s.dot ?? '#34342f') }} />
                <span className="font-sans text-[12px] whitespace-nowrap" style={{ fontWeight: active ? 600 : 400, color: active ? 'white' : '#2b2b27' }}>
                  {s.label}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Allie's Pick — full width, Surface/Feature #585858 */}
        <div className="w-full flex flex-col gap-[14px] p-[24px]" style={{ background: '#585858' }}>
          <div className="flex items-center gap-[6px]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-[0px_0.6px_0.6px_rgba(0,0,0,0.05)]" style={{ background: 'white' }}>
              <div className="relative" style={{ width: 16, height: 13 }}>
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            </div>
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">Allie&apos;s Pick</p>
          </div>
          <p className="font-sans font-normal text-base leading-6 text-white">
            April has the best venue availability for your guest count. Mid-week wedding dates run 20–30% below peak Saturday rates. Your expected arrival/departure for a traditional wedding is 2 days before and after. Enough room blocks are available!
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-[16px] bg-white px-[20px] py-[10px]">
          {[
            { label: 'Best value',    color: '#ca9151', size: 8 },
            { label: 'Not Available', color: '#b4b4b4', size: 4 },
            { label: 'High Demand',   color: '#b83d30', size: 8 },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-[6px]">
              <span className="rounded-full shrink-0" style={{ width: l.size, height: l.size, background: l.color }} />
              <span className="font-sans font-normal text-[11px] text-[#757569]">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-[12px] px-[20px] py-[24px]"
          >
            {/* Month header */}
            <div className="flex items-center gap-[12px] w-full">
              <p className="font-sans font-normal text-[20px] leading-[28px] text-[#2b2b27] whitespace-nowrap">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </p>
              <div className="flex-1 flex items-center justify-end gap-[8px] px-[12px]">
                <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-full">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-full">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.button>
              </div>
            </div>

            {/* Day headers */}
            <div className="flex gap-[3px]">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="flex items-center justify-center" style={{ width: 47, height: 20 }}>
                  <span className="font-sans font-medium text-[10px] tracking-[0.6px] text-[#757569]">{d}</span>
                </div>
              ))}
            </div>

            {/* Week rows */}
            <div className="flex flex-col gap-[3px]">
              {weeks.map((week, wi) => {
                const stayInRow = week.filter(d => d !== null && stayDays.has(d as number)) as number[]
                if (stayInRow.length === 0) {
                  return (
                    <div key={wi} className="flex gap-[3px]">
                      {week.map((day, ci) => (
                        <DayCell key={ci} day={day} year={currentYear} month={currentMonth} onTap={day ? () => tapDate(day) : undefined} />
                      ))}
                    </div>
                  )
                }
                // Split row: before-stay | stay-group | after-stay
                const firstIdx = week.findIndex(d => d !== null && stayDays.has(d as number))
                const lastIdx  = week.length - 1 - [...week].reverse().findIndex(d => d !== null && stayDays.has(d as number))
                return (
                  <div key={wi} className="flex gap-[3px]">
                    {week.slice(0, firstIdx).map((day, ci) => (
                      <DayCell key={ci} day={day} year={currentYear} month={currentMonth} onTap={day ? () => tapDate(day) : undefined} />
                    ))}
                    <div className="flex gap-[3px] rounded-[8px]" style={{ background: '#e8e8e8' }}>
                      {week.slice(firstIdx, lastIdx + 1).map((day, ci) => (
                        <DayCell
                          key={ci}
                          day={day}
                          year={currentYear}
                          month={currentMonth}
                          inStay
                          isSelected={day !== null && day === selectedDayInView}
                          onTap={day ? () => tapDate(day) : undefined}
                        />
                      ))}
                    </div>
                    {week.slice(lastIdx + 1).map((day, ci) => (
                      <DayCell key={ci} day={day} year={currentYear} month={currentMonth} onTap={day ? () => tapDate(day) : undefined} />
                    ))}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Wedding date range */}
        <div className="flex items-center gap-[16px] bg-[#f5f5f5] px-[20px] pt-[16px] pb-[8px]">
          <p
            className="font-sans font-normal text-[14px] leading-[20px] text-[#2b2b27] shrink-0"
            style={{ width: 100 }}
          >
            wedding<br />date range
          </p>
          <div
            className="flex items-center gap-[8px] h-[44px] px-[8px] rounded-md border flex-1"
            style={{ background: 'white', borderColor: '#d0d0d0' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <rect x="2" y="3" width="16" height="15" rx="2" stroke="#2b2b27" strokeWidth="1.2" />
              <path d="M6 1.5V4M14 1.5V4M2 8H18" stroke="#2b2b27" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="font-sans font-normal text-[14px] leading-5 whitespace-nowrap" style={{ color: rangeText ? '#211e1e' : '#b4b4b4' }}>
              {rangeText || 'Select a date'}
            </span>
          </div>
        </div>

        {/* Stay window — fixed buffer */}
        <div className="flex items-center gap-[16px] bg-[#f5f5f5] px-[20px] pt-[8px] pb-[24px]">
          <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-[#767676] shrink-0" style={{ width: 100 }}>
            STAY WINDOW
          </p>
          <div
            className="flex items-center gap-[8px] h-[44px] px-[8px] rounded-md border flex-1"
            style={{ background: 'white', borderColor: '#d0d0d0' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <rect x="2" y="3" width="16" height="15" rx="2" stroke="#2b2b27" strokeWidth="1.2" />
              <path d="M6 1.5V4M14 1.5V4M2 8H18" stroke="#2b2b27" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="font-sans font-normal text-[14px] leading-5 whitespace-nowrap text-[#211e1e]">
              2 days before/after
            </span>
          </div>
        </div>

        {/* Promo — real image with 24px-margin frosted glass panel */}
        <div className="relative w-full flex-1 overflow-hidden flex flex-col items-start justify-end p-[24px]" style={{ minHeight: 300 }}>
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/promo-nobu-cabos.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          {/* Frosted glass panel — sits at bottom, 24px from all edges */}
          <div
            className="relative w-full flex flex-col gap-[24px] p-[24px]"
            style={{
              background: 'rgba(43,43,39,0.6)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
            }}
          >
            <div className="flex flex-col gap-[4px] text-white overflow-hidden">
              <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap">
                Weekday Wedding Exclusive Offer
              </p>
              <p className="font-serif text-[24px] leading-[36px]" style={{ width: 294 }}>
                20% off the all-in package
              </p>
              <p className="font-sans font-normal text-[12px] leading-4 text-white/80">
                Saturdays at Nobu Hotel Los Cabos book 6–9 months out. Pick a Monday–Thursday wedding day and Allie auto-applies 20% off your venue, design fee, and welcome events.
              </p>
            </div>
            <div className="flex">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center rounded-full"
                style={{ background: '#34342f', height: 36, paddingLeft: 18, paddingRight: 18 }}
              >
                <span className="font-sans font-light text-[14px] leading-5 text-white whitespace-nowrap">
                  Book your forever day
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sticky Continue — appears after a date is selected */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="sticky bottom-0 w-full bg-[#f5f5f5] border-t border-[#ebebeb] px-4 py-5"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (rangeText) sessionStorage.setItem('selectedSpaceDate', rangeText)
                  router.push('/loader')
                }}
                className="w-full h-11 rounded-full bg-black flex items-center justify-center"
              >
                <span className="font-sans font-medium text-base leading-6 text-white">Continue →</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
