import React, { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hedgehog from '../assets/hedgehog/Hedgehog'
import { getField } from '../engine/field/fieldPerLevel'
import * as OBSTACLES_X from '../engine/obstacles/obstaclesX'
import * as OBSTACLES_Y from '../engine/obstacles/obstaclesY'
import { getTimer } from '../engine/time/timer'

interface HedgehogData {
  ref: React.RefObject<THREE.Group>
  posX: number
  posY: number
  dirX: number
  dirY: number
  axis: 'X' | 'Y'
  baseX: number
  baseY: number
}

const Obstacles: React.FC = () => {
  const [hedgehogs, setHedgehogs] = useState<HedgehogData[]>([])

  useEffect(() => {
    const gridSize = getField()
    const FIELD_LIMIT = Math.floor(gridSize / 2)

    // Получаем координаты, как в Obstacles1.tsx
    const xCoords = OBSTACLES_X.getObstaclesXCoord().map((coord: number[]) => [
      Math.round(coord[0] - gridSize / 2 - 1),
      Math.round(coord[1] - gridSize / 2 - 1),
    ])
    const yCoords = OBSTACLES_Y.getObstaclesYCoord().map((coord: number[]) => [
      Math.round(coord[0] - gridSize / 2 - 1),
      Math.round(coord[1] - gridSize / 2 - 1),
    ])

    const hedgehogList: HedgehogData[] = []

    // создаём ёжиков по X
    xCoords.forEach((coord: number[]) => {
      hedgehogList.push({
        ref: React.createRef<THREE.Group>(),
        posX: coord[0],
        posY: coord[1],
        dirX: Math.random() > 0.5 ? 1 : -1,
        dirY: 0,
        axis: 'X',
        baseX: coord[0],
        baseY: coord[1],
      })
    })

    // создаём ёжиков по Y
    yCoords.forEach((coord: number[]) => {
      hedgehogList.push({
        ref: React.createRef<THREE.Group>(),
        posX: coord[0],
        posY: coord[1],
        dirX: 0,
        dirY: Math.random() > 0.5 ? 1 : -1,
        axis: 'Y',
        baseX: coord[0],
        baseY: coord[1],
      })
    })

    setHedgehogs(
      hedgehogList.map((h) => ({
        ...h,
        posX: Math.max(-FIELD_LIMIT, Math.min(FIELD_LIMIT, h.posX)),
        posY: Math.max(-FIELD_LIMIT, Math.min(FIELD_LIMIT, h.posY)),
      }))
    )
  }, [getTimer()]) // обновление по таймеру, как в Obstacles1

  // Метод движения — без изменений
  useFrame((_, delta) => {
    const gridSize = getField()
    const FIELD_LIMIT = Math.floor(gridSize / 2)

    setHedgehogs((prev) =>
      prev.map((h) => {
        let newX = h.posX
        let newY = h.posY

        if (h.axis === 'X') {
          newX = h.posX + h.dirX * delta
          if (newX >= FIELD_LIMIT) {
            newX = FIELD_LIMIT
            h.dirX = -1
          } else if (newX <= -FIELD_LIMIT) {
            newX = -FIELD_LIMIT
            h.dirX = 1
          }
        }

        if (h.axis === 'Y') {
          newY = h.posY + h.dirY * delta
          if (newY >= FIELD_LIMIT) {
            newY = FIELD_LIMIT
            h.dirY = -1
          } else if (newY <= -FIELD_LIMIT) {
            newY = -FIELD_LIMIT
            h.dirY = 1
          }
        }

        if (h.ref.current) {
          h.ref.current.position.set(newX, newY, 0)
          h.ref.current.rotation.z += 0.5 * delta * (h.dirX || h.dirY)
          h.ref.current.scale.set(6, 6, 6)
        }

        return {
          ...h,
          posX: newX,
          posY: newY,
        }
      })
    )
  })

  return (
    <>
      {hedgehogs.map((h, i) => (
        <group ref={h.ref} key={i} position={[h.baseX, h.baseY, 0]}>
          <Hedgehog direction={[]} index={0} line={''} />
        </group>
      ))}
    </>
  )
}

export default Obstacles
