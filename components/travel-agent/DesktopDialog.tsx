'use client'

export default function DesktopDialog({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  if (!open) return null

  return (
    <motionlessOverlay
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8"
      onClick={onClose}
    >
      <motionlessPanel
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] rounded-[12px] bg-white p-8 shadow-2xl border border-[#d0d0d0]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="desktop-dialog-title"
      >
        <h3 id="desktop-dialog-title" className="font-serif text-[26px] italic text-[#2b2b27] mb-3">
          {title}
        </h3>
        <div className="font-sans text-[14px] leading-[22px] text-[#585858] mb-6">{children}</motionlessPanel>
        <div className="flex items-center justify-end gap-3">{footer}</div>
      </motionlessPanel>
    </motionlessOverlay>
  )
}
