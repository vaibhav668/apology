import { useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { RotateCcw, Sparkles } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import SunflowerArt from '../components/ui/SunflowerArt'

// Original "future gadgets", inspired by the cosy blue-robot-cat cartoon vibe she loves.
const GADGETS = [
  {
    id: 'toast',
    emoji: '🍞',
    name: 'Remember-It Toast',
    desc: 'Print a date on it, eat it, and you never forget it. First slice already printed: 27 October.',
  },
  {
    id: 'bell',
    emoji: '🔔',
    name: 'Calm-Down Bell',
    desc: 'Ring it once when the anger issues show up. Works instantly. Mostly. Sometimes.',
  },
  {
    id: 'cinema',
    emoji: '🎬',
    name: 'Pocket Cinema',
    desc: 'Fits an entire watchlist. Gothic mysteries and campus drama come pre-loaded.',
  },
  {
    id: 'gps',
    emoji: '🧭',
    name: 'Never-Lost Compass',
    desc: 'For our future scooty rides. Because my navigation, as established, cannot be trusted.',
  },
  {
    id: 'sunflower',
    emoji: 'sunflower',
    name: 'Forever Sunflower',
    desc: 'Never wilts, always faces the bright side. Reserved for the birthday girl.',
  },
]

function GadgetArt({ gadget, size = 'lg' }) {
  const cls = size === 'lg' ? 'h-24 w-24 text-6xl' : 'h-12 w-12 text-2xl'
  return (
    <span className={`flex items-center justify-center rounded-full bg-gradient-to-br from-sky-300/30 to-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.35)] ${cls}`}>
      {gadget.emoji === 'sunflower' ? <SunflowerArt className={size === 'lg' ? 'h-20 w-20' : 'h-10 w-10'} /> : <span aria-hidden>{gadget.emoji}</span>}
    </span>
  )
}

function MagicPocket({ onReach, disabled, controls, bell }) {
  return (
    <div className="relative mx-auto w-[min(78vw,300px)]">
      {/* red collar ribbon + golden bell */}
      <div className="relative z-10 mx-auto h-7 w-[86%] rounded-full bg-gradient-to-b from-[#ff3b30] to-[#c81e1e] shadow-[0_6px_18px_rgba(200,30,30,0.45)]" />
      <motion.div
        className="absolute left-1/2 top-3 z-20 -ml-6 h-12 w-12 origin-top"
        animate={bell}
      >
        <div className="relative h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff6b0,#f5c400_45%,#b98900)] shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
          <span className="absolute left-1 right-1 top-[38%] h-[3px] rounded-full bg-[#8a6400]" />
          <span className="absolute left-1/2 top-[58%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#5c4300]" />
          <span className="absolute left-1/2 top-[70%] h-3 w-[2px] -translate-x-1/2 bg-[#5c4300]" />
        </div>
      </motion.div>

      {/* blue body with white belly and the pocket */}
      <motion.button
        onClick={onReach}
        disabled={disabled}
        animate={controls}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        aria-label="Reach into the magic pocket"
        className="relative -mt-4 block aspect-square w-full rounded-[44%] bg-gradient-to-b from-[#2bb3f0] to-[#0b7fc4] p-[9%] shadow-[0_30px_80px_-20px_rgba(14,140,210,0.7),inset_0_-12px_30px_rgba(0,0,0,0.2)] disabled:cursor-default"
      >
        <span className="relative flex h-full w-full items-end justify-center rounded-full bg-gradient-to-b from-white to-[#e8f4fb] shadow-[inset_0_-8px_20px_rgba(11,127,196,0.15)]">
          {/* the pocket: a half-moon */}
          <span className="relative mb-[22%] h-[34%] w-[62%] overflow-hidden rounded-b-full border-[3px] border-t-0 border-[#1b2a3a] bg-white">
            <span className="absolute inset-x-0 top-0 h-[3px] bg-[#1b2a3a]" />
            <motion.span
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.45),transparent_70%)]"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </span>
        </span>
      </motion.button>
      {!disabled && (
        <motion.p
          className="mt-4 text-center font-hand text-2xl text-sky-300"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          tap the pocket ↑
        </motion.p>
      )}
    </div>
  )
}

export default function Pocket() {
  const [pulled, setPulled] = useState([])
  const [current, setCurrent] = useState(null)
  const pocket = useAnimationControls()
  const bell = useAnimationControls()
  const empty = pulled.length === GADGETS.length

  const reach = async () => {
    if (empty) return
    const next = GADGETS[pulled.length]
    bell.start({ rotate: [0, 22, -18, 12, -6, 0], transition: { duration: 0.8 } })
    setCurrent(null)
    await pocket.start({ scaleX: [1, 1.06, 0.96, 1], scaleY: [1, 0.94, 1.04, 1], transition: { duration: 0.45 } })
    setCurrent(next)
    setPulled((p) => [...p, next])
  }

  const reset = () => {
    setPulled([])
    setCurrent(null)
  }

  return (
    <section id="pocket" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-sky-500/15 blur-[130px]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Chapter six · The magic pocket"
          title={<>A pocket full of gadgets, <em className="text-shimmer">and a few apologies.</em></>}
          sub="Every good childhood had a cartoon with a magic pocket that could fix anything. This one’s been upgraded for exactly this situation."
        />

        <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <MagicPocket onReach={reach} disabled={empty} controls={pocket} bell={bell} />
          </Reveal>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 120, scale: 0.3, rotate: -25 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                  className="glass relative flex flex-col items-center rounded-[28px] px-6 py-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -6 }}
                    transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
                    className="absolute -top-4 right-6 rounded-full bg-[#f5c400] px-3 py-1 font-hand text-xl font-bold text-[#3b2a00] shadow-lg"
                  >
                    Ta-da!
                  </motion.span>
                  <GadgetArt gadget={current} />
                  <p className="mt-2 font-type text-[0.68rem] tracking-[0.25em] text-sky-300">
                    GADGET {pulled.length} OF {GADGETS.length}
                  </p>
                  <h3 className="font-display mt-2 text-3xl font-semibold text-white">{current.name}</h3>
                  <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-lilac-200/85">{current.desc}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-sky-300/25 px-6 text-center"
                >
                  <Sparkles className="text-sky-300" />
                  <p className="font-display text-2xl italic text-white">Five future gadgets inside.</p>
                  <p className="text-sm text-lilac-200/70">Each one built for a very specific problem. Mostly mine.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* gadget shelf */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {GADGETS.map((g) => {
            const got = pulled.some((p) => p.id === g.id)
            return (
              <motion.button
                key={g.id}
                layout
                onClick={() => got && setCurrent(g)}
                disabled={!got}
                className={`flex min-h-12 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  got ? 'border-sky-300/40 bg-sky-400/10 text-white hover:bg-sky-400/20' : 'border-white/10 text-lilac-200/35'
                }`}
              >
                {got ? <GadgetArt gadget={g} size="sm" /> : <span className="flex h-12 w-12 items-center justify-center text-xl">?</span>}
                <span className="pr-2">{got ? g.name : 'Still in the pocket'}</span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {empty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-col items-center gap-4 text-center"
            >
              <p className="font-display max-w-xl text-2xl italic text-white sm:text-3xl text-balance">
                The pocket is empty now. All that’s left inside is good intentions.
              </p>
              <button onClick={reset} className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-lilac-200 hover:bg-white/5">
                <RotateCcw size={15} /> Put everything back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
