# Cimientos Staging + SEO Técnico Implementation Plan

> **Para Hermes:** implementar por fases pequeñas, verificando cada fase antes de avanzar. No tocar el repositorio original `AGENCIA-Web-Page`; todo debe ejecutarse sobre `AGENCIA-Web-Page-staging`.

**Goal:** Dejar una base segura y verificable para mejorar `agenciamx.app` sin riesgo para producción: staging funcional, build reproducible, SEO técnico estático mínimo, assets base y validaciones.

**Architecture:** El sitio es una SPA Vite + React + TypeScript desplegada en Netlify. Como crawlers sociales y algunos bots leen el `index.html` inicial sin ejecutar JavaScript, los metadatos críticos deben existir en HTML estático como fallback, manteniendo `SEO.tsx`/`StructuredData.tsx` para rutas dinámicas en cliente.

**Tech Stack:** Vite 7.2, React 19.2, TypeScript 5.9, Tailwind 4.1, React Router 7, React Helmet Async, Netlify.

---

## Contexto confirmado

- Repositorio de laboratorio: `https://github.com/Gastonehv/AGENCIA-Web-Page-staging.git`.
- Rama actual local: `AgencIA-v2.00`.
- Remoto actual: `origin -> https://github.com/Gastonehv/AGENCIA-Web-Page-staging.git`.
- `index.html` actual solo contiene charset, favicon Vite, viewport, carga de fuente Manrope y title.
- `public/` actual contiene: `_redirects`, `vite.svg`, `team/ceo.jpg`, `vortex_demo/*`.
- No existen todavía `robots.txt`, `sitemap.xml`, favicon de marca ni `og-image.jpg` en `public/`.
- `_redirects` existe y contiene: `/* /index.html 200`.
- Hay componentes dinámicos `src/components/SEO.tsx` y `src/components/StructuredData.tsx`, pero no resuelven el problema de crawlers que no ejecutan JS.

## Bloqueos/deuda técnica detectados antes de modificar

1. `npm ci` falla por conflicto peer dependency:
   - Proyecto usa `react@19.2.0`.
   - `react-helmet-async@2.0.5` declara peer `react ^16.6 || ^17 || ^18`.
   - Para reproducir localmente se requiere temporalmente `npm ci --legacy-peer-deps`.
2. `npm run build` falla después de instalar dependencias:
   - `src/components/IridescentFluid.tsx`: import `React` no usado.
   - `src/components/MoneyButton.tsx`: import `React` no usado.
   - `src/components/MoneyButton.tsx`: `ease` no existe en `ScrollToOptions`.
   - `src/video/*`: faltan módulos `remotion` y `@remotion/google-fonts/Inter`.
   - `src/video/ManifestoAd.tsx`: parámetro `fps` no usado.
3. `npm audit` reporta 15 vulnerabilidades: 1 baja, 6 moderadas, 8 altas. No ejecutar `npm audit fix` automáticamente sin revisión porque puede cambiar versiones y romper el sitio.

---

# Fase 0 — Seguridad operativa

### Task 0.1: Confirmar aislamiento total del staging

**Objetivo:** Evitar tocar producción por accidente.

**Archivos:** ninguno.

**Comandos:**

```bash
git status --short
git branch --show-current
git remote -v
```

**Validación esperada:**

- Rama de trabajo local clara.
- `origin` apunta a `AGENCIA-Web-Page-staging`, no al repo original.
- No hay cambios no explicados antes de empezar.

**Commit:** No aplica.

---

# Fase 1 — Build reproducible antes de SEO

> Esta fase va primero porque no tiene sentido mejorar SEO si el proyecto no compila de forma confiable.

### Task 1.1: Documentar instalación con legacy peer deps sin cambiar dependencias todavía

**Objetivo:** Registrar el estado real sin esconder el conflicto React 19 vs React Helmet Async.

**Files:**
- Modify: `README.md` o crear `docs/staging-baseline.md`.

**Contenido mínimo recomendado:**

