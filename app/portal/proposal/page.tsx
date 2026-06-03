'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DownloadSimple, Export } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import PortalHeader from '@/components/PortalHeader'

// ── Assets ────────────────────────────────────────────────
const IMG_BG        = "https://www.figma.com/api/mcp/asset/d597a4d4-3e90-44e0-9612-b43a7393f8f2"
const IMG_CHECK     = "https://www.figma.com/api/mcp/asset/509825d7-9949-43b4-92e6-5dcce01b8279"
const IMG_AD_BG     = "https://www.figma.com/api/mcp/asset/2cb0c658-fbe6-448f-9a3d-9d923daf6aab"

// Guest Folio — room images (from 797:14492)
const IMG_ROOM_1    = "https://www.figma.com/api/mcp/asset/14bdc42e-d238-458a-a99f-409dc4ff41a5"
const IMG_ROOM_2    = "https://www.figma.com/api/mcp/asset/1e60a933-782a-45cb-8291-6436e74f6c72"
const IMG_ROOM_3    = "https://www.figma.com/api/mcp/asset/b3f5b5c0-52c8-4a0b-8392-c139aed43906"

// ── Data ──────────────────────────────────────────────────
const TABS = ['Core Plan', 'Add-ons', 'Guest Folio']

const CORE_PLAN_ITEMS = [
  '4hr Reception',
  '4hr Private Event',
  'Nondenominational Minister to perform symbolic',
  'Honeymoon Wishes Website and Wedding Registry',
]

const ADDON_ROWS = [
  { name: 'Free Spirit ceremony',     sub: '',                                   price: '$3,500'  },
  { name: 'Sunset yacht welcome',     sub: 'El Arco cruise · 100 guests · 4 hrs', price: '$12,000' },
  { name: 'Photography + video',      sub: 'Outside vendor · vendor fee applies', price: '$2,000'  },
  { name: 'Florals & décor',          sub: 'Arch, aisle, centerpieces',           price: '$6,000'  },
]

const ROOM_STATS = [
  { value: '30',  label: 'ROOMS'     },
  { value: '150', label: 'GUESTS'    },
  { value: '3',   label: 'NIGHTS'    },
  { value: '22',  label: 'CONFIRMED' },
]

const ROOM_CARDS = [
  { img: IMG_ROOM_1, title: 'Deluxe Room',       sub: 'King Bed or Two Queen Bed', price: '$700', alloc: '14', total: '16' },
  { img: IMG_ROOM_2, title: 'Deluxe Ocean View', sub: 'King · Private terrace',    price: '$800', alloc: '6',  total: '8'  },
  { img: IMG_ROOM_3, title: 'Junior Suite',       sub: 'King Bed or Two Queen Bed', price: '$900', alloc: '4',  total: '6'  },
]

// ── Price footer (shared by all tabs) ─────────────────────
function PriceBar() {
  return (
    <div className="flex flex-col items-start w-full shrink-0">
      <div className="flex items-center justify-between px-[16px] py-[12px] w-full whitespace-nowrap" style={{ background: '#8a9a8a' }}>
        <p className="font-sans text-[14px] leading-[20px] text-black">TOTAL SAVED</p>
        <p className="font-serif text-[20px] text-black">-$14,000</p>
      </div>
      <div className="flex flex-col items-start overflow-hidden rounded-bl-[12px] rounded-br-[12px] w-full" style={{ background: '#2b2b27' }}>
        <div className="flex items-center justify-center pt-[8px] w-full">
          <div className="h-[3px] w-[28px] rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>
        <div className="flex items-baseline justify-between pb-[12px] pt-[9px] px-[14px] w-full whitespace-nowrap">
          <p className="font-sans font-medium text-[8px] tracking-[1.2px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            ESTIMATED PRICE
          </p>
          <p className="font-serif text-[28px] text-white">$4,792</p>
        </div>
      </div>
    </div>
  )
}

