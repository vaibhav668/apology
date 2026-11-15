import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { budget, getDeviceProfile } from '../../lib/device'
import { glowTexture, posterTexture, screenTexture } from './textures'

function stripeTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 16
  const ctx = c.getContext('2d')
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#f5f3ff' : '#7c3aed'
    ctx.fillRect(i * 16, 0, 16, 16)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Screen({ universe }) {
  const mat = useRef()
  const glow = useRef()
  const flash = useRef(0)
  const tex = useMemo(() => screenTexture(universe.screen, universe.tagline), [universe])

  useEffect(() => {
    flash.current = 1
  }, [universe])

  useFrame((state, dt) => {
    flash.current = Math.max(0, flash.current - dt * 1.6)
    const flicker = 0.94 + Math.sin(state.clock.elapsedTime * 23) * 0.02 + Math.random() * 0.03
    if (mat.current) mat.current.color.setScalar(flicker + flash.current * 0.8)
    if (glow.current) glow.current.material.opacity = 0.5 + flash.current * 0.4
  })

  return (
    <group position={[0, 1.2, -3]}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[6.7, 3.9, 0.08]} />
        <meshStandardMaterial color="#0d0a18" roughness={0.6} />
      </mesh>
      <mesh>
        <planeGeometry args={[6.4, 3.6]} />
        <meshBasicMaterial ref={mat} map={tex} toneMapped={false} />
      </mesh>
      <sprite ref={glow} position={[0, 0, -0.3]} scale={[13, 8, 1]}>
        <spriteMaterial map={glowTexture(universe.accent)} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  )
}

function Curtains() {
  const pleats = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])
  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 4.1, 1.2, -2.8]}>
          {pleats.map((i) => (
            <mesh key={i} position={[side * i * 0.17, 0, (i % 2) * 0.06]}>
              <cylinderGeometry args={[0.11, 0.13, 5.2, 10, 1, true]} />
              <meshStandardMaterial color="#3b0d4f" roughness={0.85} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  )
}

function Seats({ mobile }) {
  const ref = useRef()
  const rows = mobile ? 2 : 3
  const cols = mobile ? 7 : 11
  const count = rows * cols
  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    let k = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        m.position.set((c - (cols - 1) / 2) * 0.78, -1.6 - r * 0.25, 1.4 + r * 0.9)
        m.updateMatrix()
        ref.current.setMatrixAt(k++, m.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [rows, cols])
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[0.66, 0.75, 0.5]} />
      <meshStandardMaterial color="#1c0f33" roughness={0.9} />
    </instancedMesh>
  )
}

function Beam() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 2) * 0.012
  })
  return (
    <mesh ref={ref} position={[0, 1.6, 3]} rotation={[Math.PI / 2 - 0.06, 0, 0]}>
      <coneGeometry args={[3.2, 12, 32, 1, true]} />
      <meshBasicMaterial color="#d8b4fe" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Reel({ position, speed = 0.6, scale = 1 }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed
  })
  return (
    <Float speed={1.4} floatIntensity={0.8} rotationIntensity={0.4}>
      <group position={position} scale={scale}>
        <group ref={ref}>
          <mesh>
            <torusGeometry args={[0.55, 0.07, 12, 40]} />
            <meshStandardMaterial color="#c0c0d0" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 20]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
              <boxGeometry args={[0.06, 1.05, 0.04]} />
              <meshStandardMaterial color="#d4d4e0" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2 + 0.6
            return (
              <mesh key={`h${i}`} position={[Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0]}>
                <circleGeometry args={[0.12, 20]} />
                <meshBasicMaterial color="#0b0618" />
              </mesh>
            )
          })}
        </group>
      </group>
    </Float>
  )
}

