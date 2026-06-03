'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { RetreatType } from '@/lib/nobu-retreats'
import { PLANNING_JOURNEY } from '@/lib/nobu-retreats'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import NobuRetreatHeader from '@/components/nobu/NobuRetreatHeader'
import NobuRetreatFooter from '@/components/nobu/NobuRetreatFooter'
import TickMark from '@/components/nobu/TickMark'

export default function RetreatDetailClient({ retreat }: { retreat: RetreatType }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()
  const heroImage = retreat.image ?? '/assets/promo-nobu-cabos.png'

  function startPlanning() {
    router.push('/chat')
  }

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh bg-white">
        <NobuRetreatHeader onMenuOpen={() => setMenuOpen(true)} onPlanClick={startPlanning} />

        <section className="relative w-full overflow-hidden text-white" style={{ minHeight: 420 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)' }}
          />
          <div className="relative flex flex-col gap-[12px] px-[24px] pt-[32px] pb-[40px] md:px-[60px]">
            <Link href="/nobu#retreat-types" className="font-sans text-[12px] text-white/70 hover:text-white">
              ← All retreat types
            </Link>
            <p className="font-sans text-[11px] tracking-[2.2px] uppercase" style={{ color: '#d6bfa4' }}>
              Corporate retreats
            </p>
            <h1 className="font-serif italic text-[36px] leading-[42px] md:text-[48px] md:leading-[54px]">{retreat.name}</h1>
            <p className="font-sans font-light text-[15px] leading-[24px] max-w-[560px]" style={{ color: '#e8e3da' }}>
              {retreat.tagline}
            </p>
            <p className="font-sans text-[13px]" style={{ color: '#bebeb9' }}>
              {retreat.groupSize} · {retreat.duration}
            </p>
          </div>
        </section>

        <section className="w-full px-[24px] py-[48px] md:px-[60px] md:py-[72px]">
          <p className="font-sans font-light text-[15px] leading-[26px]" style={{ color: '#525249' }}>
            {retreat.description}
          </p>
          <p className="mt-[16px] font-sans text-[13px] font-medium" style={{ color: '#8e7351' }}>
            Ideal for: {retreat.idealFor}
          </p>
        </section>

        <section className="w-full px-[24px] pb-[48px] md:px-[60px]" style={{ background: '#f5f1ea' }}>
          <div className="py-[48px] flex flex-col gap-[24px]">
            <h2 className="font-serif italic text-[28px] leading-[36px]" style={{ color: '#2b2b27' }}>
              What we deliver
            </h2>
            <ul className="flex flex-col gap-[12px]">
              {retreat.highlights.map((item) => (
                <li key={item} className="flex items-start gap-[10px]">
                  <span className="shrink-0 mt-[3px]">
                    <TickMark />
                  </span>
                  <span className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#525249' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full px-[24px] py-[48px] md:px-[60px]">
          <h2 className="font-serif italic text-[28px] leading-[36px] mb-[16px]" style={{ color: '#2b2b27' }}>
            Recommended spaces
          </h2>
          <div className="flex flex-wrap gap-[8px]">
            {retreat.spaces.map((space) => (
              <span
                key={space}
                className="rounded-full px-[14px] py-[8px] font-sans text-[12px]"
                style={{ background: '#f5f1ea', color: '#2b2b27', border: '1px solid #ebe3d4' }}
              >
                {space}
              </span>
            ))}
          </div>
        </section>

        <section className="w-full px-[24px] py-[48px] md:px-[60px]" style={{ background: '#18181a' }}>
          <h2 className="font-serif italic text-[28px] leading-[36px] text-white mb-[20px]">How Nobu & Allie help</h2>
          <ul className="flex flex-col gap-[16px]">
            {retreat.howWeHelp.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="font-sans font-light text-[14px] leading-[22px] pl-[16px] border-l-2"
                style={{ color: '#bebeb9', borderColor: '#d6bfa4' }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="w-full px-[24px] py-[56px] md:px-[60px] bg-white">
          <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase mb-[8px]" style={{ color: '#8e7351' }}>
            Your path to on-site
          </p>
          <h2 className="font-serif italic text-[28px] leading-[36px] mb-[32px]" style={{ color: '#2b2b27' }}>
            From brief to execution
          </h2>
          <div className="flex flex-col gap-[20px]">
            {PLANNING_JOURNEY.map((step) => (
              <div key={step.step} className="flex gap-[16px]">
                <span
                  className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center font-sans text-[11px] font-semibold"
                  style={{ background: '#f5f1ea', color: '#8e7351' }}
                >
                  {step.step}
                </span>
                <div>
                  <p className="font-sans font-medium text-[15px]" style={{ color: '#2b2b27' }}>
                    {step.title}
                  </p>
                  <p className="font-sans font-light text-[13px] leading-[20px] mt-[4px]" style={{ color: '#525249' }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="w-full text-white px-[24px] py-[56px] md:px-[60px] md:text-center"
          style={{ background: '#18181a' }}
        >
          <h2 className="font-serif italic text-[32px] leading-[40px] mb-[12px]">Ready to scope this retreat?</h2>
          <p
            className="font-sans font-light text-[14px] leading-[22px] mb-[24px] max-w-[560px] md:mx-auto"
            style={{ color: '#bebeb9' }}
          >
            Allie will draft a brief, match venues, and build a proposal you can share with leadership — usually in under a
            week.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startPlanning}
            className="h-[48px] rounded-full font-sans font-medium text-[14px] inline-flex items-center justify-center gap-[8px] px-[26px]"
            style={{ background: '#d6bfa4', color: '#18181a' }}
          >
            Plan this retreat with Allie
            <span aria-hidden>→</span>
          </motion.button>
        </section>

        <NobuRetreatFooter onPlanClick={startPlanning} onConciergeOpen={() => setConciergeOpen(true)} />
      </div>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignIn={() => router.push('/sign-in')}
        barLabel="MEETINGS & EVENTS"
      />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
