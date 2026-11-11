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


## Enmienda 2026-11-11 (post-revisión de QA visual)

Tras la revisión de capturas se aplicaron dos correcciones adicionales dentro del mismo `<style id="x-fix-20261111">`, solo en el media query móvil (max-width:820px):

- `#caos .x-title{z-index:140}` — en móvil las tarjetas animadas del hero (z-index hasta 105) cruzaban por encima del título y del subtítulo (h1 z-index 88); con 140 el título y la píldora del subtítulo quedan siempre por encima de las tarjetas y por debajo del badge (150). Legibilidad garantizada en todo el ciclo de animación.
- `.x-hero-sub{background:rgba(5,7,13,.88)}` — fondo más opaco para que el subtítulo no se vea afectado por tarjetas que pasan detrás.

Además, de la revisión salieron aplicadas antes: header móvil con fondo sólido `#05070d` y segunda fila de navegación, `#caos .x-badge{top:124px}` para que el badge no quede tras el header, y `scroll-margin-top:124px` en `#paquetes`/`#boton` móvil (90px en desktop).

### Estado de ejecución

- Rama: `correcciones-web-2026-11-11`. HEAD exacto: commit `27894507d7f90306ffe50b1b0df5c27ba4c6cc7a` ("Rename 1-index.html to index.html"). Cadena: `aabcede7` (CSS enmienda) → `d8062fa` (retira index.html viejo) → `2789450` (deja el parchado final como index.html). Historial íntegro; el index previo queda recuperable en `aabcede7` y el publicado original en la rama de respaldo `respaldo-publicado-2026-11-07`.
- Preview: https://agenciamx-preview-20261111.netlify.app (sitio Netlify separado 6763e531-ab49-429a-a146-f559e6a40bed), deploy de 97 archivos públicos, state ready.
- Nota de alcance: la "fuente editable" es la base estática publicada y parchada (archivos tal como se sirvieron el 26-oct + parche), no el código fuente original del sitio, que no se encontró en las rutas revisadas. Los assets compilados (p. ej. assets/index-cbqndily.js) no se tocaron.
- QA ejecutado sobre el preview final: animación completa del hero móvil sin colisión subtítulo/tarjetas (5+ frames), badge visible bajo header, anclas #paquetes y #boton despejadas del header fijo (124px vs header 110px), 3 paquetes apilados en móvil sin tabs ni contactos duplicados, desktop 1440px idéntico al vivo en precios (3 columnas) y hero con subtítulo. `.x-pq__tabs` oculto también en el sitio vivo: comportamiento original, no regresión.
- Gaps declarados: contenido exacto de `_redirects` no recuperado (comportamiento reproducido por pretty-URL por defecto); bundle de la edge function "markdown" no recuperado (el preview no sirve la variante .md por Accept: text/markdown); respaldo = 97 públicos byte-exact, no íntegro funcional por esos faltantes.
- Publicación en producción: pendiente, SOLO con OK explícito de Gastón, en paso aparte.

## Enmienda 2026-11-11 (cierre de gaps de configuración del deploy)

Investigación read-only posterior a la entrega del preview, autorizada por Main 04:28. Resultado: la **configuración del deploy** de producción quedó recuperada **byte-exacta** y respaldada en la rama `respaldo-publicado-2026-11-07`, carpeta `recuperado-config-2026-11-11/` (+ `RESPALDO-NOTAS-ADENDA-2026-11-11.md` en raíz, que sustituye la sección "No recuperable" de las notas originales).

- `_redirects` (434 B, sha1 `1924ab27…` == inventario): 13 reglas legado (`/automatizacion`, `/identidad`, `/infraestructura`, `/nueva`, `/nueva/*` → `/`; aliases EN→ES; rewrite `/anterior/*`). Los 301 html→diagonal son pretty-URL por defecto de Netlify.
- `manifest.json` (886 B, sha1 `21c0d3c1…` == inventario): en repo como `10-manifest.json` (prefijo automático de la UI de upload; contenido exacto).
- Bundle eszip (6211 B, sha1 `cb476f02…` == inventario) + `markdown.ts` extraído (extracto original 1080 B; copia repo 1081 B por salto final del editor web).
- Método: token de control de acceso de la UI de Netlify + encabezado `application/vnd.bitballoon.v1.raw` (detalle en el LEEME de la carpeta).

**Alcance exacto**: se recuperó la *configuración del deploy*, NO la fuente original del 26 oct (no hallada en las rutas revisadas: refs/tags del repo, staging, cerebro, buzón, correo, mensajes). El preview actual **sigue sin** la edge function ni las reglas de `_redirects`: no hay paridad funcional con producción hasta implementarlas y probarlas en una revisión autorizada aparte.

