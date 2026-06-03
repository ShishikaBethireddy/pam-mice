import { notFound } from 'next/navigation'
import { getProposal, getCventRequest } from '@/lib/cvent'
import { enrichProposal } from '@/lib/proposal-experience'
import ProposalDetailClient from './ProposalDetailClient'

export function generateStaticParams() {
  return [{ id: 'prop-1031' }, { id: 'prop-1042' }, { id: 'prop-1038' }]
}

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const base = getProposal(id)
  if (!base) notFound()
  const proposal = enrichProposal(base)
  if (id === 'prop-1031') proposal.status = 'sent_to_cvent'
  const request = getCventRequest(proposal.requestId)
  return <ProposalDetailClient proposal={proposal} request={request} />
}
