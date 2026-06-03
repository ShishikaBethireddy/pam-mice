'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PortalMenu from '@/components/PortalMenu'
import PortalHeader from '@/components/PortalHeader'

const CARDS = [
  {
    name: 'Priya + Rahul',
    meta: 'Oct 2024 · 420 guests',
    quote: `"We told the chatbot 'mystic boho cathedral' and it spit back our exact wedding. We cried. We booked."`,
    img: 'https://www.figma.com/api/mcp/asset/8d0c18a2-d831-4c29-8912-5d7afa755698',
  },
  {
    name: 'Sofia + James',
    meta: 'Jun 2024 · 280 guests',
    quote: `"We wanted quiet. Not boring — quiet. Nobu was the only place that understood the difference."`,
    img: 'https://www.figma.com/api/mcp/asset/2601d56b-43f3-4e80-bc30-6768e0054d1e',
  },
  {
    name: 'Mark + Brendan',
    meta: 'Jun 2024 · 280 guests',
    quote: `We told the chatbot "mystic boho cathedral" and it spit back our exact wedding. We cried. We booked.`,
    img: 'https://www.figma.com/api/mcp/asset/91154c39-7920-4521-823d-5e0c8d178557',
  },
  {
    name: 'Jasmine + Aadit',
    meta: 'Jun 2024 · 280 guests',
    quote: `We told the chatbot "mystic boho cathedral" and it spit back our exact wedding. We cried. We booked.`,
    img: 'https://www.figma.com/api/mcp/asset/69e9505c-8b22-4b37-bd81-81077877a56b',
  },
]

export default function InspirationPage() {
  const router = useRouter()
  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f6f5f3' }}>

        <PortalHeader />
        <PortalMenu active="Inspiration" />
        <div className="w-full h-px" style={{ background: '#dad6ce' }} />
        <div className="w-full h-px" style={{ background: '#dad6ce' }} />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-[8px] items-start overflow-hidden pb-[16px] pt-[24px] px-[20px] w-full"
        >
          <p className="font-serif text-[36px] leading-[40px] w-full" style={{ color: '#2b2b27' }}>
            The Edit: Real Weddings
          </p>
          <p className="font-sans text-[14px] leading-[20px] w-full" style={{ color: '#757569' }}>
            Real couples who got married at properties like yours — what they spent, what they cut, what stayed. Tap any tile to open their full edit.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-[16px] items-start overflow-hidden p-[24px] w-full">
          {CARDS.map((card, i) => (
            <motion.button
              key={card.name}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sessionStorage.setItem('selectedCouple', JSON.stringify({
                  name: card.name,
                  date: card.meta,
                  mainImage: card.img,
                }))
                router.push('/couples/sofia-james')
              }}
              className="group bg-white flex flex-col items-start overflow-hidden rounded-[8px] w-full cursor-pointer text-left transition-shadow hover:shadow-md"
            >
              {/* Photo */}
              <div className="relative bg-white h-[150px] overflow-hidden w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col gap-[12px] items-start overflow-hidden pb-[16px] pt-[14px] px-[16px] w-full">
                <div className="flex flex-col gap-[3px] items-start whitespace-nowrap">
                  <p className="font-sans text-[18px] leading-[24px]" style={{ color: '#2b2b27' }}>{card.name}</p>
                  <p className="font-sans text-[10px] leading-[14px] tracking-[0.3px]" style={{ color: '#757569' }}>{card.meta}</p>
                </div>
                <p className="font-sans text-[10px] leading-[14px] tracking-[0.3px] w-full" style={{ color: '#757569' }}>{card.quote}</p>
                <div
                  className="flex items-center justify-between w-full pt-[10px]"
                  style={{ borderTop: '1px solid #ece5d9' }}
                >
                  <p
                    className="font-sans font-medium text-[12px] leading-[16px] tracking-[0.4px] uppercase"
                    style={{ color: '#8e6434' }}
                  >
                    View their edit
                  </p>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform duration-200 group-hover:translate-x-[2px]"
                  >
                    <path d="M6 3.5L10.5 8L6 12.5" stroke="#8e6434" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  )
}
