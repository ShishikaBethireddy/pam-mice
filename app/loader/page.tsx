'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type StepState = 'pending' | 'active' | 'done'

interface MatchStep {
  id: string
  label: string
  hint: (ctx: Ctx) => string
}

interface Ctx {
  selectedMood: string
  guestCount: string
  weddingStyle: string
  selectedDate: string
  venueName: string
}

const STEPS: MatchStep[] = [
  {
    id: 'moodboard',
    label: 'Based on your moodboard',
    hint: (c) =>
      c.selectedMood
        ? `Matching your "${c.selectedMood}" vision`
        : c.weddingStyle
          ? `Matching your "${c.weddingStyle}" vision`
          : 'Matching your style preferences',
  },
  {
    id: 'guests',
    label: 'Taking in your guest count',
    hint: (c) =>
      c.guestCount
        ? `Filtering for ${c.guestCount} guests`
        : 'Filtering by your guest count',
  },
  {
    id: 'ranking',
    label: 'Ranking the best spaces at this venue',
    hint: (c) =>
      c.venueName ? `Sorting all spaces at ${c.venueName}` : 'Sorting all spaces by fit',
  },
]

const STEP_DURATION_MS = 1200 // each step takes ~1.2s
const FINAL_HOLD_MS = 600    // brief pause after last check before routing

export default function MatchingLoaderPage() {
  const router = useRouter()
  const [ctx, setCtx] = useState<Ctx>({
    selectedMood: '',
    guestCount: '',
    weddingStyle: '',
    selectedDate: '',
    venueName: 'Nobu Los Cabos',
  })
  const [activeIndex, setActiveIndex] = useState(0)

  // Read context from sessionStorage on mount
  useEffect(() => {
    setCtx({
      selectedMood: sessionStorage.getItem('selectedMood')   || '',
      guestCount:   sessionStorage.getItem('guestCount')     || '',
      weddingStyle: sessionStorage.getItem('weddingStyle')   || '',
      selectedDate:
        sessionStorage.getItem('selectedSpaceDate') ||
        sessionStorage.getItem('weddingDate')        || '',
      venueName:    sessionStorage.getItem('selectedVenue')   || 'Nobu Los Cabos',
    })
  }, [])

  // Advance through the steps then navigate
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= STEPS.length; i++) {
      timers.push(setTimeout(() => setActiveIndex(i), STEP_DURATION_MS * i))
    }
    timers.push(
      setTimeout(
        () => router.push('/spaces'),
        STEP_DURATION_MS * STEPS.length + FINAL_HOLD_MS
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [router])

  function stateForStep(i: number): StepState {
    if (i < activeIndex) return 'done'
    if (i === activeIndex) return 'active'
    return 'pending'
  }

  const progressPct = Math.min(100, (activeIndex / STEPS.length) * 100)

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>
        <Header
          onMenuToggle={() => {}}
          onConciergeToggle={() => {}}
          menuOpen={false}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        <div className="flex-1 flex flex-col items-center justify-center px-[24px] py-[40px]">
          {/* Pulsing Allie diamond */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative mb-[28px]"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.05, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-[-12px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(88,88,88,0.25), rgba(88,88,88,0) 70%)' }}
            />
            <div
              className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
              style={{ background: '#2b2b27', boxShadow: '0 6px 18px rgba(43,43,39,0.25)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-2px] rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.65))',
                  maskImage:
                    'radial-gradient(circle, transparent 32px, black 33px)',
                  WebkitMaskImage:
                    'radial-gradient(circle, transparent 32px, black 33px)',
                }}
              />
              <Image src="/assets/icon-diamond.svg" alt="" width={32} height={28} style={{ filter: 'invert(1)' }} />
            </div>
          </motion.div>

          {/* Eyebrow + title */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase mb-[8px]"
            style={{ color: '#767676' }}
          >
            Matching
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-serif text-[28px] leading-[34px] text-black text-center max-w-[300px]"
          >
            Finding your perfect spaces
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-sans text-[13px] leading-[18px] text-center mt-[8px]"
            style={{ color: '#757569', maxWidth: 280 }}
          >
            Allie is ranking every option at {ctx.venueName} against everything you&apos;ve told her.
          </motion.p>

          {/* Progress bar */}
          <div
            className="relative w-full max-w-[300px] h-[4px] rounded-full overflow-hidden mt-[28px]"
            style={{ background: '#e0ddd6' }}
          >
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: '#2b2b27' }}
            />
          </div>

          {/* Steps list */}
          <div className="flex flex-col gap-[14px] w-full max-w-[300px] mt-[28px]">
            {STEPS.map((step, i) => {
              const state = stateForStep(i)
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-[12px]"
                >
                  {/* Status indicator */}
                  <div className="shrink-0 mt-[2px]">
                    <AnimatePresence mode="wait">
                      {state === 'done' ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                          className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
                          style={{ background: '#646f53' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      ) : state === 'active' ? (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
                          style={{ border: '2px solid #2b2b27' }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                            className="w-[10px] h-[10px] rounded-full"
                            style={{
                              borderTop: '2px solid #2b2b27',
                              borderRight: '2px solid transparent',
                              borderBottom: '2px solid transparent',
                              borderLeft: '2px solid transparent',
                            }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="pending"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-[20px] h-[20px] rounded-full"
                          style={{ border: '1.5px dashed #c4c0b6' }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                    <p
                      className="font-sans text-[14px] leading-[20px]"
                      style={{
                        color: state === 'pending' ? '#a8a496' : '#2b2b27',
                        fontWeight: state === 'active' ? 500 : 400,
                      }}
                    >
                      {step.label}
                      {state === 'active' && <AnimatedDots />}
                    </p>
                    <p
                      className="font-sans text-[11px] leading-[14px]"
                      style={{ color: state === 'pending' ? '#c4c0b6' : '#757569' }}
                    >
                      {step.hint(ctx)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <Footer bg="#000000" />
      </div>
    </div>
  )
}

function AnimatedDots() {
  return (
    <span className="inline-flex ml-[2px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          aria-hidden
        >
          .
        </motion.span>
      ))}
    </span>
  )
}
