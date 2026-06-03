'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [persona, setPersona] = useState<'couple' | 'agent'>('couple')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  return (
    <div className="screen-wrap">
      <div className="mobile-frame flex flex-col bg-[#f5f5f5] min-h-dvh">
        {/* Header */}
        <div className="bg-[#2b2b27] flex flex-col shrink-0">
          <div className="bg-[#b4b4b4] h-5 flex items-center justify-center">
            <p className="text-caption text-[#2b2b27]">MEETINGS & EVENTS</p>
          </div>
          <div className="flex items-center justify-between px-4 h-[60px]">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
              <Image src="/assets/icon-close.svg" alt="Close" width={18} height={18} />
            </button>
            <div className="flex items-center justify-center">
              <Image
                src="/assets/logo-nobu-white.png"
                alt="Nobu Hotel Los Cabos"
                width={162}
                height={38}
                className="object-contain"
              />
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 justify-between px-6 py-9">
          {/* Title + Form */}
          <div className="flex flex-col gap-8">
            {/* Title */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <p className="text-caption text-[#969696]">WELCOME BACK</p>
                <p className="font-serif font-normal text-5xl leading-[52px] text-[#2b2b27]">
                  Your wedding awaits you.
                </p>
              </div>
              <p className="text-caption text-[#585858]">Sign in to pick up where you left off.</p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-3">
              {/* Persona toggle */}
              <div className="relative h-[38px] rounded-full overflow-hidden bg-[#e8e8e8] w-full">
                <div
                  className="absolute top-[3px] h-8 rounded-full bg-white transition-transform duration-200"
                  style={{
                    width: '48.5%',
                    left: '3px',
                    transform: persona === 'agent' ? 'translateX(calc(100% + 2px))' : 'translateX(0)',
                  }}
                />
                <div className="absolute inset-0 flex">
                  <button
                    onClick={() => setPersona('couple')}
                    className="flex-1 flex items-center justify-center z-10"
                  >
                    <span
                      className="font-sans font-medium text-xs leading-4 transition-colors"
                      style={{ color: persona === 'couple' ? '#2b2b27' : '#757569' }}
                    >
                      Bride or Couple
                    </span>
                  </button>
                  <button
                    onClick={() => setPersona('agent')}
                    className="flex-1 flex items-center justify-center z-10"
                  >
                    <span
                      className="font-sans font-normal text-xs leading-4 transition-colors"
                      style={{ color: persona === 'agent' ? '#2b2b27' : '#757569' }}
                    >
                      Travel Agent
                    </span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-0.5">
                <p className="text-caption text-[#6d6655]">EMAIL</p>
                <div className="bg-white border border-[#d0d0d0] rounded-xl h-12 overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-full px-4 font-sans font-light text-sm text-[#b4b4b4] placeholder:text-[#b4b4b4] bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-caption text-[#6d6655]">PASSWORD</p>
                  <div className="bg-white border border-[#d0d0d0] rounded-xl h-12 overflow-hidden">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-full px-4 font-sans font-light text-sm text-[#b4b4b4] placeholder:text-[#b4b4b4] bg-transparent outline-none"
                    />
                  </div>
                </div>
                <p className="font-sans font-normal text-xs leading-4 text-[#585858] text-right">Forgot password?</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 pb-6">
            <button
              onClick={() => router.push('/post-booking')}
              className="flex items-center justify-center h-11 rounded-full bg-black w-full"
            >
              <span className="font-sans font-medium text-base leading-6 text-white">Sign in</span>
            </button>
            <div className="flex items-center justify-center gap-1">
              <span className="font-sans font-normal text-sm leading-5 text-[#969696]">Don&apos;t have an account?</span>
              <Link href="/plan" className="font-sans font-medium text-sm leading-5 text-[#767676]">
                Start planning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
