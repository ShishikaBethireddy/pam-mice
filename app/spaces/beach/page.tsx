'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SpaceChatLayout, { ChatMsg } from '@/components/SpaceChatLayout'

export default function BeachPage() {
  const router = useRouter()

  const thread: ChatMsg[] = [
    { author: 'user', text: <>Tell me about the Beach.</> },
    {
      author: 'allie',
      lines: [
        <span key="0" className="font-medium text-[#2b2b27]">The sleeper hit.</span>,
        <>Beachfront, intimate, evening-only. No roof, no walls — just sand, ocean, and the sky doing what it does at golden hour. Best for guest lists that are happy to be barefoot.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <span key="t" className="font-medium text-[#2b2b27]">Allie&apos;s pro tip — the light</span>,
        <>Start the ceremony at <span className="font-medium text-[#2b2b27]">5:00pm</span> in winter, <span className="font-medium text-[#2b2b27]">6:00pm</span> in summer. You want vows ending exactly as the sun touches the horizon — that&apos;s your kiss shot.</>,
        <>Set up the reception further back from the shoreline. Pacific tide rises fast in the evening and seating any closer than 40ft is a problem.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <>Packages start at <span className="font-medium text-[#2b2b27]">$5,000</span>. Tap <span className="font-medium text-[#2b2b27]">Select</span> on the right to lock it in, or browse couples who chose Beach to see how they styled it.</>,
      ],
    },
  ]

  return (
    <SpaceChatLayout
      thread={thread}
      inputPlaceholder="Ask Allie about the Beach…"
      activeStep={3}
      railEyebrow="Venue dossier"
      railTitle="Beach"
    >
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col bg-[#f5f5f5]">

        {/* ── Hero ── */}
        <div className="relative w-full overflow-hidden flex flex-col justify-between" style={{ minHeight: 314 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/venue-beach.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
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
            <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3V13M10 3L6.5 6.5M10 3L13.5 6.5M4 14V16C4 16.55 4.45 17 5 17H15C15.55 17 16 16.55 16 16V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div style={{ height: 72 }} />
        </div>

        {/* ── Black info panel ── */}
        <div className="bg-black flex flex-col gap-[6px] pb-[22px] pt-[18px] px-[20px]">
          <p className="font-sans font-normal text-[9px] tracking-[1.2px] uppercase text-white">Intimate · Beachfront · Evening</p>
          <p className="font-serif text-[36px] leading-[40px] text-white">Beach</p>
          <div className="flex flex-wrap gap-[6px] py-[16px]">
            {[
              { label: 'Private beachfront', color: '#2b2b27' },
              { label: 'Intimate · 80 cap',  color: '#b67d3d' },
              { label: 'Sunset-facing',       color: '#2b2b27' },
            ].map((tag) => (
              <span key={tag.label} className="font-sans font-normal text-[11px] leading-[16px] px-[12px] py-[5px] rounded-full" style={{ background: '#b4b4b4', color: tag.color }}>
                {tag.label}
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => { sessionStorage.setItem('selectedVenue', 'Beach'); router.push('/packages') }}
              className="h-[44px] px-[24px] rounded-full font-sans font-medium text-base text-[#2b2b27]"
              style={{ background: '#f5f5f5' }}
            >
              Select
            </button>
          </div>
        </div>

        {/* ── Trust signal ── */}
        <div className="flex items-center gap-[10px] justify-center p-[24px]" style={{ background: '#e8e8e8' }}>
          <div className="flex items-center shrink-0">
            {['/assets/avatar-bride-1.png','/assets/avatar-bride-2.png','/assets/avatar-bride-3.png','/assets/avatar-bride-4.png'].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" width={36} height={36} className="rounded-full border-2 border-white object-cover" style={{ marginRight: i < 3 ? -6 : 0, position: 'relative', zIndex: 4 - i }} />
            ))}
          </div>
          <p className="font-sans text-[12px] leading-[18px] text-[#585858]" style={{ width: 214 }}>
            <span className="font-medium">19</span>{' brides saved this venue in the last 30 days'}
          </p>
        </div>

        {/* ── Body copy ── */}
        <div className="px-[24px] pt-[36px]">
          <p className="font-sans font-normal text-base leading-6 text-[#585858]" style={{ maxWidth: 330 }}>
            The Beach venue is Nobu&apos;s most intimate outdoor space — private, beachfront, and set directly against the Pacific. With capacity for up to 80 guests, it&apos;s the kind of ceremony that nobody wants to end.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="flex flex-col gap-[14px] px-[24px] py-[36px]">
          <div className="h-px w-full bg-[#d0d0d0]" />
          <div className="flex items-start gap-[12px] pb-[24px]">
            <div className="flex-1 flex flex-col items-center gap-[4px]">
              <p className="font-serif text-[24px] leading-[36px] text-[#2b2b27] whitespace-nowrap">80</p>
              <div className="text-center">
                <p className="font-sans font-light text-sm leading-5 text-[#969696]">RECEPTION</p>
                <p className="font-sans font-light text-sm leading-5 text-[#969696]">CAPACITY</p>
              </div>
            </div>
            <div className="w-px self-stretch bg-[#d0d0d0]" />
            <div className="flex-1 flex flex-col items-center gap-[4px]">
              <p className="font-serif text-[24px] leading-[36px] text-[#2b2b27] whitespace-nowrap">$3,500</p>
              <div className="text-center">
                <p className="font-sans font-light text-sm leading-5 text-[#969696]">PACKAGES</p>
                <p className="font-sans font-light text-sm leading-5 text-[#969696]">START AT</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Allie's Venue Dossier ── */}
        <div className="flex flex-col gap-[14px] p-[24px]" style={{ background: '#585858' }}>
          <div className="flex items-center gap-[6px]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-[0px_0.6px_0.6px_rgba(0,0,0,0.05)]" style={{ background: 'white' }}>
              <div className="relative" style={{ width: 16, height: 13 }}>
                <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" style={{ filter: 'invert(1)' }} />
              </div>
            </div>
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">Allie&apos;s Venue Dossier</p>
          </div>
          <p className="font-sans font-normal text-base leading-6 text-white">
            Book the Beach for a ceremony that starts 20 minutes before sunset. The tide is low in April evenings — your guests can stand on the sand. No heels warning in the invitation saves you 10 awkward questions. The sound of the Pacific carries. Keep vows under 3 minutes and let the ocean do the rest.
          </p>
        </div>

        {/* ── Wedding Edit  ── */}
        <div className="flex flex-col gap-[14px] py-[36px]">
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
          <div className="flex gap-[16px] pl-[24px] overflow-x-auto scroll-x">
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
                  <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] whitespace-nowrap">Priya + Rahul</p>
                  <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">Oct 2024 · 420 guests</p>
                </div>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">&ldquo;We told the chatbot &lsquo;mystic boho cathedral&rsquo; and it spit back our exact wedding. We cried. We booked.&rdquo;</p>
              </div>
            </motion.button>
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
                <img src="/assets/wedding-sofia-james.png" alt="" className="absolute h-full object-cover" style={{ left: '-18.61%', width: '175%', top: 0 }} />
              </div>
              <div className="flex flex-col gap-[12px] p-[12px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] whitespace-nowrap">Sofia + James</p>
                  <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">Jun 2024 · 280 guests</p>
                </div>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">&ldquo;We wanted quiet. Not boring — quiet. Nobu was the only place that understood the difference.&rdquo;</p>
              </div>
            </motion.button>
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
                <p className="font-display font-normal text-[14px] leading-[18px] text-[#2b2b27] whitespace-nowrap">Mei + Carlos</p>
                <p className="font-sans font-normal text-[10px] leading-[14px] text-[#969696] tracking-[0.3px]">Mar 2024 · 150 guests</p>
              </div>
            </motion.button>
            <div className="shrink-0 w-[24px]" />
          </div>
        </div>

        <Footer bg="#000000" />
      </div>

    </div>
    </SpaceChatLayout>
  )
}
