// see Obstacles1.tsx
// connect hedgehog with levels.json
// hedgehog must be change direction after hit about borders of field
// adjast size of hedgehog

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hedgehog from '../assets/hedgehog/Hedgehog'

const Obstacles = () => {
  const hedgehogRef1 = useRef<THREE.Group>(null)
  const hedgehogRef2 = useRef<THREE.Group>(null)
  const hedgehogRef3 = useRef<THREE.Group>(null)
  const hedgehogRef4 = useRef<THREE.Group>(null)

  // Переменные для отслеживания позиций и направлений
  const movement = useRef({
    hedgehog1: { pos: -5, dir: 1, speed: 2 }, // Движение по X
    hedgehog2: { pos: 3, dir: -1, speed: 1.5 }, // Движение по Y
    hedgehog3: { pos: 0, dir: 1, speed: 3 }, // Быстрое движение по X
    hedgehog4: { pos: -2, dir: 1, speed: 2.5 }, // Движение по Y
  })

  useFrame((_, delta) => {
    const mov = movement.current

    // Ежик 1 - горизонтальное движение (тип 'x')
    if (hedgehogRef1.current) {
      mov.hedgehog1.pos += mov.hedgehog1.speed * mov.hedgehog1.dir * delta

      // Отражение от границ
      if (mov.hedgehog1.pos >= 8) {
        mov.hedgehog1.pos = 8
        mov.hedgehog1.dir = -1
      } else if (mov.hedgehog1.pos <= -8) {
        mov.hedgehog1.pos = -8
        mov.hedgehog1.dir = 1
      }

      hedgehogRef1.current.position.set(mov.hedgehog1.pos, -3, 0)
      hedgehogRef1.current.rotation.z = mov.hedgehog1.dir > 0 ? 0 : Math.PI
    }

    // Ежик 2 - вертикальное движение (тип 'y')
    if (hedgehogRef2.current) {
      mov.hedgehog2.pos += mov.hedgehog2.speed * mov.hedgehog2.dir * delta

      // Отражение от границ
      if (mov.hedgehog2.pos >= 8) {
        mov.hedgehog2.pos = 8
        mov.hedgehog2.dir = -1
      } else if (mov.hedgehog2.pos <= -8) {
        mov.hedgehog2.pos = -8
        mov.hedgehog2.dir = 1
      }

      hedgehogRef2.current.position.set(2, mov.hedgehog2.pos, 0)
      hedgehogRef2.current.rotation.z = mov.hedgehog2.dir > 0 ? Math.PI / 2 : -Math.PI / 2
    }

    // Ежик 3 - быстрое горизонтальное движение (тип 'fix-R')
    if (hedgehogRef3.current) {
      mov.hedgehog3.pos += mov.hedgehog3.speed * mov.hedgehog3.dir * delta

      // Отражение от границ с меньшим диапазоном для fix типа
      if (mov.hedgehog3.pos >= 6) {
        mov.hedgehog3.pos = 6
        mov.hedgehog3.dir = -1
      } else if (mov.hedgehog3.pos <= -6) {
        mov.hedgehog3.pos = -6
        mov.hedgehog3.dir = 1
      }

      hedgehogRef3.current.position.set(mov.hedgehog3.pos, 1, 0)
      hedgehogRef3.current.rotation.z = mov.hedgehog3.dir > 0 ? 0 : Math.PI
    }

    // Ежик 4 - вертикальное патрулирование (тип 'fix-M')
    if (hedgehogRef4.current) {
      mov.hedgehog4.pos += mov.hedgehog4.speed * mov.hedgehog4.dir * delta

      // Отражение от границ с средним диапазоном
      if (mov.hedgehog4.pos >= 4) {
        mov.hedgehog4.pos = 4
        mov.hedgehog4.dir = -1
      } else if (mov.hedgehog4.pos <= -4) {
        mov.hedgehog4.pos = -4
        mov.hedgehog4.dir = 1
      }

      hedgehogRef4.current.position.set(-3, mov.hedgehog4.pos, 0)
      hedgehogRef4.current.rotation.z = mov.hedgehog4.dir > 0 ? Math.PI / 2 : -Math.PI / 2
    }
  })

  return (
    <group>
      {/* Препятствие типа 'x' - горизонтальное движение */}
      <group ref={hedgehogRef1} position={[-5, -3, 0]}>
        <Hedgehog direction={[1]} index={0} line={'X'} />
      </group>

      {/* Препятствие типа 'y' - вертикальное движение */}
      <group ref={hedgehogRef2} position={[2, 3, 0]}>
        <Hedgehog direction={[1]} index={0} line={'Y'} />
      </group>

      {/* Препятствие типа 'fix-R' - быстрое горизонтальное */}
      <group ref={hedgehogRef3} position={[0, 1, 0]}>
        <Hedgehog direction={[1]} index={0} line={'X'} />
      </group>

      {/* Препятствие типа 'fix-M' - среднее вертикальное */}
      <group ref={hedgehogRef4} position={[-3, -2, 0]}>
        <Hedgehog direction={[1]} index={0} line={'Y'} />
      </group>
    </group>
  )
}

export default React.memo(Obstacles)
