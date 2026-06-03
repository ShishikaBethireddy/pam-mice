'use client'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  show: boolean
  durationMs?: number
  count?: number
}

const COLORS = ['#d6bfa4', '#8e7351', '#e0d3c5', '#faf7f3', '#ffffff', '#c79b6e', '#f4e3c8']

type Particle = {
  id: number
  left: number
  size: number
  color: string
  delay: number
  duration: number
  drift: number
  rotate: number
  shape: 'rect' | 'circle' | 'diamond' | 'ribbon'
}

function buildParticles(count: number): Particle[] {
  const shapes: Particle['shape'][] = ['rect', 'circle', 'diamond', 'ribbon']
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.6,
    duration: 2.4 + Math.random() * 2.2,
    drift: (Math.random() - 0.5) * 220,
    rotate: (Math.random() - 0.5) * 720,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }))
}

function ShapeEl({ p }: { p: Particle }) {
  if (p.shape === 'circle') {
    return (
      <div
        style={{
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.color,
        }}
      />
    )
  }
  if (p.shape === 'diamond') {
    return (
      <div
        style={{
          width: p.size,
          height: p.size,
          background: p.color,
          transform: 'rotate(45deg)',
        }}
      />
    )
  }
  if (p.shape === 'ribbon') {
    return (
      <div
        style={{
          width: p.size * 0.4,
          height: p.size * 2.2,
          background: p.color,
          borderRadius: 2,
        }}
      />
    )
  }
  return (
    <div
      style={{
        width: p.size,
        height: p.size * 0.5,
        background: p.color,
        borderRadius: 1,
      }}
    />
  )
}

export default function Confetti({ show, durationMs = 4200, count = 90 }: Props) {
  const particles = useMemo(() => buildParticles(count), [count])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="confetti-layer"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{ zIndex: 60 }}
          aria-hidden
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                top: -40,
                left: `${p.left}%`,
                x: 0,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                top: '110vh',
                x: p.drift,
                rotate: p.rotate,
                opacity: [0, 1, 1, 0.9, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.22, 0.61, 0.36, 1],
                times: [0, 0.08, 0.5, 0.85, 1],
                repeat: 0,
              }}
              style={{
                position: 'absolute',
                willChange: 'transform, top, opacity',
              }}
            >
              <ShapeEl p={p} />
            </motion.div>
          ))}
          {/* central burst */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.55, 0], scale: [0.4, 1.6, 2.2] }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 220,
              height: 220,
              background:
                'radial-gradient(circle, rgba(214,191,164,0.55) 0%, rgba(214,191,164,0) 70%)',
            }}
          />
          {/* auto-dismiss safety: visually fades by particle duration; consumers control state. */}
          <span hidden>{durationMs}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
