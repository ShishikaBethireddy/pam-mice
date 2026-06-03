import { notFound } from 'next/navigation'
import { RETREAT_TYPES, getRetreatBySlug } from '@/lib/nobu-retreats'
import RetreatDetailClient from './RetreatDetailClient'

export function generateStaticParams() {
  return RETREAT_TYPES.map((r) => ({ slug: r.slug }))
}

export default async function RetreatTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const retreat = getRetreatBySlug(slug)
  if (!retreat) notFound()
  return <RetreatDetailClient retreat={retreat} />
}
