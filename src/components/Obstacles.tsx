// see Obstacles1.tsx
// connect hedgehog with levels.json
// hedgehog must be change direction after hit about borders of field
// adjast size of hedgehog

import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hedgehog from '../assets/hedgehog/Hedgehog'
import { getField } from '../engine/field/fieldPerLevel'
import * as OBSTACLES_X from '../engine/obstacles/obstaclesX'

interface HedgehogData {
  ref: React.RefObject<THREE.Group>
  pos: number
  dir: number
  // speed: number
  axis: 'X' | 'Y'
  baseX: number
  baseY: number
}

const Obstacles: React.FC = () => {
  const [hedgehogs, setHedgehogs] = useState<HedgehogData[]>([])

  useEffect(() => {
    const gridSize = getField()
    const FIELD_LIMIT = Math.floor(gridSize / 2) // границы по размеру поля

    const xObstacles = OBSTACLES_X.getObstaclesXCoord()

    const hedgehogList: HedgehogData[] = xObstacles.map(
      (coord: number[], index: number) => ({
        ref: React.createRef<THREE.Group>(),
        pos: coord[0],
        dir: Math.random() > 0.5 ? 1 : -1,
        // speed: 1 + Math.random() * 2,
        axis: 'X',
        baseX: coord[0],
        baseY: coord[1],
      })
    )

    setHedgehogs(
      hedgehogList.map((h) => ({
        ...h,
        pos: Math.max(-FIELD_LIMIT, Math.min(FIELD_LIMIT, h.pos)),
      }))
    )
  }, [])

  useFrame((_, delta) => {
    const gridSize = getField()
    const FIELD_LIMIT = Math.floor(gridSize / 2)

    setHedgehogs((prev) =>
      prev.map((h) => {
        let newPos = h.pos + h.dir * delta

        // отскок от краёв поля
        if (newPos >= FIELD_LIMIT) {
          newPos = FIELD_LIMIT
          h.dir = -1
        } else if (newPos <= -FIELD_LIMIT) {
          newPos = -FIELD_LIMIT
          h.dir = 1
        }

        if (h.ref.current) {
          if (h.axis === 'X') {
            h.ref.current.position.set(newPos, h.baseY, 0)
            h.ref.current.rotation.z = h.dir > 0 ? 0 : Math.PI
          } else {
            h.ref.current.position.set(h.baseX, newPos, 0)
            h.ref.current.rotation.z = h.dir > 0 ? Math.PI / 2 : -Math.PI / 2
          }
        }

        return { ...h, pos: newPos }
      })
    )
  })

  return (
    <group>
      {hedgehogs.map((h, i) => (
        <group key={i} ref={h.ref} position={[h.baseX, h.baseY, 0]}>
          <Hedgehog direction={[1]} index={0} line={h.axis} />
        </group>
      ))}
    </group>
  )
}

export default React.memo(Obstacles)
