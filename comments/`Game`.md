### **Описание кода `Game.tsx`**

Этот код представляет собой компонент `Game`, который отвечает за логику игровой сцены и управление событиями клавиатуры. Он использует `@react-three/fiber` для обновления сцены в каждом кадре и управляет состоянием паузы через глобальный стор `useMenuStore`.

---

### **Разбор кода по частям**

#### **1. Импорты**

```tsx
import { useEffect } from 'react'
import { Scene } from './Scene'
import renderInfo from '../engine/render/renderInfo'
import { useFrame } from '@react-three/fiber'
import setLoop from '../engine/time/setLoop'
import { useMenuStore } from '../store/menuStore'
import keyboardEvents from '../engine/events/keyboardEvents'
import { keyboardPauseEvent } from '../engine/events/pauseEvent'
```

- `useEffect` – хук React для выполнения побочных эффектов, подписок и очистки.
    
- `Scene` – компонент, который рендерит 3D-мир.
    
- `renderInfo` – вызывается при монтировании и отображает информацию об игре.
    
- `useFrame` – хук из `@react-three/fiber`, вызываемый в каждом кадре для обновления состояния сцены.
    
- `setLoop` – функция управления игровым циклом (получает `delta` – время между кадрами).
    
- `useMenuStore` – глобальное состояние Zustand для управления меню.
    
- `keyboardEvents` – обработчик ввода с клавиатуры для управления персонажем/миром.
    
- `keyboardPauseEvent` – обработчик клавиатурного события для постановки игры на паузу.
    

---

#### **2. Получение состояния из глобального стора**

```tsx
const isVisible = useMenuStore((state) => state.isVisible)
const titleMenu = useMenuStore((state) => state.titleMenu)
```

- `isVisible` – флаг, показывающий, открыто ли меню.
    
- `titleMenu` – название текущего меню (например, `'Pause'`).
    

---

#### **3. Первоначальный рендеринг информации**

```tsx
useEffect(() => {
  renderInfo()
}, [])
```

- `renderInfo()` вызывается один раз при монтировании компонента (`[]` в `useEffect`) и выводит в UI данные о игре.
    

---

#### **4. Управление событиями клавиатуры**

```tsx
useEffect(() => {
  document.removeEventListener('keydown', keyboardEvents)
  document.removeEventListener('keydown', keyboardPauseEvent)

  if (isVisible && titleMenu === 'Pause') {
    document.addEventListener('keydown', keyboardPauseEvent)
  } else if (!isVisible) {
    document.addEventListener('keydown', keyboardEvents)
  }

  return () => {
    document.removeEventListener('keydown', keyboardEvents)
    document.removeEventListener('keydown', keyboardPauseEvent)
  }
}, [isVisible, titleMenu])
```

- Перед добавлением новых слушателей событий сначала удаляем старые.
    
- **Если меню активно и оно – "Pause"**, вешаем обработчик `keyboardPauseEvent` (нажатие клавиши "ПРОБЕЛ" ставит игру на паузу).
    
- **Если меню скрыто**, вешаем `keyboardEvents` для управление движением персонажа.
    
- **При размонтировании** (`return`) убираем слушатели, предотвращая утечки памяти.
    

---

#### **5. Запуск игрового цикла**

```tsx
useFrame((_, delta) => setLoop(delta))
```

- `useFrame` – вызывается каждый кадр (`delta` – время между кадрами).
    
- `setLoop(delta)` – вероятно, обновляет состояние игры, используя `delta` для плавного движения объектов.
    

---

#### **6. Отображение игровой сцены**

```tsx
return <Scene />
```

- Возвращает компонент `Scene`, который рендерит 3D-игровой мир.
    

---

### **Вывод**

✔ **Эффективное управление событиями клавиатуры.**  
✔ **Грамотное использование `useEffect` и `useFrame`.**  
✔ **Отделение логики рендера (`renderInfo`) и игрового цикла (`setLoop`).**  
✔ **Оптимизированный подход с удалением обработчиков событий.**

🚀