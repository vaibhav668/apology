import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Hero from './sections/Hero'
import Forgot from './sections/Forgot'
import Timeline from './sections/Timeline'
import Dossier from './sections/Dossier'
import Gallery from './sections/Gallery'
import Cinema from './sections/Cinema'
import Scooty from './sections/Scooty'
import Pocket from './sections/Pocket'
import Letter from './sections/Letter'
import Finale from './sections/Finale'
import ProgressRail from './components/ui/ProgressRail'
import MusicToggle from './components/ui/MusicToggle'

// Canvas textures are painted with web fonts, so make sure those fonts are loaded first.
const CANVAS_FONTS = ['700 84px "Caveat"', '600 34px "Cormorant Garamond"', 'italic 600 44px "Cormorant Garamond"', '500 16px "Inter"']

function useFontsReady(timeout = 2500) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    const t = window.setTimeout(finish, timeout)
    if (document.fonts?.load) {
      Promise.all(CANVAS_FONTS.map((f) => document.fonts.load(f)))
        .then(() => document.fonts.ready)
        .then(finish, finish)
    } else {
      finish()
    }
    return () => window.clearTimeout(t)
  }, [timeout])
  return ready
}

function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night-950"
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <motion.span
        className="h-12 w-12 rounded-full border-2 border-lilac-300/20 border-t-lilac-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="eyebrow">Setting the stage</p>
    </motion.div>
  )
}

export default function App() {
  const fontsReady = useFontsReady()
  const [opened, setOpened] = useState(false)

  // Keep the page still until the envelope is opened, so the story starts at the beginning.
  useEffect(() => {
    const root = document.documentElement
    if (!opened) {
      window.scrollTo(0, 0)
      root.classList.add('locked')
    } else {
      root.classList.remove('locked')
    }
    return () => root.classList.remove('locked')
  }, [opened])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  const handleOpen = useCallback(() => {
    setOpened(true)
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => document.getElementById('forgot')?.scrollIntoView({ behavior: 'smooth', block: 'start' })),
    )
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!fontsReady && <Preloader key="pre" />}</AnimatePresence>
      <ProgressRail visible={opened} />
      <main className="relative">
        {fontsReady && <Hero opened={opened} onOpen={handleOpen} />}
        {opened && (
          <>
            <Forgot />
            <Timeline />
            <Dossier />
            <Gallery />
            <Cinema />
            <Scooty />
            <Pocket />
            <Letter />
            <Finale />
          </>
        )}
      </main>
      {fontsReady && <MusicToggle />}
    </MotionConfig>
  )
}
