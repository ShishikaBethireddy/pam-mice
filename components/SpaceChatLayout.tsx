'use client'
import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'
import WeddingNotebook from '@/components/WeddingNotebook'

// ── Types ────────────────────────────────────────────────────────
export type ChatMsg =
  | { author: 'allie'; lines: ReactNode[] }
  | { author: 'user'; text: ReactNode }

interface Props {
  /** Conversation thread displayed in the left rail (desktop only). */
  thread: ChatMsg[]
  /** Placeholder text in the input bar at the bottom of the rail. */
  inputPlaceholder?: string
  /** Active wedding-notebook step (defaults to 3 = Spaces). */
  activeStep?: number
  /** Eyebrow label rendered above the thread in the rail. */
  railEyebrow?: string
  /** Title rendered above the thread in the rail. */
  railTitle?: string
  /** Canvas content — the existing page UI. */
  children: ReactNode
}

// ── Allie avatar ─────────────────────────────────────────────────
function AllieAvatar() {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      style={{ background: '#585858' }}
    >
      <div className="relative" style={{ width: 27, height: 22 }}>
        <Image src="/assets/icon-diamond.svg" alt="" fill className="object-contain" />
      </div>
    </div>
  )
}

// ── Bubbles ──────────────────────────────────────────────────────
function AllieBubble({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut', delay }}
      className="bg-[#e8e8e8] rounded-tr-xl rounded-br-xl rounded-bl-xl px-6 py-5 flex flex-col gap-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      style={{ maxWidth: 320 }}
    >
      {children}
    </motion.div>
  )
}

function UserBubble({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay }}
      className="flex justify-end"
    >
      <div className="bg-black rounded-tl-xl rounded-tr-xl rounded-bl-xl px-4 py-3" style={{ maxWidth: 280 }}>
        {children}
      </div>
    </motion.div>
  )
}

// ── Input bar ────────────────────────────────────────────────────
function InputBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="bg-white border border-[#d0d0d0] rounded-full shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-2 px-1 py-0.5 w-full">
      <button className="w-11 h-11 flex items-center justify-center shrink-0" aria-label="Attach">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <p className="flex-1 font-sans text-sm text-[#969696] py-2 px-1 truncate">{placeholder}</p>
      <button className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0" aria-label="Send">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 12V2M2 7L7 2L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

// ── Layout ───────────────────────────────────────────────────────
export default function SpaceChatLayout({
  thread,
  inputPlaceholder = 'Ask Allie about this space…',
  activeStep = 3,
  railEyebrow = 'Conversation with Allie',
  railTitle,
  children,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-dvh md:h-dvh flex flex-col bg-[#f5f5f5] md:overflow-hidden">
      <Header
        onMenuToggle={() => setMenuOpen(true)}
        onConciergeToggle={() => setConciergeOpen(true)}
        menuOpen={menuOpen}
        headerBg="#000000"
        weddingsBarBg="#b4b4b4"
      />

      {/* Notebook — desktop only so mobile experience stays untouched */}
      <div className="hidden md:block shrink-0">
        <WeddingNotebook activeStep={activeStep} />
      </div>

      {/* Split */}
      <div className="flex-1 md:min-h-0 flex flex-col md:flex-row md:overflow-hidden">
        {/* LEFT — chat rail (desktop only) */}
        <aside
          className="hidden md:flex md:w-[500px] md:shrink-0 md:flex-col md:min-h-0 bg-[#f5f5f5]"
          style={{ borderRight: '1px solid #e8e8e7' }}
        >
          <div className="flex-1 overflow-y-auto px-6 pt-7 pb-6 flex flex-col gap-8">
            {/* Rail header */}
            <div className="flex flex-col gap-[6px]">
              <p
                className="font-sans font-semibold text-[10px] tracking-[1.8px] uppercase"
                style={{ color: '#8e7351' }}
              >
                {railEyebrow}
              </p>
              {railTitle && (
                <p className="font-serif italic text-[24px] leading-[30px]" style={{ color: '#2b2b27' }}>
                  {railTitle}
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-8">
              {thread.map((msg, i) =>
                msg.author === 'allie' ? (
                  <div key={i} className="flex items-start gap-3">
                    <AllieAvatar />
                    <AllieBubble delay={i * 0.06}>
                      {msg.lines.map((line, j) => (
                        <div
                          key={j}
                          className={
                            j === 0
                              ? 'font-sans font-normal text-[15px] leading-[22px] text-[#585858]'
                              : 'font-sans font-normal text-[14px] leading-[22px] text-[#585858]'
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </AllieBubble>
                  </div>
                ) : (
                  <UserBubble key={i} delay={i * 0.06}>
                    <p className="font-sans font-normal text-[15px] leading-[22px] text-white">
                      {msg.text}
                    </p>
                  </UserBubble>
                )
              )}
            </div>
          </div>

          {/* Sticky input */}
          <div className="bg-[#f5f5f5] border-t border-[#ebebeb] px-4 py-5 shrink-0">
            <InputBar placeholder={inputPlaceholder} />
          </div>
        </aside>

        {/* RIGHT — canvas */}
        <main className="flex-1 md:min-h-0 md:overflow-y-auto bg-[#f5f5f5]">
          {children}
        </main>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
