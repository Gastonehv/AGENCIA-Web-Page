# Adenda a RESPALDO-NOTAS.md — 11 nov 2026 (cierre de los 2 "no recuperable")

Esta adenda **sustituye** la sección "No recuperable (2 elementos, con mitigación)" de `RESPALDO-NOTAS.md` (dentro del zip de 4 partes en `publicado/`). El zip original se conserva sin tocar.

Ambos elementos quedaron recuperados **byte-exactos** el 11 nov 2026 y viven en la carpeta `recuperado-config-2026-11-11/` de esta misma rama:

1. **`_redirects`** (434 B, sha1 `1924ab2751ec136d0f66c20caa3b467c091509eb`) — contenido íntegro: 13 reglas de redirecciones legado (`/automatizacion`, `/identidad`, `/infraestructura`, `/nueva`, `/nueva/*` → `/`; aliases en inglés `/about`, `/contact`, `/privacy`, `/terms` → secciones en español; rewrite `/anterior/*` → `/anterior/index.html` 200). Los 301 de `/seccion` y `/seccion.html` hacia `/seccion/` observados en vivo son normalización pretty-URL por defecto de Netlify, no reglas del archivo.
2. **Bundle eszip** (6211 B, sha1 `cb476f02ebcf3d47fa1184d952abca96d53e35fc`) — íntegro, con nombre original; incluye además `markdown.ts`, la fuente original extraída del bundle (extracto de 1080 B; la copia del repo lleva salto de línea final del editor web, 1081 B).

Nota: el manifest recuperado vive como `10-manifest.json` (prefijo automático de la UI de upload de GitHub) precisamente para conservar sus 886 B byte-exactos sin el salto de línea que añade el editor web. Detalle y tabla de verificación en `recuperado-config-2026-11-11/LEEME-recuperacion.md`.

Método: ruta autenticada de la propia UI de Netlify (token de control de acceso de corta duración + encabezado `application/vnd.bitballoon.v1.raw` sobre el endpoint de archivos del deploy).

Estado tras esta adenda: las **100 entradas del deploy** `6adf8fa5d4ddecebd8a2c77d` (97 públicas + `_redirects` + 2 internas `.netlify/`) están respaldadas byte-exactas en esta rama. Pendiente y sin cambios: la fuente original del 26 oct no fue hallada en las rutas revisadas; el preview de correcciones aún no incorpora la edge function ni las reglas de `_redirects` (sin paridad funcional hasta implementación y revisión autorizada).
