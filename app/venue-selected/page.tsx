'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import Footer from '@/components/Footer'
import DesktopSplitWrapper from '@/components/DesktopSplitWrapper'

type Step = 'question' | 'stories' | 'save-date'

const COUPLES = [
  {
    image: '/assets/wedding-priya-rahul.png',
    name: 'Priya + Rahul',
    date: 'Sept 2024 · 420 guests',
    href: '/couples/sofia-james',
  },
  {
    image: '/assets/wedding-sofia-james.png',
    name: 'Sofia + James',
    date: 'Jun 2024 · 280 guests',
    href: '/couples/sofia-james',
  },
  {
    image: '/assets/wedding-mark-brendan.webp',
    name: 'Mark + Brendan',
    date: 'May 2025 · 80 guests',
    href: '/couples/sofia-james',
  },
]

const msgVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function VenueSelectedPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [step, setStep] = useState<Step>('question')
  const [venueName, setVenueName] = useState('Shiawase Terrace')
  const [sheetOpen, setSheetOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedVenue')
    if (saved) setVenueName(saved)
  }, [])

  return (
    <DesktopSplitWrapper>
    <div className="screen-wrap">
      <div className="mobile-frame" style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        {/* ── Scrollable content ── */}
        <div className="flex flex-col h-full bg-[#f5f5f5] overflow-y-auto">
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        <div className="flex flex-col flex-1 px-[16px] py-[24px] gap-[16px]">

          {/* ── Allie avatar + question bubble ── */}
          <motion.div
            variants={msgVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start gap-[10px]"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-[2px]">
              <div className="relative w-4 h-4">
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" />
              </div>
            </div>

            {/* Bubble */}
            <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]" style={{ maxWidth: 270 }}>
              <p className="font-sans text-[14px] leading-[20px] text-[#2b2b27]">
                <span className="font-semibold">{venueName}</span>
                {venueName === 'Shiawase Terrace'
                  ? ' is your best match — oceanfront, fits 150 comfortably, and the Pacific light at 5:30pm is something no filter can replicate.'
                  : venueName === 'Yakusoku Garden'
                  ? ' is a stunning outdoor garden space — lush Pacific greenery and a west-facing sunset that transforms the evening.'
                  : ' is Nobu\'s most intimate outdoor space — private, beachfront, and set directly against the Pacific.'}
              </p>
              <p className="font-sans text-[14px] leading-[20px] text-[#2b2b27] mt-[10px]">
                Want to explore what other brides and couples have done here?
              </p>
            </div>
          </motion.div>

          {/* ── Yes / No buttons ── */}
          <AnimatePresence>
            {step === 'question' && (
              <motion.div
                variants={msgVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="flex gap-[10px] justify-end"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('save-date')}
                  className="h-[38px] px-[20px] rounded-full border font-sans font-medium text-[14px] text-[#2b2b27]"
                  style={{ borderColor: '#d0d0d0', background: 'white' }}
                >
                  No
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('stories')}
                  className="h-[38px] px-[20px] rounded-full font-sans font-medium text-[14px] text-white"
                  style={{ background: '#2b2b27' }}
                >
                  Yes
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Stories step ── */}
          <AnimatePresence>
            {step === 'stories' && (
              <>
                {/* Allie follow-up bubble */}
                <motion.div
                  variants={msgVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-[10px]"
                >
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-[2px]">
                    <div className="relative w-4 h-4">
                      <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" />
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]" style={{ maxWidth: 270 }}>
                    <p className="font-sans text-[14px] leading-[20px] text-[#2b2b27]">
                      {venueName} has seen a few love stories. Here are some of them.
                    </p>
                  </div>
                </motion.div>

                {/* Couple cards */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-[10px]"
                >
                  {COUPLES.map((couple, i) => (
                    <motion.div
                      key={couple.name}
                      variants={msgVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.15 + i * 0.1 }}
                    >
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          sessionStorage.setItem('selectedCouple', JSON.stringify({
                            name: couple.name,
                            date: couple.date,
                            mainImage: couple.image,
                          }))
                          router.push('/couples/sofia-james')
                        }}
                        className="bg-white rounded-[12px] flex items-center gap-[12px] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.08)] w-full text-left"
                      >
                        {/* Photo */}
                        <div className="w-[100px] h-[76px] relative shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={couple.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        {/* Text */}
                        <div className="flex flex-col gap-[3px] py-[12px] pr-[12px]">
                          <p className="font-display font-normal text-[15px] leading-[18px] text-[#2b2b27]">{couple.name}</p>
                          <p className="font-sans font-normal text-[11px] leading-[14px] text-[#969696] tracking-[0.2px]">{couple.date}</p>
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Save-date step ── */}
          <AnimatePresence>
            {step === 'save-date' && (
              <motion.div
                variants={msgVariants}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-[10px]"
              >
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-[2px]">
                  <div className="relative w-4 h-4">
                    <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" />
                  </div>
                </div>
                <div className="flex flex-col gap-[14px]" style={{ maxWidth: 270 }}>
                  <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]">
                    <p className="font-sans text-[14px] leading-[20px] text-[#2b2b27]">
                      No problem. Your date is still available at <span className="font-semibold">{venueName}</span>.
                    </p>
                    <p className="font-sans text-[14px] leading-[20px] text-[#2b2b27] mt-[10px]">
                      A $500 deposit holds it for 24 hours — fully refundable if you change your mind.
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/save-my-date')}
                    className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
                  >
                    Save my date
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── Chat input ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="px-[16px] py-[24px]"
        >
          <div
            className="bg-white border border-[#d0d0d0] rounded-full flex gap-[10px] items-center px-[5px] py-[3px]"
            style={{ boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}
          >
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="flex-1 font-sans text-[14px] leading-[20px] text-[#969696]">Type a message...</p>
            <div className="w-[36px] h-[36px] rounded-full bg-black flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        <Footer bg="#000000" />

        </div>{/* end inner scroll */}

        {/* ── Officially Yours sheet ── */}
        <AnimatePresence>
          {sheetOpen && (
            <>
              {/* Scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-40"
                style={{ background: 'rgba(58,58,58,0.7)' }}
                onClick={() => setSheetOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="absolute bottom-0 left-0 right-0 z-50 bg-white overflow-y-auto"
                style={{ borderRadius: '20px 20px 0 0', maxHeight: '92%' }}
              >
                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.18 }}
                  className="px-[24px] pt-[24px] pb-[8px]"
                >
                  <p className="font-serif italic text-[48px] leading-[52px] tracking-[-0.4px] text-[#2b2b27]">
                    Officially yours.
                  </p>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.28 }}
                  className="px-[24px] pt-[16px] pb-[24px]"
                >
                  <p className="font-sans text-[16px] leading-[24px] text-[#2b2b27]">
                    A fully-refundable $500 deposit blocks your weekend across the venue, vendors, and room block. Concierge takes it from here.
                  </p>
                </motion.div>

                {/* Receipt card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.36 }}
                  className="px-[20px] pb-[20px]"
                >
                  <div className="rounded-[12px] pb-[16px] pt-[8px] px-[20px]" style={{ background: '#e8e8e8' }}>
                    {[
                      { label: 'Nobu Hotel Los Cabos', value: 'Los Cabos' },
                      { label: venueName, value: '14 guests' },
                      { label: 'Date', value: 'Friday, September 10, 2027' },
                    ].map((row, i) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut', delay: 0.42 + i * 0.06 }}
                        className="flex gap-[8px] items-center py-[10px] font-sans text-[14px] leading-[20px]"
                      >
                        <p className="flex-1 text-[#757569]">{row.label}</p>
                        <p className="text-[#2b2b27] text-right whitespace-nowrap">{row.value}</p>
                      </motion.div>
                    ))}
                    <div className="h-px" style={{ background: '#dad6ce' }} />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22, ease: 'easeOut', delay: 0.61 }}
                      className="flex gap-[8px] items-center py-[10px] font-sans text-[14px] leading-[20px]"
                    >
                      <p className="flex-1 text-[#757569]">Estimated total</p>
                      <p className="font-semibold text-[#2b2b27] text-right whitespace-nowrap">$55,300</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22, ease: 'easeOut', delay: 0.67 }}
                      className="flex gap-[8px] items-center py-[10px] font-sans text-[14px] leading-[20px]"
                    >
                      <p className="flex-1 text-[#757569]">{"Today's hold"}</p>
                      <p className="font-semibold text-right whitespace-nowrap" style={{ color: '#767676' }}>$500</p>
                    </motion.div>
                    <div className="h-px" style={{ background: '#dad6ce' }} />
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.72 }}
                      className="flex flex-col gap-[4px] pt-[12px]"
                    >
                      <p className="font-sans font-semibold text-[11px] tracking-[0.88px] uppercase" style={{ color: '#767676' }}>{"YOU'LL LOCK IN:"}</p>
                      {[
                        'Free dance floor upgrade',
                        'Free couples massage',
                        '20% off your site-visit trip',
                        '25% off all guest room blocks',
                      ].map((perk, i) => (
                        <motion.div
                          key={perk}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut', delay: 0.77 + i * 0.05 }}
                          className="flex gap-[8px] items-center py-[4px] text-[13px] text-[#2b2b27]"
                        >
                          <span className="font-sans shrink-0">✓</span>
                          <span className="font-sans">{perk}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Card on file */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: 0.82 }}
                  className="px-[24px] pb-[16px] pt-[8px] flex flex-col gap-[10px]"
                >
                  <p className="font-sans font-medium text-[10px] tracking-[1.2px] uppercase" style={{ color: '#757569' }}>CARD ON FILE</p>
                  <div className="rounded-[8px] px-[16px] py-[12px]" style={{ background: '#e8e8e8' }}>
                    <p className="font-sans text-[15px]" style={{ color: '#757569' }}>•••• •••• •••• 4242</p>
                  </div>
                </motion.div>

                {/* Continue CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: 0.92 }}
                  className="px-[24px] py-[16px]"
                >
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/save-my-date')}
                    className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>{/* end mobile-frame */}

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
    </DesktopSplitWrapper>
  )
}
