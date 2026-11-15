import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import gsap from 'gsap'
import { budget, getDeviceProfile } from '../../lib/device'
import { glowTexture, letterCardTexture, moonTexture, sealTexture } from './textures'

const W = 2.4
const H = 1.5

function Moon({ mobile }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02
  })
  const pos = mobile ? [1.8, 3.6, -9] : [4.4, 2.4, -9]
  return (
    <group position={pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial map={moonTexture()} emissive="#a78bfa" emissiveIntensity={0.18} roughness={1} />
      </mesh>
      <sprite scale={[7, 7, 1]}>
        <spriteMaterial map={glowTexture('#a78bfa')} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  )
}

function Envelope({ opening, onClick, portrait }) {
  const group = useRef()
  const flap = useRef()
  const letter = useRef()
  const seal = useRef()
  const { camera, invalidate } = useThree()

  const shapes = useMemo(() => {
    // front pocket: an envelope's lower "V" panel
    const pocket = new THREE.Shape()
    pocket.moveTo(-W / 2, -H / 2)
    pocket.lineTo(W / 2, -H / 2)
    pocket.lineTo(W / 2, H / 2 - 0.02)
    pocket.lineTo(0, -0.12)
    pocket.lineTo(-W / 2, H / 2 - 0.02)
    pocket.closePath()
    // top flap, drawn relative to its hinge on the top edge
    const top = new THREE.Shape()
    top.moveTo(-W / 2, 0)
    top.lineTo(W / 2, 0)
    top.lineTo(0, -0.95)
    top.closePath()
    return { pocket: new THREE.ShapeGeometry(pocket), flap: new THREE.ShapeGeometry(top) }
  }, [])

  useEffect(() => () => {
    shapes.pocket.dispose()
    shapes.flap.dispose()
  }, [shapes])

  // gentle pointer parallax
  useFrame((state) => {
    if (!group.current || opening) return
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.05)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.05)
  })

  useEffect(() => {
    if (!opening) return undefined
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onUpdate: invalidate })
    tl.to(group.current.rotation, { x: 0, y: 0, duration: 0.5 })
      .to(seal.current.scale, { x: 0, y: 0, z: 0, duration: 0.35, ease: 'back.in(2)' }, '<')
      .to(flap.current.rotation, { x: -Math.PI, duration: 0.9 })
      // tuck the open flap behind the card so the card slides out in front of it
      .set(flap.current.position, { z: -0.05 })
      .to(letter.current.position, { y: 1.15, z: 0.08, duration: 0.9, ease: 'power2.out' })
      .to(letter.current.position, { z: 0.6, y: 0.55, duration: 0.8 })
      .to(letter.current.rotation, { x: -0.05, duration: 0.8 }, '<')
      .to(camera.position, { z: portrait ? 5.2 : 3.3, y: 0.35, duration: 1.1, ease: 'power2.inOut' }, '<')
    return () => tl.kill()
  }, [opening, camera, invalidate, portrait])

  return (
    <Float speed={opening ? 0 : 1.6} rotationIntensity={0.25} floatIntensity={0.6}>
      <group
        ref={group}
        onClick={onClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        {/* back panel */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[W, H, 0.03]} />
          <meshStandardMaterial color="#c9bcea" roughness={0.75} />
        </mesh>
        {/* the card inside */}
        <mesh ref={letter} position={[0, 0, 0.01]}>
          <planeGeometry args={[W * 0.88, H * 0.82]} />
          <meshStandardMaterial map={letterCardTexture('Shivani')} roughness={0.9} />
        </mesh>
        {/* front pocket */}
        <mesh geometry={shapes.pocket} position={[0, 0, 0.03]}>
          <meshStandardMaterial color="#ddd3f5" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* flap with wax seal */}
        <group ref={flap} position={[0, H / 2 - 0.01, 0.045]}>
          <mesh geometry={shapes.flap}>
            <meshStandardMaterial color="#d2c5f0" roughness={0.65} side={THREE.DoubleSide} />
          </mesh>
          <group ref={seal} position={[0, -0.8, 0.02]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.21, 0.22, 0.04, 40]} />
              <meshStandardMaterial color="#4c1d95" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.021]}>
              <circleGeometry args={[0.2, 40]} />
              <meshStandardMaterial map={sealTexture()} roughness={0.35} emissive="#7c3aed" emissiveIntensity={0.25} />
            </mesh>
          </group>
        </group>
        {/* soft halo behind the envelope */}
        <sprite position={[0, 0, -0.4]} scale={[5.5, 4, 1]}>
          <spriteMaterial map={glowTexture('#8b5cf6')} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </Float>
  )
}

function CameraRig({ opening }) {
  const { camera, size } = useThree()
  const portrait = size.width < size.height
  useEffect(() => {
    if (opening) return
    camera.position.set(0, 0, portrait ? 9.2 : 5.6)
    camera.lookAt(0, 0, 0)
  }, [camera, portrait, opening])
  return null
}

export default function HeroScene({ opening, onEnvelopeClick }) {
  const profile = getDeviceProfile()
  const { size } = useThree()
  const portrait = size.width < size.height
  return (
    <>
      <color attach="background" args={['#05030f']} />
      <fog attach="fog" args={['#05030f', 9, 28]} />
      <ambientLight intensity={0.45} color="#b8a9ff" />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#f5f0ff" />
      <pointLight position={[-3, -1, 2]} intensity={14} distance={10} color="#f0abfc" />
      <pointLight position={[2, 1, 2]} intensity={8} distance={8} color="#fcd38d" />
      <CameraRig opening={opening} />
      <Stars radius={60} depth={40} count={budget(4500, profile)} factor={3.2} saturation={0.4} fade speed={0.6} />
      <Moon mobile={profile.mobile} />
      <Sparkles count={budget(90, profile)} scale={[7, 5, 4]} size={3} speed={0.35} opacity={0.8} color="#e9d5ff" />
      <Sparkles count={budget(30, profile)} scale={[5, 4, 3]} size={5} speed={0.2} opacity={0.6} color="#fcd38d" />
      <group position={[0, profile.mobile ? 0.25 : 0, 0]}>
        <Envelope opening={opening} onClick={onEnvelopeClick} portrait={portrait} />
      </group>
    </>
  )
}
