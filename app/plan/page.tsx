'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

import { useRouter } from 'next/navigation'

// ── Animation variants ─────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' as const } },
}

const heroHeadline: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
}

const heroWord: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const heroCard: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.55, ease: 'easeOut' as const } },
}

// ── Animated button wrapper ─────────────────────────────────────
function Btn({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ── Date picker ─────────────────────────────────────────────────
function DatePicker({ onDateSelected }: { onDateSelected?: () => void }) {
  const [open, setOpen] = useState(false)
  const [season, setSeason] = useState('Spring')
  const [year, setYear] = useState('2027')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    sessionStorage.setItem('weddingDate', `${season} ${year}`)
  }, [season, year])

  return (
    <div ref={ref} className="flex flex-col w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="border-b border-white/60 flex items-center justify-between pb-2 pt-2 w-full"
      >
        <span className="font-sans font-semibold text-2xl leading-8 text-white/90">
          {season} {year}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <Image src="/assets/icon-calendar-field.svg" alt="" width={18} height={20} className="shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-2">
              {/* Season pills */}
              <div className="flex gap-2 flex-wrap">
                {['Spring', 'Summer', 'Fall', 'Winter'].map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => { setSeason(s); onDateSelected?.() }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full text-sm font-sans font-medium border transition-all duration-150"
                    style={
                      season === s
                        ? { background: 'rgba(255,255,255,0.95)', color: '#2b2b27', borderColor: 'white' }
                        : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.25)' }
                    }
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              {/* Year pills */}
              <div className="flex gap-2">
                {['2026', '2027', '2028'].map((y) => (
                  <motion.button
                    key={y}
                    onClick={() => { setYear(y); setOpen(false); onDateSelected?.() }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full text-sm font-sans font-medium border transition-all duration-150"
                    style={
                      year === y
                        ? { background: 'rgba(255,255,255,0.95)', color: '#2b2b27', borderColor: 'white' }
                        : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.25)' }
                    }
                  >
                    {y}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────
export default function PlanPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [dateSelected, setDateSelected] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-dvh bg-[#e8e8e8] md:bg-transparent">
      <div className="w-full max-w-[390px] md:max-w-none mx-auto flex flex-col bg-[#f5f5f5] min-h-dvh">
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
        />

        {/* ── Hero ── */}
        <section
          className="relative flex flex-col items-center justify-end md:justify-center py-6 md:py-24 shrink-0 overflow-hidden"
          style={{ minHeight: 520 }}
        >
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src="/assets/videobg.mp4" type="video/mp4" />
              <Image src="/assets/hero-bg.png" alt="" fill className="object-cover object-center" priority />
            </video>
          </div>

          <div className="relative flex flex-col gap-10 items-center px-4 w-full md:max-w-3xl">
            {/* Headline — staggered words */}
            <motion.div
              className="font-serif font-normal text-5xl md:text-7xl text-center text-white leading-[52px] md:leading-[80px]"
              initial="hidden"
              animate="visible"
              variants={heroHeadline}
            >
              {['A wedding', 'only you could', 'imagine'].map((line) => (
                <motion.p key={line} variants={heroWord}>{line}</motion.p>
              ))}
            </motion.div>

            {/* Glass card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroCard}
              className="flex flex-col gap-7 items-start justify-end p-6 md:p-8 w-full max-w-[338px] md:max-w-lg rounded-xl border border-[rgba(218,214,206,0.5)]"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex flex-col gap-1 w-full">
                <p className="font-sans font-medium text-xs text-white/70 tracking-[1.4px] uppercase">
                  I want to get married...
                </p>
                <DatePicker onDateSelected={() => setDateSelected(true)} />
              </div>

              <AnimatePresence>
                {dateSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] w-full"
                    style={{ background: '#edece8' }}
                  >
                    <div className="flex items-center shrink-0">
                      {[
                        'https://www.figma.com/api/mcp/asset/a91906f7-c7c0-4bcf-a148-ec9e240462e4',
                        'https://www.figma.com/api/mcp/asset/390cfda5-b8aa-4ff3-85bf-2b2d732a78da',
                        'https://www.figma.com/api/mcp/asset/8355d28d-5272-4667-ba68-951782adefbc',
                        'https://www.figma.com/api/mcp/asset/bde85049-6cfe-41a8-a180-0b809107b42c',
                      ].map((src, i) => (
                        <div
                          key={i}
                          className="w-[32px] h-[32px] rounded-full overflow-hidden border-[2px] border-white shrink-0"
                          style={{ marginLeft: i > 0 ? -10 : 0, position: 'relative', zIndex: 4 - i }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="font-sans text-[11px] leading-[15px]" style={{ color: '#646f53' }}>
                      38 brides saved this venue in the last 30 days
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3 w-full">
                <motion.button
                  onClick={() => router.push('/chat')}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center h-11 rounded-full w-full"
                  style={{ background: '#34342f' }}
                >
                  <span className="font-sans font-medium text-base leading-6 text-white">Plan my wedding</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── All In Bride Perks ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col gap-6 px-6 md:px-16 py-11 md:py-16"
        >
          <motion.div variants={staggerItem} className="flex flex-col gap-2.5 md:max-w-2xl">
            <p className="text-eyebrow" style={{ color: '#ca9151' }}>PICTURE IT, WE&apos;LL PLAN IT</p>
            <p className="font-serif font-normal text-[36px] leading-10 text-[#2b2b27]">All In one wedding planning suite for your destination wedding at Nobu</p>
          </motion.div>

          <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-4">
            {[
              {
                icon: '/assets/icon-perk-resort.svg',
                title: 'The whole resort feels like yours',
                body: "200 rooms means your guest list fills the resort. Everyone you invited — no one you didn't.",
              },
              {
                icon: '/assets/icon-perk-cuisine.svg',
                title: 'The Nobu kitchen at your reception',
                body: 'Omakase courses, signature black cod, and a Michelin-pedigree kitchen plating your dinner.',
              },
              {
                icon: '/assets/icon-perk-coordinator.svg',
                title: 'One coordinator, every detail',
                body: 'A dedicated Nobu wedding specialist who knows the property, the vendors, and exactly how the day runs.',
              },
              {
                icon: '/assets/icon-perk-cocktails.svg',
                title: 'Cocktails at Nami, fire pits at sunset',
                body: "Signature Nobu cocktails, golden-hour bonfires, and a setting your guests will talk about forever.",
              },
            ].map((perk) => (
              <motion.div
                key={perk.title}
                variants={staggerItem}
                whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                transition={{ duration: 0.2 }}
                className="bg-white flex gap-4 items-start px-5 py-[22px] rounded-lg"
              >
                <div className="shrink-0 w-8 h-8 flex items-start pt-0.5">
                  <Image src={perk.icon} alt="" width={32} height={32} />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">{perk.title}</p>
                  <p className="font-sans font-normal text-xs leading-4 text-[#585858]">{perk.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Testimonial ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-white flex flex-col md:flex-row overflow-hidden"
        >
          <div className="relative h-[360px] md:h-auto md:w-1/2 md:min-h-[440px] overflow-hidden">
            <Image src="/assets/testimonial-bg.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative px-6 md:px-12 pt-6 pb-6 md:py-16 md:w-1/2 flex flex-col gap-2 -mt-11 md:mt-0 md:justify-center">
            <p className="font-serif font-normal text-[30px] md:text-[36px] leading-10 text-[#585858]">
              &ldquo;They honored every cultural tradition with such care and
              understanding—from the ceremony details to the smallest symbolic touches.
              It felt deeply personal, respectful, and absolutely stunning.&rdquo;
            </p>
            <p className="text-caption text-[#2b2b27]">– Priya &amp; Arjun Khanna</p>
          </div>
        </motion.section>

        {/* ── Wedding Edit  ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col gap-3.5 py-9 md:py-16"
        >
          <motion.div variants={staggerItem} className="flex flex-col items-center px-6 md:px-16 md:items-start md:flex-row md:justify-between md:mb-4">
            <div className="font-serif font-normal text-[36px] leading-10 text-[#2b2b27] text-center md:text-left">
              <p>Wedding Edit</p>
              <p></p>
            </div>
            <Btn className="flex items-center gap-1.5 py-2">
              <span className="font-sans font-medium text-sm leading-5 text-[#767676]">See all</span>
              <Image src="/assets/icon-arrow-right.svg" alt="" width={16} height={16} />
            </Btn>
          </motion.div>

          <div className="scroll-x md:grid md:grid-cols-3 flex gap-4 pl-6 md:pl-0 md:px-16 pb-2 md:gap-6">
            {[
              {
                img: '/assets/wedding-priya.png',
                name: 'Priya + Rahul',
                date: 'Oct 2024 · 420 guests',
                quote: '"We told the chatbot \'mystic boho cathedral\' and it spit back our exact wedding. We cried. We booked."',
              },
              {
                img: '/assets/wedding-sofia.png',
                name: 'Sofia + James',
                date: 'Jun 2024 · 280 guests',
                quote: '"We wanted quiet. Not boring — quiet. Nobu was the only place that understood the difference."',
              },
              {
                img: '/assets/wedding-priya.png',
                name: 'Mei + Carlos',
                date: 'Mar 2024 · 150 guests',
                quote: null,
              },
            ].map((w, i) => (
              <motion.button
                key={w.name}
                type="button"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sessionStorage.setItem(
                    'selectedCouple',
                    JSON.stringify({ name: w.name, date: w.date, mainImage: w.img })
                  )
                  router.push('/couples/sofia-james')
                }}
                className="bg-white rounded-xl overflow-hidden shrink-0 w-[200px] md:w-auto flex flex-col cursor-pointer text-left"
              >
                <div className="relative h-[210px] md:h-[260px] w-full bg-[#f9bed1]">
                  {w.img && <Image src={w.img} alt={w.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-col gap-3 p-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-display font-normal text-sm leading-[18px] text-[#2b2b27] tracking-tight">{w.name}</p>
                    <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">{w.date}</p>
                  </div>
                  {w.quote && (
                    <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">{w.quote}</p>
                  )}
                </div>
              </motion.button>
            ))}
            <div className="w-6 shrink-0" />
          </div>
        </motion.section>

        {/* ── Right Now ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative flex flex-col gap-6 px-6 md:px-16 py-11 md:py-16 overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image src="/assets/right-now-bg.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative flex flex-col gap-6 md:max-w-2xl">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow text-[#2b2b27]">RIGHT NOW</p>
            <div className="font-display font-normal text-[30px] leading-[38px] text-[#2b2b27]">
              <span>What&apos;s </span>
              <span className="italic">having a moment.</span>
            </div>
            <p className="font-sans font-normal text-sm leading-5 text-[#2b2b27]">
              The venues and dates your planner would tell you to move on.
            </p>
          </div>

          <div className="relative bg-white/80 rounded-lg flex flex-col gap-0.5 px-4 py-2">
            {[
              { name: 'Shiawase Terrace',   sub: 'The one everyone keeps asking about.', badge: 'Trending' },
              { name: 'Late October · Cabo', sub: 'The one everyone keeps asking about.', badge: 'Going fast' },
              { name: 'Yakusoku Garden',     sub: "A quiet pick that's worth knowing.",   badge: 'Under the radar' },
            ].map((item, i) => (
              <div key={item.name}>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">{item.name}</p>
                    <p className="font-display italic font-normal text-[13px] leading-[19px] text-[#585858]">{item.sub}</p>
                  </div>
                  <div className="bg-[#e8e8e8] px-2 py-1 rounded-sm shrink-0 ml-2">
                    <p className="font-sans font-semibold text-[10px] leading-4 text-[#585858] tracking-[0.8px] uppercase">{item.badge}</p>
                  </div>
                </motion.div>
                {i < 2 && <div className="h-0.5 w-10 bg-[#767676]" />}
              </div>
            ))}
          </div>
          </div>
        </motion.section>

        {/* ── Forever & always CTA ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white flex flex-col items-center gap-9 px-6 md:px-16 py-11 md:py-16"
        >
          <motion.div variants={staggerItem} className="flex flex-col gap-3 w-full md:max-w-2xl">
            <p className="font-sans font-light text-[36px] leading-10 tracking-tight text-[#2b2b27]">
              Forever &amp; always — let&apos;s start.
            </p>
            <p className="font-sans font-normal text-sm leading-5 text-[#2b2b27]">
              Tell our planner the date, the city, the feeling. We&apos;ll handle the rest in one conversation.
            </p>
          </motion.div>
          <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-3 w-full md:max-w-2xl">
            <Btn className="flex items-center justify-center h-11 rounded-full bg-[#f5f5f5] border border-[#767676] w-full">
              <span className="font-sans font-medium text-base leading-6 text-[#2b2b27]">Begin planning</span>
            </Btn>
          </motion.div>
        </motion.section>

        <Footer />
      </div>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignIn={() => router.push('/sign-in')}
      />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
