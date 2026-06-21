# Informe técnico del proyecto `sendapirata`

`sendapirata` es una web estática construida con Astro para presentar la Senda Pirata del Cabo de Gata-Níjar. El sitio organiza una ruta narrativa de cinco etapas y ofrece contenido turístico, histórico y práctico mediante páginas estáticas, mapas interactivos, audios, PDFs, GPX e imágenes.

## Objetivo del proyecto

El objetivo principal es publicar una experiencia web informativa y navegable sobre la Senda Pirata:

- Presentar la ruta completa y sus cinco etapas.
- Explicar el contexto histórico y paisajístico de cada tramo.
- Ofrecer recursos descargables como PDFs, tracks GPX y audios.
- Mostrar mapas interactivos con los recorridos.
- Facilitar una experiencia visual orientada a turismo cultural y senderismo.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| Astro | Framework principal para generar páginas estáticas. |
| Tailwind CSS | Sistema de estilos utility-first. |
| `@tailwindcss/vite` | Integración de Tailwind con Vite/Astro. |
| `astro-seo` | Gestión de metadatos SEO desde el layout principal. |
| `@astrojs/partytown` | Ejecución de Google Analytics fuera del hilo principal. |
| `@vite-pwa/astro` | Dependencia instalada para PWA, aunque no se observa configuración activa. |
| Mapbox GL JS | Mapas interactivos cargados desde CDN. |
| TypeScript | Configuración base mediante `tsconfig.json`, aunque la mayor parte del código está en componentes `.astro`. |

## Arquitectura actual

La arquitectura es la típica de un sitio Astro estático, organizada alrededor de páginas, componentes reutilizables y assets públicos.

```text
src/
  layouts/
    Layout.astro
  pages/
    index.astro
    index_2.astro
    etapas/
      index.astro
      etapa-01.astro
      etapa-02.astro
      etapa-03.astro
      etapa-04.astro
      etapa-05.astro
  components/
    AudioPlayer.astro
    Cabecera.astro
    EtapaCierre.astro
    EtapaNav.astro
    GoogleAnalytics.astro
    Mapa.astro
    Pie.astro
    Sp2Shell.astro
```

La aplicación no parece usar una capa de dominio o datos centralizada. La información de las etapas está declarada directamente en varias páginas y componentes.

### Componentes principales

| Componente | Responsabilidad |
|---|---|
| `Layout.astro` | Estructura HTML base, estilos globales, SEO y analítica. |
| `Mapa.astro` | Renderizado de mapas Mapbox, rutas GeoJSON, bounds, popups y geolocalización. |
| `AudioPlayer.astro` | Reproductor de audio personalizado para las etapas. |
| `EtapaNav.astro` | Navegación entre etapas. |
| `EtapaCierre.astro` | Bloque final de páginas de etapa. |
| `Cabecera.astro` / `Pie.astro` | Header y footer del sitio. |

## Estructura de carpetas

```text
.
├── astro.config.mjs
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── docs/
│   └── project-analysis.md
├── public/
│   ├── descargas/
│   ├── geojson/
│   ├── images/
│   └── sendapirata_html/
└── src/
    ├── components/
    ├── layouts/
    ├── pages/
    └── styles/
```

### Observaciones sobre `public/`

- `public/images/` contiene imágenes usadas por la interfaz.
- `public/descargas/` contiene PDFs, audios y GPX.
- `public/geojson/` contiene los tracks consumidos por Mapbox.
- `public/sendapirata_html/` parece una versión HTML heredada o exportada del sitio. Al estar dentro de `public`, queda servida públicamente.

## Flujo de datos

El flujo de datos es simple y mayoritariamente estático:

1. Astro genera las rutas desde `src/pages`.
2. Cada página importa `Layout.astro` como envoltorio principal.
3. Las páginas de etapa definen o pasan manualmente información como título, distancia, dificultad, rutas de descarga, audio y GeoJSON.
4. Los componentes reciben esa información vía props o usan rutas predefinidas.
5. `Mapa.astro` carga Mapbox GL JS en el cliente y consume archivos GeoJSON desde `/public/geojson`.
6. Los recursos descargables se enlazan desde `/public/descargas`.
7. La analítica se inyecta desde el layout usando Google Analytics y Partytown.

```text
src/pages/*.astro
  └── Layout.astro
        ├── SEO / metadatos
        ├── estilos globales
        └── analítica

src/pages/etapas/*.astro
  ├── AudioPlayer.astro ──> public/descargas/*.mp3
  ├── Mapa.astro ────────> public/geojson/*.geojson + Mapbox
  └── enlaces ───────────> public/descargas/*.pdf / *.gpx
```

## Dependencias importantes

