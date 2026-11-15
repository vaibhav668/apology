import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BriefcaseBusiness, Clapperboard, Eye, Flame, Flower2, MessageCircleHeart, Sparkles, Star, TriangleAlert } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { DOSSIER } from '../lib/content'
import profilePhoto from '../assets/photos/smile-sideways.jpg'

const ICONS = { Sparkles, MessageCircleHeart, BriefcaseBusiness, Star, Clapperboard, Flame, Flower2 }

function Typewriter({ text, speed = 22 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(id)
          return v
        }
        return v + 1
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-current" />}
    </span>
  )
}

function Corner({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={`absolute h-8 w-8 text-lilac-300/50 ${className}`} aria-hidden>
      <path d="M2 38V14C2 7 7 2 14 2h24" stroke="currentColor" fill="none" strokeWidth="1.2" />
      <path d="M8 38V18c0-6 4-10 10-10h20" stroke="currentColor" fill="none" strokeWidth="0.8" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  )
}

function Row({ item, open, onOpen, index }) {
  const Icon = ICONS[item.icon]
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay: index * 0.07, duration: 0.6 }}
    >
      <button
        onClick={onOpen}
        disabled={open}
        className="group w-full rounded-2xl border border-white/5 bg-black/30 px-4 py-4 text-left transition-colors hover:border-lilac-300/30 disabled:cursor-default sm:px-5"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 font-type text-[0.72rem] uppercase tracking-[0.18em] text-lilac-300">
            <Icon size={15} /> {item.key}
          </span>
          {!open && (
            <span className="flex items-center gap-1 text-[0.7rem] text-lilac-200/50 group-hover:text-lilac-200">
              <Eye size={13} /> tap to declassify
            </span>
          )}
        </div>
        <div className="mt-2 min-h-[1.6rem] font-display text-xl text-white sm:text-[1.4rem]">
          {open ? (
            <Typewriter text={item.value} />
          ) : (
            <span className="inline-block h-5 w-[78%] rounded-sm bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 align-middle" aria-label="Redacted" />
          )}
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-lilac-400 via-rose-300 to-ember-300"
            initial={{ width: 0 }}
            animate={{ width: open ? `${item.meter}%` : '0%' }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </button>
    </motion.li>
  )
}

export default function Dossier() {
  const [revealed, setRevealed] = useState(() => new Set())
  const all = revealed.size === DOSSIER.length

  const open = (i) => setRevealed((s) => new Set(s).add(i))
  const openAll = () => setRevealed(new Set(DOSSIER.map((_, i) => i)))

  return (
    <section id="dossier" className="relative overflow-hidden px-5 py-24 sm:py-32">
      {/* gothic backdrop: arches + pinstripes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(90deg,#fff_0,#fff_1px,transparent_1px,transparent_42px)]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 h-[36rem] w-[22rem] -translate-x-1/2 rounded-t-full border border-lilac-300/10 sm:w-[30rem]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Chapter three · The Shivani character file"
          title={<>An interesting human being, <em className="text-shimmer">apparently.</em></>}
          sub="A strictly unofficial dossier, assembled with care by someone who has known the subject for about two days."
        />

        <Reveal className="mt-14">
          <div className="grain relative overflow-hidden rounded-[30px] border border-lilac-300/15 bg-gradient-to-b from-[#120c24] to-[#0a0716] p-5 shadow-[0_40px_120px_-30px_rgba(124,58,237,0.45)] sm:p-10">
            <Corner className="left-3 top-3" />
            <Corner className="right-3 top-3 rotate-90" />
            <Corner className="bottom-3 left-3 -rotate-90" />
            <Corner className="bottom-3 right-3 rotate-180" />

            <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-10">
              {/* profile column */}
              <div className="flex flex-col items-center gap-4 md:items-start">
                <div className="relative h-56 w-44 overflow-hidden rounded-t-full border border-lilac-300/30 bg-[radial-gradient(circle_at_50%_30%,#3b1a5c,#0b0618_75%)]">
                  <img
                    src={profilePhoto}
                    alt="Shivani, smiling"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: '58% 30%' }}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0b0618] via-transparent to-[#3b1a5c]/20" />
                  <span className="absolute inset-x-0 bottom-3 text-center font-type text-[0.6rem] tracking-[0.25em] text-lilac-200">SUBJECT · CAUGHT SMILING</span>
                </div>
                <div className="space-y-1 text-center font-type text-xs text-lilac-200/70 md:text-left">
                  <p>CASE FILE № 0001</p>
                  <p>SUBJECT: <span className="text-white">SHIVANI</span></p>
                  <p>STATUS: <span className="text-rose-300">BIRTHDAY JUST HAPPENED</span></p>
                  <p>KNOWN FOR: ~2 DAYS</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 2.2, rotate: -18 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.4 }}
                  className="mt-2 rounded-lg border-2 border-rose-400/80 px-4 py-3 text-center font-type text-[0.78rem] leading-snug text-rose-300 shadow-[0_0_30px_rgba(251,113,133,0.25)]"
                >
                  <span className="mb-1 flex items-center justify-center gap-1.5 text-sm font-bold tracking-widest">
                    <TriangleAlert size={16} /> WARNING
                  </span>
                  May get angry without prior notification.
                </motion.div>
              </div>

              {/* attributes */}
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-type text-xs tracking-[0.2em] text-lilac-300">KNOWN ATTRIBUTES</p>
                  <AnimatePresence>
                    {!all && (
                      <motion.button
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={openAll}
                        className="min-h-11 rounded-full border border-lilac-300/30 px-4 text-xs tracking-wider text-lilac-200 hover:bg-white/5"
                      >
                        Declassify everything
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <ul className="space-y-3">
                  {DOSSIER.map((item, i) => (
                    <Row key={item.key} item={item} index={i} open={revealed.has(i)} onOpen={() => open(i)} />
                  ))}
                </ul>
                <AnimatePresence>
                  {all && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="mt-6 text-center font-display text-lg italic text-lilac-200/80 md:text-left"
                    >
                      Conclusion: claims to have anger issues. Evidence mostly suggests a genuinely sweet person. File remains open for updates.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
