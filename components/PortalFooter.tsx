'use client'

import { PRODUCT } from '@/lib/product'

const ALL_IN_LOGO = "https://www.figma.com/api/mcp/asset/9eac1483-8e33-4e2d-8dd9-6428221bce97"

export default function PortalFooter() {
  return (
    <div className="bg-black w-full">
      {/* Main footer body */}
      <div className="flex flex-col gap-[40px] items-start justify-center px-[24px] py-[48px] w-full">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-[12px] items-start">
          <div className="h-[24px] overflow-hidden w-[282px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ALL_IN_LOGO} alt={PRODUCT.platformName} className="w-full h-full object-contain object-left" />
          </div>
          <p className="font-sans text-[14px] leading-[20px] w-[270px]" style={{ color: '#d0d0d0' }}>
            {PRODUCT.tagline}
          </p>
        </div>

        {/* Our Brands */}
        <div className="flex flex-col gap-[12px] items-start w-[270px]">
          <p className="font-sans font-semibold text-[16px] leading-[24px] text-white">Our Brands</p>
          <div className="flex flex-col gap-[8px] items-start w-full">
            {['Hard Rock Hotels', 'UNICO 20°87°', 'Nobu Hotels', 'AVA Resort'].map(b => (
              <p key={b} className="font-sans text-[14px] leading-[20px]" style={{ color: '#d0d0d0' }}>{b}</p>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="flex flex-col gap-[12px] items-start w-[270px]">
          <p className="font-sans font-semibold text-[16px] leading-[24px] text-white">Plan</p>
          <div className="flex flex-col gap-[8px] items-start w-full">
            {['Start planning', 'Vendor marketplace', 'Concierge support'].map(b => (
              <p key={b} className="font-sans text-[14px] leading-[20px]" style={{ color: '#d0d0d0' }}>{b}</p>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="flex flex-col gap-[12px] items-start w-[270px]">
          <p className="font-sans font-semibold text-[16px] leading-[24px] text-white">Trust</p>
          <div className="flex flex-col gap-[8px] items-start w-full">
            {['Verified vendors', 'Flexible date holds', '24/7 events support'].map(b => (
              <p key={b} className="font-sans text-[14px] leading-[20px]" style={{ color: '#d0d0d0' }}>{b}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-[16px] items-start px-[24px] py-[24px] w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-sans text-[12px] leading-[16px] flex-1" style={{ color: '#d0d0d0' }}>
          {PRODUCT.copyright}
        </p>
        <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#d0d0d0' }}>
          Prototype · for design review only
        </p>
      </div>
    </div>
  )
}
