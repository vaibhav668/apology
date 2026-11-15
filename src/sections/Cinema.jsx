import { lazy, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Moon, Popcorn, Tv } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import LazyCanvas from '../components/ui/LazyCanvas'
import { UNIVERSES } from '../lib/content'

const CinemaScene = lazy(() => import('../components/three/CinemaScene'))

const FRAMES = [
  'plot twists',
  'late-night episodes',
  '“just one more”',
  'dramatic reactions',
  'gothic mysteries',
  'college drama',
  'cliffhangers',
  'popcorn breaks',
  'rewatch value',
  'spoiler-free zone',
]
const FRAME_BG = [
  'from-[#2e0f44] to-[#0b0614]',
  'from-[#5b1740] to-[#140612]',
  'from-[#13224a] to-[#05060f]',
  'from-[#3b1a5c] to-[#0b0618]',
]

function FilmStrip() {
  const items = [...FRAMES, ...FRAMES]
  return (
    <div className="film-strip relative -mx-5 overflow-hidden" aria-hidden>
      <div className="animate-marquee flex w-max gap-3 px-3">
        {items.map((f, i) => (
          <div
            key={i}
            className={`flex h-24 w-36 shrink-0 items-end rounded-md bg-gradient-to-br ${FRAME_BG[i % FRAME_BG.length]} p-3 sm:h-28 sm:w-44`}
          >
            <span className="font-display text-lg italic leading-tight text-white/90">{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenFallback({ universe }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#2a1450,#06040f_70%)] px-6">
      <div
        className="flex aspect-video w-full max-w-xl flex-col items-center justify-center rounded-lg text-center shadow-[0_0_120px_rgba(167,139,250,0.45)]"
        style={{ background: `linear-gradient(135deg, ${universe.screen.join(',')})` }}
      >
        <p className="text-[0.6rem] tracking-[0.4em] text-white/60">SHIVANI PRESENTS</p>
        <p className="font-display mt-2 px-4 text-2xl italic text-white sm:text-4xl">{universe.tagline}</p>
      </div>
    </div>
  )
}

export default function Cinema() {
  const [selected, setSelected] = useState(UNIVERSES[0].id)
  const universe = UNIVERSES.find((u) => u.id === selected)

  return (
    <section id="cinema" className="relative overflow-hidden py-24 sm:py-32">
      <div className="px-5">
        <SectionHeading
          eyebrow="Chapter four · Her cinematic universe"
          title={<>Your world, your stories, your <em className="text-shimmer">endless watchlist.</em></>}
        />
      </div>

      <Reveal className="relative mx-auto mt-12 max-w-6xl px-0 sm:px-5" amount={0.15}>
        <div className="relative h-[56svh] min-h-[360px] overflow-hidden sm:rounded-[32px] sm:border sm:border-white/10 md:h-[70vh]">
          <LazyCanvas className="absolute inset-0" camera={{ position: [0, 0.7, 9], fov: 45 }} fallback={<ScreenFallback universe={universe} />}>
            <CinemaScene universe={universe} />
          </LazyCanvas>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-black/80" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-black/80" />
          <div className="pointer-events-none absolute left-4 top-14 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs text-lilac-200 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" /> Now playing in Shivani’s cinema
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 max-w-6xl px-5">
        <FilmStrip />
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-5">
        <p className="eyebrow mb-5 text-center">Pick tonight’s universe</p>
        <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Choose a universe">
          {UNIVERSES.map((u, i) => {
            const active = u.id === selected
            const Icon = i === 0 ? Moon : Tv
            return (
              <motion.button
                key={u.id}
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(u.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`glass relative overflow-hidden rounded-[26px] p-6 text-left transition-shadow ${
                  active ? 'shadow-[0_0_0_1px_rgba(221,214,254,0.6),0_20px_60px_-15px_rgba(167,139,250,0.6)]' : ''
                }`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl" style={{ background: u.accent }} />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10" style={{ color: u.accent }}>
                    <Icon size={20} />
                  </span>
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-night-900"
                      >
                        <Check size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <p className="relative mt-4 text-[0.68rem] uppercase tracking-[0.25em] text-lilac-200/60">{u.hint}</p>
                <h3 className="relative font-display mt-1 text-2xl font-semibold text-white sm:text-3xl">{u.title}</h3>
                <p className="relative mt-2 text-[0.98rem] leading-relaxed text-lilac-200/80">{u.caption}</p>
              </motion.button>
            )
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Popcorn className="mx-auto mb-4 text-ember-300" />
          <p className="font-display mx-auto max-w-2xl text-2xl italic text-white sm:text-3xl text-balance">
            I might not understand your entire watchlist yet, but I’m definitely going to need some recommendations.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
