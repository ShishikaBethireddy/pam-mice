'use client'

import Image from 'next/image'
import Link from 'next/link'

interface NobuRetreatFooterProps {
  onPlanClick: () => void
  onConciergeOpen: () => void
}

export default function NobuRetreatFooter({ onPlanClick, onConciergeOpen }: NobuRetreatFooterProps) {
  return (
    <footer className="w-full" style={{ background: '#0e0e10', color: '#969696' }}>
      <div className="flex flex-col md:flex-row gap-[24px] md:gap-[48px] px-[24px] py-[40px] md:px-[60px]">
        <div className="flex flex-col gap-[10px] flex-1">
          <Image
            src="/assets/logo-nobu-white.png"
            alt="Nobu Hotel Los Cabos"
            width={150}
            height={36}
            className="object-contain mb-[4px]"
          />
          <p className="font-sans text-[12px] leading-[18px]">
            Nobu Hotel Los Cabos
            <br />
            Carretera Transpeninsular Km 5.5, Cabo San Lucas, B.C.S.
          </p>
        </div>
        <FooterNav onPlanClick={onPlanClick} onConciergeOpen={onConciergeOpen} />
      </div>
      <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[6px] px-[24px] py-[20px] md:px-[60px]">
        <p className="font-sans text-[11px]">© 2026 Nobu Hospitality. Prototype · for design review only.</p>
        <p className="font-sans text-[11px]">Built with Allie · AI Retreat Planner</p>
      </div>
    </footer>
  )
}

function FooterNav({ onPlanClick, onConciergeOpen }: { onPlanClick: () => void; onConciergeOpen: () => void }) {
  return (
    <div className="flex gap-[32px] md:gap-[48px]">
      <div className="flex flex-col gap-[6px]">
        <p className="font-sans font-semibold text-[11px] tracking-[1.6px] uppercase text-white mb-[2px]">Plan</p>
        <button onClick={onPlanClick} className="text-left font-sans text-[12px] hover:text-white transition-colors">
          Start with Allie
        </button>
        <Link href="/nobu#retreat-types" className="font-sans text-[12px] hover:text-white transition-colors">
          Retreat types
        </Link>
        <button onClick={onConciergeOpen} className="text-left font-sans text-[12px] hover:text-white transition-colors">
          Events team
        </button>
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="font-sans font-semibold text-[11px] tracking-[1.6px] uppercase text-white mb-[2px]">Visit</p>
        <Link href="/sign-in" className="font-sans text-[12px] hover:text-white transition-colors">
          Planner sign-in
        </Link>
        <a
          href="https://www.nobuhotels.com/los-cabos/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[12px] hover:text-white transition-colors"
        >
          nobuhotels.com
        </a>
      </div>
    </div>
  )
}
