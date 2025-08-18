/**
 * @module bonus.ts Управляет бонусами на текущем уровне
 *    @var currentBonus Индекс текущего бонуса в массиве всех бонусов
 *    @var bonusCoord Координаты текущего бонуса
 *    @function setCurrentBonus Задает индекс текущего бонуса
 *    @function setBonusCoord Задает координаты текущего бонуса
 *    @function getCurrentBonus Возвращает индекс текущего бонуса
 *    @function getBonusCoord Возвращает координаты бонуса
 */

/**
 * @var Индекс текущего бонуса в массиве всех бонусов
 * Значение -1 означает, что бонус пока не выбран/отсутствует.
 */
let currentBonus: number = -1

/**
 * @var Координаты X и Y текущего бонуса
 * Храним как кортеж фиксированной длины.
 */
let bonusCoord: [number, number] = [0, 0]

/**
 * Задает индекс текущего бонуса в массиве всех бонусов
 * @param index номер текущего бонуса в массиве бонусов
 * @usedIn bonusHandlers.ts
 */
export function setCurrentBonus(index: number): void {
  if (!Number.isInteger(index) || index < -1) {
    throw new Error(`setCurrentBonus: ожидается целое число >= -1, получено ${index}`)
  }
  currentBonus = index
}

/**
 * Задает координаты X и Y текущего бонуса
 * @param coord координаты текущего бонуса [x, y]
 * @usedIn setBonusEvent.ts
 */
export function setBonusCoord(coord: [number, number] | number[]): void {
  if (
    !Array.isArray(coord) ||
    coord.length !== 2 ||
    !Number.isFinite(coord[0] as number) ||
    !Number.isFinite(coord[1] as number)
  ) {
    throw new Error(
      `setBonusCoord: ожидается массив из двух чисел [x, y], получено ${JSON.stringify(
        coord
      )}`
    )
  }

  // Копируем значения, чтобы не хранить ссылку на внешний массив
  bonusCoord = [Number(coord[0]), Number(coord[1])]
}

/**
 * Возвращает индекс текущего бонуса в массиве всех бонусов
 * @returns currentBonus индекс текущего бонуса (-1 если бонус не выбран)
 * @usedIn Bonuses.tsx
 */
export function getCurrentBonus(): number {
  return currentBonus
}

/**
 * Возвращает координаты X и Y текущего бонуса
 * Возвращаем копию, чтобы исключить внешние мутации внутреннего состояния
 * @returns координаты бонуса [x, y]
 * @usedIn Bonuses.tsx, setBonusEvent.ts, contactBonusObstacle.ts
 */
export function getBonusCoord(): [number, number] {
  return [bonusCoord[0], bonusCoord[1]]
}

/**
 * (Опционально) Сброс состояния бонуса к значениям по умолчанию
 * Можно не использовать, но пригодится для инициализации уровня/сцены.
 */
export function resetBonus(): void {
  currentBonus = -1
  bonusCoord = [0, 0]
}

// /**
//  * @module bonus.ts Управляет бонусами на текущем уровне
//  *    @var currentBonus Индекс текущего бонуса в массиве всех бонусов
//  *    @var bonusCoord Координаты текущего бонуса
//  *    @function setCurrentBonus Задает индекс текущего бонуса
//  *    @function setBonusCoord Задает координаты текущего бонуса
//  *    @function getCurrentBonus Возвращает индекс текущего бонуса
//  *    @function getBonusCoord Возвращает координаты бонуса
//  */
// /**
//  * @var Индекс текущего бонуса в массиве всех бонусов
//  */
// let currentBonus: number;
// /**
//  * @var Массив координат X и Y текущего бонуса
//  */
// let bonusCoord: number[];
// /**
//  * Задает индекс текущего бонуса в массиве всех бонусов
//  * @param index номер текущего бонуса в массиве бонусов
//  * @usedIn bonusHandlers.ts
//  */
// export function setCurrentBonus(index: number) {
//   currentBonus = index;
// }
// /**
//  * Задает координаты X и Y текущего бонуса
//  * @param coord координаты текущего бонуса
//  * @usedIn setBonusEvent.ts
//  */
// export function setBonusCoord(coord: number[]) {
//   bonusCoord = [...coord];
// }
// /**
//  * Возвращает индекс текущего бонуса в массиве всех бонусов
//  * @returns currentBonus индекс текущего бонуса
//  * @usedIn Bonuses.tsx
//  */
// export function getCurrentBonus(): number {
//   return currentBonus;
// }
// /**
//  * Возвращает координаты X и Y текущего бонуса
//  * @returns bonusCoord координаты текущего бонуса
//  * @usedIn Bonuses.tsx, setBonusEvent.ts, contactBonusObstacle.ts
//  */
// export function getBonusCoord(): number[] {
//   return bonusCoord;
// }
