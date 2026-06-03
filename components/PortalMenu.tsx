'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { label: 'Overview',    href: '/post-booking' },
  { label: 'Proposal',   href: '/portal/proposal' },
  { label: 'Vendors',    href: '/portal/vendors' },
  { label: 'Guest List', href: '/portal/guest-list' },
  { label: 'Registry',   href: '/portal/registry' },
  { label: 'Inspiration',href: '/portal/inspiration' },
  { label: 'Profile',    href: '/portal/profile' },
]

export default function PortalMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="sticky top-0 z-30 bg-white shrink-0 w-full" style={{ boxShadow: '0 1px 0 #dad6ce' }}>
      {/* Collapsed header row */}
      <div
        className="flex items-center justify-between px-[16px] py-[8px] cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex flex-col items-start">
          <p
            className="font-sans font-semibold text-[10px] leading-[16px] tracking-[1.5px] uppercase whitespace-nowrap"
            style={{ color: '#969696' }}
          >
            WEDDING PORTAL
          </p>
          <div className="flex items-center gap-[8px] px-[2px] py-[6px]">
            {/* Vertical pipe indicator */}
            <div className="w-[2px] h-[16px] rounded-full shrink-0" style={{ background: '#2b2b27' }} />
            <p
              className="font-sans font-medium text-[16px] leading-[24px] whitespace-nowrap"
              style={{ color: '#2b2b27' }}
            >
              {active}
            </p>
          </div>
        </div>
        <div className="w-[44px] h-[44px] flex items-center justify-center shrink-0">
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <CaretDown size={14} weight="bold" color="#2b2b27" />
          </motion.div>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="portal-dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
            style={{ borderTop: '1px solid #dad6ce' }}
          >
            {MENU_ITEMS.map((item, i) => {
              const isActive = item.label === active
              return (
                <div
                  key={item.label}
                  className="flex items-center px-[16px] cursor-pointer"
                  style={{
                    height: 44,
                    borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid #f0ece6' : 'none',
                  }}
                  onClick={() => { router.push(item.href); setOpen(false) }}
                >
                  <div
                    className="w-[3px] h-[20px] rounded-full mr-[12px] shrink-0"
                    style={{ background: isActive ? '#2b2b27' : 'transparent' }}
                  />
                  <p
                    className="font-sans text-[13px] leading-[20px]"
                    style={{
                      color: isActive ? '#2b2b27' : '#757569',
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
