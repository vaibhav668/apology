import { lazy, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, HardHat, Map, Route, Sandwich, Stamp } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import LazyCanvas from '../components/ui/LazyCanvas'
import CssStars from '../components/ui/CssStars'
import { NAMES, SCOOTY_TERMS } from '../lib/content'

const ScooterScene = lazy(() => import('../components/three/ScooterScene'))

const PLANS = [
  { icon: Route, label: 'Random rides' },
  { icon: Map, label: 'Beautiful roads (and bad navigation)' },
  { icon: Sandwich, label: 'Unnecessary food stops' },
  { icon: Camera, label: 'Lots of memories' },
]

function ScooterFallback({ riding }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#0b0720] to-[#120a2a]">
      <CssStars count={40} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#17122a]">
        <div className={`absolute left-0 top-1/2 flex w-[200%] gap-10 ${riding ? 'animate-marquee' : ''}`} style={{ animationDuration: '2s' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="h-1 w-12 shrink-0 bg-ember-300/80" />
          ))}
        </div>
      </div>
      <svg viewBox="0 0 200 120" className="absolute bottom-[18%] left-1/2 w-56 -translate-x-1/2" aria-hidden>
        <circle cx="45" cy="95" r="18" fill="#141018" stroke="#6d28d9" strokeWidth="4" />
        <circle cx="155" cy="95" r="18" fill="#141018" stroke="#6d28d9" strokeWidth="4" />
        <path d="M40 78 Q60 50 100 62 L120 78 Z" fill="#c4b5fd" />
        <rect x="70" y="52" width="40" height="8" rx="4" fill="#1b1230" />
        <path d="M118 80 L140 30 L150 30 L160 80 Z" fill="#c4b5fd" />
        <rect x="134" y="22" width="30" height="5" rx="2.5" fill="#d9d9e8" />
        <circle cx="166" cy="40" r="5" fill="#fde68a" />
        <rect x="40" y="78" width="120" height="8" rx="4" fill="#1b1230" />
      </svg>
    </div>
  )
}

export default function Scooty() {
  const [accepted, setAccepted] = useState(false)

  return (
    <section id="scooty" className="relative overflow-hidden py-24 sm:py-32">
      <div className="px-5">
        <SectionHeading
          eyebrow="Chapter five · One pending mission…"
          title={<>Operation: Teaching Shivani <em className="text-shimmer">How To Ride A Scooty.</em></>}
          sub="Classified level: extremely important. Deadline: whenever you’re ready."
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl items-center gap-8 px-0 sm:px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <Reveal amount={0.15}>
          <div className="relative h-[52svh] min-h-[340px] overflow-hidden sm:rounded-[32px] sm:border sm:border-white/10 lg:h-[620px]">
            <LazyCanvas className="absolute inset-0" camera={{ position: [3.4, 1.8, 4.2], fov: 42 }} fallback={<ScooterFallback riding={accepted} />}>
              <ScooterScene riding={accepted} />
            </LazyCanvas>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night-950/90 to-transparent" />
            <AnimatePresence>
              {accepted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-5 left-0 right-0 text-center font-hand text-2xl text-ember-300"
                >
                  engine on. lesson one: don’t panic.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="px-5 sm:px-0">
          <div className="paper relative overflow-hidden rounded-[22px] p-6 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] sm:p-8">
            <p className="font-type text-center text-[0.68rem] tracking-[0.3em] text-ink/60">OFFICIAL · NON-REFUNDABLE · VERY SERIOUS</p>
            <h3 className="font-display mt-2 text-center text-[1.65rem] font-bold leading-tight text-ink sm:text-3xl">The Scooty Learning Agreement</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-ink/15 py-4 font-type text-sm">
              <div>
                <p className="text-[0.65rem] tracking-widest text-ink/50">INSTRUCTOR</p>
                <p className="text-ink">{NAMES.me}</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-widest text-ink/50">STUDENT</p>
                <p className="text-ink">{NAMES.her}</p>
              </div>
            </div>
            <p className="mt-4 font-type text-xs tracking-widest text-ink/60">TERMS AND CONDITIONS</p>
            <ol className="mt-2 space-y-2.5 text-[0.97rem] leading-snug text-ink">
              {SCOOTY_TERMS.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="font-type text-plum-500">{i + 1}.</span>
                  <span className="flex-1">
                    {t}
                    {i === 2 && <HardHat size={15} className="ml-1.5 inline -translate-y-0.5 text-plum-500" />}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="h-10 font-hand text-3xl leading-10 text-plum-500">{NAMES.me}</p>
                <p className="border-t border-ink/30 pt-1 text-[0.65rem] tracking-widest text-ink/50">INSTRUCTOR’S SIGNATURE</p>
              </div>
              <div>
                <div className="h-10 overflow-hidden">
                  <motion.p
                    className="font-hand text-3xl leading-10 text-plum-500"
                    initial={false}
                    animate={{ clipPath: accepted ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                    transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
                  >
                    {NAMES.her}
                  </motion.p>
                </div>
                <p className="border-t border-ink/30 pt-1 text-[0.65rem] tracking-widest text-ink/50">STUDENT’S SIGNATURE</p>
              </div>
            </div>

            {!accepted ? (
              <button
                onClick={() => setAccepted(true)}
                className="glow-btn mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-medium text-white"
              >
                <Stamp size={19} /> Accept the scooty mission
              </button>
            ) : (
              <div className="mt-7 h-16" aria-hidden />
            )}

            <AnimatePresence>
              {accepted && (
                <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center sm:bottom-7" role="status">
                  <motion.div
                    initial={{ opacity: 0, scale: 3, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    className="rounded-xl border-[3px] border-rose-600/80 px-5 py-2 text-center font-type text-2xl font-bold tracking-widest text-rose-600/85 mix-blend-multiply"
                    style={{ boxShadow: 'inset 0 0 0 2px rgba(225,29,72,0.25)' }}
                  >
                    MISSION ACCEPTED
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {accepted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="mx-auto mt-14 max-w-4xl px-5 text-center"
          >
            <p className="font-display text-2xl italic text-white sm:text-3xl text-balance">
              Future plans include random rides, beautiful roads, unnecessary food stops, bad navigation, and lots of memories.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PLANS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.6 + i * 0.12 }}
                  className="glass flex flex-col items-center gap-2 rounded-2xl px-3 py-5 text-sm text-lilac-200"
                >
                  <Icon size={22} className="text-rose-300" />
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
