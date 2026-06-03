'use client'

import { useState } from 'react'

export default function CventConnectionStatus() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('10 min ago')

  function handleResync() {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setLastSync('Just now')
    }, 1200)
  }

  return (
    <motionlessStatus className="flex items-center gap-3">
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4caf50]" aria-hidden />
          <p className="font-sans text-[13px] font-medium text-[#2b2b27]">Cvent connected</p>
        </div>
        <p className="font-sans text-[11px] text-[#969696]">Last synced {lastSync}</p>
      </motionlessStatus>
      <button
        type="button"
        onClick={handleResync}
        disabled={syncing}
        aria-label={syncing ? 'Syncing with Cvent' : 'Resync with Cvent'}
        title={syncing ? 'Syncing…' : 'Resync with Cvent'}
        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#d0d0d0] text-[#585858] hover:bg-[#f5f1ea] hover:text-[#2b2b27] disabled:opacity-50 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
          aria-hidden
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
      </button>
    </motionlessStatus>
  )
}
