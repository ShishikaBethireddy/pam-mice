'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ── Assets ──────────────────────────────────────────────
const IMG_LOGO      = "https://www.figma.com/api/mcp/asset/d6023047-c923-4e91-b257-0fa91806b8c5"
const IMG_HAMBURGER = "https://www.figma.com/api/mcp/asset/fb106dde-d63a-453c-81b4-f4251ae6f923"
const IMG_BELL      = "https://www.figma.com/api/mcp/asset/f846e373-2ce0-466e-99b6-11b438b3138a"
const IMG_HERO      = "https://www.figma.com/api/mcp/asset/165b5647-609c-403e-a6da-f589ff9aec29"
const IMG_ARROW     = "https://www.figma.com/api/mcp/asset/c16b7f39-2022-474b-93d4-dd59b330cc15"
const IMG_DIAMOND   = "https://www.figma.com/api/mcp/asset/842ef7d9-aaad-492f-a693-7c14c63f903d"

const IMG_ROOM_1    = "https://www.figma.com/api/mcp/asset/4640562e-3e6c-4e4b-887b-8717a5f45218"
const IMG_ROOM_2    = "https://www.figma.com/api/mcp/asset/655fbc68-52f7-48f8-a2e9-3b97244a5286"
const IMG_ROOM_3    = "https://www.figma.com/api/mcp/asset/6954b833-d91c-4b4e-9e29-e11645df9e6b"

const IMG_EVENT_1   = "https://www.figma.com/api/mcp/asset/750d5b00-0e33-4655-bbaf-9ea575d3f138"
const IMG_EVENT_2   = "https://www.figma.com/api/mcp/asset/d1b8712b-dadd-4370-b458-363dc02e81d8"
const IMG_EVENT_3   = "https://www.figma.com/api/mcp/asset/c860cc53-695a-4521-82a1-8942201ab811"
const IMG_EVENT_4   = "https://www.figma.com/api/mcp/asset/759f2717-71c9-446b-9509-74e58de22549"

const IMG_GIFT_1    = "https://www.figma.com/api/mcp/asset/d5c64783-df56-4cc2-a0c0-43f6c592e94a"
const IMG_GIFT_2    = "https://www.figma.com/api/mcp/asset/5c3b149a-b67d-4c12-9647-bd5a283ae83e"
const IMG_GIFT_3    = "https://www.figma.com/api/mcp/asset/39c03b0e-25e5-4475-bf45-9ab2b1af133e"

// ── Data ────────────────────────────────────────────────
const ROOMS = [
  { img: IMG_ROOM_1, title: 'Deluxe Room',       sub: 'King Bed or Two Queen Bed', price: '$700' },
  { img: IMG_ROOM_2, title: 'Deluxe Ocean View', sub: 'King Bed or Two Queen Bed', price: '$800' },
  { img: IMG_ROOM_3, title: 'Junior Suite',       sub: '1 King bed',               price: '$900' },
]

const EVENTS = [
  {
    day: 'WED', date: '26', type: 'Arrival evening',
    title: 'Beyond the Agave', sub: '7:00 PM · Muna Restaurant & M Bar',
    img: IMG_EVENT_1, allie: null, join: null,
  },
  {
    day: 'WED', date: '26', type: null,
    title: 'Outdoor Adventures', sub: 'ATV through the desert, zipline, Sierra de la Laguna trails',
    img: IMG_EVENT_2,
    allie: 'Rehearsal dinner is at 6 PM — your whole morning is yours. This is the day for the big adventure.',
    join: 'Join this excursion',
  },
  {
    day: 'Fri', date: '28', type: 'Wedding day',
    title: 'Get ready the right way', sub: '10:00 AM · Esencia Wellness Spa',
    title2: 'Ceremony & Reception', sub2: '5:30 PM · Shiawase Terrace',
    img: IMG_EVENT_3, allie: null, join: null,
  },
  {
    day: 'Fri', date: '28', type: 'Morning after',
    title: 'Pools & Cabanas', sub: '11:00 AM · Pacific Pool',
    img: IMG_EVENT_4, allie: null, join: null,
  },
]

const GIFTS = [
  { img: IMG_GIFT_1, name: 'Luxury Floral Arrangement', price: '$269.99' },
  { img: IMG_GIFT_2, name: 'Photographer Session',      price: '$949.99' },
  { img: IMG_GIFT_3, name: 'Music & Entertainment',     price: '$3,500'  },
]

