# Reparar referencias a la página inexistente de Servicios

## Permiso y alcance
Gastón, WhatsApp 11 nov 2026 09:00:27, respondió "Hazlo" a la propuesta 08:51:53: reparar nueve enlaces Servicios, renombrarlos Paquetes y precios con destino /#paquetes; quitar la URL inexistente del sitemap y guía IA. Publicar después de revisar preview móvil y computadora. Sin otra landing, rediseño, home, precios, condiciones ni redirects.

## Plan previo a cambios
Siete archivos web: atender/index.html, crear/index.html, atraer/index.html, administrar/index.html (header y footer cada uno); acerca/index.html (header); sitemap.xml (una URL); llms.txt (una entrada). Base producción 6af47ca026814e2bb8881d84, 100 archivos. Conservar 93 archivos exactos y config markdown; rollback intacto.

1. Verificar base actual y guardar este plan en GitHub antes de editar.
2. Editar únicamente las nueve parejas href/rótulo y retirar las dos referencias; comparar contra mapa base.
3. Guardar fuente exacta en GitHub y crear draft separado por digest.
4. QA funcional, nueve clics reales en móvil/desktop, píxeles de header y aterrizaje, además de 760px. Críticos visual y comercial sobre misma versión final. No cambios tras dictámenes sin nueva revisión.
5. Publicar candidato byte-idéntico; verificar inventario y live. Registrar evidencia, rollback y deuda main separada para continuidad Hark.

Estado inicial al guardar plan: sin cambios web ni publicación. Cierre abajo.

## Cierre 11 nov 2026 09:08, publicado
- Plan previo: commit 68abd616d56818671a3a6d7cf14d827c0fd89606.
- Fuente exacta guardada antes de publicar: commit 2ebab39ba863edecaa4f249580cb70084462abaa.
- Preview inmutable revisada: https://6af4835ba87aaa985b85d1ff--agenciamx-fixnav-20261111.netlify.app , deploy 6af4835ba87aaa985b85d1ff. Dos críticos visual/comercial y main aprobaron la misma versión final; no ediciones posteriores.
- Producción https://agenciamx.app/ deploy 6af4847cbc11b8254e1b57e7, locked=true. Inventario 100 archivos idéntico al candidato, 7 cambiados y otros 93 preservados (home, precios, config/markdown y redirects incluidos).
- Solo se reemplazaron nueve enlaces por Paquetes y precios -> /#paquetes y retiraron dos referencias a /agentes-ia-xalapa/ en sitemap y llms. No nueva landing ni rediseño. La ruta sigue siendo 404/noindex, no un redirect genérico.
- QA preview: 33/33 PASS en segunda corrida completa. Dos 502 iniciales en redirects fueron transitorios y no persistieron. Sitemap: 9 URLs restantes comprobadas una por una con200 y sin noindex. Markdown200/404,13reglas,prettyURLs,páginas y archivos directos comprobados.
- QA producción: 33/33 PASS; siete cuerpos servidos SHA1 exactos al candidato y home preservada exacta. 18 clics reales (9 enlaces en390px y1440px) llegaron a /#paquetes, título inicial completo. Sección móvil y124px (una lectura temprana y109 durante estabilización), desktop90px; el panel tiene margen interno y no tapa su título. Capturas finales live móvil y desktop inspeccionadas, sin regresión material.
- Salto de línea en Quiénes somos móvil aceptado por revisión visual; no colisión. Footer conserva enlace Precios además de Paquetes y precios, duplicación menor aceptada sin ampliar alcance.
- Rollback inmediato: deploy anterior6af47ca026814e2bb8881d84 intacto; también se conservan6af474578532c2c410697c3d y original6adf8fa5d4ddecebd8a2c77d. No eliminación ni build settings cambiados.
- Deuda separada para continuidad: main conserva árbol Vite antiguo; no alineada por este arreglo. No nuevos escaneos Ora ni promesa de ranking/indexación. Las cuatro solicitudes Search Console de otro encargo tienen seguimiento aparte.
