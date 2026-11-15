import { useEffect, useRef, useState } from 'react'
import { Music2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AmbientEngine } from '../../lib/ambient'

export default function MusicToggle() {
  const engine = useRef(null)
  const [on, setOn] = useState(false)
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => () => engine.current?.dispose(), [])

  // Pause the music when the tab is hidden; resume only if it was on.
  useEffect(() => {
    const onVis = () => {
      if (!engine.current) return
      if (document.hidden) engine.current.stop()
      else if (on) engine.current.start().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [on])

  const toggle = async () => {
    try {
      if (!engine.current) engine.current = new AmbientEngine()
      if (on) {
        engine.current.stop()
        setOn(false)
      } else {
        await engine.current.start()
        setOn(true)
      }
    } catch {
      setUnsupported(true)
    }
  }

  if (unsupported) return null

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn ambient music off' : 'Turn ambient music on'}
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
            animate={on ? { height: [4, 14, 6, 12, 4] } : { height: 4 }}
            transition={on ? { duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? 'Ambient on' : 'Music'}</span>
    </button>
  )
}
