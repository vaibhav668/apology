import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { SECTIONS } from '../../lib/content'

// A thin top progress line (all screens) plus a dotted section rail on larger screens.
export default function ProgressRail({ visible }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [visible])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-lilac-400 via-rose-300 to-ember-300"
        style={{ scaleX }}
      />
      <nav aria-label="Sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center justify-end gap-3" aria-label={s.label}>
            <span className="pointer-events-none translate-x-2 text-[0.68rem] tracking-[0.2em] uppercase text-lilac-200/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-lilac-200/80">
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                active === s.id ? 'h-6 w-[5px] bg-lilac-300 shadow-[0_0_14px_rgba(196,181,253,0.9)]' : 'h-[5px] w-[5px] bg-white/30 group-hover:bg-white/70'
              }`}
            />
          </a>
        ))}
      </nav>
    </>
  )
}
