import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Sparkles, Stars } from '@react-three/drei'
import { budget, getDeviceProfile } from '../../lib/device'
import { glowTexture } from './textures'

const BODY = '#c4b5fd'
const ACCENT = '#f0abfc'
const DARK = '#1b1230'
const CHROME = '#d9d9e8'

function Wheel({ z, spin }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.x -= dt * spin.current * 8
  })
  return (
    <group position={[0, 0.3, z]}>
      <group ref={ref} rotation={[0, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.24, 0.085, 14, 32]} />
          <meshStandardMaterial color="#141018" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 20]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.25} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[(i / 3) * Math.PI, 0, 0]}>
            <boxGeometry args={[0.11, 0.3, 0.03]} />
            <meshStandardMaterial color="#6d28d9" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Scooter({ riding }) {
  const group = useRef()
  const lamp = useRef()
  const beam = useRef()
  const spin = useRef(0.15)
  useFrame((state, dt) => {
    const target = riding ? 1 : 0.15
    spin.current = THREE.MathUtils.lerp(spin.current, target, dt * 1.5)
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.position.y = Math.sin(t * (riding ? 14 : 2)) * (riding ? 0.012 : 0.02)
      group.current.rotation.z = riding ? Math.sin(t * 0.9) * 0.05 : 0
    }
    const on = riding ? 1 : 0.15 + (Math.sin(t * 2) + 1) * 0.05
    if (lamp.current) lamp.current.emissiveIntensity = THREE.MathUtils.lerp(lamp.current.emissiveIntensity, on * 4, 0.1)
    if (beam.current) beam.current.material.opacity = THREE.MathUtils.lerp(beam.current.material.opacity, riding ? 0.14 : 0, 0.05)
  })

  return (
    <group ref={group}>
      <Wheel z={-0.78} spin={spin} />
      <Wheel z={0.68} spin={spin} />
      {/* deck */}
      <RoundedBox args={[0.42, 0.12, 1.05]} radius={0.05} position={[0, 0.42, 0]}>
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </RoundedBox>
      {/* front shield */}
      <RoundedBox args={[0.5, 1.0, 0.16]} radius={0.07} position={[0, 0.88, -0.56]} rotation={[-0.22, 0, 0]}>
        <meshStandardMaterial color={BODY} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      {/* front fender */}
      <mesh position={[0, 0.3, -0.78]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.38, 0.05, 8, 20, Math.PI]} />
        <meshStandardMaterial color={BODY} roughness={0.35} />
      </mesh>
      {/* steering column + handlebar */}
      <mesh position={[0, 1.32, -0.68]} rotation={[-0.22, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
      </mesh>
      <RoundedBox args={[0.34, 0.16, 0.2]} radius={0.06} position={[0, 1.48, -0.72]}>
        <meshStandardMaterial color={BODY} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 1.5, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.95, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.5, 1.5, -0.7]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
            <meshStandardMaterial color={DARK} roughness={0.8} />
          </mesh>
          <mesh position={[s * 0.32, 1.7, -0.68]}>
            <cylinderGeometry args={[0.012, 0.012, 0.25, 6]} />
            <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[s * 0.36, 1.84, -0.68]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
            <meshStandardMaterial color={CHROME} metalness={1} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {/* headlight */}
      <mesh position={[0, 1.48, -0.83]}>
        <sphereGeometry args={[0.08, 20, 16]} />
        <meshStandardMaterial ref={lamp} color="#fff7d6" emissive="#fde68a" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={beam} position={[0, 1.1, -2.6]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
        <coneGeometry args={[0.9, 3.6, 24, 1, true]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      {/* rear body */}
      <mesh position={[0, 0.66, 0.5]} scale={[0.36, 0.32, 0.62]}>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color={BODY} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.6, 0.5]} scale={[0.37, 0.05, 0.6]}>
        <sphereGeometry args={[1, 24, 8]} />
        <meshStandardMaterial color={ACCENT} roughness={0.3} />
      </mesh>
      {/* seat */}
      <RoundedBox args={[0.36, 0.12, 0.72]} radius={0.05} position={[0, 0.97, 0.38]}>
        <meshStandardMaterial color={DARK} roughness={0.7} />
      </RoundedBox>
      {/* tail light */}
      <mesh position={[0, 0.72, 1.1]}>
        <boxGeometry args={[0.18, 0.06, 0.04]} />
        <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* tiny helmet waiting on the seat: helmet is compulsory */}
      <group position={[0, 1.17, 0.52]}>
        <mesh>
          <sphereGeometry args={[0.17, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshStandardMaterial color={ACCENT} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.02, -0.14]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.02]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.1} metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function Road({ riding }) {
  const dashes = useRef()
  const lamps = useRef()
  const speed = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const DASHES = 24
  const LAMPS = 8
  const offset = useRef(0)

  useLayoutEffect(() => {
    for (let i = 0; i < LAMPS; i++) {
      dummy.position.set(i % 2 ? 2.6 : -2.6, 1.2, -i * 6)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      lamps.current.setMatrixAt(i, dummy.matrix)
    }
    lamps.current.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame((_, dt) => {
    speed.current = THREE.MathUtils.lerp(speed.current, riding ? 9 : 0.6, dt * 1.2)
    offset.current = (offset.current + dt * speed.current) % 2
    for (let i = 0; i < DASHES; i++) {
      dummy.position.set(0, 0.011, 6 - i * 2 + offset.current)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      dashes.current.setMatrixAt(i, dummy.matrix)
    }
    dashes.current.instanceMatrix.needsUpdate = true
  })

  const hills = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (i % 2 ? 1 : -1) * (7 + Math.random() * 10),
        z: -10 - Math.random() * 40,
        h: 2 + Math.random() * 5,
        r: 3 + Math.random() * 4,
      })),
    [],
  )

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#17122a" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -20]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#0c0818" roughness={1} />
      </mesh>
      {[-1.95, 1.95].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, -20]}>
          <planeGeometry args={[0.06, 60]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} />
        </mesh>
      ))}
      <instancedMesh ref={dashes} args={[null, null, DASHES]}>
        <boxGeometry args={[0.1, 0.005, 0.9]} />
        <meshBasicMaterial color="#fde68a" />
      </instancedMesh>
      {/* street lamps */}
      <instancedMesh ref={lamps} args={[null, null, LAMPS]}>
        <cylinderGeometry args={[0.035, 0.05, 2.4, 8]} />
        <meshStandardMaterial color="#3f3a55" metalness={0.6} roughness={0.5} />
      </instancedMesh>
      {Array.from({ length: LAMPS }, (_, i) => (
        <sprite key={i} position={[i % 2 ? 2.6 : -2.6, 2.45, -i * 6]} scale={[1.4, 1.4, 1]}>
          <spriteMaterial map={glowTexture('#fcd38d')} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
      {hills.map((h, i) => (
        <mesh key={i} position={[h.x, h.h / 2 - 0.2, h.z]}>
          <coneGeometry args={[h.r, h.h, 5]} />
          <meshStandardMaterial color={i % 3 ? '#1a1033' : '#241545'} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Rig() {
  const { camera, size } = useThree()
  const snapped = useRef(false)
  const portrait = size.width < size.height
  useFrame((state) => {
    const base = portrait ? [3.6, 2.4, 5.6] : [3.4, 1.8, 4.2]
    if (!snapped.current) {
      camera.position.set(...base)
      snapped.current = true
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, base[0] + state.pointer.x * 0.5, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, base[1] + state.pointer.y * 0.25, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, base[2], 0.05)
    camera.lookAt(0, 0.9, -0.6)
  })
  return null
}

export default function ScooterScene({ riding }) {
  const profile = getDeviceProfile()
  return (
    <>
      <color attach="background" args={['#070514']} />
      <fog attach="fog" args={['#070514', 6, 34]} />
      <hemisphereLight args={['#8b5cf6', '#0c0818', 0.7]} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color="#ede9fe" />
      <pointLight position={[-2, 2, 2]} intensity={10} distance={8} color="#f0abfc" />
      <pointLight position={[0, 2.5, -4]} intensity={riding ? 14 : 4} distance={9} color="#fcd38d" />
      <Rig />
      <Stars radius={50} depth={30} count={budget(2500, profile)} factor={3} fade speed={0.5} />
      <sprite position={[-8, 9, -40]} scale={[16, 16, 1]}>
        <spriteMaterial map={glowTexture('#c4b5fd')} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh position={[-8, 9, -41]}>
        <circleGeometry args={[2, 40]} />
        <meshBasicMaterial color="#ede9fe" />
      </mesh>
      <Road riding={riding} />
      <Scooter riding={riding} />
      {riding && <Sparkles count={budget(50, profile)} scale={[4, 2, 6]} position={[0, 1, 1]} size={4} speed={1.2} color="#f0abfc" />}
    </>
  )
}
