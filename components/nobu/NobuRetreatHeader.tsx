'use client'

import Image from 'next/image'
import Link from 'next/link'

interface NobuRetreatHeaderProps {
  onMenuOpen: () => void
  onPlanClick: () => void
}

export default function NobuRetreatHeader({ onMenuOpen, onPlanClick }: NobuRetreatHeaderProps) {
  return (
    <header className="flex w-full shrink-0 sticky top-0 z-40 bg-black h-[64px] items-center justify-between px-[20px] md:px-[40px]">
      <Link href="/nobu" className="flex items-center justify-center" aria-label="Nobu Hotel Los Cabos">
        <Image
          src="/assets/logo-nobu-white.png"
          alt="Nobu Hotel Los Cabos"
          width={150}
          height={36}
          className="object-contain"
          priority
        />
      </Link>
      <div className="flex items-center gap-[16px]">
        <button
          onClick={onPlanClick}
          className="hidden md:inline-flex h-[36px] items-center rounded-full px-[16px] font-sans text-[12px] tracking-[0.6px] uppercase text-white hover:text-[#d6bfa4] transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.35)' }}
        >
          Plan a retreat
        </button>
        <button
          onClick={onMenuOpen}
          className="flex items-center justify-center shrink-0 w-[36px] h-[36px]"
          aria-label="Open menu"
        >
          <Image src="/assets/icon-hamburger.svg" alt="" width={26} height={14} />
        </button>
      </div>
    </header>
  )
}