```md
# Staging baseline

Install currently requires:

npm ci --legacy-peer-deps

Reason: react-helmet-async@2.0.5 peer dependency does not include React 19.
Do not run npm audit fix automatically without review.
```

**Validación:** El documento existe y explica cómo reproducir la instalación.

**Commit:**

```bash
git add docs/staging-baseline.md README.md
git commit -m "docs: document staging baseline"
```

### Task 1.2: Sacar `src/video` del build principal o instalar Remotion correctamente

**Objetivo:** Resolver errores TypeScript por archivos de video que no forman parte de la web principal o declarar sus dependencias si sí deben compilar.

**Opción recomendada inicial:** excluir `src/video` del `tsconfig.app.json` porque el script `video` parece ser un pipeline separado.

**Files:**
- Modify: `tsconfig.app.json`

**Cambio recomendado:**

```json
{
  "compilerOptions": {
    ...
  },
  "include": ["src"],
  "exclude": ["src/video"]
}
```

**Validación:**

```bash
npm run build
```

Debe eliminar los errores `Cannot find module 'remotion'`.

**Riesgo:** Si Netlify o la app web necesitan `src/video`, entonces esta no es la solución; habría que añadir `remotion` y `@remotion/google-fonts` como devDependencies.

**Commit:**

```bash
git add tsconfig.app.json
git commit -m "build: exclude remotion sources from app build"
```

### Task 1.3: Corregir errores TS no usados y scroll options

**Objetivo:** Que `npm run build` pase sin relajar TypeScript.

**Files:**
- Modify: `src/components/IridescentFluid.tsx`
- Modify: `src/components/MoneyButton.tsx`

**Cambios esperados:**

- Eliminar `import React from 'react';` si no se usa directamente.
- En `MoneyButton.tsx`, reemplazar uso inválido de `window.scrollTo({ ..., ease: ... })` por una alternativa válida:
  - usar `behavior: 'smooth'`, o
  - si se requiere easing custom, implementarlo con `requestAnimationFrame` o Lenis/GSAP.

**Validación:**

```bash
npm run build
```

**Commit:**

```bash
git add src/components/IridescentFluid.tsx src/components/MoneyButton.tsx
git commit -m "fix: restore TypeScript build"
```

---

# Fase 2 — SEO estático base en `index.html`

### Task 2.1: Agregar metadatos críticos estáticos

**Objetivo:** Que WhatsApp, LinkedIn, X/Facebook y Google tengan fallback sin ejecutar JS.

**Files:**
- Modify: `index.html`

**Agregar dentro de `<head>`:**

```html
<meta name="description" content="AgencIA diseña y construye plataformas web, automatizaciones con IA y sistemas digitales para convertir atención en clientes y crecimiento medible." />
<link rel="canonical" href="https://agenciamx.app/" />

<meta property="og:type" content="website" />
<meta property="og:url" content="https://agenciamx.app/" />
<meta property="og:title" content="AgencIA | Ingeniería digital, automatización e IA" />
<meta property="og:description" content="Creamos páginas web, apps y automatizaciones con IA para marcas que quieren operar más rápido, vender mejor y escalar con infraestructura digital." />
<meta property="og:image" content="https://agenciamx.app/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="es_MX" />
<meta property="og:site_name" content="AgencIA" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AgencIA | Ingeniería digital, automatización e IA" />
<meta name="twitter:description" content="Páginas web, apps y automatizaciones con IA para convertir atención en clientes y crecimiento medible." />
<meta name="twitter:image" content="https://agenciamx.app/og-image.jpg" />
```

**Validación:**

```bash
npm run build
```

Después de build, inspeccionar `dist/index.html` y confirmar que contiene `og:title`, `twitter:card`, `description`, `canonical`.

**Commit:**

```bash
git add index.html
git commit -m "seo: add static social and search metadata"
```

### Task 2.2: Agregar JSON-LD Organization y WebSite estáticos

**Objetivo:** Mejorar comprensión semántica por buscadores.

