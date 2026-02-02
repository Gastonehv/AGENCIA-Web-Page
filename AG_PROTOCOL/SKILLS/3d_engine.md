# AG SKILL: REACT THREE FIBER (R3F) & 3D

## PHILOSOPHY
The 3D canvas is not a decoration; it is the **stage**.

## MANDATORY PATTERNS

### 1. Scene Setup
- Always wrap the Canvas in a parent container with defined dimensions (100% w/h).
- Use `<Canvas dpr={[1, 2]} />` to clamp pixel ratio (save mobile batteries).
- Always include `<Suspense fallback={null}>` (or a loader component).

### 2. Loading Models
- **NEVER** use `useLoader(GLTFLoader, url)`.
- **ALWAYS** use `useGLTF(url)` from `@react-three/drei`.
- Use `gltfjsx` to generate component boilerplate. Don't traverse the scene graph manually unless necessary.
- Preload critical models: `useGLTF.preload(url)`.

### 3. Performance (The Golden Laws)
- **Instancing:** If you have >3 of the same object, use `<Instances>` and `<Instance>`.
- **Textures:** Use `useTexture` and stick to 1024px max for standard assets. 2k/4k only for hero elements.
- **Lighting:** Bake shadows where possible. Realtime shadows are expensive. Limit `PointLights`. Use `Environment` for cheap, good-looking reflections.

### 4. Interactive Elements
- Use `onPointerOver` / `onPointerOut` for hover states.
- Set `document.body.style.cursor = 'pointer'` on hover to cue interactivity.

## SNIPPET: STANDARD SCENE
```tsx
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

export default function Scene() {
  return (
    <div className="h-screen w-full">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Experience />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
```
