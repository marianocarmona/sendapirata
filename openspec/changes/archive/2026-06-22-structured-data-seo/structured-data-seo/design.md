# Design: Structured Data SEO

## Technical Approach

Add a small JSON-LD rendering component and centralized schema builders. Pages explicitly choose which schemas to render through a generic `Layout.astro` head slot; `Layout.astro` remains responsible for shared HTML metadata only. URL generation will be shared with the current canonical logic so JSON-LD URLs and images use the same base and path rules as existing SEO tags.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Put JSON-LD in `Layout.astro` | Centralized, but hides page-specific schema choices and risks unsupported schema on pages | Reject |
| Render schemas from each page using helpers | Slight page boilerplate, but explicit and reviewable | Choose |
| Model raw GeoJSON, downloads, audio, POIs | Richer, but large and easy to overclaim | Reject for this slice |
| Use `TouristTrip` for etapa pages with page-level fallback | Best matches route itinerary intent, but validation may force simplification | Choose with fallback to conservative `WebPage` |

## Data Flow

```text
site.ts + etapas.ts
      │
      ├── seo-url helpers ──→ Layout canonical / social image
      │
      └── structured-data builders ──→ JsonLd.astro ──→ Layout head slot
```

`Cabecera.astro` shows visible breadcrumbs on `/etapas` and etapa detail pages, but the homepage disables breadcrumbs. Therefore homepage JSON-LD must omit `BreadcrumbList`; listing and detail pages may include it.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/JsonLd.astro` | Create | Serializes one schema object or an array of schema objects as `application/ld+json`; escapes `<` to avoid script parsing issues. |
| `src/data/seo-urls.ts` | Create | Exposes `getSiteBase(Astro.site, Astro.url)`, `toAbsoluteUrl(path, base)`, and `toCanonicalUrl(pathname, base)` so schema URLs match `Layout.astro`. |
| `src/data/structured-data.ts` | Create | Builds `WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`, and etapa `TouristTrip`/fallback `WebPage` from `SITE_*` and `EtapaRecord`. |
| `src/layouts/Layout.astro` | Modify | Replace inline canonical/social URL construction with `seo-urls` helpers and expose a generic named head slot; no schema generation added. |
| `src/pages/index.astro` | Modify | Render `WebSite` and homepage etapa `ItemList`; omit breadcrumbs. |
| `src/pages/etapas/index.astro` | Modify | Render `CollectionPage`, `ItemList`, and visible breadcrumb schema. |
| `src/pages/etapas/etapa-01.astro`–`etapa-05.astro` | Modify | Render one itinerary schema plus visible breadcrumb schema per etapa. |

## Interfaces / Contracts

```ts
type SchemaNode = Record<string, unknown>;

type AbsoluteUrlContext = {
  site: URL;
};

function buildEtapaSchemas(etapa: EtapaRecord, context: AbsoluteUrlContext): SchemaNode[];
```

Etapa schema values are limited to existing visible data: `detailTitle`, `layoutDescription` or route summary, canonical `path`, absolute `heroImage`, `Inicio`, `Final`, and optionally existing distance/duration/difficulty strings as descriptive facts. Do not parse Spanish strings into numeric distance or ISO duration in this slice.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Build | TypeScript/Astro correctness and asset assertions | Run `npm run build`. |
| Output inspection | JSON-LD exists on homepage, `/etapas`, and five detail pages | Inspect built HTML in `dist/**/index.html`; parse each `application/ld+json` block with `JSON.parse`. |
| Evidence guard | No unsupported schema types or large geometry | Search built output for `GeoShape`, coordinates arrays, `Review`, `Offer`, `Event`, `FAQPage`, audio/download schema. |

## Migration / Rollout

No migration required. Roll out as static HTML metadata only. Rollback removes `JsonLd.astro`, schema builders, URL helper usage, and page insertions; visible content remains unchanged.

## Open Questions

- [ ] If validator output rejects `TouristTrip`, simplify etapa entity to `WebPage` while preserving the same conservative fields.
