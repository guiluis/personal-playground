import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const TOTAL = 1 * 30 // 0:30 in seconds

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false)
  const [displayTime, setDisplayTime] = useState(0)

  const currentRef = useRef(0) // source of truth (float seconds)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartCurrent = useRef(0)

  const progress = useMotionValue(0)

  // RAF playback loop
  const tick = useCallback((ts: number) => {
    if (lastTsRef.current === null) lastTsRef.current = ts
    const dt = (ts - lastTsRef.current) / 1000
    lastTsRef.current = ts

    const next = Math.min(currentRef.current + dt, TOTAL)
    currentRef.current = next
    progress.set(next / TOTAL)
    setDisplayTime(next)

    if (next < TOTAL) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (playing) {
      lastTsRef.current = null
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, tick])

  const replay = useCallback(() => {
    currentRef.current = 0
    setDisplayTime(0)
    animate(progress, 0, { duration: 0.25, ease: 'easeOut' })
    setPlaying(true)
  }, [])

  // drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    dragStartCurrent.current = currentRef.current
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return
    const trackWidth = trackRef.current.getBoundingClientRect().width
    const dx = e.clientX - dragStartX.current
    const deltaSec = (dx / trackWidth) * TOTAL
    const next = Math.max(0, Math.min(TOTAL, dragStartCurrent.current + deltaSec))
    currentRef.current = next
    progress.set(next / TOTAL)
    setDisplayTime(next)
  }, [])

  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const filledWidth = useTransform(progress, v => `${v * 100}%`)
  const remainWidth = useTransform(progress, v => `${(1 - v) * 100}%`)

  return (
    <div className="flex items-center justify-center h-full" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
      <div className="flex items-center gap-4 w-full px-8" style={{ maxWidth: 560 }}>

        {/* Play / Pause */}
        <motion.button
          onClick={() => setPlaying(p => !p)}
          className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 cursor-pointer"
          style={{ background: '#efefef' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <motion.div
            key={playing ? 'pause' : 'play'}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {playing
              ? <Pause size={16} fill="#888" stroke="none" />
              : <Play size={16} fill="#888" stroke="none" style={{ marginLeft: 2 }} />
            }
          </motion.div>
        </motion.button>

        <div className="flex items-center gap-2 flex-1">
            {/* Current time */}
            <span className="text-[14px] font-semibold tabular-nums">
            {fmt(displayTime)}
            </span>

            {/* Track */}
            <div
            ref={trackRef}
            className="flex items-center"
            style={{ height: 28, maxWidth: 320, flex: 1 }}
            >
            {/* Filled bar */}
            <motion.div
                style={{
                width: filledWidth,
                height: 12,
                background: '#a78bfa',
                borderRadius: 99,
                }}
            />

            {/* Thumb / scrubber */}
            <motion.div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                width: 4,
                height: 22,
                background: '#a78bfa',
                borderRadius: 99,
                cursor: 'grab',
                touchAction: 'none',
                flexShrink: 0,
                margin: 2,
                }}
                whileHover={{ scaleY: 1.15 }}
                whileTap={{ scaleY: 1.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />

            {/* Remaining bar */}
            <motion.div
                style={{
                width: remainWidth,
                height: 12,
                background: '#d4d4d4',
                borderRadius: 99,
                }}
            />
            </div>

            {/* Total time */}
            <span className="text-[14px] font-semibold tabular-nums text-right" style={{ color: '#aaa' }}>
            {fmt(TOTAL - Math.floor(displayTime))}
            </span>
        </div>

        {/* Replay */}
        <motion.button
          onClick={replay}
          className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 cursor-pointer"
          style={{ background: '#efefef' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <RotateCcw size={16} color="#888" strokeWidth={2.5} />
        </motion.button>

      </div>
    </div>
  )
}
