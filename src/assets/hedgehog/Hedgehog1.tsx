// HedgehogBetter.tsx
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type LineAxis = 'X' | 'Y'
interface HedgehogProps {
  direction: number[]
  index: number
  line: LineAxis
}

export default function HedgehogBetter({ direction, index, line }: HedgehogProps) {
  // ===== Тело: каплевидный профиль для lathe =====
  const bodyProfile = useMemo(() => {
    const pts: THREE.Vector2[] = []
    // 0..1 — вдоль оси: тонкий нос -> широкая спина -> хвостик
    for (let i = 0; i <= 28; i++) {
      const t = i / 28
      // y от -0.55 до 0.55
      const y = -0.55 + 1.1 * t
      // радиус — капля (макс ближе к 0.25..0.7), нос тонкий
      const r =
        0.02 + // базовая толщина у носа
        0.38 *
          Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.05) / 0.95))), 1.1)
      pts.push(new THREE.Vector2(r, y))
    }
    return pts
  }, [])

  // Параметры
  const spikesCount = 900
  const bodyColor = '#6d5f4a' // тёпло-коричневый
  const furColor = '#4b4655' // тёмно-серый для иголок
  const faceColor = '#b79a7a' // светлая мордочка

  // Позиция по твоей схеме
  const posX = line === 'X' ? direction[index] : 0
  const posY = line === 'Y' ? direction[index] : 0

  // Вспомогательные повороты, как у тебя
  const noseRotZ =
    line === 'X' ? direction[index] * -1.57 : ((direction[index] - 1) / 2) * 3.14

  // ===== Генерация позиций/нормалей для иголок на эллипсоиде (быстро) =====
  const spikeData = useMemo(() => {
    const a = 0.46,
      b = 0.42,
      c = 0.62 // полуоси (похоже на тело)
    const phi = Math.PI * (3 - Math.sqrt(5))
    const positions: THREE.Vector3[] = []
    const normals: THREE.Vector3[] = []

    for (let i = 0; i < spikesCount; i++) {
      const y = 1 - (i / (spikesCount - 1)) * 2 // -1..1
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = i * phi
      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius

      // Эллипсоид — вытянут назад (спина), морда — «лысая»
      const P = new THREE.Vector3(a * x, b * y, c * z)

      // отсечь нижний пузик (чтобы иголки сверху/с боков)
      if (P.y < -0.18) continue

      // «лысая» зона на морде (конус вокруг направления +Z)
      const forward = new THREE.Vector3(0, 0, 1)
      const angle = forward.angleTo(new THREE.Vector3(x, y, z))
      if (angle < THREE.MathUtils.degToRad(36)) continue // не ставим иголки прямо на морде

      // Нормаль эллипсоида
      const N = new THREE.Vector3(x / (a * a), y / (b * b), z / (c * c)).normalize()

      positions.push(P.addScaledVector(N, 0.015)) // слегка приподнять
      normals.push(N)
    }
    return { positions, normals }
  }, [spikesCount])

  // Инстансы для иголок
  const spikesRef = useRef<THREE.InstancedMesh>(null)

  useMemo(() => {
    if (!spikesRef.current) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)

    for (let i = 0; i < spikeData.positions.length; i++) {
      const p = spikeData.positions[i]
      const n = spikeData.normals[i]
      // длина иглы: больше сзади, меньше у боков
      const rearFactor = THREE.MathUtils.clamp((p.z + 0.6) / 1.2, 0, 1)
      const len = 0.09 + 0.06 * rearFactor
      const scale = new THREE.Vector3(1, 1, 1)

      // конус по оси Y => up -> n
      q.setFromUnitVectors(up, n)
      const pos = p.clone()

      m.compose(pos, q, scale)
      spikesRef.current.setMatrixAt(i, m)
      // индивидуальная длина — через анимацию масштабируем геометрию по Y позже
      // (проще — использовать разные геометрии, но оставим единый инстанс)
    }
    spikesRef.current.instanceMatrix.needsUpdate = true
  }, [spikeData])

  // Лёгкое «дыхание» (масштаб тела) и микроколыхание иголок
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (spikesRef.current) {
      const s = 1 + 0.01 * Math.sin(t * 1.7)
      spikesRef.current.scale.set(1, s, 1)
    }
  })

  // Служебные позиции для глаз/ушей/носа (ориентируем по направлению)
  const faceForward = new THREE.Euler(0, 0, noseRotZ)
  const noseOffset = new THREE.Vector3(0, 0.34, 0.02).applyEuler(faceForward)
  const eyeL = new THREE.Vector3(0.11, 0.18, 0.14).applyEuler(faceForward)
  const eyeR = new THREE.Vector3(-0.11, 0.18, 0.14).applyEuler(faceForward)
  const earL = new THREE.Vector3(0.16, 0.02, 0.22).applyEuler(faceForward)
  const earR = new THREE.Vector3(-0.16, 0.02, 0.22).applyEuler(faceForward)

  return (
    <group position={[posX, posY, 5]}>
      {/* Тело */}
      <mesh
        rotation={[
          0,
          0,
          line === 'Y' ? direction[index] * 1.57 + 1.57 : direction[index] * 1.57,
        ]}
      >
        <latheGeometry args={[bodyProfile, 64, 0, Math.PI * 2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Морда — полуконусом + шар-нос */}
      <mesh rotation={[0, 0, noseRotZ]} position={[0, 0, 0]}>
        <coneGeometry args={[0.22, 0.3, 24]} />
        <meshStandardMaterial color={faceColor} roughness={0.8} />
      </mesh>
      <mesh position={[noseOffset.x, noseOffset.y, noseOffset.z]}>
        <sphereGeometry args={[0.06, 16, 12]} />
        <meshStandardMaterial color={'#1a1a1a'} />
      </mesh>

      {/* Глаза */}
      <mesh position={[eyeL.x, eyeL.y, eyeL.z]}>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color={'#0b0b0d'} />
      </mesh>
      <mesh position={[eyeR.x, eyeR.y, eyeR.z]}>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color={'#0b0b0d'} />
      </mesh>

      {/* Ушки */}
      <mesh position={[earL.x, earL.y, earL.z]}>
        <sphereGeometry args={[0.06, 14, 12]} />
        <meshStandardMaterial color={faceColor} />
      </mesh>
      <mesh position={[earR.x, earR.y, earR.z]}>
        <sphereGeometry args={[0.06, 14, 12]} />
        <meshStandardMaterial color={faceColor} />
      </mesh>

      {/* Иголки */}
      <instancedMesh
        ref={spikesRef}
        args={[
          undefined as any,
          undefined as any,
          Math.max(1, spikeData.positions.length),
        ]}
      >
        {/* Конус тонкий и длинный */}
        <coneGeometry args={[0.012, 0.15, 8]} />
        <meshStandardMaterial color={furColor} roughness={0.7} metalness={0.05} />
      </instancedMesh>
    </group>
  )
}
