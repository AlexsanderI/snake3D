import React, { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Hedgehog from '../assets/hedgehog/Hedgehog'
import { getField } from '../engine/field/fieldPerLevel'
import * as OBSTACLES_X from '../engine/obstacles/obstaclesX'
import * as OBSTACLES_Y from '../engine/obstacles/obstaclesY'
import { getTimer } from '../engine/time/timer'

interface HedgehogData {
  id: string
  posX: number
  posY: number
  dirX: number
  dirY: number
  axis: 'X' | 'Y'
  baseX: number
  baseY: number
  rotation: number
}

const Obstacles: React.FC = () => {
  const [hedgehogs, setHedgehogs] = useState<HedgehogData[]>([])

  useEffect(() => {
    const gridSize = getField()

    // Получаем координаты, как в ObstaclesX.tsx
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
    xCoords.forEach((coord: number[], index: number) => {
      hedgehogList.push({
        id: `hedgehog-x-${index}`,
        posX: coord[0],
        posY: coord[1],
        dirX: Math.random() > 0.5 ? 1 : -1,
        dirY: 0,
        axis: 'X',
        baseX: coord[0],
        baseY: coord[1],
        rotation: 0,
      })
    })

    // создаём ёжиков по Y
    yCoords.forEach((coord: number[], index: number) => {
      hedgehogList.push({
        id: `hedgehog-y-${index}`,
        posX: coord[0],
        posY: coord[1],
        dirX: 0,
        dirY: Math.random() > 0.5 ? 1 : -1,
        axis: 'Y',
        baseX: coord[0],
        baseY: coord[1],
        rotation: 0,
      })
    })

    setHedgehogs(hedgehogList)

    // Диагностика: логируем всех ежиков при создании
    console.log('🦔 Создано ежиков:', hedgehogList.length)
    hedgehogList.forEach((h, i) => {
      console.log(`Ежик #${i}:`, {
        id: h.id,
        axis: h.axis,
        dirX: h.dirX,
        dirY: h.dirY,
        position: `(${h.posX}, ${h.posY})`,
      })
    })
  }, [getTimer()])

  // Обновление позиций через state
  useFrame((_, delta) => {
    const gridSize = getField()
    const FIELD_LIMIT = Math.floor(gridSize / 2)

    setHedgehogs((prev) =>
      prev.map((h) => {
        let newX = h.posX
        let newY = h.posY
        let newDirX = h.dirX
        let newDirY = h.dirY

        if (h.axis === 'X') {
          newX = h.posX + h.dirX * delta

          if (newX >= FIELD_LIMIT) {
            newX = FIELD_LIMIT
            newDirX = -1
            // console.log(
            //   `🦔 ${h.id} ударился СПРАВА, разворот ВЛЕВО, rotation будет: ${
            //     Math.PI / 2
            //   } (90°)`
            // )
          } else if (newX <= -FIELD_LIMIT) {
            newX = -FIELD_LIMIT
            newDirX = 1
            // console.log(
            //   `🦔 ${h.id} ударился СЛЕВА, разворот ВПРАВО, rotation будет: ${
            //     -Math.PI / 2
            //   } (-90°)`
            // )
          }
        }

        if (h.axis === 'Y') {
          newY = h.posY + h.dirY * delta

          if (newY >= FIELD_LIMIT) {
            newY = FIELD_LIMIT
            newDirY = -1
            // console.log(
            //   `🦔 ${h.id} ударился СВЕРХУ, разворот ВНИЗ, rotation будет: ${Math.PI} (180°)`
            // )
          } else if (newY <= -FIELD_LIMIT) {
            newY = -FIELD_LIMIT
            newDirY = 1
            // console.log(
            //   `🦔 ${h.id} ударился СНИЗУ, разворот ВВЕРХ, rotation будет: 0 (0°)`
            // )
          }
        }

        // Устанавливаем rotation в зависимости от направления движения
        // Модель ежика изначально смотрит вверх, поэтому корректируем углы
        let newRotation = 0
        if (h.axis === 'X') {
          newRotation = newDirX === 1 ? 0 : Math.PI // вправо = -90°, влево = 90°
        } else {
          newRotation = newDirY === 1 ? -Math.PI / 2 : Math.PI / 2 // вверх = 0°, вниз = 180°
        }

        return {
          ...h,
          posX: newX,
          posY: newY,
          dirX: newDirX,
          dirY: newDirY,
          rotation: newRotation,
        }
      })
    )
  })

  return (
    <>
      {hedgehogs.map((h) => {
        // Передаём массив с направлением для правильной работы Hedgehog
        const hedgehogDirection = h.axis === 'X' ? [h.dirX] : [h.dirY]

        // Добавляем логирование для диагностики
        if (Math.random() < 0.005) {
          console.log('🦔 Рендер ежика:', {
            id: h.id,
            axis: h.axis,
            direction: hedgehogDirection,
            dirValue: hedgehogDirection[0],
          })
        }

        return (
          <group key={h.id} position={[h.posX, h.posY, 0]} scale={[0.75, 0.75, 0.75]}>
            <Hedgehog direction={hedgehogDirection} index={0} line={h.axis} />
          </group>
        )
      })}
    </>
  )
}

export default Obstacles
