import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNearViewport } from '../../hooks/useInView'
import { getDeviceProfile } from '../../lib/device'

// Mounts a WebGL canvas only while its section is near the viewport and tears it down
// afterwards, which frees GPU memory and keeps mobile browsers well under their context limit.
// If WebGL is missing (or the context crashes) the provided fallback is shown instead.
export default function LazyCanvas({ children, fallback = null, className = '', camera, eager = false, frameloop = 'always', ...rest }) {
  const profile = getDeviceProfile()
  const [ref, near] = useNearViewport('250px 0px')
  const [failed, setFailed] = useState(false)
  const active = eager || near
  // R3F deliberately releases the GL context when a canvas unmounts; that must not count as a crash.
  const activeRef = useRef(active)
  activeRef.current = active

  if (!profile.webgl || failed) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div ref={ref} className={className}>
      {active && (
        <Canvas
          dpr={profile.dpr}
          camera={camera}
          frameloop={profile.reducedMotion ? 'demand' : frameloop}
          gl={{ antialias: !profile.mobile, powerPreference: 'high-performance', alpha: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              if (activeRef.current) setFailed(true)
            })
          }}
          style={{ touchAction: 'pan-y' }}
          {...rest}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  )
}
