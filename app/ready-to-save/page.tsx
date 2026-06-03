'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import Footer from '@/components/Footer'

export default function ReadyToSavePage() {
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
        <div className="flex flex-col gap-[16px] px-[24px] pt-[28px] pb-[28px] flex-1">
          <div className="flex items-start justify-between">
            {/* Allie avatar */}
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
              style={{ background: '#585858', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}
            >
              <div className="relative w-[22px] h-[18px]">
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            </div>

            {/* Allie message */}
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
                Now that you&apos;ve been inspired — ready to save the date?
              </p>
            </motion.div>
          </div>

          {/* CTA button — right-aligned */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 }}
            className="flex justify-end"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/estimate')}
              className="h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center px-[24px]"
            >
              Yes let&apos;s do it!
            </motion.button>
          </motion.div>
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
