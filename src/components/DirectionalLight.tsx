import React, { useRef, useEffect } from 'react'
import { DirectionalLightHelper, CameraHelper } from 'three'
import { useThree } from '@react-three/fiber'

export function DirectionalLightWithHelpers() {
  const lightRef = useRef() // Реф для источника света
  const { scene } = useThree() // Доступ к сцене для добавления помощников

  useEffect(() => {
    if (lightRef.current) {
      // Создаем CameraHelper для теней
      const shadowHelper = new CameraHelper(lightRef.current.shadow.camera)
      scene.add(shadowHelper)

      // Создаем DirectionalLightHelper для источника света
      const lightHelper = new DirectionalLightHelper(lightRef.current, 5)
      scene.add(lightHelper)

      // Удаляем помощников при размонтировании компонента
      return () => {
        scene.remove(shadowHelper)
        scene.remove(lightHelper)
      }
    }
  }, [scene])

  return (
    <directionalLight
      ref={lightRef}
      position={[-3, 3, 12]}
      shadow-mapSize={[1024 * 2, 1024 * 2]}
      intensity={1.5}
      castShadow
      shadow-camera-near={0.1}
      shadow-camera-far={20}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
    />
  )
}