**Paso concreto para publicación segura** (NO ejecutado; preview y live congelados): cuando Gastón autorice publicar, (1) crear un deploy NUEVO desde el respaldo: 97 públicos + `_redirects` exacto + edge function `markdown` con la fuente `markdown.ts` recuperada (deploy con build/CLI, no drag-and-drop, para incluir la función); (2) verificar en ese deploy candidato: 301s legado, `Accept: text/markdown` en `/` y en ruta inexistente (404 markdown), y las correcciones visuales de este plan; (3) solo con ese candidato verificado, cambiar producción al nuevo deploy (sin tocar el deploy bloqueado 26-oct, que queda como rollback).

## Enmienda 2026-11-11 (candidato de publicación con configuración recuperada)

Ejecutado tras el OK de diseño de Gastón (11 nov, ~07:41) y la instrucción de Main 07:42 de continuar con los cambios pendientes. Se creó un deploy candidato SEPARADO con la configuración recuperada + los 97 públicos parchados; el preview entregado y producción quedaron intactos.

- Sitio candidato: https://agenciamx-candidato-20261111.netlify.app (sitio Netlify nuevo `86623d5b-3358-43ad-8977-fca88ceadfc0`), publicado como deploy de digest `6af471e6d1b297e398bd49f6` (100 archivos: 97 públicos parchados + `_redirects` exacto + bundle eszip de la edge function "markdown").
- Hallazgo de mecánica Netlify: un deploy por ZIP descarta las entradas internas `.netlify/` (la función no se activa); el deploy por digest (mapa ruta→sha1 + subida de cuerpos) las conserva y la activa. El deploy ZIP intermedio `6af4716b16c7b7fbec7a9e09` quedó descartado en el historial del sitio (inmutable).
- QA funcional del candidato (todo PASS): las 13 reglas `_redirects` (301 legado `/automatizacion` `/identidad` `/infraestructura` `/nueva` `/nueva/*`, aliases EN→ES, rewrite `/anterior/*` 200); pretty-URLs (301 de `.html` y sin diagonal); `Accept: text/markdown` en `/` → 200 markdown "# agencIA · Del caos al orden" y en ruta inexistente → 404 markdown; HTML normal intacto; `/acerca.md` y `/sitemap.xml` servidos directos (excludedPath). Paridad con producción en las mismas sondas, con cuerpos markdown byte-idénticos (`cmp`).
- Contenido: los 96 archivos heredados son byte-idénticos al inventario del deploy original; `index.html` es el commit aprobado `2789450`. El HTML servido es idéntico al aprobado salvo la línea de HUD que Netlify inyecta en todo sitio (misma salvedad de plataforma que el preview).
- QA visual móvil 390px: hero legible (badge y píldora de subtítulo) y `#paquetes` con las 3 tarjetas apiladas ($9,900 / $14,900 / $24,900), igual al preview aprobado (contenido byte-idéntico).
- Estado: candidato verificado y listo como base de publicación. Producción sigue en el deploy bloqueado 26-oct; el preview entregado sigue congelado. Publicar sigue pendiente del OK explícito de Gastón (lo gestiona Main). El caso de cliente real sigue condicionado a evidencia y permiso del cliente.

## Enmienda 2026-11-11 (publicación en producción)

Publicado con OK explícito de Gastón (11 nov 07:56: "Sí ahorita ya ponla y publícala con los cambios que le acabamos de hacer"), alcance aclarado: la versión revisada, SIN la demostración nueva ni secciones extra. Dictámenes previos de los dos críticos (visual y comercial) sobre el candidato: sin regresiones materiales.

- Deploy de producción NUEVO: `6af474578532c2c410697c3d` en el sitio agenciamx (`4f7afb98-a7dc-498d-ab18-761add77716e`), creado por digest con el MISMO mapa ruta→sha1 del candidato auditado (`6af471e6d1b297e398bd49f6`); 0 subidas requeridas (los sha ya estaban en el almacén de Netlify), contenido byte-idéntico al candidato.
- El deploy 26-oct tenía lock de Netlify; el deploy nuevo se publicó con la operación de publicación (restore) autorizada como parte necesaria del publish. El deploy original `6adf8fa5d4ddecebd8a2c77d` queda intacto en el historial como rollback (republicarlo con restore deja el sitio como el 26-oct).
- Verificación en vivo https://agenciamx.app (33/33 PASS): index byte-idéntico al commit `2789450` (sha1 `c2b322c7…`; sin inyección HUD en dominio propio); 13 reglas `_redirects` (5 legado a `/`, 7 aliases EN→ES, rewrite `/anterior/` 200); pretty-URLs 301; `Accept: text/markdown` en `/` → 200 text/markdown byte-idéntico a `index.md`; ruta inexistente → 404 markdown; 8 secciones 200; `/acerca.md` `/sitemap.xml` `/llms.txt` `/index.md` directos; assets por sha1 (bundle js, boldini.woff2, logo, contacto/index.html).
- QA visual en vivo (móvil 390px): hero legible (badge + píldora de subtítulo), `#paquetes` con ancla exacta y 3 tarjetas apiladas; sin badge "Powered by Netlify" en dominio propio.
- Observación heredada (NO regresión, ya estaba en producción): `/agentes-ia-xalapa/` aparece en el sitemap y da 404; decisión aparte (crear la página o quitarla del sitemap).
- Pendiente deliberado: la rama `main` del repo conserva el árbol Vite viejo y el sitio Netlify tiene builds conectados a `main`; el lock de deploys evita auto-publicación. Migrar `main` a la fuente estática publicada es decisión aparte: un build git de estáticos no incluiría la edge function markdown (vía git requiere `netlify.toml` + directorio de edge functions). La fuente editable publicada y la config ya están preservadas en las ramas `correcciones-web-2026-11-11` y `respaldo-publicado-2026-11-07`.


