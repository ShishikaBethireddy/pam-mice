'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import DesktopSplitWrapper from '@/components/DesktopSplitWrapper'

const IMG_NOBU_LOGO  = "https://www.figma.com/api/mcp/asset/e7e37941-cc78-4428-8680-29860008d532"
const IMG_HAMBURGER  = "https://www.figma.com/api/mcp/asset/b13b1789-7bec-47ba-a8ae-6265c3a53ddd"
const IMG_BELL       = "https://www.figma.com/api/mcp/asset/7bec26c4-e82e-470b-8378-dc72ebf3884f"
const IMG_HERO       = "https://www.figma.com/api/mcp/asset/4788813b-0cf5-4779-be76-d61d51270c6b"
const IMG_VENUE      = "https://www.figma.com/api/mcp/asset/8f07d654-272a-4d20-a780-d69194431141"
const IMG_COORD      = "https://www.figma.com/api/mcp/asset/25066cda-6912-47e8-b81d-06ed7a6ba8cd"
const IMG_DIAMOND    = "https://www.figma.com/api/mcp/asset/9fb80241-b03a-4d09-a741-313715069151"
const IMG_CONTENT_BG = "https://www.figma.com/api/mcp/asset/892e72a1-0b54-427e-8c78-f428fa2e3755"

