'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="h-[20px]" />
      <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase" style={{ color: '#ca9151' }}>
        {label}
      </p>
      <div className="h-[6px]" />
      {children}
    </>
  )
}

export default function ContractPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

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

        {/* Thin divider */}
        <div className="h-px w-full shrink-0" style={{ background: '#dad6ce' }} />

        {/* Contract card */}
        <div className="px-[16px] pt-[20px] pb-[24px]">
          <div className="bg-white rounded-[8px] px-[24px] pt-[28px] pb-[32px] flex flex-col">

            {/* Title */}
            <p className="font-serif text-[28px] leading-[1.2] text-[#2b2b27]">
              Wedding Services Agreement
            </p>
            <div className="h-[8px]" />
            <p className="font-sans text-[11px] leading-[1.55] text-[#757569]">
              Effective May 13, 2026 · Issued by All-In Weddings · v1.0
            </p>

            <Section label="PARTIES">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                This Agreement is entered into between Aria (&ldquo;Couple&rdquo;), Nobu Hotel Los Cabos (&ldquo;Venue&rdquo;), and All-In Weddings, Inc. (&ldquo;Concierge&rdquo;), effective on the date signed below.
              </p>
            </Section>

            <Section label="WEDDING DATE">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                November 20–22, 2026. The Venue agrees to hold the date exclusively for Couple upon electronic execution of this Agreement.
              </p>
            </Section>

            <Section label="VENUE & SPACE">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                Nobu Hotel Los Cabos — Stone Garden. Includes ceremony &amp; reception spaces, on-site coordinator, 25-room guest block over 3 nights, and standard amenities outlined in Couple&apos;s saved package.
              </p>
            </Section>

            <Section label="ESTIMATED GUEST COUNT">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                130 guests at signing. Final count due 30 days prior to the wedding date.
              </p>
            </Section>

            <Section label="ALL-IN INVESTMENT">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                Estimated total: $105,208. Pricing is locked at signature for 24 months from execution. Includes venue, food &amp; beverage, vendor team commission, room-block administration, and Concierge planning services.
              </p>
            </Section>

            <Section label="PAYMENT SCHEDULE">
              <div className="flex flex-col">
                {[
                  '$500 — Refundable deposit (placed today)',
                  '$26,302 — 25% installment, due within 14 days of signature',
                  '$52,604 — 50% installment, due 90 days before the wedding date',
                  '$25,802 — Balance due 30 days before the wedding date',
                ].map((line) => (
                  <p key={line} className="font-sans text-[13px] leading-[1.8] text-[#2b2b27]">{line}</p>
                ))}
              </div>
            </Section>

            <Section label="TIER PERKS">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                Couple unlocked at deposit: Free dance floor upgrade · Free couples massage · 20% off your site-visit trip · 25% off all guest room blocks.
              </p>
            </Section>

            <Section label="CANCELLATION & RESCHEDULING">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                The deposit remains fully refundable until 90 days before the wedding date. Reschedules within ±60 days of the original date are honored at the same price; otherwise, market re-rates apply.
              </p>
            </Section>

            <Section label="FORCE MAJEURE">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                If a force-majeure event prevents the wedding, Concierge will reschedule at the nearest available equivalent date with no penalty and full credit transfer.
              </p>
            </Section>

            <Section label="GOVERNING TERMS">
              <p className="font-sans text-[13px] leading-[1.6] text-[#2b2b27]">
                This is a prototype Agreement for demonstration purposes only. By typing your name and checking the box below, you acknowledge that no legally binding agreement is formed in this prototype environment.
              </p>
            </Section>
          </div>
        </div>

        {/* Signed & sealed section */}
        <div
          className="flex flex-col gap-[16px] items-center px-[32px] py-[48px] shrink-0"
          style={{ background: '#585858' }}
        >
          {/* Checkmark circle */}
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          >
            <p className="text-white text-[22px] leading-none">✓</p>
          </div>

          <p className="font-serif italic text-[36px] leading-[1.1] text-white text-center">
            Signed &amp; sealed.
          </p>

          <p
            className="font-sans text-[14px] leading-[1.6] text-center"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            Aria signed the Wedding Services Agreement. Your date at Nobu Hotel Los Cabos is officially yours.
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/payment')}
            className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
          >
            Continue
          </motion.button>
        </div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