## Corrección de navegación 2026-11-11, posterior a la publicación

Gastón señaló que el nuevo enlace "Qué hace" llevaba a mitad de una animación y era redundante con la segunda sección del recorrido. Después pidió que el acceso a precios fuera más visible. Se retira "Qué hace" y se deja un solo botón "Ver precios", fondo claro y texto oscuro. Alma, copy, precios, condiciones y configuración quedan intactos. Sin ajuste SEO adicional.

Error de QA: paridad del destino no prueba que un enlace nuevo sea útil. Debe probarse el clic desde el punto de entrada y comprobar el principio completo del contenido, además de la redundancia en el recorrido. No se rehace la animación para conservar el enlace innecesario.

- Fuente: commit `7d7f6b50d420324f5c2e63e44e9dea4c9aece5d3`, único archivo web cambiado `index.html`, sha1 `1214ad8cabe28b7b3998d381edce084393623b8a`.
- Preview separada: https://agenciamx-fixnav-20261111.netlify.app, deploy `6af478269f5ee96cd4777e34`. Inventario de 100 archivos verificado: solo cambia index respecto al deploy publicado; config recuperada byte-idéntica.
- QA funcional en preview: 33/33 PASS (redirects, markdown 200 y 404, secciones, archivos directos y HTML).
- QA visual y clic real: móvil 390x844, sección precios y=124 y header hasta y=110; desktop 1440x1000, sección y=90, contenido del panel totalmente despejado del header. Título inicial completo; móvil tarjetas apiladas y desktop tres columnas. Botón visible sin tapar badge ni alterar Alma.
- Producción permanece en `6af474578532c2c410697c3d`, locked=true. Esta corrección NO publicada, pendiente de revisión y OK posterior de Gastón. Main y ajustes de build no tocados; alineación segura de main sigue pendiente aparte.


## Candidato conjunto autorizado 2026-11-11
Gastón autorizó a las 08:26 incluir la categoría estructurada mínima junto con Ver precios y publicar ambos tras revisar el candidato conjunto. Se añade knowsAbout: ["Agentes de IA para negocios"] al Organization principal y serviceType: "Agentes de IA para negocios" al Service Atender/Agente 360. Frase coherente con el título y contenido visibles. No se cambian otros servicios, precios, copy ni condiciones; no se añade meta keywords. Esto no garantiza ranking ni nota.

Candidato inmutable: https://6af47ba45f3fda2a2a5c4cd8--agenciamx-fixnav-20261111.netlify.app (deploy 6af47ba45f3fda2a2a5c4cd8). index.html sha1 eb6d86d3765dd895a53cbb6df80fd1c45e25b60a. Mapa de 100 archivos exacto, solo index cambia. QA funcional 33/33, parseo JSON-LD correcto, clic real móvil/desktop al inicio completo de precios. Publicación queda pendiente de fuente guardada y revisión final conjunta. main no alineada; deuda separada sin cambios de build settings.


### Publicación del candidato conjunto, 2026-11-11 08:33
Fuente exacta guardada antes de publicar en commit 6f95264380ed1b0750c317ebc90d1dbf1cf31d65. Revisiones visual y comercial conjuntas cerradas sin regresión material. Producción https://agenciamx.app sirve deploy 6af47ca026814e2bb8881d84, locked=true confirmado; inventario de 100 archivos idéntico al candidato auditado 6af47ba45f3fda2a2a5c4cd8. Home sha1 eb6d86d3765dd895a53cbb6df80fd1c45e25b60a, byte-idéntico a la fuente. QA live 33/33 y clic real móvil/desktop al inicio completo de paquetes, capturas inspeccionadas. Deploy previo 6af474578532c2c410697c3d y original 26-oct intactos como rollback. No se promete ranking ni nota; no se ejecutó nuevo escaneo. main y build settings intactos, alineación segura de main sigue pendiente aparte.
