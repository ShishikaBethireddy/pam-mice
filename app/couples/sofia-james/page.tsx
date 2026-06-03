'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import Footer from '@/components/Footer'

// ── Vendor data ───────────────────────────────────────────────────
const VENDORS = [
  { label: 'Hair & Makeup',           badge: 'Most added', badgeColor: '#8e6434', badgeBg: '#e0d3c5', added: true },
  { label: 'Ceremony arch & florals', badge: 'Popular',    badgeColor: '#8e6434', badgeBg: '#e0d3c5', added: true },
  { label: 'Reception centerpieces',  badge: null,         badgeColor: '',        badgeBg: '',         added: false },
  { label: 'Signature cocktail',      badge: null,         badgeColor: '',        badgeBg: '',         added: true },
  { label: 'Guest shuttle from SJD',  badge: null,         badgeColor: '',        badgeBg: '',         added: false },
  { label: 'Live band',               badge: null,         badgeColor: '',        badgeBg: '',         added: true },
  { label: 'Wedding videographer',    badge: null,         badgeColor: '',        badgeBg: '',         added: true },
  { label: 'Sunset yacht welcome',    badge: 'Wow factor', badgeColor: '#8e6434', badgeBg: '#e0d3c5', added: true },
  { label: 'Late-night taco bar',     badge: 'Wow factor', badgeColor: '#8e6434', badgeBg: '#e0d3c5', added: true },
]

const FILTER_OPTIONS = ['All', 'Photography', 'Entertainment', 'Catering', 'Bar', 'Florals', 'Beauty']

// ── Carousel slide definitions ────────────────────────────────────
const COUPLE_SLIDES: Record<string, { left: string; right: string }[]> = {
  'Priya + Rahul': [
    { left: '/assets/wedding-priya-rahul.png',     right: '/assets/couple-gallery-2.png' },
    { left: '/assets/priya-rahul-carousel-1.jpg',  right: '/assets/priya-rahul-carousel-2.jpg' },
  ],
  'Mark + Brendan': [
    { left: '/assets/wedding-mark-brendan.webp',    right: '/assets/couple-gallery-2.png' },
    { left: '/assets/mark-brendan-carousel-1.webp', right: '/assets/mark-brendan-carousel-2.webp' },
  ],
  'Sofia + James': [
    { left: '/assets/wedding-sofia-james.png',    right: '/assets/couple-gallery-2.png' },
    { left: '/assets/sofia-james-carousel-1.jpg', right: '/assets/sofia-james-carousel-2.jpg' },
  ],
}

const DEFAULT_SLIDES = (mainImage: string) => [
  { left: mainImage,                       right: '/assets/couple-gallery-2.png' },
  { left: '/assets/couple-carousel-1.jpg', right: '/assets/couple-carousel-2.jpg' },
]

function getSlides(coupleName: string, mainImage: string) {
  return COUPLE_SLIDES[coupleName] ?? DEFAULT_SLIDES(mainImage)
}