| Dependencia | Importancia |
|---|---|
| `astro` | Base completa del proyecto. Sin Astro no hay generación de páginas. |
| `tailwindcss` | Define gran parte del sistema visual. |
| `astro-seo` | Centraliza parte de los metadatos del sitio. |
| `@astrojs/partytown` | Optimiza la carga de analítica. |
| Mapbox GL JS | Crítico para la experiencia de mapas. Está cargado desde CDN, no desde npm. |
| `PUBLIC_MAPBOX_TOKEN` | Variable necesaria para inicializar Mapbox correctamente. |

## Posibles problemas

### SEO incompleto o con placeholders

`Layout.astro` contiene valores genéricos que no parecen alineados con el producto real, por ejemplo metadatos de Twitter y Open Graph de ejemplo. Esto puede perjudicar la apariencia del sitio al compartirse en redes y buscadores.

### Google Analytics hardcodeado

El identificador de Google Analytics está definido directamente en el código. Conviene moverlo a una variable de entorno pública o configuración centralizada.

### Token de Mapbox sin validación visible

`Mapa.astro` usa `PUBLIC_MAPBOX_TOKEN`. Si la variable falta, el mapa puede intentar inicializarse con un token vacío y fallar de forma poco clara para el usuario.

### Datos duplicados de etapas

La información de etapas parece repetida en varias páginas y componentes. Esto aumenta el riesgo de inconsistencias cuando cambian títulos, distancias, rutas o recursos.

### `index_2.astro` expuesto como ruta pública

Al estar dentro de `src/pages`, Astro lo publica como una ruta accesible. Si es una prueba o alternativa experimental, debería moverse fuera de `pages` o documentarse su propósito.

### HTML heredado publicado

`public/sendapirata_html/` queda disponible públicamente. Si es material antiguo o duplicado, puede generar confusión, problemas SEO o mantenimiento doble.

### README genérico

El README actual parece conservar contenido de plantilla y no documenta el propósito, instalación, variables ni operación del proyecto.

### Ausencia de tests detectables

No se observan tests automatizados. En un sitio estático esto puede ser aceptable inicialmente, pero al crecer la lógica del mapa y los datos de etapas empieza a ser un riesgo.

## Deuda técnica

- Falta una fuente única de datos para las etapas.
- `Mapa.astro` concentra demasiadas responsabilidades y lógica de cliente.
- Hay configuración o dependencias instaladas que no parecen estar completamente usadas, como `@vite-pwa/astro`.
- SEO y analítica no están suficientemente parametrizados.
- Hay assets heredados o duplicados dentro de `public/`.
- El README no refleja el proyecto real.
- No hay validación clara de variables de entorno críticas.
- No hay verificación automatizada visible para build, datos o rutas de assets.

## Mejoras recomendadas

### 1. Centralizar datos de etapas

Crear una fuente única, por ejemplo:

```text
src/data/etapas.ts
```

o usar Content Collections de Astro si se quiere tratar cada etapa como contenido estructurado.

Esto permitiría reutilizar la misma información en landing, listado, navegación y detalle sin duplicarla.

### 2. Refactorizar `Mapa.astro`

Separar la lógica en módulos más pequeños:

- configuración de Mapbox;
- carga de rutas GeoJSON;
- cálculo de bounds;
- geolocalización;
- popups y marcadores;
- modo expandido.

Esto facilitaría mantenimiento y pruebas.

### 3. Corregir SEO del sitio

- Sustituir placeholders por datos reales de la Senda Pirata.
- Definir imagen Open Graph propia.
- Revisar títulos y descripciones por página.
- Evitar metadatos genéricos de plantilla.

### 4. Parametrizar analítica y variables públicas

- Mover el ID de Google Analytics a variable de entorno.
- Validar `PUBLIC_MAPBOX_TOKEN`.
- Documentar variables requeridas en README.

### 5. Decidir el destino de `index_2.astro`

Si es una prueba, moverla fuera de `src/pages`. Si es una landing alternativa real, documentarla y darle un nombre semántico.

### 6. Revisar `public/sendapirata_html/`

Eliminarlo si no es necesario. Si debe conservarse, documentar por qué existe y cómo se mantiene.

### 7. Actualizar README

Incluir:

- descripción del proyecto;
- comandos de instalación y desarrollo;
- variables de entorno;
- estructura de carpetas;
- proceso de build/despliegue;
- notas sobre assets y contenido de etapas.

### 8. Añadir verificación mínima

Como mínimo:

- ejecutar build en CI;
- añadir `astro check` si se configura soporte de tipos;
- validar que los archivos referenciados en datos de etapas existen;
- comprobar que los GeoJSON son válidos.

## Conclusión

El proyecto tiene una base adecuada para un sitio estático turístico-cultural: Astro, Tailwind, assets públicos y mapas interactivos. La prioridad técnica debería estar en reducir duplicación, corregir SEO, documentar el proyecto y separar la lógica compleja del mapa. No parece necesaria una arquitectura pesada, pero sí una mínima capa de datos y configuración para que el proyecto sea sostenible.
