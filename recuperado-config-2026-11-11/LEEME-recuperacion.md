# Recuperación de configuración del deploy — 11 nov 2026

Configuración del deploy publicado y bloqueado `6adf8fa5d4ddecebd8a2c77d` (agenciamx.app, 26 oct 2026), recuperada **byte-exacta** el 11 nov 2026. Complementa el respaldo de los 97 archivos públicos (carpeta `publicado/`).

## Contenido de esta carpeta

| Archivo aquí | Ruta original en el deploy | Bytes | SHA-1 |
|---|---|---|---|
| `_redirects` | `/_redirects` | 434 | `1924ab2751ec136d0f66c20caa3b467c091509eb` == inventario |
| `10-manifest.json` | `/.netlify/internal/edge-functions/manifest.json` | 886 | `21c0d3c1eaf1ddf4d5cdc2aea0db15199d5db9bb` == inventario |
| `111b8e9df60f4dc45e0e9257a4de1734d0a0ccfc68b2508b5976263e01945d84.eszip` | `/.netlify/internal/edge-functions/111b8e9df60f4dc45e0e9257a4de1734d0a0ccfc68b2508b5976263e01945d84.eszip` | 6211 | `cb476f02ebcf3d47fa1184d952abca96d53e35fc` == inventario |
| `markdown.ts` | (fuente original, extraída del eszip) | 1081 en repo | `6415ee0c0fca7d55e86bc10f08bcba89d70ac343` (copia repo) |

Notas de nombre y formato (para no confundir al restaurar):

- **`10-manifest.json` es el manifest byte-exacto**: el prefijo `10-` lo añadió automáticamente la UI de upload de GitHub (contador de sesión por rama; no editable en la UI). El contenido es idéntico al original (886 B, SHA-1 coincide con el inventario). Al restaurar, renómbralo a `manifest.json`. Se prefirió conservar bytes exactos sobre nombre limpio: cualquier paso por el editor web de GitHub añade un salto de línea final y rompe la igualdad de hash (886 → 887 B).
- **`markdown.ts`**: el extracto original del eszip mide **1080 B sin salto de línea final** (SHA-1 `1fa4055755c29cb8541cbe041977f70945447bc8`); la copia en este repo mide 1081 B porque el editor web añadió el salto final. Es el módulo `file:///root/netlify/edge-functions/markdown.ts` embebido en el eszip: JavaScript transpilado con los comentarios originales. El eszip se preserva intacto como artefacto original.
- `_redirects` y el eszip están byte-exactos con su nombre limpio (subidos por la UI de upload; el eszip se renombró sin pasar por el editor por ser binario).

## Verificación

Cada SHA-1 remoto (raw de GitHub) coincide con el SHA registrado en el inventario del deploy (API Netlify `/deploys/{id}/files`), mismo criterio con que se verificaron los 97 públicos. Verificado el 11 nov 2026 tras los commits. Con esto las 100 entradas del deploy quedan respaldadas byte-exactas.

## Método de recuperación (ruta autenticada normal de la UI de Netlify)

1. `GET https://app.netlify.com/access-control/generate-access-control-token` (sesión con cookie) → token Bearer de corta duración (~300 s).
2. `GET https://api.netlify.com/api/v1/deploys/6adf8fa5d4ddecebd8a2c77d/files/<ruta>` con encabezados `Authorization: Bearer <token>` y `Content-Type: application/vnd.bitballoon.v1.raw` → devuelve los bytes crudos (sin ese token, el mismo endpoint devuelve solo metadatos).

## Alcance (sin sobre-afirmar)

- Recuperado: la **configuración del deploy** (`_redirects`, manifest, bundle de la edge function) + los 97 públicos ya respaldados.
- NO hallada: la **fuente original del 26 oct** que generó este deploy. Existe un árbol fuente Vite/React (~9 oct, anterior al live) en `main`, `respaldo-publicado-2026-11-07` y `lab/from-production-main`; la correspondencia con el 26 oct no está verificada.
- El preview de correcciones (agenciamx-preview-20261111.netlify.app) **aún no incluye** la edge function ni las reglas de `_redirects`; no hay paridad funcional con producción hasta implementarlas y probarlas en una revisión autorizada aparte.