function Popcorn({ position, mobile }) {
  const kernels = useRef()
  const stripes = useMemo(() => stripeTexture(), [])
  const count = mobile ? 16 : 30
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * 0.35,
        y: Math.random(),
        s: 0.06 + Math.random() * 0.05,
        sp: 0.15 + Math.random() * 0.25,
      })),
    [count],
  )
  useEffect(() => () => stripes.dispose(), [stripes])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame((state, dt) => {
    if (!kernels.current) return
    data.forEach((k, i) => {
      k.y += dt * k.sp
      if (k.y > 1.6) k.y = 0
      const lift = k.y
      dummy.position.set(Math.cos(k.a + lift) * (k.r + lift * 0.4), 0.55 + lift, Math.sin(k.a + lift) * (k.r + lift * 0.4))
      dummy.rotation.set(lift * 4, lift * 3, 0)
      dummy.scale.setScalar(k.s * (lift > 1.3 ? (1.6 - lift) / 0.3 : 1))
      dummy.updateMatrix()
      kernels.current.setMatrixAt(i, dummy.matrix)
    })
    kernels.current.instanceMatrix.needsUpdate = true
  })
  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.2}>
      <group position={position} rotation={[0.15, 0, -0.12]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.36, 1, 24, 1, true]} />
          <meshStandardMaterial map={stripes} roughness={0.5} emissive="#ffffff" emissiveMap={stripes} emissiveIntensity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.47, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fff4c2" emissive="#fcd38d" emissiveIntensity={0.35} roughness={0.9} />
        </mesh>
        <instancedMesh ref={kernels} args={[null, null, count]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fffbeb" emissive="#fde68a" emissiveIntensity={0.3} roughness={0.9} />
        </instancedMesh>
      </group>
    </Float>
  )
}

function Poster({ variant, position, rotation }) {
  return (
    <Float speed={1.1} floatIntensity={0.7} rotationIntensity={0.3}>
      <group position={position} rotation={rotation}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.12, 1.62]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.25} />
        </mesh>
        <mesh>
          <planeGeometry args={[1.05, 1.55]} />
          <meshStandardMaterial map={posterTexture(variant)} roughness={0.5} emissive="#ffffff" emissiveIntensity={0.08} />
        </mesh>
      </group>
    </Float>
  )
}

function Rig() {
  const { camera, size } = useThree()
  const snapped = useRef(false)
  const portrait = size.width < size.height
  useFrame((state) => {
    const z = portrait ? 11.5 : 7.8
    if (!snapped.current) {
      camera.position.set(0, 0.7, z)
      snapped.current = true
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.6, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.7 + state.pointer.y * 0.3, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.08)
    camera.lookAt(0, portrait ? 1.25 : 0.7, -1)
  })
  return null
}

export default function CinemaScene({ universe }) {
  const profile = getDeviceProfile()
  const m = profile.mobile
  return (
    <>
      <color attach="background" args={['#06040f']} />
      <fog attach="fog" args={['#06040f', 8, 22]} />
      <ambientLight intensity={0.35} color="#a78bfa" />
      <spotLight position={[0, 6, 4]} angle={0.6} penumbra={0.8} intensity={40} color="#e9d5ff" />
      <pointLight position={[0, 1.2, -1.5]} intensity={18} distance={9} color={universe.accent} />
      <pointLight position={[-4, -1, 3]} intensity={10} distance={10} color="#7c3aed" />
      <Rig />
      <Screen universe={universe} />
      <Curtains />
      <Beam />
      <Seats mobile={m} />
      <Poster variant="gothic" position={m ? [-2.1, 3.9, -1] : [-5.2, 2.2, -0.6]} rotation={[0, 0.35, 0.05]} />
      <Poster variant="campus" position={m ? [2.1, 3.9, -1] : [5.2, 2.2, -0.6]} rotation={[0, -0.35, -0.05]} />
      {!m && <Poster variant="mystery" position={[-4.7, -0.3, 0.6]} rotation={[0, 0.45, -0.06]} />}
      {!m && <Poster variant="night" position={[4.7, -0.3, 0.6]} rotation={[0, -0.45, 0.06]} />}
      <Reel position={m ? [-1.8, -0.9, 2.2] : [-3.3, -0.6, 2.2]} scale={m ? 0.7 : 0.9} />
      <Reel position={m ? [-0.2, 4.2, -1.5] : [3.6, 3.4, 0]} speed={-0.8} scale={0.7} />
      <Popcorn position={m ? [1.55, -1.5, 2.8] : [3.2, -0.9, 2.3]} mobile={m} />
      <Sparkles count={budget(70, profile)} scale={[12, 6, 6]} size={2.5} speed={0.3} color="#fcd38d" opacity={0.6} />
    </>
  )
}
