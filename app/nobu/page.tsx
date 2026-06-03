'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import NobuRetreatHeader from '@/components/nobu/NobuRetreatHeader'
import NobuRetreatFooter from '@/components/nobu/NobuRetreatFooter'
import BenefitIcon from '@/components/nobu/BenefitIcon'
import TickMark from '@/components/nobu/TickMark'
import {
  RETREAT_TYPES,
  PLATFORM_BENEFITS,
  PLANNING_JOURNEY,
  ENGAGEMENT_TIERS,
  CORE_SERVICES,
} from '@/lib/nobu-retreats'

export default function NobuPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  function startPlanning() {
    router.push('/chat')
  }

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh bg-white">
        <NobuRetreatHeader onMenuOpen={() => setMenuOpen(true)} onPlanClick={startPlanning} />

        {/* Hero */}
        <section className="relative w-full overflow-hidden text-white" style={{ minHeight: 560 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/promo-nobu-cabos.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }}
          />
          <div className="relative flex flex-col gap-[16px] items-start px-[24px] pt-[80px] pb-[40px] md:px-[60px] md:pt-[140px] md:pb-[80px] max-w-[640px]">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-sans text-[11px] tracking-[2.2px] uppercase"
              style={{ color: '#d6bfa4' }}
            >
              Meetings · Retreats · Events
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-serif italic text-[42px] leading-[48px] md:text-[64px] md:leading-[68px] tracking-[-0.5px]"
            >
              Nobu Los Cabos
              <br />
              Corporate Retreats
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-sans font-light text-[15px] leading-[24px] md:text-[16px] md:leading-[26px]"
              style={{ color: '#e8e3da' }}
            >
              Host leadership offsites, all-hands, SKOs, and learning programs on the Pacific — with Nobu hospitality,
              flexible meeting spaces, and Allie guiding your team from brief to on-site execution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex flex-col sm:flex-row gap-[12px] w-full sm:w-auto pt-[8px]"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startPlanning}
                className="h-[48px] rounded-full font-sans font-medium text-[14px] tracking-[0.4px] inline-flex items-center justify-center gap-[8px] px-[24px]"
                style={{ background: '#d6bfa4', color: '#18181a' }}
              >
                Plan your retreat with Allie
                <span aria-hidden>→</span>
              </motion.button>
              <a
                href="#retreat-types"
                className="h-[48px] rounded-full font-sans font-medium text-[14px] tracking-[0.4px] inline-flex items-center justify-center px-[24px] text-white"
                style={{ border: '1px solid rgba(255,255,255,0.55)' }}
              >
                Explore retreat types
              </a>
            </motion.div>
          </div>
        </section>

        {/* How we help */}
        <section className="w-full bg-white px-[24px] py-[56px] md:px-[60px] md:py-[72px]">
          <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase mb-[8px]" style={{ color: '#8e7351' }}>
            How we help
          </p>
          <h2 className="font-serif italic text-[30px] leading-[38px] md:text-[40px] md:leading-[48px] mb-[16px]" style={{ color: '#2b2b27' }}>
            One property. Every format your company needs.
          </h2>
          <p className="font-sans font-light text-[15px] leading-[26px] max-w-[640px] mb-[32px]" style={{ color: '#525249' }}>
            Whether you are aligning executives, energizing the field, or running a multi-day academy, Nobu Los Cabos
            pairs oceanfront venues with a dedicated events team and Allie — your AI retreat planner — so logistics
            never slow down the work you came to do.
          </p>
          <ServicesGrid />
        </section>

        {/* Retreat types */}
        <section id="retreat-types" className="w-full px-[24px] py-[56px] md:px-[60px]" style={{ background: '#f5f1ea' }}>
          <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase mb-[8px]" style={{ color: '#8e7351' }}>
            Retreat types
          </p>
          <h2 className="font-serif italic text-[30px] leading-[38px] md:text-[40px] md:leading-[48px] mb-[12px]" style={{ color: '#2b2b27' }}>
            Built for how your team gathers
          </h2>
          <p className="font-sans font-light text-[14px] leading-[22px] mb-[32px] max-w-[600px]" style={{ color: '#525249' }}>
            Choose a format to see recommended spaces, typical agendas, and how Nobu supports your goals — each links to
            a detailed overview.
          </p>
          <div className="flex flex-col gap-[16px]">
            {RETREAT_TYPES.map((retreat, i) => (
              <motion.div
                key={retreat.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
                <Link
                  href={`/nobu/retreats/${retreat.slug}`}
                  className="flex flex-col overflow-hidden rounded-[12px] bg-white transition-shadow hover:shadow-md"
                  style={{ border: '1px solid #ebe3d4' }}
                >
                  {retreat.image && (
                    <div className="relative h-[140px] w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={retreat.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <p className="absolute bottom-[12px] left-[16px] font-serif text-[20px] text-white">{retreat.name}</p>
                    </div>
                  )}
                  <div className="p-[20px] flex flex-col gap-[8px]">
                    {!retreat.image && (
                      <p className="font-serif text-[20px] leading-[26px]" style={{ color: '#2b2b27' }}>
                        {retreat.name}
                      </p>
                    )}
                    <p className="font-sans text-[13px] font-medium" style={{ color: '#8e7351' }}>
                      {retreat.tagline}
                    </p>
                    <p className="font-sans font-light text-[13px] leading-[20px]" style={{ color: '#525249' }}>
                      {retreat.description}
                    </p>
                    <p className="font-sans text-[12px]" style={{ color: '#969696' }}>
                      {retreat.groupSize} · {retreat.duration}
                    </p>
                    <span className="font-sans font-medium text-[13px] mt-[4px]" style={{ color: '#2b2b27' }}>
                      Learn more →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meet Allie */}
        <section className="w-full" style={{ background: '#f5f1ea' }}>
          <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-[40px]">
            <div className="relative w-full md:w-[44%] overflow-hidden" style={{ minHeight: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/concierge-hero.png"
                alt="Allie, your AI retreat planner"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)' }}
              />
              <AllieBadge />
            </div>
            <AllieCopy onPlan={startPlanning} />
          </div>
        </section>

        {/* Planning suite */}
        <section className="w-full flex flex-col items-stretch py-[56px] px-[24px] md:py-[88px] md:px-[60px]" style={{ background: '#18181a' }}>
          <SuiteHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] mt-[40px]">
            {PLATFORM_BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="flex flex-col gap-[12px] p-[24px] rounded-[12px]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(214,191,164,0.12)', border: '1px solid rgba(214,191,164,0.25)' }}
                >
                  <BenefitIcon name={b.icon} />
                </div>
                <h3 className="font-serif text-[20px] leading-[26px] text-white">{b.title}</h3>
                <p className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#bebeb9' }}>
                  {b.body}
                </p>
              </motion.div>
            ))}
          </div>
          <SuiteCta onPlan={startPlanning} />
        </section>

        {/* Planning journey */}
        <section id="how-it-works" className="w-full bg-white py-[56px] px-[24px] md:py-[88px] md:px-[60px]">
          <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase mb-[8px]" style={{ color: '#8e7351' }}>
            Navigate your retreat
          </p>
          <h2 className="font-serif italic text-[30px] leading-[38px] md:text-[40px] md:leading-[48px] mb-[12px]" style={{ color: '#2b2b27' }}>
            From first brief to doors open
          </h2>
          <p className="font-sans font-light text-[14px] leading-[22px] mb-[40px] max-w-[600px]" style={{ color: '#525249' }}>
            Allie and the Nobu events team share one workspace — so finance, People Ops, and your EAs always see the same
            plan, budget, and run-of-show.
          </p>
          <div className="flex flex-col gap-[24px]">
            {PLANNING_JOURNEY.map((step) => (
              <div key={step.step} className="flex gap-[20px] items-start">
                <span
                  className="shrink-0 w-[44px] h-[44px] rounded-full flex items-center justify-center font-sans text-[12px] font-semibold"
                  style={{ background: '#f5f1ea', color: '#8e7351' }}
                >
                  {step.step}
                </span>
                <div>
                  <h3 className="font-sans font-medium text-[16px] mb-[6px]" style={{ color: '#2b2b27' }}>
                    {step.title}
                  </h3>
                  <p className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#525249' }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet & stay */}
        <section className="w-full bg-white">
          <div className="relative w-full overflow-hidden" style={{ height: 280 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/wedding-priya-rahul.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <MeetStayCopy />
        </section>

        {/* F&B */}
        <section className="w-full" style={{ background: '#f5f1ea' }}>
          <div className="flex flex-col md:flex-row gap-[0] md:gap-[40px] items-stretch">
            <div className="relative w-full md:w-1/2 overflow-hidden" style={{ minHeight: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/wedding-matt-carlos.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <FnbCopy onPlan={startPlanning} />
          </div>
        </section>

        {/* Engagement tiers */}
        <section id="packages" className="w-full bg-white py-[56px] px-[24px] md:py-[88px] md:px-[60px]">
          <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase mb-[8px]" style={{ color: '#8e7351' }}>
            Engagement scales
          </p>
          <h2 className="font-serif italic text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] mb-[12px]" style={{ color: '#2b2b27' }}>
            Three ways to host your group
          </h2>
          <p className="font-sans font-light text-[14px] leading-[22px] mb-[32px] max-w-[600px]" style={{ color: '#525249' }}>
            Allie recommends the right tier based on headcount, meeting complexity, and length of stay — adjust anytime
            before contract.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {ENGAGEMENT_TIERS.map((tier) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-[16px] p-[24px] rounded-[12px]"
                style={{ background: '#f5f1ea', border: '1px solid #ebe3d4' }}
              >
                <div className="flex flex-col gap-[4px]">
                  <p className="font-sans font-semibold text-[10px] tracking-[1.6px] uppercase" style={{ color: '#8e7351' }}>
                    {tier.label}
                  </p>
                  <p className="font-serif text-[18px] leading-[26px]" style={{ color: '#2b2b27' }}>
                    {tier.rooms}
                  </p>
                </div>
                <div className="h-px w-full" style={{ background: '#ebe3d4' }} />
                <ul className="flex flex-col gap-[10px]">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-[10px]">
                      <span className="shrink-0 mt-[3px]">
                        <TickMark />
                      </span>
                      <span className="font-sans font-light text-[13px] leading-[20px]" style={{ color: '#525249' }}>
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full text-white" style={{ background: '#18181a' }}>
          <div className="flex flex-col gap-[16px] items-start px-[24px] py-[56px] md:items-center md:text-center md:py-[80px] md:px-[40px]">
            <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase" style={{ color: '#d6bfa4' }}>
              Your retreat starts here
            </p>
            <h2 className="font-serif italic text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] max-w-[680px]">
              Scope your offsite in the next few minutes.
            </h2>
            <p className="font-sans font-light text-[14px] leading-[22px] max-w-[560px]" style={{ color: '#bebeb9' }}>
              Allie will capture your objectives, match venues, and draft a proposal your leadership team can review —
              before you ever hop on a call with the events team.
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={startPlanning}
              className="h-[48px] rounded-full font-sans font-medium text-[14px] tracking-[0.4px] inline-flex items-center justify-center gap-[8px] px-[26px] mt-[8px]"
              style={{ background: '#d6bfa4', color: '#18181a' }}
            >
              Plan your retreat with Allie
              <span aria-hidden>→</span>
            </motion.button>
          </div>
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

function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
      {CORE_SERVICES.map((service) => (
        <ServiceCard key={service.title} title={service.title} body={service.body} />
      ))}
    </div>
  )
}

function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-[20px] rounded-[12px]" style={{ background: '#f5f1ea', border: '1px solid #ebe3d4' }}>
      <p className="font-sans font-medium text-[14px] mb-[6px]" style={{ color: '#2b2b27' }}>
        {title}
      </p>
      <p className="font-sans font-light text-[13px] leading-[20px]" style={{ color: '#525249' }}>
        {body}
      </p>
    </div>
  )
}

function AllieBadge() {
  return (
    <div className="absolute left-[20px] bottom-[20px] flex items-center gap-[10px]">
      <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center" style={{ background: '#d6bfa4' }}>
        <Image src="/assets/icon-diamond.svg" alt="" width={16} height={16} />
      </div>
      <div>
        <p className="font-sans font-medium text-[13px] leading-[18px] text-white">Allie</p>
        <p className="font-sans text-[11px] leading-[14px]" style={{ color: '#e8e3da' }}>
          AI Retreat Planner
        </p>
      </div>
    </div>
  )
}

function AllieCopy({ onPlan }: { onPlan: () => void }) {
  return (
    <div className="flex flex-col items-start gap-[16px] px-[24px] py-[48px] md:px-[40px] md:py-[72px] md:w-[56%]">
      <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase" style={{ color: '#8e7351' }}>
        Meet Allie
      </p>
      <h2 className="font-serif italic text-[30px] leading-[38px] md:text-[40px] md:leading-[48px]" style={{ color: '#2b2b27' }}>
        Your AI corporate retreat planner.
      </h2>
      <p className="font-sans font-light text-[15px] leading-[24px] md:text-[16px] md:leading-[26px]" style={{ color: '#525249' }}>
        Allie works with Nobu&apos;s on-site events team, your internal planners, and travel partners — so room blocks,
        AV specs, and F&B minimums stay aligned. She knows the property, remembers your company preferences, and keeps
        every stakeholder on the same run-of-show.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] w-full mt-[8px]">
        {[
          {
            eyebrow: 'On-property',
            title: 'Nobu Events Team',
            body: 'Receives your brief ready-to-execute — venues, catering, and ops already scoped.',
          },
          {
            eyebrow: 'Your org',
            title: 'EAs & People Ops',
            body: 'One dashboard for approvals, attendee lists, and travel policy compliance.',
          },
          {
            eyebrow: 'For leaders',
            title: 'Clear decisions faster',
            body: 'Proposals and budgets leadership can sign off on without back-and-forth email chains.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-[6px] rounded-[10px] p-[16px] bg-white"
            style={{ border: '1px solid rgba(43,43,39,0.06)' }}
          >
            <p className="font-sans font-semibold text-[10px] tracking-[1.8px] uppercase" style={{ color: '#8e7351' }}>
              {card.eyebrow}
            </p>
            <p className="font-sans font-medium text-[13px] leading-[18px]" style={{ color: '#2b2b27' }}>
              {card.title}
            </p>
            <p className="font-sans font-light text-[12px] leading-[18px]" style={{ color: '#525249' }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPlan}
        className="h-[44px] rounded-full font-sans font-medium text-[14px] inline-flex items-center justify-center gap-[8px] px-[22px] mt-[8px]"
        style={{ background: '#18181a', color: 'white' }}
      >
        Meet Allie
        <span aria-hidden>→</span>
      </motion.button>
    </div>
  )
}

function SuiteHeader() {
  return (
    <div className="flex flex-col gap-[12px] items-start max-w-[760px]">
      <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase" style={{ color: '#d6bfa4' }}>
        Powered by Allie · AI Retreat Planner
      </p>
      <h2 className="font-serif italic text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] text-white">
        All-in-one planning suite
        <br />
        for your corporate retreat at Nobu.
      </h2>
      <p className="font-sans font-light text-[15px] leading-[24px] md:text-[16px] md:leading-[26px] max-w-[640px]" style={{ color: '#bebeb9' }}>
        Everything your event lead, EAs, and on-property team need — one login. From briefing to vendor contracts to the
        day-of run-of-show. No spreadsheets. No lost threads. Just a clear path from idea to on-site.
      </p>
    </div>
  )
}

function SuiteCta({ onPlan }: { onPlan: () => void }) {
  return (
    <div
      className="flex flex-col md:flex-row items-start md:items-center gap-[16px] mt-[40px] pt-[32px]"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex-1">
        <p className="font-serif italic text-[20px] leading-[28px] text-white">Ready when your dates are.</p>
        <p className="font-sans font-light text-[13px] leading-[20px]" style={{ color: '#969696' }}>
          Share your brief with Allie — most teams get a first proposal within a week.
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPlan}
        className="h-[48px] rounded-full font-sans font-medium text-[14px] tracking-[0.4px] inline-flex items-center justify-center gap-[8px] px-[24px] w-full md:w-auto"
        style={{ background: '#d6bfa4', color: '#18181a' }}
      >
        Plan your retreat with Allie
        <span aria-hidden>→</span>
      </motion.button>
    </div>
  )
}

function MeetStayCopy() {
  return (
    <div className="flex flex-col gap-[12px] items-start px-[24px] py-[48px] md:px-[60px] md:py-[72px] max-w-[640px]">
      <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase" style={{ color: '#8e7351' }}>
        The resort
      </p>
      <h2 className="font-serif italic text-[28px] leading-[36px] md:text-[36px] md:leading-[44px]" style={{ color: '#2b2b27' }}>
        Meet here.
        <br />
        Stay here.
      </h2>
      <p className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#525249' }}>
        Over 200 rooms, suites, and residences — most with ocean views — give your attendees a private base between
        sessions. Cabo&apos;s energy is steps away when you want it; the property is calm when you need focus.
      </p>
    </div>
  )
}

function FnbCopy({ onPlan }: { onPlan: () => void }) {
  return (
    <div className="flex flex-col gap-[12px] items-start px-[24px] py-[48px] md:px-[40px] md:py-[72px] md:w-1/2 max-w-[560px]">
      <p className="font-sans font-semibold text-[11px] tracking-[2.2px] uppercase" style={{ color: '#8e7351' }}>
        Culinary
      </p>
      <h2 className="font-serif italic text-[28px] leading-[36px] md:text-[36px] md:leading-[44px]" style={{ color: '#2b2b27' }}>
        Nobu F&B for groups
      </h2>
      <p className="font-sans font-light text-[14px] leading-[22px]" style={{ color: '#525249' }}>
        From working breakfasts to awards dinners, Nobu Los Cabos builds menus for your group size, dietary needs, and
        program rhythm — locally sourced, signature Nobu, designed around your agenda.
      </p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPlan}
        className="h-[44px] rounded-full font-sans font-medium text-[14px] inline-flex items-center justify-center px-[22px] mt-[8px]"
        style={{ background: '#18181a', color: 'white' }}
      >
        Request F&B scope
      </motion.button>
    </div>
  )
}
