'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

function Divider() {
  return <div className="h-px w-full" style={{ background: '#dad6ce' }} />
}

type Tab = 'you' | 'guests'

export default function EstimatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('you')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [sharePhone, setSharePhone] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const router = useRouter()

  const hasContact = sharePhone.trim().length > 0 || shareEmail.trim().length > 0

  function share(target: 'partner' | 'parents' | 'planner') {
    if (!hasContact) return
    const channels: string[] = []
    if (sharePhone.trim()) channels.push('text')
    if (shareEmail.trim()) channels.push('email')
    const via = channels.length === 2 ? 'text & email' : channels[0]
    const recipient =
      target === 'partner' ? 'your partner'
      : target === 'parents' ? 'your parents'
      : 'your planner'
    setShareOpen(false)
    setSharePhone('')
    setShareEmail('')
    setShareToast(`Estimate sent to ${recipient} via ${via}`)
    setTimeout(() => setShareToast(null), 2600)
  }

  const totalForYou = '$4,792'
  const totalForGuests = '$300 / night'

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f8f8f6' }}>
        <Header
          onMenuToggle={() => setMenuOpen(true)}
          onConciergeToggle={() => setConciergeOpen(true)}
          menuOpen={menuOpen}
          headerBg="#000000"
          weddingsBarBg="#b4b4b4"
        />

        {/* Empty background area */}
        <div className="flex-1" />

        {/* Estimate sheet */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col bg-white overflow-hidden"
          style={{ borderRadius: '16px 16px 0 0' }}
        >
          {/* Price bar */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ background: '#2b2b27', borderRadius: '16px 16px 0 0' }}
          >
            {/* Handle */}
            <div className="flex items-center justify-center pt-[8px]">
              <div className="h-[3px] w-[28px] rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
            </div>
            {/* Price row */}
            <div className="flex items-baseline justify-between px-[14px] pb-[12px] pt-[9px]">
              <p
                className="font-sans font-medium text-[8px] tracking-[1.2px] uppercase"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {activeTab === 'you' ? 'ESTIMATED PRICE' : 'ESTIMATED ROOM BLOCK'}
              </p>
              <p className="font-serif text-[28px] text-white">
                {activeTab === 'you' ? totalForYou : totalForGuests}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#e8e8e8' }}>
            {[
              { id: 'you' as Tab, label: 'Estimate for you' },
              { id: 'guests' as Tab, label: 'Estimate for your guests' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-[12px] px-[8px] font-sans text-[12px] leading-[16px] relative"
                  style={{
                    color: isActive ? '#2b2b27' : '#969696',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="estimate-tab-underline"
                      className="absolute left-0 right-0 bottom-[-1px] h-[2px]"
                      style={{ background: '#2b2b27' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-[8px] px-[14px] py-[16px]">
            <AnimatePresence mode="wait">
              {activeTab === 'you' ? (
                <motion.div
                  key="you"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-[8px]"
                >
                  <p
                    className="font-sans font-medium text-[8px] tracking-[1px] uppercase"
                    style={{ color: '#757569' }}
                  >
                    WHAT&apos;S INCLUDED
                  </p>

                  {/* Free Spirit ceremony */}
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      Free Spirit ceremony
                    </p>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#2b2b27' }}>
                      $3,500
                    </p>
                  </div>
                  <Divider />

                  {/* Package: 4hr Reception */}
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      <span className="font-bold">Package: </span>4hr Reception
                    </p>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#376b4e' }}>
                      Included
                    </p>
                  </div>
                  <Divider />

                  {/* Package: 4hr Private Event */}
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      <span className="font-bold">Package: </span>4hr Private Event
                    </p>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#376b4e' }}>
                      Included
                    </p>
                  </div>
                  <Divider />

                  {/* Wish List Add-ons */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-sans font-bold text-[11px]" style={{ color: '#2b2b27' }}>
                        Wish List Add-ons
                      </p>
                      <p className="font-sans text-[9.5px]" style={{ color: '#757569' }}>
                        Videography · DJ
                      </p>
                    </div>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#2b2b27' }}>
                      $4,300
                    </p>
                  </div>
                  <Divider />

                  <p
                    className="font-sans font-medium text-[8px] tracking-[1px] uppercase mt-[4px]"
                    style={{ color: '#757569' }}
                  >
                    PACKAGE BENEFITS EARNED
                  </p>

                  {[
                    '4hr Reception event',
                    '4hr Private event',
                    'Food & Beverage included',
                    '15% off guest room block',
                  ].map((benefit) => (
                    <div key={benefit} className="flex gap-[8px] items-center">
                      <p className="font-sans font-semibold text-[9px]" style={{ color: '#376b4e' }}>
                        ✓
                      </p>
                      <p className="font-sans text-[10.5px]" style={{ color: '#3e3e37' }}>
                        {benefit}
                      </p>
                    </div>
                  ))}

                  <p className="font-sans text-[8.5px] leading-[13px] mt-[2px]" style={{ color: '#757569' }}>
                    Reception and Private Event must be held on separate dates
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="guests"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-[8px]"
                >
                  <p
                    className="font-sans font-medium text-[8px] tracking-[1px] uppercase"
                    style={{ color: '#757569' }}
                  >
                    ROOM BLOCK
                  </p>

                  {/* What your guests pay */}
                  <div
                    className="flex items-center justify-between px-[12px] py-[11px] rounded-[8px]"
                    style={{ background: '#e8e8e8' }}
                  >
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-sans font-bold text-[11px]" style={{ color: '#2b2b27' }}>
                        What your guests pay
                      </p>
                      <p
                        className="font-sans font-medium text-[9px] tracking-[0.7px]"
                        style={{ color: '#000', width: 169 }}
                      >
                        Confirmed 200 rooms available for your dates
                      </p>
                    </div>
                    <p className="font-serif text-[20px]" style={{ color: '#000' }}>
                      $300 / night
                    </p>
                  </div>

                  {/* Room block breakdown */}
                  <div className="flex items-center justify-between mt-[6px]">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      Standard room rate
                    </p>
                    <p className="font-sans text-[11px]" style={{ color: '#757569', textDecoration: 'line-through' }}>
                      $353 / night
                    </p>
                  </div>
                  <Divider />

                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      <span className="font-bold">Discount: </span>15% off room block
                    </p>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#376b4e' }}>
                      Applied
                    </p>
                  </div>
                  <Divider />

                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px]" style={{ color: '#2b2b27' }}>
                      Negotiated guest rate
                    </p>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#2b2b27' }}>
                      $300 / night
                    </p>
                  </div>
                  <Divider />

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-sans font-bold text-[11px]" style={{ color: '#2b2b27' }}>
                        Estimated 3-night stay
                      </p>
                      <p className="font-sans text-[9.5px]" style={{ color: '#757569' }}>
                        Avg. wedding weekend
                      </p>
                    </div>
                    <p className="font-sans font-medium text-[11px]" style={{ color: '#2b2b27' }}>
                      $900 / guest
                    </p>
                  </div>
                  <Divider />

                  <p
                    className="font-sans font-medium text-[8px] tracking-[1px] uppercase mt-[4px]"
                    style={{ color: '#757569' }}
                  >
                    BENEFITS FOR YOUR GUESTS
                  </p>

                  {[
                    'Complimentary welcome cocktail',
                    'Resort credit for spa & dining',
                    'Group check-in & early arrivals',
                    'Free room upgrades (subject to availability)',
                  ].map((benefit) => (
                    <div key={benefit} className="flex gap-[8px] items-center">
                      <p className="font-sans font-semibold text-[9px]" style={{ color: '#376b4e' }}>
                        ✓
                      </p>
                      <p className="font-sans text-[10.5px]" style={{ color: '#3e3e37' }}>
                        {benefit}
                      </p>
                    </div>
                  ))}

                  <p className="font-sans text-[8.5px] leading-[13px] mt-[2px]" style={{ color: '#757569' }}>
                    Guests pay directly when booking through your wedding website
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTAs */}
        <div className="relative flex flex-col gap-[10px] px-[24px] py-[16px]">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShareOpen(true)}
            className="w-full h-[44px] rounded-full border font-sans font-medium text-base flex items-center justify-center gap-[8px]"
            style={{ borderColor: '#767676', color: '#2b2b27', background: 'white' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.5 5.5L8 2L4.5 5.5M8 2V10M3 9V12.5C3 13.0523 3.44772 13.5 4 13.5H12C12.5523 13.5 13 13.0523 13 12.5V9"
                stroke="#2b2b27"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Share estimate
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/save-my-date')}
            className="w-full h-[48px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
          >
            Save My Date
          </motion.button>
        </div>

        {/* Share toast */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 -translate-x-1/2 bottom-[32px] px-[18px] py-[12px] rounded-full text-white text-[13px] font-sans z-50"
              style={{ background: 'rgba(43,43,39,0.95)' }}
            >
              {shareToast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share sheet */}
      <AnimatePresence>
        {shareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed left-0 right-0 bottom-0 z-50 bg-white px-[24px] pt-[16px] pb-[32px] flex flex-col gap-[16px] mx-auto"
              style={{ borderRadius: '16px 16px 0 0', maxWidth: 480 }}
            >
              <div className="flex items-center justify-center pt-[4px] pb-[8px]">
                <div className="h-[3px] w-[36px] rounded-full" style={{ background: '#d0d0d0' }} />
              </div>
              <p className="font-serif text-[22px] leading-[28px] text-black">
                Share your estimate
              </p>
              <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#757569' }}>
                Enter a phone number, an email, or both — we&apos;ll send a copy to discuss together.
              </p>

              {/* Contact fields */}
              <div className="flex flex-col gap-[12px]">
                <label className="flex flex-col gap-[6px]">
                  <span
                    className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase"
                    style={{ color: '#767676' }}
                  >
                    Phone number
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 123-4567"
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    className="h-[44px] rounded-[10px] px-[14px] font-sans text-[14px] leading-[20px] text-black bg-white outline-none focus:border-black"
                    style={{ border: '1px solid #d0d0d0' }}
                  />
                </label>
                <label className="flex flex-col gap-[6px]">
                  <span
                    className="font-sans font-semibold text-[10px] tracking-[0.8px] uppercase"
                    style={{ color: '#767676' }}
                  >
                    Email
                  </span>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="partner@email.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="h-[44px] rounded-[10px] px-[14px] font-sans text-[14px] leading-[20px] text-black bg-white outline-none focus:border-black"
                    style={{ border: '1px solid #d0d0d0' }}
                  />
                </label>
              </div>

              <motion.button
                whileTap={hasContact ? { scale: 0.98 } : undefined}
                onClick={() => share('partner')}
                disabled={!hasContact}
                className="w-full h-[48px] rounded-full font-sans font-medium text-base flex items-center justify-center transition-opacity"
                style={{
                  background: 'black',
                  color: 'white',
                  opacity: hasContact ? 1 : 0.4,
                  cursor: hasContact ? 'pointer' : 'not-allowed',
                }}
              >
                Share estimate with partner
              </motion.button>
              <motion.button
                whileTap={hasContact ? { scale: 0.98 } : undefined}
                onClick={() => share('parents')}
                disabled={!hasContact}
                className="w-full h-[48px] rounded-full border font-sans font-medium text-base text-black flex items-center justify-center transition-opacity"
                style={{
                  borderColor: '#767676',
                  opacity: hasContact ? 1 : 0.4,
                  cursor: hasContact ? 'pointer' : 'not-allowed',
                }}
              >
                Share estimate with my parents
              </motion.button>
              <motion.button
                whileTap={hasContact ? { scale: 0.98 } : undefined}
                onClick={() => share('planner')}
                disabled={!hasContact}
                className="w-full h-[48px] rounded-full border font-sans font-medium text-base text-black flex items-center justify-center gap-[8px] transition-opacity"
                style={{
                  borderColor: '#767676',
                  opacity: hasContact ? 1 : 0.4,
                  cursor: hasContact ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 8.5C9.66 8.5 11 7.16 11 5.5C11 3.84 9.66 2.5 8 2.5C6.34 2.5 5 3.84 5 5.5C5 7.16 6.34 8.5 8 8.5Z"
                    stroke="#2b2b27"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M2.5 13.5C2.5 11.29 4.96 10 8 10C11.04 10 13.5 11.29 13.5 13.5"
                    stroke="#2b2b27"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Share with my planner
              </motion.button>
              <button
                onClick={() => setShareOpen(false)}
                className="w-full font-sans text-[14px] text-center mt-[4px]"
                style={{ color: '#757569' }}
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
