'use client'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

interface HeaderProps {
  onMenuToggle: () => void
  onConciergeToggle: () => void
  menuOpen?: boolean
  headerBg?: string
  /** @deprecated Use topBarBg — kept for existing call sites */
  weddingsBarBg?: string
  topBarBg?: string
  topBarLabel?: string
}

export default function Header({
  onMenuToggle,
  onConciergeToggle,
  menuOpen = false,
  headerBg = '#2b2b27',
  weddingsBarBg,
  topBarBg,
  topBarLabel = PRODUCT.topBarLabel,
}: HeaderProps) {
  const barBg = topBarBg ?? weddingsBarBg ?? '#d6bfa4'
  return (
    <div className="flex flex-col w-full shrink-0 relative z-40" style={{ background: headerBg }}>
      {/* Top context bar */}
      <div className="h-5 flex items-center justify-center" style={{ background: barBg }}>
        <p className="text-caption text-[#2b2b27]">{topBarLabel}</p>
      </div>

      {/* Nav Row */}
      <div className="flex items-center h-[60px] px-4 md:px-6 gap-[50px] md:gap-0 justify-center md:justify-between">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center shrink-0 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <Image src="/assets/icon-close.svg" alt="Close" width={20} height={20} />
          ) : (
            <Image src="/assets/icon-hamburger.svg" alt="Menu" width={24} height={14} />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center shrink-0">
          <Image
            src="/assets/logo-nobu-white.png"
            alt="Nobu Hotel Los Cabos"
            width={162}
            height={38}
            className="object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-[28px]">
          <Link href="/plan" className="font-sans text-[13px] text-white/60 hover:text-white transition-colors">
            Plan
          </Link>
          <Link href="/moodboard" className="font-sans text-[13px] text-white/60 hover:text-white transition-colors">
            Moodboard
          </Link>
          <Link href="/spaces" className="font-sans text-[13px] text-white/60 hover:text-white transition-colors">
            Spaces
          </Link>
          <div className="w-px h-[18px] bg-white/20 mx-[4px]" />
          <Link
            href="/sign-in"
            className="font-sans text-[13px] text-white/70 hover:text-white transition-colors border border-white/25 hover:border-white/50 rounded-full px-[16px] h-[32px] flex items-center"
          >
            Sign in
          </Link>
          <Link
            href="/chat"
            className="font-sans font-medium text-[13px] text-[#2b2b27] rounded-full px-[16px] h-[32px] flex items-center transition-opacity hover:opacity-80"
            style={{ background: '#b4b4b4' }}
          >
            Start planning
          </Link>
        </nav>

        {/* Concierge Bell — mobile only */}
        <button
          onClick={onConciergeToggle}
          className="w-10 h-10 flex items-center justify-center shrink-0 md:hidden"
          aria-label="Open concierge"
        >
          <Image src="/assets/icon-bell.svg" alt="Concierge" width={26} height={28} />
        </button>
      </div>
    </div>
  )
}
