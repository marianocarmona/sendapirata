# Tasks: Project Quality Cleanup

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 650-900 |
| 800-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: data/assets/deps → PR 2: map/perf → PR 3: SEO/a11y/security |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Centralize etapa data and verify legacy assets/deps | PR 1 | Base on main; inventory first, delete only confirmed-unused files. |
| 2 | Refactor `Mapa.astro` into focused client modules | PR 2 | Base on PR 1; preserve component API and fallback behavior. |
| 3 | Harden SEO, images, accessibility, and security | PR 3 | Base on PR 2; finish layout/page polish and verification. |

## Phase 1: Foundation

- [x] 1.1 Create `src/data/etapas.ts` with typed etapa records; update `src/pages/index.astro`, `src/pages/etapas/index.astro`, and `src/components/EtapaNav.astro` to read from it.
- [x] 1.2 Inventory `public/sendapirata_html/`, duplicate downloads/images, and `public/sendapirata.sketch`; mark only confirmed-unused paths for removal.
- [x] 1.3 Audit `package.json`, `package-lock.json`, and `astro.config.mjs` for `@vite-pwa/astro`; remove it only if no active usage exists.

## Phase 2: Core Cleanup

- [x] 2.1 Extract `src/scripts/map/*` for loading, bounds, route highlight, controls, and geolocation; keep `src/components/Mapa.astro` props stable.
- [x] 2.2 Replace `Mapa.astro` expand-button `innerHTML` swaps with pre-rendered SVG states and keep popup content on `setText`.
- [x] 2.3 Refactor repeated etapa page blocks in `src/pages/etapas/etapa-01.astro` to `etapa-05.astro` into shared helpers/components only where duplication is factual.
- [x] 2.4 Update `src/layouts/Layout.astro` with product-specific OpenGraph/Twitter metadata and a real social image.

## Phase 3: Verification and Hardening

- [x] 3.1 Add build-time checks so missing fields in `src/data/etapas.ts` fail visibly instead of changing page meaning.
- [x] 3.2 Add `loading="lazy"` and `decoding="async"` to non-hero images in `src/pages/index.astro` and etapa pages.
- [x] 3.3 Verify keyboard focus, visible controls, and fallback copy for `PUBLIC_MAPBOX_TOKEN` missing or Mapbox unavailable.
- [x] 3.4 Delete only verified-unused legacy public assets, then run `npm run astro -- check` and `npm run build`.
