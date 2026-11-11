# Cerebro — Web principal agenciamx.app

Conocimiento destilado del proyecto. Detalle operativo completo: docs/planes/2026-11-11-correcciones-web-principal.md.

## Qué es
Sitio público de agencIA en https://agenciamx.app (Netlify, sitio `agenciamx`, id `4f7afb98-a7dc-498d-ab18-761add77716e`).

## Verdades duraderas
- La fuente original del deploy 26-oct NO está en el repo. La fuente de verdad editable es la base estática publicada + parches, rama `correcciones-web-2026-11-11`. El respaldo byte-exacto de los 100 archivos del deploy original + config recuperada vive en `respaldo-publicado-2026-11-07` (incluye carpeta `recuperado-config-2026-11-11/`).
- Config del deploy: `_redirects` (13 reglas legado: 5 rutas viejas a `/`, 7 aliases EN→ES, rewrite `/anterior/*`) + edge function `markdown` (sirve variantes .md con `Accept: text/markdown`, home y 404; excluye .md directos y sitemap).
- Deploys por ZIP pierden las entradas `.netlify/internal/` (la edge function no se activa). Para conservarla: deploy por digest (POST con mapa ruta→sha1, subir solo los cuerpos requeridos). Los sha son globales de la cuenta: repetir el mismo mapa requiere 0 subidas.
- Lock de deploys: el deploy publicado queda bloqueado y los deploys nuevos (incluidos builds de git) NO se autopublican. Publicar otro deploy = restore sobre ese deploy; el lock acompaña al deploy publicado (verificado 2026-11-11 tras la publicación).
- Rollback: restore del deploy `6adf8fa5d4ddecebd8a2c77d` deja el sitio como el 26-oct.
- Sitios `*.netlify.app` llevan inyección HUD de Netlify en el HTML; el dominio propio no. `raw.githubusercontent` tarda ~20 s en reflejar commits; verificar por API de GitHub o página blob.
- Rama `main`: conserva el árbol Vite viejo con builds conectados (sin riesgo de autopublicación por el lock). Migrar `main` a la fuente estática publicada es decisión aparte: un build git de estáticos NO incluiría la edge function markdown (vía git requiere `netlify.toml` + directorio de edge functions); hacerlo sin eso crearía un deploy publicable con regresión.

## Publicación 2026-11-11
- OK explícito de Gastón 07:56 (versión revisada, sin demostración nueva ni secciones extra).
- Deploy de producción `6af474578532c2c410697c3d`, byte-idéntico al candidato auditado por los dos críticos (visual y comercial, sin regresiones materiales).
- QA en vivo 33/33 + verificación visual móvil: index byte-idéntico al commit `2789450` (sha1 `c2b322c74d5d483793c039ede966a8dc6a6967a1`).

## Receta rápida de verificación
- `curl -s https://agenciamx.app/ | sha1sum` → `c2b322c7…` (== rama correcciones).
- `curl -s -H 'Accept: text/markdown' https://agenciamx.app/` → 200 `text/markdown` ("# agencIA · Del caos al orden"); ruta inexistente → 404 markdown.
- `/automatizacion` → 301 `/`; `/about` → 301 `/acerca/`; `/anterior/` → 200.

## Pendientes deliberados (no abrir por inercia)
- `/agentes-ia-xalapa/` está en el sitemap y da 404 (heredado del 26-oct): crear la página o quitarla del sitemap.
- Caso real de cliente en la web: requiere evidencia comprobable + permiso del cliente.
- Migración de `main` (ver arriba): solo con config de build equivalente y revisión.


## Corrección de navegación 2026-11-11, posterior a la publicación

Gastón señaló que el nuevo enlace "Qué hace" llevaba a mitad de una animación y era redundante con la segunda sección del recorrido. Después pidió que el acceso a precios fuera más visible. Se retira "Qué hace" y se deja un solo botón "Ver precios", fondo claro y texto oscuro. Alma, copy, precios, condiciones y configuración quedan intactos. Sin ajuste SEO adicional.

Error de QA: paridad del destino no prueba que un enlace nuevo sea útil. Debe probarse el clic desde el punto de entrada y comprobar el principio completo del contenido, además de la redundancia en el recorrido. No se rehace la animación para conservar el enlace innecesario.

- Fuente: commit `7d7f6b50d420324f5c2e63e44e9dea4c9aece5d3`, único archivo web cambiado `index.html`, sha1 `1214ad8cabe28b7b3998d381edce084393623b8a`.
- Preview separada: https://agenciamx-fixnav-20261111.netlify.app, deploy `6af478269f5ee96cd4777e34`. Inventario de 100 archivos verificado: solo cambia index respecto al deploy publicado; config recuperada byte-idéntica.
- QA funcional en preview: 33/33 PASS (redirects, markdown 200 y 404, secciones, archivos directos y HTML).
- QA visual y clic real: móvil 390x844, sección precios y=124 y header hasta y=110; desktop 1440x1000, sección y=90, contenido del panel totalmente despejado del header. Título inicial completo; móvil tarjetas apiladas y desktop tres columnas. Botón visible sin tapar badge ni alterar Alma.
- Producción permanece en `6af474578532c2c410697c3d`, locked=true. Esta corrección NO publicada, pendiente de revisión y OK posterior de Gastón. Main y ajustes de build no tocados; alineación segura de main sigue pendiente aparte.
