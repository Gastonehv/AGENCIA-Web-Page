#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Extrae las cadenas de texto que aparecen en la UI (JSX/TSX, HTML, etc.)
de los directorios `src/components` y `src/pages` y las guarda en
`web_copy_raw.txt` en la raíz del proyecto.

Este script es intencionalmente simple: usa expresiones regulares para
capturar texto entre etiquetas HTML/JSX y literals de cadena suficientemente
largos. Si necesitas mayor precisión, deberías pasar a un parser real
(babel/ts‑morph), pero para un “quick‑and‑dirty” audit cumple la misión.
"""

import pathlib
import re
import sys

# ----------------------------------------------------------------------
# Configuración
# ----------------------------------------------------------------------
RAIZ_PROYECTO = pathlib.Path(__file__).resolve().parent
CARPETAS_SRC = [
    RAIZ_PROYECTO / "src" / "components",
    RAIZ_PROYECTO / "src" / "pages",
]
ARCHIVO_SALIDA = RAIZ_PROYECTO / "web_copy_raw.txt"

# Captura texto entre > ... < (evita etiquetas vacías)
PATTERN_TEXTO = re.compile(r">([^<>{}]+?)<", re.DOTALL)

# ----------------------------------------------------------------------
# Funciones auxiliares
# ----------------------------------------------------------------------
def es_archivo_fuente(p: pathlib.Path) -> bool:
    """Acepta .tsx, .ts, .jsx, .js y .html."""
    return p.suffix.lower() in {".tsx", ".ts", ".jsx", ".js", ".html"}

def limpiar(texto: str) -> str:
    """Quita espacios al inicio/final y colapsa espacios internos."""
    return " ".join(texto.strip().split())

def extraer_de_archivo(ruta: pathlib.Path) -> list[str]:
    """Devuelve una lista de cadenas encontradas en un archivo."""
    try:
        contenido = ruta.read_text(encoding="utf-8")
    except Exception as e:
        print(f"[ADVERTENCIA] No se pudo leer {ruta}: {e}", file=sys.stderr)
        return []

    # 1. Texto dentro de etiquetas JSX/HTML
    coincidencias = PATTERN_TEXTO.findall(contenido)

    # 2. Literales de cadena entre comillas dobles (mínimo 3 caracteres)
    literales = re.findall(r'"([^"\n]{3,})"', contenido)
    coincidencias.extend(literales)

    # 3. Limpiar y filtrar vacíos
    return [limpiar(c) for c in coincidencias if limpiar(c)]

# ----------------------------------------------------------------------
# Flujo principal
# ----------------------------------------------------------------------
def main():
    todas_las_cadenas = []

    for carpeta in CARPETAS_SRC:
        if not carpeta.is_dir():
            print(f"[ERROR] Carpeta inexistente: {carpeta}", file=sys.stderr)
            continue

        for archivo in carpeta.rglob("*"):
            if archivo.is_file() and es_archivo_fuente(archivo):
                cadenas = extraer_de_archivo(archivo)
                if cadenas:
                    todas_las_cadenas.append(f"--- {archivo.relative_to(RAIZ_PROYECTO)} ---")
                    todas_las_cadenas.extend(cadenas)

    if not todas_las_cadenas:
        print("[ADVERTENCIA] No se encontró texto copiable.", file=sys.stderr)
        return

    ARCHIVO_SALIDA.write_text("\n".join(todas_las_cadenas), encoding="utf-8")
    print(f"[INFO] Extracción completada -> {ARCHIVO_SALIDA}")

if __name__ == "__main__":
    main()
