'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SpaceChatLayout, { ChatMsg } from '@/components/SpaceChatLayout'

// ── Page ─────────────────────────────────────────────────────────
export default function ShiawaseTerracePage() {
  const router = useRouter()

  const thread: ChatMsg[] = [
    { author: 'user', text: <>Tell me about Shiawase Terrace.</> },
    {
      author: 'allie',
      lines: [
        <span key="0" className="font-medium text-[#2b2b27]">Your highest-affinity space.</span>,
        <>Outdoor, sunset-facing, Pacific views — and the largest at Nobu Los Cabos. 450 ceremony seats, so both families fit comfortably with room for the moment to breathe.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <span key="t" className="font-medium text-[#2b2b27]">Allie&apos;s pro tip — timing</span>,
        <>Book your ceremony for <span className="font-medium text-[#2b2b27]">5:30pm</span>. The Baja winds settle after 4:30 and by 6pm the Pacific light hits this terrace in a way no filter can replicate.</>,
        <>Tell your photographer to stand at the north edge at <span className="font-medium text-[#2b2b27]">6:15</span> — that&apos;s the shot every couple has on their wall.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <>Packages start at <span className="font-medium text-[#2b2b27]">$5,000</span>. Tap <span className="font-medium text-[#2b2b27]">Select</span> on the right to choose a package, or check the Wedding Edit to see how other couples styled it.</>,
      ],
    },
  ]

  return (
    <SpaceChatLayout
      thread={thread}
      inputPlaceholder="Ask Allie about Shiawase Terrace…"
      activeStep={3}
      railEyebrow="Venue dossier"
      railTitle="Shiawase Terrace"
    >
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col bg-[#f5f5f5]">

        {/* ── Hero ── */}
        <div className="relative w-full overflow-hidden flex flex-col justify-between" style={{ minHeight: 314 }}>
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/space-hero-shiawase.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Appbar */}
          <div className="relative flex items-center justify-between px-[18px] py-[16px] pt-[28px]">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3V13M10 3L6.5 6.5M10 3L13.5 6.5M4 14V16C4 16.55 4.45 17 5 17H15C15.55 17 16 16.55 16 16V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Spacer to push appbar to top */}
          <div style={{ height: 72 }} />
        </div>

        {/* ── Black info panel ── */}
        <div className="bg-black flex flex-col gap-[6px] pb-[22px] pt-[18px] px-[20px]">
          <p className="font-sans font-normal text-[9px] tracking-[1.2px] uppercase text-white">
            Best match · Oceanfront dining
          </p>
          <p className="font-serif text-[36px] leading-[40px] text-white">
            Shiawase Terrace
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-[6px] py-[16px]">
            {[
              { label: 'Outdoor · Pacific views', color: '#2b2b27' },
              { label: 'Largest at Nobu',          color: '#b67d3d' },
              { label: 'Sunset-facing',             color: '#2b2b27' },
            ].map((tag) => (
              <span
                key={tag.label}
                className="font-sans font-normal text-[11px] leading-[16px] px-[12px] py-[5px] rounded-full"
                style={{ background: '#b4b4b4', color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Select button */}
          <div className="flex justify-end">
            <button
              onClick={() => { sessionStorage.setItem('selectedVenue', 'Shiawase Terrace'); router.push('/packages') }}
              className="h-[44px] px-[24px] rounded-full font-sans font-medium text-base text-[#2b2b27]"
              style={{ background: '#f5f5f5' }}
            >
              Select
            </button>
          </div>
        </div>

        {/* ── Trust signal ── */}
        <div className="flex items-center gap-[10px] justify-center p-[24px]" style={{ background: '#e8e8e8' }}>
          {/* Overlapping avatars */}
          <div className="flex items-center shrink-0">
            {[
              '/assets/avatar-bride-1.png',
              '/assets/avatar-bride-2.png',
              '/assets/avatar-bride-3.png',
              '/assets/avatar-bride-4.png',
            ].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt=""
                width={36}
                height={36}
                className="rounded-full border-2 border-white object-cover"
                style={{ marginRight: i < 3 ? -6 : 0, position: 'relative', zIndex: 4 - i }}
              />
            ))}
          </div>

          {/* Trust text */}
          <p className="font-sans text-[12px] leading-[18px] text-[#585858]" style={{ width: 214 }}>
            <span className="font-medium">38</span>
            {' brides saved this venue in the last 30 days'}
          </p>
        </div>

        {/* ── Body copy ── */}
        <div className="px-[24px] pt-[36px]">
          <p className="font-sans font-normal text-base leading-6 text-[#585858]" style={{ maxWidth: 330 }}>
            Shiawase Terrace is great for 150 guests. With{' '}
            <span>450 ceremony seats, everyone from both families fits — and the Pacific sunset backdrop does the rest.</span>
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="flex flex-col gap-[14px] px-[24px] py-[36px]">
          <div className="h-px w-full bg-[#d0d0d0]" />
          <div className="flex items-start gap-[12px] pb-[24px]">
            {/* Stat 1 */}
            <div className="flex-1 flex flex-col items-center gap-[4px]">
              <p className="font-serif text-[24px] leading-[36px] text-[#2b2b27] whitespace-nowrap">450</p>
              <div className="text-center">
                <p className="font-sans font-light text-sm leading-5 text-[#969696] tracking-normal">RECEPTION</p>
                <p className="font-sans font-light text-sm leading-5 text-[#969696] tracking-normal">CAPACITY</p>
              </div>
            </div>
            <div className="w-px self-stretch bg-[#d0d0d0]" />
            {/* Stat 2 */}
            <div className="flex-1 flex flex-col items-center gap-[4px]">
              <p className="font-serif text-[24px] leading-[36px] text-[#2b2b27] whitespace-nowrap">$5,000</p>
              <div className="text-center">
                <p className="font-sans font-light text-sm leading-5 text-[#969696] tracking-normal">PACKAGES</p>
                <p className="font-sans font-light text-sm leading-5 text-[#969696] tracking-normal">START AT</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Allie's Venue Dossier ── */}
        <div className="flex flex-col gap-[14px] p-[24px]" style={{ background: '#585858' }}>
          {/* Attribution */}
          <div className="flex items-center gap-[6px]">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-[0px_0.6px_0.6px_rgba(0,0,0,0.05)]"
              style={{ background: 'white' }}
            >
              <div className="relative" style={{ width: 16, height: 13 }}>
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            </div>
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">
              Allie&apos;s Venue Dossier
            </p>
          </div>
          <p className="font-sans font-normal text-base leading-6 text-white">
            Book your ceremony for 5:30pm. The Baja winds settle after 4:30 — and by 6pm the Pacific light hits this terrace in a way no filter can replicate. Tell your photographer to stand at the north edge at 6:15. That&apos;s the shot every couple has on their wall. Most don&apos;t plan for it.
          </p>
        </div>

        {/* ── Wedding Edit  ── */}
        <div className="flex flex-col gap-[14px] py-[36px]">
          {/* Header */}
          <div className="flex flex-col items-center px-[24px]">
            <div className="text-center">
              <p className="font-serif text-[36px] leading-[40px] text-[#2b2b27]">Wedding Edit</p>
              <p className="font-serif text-[36px] leading-[40px] text-[#2b2b27]"></p>
            </div>
            <div className="flex items-center gap-[6px] py-[8px]">
              <span className="font-sans font-medium text-[14px] leading-5 text-[#767676]">See all</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icon-explore-arrow.svg" alt="" width={16} height={16} />
            </div>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-[16px] pl-[24px] overflow-x-auto scroll-x">
            {/* Card 1 — Priya + Rahul */}
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sessionStorage.setItem('selectedCouple', JSON.stringify({
                  name: 'Priya + Rahul',
                  date: 'Oct 2024 · 420 guests',
                  mainImage: '/assets/wedding-priya-rahul.png',
                }))
                router.push('/couples/sofia-james')
              }}
              className="bg-white rounded-[8px] overflow-hidden shrink-0 w-[200px] text-left cursor-pointer"
            >
              <div className="h-[210px] relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/wedding-priya-rahul.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-[12px] p-[12px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] tracking-[-0.1px] whitespace-nowrap">
                    Priya + Rahul
                  </p>
                  <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">
                    Oct 2024 · 420 guests
                  </p>
                </div>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">
                  &ldquo;We told the chatbot &lsquo;mystic boho cathedral&rsquo; and it spit back our exact wedding. We cried. We booked.&rdquo;
                </p>
              </div>
            </motion.button>

            {/* Card 2 — Sofia + James */}
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sessionStorage.setItem('selectedCouple', JSON.stringify({
                  name: 'Sofia + James',
                  date: 'Jun 2024 · 280 guests',
                  mainImage: '/assets/wedding-sofia-james.png',
                }))
                router.push('/couples/sofia-james')
              }}
              className="bg-white rounded-[8px] overflow-hidden shrink-0 w-[200px] text-left cursor-pointer"
            >
              <div className="h-[210px] relative w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/wedding-sofia-james.png"
                  alt=""
                  className="absolute h-full object-cover"
                  style={{ left: '-18.61%', width: '175%', top: 0 }}
                />
              </div>
              <div className="flex flex-col gap-[12px] p-[12px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] tracking-[-0.1px] whitespace-nowrap">
                    Sofia + James
                  </p>
                  <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">
                    Jun 2024 · 280 guests
                  </p>
                </div>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">
                  &ldquo;We wanted quiet. Not boring — quiet. Nobu was the only place that understood the difference.&rdquo;
                </p>
              </div>
            </motion.button>

            {/* Card 3 — Mei + Carlos (placeholder) */}
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sessionStorage.setItem('selectedCouple', JSON.stringify({
                  name: 'Mei + Carlos',
                  date: 'Mar 2024 · 150 guests',
                  mainImage: '/assets/wedding-priya.png',
                }))
                router.push('/couples/sofia-james')
              }}
              className="bg-white rounded-[16px] overflow-hidden shrink-0 w-[200px] text-left cursor-pointer"
            >
              <div className="h-[210px] w-full relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/wedding-priya.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-[3px] px-[10px] pt-[10px] pb-[12px]">
                <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] tracking-[-0.1px] whitespace-nowrap">
                  Mei + Carlos
                </p>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">
                  Mar 2024 · 150 guests
                </p>
              </div>
            </motion.button>

            {/* Right padding spacer */}
            <div className="shrink-0 w-[24px]" />
          </div>
        </div>

        <Footer bg="#000000" />
      </div>
    </div>
    </SpaceChatLayout>
  )
}
