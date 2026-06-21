# Senda Pirata

Astro site for the Senda Pirata route in Cabo de Gata-Níjar. The project publishes five etapa pages with maps, audio, downloads, and static editorial content.

## Quick start

```sh
npm install
npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build the production site |
| `npm run astro -- check` | Run Astro type/content checks |

## Required environment

Create a `.env` file with:

```sh
PUBLIC_MAPBOX_TOKEN=your-public-mapbox-token
```

Use a public browser token and restrict it to the production domains in Mapbox. If the token is missing, etapa pages keep their static content and show a non-blocking map fallback message.

## Content structure

- `src/data/etapas.ts` — canonical etapa metadata, downloads, map routes, and repeated structured content.
- `src/pages/index.astro` — landing page.
- `src/pages/etapas/index.astro` — etapa listing.
- `src/pages/etapas/etapa-01.astro` to `etapa-05.astro` — etapa narratives plus shared hero/overview components.
- `src/scripts/map/` — client-side Mapbox loader, bounds, route, control, and geolocation modules.

## Asset audit notes

- `public/sendapirata.sketch` was removed because it was an unreferenced source artifact.
- `public/sendapirata_html/` is intentionally retained for now. Internal code does not reference it, but old public URLs were not verified and several files inside it differ from the current `/public/descargas` assets.
- Legacy GPX and some MP3 files inside `public/sendapirata_html/` currently match files under `public/descargas`, but they remain until the legacy HTML path is either redirected or explicitly retired.

## Verification

Run these before shipping:

```sh
npm run astro -- check
npm run build
```
