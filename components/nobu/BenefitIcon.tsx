import type { IconKey } from '@/lib/nobu-retreats'

export default function BenefitIcon({ name }: { name: IconKey }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: '#d6bfa4',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'briefing':
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      )
    case 'proposal':
      return (
        <svg {...common} aria-hidden>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <rect x="8" y="6" width="8" height="3" rx="0.5" />
          <path d="M8 13h2M12 13h4M8 17h4" />
        </svg>
      )
    case 'attendees':
      return (
        <svg {...common} aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'vendors':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 11.5a8.5 8.5 0 1 1-2.5-6" />
          <path d="M9 12l2 2 5-5" />
        </svg>
      )
    case 'portal':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 21h8" />
        </svg>
      )
    case 'itinerary':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      )
    case 'collab':
      return (
        <svg {...common} aria-hidden>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10.5" r="2.4" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M14 20c0-2 1.3-3.6 3-4.2" />
        </svg>
      )
  }
}
