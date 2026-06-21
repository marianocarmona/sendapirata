# Proposal: Structured Data SEO

## Intent

Add a conservative JSON-LD foundation so search engines can understand the site, the etapa collection, and each etapa as a tourist route / itinerary using only content already present in the Astro codebase.

## Scope

### In Scope
- Render safe `application/ld+json` blocks through a reusable Astro component.
- Add centralized schema builders for site identity, breadcrumbs, etapa lists, and etapa detail pages.
- Represent each etapa primarily as a `TouristTrip` itinerary with page URL, name, description, image, origin/destination labels, and visible route facts from `EtapaRecord`.
- Add homepage/listing structured data with `WebSite`, `CollectionPage`, `ItemList`, and `BreadcrumbList` where appropriate.

### Out of Scope
- Raw GeoJSON geometry, `GeoShape`, or large route-coordinate modeling.
- FAQ, Review, Event, Product, Offer, ratings, organization claims, or facts not visible in existing content.
- Rich modeling of audio, PDFs, GPX downloads, or every treasure POI.

## Capabilities

### New Capabilities
- `structured-data-seo`: JSON-LD structured data for site and etapa route pages.

### Modified Capabilities
- None.

## Approach

Use Approach 2 from exploration: build typed schema helpers from `src/data/site.ts` and `src/data/etapas.ts`, render them explicitly from pages, and keep `Layout.astro` generic. Treat `TouristTrip` as the preferred etapa entity because schema.org defines it as an itinerary of places of interest; fall back to page-level `WebPage` only if validation shows an accuracy issue.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/` | New | JSON-LD rendering component. |
| `src/data/` | New/Modified | Schema builders and shared URL/image helpers using existing data. |
| `src/pages/index.astro` | Modified | Homepage site and etapa list JSON-LD. |
| `src/pages/etapas/index.astro` | Modified | Collection, list, and breadcrumb JSON-LD. |
| `src/pages/etapas/etapa-01.astro`–`etapa-05.astro` | Modified | Detail-page `TouristTrip` and breadcrumb JSON-LD. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Overclaiming unsupported facts | Medium | Only emit fields backed by visible existing data. |
| Invalid URL/image construction | Medium | Centralize canonical URL helpers. |
| Unsafe JSON serialization | Low | Use a component that serializes objects, not string interpolation. |

## Rollback Plan

Remove the JSON-LD component, schema helpers, and page insertions; public HTML content remains unchanged.

## Dependencies

- Existing `EtapaRecord` and site constants.
- Schema.org `TouristTrip`, `WebSite`, `CollectionPage`, `ItemList`, and `BreadcrumbList` vocabulary.

## Success Criteria

- [ ] Build succeeds with strict TypeScript/Astro checks.
- [ ] Generated JSON-LD validates syntactically and uses only existing visible data.
- [ ] No GeoJSON, download, audio, review, offer, event, or FAQ schema is added in this slice.
