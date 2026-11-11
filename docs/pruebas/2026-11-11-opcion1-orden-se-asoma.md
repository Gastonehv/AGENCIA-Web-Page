# Opción 1: El orden se asoma - QA de preview

11 nov 2026, 10:41 CST. Solo preview, no publicación.

Preview: https://6af49a3f5a177525829664e4--agenciamx-fixnav-20261111.netlify.app/
Implementación: https://github.com/Gastonehv/AGENCIA-Web-Page/commit/09a3e763d24194def9065460d2cbaef73bc373d4

- 33/33 comprobaciones HTTP: redirects, rutas, HTML/Markdown, sitemap/llms.
- Inventario de despliegue: 100 archivos, hashes coinciden con candidato.
- Capturas inspeccionadas: 360x740, 390x844, 412x915, 1440x900. Sin overflow horizontal en lecturas DOM.
- Ventana en parte inferior, contenido real único, sin rieles ni indicador viejo.
- Avance y regreso por teclado en móvil. Párrafo completo al salir del pin, sin cruzar sobre tarjetas.
- Ver precios: clic real desde header a #paquetes, sección visible bajo header.
- Tel/WhatsApp preservan +522229980111. No se inició llamada ni envío.
- Consola: filtro error sin resultados.
- Producción verificada 10:40:48: deploy 6af4847cbc11b8254e1b57e7, locked true. HTML idéntico byte a byte al respaldo /tmp/index_combined.html.

Límites: emulación de navegador, no teléfono físico. No se probó preferencia reduced-motion desde el sistema. El recorrido siguiente conserva la animación previa y su fase de fondo sin texto. Pendiente revisión independiente y aprobación del usuario; nada autorizado para producción.
