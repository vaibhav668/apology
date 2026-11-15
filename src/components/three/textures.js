import * as THREE from 'three'

// Every texture in the site is painted procedurally onto a small canvas:
// zero image downloads, tiny memory footprint, and fully original artwork.

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function finish(c) {
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

const cache = new Map()
function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key)
}

export function glowTexture(color = '#c4b5fd') {
  return cached(`glow-${color}`, () => {
    const [c, ctx] = canvas(128, 128)
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, color)
    g.addColorStop(0.25, color + 'aa')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return finish(c)
  })
}

export function moonTexture() {
  return cached('moon', () => {
    const [c, ctx] = canvas(512, 256)
    ctx.fillStyle = '#d9d3ec'
    ctx.fillRect(0, 0, 512, 256)
    // seeded pseudo-random so the moon looks the same every visit
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 26; i++) {
      const x = rand() * 512
      const y = 30 + rand() * 196
      const r = 6 + rand() * 30
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(120,110,160,0.45)')
      g.addColorStop(0.7, 'rgba(150,140,185,0.25)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(${rand() > 0.5 ? '255,255,255' : '90,80,130'},${rand() * 0.12})`
      ctx.fillRect(rand() * 512, rand() * 256, 2, 2)
    }
    return finish(c)
  })
}

export function letterCardTexture(name) {
  return cached(`letter-${name}`, () => {
    const [c, ctx] = canvas(512, 340)
    const g = ctx.createLinearGradient(0, 0, 512, 340)
    g.addColorStop(0, '#fbf5ea')
    g.addColorStop(1, '#efe2cf')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 340)
    ctx.strokeStyle = 'rgba(124,58,237,0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(18, 18, 476, 304)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#4c1d95'
    ctx.font = '600 34px "Cormorant Garamond", Georgia, serif'
    ctx.fillText('for', 256, 120)
    ctx.font = '700 84px "Caveat", cursive'
    ctx.fillStyle = '#2b1d3a'
    ctx.fillText(name, 256, 205)
    ctx.font = '500 20px "Inter", sans-serif'
    ctx.fillStyle = 'rgba(76,29,149,0.7)'
    ctx.fillText('a little late, but never forgotten', 256, 262)
    return finish(c)
  })
}

export function sealTexture() {
  return cached('seal', () => {
    const [c, ctx] = canvas(256, 256)
    const g = ctx.createRadialGradient(110, 100, 10, 128, 128, 128)
    g.addColorStop(0, '#c084fc')
    g.addColorStop(0.6, '#6d28d9')
    g.addColorStop(1, '#3b0764')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(128, 128, 124, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(128, 128, 96, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#f5f3ff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 120px "Cormorant Garamond", Georgia, serif'
    ctx.fillText('S', 128, 136)
    return finish(c)
  })
}

// Original poster art for the cinema room: abstract, moody, no copyrighted imagery.
export function posterTexture(variant) {
  return cached(`poster-${variant}`, () => {
    const [c, ctx] = canvas(320, 480)
    const palettes = {
      gothic: ['#07040f', '#2e0f44', '#a78bfa'],
      campus: ['#140612', '#5b1740', '#f9a8d4'],
      mystery: ['#05060f', '#13224a', '#93c5fd'],
      night: ['#0b0618', '#3b1a5c', '#fcd38d'],
    }
    const [a, b, accent] = palettes[variant] || palettes.gothic
    const g = ctx.createLinearGradient(0, 0, 0, 480)
    g.addColorStop(0, b)
    g.addColorStop(1, a)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 320, 480)

    ctx.save()
    if (variant === 'gothic') {
      // a tall arched window + a lone figure silhouette
      ctx.fillStyle = accent + '33'
      ctx.beginPath()
      ctx.moveTo(90, 360)
      ctx.lineTo(90, 170)
      ctx.quadraticCurveTo(160, 60, 230, 170)
      ctx.lineTo(230, 360)
      ctx.fill()
      ctx.strokeStyle = accent + '88'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(160, 110)
      ctx.lineTo(160, 360)
      ctx.moveTo(90, 250)
      ctx.lineTo(230, 250)
      ctx.stroke()
      ctx.fillStyle = '#05030b'
      ctx.beginPath()
      ctx.arc(160, 300, 16, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(146, 314, 28, 50)
    } else if (variant === 'campus') {
      // hearts-free: a skyline of dorm windows under neon dusk
      for (let i = 0; i < 6; i++) {
        const x = 20 + i * 48
        const h = 100 + ((i * 53) % 90)
        ctx.fillStyle = '#12050f'
        ctx.fillRect(x, 380 - h, 40, h)
        for (let wy = 380 - h + 12; wy < 370; wy += 20) {
          for (let wx = x + 6; wx < x + 36; wx += 14) {
            ctx.fillStyle = (wx + wy) % 3 === 0 ? accent + 'cc' : accent + '22'
            ctx.fillRect(wx, wy, 7, 9)
          }
        }
      }
      const sun = ctx.createRadialGradient(160, 170, 0, 160, 170, 90)
      sun.addColorStop(0, accent + 'aa')
      sun.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sun
      ctx.fillRect(0, 60, 320, 240)
    } else if (variant === 'mystery') {
      ctx.strokeStyle = accent + '66'
      for (let r = 20; r < 170; r += 22) {
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(160, 210, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(160, 210, 10, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = accent
      for (let i = 0; i < 40; i++) {
        ctx.globalAlpha = 0.2 + ((i * 37) % 10) / 12
        ctx.beginPath()
        ctx.arc((i * 71) % 320, (i * 113) % 300, ((i * 13) % 3) + 1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(200, 120, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = b
      ctx.beginPath()
      ctx.arc(215, 110, 38, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()

    const titles = { gothic: 'THE QUIET ONE', campus: 'ONE MORE EPISODE', mystery: 'UNSOLVED', night: 'MIDNIGHT RERUN' }
    ctx.fillStyle = '#f5f3ff'
    ctx.textAlign = 'center'
    ctx.font = '700 30px "Cormorant Garamond", Georgia, serif'
    ctx.fillText(titles[variant] || 'NOW SHOWING', 160, 420)
    ctx.font = '500 11px "Inter", sans-serif'
    ctx.fillStyle = accent
    ctx.fillText('AN ORIGINAL SHIVANI WATCHLIST POSTER', 160, 448)
    return finish(c)
  })
}

export function screenTexture(colors, tagline) {
  return cached(`screen-${tagline}`, () => {
    const [c, ctx] = canvas(640, 360)
    const g = ctx.createLinearGradient(0, 0, 640, 360)
    g.addColorStop(0, colors[0])
    g.addColorStop(0.6, colors[1])
    g.addColorStop(1, colors[2])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 640, 360)
    const v = ctx.createRadialGradient(320, 180, 60, 320, 180, 380)
    v.addColorStop(0, 'rgba(0,0,0,0)')
    v.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, 640, 360)
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.font = '500 16px "Inter", sans-serif'
    ctx.fillText('S H I V A N I   P R E S E N T S', 320, 120)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'italic 600 44px "Cormorant Garamond", Georgia, serif'
    ctx.fillText(tagline, 320, 196)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '500 14px "Inter", sans-serif'
    ctx.fillText('rated: highly recommended by the birthday girl', 320, 244)
    return finish(c)
  })
}
