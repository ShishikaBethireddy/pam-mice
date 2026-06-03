'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
  onSignIn: () => void
  barLabel?: string
}

const menuItems = [
  { label: 'Retreat types', href: '/nobu#retreat-types' },
  { label: 'Spaces', href: '/spaces' },
  { label: 'Plan with Allie', href: '/chat' },
]

export default function MenuOverlay({ open, onClose, onSignIn, barLabel = PRODUCT.topBarLabel }: MenuOverlayProps) {
  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-center bg-[#f5f5f5]"
        >
          <div className="mobile-frame flex flex-col h-full">
            {/* Header row */}
            <div className="bg-[#2b2b27] flex flex-col shrink-0">
              <div className="bg-[#b4b4b4] h-5 flex items-center justify-center">
                <p className="text-caption text-[#2b2b27]">{barLabel}</p>
              </div>
              <div className="flex items-center justify-between px-4 h-[60px]">
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
                  <Image src="/assets/icon-close.svg" alt="Close" width={18} height={18} />
                </button>
                <div className="flex items-center justify-center">
                  <Image
                    src="/assets/logo-nobu-white.png"
                    alt="Nobu Hotel Los Cabos"
                    width={162}
                    height={38}
                    className="object-contain"
                  />
                </div>
                <button className="w-10 h-10 flex items-center justify-center">
                  <Image src="/assets/icon-bell.svg" alt="Concierge" width={26} height={28} />
                </button>
              </div>
            </div>

            {/* Menu body */}
            <div className="flex flex-col flex-1 justify-between py-9 overflow-y-auto px-6">
              <div className="flex flex-col">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex flex-col gap-1 py-1"
                  >
                    <span className="font-sans font-semibold text-2xl leading-8 text-[#2b2b27]">
                      {item.label}
                    </span>
                    <div className="h-px bg-[#d0d0d0] w-full" />
                  </Link>
                ))}
                <button
                  onClick={() => { onClose(); onSignIn() }}
                  className="flex flex-col gap-1 py-1 text-left"
                >
                  <span className="font-sans font-semibold text-2xl leading-8 text-[#585858]">
                    Sign in
                  </span>
                  <div className="h-px bg-[#d0d0d0] w-full" />
                </button>
              </div>

              {/* CTA */}
              <div>
                <Link
                  href="/chat"
                  onClick={onClose}
                  className="flex items-center justify-center h-11 rounded-full bg-black w-full"
                >
                  <span className="font-sans font-medium text-base leading-6 text-white">
                    Plan my retreat
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
