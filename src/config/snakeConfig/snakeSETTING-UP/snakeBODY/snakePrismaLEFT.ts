import { Vector3 } from 'three'
import * as TYPES from '../../../../types/threeTypes'
import { snakeBodyConfig } from './snakeBodyConfig'

const prismaGap = snakeBodyConfig.prismaGap

const snakePrismaLeftTransition: TYPES.GeometryTransitionProps = {
  position: [-prismaGap, prismaGap, 0],
  rotation: [0, 0, 11],
  scale: 1,
}

export const snakePrismaLEFT: TYPES.GeometryProps = {
  position: new Vector3(
    snakePrismaLeftTransition.position[0],
    snakePrismaLeftTransition.position[1],
    0.5 + snakePrismaLeftTransition.position[2]
  ),
  'rotation-x': 0 + snakePrismaLeftTransition.rotation[0],
  'rotation-y': 22 + snakePrismaLeftTransition.rotation[1],
  'rotation-z': 0 + snakePrismaLeftTransition.rotation[2],
  scale: 0.9 * snakePrismaLeftTransition.scale,
}

export const setPrismaLEFT = (prisma: TYPES.GeometryTransitionProps): void => {
  snakePrismaLeftTransition.position = prisma.position
  snakePrismaLeftTransition.rotation = prisma.rotation
  snakePrismaLeftTransition.scale = prisma.scale
}
