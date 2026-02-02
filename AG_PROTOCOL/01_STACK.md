# AG PROTOCOL: 01_STACK

## MANDATORY TECH STACK
Any deviation requires explicit approval from MoltBot or Gastón.

### CORE
- **Framework:** React 19 (Hooks, Server Components where applicable)
- **Bundler:** Vite (Fast, optimized)
- **Language:** TypeScript (Strict mode preferred)
- **Styling:** TailwindCSS 4.x + Custom CSS Modules for complex WebGL overlays

### VISUAL ENGINE (THE MAGIC)
- **Animation:** GSAP (Greensock)
    - *Plugins:* ScrollTrigger, Flip, MorphSVG, SplitText.
    - *Rule:* Use GSAP context for cleanup in React (`useGSAP` hook).
- **3D / WebGL:** Three.js + React Three Fiber (R3F) + Drei
    - *Performance:* Use instances, merge geometries, strictly manage render loops.
- **Micro-interactions:** Framer Motion (for UI elements only, heavy lifting goes to GSAP).
- **Smooth Scroll:** Lenis (configured for seamless experience).

### PERFORMANCE RULES
1.  **Lazy Load Everything:** Components below the fold must be lazy loaded.
2.  **Asset Optimization:**
    - Images: WebP/AVIF.
    - Models: GLB (Draco compressed).
    - Textures: KTX2.
3.  **Renders:** Prevent re-renders. Memoize heavy calculations.
4.  **Clean Code:**
    - Modular components.
    - "Colocation" (keep styles/logic close to component).

## BANNED
- jQuery (Obviously).
- Heavy UI libraries (MUI, Bootstrap) - We build custom.
- Class components (Functional only).
