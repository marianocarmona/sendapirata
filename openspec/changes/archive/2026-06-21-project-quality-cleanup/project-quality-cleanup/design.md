# Design: Project Quality Cleanup

## Technical Approach

Apply a preservation-first cleanup: centralize shared etapa metadata, split `Mapa.astro` client logic into focused modules while keeping the component API stable, and remove only assets/dependencies proven unused. Static route content remains Astro-rendered; Mapbox, audio, and downloads stay progressively enhanced.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Etapa data source | Add `src/data/etapas.ts` with typed stage records reused by list, detail helpers, and navigation. | Astro content collections; keep duplicated literals. | A typed module is the smallest change, preserves static generation, and makes missing required fields visible during build/type checks. |
| Route refactor scope | Extract reusable components/data helpers only where duplication is factual: etapa cards, download links, hero/stat metadata, navigation titles. | Rewrite every detail page into one dynamic template. | Safer for review budget and preserves existing narrative page markup. |
| Legacy public assets | Inventory references first; delete `public/sendapirata_html/`, duplicate downloads/images, and `sendapirata.sketch` only when unreferenced or explicitly approved. | Immediate deletion; keep everything. | Specs require verified deletions; uncertain old URLs/downloads stay until confirmed or redirected. |
| PWA dependency | Remove `@vite-pwa/astro` from `package.json` and lockfile only if no import/config/manifest/service worker usage is found. | Configure PWA now. | New PWA behavior is out of scope; currently `astro.config.mjs` has no PWA integration. |
| Mapbox refactor | Keep `src/components/Mapa.astro` markup/CSS thin; move client utilities to `src/scripts/map/` modules for loader, bounds, routes, controls, geolocation, and safe popups. | Install Mapbox npm package; full framework island. | Preserves CDN/project convention while reducing an 892-line component and enabling targeted review. |
| HTML safety | Replace expand-button `innerHTML` swaps with pre-rendered SVG nodes toggled by state classes/`hidden`; keep popups on `setText`. | Sanitize raw HTML. | Avoiding raw insertion is simpler and satisfies dynamic HTML hardening. |

## Data Flow

```text
src/data/etapas.ts
  ├─ index.astro / etapas/index.astro ──> cards + downloads
  ├─ etapa-XX.astro ────────────────────> hero, stats, audio, map route
  └─ EtapaNav.astro ────────────────────> prev/next labels

Mapa.astro markup ──> map loader ──> route layers + bounds ──> optional geolocation
                 └─ fallback message remains visible if Mapbox/token/load fails
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/data/etapas.ts` | Create | Typed canonical etapa metadata: id, slug, title, route label, distance, duration, difficulty, assets, downloads, geojson, color. |
| `src/components/EtapaCard.astro` | Create | Shared card/download rendering for homepage and etapa list. |
| `src/components/EtapaHero.astro` / `EtapaStats.astro` | Create optional | Small extractions for repeated detail-page hero/stat blocks if they reduce net duplication. |
| `src/components/EtapaNav.astro` | Modify | Read titles/total from shared data instead of local `TITULOS`. |
| `src/pages/index.astro`, `src/pages/etapas/index.astro`, `src/pages/etapas/etapa-*.astro` | Modify | Consume shared data while preserving content, order, downloads, and layout. |
| `src/components/Mapa.astro` | Modify | Keep Astro props/markup/CSS; delegate client logic and add fallback/token state. |
| `src/scripts/map/*.js` | Create | Focused client modules: load Mapbox once, initialize map, fit bounds, route highlighting, geolocation, controls. |
| `src/layouts/Layout.astro` | Modify | Replace OpenGraph/Twitter placeholders with Senda Pirata metadata and configurable image. |
| `package.json`, `package-lock.json` | Modify | Remove `@vite-pwa/astro` only after reference audit. |
| `public/sendapirata_html/`, verified unused assets | Delete/defer | Remove only confirmed unused public files; otherwise document retention. |
| `README.md` or `docs/project-analysis.md` | Modify | Document `PUBLIC_MAPBOX_TOKEN`, domain restriction, asset retention decisions, and verification commands. |

## Interfaces / Contracts

- `Etapa` records MUST expose stable paths (`/etapas/etapa-XX`, `/images/...`, `/descargas/...`, `/geojson/...`) and preserve two-digit ids.
- `Mapa.astro` props remain compatible: `routes`, `fitPadding`, `minHeight`, `interactive`, `showExpand`, `enableRouteHighlight`, fit constraints.
- Missing `PUBLIC_MAPBOX_TOKEN` MUST render a clear non-blocking fallback and skip Mapbox initialization.
- Images touched by cleanup SHOULD add `loading="lazy"` and `decoding="async"`, except above-the-fold hero images which may remain eager/preloaded.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Static/build | Astro output and typed shared data | `npm run astro -- check` and `npm run build`. |
| Asset audit | Referenced images/downloads/geojson exist; deletion candidates unreferenced | Script/manual inventory before removal. |
| Manual flows | Five etapa routes, downloads, audio, map fallback/expand/focus | Keyboard pass and browser smoke test. |

## Migration / Rollout

No data migration required. Roll out in reviewable slices: asset/dependency audit, etapa data extraction, map refactor, then SEO/images/a11y hardening. Revert restores prior static output.

## Open Questions

- [ ] Confirm canonical social image for OpenGraph/Twitter metadata.
- [ ] Confirm whether legacy `sendapirata_html` URLs or duplicate downloads require redirects or retention.
