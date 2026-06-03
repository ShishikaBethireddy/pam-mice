'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import ScheduleCallSheet from '@/components/ScheduleCallSheet'
import Confetti from '@/components/Confetti'
import Footer from '@/components/Footer'

const IMG_HERO  = 'https://www.figma.com/api/mcp/asset/ec9062d1-e97b-44c2-baf3-9a05dd164202'
const IMG_TRUST = 'https://www.figma.com/api/mcp/asset/19bec05a-e740-4073-9d9b-b5661709d662'
const IMG_CAV   = 'https://www.figma.com/api/mcp/asset/65b954d5-77f6-483c-97c3-bf827b9bfefe'

const PERKS = [
  { num: '01', title: "Free Couple's massage",                value: '~$600',   locked: false },
  { num: '02', title: '10% discount for guest room blocks',   value: '~$1,000', locked: false },
  { num: '04', title: 'Free Suite upgrade during site visit', value: '~$1,200', locked: true  },
]

const PACKAGE_INCLUDES = [
  '4-hr dinner reception',
  '4-hr additional event on 2nd day',
  'Standard tables',
  'Chocolate Avante Garde Chairs included',
  '1-tier cake',
  'Audio System',
  'Themed Flowers',
  'House sparkling wine',
  'Non-Denominational Minister (symbolic)',
  'AVA Honeymoon Experience package',
]

