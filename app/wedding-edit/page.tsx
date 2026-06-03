'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

interface EditItem {
  name: string
  badge: string | null
  added: boolean
  price: string
  img: string
}

const ITEMS: EditItem[] = [
  {
    name: 'Champagne Toast',
    badge: 'Most added',
    added: true,
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/e95bfc72-4d2e-4371-8b0f-26520815326b',
  },
  {
    name: 'Ceremony arch & florals',
    badge: 'Most added',
    added: true,
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/886009cb-b362-4b6d-98b5-11fb99547d32',
  },
  {
    name: 'Reception centerpieces',
    badge: 'Most added',
    added: true,
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/2d82a247-8279-4cd7-ba90-58059735970b',
  },
  {
    name: 'Full Grand DJ Package',
    badge: 'Most added',
    added: false,
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/59c7566b-ac7e-4447-85ce-d29eeaa51954',
  },
]

export default function WeddingEditPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [items, setItems] = useState(ITEMS)
  const router = useRouter()

  function toggleAdded(i: number) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, added: !item.added } : item))
  }

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
              Would like to start personalizing your Wedding&apos;s Edit?
            </p>
            <p className="font-sans text-[16px] leading-[24px] text-black mt-[24px]">
              You can change these any time before signing.
            </p>
          </motion.div>
        </div>

        {/* ── Page body with background image ── */}
        <div className="relative flex flex-col gap-[12px] pt-[24px] flex-1">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/wedding-edit-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Heading */}
          <div className="relative px-[16px]">
            <p className="font-serif leading-[40px] text-black" style={{ fontSize: 36 }}>
              Vendor Wish List
            </p>
            <p className="font-sans font-light text-[14px] leading-[20px] text-black" style={{ width: 330 }}>
              Based on other couples in your space, browse verified vendors and add them to your Wish List. Your Wedding Concierge can followup.
            </p>
          </div>

          {/* Item list (backdrop blur over background image) */}
          <div
            className="relative flex flex-col gap-[12px] pt-[24px]"
            style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
          >
            <div className="flex flex-col gap-[12px] px-[16px]">
              {items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.04 }}
                  className="flex items-stretch rounded-[8px] overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.85)' }}
                >
                  {/* Image thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="shrink-0 object-cover"
                    style={{ width: 88 }}
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center gap-[4px] px-[12px] py-[12px] min-w-0">
                    {/* Name + badge */}
                    <div className="flex flex-wrap items-center gap-[6px]">
                      <p className="font-sans font-medium text-[14px] leading-[20px] text-[#2b2b27]">
                        {item.name}
                      </p>
                      {item.badge && (
                        <span
                          className="px-[8px] py-[2px] rounded-full font-sans font-medium text-[10px] leading-[12px] tracking-[0.4px] uppercase whitespace-nowrap"
                          style={{ background: '#e0d3c5', color: '#8e6434' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {/* Price */}
                    <p className="font-sans text-[12px] leading-[16px] text-[#767676]">
                      {item.price}
                    </p>
                    {/* Tastemakers notes */}
                    <p
                      className="font-sans text-[12px] leading-[16px] underline"
                      style={{ color: '#767676' }}
                    >
                      Tastemakers notes (4)
                    </p>
                  </div>

                  {/* Toggle button */}
                  <div className="flex items-center pr-[12px] shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleAdded(i)}
                      className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                      style={{
                        background: item.added ? '#1e1e1e' : 'white',
                        border: item.added ? 'none' : '1px solid #d0d0d0',
                      }}
                    >
                      {item.added ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3.5 9.5L7 13L14.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 4V14M4 9H14" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-[16px] px-[24px] pt-[12px] pb-[32px]">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/ready-to-save')}
                className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
              >
                Continue
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/ready-to-save')}
                className="w-full h-[44px] rounded-full border font-sans font-medium text-base text-black flex items-center justify-center"
                style={{ borderColor: '#767676' }}
              >
                I&apos;ll do this later
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
