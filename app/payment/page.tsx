'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import MenuOverlay from '@/components/MenuOverlay'
import ConciergeSheet from '@/components/ConciergeSheet'

function FieldBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white border flex h-[44px] items-center px-[14px] rounded-[4px] w-full"
      style={{ borderColor: '#dad6ce' }}
    >
      {children}
    </div>
  )
}

function FieldText({ value }: { value: string }) {
  return <p className="font-sans text-[13px] whitespace-nowrap" style={{ color: '#9e9e95' }}>{value}</p>
}

export default function PaymentPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f6f5f3' }}>

        {/* Payment Details heading */}
        <div className="bg-white px-[24px] pt-[32px] pb-[24px] shrink-0">
          <p className="font-serif text-[30px] leading-[1.2] text-[#2b2b27] text-center w-full">
            Payment Details
          </p>
        </div>

        <div className="h-px w-full shrink-0" style={{ background: '#dad6ce' }} />

        {/* Contact info + Payment method */}
        <div className="bg-white flex flex-col gap-[8px] px-[24px] pt-[24px] shrink-0">

          {/* Contact header */}
          <div className="flex items-center justify-between">
            <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
              YOUR CONTACT INFORMATION
            </p>
            <p className="font-sans text-[10px] whitespace-nowrap" style={{ color: '#ca9151' }}>
              Already have an account? Log in
            </p>
          </div>
          <div className="h-[6px]" />
          <FieldBox><FieldText value="Ella_Johnson26@gmail.com" /></FieldBox>

          <div className="h-[20px]" />

          {/* Payment method */}
          <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
            PAYMENT METHOD
          </p>
          <div className="h-[8px]" />

          {/* Apple Pay */}
          <div
            className="flex items-center justify-center px-[16px] py-[12px] rounded-[4px]"
            style={{ background: '#2b2b27' }}
          >
            <p className="font-sans font-semibold text-[13px] text-white whitespace-nowrap"> Apple Pay</p>
          </div>

          <div className="h-[10px]" />

          {/* PayPal / Venmo */}
          <div className="flex gap-[12px]">
            <div
              className="flex flex-1 gap-[8px] items-center px-[12px] py-[10px] rounded-[4px] border"
              style={{ borderColor: '#dad6ce' }}
            >
              <div className="w-[14px] h-[14px] rounded-[2px] border shrink-0" style={{ borderColor: '#dad6ce' }} />
              <p className="font-sans font-semibold text-[12px] whitespace-nowrap" style={{ color: '#031b76' }}>PayPal</p>
            </div>
            <div
              className="flex flex-1 gap-[8px] items-center px-[12px] py-[10px] rounded-[4px] border"
              style={{ borderColor: '#dad6ce' }}
            >
              <div className="w-[14px] h-[14px] rounded-[2px] border shrink-0" style={{ borderColor: '#dad6ce' }} />
              <p className="font-sans font-semibold text-[12px] whitespace-nowrap" style={{ color: '#32afed' }}>Venmo</p>
            </div>
          </div>

          {/* Or divider */}
          <div className="flex gap-[12px] items-center">
            <div className="h-px" style={{ background: '#dad6ce', width: 10 }} />
            <p className="font-sans text-[12px] whitespace-nowrap" style={{ color: '#9e9e95' }}>or</p>
            <div className="h-px flex-1" style={{ background: '#dad6ce' }} />
          </div>

          {/* Credit Card / Wire Transfer toggle */}
          <div className="flex border rounded-[4px] overflow-hidden" style={{ borderColor: '#dad6ce' }}>
            <div className="flex flex-1 items-center justify-center px-[16px] py-[11px]" style={{ background: '#383733' }}>
              <p className="font-sans font-medium text-[13px] text-white whitespace-nowrap">Credit Card</p>
            </div>
            <div className="flex flex-1 items-center justify-center px-[16px] py-[11px] bg-white">
              <p className="font-sans text-[13px] whitespace-nowrap" style={{ color: '#757569' }}>Wire Transfer</p>
            </div>
          </div>

          <div className="h-[10px]" />

          {/* Card number */}
          <FieldBox><FieldText value="•••• •••• •••• 4856" /></FieldBox>

          <div className="h-[8px]" />

          {/* Expiry + CVV */}
          <div className="flex gap-[10px]">
            <div className="flex flex-col gap-[4px] flex-1">
              <p className="font-sans text-[10px] whitespace-nowrap" style={{ color: '#757569' }}>Expiration Date</p>
              <div className="flex gap-[6px]">
                <div
                  className="bg-white border flex h-[40px] items-center px-[14px] rounded-[4px] w-[60px] shrink-0"
                  style={{ borderColor: '#dad6ce' }}
                >
                  <FieldText value="11" />
                </div>
                <div
                  className="bg-white border flex h-[40px] items-center px-[14px] rounded-[4px] w-[80px] shrink-0"
                  style={{ borderColor: '#dad6ce' }}
                >
                  <FieldText value="2027" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[4px] flex-1">
              <p className="font-sans text-[10px] whitespace-nowrap" style={{ color: '#757569' }}>Security Code</p>
              <div
                className="bg-white border flex h-[40px] items-center px-[14px] rounded-[4px] w-[80px] shrink-0"
                style={{ borderColor: '#dad6ce' }}
              >
                <FieldText value="***" />
              </div>
            </div>
          </div>

          <div className="h-[28px]" />
        </div>

        {/* Billing details */}
        <div className="bg-white flex flex-col gap-[8px] px-[24px] pb-[32px] shrink-0">
          <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#757569' }}>
            BILLING DETAILS
          </p>
          <div className="h-[4px]" />
          <FieldBox><FieldText value="Ella LeeAnn Johnson" /></FieldBox>
          <FieldBox><FieldText value="Ella_Johnson26@gmail.com" /></FieldBox>
          {/* Country */}
          <div
            className="bg-white border flex h-[44px] items-center justify-between px-[14px] rounded-[4px] w-full"
            style={{ borderColor: '#dad6ce' }}
          >
            <p className="font-sans text-[13px]" style={{ color: '#2b2b27' }}>United States</p>
            <p className="font-sans text-[12px]" style={{ color: '#9e9e95' }}>▾</p>
          </div>
          {/* State / Zip */}
          <div className="flex gap-[10px]">
            <div
              className="bg-white border flex flex-1 h-[44px] items-center justify-between px-[14px] rounded-[4px]"
              style={{ borderColor: '#dad6ce' }}
            >
              <p className="font-sans text-[13px]" style={{ color: '#2b2b27' }}>PA</p>
              <p className="font-sans text-[12px]" style={{ color: '#9e9e95' }}>▾</p>
            </div>
            <FieldBox><FieldText value="19050" /></FieldBox>
          </div>
        </div>

        {/* Summary panel */}
        <div className="flex flex-col px-[24px] pt-[28px] shrink-0" style={{ background: '#000000' }}>
          <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#bfbfb8' }}>
            CURRENT BALANCE
          </p>
          <div className="h-[12px]" />
          {[
            { label: 'Lavish Daydream', value: '$5,000' },
            { label: 'Taxes', value: '$5,526' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-[6px]">
              <p className="flex-1 font-sans text-[13px]" style={{ color: '#bfbfb8' }}>{row.label}</p>
              <p className="font-sans text-[13px] whitespace-nowrap" style={{ color: '#e5e5e0' }}>{row.value}</p>
            </div>
          ))}
          <div className="h-[4px]" />
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="h-[8px]" />
          <div className="flex items-center justify-between py-[6px]">
            <p className="flex-1 font-sans font-semibold text-[13px]" style={{ color: '#bfbfb8' }}>Current Total</p>
            <p className="font-sans font-semibold text-[15px] text-white whitespace-nowrap">$5,526</p>
          </div>

          <div className="h-[24px]" />

          {/* Wish list */}
          <div className="flex gap-[6px] items-center">
            <p className="font-sans text-[12px]" style={{ color: '#bfbfb8' }}>♡</p>
            <p className="font-sans font-semibold text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ color: '#bfbfb8' }}>WISH LIST</p>
          </div>
          <div className="h-[12px]" />
          {[
            { label: 'External DJ Package', value: '$3,299' },
            { label: 'Luxury Floral Design', value: '$1,299' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-[6px]">
              <p className="flex-1 font-sans text-[13px]" style={{ color: '#bfbfb8' }}>{row.label}</p>
              <p className="font-sans text-[13px] whitespace-nowrap" style={{ color: '#e5e5e0' }}>{row.value}</p>
            </div>
          ))}
          <div className="h-[4px]" />
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="h-[8px]" />
          <div className="flex items-center justify-between py-[6px]">
            <p className="flex-1 font-sans font-semibold text-[13px]" style={{ color: '#bfbfb8' }}>* Wish List Total</p>
            <p className="font-sans font-semibold text-[15px] text-white whitespace-nowrap">$4,598</p>
          </div>
          <div className="h-[20px]" />
        </div>

        {/* Deposit due today bar */}
        <div
          className="flex items-center justify-between px-[24px] py-[18px] shrink-0"
          style={{ background: '#e8e8e8' }}
        >
          <p className="flex-1 font-sans text-[13px]" style={{ color: '#2b2b27' }}>Deposit due today</p>
          <p className="font-sans font-semibold text-[20px] whitespace-nowrap" style={{ color: '#2b2b27' }}>$2,763</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-white px-[24px] py-[12px] shrink-0">
          <p className="font-sans text-[10px] whitespace-nowrap" style={{ color: '#9e9e94' }}>
            *Not included in the Current Total
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white flex items-center justify-center px-[24px] py-[16px] shrink-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/officially-yours')}
            className="w-full h-[44px] rounded-full bg-black font-sans font-medium text-base text-white flex items-center justify-center"
          >
            Submit Payment
          </motion.button>
        </div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => router.push('/sign-in')} />
      <ConciergeSheet open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  )
}
