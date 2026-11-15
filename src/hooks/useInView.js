import { useEffect, useRef, useState } from 'react'

// Tracks whether an element is near the viewport. Used to mount/unmount WebGL canvases
// so only one or two GPU contexts are ever alive at the same time (important on phones).
export function useNearViewport(rootMargin = '200px 0px') {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, near]
}
