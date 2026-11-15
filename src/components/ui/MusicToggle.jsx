import { useEffect, useRef, useState } from 'react'
import { Music2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AmbientEngine } from '../../lib/ambient'

const SONG = `${import.meta.env.BASE_URL}music/background.m4a`
const TARGET_VOLUME = 0.7

// The song starts as soon as the browser allows it: immediately if autoplay is permitted,
// otherwise on the visitor's very first tap (usually "Open your little surprise").
// The button lets her turn it off at any time.
// If the song can't play at all, a soft generated ambient pad is used instead.
export default function MusicToggle() {
  const audio = useRef(null)
  const ambient = useRef(null)
  const fade = useRef(null)
  const [on, setOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const userChose = useRef(false)

  const fadeTo = (el, target, ms, done) => {
    window.clearInterval(fade.current)
    const steps = Math.max(1, Math.round(ms / 50))
    const delta = (target - el.volume) / steps
    let n = 0
    fade.current = window.setInterval(() => {
      n += 1
      el.volume = Math.min(1, Math.max(0, el.volume + delta))
      if (n >= steps) {
        window.clearInterval(fade.current)
        el.volume = target
        done?.()
      }
    }, 50)
  }

  const getAudio = () => {
    if (!audio.current) {
      const el = new Audio(SONG)
      el.loop = true
      el.preload = 'auto'
      el.volume = 0
      audio.current = el
    }
    return audio.current
  }

  // play() must be called synchronously inside a tap handler for iOS to allow sound.
  const start = async ({ fallback = true } = {}) => {
    const el = getAudio()
    el.volume = 0
    const attempt = el.play()
    setLoading(true)
    try {
      await attempt
      fadeTo(el, TARGET_VOLUME, 1800)
      return true
    } catch (err) {
      // autoplay blocked before any tap: just wait for the first interaction
      if (!fallback || err?.name === 'NotAllowedError') return false
      // song unavailable: fall back to the generated ambient music
      try {
        if (!ambient.current) ambient.current = new AmbientEngine()
        await ambient.current.start()
        return true
      } catch {
        return false
      }
    } finally {
      setLoading(false)
    }
  }

  const stop = () => {
    ambient.current?.stop()
    const el = audio.current
    if (el && !el.paused) fadeTo(el, 0, 700, () => el.pause())
  }

  const toggle = async () => {
    userChose.current = true
    if (on) {
      stop()
      setOn(false)
    } else {
      setOn(true)
      await start()
    }
  }

  // Pause when she switches apps or locks the phone; resume only if it was playing.
  useEffect(() => {
    const onVis = () => {
      if (!on) return
      if (document.hidden) {
        audio.current?.pause()
        ambient.current?.stop()
      } else {
        start()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])

  // Auto-start: try right away, otherwise on the first tap / key press anywhere on the page.
  useEffect(() => {
    let cancelled = false
    const events = ['click', 'touchend', 'keydown']
    const detach = () => events.forEach((e) => document.removeEventListener(e, onFirst, true))
    async function onFirst() {
      detach()
      if (cancelled || userChose.current) return
      const ok = await start()
      if (!cancelled && ok) setOn(true)
    }
    start({ fallback: false }).then((ok) => {
      if (cancelled) return
      if (ok) {
        setOn(true)
      } else {
        events.forEach((e) => document.addEventListener(e, onFirst, true))
      }
    })
    return () => {
      cancelled = true
      detach()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(
    () => () => {
      window.clearInterval(fade.current)
      audio.current?.pause()
      ambient.current?.dispose()
    },
    [],
  )

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn music off' : 'Turn music on'}
      className="glass fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3.5 text-sm text-lilac-200 md:right-5 md:top-5"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={on ? 'on' : 'off'} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
          {on ? <Music2 size={18} /> : <VolumeX size={18} />}
        </motion.span>
      </AnimatePresence>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="block w-[3px] rounded-full bg-lilac-300"
            animate={on && !loading ? { height: [4, 14, 6, 12, 4] } : { height: 4 }}
            transition={on && !loading ? { duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{loading ? 'Loading…' : on ? 'Playing' : 'Music'}</span>
    </button>
  )
}