export default function CoupleDetailPage() {
  const [menuOpen, setMenuOpen]     = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [added, setAdded]           = useState<Record<string, boolean>>(
    Object.fromEntries(VENDORS.map((v) => [v.label, v.added]))
  )
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideDir, setSlideDir]     = useState(1)          // 1 = next, -1 = prev
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterAll, setFilterAll]   = useState(true)
  const [filterChecked, setFilterChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(FILTER_OPTIONS.slice(1).map((o) => [o, false]))
  )
  const [toast, setToast]           = useState<{ msg: string; id: number } | null>(null)

  // Couple data from sessionStorage
  const [coupleName, setCoupleName] = useState('Sofia + James')
  const [coupleDate, setCoupleDate] = useState('Jun 2024 · 280 guests')
  const [mainImage, setMainImage]   = useState('/assets/couple-gallery-1.png')
  const router = useRouter()

  useEffect(() => {
    const raw = sessionStorage.getItem('selectedCouple')
    if (raw) {
      try {
        const d = JSON.parse(raw)
        if (d.name)      setCoupleName(d.name)
        if (d.date)      setCoupleDate(d.date)
        if (d.mainImage) setMainImage(d.mainImage)
      } catch { /* ignore */ }
    }
  }, [])

  const slides = getSlides(coupleName, mainImage)

  function goSlide(dir: 1 | -1) {
    setSlideDir(dir)
    setSlideIndex((i) => (i + dir + slides.length) % slides.length)
  }

  function toggle(label: string) {
    const next = !added[label]
    setAdded((prev) => ({ ...prev, [label]: next }))
    const msg = next ? `Added ${label}` : `Removed ${label}`
    const id = Date.now()
    setToast({ msg, id })
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2200)
  }

  function toggleFilterOption(opt: string) {
    if (opt === 'All') {
      setFilterAll(true)
      setFilterChecked(Object.fromEntries(FILTER_OPTIONS.slice(1).map((o) => [o, false])))
    } else {
      const next = { ...filterChecked, [opt]: !filterChecked[opt] }
      setFilterChecked(next)
      setFilterAll(Object.values(next).every((v) => !v))
    }
  }

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh bg-[#f5f5f5]" style={{ position: 'relative' }}>
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        <div className="flex flex-col flex-1">

          {/* ── Back ── */}
          <div className="px-[16px] pt-[16px]">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-[6px] font-sans font-normal text-[11px]"
              style={{ color: '#767676' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          </div>

          {/* ── Name & meta ── */}
          <div className="flex flex-col gap-[10px] px-[12px] py-[14px]">
            <motion.p
              key={coupleName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="font-serif text-[48px] leading-[52px] text-[#2b2b27]"
            >
              {coupleName}
            </motion.p>
            <p className="font-sans font-normal text-[14px] leading-5 text-[#969696]">{coupleDate}</p>
          </div>

          {/* ── Carousel ── */}
          <div className="flex flex-col gap-[8px] w-full overflow-hidden">
            {/* Sliding image pair */}
            <div className="relative w-full overflow-hidden" style={{ height: 251 }}>
              <AnimatePresence initial={false} custom={slideDir}>
                <motion.div
                  key={slideIndex}
                  custom={slideDir}
                  initial={{ x: slideDir * 100 + '%' }}
                  animate={{ x: 0 }}
                  exit={{ x: slideDir * -100 + '%' }}
                  transition={{ duration: 0.38, ease: 'easeInOut' }}
                  className="absolute inset-0 flex"
                >
                  <div className="relative shrink-0 overflow-hidden" style={{ width: 160 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slides[slideIndex].left} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="relative flex-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slides[slideIndex].right} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows + dot indicator */}
            <div className="flex items-center justify-end gap-[8px] px-[12px]">
              <div className="flex gap-[4px] items-center mr-auto pl-[4px]">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: i === slideIndex ? 16 : 6,
                      height: 6,
                      background: i === slideIndex ? '#2b2b27' : '#d0d0d0',
                    }}
                  />
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => goSlide(-1)} className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => goSlide(1)} className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* ── Body copy ── */}
          <div className="px-[24px] py-[24px]">
            <p className="font-sans font-normal text-base leading-6 text-[#585858]" style={{ maxWidth: 330 }}>
              We wanted quiet. Not boring—quiet. Nobu was the only place that truly understood the difference. For our luxury bohemian wedding, the architecture of the hotel was everything; we spent our sunset session obsessed with the way the light and shadows played off the minimalist lines. Every detail felt intentional and chilled out, from the sushi bar at our welcome party to the romantic bonfire by the sea where it felt like we were celebrating in the middle of a magical desert. It was an incredibly intimate experience that didn&apos;t sacrifice an ounce of style, and we couldn&apos;t have pulled it off without the amazing team at Look At Me Brides and DJ Emmanuel&apos;s perfect playlist.
            </p>
          </div>

          {/* ── Our Wedding Edit ── */}
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/couple-main-sofia-james.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />

            <div className="relative flex flex-col gap-[12px] pt-[24px] pb-[8px]">
              {/* Heading */}
              <div className="flex flex-col items-start px-[16px]">
                <p className="font-serif text-[34px] leading-[40px] text-white">
                  Add <em>Their</em> Wedding Edit to Your Vendor Wish List
                </p>
                <p className="font-sans font-light text-[14px] leading-5 text-white mt-[8px]" style={{ maxWidth: 330 }}>
                  Tap any detail below to add it to your Vendor Wish List — your Wedding Concierge will follow up.
                </p>
              </div>

              {/* Filter trigger */}
              <div className="flex items-center px-[18px]">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-[6px] font-sans font-light text-[14px] text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5H17M6 10H14M9 15H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Filter
                </motion.button>
              </div>

              {/* Vendor cards */}
              <div className="flex flex-col gap-[12px] px-[16px] pb-[16px]">
                {VENDORS.map((vendor, i) => (
                  <motion.div
                    key={vendor.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.04 }}
                    className="flex items-center gap-[12px] p-[12px] rounded-[8px]"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#2b2b27]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3C6.13 3 3 6.13 3 10s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 2.5c.69 0 1.25.56 1.25 1.25S10.69 8 10 8s-1.25-.56-1.25-1.25S9.31 5.5 10 5.5zM10 15c-1.75 0-3.29-.9-4.19-2.26C6.51 11.33 9.19 11 10 11c.81 0 3.49.33 4.19 1.74C13.29 14.1 11.75 15 10 15z" fill="#2b2b27" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                      <div className="flex items-center gap-[6px] flex-wrap">
                        <p className="font-sans font-medium text-[14px] leading-5 text-[#2b2b27]">{vendor.label}</p>
                        {vendor.badge && (
                          <span
                            className="font-sans text-[10px] leading-[12px] tracking-[0.4px] uppercase px-[8px] py-[2px] rounded-full"
                            style={{ background: vendor.badgeBg, color: vendor.badgeColor }}
                          >
                            {vendor.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-sans font-normal text-[12px] leading-[16px] underline whitespace-nowrap" style={{ color: '#ca9151' }}>
                        Tastemakers notes (4)
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggle(vendor.label)}
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: added[vendor.label] ? '#1e1e1e' : 'white' }}
                    >
                      {added[vendor.label] ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3V13M3 8H13" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Continue CTA */}
              <div className="px-[24px] py-[24px]">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/ready-to-save')}
                  className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
                >
                  Continue
                </motion.button>
              </div>
            </div>
          </div>

          <Footer bg="#000000" />
        </div>

        {/* ── Toast ── */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 8, x: '-50%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-[28px] left-1/2 z-50 px-[18px] py-[10px] rounded-full shadow-lg font-sans text-[13px] font-medium text-white pointer-events-none"
              style={{ background: '#2b2b27' }}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Filter sheet ── */}
        <AnimatePresence>
          {filterOpen && (
            <>
              {/* Scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(58,58,58,0.7)' }}
                onClick={() => setFilterOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] overflow-hidden"
                style={{ maxWidth: 390, margin: '0 auto' }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-[12px] pb-[4px]">
                  <div className="w-[36px] h-[4px] rounded-full" style={{ background: '#d0d0d0' }} />
                </div>

                <div className="flex flex-col gap-[12px] px-[20px] pb-[24px]">
                  {/* Header */}
                  <div className="flex items-center justify-between pt-[4px]">
                    <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#585858' }}>
                      Vendor types
                    </p>
                    <button onClick={() => setFilterOpen(false)} className="font-sans text-base text-[#2b2b27]">✕</button>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col">
                    {FILTER_OPTIONS.map((opt) => {
                      const checked = opt === 'All' ? filterAll : filterChecked[opt]
                      return (
                        <motion.button
                          key={opt}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleFilterOption(opt)}
                          className="flex items-center gap-[8px] py-[6px] px-[2px]"
                        >
                          <div
                            className="w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center shrink-0"
                            style={{
                              background: checked ? '#585858' : 'white',
                              borderColor: checked ? '#585858' : '#d0d0d0',
                            }}
                          >
                            {checked && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <p className="font-sans font-medium text-base text-[#2b2b27]">{opt}</p>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-[12px] justify-end pt-[4px]">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setFilterAll(true)
                        setFilterChecked(Object.fromEntries(FILTER_OPTIONS.slice(1).map((o) => [o, false])))
                      }}
                      className="h-[36px] px-[18px] rounded-full border font-sans font-light text-[14px] text-[#2b2b27]"
                      style={{ borderColor: '#767676' }}
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setFilterOpen(false)}
                      className="h-[36px] px-[18px] rounded-full bg-black font-sans font-light text-[14px] text-white"
                    >
                      Apply
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
