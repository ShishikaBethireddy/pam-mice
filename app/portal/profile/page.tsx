'use client'
import { motion } from 'framer-motion'
import PortalMenu from '@/components/PortalMenu'
import PortalFooter from '@/components/PortalFooter'
import PortalHeader from '@/components/PortalHeader'

const IMG_PHOTO1 = "https://www.figma.com/api/mcp/asset/6a037b35-130b-4580-9f0d-32238eb32107"
const IMG_PHOTO2 = "https://www.figma.com/api/mcp/asset/f0df87eb-867b-4f05-856f-97a24a4fb54c"

function FormField({ label, value, placeholder, width = '100%' }: { label: string; value: string; placeholder?: string; width?: string | number }) {
  return (
    <div className="relative" style={{ height: 60, width }}>
      <p className="absolute top-0 left-0 font-sans text-[12px] leading-[16px]" style={{ color: '#585858' }}>{label}</p>
      <p className="absolute top-[16px] left-0 font-sans text-[14px] leading-[24px]" style={{ color: value ? '#2b2b27' : '#969696' }}>
        {value || placeholder}
      </p>
      <div className="absolute left-0 w-full h-px" style={{ top: 46, background: '#d0d0d0' }} />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col min-h-dvh" style={{ background: '#f5f5f5' }}>

        <PortalHeader />
        <PortalMenu active="Profile" />

        {/* Bride form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-start pt-[24px] px-[20px] w-full"
        >
          <div className="flex items-center justify-center py-[12px]">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>BRIDE</p>
          </div>
          <FormField label="FULL NAME" value="Sara Moreno" width={350} />
          <FormField label="ADDRESS" value="" placeholder="Street address" width={350} />
          <div className="flex gap-[16px] h-[60px] items-start">
            <FormField label="CITY"        value="" placeholder="City" width={167} />
            <FormField label="POSTAL CODE" value="" placeholder="ZIP"  width={167} />
          </div>
          <div className="flex gap-[16px] h-[60px] items-start">
            <FormField label="PHONE" value="+52 55 0000"    width={167} />
            <FormField label="EMAIL" value="" placeholder="bride@email.com" width={167} />
          </div>
        </motion.div>

        {/* Groom form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-col items-start pt-[24px] px-[20px] w-full"
        >
          <div className="flex items-center justify-center py-[12px]">
            <p className="font-sans font-semibold text-[12px] tracking-[0.8px] uppercase whitespace-nowrap" style={{ color: '#767676' }}>GROOM</p>
          </div>
          <FormField label="FULL NAME" value="Evan Williams" width={350} />
          <FormField label="ADDRESS" value="" placeholder="Street address" width={350} />
          <div className="flex gap-[16px] h-[60px] items-start">
            <FormField label="CITY"        value="" placeholder="City" width={167} />
            <FormField label="POSTAL CODE" value="" placeholder="ZIP"  width={167} />
          </div>
          <div className="flex gap-[16px] h-[60px] items-start">
            <FormField label="PHONE" value="+1 212 0000"    width={167} />
            <FormField label="EMAIL" value="" placeholder="groom@email.com" width={167} />
          </div>
        </motion.div>

        {/* Save button */}
        <div className="flex flex-col items-start p-[24px] w-full">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="bg-black flex gap-[8px] h-[44px] items-center justify-center px-[24px] py-[12px] rounded-full text-white font-sans font-medium text-[16px] whitespace-nowrap"
          >
            Save
          </motion.button>
        </div>

        {/* Photos section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col items-start p-[24px] w-full bg-white"
        >
          <div className="flex items-center w-full">
            <p className="flex-1 font-sans font-semibold text-[12px] tracking-[0.8px] uppercase" style={{ color: '#767676' }}>YOUR PHOTOS</p>
            <button className="font-sans font-medium text-[14px] leading-[20px]" style={{ color: '#767676' }}>Add</button>
          </div>
          <div className="flex flex-wrap gap-x-[8px] items-start pt-[12px]">
            {/* Photo 1 - tall */}
            <div className="rounded-[12px] overflow-hidden shrink-0" style={{ width: 130, height: 172 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_PHOTO1} alt="" className="w-full h-full object-cover" />
            </div>
            {/* Photo 2 - wide */}
            <div className="rounded-[12px] overflow-hidden shrink-0" style={{ width: 171, height: 116 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_PHOTO2} alt="" className="w-full h-full object-cover" />
            </div>
            {/* Upload slot 1 */}
            <div
              className="rounded-[12px] flex items-center justify-center shrink-0 mt-[8px]"
              style={{ width: 171, height: 116, background: '#e8e8e8', border: '1px dashed #767676' }}
            >
              <p className="font-sans text-[22px]" style={{ color: '#969696' }}>+</p>
            </div>
            {/* Upload slot 2 */}
            <div
              className="rounded-[12px] flex items-center justify-center shrink-0 mt-[8px]"
              style={{ width: 171, height: 116, background: '#e8e8e8', border: '1px dashed #767676' }}
            >
              <p className="font-sans text-[22px]" style={{ color: '#969696' }}>+</p>
            </div>
          </div>
        </motion.div>

        <PortalFooter />
      </div>
    </div>
  )
}