// ── Tab content components ────────────────────────────────
function CorePlanContent() {
  return (
    <div className="flex flex-col items-start flex-1 min-h-0 w-full">
      <div className="flex items-center pt-[12px] px-[16px] shrink-0">
        <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
          What&apos;s included
        </p>
      </div>
      <div className="flex gap-[12px] items-center px-[16px] py-[14px] shrink-0 w-full">
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] leading-[20px] text-black whitespace-nowrap">Free Spirit ceremony</p>
        </div>
        <p className="font-serif text-[22px] leading-[normal] text-black whitespace-nowrap" style={{ letterSpacing: '-0.4px' }}>$3,500</p>
      </div>
      <div className="flex flex-col items-start px-[12px] w-full shrink-0">
        {CORE_PLAN_ITEMS.map((item, i) => (
          <div key={item} className="flex gap-[8px] items-start py-[8px] w-full" style={{ borderBottom: i < CORE_PLAN_ITEMS.length - 1 ? '0.5px solid #d0d0d0' : 'none' }}>
            <div className="shrink-0 w-[24px] h-[24px] flex items-start justify-center pt-[2px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_CHECK} alt="" className="w-[18px] h-[18px] object-contain" />
            </div>
            <p className="flex-1 font-sans text-[14px] leading-[20px] min-w-0" style={{ color: '#525249' }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddOnsContent() {
  return (
    <div className="flex flex-col items-start flex-1 min-h-0 w-full">
      <div className="flex items-center pt-[12px] px-[16px] shrink-0">
        <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
          What&apos;s included
        </p>
      </div>
      {ADDON_ROWS.map((row, i) => (
        <div key={row.name}>
          {i > 0 && i < 2 && <div className="h-px w-full" style={{ background: '#dad6ce' }} />}
          {i === 2 && <div className="h-px w-full" style={{ background: '#dad6ce' }} />}
          {i === 3 && <div className="h-px w-full" style={{ background: '#dad6ce' }} />}
          <div className="flex gap-[12px] items-center px-[16px] py-[14px] w-full shrink-0">
            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
              <p className="font-sans text-[14px] leading-[20px] text-black whitespace-nowrap">{row.name}</p>
              {row.sub && (
                <p className="font-sans text-[12px] leading-[16px] whitespace-nowrap" style={{ color: '#585858' }}>{row.sub}</p>
              )}
            </div>
            <p className="font-serif text-[22px] leading-[normal] text-black whitespace-nowrap shrink-0" style={{ letterSpacing: '-0.4px' }}>{row.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function GuestFolioContent() {
  return (
    <div className="flex flex-col items-start flex-1 min-h-0 w-full overflow-hidden">
      {/* ROOM BLOCK header */}
      <div className="flex items-center justify-between pt-[12px] px-[16px] shrink-0 w-full">
        <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
          Room Block
        </p>
        <button className="font-sans font-medium text-[14px] leading-[20px] py-[8px]" style={{ color: '#767676' }}>
          Edit
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-[12px] items-start px-[16px] py-[16px] shrink-0 w-full">
        {ROOM_STATS.map((stat, i) => (
          <div key={stat.label} className="flex flex-col gap-[4px] items-center flex-1 min-w-0 overflow-hidden whitespace-nowrap">
            {i > 0 && (
              <div className="absolute" />
            )}
            <p className="font-serif text-[24px] leading-[36px] text-black">{stat.value}</p>
            <p className="font-sans text-[12px] leading-[16px] text-center" style={{ color: '#969696' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Divider strip — still 30 days */}
      <div className="flex items-center px-[16px] shrink-0 w-full" style={{ background: '#e8e8e8', height: 30 }}>
        <p className="flex-1 font-sans text-[12px] leading-[16px] text-center" style={{ color: '#585858' }}>
          You can still edit room blocks for the next 30 days
        </p>
      </div>

      {/* ROOM TYPES — scrollable */}
      <div className="flex flex-col items-start overflow-y-auto py-[24px] flex-1 min-h-0 w-full">
        <div className="flex items-center px-[16px] py-[12px] shrink-0 w-full">
          <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
            Room Types
          </p>
        </div>
        <div className="flex flex-col gap-[10px] items-start px-[16px] w-full">
          {ROOM_CARDS.map((room, i) => (
            <motion.div
              key={room.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.06 }}
              className="flex flex-col items-start overflow-hidden rounded-[8px] w-full"
              style={{ background: 'white', border: '1px solid #d0d0d0' }}
            >
              {/* Room photo */}
              <div className="relative w-full shrink-0" style={{ height: 80 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={room.img} alt={room.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {/* Room info */}
              <div className="flex items-start px-[16px] py-[16px] w-full">
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#2b2b27' }}>
                    {room.title}
                  </p>
                  <p className="font-sans text-[14px] leading-[20px]" style={{ color: '#969696' }}>{room.sub}</p>
                </div>
                <div className="flex flex-col gap-[2px] items-end shrink-0">
                  <p className="font-sans font-medium text-[14px] leading-[20px]" style={{ color: '#2b2b27' }}>{room.price}</p>
                  <p className="font-sans text-[12px] leading-[16px]" style={{ color: '#969696' }}>/ night</p>
                </div>
              </div>
              {/* Divider */}
              <div className="h-px w-full shrink-0" style={{ background: '#dad6ce' }} />
              {/* Allocated row */}
              <div className="flex items-center gap-[6px] px-[16px] py-[10px] w-full">
                <p className="font-sans text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#646f53' }}>Allocated</p>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#2b2b27' }}>
                  {room.alloc}<span style={{ color: '#969696' }}>/{room.total}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function ProposalPage() {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>

        <PortalHeader />
        <PortalMenu active="Proposal" />

        {/* ── Main image / hero section ── */}
        <div className="relative flex flex-col gap-[12px] items-center pb-[24px] pt-[12px] w-full">
          {/* BG image */}
          <div className="absolute inset-0 overflow-hidden" style={{ filter: 'blur(1px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          </div>

          {/* Share buttons */}
          <div className="relative flex gap-[12px] items-start justify-end px-[18px] w-full">
            <button className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <DownloadSimple size={18} weight="regular" color="white" />
            </button>
            <button className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Export size={18} weight="regular" color="white" />
            </button>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col gap-[4px] items-start px-[16px] w-full text-white"
          >
            <p className="font-serif text-[36px] leading-[40px] text-white">Every line, locked.</p>
            <p className="font-sans text-[13px] leading-[21px] text-white">Nobu Hotel Los Cabos | Stone Garden</p>
            <p className="font-sans text-[13px] leading-[21px] text-white">April 28, 2027  | 150 Guests</p>
          </motion.div>

          {/* Segmented tabs */}
          <div className="relative flex flex-col items-center">
            <div className="flex items-start justify-between overflow-hidden rounded-full w-[358px]" style={{ background: '#e8e8e8' }}>
              {TABS.map((tab, i) => (
                <motion.button
                  key={tab}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center justify-center py-[10px] rounded-full transition-colors duration-200"
                  style={{
                    width: 358 / 3,
                    background: activeTab === i ? 'black' : 'transparent',
                    color: activeTab === i ? 'white' : '#969696',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    lineHeight: '20px',
                  }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Breakdown card — content switches by tab */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative bg-white rounded-[12px] overflow-hidden w-[358px] flex flex-col"
            style={{ minHeight: activeTab === 2 ? 500 : 'auto', maxHeight: activeTab === 2 ? 560 : 'none' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col flex-1 min-h-0 w-full"
                style={{ display: 'flex' }}
              >
                {activeTab === 0 && <CorePlanContent />}
                {activeTab === 1 && <AddOnsContent />}
                {activeTab === 2 && <GuestFolioContent />}
              </motion.div>
            </AnimatePresence>
            <PriceBar />
          </motion.div>

          {/* Pagination dots */}
          <div className="relative flex items-center justify-center gap-[6px]">
            <div className="h-[6px] w-[27px] rounded-full" style={{ background: '#b4b4b4' }} />
            <div className="h-[6px] w-[6px] rounded-full" style={{ background: '#585858' }} />
            <div className="h-[6px] w-[6px] rounded-full" style={{ background: '#585858' }} />
          </div>
        </div>

        {/* ── Ad section ── */}
        <div className="relative flex flex-col items-start justify-end overflow-hidden p-[24px] w-full shrink-0" style={{ minHeight: 280 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_AD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative flex flex-col gap-[24px] items-start overflow-hidden p-[24px] w-full" style={{ background: 'rgba(43,43,39,0.6)' }}>
            <div className="flex flex-col gap-[4px] items-start text-white">
              <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap">
                Secure Your Creative Team
              </p>
              <p className="font-serif text-[30px] leading-[40px] w-[294px]">
                Bring your Wedding Vision to Life
              </p>
              <p className="font-sans text-[12px] leading-[16px] w-full">
                Meet the local artisans and experts ready to execute it. Access our exclusive marketplace to start booking your core creative team.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/portal/registry')}
              className="bg-black text-white font-sans font-light text-[14px] leading-[20px] rounded-full px-[18px] py-[8px] whitespace-nowrap"
            >
              Explore the Marketplace
            </motion.button>
          </div>
        </div>

        <PortalFooter />
      </div>
    </div>
  )
}
