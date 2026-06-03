'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import PortalHeader from '@/components/PortalHeader'

const IMG_DIAMOND   = "https://www.figma.com/api/mcp/asset/97bb408a-9337-40c5-9960-1ca089aa7f0d"
const IMG_PLUS      = "https://www.figma.com/api/mcp/asset/6e39dc49-69d7-4d5c-b9e8-9f5c2ef83655"
const IMG_ARROW     = "https://www.figma.com/api/mcp/asset/40037376-aaee-4dc3-8fc6-84c115614b09"

type InviteStatus = 'confirmed' | 'sent' | 'notsent'
type RsvpState    = 'yes' | 'no' | 'pending' | 'na' // 'na' = not applicable (e.g. day guest can't book a room)

interface Guest {
  name: string
  sub: string
  invite: InviteStatus
  rehearsal: RsvpState // RSVPed to Rehearsal Dinner
  ceremony:  RsvpState // RSVPed to Ceremony
  room:      RsvpState // Booked a Room Block
  arrival?:  string    // e.g. "Apr 26"
  departure?:string    // e.g. "Apr 30"
}

const GUESTS: Guest[] = [
  // Close family — invited to rehearsal, ceremony, with room block
  { name: "Sara's parents",      sub: 'Staying · 2 guests', invite: 'confirmed', rehearsal: 'yes', ceremony: 'yes', room: 'yes', arrival: 'Apr 25', departure: 'May 1'  },
  { name: "Evan's parents",      sub: 'Staying · 2 guests', invite: 'confirmed', rehearsal: 'yes', ceremony: 'yes', room: 'yes', arrival: 'Apr 25', departure: 'May 1'  },
  // Bridal party / wedding party — invited to rehearsal
  { name: 'Tom & Marci Harlow',  sub: 'Staying · 2 guests', invite: 'confirmed', rehearsal: 'yes', ceremony: 'yes', room: 'yes', arrival: 'Apr 27', departure: 'Apr 30' },
  // Friends — ceremony + room block but not rehearsal
  { name: 'Kara & Chris Johnson',sub: 'Staying · 2 guests', invite: 'confirmed', rehearsal: 'no',  ceremony: 'yes', room: 'yes', arrival: 'Apr 26', departure: 'Apr 30' },
  // Invited, waiting on response
  { name: 'Sara Morales',        sub: 'Staying · 1 guest',  invite: 'sent',      rehearsal: 'no',  ceremony: 'pending', room: 'pending' },
  // Day guests — can attend ceremony, not staying (no room block, no rehearsal)
  { name: 'Marcus Johnson',      sub: 'Day guest',          invite: 'notsent',   rehearsal: 'na',  ceremony: 'pending', room: 'na' },
  { name: 'Jane Smith',          sub: 'Day guest',          invite: 'notsent',   rehearsal: 'na',  ceremony: 'pending', room: 'na' },
  // Not yet invited
  { name: 'Emily & Chris Monet', sub: 'Staying · 2 guests', invite: 'notsent',   rehearsal: 'no',  ceremony: 'pending', room: 'pending' },
  { name: 'Darryl Scott',        sub: 'Day guest',          invite: 'notsent',   rehearsal: 'na',  ceremony: 'pending', room: 'na' },
]

// Top stats — across the full 150-person guest list (the table is a sample)
const SUMMARY = {
  rehearsal: { confirmed: 32,  total: 38  }, // intimate rehearsal-dinner list
  ceremony:  { confirmed: 89,  total: 150 }, // full wedding ceremony
  room:      { confirmed: 51,  total: 86  }, // staying guests with a room block booked
}

