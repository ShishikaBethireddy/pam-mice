'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import PortalHeader from '@/components/PortalHeader'

// ── Shared icons ──────────────────────────────────────────────────────────────
const IMG_DIAMOND_MKT  = "https://www.figma.com/api/mcp/asset/afbafae3-053a-41b8-bff0-b7a0260ba7c3"
const IMG_CHECK        = "https://www.figma.com/api/mcp/asset/80c01f95-6950-48e5-a211-0e888c0ec9c0"
const IMG_PLUS         = "https://www.figma.com/api/mcp/asset/2a357c90-dd15-4b9c-88cf-b68249d13771"

// ── Manage tab icons ──────────────────────────────────────────────────────────
const IMG_DIAMOND_MGT  = "https://www.figma.com/api/mcp/asset/9974c819-70bb-4d63-aa29-6ead7752a4cd"
const IMG_VENDOR_ICON  = "https://www.figma.com/api/mcp/asset/98b2330e-3f57-4f1b-86f0-abfbef3f9971"
const IMG_CARET_DOWN   = "https://www.figma.com/api/mcp/asset/45535788-e6e6-4189-ae8d-8ccf25474397"
const IMG_CARET_UP     = "https://www.figma.com/api/mcp/asset/70dbd2cb-037f-4cb7-9666-32bc3273af2a"

// ── Marketplace vendor data ───────────────────────────────────────────────────
interface VendorPackage {
  tier: string
  price: string
  blurb: string
  features: string[]
}

interface VendorItem {
  name: string
  badge: string | null
  price: string
  img: string
  added: boolean
  registryOn: boolean
  packages?: VendorPackage[]
  selectedPackage?: string
}

const PHOTOGRAPHY_PACKAGES: VendorPackage[] = [
  {
    tier: 'Basic',
    price: '$3,500',
    blurb: 'A streamlined day-of package with one lead photographer.',
    features: [
      '8 hours of day-of coverage',
      'One lead photographer',
      'Online gallery — 500 edited images',
      'Standard delivery (8 weeks)',
      'Personal print release',
    ],
  },
  {
    tier: 'Advanced',
    price: '$7,500',
    blurb: 'Full-day editorial coverage with a second shooter and engagement session.',
    features: [
      '12 hours of coverage + second shooter',
      'Editorial-style art direction',
      'Engagement session included',
      'Premium gallery — 900+ edited images',
      'Heirloom album + 2 fine-art prints',
      'Priority delivery (4 weeks)',
    ],
  },
]

const INITIAL_VENDORS: VendorItem[] = [
  {
    name: 'Photography',
    badge: 'Books 12+ mo ahead',
    price: '$3,500–$7,500 · choose your package',
    img: '/assets/priya-rahul-carousel-1.jpg',
    added: false, registryOn: false,
    packages: PHOTOGRAPHY_PACKAGES,
  },
  {
    name: 'Champagne Toast',
    badge: 'Most added',
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/a2a55144-784d-4a2e-9f23-70025c292558',
    added: true, registryOn: true,
  },
  {
    name: 'Ceremony arch & florals',
    badge: 'Most added',
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/1019ca4e-f02d-4643-870a-541a51a4259b',
    added: true, registryOn: true,
  },
  {
    name: 'Reception centerpieces',
    badge: 'Most added',
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/44e523fc-59b4-41b0-9d9e-6fcd059e8668',
    added: true, registryOn: false,
  },
  {
    name: 'Full Grand DJ Package',
    badge: 'Most added',
    price: '$280–$450 / person · outside vendor',
    img: 'https://www.figma.com/api/mcp/asset/02c400df-0c95-40ed-8120-9213291a0845',
    added: false, registryOn: false,
  },
]

// ── Manage vendor data ────────────────────────────────────────────────────────
const MANAGE_VENDORS = [
  {
    id: 'photography',
    category: 'Photography',
    comparing: 2,
    vendors: [
      { name: 'Luna & Co.',           detail: 'Contract pending · $8,500' },
      { name: 'Daniela Reyes Studio', detail: 'Awaiting quote · $7–9k'   },
    ],
  },
  {
    id: 'dj',
    category: 'Full Grand DJ Package',
    comparing: 2,
    vendors: [],
  },
]

