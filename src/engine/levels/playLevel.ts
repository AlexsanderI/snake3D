/**
 *  @module playLevel.ts Управляет игрой на текущем уровне
 *     @function playLevel Последовательно запускает игровые функции
 */

import { getCounterHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import bonusSelect from '../bonuses/bonusSelect'
import snakeCatchesBonusEvent from '../events/snakeCatchesBonusEvent'
import { snakeCatchesFoodEvent } from '../events/snakeCatchesFoodEvent'
import { snakeFoodEaten } from '../events/snakeFoodEaten'
import setObstacleParams from '../obstacles/setObstacleParams'
import moveSnake from '../snake/moveSnake'
/**
 *  Управляет игрой:
 *      - если игра прервана, ничего не исполняется
 *      - изменяются (если предусмотрено) координаты препятствий
 *      - изменяются координаты змейки (влияют координаты препятствий)
 *      - если закончились жизни или время, игра остановлена, уровень не пройден
 *      - создаются (если предусмотрено) бонусы, дающие игроку преимущества
 *      - изменяются (если предусмотрено) координаты еды
 *      - изменяются, если предусмотрено, координаты бонусов
 */
function playLevel() {
  // const [counterHeadX, counterHeadY] = getCounterHead()
  // if (counterHeadX === 0 && counterHeadY === 0) {
  bonusSelect()
  setObstacleParams(600)
  snakeCatchesFoodEvent()
  snakeFoodEaten()
  snakeCatchesBonusEvent()
  //}
  moveSnake()
}

export default playLevel
