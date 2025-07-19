/**
 *  @module setLoop.ts Управляет игровым циклом
 *     @function setLoop Рекурсивная функция, позволяющая менять скорость игры
 */
import * as INTERRUPT from '../events/interruptGameEvent'
import playLevel from '../levels/playLevel'
// import render from "../render/render";
import { checkTimerWorking } from './isTimer'
import { setTimer } from './timer'
import { getTimerStep } from './timerStepPerLevel'
/**
 * Запускает setLoop() каждые timerStepPerLevel миллисекунд в котором:
 *  - проверяет условия прерывания игры
 *  - запускается функция управления игрой playLevel()
 *  - производится рендер актуального состояния игрового поля
 *  - устанавливается актуальное значение интервала перерисовки игрового поля
 */
function setLoop(delta: number) {
  INTERRUPT.interruptGameEvent()
  if (!INTERRUPT.getInterruptGame()) {
    playLevel()
  }
  if (checkTimerWorking()) setTimer(delta * 1000)
}

export default setLoop
