# Respaldo de agenciamx.app (versión publicada en vivo) — rama respaldo-publicado-2026-11-07

## Qué es esto

Respaldo exacto, archivo por archivo, de lo que sirve **https://agenciamx.app/** (Netlify),
descargado por HTTPS el **7 de noviembre de 2026, ~10:26 CST**. Son **33 archivos**.

## Qué contiene esta rama

- **`publicado/1-snapshot-agenciamx-publicado-2026-11-07.zip`**: el respaldo COMPLETO.
  Dentro están los 33 archivos del sitio en vivo (carpeta `publicado/`), byte por byte
  idénticos a lo que sirve Netlify, más `SHA256SUMS.txt` con la huella SHA-256 de cada uno
  y su propio LEEME. SHA-256 del ZIP: `d171af4d88be73632b4e062663a42a23af536937bd74e35ae4660343353bdbd5`
  (411,443 bytes; verificado tras subirlo).
  (El prefijo "1-" del nombre lo agregó solo GitHub al subirlo; el contenido es el correcto.)
- **`SHA256SUMS.txt`** (en esta raíz): la misma lista de huellas de los 33 archivos en vivo,
  para verificar sin abrir el ZIP.
- Los 33 archivos **no están sueltos** en esta rama: la interfaz web de GitHub renombra los
  archivos al subirlos y dañó dos intentos previos (en el repo de Óptica) de dejarlos
  expandidos. Queda pendiente extraerlos como archivos sueltos cuando haya una vía segura
  autorizada; mientras tanto el ZIP es la fuente completa y verificable.

## Cuál es cuál (resumen)

| Contenido | Ubicación |
|---|---|
| Versión EN VIVO al 2026-11-07 (este respaldo) | rama `respaldo-publicado-2026-11-07`, ZIP en `publicado/` |
| Fuente vieja (2026-10-09) | rama `main` — **es la rama de producción de Netlify: subir ahí reemplaza el sitio en vivo con código viejo, no hacerlo** |
| Versión publicada anterior | rama `version-publicada-2026-10-26` |
| Borrador v2 | rama `AgencIA-v2.00` |

**Esta rama no publica nada**: Netlify despliega únicamente `main` y los deploys de rama
están desactivados (verificado el 2026-11-07 en la configuración del sitio "agenciamx").

## Notas

- El sitio sirve las páginas HTML junto con sus `.md` (`index.md`, `acerca.md`, `contacto.md`,
  `privacidad.md`, `terminos.md`, `404.md`); ambos formatos están en el ZIP.
- `/agentes-ia-xalapa/` aparece en el sitemap pero **responde 404 en vivo** (sitemap
  desactualizado); no hay archivo que respaldar de esa ruta.
- El sitio usa una **función edge compilada de Netlify cuya fuente no está en el repo**
  (según el manual de contexto de Hark): componente externo que vive desplegado en Netlify.
- No hay claves ni datos privados: es una web pública de marketing.

## Cómo verificar

```
curl -s https://agenciamx.app/index.html | shasum -a 256
# debe dar: c1a9299e413bf5e91120873024db4401e5382302b630280274188c76d3ce3405
```

Respaldo pedido por Gastón el 7-nov-2026. No cambia nada del sitio publicado.
