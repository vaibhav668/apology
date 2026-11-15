// One-time device profiling so every 3D scene can scale itself sensibly.

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

let cached = null

export function getDeviceProfile() {
  if (cached) return cached
  if (typeof window === 'undefined') {
    return { webgl: false, mobile: true, lowPower: true, reducedMotion: false, dpr: [1, 1.5] }
  }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 768
  const mobile = coarse || narrow
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const lowPower = mobile && (cores <= 4 || memory <= 3)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  cached = {
    webgl: detectWebGL(),
    mobile,
    lowPower,
    reducedMotion,
    dpr: lowPower ? [1, 1.25] : mobile ? [1, 1.6] : [1, 2],
  }
  return cached
}

// Scale a particle count by device class.
export function budget(desktop, profile = getDeviceProfile()) {
  if (profile.lowPower) return Math.round(desktop * 0.3)
  if (profile.mobile) return Math.round(desktop * 0.5)
  return desktop
}
