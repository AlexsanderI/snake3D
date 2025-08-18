import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { useMenuStore } from '../store/menuStore'
import { cameraCONFIG } from '../config/cameraConfig'
import '../styles/main.css'

// -------------------- FEATURE FLAGS --------------------
type Boolish = boolean | string | null | undefined
const toBool = (v: Boolish) => v === true || v === 'true'
const toNum = (v: unknown, dflt: number) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : dflt
}
const getLS = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const env: any =
  (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {}

// Приоритет: localStorage > .env > default
const flag = (lsKey: string, envKey: string, dflt = false) => {
  const ls = getLS(lsKey)
  if (ls !== null) return toBool(ls)
  if (envKey in env) return toBool(env[envKey])
  return dflt
}
const flagNum = (lsKey: string, envKey: string, dflt = 2000) => {
  const ls = getLS(lsKey)
  if (ls !== null) return toNum(ls, dflt)
  if (envKey in env) return toNum(env[envKey], dflt)
  return dflt
}

const FLAGS = {
  noGl: flag('flags.noGl', 'VITE_TEST_NOGL', false),
  slowApp: flag('flags.slowApp', 'VITE_TEST_SLOW_APP', true),
  slowMenu: flag('flags.slowMenu', 'VITE_TEST_SLOW_MENU', false),
  forceMenu: flag('flags.forceMenu', 'VITE_TEST_FORCE_MENU', false),
  defaultLoading: flag('flags.defaultLoading', 'VITE_TEST_DEFAULT_LOADING', false),
  ms: flagNum('flags.ms', 'VITE_TEST_DELAY_MS', 5000),
}

// Эмуляция отсутствия WebGL, если включён флаг
if (FLAGS.noGl && typeof HTMLCanvasElement !== 'undefined') {
  const proto = HTMLCanvasElement.prototype as any
  if (!proto.__origGetContext) {
    proto.__origGetContext = proto.getContext
    proto.getContext = function (type: string, ...args: any[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')
        return null
      return proto.__origGetContext.apply(this, [type, ...args])
    }
  }
}

const delay = <T,>(p: Promise<T>, ms = 2000) =>
  new Promise<T>((resolve) =>
    setTimeout(() => {
      p.then(resolve)
    }, ms)
  )
// ------------------------------------------------------

// ленивые компоненты (с задержками по флагам)
const LevaMonitor = lazy(() =>
  import('./LevaMonitor').then((m) => ({ default: m.LevaMonitor }))
)
const Game = lazy(() =>
  (FLAGS.slowApp ? delay(import('./Game'), FLAGS.ms) : import('./Game')).then((m) => ({
    default: m.Game,
  }))
)
const Menu = lazy(() =>
  FLAGS.slowMenu ? delay(import('./Menu'), FLAGS.ms) : import('./Menu')
)
const Wrapper = lazy(() =>
  (FLAGS.slowApp ? delay(import('./Wrapper'), FLAGS.ms) : import('./Wrapper')).then(
    (m) => ({ default: m.Wrapper })
  )
)

// настройки рендера
const GL_SETTINGS = {
  antialias: true,
  toneMapping: ACESFilmicToneMapping,
  outputColorSpace: SRGBColorSpace,
}

// кортеж [min,max]
const DPR_SETTINGS: [number, number] = [1, 2]

// универсальный флаг dev без process.*
const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true

// fallback’и
const LoadingFallback = ({ text = 'Загрузка...' }: { text?: string }) => (
  <div
    className='loading-fallback'
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: 18,
      color: '#666',
    }}
  >
    {text}
  </div>
)

const WebGLError = () => (
  <div
    className='webgl-error'
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: 20,
      textAlign: 'center',
      color: '#d32f2f',
    }}
  >
    <h3>WebGL не поддерживается</h3>
    <p>Обновите браузер или включите аппаратное ускорение.</p>
  </div>
)

// сцена
const Scene = () => (
  <Suspense fallback={null}>
    <Game />
  </Suspense>
)

function Main() {
  const isVisible = useMenuStore((s) => s.isVisible)
  const { far, near, fov, zoom } = cameraCONFIG

  return (
    <div className='main'>
      <Suspense
        fallback={
          FLAGS.defaultLoading ? (
            <LoadingFallback />
          ) : (
            <LoadingFallback text='Инициализация приложения...' />
          )
        }
      >
        <Wrapper>
          {isDev && (
            <Suspense fallback={null}>
              <LevaMonitor />
            </Suspense>
          )}

          <Canvas
            dpr={DPR_SETTINGS}
            shadows
            gl={GL_SETTINGS}
            camera={{ far, near, fov, zoom }}
            fallback={<WebGLError />}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 1.0
            }}
          >
            <Scene />
          </Canvas>

          {(isVisible || FLAGS.forceMenu) && (
            <Suspense fallback={<LoadingFallback text='Загрузка меню...' />}>
              <Menu />
            </Suspense>
          )}
        </Wrapper>
      </Suspense>
    </div>
  )
}

export default Main
