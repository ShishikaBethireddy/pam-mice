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

interface MasonryImage {
  src: string
  height: number
}

interface MoodData {
  name: string
  descriptor: string
  palette: string[]
  alliText: string[]
  leftCol: MasonryImage[]
  rightCol: MasonryImage[]
}

export const MOOD_DATA: Record<string, MoodData> = {
  'silver-renaissance': {
    name: 'Silver Renaissance',
    descriptor: 'Chrome · Sculpted · Directional',
    palette: ['#e8eaed', '#b0bac5', '#7a90a4', '#2c3540'],
    alliText: [
      "That's a striking choice — there's something magnetic about the way chrome and candlelight play off each other.",
      "Nobu has three venues. Here's how they rank for soft and romantic. Trust your instinct.",
    ],
    leftCol: [
      { src: '', height: 195 },
      { src: '', height: 290 },
      { src: '', height: 160 },
    ],
    rightCol: [
      { src: '', height: 140 },
      { src: '', height: 148 },
      { src: '', height: 228 },
      { src: '', height: 124 },
    ],
  },
  meadowcore: {
    name: 'Meadowcore',
    descriptor: 'Untamed · Botanical · Grounded',
    palette: ['#f0ebe0', '#c4b99a', '#7a8c65', '#3d5236'],
    alliText: [
      "That's a beautiful choice—there is something so effortlessly romantic about a celebration that feels like it's growing wild and breathing right along with you.",
      "Nobu has three venues. Here's how they rank for soft and romantic. Trust your instinct.",
    ],
    leftCol: [
      { src: '/assets/masonry-leather-chair.png', height: 195 },
      { src: '/assets/masonry-koi-pond.png', height: 290 },
      { src: '/assets/masonry-terracotta-tiles.png', height: 160 },
    ],
    rightCol: [
      { src: '/assets/masonry-terracotta-cylinders.png', height: 140 },
      { src: '/assets/masonry-ocean-swimmer.png', height: 148 },
      { src: '/assets/masonry-peach-patio.png', height: 228 },
      { src: '/assets/masonry-orange-throw.png', height: 124 },
    ],
  },
  'retro-cinematic': {
    name: 'Retro-Cinematic',
    descriptor: 'Candlelit · Nostalgic · Intimate',
    palette: ['#f2e8d5', '#c49a6c', '#7c4a2d', '#1e1510'],
    alliText: [
      "You've got incredible taste — this one feels like a love letter written in warm light and vintage film grain.",
      "Nobu has three venues. Here's how they rank for soft and romantic. Trust your instinct.",
    ],
    leftCol: [
      { src: '', height: 195 },
      { src: '', height: 290 },
      { src: '', height: 160 },
    ],
    rightCol: [
      { src: '', height: 140 },
      { src: '', height: 148 },
      { src: '', height: 228 },
      { src: '', height: 124 },
    ],
  },
  pearlcore: {
    name: 'Pearlcore',
    descriptor: 'Iridescent · Heirloom · Coquette',
    palette: ['#f8f3f0', '#c8b8cc', '#d4a8b4', '#6b2537'],
    alliText: [
      "Oh, this is dreamy — there's something so timeless about iridescent softness meeting old-world elegance.",
      "Nobu has three venues. Here's how they rank for soft and romantic. Trust your instinct.",
    ],
    leftCol: [
      { src: '', height: 195 },
      { src: '', height: 290 },
      { src: '', height: 160 },
    ],
    rightCol: [
      { src: '', height: 140 },
      { src: '', height: 148 },
      { src: '', height: 228 },
      { src: '', height: 124 },
    ],
  },
  'architectural-minimalism': {
    name: 'Architectural Minimalism',
    descriptor: 'Structural · Gallery · Quiet',
    palette: ['#f5f0ea', '#ddd5c8', '#a09688', '#2e2a26'],
    alliText: [
      "This says so much by saying so little — there's real power in clean lines and intentional space.",
      "Nobu has three venues. Here's how they rank for soft and romantic. Trust your instinct.",
    ],
    leftCol: [
      { src: '', height: 195 },
      { src: '', height: 290 },
      { src: '', height: 160 },
    ],
    rightCol: [
      { src: '', height: 140 },
      { src: '', height: 148 },
      { src: '', height: 228 },
      { src: '', height: 124 },
    ],
  },
}

function MasonryCell({ img, mood }: { img: MasonryImage; mood: MoodData }) {
  if (img.src) {
    return (
      <div className="w-full overflow-hidden" style={{ height: img.height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div
      className="w-full"
      style={{
        height: img.height,
        background: `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`,
        opacity: 0.85,
      }}
    />
  )
}

export default function MoodboardDetailClient({ moodSlug }: { moodSlug: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()
  const mood = MOOD_DATA[moodSlug]

  if (!mood) {
    return (
      <div className="screen-wrap">
        <div className="mobile-frame flex flex-col min-h-dvh bg-[#f5f5f5] items-center justify-center">
          <p className="font-sans text-[16px] text-black">Mood not found</p>
          <button onClick={() => router.push('/moodboard')} className="mt-4 underline font-sans text-[14px]">
            Back to moodboards
          </button>
        </div>
      </div>
    )
  }

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
          {/* Message row */}
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
              {mood.alliText.map((text, i) => (
                <p key={i} className={`font-sans text-[16px] leading-[24px] ${i === 0 ? 'text-[#585858] font-normal' : 'text-black font-medium'} ${i > 0 ? 'mt-[24px]' : ''}`}>
                  {text}
                </p>
              ))}
            </motion.div>
          </div>

          {/* CTA — right-aligned to match bubble width */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 }}
            className="flex justify-end"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/loader')}
              className="h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center px-[24px]"
              style={{ width: 286 }}
            >
              Explore the available spaces
            </motion.button>
          </motion.div>
        </div>

        {/* ── Mood title + palette ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col gap-[4px] p-[12px]"
        >
          <p className="font-serif text-[30px] leading-[40px] text-black">{mood.name}</p>
          <p className="font-sans text-[12px] leading-[16px] text-black">{mood.descriptor}</p>
        </motion.div>

        <div className="flex px-[12px]">
          {mood.palette.map((color) => (
            <div key={color} className="flex-1 h-[12px]" style={{ background: color }} />
          ))}
        </div>

        {/* ── Masonry grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-[6px] p-[12px] overflow-hidden"
        >
          <div className="flex flex-col gap-[6px] w-[180px]">
            {mood.leftCol.map((img, i) => (
              <MasonryCell key={i} img={img} mood={mood} />
            ))}
          </div>
          <div className="flex flex-col gap-[6px] w-[180px]">
            {mood.rightCol.map((img, i) => (
              <MasonryCell key={i} img={img} mood={mood} />
            ))}
          </div>
        </motion.div>

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
