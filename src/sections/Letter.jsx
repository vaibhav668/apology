import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import SunflowerArt from '../components/ui/SunflowerArt'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { LETTER, NAMES } from '../lib/content'

const WORD_STEP = 0.035

function InkParagraph({ text, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const words = text.split(' ')
  return (
    <p ref={ref} className={`${inView ? 'ink-on' : ''} ${className}`} style={{ marginBottom: 'var(--lh)' }}>
      {words.map((w, i) => (
        <span key={i} className="ink-word" style={{ animationDelay: `${i * WORD_STEP}s` }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

function FoldedNote({ onOpen }) {
  return (
    <motion.button
      key="folded"
      onClick={onOpen}
      exit={{ rotateX: 70, y: -40, opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
      whileHover={{ y: -6, rotate: -1 }}
      whileTap={{ scale: 0.97 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
      className="paper group relative mx-auto flex aspect-[4/3] w-full max-w-sm flex-col items-center justify-center rounded-md shadow-[0_40px_100px_-20px_rgba(124,58,237,0.6)]"
      style={{ transformPerspective: 1000 }}
      aria-label="Unfold the letter"
    >
      {/* fold creases */}
      <span className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
      <span className="absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
      <span className="relative font-display text-sm italic text-ink/60">a little note for</span>
      <span className="relative font-hand text-6xl text-ink">{NAMES.her}</span>
      <span className="relative mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c084fc,#5b21b6_65%,#3b0764)] font-display text-3xl font-bold text-white shadow-[0_6px_18px_rgba(59,7,100,0.55)] transition-transform group-hover:scale-110">
        V
      </span>
      <span className="relative mt-5 text-xs tracking-[0.25em] text-ink/60 uppercase">Tap to unfold</span>
    </motion.button>
  )
}

export default function Letter() {
  const [open, setOpen] = useState(false)
  const [first, ...rest] = LETTER
  const ps = rest[rest.length - 1]
  const body = rest.slice(0, -1)

  return (
    <section id="letter" className="relative overflow-hidden px-5 py-24 sm:py-32">
      {/* ambient candle-light glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(252,211,141,0.18),rgba(167,139,250,0.12)_45%,transparent_70%)] blur-2xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative mx-auto max-w-3xl">
        <SectionHeading eyebrow="Chapter seven · A little note from me" title={<>Written slowly, <em className="text-shimmer">meant completely.</em></>} />

        <div className="mt-14" style={{ perspective: 1400 }}>
          <AnimatePresence mode="wait">
            {!open ? (
              <Reveal key="folded-wrap">
                <FoldedNote onOpen={() => setOpen(true)} />
              </Reveal>
            ) : (
              <motion.article
                key="letter"
                initial={{ rotateX: -75, scaleY: 0.4, opacity: 0, y: -40 }}
                animate={{ rotateX: 0, scaleY: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: '50% 0%' }}
                className="paper rounded-[6px] px-6 pb-12 pt-10 shadow-[0_50px_140px_-30px_rgba(124,58,237,0.7),0_0_0_1px_rgba(0,0,0,0.05)] sm:px-14 sm:pb-16 sm:pt-14"
              >
                {/* a pressed sunflower tucked into the corner of the page */}
                <div className="pointer-events-none absolute -right-3 -top-4 rotate-12 opacity-90 drop-shadow-[0_4px_6px_rgba(91,52,18,0.35)] sm:-right-5 sm:-top-6">
                  <SunflowerArt className="h-20 w-20 sm:h-28 sm:w-28" />
                </div>
                <div className="ruled relative font-hand text-[1.45rem] text-ink sm:text-[1.75rem]">
                  <InkParagraph text={first} className="text-[1.75rem] font-bold text-plum-500 sm:text-[2.1rem]" />
                  {body.map((p, i) => (
                    <InkParagraph
                      key={i}
                      text={p}
                      className={p.startsWith('I forgot a date') ? 'text-center text-[1.65rem] font-bold text-plum-500 sm:text-[2rem]' : ''}
                    />
                  ))}
                  <div className="flex flex-col items-end">
                    <InkParagraph text={`— ${NAMES.me}`} className="!mb-0 text-[2rem] font-bold sm:text-[2.4rem]" />
                    <motion.svg viewBox="0 0 200 30" className="-mt-1 w-40 text-plum-500" initial="hidden" whileInView="show" viewport={{ once: true }}>
                      <motion.path
                        d="M5 20 C 40 5, 70 28, 110 14 S 170 6, 195 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.4, delay: 0.6 } } }}
                      />
                    </motion.svg>
                  </div>
                  <InkParagraph text={ps} className="mt-[var(--lh)] text-[1.25rem] text-ink/75 sm:text-[1.45rem]" />
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