// ── Header ──────────────────────────────────────────────
function GuestHeader() {
  return (
    <div className="sticky top-0 z-30 flex flex-col shrink-0" style={{ background: '#2b2b27' }}>
      {/* WEDDINGS bar */}
      <div className="flex items-center justify-center" style={{ background: '#b4b4b4', height: 20 }}>
        <p className="font-sans text-[10px] tracking-[1.5px] text-black">MEETINGS & EVENTS</p>
      </div>
      {/* Main bar */}
      <div className="flex items-center justify-between gap-[50px] px-[16px]" style={{ height: 60 }}>
        {/* Hamburger */}
        <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_HAMBURGER} alt="Menu" className="w-[22px] h-[16px] object-contain" style={{ filter: 'invert(1)' }} />
        </div>
        {/* Logo */}
        <div className="flex-1 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_LOGO} alt="Nobu Hotel Los Cabos" className="h-[28px] object-contain" />
        </div>
        {/* Bell */}
        <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_BELL} alt="Concierge" className="w-[26px] h-[26px] object-contain" style={{ filter: 'invert(1)' }} />
        </div>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────
export default function GuestInvitePage() {
  const router = useRouter()
  const [rsvpDone, setRsvpDone] = useState(false)

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>

        <GuestHeader />

        {/* ── Hero ── */}
        <div
          className="relative flex flex-col items-start justify-end overflow-hidden px-[24px] pb-[31px] shrink-0"
          style={{ height: 420 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative flex flex-col gap-[8px] items-start w-[327px]"
          >
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#969696' }}>
              YOU&apos;RE INVITED
            </p>
            <p
              className="font-serif italic text-[48px] leading-[52px] text-white"
              style={{ letterSpacing: '-0.4px' }}
            >
              Sara &amp; Evan
            </p>
            <p className="font-sans font-medium text-[14px] leading-[20px] text-white">
              Saturday, August 28th, 2027
            </p>
            <p className="font-sans font-light text-[14px] leading-[20px] text-white">
              Nobu Hotel Los Cabos
            </p>
          </motion.div>
        </div>

        {/* ── RSVP Section ── */}
        <div className="flex flex-col items-center px-[20px] py-[24px] w-full shrink-0" style={{ background: 'white' }}>
          <p className="font-sans text-[14px] leading-[20px] text-center w-[335px]" style={{ color: '#969696' }}>
            We can&apos;t wait to celebrate with you in Los Cabos. Let us know you&apos;re coming so we can make sure everything is ready.
          </p>
          <div style={{ height: 20 }} />
          <div className="flex items-center px-[14px] py-[6px] rounded-full">
            <p className="font-sans font-light text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#969696' }}>
              RSVP by June 1st, 2026
            </p>
          </div>
          <div style={{ height: 20 }} />
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setRsvpDone(true)}
            className="flex items-center justify-center h-[44px] rounded-full w-[335px] font-sans font-medium text-[16px] text-white"
            style={{ background: rsvpDone ? '#646f53' : '#34342f' }}
          >
            {rsvpDone ? '✓ RSVP confirmed' : 'RSVP now'}
          </motion.button>
          <div style={{ height: 10 }} />
          <button
            className="flex items-center justify-center h-[44px] rounded-full w-[335px] font-sans font-medium text-[16px] text-black"
            style={{ border: '1px solid #7e8d68' }}
          >
            Can&apos;t make it
          </button>
        </div>

        {/* Divider */}
        <div className="h-px w-full shrink-0" style={{ background: '#d0d0d0' }} />

        {/* ── WHERE YOU'LL STAY ── */}
        <div className="flex flex-col items-start py-[24px] w-full shrink-0" style={{ background: '#f5f5f5' }}>
          <div className="flex flex-col gap-[11px] items-start px-[24px] w-full">
            <div className="flex flex-col gap-[4px] items-start w-full">
              <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase w-full" style={{ color: '#2b2b27' }}>
                WHERE YOU&apos;LL STAY
              </p>
              <div className="flex items-center justify-between w-full">
                <p className="font-serif text-[30px] leading-[40px] text-black whitespace-nowrap">Your room is held</p>
                <button className="flex items-center gap-[6px] font-sans font-medium text-[14px] whitespace-nowrap" style={{ color: '#767676' }}>
                  See all
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_ARROW} alt="" className="w-[16px] h-[16px] object-contain" />
                </button>
              </div>
            </div>
            {/* Special rate banner */}
            <div className="flex items-start overflow-hidden p-[12px] rounded-[12px] w-full" style={{ background: '#e8e8e8' }}>
              <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0">
                <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase w-full" style={{ color: '#585858' }}>
                  Special rate — guests only
                </p>
                <p className="font-sans font-light text-[14px] leading-[20px] w-full" style={{ color: '#585858' }}>
                  Sara &amp; Evan have reserved a block at a special rate. Book before it closes.
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal scroll room cards */}
          <div className="flex gap-[10px] items-start overflow-x-auto mt-[11px] pl-[24px] w-full" style={{ scrollbarWidth: 'none' }}>
            {ROOMS.map((room, i) => (
              <motion.div
                key={room.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.07 }}
                className="flex flex-col items-start overflow-hidden rounded-[8px] shrink-0"
                style={{ width: 240, background: 'white', border: '1px solid #d0d0d0' }}
              >
                <div className="relative w-full shrink-0" style={{ height: 120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={room.img} alt={room.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-start px-[16px] py-[16px] w-full">
                  <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-black w-[192px]">{room.title}</p>
                  <div style={{ height: 4 }} />
                  <p className="font-sans font-light text-[14px] leading-[20px] w-[192px]" style={{ color: '#969696' }}>{room.sub}</p>
                  <div style={{ height: 8 }} />
                  <div className="flex items-baseline gap-[2px]">
                    <p className="font-sans font-medium text-[14px] leading-[20px] whitespace-nowrap" style={{ color: '#767676' }}>{room.price}</p>
                    <p className="font-sans text-[10px]" style={{ color: '#969696' }}> / night</p>
                  </div>
                  <div style={{ height: 10 }} />
                  <button
                    className="flex items-center justify-center h-[36px] px-[18px] rounded-full font-sans font-light text-[14px] text-white whitespace-nowrap"
                    style={{ background: '#34342f' }}
                  >
                    Book this room
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="shrink-0 w-[8px]" />
          </div>
        </div>

        {/* ── PLAN YOUR TRIP / The week ahead ── */}
        <div className="flex flex-col gap-[24px] items-start px-[20px] py-[24px] w-full shrink-0" style={{ background: 'white' }}>
          <div className="flex flex-col gap-[4px] items-start">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase w-[335px]" style={{ color: '#2b2b27' }}>
              PLAN YOUR TRIP
            </p>
            <p className="font-serif text-[30px] leading-[40px] text-black whitespace-nowrap">The week ahead</p>
            <p className="font-sans font-light text-[14px] leading-[20px] w-[335px]" style={{ color: '#585858' }}>
              Everything happening around the wedding — join as much or as little as you like.
            </p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-[24px] items-start w-full">
            {EVENTS.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="flex gap-[12px] items-start w-full"
              >
                {/* Date col */}
                <div className="flex flex-col gap-[2px] items-center self-stretch shrink-0" style={{ width: 40 }}>
                  <p className="font-sans font-medium text-[14px] leading-[20px] text-center uppercase whitespace-nowrap" style={{ color: '#767676' }}>{event.day}</p>
                  <p className="font-sans font-semibold text-[24px] leading-[32px] text-center text-black whitespace-nowrap">{event.date}</p>
                  <div className="flex flex-col flex-1 items-center min-h-0 w-full">
                    <div className="flex-1 min-h-0 w-px" style={{ background: '#767676' }} />
                  </div>
                </div>

                {/* Event card */}
                <div className="flex flex-col items-start overflow-hidden rounded-[12px] flex-1 min-w-0" style={{ border: '1px solid #d0d0d0', background: 'white' }}>
                  {/* Allie block (if present) */}
                  {event.allie && (
                    <div className="flex flex-col gap-[14px] items-start p-[24px] w-full" style={{ background: '#585858' }}>
                      <div className="flex items-center gap-[6px]">
                        <div className="w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={IMG_DIAMOND} alt="" className="w-[14px] h-[14px] object-contain" />
                        </div>
                        <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-white whitespace-nowrap">Allie</p>
                      </div>
                      <p className="font-sans text-[14px] leading-[20px] text-white w-full">{event.allie}</p>
                    </div>
                  )}
                  {/* Event image */}
                  <div className="relative w-full shrink-0" style={{ height: 90 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.img} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  {/* Event info */}
                  <div className="flex flex-col gap-[4px] items-start pb-[12px] pt-[10px] px-[14px] w-full">
                    {event.type && (
                      <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#585858' }}>
                        {event.type}
                      </p>
                    )}
                    <div className="flex flex-col gap-[3px] items-start w-full">
                      <p className="font-sans font-medium text-[16px] leading-[24px] text-black whitespace-nowrap">{event.title}</p>
                      <p className="font-sans font-light text-[14px] leading-[20px] w-full" style={{ color: '#969696' }}>{event.sub}</p>
                    </div>
                    {'title2' in event && event.title2 && (
                      <div className="flex flex-col gap-[3px] items-start w-full mt-[8px]">
                        <p className="font-sans font-medium text-[16px] leading-[24px] text-black whitespace-nowrap">{event.title2}</p>
                        <p className="font-sans font-light text-[14px] leading-[20px] w-full" style={{ color: '#969696' }}>{event.sub2}</p>
                      </div>
                    )}
                    {event.join && (
                      <button className="flex items-center gap-[6px] py-[8px] font-sans font-light text-[14px] whitespace-nowrap" style={{ color: '#585858' }}>
                        {event.join}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={IMG_ARROW} alt="" className="w-[16px] h-[16px] object-contain" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full shrink-0" style={{ background: '#d0d0d0' }} />

        {/* ── GIFT REGISTRY ── */}
        <div className="flex flex-col gap-[24px] items-start px-[20px] py-[24px] w-full shrink-0" style={{ background: '#f5f5f5' }}>
          <div className="flex flex-col gap-[4px] items-start w-full">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase w-[335px]" style={{ color: '#2b2b27' }}>
              GIFT REGISTRY
            </p>
            <div className="flex items-center justify-between w-full">
              <p className="font-serif text-[30px] leading-[40px] text-black whitespace-nowrap">Our wish list</p>
              <button className="flex items-center gap-[6px] font-sans font-medium text-[14px] whitespace-nowrap" style={{ color: '#767676' }}>
                See all
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_ARROW} alt="" className="w-[16px] h-[16px] object-contain" />
              </button>
            </div>
            <p className="font-sans font-light text-[14px] leading-[20px] w-[335px]" style={{ color: '#969696' }}>
              A few things we&apos;d love — no obligation, just gratitude.
            </p>
          </div>

          {/* Horizontal scroll gift cards */}
          <div className="flex gap-[10px] items-start overflow-x-auto w-full" style={{ scrollbarWidth: 'none' }}>
            {GIFTS.map((gift, i) => (
              <motion.div
                key={gift.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.07 }}
                className="flex flex-col items-start overflow-hidden rounded-[12px] shrink-0"
                style={{ width: 160, background: 'white', border: '1px solid #d0d0d0' }}
              >
                <div className="relative w-full shrink-0" style={{ height: 110 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gift.img} alt={gift.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-start pb-[12px] pt-[10px] px-[12px]">
                  <p className="font-sans font-medium text-[12px] leading-[16px] text-black w-[126px]">{gift.name}</p>
                  <div style={{ height: 4 }} />
                  <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>
                    {gift.price}
                  </p>
                  <div style={{ height: 8 }} />
                  <button
                    className="flex items-center justify-center h-[36px] px-[18px] rounded-full font-sans font-light text-[14px] text-black whitespace-nowrap"
                    style={{ border: '1px solid #7e8d68' }}
                  >
                    Add to cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full shrink-0" style={{ background: '#d0d0d0' }} />

        {/* ── Footer ── */}
        <div
          className="flex flex-col items-center px-[20px] pb-[48px] pt-[32px] w-full shrink-0"
          style={{ background: 'black' }}
        >
          <p className="font-serif italic text-[24px] leading-[36px] text-white text-center whitespace-nowrap" style={{ letterSpacing: '-0.4px' }}>
            Sara &amp; Evan
          </p>
          <div style={{ height: 14 }} />
          <p className="font-sans font-light text-[14px] leading-[20px] text-white text-center w-[335px]">
            We&apos;re so grateful you&apos;re part of this. If you need anything at all, please reach out — we want you to feel as taken care of as we do.
          </p>
          <div style={{ height: 16 }} />
          <p className="font-sans text-[10px] leading-[16px] text-center whitespace-nowrap" style={{ color: '#969696' }}>
            Questions? hello@joshandella.com
          </p>
          <div style={{ height: 28 }} />
          <p className="font-sans text-[10px] leading-[16px] text-white text-center opacity-40 whitespace-nowrap">
            POWERED BY ALL IN WEDDINGS
          </p>
        </div>

      </div>
    </div>
  )
}
