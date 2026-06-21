# Apply Progress: structured-data-seo

## Implementation Progress

**Change**: structured-data-seo
**Mode**: Standard

### Completed Tasks
- [x] 1.1 Create `src/components/JsonLd.astro` to serialize one schema node or an array as `application/ld+json`, escaping `<` safely.
- [x] 1.2 Add `src/data/seo-urls.ts` and route canonical/image helpers that match `Layout.astro` URL rules.
- [x] 1.3 Add `src/data/structured-data.ts` builders for `WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`, and etapa `TouristTrip`/`WebPage` fallback from existing `site.ts` and `etapas.ts`.
- [x] 2.1 Update `src/layouts/Layout.astro` to keep shared SEO metadata only and expose a generic head slot for page-local JSON-LD.
- [x] 2.2 Update `src/pages/index.astro` to emit homepage `WebSite` + etapa `ItemList`, and omit `BreadcrumbList`.
- [x] 2.3 Update `src/pages/etapas/index.astro` to emit `CollectionPage` + `ItemList` + breadcrumb schema only when the visible hierarchy exists.
- [x] 3.1 Update `src/pages/etapas/etapa-01.astro`–`etapa-05.astro` to render one conservative route schema each, using only existing title, description, URL, image, origin, and destination facts.
- [x] 3.2 Keep downloads, reviews, POIs, GeoJSON geometry, offers, and other unsupported fields out of the emitted schema.
- [x] 4.1 Build the site and parse `dist/**/index.html` to confirm JSON-LD is present and valid on `/`, `/etapas`, and all five etapa pages.
- [x] 4.2 Search built output for banned schema claims (`GeoShape`, `Review`, `Offer`, `Event`, `FAQPage`, audio/download schema, route coordinate arrays).
- [x] 4.3 Assess `TouristTrip`; keep it because schema.org documents it as valid and local visible route evidence supports the itinerary model.

### Files Changed
| File | Action | What Was Done |
|------|--------|---------------|
| `src/components/JsonLd.astro` | Created | Added safe JSON-LD serialization for one schema object or an array, escaping `<` to `\u003c`. |
| `src/data/seo-urls.ts` | Created | Centralized site base, absolute URL, and canonical URL helpers aligned with current layout behavior. |
| `src/data/structured-data.ts` | Created | Added reusable builders for `WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`, and etapa route schema generation. |
| `src/layouts/Layout.astro` | Modified | Switched shared SEO URLs to helper functions and exposed a named head slot for page-local JSON-LD. |
| `src/pages/index.astro` | Modified | Rendered homepage `WebSite` and etapa `ItemList` JSON-LD through the new head slot. |
| `src/pages/etapas/index.astro` | Modified | Rendered listing `CollectionPage`, `ItemList`, and breadcrumb JSON-LD using the current page pathname for canonical parity. |
| `src/pages/etapas/etapa-01.astro` | Modified | Rendered page-local `TouristTrip` plus breadcrumb JSON-LD from existing etapa fields only. |
| `src/pages/etapas/etapa-02.astro` | Modified | Rendered page-local `TouristTrip` plus breadcrumb JSON-LD from existing etapa fields only. |
| `src/pages/etapas/etapa-03.astro` | Modified | Rendered page-local `TouristTrip` plus breadcrumb JSON-LD from existing etapa fields only. |
| `src/pages/etapas/etapa-04.astro` | Modified | Rendered page-local `TouristTrip` plus breadcrumb JSON-LD from existing etapa fields only. |
| `src/pages/etapas/etapa-05.astro` | Modified | Rendered page-local `TouristTrip` plus breadcrumb JSON-LD from existing etapa fields only. |
| `openspec/changes/structured-data-seo/tasks.md` | Modified | Aligned the chain strategy header to `stacked-to-main` and marked Phase 2 page wiring tasks as complete. |

### Verification Results
- `npm run build` — passed
- `node -e '…JSON-LD inspection…'` — passed (`dist/index.html`: `WebSite`, `ItemList`; `dist/etapas/index.html`: `CollectionPage`, `ItemList`, `BreadcrumbList`; no banned schema tokens found)
- `npm run build` — passed after wiring all five etapa detail pages
- `node -e '…etapa JSON-LD inspection…'` — passed (`dist/etapas/etapa-01`–`etapa-05`: each page emits `TouristTrip` + `BreadcrumbList` with `name`, `description`, `url`, `image`, and `itinerary`; banned tokens not found)
- `npm run build` — passed during fresh-context verification audit
- `node --input-type=module - <<'NODE' …JSON-LD parse/type inspection… NODE` — passed for `/`, `/etapas/`, and `/etapas/etapa-01/` through `/etapas/etapa-05/`
- `node --input-type=module - <<'NODE' …banned JSON-LD token search… NODE` — passed; no banned tokens inside JSON-LD payloads
- `https://schema.org/TouristTrip` evidence check — passed; `TouristTrip` is a documented schema.org type and `itinerary` accepts `ItemList` or `Place`

### Deviations from Design
None — implementation matches design.

### Issues Found
- `openspec/config.yaml` is still absent, so apply mode relied on the orchestrator-provided testing context and direct project inspection.
- Full HTML contains the literal word `Event` in Partytown runtime code, but JSON-LD payloads do not contain `Event`; banned-claim checks should stay scoped to structured data.

### Remaining Tasks
- None.

### Workload / PR Boundary
- Mode: stacked PR slice
- Current work unit: Unit 3 — Add etapa detail schemas and slice verification
- Boundary: Starts with the five etapa detail pages and ends with page-level JSON-LD output checks for those pages only, without fallback simplification or broad final verification changes.
- Estimated review budget impact: Small-to-medium slice focused on five page files plus task/progress tracking updates.

### Status
11/11 tasks complete. Fresh-context verification passed; ready for archive readiness review.
