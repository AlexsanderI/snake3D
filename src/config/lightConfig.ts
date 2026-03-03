import { lightConfig } from '../types/lightTypes'

export const lightCONFIG: lightConfig = {
  sun: {
    position: [-1, 5, 9], // относительное смещение света от змейки
    intensity: 1.5,
  },
  ambientLight: {
    intensity: 0.2,
  },
  directionalLight: {
    shadowMapSize: [2048, 2048], // увеличен размер для лучшего качества
    castShadow: true,

    // ВАЖНО: Эти границы теперь относительно ПОЗИЦИИ ЗМЕЙКИ, а не мира
    // Поэтому достаточно покрыть область вокруг змейки (примерно 30-40 клеток)
    shadowCameraNear: 0.1,
    shadowCameraFar: 50,
    shadowCameraLeft: -30,
    shadowCameraRight: 30,
    shadowCameraTop: 30,
    shadowCameraBottom: -30,
  },
}
