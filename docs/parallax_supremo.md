# 💎 Canon Técnico: Parallax Supremo (Agencia Edition)

Este documento preserva la lógica de animación de ultra-lujo desarrollada para el `ShowcaseSlider`, diseñada para maximizar la nitidez y la profundidad arquitectónica.

## 🏛️ Los 4 Pilares del Parallax Supremo

### 1. Geometría Nativa (Aspect Ratio Leverage)
*   **Concepto**: No escalar el video. Usar la diferencia natural de ratios para crear el margen de movimiento.
*   **Fórmula**: Video 16:9 (1.77) sobre Ventana 4:3 (1.33) = **33.3% de ancho extra nativo**.
*   **Implementación**: `width: 133.33%`, `height: 100%`, `left: -16.66%` (Centro perfecto).
*   **Beneficio**: Nitidez 1:1, cero pixelación, nitidez de estudio.

### 2. Activación Focal (Smart Triggering)
*   **Concepto**: El parallax es un premio a la atención, no un ruido periférico.
*   **Lógica**:
    *   **Entrada**: `xPercent: 0` (Video anclado).
    *   **Zona Focal (Centro)**: Se activa el desplazamiento.
    *   **Salida**: `xPercent: 0` (Retorno al anclaje).
*   **Beneficio**: Eliminación total de huecos negros y bordes vacíos.

### 3. Contramovimiento (Counter-Movement Friction)
*   **Concepto**: Ley de fricción visual duplicada.
*   **Dirección**: Si la Tarjeta se mueve a la **IZQUIERDA**, el Video se mueve a la **DERECHA**.
*   **Efecto**: Profundidad tangible, sensación de volumen 3D y realismo cinemático.

### 4. Fluidez Perpetua (Continuous Kinetic Flow)
*   **Concepto**: Eliminar pausas estáticas de scroll para no romper el diferencial de velocidades.
*   **Sync**: El ScrollTrigger del parallax debe estar sincronizado con el `containerAnimation` del slider horizontal para una respuesta inmediata.

---

## 🛠️ Snippet de Implementación (GSAP)

```tsx
// Configuración de Parallax Supremo
const parallaxRange = 8; // Basado en el 33% de aire nativo

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: cardElement,
        containerAnimation: parentScroll,
        start: "left 100%", 
        end: "right 0%",    
        scrub: 0.1
    }
});

tl.set(img, { xPercent: 0 }); // Entrada sólida
tl.to(img, { xPercent: -parallaxRange, duration: 0.35 }); // Fase 1
tl.to(img, { xPercent: parallaxRange, duration: 0.3 }); // Fase 2 (Focal)
tl.to(img, { xPercent: 0, duration: 0.35 }); // Salida sólida
```

> [!IMPORTANT]
> "Parallax Supremo" no es solo mover un video, es mover la percepción del usuario.
