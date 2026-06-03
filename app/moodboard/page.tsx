'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import Footer from '@/components/Footer'
import DesktopSplitWrapper from '@/components/DesktopSplitWrapper'

const MOODS = [
  {
    slug: 'silver-renaissance',
    name: 'Silver Renaissance',
    descriptor: 'Chrome · Sculpted · Directional',
    img: '/assets/mood-silver-renaissance.png',
    imgHeight: 108,
    palette: ['#e8eaed', '#b0bac5', '#7a90a4', '#2c3540'],
  },
  {
    slug: 'meadowcore',
    name: 'Meadowcore',
    descriptor: 'Untamed · Botanical · Grounded',
    img: '/assets/mood-meadowcore.png',
    imgHeight: 116,
    palette: ['#f0ebe0', '#c4b99a', '#7a8c65', '#3d5236'],
  },
  {
    slug: 'retro-cinematic',
    name: 'Retro-Cinematic',
    descriptor: 'Candlelit · Nostalgic · Intimate',
    img: '/assets/mood-retro-cinematic.png',
    imgHeight: 108,
    palette: ['#f2e8d5', '#c49a6c', '#7c4a2d', '#1e1510'],
  },
  {
    slug: 'pearlcore',
    name: 'Pearlcore',
    descriptor: 'Iridescent · Heirloom · Coquette',
    img: '/assets/mood-pearlcore.png',
    imgHeight: 132,
    palette: ['#f8f3f0', '#c8b8cc', '#d4a8b4', '#6b2537'],
  },
  {
    slug: 'architectural-minimalism',
    name: 'Architectural Minimalism',
    descriptor: 'Structural · Gallery · Quiet',
    img: '/assets/mood-architectural.png',
    imgHeight: 132,
    palette: ['#f5f0ea', '#ddd5c8', '#a09688', '#2e2a26'],
  },
]

export default function MoodboardPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  return (
    <DesktopSplitWrapper>
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
        <div className="flex flex-col gap-[16px] px-[24px] pt-[28px] pb-[28px]">
          {/* First message */}
          <div className="flex items-start justify-between">
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
              <p className="font-sans text-[16px] leading-[24px]" style={{ color: '#585858' }}>
                A wedding for 150 feels like everyone you love in the same place at the same time. Let&apos;s find a vibe that feels right for you.
              </p>
              <p className="font-sans text-[16px] leading-[24px] text-black mt-[24px]">
                Five looks defining weddings right now. Pick the one that stops you. Choose the one that feels like you — Allie does the rest.
              </p>
              <p className="font-sans text-[16px] leading-[24px] text-black mt-[24px]">
                Or upload your own.
              </p>
            </motion.div>
          </div>

          {/* Upload Pinterest button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut', delay: 0.25 }}
            className="flex justify-end"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="h-[44px] px-[24px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
            >
              Upload Pinterest here
            </motion.button>
          </motion.div>

          {/* Mood cards */}
          <div className="flex items-start gap-[16px]">
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
              style={{ background: '#585858', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}
            >
              <div className="relative w-[22px] h-[18px]">
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            </div>

            <div className="flex flex-col gap-[8px] w-[286px]">
              {MOODS.map((mood, i) => (
                <motion.button
                  key={mood.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/moodboard/${mood.slug}`)}
                  className="w-full bg-white rounded-[12px] overflow-hidden text-left"
                  style={{ boxShadow: '0px 1px 2px rgba(231,229,228,0.5)' }}
                >
                  <div className="relative w-full overflow-hidden" style={{ height: mood.imgHeight }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mood.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex w-full">
                    {mood.palette.map((color) => (
                      <div key={color} className="flex-1 h-[12px]" style={{ background: color }} />
                    ))}
                  </div>
                  <div className="px-[12px] py-[24px] flex flex-col gap-[4px]">
                    <p className="font-sans text-[18px] leading-[24px] text-black">{mood.name}</p>
                    <p className="font-sans text-[12px] leading-[16px] text-black">{mood.descriptor}</p>
                  </div>
                </motion.button>
              ))}
            </div>
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
    </DesktopSplitWrapper>
  )
}