**Files:**
- Modify: `index.html`

**Agregar antes de `</head>`:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgencIA",
  "url": "https://agenciamx.app/",
  "logo": "https://agenciamx.app/favicon-512.png",
  "email": "proyectos@agenciamx.app",
  "description": "Agencia de ingeniería digital, automatización e inteligencia artificial en México.",
  "sameAs": []
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AgencIA",
  "url": "https://agenciamx.app/",
  "inLanguage": "es-MX"
}
</script>
```

**Nota:** Completar `sameAs` con redes oficiales reales cuando estén confirmadas.

**Validación:** Usar Rich Results Test / Schema Validator tras deploy staging.

**Commit:**

```bash
git add index.html
git commit -m "seo: add static structured data fallback"
```

---

# Fase 3 — Assets fundacionales públicos

### Task 3.1: Reemplazar favicon Vite por identidad AgencIA

**Objetivo:** Eliminar marca genérica de Vite y reforzar identidad.

**Files:**
- Add: `public/favicon.ico`
- Add: `public/favicon-32.png`
- Add: `public/favicon-512.png`
- Add: `public/apple-touch-icon.png`
- Modify: `index.html`

**Cambio en `index.html`:**

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

**Validación:**

```bash
npm run build
```

Abrir preview y confirmar favicon en navegador.

**Commit:**

```bash
git add public/favicon.ico public/favicon-32.png public/favicon-512.png public/apple-touch-icon.png index.html
git commit -m "brand: replace vite favicon with agencia assets"
```

### Task 3.2: Crear `public/og-image.jpg`

**Objetivo:** Habilitar preview profesional de links compartidos.

**Files:**
- Add: `public/og-image.jpg`

**Especificación:**

- Tamaño: 1200x630px.
- Fondo tecnológico oscuro.
- Logo/tipografía AgencIA.
- Tagline corto: “Ingeniería digital. Automatización. IA.”
- URL: `agenciamx.app`.

**Validación:**

- Confirmar archivo existe.
- Tras deploy, probar con LinkedIn Post Inspector, Facebook Sharing Debugger y vista previa de WhatsApp/Telegram.

**Commit:**

```bash
git add public/og-image.jpg
git commit -m "brand: add open graph preview image"
```

---

# Fase 4 — Crawling: robots y sitemap

### Task 4.1: Crear `robots.txt`

**Objetivo:** Dar directivas claras a buscadores y bloquear rutas internas.

**Files:**
- Add: `public/robots.txt`

**Contenido recomendado:**

```txt
User-agent: *
Allow: /
Disallow: /playground
Disallow: /narrativa-v1

Sitemap: https://agenciamx.app/sitemap.xml
```

**Validación local:** build y revisar que `dist/robots.txt` exista.

**Commit:**

```bash
git add public/robots.txt
git commit -m "seo: add robots directives"
```

### Task 4.2: Crear `sitemap.xml`

**Objetivo:** Declarar rutas públicas indexables.

**Files:**
- Add: `public/sitemap.xml`

**Contenido inicial:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://agenciamx.app/</loc><priority>1.0</priority></url>
  <url><loc>https://agenciamx.app/automatizacion</loc><priority>0.8</priority></url>
  <url><loc>https://agenciamx.app/identidad</loc><priority>0.8</priority></url>
  <url><loc>https://agenciamx.app/infraestructura</loc><priority>0.8</priority></url>
  <url><loc>https://agenciamx.app/contacto</loc><priority>0.7</priority></url>
  <url><loc>https://agenciamx.app/privacidad</loc><priority>0.3</priority></url>
  <url><loc>https://agenciamx.app/terminos</loc><priority>0.3</priority></url>
</urlset>
```

**Validación:** Confirmar que Netlify sirve `/sitemap.xml` como XML y no como `index.html`.

**Commit:**

```bash
git add public/sitemap.xml
git commit -m "seo: add sitemap"
```

---

# Fase 5 — Performance y semántica

### Task 5.1: Auditar y corregir imágenes sin lazy loading

