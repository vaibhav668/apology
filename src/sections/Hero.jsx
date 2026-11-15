import { lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MailOpen } from 'lucide-react'
import LazyCanvas from '../components/ui/LazyCanvas'
import CssStars from '../components/ui/CssStars'
import { getDeviceProfile } from '../lib/device'

const HeroScene = lazy(() => import('../components/three/HeroScene'))

function CssEnvelope({ open }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 900 }}>
      <motion.div
        className="relative h-[150px] w-[240px]"
        animate={open ? { y: 40 } : { y: [0, -10, 0] }}
        transition={open ? { duration: 0.8 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-md bg-[#c9bcea] shadow-[0_0_80px_rgba(139,92,246,0.55)]" />
        <motion.div
          className="paper absolute inset-x-3 top-3 flex h-[120px] flex-col items-center justify-center rounded"
          animate={open ? { y: -120 } : { y: 0 }}
          transition={{ duration: 0.9, delay: open ? 0.7 : 0 }}
        >
          <span className="font-display text-sm text-plum-500">for</span>
          <span className="font-hand text-4xl">Shivani</span>
        </motion.div>
        <div
          className="absolute inset-0 rounded-md bg-[#ddd3f5]"
          style={{ clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)' }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-[95px] origin-top bg-[#d2c5f0]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformStyle: 'preserve-3d' }}
          animate={open ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </div>
  )
}

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: (d) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: d, duration: 1.1, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Hero({ opened, onOpen }) {
  const profile = getDeviceProfile()
  const [opening, setOpening] = useState(false)

  const begin = useCallback(() => {
    if (opening) return
    setOpening(true)
  }, [opening])

  // let the envelope animation play, then hand over to the rest of the experience
  useEffect(() => {
    if (!opening || opened) return undefined
    const t = window.setTimeout(onOpen, profile.reducedMotion ? 300 : 3000)
    return () => window.clearTimeout(t)
  }, [opening, opened, onOpen, profile.reducedMotion])

  const fallback = (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#1d1245_0%,#05030f_70%)]">
      <CssStars count={70} />
      <div className="absolute right-[12%] top-[10%] h-24 w-24 rounded-full bg-[#ddd6fe] shadow-[0_0_80px_30px_rgba(167,139,250,0.35)]" />
      <CssEnvelope open={opening} />
    </div>
  )

  return (
    <section id="hero" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <LazyCanvas eager className="absolute inset-0" camera={{ position: [0, 0, 6], fov: 45 }} fallback={fallback}>
        <HeroScene opening={opening} onEnvelopeClick={begin} />
      </LazyCanvas>

      {/* cinematic vignette + letterbox gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,3,13,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night-950 to-transparent" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))] text-center">
        <AnimatePresence mode="wait">
          {!opening ? (
            <motion.div key="intro" className="flex flex-col items-center gap-3" exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}>
              <motion.p variants={lineVariants} initial="hidden" animate="show" custom={0.4} className="eyebrow">
                A little late, but never forgotten
              </motion.p>
              <motion.h1
                variants={lineVariants}
                initial="hidden"
                animate="show"
                custom={0.9}
                className="font-display max-w-3xl text-[2.05rem] font-semibold leading-[1.08] text-white sm:text-5xl md:text-6xl text-balance"
              >
                Some apologies deserve more than just a <span className="text-shimmer italic">text message.</span>
              </motion.h1>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.6, duration: 1 } }}
            >
              <p className="eyebrow">The envelope is open</p>
              <h1 className="font-display text-4xl font-semibold text-white sm:text-6xl">
                Happy belated birthday, <span className="text-shimmer italic">Shivani.</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!opening ? (
            <motion.div key="cta" className="flex flex-col items-center gap-6" exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}>
              <motion.p variants={lineVariants} initial="hidden" animate="show" custom={2} className="max-w-md text-base text-lilac-200/85 sm:text-lg">
                Hey Shivani, this little corner of the internet is for you.
              </motion.p>
              <motion.button
                variants={lineVariants}
                initial="hidden"
                animate="show"
                custom={2.7}
                onClick={begin}
                className="glow-btn pointer-events-auto flex min-h-14 items-center gap-3 rounded-full px-7 py-4 text-base font-medium text-white"
              >
                <MailOpen size={20} />
                Open your little surprise
              </motion.button>
            </motion.div>
          ) : (
            <motion.a
              key="scroll"
              href="#forgot"
              className="pointer-events-auto flex flex-col items-center gap-1 text-sm text-lilac-200/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: opened ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              Keep scrolling, it’s all yours
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ChevronDown size={22} />
              </motion.span>
            </motion.a>
          )}
        </AnimatePresence>
      </div>

      {/* lavender flash as the letter comes out */}
      <AnimatePresence>
        {opening && !opened && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(237,233,254,0.55),transparent_60%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9, 0] }}
            transition={{ duration: 3, times: [0, 0.55, 0.8, 1] }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
