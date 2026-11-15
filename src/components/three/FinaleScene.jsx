import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import { budget, getDeviceProfile } from '../../lib/device'
import { glowTexture } from './textures'

function Lanterns({ count }) {
  const mesh = useRef()
  const glow = useRef()
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 18,
        y: Math.random() * 14 - 4,
        z: -3 - Math.random() * 12,
        sp: 0.25 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        s: 0.7 + Math.random() * 0.6,
      })),
    [count],
  )
  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    data.forEach((l, i) => {
      l.y += dt * l.sp
      if (l.y > 11) l.y = -5
      const x = l.x + Math.sin(t * 0.4 + l.ph) * 0.4
      dummy.position.set(x, l.y, l.z)
      dummy.rotation.y = t * 0.2 + l.ph
      dummy.scale.setScalar(l.s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      positions[i * 3] = x
      positions[i * 3 + 1] = l.y
      positions[i * 3 + 2] = l.z
    })
    mesh.current.instanceMatrix.needsUpdate = true
    glow.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <cylinderGeometry args={[0.16, 0.12, 0.34, 8]} />
        <meshStandardMaterial color="#ffb86b" emissive="#ff8a3d" emissiveIntensity={2.2} toneMapped={false} />
      </instancedMesh>
      <points ref={glow}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={1.6} map={glowTexture('#ffb86b')} transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </>
  )
}

const FIREWORK_COLORS = ['#f0abfc', '#c4b5fd', '#fcd38d', '#93c5fd', '#fda4af']

function Firework({ particles, delay, burstRef }) {
  const points = useRef()
  const mat = useRef()
  const state = useMemo(
    () => ({
      pos: new Float32Array(particles * 3),
      vel: new Float32Array(particles * 3),
      // start "expired" so the first burst fires after `delay` seconds
      age: 3.6 - delay,
      life: 2.4,
    }),
    [particles, delay],
  )

  const burst = useMemo(
    () => (origin) => {
      const o = origin || [(Math.random() - 0.5) * 9, 4 + Math.random() * 3, -6 - Math.random() * 4]
      for (let i = 0; i < particles; i++) {
        const u = Math.random() * 2 - 1
        const th = Math.random() * Math.PI * 2
        const r = Math.sqrt(1 - u * u)
        const speed = 2.2 + Math.random() * 0.8
        state.pos.set(o, i * 3)
        state.vel[i * 3] = r * Math.cos(th) * speed
        state.vel[i * 3 + 1] = u * speed
        state.vel[i * 3 + 2] = r * Math.sin(th) * speed
      }
      state.age = 0
      if (mat.current) mat.current.color.set(FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)])
    },
    [particles, state],
  )

  useEffect(() => {
    if (burstRef) burstRef.current.push(burst)
    return () => {
      if (burstRef) burstRef.current = burstRef.current.filter((b) => b !== burst)
    }
  }, [burst, burstRef])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    state.age += d
    if (state.age > state.life + 1.2) burst()
    for (let i = 0; i < particles; i++) {
      state.vel[i * 3] *= 0.975
      state.vel[i * 3 + 1] = state.vel[i * 3 + 1] * 0.975 - 1.2 * d
      state.vel[i * 3 + 2] *= 0.975
      state.pos[i * 3] += state.vel[i * 3] * d
      state.pos[i * 3 + 1] += state.vel[i * 3 + 1] * d
      state.pos[i * 3 + 2] += state.vel[i * 3 + 2] * d
    }
    points.current.geometry.attributes.position.needsUpdate = true
    mat.current.opacity = Math.max(0, 1 - state.age / state.life)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles} array={state.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.28} map={glowTexture('#ffffff')} color="#f0abfc" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Candle({ x, z, lit }) {
  const flame = useRef()
  const scale = useRef(1)
  useFrame((state, dt) => {
    scale.current = THREE.MathUtils.lerp(scale.current, lit ? 1 : 0, dt * 6)
    const f = 1 + Math.sin(state.clock.elapsedTime * 18 + x * 10) * 0.12 + Math.random() * 0.05
    if (flame.current) flame.current.scale.set(scale.current * (1 - (f - 1) * 0.5), scale.current * f, scale.current)
  })
  return (
    <group position={[x, 1.38, z]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.32, 10]} />
        <meshStandardMaterial color="#ede9fe" roughness={0.6} />
      </mesh>
      <group ref={flame} position={[0, 0.24, 0]}>
        <mesh>
          <sphereGeometry args={[0.05, 12, 10]} />
          <meshBasicMaterial color="#fff3c4" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <coneGeometry args={[0.045, 0.14, 12]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <sprite scale={[0.5, 0.5, 1]}>
          <spriteMaterial map={glowTexture('#fcd38d')} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </group>
  )
}

function Cake({ lit }) {
  const candles = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2
    return [Math.cos(a) * 0.38, Math.sin(a) * 0.38]
  }), [])
  const light = useRef()
  useFrame((state, dt) => {
    if (!light.current) return
    const target = lit ? 6 + Math.sin(state.clock.elapsedTime * 20) * 0.8 : 0
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, target, dt * 5)
  })
  return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.45, 1.5, 0.08, 48]} />
        <meshStandardMaterial color="#d9d9e8" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.62, 48]} />
        <meshStandardMaterial color="#5b21b6" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.63, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.09, 12, 48]} />
        <meshStandardMaterial color="#f5d0fe" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.52, 48]} />
        <meshStandardMaterial color="#c4b5fd" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.76, 0.07, 12, 48]} />
        <meshStandardMaterial color="#fdf4ff" roughness={0.4} />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 1.16, 0.5, Math.sin(a) * 1.16]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={i % 2 ? '#fcd38d' : '#f9a8d4'} roughness={0.3} metalness={0.3} />
          </mesh>
        )
      })}
      {candles.map(([x, z], i) => (
        <Candle key={i} x={x} z={z} lit={lit} />
      ))}
      <pointLight ref={light} position={[0, 2, 0.4]} distance={6} color="#fcd38d" intensity={6} />
    </group>
  )
}

