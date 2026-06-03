'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

const LOCK_IN_PERKS = [
  'Free dance floor upgrade',
  'Free couples massage',
  '20% off your site-visit trip',
  '25% off all guest room blocks',
]

export default function OfficiallyYoursPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="screen-wrap">
      <div
        className="mobile-frame flex flex-col items-end min-h-dvh pt-[24px]"
        style={{ background: 'rgba(58,58,58,0.85)' }}
      >
        {/* Sheet */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-white w-full overflow-y-auto flex flex-col"
          style={{ borderRadius: '20px 20px 0 0' }}
        >
          {/* Headline */}
          <div className="px-[24px] pt-[24px] pb-[8px]">
            <p
              className="font-serif italic text-[48px] leading-[52px] w-full"
              style={{ color: '#2b2b27', letterSpacing: '-0.4px' }}
            >
              Officially yours.
            </p>
          </div>

          {/* Description */}
          <div className="px-[24px] pt-[16px] pb-[24px]">
            <p className="font-sans text-[16px] leading-[24px]" style={{ color: '#2b2b27' }}>
              A fully-refundable $500 deposit blocks your weekend across the venue, vendors, and room block. Concierge takes it from here.
            </p>
          </div>

          {/* Receipt card */}
          <div className="px-[20px] pb-[20px]">
            <div className="rounded-[12px] px-[20px] pb-[16px] pt-[8px]" style={{ background: '#e8e8e8' }}>

              {[
                { label: 'Nobu Hotel Los Cabos', value: 'Los Cabos' },
                { label: 'Onsen Pool Deck',      value: '14 guests' },
                { label: 'Date',                 value: 'Friday, September 10, 2027' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-[8px] py-[10px]">
                  <p className="flex-1 font-sans text-[14px] leading-[20px]" style={{ color: '#757569' }}>{row.label}</p>
                  <p className="font-sans text-[14px] leading-[20px] text-right whitespace-nowrap" style={{ color: '#2b2b27' }}>{row.value}</p>
                </div>
              ))}

              <div className="h-px w-full" style={{ background: '#dad6ce' }} />

              <div className="flex items-center gap-[8px] py-[10px]">
                <p className="flex-1 font-sans text-[14px] leading-[20px]" style={{ color: '#757569' }}>Estimated total</p>
                <p className="font-sans font-semibold text-[14px] text-right whitespace-nowrap" style={{ color: '#2b2b27' }}>$55,300</p>
              </div>
              <div className="flex items-center gap-[8px] py-[10px]">
                <p className="flex-1 font-sans text-[14px] leading-[20px]" style={{ color: '#757569' }}>Today&apos;s hold</p>
                <p className="font-sans font-semibold text-[14px] text-right whitespace-nowrap" style={{ color: '#767676' }}>$500</p>
              </div>

              <div className="h-px w-full" style={{ background: '#dad6ce' }} />

              {/* Lock-in perks */}
              <div className="pt-[12px] flex flex-col gap-[4px]">
                <p className="font-sans font-semibold text-[11px] tracking-[0.88px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
                  YOU&apos;LL LOCK IN:
                </p>
                {LOCK_IN_PERKS.map((perk) => (
                  <div key={perk} className="flex items-center gap-[8px] py-[4px]">
                    <p className="font-sans text-[13px]" style={{ color: '#2b2b27' }}>✓</p>
                    <p className="flex-1 font-sans text-[13px]" style={{ color: '#2b2b27' }}>{perk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card on file */}
          <div className="px-[24px] pb-[16px] pt-[8px] flex flex-col gap-[10px]">
            <p className="font-sans font-medium text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
              CARD ON FILE
            </p>
            <div className="rounded-[8px] px-[16px] py-[12px]" style={{ background: '#e8e8e8' }}>
              <p className="font-sans text-[15px]" style={{ color: '#757569' }}>•••• •••• •••• 4242</p>
            </div>
          </div>

          {/* CTA */}
          <div className="px-[24px] py-[16px]">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/post-booking')}
              className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