export default function PostBookingPage() {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onScroll() { setHeaderHidden(window.scrollY > 60) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <DesktopSplitWrapper>
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>

        {/* ── Collapsing Header ── */}
        <motion.div
          animate={{ height: headerHidden ? 0 : 'auto', opacity: headerHidden ? 0 : 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden shrink-0 relative z-40 flex flex-col"
          style={{ background: '#2b2b27' }}
        >
          {/* WEDDINGS bar */}
          <div className="flex items-center justify-center h-[20px]" style={{ background: '#b4b4b4' }}>
            <p className="font-sans text-[10px] tracking-[2px] uppercase" style={{ color: '#2b2b27' }}>MEETINGS & EVENTS</p>
          </div>
          {/* Main bar */}
          <div className="flex items-center justify-center gap-[50px] h-[60px] px-[16px]">
            <button onClick={() => setMenuOpen(true)} className="shrink-0 w-[40px] h-[40px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_HAMBURGER} alt="Menu" className="w-[29px] h-[29px] object-contain" />
            </button>
            <Link href="/" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_NOBU_LOGO} alt="Nobu Hotel Los Cabos" width={162} height={38} className="object-contain" />
            </Link>
            <button className="shrink-0 w-[40px] h-[40px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_BELL} alt="Notifications" className="w-[32px] h-[32px] object-contain" />
            </button>
          </div>
        </motion.div>

        {/* ── Sticky Planner Menu ── */}
        <PortalMenu active="Overview" />

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full shrink-0 overflow-hidden"
          style={{ background: '#2b2b27' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="relative flex flex-col gap-[12px] items-center py-[32px] px-[20px]">
            <p
              className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-center"
              style={{ color: 'white' }}
            >
              BOOKING CONFIRMED!
            </p>
            <p
              className="font-serif italic text-[48px] leading-[52px] tracking-[-0.4px] text-white text-center w-full"
            >
              Sara &amp; Evan
            </p>
            {/* Stats row */}
            <div className="flex gap-[12px] items-start w-full mt-[2px]">
              {/* Days */}
              <div className="flex-1 flex flex-col items-center">
                <p className="font-serif italic text-[48px] leading-[52px] tracking-[-0.4px] text-white text-center">199</p>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-center mt-[2px]" style={{ color: '#d0d0d0' }}>
                  {`days until "I do"`}
                </p>
              </div>
              {/* Divider */}
              <div className="shrink-0 w-px" style={{ height: 72, background: 'rgba(255,255,255,0.3)', marginTop: 4 }} />
              {/* Guests */}
              <div className="flex-1 flex flex-col items-center">
                <p className="font-serif italic text-[48px] leading-[52px] tracking-[-0.4px] text-white text-center">150</p>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-center mt-[2px]" style={{ color: '#d0d0d0' }}>
                  GUESTS
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Venue Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-[20px] items-center w-full shrink-0"
          style={{ background: 'white' }}
        >
          {/* Venue image */}
          <div className="shrink-0 overflow-hidden" style={{ width: 148, height: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_VENUE} alt="Shiawase Terrace" className="w-full h-full object-cover" />
          </div>
          {/* Text column */}
          <div className="flex flex-col gap-[12px] items-start flex-1 min-w-0 pr-[16px] py-[16px]">
            <div className="flex flex-col items-start">
              <p className="font-serif italic text-[20px] leading-[28px]" style={{ color: '#2b2b27' }}>
                Shiawase Terrace
              </p>
              <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#757569' }}>
                Nobu Hotel Los Cabos · Oceanfront
              </p>
            </div>
            {/* Date + Time */}
            <div className="flex gap-[12px] items-center overflow-hidden">
              <div className="flex flex-col gap-[4px] items-start shrink-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
                  CEREMONY DATE
                </p>
                <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#2b2b27', width: 96 }}>
                  April 28, 2027
                </p>
              </div>
              <div className="shrink-0 w-px h-[32px]" style={{ background: '#dad6ce' }} />
              <div className="flex flex-col gap-[4px] items-start shrink-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
                  START TIME
                </p>
                <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#2b2b27' }}>
                  5:30 PM
                </p>
              </div>
            </div>
            {/* What's included */}
            <div className="flex flex-col items-start w-full">
              <div className="w-full h-px" style={{ background: '#dad6ce' }} />
              <button className="flex items-center gap-[8px] py-[10px]">
                <p className="font-sans text-[16px] leading-[24px]" style={{ color: '#767676' }}>What&apos;s included</p>
                <p className="font-sans text-[16px]" style={{ color: '#767676' }}>→</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Planner Insight ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col gap-[14px] items-start p-[24px] w-full shrink-0"
          style={{ background: '#585858' }}
        >
          {/* Attribution */}
          <div className="flex gap-[6px] items-center overflow-hidden shrink-0">
            <div className="w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_DIAMOND} alt="" className="w-[14px] h-[14px] object-contain" />
            </div>
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">
              MATCHED BY ALLIE
            </p>
          </div>
          {/* Coordinator */}
          <div className="flex gap-[14px] items-center shrink-0">
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_COORD} alt="Valentina Reyes" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-[3px] items-start overflow-hidden">
              <p className="font-sans font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">
                Valentina Reyes
              </p>
              <p className="font-sans text-[12px] leading-[16px] text-white whitespace-nowrap" style={{ opacity: 0.7 }}>
                Nobu Los Cabos · Events Concierge
              </p>
              <p className="font-sans text-[12px] leading-[16px] text-white whitespace-nowrap" style={{ opacity: 0.7 }}>
                Will be in touch within 24 hours
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Content section with BG image ── */}
        <div className="relative flex flex-col gap-[16px] items-start p-[24px] w-full shrink-0" style={{ background: '#f5f5f5' }}>
          {/* BG image */}
          <div className="absolute inset-0 overflow-hidden" style={{ filter: 'blur(1px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_CONTENT_BG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
          </div>

          {/* WHAT HAPPENS NEXT glass card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative flex flex-col items-start overflow-hidden p-[24px] rounded-[8px] w-full"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            <p className="font-sans font-semibold text-[16px] leading-[24px] text-black whitespace-nowrap mb-[24px]">
              WHAT HAPPENS NEXT
            </p>

            {/* Step 1 */}
            <div className="flex gap-[12px] items-start w-full">
              <div className="flex flex-col items-center justify-center w-[24px] self-stretch shrink-0">
                <p className="font-serif text-[30px] leading-[40px] text-center w-full" style={{ color: '#646f53' }}>1</p>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#2b2b27' }}>
                  Valentina gets in touch
                </p>
                <p className="font-sans text-[10px] leading-[16px]" style={{ color: '#757569' }}>
                  Your coordinator will be in touch within 24 hours
                </p>
              </div>
            </div>

            <div className="w-full h-px my-[24px]" style={{ background: '#d0d0d0' }} />

            {/* Step 2 */}
            <div className="flex gap-[12px] items-start w-full">
              <div className="flex flex-col items-center justify-center w-[24px] self-stretch shrink-0">
                <p className="font-serif text-[30px] leading-[40px] text-center w-full" style={{ color: '#585858' }}>2</p>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#2b2b27' }}>
                  Invite your partner + guests
                </p>
                <p className="font-sans text-[10px] leading-[16px]" style={{ color: '#969696' }}>
                  Share access to the planning dashboard
                </p>
              </div>
            </div>

            <div className="w-full h-px my-[24px]" style={{ background: '#d0d0d0' }} />

            {/* Step 3 */}
            <div className="flex gap-[12px] items-start w-full">
              <div className="flex flex-col items-center justify-center w-[24px] self-stretch shrink-0">
                <p className="font-serif text-[30px] leading-[40px] text-center w-full" style={{ color: '#585858' }}>3</p>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#2b2b27' }}>
                  Planning &amp; scheduling
                </p>
                <p className="font-sans text-[10px] leading-[16px]" style={{ color: '#969696' }}>
                  Add florals, décor, and entertainment
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="relative w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
          >
            View your full plan
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative w-full h-[44px] rounded-full font-sans font-medium text-base flex items-center justify-center"
            style={{ border: '1.5px solid #767676', color: '#2b2b27', background: 'transparent' }}
          >
            Share with your partner
          </motion.button>
        </div>

        {/* ── Footer ── */}
        <PortalFooter />

      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
    </DesktopSplitWrapper>
  )
}
