# Tasks: Structured Data SEO

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~360-540 |
| 800-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: helpers + JsonLd; PR 2: homepage + /etapas; PR 3: five etapa pages + verification |
| Delivery strategy | ask-always |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Add reusable JSON-LD primitives | PR 1 | `src/components/JsonLd.astro`, `src/data/seo-urls.ts`, `src/data/structured-data.ts`; keep fields strictly evidence-backed. |
| 2 | Wire page-local schemas into shared layout/pages | PR 2 | `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/etapas/index.astro`; Layout stays schema-free and pages opt in explicitly. |
| 3 | Add etapa detail schemas and evidence checks | PR 3 | `src/pages/etapas/etapa-01.astro`–`etapa-05.astro`; verify TouristTrip fallback stays conservative and no unsupported claims appear. |

## Phase 1: Foundation

- [x] 1.1 Create `src/components/JsonLd.astro` to serialize one schema node or an array as `application/ld+json`, escaping `<` safely.
- [x] 1.2 Add `src/data/seo-urls.ts` and route canonical/image helpers that match `Layout.astro` URL rules.
- [x] 1.3 Add `src/data/structured-data.ts` builders for `WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`, and etapa `TouristTrip`/`WebPage` fallback from existing `site.ts` and `etapas.ts`.

## Phase 2: Page Wiring

- [x] 2.1 Update `src/layouts/Layout.astro` to keep shared SEO metadata only and expose a generic head slot for page-local JSON-LD.
- [x] 2.2 Update `src/pages/index.astro` to emit homepage `WebSite` + etapa `ItemList`, and omit `BreadcrumbList`.
- [x] 2.3 Update `src/pages/etapas/index.astro` to emit `CollectionPage` + `ItemList` + breadcrumb schema only when the visible hierarchy exists.

## Phase 3: Etapa Detail Pages

- [x] 3.1 Update `src/pages/etapas/etapa-01.astro`–`etapa-05.astro` to render one conservative route schema each, using only existing title, description, URL, image, origin, and destination facts.
- [x] 3.2 Keep downloads, reviews, POIs, GeoJSON geometry, offers, and other unsupported fields out of the emitted schema.

## Phase 4: Verification

- [x] 4.1 Build the site and parse `dist/**/index.html` to confirm JSON-LD is present and valid on `/`, `/etapas`, and all five etapa pages.
- [x] 4.2 Search built output for banned schema claims (`GeoShape`, `Review`, `Offer`, `Event`, `FAQPage`, audio/download schema, route coordinate arrays).
- [x] 4.3 If validator output rejects `TouristTrip`, narrow only the etapa entity to `WebPage` and keep the same conservative field set.
