'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

interface ConciergeSheetProps {
  open: boolean
  onClose: () => void
}

const options = [
  {
    icon: '/assets/icon-diamond.svg',
    title: 'Chat with Allie',
    sub: 'Always on · instant answers',
    iconBg: '#585858',
  },
  {
    icon: '/assets/icon-whatsapp.svg',
    title: 'WhatsApp',
    sub: 'Message us anytime',
    iconBg: 'transparent',
  },
  {
    icon: '/assets/icon-phone.svg',
    title: `Contact ${PRODUCT.eventsConcierge}`,
    sub: PRODUCT.eventsConciergePhone,
    iconBg: 'transparent',
  },
  {
    icon: '/assets/icon-calendar-book.svg',
    title: 'Book a consultation',
    sub: 'Schedule a 30-min concierge call',
    iconBg: 'transparent',
  },
]

export default function ConciergeSheet({ open, onClose }: ConciergeSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[rgba(58,58,58,0.7)]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] bg-[#f5f5f5] rounded-t-[20px] overflow-hidden"
            style={{ maxHeight: '92dvh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-[#d0d0d0]" />
            </div>

            {/* Hero image */}
            <div className="relative h-44 w-full bg-[#FF69B4] overflow-hidden">
              <Image
                src="/assets/concierge-hero.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 px-6 py-9">
              {/* Header text */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-eyebrow text-[#767676]">EVENTS CONCIERGE</p>
                  <p className="font-serif font-normal text-[30px] leading-10 text-[#2b2b27]">
                    We&apos;re here for your retreat.
                  </p>
                </div>
                <p className="font-sans font-normal text-base leading-6 text-[#585858]">
                  From space questions to run-of-show changes — our team is with you before, during, and after your program.
                </p>
                <div className="bg-[#e8e8e8] rounded-[10px] flex items-center justify-center py-[7px] px-0.5">
                  <p className="font-sans font-normal text-sm leading-5 text-[#2b2b27] text-center whitespace-pre">
                    {'Agents available now  ·  Mon–Fri, 9am–8pm EST'}
                  </p>
                </div>
              </div>

              {/* Contact options */}
              <div className="flex flex-col gap-5">
                {options.map((opt) => (
                  <button
                    key={opt.title}
                    className="flex flex-col gap-1 w-full text-left"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-2 items-center flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: opt.iconBg !== 'transparent' ? opt.iconBg : 'none' }}
                        >
                          <Image
                            src={opt.icon}
                            alt=""
                            width={opt.iconBg !== 'transparent' ? 24 : 32}
                            height={opt.iconBg !== 'transparent' ? 24 : 32}
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="font-sans font-medium text-base leading-6 text-[#2b2b27]">
                            {opt.title}
                          </p>
                          <p className="font-sans font-light text-sm leading-5 text-[#969696]">
                            {opt.sub}
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <Image src="/assets/icon-arrow-chevron.svg" alt="" width={8} height={14} />
                      </div>
                    </div>
                    <div className="h-px bg-[#d0d0d0] w-full mt-1" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