// ── Small RSVP indicator (R / C / B with state) ──────────────────────────────
// Always rendered inside a fixed 32px grid cell so columns align across all rows.
function RsvpDot({ tag, state }: { tag: string; state: RsvpState }) {
  const base = 'flex items-center justify-center rounded-full w-[32px] h-[32px] mx-auto'
  if (state === 'yes') {
    return (
      <div className={base} style={{ background: '#646f53' }} aria-label={`${tag} confirmed`}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  if (state === 'pending') {
    return (
      <div className={base} style={{ border: '1.5px dashed #d0d0d0' }} aria-label={`${tag} pending`}>
        <p className="font-sans font-medium text-[12px] leading-[16px]" style={{ color: '#b4b4b4' }}>{tag}</p>
      </div>
    )
  }
  if (state === 'no') {
    return (
      <div className={base} style={{ border: '1.5px solid #e8e8e8', background: 'white' }} aria-label={`${tag} declined or not invited`}>
        <p className="font-sans font-light text-[14px] leading-[16px]" style={{ color: '#d0d0d0' }}>—</p>
      </div>
    )
  }
  // 'na' — not applicable; still occupies the full 32x32 slot
  return (
    <div className={base} style={{ background: 'transparent' }} aria-hidden>
      <span className="block w-[12px] h-px" style={{ background: '#e8e8e8' }} />
    </div>
  )
}

// Shared grid for the three R / C / B indicator columns (used by header + rows)
const RSVP_GRID_CLASS = 'grid grid-cols-3 gap-[6px] shrink-0 w-[108px]'

const FILTERS = ['All · 23', 'Staying · 18', 'Day guests · 5']

export default function GuestListPage() {
  const [activeFilter, setActiveFilter] = useState(0)
  const router = useRouter()

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>

        <PortalHeader />
        <PortalMenu active="Guest List" />

        <div className="flex flex-col gap-[24px] items-start overflow-hidden py-[24px] w-full">

          {/* Section header */}
          <div className="flex items-center justify-between overflow-hidden px-[24px] w-full">
            <p className="font-serif text-[36px] leading-[40px] text-black whitespace-nowrap">Guest List</p>
            <button
              className="flex gap-[6px] h-[36px] items-center justify-center px-[14px] py-[8px] rounded-full font-sans font-light text-[14px] text-black whitespace-nowrap"
              style={{ border: '1px solid #767676' }}
            >
              Import CSV
            </button>
          </div>

          {/* Allie card + Stats + See Invite Page */}
          <div className="flex flex-col items-start w-full">
            {/* Allie */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-[14px] items-start overflow-hidden p-[24px] w-full"
              style={{ background: '#585858' }}
            >
              <div className="flex gap-[6px] items-center overflow-hidden shrink-0">
                <div className="w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_DIAMOND} alt="" className="w-[14px] h-[14px] object-contain" />
                </div>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">
                  ALLIE
                </p>
              </div>
              <p className="font-sans text-[16px] leading-[24px] text-white w-full">
                Allie and the Nobu Wedding Concierge will be available to book flights and transportation.
              </p>
              <div className="flex items-center justify-between w-full">
                <p className="font-sans text-[16px] leading-[24px] text-white whitespace-nowrap">Have more questions? </p>
                <button className="flex items-center h-[36px] px-[18px] py-[8px] rounded-full font-sans font-light text-[14px] text-black whitespace-nowrap" style={{ background: '#f5f5f5' }}>
                  Ask Allie
                </button>
              </div>
            </motion.div>

            {/* RSVP Stats — Rehearsal Dinner · Ceremony · Room Block */}
            <div className="flex items-stretch overflow-hidden px-[16px] py-[16px] w-full bg-white">
              {[
                { tag: 'R', n: SUMMARY.rehearsal.confirmed, total: SUMMARY.rehearsal.total, label: 'RSVPed to',     line2: 'Rehearsal Dinner' },
                { tag: 'C', n: SUMMARY.ceremony.confirmed,  total: SUMMARY.ceremony.total,  label: 'RSVPed to',     line2: 'Ceremony'         },
                { tag: 'B', n: SUMMARY.room.confirmed,      total: SUMMARY.room.total,      label: 'Booked a',      line2: 'Room Block'       },
              ].map((stat, i) => (
                <div key={stat.line2} className="flex items-stretch flex-1 min-w-0">
                  {i > 0 && <div className="w-px shrink-0 mx-[4px]" style={{ background: '#e8e8e8' }} />}
                  <div className="flex flex-col gap-[2px] items-center flex-1 min-w-0 overflow-hidden">
                    {/* Big count */}
                    <div className="flex items-baseline gap-[2px] whitespace-nowrap">
                      <p className="font-serif text-[24px] leading-[28px] text-black">{stat.n}</p>
                      <p className="font-sans text-[11px] leading-[16px]" style={{ color: '#b4b4b4' }}>/ {stat.total}</p>
                    </div>
                    {/* Label */}
                    <p className="font-sans text-[10px] leading-[14px] tracking-[0.4px] uppercase text-center" style={{ color: '#969696' }}>{stat.label}</p>
                    <p className="font-sans font-medium text-[10px] leading-[14px] tracking-[0.4px] uppercase text-center" style={{ color: '#2b2b27' }}>{stat.line2}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* See Guest Invite Page */}
            <div className="flex flex-col items-end w-full" style={{ background: '#e8e8e8' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/guest-invite')}
                className="flex gap-[6px] items-center justify-center px-[14px] py-[8px]"
              >
                <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#767676' }}>
                  See Guest Invite Page
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_ARROW} alt="" className="w-[16px] h-[16px] object-contain" />
              </motion.button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-[8px] items-center justify-center overflow-hidden w-full pt-[24px]">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                onClick={() => setActiveFilter(i)}
                className="flex items-center justify-center overflow-hidden px-[14px] py-[7px] rounded-full font-sans text-[12px] leading-[16px] whitespace-nowrap"
                style={{
                  background: activeFilter === i ? 'black' : 'white',
                  color:      activeFilter === i ? 'white' : '#969696',
                  border:     activeFilter === i ? '1px solid black' : '1px solid #d0d0d0',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Guest table */}
          <div className="flex flex-col gap-[24px] items-start px-[24px] w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white flex flex-col items-start overflow-hidden rounded-[12px] w-full"
              style={{ border: '1px solid #d0d0d0' }}
            >
              {/* Table header */}
              <div className="flex items-center justify-between overflow-hidden pl-[16px] pr-[12px] py-[10px] w-full" style={{ background: '#e8e8e8' }}>
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#969696' }}>NAME</p>
                <div className={RSVP_GRID_CLASS}>
                  {[
                    { tag: 'R', label: 'Rehearsal Dinner' },
                    { tag: 'C', label: 'Ceremony' },
                    { tag: 'B', label: 'Booked Room Block' },
                  ].map((h) => (
                    <div key={h.tag} className="flex items-center justify-center w-[32px] mx-auto" title={h.label}>
                      <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-center" style={{ color: '#969696' }}>{h.tag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest rows */}
              {GUESTS.map((guest, i) => (
                <div key={guest.name}>
                  {i > 0 && <div className="h-px w-full" style={{ background: i % 4 === 0 ? '#d0d0d0' : '#e8e8e8' }} />}
                  <div className="flex items-center justify-between overflow-hidden pl-[16px] pr-[12px] py-[12px] w-full bg-white gap-[8px]">
                    <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-[8px] whitespace-nowrap">
                        <p className="font-sans font-medium text-[15px] leading-[22px] text-black truncate">{guest.name}</p>
                        {guest.invite === 'notsent' && (
                          <span className="shrink-0 px-[6px] py-[1px] rounded-full font-sans font-medium text-[9px] tracking-[0.4px] uppercase" style={{ background: '#f1ead7', color: '#8e6434' }}>
                            Not sent
                          </span>
                        )}
                      </div>
                      <p className="font-sans font-light text-[13px] leading-[18px] whitespace-nowrap" style={{ color: '#969696' }}>{guest.sub}</p>
                      {guest.arrival && guest.departure ? (
                        <div className="flex items-center gap-[4px] mt-[2px] whitespace-nowrap">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                            <path d="M10.5 5.5L7.5 3v1.5l-3 1L1 4v1.5l3 2v1.5l-1.5.5V11l3-1 3 1V9.5L7 9V7.5L10.5 5.5z" stroke="#8e6434" strokeWidth="0.9" strokeLinejoin="round" />
                          </svg>
                          <p className="font-sans font-medium text-[11px] leading-[16px] tracking-[0.2px]" style={{ color: '#8e6434' }}>
                            {guest.arrival} <span aria-hidden style={{ color: '#b4b4b4' }}>→</span> {guest.departure}
                          </p>
                        </div>
                      ) : guest.sub.startsWith('Staying') ? (
                        <p className="font-sans text-[11px] leading-[16px] mt-[2px] italic whitespace-nowrap" style={{ color: '#b4b4b4' }}>
                          Travel dates pending
                        </p>
                      ) : null}
                    </div>
                    {/* Three RSVP indicators: R / C / B (fixed 3-col grid for alignment) */}
                    <div className={RSVP_GRID_CLASS}>
                      {([
                        { key: 'rehearsal', tag: 'R', state: guest.rehearsal },
                        { key: 'ceremony',  tag: 'C', state: guest.ceremony },
                        { key: 'room',      tag: 'B', state: guest.room },
                      ] as const).map(({ key, tag, state }) => (
                        <RsvpDot key={key} tag={tag} state={state} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* + Add party button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex gap-[8px] h-[44px] items-center justify-center px-[24px] py-[12px] rounded-full w-full font-sans font-medium text-[16px] text-black"
              style={{ border: '1px solid #767676' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_PLUS} alt="" className="w-[20px] h-[20px] object-contain" />
              Add party
            </motion.button>
          </div>
        </div>

        <PortalFooter />
      </div>
    </div>
  )
}
