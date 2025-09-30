import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Field } from './Field'
import { Environment } from './Environment'
import Snake from './Snake'
import Apple from './Apple'
import { useFrame, useThree } from '@react-three/fiber'
import { cameraCONFIG } from '../config/cameraConfig'
import { getSnakeUnitPosition } from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import { getSnakeBodyCoord } from '../engine/snake/snake'
import { getCurrentFoodNumber } from '../engine/food/currentFoodNumber'
// import Hedgehog from '../assets/hedgehog/Hedgehog'
import Obstacles from './Obstacles'

let counter = 0
let currentFoodNumber = 0
let snakeLength = getSnakeBodyCoord().length

export function Scene() {
  // const { performance } = useControls('Monitoring', {
  //   performance: true,
  // })

  const { camera } = useThree()
  const [x, y, z] = cameraCONFIG.position
  const [xx, yy, zz] = cameraCONFIG.rotation
  camera.rotation.set(xx, yy, zz)

  useFrame(() => {
    if (currentFoodNumber != getCurrentFoodNumber()) {
      counter = 1
      currentFoodNumber = getCurrentFoodNumber()
    }
    camera.position.set(
      x + getSnakeUnitPosition()[0][0],
      y + getSnakeUnitPosition()[0][1] - snakeLength,
      z + snakeLength
    )
    camera.updateProjectionMatrix()
    if (counter >= 1 && counter < 60) {
      counter++
      snakeLength = snakeLength + 1 / 60
    } else {
      counter = 0
      snakeLength = getSnakeBodyCoord().length
    }
  })

  return (
    <>
      {/* performance && <Perf position='top-left' /> */}

      <Snake />
      <Apple />
      <Obstacles
      // bounds={{ X: [-3.5, 3.5], Y: [-3.5, 3.5] }} // границы твоего поля — подставь реальные
      // items={[
      //   {
      //     id: 'h1',
      //     type: 'hedgehog',
      //     axis: 'X', // бежит по оси X (влево/вправо)
      //     direction: 1, // 1 = вправо (стартовое направление)
      //     speed: 0.8, // скорость (ю/сек) — подстрой под масштаб
      //     initial: 'random', // стартовая позиция рандомно в пределах bounds.X
      //   },
      // ]}
      // randomFlip={true} // опционально: иногда разворачивать движение случайно
      // randomFlipEverySec={[3, 8]} // как часто (сек): случайно между 3 и 8
      />
      <Field />
      <Environment />
    </>
  )
}
