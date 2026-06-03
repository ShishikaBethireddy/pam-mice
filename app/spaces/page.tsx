'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import SpaceChatLayout, { ChatMsg } from '@/components/SpaceChatLayout'

// ── Images from Figma ─────────────────────────────────────────────
const IMG_SHIAWASE = 'https://www.figma.com/api/mcp/asset/459b3ca1-8200-4e90-8832-3189170aa43f'

// ── Dynamic alt-date helper ───────────────────────────────────────
function getAltDates(dateStr: string): [string, string] {
  const seasonMap: Record<string, number> = { Spring: 3, Summer: 6, Fall: 9, Winter: 12 }
  let base: Date | null = null

  for (const [season, month] of Object.entries(seasonMap)) {
    if (dateStr.includes(season)) {
      const y = dateStr.match(/\d{4}/)
      base = new Date(parseInt(y ? y[0] : '2027'), month - 1, 15)
      break
    }
  }
  if (!base) {
    const p = new Date(dateStr)
    if (!isNaN(p.getTime())) base = p
  }
  if (!base) base = new Date(2027, 3, 15)

  const add = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)
  const fmt = (start: Date) => {
    const end = add(start, 2)
    const mo = start.toLocaleDateString('en-US', { month: 'short' })
    return `${mo} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
  }
  return [fmt(add(base, 155)), fmt(add(base, 172))]
}

// ── Match badge ───────────────────────────────────────────────────
function MatchBadge({ score }: { score: number }) {
  const palette =
    score >= 90
      ? { bg: '#e7eddb', fg: '#4a5635', dot: '#646f53' }
      : score >= 75
        ? { bg: '#f1ead7', fg: '#8e6434', dot: '#c0904a' }
        : { bg: '#ececec', fg: '#585858', dot: '#969696' }
  return (
    <div
      className="absolute top-[12px] left-[12px] flex items-center gap-[6px] px-[10px] py-[5px] rounded-full backdrop-blur-sm"
      style={{ background: 'rgba(255,255,255,0.94)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ background: palette.dot }} />
      <span
        className="font-sans font-semibold text-[12px] leading-[14px] tracking-[0.2px]"
        style={{ color: palette.fg }}
      >
        {score}% Match
      </span>
      <span
        className="font-sans text-[10px] leading-[12px] tracking-[0.4px] uppercase pl-[2px]"
        style={{ color: palette.fg, opacity: 0.7 }}
      >
        {score >= 90 ? 'Top' : score >= 75 ? 'Great' : 'Good'}
      </span>
      <span aria-hidden className="hidden">{palette.bg}</span>
    </div>
  )
}

// ── Venue cards ───────────────────────────────────────────────────
function UnavailableCard({ altDates, matchScore }: { altDates: [string, string]; matchScore: number }) {
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className="flex flex-col"
    >
      <div className="h-[180px] w-full rounded-t-[12px] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG_SHIAWASE} alt="Shiawase Terrace" className="absolute inset-0 w-full h-full object-cover" />
        <MatchBadge score={matchScore} />
      </div>
      <div className="bg-white rounded-b-[6px] flex flex-col gap-[16px] p-[16px]">
        <div>
          <span
            className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase px-[10px] py-[4px] rounded-full"
            style={{ background: '#fdf1dc', color: '#c47f12' }}
          >
            Available for a different date
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          <p className="font-display font-normal text-[22px] leading-6 text-[#2b2b27] tracking-[-0.4px]">
            Shiawase Terrace
          </p>
          <p className="font-sans text-[11px] leading-[14px] text-[#2b2b27]">
            Ceremony · Cocktail · Reception
          </p>
          <p className="font-sans text-[12px] leading-normal text-[#585858]">
            Shiawase Terrace is the best match but unfortunately your dates are taken. These 2 other dates are available if you&apos;re flexible.
          </p>
        </div>
        <div className="flex gap-[6px] flex-wrap">
          <span
            className="font-sans text-[12px] text-white px-[12px] py-[6px] rounded-full whitespace-nowrap"
            style={{ background: '#2b2b27' }}
          >
            {altDates[0]}
          </span>
          <span
            className="font-sans text-[12px] text-[#2b2b27] px-[12px] py-[6px] rounded-full border whitespace-nowrap"
            style={{ borderColor: '#d0d0d0' }}
          >
            {altDates[1]}
          </span>
        </div>
        <div className="flex justify-end">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/spaces/alternatives')}
            className="h-[36px] px-[18px] rounded-full border font-sans font-light text-[14px] text-[#2b2b27] flex items-center justify-center"
            style={{ borderColor: '#767676' }}
          >
            Explore other properties
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function VenueCard({
  image, badge, name, meta, href, delay, matchScore,
}: {
  image: string; badge: string; name: string; meta: string; href: string; delay: number; matchScore: number
}) {
  const router = useRouter()
  function handleSelect() {
    sessionStorage.setItem('selectedVenue', name)
    router.push('/packages')
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className="flex flex-col"
    >
      <Link href={href}>
        <div className="h-[180px] w-full rounded-t-[12px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          <MatchBadge score={matchScore} />
        </div>
      </Link>
      <div className="bg-white rounded-b-[12px] flex flex-col gap-[5px] p-[12px]">
        <p className="font-sans font-semibold text-[12px] tracking-[0.6px] uppercase text-[#585858]">{badge}</p>
        <p className="font-display font-normal text-[20px] leading-[22px] text-[#2b2b27] tracking-[-0.2px]">{name}</p>
        <div className="flex flex-col gap-[10px]">
          <p className="font-sans text-[11px] leading-[14px] text-[#2b2b27]">{meta}</p>
          <div className="flex items-center justify-end gap-[10px]">
            <Link href={href}>
              <motion.span
                whileTap={{ scale: 0.97 }}
                className="h-[36px] px-[18px] rounded-full border font-sans font-light text-[14px] text-[#2b2b27] flex items-center justify-center"
                style={{ borderColor: '#767676' }}
              >
                Explore
              </motion.span>
            </Link>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSelect}
              className="h-[36px] px-[18px] rounded-full font-sans font-light text-[14px] text-white flex items-center justify-center"
              style={{ background: '#2b2b27' }}
            >
              Select
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function SpacesPage() {
  const [displayDate, setDisplayDate] = useState('April 15, 2027')
  const [altDates, setAltDates] = useState<[string, string]>(['Sep 19–21, 2027', 'Oct 3–5, 2027'])
  const [guestCount, setGuestCount] = useState<number>(150)
  const [mood, setMood] = useState<string>('')

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedSpaceDate')
    if (saved) {
      setDisplayDate(saved)
      setAltDates(getAltDates(saved))
    }
    const g = sessionStorage.getItem('guestCount')
    if (g) setGuestCount(Number(g))
    const m = sessionStorage.getItem('selectedMood')
    if (m) setMood(m)
  }, [])

  // Contextual chat thread for the left rail
  const thread: ChatMsg[] = [
    { author: 'user', text: <>{displayDate}</> },
    {
      author: 'allie',
      lines: [
        <span key="0" className="font-medium text-[#2b2b27]">
          {displayDate}.
        </span>,
        <>
          Here&apos;s what&apos;s available for your <span className="font-medium text-[#2b2b27]">{guestCount}-guest</span> celebration at Nobu Los Cabos
          {mood ? <> in <span className="italic">{mood}</span></> : null}.
        </>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <span key="rank" className="font-medium text-[#2b2b27]">My ranking, in plain English:</span>,
        <>
          <span className="font-medium text-[#2b2b27]">Shiawase Terrace (96%)</span> is your strongest aesthetic match — but your weekend is taken. I&apos;ve pulled two adjacent dates that are open.
        </>,
        <>
          <span className="font-medium text-[#2b2b27]">Yakusoku Garden (92%)</span> is the obvious pick if you want oceanfront ceremony with cocktail flow. Available your date.
        </>,
        <>
          <span className="font-medium text-[#2b2b27]">Beach (85%)</span> is the sleeper hit — barefoot, sunset, no roof. Great if your guest list is OK with sand.
        </>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <>Tap <span className="font-medium text-[#2b2b27]">Explore</span> on any card to see my full venue dossier. Tap <span className="font-medium text-[#2b2b27]">Select</span> when one feels right and we&apos;ll pick a package.</>,
      ],
    },
  ]

  return (
    <SpaceChatLayout
      thread={thread}
      inputPlaceholder="Ask Allie about a space…"
      activeStep={3}
      railEyebrow="Spaces · Nobu Los Cabos"
      railTitle="Your shortlist, ranked."
    >
      {/* Canvas content */}
      <div className="screen-wrap">
        <div className="mobile-frame flex flex-col bg-[#f5f5f5]">
          <div className="flex flex-col flex-1">
            {/* Venues section */}
            <div className="flex flex-col gap-[18px] pt-[36px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col gap-[8px] px-[24px]"
              >
                <p className="font-serif text-[36px] leading-[40px] text-black">Available Spaces for</p>
                <p className="font-sans font-medium text-base leading-6 text-black">{displayDate}</p>
                <div className="h-[2px] w-[40px]" style={{ background: '#767676' }} />
              </motion.div>

              <div className="flex flex-col gap-[18px] px-[24px] md:grid md:grid-cols-2 md:gap-[20px]">
                <VenueCard
                  image="/assets/venue-yakusoku-garden.png"
                  badge="Ocean views · Outdoor lawn"
                  name="Yakusoku Garden"
                  meta="Ceremony · Cocktail"
                  href="/spaces/yakusoku-garden"
                  delay={0.1}
                  matchScore={92}
                />
                <VenueCard
                  image="/assets/venue-beach.png"
                  badge="Intimate · Beachfront · Evening"
                  name="Beach"
                  meta="Ceremony · Reception · Cocktail"
                  href="/spaces/beach"
                  delay={0.18}
                  matchScore={85}
                />
                <div className="md:col-span-2">
                  <UnavailableCard altDates={altDates} matchScore={96} />
                </div>
              </div>
            </div>

            {/* Questions about Nobu — mobile only (desktop has the rail) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="md:hidden flex flex-col py-[36px]"
            >
              <div className="flex flex-col gap-[4px] px-[24px]" style={{ color: '#585858' }}>
                <p className="font-serif italic text-[20px] leading-[28px]">Questions about Nobu?</p>
                <p className="font-sans text-sm leading-5">Ask Allie, she has your dates.</p>
              </div>
              <div className="pt-[16px] px-[16px]">
                <div className="bg-white border border-[#d0d0d0] rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-2 px-1 py-[3px] w-full">
                  <div className="flex-1 px-[8px] py-[8px]">
                    <p className="font-sans text-sm text-[#969696]">Type a message...</p>
                  </div>
                  <button className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 12V2M2 7L7 2L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>

            <Footer bg="#000000" />
          </div>
        </div>
      </div>
    </SpaceChatLayout>
  )
}
