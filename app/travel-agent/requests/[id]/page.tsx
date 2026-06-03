import { notFound } from 'next/navigation'
import { getCventRequest } from '@/lib/cvent'
import RequestDetailClient from './RequestDetailClient'

export function generateStaticParams() {
  return [
    { id: 'req-1042' },
    { id: 'req-1038' },
    { id: 'req-1031' },
    { id: 'req-1056' },
    { id: 'req-1052' },
    { id: 'req-1049' },
    { id: 'req-1047' },
  ]
}

export default async function CventRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getCventRequest(id)
  if (!request) notFound()
  return <RequestDetailClient request={request} />
}
