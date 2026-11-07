# Inventario de archivos y componentes externos — Panel 360 y Clasificador Jev

Pedido por Gastón el 7-nov-2026: "Haz una lista de los archivos externos que faltan, para que
sepamos dónde viven. Si contienen claves o datos de pacientes, no los subas: solo escribe su
nombre y dónde están."

**Solo nombres y ubicaciones. Sin valores secretos, sin datos de pacientes, sin IDs internos.**

## Alcance, fuentes y límites de este inventario

- **Verificado directamente (2026-11-07):**
  - Árbol de archivos de ambos repos (Gastonehv/optica-panel-360 y Gastonehv/agencia-jev-clasificador, vía API de GitHub).
  - Los **archivos estáticos públicos** del Panel (`public/`: app.js, hark.css, hark-hero.css, inv0.js, qrcode.js, jsqr.js) son **byte-idénticos** (SHA-1) a los que sirve el sitio en vivo; `index.html` es idéntico salvo el script HUD que Netlify inyecta al servir. La página estática del sitio Jev es igualmente idéntica salvo esa inyección. Esto cubre SOLO los estáticos.
  - Los **nombres** de las variables de entorno existentes, leídos en la configuración de Netlify de cada sitio (valores no visibles ni leídos).
- **NO verificado (fuera de alcance de una comparación estática):**
  - El **contenido de las funciones desplegadas** (Netlify Functions del Panel y de Jev, y la función edge de agenciamx.app) no se puede comparar desde fuera con su fuente en el repo; la fuente en el repo es la referencia que usa el flujo de deploy (`desplegar.py`), no una verificación del despliegue.
  - El contenido real de HighLevel (workflows, campos, plantillas), de los stores de Netlify Blobs y de los servicios externos: aquí se listan porque el **código o la documentación del repo los referencia**; no se comprobó su estado actual en vivo.
  - Los valores de las variables de entorno.

## Panel 360 (sitio Netlify "optica-del-correo-360")

Código: repo Gastonehv/optica-panel-360 (estáticos verificados arriba; funciones `api.mjs` y `cobranza.mjs` sin verificación de despliegue, ver límites).

Externos — nombre y dónde vive:

| Qué | Dónde vive | Sensibilidad |
|---|---|---|
| `HL_PIT` | Variable de entorno en Netlify | **Clave secreta** (HighLevel, subcuenta Óptica) |
| `ORDENES_CLAVE` | Variable de entorno en Netlify | **Clave secreta** (clave de mostrador) |
| `VOZ_CLAVE` | Variable de entorno en Netlify | **Clave secreta** (agente de voz) |
| `AVISO_TICKET_ACTIVO`, `ALLOWED_ORIGIN`, `CLIENTE_ULTIMO`, `FOLIO_INICIAL`, `HL_API_BASE`, `HL_ASSOC_ID`, `HL_CF_NUMERO_CLIENTE`, `HL_CF_ULTIMA_RECETA`, `HL_CF_ULTIMA_VISITA`, `HL_LOCATION_ID` | Variables de entorno en Netlify | Configuración |
| Valor personalizado `ordenes360_claves` (sal + hash de claves personales) | HighLevel, subcuenta Óptica | Hashes, no claves en claro |
| Objeto personalizado de órdenes, campos personalizados, etiquetas (`cliente_optica`, `aviso_ticket_enviar`), workflow y plantilla de WhatsApp para el aviso de ticket | HighLevel, subcuenta Óptica | Configuración; el código indica que el envío por WhatsApp depende de una plantilla que "exista" — referencia del código, no verificado en vivo |
| Carpeta `importacion/` (Excel con 63 pedidos importados el 20-oct) | NO está en el repo; vivía en la carpeta de trabajo de Hark al momento de la importación | **Datos de pacientes** — solo se anota, no se sube |
| `estado_produccion.md` completo (el del repo es un extracto; el código referencia `../estado_produccion.md`) | Carpeta de trabajo de Hark | Bitácora operativa |
| Token de Netlify para desplegar | Lo inyecta Hark vía el proxy api.netlify.com (servicio "netlify"); no está en el repo | **Clave secreta** |

## Clasificador Jev (sitio Netlify "agencia-jev-clasificador")

Código: repo Gastonehv/agencia-jev-clasificador (página estática verificada arriba; funciones `clasificar.mjs`, `precalificar.mjs`, `precalificar-programada.mjs` sin verificación de despliegue, ver límites).

| Qué | Dónde vive | Sensibilidad |
|---|---|---|
| `JEV_API_KEY` | Variable de entorno en Netlify | **Clave secreta** (API del modelo de clasificación, servicio externo api.typesafe.ai) |
| `HL_PIT_AGENCIA`, `HL_PIT_OPTICA` | Variables de entorno en Netlify | **Claves secretas** (HighLevel, ambas subcuentas) |
| `WEBHOOK_SECRET` | Variable de entorno en Netlify | **Clave secreta** |
| Store de Netlify Blobs `decisiones` (registro de clasificaciones; contactos guardados como hash) | Netlify | Datos operativos (hash, no datos en claro) |
| Workflows "Jev - Clasificador WhatsApp" (uno por subcuenta), campos personalizados "Jev WhatsApp clasificación", etiquetas `jev-*` y tareas | HighLevel, subcuentas agencIA y Óptica | Configuración; URLs e IDs documentados en el README del repo privado |
| `precalificacion_clientes.json` | **Sí está en el repo**; solo contiene IDs de configuración (sin claves ni pacientes) | No sensible |

## Notas

- Este inventario NO subió ningún archivo sensible a ningún lado; solo los lee y los nombra.
- Documentado en la rama `respaldo-publicado-2026-11-07` de AGENCIA-Web-Page por ser una rama
  que Netlify no despliega (producción = solo `main`; deploys de rama desactivados, verificado
  2026-11-07). Ningún sitio cambia por tener este archivo aquí.
