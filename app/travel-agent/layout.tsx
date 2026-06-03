import type { ReactNode } from 'react'

export default function TravelAgentLayout({ children }: { children: ReactNode }) {
  return <div className="hotel-desktop min-h-screen min-w-[1024px]">{children}</div>
}
