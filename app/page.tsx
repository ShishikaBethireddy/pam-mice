'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PRODUCT } from '@/lib/product'

const ENTRY_OPTIONS = [
  {
    href: '/nobu',
    eyebrow: 'Travel agent',
    title: 'Travel agent entry point',
    description:
      'Book a corporate retreat, offsite, SKO, or meeting at Nobu Los Cabos on behalf of your client. Explore spaces, build the program, and plan with Allie.',
    cta: 'Continue as travel agent',
    featured: true,
  },
  {
    href: '/travel-agent',
    eyebrow: 'Partner booking',
    title: 'Hotel management',
    description:
      'Nobu on-property and PAM teams — manage Cvent RFPs, score incoming requests, track proposal history, and finalize back to agents. Desktop workspace.',
    cta: 'Open hotel workspace',
    featured: false,
  },
] as const

export default function EntryPage() {
  return (
    <div className="min-h-screen bg-[#ececea]">
      <header className="border-b border-[#d0d0d0] bg-black">
        <div className="flex h-6 items-center justify-center" style={{ background: '#d6bfa4' }}>
          <p className="font-sans text-[10px] uppercase tracking-[1.5px] text-[#2b2b27]">{PRODUCT.topBarLabel}</p>
        </div>
        <div className="flex h-[72px] items-center justify-center px-8">
          <Image src="/assets/logo-nobu-white.png" alt="Nobu Hotel Los Cabos" width={160} height={38} priority />
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-8 py-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[2.2px] text-[#8e7351]"
        >
          Nobu Los Cabos
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-3 font-serif text-[42px] italic leading-[48px] tracking-[-0.5px] text-[#2b2b27]"
        >
          How are you booking?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 max-w-[640px] font-sans text-[16px] font-light leading-[26px] text-[#525249]"
        >
          Travel agents book client programs on one path; hotel management uses a desktop Cvent workspace on the other.
        </motion.p>

        <div className="grid grid-cols-2 gap-5">
          {ENTRY_OPTIONS.map((option, i) => (
            <motion.div
              key={option.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + i * 0.06 }}
            >
              <Link
                href={option.href}
                className="flex h-full flex-col gap-3 rounded-[12px] p-6 transition-shadow hover:shadow-md"
                style={{
                  background: option.featured ? '#18181a' : '#f5f1ea',
                  border: option.featured ? 'none' : '1px solid #ebe3d4',
                }}
              >
                <p
                  className="font-sans text-[10px] font-semibold uppercase tracking-[1.8px]"
                  style={{ color: option.featured ? '#d6bfa4' : '#8e7351' }}
                >
                  {option.eyebrow}
                </p>
                <p className="font-serif text-[24px] leading-[30px]" style={{ color: option.featured ? '#ffffff' : '#2b2b27' }}>
                  {option.title}
                </p>
                <p className="font-sans text-[14px] font-light leading-[22px] flex-1" style={{ color: option.featured ? '#bebeb9' : '#525249' }}>
                  {option.description}
                </p>
                <span className="inline-flex items-center gap-2 font-sans text-[14px] font-medium" style={{ color: option.featured ? '#d6bfa4' : '#2b2b27' }}>
                  {option.cta} →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="px-8 py-8 text-center">
        <p className="font-sans text-[11px] text-[#969696]">Prototype · for design review only</p>
      </footer>
    </div>
  )
}
