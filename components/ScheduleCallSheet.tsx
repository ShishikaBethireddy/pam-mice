'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

interface Props {
  open: boolean
  onClose: () => void
  conciergeName?: string
  conciergeRole?: string
  conciergeAvatar?: string // public path or remote URL
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
]

const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABEL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

interface DayOption {
  date: Date
  isToday: boolean
  dow: string
  dayNum: number
  monthShort: string
}

function buildDays(count = 14): DayOption[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      date: d,
      isToday: i === 0,
      dow: DAY_LABEL[d.getDay()],
      dayNum: d.getDate(),
      monthShort: MONTH_LABEL[d.getMonth()],
    }
  })
}

function formatFullDate(d: Date): string {
  return `${DAY_LABEL[d.getDay()]}, ${MONTH_LABEL[d.getMonth()]} ${d.getDate()}`
}

export default function ScheduleCallSheet({
  open,
  onClose,
  conciergeName = 'Camila Avalos',
  conciergeRole = PRODUCT.eventsConcierge,
  conciergeAvatar,
}: Props) {
  const [view, setView] = useState<'form' | 'success'>('form')
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(1) // tomorrow by default
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const days = useMemo(() => buildDays(14), [])
  const selectedDay = days[selectedDayIdx]
  const canConfirm = selectedDay && selectedTime && phone.trim().length > 0

  // Reset when reopened
  useEffect(() => {
    if (open) {
      setView('form')
      setSelectedTime(null)
      setNotes('')
    }
  }, [open])

  function confirm() {
    if (!canConfirm) return
    setView('success')
  }

  function close() {
    onClose()
    // small delay to avoid flashing the form during exit
    setTimeout(() => {
      setView('form')
      setSelectedTime(null)
      setPhone('')
      setNotes('')
    }, 250)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white flex flex-col mx-auto"
            style={{
              borderRadius: '20px 20px 0 0',
              maxWidth: 480,
              maxHeight: '92vh',
            }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-[10px] pb-[4px] shrink-0">
              <div className="h-[4px] w-[36px] rounded-full" style={{ background: '#d0d0d0' }} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {view === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-h-0 flex-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between px-[20px] pt-[8px] pb-[12px] shrink-0">
                    <div className="flex flex-col gap-[2px]">
                      <p
                        className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase"
                        style={{ color: '#767676' }}
                      >
                        Schedule a call
                      </p>
                      <p className="font-serif text-[22px] leading-[28px] text-black">
                        Pick a time with your concierge
                      </p>
                    </div>
                    <button
                      onClick={close}
                      aria-label="Close"
                      className="w-[32px] h-[32px] -mr-[6px] -mt-[2px] flex items-center justify-center rounded-full"
                      style={{ color: '#2b2b27' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 4L14 14M14 4L4 14" stroke="#2b2b27" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Concierge card */}
                  <div className="flex items-center gap-[12px] mx-[20px] mb-[16px] p-[12px] rounded-[12px]" style={{ background: '#f5f5f5' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={conciergeAvatar || 'https://i.pravatar.cc/96?img=47'}
                      alt=""
                      className="w-[44px] h-[44px] rounded-full object-cover shrink-0"
                      style={{ border: '1.5px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-sans font-medium text-[14px] leading-[18px] text-black truncate">{conciergeName}</p>
                      <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#757569' }}>{conciergeRole}</p>
                    </div>
                    <div className="flex items-center gap-[4px] shrink-0">
                      <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#646f53' }} />
                      <span className="font-sans text-[11px]" style={{ color: '#4a5635' }}>Online now</span>
                    </div>
                  </div>

                  {/* Scrollable body */}
                  <div className="flex-1 min-h-0 overflow-y-auto px-[20px] pb-[16px]">
                    {/* Date picker */}
                    <p
                      className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase mb-[10px]"
                      style={{ color: '#767676' }}
                    >
                      Select a date
                    </p>
                    <div className="flex gap-[8px] overflow-x-auto pb-[6px] -mx-[20px] px-[20px] scrollbar-hide">
                      {days.map((day, i) => {
                        const selected = i === selectedDayIdx
                        return (
                          <button
                            key={day.date.toISOString()}
                            onClick={() => setSelectedDayIdx(i)}
                            className="shrink-0 flex flex-col items-center justify-center rounded-[12px] py-[10px] px-[12px] transition-colors"
                            style={{
                              width: 60,
                              background: selected ? '#2b2b27' : 'white',
                              color: selected ? 'white' : '#2b2b27',
                              border: `1px solid ${selected ? '#2b2b27' : '#e0ddd6'}`,
                            }}
                          >
                            <span
                              className="font-sans text-[10px] tracking-[0.6px] uppercase"
                              style={{ color: selected ? 'rgba(255,255,255,0.7)' : '#969696' }}
                            >
                              {day.isToday ? 'Today' : day.dow}
                            </span>
                            <span className="font-serif text-[22px] leading-[26px] mt-[2px]">{day.dayNum}</span>
                            <span
                              className="font-sans text-[10px] tracking-[0.4px] uppercase"
                              style={{ color: selected ? 'rgba(255,255,255,0.7)' : '#969696' }}
                            >
                              {day.monthShort}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Time slots */}
                    <p
                      className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase mt-[20px] mb-[10px]"
                      style={{ color: '#767676' }}
                    >
                      Select a time <span style={{ color: '#b4b4b4' }}>· PST</span>
                    </p>
                    <div className="grid grid-cols-3 gap-[8px]">
                      {TIME_SLOTS.map((slot) => {
                        const selected = selectedTime === slot
                        return (
                          <motion.button
                            key={slot}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedTime(slot)}
                            className="h-[40px] rounded-[10px] font-sans text-[13px] flex items-center justify-center transition-colors"
                            style={{
                              background: selected ? '#2b2b27' : 'white',
                              color: selected ? 'white' : '#2b2b27',
                              border: `1px solid ${selected ? '#2b2b27' : '#e0ddd6'}`,
                            }}
                          >
                            {slot}
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Phone */}
                    <label className="flex flex-col gap-[6px] mt-[20px]">
                      <span
                        className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase"
                        style={{ color: '#767676' }}
                      >
                        Phone number
                      </span>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-[44px] rounded-[10px] px-[14px] font-sans text-[14px] leading-[20px] text-black bg-white outline-none focus:border-black"
                        style={{ border: '1px solid #d0d0d0' }}
                      />
                    </label>

                    {/* Notes */}
                    <label className="flex flex-col gap-[6px] mt-[14px]">
                      <span
                        className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase"
                        style={{ color: '#767676' }}
                      >
                        Anything we should know? <span style={{ color: '#b4b4b4' }}>(optional)</span>
                      </span>
                      <textarea
                        rows={2}
                        placeholder="e.g. We&apos;re weighing two date options"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="rounded-[10px] px-[14px] py-[10px] font-sans text-[14px] leading-[20px] text-black bg-white outline-none focus:border-black resize-none"
                        style={{ border: '1px solid #d0d0d0' }}
                      />
                    </label>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-[8px] px-[20px] pb-[24px] pt-[12px] shrink-0" style={{ borderTop: '1px solid #ececec' }}>
                    {selectedDay && selectedTime && (
                      <div className="flex items-center justify-between px-[12px] py-[8px] rounded-[10px]" style={{ background: '#f5f5f5' }}>
                        <span className="font-sans text-[12px]" style={{ color: '#757569' }}>Selected</span>
                        <span className="font-sans font-medium text-[13px] text-black">
                          {formatFullDate(selectedDay.date)} · {selectedTime}
                        </span>
                      </div>
                    )}
                    <motion.button
                      whileTap={canConfirm ? { scale: 0.98 } : undefined}
                      onClick={confirm}
                      disabled={!canConfirm}
                      className="w-full h-[48px] rounded-full font-sans font-medium text-base flex items-center justify-center transition-opacity"
                      style={{
                        background: 'black',
                        color: 'white',
                        opacity: canConfirm ? 1 : 0.4,
                        cursor: canConfirm ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Confirm call
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center px-[24px] pt-[8px] pb-[28px]"
                >
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-[16px]"
                    style={{ background: '#e7eddb' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path
                        d="M7 14L12 19L21 9"
                        stroke="#4a5635"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <p className="font-serif text-[24px] leading-[30px] text-black mb-[8px]">
                    You&apos;re on the calendar
                  </p>
                  <p className="font-sans text-[14px] leading-[20px] mb-[16px]" style={{ color: '#757569', maxWidth: 280 }}>
                    {conciergeName.split(' ')[0]} will call you on
                  </p>

                  {selectedDay && selectedTime && (
                    <div
                      className="w-full max-w-[300px] flex items-center gap-[16px] px-[18px] py-[14px] rounded-[12px] mb-[20px]"
                      style={{ border: '1px solid #e0ddd6', background: '#faf8f4' }}
                    >
                      <div
                        className="w-[48px] h-[48px] rounded-[10px] flex flex-col items-center justify-center shrink-0"
                        style={{ background: 'white', border: '1px solid #e0ddd6' }}
                      >
                        <span className="font-sans text-[8px] tracking-[0.6px] uppercase" style={{ color: '#c47f12' }}>
                          {selectedDay.monthShort}
                        </span>
                        <span className="font-serif text-[20px] leading-[22px] text-black">{selectedDay.dayNum}</span>
                      </div>
                      <div className="flex flex-col items-start flex-1 text-left">
                        <p className="font-sans font-medium text-[14px] leading-[18px] text-black">
                          {formatFullDate(selectedDay.date)}
                        </p>
                        <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#757569' }}>
                          {selectedTime} PST · 30 min
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="font-sans text-[12px] leading-[16px] mb-[20px]" style={{ color: '#969696', maxWidth: 280 }}>
                    A confirmation has been sent to {phone || 'your phone'}.
                    We&apos;ll text 15 min before.
                  </p>

                  <div className="flex flex-col gap-[10px] w-full max-w-[300px]">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alert('Calendar invite downloaded.')}
                      className="w-full h-[44px] rounded-full border font-sans font-medium text-[14px] text-black flex items-center justify-center gap-[8px]"
                      style={{ borderColor: '#767676' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="#2b2b27" strokeWidth="1.3" />
                        <path d="M2.5 6.5H13.5" stroke="#2b2b27" strokeWidth="1.3" />
                        <path d="M5 2V5M11 2V5" stroke="#2b2b27" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                      Add to calendar
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={close}
                      className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-[14px] text-white flex items-center justify-center"
                    >
                      Done
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
