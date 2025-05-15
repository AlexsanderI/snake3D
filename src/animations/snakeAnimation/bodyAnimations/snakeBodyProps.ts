const snakeBodyPosition: number[][] = []
const snakeBodyRotation: number[][] = []
const snakeBodyScale: number[][] = []

export const setSnakeUnitPosition = (props: number[][]) => {
  snakeBodyPosition.length = 0

  props.forEach((unit) => snakeBodyPosition.push(unit))
}

export const setSnakeUnitRotation = (props: number[][]) => {
  snakeBodyRotation.length = 0

  props.forEach((unit, index) => snakeBodyRotation.push(unit))
}

export const setSnakeUnitScale = (props: number[][]) => {
  snakeBodyScale.length = 0

  props.forEach((unit) => snakeBodyScale.push(unit))
}

export const getSnakeUnitPosition = (): number[][] => {
  return snakeBodyPosition
}

export const getSnakeUnitRotation = (): number[][] => {
  return snakeBodyRotation
}

export const getSnakeUnitScale = (): number[][] => {
  return snakeBodyScale
}