function CheckIcon({ color = '#585858' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 13L9 17L19 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#b4b4b4" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="#b4b4b4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function SaveMyDatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [seconds, setSeconds] = useState(48 * 3600)
  const [confettiKey, setConfettiKey] = useState(0)
  const [confettiOn, setConfettiOn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  // Pop confetti once on mount — the moment they land on "Save My Date"
  useEffect(() => {
    const start = setTimeout(() => {
      setConfettiOn(true)
      setConfettiKey(k => k + 1)
    }, 250)
    const stop = setTimeout(() => setConfettiOn(false), 5200)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [])

  function celebrateAndLockIn() {
    setConfettiOn(true)
    setConfettiKey(k => k + 1)
    setTimeout(() => router.push('/contract'), 1100)
  }

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

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

        {/* ── Urgency strip (above hero) ── */}
        <div className="flex items-stretch shrink-0">
          <div className="flex-1 bg-black flex flex-col gap-[3px] justify-center px-[24px] py-[12px]">
            <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-[#767676]">Free cancellation</p>
            <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-[#767676]">closes in</p>
            <p className="font-sans font-light text-[36px] leading-[40px] tracking-[-0.4px] text-white">
              {hh}:{mm}:{ss}
            </p>
          </div>
          <div className="w-[150px] shrink-0 bg-[#585858] flex items-start p-[12px]">
            <div className="flex flex-1 gap-[4px] items-start">
              <div className="flex flex-col flex-1 gap-[2px]">
                <p className="font-sans font-light text-[18px] leading-[24px] text-white">38</p>
                <p className="font-sans text-[12px] leading-[16px] text-white">brides saved this venue in the last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero + Deposit card ── */}
        <div className="flex flex-col items-start pb-[24px]">

          {/* Hero — mb-[-60px] lets deposit card overlap */}
          <div
            className="relative w-full flex items-start p-[24px] shrink-0"
            style={{ height: 320, marginBottom: -60 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="relative flex gap-[50px] items-start justify-center w-full">
              <div className="font-serif text-white" style={{ fontSize: 72, lineHeight: '76px', letterSpacing: '-1.2px' }}>
                <p>SAVE</p>
                <p>MY</p>
                <p>DATE</p>
              </div>
              <div className="flex flex-col items-end gap-[4px] px-[12px] py-[8px] rounded-[4px]">
                <p className="font-sans font-medium text-[13px] leading-[20px] text-white">April 15, 2027</p>
                <p className="font-sans font-medium text-[13px] leading-[20px] text-white">5:30pm</p>
              </div>
            </div>
          </div>

          {/* Deposit card */}
          <div className="px-[20px] pt-[24px] w-full relative" style={{ zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[12px] flex flex-col gap-[16px] p-[16px]"
            >
              {/* Amount row */}
              <div className="flex gap-[12px] items-start">
                <p className="font-sans text-[30px] leading-[36px] tracking-[-0.4px] text-black shrink-0">$500</p>
                <p className="font-sans text-[12px] leading-[16px] text-[#585858] flex-1">
                  Take 48 hours to settle into your choice with our full reservation guarantee
                </p>
              </div>

              <div className="h-[2px] w-full" style={{ background: '#767676' }} />

              {/* Guarantee bullets */}
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-start pb-[8px]" style={{ borderBottom: '0.5px solid #d0d0d0' }}>
                  <CheckIcon />
                  <p className="font-sans text-[14px] leading-[20px] text-[#525249] flex-1">
                    Locks today&apos;s pricing on venue, vendors, and rooms
                  </p>
                </div>
                <div className="flex gap-[8px] items-start pb-[8px]" style={{ borderBottom: '0.5px solid #d0d0d0' }}>
                  <CheckIcon />
                  <p className="font-sans text-[14px] leading-[20px] text-[#525249] flex-1">
                    Applied to your final invoice — not an extra charge
                  </p>
                </div>
                <div className="flex gap-[8px] items-start p-[8px]">
                  <CheckIcon />
                  <p className="font-sans text-[14px] leading-[20px] text-[#525249] flex-1">
                    Lock in your <span className="font-medium">Tier 4 Signature</span> package{' '}
                    (<span className="font-medium">$5,000</span> starting at)
                  </p>
                </div>
              </div>

              {/* Package includes — emphasized */}
              <div className="flex flex-col gap-[12px]">
                <div className="h-[2px] w-full" style={{ background: '#d0d0d0' }} />
                <div className="flex items-center justify-between">
                  <p
                    className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase"
                    style={{ color: '#767676' }}
                  >
                    Tier 4 Signature includes
                  </p>
                  <span
                    className="font-sans font-semibold text-[10px] leading-[12px] tracking-[0.6px] uppercase px-[8px] py-[3px] rounded-full"
                    style={{ background: '#e0d3c5', color: '#8e6434' }}
                  >
                    {PACKAGE_INCLUDES.length} benefits
                  </span>
                </div>
                <div
                  className="flex flex-col rounded-[10px] overflow-hidden"
                  style={{ background: '#faf7f3', border: '1px solid #ece5d9' }}
                >
                  {PACKAGE_INCLUDES.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
                      className="flex gap-[10px] items-center px-[12px] py-[10px]"
                      style={i < PACKAGE_INCLUDES.length - 1 ? { borderBottom: '0.5px solid #ece5d9' } : {}}
                    >
                      <div className="shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center" style={{ background: '#8e6434' }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="font-sans text-[14px] leading-[20px] flex-1" style={{ color: '#2b2b27' }}>
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Trust signal ── */}
        <div className="relative flex items-center justify-center shrink-0 px-[24px] py-[24px]">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_TRUST} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          </div>
          <div className="relative flex flex-col gap-[12px] items-center text-center w-full">
            {/* Avatar first */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG_CAV}
              alt=""
              width={52}
              height={52}
              className="rounded-full object-cover shrink-0"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}
            />
            <div className="font-serif text-white text-center" style={{ fontSize: 24, lineHeight: '36px' }}>
              <p>Have questions? Speak to</p>
              <p>our wedding concierge</p>
            </div>
            <div className="h-px w-[50px] bg-white" />
            <p className="font-sans font-medium text-[16px] leading-[24px] text-white text-center">
              +1 800 RCD WEDDINGS
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setScheduleOpen(true)}
              className="h-[44px] px-[24px] rounded-full font-sans font-medium text-base text-white flex items-center justify-center gap-[8px] w-full"
              style={{ background: '#34342f' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="white" strokeWidth="1.3" />
                <path d="M2.5 6.5H13.5" stroke="white" strokeWidth="1.3" />
                <path d="M5 2V5M11 2V5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Schedule a call
            </motion.button>
          </div>
        </div>

        {/* ── Perks section ── */}
        <div className="flex flex-col gap-[24px] px-[24px] py-[24px] bg-[#f5f5f5]">
          <div className="flex flex-col gap-[8px] pb-[4px]">
            <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-[#767676]">
              Sign your contract early
            </p>
            <p className="font-serif text-[24px] leading-[36px] text-black">
              Save up to $9,800 in perks
            </p>
            <p className="font-sans text-[14px] leading-[20px] text-[#585858]">Cumulative. All available now.</p>
          </div>

          <div className="flex flex-col bg-white">
            {PERKS.map((perk) => (
              <div
                key={perk.num}
                className={`flex flex-col p-[12px] border-b border-[#d0d0d0]${perk.locked ? ' opacity-50' : ''}`}
              >
                <div className="flex items-center justify-end mb-[4px]">
                  {perk.locked ? <LockIcon /> : <CheckIcon />}
                </div>
                <div className="flex gap-[14px] items-center">
                  <p className="font-sans font-medium text-[14px] leading-[20px] text-[#757569] w-[13px] shrink-0">{perk.num}</p>
                  <p className="font-sans font-medium text-[16px] leading-[24px] text-black flex-1">{perk.title}</p>
                  <p className="font-sans text-[16px] leading-[24px] text-black shrink-0">{perk.value}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={celebrateAndLockIn}
            className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
          >
            Lock it in
          </motion.button>
        </div>

        <Footer bg="#000000" />
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
      <ScheduleCallSheet
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        conciergeAvatar={IMG_CAV}
      />

      {/* Celebration confetti — fires on landing and on "Lock it in" */}
      <div key={confettiKey}>
        <Confetti show={confettiOn} />
      </div>
    </div>
  )
}
