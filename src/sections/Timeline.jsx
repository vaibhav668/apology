import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Ghost, MessagesSquare, Gift } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { TIMELINE } from '../lib/content'

const ICONS = [Ghost, MessagesSquare, Gift]

function TypingDots() {
  return (
    <span className="flex gap-1 px-1 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-lilac-200"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

function Bubbles({ chips, side }) {
  return (
    <div className={`mt-5 flex flex-wrap gap-2 ${side === 'right' ? 'md:justify-end' : ''}`}>
      {chips.map((c, i) => (
        <motion.span
          key={c}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.35 + i * 0.18, type: 'spring', stiffness: 260, damping: 18 }}
          className={`rounded-2xl px-3.5 py-1.5 text-sm ${
            i % 2 === 0 ? 'rounded-bl-md bg-white/10 text-lilac-200' : 'rounded-br-md bg-plum-500/40 text-white'
          }`}
        >
          {c}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + chips.length * 0.18 }}
        className="rounded-2xl rounded-bl-md bg-white/10 px-3 py-1.5"
      >
        <TypingDots />
      </motion.span>
    </div>
  )
}

export default function Timeline() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="timeline" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div className="pointer-events-none absolute right-[-10rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[130px]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Chapter two · Two days, a few conversations"
          title={<>Who knew a random Snapchat connection could lead to conversations <em className="text-shimmer">worth appreciating?</em></>}
          sub="Not years. Not months. Just two days. And honestly, that’s exactly why it felt worth getting right."
        />

        <div ref={ref} className="relative mt-16 sm:mt-20">
          {/* rail */}
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2" />
          <motion.div
            className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-gradient-to-b from-lilac-300 via-rose-300 to-ember-300 shadow-[0_0_12px_rgba(196,181,253,0.8)] md:left-1/2"
            style={{ scaleY: reduce ? 1 : line }}
          />

          <ol className="space-y-14 md:space-y-20">
            {TIMELINE.map((item, i) => {
              const Icon = ICONS[i]
              const side = i % 2 === 0 ? 'left' : 'right'
              return (
                <li key={item.tag} className="relative grid md:grid-cols-2 md:gap-16">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-lilac-300/50 bg-night-800 text-lilac-200 shadow-[0_0_24px_rgba(167,139,250,0.6)] md:left-1/2 md:-translate-x-1/2"
                  >
                    <Icon size={18} />
                  </motion.span>
                  <motion.article
                    initial={{ opacity: 0, rotateX: reduce ? 0 : 25, y: reduce ? 0 : 50 }}
                    whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformPerspective: 900 }}
                    className={`glass ml-14 rounded-[26px] p-6 sm:p-7 md:ml-0 ${side === 'right' ? 'md:col-start-2' : 'md:text-right'}`}
                  >
                    <span className="font-type text-xs tracking-widest text-rose-300">{item.tag}</span>
                    <h3 className="font-display mt-2 text-2xl font-semibold leading-snug text-white sm:text-3xl text-balance">{item.title}</h3>
                    <p className="mt-3 text-[0.98rem] leading-relaxed text-lilac-200/80">{item.body}</p>
                    <Bubbles chips={item.chips} side={side === 'left' ? 'right' : 'left'} />
                  </motion.article>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
