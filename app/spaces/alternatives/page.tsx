'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import SpaceChatLayout, { ChatMsg } from '@/components/SpaceChatLayout'

// ── Image assets (sourced from Figma node 316:2 "Alternative Handling") ──
const IMG_UNICO = '/assets/unico-terrace.png'
const IMG_AVA   = '/assets/ava-resort.png'

export default function AlternativesPage() {
  const router = useRouter()

  const thread: ChatMsg[] = [
    { author: 'user', text: <>Show me other properties for our date.</> },
    {
      author: 'allie',
      lines: [
        <span key="0" className="font-medium text-[#2b2b27]">If Nobu doesn&apos;t work, here are sister properties I trust.</span>,
        <>Both are in our portfolio with the same Wedding Concierge, room-block negotiation, and Allie support — so nothing about your plan resets.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <span key="u" className="font-medium text-[#2b2b27]">Unico Terrace · Riviera Maya</span>,
        <>Adults-only, all-inclusive. Coastal cliff ceremony with a vibe more &ldquo;celebration weekend&rdquo; than &ldquo;quiet luxury.&rdquo; Great if your guest list wants the resort to be the entertainment.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <span key="a" className="font-medium text-[#2b2b27]">AVA Resort · Cancún</span>,
        <>Newer, modern, family-friendly. Lots of ceremony spaces (beach, garden, ballroom) — best if you have a mixed-age guest list and want flex around the weekend programming.</>,
      ],
    },
    {
      author: 'allie',
      lines: [
        <>If you&apos;d rather wait it out, I can also set a <span className="font-medium text-[#2b2b27]">cancellation alert</span> for Shiawase Terrace — I&apos;ll ping you the second your weekend opens.</>,
      ],
    },
  ]

  return (
    <SpaceChatLayout
      thread={thread}
      inputPlaceholder="Ask Allie about other properties…"
      activeStep={3}
      railEyebrow="Alternatives"
      railTitle="Sister properties."
    >
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col bg-[#f5f5f5]">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-[6px] p-[16px] shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#767676" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-sans text-[11px] leading-[14px] text-[#767676]">Back</span>
        </button>

        {/* ── Card 01 — Unico Terrace ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="flex flex-col w-full bg-[#f5f5f5] overflow-hidden"
        >
          {/* Number marker */}
          <div className="px-[16px] pt-[12px]">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#ca9151' }}>01</p>
          </div>
          {/* Body — text left, image right */}
          <div className="flex gap-[12px] items-start pl-[16px] pr-0 py-[16px]">
            {/* Text column */}
            <div className="flex flex-col gap-[16px] shrink-0 w-[134px]">
              <div className="flex flex-col gap-[3px]">
                <p className="font-display font-normal text-[26px] leading-[27px] text-black tracking-[-0.7px]">
                  Unico Terrace
                </p>
                <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-[#585858]">
                  close property<br />different space
                </p>
                <div className="py-[8px]">
                  <div className="h-px w-[18px]" style={{ background: '#767676' }} />
                </div>
                <div className="flex flex-col gap-[4px] font-sans text-[12px] leading-normal text-black">
                  <p>Pacific views</p>
                  <p>500 ceremony</p>
                </div>
              </div>
              {/* Price */}
              <div className="flex flex-col gap-[2px]">
                <p className="font-sans text-[10px] leading-[16px] text-[#585858]">All-in estimate</p>
                <p className="font-display font-normal text-[20px] leading-[21px] text-black tracking-[-0.4px]">~$115K</p>
              </div>
              {/* CTA */}
              <button className="flex items-center gap-[6px] py-[8px]">
                <span className="font-sans font-medium text-[14px] leading-[20px] text-[#767676]">Explore Unico</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#767676" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 h-[259px] overflow-hidden relative min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_UNICO} alt="Unico Terrace" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        {/* ── Card 02 — AVA Resort ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-col w-full bg-[#f5f5f5] overflow-hidden"
        >
          {/* Number marker — right-aligned */}
          <div className="px-[16px] pt-[12px] flex justify-end">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#ca9151' }}>02</p>
          </div>
          {/* Body — image left, text right */}
          <div className="flex gap-[12px] items-start pl-0 pr-[16px] pt-[10px] pb-0">
            {/* Image */}
            <div className="flex-1 h-[250px] overflow-hidden relative min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_AVA} alt="AVA Resort" className="absolute inset-0 w-full h-full object-cover" />
              {/* Availability badge */}
              <div
                className="absolute top-[9px] left-[9px] px-[10px] py-[4px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.93)' }}
              >
                <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-black whitespace-nowrap">
                  Fully available
                </p>
              </div>
              <p className="absolute font-display italic text-[12px] leading-[16px] text-white/90"
                style={{ bottom: 90, right: 12 }}>
                AVA Resort
              </p>
            </div>

            {/* Text column */}
            <div className="flex flex-col gap-[16px] items-end shrink-0 w-[134px] pb-[16px]">
              <div className="flex flex-col items-start w-full">
                <p className="font-display font-normal text-[26px] leading-[27px] text-black text-right tracking-[-0.7px] w-full">
                  AVA Resort<span style={{ color: '#ca9151' }}>.</span>
                </p>
                <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[0.8px] uppercase text-[#585858] text-right w-full">
                  Similar vibe nearby
                </p>
                <div className="py-[8px] flex justify-end w-full">
                  <div className="h-px w-[18px] opacity-40" style={{ background: '#ca9151' }} />
                </div>
                <div className="flex flex-col gap-[4px] font-sans text-[12px] leading-normal text-black text-right w-full">
                  <p>4hr from Cabo</p>
                  <p>Beachfront</p>
                  <p>Cancún</p>
                  <p>Dates fully open</p>
                </div>
              </div>
              {/* Price */}
              <div className="flex flex-col gap-[2px] items-start w-full">
                <p className="font-sans text-[10px] leading-[16px] text-[#585858]">All-in estimate</p>
                <p className="font-display font-normal text-[20px] leading-[21px] text-black tracking-[-0.4px]">~$104K</p>
              </div>
              {/* CTA */}
              <button className="flex items-center gap-[6px] py-[8px]">
                <span className="font-sans font-medium text-[14px] leading-[20px] text-[#767676]">Explore Ava</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#767676" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Notify section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col py-[36px]"
          style={{ background: '#e8e8e8' }}
        >
          <div className="flex flex-col gap-[4px] px-[24px]" style={{ color: '#585858' }}>
            <p className="font-serif italic text-[20px] leading-[28px]">
              Get notified if Shiawase opens up
            </p>
            <p className="font-sans text-sm leading-5">
              We&apos;ll alert you if a cancellation matches your dates.{' '}
              <span className="underline cursor-pointer">Notify me</span>
            </p>
          </div>
          <div className="pt-[16px] px-[16px]">
            <div className="bg-white border border-[#d0d0d0] rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-2 px-1 py-[3px] w-full">
              <div className="flex-1 px-[8px] py-[8px]">
                <p className="font-sans text-sm text-[#969696]">Ask Allie about other options…</p>
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
    </SpaceChatLayout>
  )
}
