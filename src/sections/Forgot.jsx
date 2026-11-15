import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CalendarHeart, Quote } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import CssStars from '../components/ui/CssStars'
import { BIRTHDAY } from '../lib/content'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WRONG_DAY_LINES = [
  'Nope, not this one. That’s exactly the problem.',
  'Also not it. My brain is still buffering.',
  'Closer? I genuinely can’t tell. That’s the issue.',
  'Wrong again. Please pretend you didn’t see that.',
]

function Calendar() {
  const now = new Date()
  const month = BIRTHDAY ? BIRTHDAY.month : now.getMonth()
  const year = now.getFullYear()
  const special = BIRTHDAY ? BIRTHDAY.day : null
  const days = new Date(year, month + 1, 0).getDate()
  const offset = new Date(year, month, 1).getDay()
  const cells = useMemo(() => [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)], [offset, days])

  const [message, setMessage] = useState('Tap the glowing date.')
  const [found, setFound] = useState(false)
  const wrong = useRef(0)

  // pointer tilt (desktop) + gentle idle sway (touch)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })
  const glare = useTransform(sry, [-14, 14], ['20%', '80%'])
  const glareBg = useTransform(glare, (g) => `radial-gradient(circle at ${g} 0%, rgba(255,255,255,0.25), transparent 55%)`)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 22)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  const pick = (d) => {
    if (d === special) {
      setFound(true)
      setMessage(BIRTHDAY ? `${BIRTHDAY.day} ${MONTHS[BIRTHDAY.month]}. Your birthday. The one day I really should have remembered.` : 'The exact date my brain misplaced. Your birthday. My bad.')
    } else {
      setMessage(WRONG_DAY_LINES[wrong.current % WRONG_DAY_LINES.length])
      wrong.current += 1
    }
  }

  return (
    <div style={{ perspective: 1100 }} className="w-full max-w-[380px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: glareBg }}
        />
        {/* binder rings */}
        <div className="absolute -top-1 left-0 right-0 flex justify-center gap-24">
          {[0, 1].map((i) => (
            <span key={i} className="h-5 w-3 rounded-b-full bg-gradient-to-b from-silver-200 to-lilac-400/60" />
          ))}
        </div>
        <div className="mb-4 mt-3 flex items-end justify-between" style={{ transform: 'translateZ(30px)' }}>
          <div>
            <p className="eyebrow !text-[0.6rem]">The month of the mistake</p>
            <p className="font-display text-3xl font-semibold text-white">{MONTHS[month]}</p>
          </div>
          <CalendarHeart className="text-rose-300" />
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[0.7rem] text-lilac-200/50" style={{ transform: 'translateZ(20px)' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i} className="pb-1">{d}</span>
          ))}
          {cells.map((d, i) =>
            d === null ? (
              <span key={`e${i}`} />
            ) : (
              <button
                key={d}
                onClick={() => pick(d)}
                aria-label={d === special ? 'The forgotten birthday' : `Day ${d}`}
                className={`relative flex aspect-square items-center justify-center rounded-xl text-sm transition-colors ${
                  d === special
                    ? 'bg-gradient-to-br from-plum-500 to-fuchsia-500 font-semibold text-white'
                    : 'text-lilac-200/70 hover:bg-white/10 active:bg-white/15'
                }`}
              >
                {d === special && !BIRTHDAY && !found ? '?' : d}
                {d === special && (
                  <motion.span
                    className="absolute inset-0 rounded-xl ring-2 ring-rose-300"
                    animate={{ opacity: [0.9, 0.1, 0.9], scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </button>
            ),
          )}
        </div>
        <div className="mt-4 min-h-[3rem] rounded-2xl bg-black/25 px-4 py-3 text-sm text-lilac-200/90" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={message} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {message}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function Counter({ to, start }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return undefined
    const c = animate(0, to, { duration: to > 100 ? 2.4 : 1.6, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [to, start])
  return <>{val}</>
}

function MemoryBrain() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!inView) return undefined
    let p = 0
    let id
    const run = () => {
      setFailed(false)
      p = 0
      id = window.setInterval(() => {
        p += Math.random() * 9
        if (p >= 97) {
          window.clearInterval(id)
          setProgress(97)
          setFailed(true)
          id = window.setTimeout(run, 2600)
          return
        }
        setProgress(p)
      }, 140)
    }
    run()
    return () => {
      window.clearInterval(id)
      window.clearTimeout(id)
    }
  }, [inView])

  const stats = [
    { label: 'Short-term memory', value: 0, color: 'from-slate-500 to-slate-400' },
    { label: 'Guilt', value: 100, color: 'from-rose-400 to-fuchsia-400' },
    { label: 'Intentions', value: 1000, color: 'from-lilac-400 to-ember-300' },
  ]

  return (
    <div ref={ref} className="glass relative w-full max-w-[380px] rounded-[28px] p-6">
      <div className="flex items-center gap-5">
        <motion.svg viewBox="0 0 120 100" className="h-24 w-28 shrink-0" animate={{ rotate: failed ? [0, -6, 6, -4, 0] : 0, y: [0, -4, 0] }} transition={{ rotate: { duration: 0.5 }, y: { duration: 3, repeat: Infinity } }}>
          <defs>
            <linearGradient id="brain" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5d0fe" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path d="M58 14c-8-8-24-6-28 4-12-2-20 10-16 20-10 6-8 22 4 26 0 12 14 18 24 12 6 8 16 8 16-2z" fill="url(#brain)" />
          <path d="M62 14c8-8 24-6 28 4 12-2 20 10 16 20 10 6 8 22-4 26 0 12-14 18-24 12-6 8-16 8-16-2z" fill="url(#brain)" />
          <path d="M30 34c6 0 8 6 14 4M24 54c8-2 10 6 18 4M44 70c2-6 8-6 10-2M92 34c-6 0-8 6-14 4M96 54c-8-2-10 6-18 4M76 70c-2-6-8-6-10-2" stroke="#6d28d9" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
          {/* eyes */}
          <circle cx="48" cy="46" r="3.5" fill="#2b1d3a" />
          <circle cx="72" cy="46" r="3.5" fill="#2b1d3a" />
          <path d={failed ? 'M52 62q8-6 16 0' : 'M52 60q8 5 16 0'} stroke="#2b1d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {failed && <text x="88" y="16" fontSize="16" fill="#fcd38d">?!</text>}
        </motion.svg>
        <div className="min-w-0 flex-1">
          <p className="font-type text-xs text-lilac-200/70">brain.exe</p>
          <p className="font-type text-sm text-white">{failed ? 'ERROR: date not found' : 'Loading birthday date…'}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${failed ? 'bg-rose-400' : 'bg-gradient-to-r from-lilac-400 to-rose-300'}`}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.14 }}
            />
          </div>
          <p className="mt-1 text-right font-type text-[0.7rem] text-lilac-200/60">{Math.round(progress)}%</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3 rounded-2xl bg-black/25 px-4 py-3">
            <span className="text-sm text-lilac-200/85">{s.label}</span>
            <span className={`bg-gradient-to-r ${s.color} bg-clip-text font-display text-3xl font-bold text-transparent`}>
              <Counter to={s.value} start={inView} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Forgot() {
  return (
    <section id="forgot" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <CssStars count={40} />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-plum-500/20 blur-[120px]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Chapter one · The birthday I forgot"
          title={<>One date. One important day. And one person with absolutely <em className="text-shimmer">questionable memory.</em></>}
        />

        <div className="grid w-full place-items-center gap-10 md:grid-cols-2 md:gap-12">
          <Reveal className="flex w-full justify-center">
            <Calendar />
          </Reveal>
          <Reveal delay={0.15} className="flex w-full flex-col items-center gap-6">
            <p className="font-display max-w-sm text-center text-2xl text-white sm:text-3xl text-balance">
              Yes, I forgot your birthday. <span className="text-lilac-300 italic">And no, I’m not proud of it.</span>
            </p>
            <MemoryBrain />
          </Reveal>
        </div>

        <Reveal className="w-full max-w-3xl">
          <div className="glass relative overflow-hidden rounded-[32px] px-6 py-10 sm:px-12 sm:py-14">
            <Quote className="absolute -top-2 right-6 h-24 w-24 text-white/5" />
            <p className="eyebrow mb-4 text-center">Jokes apart</p>
            <h3 className="font-display text-center text-3xl font-semibold text-white sm:text-5xl text-balance">
              I’m genuinely sorry, Shivani.
            </h3>
            <div className="mx-auto mt-8 max-w-xl space-y-5 text-[1.02rem] leading-relaxed text-lilac-200/85 sm:text-lg text-pretty">
              <p>
                I know I messed up. Forgetting your birthday was entirely my fault. I could blame my short-term memory, but honestly, that’s not an excuse.
              </p>
              <p>You deserved to be wished on time, and I should have remembered.</p>
            </div>
            <p className="mt-10 border-t border-white/10 pt-8 text-center font-display text-xl italic text-white sm:text-2xl text-balance">
              “I might have forgotten a date, but that doesn’t mean I don’t value the person.”
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
