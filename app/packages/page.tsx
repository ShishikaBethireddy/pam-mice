'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import Footer from '@/components/Footer'

const PACKAGE_ITEMS = [
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

export default function PackagesPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

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

        {/* ── Allie chat area ── */}
        <div className="flex items-start justify-between px-[24px] pt-[28px] pb-[28px]">
          <div
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
            style={{ background: '#585858', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}
          >
            <div className="relative w-[22px] h-[18px]">
              <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
            className="p-[24px]"
            style={{
              background: '#e8e8e8',
              borderRadius: '0 12px 12px 12px',
              width: 286,
              boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
            }}
          >
            <p className="font-sans text-[16px] leading-[24px] text-black">
              You&apos;re in, Sara! Shiawase Terrace on April 27th is yours. Now let&apos;s make it feel like you — choose your package and we&apos;ll get your contract ready.
            </p>
            <p className="font-sans text-[16px] leading-[24px] text-black mt-[24px]">
              Based on your 150 guests, here&apos;s the recommended Package Tier.
            </p>
          </motion.div>
        </div>

        {/* ── Guest count bar ── */}
        <div className="flex items-center px-[24px] py-[12px] bg-black">
          <p className="font-sans text-[14px] leading-[20px]">
            <span className="text-white underline">150 Guests</span>
            <span className="text-white">{'  |  Estimated 75 rooms'}</span>
          </p>
        </div>

        {/* ── Package card ── */}
        <div className="bg-white flex flex-col gap-[24px] px-[24px] pt-[24px] pb-[24px]">

          {/* Image + title */}
          <div className="flex gap-[16px] items-start">
            <div className="shrink-0 overflow-hidden rounded-[4px]" style={{ width: 150, height: 187 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/package-tier-image.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-[12px] pt-[8px]">
              <p className="font-serif text-[24px] leading-[36px] text-black">Tier 4 — Signature</p>
              <div className="border-t border-[#d0d0d0] flex flex-col gap-[4px] pt-[12px]">
                <p className="font-serif text-[24px] leading-[36px] text-black">$5,000</p>
                <p className="font-sans font-light text-[12px] leading-[16px] text-[#969696] uppercase tracking-[0.4px]">Packages start at</p>
              </div>
            </div>
          </div>

          {/* Package items */}
          <div className="flex flex-col gap-[8px]">
            {PACKAGE_ITEMS.map((item) => (
              <div key={item} className="flex gap-[8px] items-start border-b border-[#d0d0d0] pb-[8px] px-[8px]">
                <div className="shrink-0 w-6 h-6 flex items-center justify-center mt-[2px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="#585858" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#525249' }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Comp rooms badge */}
          <div
            className="flex items-center justify-between p-[16px] rounded-[12px]"
            style={{ background: '#e8e8e8' }}
          >
            <div className="flex flex-col gap-[4px]">
              <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#343a2c' }}>Complimentary rooms</p>
              <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#49513e' }}>1 free room per 16 booked</p>
            </div>
            <p className="font-sans font-light text-[36px] leading-[40px]" style={{ color: '#343a2c', letterSpacing: '-0.4px' }}>4</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-[10px] py-[12px]">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/wedding-edit')}
              className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
            >
              Save my package
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/tiers')}
              className="w-full h-[44px] rounded-full border font-sans font-medium text-base text-black flex items-center justify-center"
              style={{ borderColor: '#767676' }}
            >
              Compare all tiers
            </motion.button>
          </div>
        </div>

        {/* ── Chat input ── */}
        <div className="px-[16px] py-[24px]">
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
        </div>

        <Footer bg="#000000" />
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