**Objetivo:** Reducir carga inicial y mejorar performance móvil.

**Files probables:**
- `src/pages/Home.tsx`
- `src/components/Footer.tsx`
- `src/components/Navbar.tsx`
- `src/components/Services.tsx`
- `src/components/identity/OrganicCore.tsx`
- otros componentes con `<img>`.

**Regla:**

- Imágenes hero/LCP: no usar lazy si son críticas arriba del fold.
- Imágenes debajo del fold: `loading="lazy" decoding="async"`.

**Validación:** build + Lighthouse.

**Commit:**

```bash
git add src
git commit -m "perf: lazy load non-critical images"
```

### Task 5.2: Agregar posters a videos visibles

**Objetivo:** Evitar frames negros/vacíos y mejorar primera impresión.

**Files probables:**
- `src/pages/Home.tsx`
- `src/components/AlmaSection.tsx`
- `src/components/CrystalScroller.tsx`
- `src/components/ProjectModal.tsx`
- `src/components/Symbiosis.tsx`

**Regla:**

- Todo `<video>` visible debe tener `poster` salvo videos ocultos usados como buffer/canvas.
- Usar imágenes optimizadas en `public/posters/` o assets importados.

**Validación:** revisión visual en browser + build.

**Commit:**

```bash
git add src public/posters
git commit -m "perf: add posters to visible videos"
```

### Task 5.3: Revisar estructura semántica

**Objetivo:** Mejorar accesibilidad y lectura por buscadores.

**Files probables:**
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- páginas bajo `src/pages/`.

**Regla:**

- `Navbar` debe renderizar `<header>`/`<nav>`.
- Contenido principal debe estar dentro de un solo `<main>` por página.
- Footer debe ser `<footer>`.
- Evitar múltiples `<main>` anidados.

**Validación:** Lighthouse accessibility + inspección DOM.

**Commit:**

```bash
git add src
git commit -m "a11y: improve semantic page structure"
```

---

# Fase 6 — Deploy staging y validaciones externas

### Task 6.1: Conectar repo staging a Netlify como sitio separado

**Objetivo:** Tener URL de laboratorio independiente del dominio original.

**Acciones en Netlify:**

- Crear nuevo site desde GitHub repo `AGENCIA-Web-Page-staging`.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Si el build necesita temporalmente legacy deps, configurar install command:
  - `npm ci --legacy-peer-deps`

**Validación:** Deploy verde en Netlify y URL tipo `https://<nombre-lab>.netlify.app`.

### Task 6.2: Validar previews, sitemap y robots en staging

**Objetivo:** Probar lo que producción no tiene sin tocar producción.

**Checks:**

- `GET /robots.txt` devuelve texto plano, no HTML de SPA.
- `GET /sitemap.xml` devuelve XML, no HTML de SPA.
- `GET /og-image.jpg` devuelve imagen 1200x630.
- Compartir URL staging en herramientas:
  - Facebook Sharing Debugger.
  - LinkedIn Post Inspector.
  - X Card Validator si está disponible.
- Lighthouse móvil: Performance, SEO, Accessibility.

**Commit:** No aplica salvo ajustes derivados.

---

# Orden recomendado de ejecución

1. Fase 0: confirmar aislamiento.
2. Fase 1: hacer que build sea reproducible.
3. Fase 2: metadatos estáticos y JSON-LD.
4. Fase 3: favicon + OG image.
5. Fase 4: robots + sitemap.
6. Fase 5: performance/semántica.
7. Fase 6: deploy staging + validación externa.

# Criterio de éxito

No se considera listo para proponer publicación en `agenciamx.app` hasta que:

- `npm run build` pase limpio.
- El repo staging tenga commits separados por fase.
- Netlify staging despliegue correctamente.
- `/robots.txt`, `/sitemap.xml`, `/og-image.jpg` funcionen en staging.
- Los previews sociales muestren título, descripción e imagen.
- No se haya modificado ni empujado nada al repo original.
