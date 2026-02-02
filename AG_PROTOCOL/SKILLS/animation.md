# AG SKILL: GSAP & ANIMATION

## PHILOSOPHY
Movement must feel **expensive**. No linear easings. Everything has weight and inertia.

## MANDATORY PATTERNS

### 1. The Hook
- **NEVER** use `useEffect` for GSAP.
- **ALWAYS** use `useGSAP` from `@gsap/react`. It handles cleanup automatically.

### 2. Triggers
- Use `ScrollTrigger` for scroll-based animations.
- Always set `scroller: window` unless using a virtual scroller like Lenis (then integrate them).

### 3. Text Reveal (The Agency Signature)
- Split text into chars/words using `SplitText` (or a custom splitter if premium plugin not available).
- Stagger animations: `stagger: 0.05`.
- Easing: `ease: "power3.out"` or `ease: "expo.out"` for punchy intros.

### 4. Performance
- Animate `transform` (x, y, scale, rotation) and `opacity`.
- **NEVER** animate `width`, `height`, `top`, `left` (triggers layout thrashing).
- Use `will-change: transform` in CSS for heavy elements.

## SNIPPET: STANDARD FADE IN
```tsx
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Hero() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from('.hero-text', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      stagger: 0.1
    })
  }, { scope: container })

  return (
    <div ref={container}>
      <h1 className="hero-text">AGENCY</h1>
      <p className="hero-text">SURREALIST</p>
    </div>
  )
}
```
