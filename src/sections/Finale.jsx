import { lazy, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Sparkle, Wind } from 'lucide-react'
import LazyCanvas from '../components/ui/LazyCanvas'
import CssStars from '../components/ui/CssStars'
import SunflowerArt from '../components/ui/SunflowerArt'
import Reveal from '../components/ui/Reveal'
import { NAMES } from '../lib/content'

const FinaleScene = lazy(() => import('../components/three/FinaleScene'))

function CakeFallback({ lit }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,#24124a,#05030f_70%)]">
      <CssStars count={80} />
      <SunflowerArt className="absolute bottom-[24%] left-[6%] h-20 w-20 sm:left-[22%]" />
      <SunflowerArt className="absolute bottom-[22%] right-[6%] h-24 w-24 sm:right-[22%]" />
      <div className="absolute bottom-[30%] left-1/2 flex -translate-x-1/2 flex-col items-center">
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.span
                className="h-4 w-2.5 rounded-full bg-ember-300 shadow-[0_0_16px_6px_rgba(252,211,141,0.6)]"
                animate={lit ? { scaleY: [1, 1.25, 0.9, 1] } : { opacity: 0, scale: 0 }}
                transition={lit ? { duration: 0.6, repeat: Infinity } : { duration: 0.4 }}
              />
              <span className="h-6 w-1.5 bg-lilac-200" />
            </div>
          ))}
        </div>
        <div className="h-12 w-40 rounded-t-lg bg-lilac-300" />
        <div className="h-16 w-56 rounded-t-lg bg-plum-500" />
        <div className="h-2 w-64 rounded-full bg-silver-200" />
      </div>
    </div>
  )
}

const shadow = { textShadow: '0 2px 30px rgba(5,3,15,0.9), 0 0 2px rgba(5,3,15,0.6)' }

export default function Finale() {
  const [lit, setLit] = useState(true)
  const [celebrate, setCelebrate] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const blow = () => {
    if (lit) {
      setLit(false)
      setCelebrate((c) => c + 1)
    } else {
      setLit(true)
    }
  }

  return (
    <section id="finale" className="relative min-h-[100svh] overflow-hidden">
      <LazyCanvas className="absolute inset-0" camera={{ position: [0, 0.8, 7], fov: 45 }} fallback={<CakeFallback lit={lit} />}>
        <FinaleScene lit={lit} celebrate={celebrate} />
      </LazyCanvas>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night-950 to-transparent" />

      <div className="pointer-events-none relative flex min-h-[100svh] flex-col items-center justify-between px-5 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] pt-20 text-center sm:pt-28">
        <div className="flex flex-col items-center gap-4">
          <Reveal>
            <p className="eyebrow" style={shadow}>The last surprise</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-display max-w-xl text-xl italic text-lilac-200 sm:text-2xl text-balance" style={shadow}>
              Some wishes arrive late. But they’re still meant with all the good intentions.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="font-display text-[2.6rem] font-bold leading-[1.02] text-white sm:text-7xl md:text-8xl text-balance" style={shadow}>
              Happy Belated Birthday, <span className="text-shimmer italic">{NAMES.her}!</span>
            </h2>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="max-w-lg text-base text-lilac-200/90 sm:text-lg text-pretty" style={shadow}>
              Here’s to good conversations, new memories, movie recommendations, scooty lessons, and future rides.
            </p>
          </Reveal>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-5">
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={blow}
              className="glass flex min-h-12 items-center gap-2 rounded-full px-5 text-sm text-lilac-200 transition-colors hover:text-white"
            >
              <Wind size={17} /> {lit ? 'Make a wish & blow the candles' : 'Light them again'}
            </button>
            <button
              onClick={() => setRevealed(true)}
              className="glow-btn flex min-h-12 items-center gap-2 rounded-full px-6 text-base font-medium text-white"
            >
              <Sparkle size={17} /> One last thing…
            </button>
          </div>
          <AnimatePresence>
            {!lit && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-hand text-2xl text-ember-300"
                style={shadow}
              >
                wish saved. no take-backs.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-night-950/70 px-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRevealed(false)}
            role="dialog"
            aria-modal="true"
            aria-label="One last thing"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, rotateX: 25 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-lg overflow-hidden rounded-[32px] px-7 py-10 text-center sm:px-10 sm:py-12"
              style={{ transformPerspective: 900 }}
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <p className="eyebrow relative">One last thing</p>
              <p className="font-display relative mt-5 text-[1.9rem] font-semibold leading-tight text-white sm:text-4xl text-balance">
                Don’t stay angry for too long.
              </p>
              <p className="relative mt-4 text-lg leading-relaxed text-lilac-200/90 text-pretty">
                Life is too short, and we still have a lot of roads to explore.
              </p>
              <p className="relative mt-8 font-hand text-3xl text-rose-300">— {NAMES.me}</p>
              <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#hero"
                  onClick={() => setRevealed(false)}
                  className="flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-lilac-200 hover:bg-white/5"
                >
                  <ArrowUp size={16} /> Watch it from the start
                </a>
                <button onClick={() => setRevealed(false)} className="min-h-12 rounded-full bg-white px-6 text-sm font-medium text-night-900">
                  Okay, okay. Not angry.
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative pb-8 text-center text-xs text-lilac-200/50">
        Made for {NAMES.her} with patience, a little guilt, and a lot of good intentions. — {NAMES.me}
      </footer>
    </section>
  )
}