// ── Filter SVG ────────────────────────────────────────────────────────────────
function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M6 10h8M9 15h2" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Dash tracker ──────────────────────────────────────────────────────────────
function DashTracker() {
  return (
    <div className="flex gap-[6px] items-center justify-center w-full px-[24px]">
      {(['Added', 'Proposal', 'Contracted'] as const).map((stage) => {
        const isActive = stage === 'Contracted'
        return (
          <div key={stage} className="flex flex-1 flex-col gap-[9px] items-center min-w-0">
            <div
              className="h-[3px] rounded-[2px] w-full"
              style={{ background: isActive ? '#585858' : '#8a9a8a' }}
            />
            <p
              className="font-sans text-[10px] leading-[16px] text-center whitespace-nowrap"
              style={{ color: isActive ? '#2b2b27' : '#585858', fontWeight: isActive ? 500 : 400 }}
            >
              {stage}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── Marketplace tab content ───────────────────────────────────────────────────
function MarketplaceContent({
  vendors, onToggleAdded, onToggleRegistry, onOpenPackages,
}: {
  vendors: VendorItem[]
  onToggleAdded: (i: number) => void
  onToggleRegistry: (i: number) => void
  onOpenPackages: (i: number) => void
}) {
  return (
    <>
      {/* Filter */}
      <div className="flex items-start px-[18px] w-full shrink-0">
        <button className="flex gap-[6px] h-[36px] items-center justify-center py-[8px] rounded-full">
          <FilterIcon />
          <span className="font-sans font-light text-[14px] leading-[20px] text-black">Filter</span>
        </button>
      </div>

      {/* Vendor cards */}
      <div className="flex flex-col gap-[12px] items-start p-[16px] w-full shrink-0">
        {vendors.map((vendor, i) => {
          const hasPackages = (vendor.packages?.length ?? 0) > 0
          return (
          <motion.div
            key={vendor.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.04 }}
            className="flex flex-col items-start justify-center overflow-hidden rounded-[8px] w-full shrink-0"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            {/* Top row */}
            <div
              role={hasPackages ? 'button' : undefined}
              tabIndex={hasPackages ? 0 : undefined}
              onClick={hasPackages ? () => onOpenPackages(i) : undefined}
              onKeyDown={hasPackages ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenPackages(i) } } : undefined}
              className={`flex gap-[12px] items-center pr-[12px] w-full ${hasPackages ? 'cursor-pointer' : ''}`}
              style={{ minHeight: 130 }}
            >
              {/* Image */}
              <div className="overflow-hidden self-stretch shrink-0" style={{ width: 88, minHeight: 130 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover" />
              </div>
              {/* Info */}
              <div className="flex flex-col gap-[8px] items-start flex-1 min-w-0 overflow-hidden py-[12px]">
                <div className="flex flex-col gap-[4px] items-start">
                  <div className="flex flex-col gap-[6px] items-start overflow-hidden">
                    <p className="font-sans font-medium text-[14px] leading-[20px] text-black whitespace-nowrap">{vendor.name}</p>
                    {vendor.badge && (
                      <span className="px-[8px] py-[2px] rounded-full font-sans font-medium text-[10px] leading-[12px] tracking-[0.4px] uppercase whitespace-nowrap shrink-0" style={{ background: '#e0d3c5', color: '#8e6434' }}>
                        {vendor.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#969696' }}>{vendor.price}</p>
                </div>
                {hasPackages ? (
                  <p className="font-sans font-medium text-[12px] leading-[16px] whitespace-nowrap inline-flex items-center gap-[4px]" style={{ color: '#2b2b27' }}>
                    {vendor.selectedPackage
                      ? <>Package: <span style={{ textDecoration: 'underline' }}>{vendor.selectedPackage}</span> →</>
                      : <>View packages <span aria-hidden>→</span></>}
                  </p>
                ) : (
                  <p className="font-sans text-[12px] leading-[16px] underline whitespace-nowrap" style={{ color: '#767676' }}>
                    Tastemakers notes (4)
                  </p>
                )}
              </div>
              {/* Add/remove toggle */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={(e) => { e.stopPropagation(); hasPackages ? onOpenPackages(i) : onToggleAdded(i) }}
                className="shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden p-[8px]"
                style={{ background: vendor.added ? '#1e1e1e' : 'white' }}
                aria-label={vendor.added ? 'Added' : hasPackages ? 'View packages' : 'Add vendor'}
              >
                {vendor.added
                  ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={IMG_CHECK} alt="Added" className="w-[24px] h-[24px] object-contain" />
                  : /* eslint-disable-next-line @next/next/no-img-element */ <img src={IMG_PLUS}  alt={hasPackages ? 'View packages' : 'Add'} className="w-[24px] h-[24px] object-contain" />
                }
              </motion.button>
            </div>

            {/* Registry row */}
            <div className="flex items-center justify-between overflow-hidden p-[12px] w-full" style={{ background: '#e8e8e8' }}>
              <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#585858' }}>Add to registry</p>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleRegistry(i) }}
                className="h-[20px] overflow-hidden relative rounded-full w-[36px] shrink-0"
                style={{ background: vendor.registryOn ? 'black' : '#b4b4b4' }}
                aria-label={vendor.registryOn ? 'Remove from registry' : 'Add to registry'}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 16, height: 16, top: 2,
                    left: vendor.registryOn ? 18 : 3,
                    background: 'white',
                    transition: 'left 0.15s ease',
                  }}
                />
              </button>
            </div>
          </motion.div>
        )})}
      </div>
    </>
  )
}

// ── Manage tab content ────────────────────────────────────────────────────────
function ManageContent() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['photography']))

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Global Tracker */}
      <div className="flex items-center w-full px-[16px] py-[4px]">
        <div className="flex flex-col gap-[8px] w-full">
          {/* Count row */}
          <div className="flex gap-[6px] items-baseline">
            <p className="font-sans font-semibold text-[24px] leading-[32px] text-black">4</p>
            <p className="font-sans font-light text-[14px] leading-[20px]" style={{ color: '#969696' }}>/</p>
            <p className="font-sans font-semibold text-[24px] leading-[32px]" style={{ color: '#b4b4b4' }}>10</p>
          </div>
          {/* Progress bar */}
          <div className="flex flex-col gap-[4px] w-full">
            <div className="h-[5px] w-full rounded-full overflow-hidden bg-white">
              <div className="h-full rounded-full" style={{ width: '40%', background: '#585858' }} />
            </div>
            <div className="flex justify-end w-full">
              <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#b4b4b4' }}>Booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-start px-[18px] w-full shrink-0">
        <button className="flex gap-[6px] h-[36px] items-center justify-center py-[8px] rounded-full">
          <FilterIcon />
          <span className="font-sans font-light text-[14px] leading-[20px] text-black">Filter</span>
        </button>
      </div>

      {/* Vendor manage cards */}
      <div className="flex flex-col gap-[12px] items-start p-[16px] w-full">
        {MANAGE_VENDORS.map((v) => {
          const isExpanded = expanded.has(v.id)
          return (
            <motion.div
              key={v.id}
              layout
              className="bg-white flex flex-col items-center overflow-hidden rounded-[16px] w-full"
            >
              {/* Header row */}
              <div className="flex gap-[25px] items-center px-[24px] pt-[24px] w-full">
                <div className="flex flex-1 gap-[12px] items-center min-w-0">
                  {/* Category icon */}
                  <div className="flex items-start shrink-0">
                    <div className="relative w-[32px] h-[32px] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={IMG_VENDOR_ICON} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col items-start min-w-0">
                    <p className="font-sans font-medium text-[16px] leading-[24px] text-black truncate">{v.category}</p>
                    <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#585858' }}>{v.comparing} comparing</p>
                  </div>
                </div>
                {/* Expand/collapse */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggle(v.id)}
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.05)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={isExpanded ? IMG_CARET_UP : IMG_CARET_DOWN} alt="" className="w-[20px] h-[20px] object-contain" />
                </motion.button>
              </div>

              {/* Dash tracker */}
              <div className={`w-full ${isExpanded ? 'pt-[23px]' : 'py-[24px]'}`}>
                <DashTracker />
              </div>

              {/* Expanded vendors section */}
              <AnimatePresence initial={false}>
                {isExpanded && v.vendors.length > 0 && (
                  <motion.div
                    key="vendors"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden w-full"
                  >
                    <div className="flex flex-col gap-[12px] items-start p-[24px] w-full" style={{ background: '#e8e8e8' }}>
                      <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#585858' }}>Vendors</p>
                      {v.vendors.map((vendor, vi) => (
                        <div key={vendor.name} className="w-full">
                          {vi > 0 && <div className="w-full h-px mb-[12px]" style={{ background: '#d0d0d0' }} />}
                          <div className="flex flex-col gap-[0px] items-start whitespace-nowrap">
                            <p className="font-sans font-medium text-[14px] leading-[20px] text-black">{vendor.name}</p>
                            <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#585858' }}>{vendor.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {isExpanded && v.vendors.length === 0 && (
                  <div className="pb-[24px]" />
                )}
              </AnimatePresence>

              {!isExpanded && <div />}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

// ── Package Picker Sheet ──────────────────────────────────────────────────────
function PackagePickerSheet({
  open, vendor, initialTier, onClose, onConfirm,
}: {
  open: boolean
  vendor: VendorItem | null
  initialTier?: string
  onClose: () => void
  onConfirm: (tier: string) => void
}) {
  const [selected, setSelected] = useState<string | undefined>(initialTier)

  // Sync selection when vendor changes
  useEffect(() => {
    setSelected(initialTier ?? vendor?.packages?.[0]?.tier)
  }, [vendor, initialTier])

  if (!vendor || !vendor.packages?.length) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120) onClose() }}
            className="fixed left-0 right-0 bottom-0 z-[70] mx-auto rounded-t-[20px] overflow-hidden flex flex-col"
            style={{ background: '#f5f5f5', maxWidth: 390, maxHeight: '92dvh' }}
          >
            {/* Grabber + header */}
            <div className="shrink-0 flex flex-col items-center pt-[12px] pb-[8px] bg-[#f5f5f5]">
              <div className="w-[44px] h-[4px] rounded-full" style={{ background: '#d0d0d0' }} />
            </div>
            <div className="shrink-0 flex items-start justify-between px-[20px] pb-[16px]">
              <div className="flex flex-col gap-[2px]">
                <p className="font-sans font-semibold text-[11px] tracking-[1.2px] uppercase" style={{ color: '#767676' }}>{vendor.name}</p>
                <h2 className="font-serif text-[24px] leading-[30px] text-black">Choose your package</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.05)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="#2b2b27" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Package cards (scrollable) */}
            <div className="flex-1 overflow-y-auto px-[16px] pb-[16px]">
              <div className="flex flex-col gap-[12px]">
                {vendor.packages.map((pkg) => {
                  const isSelected = selected === pkg.tier
                  return (
                    <motion.button
                      key={pkg.tier}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelected(pkg.tier)}
                      className="text-left rounded-[12px] overflow-hidden w-full flex flex-col"
                      style={{
                        background: 'white',
                        border: `1.5px solid ${isSelected ? '#1e1e1e' : '#e8e8e8'}`,
                        boxShadow: isSelected ? '0 4px 18px rgba(0,0,0,0.08)' : 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      <div className="flex items-start justify-between gap-[12px] px-[20px] pt-[20px]">
                        <div className="flex flex-col gap-[6px] min-w-0">
                          <p className="font-sans font-semibold text-[11px] tracking-[1.2px] uppercase" style={{ color: '#8e6434' }}>{pkg.tier}</p>
                          <p className="font-serif text-[22px] leading-[28px] text-black">{pkg.price}</p>
                        </div>
                        {/* Radio */}
                        <span
                          className="shrink-0 rounded-full flex items-center justify-center"
                          style={{
                            width: 22, height: 22,
                            border: `1.5px solid ${isSelected ? '#1e1e1e' : '#b4b4b4'}`,
                            background: isSelected ? '#1e1e1e' : 'transparent',
                          }}
                        >
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </div>
                      <p className="font-sans text-[13px] leading-[20px] px-[20px] pt-[6px]" style={{ color: '#585858' }}>
                        {pkg.blurb}
                      </p>
                      <ul className="flex flex-col gap-[8px] px-[20px] py-[16px]">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-[10px]">
                            <span className="shrink-0 mt-[6px] rounded-full" style={{ width: 4, height: 4, background: '#8e6434' }} />
                            <span className="font-sans text-[13px] leading-[20px] text-black">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 px-[16px] pt-[8px] pb-[24px] border-t" style={{ borderColor: '#e8e8e8', background: '#f5f5f5' }}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!selected}
                onClick={() => selected && onConfirm(selected)}
                className="w-full h-[48px] rounded-full font-sans font-medium text-[15px] leading-[20px] flex items-center justify-center"
                style={{
                  background: selected ? 'black' : '#b4b4b4',
                  color: 'white',
                  opacity: selected ? 1 : 0.7,
                }}
              >
                {selected ? `Add ${selected} to your plan` : 'Select a package'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VendorsPage() {
  const [activeTab, setActiveTab]   = useState(0)
  const [vendors, setVendors]       = useState(INITIAL_VENDORS)
  const [pkgIndex, setPkgIndex]     = useState<number | null>(null)

  function toggleAdded(i: number)    { setVendors(p => p.map((v, idx) => idx === i ? { ...v, added: !v.added }         : v)) }
  function toggleRegistry(i: number) { setVendors(p => p.map((v, idx) => idx === i ? { ...v, registryOn: !v.registryOn } : v)) }
  function openPackages(i: number)   { setPkgIndex(i) }
  function closePackages()           { setPkgIndex(null) }
  function confirmPackage(tier: string) {
    if (pkgIndex === null) return
    setVendors(p => p.map((v, idx) => idx === pkgIndex ? { ...v, selectedPackage: tier, added: true } : v))
    setPkgIndex(null)
  }

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh items-center" style={{ background: '#f5f5f5' }}>

        <PortalHeader />
        <PortalMenu active="Vendors" />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-[4px] items-start overflow-hidden pb-[24px] pt-[24px] px-[16px] w-full text-black"
        >
          <p className="font-serif text-[36px] leading-[40px] whitespace-nowrap">Build your team.</p>
          <p className="font-sans font-light text-[14px] leading-[20px] w-[330px]">
            Every vendor has worked at properties like yours, is concierge-approved, and unlocks the Exclusive All-In Discount — typically 8–18% off published rates.
          </p>
        </motion.div>

        {/* Allie card — content switches per tab */}
        <AnimatePresence mode="wait">
          {activeTab === 0 ? (
            <motion.div
              key="allie-mkt"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-[14px] items-start overflow-hidden p-[24px] w-full shrink-0"
              style={{ background: '#585858' }}
            >
              <div className="flex gap-[6px] items-center overflow-hidden shrink-0">
                <div className="w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_DIAMOND_MKT} alt="" className="w-[14px] h-[14px] object-contain" />
                </div>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">MATCHED BY ALLIE</p>
              </div>
              <p className="font-sans font-medium text-[16px] leading-[24px] text-white w-full">
                Photography and florals book out 12+ months ahead — lock these in first.
              </p>
              <div className="flex items-center justify-between w-full">
                <p className="font-sans text-[16px] leading-[24px] text-white whitespace-nowrap">Have more questions?</p>
                <button className="flex items-center h-[36px] px-[18px] py-[8px] rounded-full font-sans font-light text-[14px] text-black whitespace-nowrap" style={{ background: '#f5f5f5' }}>
                  Ask Allie
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="allie-mgt"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-[14px] items-start overflow-hidden p-[24px] w-full shrink-0"
              style={{ background: '#585858' }}
            >
              <div className="flex gap-[6px] items-center overflow-hidden shrink-0">
                <div className="w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_DIAMOND_MGT} alt="" className="w-[14px] h-[14px] object-contain" />
                </div>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">ALLIE&apos;S NOTE</p>
              </div>
              <div className="flex flex-col items-start w-full">
                <p className="font-sans font-medium text-[16px] leading-[24px] text-white w-full">Sign contract · Luna &amp; Co.</p>
                <p className="font-sans text-[14px] leading-[20px] w-full" style={{ color: '#d0d0d0' }}>Deposit $2,400 due May 30</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="font-sans text-[16px] leading-[24px] text-white whitespace-nowrap">Have more questions?</p>
                <button className="flex items-center h-[36px] px-[18px] py-[8px] rounded-full font-sans font-light text-[14px] text-black whitespace-nowrap" style={{ background: '#f5f5f5' }}>
                  Ask Allie
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Segmented tabs */}
        <div className="flex flex-col items-center py-[12px] shrink-0">
          <div className="flex gap-[2px] items-start overflow-hidden rounded-full" style={{ background: '#e8e8e8' }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(0)}
              className="flex items-center justify-center py-[10px] px-[16px] rounded-full whitespace-nowrap font-sans text-[14px] leading-[20px]"
              style={{
                background: activeTab === 0 ? 'black' : 'transparent',
                color:      activeTab === 0 ? 'white' : '#969696',
              }}
            >
              Marketplace
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(1)}
              className="flex items-center justify-center py-[10px] rounded-full whitespace-nowrap font-sans text-[14px] leading-[20px]"
              style={{
                width:      120,
                background: activeTab === 1 ? 'black' : 'transparent',
                color:      activeTab === 1 ? 'white' : '#585858',
              }}
            >
              Manage
            </motion.button>
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 0
              ? <MarketplaceContent vendors={vendors} onToggleAdded={toggleAdded} onToggleRegistry={toggleRegistry} onOpenPackages={openPackages} />
              : <ManageContent />
            }
          </motion.div>
        </AnimatePresence>

        <PortalFooter />
      </div>

      <PackagePickerSheet
        open={pkgIndex !== null}
        vendor={pkgIndex !== null ? vendors[pkgIndex] : null}
        initialTier={pkgIndex !== null ? vendors[pkgIndex].selectedPackage : undefined}
        onClose={closePackages}
        onConfirm={confirmPackage}
      />
    </div>
  )
}
