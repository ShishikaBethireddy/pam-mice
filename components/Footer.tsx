import Image from 'next/image'
import { PRODUCT } from '@/lib/product'
import { PRODUCT } from '@/lib/product'

export default function Footer({ bg = '#2b2b27' }: { bg?: string }) {
  return (
    <footer className="w-full" style={{ background: bg }}>
      <div className="flex flex-col gap-10 px-6 py-12">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-3">
          <Image
            src="/assets/logo-footer.svg"
            alt={PRODUCT.platformName}
            width={282}
            height={24}
            className="object-contain object-left"
          />
          <p className="font-sans font-normal text-sm leading-5 text-[#bebeb9] max-w-[270px]">
            {PRODUCT.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="font-sans font-semibold text-base leading-6 text-white">Our Brands</p>
          <div className="flex flex-col gap-2">
            {['Hard Rock Hotels', 'UNICO 20°87°', 'Nobu Hotels', 'AVA Resort'].map((b) => (
              <p key={b} className="font-sans font-normal text-sm leading-5 text-[#bebeb9]">{b}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-sans font-semibold text-base leading-6 text-white">Plan</p>
          <div className="flex flex-col gap-2">
            {['Start planning', 'Vendor marketplace', 'Concierge support'].map((l) => (
              <p key={l} className="font-sans font-normal text-sm leading-5 text-[#bebeb9]">{l}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-sans font-semibold text-base leading-6 text-white">Trust</p>
          <div className="flex flex-col gap-2">
            {['Verified vendors', 'Flexible date holds', '24/7 events support'].map((l) => (
              <p key={l} className="font-sans font-normal text-sm leading-5 text-[#bebeb9]">{l}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 flex flex-col gap-4 p-6">
        <p className="font-sans font-normal text-xs leading-4 text-[#bebeb9]">
          {PRODUCT.copyright}
        </p>
        <p className="font-sans font-normal text-xs leading-4 text-[#bebeb9]">
          Prototype · for design review only
        </p>
      </div>
    </footer>
  )
}
