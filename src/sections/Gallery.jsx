import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import littleShivani from '../assets/photos/little-shivani.jpg'
import sunshine from '../assets/photos/sunshine.jpg'
import traditional from '../assets/photos/traditional.jpg'
import smile from '../assets/photos/smile-sideways.jpg'

const PHOTOS = [
  {
    src: littleShivani,
    w: 580,
    h: 734,
    tag: 'Exhibit A · The early years',
    caption: 'Tiny Shivani. The smile was there from day one.',
    tilt: -4,
    tape: 'bg-rose-300/70',
  },
  {
    src: sunshine,
    w: 836,
    h: 1156,
    tag: 'Exhibit B · Sunshine edition',
    caption: 'Sunshine, a tree, and a genuinely sweet smile. Anger issues: not detected.',
    tilt: 3,
    tape: 'bg-ember-300/70',
  },
  {
    src: traditional,
    w: 686,
    h: 870,
    tag: 'Exhibit C · Traditional mode',
    caption: 'Full traditional look. That nath is doing some serious work.',
    tilt: -2,
    tape: 'bg-lilac-300/70',
  },
  {
    src: smile,
    w: 1210,
    h: 856,
    tag: 'Exhibit D · The “I’m not angry” face',
    caption: 'Claims to have anger issues. Exhibit D strongly disagrees.',
    tilt: 4,
    tape: 'bg-sky-300/70',
  },
]

function Polaroid({ photo, index, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: photo.tilt }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 5 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Open photo: ${photo.tag}`}
      className="relative block w-full bg-[#fbf8f2] p-2.5 pb-3 text-left shadow-[0_25px_60px_-20px_rgba(0,0,0,0.85)] sm:p-3.5 sm:pb-4"
    >
      <span className={`absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] ${photo.tape} shadow-sm`} aria-hidden />
      <div className="overflow-hidden bg-zinc-200">
        <img
          src={photo.src}
          width={photo.w}
          height={photo.h}
          alt={photo.caption}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover"
          style={{ objectPosition: index === 3 ? '60% 40%' : '50% 30%' }}
        />
      </div>
      <p className="mt-2 font-type text-[0.55rem] uppercase tracking-[0.15em] text-ink/50 sm:text-[0.62rem]">{photo.tag}</p>
      <p className="mt-0.5 font-hand text-[1.05rem] leading-tight text-ink sm:text-[1.3rem]">{photo.caption}</p>
    </motion.button>
  )
}

function Lightbox({ index, onClose, onStep }) {
  const photo = PHOTOS[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overscroll-contain bg-night-950/90 px-4 py-16 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.tag}
    >
      <button
        onClick={onClose}
        aria-label="Close photo"
        className="glass absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full text-white"
      >
        <X size={20} />
      </button>

      <motion.div
        key={index}
        className="relative w-full max-w-md bg-[#fbf8f2] p-3 pb-5 shadow-[0_40px_120px_-20px_rgba(124,58,237,0.6)] sm:max-w-lg"
        initial={{ rotate: photo.tilt, scale: 0.9, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) onStep(1)
          else if (info.offset.x > 70) onStep(-1)
        }}
      >
        <div className="overflow-hidden bg-zinc-200">
          <img src={photo.src} alt={photo.caption} draggable={false} className="max-h-[62svh] w-full object-contain" />
        </div>
        <p className="mt-3 font-type text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">{photo.tag}</p>
        <p className="mt-1 font-hand text-2xl leading-tight text-ink sm:text-[1.7rem]">{photo.caption}</p>
      </motion.div>

      <div className="mt-6 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onStep(-1)} aria-label="Previous photo" className="glass flex h-12 w-12 items-center justify-center rounded-full text-white">
          <ChevronLeft size={22} />
        </button>
        <span className="font-type text-xs text-lilac-200/70">
          {index + 1} / {PHOTOS.length}
        </span>
        <button onClick={() => onStep(1)} aria-label="Next photo" className="glass flex h-12 w-12 items-center justify-center rounded-full text-white">
          <ChevronRight size={22} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length)), [])

  return (
    <section id="gallery" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-rose-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-plum-500/15 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Case file · Photographic evidence"
          title={<>Exhibits A to D. <em className="text-shimmer">Case closed.</em></>}
          sub="Collected for the character file. Every single one points to the same conclusion: sweet, not scary."
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-4 md:gap-x-6">
          {PHOTOS.map((p, i) => (
            <div key={p.tag} className={i % 2 ? 'mt-8 md:mt-14' : ''}>
              <Polaroid photo={p} index={i} onOpen={setOpen} />
            </div>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <p className="font-hand text-3xl text-rose-300 sm:text-4xl">Verdict: pretty, obviously.</p>
          <p className="mt-2 text-sm text-lilac-200/60">Tap any photo to look closer.</p>
        </Reveal>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
