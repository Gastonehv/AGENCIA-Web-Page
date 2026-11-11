# Plan: correcciones web principal agenciamx.app — 11 nov 2026

Autorizado por Gastón (WhatsApp 11 nov 03:34): (a) precios apilados vertical en móvil (el carrusel de pestañas rompe el hábito de scroll vertical), (b) línea subtítulo en el hero, (c) enlaces de navegación en el header. Respaldo primero, entregar preview para su visto bueno. Producción no se toca sin su OK.

## Base y capas (documentadas por separado)

1. **Original publicado**: deploy Netlify bloqueado `6adf8fa5d4ddecebd8a2c77d` (26 oct). Respaldo verificado byte por byte (97/97 archivos públicos, SHA-1 contra inventario Netlify) en rama `respaldo-publicado-2026-11-07`, carpeta `publicado/` (zip en 4 partes). SHA-256 del zip: `52f74a27…f18ed`.
2. **Base parchada para preview**: copia del respaldo + ediciones manuales SOLO en `index.html` (markup inline, estilos inline `<style id="x-pq-css">` y scripts inline; el sitio publicado es HTML estático editado a mano, no hay fuente de build en las rutas revisadas: repo ramas main y version-publicada-2026-10-26, deploy sin source zip). Los assets compilados (`assets/index-cbqndily.js` etc.) NO se tocan ni se renombran como fuente original.
3. **Función ausente en preview**: la edge function `markdown` (negociación `Accept: text/markdown` → variante .md) es un bundle compilado cuyo código fuente no se recuperó; la preview NO la incluirá. Limitación verificable: en la preview, `curl -H 'Accept: text/markdown'` NO devolverá markdown; el HTML normal sí debe ser idéntico. Las rutas live tampoco se tocan.

Riesgo residual declarado: el contenido exacto de `_redirects` (13 reglas) no fue recuperable; el comportamiento observado en vivo (301 a diagonal final en secciones, `/index`→`/`, 404 en rutas inexistentes) lo reproduce la normalización pretty-URL por defecto de Netlify. Podrían existir reglas sin efecto observable.

## Cambios

### (a) Precios apilados en móvil

Hoy (móvil ≤820px): pestañas "Agente 360 / Marketing / Creative" (`x-pq__tabs`), solo la tarjeta seleccionada visible (`.x-pq__c{display:none}` + `.is-sel{display:flex}`), botón dinámico "Siguiente/Volver" y tip animado.

Cambio CSS (media query ≤820px):
- `.x-pq__tabs{display:none}` (ocultar pestañas en móvil)
- `.x-pq__c{display:flex}` para TODAS las tarjetas (anulando la regla que exige `.is-sel`), con separación vertical
- `.x-pq__next{display:none}` y `.x-pq__tip{display:none}` en móvil

Auditoría JS del carrusel (script inline "Paquetes: aparición suave y pestañas en celular", fin de index.html):
- `sel(0)` inicial y listeners de click en pestañas solo mutan `aria-selected` e `is-sel`; con el CSS nuevo, `is-sel` deja de controlar visibilidad → no requiere tocar el JS.
- Los botones `x-pq__next` se crean dinámicamente en desktop y móvil; quedan ocultos por CSS en ambos (ya lo están en desktop).
- El "nudge" (`is-nudge`) anima pestañas que estarán ocultas; sin efecto visible.
- El reveal por IntersectionObserver (`data-rv` → `is-in`) se conserva: cada tarjeta aparece suavemente al hacer scroll, que es justo el hábito vertical que pide Gastón.
- Sin listeners de swipe/scroll asociados a las tarjetas; no hay interferencia adicional.
- Precios, condiciones y textos NO se modifican.

### (b) Subtítulo del hero

Línea exacta bajo el título del caos (`#caos` h1.x-title):
"Fuerza laboral digital: agentes de IA que atienden, crean, atraen y administran tu negocio"

Cuidado de diseño: `#caos` es sección fijada (pin) con animación GSAP; el subtítulo se agrega como `<p>` propio con estilo acorde (Poppins, contraste sobre fondo #05070d) sin alterar las capas animadas (field, glow, badge, hint). Se verifica visualmente desktop y móvil en preview, incluyendo que el pin/scroll-siguiente no se desplace.

### (c) Enlaces de header

- Desktop: en `header.x-top`, agregar enlaces "Qué hace" → `#boton` y "Precios" → `#paquetes` junto a las acciones existentes (llamada/WhatsApp), sin quitar nada.
- Móvil: segunda fila compacta con los mismos dos enlaces (el header actual solo tiene logo + CTAs de contacto).
- `scroll-margin-top` ya existe en `#paquetes` móvil (80px); verificar que el ancla no quede tapada por el header.

## Método

1. Respaldo (hecho, verificado).
2. Copia de trabajo del respaldo → editar `index.html`.
3. Preview en sitio Netlify NUEVO y separado (manual drop; sin vínculo a producción, sin desbloquear nada). Limitación declarada: sin edge function markdown.
4. QA en preview: rutas principales (/, /acerca … /administrar), 404 personalizado, assets (videos/fuentes/audio), anclas #boton y #paquetes, header en desktop y móvil, hero con subtítulo, precios apilados en móvil y grid intacto en desktop, reveal por scroll, CTAs de contacto (tel y wa.me sin cambios).
5. Críticos de IA revisan la versión FINAL de preview contra el original publicado para regresiones.
6. Fuente editable (el sitio parchado completo) a GitHub antes de entrega.
7. Entrega a Gastón: liga de preview. Publicación en producción SOLO con su OK explícito y en paso aparte.

## Fuera de alcance

- Cambios de precios, textos comerciales o condiciones.
- Sección de casos reales (requiere evidencia + permiso).
- Funciones nuevas, envíos, gastos.
- Descubre, DNS, deploy raíz, desbloqueo de Netlify.
