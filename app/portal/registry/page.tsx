'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import PortalHeader from '@/components/PortalHeader'

const IMG_ABOUT = "https://www.figma.com/api/mcp/asset/65286b2b-f019-4994-91b9-a431d65b23b2"

const EXPERIENCES = [
  {
    name: 'Couples Spa Ritual',
    desc: 'Indulge in a relaxing 90-minute aromatherapy massage and botanical body scrub in our private massage bungalow.',
    price: '$550',
    img: 'https://www.figma.com/api/mcp/asset/0b33965a-1189-4b25-a473-83b5962f194e',
  },
  {
    name: 'Mayan Hydration Detox',
    desc: 'A two-day cenote-water hydration arc - body wrap, lymphatic massage, and a guided breathwork session.',
    price: '$540',
    img: 'https://www.figma.com/api/mcp/asset/21aefb8c-e224-4d34-a6b9-13ba224a8b4e',
  },
  {
    name: "Chef's Table Tasting",
    desc: 'Eight-course private tasting with the executive chef. Sake-paired, told story-by-story across the kitchen pass.',
    price: '$880',
    img: 'https://www.figma.com/api/mcp/asset/bde66148-21b1-43af-9d9e-453725316b2f',
  },
  {
    name: 'Whale Watching at Sunrise',
    desc: "Six-AM small-boat charter to where the gray whales calve. Coffee, blankets, and the captain who's logged 1,200 pods.",
    price: '$660',
    img: 'https://www.figma.com/api/mcp/asset/dd06e73d-b464-4236-9d1e-daad3005d525',
  },
]

export default function RegistryPage() {
  const [added, setAdded]     = useState<Set<string>>(new Set())
  const [toast, setToast]     = useState<string | null>(null)
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null)

  // clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function handleAdd(name: string) {
    setAdded(prev => new Set([...prev, name]))
    setToast(name)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }

  const addedCount = added.size

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f6f5f3' }}>

        <PortalHeader />
        <PortalMenu active="Registry" />
        <div className="w-full h-px" style={{ background: '#dad6ce' }} />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-[8px] items-start overflow-hidden pb-[16px] pt-[24px] px-[20px] w-full"
        >
          <p className="font-serif text-[36px] leading-[40px] w-full" style={{ color: '#2b2b27' }}>
            A registry your guests will actually want to gift.
          </p>
          <p className="font-sans text-[14px] leading-[20px] w-full" style={{ color: '#757569' }}>
            Choose from experience-based gifts that allow your friends and family to help create memories rather than just shipping another plate.
          </p>
        </motion.div>

        {/* Left/right split */}
        <div className="flex items-start w-full shrink-0">
          <div className="flex-1 h-[192px] overflow-hidden relative min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_ABOUT} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div
            className="flex flex-col gap-[4px] items-center justify-center self-stretch shrink-0 overflow-hidden whitespace-nowrap"
            style={{ width: 130, background: '#e8e8e8' }}
          >
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase text-center text-black">Your Registry</p>
            <p className="font-serif text-[24px] leading-[36px] text-black">$2,120</p>
            <p className="font-sans text-[12px] leading-[16px] text-center" style={{ color: '#585858' }}>
              {addedCount > 0 ? `${addedCount} Experience${addedCount > 1 ? 's' : ''}` : '3 Experiences'}
            </p>
          </div>
        </div>

        {/* Experience cards */}
        <div className="flex flex-col gap-[16px] items-start overflow-hidden p-[24px] w-full">
          {EXPERIENCES.map((exp, i) => {
            const isAdded = added.has(exp.name)
            return (
              <motion.div
                key={exp.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="bg-white flex flex-col items-start overflow-hidden rounded-[8px] w-full"
              >
                {/* Photo */}
                <div className="bg-white h-[150px] overflow-hidden w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={exp.img} alt={exp.name} className="w-full h-full object-cover" />
                </div>
                {/* Text */}
                <div className="flex flex-col gap-[8px] items-start overflow-hidden pb-[16px] pt-[14px] px-[16px] w-full">
                  <p className="font-sans text-[18px] leading-[24px] text-black whitespace-nowrap">{exp.name}</p>
                  <p className="font-sans text-[10px] leading-[14px] tracking-[0.3px] w-full" style={{ color: '#969696' }}>{exp.desc}</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-sans text-[18px] leading-[24px] text-black whitespace-nowrap">{exp.price}</p>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={() => !isAdded && handleAdd(exp.name)}
                      className="flex gap-[6px] h-[36px] items-center justify-center px-[18px] py-[8px] rounded-full font-sans font-light text-[14px] whitespace-nowrap transition-colors duration-200"
                      style={{
                        background: isAdded ? '#646f53' : '#1e1e1e',
                        color: 'white',
                        cursor: isAdded ? 'default' : 'pointer',
                      }}
                    >
                      {isAdded ? '✓ Added' : 'Add'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <PortalFooter />
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed z-50 flex justify-center pointer-events-none"
            style={{ bottom: 88, left: 0, right: 0 }}
          >
            <div
              className="flex items-center gap-[10px] px-[20px] py-[12px] rounded-full"
              style={{ background: '#2b2b27', boxShadow: '0 4px 24px rgba(0,0,0,0.22)' }}
            >
              <span className="font-sans text-[14px] leading-[20px] text-white">✓</span>
              <p className="font-sans text-[14px] leading-[20px] text-white whitespace-nowrap">
                <span style={{ fontWeight: 500 }}>{toast}</span> added to registry
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
