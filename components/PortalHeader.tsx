'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

const IMG_NOBU_LOGO = "https://www.figma.com/api/mcp/asset/2afa74ea-13bd-431a-bc8c-45a00fc85d03"
const IMG_HAMBURGER = "https://www.figma.com/api/mcp/asset/5e8818ba-c68a-4e87-b291-dbac47687cc4"
const IMG_BELL      = "https://www.figma.com/api/mcp/asset/2939047e-0d09-4e2b-9220-dbf4e1e30a6d"

export default function PortalHeader() {
  const [menuOpen, setMenuOpen]           = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [headerHidden, setHeaderHidden]   = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onScroll() { setHeaderHidden(window.scrollY > 60) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.div
        animate={{ height: headerHidden ? 0 : 'auto', opacity: headerHidden ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="overflow-hidden shrink-0 w-full relative z-40 flex flex-col"
        style={{ background: '#2b2b27' }}
      >
        {/* Top context bar */}
        <div className="flex items-center justify-center h-[20px]" style={{ background: '#b4b4b4' }}>
          <p className="font-sans text-[10px] tracking-[2px] uppercase" style={{ color: '#2b2b27' }}>{PRODUCT.topBarLabel}</p>
        </div>
        {/* Main nav bar */}
        <div className="flex items-center justify-center gap-[50px] h-[60px] px-[16px]">
          <button
            onClick={() => setMenuOpen(true)}
            className="shrink-0 w-[40px] h-[40px] flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_HAMBURGER} alt="Menu" className="w-[29px] h-[29px] object-contain" />
          </button>
          <Link href="/post-booking" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_NOBU_LOGO} alt="Nobu Hotel Los Cabos" width={162} height={38} className="object-contain" />
          </Link>
          <button
            onClick={() => setConciergeOpen(true)}
            className="shrink-0 w-[40px] h-[40px] flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_BELL} alt="Concierge" className="w-[32px] h-[32px] object-contain" />
          </button>
        </div>
      </motion.div>

      {/* Overlays — fixed z-50, always cover full viewport */}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </>
  )
}
