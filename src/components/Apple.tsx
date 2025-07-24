import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { appleCONFIG } from '../config/appleConfig'
import { GLTFResult } from '../types/threeTypes'
import { AppleConfig } from '../types/appleTypes'
import { useDebounce } from '../hooks/useDebounce'
import { useApplePosition } from '../hooks/useApplePosition'
import { useShadowSetup } from '../hooks/useShadowSetup'
import ErrorScreen from './ErrorScreen'
import Spinner from './Spinner'
import { SystemConfig } from '../config/systemConfig'

const COUNTER_RESET_VALUE = 1000000

// ✅ Флаги для ручного тестирования
const DEBUG_MODE = true
const FORCE_SPINNER = true
const FORCE_ERROR = false

const Apple: React.FC = () => {
  const [loadError, setLoadError] = React.useState<Error | null>(null)

  // ⚠️ Если DEBUG_MODE + FORCE_ERROR — сразу имитируем ошибку загрузки
  const gltf = useGLTF(
    DEBUG_MODE && FORCE_ERROR ? '/broken-path.glb' : '/apple.glb',
    undefined,
    undefined,
    (error) => {
      console.error('Ошибка загрузки модели яблока:', error)
      setLoadError(new Error('Не удалось загрузить модель яблока'))
    }
  ) as GLTFResult

  const { zLocation, scale, FRAME_SKIP } = appleCONFIG as AppleConfig
  const { position, updatePosition } = useApplePosition(zLocation)
  const debouncedPosition = useDebounce(position, SystemConfig.DEBOUNCE_DELAY)
  useShadowSetup(gltf?.scene)

  const counterRef = React.useRef<number>(0)
  const scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  useFrame(() => {
    try {
      counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE
      if (counterRef.current % FRAME_SKIP !== 0) return

      // 💣 DEBUG — тест ошибки внутри updatePosition
      if (DEBUG_MODE && FORCE_ERROR && !FORCE_SPINNER) {
        throw new Error('Тестовая ошибка в useFrame')
      }

      updatePosition()
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  })

  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])

  // 🟥 Отображаем ошибку
  if (loadError || (DEBUG_MODE && FORCE_ERROR && !FORCE_SPINNER)) {
    return <ErrorScreen message={(loadError || new Error('Тестовая ошибка')).message} />
  }

  // ⏳ Отображаем спиннер
  if (!gltf?.scene || (DEBUG_MODE && FORCE_SPINNER)) {
    return <Spinner />
  }

  // ✅ Отображаем модель
  return <primitive object={gltf.scene} position={debouncedPosition} scale={scaleArray} />
}

useGLTF.preload('/apple.glb')

export default React.memo(Apple)
