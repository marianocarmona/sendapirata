# Reglas del proyecto

Estas reglas describen convenciones ya presentes en el código. No son objetivos aspiracionales ni reglas nuevas.

## Estructura

- Mantener la estructura Astro actual:
  - `src/pages/` para rutas públicas.
  - `src/pages/etapas/` para páginas de etapas.
  - `src/components/` para componentes `.astro`.
  - `src/layouts/Layout.astro` como layout base.
  - `src/styles/global.css` para estilos globales y tokens.
  - `public/images/`, `public/descargas/` y `public/geojson/` para assets servidos públicamente.
- Las rutas públicas se definen por archivos Astro en `src/pages`.
- El inicio está en `src/pages/index.astro`.
- El listado de etapas está en `src/pages/etapas/index.astro`.
- Los detalles de etapa están en `src/pages/etapas/etapa-01.astro` a `src/pages/etapas/etapa-05.astro`.

## Naming

- Usar nombres de componentes Astro en PascalCase:
  - `AudioPlayer.astro`
  - `Cabecera.astro`
  - `EtapaCierre.astro`
  - `EtapaNav.astro`
  - `GoogleAnalytics.astro`
  - `Mapa.astro`
  - `Pie.astro`
  - `Sp2Shell.astro`
- Nombrar páginas de etapa con dos dígitos:
  - `etapa-01.astro`
  - `etapa-02.astro`
  - `etapa-03.astro`
  - `etapa-04.astro`
  - `etapa-05.astro`
- Nombrar recursos asociados a etapas con numeración de dos dígitos cuando aplica:
  - `/images/01.webp`
  - `/images/fondo-01.webp`
  - `/descargas/01.pdf`
  - `/descargas/01.gpx`
  - `/descargas/01.mp3`
  - `/geojson/01.geojson`

## Componentes Astro

- Definir props en el frontmatter del componente con `interface Props` o `type Props`.
- Leer props desde `Astro.props`.
- Usar valores por defecto al desestructurar props cuando el componente ya lo hace.
- Mantener scripts de cliente dentro del componente con `<script is:inline>` cuando dependen del DOM local.
- Pasar datos desde Astro a scripts inline con `define:vars` cuando sea necesario.
- Usar atributos `data-*` para conectar markup y scripts del componente.

## Layout y páginas

- Envolver páginas con `<Layout title="..." description="...">`.
- Importar componentes al inicio del frontmatter.
- Las páginas de etapa siguen este patrón:
  - `Layout`
  - `Sp2Shell`
  - `Cabecera`
  - hero visual con imagen `/images/fondo-XX.webp`
  - `EtapaOverview` para mapa con `Mapa`, reproductor(es) con `AudioPlayer`, descargas y bloques de datos de la etapa
  - secciones de contenido
  - `EtapaCierre`
  - `EtapaNav`
  - `Pie`

## Estilos y Tailwind

- Tailwind se carga globalmente desde `src/styles/global.css` con `@import "tailwindcss"`.
- Usar Tailwind v4 CSS-first para tokens mediante `@theme`.
- Mantener los colores de rutas como tokens `--color-route-01` a `--color-route-05`.
- Usar variables CSS de tema `--sp-*` para colores compartidos del sitio.
- Preferir clases utility de Tailwind directamente en el markup.
- Usar valores arbitrarios de Tailwind cuando el código existente ya los usa, por ejemplo:
  - `rounded-[25px]`
  - `text-[32px]`
  - `md:max-w-[1024px]`
  - `font-['thornwood-vf',_sans-serif]`
- Usar `<style>` local en componentes para CSS no cubierto cómodamente por Tailwind, pseudo-elementos, estilos globales puntuales o estados complejos.

## Assets públicos

- Referenciar assets públicos con rutas absolutas desde la raíz:
  - `/images/...`
  - `/descargas/...`
  - `/geojson/...`
- Guardar imágenes de interfaz en `public/images/`.
- Guardar PDFs, GPX y audios descargables en `public/descargas/`.
- Guardar GeoJSON consumidos por mapas en `public/geojson/`.
- Mantener `favicon.svg` en `public/`.

## Mapas y datos

- Usar `Mapa.astro` para mapas Mapbox.
- Cargar Mapbox GL JS desde CDN dentro de `Mapa.astro`.
- Usar `PUBLIC_MAPBOX_TOKEN` para el token de Mapbox.
- Definir rutas de mapa con objetos `{ id, url, color }`.
- Usar ids de ruta con formato `ruta-01`, `ruta-02`, etc.
- Usar GeoJSON públicos con formato `/geojson/XX.geojson`.
- Los colores de rutas deben coincidir con los tokens definidos en `global.css` y con las rutas usadas en `Mapa.astro`.
- Los POIs del GeoJSON pueden usar propiedades `name`, `nombre`, `title` o `titulo` para etiquetas y popups.

## Scripts y entorno

- Usar scripts npm existentes:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm run astro`
- El proyecto usa módulos ES con `"type": "module"`.
- Astro usa configuración estricta de TypeScript desde `astro/tsconfigs/strict`.
- La variable de entorno evidenciada para mapas es `PUBLIC_MAPBOX_TOKEN`.
- Google Analytics se integra mediante `GoogleAnalytics.astro` y Partytown.

## Evidencias observadas

- Estructura Astro: `src/pages`, `src/components`, `src/layouts/Layout.astro`, `src/styles/global.css`.
- Naming de componentes: `src/components/AudioPlayer.astro`, `src/components/Mapa.astro`, `src/components/EtapaNav.astro`.
- Páginas de etapas: `src/pages/etapas/etapa-01.astro` a `src/pages/etapas/etapa-05.astro`.
- Tailwind v4 CSS-first: `src/styles/global.css`, `astro.config.mjs`.
- Assets públicos: `public/images`, `public/descargas`, `public/geojson`.
- Mapbox y entorno: `src/components/Mapa.astro`.
- Scripts npm: `package.json`.
- TypeScript estricto: `tsconfig.json`.
