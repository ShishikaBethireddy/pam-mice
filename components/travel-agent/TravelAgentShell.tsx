'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CventConnectionStatus from '@/components/travel-agent/CventConnectionStatus'

interface TravelAgentShellProps {
  children: React.ReactNode
  title?: string
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
}

export default function TravelAgentShell({
  children,
  title,
  backHref = '/travel-agent',
  backLabel = '← Inbox',
  actions,
}: TravelAgentShellProps) {
  const pathname = usePathname()
  const onInbox = pathname === '/travel-agent'

  return (
    <div className="flex min-h-screen bg-[#ececea]">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#d0d0d0] bg-[#18181a] text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <Image src="/assets/logo-nobu-white.png" alt="Nobu" width={140} height={32} className="object-contain" />
          <p className="mt-3 font-sans text-[10px] uppercase tracking-[1.6px] text-[#d6bfa4]">Hotel management</p>
          <p className="font-sans text-[12px] text-white/60">Partner workspace</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <SidebarLink href="/travel-agent" active={onInbox} label="Cvent inbox" />
          <SidebarLink href="/" label="Exit to entry" muted />
        </nav>
        <div className="border-t border-white/10 px-6 py-4">
          <p className="font-sans text-[11px] text-white/40">Desktop · PAM MICE prototype</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#d0d0d0] bg-white px-8">
          <div className="flex items-center gap-4 min-w-0">
            {!onInbox && (
              <Link href={backHref} className="font-sans text-[13px] font-medium text-[#8e7351] hover:text-[#2b2b27]">
                {backLabel}
              </Link>
            )}
            {title && (
              <div className="min-w-0 border-l border-[#ebe3d4] pl-4">
                <p className="font-sans text-[10px] uppercase tracking-[1.6px] text-[#8e7351]">Request</p>
                <h1 className="truncate font-serif text-[22px] italic text-[#2b2b27]">{title}</h1>
              </div>
            )}
          </div>
          <motionlessRight className="flex items-center gap-4 shrink-0">
            <CventConnectionStatus />
            {actions && <div className="flex items-center gap-3 border-l border-[#ebe3d4] pl-4">{actions}</motionlessRight>}
          </motionlessRight>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

function SidebarLink({
  href,
  label,
  active,
  muted,
}: {
  href: string
  label: string
  active?: boolean
  muted?: boolean
}) {
  return (
    <Link
      href={href}
      className="rounded-[8px] px-4 py-2.5 font-sans text-[13px] font-medium transition-colors"
      style={{
        background: active ? 'rgba(214, 191, 164, 0.15)' : 'transparent',
        color: active ? '#d6bfa4' : muted ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.85)',
      }}
    >
      {label}
    </Link>
  )
}