function Sunflower({ position, phase, scale = 1, turn = 0 }) {
  const ref = useRef()
  const head = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) ref.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.08
    if (head.current) head.current.rotation.y = turn + Math.sin(t * 0.6 + phase) * 0.15
  })
  const outer = 16
  const inner = 12
  return (
    <group position={position} scale={scale}>
      <group ref={ref}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 1.2, 8]} />
          <meshStandardMaterial color="#4d7c3a" roughness={0.8} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.13, 0.45 + (s > 0 ? 0.15 : 0), 0]} rotation={[0, 0, s * -0.9]} scale={[0.16, 0.05, 0.08]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#5b8f3e" roughness={0.7} />
          </mesh>
        ))}
        <group ref={head} position={[0, 1.22, 0]} rotation={[-0.15, turn, 0]}>
          {Array.from({ length: outer }, (_, i) => {
            const a = (i / outer) * Math.PI * 2
            return (
              <mesh key={`o${i}`} position={[Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0]} rotation={[0, 0, a]} scale={[0.15, 0.05, 0.015]}>
                <sphereGeometry args={[1, 10, 6]} />
                <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.35} roughness={0.5} />
              </mesh>
            )
          })}
          {Array.from({ length: inner }, (_, i) => {
            const a = (i / inner) * Math.PI * 2 + 0.26
            return (
              <mesh key={`i${i}`} position={[Math.cos(a) * 0.16, Math.sin(a) * 0.16, -0.01]} rotation={[0, 0, a]} scale={[0.12, 0.045, 0.012]}>
                <sphereGeometry args={[1, 10, 6]} />
                <meshStandardMaterial color="#eab308" emissive="#d97706" emissiveIntensity={0.3} roughness={0.5} />
              </mesh>
            )
          })}
          <mesh position={[0, 0, 0.02]} scale={[1, 1, 0.45]}>
            <sphereGeometry args={[0.12, 20, 14]} />
            <meshStandardMaterial color="#5b3412" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.065]}>
            <circleGeometry args={[0.075, 20]} />
            <meshStandardMaterial color="#3b200a" roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Rig() {
  const { camera, size } = useThree()
  const snapped = useRef(false)
  const portrait = size.width < size.height
  useFrame((state) => {
    const z = portrait ? 12.5 : 6.6
    if (!snapped.current) {
      camera.position.set(0, 0.8, z)
      snapped.current = true
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.7, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.8 + state.pointer.y * 0.3, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.08)
    camera.lookAt(0, portrait ? 0.45 : 0.4, 0)
  })
  return null
}

export default function FinaleScene({ lit, celebrate }) {
  const profile = getDeviceProfile()
  const bursts = useRef([])
  // her favourite: sunflowers on both sides of the cake, gently turned towards it
  const flowers = useMemo(
    () => [
      [-2.1, -1.25, 0.7, 1.15, 0.35],
      [-1.55, -1.25, 1.5, 0.85, 0.5],
      [-2.75, -1.25, -0.3, 1.35, 0.25],
      [2.1, -1.25, 0.8, 1.1, -0.35],
      [1.6, -1.25, 1.6, 0.8, -0.5],
      [2.7, -1.25, -0.2, 1.3, -0.25],
    ],
    [],
  )

  // a celebratory volley whenever the candles are blown out
  useEffect(() => {
    if (!celebrate) return
    bursts.current.forEach((b, i) => window.setTimeout(() => b([(i - 1) * 3, 3.5 + i * 0.6, -5]), i * 250))
  }, [celebrate])

  const fw = profile.lowPower ? 2 : profile.mobile ? 3 : 4
  const particles = profile.mobile ? 70 : 120

  return (
    <>
      <color attach="background" args={['#05030f']} />
      <fog attach="fog" args={['#05030f', 10, 30]} />
      <ambientLight intensity={0.35} color="#a78bfa" />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#ede9fe" />
      <pointLight position={[-3, 1, 3]} intensity={8} distance={10} color="#f0abfc" />
      <Rig />
      <Stars radius={60} depth={40} count={budget(4000, profile)} factor={3.2} fade speed={0.7} />
      <Lanterns count={budget(36, profile)} />
      {Array.from({ length: fw }, (_, i) => (
        <Firework key={i} particles={particles} delay={0.8 + i * 1.3} burstRef={bursts} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.26, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#0c0818" roughness={1} />
      </mesh>
      <Cake lit={lit} />
      {flowers.map(([x, y, z, sc, turn], i) => (
        <Sunflower key={i} position={[x, y, z]} scale={sc} turn={turn} phase={i * 1.3} />
      ))}
      <Sparkles count={budget(60, profile)} scale={[8, 4, 4]} position={[0, 0.5, 0]} size={3} speed={0.3} color="#fcd38d" />
    </>
  )
}
