# Apply Progress: project-quality-cleanup

## Summary

- Mode: Standard
- Delivery: size:exception approved for a single apply block
- Status: Complete — all planned cleanup tasks implemented

## Completed Tasks

- [x] 1.1 Create `src/data/etapas.ts` with typed etapa records; update `src/pages/index.astro`, `src/pages/etapas/index.astro`, and `src/components/EtapaNav.astro` to read from it.
- [x] 1.2 Inventory `public/sendapirata_html/`, duplicate downloads/images, and `public/sendapirata.sketch`; mark only confirmed-unused paths for removal.
- [x] 1.3 Audit `package.json`, `package-lock.json`, and `astro.config.mjs` for `@vite-pwa/astro`; remove it only if no active usage exists.
- [x] 2.1 Extract `src/scripts/map/*` for loading, bounds, route highlight, controls, and geolocation; keep `src/components/Mapa.astro` props stable.
- [x] 2.2 Replace `Mapa.astro` expand-button `innerHTML` swaps with pre-rendered SVG states and keep popup content on `setText`.
- [x] 2.3 Refactor repeated etapa page blocks in `src/pages/etapas/etapa-01.astro` to `etapa-05.astro` into shared helpers/components only where duplication is factual.
- [x] 2.4 Update `src/layouts/Layout.astro` with product-specific OpenGraph/Twitter metadata and a real social image.
- [x] 3.1 Add build-time checks so missing fields in `src/data/etapas.ts` fail visibly instead of changing page meaning.
- [x] 3.2 Add `loading="lazy"` and `decoding="async"` to non-hero images in `src/pages/index.astro` and etapa pages.
- [x] 3.3 Verify keyboard focus, visible controls, and fallback copy for `PUBLIC_MAPBOX_TOKEN` missing or Mapbox unavailable.
- [x] 3.4 Delete only verified-unused legacy public assets, then run `npm run astro -- check` and `npm run build`.

## Notes

- `public/sendapirata.sketch` was removed as the only confirmed-unused legacy public artifact.
- `public/sendapirata_html/` remains in place pending explicit old-URL retirement or redirect decisions.
- Etapa 04 remains the only stage with two audios, and the `/etapas` listing now points to the verified files `/descargas/04-01.mp3` and `/descargas/04-02.mp3`.
- 2026-06-21: patched the post-refactor map bootstrap so route layers still initialize when the Mapbox style is already ready, fixing etapa GeoJSON routes not appearing over the visible base map.
- 2026-06-21: preloaded route GeoJSON before `map.addSource`, reused that parsed data for bounds, and waited for the style idle/load boundary before registering layers to avoid the Mapbox runtime crash seen from URL-backed GeoJSON sources.
- 2026-06-21: queued etapa fitBounds from the route-specific bounds after layers load, re-attempting on idle when the canvas is still settling so route rendering remains intact while the etapa map stops sticking at the default zoom.
- 2026-06-21: mounted `mapboxgl.NavigationControl` only while the map is expanded so users can zoom after geolocation without cluttering the compact inline map or changing route-fit behavior.
- 2026-06-21: restored homepage audio download metadata for etapas 02, 03, 04, and 05 after the centralized `src/data/etapas.ts` refactor; etapa 04 home cards now expose both verified files `/descargas/04-01.mp3` and `/descargas/04-02.mp3` alongside the existing PDF/GPX links.

## Verification

- `npm run astro -- check`
- `npm run build`
